# Milestone 1 evidence (uncommitted)

Captured 2026-10-21 against a local Vite dev server (`npx vite --port 5179`) with the global
`playwright-cli` (Chromium). Not committed, by owner decision.

| Item | File |
|---|---|
| Before: metrics at 6 viewports × 7 views, guide network capture | `before/metrics.json` |
| Before: first-screen screenshots (home, specialists, Doppler) and guide | `before/*.png` |
| After: same metrics, cold browser cache | `after/metrics.json` |
| After: screenshots, plus doctor card, request form and request result at 390×844 | `after/*.png` |
| Lint output (`npm run lint`) | `lint-output.txt` |
| Clinical tests (`npm run test:clinical`) | `test-clinical-output.txt` |
| Safety tests (`npm run test:safety`) | `test-safety-output.txt` |
| Production build into a scratch directory | `build-output.txt` |
| Scripts used | `../../../../scripts/mobile-audit.js`, `capture-surfaces.js` |

Viewports: 360×640, 390×844, 430×932, 768×1024, 640×360 and 1440×900.

## Key results

| Check | Before | After |
|---|---|---|
| Requests while using the guide | 2 × `POST /api/assistant/chat` | none |
| External hosts during the whole run (cold cache) | Google Fonts only | Google Fonts only |
| "Demo profile · fictional" labels on the directory | 0 | 5 at every viewport |
| Request completion | "Demo Request Recorded" + "Simulation ID MV-…" | "Demo request: not sent to any clinic", no ID, no patient name |
| Page-level horizontal scroll | none | none |
| Layout | — | Unchanged (Milestone 1 is copy, labels and logic only) |

Not covered: WebKit / iOS Safari, real devices, screen readers, 200% zoom, Vercel preview
deployment (no deployment was made).
