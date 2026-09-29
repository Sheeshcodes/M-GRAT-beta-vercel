#!/usr/bin/env python3
"""
Single-file bundler for the MAS Growth Readiness Assessment.

    python3 scripts/bundle.py

Reads  : index.html, report.html, css/styles.css, css/splash.css,
         css/report.css, js/app.js, js/scoring.js, js/report.js,
         data/assessment.js, data/report_data.js, data/journey.js,
         data/milestone-actions.js
Writes : assessment-standalone.html  (in the project root)

The output file has no local dependencies — it can be double-clicked
directly from Finder / Explorer and runs over the file:// protocol
without a dev server or CORS restrictions.

Carbon Web Component CDN <script> tags are kept intact so the file
stays small; users only need a network connection for those components.

Standalone-specific patches applied at bundle time:
  1. report.html body is injected into #report-view so the report DOM
     exists in-page rather than on a separate page.
  2. css/report.css is inlined.
  3. report.js's auto-calling `init()` is suppressed; instead `init` is
     exposed as `window.__reportInit` so app.js can call it directly.
  4. app.js's dynamic `import("./scoring.js")` is replaced with a direct
     call to the already-bundled `score()` function.
  5. app.js's `window.location.href = "report.html"` redirect is replaced
     with an in-page reveal: show #report-view, hide .page, call init().
  6. Extra Carbon CDN components needed by the report are added to <head>.
"""
import os
import re
import sys

ROOT   = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT    = os.path.join(ROOT, "assessment-standalone.html")

# ---------------------------------------------------------------------------
# File paths (all relative to ROOT)
# ---------------------------------------------------------------------------
INDEX_HTML      = os.path.join(ROOT, "index.html")
REPORT_HTML     = os.path.join(ROOT, "report.html")
CSS_FILE        = os.path.join(ROOT, "css", "styles.css")
CSS_SPLASH_FILE = os.path.join(ROOT, "css", "splash.css")
CSS_REPORT_FILE = os.path.join(ROOT, "css", "report.css")

# ES6 module sources in dependency order:
#   data modules first (no imports of their own beyond `export default …`)
#   then the logic modules that import from data
#   then app.js which imports from everything
MODULE_FILES = [
    ("data/assessment.js",       os.path.join(ROOT, "data", "assessment.js")),
    ("data/report_data.js",      os.path.join(ROOT, "data", "report_data.js")),
    ("data/journey.js",          os.path.join(ROOT, "data", "journey.js")),
    ("data/milestone-actions.js",os.path.join(ROOT, "data", "milestone-actions.js")),
    ("js/scoring.js",            os.path.join(ROOT, "js",   "scoring.js")),
    ("js/report.js",             os.path.join(ROOT, "js",   "report.js")),
    ("js/app.js",                os.path.join(ROOT, "js",   "app.js")),
]

# ---------------------------------------------------------------------------
# Import-stripping patterns
# ---------------------------------------------------------------------------

IMPORT_RE = re.compile(
    r'^\s*import\s+.*?from\s+["\'].*?["\'];?\s*$',
    re.MULTILINE,
)

# `export default <expr>` → keep the expression, drop the keyword
EXPORT_DEFAULT_RE = re.compile(r'\bexport\s+default\s+')

# `export function foo` / `export async function foo` → `function foo` / `async function foo`
# `export const foo`   → `const foo`
# `export class foo`   → `class foo`
EXPORT_NAMED_RE = re.compile(r'\bexport\s+(async\s+)?(function|const|let|var|class)\b')

# `export { foo, bar };` — re-export list with no `from`; just remove the whole statement
EXPORT_BRACE_RE = re.compile(
    r'^\s*export\s*\{[^}]*\}\s*;\s*$',
    re.MULTILINE,
)


def strip_module_syntax(source: str) -> str:
    """Remove ES6 import/export keywords, leaving plain JS."""
    source = IMPORT_RE.sub("", source)
    source = EXPORT_DEFAULT_RE.sub("", source)
    source = EXPORT_NAMED_RE.sub(r"\1\2", source)
    source = EXPORT_BRACE_RE.sub("", source)
    return source


# ---------------------------------------------------------------------------
# Data-module aliasing
# ---------------------------------------------------------------------------

def read(path: str) -> str:
    with open(path, encoding="utf-8") as f:
        return f.read()


def build_data_module(source: str, export_name: str) -> str:
    """
    Wrap a data module's source so its default export is captured as a const.
    `export default { … }` becomes: const <export_name> = { … };
    """
    source = IMPORT_RE.sub("", source)
    source = EXPORT_DEFAULT_RE.sub(f"const {export_name} = ", source)
    return source.strip()


