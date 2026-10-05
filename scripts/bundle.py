#!/usr/bin/env python3
"""Single-file bundler for the MAS Growth Readiness Assessment.

    python3 scripts/bundle.py
"""
from __future__ import annotations

import base64
import html as html_lib
import json
import os
import re
import sys
import urllib.parse
import urllib.request
from typing import Match

from common import ROOT_DIR

OUTPUT_HTML = os.path.join(ROOT_DIR, "MAS-growth-assessment-self-serve.html")

MIME_TYPES: dict[str, str] = {
    ".mp4": "video/mp4",
    ".webm": "video/webm",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".otf": "font/otf",
    ".ttf": "font/ttf",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
}

FETCH_USER_AGENT = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36"
)
FONT_SUBSETS = ("latin", "latin-ext")

IMPORT_REGEX = re.compile(r"^\s*import\s+.*?from\s+[\"'].*?[\"'];?\s*$", re.MULTILINE)
EXPORT_DEFAULT_REGEX = re.compile(r"\bexport\s+default\s+")
EXPORT_NAMED_REGEX = re.compile(r"\bexport\s+(function|const|let|var|class|async\s+function)\b")
EXPORT_BRACE_REGEX = re.compile(r"\bexport\s*\{[^}]*\}\s*;?")
CARBON_TAG_REGEX = re.compile(
    r"""<script\s+type=["']module["']\s+src=["'](https://1\.www\.s81c\.com/[^"']+)["']\s*>\s*</script>"""
)
MODULE_SPEC_REGEX = re.compile(r"""((?:\bfrom|\bimport)\s*\(?\s*)(["'])(\.{1,2}/[^"']+)\2""")
FONT_LINK_REGEX = re.compile(r"""<link\s[^>]*href=["'](https://fonts\.googleapis\.com/css2\?[^"']+)["'][^>]*>""")
CDN_HINT_REGEX = re.compile(
    r"""\s*<link\s[^>]*rel=["'](?:preconnect|dns-prefetch)["'][^>]*"""
    r"""href=["']https://(?:1\.www\.s81c\.com|fonts\.googleapis\.com|fonts\.gstatic\.com)["'][^>]*>"""
)

SHELL_PRINT_CSS = """
@media print {
  #view-assessment,
  #splash-screen { display: none !important; }
}
"""

BRIDGE_JS = r"""
// ── Standalone bridge ─────────────────────────────────────────────────────
// Replaces the sessionStorage + window.location redirect used in the
// multi-page version. After scoring finishes, app.js calls this instead.

window.__showReport = async function(result, answers) {
  try { sessionStorage.setItem("scoringResult", JSON.stringify(result)); } catch(_) {}
  window.__assessmentResponses = { submittedAt: new Date().toISOString(), answers: answers || {} };

  document.getElementById("view-assessment").style.display = "none";
  const reportView = document.getElementById("view-report");
  reportView.style.display = "block";
  document.body.classList.remove("splash-active");
  document.body.classList.add("report-page");
  window.scrollTo({ top: 0, behavior: "instant" });

  await initReport(result);
};
"""


def read_text(path: str) -> str:
    """Read full text content of a file with utf-8 encoding."""
    with open(path, encoding="utf-8") as f:
        return f.read()


def file_to_data_uri(rel_path: str) -> str:
    """Read a local asset file and return a base64 data URI."""
    clean_path = urllib.parse.unquote(rel_path.strip().lstrip("./"))
    if clean_path.startswith("../assets/"):
        clean_path = clean_path[3:]
    elif not clean_path.startswith("assets/"):
        clean_path = os.path.join("assets", clean_path)

    full_path = os.path.join(ROOT_DIR, clean_path)
    if not os.path.exists(full_path):
        return rel_path

    ext = os.path.splitext(clean_path)[1].lower()
    mime = MIME_TYPES.get(ext, "application/octet-stream")
    with open(full_path, "rb") as f:
        encoded = base64.b64encode(f.read()).decode("ascii")
    return f"data:{mime};base64,{encoded}"


