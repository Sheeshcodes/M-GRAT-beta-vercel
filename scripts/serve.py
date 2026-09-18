#!/usr/bin/env python3
"""
Local dev server for the assessment page.

    python3 scripts/serve.py            # http://127.0.0.1:8765/
    python3 scripts/serve.py 3000       # another port

Serves the project folder with caching disabled, so a plain browser refresh
always picks up edited JS/CSS/data (the stock `python3 -m http.server` lets the
browser cache modules, which makes edits look like they didn't apply).

It also watches Logic/Question_Binder*.xlsx and re-runs build_assessment.py
whenever the workbook is saved, so editing the spreadsheet + refreshing the
browser is all it takes to see new questions.
"""
import glob
import os
import subprocess
import sys
import threading
import time
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BUILD = os.path.join(ROOT, "scripts", "build_assessment.py")
BINDER_GLOB = os.path.join(ROOT, "Logic", "Question_Binder*.xlsx")


class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, must-revalidate")
        self.send_header("Expires", "0")
        super().end_headers()

    def log_message(self, fmt, *args):  # keep the terminal quiet
        pass


def binder_stamp():
    """Newest modification time across the binder workbooks (ignores Excel's ~$ lock files)."""
    files = [f for f in glob.glob(BINDER_GLOB) if not os.path.basename(f).startswith("~$")]
    return max((os.path.getmtime(f) for f in files), default=0)


def run_build():
    result = subprocess.run([sys.executable, BUILD], capture_output=True, text=True)
    stamp = time.strftime("%H:%M:%S")
    if result.returncode == 0:
        print(f"[{stamp}] {result.stdout.strip()}")
    else:
        print(f"[{stamp}] build failed:\n{result.stderr.strip() or result.stdout.strip()}")


def watch_binder(interval=1.0):
    last = binder_stamp()
    while True:
        time.sleep(interval)
        current = binder_stamp()
        if current != last:
            last = current
            time.sleep(0.5)  # let Excel finish writing the file
            print("Question binder changed — rebuilding questions…")
            run_build()


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8765
    run_build()  # start from whatever is in the workbook right now
    threading.Thread(target=watch_binder, daemon=True).start()
    handler = partial(NoCacheHandler, directory=ROOT)
    with ThreadingHTTPServer(("127.0.0.1", port), handler) as httpd:
        print(f"Serving {ROOT} at http://127.0.0.1:{port}/  (Ctrl+C to stop)")
        print("Watching Logic/Question_Binder*.xlsx — save the workbook, then refresh the browser.")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            pass


if __name__ == "__main__":
    main()
