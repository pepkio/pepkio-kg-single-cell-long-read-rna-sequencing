# SPDX-License-Identifier: MIT
"""Serve the bundled static knowledge explorer locally."""

from __future__ import annotations

import http.server
import socketserver
from pathlib import Path
from typing import Callable

from .loader import static_dir


class NoCacheJSONHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self) -> None:
        if self.path.split("?", 1)[0].endswith(".json"):
            self.send_header("Cache-Control", "no-store, must-revalidate")
            self.send_header("Pragma", "no-cache")
        super().end_headers()


def serve(port: int = 8766, directory: Path | None = None) -> None:
    root = directory or Path(str(static_dir()))
    root = root.resolve()

    def handler_factory(*args, **kwargs) -> NoCacheJSONHandler:
        return NoCacheJSONHandler(*args, directory=str(root), **kwargs)

    handler: Callable[..., NoCacheJSONHandler] = handler_factory
    with socketserver.TCPServer(("", port), handler) as httpd:
        print(f"Serving {root} at http://localhost:{port}/")
        httpd.serve_forever()