def inline_all_assets(text: str) -> str:
    """Find and replace all relative asset references with base64 data URIs."""
    def replace_html_attr(match: Match[str]) -> str:
        attr = match.group(1)
        url = match.group(2)
        if url.startswith("data:") or url.startswith("http://") or url.startswith("https://"):
            return match.group(0)
        return f'{attr}="{file_to_data_uri(url)}"'

    def replace_css_url(match: Match[str]) -> str:
        raw_url = match.group(1).strip('\'"')
        if raw_url.startswith("data:") or raw_url.startswith("http://") or raw_url.startswith("https://"):
            return match.group(0)
        return f'url("{file_to_data_uri(raw_url)}")'

    def replace_js_asset(match: Match[str]) -> str:
        quote = match.group(1)
        url = match.group(2)
        return f"{quote}{file_to_data_uri(url)}{quote}"

    text = re.sub(r'\b(src|data-src)=["\']((?:\.\./)?assets/[^"\']+)["\']', replace_html_attr, text)
    text = re.sub(r'url\(\s*(["\']?(?:\.\./)?assets/[^"\'\)]+["\']?)\s*\)', replace_css_url, text)
    text = re.sub(r'(["\'])((?:\.\./)?assets/[^"\']+)\1', replace_js_asset, text)
    return text


def strip_imports_exports(source: str) -> str:
    """Remove import and export statements from ES module source."""
    source = IMPORT_REGEX.sub("", source)
    source = EXPORT_DEFAULT_REGEX.sub("", source)
    source = EXPORT_NAMED_REGEX.sub(lambda m: m.group(1), source)
    source = EXPORT_BRACE_REGEX.sub("", source)
    return source.strip()


def build_data_module(source: str, export_name: str) -> str:
    """Capture a data module's default export as a named const in outer scope."""
    source = IMPORT_REGEX.sub("", source)
    source = EXPORT_DEFAULT_REGEX.sub(f"const {export_name} = ", source)
    return source.strip()


def build_scoped_module(label: str, source: str, exports: list[tuple[str, str]]) -> str:
    """Wrap logic module in block scope and expose requested exports via outer bindings."""
    source = strip_imports_exports(source)

    for inner, outer in exports:
        source = re.sub(
            rf"\basync\s+function\s+{re.escape(inner)}\s*\(",
            f"{outer} = async function(",
            source,
        )
        source = re.sub(
            rf"\bfunction\s+{re.escape(inner)}\s*\(",
            f"{outer} = function(",
            source,
        )
        source = re.sub(
            rf"\b(?:const|let|var)\s+{re.escape(inner)}\s*=",
            f"{outer} =",
            source,
        )

    pre_declarations = "\n".join(f"var {outer};" for _, outer in exports) if exports else ""
    return f"""{pre_declarations}
// ── {label} ──────────────────────────────────────────────────────────
{{
{source}
}}"""


