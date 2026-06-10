export function collectCategories(items) {
  return [...new Set(items.map((i) => i.category).filter(Boolean))].sort();
}

export function collectDifficulties(items) {
  return [...new Set(items.map((i) => i.difficulty).filter(Boolean))].sort();
}

export function truncate(text, max = 80) {
  if (!text || text.length <= max) return text || "";
  return `${text.slice(0, max).trimEnd()}…`;
}

export function filterBenchmark(items, { search = "", category = "", difficulty = "" } = {}) {
  const q = search.trim().toLowerCase();
  return items.filter((item) => {
    if (category && item.category !== category) return false;
    if (difficulty && item.difficulty !== difficulty) return false;
    if (!q) return true;
    const haystack = [
      item.id,
      item.category,
      item.difficulty,
      item.question,
      item.ground_truth_answer,
      item.source_paper_id,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}
