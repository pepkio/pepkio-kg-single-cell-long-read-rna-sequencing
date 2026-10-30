# SPDX-License-Identifier: MIT
"""Quickstart example for pepkio_kg_single_cell_long_read_rna_sequencing."""

from pepkio_kg_single_cell_long_read_rna_sequencing import KnowledgeExplorer


def main():
    explorer = KnowledgeExplorer.load()
    print("Metadata:", explorer.meta)
    print(f"Total papers: {len(explorer.papers)}")
    print(f"Total concepts: {len(explorer.concepts)}")
    print(f"Total tools: {len(explorer.tools)}")


if __name__ == "__main__":
    main()
