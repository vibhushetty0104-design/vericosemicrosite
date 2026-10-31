# Venous valve prototype — evidence

Captured 2026-10-22. Uncommitted; not deployed; not linked from the site.

**Open it:** `npx vite --port 5179 --strictPort`, then visit
`http://localhost:5179/prototypes/venous-valve.html`. `vite build` bundles only `index.html`, so the
page is absent from the production build (checked: the build output contains no prototype page,
code or styles, and its CSS/JS hashes match the Milestone 2 build).

| File | What it is |
|---|---|
| `valve-audit.js` | 44 automated Chromium checks (playwright-cli `run-code` format) |
| `results.json` | Latest run: 44/44 passed; frame timing at 4× CPU while animating: median 6.9 ms, 100% of frames ≤ 33 ms |
| `*.png` | Each state at 320, 390, 768 and 1280 px, plus reduced motion at 390 px |
| `lint-output.txt`, `test-*-output.txt`, `build-output.txt` | Command output |

What the checks cover: illustration labelling on the visual; no measurement-like values or
diagnostic/validation wording; starts paused; Play/Pause; nothing animates in the closed state,
off-screen or in a hidden tab; flap transforms per state; live caption and SVG title follow the
state; keyboard (radio group with arrow keys, Play, layer toggles), visible 2px focus; 44px
targets; no text under 12px; explanation text 16px; no horizontal overflow at 320px; reduced
motion (no Play button, still arrows, no running animation); no console errors; no external
requests except Google Fonts.

Not covered: real devices, screen readers (TalkBack/VoiceOver), Safari/WebKit, and any clinical
review. The drawings are simplified, made for this prototype, not traced from the concept sheet
and not anatomically validated.
