let chartInstance = null;

function getEcharts() {
  if (!window.echarts) throw new Error("ECharts not loaded");
  return window.echarts;
}

function topEntries(entries, limit = 8) {
  return entries.slice(0, limit);
}

function buildOption(summary) {
  const categories = topEntries(summary.byCategory);
  const difficulties = summary.byDifficulty;

  return {
    tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
    grid: [
      { left: "3%", right: "52%", top: "8%", bottom: "8%", containLabel: true },
      { left: "55%", right: "3%", top: "8%", bottom: "8%", containLabel: true },
    ],
    xAxis: [
      { type: "value", gridIndex: 0, minInterval: 1 },
      { type: "value", gridIndex: 1, minInterval: 1 },
    ],
    yAxis: [
      {
        type: "category",
        gridIndex: 0,
        data: categories.map((e) => e.name),
        axisLabel: { width: 90, overflow: "truncate" },
      },
      {
        type: "category",
        gridIndex: 1,
        data: difficulties.map((e) => e.name),
      },
    ],
    series: [
      {
        name: "By category",
        type: "bar",
        xAxisIndex: 0,
        yAxisIndex: 0,
        data: categories.map((e) => e.count),
        itemStyle: { color: "#2563eb" },
      },
      {
        name: "By difficulty",
        type: "bar",
        xAxisIndex: 1,
        yAxisIndex: 1,
        data: difficulties.map((e) => e.count),
        itemStyle: { color: "#0f766e" },
      },
    ],
  };
}

export function initStatsChart(container, summary) {
  if (chartInstance) {
    chartInstance.dispose();
    chartInstance = null;
  }
  container.innerHTML = "";
  const chart = getEcharts().init(container);
  chart.setOption(buildOption(summary));
  chartInstance = chart;
  return {
    update: (next) => chart.setOption(buildOption(next)),
    resize: () => chartInstance?.resize(),
    dispose: () => {
      chartInstance?.dispose();
      chartInstance = null;
    },
  };
}

export function destroyStatsChart() {
  if (chartInstance) {
    chartInstance.dispose();
    chartInstance = null;
  }
}
