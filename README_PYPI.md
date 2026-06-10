# Pepkio Knowledge Explorer: Single-Cell Long-Read RNA Sequencing

Install a pip package to load single-cell long-read RNA sequencing knowledge graphs, benchmark Q&A, and the static explorer from Python scripts, notebooks, or CI—without cloning a repository.

# What It Does

This package provides programmatic access to the knowledge graph and benchmark Q&A for single-cell long-read RNA sequencing (scLR-seq), isoform analysis, and long-read bioinformatics. Data are synthesized and extracted from seven source papers and bundled as `knowledge.json`, `benchmark.json`, and the same HTML/JS/CSS files as the [static web app](https://github.com/pepkio/kg-single-cell-long-read-rna-sequencing).

Use it to query papers, concepts, tools, and relationships in code, export filtered benchmark subsets for LLM evaluation, or serve the interactive explorer locally.

# Features

* Load and query `papers`, `concepts`, `tools`, `relationships`, and `benchmark[]` from bundled JSON
* Filter and export benchmark Q&A as JSON or CSV for LLM/agent evaluation
* CLI: `info`, `benchmark export`, `serve` for local static hosting
* Bundled static web app (same files as `pepkio/kg-single-cell-long-read-rna-sequencing`)
* Offline use — no API key required

# Installation

```bash
pip install pepkio-kg-single-cell-long-read-rna-sequencing
```

# Quick Example

```python
from pepkio_kg_single_cell_long_read_rna_sequencing import KnowledgeExplorer

explorer = KnowledgeExplorer.load()
print(f"Benchmark questions: {len(explorer.benchmark)}")  # 34
explorer.export_benchmark("tools_benchmark.csv", format="csv", category="Tools")
```

CLI:

```bash
pepkio-kg-single-cell-long-read-rna-sequencing info
pepkio-kg-single-cell-long-read-rna-sequencing benchmark export -o benchmark.json
pepkio-kg-single-cell-long-read-rna-sequencing serve --port 8766
```

Bundled dataset (version 0.1.0): 7 papers, 46 concepts, 72 tools, 34 benchmark questions across categories Benchmarking (7), Tools (7), Methods (6), Concepts (7), Platforms (7), and difficulties beginner (12), intermediate (13), advanced (9).

# Typical Use Cases

* RAG evaluation with field-specific questions and ground-truth answers tied to source papers
* Agent benchmarking pipelines in CI that score model responses against exported CSV subsets
* Teaching scripts that reference structured paper metadata and concept relationships
* Local exploration via `serve` without cloning the GitHub static app repository

# Scientific Background

Single-cell long-read RNA sequencing applies PacBio HiFi or Oxford Nanopore platforms to droplet-based libraries (10x Genomics, MAS-ISO-seq, Kinnex), reading full-length cDNA per cell for isoform-resolved transcriptomics. The bundled graph covers platform benchmarks, barcode detection, UMI clustering, isoform quantification tools (wf-single-cell, Bambu, Sicelore, BLAZE), and allele-specific expression—topics where short-read scRNA-seq cannot reliably resolve splice variants.

# Web Application

For a graphical interface, use the hosted interactive explorer:

GitHub Pages: https://pepkio.github.io/kg-single-cell-long-read-rna-sequencing/

The companion editorial article at https://www.pepkio.com/blogs/articles/single-cell-long-read-rna-sequencing synthesizes the underlying benchmark literature with evidence-based platform comparisons and pipeline recommendations.

The web app adds a mind tree, Cytoscape knowledge graph, guided learning path (21 steps), Sankey ecosystem diagram, and benchmark export UI with category/difficulty filters.

# Documentation and Resources

PyPI package source: https://github.com/pepkio/pepkio-kg-single-cell-long-read-rna-sequencing

Static app repository: https://github.com/pepkio/kg-single-cell-long-read-rna-sequencing

Companion blog article: https://www.pepkio.com/blogs/articles/single-cell-long-read-rna-sequencing

# About Pepkio

[Pepkio](https://www.pepkio.com/) develops software tools, curated research knowledge resources, and bioinformatics analysis services for life science researchers.

# Keywords

single-cell long-read RNA sequencing, scLR-seq, isoform-resolved scRNA-seq, PacBio HiFi single-cell, Oxford Nanopore single-cell, MAS-ISO-seq, Kinnex, 10x Genomics long-read, alternative splicing, novel isoform discovery, allele-specific expression, wf-single-cell, Bambu, Sicelore, BLAZE, flexiplex, FLAMES, LongBench, knowledge graph bioinformatics, benchmark Q&A dataset, LLM evaluation genomics, RAG ground-truth answers, Python knowledge explorer, pip install benchmark data, single-cell transcriptomics tools, long-read bioinformatics benchmark, isoform quantification Nanopore, cell barcode detection long-read, Pepkio knowledge explorer, structured paper metadata RNA-seq, export benchmark JSON CSV, offline genomics knowledge package, agent benchmarking life sciences, teaching single-cell isoform analysis, PacBio vs Nanopore single-cell comparison, Nanopore R10.4.1 single-cell pipeline, differential transcript usage long-read, full-length single-cell RNA sequencing, scRNA-seq long reads Python API, programmatic knowledge graph query, serve static explorer locally, single-cell long-read sequencing evaluation set, bioinformatics concept graph transcriptomics, ground-truth Q&A single-cell genomics, isoform validation RT-PCR benchmark, UMI clustering long-read tools, spatial long-read RNA-seq concepts, EPI2ME single-cell workflow, single-cell isoform quantification Python, knowledge graph export for ML pipelines
