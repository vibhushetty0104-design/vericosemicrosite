# Performance baseline (before the experience track)

Captured 2026-10-21 from the production build of the current code (Milestone 2 review pass),
served with `vite preview` from a scratch directory (`dist/` untouched).

- `perf-baseline.js` — the measurement script (playwright-cli `run-code` format; instructions in
  its header).
- `baseline.json` — raw results: 5 views × 3 runs with medians, plus interaction latencies.

Conditions: 390×844, Chromium 4× CPU slowdown, 150 ms RTT, 1.6 Mbps down / 750 kbps up, cache
disabled. These are lab numbers on a desktop machine, useful for comparing builds, not field data
from real phones. Google Fonts are cross-origin and not counted in the transfer sizes.

Summary (medians): LCP 1.40–1.59 s; CLS ≤ 0.050; total blocking time 0 ms; longest task 63 ms
(home); JS transferred 169 kB; menu open 24 ms; home → Learn view change 208 ms.

Bundle costs of `motion` (installed, unused) were measured separately with esbuild (minified,
React external): `motion/react` 42.6 kB gzip; `LazyMotion` + `domAnimation` 27.2 kB; `LazyMotion`
+ `m` 7.1 kB; vanilla `animate` 22.7 kB; `motion/mini` 3.1 kB.
