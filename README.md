# Ali Y. Othman — Creative portfolio

[View the live portfolio](https://aliyasser299.github.io/ali-othman-portfolio/)

A static portfolio for graphic design, video editing, and motion graphics. Built with semantic HTML, CSS, and native JavaScript; no framework, package manager, or third-party runtime dependencies.

## Preview

```bash
python3 tools/serve.py
```

Open **http://127.0.0.1:8000**. The preview server supports byte ranges for video seeking. The player uses ordered, deferred scripts so its controls also work when opening `index.html` directly from disk. HTTP preview is recommended to match production serving and seeking behavior.

## Production files

The ready-to-upload website is in `dist/`. To regenerate it:

```bash
python3 tools/build.py
```

When you know the final public URL:

```bash
python3 tools/build.py --base-url https://aliyasser299.github.io/ali-othman-portfolio/
```

The URL option creates absolute Open Graph image metadata, a canonical URL, `og:url`, and a sitemap. Upload the **contents** of `dist/` to a static host that serves MP4 byte ranges and JavaScript with the correct MIME type. Set the host's site URL to the real domain when deploying. No contact form service is needed: email and WhatsApp links use the owner's supplied details.

The production folder excludes the 1.3 GB of source video files and development tools. Originals remain untouched in the local `assets/videos/` archive, which is excluded from Git. The public repository includes all 14 optimized viewing copies.

## Editing

- `index.html`: identity, about copy, contact links, and the rendered project gallery.
- `assets/style.css`: color tokens, typography, layouts, responsive behavior, and reduced-motion rules.
- `assets/app.js`: category filters, portrait rail, accessible native dialog, and on-demand player.
- `assets/projects.js`: generated project manifest with true dimensions, durations, and local media paths.
- `tools/prepare_media.py`: project catalog and media processing.
- `tools/render_gallery.py`: generates static gallery markup and no-JavaScript video links.

With the original source archive available locally, change project titles or categories in `PROJECTS` in `tools/prepare_media.py`, then run:

```bash
python3 tools/prepare_media.py
python3 tools/build.py
```

Media preparation requires FFmpeg and FFprobe, with optional explicit paths:

```bash
python3 tools/prepare_media.py --ffmpeg /path/to/ffmpeg --ffprobe /path/to/ffprobe
```

Existing complete viewing copies are reused. New or incomplete files are encoded as H.264/AAC MP4 with fast-start metadata, preserving aspect ratios and capping the long edge at 1600 pixels. Transparent motion exports are composited onto the player’s near-black background; original alpha files remain available in the source folder. Posters come from representative frames of the actual work. Update the catalog when adding videos; the script verifies that every source file is accounted for.

Fonts are self-hosted Anton (the supplied reference's permitted substitute) and DM Sans Medium. Their SIL Open Font License files are included under `assets/fonts/`.

## Presentation and verification

The gallery has one cinematic trailer, six portrait videos, and seven landscape motion pieces. Category counts reflect actual files. Posters load lazily; no gallery videos autoplay or download. One player loads only after a user action and releases its source when closed. Native controls support playback, sound, seeking, and fullscreen. The dialog supports Escape, backdrop dismissal, keyboard containment, and focus restoration.

Responsive checks and media verification are documented in `docs/QA.md`. Design choices and research links are in `docs/DESIGN.md`.

## GitHub Pages

Pushing to `main` automatically builds and publishes `dist/` with `.github/workflows/pages.yml`. GitHub Pages uses the **GitHub Actions** publishing source. The workflow obtains the public site URL from GitHub and generates the canonical URL, sharing image URL, and sitemap during every deployment.

To edit project labels without the original archive, update `assets/projects.js`, run `python3 tools/render_gallery.py`, and commit both the manifest and generated `index.html`.
