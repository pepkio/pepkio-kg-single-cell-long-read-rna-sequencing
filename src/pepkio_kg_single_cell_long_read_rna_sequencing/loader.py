"""Load bundled knowledge graph JSON from package data."""

from __future__ import annotations

import json
from importlib import resources
from typing import Any

_REQUIRED_KEYS = (
    "meta",
    "papers",
    "concepts",
    "tools",
    "relationships",
    "benchmark",
)


class KnowledgeDataError(Exception):
    """Raised when bundled knowledge data is missing or malformed."""


def static_dir() -> resources.Traversable:
    return resources.files(__package__) / "static"


def load_knowledge_json() -> dict[str, Any]:
    path = static_dir() / "data" / "knowledge.json"
    if not path.is_file():
        raise KnowledgeDataError(
            "Bundled knowledge.json not found. Reinstall the package or run scripts/sync_static.sh."
        )
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        raise KnowledgeDataError(f"Bundled knowledge.json is invalid JSON: {exc}") from exc
    if not isinstance(data, dict):
        raise KnowledgeDataError("Bundled knowledge.json must be a JSON object.")
    missing = [key for key in _REQUIRED_KEYS if key not in data]
    if missing:
        raise KnowledgeDataError(f"Bundled knowledge.json is missing keys: {', '.join(missing)}")
    return data
