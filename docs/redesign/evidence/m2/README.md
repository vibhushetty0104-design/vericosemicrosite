# Milestone 2 evidence: homepage and navigation

Captured 2026-10-21 against the local dev server (`npx vite --port 5179 --strictPort`), in Chromium
via the global `playwright-cli`. Uncommitted; nothing deployed.

## Files

| File | What it is |
|---|---|
| `m2-audit.js` | Layout metrics at 10 viewports × 8 views, plus screenshots. Works on pre- and post-M2 markup |
| `m2-interaction.js` | 114 behaviour checks (103 in the first M2 run): skip link, menu sheet keyboard and ARIA, header at 1279/1280/1440/1920, one h1 and a unique title per view, every footer, home, learn-contents and deep link, the `#media-upload` anchor, Back/Forward, tel: links, urgent-strip overlap, reduced motion, 320px reflow, guide network use, primary-button count |
| `before/metrics.json`, `before/*.png` | Baseline taken before any M2 edit (the `learn` rows fall back to home, since the view did not exist) |
| `after-m2-initial/` | The first Milestone 2 result, kept for comparison with the review pass |
| `after/metrics.json`, `after/interaction.json`, `after/*.png` | State after the review and stabilization pass |
| `lint-output.txt`, `test-clinical-output.txt`, `test-safety-output.txt`, `build-output.txt` | Command output (build went to a scratch directory; `dist/` untouched) |

## Home page, before → after (first M2 run)

| Viewport | Screens | Fixed chrome | CTA bottom | Urgent notice bottom | Targets < 44px | Text < 12px | Longest line |
|---|---|---|---|---|---|---|---|
| 320×640 | 86.4 → 19.0 | 134 → 56 | 977 → 447 | 22075 → 875 | 76 → 0 | 257 → 0 | 44 → 43 |
| 360×640 | 78.9 → 17.4 | 126 → 56 | 934 → 447 | 20096 → 853 | 90 → 0 | 257 → 0 | 52 → 49 |
| 390×844 | 56.6 → 12.7 | 126 → 56 | 916 → 421 | 19008 → 801 | 83 → 0 | 257 → 0 | 58 → 53 |
| 430×932 | 48.3 → 10.8 | 126 → 56 | 799 → 388 | 17834 → 707 | 84 → 0 | 257 → 0 | 65 → 59 |
| 640×360 | 110.5 → 25.9 | 143 → 56 | 730 → 453 | 16065 → 729 | 82 → 0 | 257 → 0 | 98 → 83 |
| 768×1024 | 33.4 → 7.9 | 128 → 64 | 773 → 461 | 13482 → 737 | 84 → 0 | 264 → 0 | 121 → 96 |
| 1024×768 | 34.3 → 9.3 | 148 → 64 | 955 → 575 | 9858 → 831 | 81 → 0 | 271 → 0 | 141 → 83 |
| 1280×800 | 30.2 → 8.7 | 131 → 64 | 773 → 516 | 9093 → 772 | 82 → 0 | 271 → 0 | 181 → 83 |
| 1920×1080 | 22.4 → 6.4 | 131 → 64 | 773 → 516 | 9093 → 772 | 82 → 0 | 271 → 0 | 181 → 83 |

"Urgent notice bottom" before is the first tel: link's container, which sat deep in the page.
"Longest line" is an estimate (paragraph width ÷ average glyph width). Header labels wrapping at
1024–1920px: 3 → 0. Views without an h1: assessment, doppler, specialists, treatments → none.

## Not met, or met only partly (first M2 run)

- **T3 first screen (360×640):** first-run result; see the review pass below (CTA now 337px).
- **T8 page length:** 12.7 screens at 390×844 (target ≤ 12). The remainder is the footer
  sitemap and disclaimers plus the six FAQs; no content was cut to reach the number.
- **640×360 landscape:** first-run result (453px); fixed in the review pass (254px).
- **Relocated sections in `#learn` and the other tool views** still contain small text and
  small targets (for example 87 text nodes under 12px and 21 targets under 44px at 390px on
  `#learn`). These components were moved, not restyled (Milestones 3–4).
- **Text zoom at 200%** was not tested (Chromium automation can't apply text-only zoom). Reflow
  was checked at 320 CSS px, which is equivalent to 1280px at 400% page zoom.
- Automation doesn't stand in for real-device, TalkBack/VoiceOver or clinical review.

## Review and stabilization pass (2026-10-21)

Changes: compact hero on phones and in phone landscape (one-line lede and short helper below
640px or at heights ≤ 500px; the full text stays on larger screens); urgent strip reordered so the
warning signs and call buttons come first ("Ambulance 108" as the short visible label, full
service name read out); shorter urgent note in the menu sheet; CTA kept on one line from 640px
up; uploader title `h4` → `h3`; `history.scrollRestoration = 'manual'` so Back/Forward to a
section anchor isn't undone by the browser.

| Home | Pre-M2 | First M2 run | After review |
|---|---|---|---|
| 360×640 CTA bottom (target ≤ 340) | 934 | 447 | **337** |
| 360×640 call buttons bottom | — | not measured | **563** |
| 360×640 whole urgent strip bottom (target ≤ 560) | — | 853 | 799 |
| 390×844 CTA bottom / call buttons | 916 / — | 421 / not measured | 337 / 563 |
| 640×360 CTA bottom (target: visible) | 730 | 453 | **254** |
| 844×390 CTA bottom | — | — | 262 |
| 360×640 page length (screens) | 78.9 | 17.4 | 17.1 |
| 390×844 page length (target ≤ 12) | 56.6 | 12.7 | 12.5 |

Trade-off: the whole urgent strip can't end by 560px at 360×640 without removing the
outside-India and emergency-department guidance, so the call buttons were moved up instead.
At 320px the two call buttons wrap onto two rows (bottom 615px).

Interaction audit: 114/114, on two consecutive runs. Layout audit: no horizontal scroll, header
overlap, label wrapping, missing or duplicate h1, or heading skip on any of the 8 views at 10
viewports. The only pinned element besides the header is the Doppler term panel (`sticky top-24`,
pre-M2, stays in its column, below the header).
