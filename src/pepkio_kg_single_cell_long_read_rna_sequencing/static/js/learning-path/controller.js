export function createPathController(knowledge, registry, graphApi) {
  const steps = knowledge.learning_path ?? [];
  let index = 0;

  function goTo(i) {
    if (!steps.length) {
      return { index: 0, total: 0, nodeId: null, narration: "", detail: null };
    }
    index = Math.max(0, Math.min(steps.length - 1, i));
    const { nodeId, narration } = steps[index];
    graphApi.focusStep(nodeId);
    return {
      index,
      total: steps.length,
      nodeId,
      narration,
      detail: registry.detailFromId(nodeId),
    };
  }

  return {
    get steps() {
      return steps;
    },
    get index() {
      return index;
    },
    goTo,
    goNext() {
      return goTo(index + 1);
    },
    goPrev() {
      return goTo(index - 1);
    },
  };
}