# ---------------------------------------------------------------------------
# report.js patching
#
# Two changes needed for the standalone bundle:
#
#  a) Rename $/$$ helpers to $r/$$r to avoid collision with app.js's
#     identically-named helpers (both files define `const $ = …` at module
#     scope — fine in separate modules, fatal in a flat bundle).
#
#  b) Replace the auto-call `init().catch(console.error)` with an
#     assignment to `window.__reportInit` so app.js can invoke it after
#     scoring, passing the result directly without going through
#     sessionStorage or a page navigation.
# ---------------------------------------------------------------------------

REPORT_DOLLAR_DECL_RE = re.compile(
    r'^(const\s+)(\$\$?)(\s*=)',
    re.MULTILINE,
)
REPORT_DOLLAR_CALL_RE = re.compile(r'(?<![a-zA-Z0-9_])(\$\$?)(?=\s*\()')

# The last line(s) of report.js that auto-call init on page load.
# In standalone mode we want `init` to be callable by app.js instead.
REPORT_INIT_AUTOCALL_RE = re.compile(
    r'init\(\)\.catch\(console\.error\);?\s*$',
    re.MULTILINE,
)


def build_report_module(source: str) -> str:
    """Strip module syntax, rename $/$$ helpers, and expose init() for app.js."""
    source = strip_module_syntax(source)

    # a) Rename declarations: `const $ =` → `const $r =`
    source = REPORT_DOLLAR_DECL_RE.sub(
        lambda m: m.group(1) + m.group(2) + "r" + m.group(3),
        source,
    )
    # a) Rename call sites: `$(` → `$r(`, `$$(` → `$$r(`
    source = REPORT_DOLLAR_CALL_RE.sub(
        lambda m: m.group(0) + "r",
        source,
    )

    # b) Replace auto-call with a window-exposed handle
    source = REPORT_INIT_AUTOCALL_RE.sub(
        "// Standalone: init() is called by app.js after scoring completes.\n"
        "window.__reportInit = (result) => init(result).catch(console.error);",
        source,
    )

    return source.strip()


# ---------------------------------------------------------------------------
# app.js patching
#
# Two changes needed for the standalone bundle:
#
#  a) Replace the lazy `import("./scoring.js")` with a direct call to the
#     already-bundled `score()` function (dynamic imports are not available
#     in a non-module script context).
#
#  b) Replace `window.location.href = "report.html"` (page navigation) with
#     an in-page reveal: hide the assessment view (.page div), show
#     #report-view, scroll to top, then call window.__reportInit(result).
# ---------------------------------------------------------------------------

# Dynamic import block:
#   import("./scoring.js")
#     .then(({ score }) => score(answers, assessment))
#     .then(result => { … })
#     .catch(…)
# We replace the entire import chain with a single promise that resolves via
# the already-bundled score() function.
APP_DYNAMIC_IMPORT_RE = re.compile(
    r'import\(["\']\.\/scoring\.js["\']\)\s*\n'
    r'\s*\.then\(\(\{\s*score\s*\}\)\s*=>\s*score\(answers,\s*assessment\)\)',
    re.MULTILINE,
)

# Success-path redirect: `window.location.href = "report.html";`
APP_REDIRECT_SUCCESS_RE = re.compile(
    r"window\.location\.href\s*=\s*['\"]report\.html['\"];",
)
# Error-path redirect: `window.location.href = "report.html?fallback=1";`
APP_REDIRECT_FALLBACK_RE = re.compile(
    r"window\.location\.href\s*=\s*['\"]report\.html\?fallback=1['\"];",
)

# Shared in-page reveal snippet
_REVEAL = (
    "document.querySelector('.page').style.display = 'none';\n"
    "        const rv = document.getElementById('report-view');\n"
    "        rv.style.display = '';\n"
    "        window.scrollTo({ top: 0, behavior: 'instant' });\n"
)


def build_app_module(source: str) -> str:
    """Strip module syntax and apply standalone-specific patches."""
    source = strip_module_syntax(source)

    # a) Replace dynamic import chain with a direct call
    source = APP_DYNAMIC_IMPORT_RE.sub(
        "Promise.resolve(score(answers, assessmentData))",
        source,
    )

    # b) Success path: show report view and pass real result to init
    source = APP_REDIRECT_SUCCESS_RE.sub(
        _REVEAL + "        window.__reportInit(result);",
        source,
    )

    # c) Error/fallback path: show report view, pass null so init uses mock
    source = APP_REDIRECT_FALLBACK_RE.sub(
        _REVEAL + "        window.__reportInit(null);",
        source,
    )

    return source.strip()


# ---------------------------------------------------------------------------
# Extract the body content from report.html (everything inside <body …> … </body>)
# ---------------------------------------------------------------------------

