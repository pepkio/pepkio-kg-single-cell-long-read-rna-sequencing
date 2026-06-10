function matchesSearch(node, query) {
  if (!query) return true;
  const label = (node.data("label") || "").toLowerCase();
  return label.includes(query.toLowerCase());
}

function matchesType(node, types) {
  return types.has(node.data("kind"));
}

function matchesYear(node, yearMin, yearMax) {
  const kind = node.data("kind");
  if (kind !== "paper") return true;
  const year = node.data("year");
  if (year == null) return true;
  if (yearMin != null && year < yearMin) return false;
  if (yearMax != null && year > yearMax) return false;
  return true;
}

function paperMatchesTag(node, tag) {
  if (!tag) return true;
  if (node.data("kind") !== "paper") return false;
  const tags = node.data("tags") || [];
  return tags.includes(tag);
}

function expandNeighbors(cy, seedIds) {
  const visible = new Set(seedIds);
  let changed = true;
  while (changed) {
    changed = false;
    cy.edges().forEach((edge) => {
      const src = edge.source().id();
      const tgt = edge.target().id();
      if (visible.has(src) && !visible.has(tgt)) {
        visible.add(tgt);
        changed = true;
      }
      if (visible.has(tgt) && !visible.has(src)) {
        visible.add(src);
        changed = true;
      }
    });
  }
  return visible;
}

function matchesPaperIds(node, paperIds) {
  if (!paperIds?.size) return true;
  if (node.data("kind") === "paper") {
    return paperIds.has(node.id());
  }
  return false;
}

export function applyFilters(cy, filterState) {
  const { searchQuery, tag, paperIds } = filterState;
  const hasSearch = Boolean(searchQuery?.trim());
  const hasPaperFilter = Boolean(paperIds?.size);
  const seedIds = [];

  cy.nodes().forEach((node) => {
    const typeOk = matchesType(node, filterState.types);
    const yearOk = matchesYear(node, filterState.yearMin, filterState.yearMax);
    let visible = typeOk && yearOk;

    if (visible && tag) {
      if (node.data("kind") === "paper") {
        visible = paperMatchesTag(node, tag);
      } else {
        visible = false;
      }
    }

    if (visible && hasPaperFilter) {
      visible = matchesPaperIds(node, paperIds);
    }

    if (visible) seedIds.push(node.id());
  });

  const needsNeighborExpand = tag || hasPaperFilter;
  const visibleNodeIds = needsNeighborExpand
    ? expandNeighbors(cy, seedIds)
    : new Set(seedIds);

  if (!needsNeighborExpand) {
    cy.nodes().forEach((node) => {
      const typeOk = matchesType(node, filterState.types);
      const yearOk = matchesYear(node, filterState.yearMin, filterState.yearMax);
      if (typeOk && yearOk) visibleNodeIds.add(node.id());
    });
  }

  cy.nodes().forEach((node) => {
    node.toggleClass("hidden", !visibleNodeIds.has(node.id()));
  });

  cy.edges().forEach((edge) => {
    const show =
      visibleNodeIds.has(edge.source().id()) &&
      visibleNodeIds.has(edge.target().id());
    edge.toggleClass("hidden", !show);
  });

  if (!hasSearch) {
    cy.elements().removeClass("dimmed highlighted");
    return;
  }

  cy.nodes().forEach((node) => {
    if (node.hasClass("hidden")) return;
    const hit = matchesSearch(node, searchQuery.trim());
    node.toggleClass("highlighted", hit);
    node.toggleClass("dimmed", !hit);
  });

  cy.edges().forEach((edge) => {
    if (edge.hasClass("hidden")) return;
    const srcHit = edge.source().hasClass("highlighted");
    const tgtHit = edge.target().hasClass("highlighted");
    edge.toggleClass("dimmed", !srcHit && !tgtHit);
  });
}

export function collectTags(knowledge) {
  const tags = new Set();
  for (const paper of knowledge.papers) {
    for (const tag of paper.tags || []) tags.add(tag);
  }
  return [...tags].sort();
}

export function yearBounds(knowledge) {
  const years = knowledge.papers
    .map((p) => p.year)
    .filter((y) => y != null);
  if (!years.length) return { min: null, max: null };
  return { min: Math.min(...years), max: Math.max(...years) };
}
