function countBy(items, key) {
  const counts = {};
  for (const item of items) {
    const value = item[key] || "unknown";
    counts[value] = (counts[value] || 0) + 1;
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }));
}

export function summarizeBenchmark(items) {
  return {
    total: items.length,
    byCategory: countBy(items, "category"),
    byDifficulty: countBy(items, "difficulty"),
  };
}
