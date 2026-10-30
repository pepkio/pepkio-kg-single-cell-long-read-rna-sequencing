# Pepkio Knowledge Explorer: Single-Cell Long-Read RNA Sequencing

Run the bundled scLR-seq knowledge graph, benchmark Q&A, and static explorer CLI in a portable container—no local Python setup required.

# What It Does

This image ships `pepkio-kg-single-cell-long-read-rna-sequencing`, a self-contained package with curated papers, concepts, tools, relationships, and 34 benchmark questions for single-cell long-read RNA sequencing. Query the graph from the CLI, export filtered benchmark subsets for LLM evaluation, or serve the interactive web explorer locally.

Typical workflows include offline benchmark export in CI, scripted knowledge-graph queries in notebooks, and local hosting of the static explorer for teaching or demos. No API key or network connection is required after pull.

# Features

- CLI commands: `info`, `benchmark export`, `serve`
- Bundled `knowledge.json`, `benchmark.json`, and static HTML/JS/CSS
- Export benchmark Q&A as JSON or CSV with category and difficulty filters
- Local HTTP server for the interactive explorer (`serve --port`)
- Offline use — data ships inside the image

# Quick Start

```bash
docker pull pepkio/kg-single-cell-long-read-rna-sequencing:0.1.0
docker run --rm pepkio/kg-single-cell-long-read-rna-sequencing:0.1.0 info
```

Serve the web explorer (map port 8766):

```bash
docker run --rm -p 8766:8766 pepkio/kg-single-cell-long-read-rna-sequencing:0.1.0 serve --port 8766
```

# Quick Example

Export Tools-category benchmark questions to CSV:

```bash
docker run --rm -v "$PWD:/out" \
  pepkio/kg-single-cell-long-read-rna-sequencing:0.1.0 \
  benchmark export -o /out/tools_benchmark.csv --format csv --category Tools
```

# Typical Use Cases

- RAG and agent benchmarking with field-specific ground-truth Q&A
- CI pipelines that score model responses against exported benchmark subsets
- Teaching scripts referencing structured paper metadata and concept relationships
- Local exploration via `serve` without cloning the GitHub static app repository

# Scientific Background

Single-cell long-read RNA sequencing applies PacBio HiFi or Oxford Nanopore to droplet libraries (10x Genomics, MAS-ISO-seq, Kinnex), reading full-length cDNA per cell for isoform-resolved transcriptomics. The bundled graph covers platform benchmarks, barcode detection, UMI clustering, isoform quantification tools, and allele-specific expression.

# Web Application

For a graphical interface, use the hosted interactive explorer:

Web Application: https://pepkio.github.io/kg-single-cell-long-read-rna-sequencing/

The web app provides graph navigation, paper links, and benchmark browsing without installing anything locally.

# Documentation and Resources

GitHub Repository (source and Dockerfile): https://github.com/pepkio/pepkio-kg-single-cell-long-read-rna-sequencing

Static web app repository: https://github.com/pepkio/kg-single-cell-long-read-rna-sequencing

# About Pepkio

Pepkio (https://www.pepkio.com/) develops software tools and bioinformatics solutions for life science researchers, including laboratory calculators and analysis services (https://www.pepkio.com/cro).
