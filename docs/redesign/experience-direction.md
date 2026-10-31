# Meridian Vascular — experience direction (proposal)

> Status: **proposal, awaiting owner review (2026-10-21).** Nothing here is implemented. It
> responds to the owner's "Product Experience Direction" brief and builds on BRAND.md v4, DESIGN.md
> v4, Milestone 1 and Milestone 2. Decisions needing approval are collected in §8.
> Companion document: [content-audit.md](content-audit.md) (content audit and canonical map).

## 1. Direction in one paragraph

Meridian Vascular becomes **a living anatomy atlas**: the brand's "annotated consultation notebook"
(BRAND "Art Direction") with diagrams that move when movement explains something. The standout
moments are interactive, labelled line drawings of the leg, its valves and a Doppler trace, not
stock imagery, gradients or card grids. Everything stays calm, quiet and honest: one primary action
per screen, urgent information never hidden, simulations always labelled as illustrations.

**Reconciliation with BRAND.md.** The brief asks for "standout" and "highly engaging"; BRAND asks
for "editorial calm" and rejects AI-template tropes (gradients, pulsing dots, card stacks, mascots
as the main event). These fit together if engagement comes from *understanding* (touch the diagram,
see the valve close) rather than from decoration. Where the brief and the current DESIGN.md
conflict, this document proposes a change and lists it in §8 (for example DESIGN.md's "nothing
loops indefinitely" vs a simulation that runs while you watch it).

## 2. Current baseline (measured, 2026-10-21)

**Build** (`vite build`, production, current code):

| Asset | Raw | Gzip | Loaded on |
|---|---|---|---|
| Main JS (`index-*.js`) | 632 kB | 173.7 kB | every view |
| CSS | 85.5 kB | 16.1 kB | every view |
| PDF export (`generatePdfReport` + `html2canvas` + `index.es` + `purify`) | 783 kB | 238 kB | only when a PDF is generated (dynamic import) |

**Runtime** (production build via `vite preview`; 390×844; 4× CPU slowdown; 150 ms RTT,
1.6 Mbps down; cache off; median of 3; script and raw data in
[`evidence/perf-baseline/`](evidence/perf-baseline/)):

| View | FCP / LCP | CLS | TBT | Longest task | JS transferred | DOM nodes | Page height |
|---|---|---|---|---|---|---|---|
| Home | 1.59 s | 0.035 | 0 ms | 63 ms | 169 kB | 536 | 10,517 px |
| Learn | 1.50 s | 0.001 | 0 ms | 0 ms | 169 kB | 1,091 | 23,337 px |
| Doppler | 1.51 s | 0.050 | 0 ms | 0 ms | 169 kB | 555 | 10,894 px |
| Treatments | 1.40 s | 0.026 | 0 ms | 0 ms | 169 kB | 384 | 8,051 px |
| Find care | 1.45 s | 0.020 | 0 ms | 0 ms | 169 kB | 699 | 11,218 px |

Interaction latency (Event Timing API, same throttling): menu open 24 ms, menu close (Escape)
16 ms, **home → Learn view change 208 ms** (above the 200 ms "good" INP threshold).
Limits: lab numbers on desktop Chromium with throttling, not field data from real phones; Google
Fonts are cross-origin and not counted in "JS transferred".

**Animation stack audit.** `motion` 12.43.0 is a dependency but is imported nowhere. Current
motion is CSS only (Tailwind transitions, a few keyframes, the menu sheet's 250 ms entrance), with
a global reduced-motion override in `src/index.css`. Measured cost of `motion` if adopted (esbuild,
minified, React external):

| Import | Gzip |
|---|---|
| `motion/react` (`motion`, `AnimatePresence`, `useReducedMotion`) | 42.6 kB |
| `LazyMotion` + `domAnimation` + `m` | 27.2 kB |
| `LazyMotion` + `m` (features loaded later) | 7.1 kB initial |
| `motion` vanilla `animate` | 22.7 kB |
| `motion/mini` `animate` (WAAPI) | 3.1 kB |
| CSS, Web Animations API, SVG | 0 kB |

## 3. Homepage engagement and interaction specification

### 3.1 Principles

1. **Understood in five seconds:** what this is (vein health, explained), who it is for (people in
   Bengaluru with leg symptoms or a scan report) and the one thing to do next.
2. **The first interaction is useful:** choosing your situation changes the page's next step.
3. **One primary action per viewport** (DESIGN.md rule, kept).
4. **Show, then tell:** a diagram before a paragraph wherever a diagram exists.
5. **Every section has one job** and links to its canonical page (content map) instead of repeating it.
6. **Emergency access is always one tap away, never the headline:** a compact urgent block in normal
   flow below the hero, in the menu, on the symptom check and in the footer.

### 3.2 Proposed structure (7 blocks plus footer)

| # | Block | Job | Primary action | Replaces (M2) |
|---|---|---|---|---|
| 1 | **Hero: "Where are you?" + living leg** | Explain the product; let the visitor pick their situation | One per selected situation (default: *Check your symptoms*) | Hero + "Where are you right now?" tiles |
| 2 | **When to get help** | Emergency now (call 112/108) and "see a doctor soon" signs, side by side, compact | Call buttons (tel:) | Urgent strip + emergency card in "Symptoms, and when to get help" |
| 3 | **See how your veins work** | Signature simulation S1 (valves and calf pump), paused until started | *Play* (in-place) → *Read the full guide* (quiet link) | "How leg veins work" |
| 4 | **Read your Doppler report** | Teaser of S3: an illustrative trace with the reflux idea explained in one line | *Open the report guide* (secondary) | Tools card |
| 5 | **From symptoms to a decision** | One horizontal rail: Notice → Scan → Understand → Decide → Find care, each step linking to its tool | none (links) | Tools + care pathway summary |
| 6 | **Find care (demo)** | Demo notice, two compact demo profiles, request | *Request an appointment (demo)* | same |
| 7 | **Questions people ask** | 5 FAQs, link to all | none | FAQ (6) |

Target length: **≤ 8 screens at 390×844** (M2 measured 12.5).

### 3.3 Hero in detail

- **Left / top:** tagline (serif italic), H1 "Understand leg vein symptoms, Doppler reports and your
  care options", then a segmented control **"I have…"**: *Symptoms* · *A scan report* · *A
  treatment to decide* · *Need a specialist*. It is a real radio group (arrow keys move, 44 px
  targets, wraps on phones). The selected option sets:
  - the primary button (*Check your symptoms* / *Read my report* / *Compare treatments* /
    *Find care (demo)*);
  - one helper line ("8 questions · about 3 minutes · not a diagnosis", and so on);
  - the region highlighted on the drawing (calf and ankle / groin junction / great saphenous vein /
    none).
- **Right / below on phones:** the **living leg**, a single-weight line drawing of the leg's
  superficial veins (Forest and Sage on the Forest band). On first load it plays one ≤ 4 s
  "settle" (lines draw in, a valve closes) and then stays still. It responds to the selected
  situation with a 400 ms highlight. A small caption: "Illustration, not to scale."
- **Phones (360×640):** tagline, H1, segmented control, primary button within the first 340 px
  (the M2 one-line lede is replaced by the control, whose labels explain the product). The drawing
  sits below the button at a reduced height; urgent block starts on the first screen.
- **Desktop (≥1280):** 7/5 columns; drawing about 480 px tall; the urgent block is a one-line bar
  under the hero.
- **No JS / reduced motion:** static drawing, no settle; the control still works.

### 3.4 Tablets, laptops and large screens

- **768–1023:** hero stacks (text, control, button, drawing at 60% width); rail becomes 2 rows.
- **1024–1279:** hero side-by-side; header still uses the Menu button (M2 decision).
- **1280–1919:** full layout; container 1200 px.
- **≥1920:** container stays 1200 px; the Forest band runs full width; no layout changes (avoid
  stretched line lengths).

## 4. Motion design system (proposed DESIGN.md v5 section)

### 4.1 Purpose categories

| Category | Use | Duration / easing | Trigger | Rules |
|---|---|---|---|---|
| Feedback | hover, press, focus, toggles | 150 ms, `ease-standard` | user | colour/opacity/transform only |
| Transition | sheet, dialog, tab panel, view change | 250 ms enter / 150 ms exit | user | no layout-shifting transitions |
| Reveal | content entering the viewport | 250 ms, 8 px rise + opacity, ≤ 1 group per viewport, total stagger < 300 ms | scroll (IntersectionObserver), once | never on urgent content; content is visible without JS |
| Explanation | step-by-step diagrams (valve closing, catheter treatment) | 400 ms per step; sequences ≤ 5 s unless paused/controlled | user (Play / Next) | each step has a caption |
| Simulation | S1–S3 continuous illustration | ≤ 60 fps, runs only while ≥ 50% visible and the tab is visible | user (Play) | Pause/Play always visible (WCAG 2.2.2); stops when off-screen |
| Ambient | hero settle only | one run ≤ 4 s | page load | never repeats; none under reduced motion |

### 4.2 Tokens (additions to DESIGN.md)

`duration-quick 150ms` · `duration-standard 250ms` · `duration-slow 400ms` · `duration-step 400ms` ·
`duration-settle 4000ms (max)` · `ease-standard cubic-bezier(0.2,0,0,1)` · `ease-exit
cubic-bezier(0.3,0,1,1)` · `ease-flow linear` (simulated blood flow only) · `reveal-distance 8px` ·
`stagger 40ms (max 6 items)`.

### 4.3 Rules

- Animate only `transform` and `opacity` (and SVG `stroke-dashoffset`); never animate layout
  properties or filters.
- Nothing animates behind or over text, urgent notices, forms or results.
- No parallax, no scroll-jacking, no scroll-linked animation on body text.
- No flashing above 3 per second (WCAG 2.3.1); no red flashing at all.
- **Reduced motion:** simulations become a set of labelled still frames with *Previous / Next*;
  explanations jump to the end state with the caption; reveals and the hero settle are off.
- **Off-screen and hidden tabs:** every rAF loop and running animation pauses (IntersectionObserver
  + `visibilitychange`); a test asserts zero running animations when scrolled away.

### 4.4 Implementation recommendation

**CSS + Web Animations API + SVG first (0 kB).** Add **`motion/mini` (3.1 kB)** only if a sequence
needs promise-based chaining that WAAPI makes awkward. Do **not** adopt `motion/react` (42.6 kB) for
this work; if React layout animation is ever needed, use `LazyMotion` + `m` with features loaded on
demand (7.1 kB initial). `motion` is already installed, so none of this adds a dependency; removing
the unused package would be a separate package-file decision. Simulations use SVG (DOM-accessible,
crisp, themeable) with a single `requestAnimationFrame` loop per simulation; `<canvas>` only if
profiling shows SVG cannot hold 55 fps.

## 5. Educational simulation prototype plan

Common rules for all simulations:
- A visible label **on the visual itself**: "Educational illustration, not a real scan or your own
  blood flow." No device-style metadata (MHz, depth, PRF), no measured-looking values, no
  diagnostic words ("pathological", "normal result").
- A text alternative that conveys the same lesson, and live captions (`aria-live="polite"`) that
  describe each state change.
- Every control is a native button, radio or range input: keyboard operable, 44 px targets,
  visible focus, labelled.
- Lazy-loaded with the view that uses it; each ≤ 20 kB gzip.
- Clinical review of the depiction before public use (BRAND "Claims"); until then a "pending
  clinical review" note in the demo.

| ID | Simulation | Learning goal | Interaction | Reduced motion | Canonical home | Clinical review items |
|---|---|---|---|---|---|---|
| **S1** | Venous circulation and valve function | Valves and the calf pump move blood upward; a leaky valve lets it fall back (reflux) | Play/Pause; *Walking / Standing still*; *Working valves / Leaky valve*; captions per phase | 4 labelled frames, Previous/Next | `#learn` circulation (teaser on home) | Valve shape, flow direction, what "leaky" shows; no implied severity |
| **S2** | Anatomical leg explorer | Where the GSV, SSV, SFJ, SPJ, deep veins and perforators are, and how they appear on reports | Front/back toggle; hotspots mirrored by an accessible list; each opens a short definition and "on your report this may read as…" with a link to the term in the Doppler guide | Static (no motion needed) | `#learn` anatomy; linked from Doppler terms | Anatomical accuracy; simplification level |
| **S3** | Doppler waveform explorer | What a spectral trace shows during squeeze and release, and what "reflux duration" means as a concept | Buttons *Squeeze* / *Release*; a slider that lengthens backward flow with a duration bracket; side-by-side "illustrative example A / B" | Static traces with labels | `#doppler` (teaser on home); replaces the console-styled `DuplexUltrasoundExplorer` | Waveform shape; whether to show any threshold number (currently 0.5 s, unreviewed) |
| **S4** | Explanatory animations | How compression, ablation, adhesive and foam close or support a vein; how CEAP stages differ | 3–5 step sequences with Next/Previous; no autoplay | Final frame + captions | `#treatments`, `#learn` CEAP | Every mechanism depiction; no graphic imagery |

**Prototype process.** Each simulation is first built on a hidden prototype route (`#lab-…`, not in
navigation or the sitemap), measured against §6 and reviewed by the owner (and, for depiction,
a clinician) before it replaces anything on a public view.

**Illustration source.** BRAND allows diagrammatic line drawings; the owner's custom icon/mascot
set (M5) must not be recreated. The anatomy drawings are new artwork: decision §8-6.

## 6. Performance and accessibility acceptance criteria (additions to T1–T20)

Measured with `docs/redesign/evidence/perf-baseline/perf-baseline.js` (lab conditions in §2) and
the M2 audit scripts; budgets apply to the production build.

| # | Criterion | Budget / pass condition | Baseline |
|---|---|---|---|
| P1 | Initial JS on home (gzip) | ≤ baseline + 15 kB until M6 code-splitting; then ≤ 120 kB | 173.7 kB |
| P2 | Each simulation chunk (gzip) | ≤ 20 kB, loaded only by the view using it | — |
| P3 | CSS (gzip) | ≤ 20 kB | 16.1 kB |
| P4 | LCP (lab) | ≤ 2.0 s on every view; the hero drawing must not become a late LCP element | 1.40–1.59 s |
| P5 | CLS | ≤ 0.05 on every view (drawings reserve their size) | ≤ 0.050 |
| P6 | Total blocking time (lab) | ≤ 100 ms; no task > 100 ms during load | 0 ms; 63 ms |
| P7 | Interaction latency (Event Timing) | in-page controls ≤ 100 ms; view changes ≤ 200 ms | menu 24 ms; home→Learn **208 ms** |
| P8 | Simulation frame rate | median frame ≤ 18 ms, ≥ 95% of frames ≤ 33 ms at 4× CPU, measured over 10 s | — |
| P9 | Idle cost | 0 running animations and 0 rAF callbacks when the simulation is off-screen or the tab is hidden | — |
| P10 | Memory | heap growth ≤ 5 MB after 60 s of simulation | 3.9–6.9 MB |
| A1 | Pause control | every motion lasting > 5 s has a visible Pause/Play (WCAG 2.2.2) | — |
| A2 | Reduced motion | static-frame equivalent conveys the same lesson; 0 running animations (existing T11) | passes |
| A3 | Text alternative | each simulation has a written explanation and live captions announced politely | — |
| A4 | Keyboard | all simulation controls reachable and operable; focus visible on Forest and Ivory | — |
| A5 | Not colour-only | healthy/leaky, forward/backward flow are labelled in text and shape | — |
| A6 | Labelling | "Educational illustration" visible on every simulation at every size; no device metadata or diagnostic words (grep test) | `DuplexUltrasoundExplorer` fails today |
| A7 | Touch | targets ≥ 44 px; drag interactions also available as buttons or a range input | — |
| A8 | Flashing | no content flashes more than 3 times per second | — |
| A9 | Existing criteria | T1–T20 continue to pass; home T3 (CTA ≤ 340 px at 360×640) kept | M2 review pass |
| C1 | Content | one canonical destination per topic (content map); feature names match §2.3 of the audit (grep test) | many variants |

## 7. Staged implementation plan

The experience work runs as an **E-track** interleaved with the existing milestones. Each stage
ends with owner review; nothing starts without approval.

| Stage | Scope | Acceptance tests |
|---|---|---|
| **E0 — Approvals** (this document) | Owner decisions in §8; DESIGN.md v5 motion section and BRAND reconciliation written | Decisions recorded in `docs/decisions/` |
| **E1 — Content consolidation** | Content-audit actions 1–6, 8 (relabel only) and 9; naming unification; CTA rationalisation. No clinical text rewritten | C1 grep tests (names, CTA counts per view); safety tests unchanged and passing; urgent block present on all listed surfaces; "content moved to" log complete |
| **E2 — Motion foundation** | Tokens in `index.css`; `useInView`/visibility pause helper; Play/Pause control; reduced-motion frame switcher; Reveal utility (CSS) | P1, P3 within budget; A1, A2; P9 test on a sample; existing 114 interaction checks pass |
| **E3 — Prototype S1** on `#lab-valves` | Circulation and valve simulation | P2, P4, P5, P8–P10, A1–A8; owner review; clinician review of depiction |
| **E4 — Homepage v2** | §3 structure using S1 and a static S3 teaser | T3, T5, P1, P4–P7; home ≤ 8 screens at 390×844; one primary per viewport; first interaction (segmented control) keyboard- and screen-reader-tested |
| **E5 — S2 leg explorer and S3 waveform explorer** | In `#learn` and `#doppler`; S3 replaces the console-styled duplex simulation | P2, P8–P10, A1–A8, A6 grep passes for the whole site |
| **E6 — S4 explanatory animations** | Treatments and CEAP | P2, A1–A8 |

**Recommended order with existing milestones:** M2 review → E0 → E1 → E2 → E3 → M3 (directory and
demo request) → E4 → M4 + E5 (tools and guide) → E6 → M5 (owner SVGs, may restyle drawings) → M6
→ M7. Rationale: consolidation first so M3 and the new homepage use settled names; the S1
prototype validates the motion approach and budgets before the homepage depends on it.

## 8. Decisions requiring approval

| # | Decision | Recommendation |
|---|---|---|
| 1 | Adopt this direction ("living anatomy atlas") and record how it reconciles with BRAND's editorial calm | Approve |
| 2 | Hero concept: **A** segmented "I have…" control + living leg (§3.3); **B** scroll-driven story through the leg; **C** keep the M2 hero and add S1 below | **A** (B harms performance, scroll control and reduced-motion parity) |
| 3 | Hero ambient motion: one ≤ 4 s settle then still / continuous with Pause / none | One settle (no control needed under WCAG 2.2.2) |
| 4 | Simulation looping: user-started, loops only while visible with Pause, never autoplays | Approve (amends DESIGN.md "nothing loops indefinitely") |
| 5 | Animation technology: CSS/WAAPI/SVG first, `motion/mini` if needed, no `motion/react` | Approve; decide separately whether to remove the unused `motion` package later |
| 6 | Illustration source: diagrammatic SVG drawn in code now, restyled when the owner's set arrives / commission a medical illustrator / wait for owner artwork | Code-drawn diagrams now, clearly simplified; owner art replaces style later |
| 7 | Clinical review gate: who reviews depictions (S1–S4) and thresholds; may unreviewed simulations appear in the partner demo with a "pending clinical review" note? | Allowed in demo with the note; not on a public launch |
| 8 | Content consolidation items needing a choice: merge `TreatmentModalities` into the comparison; drop the topic explorer from `#learn`; "Patient portal" → "Visit prep"; one care-pathway step count (4 or 6); insurance text only in the FAQ | Approve all; 4-step pathway on home linking to the 6-step page until a clinician agrees one model |
| 9 | `DuplexUltrasoundExplorer`: replace with S3 (E5) vs relabel now | Relabel now in E1 (labels only), replace in E5 |
| 10 | DVT sign lists: unify `DvtAndMisconceptions` with `emergencyContacts.ts` (mentions Homans sign and Wells criteria) | Clinician decision; no change until then |
| 11 | Performance budgets P1–P10 as listed | Approve |
| 12 | Home length target ≤ 8 screens at 390×844 (replaces T8's ≤ 12) | Approve |
| 13 | Hidden `#lab-…` prototype routes in the demo build | Approve (not linked, removed before launch) |
| 14 | Test tooling: keep `playwright-cli` scripts (no dependency) vs add `@playwright/test` | Keep scripts until M6 |
| 15 | Sequencing in §7 (E-track before M3) | Approve |
