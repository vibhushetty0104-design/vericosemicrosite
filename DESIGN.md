---
version: alpha
name: Meridian Vascular Web
description: Visual and interaction system for the public website (home, learning pages, tools, appointment request).
brand: ./BRAND.md
colors:
  primary: "#0B4036"
  primary-press: "#072E27"
  accent: "#CE5B40"
  accent-strong: "#A9472F"
  accent-press: "#8E3A26"
  secondary: "#8DAA9D"
  background: "#F7F5EF"
  surface: "#FFFFFF"
  surface-muted: "#E4ECE6"
  ink: "#17241F"
  ink-muted: "#4A5952"
  outline: "#D6DDD8"
  outline-strong: "#6F8279"
  danger: "#7B2434"
  danger-surface: "#FBEFEF"
  warning: "#7A4E0E"
  warning-surface: "#FBF3E2"
  success: "#2F6B4F"
  inverse-ink: "#F7F5EF"
  inverse-muted: "#8DAA9D"
typography:
  display:
    fontFamily: Source Serif 4
    fontSize: 2.5rem
    fontSizeDesktop: 4rem
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Source Serif 4
    fontSize: 2rem
    fontSizeDesktop: 3rem
    fontWeight: 600
    lineHeight: 1.12
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Source Serif 4
    fontSize: 1.625rem
    fontSizeDesktop: 2.25rem
    fontWeight: 600
    lineHeight: 1.18
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Source Serif 4
    fontSize: 1.25rem
    fontSizeDesktop: 1.5rem
    fontWeight: 600
    lineHeight: 1.25
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.125rem
    fontWeight: 400
    lineHeight: 1.6
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.65
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.75rem
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: 0.06em
  button:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.9375rem
    fontWeight: 600
    lineHeight: 1.2
  value:
    fontFamily: IBM Plex Mono
    fontSize: 0.875rem
    fontWeight: 500
    lineHeight: 1.3
spacing:
  "1": 4px
  "2": 8px
  "3": 12px
  "4": 16px
  "6": 24px
  "8": 32px
  "12": 48px
  "16": 64px
  "24": 96px
  section-mobile: 64px
  section-desktop: 96px
  gutter-mobile: 20px
  gutter-desktop: 32px
  container: 1200px
  measure: 68ch
rounded:
  sm: 8px
  md: 12px
  lg: 20px
  pill: 9999px
shadows:
  raise: "0 1px 2px rgba(11,64,54,0.06), 0 8px 24px rgba(11,64,54,0.06)"
  overlay: "0 24px 48px rgba(11,64,54,0.16)"
motion:
  duration-quick: 150ms
  duration-standard: 250ms
  duration-slow: 400ms
  ease-standard: "cubic-bezier(0.2, 0, 0, 1)"
  ease-exit: "cubic-bezier(0.3, 0, 1, 1)"
components:
  button-primary:
    backgroundColor: "{colors.accent-strong}"
    textColor: "{colors.surface}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    height: 48px
    padding: 0 24px
  button-primary-hover:
    backgroundColor: "{colors.accent-press}"
    textColor: "{colors.surface}"
  button-secondary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    height: 48px
    padding: 0 24px
  button-secondary-hover:
    backgroundColor: "{colors.primary-press}"
    textColor: "{colors.surface}"
  button-quiet:
    backgroundColor: "{colors.background}"
    textColor: "{colors.primary}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    height: 44px
    padding: 0 16px
  link-inline:
    backgroundColor: "{colors.background}"
    textColor: "{colors.primary}"
    typography: "{typography.body-md}"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: 24px
  card-muted:
    backgroundColor: "{colors.surface-muted}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: 24px
  icon-tile:
    backgroundColor: "{colors.surface-muted}"
    textColor: "{colors.primary}"
    rounded: "{rounded.md}"
    size: 44px
  notice-urgent:
    backgroundColor: "{colors.danger-surface}"
    textColor: "{colors.danger}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: 16px
  notice-info:
    backgroundColor: "{colors.surface-muted}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: 16px
  badge-demo:
    backgroundColor: "{colors.warning-surface}"
    textColor: "{colors.warning}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: 4px 10px
  provider-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: 16px
  stepper:
    backgroundColor: "{colors.background}"
    textColor: "{colors.primary}"
    typography: "{typography.label}"
    height: 4px
  nav-tile:
    backgroundColor: "{colors.surface-muted}"
    textColor: "{colors.primary}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    size: 88px
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
    height: 48px
  hero-dark:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.inverse-ink}"
