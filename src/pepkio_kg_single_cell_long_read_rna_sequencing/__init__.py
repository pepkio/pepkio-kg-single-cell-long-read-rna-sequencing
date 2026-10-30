# SPDX-License-Identifier: MIT
"""Pepkio Knowledge Explorer: Single-Cell Long-Read RNA Sequencing."""

from .explorer import KnowledgeExplorer
from .loader import KnowledgeDataError, load_knowledge_json

__all__ = ["KnowledgeExplorer", "KnowledgeDataError", "load_knowledge_json"]
__version__ = "0.1.0"
