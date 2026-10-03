# Verification — 3 October 2026

Tested in the connected Chrome browser against the local static preview server.

## Layout

Checked viewport widths **1440, 1280, 1024, 768, 430, 390, and 375 px**. Every width passed checks for page overflow, heading overflow, and missing poster images. Visually reviewed desktop hero/work presentation, tablet hero, and mobile hero, work, about, contact, and both video formats.

The portrait rail intentionally scrolls inside its own region; it does not create page overflow. Mobile navigation remains directly visible, and touch controls have appropriate hit areas.

## Media

All **14 viewing copies** opened successfully in the native player with decoded video dimensions and `readyState: 4`, without a media error:

- Bullet Train
- NabtaCode / 12
- Lisa / Reel 02
- NabtaCode / 03
- NabtaCode / 10
- NabtaCode / 09
- A change of scene
- Ali Othman Productions
- Xylon / Intro
- Xylon / Outro
- TEDx / Speaker title
- Follow / Animation
- Subscribe / Animation
- The graphic transition

FFprobe confirmed H.264, browser-compatible pixel format, correct dimensions, and complete durations for every file. The native cinematic and portrait playback layouts preserve the full frame. Alpha motion exports have compatible MP4 copies on a dark matte.

Source videos total **1,351.3 MB**. Viewing copies total **125.8 MB**, a **90.7% reduction**. Fourteen WebP posters total approximately **386 KB**. Fonts are served locally. The initial player has no video source; closing playback pauses the video and removes its source. The gallery uses lazy poster loading rather than concurrent video previews.

## Interaction and accessibility basics

Verified category filtering and project counts, portrait rail navigation, hero video launch, Escape dismissal, close control, backdrop dismissal, native player controls, keyboard containment, and focus restoration. The dialog names the active project and includes loading/error feedback. A skip link, visible focus rules, semantic landmarks, labelled controls, and reduced-motion CSS are included.

## Assets, code, and packaging

- No missing linked local assets, duplicate IDs, or broken section anchors.
- Exactly 14 gallery posters and one reusable player.
- No browser console warnings or errors in the final preview.
- Correct HTTP MIME types for HTML, JavaScript, and local fonts.
- MP4 byte-range response verified (`206`, correct `Content-Range` and byte count).
- Python helper scripts compile successfully; media preparation reruns without re-encoding valid files.
- Production packaging excludes the large original videos and development helpers.
- All real contact/social links match the owner’s supplied information.
- Static gallery markup and direct video links are included for visitors without JavaScript.

Testing used responsive browser emulation, not physical iOS/Android devices. Native video control appearance is determined by the visitor’s browser. Final domain-specific canonical/sharing URLs and the sitemap are generated with the production build’s `--base-url` option once a public domain is chosen.