---

# Meridian Vascular Web

> Status: **v4, decisions approved by the owner on 2026-10-21; the visual system is
> not yet implemented in code.** Milestone 1 implemented only the demo label
> (`DEMO_PROFILE_LABEL`, 12px warning colours) and the guide labels and icon; v4 also
> records the pre-written-only guide and a 1.5px icon stroke. Approved: `#A9472F` for white-text primary buttons (state contrast
> verified below); Source Serif 4 display with Plus Jakarta Sans for body and
> controls; Lucide for functional icons until the owner's custom SVG set arrives;
> the mascot as a subtle supporting element (owner-supplied asset). v2 added the
> demo-labelling components, the mobile navigation model and the mobile patterns. The design.md
> linter (`@google/design.md`) was not run: it needs `bunx`, which isn't installed,
> and installing tools was out of scope. Contrast pairs below were checked with the
> project's `a11y-audit` contrast script.

## Overview

This system expresses the [Meridian Vascular brand](./BRAND.md) on the public
website: the home page, the learning pages, the Doppler and symptom tools, the
appointment request and visit prep.

The premise is **an annotated consultation notebook.** Each page reads like a
specialist taking ten unhurried minutes with you: a clear serif headline, one short
paragraph, a labelled diagram, then a single next step. Tools sit inside that
notebook like worked examples, not like an app dashboard bolted onto a brochure.

The audience is often worried and usually on a phone. They will read a calm
paragraph if it answers their question, but they leave if every screen asks them
to do five things. So the system is **designed at 360px first** and widened
afterwards. Each screen has **one dominant action**, warning signs are never
hidden or covered, and density comes from progressive disclosure rather than
stacking.

The site is warm and quiet. Ivory paper, Forest ink, Terracotta used for one thing
per screen: the primary action or the single diagram callout, never both. There
are no gradients behind text, no glass, no pulsing dots and no typewriter effects.
The mascot appears small and still, as a companion to learning content. The dark
Forest band is reserved for the home hero and the footer.

The current product is a partner demo. Demo content is a first-class state of this
system, not an afterthought: it has its own label, colour and copy, and it looks
the same on every surface.

## Colors

Mirrored brand primitives carry identity; everything else is derived for
legibility. Roles are assigned here, not in BRAND.md.

| Role | Brand color | Value | Origin |
|---|---|---|---|
| `primary` | Forest (mandatory) | `#0B4036` | Mirrored |
| `primary-press` | none | `#072E27` | Derived from Forest |
| `accent` | Terracotta (mandatory) | `#CE5B40` | Mirrored |
| `accent-strong` | none | `#A9472F` | Derived from Terracotta |
| `accent-press` | none | `#8E3A26` | Derived from Terracotta |
| `background` | Ivory (mandatory) | `#F7F5EF` | Mirrored |
| `secondary` | Sage | `#8DAA9D` | Mirrored |
| `surface-muted` | Pale sage | `#E4ECE6` | Mirrored |
| `surface` | none | `#FFFFFF` | Derived |
| `ink`, `ink-muted` | none | `#17241F`, `#4A5952` | Derived from Forest |
| `outline`, `outline-strong` | none | `#D6DDD8`, `#6F8279` | Derived from Sage |
| `danger`, `danger-surface` | none | `#7B2434`, `#FBEFEF` | Derived; existing wine kept |
| `warning`, `warning-surface` | none | `#7A4E0E`, `#FBF3E2` | Derived |
| `success` | none | `#2F6B4F` | Derived |

- **Primary (Forest):** headings, links, secondary buttons, icons, active nav,
  the home hero band and footer.
- **Accent (Terracotta `#CE5B40`):** decorative only. Diagram highlights, the
  logo nodes, a 2px rule under the active step. Text in it only at 24px+ on
  `background` (3.71:1, large-text AA). Never behind white body text (4.04:1
  fails AA), and never on Forest (2.88:1).
- **Accent-strong (`#A9472F`):** the fill of the **one** primary button per screen
  (white text 5.79:1). Darker than the brand value only so that white button text
  passes AA; the hue and meaning are the same. **Approved by the owner.**
- **Background (Ivory):** the page. `surface` white is for cards, inputs and
  dialogs that sit on Ivory.