REPORT_BODY_RE = re.compile(
    r'<body[^>]*>(.*?)</body>',
    re.DOTALL | re.IGNORECASE,
)


def extract_report_body(report_html: str) -> str:
    """Return the inner HTML of report.html's <body> tag."""
    m = REPORT_BODY_RE.search(report_html)
    if not m:
        raise ValueError("Could not find <body> in report.html")
    # Strip the <script> tags (js/report.js and vercel analytics)
    body = m.group(1)
    body = re.sub(
        r'\s*<script[^>]*src=["\'][^"\']*["\'][^>]*>\s*</script>',
        "",
        body,
    )
    return body.strip()


# ---------------------------------------------------------------------------
# Extra Carbon CDN components used only by the report (not in index.html)
# ---------------------------------------------------------------------------

REPORT_CDN_SCRIPTS = """\
  <script type="module" src="https://1.www.s81c.com/common/carbon/web-components/tag/v2/latest/tabs.min.js"></script>
  <script type="module" src="https://1.www.s81c.com/common/carbon/web-components/tag/v2/latest/tag.min.js"></script>
  <script type="module" src="https://1.www.s81c.com/common/carbon/web-components/tag/v2/latest/tooltip.min.js"></script>
  <script type="module" src="https://1.www.s81c.com/common/carbon/web-components/tag/v2/latest/menu-button.min.js"></script>
  <script type="module" src="https://1.www.s81c.com/common/carbon/web-components/tag/v2/latest/menu.min.js"></script>
  <script type="module" src="https://1.www.s81c.com/common/carbon/web-components/tag/v2/latest/textarea.min.js"></script>"""


# ---------------------------------------------------------------------------
# Main bundling routine
# ---------------------------------------------------------------------------

def bundle():
    # 1. Read source files
    html         = read(INDEX_HTML)
    report_html  = read(REPORT_HTML)
    css          = read(CSS_FILE)
    css_splash   = read(CSS_SPLASH_FILE)
    css_report   = read(CSS_REPORT_FILE)

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
    # Alias used by app.js (`import assessment from …`)
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
    parts.append(build_report_module(report_src))

    parts.append("\n// ── js/app.js ─────────────────────────────────────────────")
    parts.append(build_app_module(app_src))

    js_bundle = "\n".join(parts)

    # 3. Inline CSS: replace <link rel="stylesheet" href="css/styles.css" />
    css_tag = f"<style>\n{css}\n</style>"
    html = re.sub(
        r'<link\s[^>]*href=["\']css/styles\.css["\'][^>]*/?>',
        lambda _: css_tag,
        html,
    )

    # Inline css/splash.css
    css_splash_tag = f"<style>\n{css_splash}\n</style>"
    html = re.sub(
        r'<link\s[^>]*href=["\']css/splash\.css["\'][^>]*/?>',
        lambda _: css_splash_tag,
        html,
    )

    # 4. Inject report.html body content into #report-view
    report_body = extract_report_body(report_html)
    # Inline css/report.css as a <style> block inside the report-view div,
    # followed by the report body HTML.
    css_report_tag = f"<style>\n{css_report}\n</style>"
    report_view_content = f"\n{css_report_tag}\n{report_body}\n"
    html = re.sub(
        r'(<div\s+class="report-view"\s+id="report-view"[^>]*>)\s*(</div>)',
        lambda m: m.group(1) + report_view_content + m.group(2),
        html,
    )

    # 5. Add the extra Carbon CDN components needed by the report
    html = re.sub(
        r'(<!-- Carbon Web Components \(v2\) -->)',
        lambda m: m.group(1) + "\n" + REPORT_CDN_SCRIPTS,
        html,
    )

    # 6. Inline JS: replace <script type="module" src="js/app.js"></script>
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

    # 7. Strip Vercel analytics (server-side only, not needed in standalone)
    html = re.sub(
        r'\s*<script\s[^>]*cdn\.vercel-insights\.com[^>]*>\s*</script>',
        "",
        html,
    )

    # 8. Write output
    with open(OUT, "w", encoding="utf-8") as f:
        f.write(html)

    kb = os.path.getsize(OUT) / 1024
    print(f"✓  Bundled → assessment-standalone.html  ({kb:.1f} KB)")
    print("   Open the file directly in any browser — no server needed.")


def build_logic_module(source: str) -> str:
    """Strip import/export syntax from a logic module."""
    return strip_module_syntax(source).strip()


if __name__ == "__main__":
    # Quick pre-flight: warn if the data modules look stale / missing
    for label, path in MODULE_FILES:
        if not os.path.exists(path):
            print(f"✗  Missing: {label}  — run the compilers first.", file=sys.stderr)
            sys.exit(1)
    bundle()
