# Meridian Vascular — technical options (routing, pre-rendering, testing, AI guide)

Status: **for decision. Nothing here has been installed.** Versions and peer ranges
were read from the npm registry on 2026-10-21 (`npm view`). Installed today: React
19.3.0, React DOM 19.3.0, Vite 8.3.4, Express 4.22.3. The app is a single-page app
using hash views (`App.tsx:61–74`). On Vercel it is served as static files (verified
2026-10-21: no serverless functions, `/api/*` returns `NOT_FOUND`); `server.ts` runs
only locally (see [decision 0001](../decisions/0001-vercel-static-hosting.md)).

> **Update after Milestone 1:** §4 is superseded. The owner decided the guide uses
> pre-written guidance only. The Gemini path and the chat route were removed
> ([decision 0002](../decisions/0002-prewritten-educational-guide.md)), so the
> disclosure, "Live AI" badges and rate-limiting plan below describe a possible future
> stage, not current behaviour. Sections 1–3 still stand.

Useful facts already in the stack:
- **React 19 hoists `<title>`, `<meta>` and `<link>`** rendered anywhere in the tree
  into `<head>`, so per-route titles and descriptions need no helmet library.
- **`react-dom/static` is installed** (prerender APIs), and **Vite builds SSR
  bundles natively** (`vite build --ssr`). Static pre-rendering is therefore possible
  with no new dependency.

---

## 1. Routing

Need: about 20 static routes (see audit §6), back/forward, scroll restoration,
redirects from old `#view` hashes, one `<h1>` and title per route, route-level code
splitting, and compatibility with pre-rendering.

| Option | Version · licence · size | Fit | Trade-offs |
|---|---|---|---|
| **A. In-house History API router** | No dependency | Good for a fixed, flat route list | About 80–120 lines to own (Link, matching, 404, scroll restoration, hash redirects); no community fixes; easy to get focus management wrong |
| **B. wouter** | 3.13.0 · Unlicense · 78 kB unpacked · peer `react >=16.8` | Good: tiny hooks API (`<Route>`, `<Link>`, `useLocation`), supports a static location for pre-rendering | Fewer built-ins (no loaders, no type-safe params); you write scroll restoration; smaller community than React Router |
| **C. React Router 8.5 (library mode)** | 8.5.0 · MIT · 2.9 MB unpacked · peer `react >=19.2.7` ✓ | Good: the de facto standard, well documented, `ScrollRestoration`, nested layouts | Larger runtime than B; data and framework features unused here; the major version moves quickly |
| C2. React Router framework mode | + `@react-router/dev` 8.5.0 · peer `vite ^7 \|\| ^8` ✓ | Built-in `prerender` option | Requires moving to its `app/` file conventions and build pipeline, and reworking `server.ts`. Too large a change for this redesign |
| D. TanStack Router | 1.170.45 + plugin 1.168.47 · MIT · peer `vite >=5…8` ✓ | Strong type safety, file-based routes | Most to learn and configure; heavier than this site needs |

**Recommendation: B (wouter)**, with a ~30-line `useScrollRestoration` and a
hash-redirect shim. If you'd rather standardise on the common choice, **C (React
Router library mode)** is the safe alternative at a larger bundle cost. Avoid C2
and D for now.

## 2. Pre-rendering (SEO and social previews)

Need: real HTML for each public route (headings, copy, title, description, OG tags)
so search and link-preview crawlers see content; hydrate on the client.
Tools stay client-rendered; their static shell and intro are pre-rendered.

| Option | Version · licence | Fit | Trade-offs |
|---|---|---|---|
| **1. Custom script with built-in APIs** | No dependency (Vite SSR build + `react-dom/static` + `hydrateRoot`) | Good: full control, works with A, B or C | About 100–150 lines (SSR entry, route list, HTML template injection); every component must be render-safe on the server (no `window`, `matchMedia` or `sessionStorage` during render; most current uses are in effects and need an audit) |
| 2. vite-react-ssg | 0.9.2 · MIT · peer `vite ^6.4…^8` ✓, `react ^17…^19` ✓ | Convenient | Pre-1.0; pulls in `jsdom` 24 and **`react-helmet-async` ^1.3, whose peer range predates React 19** (likely peer-dependency conflicts); expects React Router |
| 3. vite-prerender-plugin | 0.5.14 · MIT · 36 kB · peer `vite 5–8` ✓ | Small | Pre-1.0; you still write the `prerender()` function and the route list; little gained over option 1 |
| 4. React Router framework `prerender` | With C2 | Built in | Only with C2 (see above) |
| 0. No pre-render | — | — | Google renders JS but more slowly; WhatsApp, LinkedIn and X previews don't run JS, so every shared link shows the home metadata |

**Recommendation: option 1 (custom, no dependency)**, run as a `postbuild` script
after the client build. It also produces `sitemap.xml` from the route list, which
must exclude demo-only and `noindex` routes. Canonical and OG URLs stay **unset or
relative until the production domain is confirmed**.

Prerequisite work, whichever option: make components render-safe on the server
(guard browser globals; move them into effects).

## 3. Automated browser testing

Need: the mobile acceptance tests (audit §4.11) at 360, 390, 430 and 768px,
repeatable before and after each phase, ideally in CI later.