- **Surface-muted (Pale sage):** grouped content, icon tiles, the info notice.
- **Secondary (Sage):** rules, diagram lines and decorative marks. Never text on a
  light background (2.30:1). Allowed as muted text on Forest (4.65:1).
- **Danger:** DVT and emergency notices only. Terracotta never stands in for danger.
- **Warning:** the demo label ("Demo profile · fictional"), "sample" values and
  prototype disclosures. Warning is never used for clinical caution; that is
  `danger` (urgent) or `notice-info` (non-urgent).

**Verified text contrast** (WCAG ratio): ink on background 14.72 · ink-muted on
background 6.78 · ink-muted on surface-muted 6.14 · primary on surface 11.66 ·
white on primary 11.66 · white on accent-strong 5.79 · accent-strong on background
5.31 · danger on danger-surface 8.72 · warning on warning-surface 6.51 · success on
background 5.77 · inverse-muted on primary 4.65. Non-text: outline-strong on
background 3.74 (input borders, focus outlines).

**Button state contrast (verified 2026-10-21)**

| State | Pair | Ratio | Requirement | Result |
|---|---|---|---|---|
| Primary · rest | white on `#A9472F` | 5.79 | 4.5 text | Pass |
| Primary · hover / pressed | white on `#8E3A26` | 7.54 | 4.5 text | Pass |
| Primary fill vs Ivory page | `#A9472F` / `#F7F5EF` | 5.31 | 3.0 UI (advisory) | Pass |
| Primary fill vs white card | `#A9472F` / `#FFFFFF` | 5.79 | 3.0 UI | Pass |
| Primary fill vs pale-sage section | `#A9472F` / `#E4ECE6` | 4.81 | 3.0 UI | Pass |
| Primary fill vs **Forest band** | `#A9472F` / `#0B4036` | **2.02** | 3.0 UI | **Weak**: add a 1px `inverse-ink` border (Ivory vs Forest 10.7) |
| Primary hover fill vs Forest band | `#8E3A26` / `#0B4036` | **1.55** | 3.0 UI | **Weak**: same 1px border rule |
| Focus ring on Ivory / white / pale sage | `#0B4036` | 10.7 / 11.66 / 9.68 | 3.0 | Pass |
| Focus ring on Forest band | `#F7F5EF` on `#0B4036` | 10.7 | 3.0 | Pass |
| Disabled | `#4A5952` on `#D6DDD8` | 5.35 | Exempt; kept readable | Pass |
| Disabled fill vs Ivory | `#D6DDD8` / `#F7F5EF` | 1.27 | Exempt | Add a 1px `outline-strong` border (3.74) so it still reads as a control |
| Secondary · rest / hover | white on `#0B4036` / `#072E27` | 11.66 / 14.69 | 4.5 | Pass |
| Secondary on Forest band | `#0B4036` on `#F7F5EF` (inverted) | 10.7 | 4.5 | Pass |
| Quiet · hover | `#0B4036` on `#E4ECE6` | 9.68 | 4.5 | Pass |
| Demo badge | `#7A4E0E` on `#FBF3E2` | 6.51 | 4.5 | Pass |
| Urgent notice / tel link | `#7B2434` on `#FBEFEF` / `#FFFFFF` | 8.72 / 9.79 | 4.5 | Pass |

WCAG doesn't require a button's fill to contrast with its background when the
text label identifies it, but on the Forest band the fill is close enough to the
background that the button reads as weak. Hence the border rule. Loading state:
the label changes to "Sending…" with the same colours and `aria-busy="true"`;
the width stays fixed to avoid layout shift.

**Retired values:** the 46 hard-coded hex values in components collapse into these
roles. `#0A3B32` and `#063B36` become `primary`, `#C85A3F` becomes `accent`, and the
slate greys `#707E94` (3.85:1, fails) and `#7A8A84` (3.39:1, fails) become `ink-muted`.
Emerald, amber, sky and rose utility colours are removed from UI chrome.

## Typography

Source Serif 4 is the voice that explains. Plus Jakarta Sans is the voice that
reads and operates. IBM Plex Mono appears only where a value is being measured.