def patch_app_js(source: str) -> str:
    """Patch app.js for in-process scoring, standalone lifecycle, and report handoff."""
    # Replace the dynamic import("./scoring.js") block with in-process scoring and bridge invocation
    scoring_block_regex = re.compile(
        r'import\("\./scoring\.js"\)\s*'
        r'\.then\(\s*\(\{\s*score\s*\}\)\s*=>\s*score\(answers,\s*assessment\)\s*\)\s*'
        r'\.then\(\s*result\s*=>\s*\{.*?window\.location\.href\s*=\s*"report\.html";?\s*\}\s*\)\s*'
        r'\.catch\(\s*err\s*=>\s*\{.*?window\.location\.href\s*=\s*"report\.html[^"]*";?\s*\}\s*\);?',
        re.DOTALL,
    )
    new_scoring_block = (
        "Promise.resolve()\n"
        "      .then(() => score(answers, assessment))\n"
        "      .then(result => {\n"
        "        try {\n"
        '          sessionStorage.setItem("scoringResult", JSON.stringify(result));\n'
        "        } catch (_) {}\n"
        "        (result._rawAnswers = answers, window.__showReport(result, answers));\n"
        "      })\n"
        "      .catch(err => {\n"
        '        console.error("Scoring failed:", err);\n'
        "        window.__showReport(window.__MOCK_RESULT__ || {}, {});\n"
        "      });"
    )
    source = scoring_block_regex.sub(new_scoring_block, source)

    old_await = (
        "await Promise.all(\n"
        '  ["cds-checkbox", "cds-radio-button", "cds-button", "cds-progress-bar", "cds-toggletip"].map((t) =>\n'
        "    customElements.whenDefined(t)\n"
        "  )\n"
        ");\n"
        "render();"
    )
    new_await = "render(); // no await in standalone — Carbon upgrades asynchronously"
    source = source.replace(old_await, new_await)

    old_nextlabel = (
        "const nextLabel = Array.from(els.btnNext.childNodes).find(\n"
        "  (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim()\n"
        ");"
    )
    new_nextlabel = (
        "// nextLabel: evaluated lazily so it works before cds-button upgrades.\n"
        "const getNextLabel = () =>\n"
        "  Array.from(els.btnNext.childNodes).find(\n"
        "    (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim()\n"
        "  );"
    )
    source = source.replace(old_nextlabel, new_nextlabel)

    source = source.replace(
        'nextLabel.textContent = state.page === total - 1 ? "Submit" : "Next";',
        'const nl = getNextLabel(); if (nl) nl.textContent = state.page === total - 1 ? "Submit" : "Next";',
    )
    return source


def patch_report_js(source: str) -> str:
    """Patch report.js for direct invocation and parameter-based data passing."""
    source = re.sub(r"\basync function init\(\s*[^)]*\)", "async function initReport(result)", source)
    source = source.replace(
        "const MOCK_RESULT = {",
        "window.__MOCK_RESULT__ = MOCK_RESULT = {",
    )

    old_read_regex = re.compile(
        r'let result;\s*if\s*\(\s*injectedResult\s*\)\s*\{.*?\}\s*else\s*\{.*?\}\s*\}',
        re.DOTALL,
    )
    source = old_read_regex.sub("let result = injectedResult ?? MOCK_RESULT;", source)

    old_read_fallback = """  let result;
  try {
    const stored = sessionStorage.getItem("scoringResult");
    result = stored ? JSON.parse(stored) : MOCK_RESULT;
  } catch {
    result = MOCK_RESULT;
  }"""
    source = source.replace(old_read_fallback, "  let result = result ?? MOCK_RESULT;")

    anchor = "function loadStoredResponses() {\n"
    if anchor not in source:
        raise SystemExit("✗  bundle.py: loadStoredResponses() not found in js/report.js")
    source = source.replace(
        anchor,
        anchor + "  if (window.__assessmentResponses) return window.__assessmentResponses;\n",
    )

    source = re.sub(r"\ninitReport\(\)\.catch\(console\.error\);?\s*$", "", source)
    source = re.sub(r"\ninit\(\)\.catch\(console\.error\);?\s*$", "", source)

    source = source.replace(
        'toggleBtn.querySelector("img").src = `assets/${isExpanded ? "cb904" : "3f8ce"}.svg`;',
        f'toggleBtn.querySelector("img").src = isExpanded ? "{file_to_data_uri("assets/cb904.svg")}" : "{file_to_data_uri("assets/3f8ce.svg")}";',
    )

    source = re.sub(
        r'<div class="expansion-card__actions">\s*<cds-button[^>]*>\s*Talk to a seller.*?</cds-button>\s*</div>',
        "",
        source,
        flags=re.DOTALL,
    )
    source = re.sub(
        r'<cds-button kind="tertiary" size="lg">\s*Talk to a seller.*?</cds-button>',
        "",
        source,
        flags=re.DOTALL,
    )
    source = re.sub(
        r'\s*<div class="accelerate-card">.*?</div>\s*</div>',
        "",
        source,
        flags=re.DOTALL,
    )
    return source


