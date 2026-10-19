#!/usr/bin/env python3
"""Headed Chromium verification of the Umliva static site (local or live)."""
import json
import os
import sys
from playwright.sync_api import sync_playwright

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:8765"
OUTDIR = sys.argv[2] if len(sys.argv) > 2 else "./headed-out"
os.makedirs(OUTDIR, exist_ok=True)

pages = []
for root, dirs, files in os.walk('.'):
    dirs[:] = [d for d in dirs if d not in ('.git', '.agents', 'node_modules')]
    for f in files:
        if f.endswith('.html'):
            p = os.path.relpath(os.path.join(root, f), '.').replace(os.sep, '/')
            pages.append('/' + p)
pages = sorted(set(pages))

out = {"base": BASE, "pages": pages, "results": [], "internalLinks": [], "focus": {}}
widths = [(1366, 900), (390, 844), (320, 844)]

with sync_playwright() as p:
    b = p.chromium.launch(headless=False, executable_path="/usr/bin/google-chrome", args=["--no-sandbox"])
    for w, h in widths:
        for path in pages:
            pg = b.new_page(viewport={"width": w, "height": h})
            errs = []
            fails = []
            pg.on("console", lambda m, e=errs: e.append(m.text) if m.type == "error" else None)
            pg.on("requestfailed", lambda r, e=fails: e.append(r.url + " " + str(r.failure)))
            resp = pg.goto(BASE + path, wait_until="networkidle", timeout=30000)
            m = pg.evaluate("""() => ({sw:document.documentElement.scrollWidth, cw:document.documentElement.clientWidth,
                title:document.title, h1:(document.querySelector('h1')||{}).innerText||'',
                nav:[...document.querySelectorAll('header nav a')].filter(a=>{const s=getComputedStyle(a);const r=a.getBoundingClientRect();return s.display!=='none'&&s.visibility!=='hidden'&&r.width>0&&r.height>0}).length,
                main:(document.querySelector('main')||{}).id||'', imgs:[...document.images].filter(i=>!i.complete||i.naturalWidth===0).length,
                ldjson:[...document.querySelectorAll('script[type="application/ld+json"]')].map(s=>s.textContent)})""")
            rec = {"width": w, "path": path, "status": resp.status if resp else None,
                   "scrollWidth": m['sw'], "clientWidth": m['cw'], "overflow": m['sw'] > m['cw'],
                   "title": m['title'], "h1": m['h1'], "visibleNav": m['nav'], "mainId": m['main'],
                   "brokenImgs": m['imgs'], "consoleErrors": errs, "requestFailures": fails,
                   "ldjson": m['ldjson']}
            if path in ('/', '/index.html', '/impressum.html', '/datenschutz.html',
                        '/golden-case.html', '/partner.html', '/ratgeber/', '/ratgeber/index.html'):
                name = path.strip('/').replace('/', '_') or 'root'
                pg.screenshot(path=os.path.join(OUTDIR, f"w{w}-{name}.png"), full_page=True)
            out["results"].append(rec)
            pg.close()
    pg = b.new_page(viewport={"width": 390, "height": 844})
    pg.goto(BASE + "/", wait_until="networkidle")
    pg.keyboard.press("Tab")
    first = pg.evaluate("() => ({tag:document.activeElement.tagName, cls:document.activeElement.className, text:document.activeElement.innerText})")
    pg.keyboard.press("Enter")
    pg.wait_for_timeout(200)
    after = pg.evaluate("() => ({id:document.activeElement.id, tag:document.activeElement.tagName})")
    out["focus"] = {"firstTab": first, "afterEnter": after}
    links = set()
    for path in pages:
        pg.goto(BASE + path, wait_until="domcontentloaded")
        hrefs = pg.eval_on_selector_all("a[href]", "els=>els.map(e=>e.getAttribute('href'))")
        for href in hrefs:
            if href is None:
                continue
            if href.startswith(('http://', 'https://', 'mailto:', '#')):
                continue
            links.add(href)
    out["internalLinks"] = sorted(links)
    b.close()

with open(os.path.join(OUTDIR, "headed-local.json"), "w") as f:
    json.dump(out, f, indent=2)

problems = [r for r in out["results"] if r["status"] != 200 or r["overflow"] or r["brokenImgs"] or r["consoleErrors"] or r["requestFailures"]]
print(json.dumps({"base": BASE, "pages": len(pages), "combinations": len(out["results"]),
                  "problems": problems, "focus": out["focus"], "internalLinks": out["internalLinks"]}, indent=2))