| Token | Mobile | Desktop (≥1024px) | Use |
|---|---|---|---|
| `display` | 40px / 1.05 | 64px | Home hero headline only, once per site |
| `headline-lg` | 32px / 1.12 | 48px | Page H1 |
| `headline-md` | 26px / 1.18 | 36px | Section H2 |
| `headline-sm` | 20px / 1.25 | 24px | Card and sub-section H3 |
| `body-lg` | 18px / 1.6 | 18px | Lede paragraph under H1/H2 |
| `body-md` | 16px / 1.65 | 16px | All running text (minimum size for reading) |
| `body-sm` | 14px / 1.55 | 14px | Captions, notices, helper text |
| `label` | 12px, 600, +0.06em, uppercase | 12px | Eyebrows and tags, one per block maximum |
| `button` | 15px, 600 | 15px | All buttons |
| `value` | 14px Plex Mono | 14px | Measured values: "> 500 ms", "5.8 mm", "C2" |

Rules: weights 400 and 600 only (700 retired). Nothing under 12px, replacing today's
120 uses of 11px and 46 of 10px. Reading measure is capped at 68ch. Headings use
sentence case. Instrument Serif and IBM Plex Sans are dropped, which cuts five
font families to three.

## Layout

- **Grid:** 4-column on mobile, 8 on tablet, 12 on desktop. Container max 1200px.
  Gutters 20px mobile, 32px desktop.
- **Spacing scale (4-based):** 4, 8, 12, 16, 24, 32, 48, 64, 96. Nothing off-scale.
- **Section rhythm:** 64px vertical padding on mobile, 96px on desktop. One H2 per
  section, an optional `label` eyebrow, a `body-lg` lede, content, then one action.
- **Measure:** prose blocks never exceed 68ch, even in wide sections.
- **One dominant action per viewport:** at most one `button-primary` visible at a
  time; everything else is `button-secondary`, `button-quiet` or an inline link.
- **Fixed chrome budget:** at most **56px** of fixed or sticky UI on phones and 64px
  on tablet and desktop at any moment (today it is 126–128px at every width below
  1024px). No floating action button. No bottom tab dock. The only exception is the
  request flow's action bar (see Components), which replaces the header while the
  flow is open.
- **Nothing covers safety content:** urgent notices sit in normal page flow,
  directly below the header, and the scroll position is offset by the header height
  (`scroll-margin-top`) so anchor links never land underneath it.
- **No horizontal scrolling of content on phones.** Tables become stacked cards
  under `md`; tab rows wrap or become a select; long labels wrap rather than clip.

### Responsive breakpoints

| Name | Min width | Behaviour |
|---|---|---|
| base | 0 (design at 360px; check 390 and 430) | Single column, 56px header, menu sheet, stacked cards, full-screen request flow |
| `sm` | 640px | Two-up cards where content is parallel |
| `md` | 768px | 8-col grid; diagrams beside text; provider cards two-up; tables return; dialogs become centred panels (max 560px) |
| `lg` | 1024px | Full desktop nav (4 items + 1 action); 12-col grid; desktop type sizes |
| `xl` | 1280px | Wider margins only; no new layout |

## Elevation & Depth

Hierarchy comes from space, rules and the Ivory-to-white tonal step, not shadows.

- `raise`: cards that are clickable, at rest. Hover deepens the border, not the
  shadow.
- `overlay`: dialogs, the menu sheet and the AI panel only.
- No blur effects, glass surfaces or glow halos. The blurred radial "illumination"
  blobs in today's hero are removed (they're also expensive to paint on phones).

## Shapes

- `sm` 8px: inputs, chips, small tags.
- `md` 12px: cards, icon tiles, notices.
- `lg` 20px: dialogs, the hero tool panel, image frames.
- `pill`: buttons, segmented controls, status badges.

That gives 4 radii, replacing today's 9 variants (including 24px, 28px and 3xl).
Nested elements use a smaller radius than their container.

## Components

- **Button primary:** accent-strong fill, white text, 48px tall, pill. One per
  viewport. Label is a verb phrase: "Check your symptoms", "Send demo request".
  Hover and pressed → accent-press. Focus → 2px outline in `primary` with a 2px
  offset (on dark bands: `inverse-ink`). On the Forest band it also carries a 1px
  `inverse-ink` border. Disabled → `outline` fill, `ink-muted` text, 1px
  `outline-strong` border, no opacity tricks. Loading → "Sending…",
  `aria-busy="true"`, fixed width.
- **Button secondary:** primary fill, white text. For important actions that are
  not the screen's main one.
- **Button quiet:** text in primary with a hover tint of `surface-muted`. For "Back",
  "Show more", tertiary actions.
