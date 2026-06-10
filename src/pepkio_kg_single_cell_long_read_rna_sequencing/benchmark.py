"""Filter and export benchmark Q&A entries."""

from __future__ import annotations

import csv
import json
from pathlib import Path
from typing import Any, Literal

ExportFormat = Literal["json", "csv"]


def filter_benchmark(
    entries: list[dict[str, Any]],
    *,
    category: str | None = None,
    difficulty: str | None = None,
) -> list[dict[str, Any]]:
    result = entries
    if category is not None:
        result = [e for e in result if e.get("category") == category]
    if difficulty is not None:
        result = [e for e in result if e.get("difficulty") == difficulty]
    return result


def export_benchmark(
    entries: list[dict[str, Any]],
    path: str | Path,
    *,
    format: ExportFormat = "json",
    meta: dict[str, Any] | None = None,
) -> Path:
    out = Path(path)
    out.parent.mkdir(parents=True, exist_ok=True)

    if format == "json":
        payload: dict[str, Any] = {"benchmark": entries}
        if meta:
            payload["meta"] = meta
        out.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        return out

    if format == "csv":
        fieldnames = [
            "id",
            "question",
            "ground_truth_answer",
            "category",
            "difficulty",
            "source_paper_id",
        ]
        with out.open("w", encoding="utf-8", newline="") as fh:
            writer = csv.DictWriter(fh, fieldnames=fieldnames, extrasaction="ignore")
            writer.writeheader()
            for entry in entries:
                writer.writerow({k: entry.get(k, "") for k in fieldnames})
        return out

    raise ValueError(f"Unsupported export format: {format!r}")
