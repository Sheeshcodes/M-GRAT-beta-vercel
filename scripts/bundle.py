#!/usr/bin/env python3
"""
Single-file bundler for the MAS Growth Readiness Assessment.

    python3 scripts/bundle.py

Reads  : index.html, report.html, css/styles.css, css/splash.css,
         css/report.css, js/app.js, js/scoring.js, js/report.js,
         data/assessment.js, data/report_data.js, data/journey.js,
         data/milestone-actions.js
Writes : MAS-growth-assessment-self-serve.html  (in the project root)

The output file has no local dependencies — it can be double-clicked
directly from Finder / Explorer and runs over the file:// protocol
without a dev server or CORS restrictions.

Key design decisions
──────────────────────────────────────────────────────────────────────
• Both the assessment view and the report view are embedded in one HTML
  document, switching between them with display:none / display:block.
• The sessionStorage handoff between app.js → report.js is replaced by
  a direct in-process call: after scoring, app.js calls
  window.__showReport(result) which runs report.js's init() directly.
• PDF exports are the site's own, unchanged: Download → "Full PDF report"
  prints the report with every section opened (css/report.css print block,
  initPrint in report.js), and "Your responses" prints the session details
  and every answer as a separate document. Nothing here restyles print.
• Carbon Web Components and the IBM Plex fonts are embedded, so the file
  works with no internet connection (falls back to the CDN if the build
  machine is offline).
"""
import base64
import os
import re
import sys
import urllib.parse

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT  = os.path.join(ROOT, "MAS-growth-assessment-self-serve.html")

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def read(path: str) -> str:
    with open(path, encoding="utf-8") as f:
        return f.read()


def file_to_data_uri(rel_path: str) -> str:
    """Read a local asset file and return a base64 data URI."""
    clean_path = urllib.parse.unquote(rel_path.strip().lstrip("./"))
    # Normalize path if it points to ../assets or assets
    if clean_path.startswith("../assets/"):
        clean_path = clean_path[3:]
    elif not clean_path.startswith("assets/"):
        clean_path = os.path.join("assets", clean_path)

    full_path = os.path.join(ROOT, clean_path)
    if not os.path.exists(full_path):
        return rel_path

    ext = os.path.splitext(clean_path)[1].lower()
    mime_types = {
        ".mp4":  "video/mp4",
        ".webm": "video/webm",
        ".svg":  "image/svg+xml",
        ".png":  "image/png",
        ".jpg":  "image/jpeg",
        ".jpeg": "image/jpeg",
        ".gif":  "image/gif",
        ".otf":  "font/otf",
        ".ttf":  "font/ttf",
        ".woff": "font/woff",
        ".woff2":"font/woff2",
    }
    mime = mime_types.get(ext, "application/octet-stream")
    with open(full_path, "rb") as f:
        encoded = base64.b64encode(f.read()).decode("ascii")
    return f"data:{mime};base64,{encoded}"


def inline_all_assets(text: str) -> str:
    """Find and replace all relative asset references (HTML/CSS/JS) with data URIs."""
    # 1. HTML attributes: src="assets/...", data-src="assets/...", etc.
    def replace_attr(m):
        attr = m.group(1)
        url = m.group(2)
        if url.startswith("data:") or url.startswith("http://") or url.startswith("https://"):
            return m.group(0)
        return f'{attr}="{file_to_data_uri(url)}"'

    text = re.sub(r'\b(src|data-src)=["\']((?:\.\./)?assets/[^"\']+)["\']', replace_attr, text)

    # 2. CSS url(...)
    def replace_css_url(m):
        raw_url = m.group(1).strip('\'"')
        if raw_url.startswith("data:") or raw_url.startswith("http://") or raw_url.startswith("https://"):
            return m.group(0)
        return f'url("{file_to_data_uri(raw_url)}")'

    text = re.sub(r'url\(\s*(["\']?(?:\.\./)?assets/[^"\'\)]+["\']?)\s*\)', replace_css_url, text)

    # 3. JS string literals: "assets/...", 'assets/...'
    def replace_js_asset(m):
        quote = m.group(1)
        url = m.group(2)
        return f'{quote}{file_to_data_uri(url)}{quote}'

    text = re.sub(r'(["\'])((?:\.\./)?assets/[^"\']+)\1', replace_js_asset, text)

    return text


