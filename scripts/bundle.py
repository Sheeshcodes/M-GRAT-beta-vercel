#!/usr/bin/env python3
"""
Single-file bundler for the MAS Growth Readiness Assessment.

    python3 scripts/bundle.py

Reads  : index.html, css/styles.css, js/app.js, js/scoring.js,
         js/report.js, data/assessment.js, data/report_data.js
Writes : assessment-standalone.html  (in the project root)

The output file has no local dependencies — it can be double-clicked
directly from Finder / Explorer and runs over the file:// protocol
without a dev server or CORS restrictions.

Carbon Web Component CDN <script> tags are kept intact so the file
stays small; users only need a network connection for those components.
"""
import os
import re
import sys
import textwrap

ROOT   = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT    = os.path.join(ROOT, "assessment-standalone.html")

# ---------------------------------------------------------------------------
# File paths (all relative to ROOT)
# ---------------------------------------------------------------------------
INDEX_HTML     = os.path.join(ROOT, "index.html")
CSS_FILE       = os.path.join(ROOT, "css", "styles.css")

# ES6 module sources in dependency order:
#   data modules first (no imports of their own beyond `export default …`)
#   then the logic modules that import from data
#   then app.js which imports from everything
MODULE_FILES = [
    ("data/assessment.js",  os.path.join(ROOT, "data", "assessment.js")),
    ("data/report_data.js", os.path.join(ROOT, "data", "report_data.js")),
    ("data/journey.js", os.path.join(ROOT, "data", "journey.js")),
    ("data/milestone-actions.js", os.path.join(ROOT, "data", "milestone-actions.js")),
    ("js/scoring.js",       os.path.join(ROOT, "js",   "scoring.js")),
    ("js/report.js",        os.path.join(ROOT, "js",   "report.js")),
    ("js/app.js",           os.path.join(ROOT, "js",   "app.js")),
]

# ---------------------------------------------------------------------------
# Import-stripping patterns
#
# These patterns cover every import shape actually present in the source:
#
#   import assessment from "../data/assessment.js";
#   import reportData from "../data/report_data.js";
#   import assessmentData from "../data/assessment.js";
#   import { runScoringEngine } from "./scoring.js";
#   import { generateReportHtml, wireReportEvents } from "./report.js";
#
# We strip the `import` lines and replace `export function` / `export default`
# with plain declarations so everything lives in one flat script scope.
# ---------------------------------------------------------------------------

IMPORT_RE = re.compile(
    r'^\s*import\s+.*?from\s+["\'].*?["\'];?\s*$',
    re.MULTILINE,
)

# `export default <expr>` → keep the expression, drop the keyword
EXPORT_DEFAULT_RE = re.compile(r'\bexport\s+default\s+')

# `export function foo` → `function foo`
# `export const foo`   → `const foo`
# `export class foo`   → `class foo`
EXPORT_NAMED_RE = re.compile(r'\bexport\s+(function|const|let|var|class)\b')


def strip_module_syntax(source: str) -> str:
    """Remove ES6 import/export keywords, leaving plain JS."""
    source = IMPORT_RE.sub("", source)
    source = EXPORT_DEFAULT_RE.sub("", source)
    source = EXPORT_NAMED_RE.sub(r"\1", source)
    return source


# ---------------------------------------------------------------------------
# Data-module aliasing
#
# scoring.js  imports reportData   from ../data/report_data.js
#             imports assessmentData from ../data/assessment.js
# report.js   imports reportData   from ../data/report_data.js
#             imports assessmentData from ../data/assessment.js
# app.js      imports assessment   from ../data/assessment.js
#
# After stripping imports the bundled chunk is flat, so all three files share
# one global scope.  The data modules export a single default object; after
# stripping `export default` that object expression is assigned to nothing.
#
# Strategy:
#   • Wrap each data module in  `const <alias> = (function(){ … return <obj>; })();`
#     so the value is captured under a stable name.
#   • Use the most-specific alias name used across all consumers:
#       assessment.js   → exposed as both `assessment` (app.js) and
#                         `assessmentData` (scoring.js / report.js)
#                         We expose it as `assessmentData` and add
#                         `const assessment = assessmentData;` for app.js.
#       report_data.js  → exposed as `reportData`
# ---------------------------------------------------------------------------

