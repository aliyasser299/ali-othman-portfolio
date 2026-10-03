#!/usr/bin/env python3
"""Package a static production site without the large original source videos."""
import argparse
import html
import pathlib
import shutil
import urllib.parse

ROOT = pathlib.Path(__file__).resolve().parents[1]
ASSETS = ['style.css', 'app.js', 'projects.js', 'favicon.svg', 'halftone.svg', 'social-card.png', 'fonts', 'media', 'posters']

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--base-url', help='Final public site URL, used for sharing metadata and sitemap')
    args = parser.parse_args()
    base = args.base_url.rstrip('/') if args.base_url else None
    if base:
        parsed = urllib.parse.urlsplit(base)
        if parsed.scheme not in ('https', 'http') or not parsed.netloc or parsed.query or parsed.fragment:
            parser.error('--base-url must be a complete HTTP(S) site URL without query or fragment')
    destination = ROOT / 'dist'
    (destination / 'assets').mkdir(parents=True, exist_ok=True)
    for name in ASSETS:
        source = ROOT / 'assets' / name
        target = destination / 'assets' / name
        if source.is_dir():
            shutil.copytree(source, target, dirs_exist_ok=True)
        else:
            shutil.copy2(source, target)
    page = (ROOT / 'index.html').read_text()
    if base:
        escaped = html.escape(base, quote=True)
        page = page.replace('content="assets/social-card.png"', f'content="{escaped}/assets/social-card.png"')
        page = page.replace('</head>', f'  <link rel="canonical" href="{escaped}/">\n  <meta property="og:url" content="{escaped}/">\n</head>')
        (destination / 'sitemap.xml').write_text(f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>{escaped}/</loc></url></urlset>\n')
    else:
        (destination / 'sitemap.xml').unlink(missing_ok=True)
    (destination / 'index.html').write_text(page)
    (destination / 'robots.txt').write_text('User-agent: *\nAllow: /\n' + (f'Sitemap: {base}/sitemap.xml\n' if base else ''))
    print(f'Production files: {destination}')

if __name__ == '__main__':
    main()
