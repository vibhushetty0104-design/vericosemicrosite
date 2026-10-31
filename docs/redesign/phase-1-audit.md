# Meridian Vascular — Phase 1 audit and redesign plan (v4)

Status: **Milestone 1 implemented on 2026-10-21 and awaiting owner review (§9.1).
Layout and navigation are unchanged; Milestone 2 has not started.**
Companion files: [`BRAND.md`](../../BRAND.md) (v4) · [`DESIGN.md`](../../DESIGN.md) (v4)
· [`../architecture.md`](../architecture.md) · [`../security-and-privacy.md`](../security-and-privacy.md)
· [`../roadmap.md`](../roadmap.md) · [`../decisions/`](../decisions/)
· [`technical-options.md`](technical-options.md) (routing, pre-rendering, testing,
AI guide)

**Owner decisions, 2026-10-21 (v3)**
1. Keep all fictional doctors and demo functionality. Replace real institutional,
   insurer, regulator and accreditation associations on fictional profiles with
   clearly fictional equivalents (§3.4).
2. `#A9472F` for white-text primary buttons; state contrast verified (DESIGN.md).
3. Source Serif 4 display; readable sans (Plus Jakarta Sans) for body and controls.
4. Lucide for functional icons until the owner's custom SVGs arrive; don't recreate
   them.
5. Routing, pre-rendering and browser testing investigated, with nothing installed
   ([technical-options.md](technical-options.md)).
6. Keep the AI guide in the demo, disclose Gemini transmission, distinguish
   pre-written from live AI, and rate-limit before public exposure.
7. Production domain stays unset; multilingual support stays open.
8. The mascot stays subtle; the owner supplies the mascot and SVG icons.

**What changed in v2**
- The product is a **partner demo**. Fictional doctors, sample fees, illustrative
  slots and the simulated request flow are intended and **stay**. Findings are now
  triaged into demo-acceptable, pre-launch UX, and claims/privacy/security issues
  (§3.3).
- A **provider data model** lets verified records replace demo records later without
  rebuilding the directory UI (§5).
- A dedicated **mobile UX section** (§4) with new evidence at 360, 390, 430 and 768px.
- The mascot is **kept** as a small, still supporting element.
- v1's "replace the directory with an empty state" is **withdrawn**.

Audited: working tree on `chore/claude-skill-toolkit`, including the uncommitted
Phase 0 safety work (`EmergencyGuidance`, `emergencyContacts`,
`useAccessibleDialog`, `phase0Safety.test.ts`), treated as the baseline.

## 1. How this was audited

| Method | What it covered | Limits |
|---|---|---|
| `consistent-ui` sweep | Frequency tables over all 31 components | Static; scores are judgement calls |
| `website-design:web-review` + `playwright-cli` | Rendered app (Vite dev server) at **360×800, 390×844, 430×800, 768×1024**, plus 1440×900; all 7 views; doctor card, request modal, treatment table and Doppler case opened; keyboard Tab pass; reduced motion | Android emulation only (no iOS Safari); no real screen reader run; AI endpoint not running |
| `a11y-audit` contrast script | Current and proposed colour pairs | Contrast only |
| Production build to a scratch folder | Bundle sizes | `dist/` untouched |
| Code reading | Routing, state, data, structured data, server | **Clinical accuracy not verified**; items marked *clinical review* need a clinician |

Screenshots are kept in the session scratchpad, not in the repo.

---

## 2. Summary

The demo works and has unusually strong clinical tools (the Doppler decoder,
screener and treatment comparison), but on a phone it reads as one 56–63-screen
document. It has three navigation systems, 126px of permanently fixed UI covering
content and safety notices, and controls that are mostly too small or too tiny to
read. Demo labelling exists but is quiet: a grey 10px pill on a 597px-tall card.

The highest-value changes are, in order:
1. one compact header with a menu sheet, removing the dock and floating button;
2. a first screen that shows the brand, one CTA and the urgent line;
3. an 8-section home with tools one tap away rather than inline;
4. compact provider cards with a prominent demo label;
5. a 4-step request flow that ends in an unmistakable demo result;
6. a fix list for misleading real-world names inside demo content (colleges, NMC,
   insurers, accreditation).

---

## 3. Current-state audit

### 3.1 Key measurements

| Measure | 360px | 390px | 430px | 768px |
|---|---|---|---|---|
| Home length (screens of the viewport height) | **63.2** | 59.8 | 56.5 | 33.3 |
| Fixed UI height (header + dock) | 126px | 126px | 126px | 128px |
| Home: controls under 44px / total | 72 / 130 | 70 / 130 | 71 / 130 | 72 / 131 |
| Home: text elements under 12px | 262 | 262 | 262 | 269 |
| Home: first CTA fully in first screen | **No** (top at 835px) | **No** (865px) | Yes | Yes |
| Specialists: length / controls under 44px | 13.8 / 35 of 43 | 13.2 / 40 of 43 | 12.7 / 40 of 43 | 7.0 / 36 of 43 |
| Doppler view length | 9.5 | 9.1 | 8.8 | 5.3 |
| Page-level horizontal scroll | None | None | None | None |
| `<h1>` on Doppler, Screener, Treatments, Specialists | Missing (all widths) | | | |

Also: 46 hard-coded colours (1,766 uses; CSS tokens used 0 times), a 637 kB main
JS chunk (173 kB gzip), and 5 font families loaded.

### 3.2 Consistency health score (consistent-ui)

| # | Dimension | Score | Top drift |
|---|---|---|---|
| 1 | Spacing & layout | 2/4 | Shared container; section padding has no rhythm |
| 2 | Typography | 1/4 | 33 sizes; 166 uses of 10–11px |
| 3 | Colour & theme | 1/4 | Tokens unused; two forest greens; off-brand emerald, amber, sky |
| 4 | Components | 1/4 | Shared `.cp-*` classes unused; buttons re-built per file |
| 5 | Iconography | 2/4 | One library; 7 sizes; stroke unset |
| 6 | Radius / shadow | 2/4 | 9 radii; 16 shadows (10 arbitrary) |
| 7 | Interaction & motion | 2/4 | Good global reduced-motion; 16 no-op `animate-in`; 9 infinite pulses |
| 8 | Forms | 3/4 | Labelled, dialog hook; inconsistent required markers |
| 9 | Page chrome | 1/4 | Three navigation systems; per-view prev/next rows |
| 10 | Copy & microcopy | 1/4 | Mixed case; Booking / Request / Simulate OPD; Portal / Dossier / Dashboard |
| | **Total** | **16/40: Poor** | Root cause: no enforced token or component layer |

