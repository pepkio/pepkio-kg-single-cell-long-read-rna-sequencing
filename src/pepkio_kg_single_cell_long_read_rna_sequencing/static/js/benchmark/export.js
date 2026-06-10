function escapeCsv(value) {
  const text = String(value ?? "");
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function triggerDownload(filename, content, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function downloadJson(items, version = "0.0.0") {
  const body = JSON.stringify(items, null, 2);
  triggerDownload(`benchmark-${version}.json`, body, "application/json");
}

export function downloadCsv(items) {
  const header = [
    "id",
    "category",
    "difficulty",
    "question",
    "ground_truth_answer",
    "source_paper_id",
  ];
  const rows = items.map((item) =>
    header.map((col) => escapeCsv(item[col])).join(","),
  );
  triggerDownload("benchmark.csv", [header.join(","), ...rows].join("\n"), "text/csv");
}

export function buildEvalPrompt(items) {
  const questions = items
    .map(
      (item, i) =>
        `${i + 1}. [id: ${item.id}] (${item.category}, ${item.difficulty})\n${item.question}`,
    )
    .join("\n\n");

  return `You are an expert in long-read RNA-seq and isoform analysis.

Answer each question below using your domain knowledge. Return ONLY a JSON array with one object per question:
[{"id": "<question id>", "answer": "<your answer>"}]

Do not include ground-truth answers or extra commentary outside the JSON.

Questions:

${questions}`;
}

export async function copyToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const area = document.createElement("textarea");
  area.value = text;
  area.style.position = "fixed";
  area.style.left = "-9999px";
  document.body.appendChild(area);
  area.select();
  document.execCommand("copy");
  document.body.removeChild(area);
}