- **Link inline:** primary text, 1px underline offset 3px; hover thickens the
  underline to 2px. External links get a trailing `ArrowUpRight` 16px icon.
- **Card:** surface, 1px `outline` border, `md` radius, 24px padding. If clickable,
  the whole card is a single `<a>` or `<button>` with one accessible name; inner
  buttons are not allowed.
- **Icon-led card ("intent card"):** icon tile (44px, `md`, pale sage, Forest icon)
  → `headline-sm` → one `body-sm` line → trailing arrow. Used for "Where are you?"
  choices and tool entry points. Maximum three per row and three to four per group.
- **Section header:** optional `label` eyebrow, H2 `headline-md`, `body-lg` lede
  (max 2 sentences).
- **Notice:** `notice-urgent` (danger) for clot and emergency signs, always with a
  tel: link to 112 and 108 from `emergencyContacts.ts`. `notice-info` for "not a
  diagnosis" and AI disclosures. One notice per section maximum.
- **Demo label (`badge-demo`):** warning colours, 12px label type, 4px × 10px
  padding, text **"Demo profile · fictional"**. It sits on the same line as, or
  directly under, the provider's name, never only at the card's foot. Sample
  values carry an inline "Sample" prefix in `ink-muted` ("Sample fee ₹1,200",
  "Sample time: Tue 11:00"). A page showing demo records also opens with one
  `notice-info` line: "These are fictional demo profiles. No appointment will be
  made."