**Keep:** one icon library; the global reduced-motion override (verified working);
the accessible typewriter fallback; the dialog focus trap; lazy-loaded PDF code;
Indian emergency numbers from one data file; the `isSyntheticDemo` flag on every
doctor; session-only analytics; **no page-level horizontal overflow at any width**;
a stacked "mobile comparison view" already exists for treatments; demo disclosure
copy already exists on the directory, the request modal and Doppler cases.

### 3.3 Triage: what blocks what

#### A. Demo-only limitations: acceptable for the partner demo (keep, label well)

| Item | Where | Condition for keeping |
|---|---|---|
| 5 fictional doctor profiles with credentials, bios, languages | `src/data/doctorsData.ts` | "Demo profile · fictional" next to each name (§4.5) |
| Sample consultation fees (₹900–1,500) | `doctorsData.ts`, `DoctorDirectory.tsx:365` | Shown as "Sample fee" |
| Illustrative appointment slots ("Tomorrow, 11:00 AM") | `doctorsData.ts`, `DoctorDirectory.tsx:384` | Shown as "Sample time", never sortable as availability |
| Simulated request flow and result | `AppointmentModal.tsx` | Ends in "Demo request: not sent to any clinic"; no confirmation-style code (§4.6) |
| Synthetic Doppler case studies | `DopplerReportDecoder.tsx` | Labelled synthetic; no real lab or accreditation names (see C) |
| Visit prep held only in the browser session | `PatientPortal.tsx`, `App.tsx` state | Says "Saved on this device for this session" |
| No real scheduling, partner data or verification | — | The data model has room for it (§5) |
| Pre-written AI answers when no API key | `ClearPixAssistantModal.tsx` | The source label ("pre-written") stays visible |

A simulated feature is **not** a reason to remove it.

#### B. UX and accessibility: fix before a public launch

| # | Issue | Evidence | Section |
|---|---|---|---|
| B1 | Three navigation systems; 126px fixed UI | All widths below 1024px | §4.2 |
| B2 | First CTA below the fold at 360/390px | 835px / 865px | §4.3 |
| B3 | Home is 56–63 screens; 18 sections; content duplicated across views | `App.tsx:315–414` | §4.4 |
| B4 | Most controls under 44px; 262 sub-12px text elements on home | Measurements | §4.8 |
| B5 | Missing `<h1>` on 4 views; no skip link; 6 of 153 buttons use the focus style | Code + Tab pass | §4.9 |
| B6 | Contrast failures: `#707E94` 3.85:1, `#7A8A84` 3.39:1, white on `#C85A3F` 4.21:1 | Contrast script | DESIGN.md |
| B7 | Provider cards 597px tall; demo label low-salience 10px grey | 390px screenshot | §4.5 |
| B8 | Request form: one long 8-field page in a 776px modal; truncated doctor select; no review step | 390px | §4.6 |
| B9 | Treatment card badge ("Class 1A first-line…") clips past the card edge; option tabs wrap under the dock | 360px | §4.7 |
| B10 | Tablet: hamburger + 2 header buttons + bottom dock; dock covers hero links; hero drawing runs behind CTAs | 768px | §4.2 |
| B11 | Hash routing: one URL and title; client-only render | `App.tsx:61–74` | Roadmap 2.5 |
| B12 | 637 kB main chunk; typewriter delays hero text; blur blobs; infinite loops | Build, code | §4.10 |
| B13 | Tokens bypassed (46 hex values); 25 arbitrary font sizes | consistent-ui | DESIGN.md |

#### C. Clinical, privacy, security or misleading claims: resolve before that functionality is used publicly

Marked **(ext. demo)** where it should also be fixed before the demo is shown
outside controlled sessions, because it attaches real names to fiction.

| # | Issue | Where | Resolution |
|---|---|---|---|
| C1 | Fictional doctors linked to **real** colleges (BMCRI, PGI Chandigarh), an "NMC Credentials" heading, and named insurers **(ext. demo)** | `doctorsData.ts` (e.g. lines 58–75), `DoctorDirectory.tsx:320` | **Resolved in M1.** **Approved:** keep the profiles; replace per the §3.4 plan ("Demo Medical College A, Bengaluru (fictional)", "Sample credentials", "Sample insurer note (demo)") |
| C2 | Synthetic Doppler case on a fictional "Meridian Vascular Diagnostic Laboratory (ICAAVL Accredited)", headed "Official examination transcript" **(ext. demo)** | `DopplerReportDecoder.tsx` (case data) | **Resolved in M1.** Drop the accreditation; title it "Sample report (synthetic)" |
| C3 | Footer contacts that look real (US-style address, `(800) 555-VEIN`, email) and "Meridian Vascular Center" (footer, request modal, JSON-LD publisher) **(ext. demo)** | `Footer.tsx:44,48,52,123`, `AppointmentModal.tsx:134`, `index.html:100` | **Resolved in M1** (contacts removed). Label "Sample contact details (demo)" or remove; use "Meridian Vascular" |
| C4 | Hero and treatment claims: named insurers, "walk out within 2 hours", "Zero prolonged bed rest", SVS/AVF "Clinical Standards" and "Evidence Standard" badges, ">1000 ms … deep vein patency" label, "Painful surgical vein stripping is historically obsolete" | `Hero.tsx:291,355–364,390–393,414–415,427–431,477`; `TreatmentComparison.tsx:51` and intro | *Clinical review*; move into a claims register; ship reviewed wording only |
| C5 | Uncited statistics ("Up to 90% risk", "2.4x", "+40%", "90–95% … Class 1A … NICE CG168") | `Causes.tsx`, `TreatmentComparison.tsx:51` | *Clinical review*; cite or remove |
| C6 | Privacy claim "Zero external trackers · No cookies used" while Google Fonts loads and AI chat text goes to Google Gemini | `Hero.tsx:296`, `index.html:42`, `server.ts:5,71` | **Resolved in M1** (pre-written guide; accurate hero line). Replace with an accurate data-use notice; Gemini disclosure and source badges in the AI panel ([technical-options §4](technical-options.md)) |
| C6b | AI system prompt names the assistant "ClearPix … Meridian Vascular & ClearPix Healthcare"; a leftover `aistudio-build` User-Agent | `server.ts:47`, `server.ts:26` | **Resolved in M1** (prompt and route removed). Rename to "Meridian Guide"; review the header |
| C7 | The demo request form asks for full legal name, email and phone | `AppointmentModal.tsx:322,339` | Verified to stay in the browser (analytics logs only modality, doctor and pattern). For demos add "Use sample details" and keep the "not sent" notice; real collection needs a privacy notice and consent |
| C8 | AI proxy endpoint has no rate limiting in `server.ts` (none found) | `server.ts:36` | Add rate limiting and abuse controls before public exposure |
| C9 | Structured data | `index.html:47–152` | **Resolved in M1** (no provider types; no preview-domain URLs). Today **no demo providers** appear in JSON-LD (verified). Rule going forward: only `status: "verified"` records may emit `Physician` / `MedicalClinic`; demo routes get `noindex` |
| C10 | FAQ JSON-LD repeats coverage and day-care timing claims | `index.html:126–139` | Same review as C4 |

