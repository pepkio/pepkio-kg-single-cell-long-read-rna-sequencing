# SPDX-License-Identifier: MIT
"""Explore concepts and tools in pepkio_kg_single_cell_long_read_rna_sequencing."""

from pepkio_kg_single_cell_long_read_rna_sequencing import KnowledgeExplorer


def main():
    explorer = KnowledgeExplorer.load()
    print("Sample concepts:")
    for c in explorer.concepts[:5]:
        print(f" - {c.get('name')}: {c.get('description', '')[:60]}...")

    print("\nSample tools:")
    for t in explorer.tools[:5]:
        print(f" - {t.get('name')}: {t.get('category', '')}")


if __name__ == "__main__":
    main()
