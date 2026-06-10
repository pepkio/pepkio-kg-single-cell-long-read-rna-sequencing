import {
  collectCategories,
  collectDifficulties,
  filterBenchmark,
  truncate,
} from "../benchmark/filters.js";
import { summarizeBenchmark } from "../benchmark/stats.js";
import {
  buildEvalPrompt,
  copyToClipboard,
  downloadCsv,
  downloadJson,
} from "../benchmark/export.js";
import { collectTags, yearBounds } from "../graph/filters.js";

const ALL_KINDS = ["paper", "concept", "tool", "external"];

export function createAppState({ onViewChange, onTabChange } = {}) {
  return {
    knowledge: null,
    registry: null,
    loading: true,
    error: null,
    activeTab: "explore",
    exploreView: "path",
    selectedNode: null,
    drawerOpen: false,
    graphApi: null,
    mindmapApi: null,
    sankeyApi: null,
    pathController: null,
    pathStep: null,
    sankeyFilter: null,
    searchQuery: "",
    filterTypes: { paper: true, concept: true, tool: true, external: true },
    filterTag: "",
    yearMin: null,
    yearMax: null,
    allTags: [],
    benchSearch: "",
    benchCategory: "",
    benchDifficulty: "",
    expandedBenchId: null,
    benchChartApi: null,
    benchCategories: [],
    benchDifficulties: [],
    benchCopyStatus: "",

    openNode(detail) {
      this.selectedNode = detail;
      this.drawerOpen = true;
    },

    closeDrawer() {
      this.drawerOpen = false;
    },

    doiUrl(doi) {
      return doi ? `https://doi.org/${doi}` : null;
    },

    initFilters(knowledge) {
      this.allTags = collectTags(knowledge);
      const bounds = yearBounds(knowledge);
      this.yearMin = bounds.min;
      this.yearMax = bounds.max;
    },

    initBenchmark(knowledge) {
      const items = knowledge.benchmark || [];
      this.benchCategories = collectCategories(items);
      this.benchDifficulties = collectDifficulties(items);
    },

    getFilterState() {
      const types = new Set(ALL_KINDS.filter((kind) => this.filterTypes[kind]));
      const paperIds = this.sankeyFilter?.paperIds?.length
        ? new Set(this.sankeyFilter.paperIds)
        : null;
      return {
        searchQuery: this.searchQuery,
        types,
        tag: this.filterTag || null,
        yearMin: this.yearMin,
        yearMax: this.yearMax,
        paperIds,
      };
    },

    setTab(tab) {
      this.activeTab = tab;
      onTabChange?.(tab, this);
    },

    setView(view) {
      this.exploreView = view;
      onViewChange?.(view, this);
    },

    applyGraphFilters() {
      this.graphApi?.applyFilters(this.getFilterState());
    },

    onSearchInput() {
      this.applyGraphFilters();
    },

    resetGraphView() {
      this.searchQuery = "";
      this.filterTag = "";
      this.sankeyFilter = null;
      for (const kind of ALL_KINDS) {
        this.filterTypes[kind] = true;
      }
      if (this.knowledge) {
        const bounds = yearBounds(this.knowledge);
        this.yearMin = bounds.min;
        this.yearMax = bounds.max;
      }
      this.graphApi?.clearPathHighlight();
      this.applyGraphFilters();
      this.graphApi?.resetLayout();
    },

    onSankeyNodeClick(detail) {
      this.sankeyFilter = {
        nodeId: detail.nodeId,
        name: detail.name,
        paperIds: detail.paperIds,
      };
    },

    clearSankeyFilter() {
      this.sankeyFilter = null;
      this.applyGraphFilters();
    },

    viewInGraph() {
      if (!this.sankeyFilter) return;
      this.setView("graph");
      this.graphApi?.clearPathHighlight();
      this.applyGraphFilters();
      this.graphApi?.fit();
    },

    initPath(controller) {
      this.pathController = controller;
      this.pathStep = controller.goTo(0);
    },

    goNext() {
      if (!this.pathController) return;
      this.pathStep = this.pathController.goNext();
    },

    goPrev() {
      if (!this.pathController) return;
      this.pathStep = this.pathController.goPrev();
    },

    progressPercent() {
      if (!this.pathStep?.total) return 0;
      return ((this.pathStep.index + 1) / this.pathStep.total) * 100;
    },

    canGoPrev() {
      return (this.pathStep?.index ?? 0) > 0;
    },

    canGoNext() {
      if (!this.pathStep?.total) return false;
      return this.pathStep.index < this.pathStep.total - 1;
    },

    openCurrentNode() {
      if (this.pathStep?.detail) {
        this.openNode(this.pathStep.detail);
      }
    },

    fitGraph() {
      this.graphApi?.fit();
    },

    fitMindmap() {
      this.mindmapApi?.fit();
    },

    exportPng() {
      this.graphApi?.exportPng();
    },

    filteredBenchmark() {
      return filterBenchmark(this.knowledge?.benchmark || [], {
        search: this.benchSearch,
        category: this.benchCategory,
        difficulty: this.benchDifficulty,
      });
    },

    benchmarkSummary() {
      return summarizeBenchmark(this.filteredBenchmark());
    },

    truncateBench(text) {
      return truncate(text);
    },

    paperForBench(item) {
      return this.registry?.detailFromId(item.source_paper_id) ?? null;
    },

    benchPaperLabel(item) {
      const detail = this.paperForBench(item);
      return detail?.label || item.source_paper_id;
    },

    benchPaperDoi(item) {
      const detail = this.paperForBench(item);
      return detail?.doi || null;
    },

    onBenchFilterChange() {
      this.expandedBenchId = null;
      this.benchChartApi?.update(this.benchmarkSummary());
    },

    toggleBenchRow(id) {
      this.expandedBenchId = this.expandedBenchId === id ? null : id;
    },

    downloadBenchmarkJson() {
      const items = this.filteredBenchmark();
      downloadJson(items, this.knowledge?.meta?.version || "0.0.0");
    },

    downloadBenchmarkCsv() {
      downloadCsv(this.filteredBenchmark());
    },

    async copyBenchmarkPrompt() {
      const items = this.filteredBenchmark();
      if (!items.length) return;
      await copyToClipboard(buildEvalPrompt(items));
      this.benchCopyStatus = "Copied!";
      setTimeout(() => {
        this.benchCopyStatus = "";
      }, 2000);
    },

    openBenchPaper(item) {
      const detail = this.paperForBench(item);
      if (detail) this.openNode(detail);
    },
  };
}