IMPORT_RE         = re.compile(r'^\s*import\s+.*?from\s+["\'].*?["\'];?\s*$', re.MULTILINE)
EXPORT_DEFAULT_RE = re.compile(r'\bexport\s+default\s+')
EXPORT_NAMED_RE   = re.compile(r'\bexport\s+(function|const|let|var|class|async\s+function)\b')
EXPORT_BRACE_RE   = re.compile(r'\bexport\s*\{[^}]*\}\s*;?')


def strip_imports_exports(source: str) -> str:
    source = IMPORT_RE.sub("", source)
    source = EXPORT_DEFAULT_RE.sub("", source)
    source = EXPORT_NAMED_RE.sub(lambda m: m.group(1), source)
    source = EXPORT_BRACE_RE.sub("", source)
    return source.strip()


def build_data_module(source: str, export_name: str) -> str:
    """Capture a data module's default export as a named const in outer scope."""
    source = IMPORT_RE.sub("", source)
    source = EXPORT_DEFAULT_RE.sub(f"const {export_name} = ", source)
    return source.strip()


def build_scoped_module(label: str, source: str, exports: list) -> str:
    """
    Wrap a logic module in a block scope so its internal `const` declarations
    don't collide with identically-named consts in other modules.

    exports: list of (inner_name, outer_name) pairs.

    Strategy for each exported name:
    - Pre-declare it as `var` in the outer IIFE scope (var is function-scoped,
      visible outside the block).
    - Inside the block, rewrite every declaration of that name so it assigns
      directly to the outer var instead of creating a shadowing block-scoped
      binding:
        const NAME = …   →   NAME = …    (no const/let/var keyword)
        async function NAME(  →  NAME = async function(
        function NAME(        →  NAME = function(
    - This eliminates the shadowing entirely — there is no inner binding to
      conflict with the outer var.
    """
    source = strip_imports_exports(source)

    for (inner, outer) in exports:
        # async function NAME( → outer = async function(
        source = re.sub(
            rf'\basync\s+function\s+{re.escape(inner)}\s*\(',
            f'{outer} = async function(',
            source,
        )
        # function NAME( → outer = function(
        source = re.sub(
            rf'\bfunction\s+{re.escape(inner)}\s*\(',
            f'{outer} = function(',
            source,
        )
        # const/let/var NAME = … → outer = …  (strip the keyword)
        source = re.sub(
            rf'\b(?:const|let|var)\s+{re.escape(inner)}\s*=',
            f'{outer} =',
            source,
        )

    # Pre-declare exported names in outer scope with var
    pre = "\n".join(f"var {outer};" for (_, outer) in exports) if exports else ""

    return f"""{pre}
// ── {label} ──────────────────────────────────────────────────────────
{{
{source}
}}"""


# ---------------------------------------------------------------------------
# The "show report" bridge and PDF export glue inserted after app.js
# ---------------------------------------------------------------------------

BRIDGE_JS = r"""
// ── Standalone bridge ─────────────────────────────────────────────────────
// Replaces the sessionStorage + window.location redirect used in the
// multi-page version.  After scoring finishes, app.js calls this instead.

window.__showReport = async function(result, answers) {
  // Store on window so report init() can read it (report.js checks
  // sessionStorage first; we pre-populate it here as a fallback store).
  try { sessionStorage.setItem("scoringResult", JSON.stringify(result)); } catch(_) {}
  // "Your responses" reads the answers from sessionStorage on the site. Hand
  // them over directly too, so the download still works where a browser keeps
  // no storage for files opened from disk.
  window.__assessmentResponses = { submittedAt: new Date().toISOString(), answers: answers || {} };

  // Hide assessment, show report
  document.getElementById("view-assessment").style.display = "none";
  const reportView = document.getElementById("view-report");
  reportView.style.display = "block";
  document.body.classList.remove("splash-active");
  document.body.classList.add("report-page");
  window.scrollTo({ top: 0, behavior: "instant" });

  // Run the report renderer (already loaded in this scope)
  await initReport(result);
};

"""