| Option | Version · licence | Fit | Trade-offs |
|---|---|---|---|
| **a. `playwright-cli` scripts (current)** | Already installed globally (bundles its own Playwright); no project dependency | Good for now: the measurement script from this audit already runs | Not a test runner (no assertions, report or CI integration); depends on each machine having the global CLI; one script, not a suite |
| **b. `@playwright/test`** | 1.64.1 · Apache-2.0 · a thin package that depends on `playwright` 1.64.1 | Strong: projects per viewport, WebKit for iOS Safari, parallel runs, HTML report, CI-ready | New devDependency; browsers can use the installed Chrome (`channel: 'chrome'`) to avoid a download, but WebKit needs `npx playwright install webkit` (a binary download, separate approval) |
| c. Vitest 5 + `@vitest/browser` | 5.0.5 · MIT · peer `vite ^6.4…^8` ✓ | Component tests in a real browser | Not needed for page-level mobile criteria; adds a second runner next to the existing `tsx` tests |
| d. Automated a11y rules (axe-core) | Not evaluated in detail | Useful add-on to b | Another dependency; complements, doesn't replace, manual screen-reader checks |

**Recommendation:** keep **(a)** for Milestone 1 (no dependency). Approve **(b)** as
a devDependency when you're ready to make the acceptance tests a permanent suite
(Phase 2.5 onward), with WebKit as a separate approval. Consider **(d)** with (b).

## 4. AI guide — disclosure, labelling and rate limiting (superseded; kept for a possible future stage)

Behaviour before Milestone 1 (read from code at the time; since removed):
- `POST /api/assistant/chat` (`server.ts:36`) sends the user's text to Google Gemini
  (`gemini-3.8-flash`) when `GEMINI_API_KEY` is set. It otherwise returns
  pre-written, rule-based guidance labelled `source: 'pre-written'`. Live answers
  carry `source: 'ai-generated'`. The rule-based red-flag check can only raise
  urgency, never lower it (good, keep).
- There is **no rate limiting**, no explicit request-size limit (Express's default
  100 kB JSON applies), no prompt-length cap and no request timeout.
- The system prompt still names the assistant **"ClearPix AI … for Meridian Vascular
  & ClearPix Healthcare"** (`server.ts:47`), so live answers may use the legacy
  name. The client sends a `User-Agent: aistudio-build` header (`server.ts:26`), a
  leftover from AI Studio.
- The panel already labels each answer as AI-generated or pre-written and shows an
  educational disclaimer (`ClearPixAssistantModal.tsx:198,414`).

### 4.1 Disclosure (demo, now)

- **Before the first message** (panel intro, not dismissible for the session):
  "Live answers come from Google's Gemini AI. What you type is sent to Google to
  create the answer. Don't include your name, phone number or other personal
  details." Links: "How Meridian Guide works" and the privacy page.
- **Persistent line above the input:** "Sent to Google Gemini · not medical advice".
- **When live AI is off** (no key, or an error fallback): a banner "Live AI is off
  in this demo. You'll see pre-written answers." The input hint drops the Gemini
  line.
- **Never claim** retention periods, deletion or compliance on Google's behalf.
  Link to Google's own terms instead, and have the wording reviewed before public
  use.

### 4.2 Distinguishing live AI from pre-written answers

| Answer source | Badge (text + icon) | Extra |
|---|---|---|
| `ai-generated` | **"Live AI · Gemini"** · Lucide `Bot` | "AI can be wrong. Check with a specialist." under the answer |
| `pre-written` | **"Pre-written answer"** · Lucide `BookOpen` | "Written guidance, not generated for you." |
| Urgent override | Danger notice above either badge | 112 / 108 tel: links from `emergencyContacts.ts` |

Badges use text and icon, never colour alone, and are announced with each message
(`aria-describedby`).

### 4.3 Rate limiting and abuse controls (plan, before public exposure)

| Control | Proposal |
|---|---|
| Per-client limit | Sliding window, e.g. 10 requests/minute and 60/day per IP; 429 response with a friendly "Try again later" and the pre-written fallback |
| Global ceiling | Daily cap across all users, plus an `AI_GUIDE_ENABLED` environment switch that forces pre-written answers |
| Input limits | `express.json({ limit: '16kb' })`; prompt ≤ 2,000 characters; history ≤ 10 messages |
| Timeout | Abort the Gemini call after about 15 s and fall back to pre-written |
| Logging | Counts and error types only, never message content |
| Prompt | Rename to Meridian Guide; remove "ClearPix"; keep the safety rules |
| Implementation choice | **In-house limiter** (no dependency, ~40 lines, in-memory; fine for one server instance) **or `express-rate-limit`** 8.7.1 · MIT · peer `express >= 4.11` ✓ (standard, supports external stores). If the app moves to serverless or multiple instances, either option needs a shared store (open question: deployment target) |

**Recommendation:** add the disclosure and labelling in Milestone 1 (demo). Do the
rate limiting, timeout and input caps in the phase before any public exposure.
Choose in-house vs `express-rate-limit` once the deployment target is known.

## 5. Decisions requested

1. Router: **wouter (B)** or **React Router library mode (C)**?
2. Pre-rendering: approve the **custom no-dependency script (option 1)**?
3. Testing: approve **`@playwright/test`** as a devDependency at Phase 2.5 (and
   WebKit download separately)?
4. AI rate limiting: in-house or `express-rate-limit`, after you confirm the
   **deployment target** (single Express server vs serverless)?
