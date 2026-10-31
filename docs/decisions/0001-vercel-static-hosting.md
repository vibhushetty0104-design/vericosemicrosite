# 0001 — Vercel static hosting with no production API

- Status: accepted (owner constraint, 2026-10-21)
- Context date: Milestone 0 / 1

## Context

The project must stay on Vercel. The repository has no `vercel.json`, no `api/` directory and no
linked `.vercel` project. On the live deployment, `GET /api/assistant/chat` returned Vercel's own
`NOT_FOUND` (not an Express response), and `/doppler` returned 404 (no rewrites). The Express
server in `server.ts` is therefore not deployed; it only runs locally through `npm run dev`. Local
development could reach Gemini through an Express route that production never had, so local and
production behaved differently.

## Alternatives considered

1. Keep the Express route for local use only (rejected: keeps the local/production mismatch and
   a latent Gemini path).
2. Add a Vercel serverless function for the guide (rejected for now: new infrastructure, secrets
   and rate limiting for a feature that must be pre-written).
3. Run everything in the browser and remove the route (chosen).

## Decision

The site remains a static Vite build on Vercel. Production has no server-side API. `server.ts`
stays as a local development server with no API routes.

## Consequences

- No secrets are needed in production.
- Any future server-side feature (real booking, accounts, an approved AI adapter) needs an
  explicit architecture decision, probably Vercel functions, with validation, limits and secrets
  handling.
- Path-based routing will need a `vercel.json` rewrite when introduced.
