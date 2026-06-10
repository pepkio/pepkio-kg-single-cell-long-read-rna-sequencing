"""KnowledgeExplorer — programmatic access to bundled knowledge graph data."""

from __future__ import annotations

from pathlib import Path
from typing import Any

from .benchmark import ExportFormat, export_benchmark, filter_benchmark
from .loader import load_knowledge_json


class KnowledgeExplorer:
    def __init__(self, data: dict[str, Any]) -> None:
        self._data = data

    @classmethod
    def load(cls) -> KnowledgeExplorer:
        return cls(load_knowledge_json())

    @property
    def meta(self) -> dict[str, Any]:
        return self._data["meta"]

    @property
    def papers(self) -> list[dict[str, Any]]:
        return self._data["papers"]

    @property
    def concepts(self) -> list[dict[str, Any]]:
        return self._data["concepts"]

    @property
    def tools(self) -> list[dict[str, Any]]:
        return self._data["tools"]

    @property
    def relationships(self) -> list[dict[str, Any]]:
        return self._data["relationships"]

    @property
    def benchmark(self) -> list[dict[str, Any]]:
        return self._data["benchmark"]

    def filter_benchmark(
        self,
        *,
        category: str | None = None,
        difficulty: str | None = None,
    ) -> list[dict[str, Any]]:
        return filter_benchmark(self.benchmark, category=category, difficulty=difficulty)

    def export_benchmark(
        self,
        path: str | Path,
        *,
        format: ExportFormat = "json",
        category: str | None = None,
        difficulty: str | None = None,
    ) -> Path:
        entries = self.filter_benchmark(category=category, difficulty=difficulty)
        meta = {
            "title": self.meta.get("title"),
            "version": self.meta.get("version"),
            "exported_count": len(entries),
        }
        return export_benchmark(entries, path, format=format, meta=meta)
