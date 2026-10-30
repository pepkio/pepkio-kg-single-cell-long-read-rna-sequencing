# SPDX-License-Identifier: MIT
"""CLI for the Pepkio Knowledge Explorer package."""

from __future__ import annotations

import click

from .explorer import KnowledgeExplorer
from .serve import serve


@click.group()
def main() -> None:
    """Pepkio Knowledge Explorer: Single-Cell Long-Read RNA Sequencing."""


@main.command("info")
def info_cmd() -> None:
    """Print meta title, version, paper count, and benchmark count."""
    explorer = KnowledgeExplorer.load()
    meta = explorer.meta
    click.echo(f"Title: {meta.get('title', 'N/A')}")
    click.echo(f"Version: {meta.get('version', 'N/A')}")
    click.echo(f"Papers: {len(explorer.papers)}")
    click.echo(f"Concepts: {len(explorer.concepts)}")
    click.echo(f"Tools: {len(explorer.tools)}")
    click.echo(f"Relationships: {len(explorer.relationships)}")
    click.echo(f"Benchmark questions: {len(explorer.benchmark)}")


@main.group("benchmark")
def benchmark_group() -> None:
    """Benchmark Q&A operations."""


@benchmark_group.command("export")
@click.option("--output", "-o", required=True, type=click.Path(), help="Output file path.")
@click.option("--format", "fmt", type=click.Choice(["json", "csv"]), default="json")
@click.option("--category", default=None, help="Filter by category.")
@click.option("--difficulty", default=None, help="Filter by difficulty.")
def benchmark_export(output: str, fmt: str, category: str | None, difficulty: str | None) -> None:
    """Export filtered benchmark Q&A to JSON or CSV."""
    explorer = KnowledgeExplorer.load()
    path = explorer.export_benchmark(
        output,
        format=fmt,  # type: ignore[arg-type]
        category=category,
        difficulty=difficulty,
    )
    count = len(explorer.filter_benchmark(category=category, difficulty=difficulty))
    click.echo(f"Exported {count} benchmark entries to {path}")


@main.command("serve")
@click.option("--port", default=8766, show_default=True, help="HTTP port.")
def serve_cmd(port: int) -> None:
    """Serve the bundled static web app locally."""
    serve(port=port)
