# Meridian Vascular — roadmap

Last updated: 2026-10-21 (experience track proposed). Status values: **done** (implemented, awaiting owner review where
noted), **next**, **later**, **not yet justified**.

| Milestone | Scope | Status |
|---|---|---|
| 0 — Discovery and baseline | Repository, Vercel architecture, data flows, baselines | Done |
| 1 — Demo honesty and safety | Pre-written guide only, labels, demo data, request wording, contact details, domain references, analytics minimisation, tests, docs | **Done, awaiting owner review** |
| 2 — Mobile homepage and navigation | One compact header and menu sheet, no bottom dock or floating button, first-screen CTA, about 8 home sections, `#learn` view; review and stabilization pass | **Done, awaiting owner review** ([evidence](redesign/evidence/m2/README.md)) |
| 3 — Directory and demo request | Compact provider cards, filters and sort, provider data model, multi-step request flow | Next |
| 4 — Educational tools and guide | Guide catalogue in its own module, more intents, quick replies; Doppler and comparison layouts; clinical-claim list | Next |
| 5 — Owner-supplied SVGs and mascot | Audit and integrate the supplied assets | Waiting for assets |
| 6 — SEO, performance, Vercel hardening | Routing, pre-rendering, `vercel.json`, metadata, font self-hosting, bundle size | Later (decisions needed) |
| 7 — Production-readiness assessment | Verification, real booking, accounts, documents, content review, AI, languages | Later (assessment only) |

### Experience track (proposed 2026-10-21, awaiting approval)

From the owner's "Product Experience Direction" brief. Full proposal:
[redesign/experience-direction.md](redesign/experience-direction.md); content audit and canonical
map: [redesign/content-audit.md](redesign/content-audit.md); performance baseline:
[redesign/evidence/perf-baseline/](redesign/evidence/perf-baseline/).

| Stage | Scope | Status |
|---|---|---|
| E0 — Approvals | Decisions 1–15 in the proposal; DESIGN.md v5 motion section | **Awaiting owner review** |
| E1 — Content consolidation | Canonical content map applied; feature names unified; CTAs rationalised; duplicate sections merged (no clinical text rewritten) | Proposed |
| E2 — Motion foundation | Motion tokens, visibility/reduced-motion helpers, Play/Pause control (CSS/WAAPI/SVG, no new dependency) | Proposed |
| E3 — Simulation prototype S1 | Venous circulation and valve-function simulation on a hidden prototype route | Proposed |
| E4 — Homepage v2 | "I have…" hero with living leg drawing, compact "When to get help", S1 section, Doppler teaser, symptoms-to-decision rail; ≤ 8 screens at 390×844 | Proposed |
| E5 — Leg explorer (S2) and Doppler waveform explorer (S3) | In `#learn` and `#doppler`; S3 replaces the console-styled duplex simulation | Proposed |
| E6 — Explanatory animations (S4) | Treatment mechanisms and CEAP stages | Proposed |

Proposed order: M2 review → E0 → E1 → E2 → E3 → M3 → E4 → M4 with E5 → E6 → M5 → M6 → M7.

## Decisions pending

| Decision | Needed by |
|---|---|
| Router (wouter or React Router library mode) | Milestone 6 |
| Pre-rendering approach (custom script without dependencies recommended) | Milestone 6 |
| `@playwright/test` as a devDependency; WebKit download | Milestone 2 or later |
| `metadata.json` (AI Studio) update or removal | Any time |
| Lockfile clean-up (`bun.lock`) after checking the Vercel build log | Milestone 6 |
| Removing unused `@google/genai` (and `dotenv` if unneeded) | Any time |
| Production domain | Before canonical, OG URL and sitemap |
| Clinical reviewer | Before public launch |
| Multilingual support | Open |
| Experience direction decisions 1–15 (hero concept, motion and looping policy, animation technology, illustration source, clinical review gate, consolidation choices, budgets, sequencing) | Before E1 |

## Deferred work

- **Next:** clinical-claim register (hero, treatment comparison, FAQ JSON-LD, footer and directory
  insurer lists); US wording in one guide answer ("Medicare"); unused imports and `ClearPix` names
  in code comments and the guide component's file name.
- **Later:** remove the stale `.env.example` entries for `GEMINI_API_KEY` and `APP_URL` (owner
  decision); remove `tests/testEndpoints.mjs`, which targets the removed chat route and is not run
  by any script (left in place because it holds uncommitted owner changes).
- **Not yet justified:** database, CMS, authentication, rate limiting (no API exists), any AI
  provider, analytics service.