- **Provider card (`provider-card`), compact by default:** monogram (40px), name
  (`headline-sm`), demo label, one-line role, city, and two facts (languages, sample
  fee), then two actions: "View profile" (quiet) and "Request" (secondary; the
  page's primary action is the filter result or the request start). Target height
  is about 220px at 360px wide, against today's 597px. Bio, expertise, education
  and modalities move into an expandable "Profile details" disclosure or the
  profile view. Credentials show as plain text, not as verified badges.
- **Directory controls:** a single row with a search field and a "Filters" button
  showing the active count ("Filters · 2"). The button opens a bottom sheet with
  City, Specialty, Visit type and **Sort** (default "A–Z"; "Sample fee" and "Years
  of experience" only in demo mode). Applying shows "5 demo profiles" as a live
  region. Active filters appear as removable chips. No "next available" sort,
  because demo availability isn't real.
- **Request flow (stepper):** full-screen on phones, a 560px panel from `md`. Four
  steps: 1 Visit type and specialist → 2 Your details → 3 Preferred time (a
  preference, not a slot) → 4 Review. A 4px progress bar plus "Step 2 of 4" text sit
  under a 56px top bar with Back and Close. One `button-primary` ("Continue",
  then "Send demo request") sits in a bottom action bar that respects the safe
  area. The result screen is titled **"Demo request: not sent to any clinic"** in
  `badge-demo` styling, with a plain summary and "What would happen with a real
  partner" steps. Never a confirmation code.
- **Comparison stack (tools):** under `md`, a comparison table becomes one card per
  option, with the same field order in every card and a segmented control (wrapping,
  not scrolling) to jump between options. Badges wrap inside the card.
- **Report decoder pattern:** one finding per card ("What it says" → "What it
  means" → "Ask your doctor"), value in `value` type, colour never the only cue
  (each status gets a text word and an icon).
- **Mobile menu sheet:** opens from the header's menu button as a full-height
  sheet: an urgent line at the top (tel: 112 · 108), then a 3 × 2 grid of
  `nav-tile`s with the icon above a text label beneath (Understand, Symptom check,
  Doppler guide, Treatments, Find care, Visit prep), then "Ask the guide",
  then text links (About, FAQ, Privacy). Focus is trapped while open; Esc and Back
  close it.
- **Mascot:** one character per page at most, 48–64px, static, `aria-hidden`, beside
  a learning section heading, an empty state or a completion screen. Never inside
  urgent notices, results, provider cards or the request flow. The **owner will
  supply the mascot asset**. Until then the existing `VascularCharacters` SVGs stand
  in, rendered static. The new asset must not be recreated or approximated in code.
- **Educational guide panel:** a full-height sheet on phones and a 480px side panel
  from 1024px (target layout for Milestone 4; today it is a centred dialog). Title
  "Meridian Vascular educational guide"; every answer carries the badge **"Pre-written
  guidance"** as text, with the guide icon (Lucide `MessageCircleQuestion`), never an
  AI or robot icon. The header line reads "Pre-written guidance · General education,
  not a diagnosis · Messages stay in this browser". Quick replies come only from the
  supported-topic list. Urgent answers show the emergency block and **no** booking
  button. Labels live in `src/content/guideLabels.ts`. The guide makes no network
  request; nothing in its UI may imply AI generation.
- **Steps (care pathway):** numbered vertical list on mobile, horizontal 4-step rail
  on desktop. The active step gets a 2px Terracotta underline.
- **Disclosure (accordion):** for FAQs and deep clinical detail. Never for urgent
  information.
- **Inputs:** 48px, `sm` radius, 1px `outline-strong` border (3.74:1), label above
  the field, helper text below, error text in `danger` with an icon and
  `aria-describedby`. Required fields are marked "(required)" in text, not with `*`
  alone.
- **Header:** 56px (phone) / 64px (tablet, desktop), Ivory with a 1px bottom rule,
  solid rather than floating, full width. Desktop (≥1024px): logo, 4 nav items, one
  "Ask" quiet button, one secondary "Request appointment". Phone and tablet: logo
  symbol + wordmark, a 44px "Menu" button with a text label, and nothing else. The
  header hides on scroll down and returns on scroll up, and stays visible whenever
  focus is inside it.
- **Footer:** Forest band; brand line, sitemap columns, the urgent strip, medical
  disclaimer, editorial policy link. Contact details only once real ones exist.
- **Dialogs:** `useAccessibleDialog` (keep): focus trap, Esc to close, return focus,
  `overlay` shadow. On mobile, dialogs open as full-height sheets.

## Iconography

- **Library:** Lucide for all functional icons (already used, 39 distinct icons)
  **until the owner uploads the custom Meridian SVG collection**. Existing inline
  SVGs (the logo symbol, the mascots, the anatomy drawings) stay. Do not recreate
  or approximate the custom icons.
- **Custom SVG intake (when supplied):** keep the artwork as delivered. Store it in
  `src/assets/icons/` (proposed). Check each file for a consistent `viewBox`, strokes
  or fills that can follow `currentColor`, and no embedded scripts or external
  references. Map icons by meaning to the concept list below. Swap in navigation
  tiles and intent cards first, with Lucide kept as the fallback for any concept
  without a custom icon. Sizing and stroke rules below apply after review with the
  owner; if the set's native stroke differs from 1.5, the set wins and this
  section is updated.
- **Icon + label:** in navigation tiles and intent cards on phones, the icon (24px)
  sits above a text label beneath it. Icons never appear without a visible label in
  navigation.
- **Sizes:** 16px inline with `body-sm`/`body-md`; 20px in buttons and nav; 24px
  inside 44px icon tiles. Nothing else (today: 12, 14, 16, 20, 28 and 32px).
- **Stroke:** about 1.5px at every size (owner guidance, 2026-10-21), with
  `absoluteStrokeWidth`, rounded caps and joins, on a 24 × 24 grid where suitable.
- **Colour:** inherits text colour; Forest by default; Terracotta only for the
  single highlighted diagram callout.
- **Meaning:** one icon per concept, always: `Activity` = Doppler/scan,
  `Stethoscope` = specialists, `ClipboardList` = symptom check, `Route` = care
  pathway, `ShieldAlert` = urgent signs, `MessageCircleQuestion` = educational guide
  (exported as `GuideIcon`). `Sparkles` and `Bot` are retired for the guide, because
  they imply AI or magic.
- **Decorative icons** get `aria-hidden="true"`; icon-only buttons get an
  `aria-label`.

## Motion

Personality: **Premium-calm**, based on the motion-design skill's Premium archetype
and slowed slightly for a healthcare audience.

| Interaction | Duration | Easing |
|---|---|---|
| Hover, press, focus | 150ms | `ease-standard` |
| Card / content reveal on scroll | 250ms, 8px rise + opacity | `ease-standard` |
| Dialog / sheet enter | 250ms | `ease-standard` |
| Dialog / sheet exit | 150ms | `ease-exit` |
| Step or tab change in tools | 250ms crossfade | `ease-standard` |
| Diagram flow demonstrations | 400ms per step, user-triggered | `ease-standard` |

- Motion explains or confirms. Nothing loops indefinitely. The pulsing status dots,
  the mascots' continuous float loop, the vascular pulse background and the
  typewriter headline are all retired. A mascot may do one 400ms settle when it
  first enters view, and none under reduced motion.
- Staggered reveals total under 300ms; at most one group animates per viewport.
- Use the already-installed `motion` package (currently unused) for tool
  transitions, or CSS. Pick one per component, not both.
- **Reduced motion:** all movement is replaced by an instant state change or a
  100ms opacity fade. Keep the existing global CSS override; components using
  `motion` must read `useReducedMotion()`.

## Accessibility

- WCAG 2.2 AA is the target (BRAND.md commitment). Contrast pairs above are
  verified; new pairs must be checked before use.
- Skip link "Skip to main content" as the first focusable element (today: none).
- Visible focus on every interactive element: 2px outline, `primary` on light and
  `inverse-ink` on dark, with a 2px offset. Never `outline: none` without a
  replacement (today: 18 occurrences, and only 6 of 153 buttons use the focus utility).
- One H1 per route; headings in order. Each route sets `document.title`.
- Touch targets are 44 × 44px or larger, with 8px between adjacent targets.
- Urgent information is static text, never inside an accordion, tab or animation.
- Forms: visible labels, error text linked by `aria-describedby`, no placeholder-only
  labels.
- Diagrams: a short text alternative plus a "What this shows" caption.

## Do's and Don'ts

- **Do** give every screen one obvious next step, and make it the only
  accent-strong element in view.
- **Do** put the urgent strip near the top of the home page and above the fold on
  symptom, DVT and screener pages.
- **Do** label every fictional record "Demo profile · fictional" beside the name,
  and prefix every value on it with "Sample".
- **Do** use tokens by name in code (CSS variables / Tailwind theme). Never a raw
  hex in a component.
- **Don't** use Terracotta for errors, danger or more than one thing per screen.
- **Don't** add gradients behind text, glass, glow, blur blobs, emoji or pulsing
  dots. Don't use more than one mascot per page, or animate it in a loop.
- **Don't** stack more than three cards in a row or more than four in a group.
- **Don't** set any text under 12px, or running text under 16px.
- **Don't** show a fee, rating, time, address or phone number unless it is real and
  verified, or it is on a labelled demo profile with the "Sample" prefix. Never put
  sample values into structured data.
- **Don't** use uppercase letter-spaced mono labels as decoration; `label` appears
  at most once per block, and mono is for measured values only.

## Proposed v5 additions (not approved)

The owner's 2026-10-21 experience brief led to proposals that would extend this system: a motion
design system (purpose categories, tokens, simulation and reduced-motion rules), simulation
labelling rules, and performance/accessibility budgets P1–P10 and A1–A8. They also propose
amending "Motion" above so that a user-started simulation may loop while visible with a Pause
control, and the hero may play one settle of up to 4 s. **None of this applies until approved.**
See [docs/redesign/experience-direction.md](docs/redesign/experience-direction.md) §4–§6.

## Decisions log

5. **Milestone 2 (2026-10-21, owner-approved):** the header is always visible (no hide on
   scroll). The full desktop bar starts at **1280px** with five links (Learn, Symptom check,
   Doppler guide, Treatments, Find care), "Ask the guide" (quiet) and "Request an appointment
   (demo)" (secondary); below 1280px it is the logo and the Menu button. This supersedes the
   1024px / 4-item wording in Responsive breakpoints and Components. Tokens live in
   `src/index.css` `@theme` as `mv-*`.
6. **Measure (found in M2):** `ch` is wide in Plus Jakarta Sans, so `68ch` gives about 95–100
   average characters per line. Code uses rem caps instead (about 34rem at 16px, 37rem at
   18px, roughly 70 characters).

1. **Terracotta legibility: resolved (2026-10-21).** `accent-strong #A9472F` is
   approved for white-text primary buttons. The brand value `#CE5B40` stays
   decorative. State contrast is verified above, with the Forest-band border rule.
2. **Display serif: resolved (2026-10-21).** Source Serif 4 for display and
   headings; Plus Jakarta Sans for body copy and controls; IBM Plex Mono for
   measured values only. Instrument Serif and IBM Plex Sans are retired.
3. **Icons: resolved (2026-10-21).** Lucide until the owner's custom SVG set is
   uploaded; intake rules above.
4. **Mascot: resolved (2026-10-21).** Subtle supporting element; the owner supplies
   the asset.
