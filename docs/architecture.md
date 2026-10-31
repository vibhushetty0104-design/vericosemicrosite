# Meridian Vascular — architecture (as implemented)

Last updated: 2026-10-21 (Milestone 1). Describes the code in this repository, not plans.
Plans live in [`roadmap.md`](roadmap.md) and [`redesign/technical-options.md`](redesign/technical-options.md).

## Summary

A single-page React application, built with Vite and deployed to **Vercel as static files**.
There is no server-side API in production. All features, including the educational guide,
the symptom check, the Doppler report guide and the demo appointment request, run in the browser.

| Layer | Technology | Notes |
|---|---|---|
| UI | React 19, TypeScript, Tailwind CSS 4, Lucide icons | Tokens in `src/index.css` are defined but not yet used by components (Milestone 2 onward) |
| Build | Vite 8 (`vite build` → `dist/`) | Main chunk ~634 kB; the PDF libraries are lazy-loaded |
| Hosting | Vercel, static | Verified 2026-10-21: `/api/*` returns Vercel `NOT_FOUND`; no serverless functions; no `vercel.json` |
| Local dev | `npm run dev` → `tsx server.ts` (Express + Vite middleware) | Local only, never deployed; it has no API routes |
| Tests | `tsx` scripts in `tests/` | `test:clinical`, `test:safety`; no browser test runner installed |

## Routing

Hash-based views in `src/App.tsx` (`#journey`, `#doppler`, `#assessment`, `#treatments`,
`#specialists`, `#dashboard`; empty hash = home). Hash routing needs no Vercel rewrites. Moving to
path routes would need a router decision and a `vercel.json` rewrite (deferred, Milestone 6).

## Main modules

| Area | Files | Responsibility |
|---|---|---|
| Shell | `App.tsx`, `components/Header.tsx`, `components/MobileBottomNav.tsx`, `components/Footer.tsx` | Views, navigation, global dialogs |
| Educational guide | `components/ClearPixAssistantModal.tsx` (UI), `utils/clinicalGuidance.ts` (rules), `content/guideLabels.ts` (labels) | Pre-written answers chosen by keyword intent; emergency rules first; honest fallback |
| Emergency guidance | `components/EmergencyGuidance.tsx`, `data/emergencyContacts.ts` | 112 / 108 and the outside-India line, shared by the guide and the screener |
| Symptom check | `components/DegreeAssessment.tsx`, `data/assessmentQuestions.ts`, `utils/generatePdfReport.ts` | Questionnaire, symptom pattern (not a CEAP stage), downloadable PDF built in the browser |
| Doppler tools | `components/DopplerReportDecoder.tsx`, `utils/clinicalReportParser.ts`, `data/dopplerTerminology.ts`, `components/DuplexUltrasoundExplorer.tsx` | Report term explanations, synthetic sample reports, simulation |
| Directory (demo) | `components/DoctorDirectory.tsx`, `data/doctorsData.ts` | Five fictional profiles with `isSyntheticDemo: true` and `DEMO_PROFILE_LABEL` |
| Demo request | `components/AppointmentModal.tsx` | Form and `DemoRequestResult`; nothing is transmitted |
| Media | `components/MediaUploader.tsx`, `components/ClinicalMediaSection.tsx` | Files are read into memory with `FileReader`; never uploaded |
| Analytics | `utils/analytics.ts` | Event log in memory and `sessionStorage` only; never read or sent |
| Dialog a11y | `utils/useAccessibleDialog.ts` | Focus trap, Esc, focus return |

## Educational guide data flow

```
user text ──► ClearPixAssistantModal.handleSendMessage
              └─► generateFallbackGuidance(text)      (utils/clinicalGuidance.ts, synchronous)
                    1. emergency red flags            → intent 'emergency' (112 / 108)
                    2. safety refusal (prescribe, …)  → 'safety-refusal'
                    3. negated / possible DVT, Doppler, treatments, wounds, swelling, spider veins
                    4. general vein words             → 'general-vein-symptoms'
                    5. anything else                  → 'unmatched' (honest fallback + supported topics)
              ◄── { reply, intent, urgencyLevel, suggestedQuestions, source: 'pre-written', … }
```

No network request is made. Each response carries an `intent` ID and `source`, so the UI could
later show answers from another approved source without changing the component (see
[decision 0002](decisions/0002-prewritten-educational-guide.md)).

## External requests made by the site

| Request | When | Data sent |
|---|---|---|
| Google Fonts CSS and font files (`fonts.googleapis.com`, `fonts.gstatic.com`) | Page load | Standard browser request (IP address, user agent). No app data |

There are no other external hosts, verified in a cold-cache browser run on 2026-10-21
(`redesign/evidence/m1/after/metrics.json`).

## Environment variables

| Variable | Read by | Effect |
|---|---|---|
| `PORT` | `server.ts` (local dev) | Dev server port |
| `NODE_ENV` | `server.ts` | `production` serves `dist/`; `test` skips `listen` |
| `DISABLE_HMR` | `vite.config.ts` | AI Studio editing convenience |
| `GEMINI_API_KEY`, `APP_URL` | **Nothing** | Still listed in `.env.example` (unchanged by owner decision); no code reads them |

No browser code reads any environment variable.

## Known constraints

- No server-side logic in production: features that need secrets, storage or messaging need an
  approved architecture change (Vercel functions or another service) first.
- `metadata.json` (Google AI Studio) still describes the project as "ClearPix" with a server-side
  Gemini capability. It is unchanged by owner decision and not used by Vercel.
- Two lockfiles exist (`bun.lock`, `package-lock.json`). Which one Vercel uses has not been
  confirmed from the build log.
- `@google/genai` and `dotenv` remain in `package.json`; `@google/genai` is no longer imported.
