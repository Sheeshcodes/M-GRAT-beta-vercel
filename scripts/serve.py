#!/usr/bin/env python3
"""
Local dev server for the assessment page.

    python3 scripts/serve.py            # http://127.0.0.1:8765/
    python3 scripts/serve.py 3000       # another port

Serves the project folder with caching disabled, so a plain browser refresh
always picks up edited JS/CSS/data (the stock `python3 -m http.server` lets the
browser cache modules, which makes edits look like they didn't apply).

It also watches both workbooks in Logic/ and re-runs the matching compiler
whenever one is saved, so editing a spreadsheet + refreshing the browser is all
it takes to see new content:

    Question_Binder*.xlsx    -> build_assessment.py   (the questions)
    Milestone_Register*.xlsx -> build_report_data.py  (everything the report says)
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
# (label, compiler, workbook glob)
BUILDS = [
    ("questions",   os.path.join(ROOT, "scripts", "build_assessment.py"),
     os.path.join(ROOT, "Logic", "Question_Binder*.xlsx")),
    ("report data", os.path.join(ROOT, "scripts", "build_report_data.py"),
     os.path.join(ROOT, "Logic", "Milestone_Register*.xlsx")),
]


class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, must-revalidate")
        self.send_header("Expires", "0")
        super().end_headers()

    def log_message(self, fmt, *args):  # keep the terminal quiet
        pass


def workbook_stamp(pattern):
    """Newest modification time for a workbook glob (ignores Excel's ~$ lock files)."""
    files = [f for f in glob.glob(pattern) if not os.path.basename(f).startswith("~$")]
    return max((os.path.getmtime(f) for f in files), default=0)


def run_build(script):
    result = subprocess.run([sys.executable, script], capture_output=True, text=True)
    stamp = time.strftime("%H:%M:%S")
    if result.returncode == 0:
        for line in result.stdout.strip().splitlines():
            print(f"[{stamp}] {line}")
    else:
        print(f"[{stamp}] build failed:\n{result.stderr.strip() or result.stdout.strip()}")


def watch_workbooks(interval=1.0):
    stamps = {label: workbook_stamp(pattern) for label, _, pattern in BUILDS}
    while True:
        time.sleep(interval)
        for label, script, pattern in BUILDS:
            current = workbook_stamp(pattern)
            if current != stamps[label]:
                stamps[label] = current
                time.sleep(0.5)  # let Excel finish writing the file
                print(f"{label.capitalize()} workbook changed — rebuilding…")
                run_build(script)


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8765
    for _, script, _ in BUILDS:  # start from whatever is in the workbooks right now
        run_build(script)
    threading.Thread(target=watch_workbooks, daemon=True).start()
    handler = partial(NoCacheHandler, directory=ROOT)
    with ThreadingHTTPServer(("127.0.0.1", port), handler) as httpd:
        print(f"Serving {ROOT} at http://127.0.0.1:{port}/  (Ctrl+C to stop)")
        print("Watching Logic/*.xlsx — save a workbook, then refresh the browser.")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            pass


if __name__ == "__main__":
    main()
