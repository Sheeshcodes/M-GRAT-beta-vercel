#!/usr/bin/env python3
"""Unified build script for M-GRAT.

Compiles assessment questions, report data, and generates the self-serve bundle in one command (E1).

Usage:
    python3 scripts/build_all.py
"""
from __future__ import annotations

import sys
import build_assessment
import build_report_data
import bundle


def run_pipeline() -> int:
    """Run all compilation and bundling stages in sequence."""
    print("=" * 60)
    print("1/3 Building assessment questions (data/assessment.js)...")
    res_assessment = build_assessment.main([])
    if res_assessment != 0:
        print("✗ Failed building assessment questions", file=sys.stderr)
        return res_assessment

    print("-" * 60)
    print("2/3 Building report data & journey modules (data/report_data.js, etc.)...")
    res_report = build_report_data.main([])
    if res_report != 0:
        print("✗ Failed building report data", file=sys.stderr)
        return res_report

    print("-" * 60)
    print("3/3 Generating standalone self-serve bundle (MAS-growth-assessment-self-serve.html)...")
    try:
        bundle.build_bundle()
    except Exception as err:
        print(f"✗ Failed bundling standalone file: {err}", file=sys.stderr)
        return 1

    print("=" * 60)
    print("✓ All M-GRAT builds completed successfully.")
    return 0


if __name__ == "__main__":
    sys.exit(run_pipeline())
