#!/usr/bin/env python3
"""Shared utilities for M-GRAT workbook processing and code generation."""
from __future__ import annotations

import json
import os
import re
import xml.etree.ElementTree as ET
import zipfile
from typing import Any

# Project Root Directory
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# OpenXML XML Namespaces
XML_NAMESPACES = {
    "m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main",
    "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
}


def slugify(text: str) -> str:
    """Convert text to URL/ID friendly lowercase slug."""
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


def is_rule_row(record: dict[str, str]) -> bool:
    """Check if record represents a metadata/rule header row in the workbook."""
    first_val = next(iter(record.values()), "")
    return first_val.startswith("RULE") or first_val.startswith("ASSEMBLY SHEET")


def blank_to_none(text: str | None) -> str | None:
    """Normalize empty string or placeholder dashes to None."""
    if text is None or text in ("", "—", "-"):
        return None
    return text


def clean_dash_spacing(value: str | None) -> str | None:
    """Normalize em dash spacing in descriptive prose."""
    if value is None:
        return None
    return re.sub(r"(?<=\w)—(?=\w)", " — ", value)


def split_delimited_ids(value: str | None) -> list[str]:
    """Parse delimited string (';', ',', '\\n') into list of clean IDs."""
    if not blank_to_none(value):
        return []
    return [
        part.strip()
        for part in re.split(r"[;,\n]", value or "")
        if part.strip() not in ("", "—", "-")
    ]


def split_bullet_lines(value: str | None) -> list[str]:
    """Parse newline-separated or bulleted text into a list of cleaned lines."""
    if not value:
        return []
    lines = []
    for line in value.split("\n"):
        cleaned = line.strip().lstrip("•").strip()
        if cleaned:
            lines.append(cleaned)
    return lines


def format_js_export(value: Any) -> str:
    """Serialize Python dictionary/list to formatted JSON string."""
    return json.dumps(value, indent=2, ensure_ascii=False)


def write_js_module(path: str, header: str, value: Any) -> None:
    """Write an ES module file with custom banner comment and default export."""
    with open(path, "w", encoding="utf-8") as f:
        f.write(header + "export default " + format_js_export(value) + ";\n")


def read_workbook(path: str) -> dict[str, list[dict[str, str]]]:
    """Read an .xlsx workbook without third-party dependencies.

    Returns a mapping of sheet names to list of row dictionaries keyed by column headers.
    """
    with zipfile.ZipFile(path) as archive:
        shared_strings: list[str] = []
        if "xl/sharedStrings.xml" in archive.namelist():
            shared_root = ET.fromstring(archive.read("xl/sharedStrings.xml"))
            for string_item in shared_root.findall("m:si", XML_NAMESPACES):
                shared_strings.append(
                    "".join(t.text or "" for t in string_item.iter(f"{{{XML_NAMESPACES['m']}}}t"))
                )

        workbook_root = ET.fromstring(archive.read("xl/workbook.xml"))
        rels_root = ET.fromstring(archive.read("xl/_rels/workbook.xml.rels"))
        sheet_targets = {
            rel.get("Id"): rel.get("Target")
            for rel in rels_root
        }

        sheets_data: dict[str, list[dict[str, str]]] = {}
        sheets_node = workbook_root.find("m:sheets", XML_NAMESPACES)
        if sheets_node is None:
            return sheets_data

        for sheet in sheets_node:
            rel_id = sheet.get(f"{{{XML_NAMESPACES['r']}}}id")
            target = sheet_targets.get(rel_id, "")
            target = target.lstrip("/")
            if not target.startswith("xl/"):
                target = "xl/" + target

            sheet_root = ET.fromstring(archive.read(target))
            grid: list[dict[str, str]] = []

            for row in sheet_root.iter(f"{{{XML_NAMESPACES['m']}}}row"):
                cells: dict[str, str] = {}
                for cell in row.findall("m:c", XML_NAMESPACES):
                    cell_ref = cell.get("r", "")
                    col_match = re.match(r"[A-Z]+", cell_ref)
                    if not col_match:
                        continue
                    col = col_match.group(0)

                    cell_type = cell.get("t")
                    value_elem = cell.find("m:v", XML_NAMESPACES)
                    inline_elem = cell.find("m:is", XML_NAMESPACES)

                    if cell_type == "s" and value_elem is not None and value_elem.text:
                        val = shared_strings[int(value_elem.text)]
                    elif cell_type == "inlineStr" and inline_elem is not None:
                        val = "".join(x.text or "" for x in inline_elem.iter(f"{{{XML_NAMESPACES['m']}}}t"))
                    elif value_elem is not None and value_elem.text:
                        val = value_elem.text
                    else:
                        val = ""
                    cells[col] = val.strip()
                grid.append(cells)

            sheet_name = sheet.get("name", "")
            if not grid:
                sheets_data[sheet_name] = []
                continue

            header_row = grid[0]
            rows: list[dict[str, str]] = []
            for cells in grid[1:]:
                row_record = {
                    header_row[col]: cells.get(col, "")
                    for col in header_row
                    if header_row[col]
                }
                if any(row_record.values()):
                    rows.append(row_record)

            sheets_data[sheet_name] = rows

    return sheets_data