def extract_report_body(report_html: str) -> str:
    """Extract report body content without script tags."""
    body_match = re.search(r"<body[^>]*>(.*)</body>", report_html, re.DOTALL)
    if not body_match:
        raise ValueError("Could not find <body> in report.html")
    body = body_match.group(1)
    body = re.sub(r"<script\b[^>]*>.*?</script>", "", body, flags=re.DOTALL)
    return body.strip()


def remove_seller_buttons(html_content: str) -> str:
    """Strip 'Talk to a seller' CTA buttons from standalone report shell."""
    return re.sub(
        r"<cds-button[^>]*>\s*Talk to a seller.*?</cds-button>",
        "",
        html_content,
        flags=re.DOTALL,
    )


def fetch_url_bytes(url: str) -> bytes:
    """Download resource from URL using customized User-Agent."""
    req = urllib.request.Request(url, headers={"User-Agent": FETCH_USER_AGENT})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return resp.read()


def bake_carbon_offline(html_content: str) -> str:
    """Fetch external Carbon Web Components and embed them into an inline importmap."""
    entries = CARBON_TAG_REGEX.findall(html_content)
    if not entries:
        return html_content

    modules: dict[str, str] = {}
    todo = list(entries)
    while todo:
        url = todo.pop()
        if url in modules:
            continue
        source = fetch_url_bytes(url).decode("utf-8")

        def absolutise(match: Match[str], base: str = url) -> str:
            target = urllib.parse.urljoin(base, match.group(3))
            todo.append(target)
            return f"{match.group(1)}{match.group(2)}{target}{match.group(2)}"

        modules[url] = MODULE_SPEC_REGEX.sub(absolutise, source)

    import_map = {
        "imports": {
            url: "data:text/javascript;base64," + base64.b64encode(src.encode("utf-8")).decode("ascii")
            for url, src in modules.items()
        }
    }
    map_tag = '<script type="importmap">' + json.dumps(import_map, separators=(",", ":")) + "</script>"
    html_content = CARBON_TAG_REGEX.sub(
        lambda m: f'<script type="module">import "{m.group(1)}";</script>',
        html_content,
    )
    html_content = re.sub(r"<head(\s[^>]*)?>", lambda m: m.group(0) + "\n" + map_tag, html_content, count=1)
    size_kb = sum(len(v) for v in import_map["imports"].values()) / 1024
    print(f"   Carbon: {len(entries)} components, {len(modules)} modules baked in ({size_kb:.0f} KB)")
    return html_content


def bake_fonts_offline(html_content: str) -> str:
    """Fetch IBM Plex fonts CSS and embed woff2 font files as data URIs."""
    match = FONT_LINK_REGEX.search(html_content)
    if not match:
        return html_content
    css = fetch_url_bytes(html_lib.unescape(match.group(1))).decode("utf-8")
    faces: list[str] = []
    for subset, face in re.findall(r"/\*\s*([a-z-]+)\s*\*/\s*(@font-face\s*\{[^}]+\})", css):
        if subset not in FONT_SUBSETS:
            continue

        def embed(url_match: Match[str]) -> str:
            data = base64.b64encode(fetch_url_bytes(url_match.group(1))).decode("ascii")
            return f"url(data:font/woff2;base64,{data})"

        faces.append(re.sub(r"url\((https://[^)]+)\)", embed, face))

    style_tag = "<style>/* IBM Plex, embedded */\n" + "\n".join(faces) + "\n</style>"
    html_content = html_content[:match.start()] + style_tag + html_content[match.end():]
    print(f"   Fonts: {len(faces)} IBM Plex faces baked in")
    return html_content


