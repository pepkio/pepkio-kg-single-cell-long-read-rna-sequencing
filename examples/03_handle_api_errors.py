# SPDX-License-Identifier: MIT
"""Benchmark filtering and export for pepkio_kg_single_cell_long_read_rna_sequencing."""

from pepkio_kg_single_cell_long_read_rna_sequencing import KnowledgeDataError, KnowledgeExplorer


def main():
    try:
        explorer = KnowledgeExplorer.load()
        benchmark = explorer.filter_benchmark(difficulty="medium")
        print(f"Loaded {len(benchmark)} benchmark items of difficulty 'medium'")
    except KnowledgeDataError as exc:
        print(f"Data error: {exc}")
    except Exception as exc:
        print(f"Error: {exc}")


if __name__ == "__main__":
    main()
