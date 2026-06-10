"""CLI smoke tests."""

import subprocess
import sys


def test_cli_info() -> None:
    result = subprocess.run(
        [
            sys.executable,
            "-m",
            "pepkio_kg_single_cell_long_read_rna_sequencing",
            "info",
        ],
        capture_output=True,
        text=True,
        check=True,
    )
    assert "Version: 0.1.0" in result.stdout
    assert "Benchmark questions: 34" in result.stdout
