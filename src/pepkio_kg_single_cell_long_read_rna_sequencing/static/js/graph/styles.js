export function getStylesheet() {
  return [
    {
      selector: "node",
      style: {
        label: "data(displayLabel)",
        "text-valign": "center",
        "text-halign": "center",
        "font-size": "10px",
        "text-wrap": "wrap",
        "text-max-width": "90px",
        "border-width": 2,
        "border-color": "#fff",
        color: "#1e293b",
        width: 36,
        height: 36,
      },
    },
    {
      selector: 'node[kind = "paper"]',
      style: {
        shape: "rectangle",
        "background-color": "#3b82f6",
        color: "#fff",
        width: 44,
        height: 32,
      },
    },
    {
      selector: 'node[kind = "concept"]',
      style: {
        shape: "ellipse",
        "background-color": "#16a34a",
        color: "#fff",
      },
    },
    {
      selector: 'node[kind = "tool"]',
      style: {
        shape: "round-rectangle",
        "background-color": "#ea580c",
        color: "#fff",
        width: 40,
        height: 28,
      },
    },
    {
      selector: 'node[kind = "tool"][toolType = "method"]',
      style: {
        "border-style": "dashed",
        "border-color": "#fff",
      },
    },
    {
      selector: 'node[kind = "external"]',
      style: {
        shape: "diamond",
        "background-color": "#94a3b8",
        color: "#fff",
        width: 32,
        height: 32,
      },
    },
    {
      selector: "node.dimmed",
      style: { opacity: 0.12 },
    },
    {
      selector: "node.highlighted",
      style: {
        "border-width": 4,
        "border-color": "#fbbf24",
        "z-index": 10,
      },
    },
    {
      selector: "node.path-current",
      style: {
        "border-width": 5,
        "border-color": "#f59e0b",
        "z-index": 20,
        width: 52,
        height: 52,
      },
    },
    {
      selector: "node.hidden",
      style: { display: "none" },
    },
    {
      selector: "edge",
      style: {
        width: 1.5,
        "line-color": "#94a3b8",
        "target-arrow-color": "#94a3b8",
        "target-arrow-shape": "triangle",
        "curve-style": "bezier",
        label: "data(label)",
        "font-size": "8px",
        color: "#64748b",
        "text-rotation": "autorotate",
        "text-margin-y": -8,
      },
    },
    {
      selector: "edge.hidden",
      style: { display: "none" },
    },
    {
      selector: "edge.dimmed",
      style: { opacity: 0.08 },
    },
  ];
}
