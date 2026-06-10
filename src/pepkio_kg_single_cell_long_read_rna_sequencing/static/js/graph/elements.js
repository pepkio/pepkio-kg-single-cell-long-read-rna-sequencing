const MAX_LABEL = 42;

export function truncateLabel(label) {
  if (!label || label.length <= MAX_LABEL) return label;
  return `${label.slice(0, MAX_LABEL - 1)}…`;
}

export function externalLabel(target) {
  if (target.startsWith("title:")) return target.slice(6);
  if (/^10\.\d/.test(target)) return `DOI: ${target}`;
  return target;
}

export function buildElements(knowledge) {
  const knownIds = new Set();
  const nodeIds = new Set();
  const nodes = [];

  function addNode(data) {
    if (nodeIds.has(data.id)) return;
    nodeIds.add(data.id);
    nodes.push({
      data: {
        ...data,
        displayLabel: truncateLabel(data.label),
      },
    });
  }

  for (const paper of knowledge.papers) {
    knownIds.add(paper.id);
    addNode({
      id: paper.id,
      label: paper.title,
      kind: "paper",
      year: paper.year ?? null,
      tags: paper.tags || [],
    });
  }

  for (const concept of knowledge.concepts) {
    knownIds.add(concept.id);
    addNode({
      id: concept.id,
      label: concept.label,
      kind: "concept",
      tags: [],
    });
  }

  for (const tool of knowledge.tools) {
    knownIds.add(tool.id);
    addNode({
      id: tool.id,
      label: tool.name,
      kind: "tool",
      toolType: tool.type || null,
      tags: [],
    });
  }

  const edges = [];
  for (const rel of knowledge.relationships) {
    const { source, target, type } = rel;

    if (!knownIds.has(source) && !nodeIds.has(source)) continue;

    if (!knownIds.has(target) && !nodeIds.has(target)) {
      const label = externalLabel(target);
      const doi = /^10\.\d/.test(target) ? target : null;
      addNode({
        id: target,
        label,
        kind: "external",
        doi,
        tags: [],
      });
      knownIds.add(target);
    }

    if (!nodeIds.has(source) || !nodeIds.has(target)) continue;

    edges.push({
      data: {
        id: `${source}__${type}__${target}`,
        source,
        target,
        relType: type,
        label: type.replace(/_/g, " "),
      },
    });
  }

  return { nodes, edges };
}
