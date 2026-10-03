#!/usr/bin/env python3
"""Render project HTML so work and metadata are present before JavaScript loads."""
import html
import json
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parents[1]

def duration_label(seconds):
    return f'{int(seconds // 60):02d}:{int(seconds % 60):02d}'

def render_gallery(projects):
    page = (ROOT / 'index.html').read_text()
    for group in ('cinema', 'portrait', 'motion'):
        cards = []
        for p in projects:
            if p['group'] != group:
                continue
            e = lambda key: html.escape(str(p[key]), quote=True)
            duration = duration_label(p['duration'])
            cards.append(f'''        <article class="project" data-category="{e('category')}">
          <button class="project-trigger" type="button" data-project="{e('id')}" style="--ratio: {p['width']} / {p['height']}" aria-label="Watch {e('title')} — {e('label')}, {duration}">
            <img src="{e('poster')}" alt="" width="{p['width']}" height="{p['height']}" loading="lazy" decoding="async">
            <span class="play-badge" aria-hidden="true"><span class="play-triangle"></span><span class="play-label">Watch project</span></span>
            <span class="duration micro" aria-hidden="true">{duration}</span>
          </button>
          <div class="project-info">
            <div><h3>{e('title')}</h3><p class="micro">{e('label')} / {e('category')}</p></div>
            <span class="project-arrow" aria-hidden="true">↗</span>
          </div>
        </article>''')
        markup = '\n' + '\n'.join(cards) + '\n      '
        page = re.sub(fr'(<!-- {group}:start -->).*?(<!-- {group}:end -->)', lambda m: m[1] + markup + m[2], page, flags=re.S)
    for category in ('All', 'Video Editing', 'Social Content', 'Motion Graphics'):
        count = len(projects) if category == 'All' else sum(p['category'] == category for p in projects)
        pattern = fr'(data-filter="{category}"[^>]*>.*?<span>)\d+(</span>)'
        page = re.sub(pattern, lambda m: m[1] + str(count) + m[2], page, flags=re.S)
    page = re.sub(r'(id="filter-status"[^>]*>)\d+ pieces / All work', lambda m: m[1] + f'{len(projects)} pieces / All work', page)
    links = '\n'.join(f'        <li><a href="{html.escape(p["source"], quote=True)}">{html.escape(p["title"])}</a></li>' for p in projects)
    fallback = f'''      <noscript>
        <p>Open a video directly to watch without JavaScript:</p>
        <ul>
{links}
        </ul>
      </noscript>'''
    page = re.sub(r'      <noscript>.*?</noscript>', lambda m: fallback, page, flags=re.S)
    (ROOT / 'index.html').write_text(page)

if __name__ == '__main__':
    data = (ROOT / 'assets/projects.js').read_text().split('export const projects = ', 1)[1].rstrip().rstrip(';')
    render_gallery(json.loads(data))