### 3.4 Demo data replacement plan (approved decision 1)

Scope: real-world **associations** on fictional people, places and records. The
profiles themselves, the sample fees, sample times, bios, languages, expertise,
cities and degree types stay. The pattern follows BRAND.md › Demo Content:
lettered fictional names that can't collide with real institutions.

| Where | Current (real association) | Proposed demo equivalent |
|---|---|---|
| `doctorsData.ts:59` Dr. Arvind Rao · credentials | "…, RPVI" | "MBBS, MS, MCh (Vascular Surgery) · Vascular ultrasound interpretation certificate (sample)" |
| `doctorsData.ts:67` · education | "Bangalore Medical College (BMCRI) · MCh … (PGI Chandigarh)" | "Demo Medical College A, Bengaluru (fictional) · MCh, Demo Institute B (fictional)" |
| `doctorsData.ts:71` · insurance | "Star Health, HDFC ERGO, ICICI Lombard" | "Sample insurer note (demo): cashless eligibility depends on the patient's policy" |
| `doctorsData.ts:86` Dr. Meera Nambiar · education | "Seth GS Medical College & KEM Hospital, Mumbai · FVIR (CMC Vellore)" | "Demo Medical College C, Mumbai (fictional) · Fellowship, Demo Institute D (fictional)" |
| `doctorsData.ts:90` · insurance | "Empanelled … with Major Indian Private Insurers" | "Sample insurer note (demo): no empanelment is implied" |
| `doctorsData.ts:105` Dr. Rajesh Kulkarni · education | "AIIMS New Delhi · DNB … (NBE)" | "Demo Medical College E, Delhi (fictional) · DNB (Peripheral Vascular Surgery)" |
| `doctorsData.ts:109` · insurance | "CGHS/ECHS Illustrative Advisory" | "Sample insurer note (demo): government scheme eligibility isn't modelled" |
| `doctorsData.ts:116` Dr. Ananya Sen · credentials | "Certified Venous Wound Specialist" | "Venous wound care training (sample)" |
| `doctorsData.ts:124` · education | "Osmania Medical College, Hyderabad · Fellow European Venous Forum" | "Demo Medical College F, Hyderabad (fictional) · Fellowship, Demo Venous Society (fictional)" |
| `doctorsData.ts:143` Dr. Karthik Raman · education | "Madras Medical College (MMC Chennai)" | "Demo Medical College G, Chennai (fictional)" |
| `doctorsData.ts:73…149` `demoRecordNotice` ×5 | "Fictional Illustrative Profile · Non-Contracted Practitioner…" | "Demo profile · fictional" |
| `DoctorDirectory.tsx:320` | "NMC Credentials:" | "Sample credentials:" |
| `PatientOrientation.tsx:62` | "NMC-Registered Surgeons" | "Demo specialist profiles" |
| `dopplerTerminology.ts:147, 189` sample reports | "Meridian Vascular Diagnostic Laboratory (ICAAVL Accredited)" | "Demo Vascular Imaging Lab (fictional) · sample report" |
| `DopplerReportDecoder.tsx` case header | "Official examination transcript (synthetic demo)" | "Sample report (synthetic)" |
| `Footer.tsx:44, 48, 52` | Address, `(800) 555-VEIN`, email | Keep only under a visible "Sample contact details (demo)" label, or remove (owner's choice in Milestone 1) |
| `Footer.tsx:123`, `AppointmentModal.tsx:134`, `index.html:100` | "Meridian Vascular Center" | "Meridian Vascular" |

**Not in this scope** (these are claims, not profile associations, and go to
clinical review under C4/C10): insurer names in `Hero.tsx:427–431`,
`TreatmentComparison.tsx:51` and `Footer.tsx:98`; the credential glossary's
evaluative wording ("Premier NMC-recognized…", "International gold-standard…",
`doctorsData.ts:7–33`), which explains what a qualification is rather than
attaching it to a person. I recommend neutral wording there too, as a claims fix.

### 3.5 Clinical education features worth keeping

| Feature | Component | Verdict |
|---|---|---|
| Doppler report decoder (tested parser) | `DopplerReportDecoder`, `utils/clinicalReportParser.ts` | **Keep; flagship tool** (mobile pattern §4.7) |
| Doppler prep guide and glossary | `DopplerEducationGuide`, `data/dopplerTerminology.ts` | Keep |
| Duplex simulation | `DuplexUltrasoundExplorer` | Keep as a learning tool, off the home page |
| CEAP stage explorer | `ProgressionCEAP` | Keep; "stages a clinician assigns" |
| Symptom check + photos + PDF | `DegreeAssessment`, `ClinicalMediaSection`, `MediaUploader`, `generatePdfReport` | Keep, simplify, rename |
| Venous vs arterial vs nerve pain | `LegPainDifferential` | Keep |
| DVT signs and myths | `DvtAndMisconceptions`, `EmergencyGuidance` | Keep; split urgent from myths |
| Treatment comparison | `TreatmentComparison` | Keep after claims review |
| Question builder and visit prep | `DoctorVisitGuide`, `PatientPortal` | Keep; merge as "Visit prep" |
| Care pathway | `VascularCareJourney` | Keep; condense to 4 steps |

---

## 4. Mobile UX

Design target: **360px first**, checked at 390 and 430, then 768. Phones are the
primary surface, not a compressed desktop.

### 4.1 Evidence from the mobile audit

1. **The first screen sells nothing clearly.** At 360/390px the brand name appears
   twice (header and hero kicker), the H1 is a 5-line typewriter headline, and both
   CTAs sit below the fold. At 360px the DVT notice is under the bottom dock.
2. **Fixed UI eats 16–17% of every screen** (126px of 732–844px), on every view.
   The dock covers the start of the screener's first question (390px), the Doppler
   view's safety notice (390px) and treatment option tabs (390px).
3. **Navigation competes with itself:** a floating pill header with a hamburger, a
   5-item dock with different labels ("Journey" vs "Care Pathway", "Doctors" vs
   "Specialists"), and a 5-link strip in the hero. At 768px the header adds two
   more buttons while the dock stays.
4. **Length:** home is 56–63 phone screens; the directory is about 13 screens for 5
   profiles, mostly because each card is 597px with the full bio, education,
   expertise, fee and insurance all visible.
5. **Touch and type:** 35–40 of 43 directory controls are under 44px; 262 text
   elements on the home page are under 12px; uppercase letter-spaced mono labels
   are used as decoration.
6. **Demo labels exist but don't land:** the directory's notice is a long
   paragraph above a 4-line H2 ("…(Demonstration Directory)"), while each card's
   label is a 10px grey pill below the credentials, outranked by red credential
   text.
7. **The request flow** is a single 8-field form (title "Simulate Clinical
   Consultation Request") with no steps, no review step, and a result titled
   "Simulated Intake Logged · Simulation ID", which looks like a confirmation code.
8. **Tools:** no page-level horizontal overflow (good), but a treatment badge clips
   past its card at 360px, Doppler case values use colour as the main signal (green
   "Patent", terracotta "2.40s"), and each tool view opens with 1–2 screens of
   introduction before the tool itself.

### 4.2 Proposed mobile navigation model

**One system: a compact header and a menu sheet.** No bottom dock, no floating
button.

```
Header (56px, solid Ivory, full width, hides on scroll down, returns on scroll up)
┌───────────────────────────────────────┐
│ ◯ Meridian Vascular            ☰ Menu │   Menu = 44×44px with a visible text label
└───────────────────────────────────────┘

Menu sheet (full height, focus-trapped, Esc / Back closes)
┌───────────────────────────────────────┐
│ ✕ Close                               │
│ ⚠ Urgent? Call 112 · 108  →           │   always first
│ ┌───────┐ ┌───────┐ ┌───────┐          │
│ │  ◇    │ │  ◇    │ │  ◇    │          │   nav tiles: icon above,
│ │Under- │ │Symptom│ │Doppler│          │   text label beneath
│ │stand  │ │ check │ │ guide │          │   (88px tiles, 3 × 2)
│ └───────┘ └───────┘ └───────┘          │
│ ┌───────┐ ┌───────┐ ┌───────┐          │
│ │Treat- │ │ Find  │ │ Visit │          │
│ │ments  │ │ care  │ │ prep  │          │
│ └───────┘ └───────┘ └───────┘          │
│ [ Request an appointment ]  (secondary)│
│ ◌ Ask the guide                        │
│ About · FAQ · Privacy · Disclaimer     │
└───────────────────────────────────────┘
```

- Tablet (768px) uses the same header (64px) and sheet; the desktop bar appears at
  1024px (4 items, Ask, Request).
- Page-level navigation stays in the page: a one-line breadcrumb under the H1 on
  inner pages, and one "Next: …" card at the end of each page instead of the
  current two-link prev/next rows.
- The educational guide is reached from the menu and from contextual "Ask about this"
  links inside tools. It is no longer promoted in five places.
- Fixed UI budget: 56px on phones (64px tablet). The urgent line is reachable from
  the first screen and from the menu.

### 4.3 Proposed first-screen layout (360×640 minimum)

```
y=0    ┌──────────────────────────────┐
       │ ◯ Meridian Vascular   ☰ Menu │  56px header
56     ├──────────────────────────────┤
       │ FOREST BAND                  │
72     │ VEIN CARE GUIDE · BENGALURU  │  label (12px)
96     │ Better clarity.              │  display 40/42px, 2 lines
       │ Better-informed care.        │
192    │ Understand leg-vein symptoms │  body-lg 18px, 3 lines max
       │ and Doppler reports before   │
       │ you see a specialist.        │
288    │ [  Check your symptoms   →  ]│  primary, full width, 48px
344    │ 3 minutes · not a diagnosis  │  body-sm
376    │ Have a Doppler report? →     │  inline link, 44px target
432    ├──────────────────────────────┤
       │ ⚠ Sudden swelling in one leg,│  urgent strip, danger notice
       │ chest pain or breathless?    │  tel: links ≥44px
       │ Call 112 · 108               │
540    └──────────────────────────────┘
```

Budget: the primary CTA's bottom edge is at or above 340px and the urgent strip
ends at or above 560px, so both are visible on a 360×640 phone. The brand appears
once (header). No typewriter, no benchmark card, no trust-badge row, no hero
drawing behind text (the vein drawing moves to the right edge on `md`+ only), and
no mascot in the hero.

### 4.4 Shorter homepage section order (8 sections; target ≤ 12 screens at 390×844)

| # | Section | Mobile treatment | Primary action |
|---|---|---|---|
| 1 | Hero + urgent strip | As §4.3 | **Check your symptoms** |
| 2 | Where are you? | 3 intent tiles (icon above, label beneath, one line of help text): *I've noticed symptoms* · *I have a scan report* · *I'm comparing treatments* | Tile links |
| 3 | Understand your veins | One labelled valve diagram, 3 short points, a "Symptoms you might notice" disclosure, myths link. The mascot (Valvy, 56px, static) sits beside the heading | Read the guide (quiet) |
| 4 | Tools that explain | 3 compact tool cards: Doppler report guide · Treatment comparison · CEAP stages | Open the report guide (secondary) |
| 5 | Find care (demo) | Demo notice line; 2 compact demo provider cards; "Browse all demo profiles" | **Request an appointment (demo)** |
| 6 | Care pathway | 4 numbered steps, one line each; disclosure for detail | Compare treatments (quiet) |
| 7 | Questions people ask | 5 accordions plus "How we write our content" | See all FAQs (quiet) |
| 8 | Footer | Urgent line, sitemap, disclaimer, sample contact label | — |

Everything removed from home stays available on its own page (§6 sitemap).
Nothing educational is deleted.

### 4.5 Doctor directory (mobile pattern)

```
H1  Find care (demo)
ⓘ  These are fictional demo profiles. No appointment will be made.   ← one line
[ 🔍 Search name, city or procedure ] [ Filters · 2 ]               ← 48px controls
Chips: Bengaluru ✕  Vascular surgery ✕          5 demo profiles      ← live region
┌──────────────────────────────────────────┐
│ (AR)  Dr. Arvind Rao                     │  name 20px serif
│       [DEMO PROFILE · FICTIONAL]         │  badge-demo, directly under name
│       Vascular surgeon · Bengaluru       │
│       English, Kannada, Hindi            │
│       Sample fee ₹1,200 · Sample time Tue│  "Sample" prefixes, ink-muted
│ [ View profile ]        [ Request ]      │  44–48px
└──────────────────────────────────────────┘   ≈ 220px tall (today 597px)
```

- **Filters sheet:** City, Specialty, Visit type and **Sort** (A–Z default; "Sample
  fee" and "Years of experience" in demo mode). There is no availability sort.
- **Profile view:** full bio, sample credentials as plain text, generic education
  (C1), expertise and a "What a verified profile will show" note for partners.
- **Tablet:** two cards per row; the filters sheet becomes a side panel at 1024px.

### 4.6 Appointment request flow (mobile pattern)

Full screen on phones; a 560px panel from 768px. The header is replaced by the
flow's own top bar.

```
┌──────────────────────────────┐
│ ← Back   Request (demo)    ✕ │  56px top bar
│ ▓▓▓▓▓▓░░░░░░  Step 2 of 4    │  4px progress + text
├──────────────────────────────┤
│ Your details                 │  H2
│ [Use sample details]         │  quiet; fills demo values
│ Name            (required)   │
│ [                         ]  │  48px fields, labels above
│ Phone           (required)   │
│ Email           (optional)   │
│ ⓘ Demo: nothing is sent to   │
│   any clinic.                │
├──────────────────────────────┤
│ [        Continue         ]  │  action bar, safe-area aware
└──────────────────────────────┘
```

Steps: **1** Visit type and specialist (or "Any demo specialist") → **2** Your
details → **3** Preferred day and time window (a preference, not a slot) → **4**
Review (an editable summary).

**Result screen:** a `badge-demo` heading, **"Demo request: not sent to any
clinic"**, a summary of what was entered, and "With a real partner, the clinic
would call you to confirm a time." There is no reference or confirmation code and
no calendar icon. Symptom-check context (score or pattern) is attached only if the
user ticks "Include my symptom check summary".

### 4.7 Educational tools (mobile patterns)

- **Doppler report guide:** the tool comes first and the introduction is one
  paragraph plus a "How this works" disclosure. Input choice uses two large tiles:
  "Try a sample report" / "Paste a line from my report". Results show one finding
  per card: *What it says* (`value` type) → *What it means* (plain English) → *Ask
  your doctor* (saved to Visit prep). Status uses a word and an icon as well as
  colour. Synthetic cases are labelled "Sample report (synthetic)" (C2).
- **Symptom check:** one question per screen with large option buttons (≥56px), a
  progress bar, Back, and the urgent strip pinned **above** question 1 on the first
  screen only. The result opens with the summary, then "What to do next" (one
  primary action), then details in disclosures. Photo upload is an optional step,
  not a separate section.
- **Treatment comparison:** under 768px, one card per treatment with identical field
  order (How it works · Anaesthesia · Recovery · Suits · Limits · Evidence) and a
  wrapping segmented control or a select to switch. A "Compare two" mode shows two
  chosen treatments field-by-field in a single column. Badges wrap; nothing clips.
  The table returns at 768px+.
- **Duplex simulation and CEAP explorer:** controls below the visual, stage chips
  that wrap, and a text description that updates with the visual
  (`aria-live="polite"`).

### 4.8 Touch, type and contrast rules (phones)

- Every interactive target ≥ 44×44px with ≥ 8px between targets; option buttons in
  tools ≥ 56px tall.
- No text under 12px; running text 16px; labels 12px used once per block.
- Contrast pairs as verified in DESIGN.md; demo badge 6.51:1; urgent notice 8.72:1.
- Focus: 2px outline with a 2px offset on every control, visible on Ivory and
  Forest.

### 4.9 Emergency content rules

- The urgent strip is static, in normal flow, and never inside a tab, accordion,
  carousel or animation.
- It appears in the home first screen, at the top of the menu sheet, above the
  first symptom-check question, at the top of DVT content, and in the AI panel's
  header (`EmergencyGuidance` already supports the assistant and screener).
- No fixed element may overlap it. Anchors use `scroll-margin-top: 64px`.
- tel: links for 112 and 108 come from `emergencyContacts.ts`; the "outside India"
  line stays.

### 4.10 Performance and motion on phones

- Split the bundle by route; load tools on demand. Target main chunk < 250 kB.
- Remove the typewriter (hero text paints at once), the 130–140px blur blobs and
  `backdrop-blur` on fixed bars, and stop all infinite animations (including the
  mascots' float loop). Mascots render static; at most one 400ms settle on entry,
  none under reduced motion.
- Fonts: 3 families, 2 weights each, `display=swap`, preload the display face.
- Reserve image and diagram dimensions to prevent layout shift.

### 4.11 Accessibility and mobile acceptance criteria (final, v3)

**Viewports:** 360×640, 390×844, 430×932 and 768×1024 (portrait), plus 640×360
landscape for T20. **Browsers:** Chromium (Android emulation) for every phase;
WebKit (iOS Safari engine) once approved ([technical-options §3](technical-options.md)).
**Tooling until a runner is approved:** the global `playwright-cli` measurement
script plus the `a11y-audit` contrast script, with no project dependency.

A criterion is **in force** from the milestone that builds the relevant surface
(column "From"). Earlier milestones must not make it worse than the baseline in
§3.1.

| # | Criterion | Pass condition | From |
|---|---|---|---|
| T1 | No horizontal overflow | `scrollWidth ≤ innerWidth` on every route; no element's right edge beyond the viewport outside a designed scroller; no clipped badges | M1 (no regression) · 2.10 |
| T2 | Fixed UI budget | Sum of visible fixed/sticky heights ≤ 56px (phones), ≤ 64px (768); the request flow's own bars replace the header | 2.5 |
| T3 | First screen | At 360×640: home primary CTA bottom ≤ 340px, urgent strip bottom ≤ 560px, brand name shown once | 2.7 |
| T4 | Urgent not covered | On home, symptom check, DVT/urgent pages, menu sheet and AI panel, no fixed or floating element intersects the urgent notice at any scroll stop; anchors land below the header | 2.5 |
| T5 | One primary action | At each half-viewport scroll stop, ≤ 1 `button-primary` intersects the viewport | 2.7 |
| T6 | Touch targets | Buttons, links outside running text and inputs ≥ 44×44px with ≥ 8px spacing; tool option buttons ≥ 56px tall | 2.3 (primitives) · per surface |
| T7 | Type | No visible text node under 12px; running text ≥ 16px | 2.2 · per surface |
| T8 | Page length | Home ≤ 12 screens at 390×844; directory ≤ 6 screens for 5 profiles; provider card ≤ 240px tall at 360px | 2.7 · 2.8 |
| T9 | Structure | Exactly one `h1` per route; unique `document.title`; no skipped heading levels | 2.6 |
| T10 | Keyboard and focus | Skip link is the first stop; visible 2px focus on every stop (Forest on light, Ivory on Forest); menu sheet, filters sheet, request flow and AI panel trap focus, Esc closes, focus returns to the opener | 2.5 · 2.8 · 2.9 |
| T11 | Reduced motion | With `prefers-reduced-motion: reduce`, no running animation longer than 0.01ms; mascot static; typewriter absent; no auto-scrolling | 2.11 (no regression from M1) |
| T12 | Demo labels | Every provider card shows "Demo profile · fictional" beside the name; every fee and time is prefixed "Sample"; the request result says "not sent to any clinic" and contains none of "confirmed", "booking ID", "simulation ID", "appointment scheduled" | **M1** |
| T13 | Structured data and indexing | No `Physician`, `MedicalClinic`, `Person` or "Center" `MedicalOrganization` nodes for demo content; demo routes carry `noindex`; no canonical or OG URL pointing at an unconfirmed domain | **M1** (JSON-LD) · 2.6 (routes) |
| T14 | Text contrast | Every declared text pair ≥ 4.5:1 (≥ 3:1 for ≥ 24px or bold ≥ 18.7px) using the contrast script | 2.2 |
| T15 | Layout stability | CLS < 0.1 on load (PerformanceObserver); loading buttons keep their width | 2.11 |
| T16 | Screen reader (manual) | TalkBack (Android Chrome) and VoiceOver (iOS Safari): menu, symptom check, request flow, directory filters and AI panel are operable; demo labels and AI source badges are announced with their content | 2.12 |
| T17 | Pre-written guide (revised in M1) | The guide makes no network request (even with a dummy `GEMINI_API_KEY`); every answer is badged "Pre-written guidance"; no answer or label says AI or "ClearPix"; unmatched questions get the honest fallback; emergency intents take priority and show no booking button | **M1** (implemented) |
| T18 | Demo data denylist | No demo record or sample report contains a real college, hospital, insurer, regulator, scheme, society or accreditation name from the §3.4 list (grep test in `tests/phase0Safety.test.ts`) | **M1** |
| T19 | Interactive-state contrast | Primary, secondary and quiet buttons meet DESIGN.md's state table at rest, hover, pressed, focus and disabled; primary buttons on the Forest band carry the 1px Ivory border | 2.3 |
| T20 | Reflow and zoom | At 320 CSS px (360px at 112.5%) and at 200% text zoom, nothing is cut off and nothing overlaps; landscape 640×360 keeps the urgent strip reachable without the header covering it | 2.5 · 2.12 |

---

## 5. Provider data model (demo now, verified later)

The directory UI reads one record shape. Demo and verified records differ only in
`status` and provenance, so verified partners replace demo records without
rebuilding the UI. The current `DoctorProfile` maps onto this with an adapter
(`isSyntheticDemo: true` → `status: "demo"`).

```ts
type RecordStatus = 'demo' | 'pending_verification' | 'verified' | 'suspended';
type ValueKind = 'sample' | 'provider_stated' | 'verified';

interface Sourced<T> { value: T; kind: ValueKind; source?: string; asOf?: string }

interface ProviderRecord {
  id: string;
  status: RecordStatus;
  kind: 'individual' | 'facility';
  displayName: string;                  // demo: fictional
  roleTitle: string;
  specialties: Array<'vascular_surgery' | 'interventional_radiology' | 'phlebology' | 'wound_care'>;
  city: string;                         // Bengaluru first
  areas?: string[];
  languages: string[];
  visitTypes: Array<'in_person' | 'video'>;
  credentials: Sourced<string>[];       // demo: kind 'sample'
  affiliations: Sourced<string>[];      // demo: fictional or generic only
  education?: Sourced<string>;
  fee?: Sourced<{ amountINR: number }>;
  availability: { mode: 'none' | 'sample' | 'request_only' | 'live'; text?: string; updatedAt?: string };
  rating?: Sourced<{ average: number; count: number }>;   // absent unless verified, or sample in demo
  insuranceNote?: Sourced<string>;
  verification?: { method: string; verifiedBy: string; verifiedAt: string; registrationNo?: string };
  publishing: { indexable: boolean; inStructuredData: boolean };  // false for demo
}
```

Rules the UI derives from the record (no per-page logic):
- `status === 'demo'` → demo badge beside the name, "Sample" prefix on every value
  whose `kind === 'sample'`, request result in demo mode.
- `availability.mode === 'sample'` → "Sample time"; never sortable as "next available".
- Only `status === 'verified' && publishing.inStructuredData` records are emitted as
  `Physician` / `MedicalClinic` JSON-LD or included in a sitemap.
- `pending_verification` records are never public.
- Mixing is allowed (verified partners next to demo profiles) because every card
  carries its own label.

---

## 6. Sitemap

Path routes replace hash views (router choice is open; it needs a new dependency
or a small in-house History API router). Each route has one H1, a title and a
description.

```
/                                  Home (8 sections)
/urgent                            When to get emergency help (112 · 108)
/understand                        Learn hub
  /understand/how-leg-veins-work
  /understand/symptoms-and-causes
  /understand/stages               (CEAP)
  /understand/leg-pain-types
  /understand/myths
/check-symptoms                    Symptom check (+ optional photos, PDF)
/doppler                           Doppler guide (prep, checklist, terms)
  /doppler/report-guide            Report decoder
  /doppler/how-a-scan-works        Duplex simulation
/treatments                        Overview
  /treatments/compare              Comparison (after claims review)
/care-pathway                      4 steps
/find-care                         Directory (demo profiles, noindex while demo)
  /find-care/:id                   Profile
/request-appointment               4-step request flow (demo mode)
/visit-prep                        Saved questions, symptom summary, report notes (on device)
/faq   /about   /editorial-policy   /medical-disclaimer   /privacy   /terms
(Meridian Guide AI)                Panel opened from the menu or contextual links
```

## 7. Desktop wireframe (≥1024px)

```
┌──────────────────────────────────────────────────────────────────────┐
│ ◯ Meridian Vascular  Understand  Doppler  Treatments  Find care   Ask  [Request appointment] │ 64px
├──────────────────────────────────────────────────────────────────────┤
│ FOREST: label · H1 tagline (64px) · lede · [Check your symptoms]     │
│         "Have a Doppler report?" panel on the right · vein drawing   │
├──────────────────────────────────────────────────────────────────────┤
│ ⚠ Urgent strip: one line, 112 · 108, "What to do"                    │
├──────────────────────────────────────────────────────────────────────┤
│ Where are you?        [Symptoms] [Scan report] [Treatments]          │
│ Understand: diagram (7 cols) │ points + Valvy (5 cols)               │
│ Tools that explain: [Report guide] [Comparison] [CEAP stages]        │
│ Find care (demo): notice · 3 compact demo cards · [Request (demo)]   │
│ Care pathway: ①──②──③──④                                            │
│ FAQ (2 columns) │ How we write our content                           │
├──────────────────────────────────────────────────────────────────────┤
│ FOOTER                                                               │
└──────────────────────────────────────────────────────────────────────┘
```

## 8. Component inventory

New shared primitives (`src/components/ui/`): `Container`, `Section`,
`SectionHeader`, `PageHeader`, `Button`, `TextLink`, `Card`, `IntentTile`,
`NavTile`, `IconTile`, `Notice` (urgent/info), `DemoBadge`, `SampleValue`, `Label`,
`Steps`, `Stepper`, `Disclosure`, `Field`, `Sheet` (menu, filters), `SkipLink`,
`NextCard`, `Mascot` (static, decorative).

| Component | Decision | Notes |
|---|---|---|
| `Header` | Redesign | 56/64px solid; Menu button with a label; desktop bar at 1024px |
| `MobileBottomNav` | Remove | Replaced by the menu sheet |
| Floating AI button (`App.tsx:431`) | Remove | AI reached from the menu and contextual links |
| `Hero` | Redesign | §4.3; claims to review (C4) |
| `PatientOrientation` | Consolidate → "Where are you?" tiles | 6 → 3 |
| `VascularTopicExplorer` | Consolidate → `/understand` index | |
| `DidYouKnow`, `Causes`, `Symptoms`, `Overview` | Consolidate into `/understand/*` | Sources needed (C5) |
| `DvtAndMisconceptions` | Split → `/urgent` + `/understand/myths` | |
| `EmergencyGuidance` (Phase 0) | Keep → basis of urgent `Notice` | |
| `LegPainDifferential`, `ProgressionCEAP`, `DopplerEducationGuide` | Keep, restyle | |
| `DopplerReportDecoder` | Keep; mobile pattern §4.7 | C2 |
| `DuplexUltrasoundExplorer` | Keep → `/doppler/how-a-scan-works` | Remove duplicates |
| `DegreeAssessment` + `ClinicalMediaSection` + `MediaUploader` | Keep; one-question-per-screen | Rename "Symptom check" |
| `TreatmentModalities` | Consolidate into `/treatments` | |
| `TreatmentComparison` | Keep; card stack under 768px | C4, C5 |
| `VascularCareJourney` | Redesign → 4 steps | |
| **`DoctorDirectory` + `doctorsData`** | **Keep demo profiles; redesign cards and filters; adapter to `ProviderRecord`** | C1 copy fixes; §4.5, §5 |
| `DoctorVisitGuide`, `PatientPortal` | Merge → `/visit-prep` | No "portal" wording |
| **`AppointmentModal`** | **Keep simulation; redesign as a 4-step flow** | §4.6; C7 |
| `ClearPixAssistantModal` | Keep; pre-written only since M1; restyle in M4 (rename the file then) | C6 resolved |
| `CampaignSection` | Move to `/understand` | |
| `FaqSection` | Keep; 5 on home | C10 |
| `Footer` | Redesign | C3 |
| **`VascularCharacters`** | **Keep; static, one per page, 48–64px** | Remove the float loop |
| `index.css` `.cp-*` | Replace with `@theme` tokens | DESIGN.md |

## 9. Implementation roadmap

Small, testable steps. BRAND.md and DESIGN.md decisions were approved on
2026-10-21. **Implementation starts only after Milestone 1 is approved.**

### 9.1 First milestone (M1): demo honesty and baseline

> **Implemented 2026-10-21; awaiting owner review.** Differences from the plan below:
> the guide became pre-written only (no Gemini disclosure; the Gemini code and chat
> route were removed); footer contact details were removed rather than labelled; the
> footer's "HIPAA Compliant" and "Center" description were also corrected; analytics
> payloads were minimised; urgent guide answers no longer offer the demo request.
> `.env.example`, `metadata.json`, lockfiles, dependencies and `tests/testEndpoints.mjs`
> were left unchanged by owner decision or to preserve uncommitted work. Evidence:
> [`evidence/m1/`](evidence/m1/README.md).

**Goal:** make the existing demo safe to show to partners outside controlled
sessions, and capture a measurable baseline, **without changing the layout or
visual design** and without new dependencies.

| Step | Work | Files (expected) |
|---|---|---|
| M1.0 | Protect Phase 0: you decide whether the 23 modified + 4 new Phase 0 files are committed (by you) or kept as-is; M1 builds on them either way | — (your action) |
| M1.1 | Baseline: save the measurement script as a repo file and record "before" numbers and screenshots at 4 widths | `scripts/mobile-audit.js` (new, playwright-cli `run-code` format) |
| M1.2 | Demo data replacements (§3.4) and the single "Demo profile · fictional" label wording | `src/data/doctorsData.ts`, `src/data/dopplerTerminology.ts`, `src/components/DoctorDirectory.tsx`, `src/components/PatientOrientation.tsx`, `src/components/DopplerReportDecoder.tsx` |
| M1.3 | "Sample" prefixes on fee and time; demo label beside the name (copy and placement only, existing styles) | `src/components/DoctorDirectory.tsx` |
| M1.4 | Request result: "Demo request: not sent to any clinic"; remove "Simulation ID" and booking wording; "Meridian Vascular Center" → "Meridian Vascular" | `src/components/AppointmentModal.tsx`, `src/components/Footer.tsx`, `index.html` (JSON-LD publisher name only) |
| M1.5 | Footer contact details: label "Sample contact details (demo)" **or** remove (pick one) | `src/components/Footer.tsx` |
| M1.6 | AI guide: Gemini disclosure, source badges ("Live AI · Gemini" / "Pre-written answer"), "Live AI is off" banner, rename "ClearPix" in the system prompt | `src/components/ClearPixAssistantModal.tsx`, `server.ts` (prompt text only) |
| M1.7 | Replace the "Zero external trackers · No cookies used" line with an accurate short statement (draft for your review) | `src/components/Hero.tsx` (that line only) |
| M1.8 | Tests: extend the safety tests with T12, T13 (JSON-LD), T17 (copy) and T18 grep checks | `tests/phase0Safety.test.ts` |

**Done when:**
- T12, T13 (JSON-LD part), T17 and T18 pass;
- `npm run lint`, `npm run test:clinical` and `npm run test:safety` pass;
- the mobile script shows no regression against §3.1 (T1, T7, T11 not worse);
- before/after screenshots at 360, 390, 430 and 768px show copy changes only.

**Explicitly out of M1:** layout and navigation changes, tokens, routing, rate
limiting (planned before public exposure, not needed for the demo), clinical claim
rewrites (C4, C5, C10 wait for a clinical reviewer), any dependency.

**Risk:** several M1 files already contain uncommitted Phase 0 edits. Changes are
made on top, and nothing is staged or reverted. A diff per file is reported for
review.

### 9.2 Later phases

| Phase | Scope | Done when | Test |
|---|---|---|---|
| 2.0–2.1, 2.4 | Folded into **M1** (§9.1) | — | — |
| 2.2 Tokens and fonts | `@theme` tokens; 3 font families | Page looks the same | Build; visual diff; T7, T14 |
| 2.3 Primitives | `ui/*` incl. `DemoBadge`, `SampleValue`, `Sheet`, `Stepper` | Keyboard and focus work | T6, T19 on a scratch route |
| 2.5 Shell | Header, menu sheet, skip link, urgent strip; remove dock and FAB | T2, T4, T10, T20 pass | Script at 4 widths; **decision: `@playwright/test`** |
| 2.6 Routing | Path routes (**decision: wouter vs React Router**), titles, one H1 each, hash redirects, `noindex` on demo routes | T9, T13 pass | Route smoke test |
| 2.7 Home | 8 sections | T3, T5, T8 pass | Script |
| 2.8 Directory | `ProviderRecord` adapter, compact cards, filters and sort sheet | Directory ≤ 6 screens; T6 | Script + manual |
| 2.9 Request flow | 4-step flow, demo result | T12 (request part), T10 | Flow test |
| 2.10 Tools | Decoder, symptom check, comparison mobile patterns | T1, T6, T7 on tool routes | Script |
| 2.11 Motion and performance | Retire loops; mascot static; code-split | T11, T15; main chunk < 250 kB | Build sizes |
| 2.12 Accessibility QA | `a11y-audit` scan + T14 + T16 manual | No known AA failures on audited pages | Report in `docs/redesign/` |
| 2.13 SEO pre-render | Custom no-dependency pre-render (**decision**), sitemap without demo routes | Each public route has HTML content | Build output check |
| Before public launch | Clinical review (C4, C5, C10), AI rate limiting, timeouts and input caps (C8; **decision: in-house vs `express-rate-limit`, after the deployment target is known**), real privacy notice (C6, C7), production domain | Category C closed | Review sign-off (human) |

## 10. Open questions, assumptions and risks

### Resolved by you
- (v2) Demo doctors, sample data and the simulated request stay, clearly labelled.
- (v2) The mascot stays as a subtle supporting element.
- (v3) Real associations on fictional records are replaced (§3.4).
- (v3) `#A9472F` primary buttons; Source Serif 4 display with a readable sans.
- (v3) Lucide until your custom SVGs arrive; mascot asset supplied by you.
- (v4) The guide stays in the demo with **pre-written guidance only**, no AI service (supersedes the v3 Gemini-disclosure plan);
  rate limiting before public exposure.
- (v3) Production domain stays unset.

### Still open
1. **Milestone 1 approval** (§9.1), including the footer choice: label "Sample
   contact details (demo)" or remove.
2. **Phase 0 work:** do you want to commit it yourself before M1, or keep it
   uncommitted?
3. **Router:** wouter or React Router library mode ([technical-options §1](technical-options.md)); needed by Phase 2.6.
4. **Pre-rendering:** approve the custom no-dependency script (§2 there); needed
   by 2.13.
5. **Test runner:** `@playwright/test` as a devDependency at Phase 2.5, and the
   WebKit download separately?
6. **Deployment target:** a single Express server or serverless? This decides the
   rate-limiting design.
7. **Clinical reviewer:** is a named vascular clinician available for C4, C5 and C10?
8. **Multilingual support:** still open (Kannada/Hindi); affects font choice and
   page length.
9. **Assets:** the mascot and custom SVG icons. Formats and intake rules are in
   DESIGN.md.
10. **Production domain:** unset until confirmed.

### Assumptions
- English-first for Bengaluru; most visitors on Android phones about 360–412px wide.
- No real scheduling, partner data or patient accounts yet.
- The site stays static on Vercel; `server.ts` is local development only (decision 0001).
- Brand colours are final; derived values are design decisions.
- Font licensing is believed OFL but **not verified**.

### Risks

| Risk | Mitigation |
|---|---|
| Demo profiles mistaken for real doctors by patients or partners | Demo badge beside every name, "Sample" values, demo result screen, `noindex`, no JSON-LD (T12, T13) |
| Real institutions attached to fiction (C1–C3) | Generic names before external demos |
| Unreviewed clinical claims go public | Claims register + clinician sign-off before launch |
| AI endpoint abused or costly once public | Rate limiting (C8) before exposure |
| Hash → path migration breaks shared links | Redirect old hashes |
| Large refactor collides with uncommitted Phase 0 work | Phase 2.0 first |
| iOS Safari not tested | Add a WebKit run (`playwright-cli open --browser=webkit`) to 2.1 |
| This audit is not clinical or legal validation | Separate review gates |
