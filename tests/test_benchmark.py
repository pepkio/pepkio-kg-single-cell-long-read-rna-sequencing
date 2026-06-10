"""Tests for benchmark filtering and export."""

import csv
import json
from pathlib import Path

from pepkio_kg_single_cell_long_read_rna_sequencing import KnowledgeExplorer


def test_filter_by_category() -> None:
    explorer = KnowledgeExplorer.load()
    tools = explorer.filter_benchmark(category="Tools")
    assert len(tools) == 7
    assert all(e["category"] == "Tools" for e in tools)


def test_filter_by_difficulty() -> None:
    explorer = KnowledgeExplorer.load()
    beginner = explorer.filter_benchmark(difficulty="beginner")
    assert len(beginner) == 12
    assert all(e["difficulty"] == "beginner" for e in beginner)


def test_export_json(tmp_path: Path) -> None:
    explorer = KnowledgeExplorer.load()
    out = explorer.export_benchmark(tmp_path / "bench.json", format="json")
    data = json.loads(out.read_text(encoding="utf-8"))
    assert len(data["benchmark"]) == 34
    assert data["meta"]["exported_count"] == 34


def test_export_csv(tmp_path: Path) -> None:
    explorer = KnowledgeExplorer.load()
    out = explorer.export_benchmark(
        tmp_path / "bench.csv",
        format="csv",
        category="Platforms",
    )
    with out.open(encoding="utf-8") as fh:
        rows = list(csv.DictReader(fh))
    assert len(rows) == 7
    assert rows[0]["category"] == "Platforms"
