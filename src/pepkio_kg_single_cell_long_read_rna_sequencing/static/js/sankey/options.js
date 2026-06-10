const LAYER_COLORS = [
  "#3b82f6",
  "#8b5cf6",
  "#16a34a",
  "#ea580c",
  "#0f766e",
];

export function buildSankeyOption(sankey) {
  const nodes = sankey.nodes.map((node) => ({
    name: node.id,
    label: { show: true, formatter: node.name },
    depth: node.layer,
    value: node.paperIds.length,
    itemStyle: { color: LAYER_COLORS[node.layer] ?? LAYER_COLORS[0] },
    _meta: node,
  }));

  const links = sankey.links.map((link) => ({
    source: link.source,
    target: link.target,
    value: link.value,
  }));

  return {
    tooltip: {
      trigger: "item",
      formatter(params) {
        if (params.dataType === "edge") {
          return `${params.data.source} → ${params.data.target}<br/>${params.data.value} paper path(s)`;
        }
        const meta = params.data?._meta;
        if (!meta) return params.name;
        const count = meta.paperIds.length;
        return `<strong>${meta.name}</strong><br/>${sankey.layers[meta.layer]}<br/>${count} paper${count === 1 ? "" : "s"}`;
      },
    },
    series: [
      {
        type: "sankey",
        orient: "horizontal",
        nodeAlign: "justify",
        emphasis: { focus: "adjacency" },
        lineStyle: { color: "gradient", curveness: 0.5 },
        data: nodes,
        links,
        label: {
          formatter(params) {
            const meta = params.data?._meta;
            return meta?.name ?? params.name;
          },
        },
        levels: sankey.layers.map((name, i) => ({
          depth: i,
          itemStyle: { color: LAYER_COLORS[i] },
          label: { fontSize: 11 },
        })),
      },
    ],
  };
}
