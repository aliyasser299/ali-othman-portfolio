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

Testing used responsive browser emulation, not physical iOS/Android devices. Native video control appearance is determined by the visitor’s browser. Domain-specific canonical/sharing URLs and the sitemap are generated with the production build’s `--base-url` option.

## Public deployment verification

Published to **https://aliyasser299.github.io/ali-othman-portfolio/** from the public `aliyasser299/ali-othman-portfolio` repository. GitHub Actions deployment succeeded for commit `2f4cb1c` on 3 October 2026.

- Anonymous HTTPS requests received **200**, with no account, cookies, or authentication. All **41 production files** returned 200 and matched the local build's byte sizes and media MIME types.
- Every MP4 passed byte-range checks at both the beginning and the end: **28 successful 206 responses**, with exact content ranges and 1,024-byte bodies.
- Every one of the **14 gallery Play buttons** opened the correct project, decoded its original viewing-copy dimensions, and started playback with an advancing timestamp and no media error. The hero Play button also started its identity animation.
- Native pause/resume, sound mute/unmute, and keyboard seeking worked on the published trailer. Portrait playback at **375 px** preserved the complete frame with `object-fit: contain`.
- Published layouts passed the seven target widths above. Visually inspected desktop, tablet, mobile hero/contact, and portrait player layouts. No page or heading overflow and no broken poster images were detected.
- Verified all filter counts (3 / 4 / 7 / 14), mobile filtering, portrait rail arrows, Work/About/Contact links, supplied email/social URLs, close button, Escape, backdrop dismissal, focus return, and source release after closing. Keyboard focus moved between the dialog's close button and native player in both directions.
- No console warnings or errors in the public site. The initial player has no source. Canonical URL, Open Graph URL/image, robots file, and sitemap point to the final HTTPS site.

The owner's direct-from-disk preview exposed a JavaScript module-loading limitation. Replaced the module import with ordered deferred classic scripts, and updated both manifest generators so regeneration preserves the fix. Verified the revised scripts over local HTTP and public HTTPS. Direct `file://` browser inspection is unavailable in the automation environment.

The native fullscreen button is available; the browser automation did not provide a conclusive fullscreen transition check. Physical iOS/Android playback and native fullscreen remain device-specific checks.