def bake_offline_assets(html_content: str) -> tuple[str, bool]:
    """Embed external Carbon components and web fonts into the standalone HTML."""
    try:
        html_content = bake_carbon_offline(html_content)
        html_content = bake_fonts_offline(html_content)
    except Exception as err:
        print(f"⚠  Could not embed Carbon/fonts ({err}). The file will need internet.", file=sys.stderr)
        return html_content, False
    html_content = CDN_HINT_REGEX.sub("", html_content)
    return html_content, True


def verify_bundle(html_content: str, baked: bool) -> None:
    """Verify that the generated standalone bundle satisfies all functional and hygiene invariants."""
    must_have = {
        "report hand-off (__showReport)": "window.__showReport",
        "report renderer exposed (initReport)": "initReport = async function(",
        "Download menu (Full PDF report)": 'data-download="pdf"',
        "Download menu (Your responses)": 'data-download="responses"',
        "report PDF print handler": "initPrint(result.contact)",
        "responses PDF handler": "initResponsesDownload(",
        "answers handed to the responses PDF": "if (window.__assessmentResponses) return window.__assessmentResponses;",
        "session details page": 'id: "details"',
        "web-report-only note above Additional resources in the PDF": 'class="report-eyebrow-row bonus-block__print-note"',
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

    problems = [f"missing: {k}" for k, v in must_have.items() if v not in html_content]
    problems += [f"still present: {k}" for k, v in must_not_have.items() if v in html_content]
    if problems:
        print("✗  Bundle check failed — not writing the file:", file=sys.stderr)
        for problem in problems:
            print(f"     • {problem}", file=sys.stderr)
        sys.exit(1)
    print(f"   Checks: {len(must_have) + len(must_not_have)} passed")


def assemble_js_bundle() -> str:
    """Assemble all data modules and application scripts into a unified JS bundle."""
    assessment_src = read_text(os.path.join(ROOT_DIR, "data", "assessment.js"))
    report_data_src = read_text(os.path.join(ROOT_DIR, "data", "report_data.js"))
    journey_src = read_text(os.path.join(ROOT_DIR, "data", "journey.js"))
    actions_src = read_text(os.path.join(ROOT_DIR, "data", "milestone-actions.js"))
    scoring_src = read_text(os.path.join(ROOT_DIR, "js", "scoring.js"))
    report_src = patch_report_js(read_text(os.path.join(ROOT_DIR, "js", "report.js")))
    app_src = patch_app_js(read_text(os.path.join(ROOT_DIR, "js", "app.js")))

    parts = [
        "// ── data/assessment.js ─────────────────────────────────────────",
        build_data_module(assessment_src, "assessmentData"),
        "var assessment = assessmentData;",
        "\n// ── data/report_data.js ────────────────────────────────────────",
        build_data_module(report_data_src, "reportData"),
        "\n// ── data/journey.js ────────────────────────────────────────────",
        build_data_module(journey_src, "journey"),
        "\n// ── data/milestone-actions.js ──────────────────────────────────",
        build_data_module(actions_src, "milestoneActions"),
        build_scoped_module(
            "js/scoring.js",
            scoring_src,
            [("score", "score"), ("MILESTONE_BY_ID", "MILESTONE_BY_ID"), ("DIMENSIONS", "DIMENSIONS")],
        ),
        build_scoped_module(
            "js/report.js",
            report_src,
            [("initReport", "initReport")],
        ),
        BRIDGE_JS,
        build_scoped_module(
            "js/app.js",
            app_src,
            [],
        ),
    ]
    return "\n".join(parts)


def assemble_css_bundle() -> str:
    """Combine and order all stylesheet files for standalone rendering."""
    css_styles = read_text(os.path.join(ROOT_DIR, "css", "styles.css"))
    css_splash = read_text(os.path.join(ROOT_DIR, "css", "splash.css"))
    css_report = read_text(os.path.join(ROOT_DIR, "css", "report.css"))

    return "\n\n".join([
        "/* === styles.css === */",
        css_styles,
        "/* === splash.css === */",
        css_splash,
        "/* === report.css === */",
        css_report,
        "/* === print: assessment shell === */",
        SHELL_PRINT_CSS,
    ])


def build_bundle() -> None:
    """Execute full standalone build pipeline."""
    index_html = read_text(os.path.join(ROOT_DIR, "index.html"))
    report_html = read_text(os.path.join(ROOT_DIR, "report.html"))

    combined_css = assemble_css_bundle()
    report_body = remove_seller_buttons(extract_report_body(report_html))
    js_bundle = assemble_js_bundle()

    html_content = index_html
    css_tag = f"<style>\n{combined_css}\n</style>"
    html_content = re.sub(r'<link\s[^>]*href=["\']css/styles\.css["\'][^>]*/?>', lambda _: css_tag, html_content)
    html_content = re.sub(r'<link\s[^>]*href=["\']css/splash\.css["\'][^>]*/?>', "", html_content)

    extra_carbon = """\
  <script type="module" src="https://1.www.s81c.com/common/carbon/web-components/tag/v2/latest/tabs.min.js"></script>
  <script type="module" src="https://1.www.s81c.com/common/carbon/web-components/tag/v2/latest/tag.min.js"></script>
  <script type="module" src="https://1.www.s81c.com/common/carbon/web-components/tag/v2/latest/tooltip.min.js"></script>
  <script type="module" src="https://1.www.s81c.com/common/carbon/web-components/tag/v2/latest/menu-button.min.js"></script>
  <script type="module" src="https://1.www.s81c.com/common/carbon/web-components/tag/v2/latest/menu.min.js"></script>
  <script type="module" src="https://1.www.s81c.com/common/carbon/web-components/tag/v2/latest/textarea.min.js"></script>"""
    html_content = html_content.replace("</head>", extra_carbon + "\n</head>")

    html_content = html_content.replace('<div class="page">', '<div id="view-assessment">\n  <div class="page">')
    html_content = html_content.replace(
        '</div>\n\n  <div class="report-view" id="report-view" style="display: none;"></div>',
        '  </div>\n</div><!-- /#view-assessment -->\n\n<div id="view-report" style="display:none;">\n'
        + report_body
        + "\n</div><!-- /#view-report -->",
    )

    js_tag = f"<script>\n(async () => {{\n{js_bundle}\n}})();\n</script>"
    html_content = re.sub(
        r'<script\s+type=["\']module["\'][^>]*src=["\']js/app\.js["\'][^>]*>\s*</script>',
        lambda _: js_tag,
        html_content,
    )
    html_content = re.sub(r"<script[^>]*vercel-insights[^>]*></script>", "", html_content)
    html_content = inline_all_assets(html_content)

    html_content, baked = bake_offline_assets(html_content)
    verify_bundle(html_content, baked)

    with open(OUTPUT_HTML, "w", encoding="utf-8") as f:
        f.write(html_content)

    size_kb = os.path.getsize(OUTPUT_HTML) / 1024
    print(f"✓  Bundled → {os.path.basename(OUTPUT_HTML)} ({size_kb:.1f} KB)")


if __name__ == "__main__":
    required_paths = [
        os.path.join(ROOT_DIR, "data", "assessment.js"),
        os.path.join(ROOT_DIR, "data", "report_data.js"),
        os.path.join(ROOT_DIR, "data", "journey.js"),
        os.path.join(ROOT_DIR, "data", "milestone-actions.js"),
        os.path.join(ROOT_DIR, "js", "scoring.js"),
        os.path.join(ROOT_DIR, "js", "report.js"),
        os.path.join(ROOT_DIR, "js", "app.js"),
    ]
    for req in required_paths:
        if not os.path.exists(req):
            print(f"✗  Missing: {os.path.relpath(req, ROOT_DIR)} — run compilers first.", file=sys.stderr)
            sys.exit(1)
    build_bundle()
