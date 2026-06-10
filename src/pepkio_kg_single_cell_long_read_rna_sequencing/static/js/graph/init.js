import { buildElements } from "./elements.js";
import { applyFilters } from "./filters.js";
import { clearPathHighlight, focusStep } from "./highlight.js";
import { COLA_LAYOUT, fitGraph, runLayout } from "./layout.js";
import { getStylesheet } from "./styles.js";

let cyInstance = null;

function getCytoscape() {
  if (!window.cytoscape) {
    throw new Error("Cytoscape not loaded");
  }
  return window.cytoscape;
}

function nodeDetail(node, registry) {
  const kind = node.data("kind");
  if (kind === "external") {
    const doi = node.data("doi");
    return {
      type: "external",
      id: node.id(),
      label: node.data("label"),
      description: "External reference cited in the knowledge graph.",
      doi,
      papers: [],
    };
  }
  return registry.detailFromId(node.id());
}

export function initGraph(container, knowledge, registry, { onSelect } = {}) {
  destroyGraph();

  const cytoscape = getCytoscape();
  let layout = COLA_LAYOUT;
  if (window.cytoscapeCola) {
    cytoscape.use(window.cytoscapeCola);
  } else {
    layout = { name: "cose", animate: true, padding: 30 };
  }

  const { nodes, edges } = buildElements(knowledge);
  container.innerHTML = "";

  cyInstance = cytoscape({
    container,
    elements: [...nodes, ...edges],
    style: getStylesheet(),
    layout,
    minZoom: 0.2,
    maxZoom: 3,
    wheelSensitivity: 0.3,
  });

  cyInstance.on("tap", "node", (event) => {
    const node = event.target;
    onSelect?.(nodeDetail(node, registry));
  });

  cyInstance.on("layoutstop", () => fitGraph(cyInstance));

  return {
    fit: () => fitGraph(cyInstance),
    resize: () => {
      cyInstance.resize();
      fitGraph(cyInstance);
    },
    resetLayout: () => runLayout(cyInstance),
    focusStep: (nodeId) => focusStep(cyInstance, nodeId),
    clearPathHighlight: () => clearPathHighlight(cyInstance),
    applyFilters: (state) => applyFilters(cyInstance, state),
    exportPng: () => {
      const png = cyInstance.png({ full: true, scale: 2, bg: "#ffffff" });
      const link = document.createElement("a");
      link.href = png;
      link.download = "knowledge-graph.png";
      link.click();
    },
  };
}

export function destroyGraph() {
  if (cyInstance) {
    cyInstance.destroy();
    cyInstance = null;
  }
}
