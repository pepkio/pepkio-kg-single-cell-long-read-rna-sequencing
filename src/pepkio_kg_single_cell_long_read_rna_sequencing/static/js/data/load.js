const KNOWLEDGE_URL = new URL("data/knowledge.json", window.location.href).href;

export async function loadKnowledge() {
  const response = await fetch(KNOWLEDGE_URL, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to load knowledge data (${response.status})`);
  }
  const knowledge = await response.json();
  if (!Array.isArray(knowledge.benchmark) || knowledge.benchmark.length === 0) {
    throw new Error(
      "Knowledge data has no benchmark questions. Regenerate data/knowledge.json "
      + "(see README → Regenerate data).",
    );
  }
  return knowledge;
}