def read(path: str) -> str:
    with open(path, encoding="utf-8") as f:
        return f.read()


def build_data_module(source: str, export_name: str) -> str:
    """
    Wrap a data module's source so its default export is captured as a const.

    `export default { … }` becomes:
        const <export_name> = { … };
    """
    # Strip import lines (data modules have none, but be safe)
    source = IMPORT_RE.sub("", source)
    # Replace `export default` with `const <export_name> =`
    source = EXPORT_DEFAULT_RE.sub(f"const {export_name} = ", source)
    return source.strip()


def build_logic_module(source: str) -> str:
    """Strip import/export syntax from a logic module."""
    return strip_module_syntax(source).strip()


# ---------------------------------------------------------------------------
# Main bundling routine
# ---------------------------------------------------------------------------

def bundle():
    # 1. Read source files
    html      = read(INDEX_HTML)
    css       = read(CSS_FILE)
    assessment_src  = read(os.path.join(ROOT, "data", "assessment.js"))
    report_data_src = read(os.path.join(ROOT, "data", "report_data.js"))
    journey_src     = read(os.path.join(ROOT, "data", "journey.js"))
    actions_src     = read(os.path.join(ROOT, "data", "milestone-actions.js"))
    scoring_src     = read(os.path.join(ROOT, "js",   "scoring.js"))
    report_src      = read(os.path.join(ROOT, "js",   "report.js"))
    app_src         = read(os.path.join(ROOT, "js",   "app.js"))

    # 2. Build the JS bundle (flat, no module syntax)
    parts = []

    parts.append("// ── data/assessment.js ────────────────────────────────────")
    parts.append(build_data_module(assessment_src, "assessmentData"))
    # Alias used by app.js
    parts.append("const assessment = assessmentData;")

    parts.append("\n// ── data/report_data.js ───────────────────────────────────")
    parts.append(build_data_module(report_data_src, "reportData"))

    parts.append("\n// ── data/journey.js ───────────────────────────────────────")
    parts.append(build_data_module(journey_src, "journey"))

    parts.append("\n// ── data/milestone-actions.js ─────────────────────────────")
    parts.append(build_data_module(actions_src, "milestoneActions"))

    parts.append("\n// ── js/scoring.js ─────────────────────────────────────────")
    parts.append(build_logic_module(scoring_src))

    parts.append("\n// ── js/report.js ──────────────────────────────────────────")
    parts.append(build_logic_module(report_src))

    parts.append("\n// ── js/app.js ─────────────────────────────────────────────")
    parts.append(build_logic_module(app_src))

    js_bundle = "\n".join(parts)

    # 3. Inline CSS: replace <link rel="stylesheet" href="css/styles.css" />
    # Use a lambda replacement to avoid re interpreting backslashes in the CSS.
    css_tag = f"<style>\n{css}\n</style>"
    html = re.sub(
        r'<link\s[^>]*href=["\']css/styles\.css["\'][^>]*/?>',
        lambda _: css_tag,
        html,
    )

    # 4. Inline JS: replace <script type="module" src="js/app.js"></script>
    #    The bundle is NOT a module (no import/export) so we use a plain
    #    async script tag — `await` at top-level is only valid in modules,
    #    but app.js has one `await Promise.all(…)` call.  We wrap the whole
    #    bundle in an async IIFE so top-level await still works.
    js_tag = f'<script>\n(async () => {{\n{js_bundle}\n}})();\n</script>'
    html = re.sub(
        r'<script\s+type=["\']module["\'][^>]*src=["\']js/app\.js["\'][^>]*>\s*</script>',
        lambda _: js_tag,
        html,
    )

    # 5. Write output
    with open(OUT, "w", encoding="utf-8") as f:
        f.write(html)

    kb = os.path.getsize(OUT) / 1024
    print(f"✓  Bundled → assessment-standalone.html  ({kb:.1f} KB)")
    print("   Open the file directly in any browser — no server needed.")


if __name__ == "__main__":
    # Quick pre-flight: warn if the data modules look stale / missing
    for label, path in MODULE_FILES:
        if not os.path.exists(path):
            print(f"✗  Missing: {label}  — run the compilers first.", file=sys.stderr)
            sys.exit(1)
    bundle()
