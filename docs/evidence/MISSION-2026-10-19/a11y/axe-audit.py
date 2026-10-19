#!/usr/bin/env python3
"""Run axe-core WCAG A/AA checks against the static site in a headed browser."""
import json
import os
import sys
from playwright.sync_api import sync_playwright

BASE = sys.argv[1]
OUT = sys.argv[2]
AXE = "https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.2/axe.min.js"

pages = []
for root, dirs, files in os.walk("."):
    dirs[:] = [d for d in dirs if d not in (".git", ".agents", "node_modules")]
    for name in files:
        if name.endswith(".html"):
            pages.append("/" + os.path.relpath(os.path.join(root, name), ".").replace(os.sep, "/"))
pages = sorted(set(pages))

results = {"base": BASE, "axe": AXE, "widths": [1366, 390], "pages": {}, "violations": 0}
with sync_playwright() as p:
    browser = p.chromium.launch(headless=False, executable_path="/usr/bin/google-chrome", args=["--no-sandbox"])
    for width, height in ((1366, 900), (390, 844)):
        page = browser.new_page(viewport={"width": width, "height": height})
        page.goto(BASE + "/", wait_until="networkidle", timeout=60000)
        page.add_script_tag(url=AXE)
        for path in pages:
            page.goto(BASE + path, wait_until="networkidle", timeout=60000)
            if not page.evaluate("() => typeof axe !== 'undefined'"):
                page.add_script_tag(url=AXE)
            violations = page.evaluate(
                """async () => {
                  const r = await axe.run(document, {
                    runOnly: {type: 'tag', values: ['wcag2a','wcag2aa','wcag21a','wcag21aa']}
                  });
                  return r.violations.map(v => ({
                    id: v.id, impact: v.impact, help: v.help,
                    nodes: v.nodes.map(n => ({html: n.html, target: n.target}))
                  }));
                }"""
            )
            results["pages"].setdefault(path, {})[str(width)] = violations
            results["violations"] += len(violations)
        page.close()
    browser.close()

with open(OUT, "w") as f:
    json.dump(results, f, indent=2, ensure_ascii=False)
print(json.dumps({"base": BASE, "pages": len(pages), "widths": results["widths"],
                  "violations": results["violations"]}, ensure_ascii=False))
