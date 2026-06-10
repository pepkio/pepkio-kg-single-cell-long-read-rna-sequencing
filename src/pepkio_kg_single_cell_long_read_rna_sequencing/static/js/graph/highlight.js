export function clearPathHighlight(cy) {
  cy.elements().removeClass("path-current dimmed highlighted");
  cy.nodes().removeClass("hidden");
  cy.edges().removeClass("hidden");
}

export function focusStep(cy, nodeId) {
  const current = cy.getElementById(nodeId);
  if (!current.length) return;

  const focusIds = new Set([nodeId]);
  current.neighborhood().nodes().forEach((n) => focusIds.add(n.id()));

  cy.nodes().forEach((n) => {
    const inFocus = focusIds.has(n.id());
    n.toggleClass("path-current", n.id() === nodeId);
    n.toggleClass("dimmed", !inFocus);
  });

  cy.edges().forEach((e) => {
    const connected =
      focusIds.has(e.source().id()) && focusIds.has(e.target().id());
    e.toggleClass("dimmed", !connected);
  });

  cy.animate({ center: { eles: current }, zoom: 1.4 }, { duration: 350 });
}
