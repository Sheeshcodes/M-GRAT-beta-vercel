# Print and PDF guide

How we turn an HTML page into a PDF that reads like a designed document, not a screenshot of a web page. Follow this for any page that gets a "Download PDF" or is likely to be printed.

The report is the reference implementation:

- `css/report.css` — the `@media print` blocks at the end of the file
- `js/report.js` — `initPrint()` (Full PDF report) and `initResponsesDownload()` (Your responses)

Read those alongside this guide. Every rule below exists because of a problem we hit there.

---

## The goal

A reader of the PDF should never see:

- a label or heading at the foot of one page with its content on the next
- half-empty pages left behind by a block that jumped to the next page
- empty grey or coloured slabs where a box was cut across a page break
- content that was hidden on screen behind a tab, toggle or "show more"
- buttons, menus, tooltips or anything else that only works with a mouse
- a file named after the browser tab instead of the customer

---

## 1. Print the screen design, don't build a second one

- Print styles are one `@media print` block at the **end** of the page's own stylesheet, so they override the screen rules without a fight. No separate print template, no separate HTML.
- The **phone layout is the best starting point** for paper: everything stacked, nothing hidden behind hover. But a page is wider than a phone, so where a phone-stacked block would not fit on one page, put it back to two columns (the score banner, the dimension grid, the expansion intro).
- Comment every rule group with **why** it is there. Print CSS is full of `!important` and odd overrides; without the reason, the next person deletes the one that mattered.

## 2. Open everything the reader would have to click

On paper nobody can click, so anything collapsed is lost unless we open it.

- **Use `beforeprint` / `afterprint`**, not only the Download button. Every browser fires them for Cmd+P / Ctrl+P too, so a manual print gets the same document.
- **Record the state, open everything, restore it exactly.** Save each element's class or inline style in a `data-` attribute before changing it, and put it back on `afterprint`. The page must look exactly as it did before printing.
- **Guard against running twice.** The Download button opens everything and calls `print()`, which fires `beforeprint` again. A second pass would save the already-opened state as the "before" and the page would stay open after printing. Use a class on `<html>` (`is-printing`) and return early if it is already there.
- **Call `window.print()` straight away.** Don't wait a frame with `requestAnimationFrame` first — it never fires in a tab that isn't visible, and the page is left opened up.
- **Tabs:** print every panel, not just the selected one, and give each panel its own heading. The tab strip is dropped, so without a heading the panels are anonymous blocks.
- **Animations:** turn transitions off (`transition: none !important`). A print can arrive before an animated meter has grown, and every bar prints empty.

## 3. Drop what only exists to be clicked

Hide: navigation, menus, CTA buttons, expand/collapse toggles, tooltips, the hero video, feedback buttons.

But **keep the information a control was carrying**:

- A disabled button with "Coming soon" — hide the button, print the "Coming soon".
- Download buttons for resources — hide them, and add a print-only eyebrow: "Resources can be downloaded from the web report only".
- A feedback question — print it with the answer once it has been answered; leave it out when it hasn't.

Other rules:

- Links print as plain text (no underline, inherit the colour). A PDF reader can't follow them.
- Print-only content lives in the HTML with `display: none` on screen and is switched on inside `@media print`. Don't create it in JavaScript at print time.

## 4. Keep sections together

This is what makes the PDF feel designed. Three kinds of rule, applied deliberately:

| Rule | Apply to | Why |
|---|---|---|
| `break-before: page` | Major chapters, and any block longer than one page | A long block that starts at the top of a page runs to two pages, not three partial ones |
| `break-after: avoid` | Every eyebrow, heading, sub-heading and label | A label is never left at the foot of a page |
| `break-inside: avoid` | Every block that reads as one thing (a card, a panel, a stat banner, one question and its answer) | A block is never cut in half |

- Only use `break-inside: avoid` on blocks that **fit on a page**. If a block is taller than a page it will break anyway; give it `break-before: page` instead.
- Use `break-before: page` sparingly — only where a fresh page is clearly better. Too many forced breaks produce the half-empty pages we are trying to avoid.
- **Page-level stacks print as block layout, not flex.** The report's sections, panels and paths are flex columns spaced with `gap` on screen. Chrome can't paginate a flex column safely: when a block inside it is pushed to the next page to stay whole, the content after it isn't always pushed too, and the next heading prints **on top of it**. "Keep with next" (`break-after: avoid`) is also ignored between flex items. So in print, switch those containers to `display: block !important` and recreate the spacing with margins (`.report-section > * + * { margin-top: 32px; }`). Small blocks that never break (a card, a stat) can stay flex inside.
- **Never switch a flex container to `display: block` without putting its spacing back.** Dropping the flex also drops the `gap`, and labels end up sitting directly on the text above them.
- **When a heading must stay with what follows and they are flex items, wrap them.** A wrapper with `display: contents` on screen changes nothing there; in print it becomes one `break-inside: avoid` block (see `.section-opener` around "Paths to greater value").
- **Boxes that might break lose their fill and border.** A filled container that runs across a page break is drawn down to the foot of the page, leaving an empty grey slab. Remove the background, radius and padding from the outer container in print; keep colour on the small inner cards that never break.

## 5. Make it fit the page

