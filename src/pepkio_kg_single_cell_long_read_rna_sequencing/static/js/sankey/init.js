import { buildSankeyOption } from "./options.js";

let chartInstance = null;
let nodeById = new Map();

function getEcharts() {
  if (!window.echarts) {
    throw new Error("ECharts not loaded");
  }
  return window.echarts;
}

export function initSankey(container, sankey, { onNodeClick } = {}) {
  if (chartInstance) {
    chartInstance.dispose();
    chartInstance = null;
  }

  container.innerHTML = "";
  const chart = getEcharts().init(container);
  nodeById = new Map(sankey.nodes.map((n) => [n.id, n]));

  chart.setOption(buildSankeyOption(sankey));

  chart.on("click", (params) => {
    if (params.dataType !== "node") return;
    const meta = params.data?._meta ?? nodeById.get(params.name);
    if (!meta) return;
    onNodeClick?.({
      nodeId: meta.id,
      name: meta.name,
      layer: meta.layer,
      paperIds: meta.paperIds,
      graphNodeIds: meta.graphNodeIds,
    });
  });

  chartInstance = chart;
  return {
    resize: () => chartInstance?.resize(),
    dispose: () => {
      chartInstance?.dispose();
      chartInstance = null;
    },
  };
}

export function destroySankey() {
  if (chartInstance) {
    chartInstance.dispose();
    chartInstance = null;
  }
}
