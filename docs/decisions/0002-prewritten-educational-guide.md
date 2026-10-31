# 0002 — Educational guide answers from pre-written rules only

- Status: accepted (owner decision, 2026-10-21)
- Stage: A (pre-written) in the guide's staged plan

## Context

The guide's panel posted every message to `/api/assistant/chat`. Locally, with a key set, the
server forwarded the text to Google Gemini; in production the route did not exist, so the browser
always fell back to rule-based answers. Labels told users answers might be AI-generated, and the
model's instructions used the legacy "ClearPix" brand. Unmatched questions received a generic
vein answer, which implied understanding the rules did not have.

## Decision

- The guide answers synchronously in the browser from `generateFallbackGuidance`
  (`src/utils/clinicalGuidance.ts`). No network request is made.
- The Gemini client, key read and chat route were removed from `server.ts`.
- Each answer carries an `intent` ID and `source: 'pre-written'`. Emergency red flags are checked
  first.
- Questions without any vein or leg-health words get an honest "I don't have a pre-written answer"
  fallback with the supported topics and the emergency numbers.
- All entry points use the labels in `src/content/guideLabels.ts` ("Educational guide",
  "Pre-written guidance") and a non-AI icon.
- Urgent answers do not offer the demo appointment request.

## Alternatives considered

- Keep Gemini behind an environment switch (rejected: a hidden path could start sending messages
  if a variable is set).
- Keep the endpoint but return pre-written answers (rejected: production never had it, and the
  browser already holds the rules).

## Consequences

- No tokens, keys or external transmission. Answers are limited to the catalogue.
- The response shape (`intent`, `source`, `urgencyLevel`, `suggestedQuestions`) and the separation
  of the rules, labels and UI let a later stage (B: reviewed catalogue and retrieval; C: an
  approved, server-side model adapter with limits) be added without rewriting the panel.
- Moving the catalogue out of `clinicalGuidance.ts` into its own module is Milestone 4 work.