- **Margins:** `@page { margin: 12mm; }`.
- **Scale the whole document down a little** (`zoom: 0.84` on the content wrapper). Screen type — 16px body, 40px headings — is large on paper, and blocks that must stay whole don't fit the space left on a page, so they jump and leave gaps. Scaling everything keeps the proportions and packs the blocks together.
- **Use the same scale for every PDF from the same product**, so they share one type size.
- **Undo the screen-only geometry.** Fixed heights, `max-height`, `overflow: hidden`, absolute positioning, transforms and `opacity: 0` hidden states all clip content on paper. Reset them to `auto` / `static` / `visible`. Component classes often set these with high specificity — `!important` is acceptable here, with a comment.
- **The sidebar becomes a cover block** at the top of page one: single column, static, a hairline underneath.
- **Remove shadows and rounded corners on the page wrapper.** A screen shadow prints as a stray hairline across the top and down the side of page one.
- **Gradient text prints unreliably** (`background-clip: text`) — replace it with a solid colour in print.

## 6. Colour

- Set `print-color-adjust: exact` (and `-webkit-print-color-adjust: exact`) on everything. Carbon fills carry meaning — the blue banner, the green resources block, stage tones — and browsers drop backgrounds by default.
- Force a white page background.
- White cards on white paper disappear — give them a 1px `--cds-border-subtle` hairline in print.

## 7. File name and cover details

- **The PDF file name comes from `document.title`.** Set it when printing starts and restore it on `afterprint`. Pattern: `Maximo Growth Readiness Report - {Customer's name}`.
- The cover block shows the session details **in the same order and with the same labels as the form**: Facilitator's name, Customer's name, Organization. Print only lines that have a value — a label with nothing after it reads as a fault on paper.

## 8. A second PDF from the same page

"Your responses" prints a different document from the same page:

- Render the second document into the page once, hidden on screen.
- When its button is clicked, add a class to `<html>` (`is-printing-responses`), set its own title, call `print()`, and remove both on `afterprint`.
- In print, that class hides everything else: `html.is-printing-responses .report-page > :not(.responses-doc) { display: none !important; }`
- Same `zoom` as the main PDF.
- Mirror the source structure: the responses document starts with "About this session" as Page 1, because that is where the assessment starts.

## 9. Check it with a real PDF

Never sign off a print change from the browser's print preview alone. Make the actual PDF and look at every page.

```bash
# Print a page to PDF with headless Chrome
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --disable-gpu --no-pdf-header-footer \
  --virtual-time-budget=15000 \
  --print-to-pdf=out.pdf "http://127.0.0.1:8765/report.html"

pdfinfo out.pdf | grep Pages        # page count
pdftotext out.pdf - | less          # every heading, label and answer present?
pdftoppm -r 40 -png out.pdf page    # one image per page to look at
```

- The report reads its data from `sessionStorage`, so headless Chrome needs a small throwaway page that writes the data and then redirects to `report.html`. Keep that page in a scratch folder, never in the repo.
- Headless print doesn't fire `beforeprint` on its own. Dispatch it from the throwaway page (`dispatchEvent(new Event("beforeprint"))`) so the PDF matches a real print.
- Pages with looping videos never "settle", so headless **screenshots** can hang. `--print-to-pdf` with `--virtual-time-budget` still works.
- If two headless runs happen at once, give each its own `--user-data-dir`, and wait for the PDF to finish writing before reading it.

Print it twice: once with the demo report, and once with a customer who has most practices in place (more panels, longer sections). Page breaks land in different places, and an overlap often only shows with one of them.

Look for, page by page:

- [ ] No text printed on top of other text — look hardest at the top of each page
- [ ] No heading, eyebrow or label at the foot of a page
- [ ] No half-empty page except at the end of a chapter
- [ ] No empty grey or coloured slabs
- [ ] Every collapsed item printed open (all stages, all capability panels)
- [ ] No buttons, menus, toggles or tooltips
- [ ] Information from hidden controls still there ("Coming soon", the resources eyebrow)
- [ ] Colours printed
- [ ] Cover details in form order, form labels
- [ ] File name correct
- [ ] After printing, the page is back exactly as it was (same tab, same cards open)

Then test the two real paths in Chrome and Safari: the Download menu, and Cmd+P.

## 10. The self-serve file

The self-serve file (`MAS-growth-assessment-self-serve.html`) is built from the same CSS and JS, so the print work carries over — but only after a rebuild:

```bash
python3 scripts/bundle.py
```

- Never add print styles in `bundle.py`. If the PDF is wrong in the self-serve file, fix `css/report.css` or `js/report.js` and rebuild, so both versions stay identical.
- If a print feature depends on a piece of markup or code being in the bundle (an eyebrow, a "Coming soon", a print handler), add it to `must_have` in `verify_bundle()` so a later edit can't silently drop it.
- Print the self-serve file too, not just the served site.

---

## Quick checklist for a new printable page

1. `@media print` block at the end of the page's stylesheet, every group commented with why
2. `beforeprint` opens everything, `afterprint` restores it, guarded against a double run
3. Interaction-only elements hidden; their information kept as print-only text
4. `break-after: avoid` on labels, `break-inside: avoid` on blocks, `break-before: page` on long blocks and chapters
5. Breakable containers lose fill and border
6. `@page` margins, `zoom` scale, screen geometry reset, colours forced
7. `document.title` set for the file name and restored
8. Real PDF made and checked page by page; both Download and Cmd+P tested
9. Self-serve file rebuilt and printed