# ---------------------------------------------------------------------------
# Print: the report's own print styles (css/report.css) do all the work. The
# only extra is keeping the assessment shell, which report.html doesn't have,
# off the page.
# ---------------------------------------------------------------------------

SHELL_PRINT_CSS = """
@media print {
  #view-assessment,
  #splash-screen { display: none !important; }
}
"""


# ---------------------------------------------------------------------------
# Patch app.js submit handler to call __showReport instead of redirecting
# ---------------------------------------------------------------------------

def patch_app_js(source: str) -> str:
    """
    1. Replace the dynamic import("./scoring.js") with a direct call to the
       already-bundled `score` function (dynamic import fails over file://).
    2. Replace window.location.href redirects with window.__showReport() calls.
    3. Use window.__MOCK_RESULT__ for the error fallback so it's accessible
       across block scopes (MOCK_RESULT lives in the report.js block).
    4. Remove the await Promise.all(customElements.whenDefined) gate.
    """
    # Replace the entire dynamic-import submit block with a direct score() call
    old = (
        '    import("./scoring.js")\n'
        '      .then(({ score }) => score(answers, assessment))\n'
        '      .then(result => {\n'
        '        try {\n'
        '          sessionStorage.setItem("scoringResult", JSON.stringify(result));\n'
        '        } catch {\n'
        '          // sessionStorage quota exceeded — proceed anyway, report falls back to mock\n'
        '        }\n'
        '        window.location.href = "report.html";\n'
        '      })\n'
        '      .catch(err => {\n'
        '        console.error("Scoring failed:", err);\n'
        '        // Still redirect so the report page renders with mock data\n'
        '        window.location.href = "report.html";\n'
        '      });'
    )
    new = (
        '    Promise.resolve()\n'
        '      .then(() => score(answers, assessment))\n'
        '      .then(result => {\n'
        '        try {\n'
        '          sessionStorage.setItem("scoringResult", JSON.stringify(result));\n'
        '        } catch (_) {}\n'
        '        (result._rawAnswers = answers, window.__showReport(result, answers));\n'
        '      })\n'
        '      .catch(err => {\n'
        '        console.error("Scoring failed:", err);\n'
        '        window.__showReport(window.__MOCK_RESULT__ || {}, {});\n'
        '      });'
    )
    source = source.replace(old, new)

    # Remove the await Promise.all(customElements.whenDefined(...)) gate.
    # In the standalone the Carbon scripts load from CDN — if they haven't
    # registered yet, this await hangs forever and render() never runs.
    # Carbon custom elements upgrade themselves when they do register, so
    # we don't need to wait. nextLabel is searched after render() with a
    # fallback in case the shadow root isn't ready yet.
    old_await = (
        'await Promise.all(\n'
        '  ["cds-checkbox", "cds-radio-button", "cds-button", "cds-progress-bar", "cds-toggletip"].map((t) =>\n'
        '    customElements.whenDefined(t)\n'
        '  )\n'
        ');\n'
        'render();'
    )
    new_await = 'render(); // no await in standalone — Carbon upgrades asynchronously'
    source = source.replace(old_await, new_await)

    return source


