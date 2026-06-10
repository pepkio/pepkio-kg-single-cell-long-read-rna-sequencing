function normalize(text) {
  return text
    .replace(/<[^>]+>/g, "")
    .replace(/\*\*/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^#+\s*/, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function labelKey(label) {
  return normalize(label);
}

export function buildRegistry(knowledge) {
  const byId = new Map();
  const byLabel = new Map();

  function add(entity, type) {
    const entry = { type, entity };
    byId.set(entity.id, entry);
    const key = labelKey(entity.label || entity.title || entity.name);
    if (key && !byLabel.has(key)) {
      byLabel.set(key, entry);
    }
    if (entity.name) {
      const nameKey = labelKey(entity.name);
      if (nameKey && !byLabel.has(nameKey)) {
        byLabel.set(nameKey, entry);
      }
    }
  }

  for (const paper of knowledge.papers) {
    add({ ...paper, label: paper.title }, "paper");
  }
  for (const concept of knowledge.concepts) {
    add({ ...concept, label: concept.label }, "concept");
  }
  for (const tool of knowledge.tools) {
    add({ ...tool, label: tool.name }, "tool");
  }

  const papersById = new Map(knowledge.papers.map((p) => [p.id, p]));

  function resolvePapers(paperRefs = []) {
    return paperRefs
      .map((id) => papersById.get(id))
      .filter(Boolean);
  }

  function resolveNode(text) {
    const raw = text.trim();
    if (!raw) return null;

    const norm = normalize(raw);
    if (byLabel.has(norm)) {
      return byLabel.get(norm);
    }

    const paperPrefix = raw.match(/^Paper:\s*(.+)$/i);
    if (paperPrefix) {
      const titleKey = labelKey(paperPrefix[1]);
      if (byLabel.has(titleKey)) {
        return byLabel.get(titleKey);
      }
      for (const [key, entry] of byLabel) {
        if (entry.type === "paper" && (key.startsWith(titleKey) || titleKey.startsWith(key))) {
          return entry;
        }
      }
    }

    const colonIdx = raw.indexOf(":");
    if (colonIdx > 0) {
      const prefix = labelKey(raw.slice(0, colonIdx));
      if (byLabel.has(prefix)) {
        return byLabel.get(prefix);
      }
    }

    for (const [key, entry] of byLabel) {
      if (norm.startsWith(key) || key.startsWith(norm)) {
        return entry;
      }
    }

    return null;
  }

  function parseInlineDescription(text) {
    const colonIdx = text.indexOf(":");
    if (colonIdx <= 0) {
      return { label: text, description: null };
    }
    return {
      label: text.slice(0, colonIdx).trim(),
      description: text.slice(colonIdx + 1).trim() || null,
    };
  }

  function buildDetail(resolved, fallbackText) {
    if (!resolved) {
      const { label, description } = parseInlineDescription(fallbackText);
      return {
        type: "text",
        label,
        description,
        papers: [],
      };
    }

    const { type, entity } = resolved;
    if (type === "paper") {
      return {
        type: "paper",
        id: entity.id,
        label: entity.title,
        description: entity.abstract || null,
        authors: entity.authors,
        year: entity.year,
        doi: entity.doi,
        tags: entity.tags || [],
        papers: [],
      };
    }

    return {
      type,
      id: entity.id,
      label: entity.label || entity.name,
      description: entity.description || null,
      url: entity.url || null,
      toolType: entity.type || null,
      papers: resolvePapers(entity.paperRefs),
    };
  }

  function detailFromId(id) {
    const entry = byId.get(id);
    if (!entry) {
      return buildDetail(null, id);
    }
    return buildDetail(
      entry,
      entry.entity.label || entry.entity.title || entry.entity.name,
    );
  }

  return { byId, byLabel, resolveNode, buildDetail, resolvePapers, detailFromId };
}
