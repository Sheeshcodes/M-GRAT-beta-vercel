#!/usr/bin/env python3
"""Local development server for the M-GRAT assessment tool.

    python3 scripts/serve.py            # http://127.0.0.1:8765/
    python3 scripts/serve.py 3000       # custom port
"""
from __future__ import annotations

import glob
import io
import os
import subprocess
import sys
import threading
import time
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from typing import BinaryIO

from common import ROOT_DIR

BUILD_CONFIGS: list[tuple[str, str, str]] = [
    (
        "questions",
        os.path.join(ROOT_DIR, "scripts", "build_assessment.py"),
        os.path.join(ROOT_DIR, "Logic", "Question_Binder*.xlsx"),
    ),
    (
        "report data",
        os.path.join(ROOT_DIR, "scripts", "build_report_data.py"),
        os.path.join(ROOT_DIR, "Logic", "Milestone_Register*.xlsx"),
    ),
]


class RangeByteReader:
    """Read and return only the requested range slice from underlying file object."""

    def __init__(self, file_obj: BinaryIO, length: int) -> None:
        self._file = file_obj
        self._remaining = length

    def read(self, amount: int = -1) -> bytes:
        if self._remaining <= 0:
            return b""
        if amount < 0 or amount > self._remaining:
            amount = self._remaining
        chunk = self._file.read(amount)
        self._remaining -= len(chunk)
        return chunk

    def close(self) -> None:
        self._file.close()

    def log_message(self, fmt: str, *args: object) -> None:
        pass


class NoCacheHandler(SimpleHTTPRequestHandler):
    """HTTP 1.1 Request handler with cache disabling and Byte-Range support for video."""

    protocol_version = "HTTP/1.1"

    def end_headers(self) -> None:
        self.send_header("Cache-Control", "no-store, must-revalidate")
        self.send_header("Expires", "0")
        self.send_header("Accept-Ranges", "bytes")
        super().end_headers()

    def send_head(self) -> io.BytesIO | BinaryIO | RangeByteReader | None:
        range_header = self.headers.get("Range")
        if not range_header or not range_header.startswith("bytes="):
            return super().send_head()

        translated_path = self.translate_path(self.path)
        if os.path.isdir(translated_path):
            return super().send_head()

        try:
            file_obj = open(translated_path, "rb")
        except OSError:
            self.send_error(404, "File not found")
            return None

        total_size = os.fstat(file_obj.fileno()).st_size
        range_spec = range_header[len("bytes="):]
        first_str, _, last_str = range_spec.partition("-")

        try:
            start = int(first_str) if first_str else 0
            end = int(last_str) if last_str else total_size - 1
        except ValueError:
            file_obj.close()
            return super().send_head()

        end = min(end, total_size - 1)
        if start > end:
            file_obj.close()
            self.send_response(416)
            self.send_header("Content-Range", f"bytes */{total_size}")
            self.send_header("Content-Length", "0")
            self.end_headers()
            return None

        content_length = end - start + 1
        self.send_response(206)
        self.send_header("Content-Type", self.guess_type(translated_path))
        self.send_header("Content-Range", f"bytes {start}-{end}/{total_size}")
        self.send_header("Content-Length", str(content_length))
        self.end_headers()

        file_obj.seek(start)
        return RangeByteReader(file_obj, content_length)


def get_newest_workbook_mtime(pattern: str) -> float:
    """Get the newest modification timestamp for files matching glob pattern."""
    matching_files = [
        f for f in glob.glob(pattern)
        if not os.path.basename(f).startswith("~$")
    ]
    return max((os.path.getmtime(f) for f in matching_files), default=0.0)


def execute_build(script_path: str) -> None:
    """Run a build compiler script as a subprocess and log the result."""
    result = subprocess.run([sys.executable, script_path], capture_output=True, text=True)
    timestamp = time.strftime("%H:%M:%S")
    if result.returncode == 0:
        for line in result.stdout.strip().splitlines():
            print(f"[{timestamp}] {line}")
    else:
        error_output = result.stderr.strip() or result.stdout.strip()
        print(f"[{timestamp}] build failed:\n{error_output}")


def watch_workbooks(interval: float = 1.0) -> None:
    """Background watcher checking for changes to workbook spreadsheets."""
    timestamps = {
        label: get_newest_workbook_mtime(pattern)
        for label, _, pattern in BUILD_CONFIGS
    }
    while True:
        time.sleep(interval)
        for label, script_path, pattern in BUILD_CONFIGS:
            current_mtime = get_newest_workbook_mtime(pattern)
            if current_mtime != timestamps[label]:
                timestamps[label] = current_mtime
                time.sleep(0.5)  # Wait for file write to complete
                print(f"{label.capitalize()} workbook changed — rebuilding...")
                execute_build(script_path)


def main() -> None:
    """Run dev server and start workbook watcher."""
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8765
    for _, script_path, _ in BUILD_CONFIGS:
        execute_build(script_path)

    watcher_thread = threading.Thread(target=watch_workbooks, daemon=True)
    watcher_thread.start()

    handler_factory = partial(NoCacheHandler, directory=ROOT_DIR)
    with ThreadingHTTPServer(("127.0.0.1", port), handler_factory) as httpd:
        print(f"Serving {ROOT_DIR} at http://127.0.0.1:{port}/ (Ctrl+C to stop)")
        print("Watching Logic/*.xlsx — save a workbook, then refresh the browser.")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server.")


if __name__ == "__main__":
    main()