def patch_report_js(source: str) -> str:
    """
    • Rename init() → initReport() so it doesn't conflict with app.js boot.
    • Accept result as a parameter (instead of only reading sessionStorage).
    • Remove the self-invocation at the bottom (init().catch(console.error)).
    • Remove "Talk to a seller" buttons (standalone doesn't need them).
    • "Your responses" reads the answers handed over by __showReport.
    """
    # Rename init to initReport
    source = re.sub(r'\basync function init\(\)', 'async function initReport(result)', source)

    # Expose MOCK_RESULT on window so the app.js catch block can reach it
    # (MOCK_RESULT is defined inside the report.js block scope).
    source = source.replace(
        'const MOCK_RESULT = {',
        'window.__MOCK_RESULT__ = MOCK_RESULT = {',
    )

    # Replace the sessionStorage read block with a simple use of the passed result
    old_read = '''  let result;
  try {
    const stored = sessionStorage.getItem("scoringResult");
    result = stored ? JSON.parse(stored) : MOCK_RESULT;
  } catch {
    result = MOCK_RESULT;
  }'''
    new_read = '  result = result ?? MOCK_RESULT;'
    source = source.replace(old_read, new_read)

    # "Your responses" — use the answers __showReport handed over, then fall
    # back to sessionStorage as the site does.
    anchor = 'function loadStoredResponses() {\n'
    if anchor not in source:
        raise SystemExit("✗  bundle.py: loadStoredResponses() not found in js/report.js")
    source = source.replace(
        anchor,
        anchor + '  if (window.__assessmentResponses) return window.__assessmentResponses;\n',
    )

    # Remove the self-invocation
    source = re.sub(r'\ninitReport\(\)\.catch\(console\.error\);?\s*$', '', source)
    source = re.sub(r'\ninit\(\)\.catch\(console\.error\);?\s*$', '', source)

    # Patch dynamic template literal asset toggle in stage card expansion
    # toggleBtn.querySelector("img").src = `assets/${isExpanded ? "cb904" : "3f8ce"}.svg`;
    source = source.replace(
        'toggleBtn.querySelector("img").src = `assets/${isExpanded ? "cb904" : "3f8ce"}.svg`;',
        f'toggleBtn.querySelector("img").src = isExpanded ? "{file_to_data_uri("assets/cb904.svg")}" : "{file_to_data_uri("assets/3f8ce.svg")}";'
    )

    # ── Standalone-only UI patches ──────────────────────────────────────────

    # 1. Remove "Talk to a seller" button at the bottom of each expansion card
    source = source.replace(
        "\n    <div>\n      <cds-button kind=\"tertiary\" size=\"lg\">\n        Talk to a seller\n        ${ICON_USER_SERVICE}\n      </cds-button>\n    </div>",
        "",
    )

    # 2. Remove the entire accelerate card (standalone doesn't need seller CTA)
    source = re.sub(
        r'\s*<div class="accelerate-card">.*?</div>\s*</div>',
        "",
        source,
        flags=re.DOTALL,
    )

    return source


def patch_app_js_pass_answers(source: str) -> str:
    """
    Store raw answers on the result object so report.js can render them.
    """
    old = 'window.__showReport(result, answers);'
    new = '(result._rawAnswers = answers, window.__showReport(result, answers));'
    source = source.replace(old, new)
    return source


# ---------------------------------------------------------------------------
# Build the report view HTML shell from report.html
# ---------------------------------------------------------------------------

def extract_report_body(report_html: str) -> str:
    """
    Extract everything inside <body>…</body> from report.html, strip the
    <script> tags (we inline JS ourselves), and return the inner HTML.
    """
    body_match = re.search(r'<body[^>]*>(.*)</body>', report_html, re.DOTALL)
    if not body_match:
        raise ValueError("Could not find <body> in report.html")
    body = body_match.group(1)
    # Remove script tags
    body = re.sub(r'<script\b[^>]*>.*?</script>', '', body, flags=re.DOTALL)
    return body.strip()


def replace_talk_to_seller_buttons(html: str) -> str:
    """
    Remove all 'Talk to a seller' cds-button blocks from the report HTML shell
    — sidebar, mobile nav, report-end-actions, and any others. The Download
    menu beside them stays.
    """
    # Remove every cds-button block whose visible text contains "Talk to a seller"
    html = re.sub(
        r'<cds-button[^>]*>\s*Talk to a seller.*?</cds-button>',
        '',
        html,
        flags=re.DOTALL,
    )
    return html


