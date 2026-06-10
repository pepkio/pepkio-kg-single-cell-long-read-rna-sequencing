#!/usr/bin/env bash
# Sync runtime assets from the static knowledge explorer repo into the PyPI package.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PKG_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
STATIC_DEST="${PKG_ROOT}/src/pepkio_kg_single_cell_long_read_rna_sequencing/static"
SLUG="single-cell-long-read-rna-sequencing"
SRC="${1:-}"

if [[ -z "${SRC}" ]]; then
  TMP="$(mktemp -d)"
  trap 'rm -rf "${TMP}"' EXIT
  git clone --depth 1 "https://github.com/pepkio/kg-${SLUG}.git" "${TMP}/kg"
  SRC="${TMP}/kg"
fi

rm -rf "${STATIC_DEST}"
mkdir -p "${STATIC_DEST}"
cp "${SRC}/index.html" "${STATIC_DEST}/"
cp -R "${SRC}/css" "${SRC}/js" "${SRC}/data" "${STATIC_DEST}/"

echo "Synced static assets to ${STATIC_DEST}"
test -f "${STATIC_DEST}/data/knowledge.json"
test -f "${STATIC_DEST}/data/benchmark.json"
