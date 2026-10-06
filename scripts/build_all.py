#!/usr/bin/env python3
"""Unified build script for M-GRAT.

Compiles assessment questions, report data, generates the self-serve bundle, and runs
the dynamic logic validation harness.

Usage:
    python3 scripts/build_all.py
"""
from __future__ import annotations

import sys
import build_assessment
import build_report_data
import bundle
import validate


def run_pipeline() -> int:
    """Run all compilation, bundling, and validation stages in sequence."""
    print("=" * 60)
    print("1/4 Building assessment questions (data/assessment.js)...")
    res_assessment = build_assessment.main([])
    if res_assessment != 0:
        print("✗ Failed building assessment questions", file=sys.stderr)
        return res_assessment

    print("-" * 60)
    print("2/4 Building report data & journey modules (data/report_data.js, etc.)...")
    res_report = build_report_data.main([])
    if res_report != 0:
        print("✗ Failed building report data", file=sys.stderr)
        return res_report

    print("-" * 60)
    print("3/4 Generating standalone self-serve bundle (MAS-growth-assessment-self-serve.html)...")
    try:
        bundle.build_bundle()
    except Exception as err:
        print(f"✗ Failed bundling standalone file: {err}", file=sys.stderr)
        return 1

    print("-" * 60)
    print("4/4 Running dynamic logic validation harness...")
    res_validate = validate.main()
    if res_validate != 0:
        print("✗ Logic validation failed", file=sys.stderr)
        return res_validate

    print("=" * 60)
    print("✓ All M-GRAT builds & validations completed successfully.")
    return 0


if __name__ == "__main__":
    sys.exit(run_pipeline())