# ---------------------------------------------------------------------------
# Patch app.js for standalone execution
# ---------------------------------------------------------------------------

def patch_app_js_standalone(source: str) -> str:
    """
    Patch app.js so it runs cleanly in standalone mode while preserving full splash
    screen functionality, video observers, and transitions:
    - nextLabel: evaluated lazily so it works before cds-button upgrades.
    """
    # nextLabel reads els.btnNext.childNodes to find the text node for "Next"/"Submit".
    # In the standalone render() runs before the cds-button shadow DOM upgrades
    # (we removed the await gate). Replace the static const with a lazy getter
    # so it's re-evaluated each call and never throws on an empty childNodes list.
    old_nextlabel = (
        'const nextLabel = Array.from(els.btnNext.childNodes).find(\n'
        '  (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim()\n'
        ');'
    )
    new_nextlabel = (
        '// nextLabel: evaluated lazily so it works before cds-button upgrades.\n'
        'const getNextLabel = () =>\n'
        '  Array.from(els.btnNext.childNodes).find(\n'
        '    (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim()\n'
        '  );'
    )
    source = source.replace(old_nextlabel, new_nextlabel)

    # Patch render() to use getNextLabel()
    source = source.replace(
        'nextLabel.textContent = state.page === total - 1 ? "Submit" : "Next";',
        'const nl = getNextLabel(); if (nl) nl.textContent = state.page === total - 1 ? "Submit" : "Next";',
    )

    return source


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

# ---------------------------------------------------------------------------
# Offline: bake Carbon Web Components and IBM Plex into the file
# ---------------------------------------------------------------------------
# Without this the file still pulls its checkboxes, radio buttons, tooltips and
# menus from IBM's CDN and its type from Google Fonts — so with no internet the
# questions render as blank tiles and cannot be answered. Everything is fetched
# once, at build time, and embedded; the finished file needs no network.
#
# Carbon ships as ES modules that import shared chunks by relative path. Each
# module is fetched, its relative imports rewritten to absolute CDN URLs, and an
# import map points every one of those URLs at an embedded copy — so the page
# loads exactly the code it did before, from inside itself.

import base64 as _b64
import html as _html
import json as _json
import urllib.request as _urlreq
from urllib.parse import urljoin as _urljoin

_FETCH_UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
             "(KHTML, like Gecko) Chrome/126.0 Safari/537.36")
_CARBON_TAG_RE = re.compile(
    r"""<script\s+type=["']module["']\s+src=["'](https://1\.www\.s81c\.com/[^"']+)["']\s*>\s*</script>""")
_MODULE_SPEC_RE = re.compile(r"""((?:\bfrom|\bimport)\s*\(?\s*)(["'])(\.{1,2}/[^"']+)\2""")
_FONT_LINK_RE = re.compile(r"""<link\s[^>]*href=["'](https://fonts\.googleapis\.com/css2\?[^"']+)["'][^>]*>""")
_CDN_HINT_RE = re.compile(
    r"""\s*<link\s[^>]*rel=["'](?:preconnect|dns-prefetch)["'][^>]*"""
    r"""href=["']https://(?:1\.www\.s81c\.com|fonts\.googleapis\.com|fonts\.gstatic\.com)["'][^>]*>""")
# Latin and Latin Extended cover English and accented company names; the other
# subsets Google offers would add weight for scripts this content never uses.
_FONT_SUBSETS = ("latin", "latin-ext")


def _fetch(url: str) -> bytes:
    req = _urlreq.Request(url, headers={"User-Agent": _FETCH_UA})
    with _urlreq.urlopen(req, timeout=30) as resp:
        return resp.read()


