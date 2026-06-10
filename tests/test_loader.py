"""Tests for knowledge graph loading."""

from pepkio_kg_single_cell_long_read_rna_sequencing import KnowledgeExplorer


def test_load_returns_expected_meta() -> None:
    explorer = KnowledgeExplorer.load()
    assert explorer.meta["version"] == "0.1.0"
    assert explorer.meta["paperCount"] == 7


def test_load_returns_non_empty_collections() -> None:
    explorer = KnowledgeExplorer.load()
    assert len(explorer.papers) == 7
    assert len(explorer.concepts) == 46
    assert len(explorer.tools) == 72
    assert len(explorer.benchmark) == 34
