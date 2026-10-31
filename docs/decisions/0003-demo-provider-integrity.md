# 0003 — Demo provider and request integrity

- Status: accepted (owner decision, 2026-10-21)

## Context

The demo must show realistic specialist discovery and booking to prospective partners. The five
fictional profiles named real Indian colleges and institutes, real insurers, a regulator ("NMC
Credentials") and a named certification. The request flow produced a "Simulation ID". The footer
listed contact details that looked real, and a "HIPAA Compliant" badge.

## Decision

- Keep all five fictional profiles, their names, IDs, cities, fees, times and fields.
- Label each profile "Demo profile · fictional" (`DEMO_PROFILE_LABEL`) directly under the name, in
  readable 12px text. Prefix sample values: "Sample credentials", "Sample fee", "Sample time
  (illustrative, not real availability)", "yrs exp (sample)", "Sample insurance note".
- Use lettered fictional institutions ("Demo Medical College A, Bengaluru (fictional)") so demo
  names cannot collide with real ones. Qualification types (MBBS, MS, MD, MCh, DNB, FVIR) may
  appear as sample credentials; named certifications, memberships, empanelments, regulators and
  accreditations may not.
- End the request with exactly "Demo request: not sent to any clinic", without a reference ID,
  patient details or any promise of contact.
- Remove fabricated contact details and compliance claims from public pages.
- Never include demo providers in structured data; no canonical URL until a domain is confirmed.

## Consequences

- A denylist test (`tests/phase0Safety.test.ts`, group 13) blocks real institution names from demo
  records.
- Verified providers will need an explicit status model (demo, pending verification, verified,
  suspended, unpublished) with verification source and date before real profiles appear
  (Milestone 3 / 7). Demo and verified records must not share an ambiguous type.
- "Dr. Karthik Raman" is kept by owner decision even though a real cardiologist with that name is
  listed in Chennai; the prominent label and fictional institution mitigate confusion.