def bake_carbon_offline(html: str) -> str:
    entries = _CARBON_TAG_RE.findall(html)
    if not entries:
        return html
    modules, todo = {}, list(entries)
    while todo:
        url = todo.pop()
        if url in modules:
            continue
        source = _fetch(url).decode("utf-8")

        def absolutise(m, base=url):
            target = _urljoin(base, m.group(3))
            todo.append(target)
            return f"{m.group(1)}{m.group(2)}{target}{m.group(2)}"

        modules[url] = _MODULE_SPEC_RE.sub(absolutise, source)

    import_map = {"imports": {
        url: "data:text/javascript;base64," + _b64.b64encode(src.encode("utf-8")).decode("ascii")
        for url, src in modules.items()
    }}
    map_tag = '<script type="importmap">' + _json.dumps(import_map, separators=(",", ":")) + "</script>"
    # Each <script src=...> becomes an import, which the map resolves to the
    # embedded copy. The map has to come before any module script, so it goes
    # first in <head>.
    html = _CARBON_TAG_RE.sub(lambda m: f'<script type="module">import "{m.group(1)}";</script>', html)
    html = re.sub(r"<head(\s[^>]*)?>", lambda m: m.group(0) + "\n" + map_tag, html, count=1)
    size_kb = sum(len(v) for v in import_map["imports"].values()) / 1024
    print(f"   Carbon: {len(entries)} components, {len(modules)} modules baked in ({size_kb:.0f} KB)")
    return html


def bake_fonts_offline(html: str) -> str:
    m = _FONT_LINK_RE.search(html)
    if not m:
        return html
    css = _fetch(_html.unescape(m.group(1))).decode("utf-8")
    faces = []
    for subset, face in re.findall(r"/\*\s*([a-z-]+)\s*\*/\s*(@font-face\s*\{[^}]+\})", css):
        if subset not in _FONT_SUBSETS:
            continue

        def embed(u):
            data = _b64.b64encode(_fetch(u.group(1))).decode("ascii")
            return f"url(data:font/woff2;base64,{data})"

        faces.append(re.sub(r"url\((https://[^)]+)\)", embed, face))
    style = "<style>/* IBM Plex, embedded */\n" + "\n".join(faces) + "\n</style>"
    html = html[:m.start()] + style + html[m.end():]
    print(f"   Fonts: {len(faces)} IBM Plex faces baked in")
    return html


def bake_offline(html: str) -> tuple:
    """Returns (html, baked). Falls back to the online-only file, loudly, when
    the build machine cannot reach the CDN."""
    try:
        html = bake_carbon_offline(html)
        html = bake_fonts_offline(html)
    except Exception as err:  # network down, CDN change, …
        print(f"⚠  Could not embed Carbon/fonts ({err}). The file will need internet.",
              file=sys.stderr)
        return html, False
    html = _CDN_HINT_RE.sub("", html)
    return html, True


# ---------------------------------------------------------------------------
# Checks on the finished file
# ---------------------------------------------------------------------------
# Every patch above is a text replacement, and a replacement that finds nothing
# changes nothing and says nothing. These check the *result* instead, so an edit
# to app.js or report.js that moves a patch's target stops the build rather than
# shipping a file with a dead button.

def verify_bundle(html: str, baked: bool) -> None:
    must_have = {
        "report hand-off (__showReport)": "window.__showReport",
        # build_scoped_module turns `async function initReport(` into this form
        "report renderer exposed (initReport)": "initReport = async function(result)",
        "Download menu (Full PDF report)": 'data-download="pdf"',
        "Download menu (Your responses)": 'data-download="responses"',
        "report PDF print handler": "initPrint(result.contact)",
        "responses PDF handler": "initResponsesDownload(",
        "answers handed to the responses PDF":
            "if (window.__assessmentResponses) return window.__assessmentResponses;",
        "session details page": 'id: "details"',
        "web-report-only note above Additional resources in the PDF":
            'class="report-eyebrow-row bonus-block__print-note"',
        "'Coming soon' on the checklist": "Coming soon",
    }
    must_not_have = {
        "redirect to report.html (report would never show)": 'window.location.href = "report.html"',
        "report auto-start (would run before scoring)": "\ninit().catch(console.error)",
        "'Talk to a seller' button": "Talk to a seller",
        "seller call-to-action card": 'class="accelerate-card"',
        "the old single Download PDF button": "js-download-pdf",
        "the old answers-in-report section": 'id="answers-section"',
        "a local file reference (breaks once shared)": 'src="assets/',
    }
    if baked:
        must_not_have.update({
            "a Carbon component loaded from the internet": 'src="https://1.www.s81c.com/',
            "a font loaded from the internet": "fonts.googleapis.com/css2",
        })
    problems = [f"missing: {k}" for k, v in must_have.items() if v not in html]
    problems += [f"still present: {k}" for k, v in must_not_have.items() if v in html]
    if problems:
        print("✗  Bundle check failed — not writing the file:", file=sys.stderr)
        for p in problems:
            print(f"     • {p}", file=sys.stderr)
        sys.exit(1)
    print(f"   Checks: {len(must_have) + len(must_not_have)} passed")


