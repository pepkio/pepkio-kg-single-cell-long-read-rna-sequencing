import { loadKnowledge } from "./data/load.js";
import { buildRegistry } from "./data/registry.js";
import { initGraph, destroyGraph } from "./graph/init.js";
import { createPathController } from "./learning-path/controller.js";
import { createAppState } from "./shell/alpine-app.js";

let registry = null;
let knowledgeData = null;
let mindmapMounted = false;
let sankeyMounted = false;
let benchChartMounted = false;

function waitForVisibleContainer(id, { timeoutMs = 8000 } = {}) {
  return new Promise((resolve) => {
    const started = performance.now();
    const check = () => {
      const el = document.getElementById(id);
      if (el && el.offsetWidth > 0 && el.offsetHeight > 0) {
        resolve();
        return;
      }
      if (performance.now() - started >= timeoutMs) {
        console.warn(`Timed out waiting for #${id}; continuing without it.`);
        resolve();
        return;
      }
      requestAnimationFrame(check);
    };
    requestAnimationFrame(check);
  });
}

async function ensureSankey(state) {
  if (sankeyMounted || !knowledgeData?.sankey) return;
  const container = document.getElementById("sankey-container");
  if (!container) return;

  try {
    const { initSankey } = await import("./sankey/init.js");
    state.sankeyApi = initSankey(container, knowledgeData.sankey, {
      onNodeClick: (detail) => state.onSankeyNodeClick(detail),
    });
    sankeyMounted = true;
  } catch (err) {
    console.error("Sankey failed to load:", err);
    state.sankeyError = err.message;
  }
}

async function ensureMindmap(state) {
  if (mindmapMounted || !knowledgeData) return;
  const container = document.getElementById("mindmap-container");
  if (!container) return;

  try {
    const { initMindmap } = await import("./mindmap/init.js");
    state.mindmapApi = initMindmap(
      container,
      knowledgeData.mindmap_md,
      registry,
      { onSelect: (detail) => state.openNode(detail) },
    );
    mindmapMounted = true;
  } catch (err) {
    console.error("Mindmap failed to load:", err);
    state.mindmapError = err.message;
  }
}

async function ensureBenchChart(state) {
  if (!state.knowledge) return;
  const container = document.getElementById("benchmark-stats-chart");
  if (!container) return;

  try {
    const { initStatsChart } = await import("./benchmark/chart.js");
    if (!benchChartMounted) {
      state.benchChartApi = initStatsChart(container, state.benchmarkSummary());
      benchChartMounted = true;
    } else {
      state.benchChartApi?.update(state.benchmarkSummary());
    }
    state.benchChartApi?.resize();
  } catch (err) {
    console.error("Benchmark chart failed to load:", err);
  }
}

function onViewChange(view, state) {
  if (view === "mindmap") {
    requestAnimationFrame(async () => {
      await waitForVisibleContainer("mindmap-container");
      await ensureMindmap(state);
      state.mindmapApi?.resize();
    });
    return;
  }

  if (view === "sankey") {
    requestAnimationFrame(async () => {
      await waitForVisibleContainer("sankey-container");
      await ensureSankey(state);
      state.sankeyApi?.resize();
    });
    return;
  }

  requestAnimationFrame(async () => {
    await waitForVisibleContainer("graph-container");
    state.graphApi?.resize();

    if (view === "graph") {
      state.graphApi?.clearPathHighlight();
      state.applyGraphFilters();
    } else if (view === "path" && state.pathStep?.nodeId) {
      state.graphApi?.clearPathHighlight();
      state.graphApi?.focusStep(state.pathStep.nodeId);
    }
  });
}

function onTabChange(tab, state) {
  if (tab !== "benchmark") return;
  requestAnimationFrame(async () => {
    await waitForVisibleContainer("benchmark-stats-chart");
    await ensureBenchChart(state);
  });
}

function mountApp(knowledge, state) {
  const graphContainer = document.getElementById("graph-container");
  if (!graphContainer || !registry) return;

  const graphApi = initGraph(graphContainer, knowledge, registry, {
    onSelect: (detail) => state.openNode(detail),
  });

  state.graphApi = graphApi;
  state.initFilters(knowledge);
  state.initBenchmark(knowledge);
  const pathController = createPathController(knowledge, registry, graphApi);
  state.initPath(pathController);
  onViewChange(state.exploreView, state);
}

document.addEventListener("alpine:init", () => {
  Alpine.store("kg", createAppState({ onViewChange, onTabChange }));

  loadKnowledge()
    .then(async (knowledge) => {
      const state = Alpine.store("kg");
      knowledgeData = knowledge;
      registry = buildRegistry(knowledge);
      state.registry = registry;
      state.knowledge = knowledge;
      state.initBenchmark(knowledge);
      state.loading = false;

      await waitForVisibleContainer("graph-container");
      mountApp(knowledge, state);
    })
    .catch((err) => {
      const state = Alpine.store("kg");
      state.loading = false;
      state.error = err.message;
    });
});

window.addEventListener("beforeunload", destroyGraph);
