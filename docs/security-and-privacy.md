# Meridian Vascular — security and privacy (verified behaviour)

Last updated: 2026-10-21 (Milestone 1). This records what the code does today, as verified by
code inspection, automated tests and a browser network capture. **It is not a compliance
statement.** No legal, regulatory or clinical review has taken place.

## Data flows

| Data | Where it goes | Verified by |
|---|---|---|
| Educational guide messages | Stay in the browser tab; answered by local rules; not stored after the tab closes | `tests/phase0Safety.test.ts` group 15; browser run: no requests while chatting |
| Symptom-check answers and result | Browser memory only; used to build an on-device PDF if the user asks | Code inspection (`DegreeAssessment.tsx`, `generatePdfReport.ts`) |
| Uploaded photos and videos | Read into browser memory (`FileReader`); never uploaded; the PDF lists only how many were added | Code inspection; test group 11 |
| Demo request form (name, email, phone, preferences) | Browser memory only; shown back on the result screen without name or contact details; not transmitted | Test group 11; browser run: no non-GET requests during the flow |
| Analytics events | In-memory and `sessionStorage` log (cleared when the tab closes); nothing reads or sends it | Code inspection of `utils/analytics.ts`; test group 15 |
| Clipboard | Written only when the user presses a "copy" button | Code inspection |

### Analytics content (after Milestone 1)

Events record interaction steps only: question IDs and positions, the view navigated to, the
visit type of a demo request, and the length (not the text) of a guide message. Scores, severity
bands, symptom patterns, urgent-care flags, chosen doctors and personal details were removed from
event payloads in Milestone 1, and a test prevents them returning.

## External services

| Service | Purpose | Status |
|---|---|---|
| Google Fonts | Web fonts | Loaded on every page view (browser IP and user agent go to Google) |
| Google Gemini | — | **Removed.** No client, key read or route remains (`server.ts`); a dummy `GEMINI_API_KEY` triggers no external request (test group 8) |
| Any other third party | — | None found in code or in the cold-cache network capture |

## Secrets

- No secrets are used by the deployed site.
- No browser code reads environment variables.
- Vercel project environment variables could not be inspected from this repository. If a
  `GEMINI_API_KEY` is still configured there, it is unused and can be removed by the owner.

## Privacy wording in the UI

- The hero's "Zero External Trackers · No Cookies Used" was replaced with "No account needed ·
  Guide answers are pre-written", which the code supports. Avoid absolute privacy claims while
  Google Fonts is loaded from Google.
- The footer's "HIPAA Compliant" claim was removed.

## Open issues

| Issue | Severity | Next step |
|---|---|---|
| Google Fonts sends visitor IPs to Google | Low | Consider self-hosting fonts (Milestone 6; asset change) |
| Unreviewed clinical claims (hero, treatments, FAQ, footer insurer list) | Medium | Clinical review before public launch |
| No privacy notice or terms page | Medium | Needed before any real data collection |
| `metadata.json` declares a server-side Gemini capability | Low | Owner decision pending |
| Before real patient data, accounts, uploads or booking | — | Separate security and privacy review (roadmap Milestone 7) |