def bundle():
    # 1. Read source files
    index_html   = read(os.path.join(ROOT, "index.html"))
    report_html  = read(os.path.join(ROOT, "report.html"))
    css_styles   = read(os.path.join(ROOT, "css", "styles.css"))
    css_splash   = read(os.path.join(ROOT, "css", "splash.css"))
    css_report   = read(os.path.join(ROOT, "css", "report.css"))

    assessment_src  = read(os.path.join(ROOT, "data", "assessment.js"))
    report_data_src = read(os.path.join(ROOT, "data", "report_data.js"))
    journey_src     = read(os.path.join(ROOT, "data", "journey.js"))
    actions_src     = read(os.path.join(ROOT, "data", "milestone-actions.js"))
    scoring_src     = read(os.path.join(ROOT, "js",   "scoring.js"))
    report_src      = read(os.path.join(ROOT, "js",   "report.js"))
    app_src         = read(os.path.join(ROOT, "js",   "app.js"))

    # 2. Patch logic modules
    report_src = patch_report_js(report_src)
    app_src    = patch_app_js(app_src)
    app_src    = patch_app_js_pass_answers(app_src)
    app_src    = patch_app_js_standalone(app_src)

    # 3. Build JS bundle.
    #
    # Each logic module is wrapped in its own block scope so internal `const`
    # declarations don't collide across files. Only names that must cross block
    # boundaries are hoisted as `var`. Data modules stay at top level.
    parts = []

    parts.append("// ── data/assessment.js ─────────────────────────────────────────")
    parts.append(build_data_module(assessment_src, "assessmentData"))
    parts.append("var assessment = assessmentData;")

    parts.append("\n// ── data/report_data.js ────────────────────────────────────────")
    parts.append(build_data_module(report_data_src, "reportData"))

    parts.append("\n// ── data/journey.js ────────────────────────────────────────────")
    parts.append(build_data_module(journey_src, "journey"))

    parts.append("\n// ── data/milestone-actions.js ──────────────────────────────────")
    parts.append(build_data_module(actions_src, "milestoneActions"))

    parts.append(build_scoped_module(
        "js/scoring.js", scoring_src,
        [("score", "score"), ("MILESTONE_BY_ID", "MILESTONE_BY_ID"), ("DIMENSIONS", "DIMENSIONS")],
    ))

    parts.append(build_scoped_module(
        "js/report.js", report_src,
        [("initReport", "initReport")],
    ))

    parts.append(BRIDGE_JS)

    parts.append(build_scoped_module(
        "js/app.js", app_src,
        [],
    ))

    js_bundle = "\n".join(parts)

    # 4. Combined CSS (including splash.css for standalone splash screen)
    combined_css = "\n\n".join([
        "/* === styles.css === */", css_styles,
        "/* === splash.css === */", css_splash,
        "/* === report.css === */", css_report,
        "/* === print: assessment shell === */", SHELL_PRINT_CSS,
    ])

    # 5. Extract report body
    report_body = extract_report_body(report_html)
    report_body = replace_talk_to_seller_buttons(report_body)

    # 6. Build the shell from index.html
    html = index_html

    # Inline CSS
    css_tag = f"<style>\n{combined_css}\n</style>"
    html = re.sub(r'<link\s[^>]*href=["\']css/styles\.css["\'][^>]*/?>',
                  lambda _: css_tag, html)
    html = re.sub(r'<link\s[^>]*href=["\']css/splash\.css["\'][^>]*/?>',
                  '', html)

    # Add Carbon Web Components needed by the report
    extra_carbon = """\
  <script type="module" src="https://1.www.s81c.com/common/carbon/web-components/tag/v2/latest/tabs.min.js"></script>
  <script type="module" src="https://1.www.s81c.com/common/carbon/web-components/tag/v2/latest/tag.min.js"></script>
  <script type="module" src="https://1.www.s81c.com/common/carbon/web-components/tag/v2/latest/tooltip.min.js"></script>
  <script type="module" src="https://1.www.s81c.com/common/carbon/web-components/tag/v2/latest/menu-button.min.js"></script>
  <script type="module" src="https://1.www.s81c.com/common/carbon/web-components/tag/v2/latest/menu.min.js"></script>
  <script type="module" src="https://1.www.s81c.com/common/carbon/web-components/tag/v2/latest/textarea.min.js"></script>"""
    html = html.replace('</head>', extra_carbon + '\n</head>')

    # Wrap assessment in view-assessment, append view-report
    html = html.replace(
        '<div class="page">',
        '<div id="view-assessment">\n  <div class="page">',
    )
    html = html.replace(
        '</div>\n\n  <div class="report-view" id="report-view" style="display: none;"></div>',
        '  </div>\n</div><!-- /#view-assessment -->\n\n'
        '<div id="view-report" style="display:none;">\n'
        + report_body + '\n'
        '</div><!-- /#view-report -->',
    )

    # Inline JS bundle
    js_tag = f'<script>\n(async () => {{\n{js_bundle}\n}})();\n</script>'
    html = re.sub(
        r'<script\s+type=["\']module["\'][^>]*src=["\']js/app\.js["\'][^>]*>\s*</script>',
        lambda _: js_tag,
        html,
    )

    # Remove Vercel analytics
    html = re.sub(r'<script[^>]*vercel-insights[^>]*></script>', '', html)

    # 7. Convert all asset references to Base64 data URIs
    html = inline_all_assets(html)

    # 8. Embed Carbon and the fonts so the file works with no internet, then
    #    check the result before anything is written.
    html, baked = bake_offline(html)
    verify_bundle(html, baked)

    # 9. Write output
    with open(OUT, "w", encoding="utf-8") as f:
        f.write(html)

    kb = os.path.getsize(OUT) / 1024
    print(f"✓  Bundled → MAS-growth-assessment-self-serve.html  ({kb:.1f} KB)")
    print("   Splash screen active on open with animation & media assets.")
    print("   'Start assessment' transitions to assessment form.")
    print("   Complete all pages → Submit → Report renders in-place.")
    print("   Download → Full PDF report / Your responses → Save as PDF.")


if __name__ == "__main__":
    for label, path in [
        ("data/assessment.js",       os.path.join(ROOT, "data", "assessment.js")),
        ("data/report_data.js",      os.path.join(ROOT, "data", "report_data.js")),
        ("data/journey.js",          os.path.join(ROOT, "data", "journey.js")),
        ("data/milestone-actions.js",os.path.join(ROOT, "data", "milestone-actions.js")),
        ("js/scoring.js",            os.path.join(ROOT, "js",   "scoring.js")),
        ("js/report.js",             os.path.join(ROOT, "js",   "report.js")),
        ("js/app.js",                os.path.join(ROOT, "js",   "app.js")),
    ]:
        if not os.path.exists(path):
            print(f"✗  Missing: {label}  — run the compilers first.", file=sys.stderr)
            sys.exit(1)
    bundle()
