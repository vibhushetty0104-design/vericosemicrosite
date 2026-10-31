# Meridian Vascular — Varicose Veins Microsite Integration Architecture

## 1. Overview & Strategic Role

This repository hosts the **Meridian Vascular — Varicose Veins Dedicated Microsite**, a focused patient portal delivering clinical education, CEAP-aligned symptom assessment, modern day-care treatment comparisons, expert clinical review of Doppler ultrasound scans and leg photos, and appointment booking.

The main Meridian Vascular portal is being developed as a separate platform. This microsite is designed to operate autonomously today and integrate seamlessly as a sub-domain, route, or embedded micro-frontend into the primary healthcare platform.

---

## 2. Main-Site Entry Points & Deep Link Contracts

When the main Meridian Vascular homepage renders a service card or clinical destination icon for **Varicose Veins**, it can route patients directly to any of the following verified entry points:

| Main Site Destination | Microsite URL / Hash | Description & Landing View |
| :--- | :--- | :--- |
| **Varicose Veins Portal** | `/` or `/#home` | Microsite landing page with 5 prominent action pathways |
| **Symptom Screener** | `/#assessment` | 3-minute CEAP-aligned interactive assessment & photo vault |
| **Modern Treatments** | `/#treatments` | Comparative analysis of EVLA, VenaSeal, RFA, Sclerotherapy |
| **Upload Doppler Scans** | `/#expert-review` | Secure document & photograph upload for doctor review |
| **Patient Portal / Records**| `/#dashboard` | DPDP-compliant review status, appointments & data export |
| **Venous Anatomy & Pump** | `/#learn/leg-circulation` | 3D interactive venous valve and calf muscle pump viewer |
| **Warning Signs (DVT)** | `/#learn/dvt-warning-signs` | Emergency red flag education (Dial 112 / 108 protocol) |

---

## 3. Session & Identity State Handshake

When integrating into the main portal, patient authentication and review drafts can be passed via standardized browser storage or URL tokens:

### 3.1 Patient User Contract (`PatientUser`)
```typescript
interface PatientUser {
  id: string;               // e.g. "PAT-2026-XXXX"
  name: string;             // Legal full name
  phone: string;            // E.164 formatted mobile (e.g. "+91 98765 43210")
  email?: string;
  isVerified: boolean;
  authMethod: 'phone_otp' | 'aadhaar_sandbox';
  registeredAt: string;     // ISO 8601 timestamp
  abhaNumber?: string;      // Optional ABHA ID (e.g. "91-1234-5678-9012")
}
```

Stored in `sessionStorage.getItem('meridian_patient_user')`. If the main site authenticates the user, it can pre-populate this session storage before navigating or post an event via `window.postMessage`.

### 3.2 Expert Review Submissions Contract (`ExpertReviewSubmission`)
```typescript
interface ExpertReviewSubmission {
  id: string;               // "REV-YYYY-XXXX"
  category: 'medical-reports' | 'leg-photos';
  patientId: string;
  patientName: string;
  patientPhone: string;
  submittedAt: string;
  status:
    | 'Submitted — In Triage'
    | 'Awaiting Clinician Assignment'
    | 'In Clinician Review'
    | 'Completed';
  attachments: ReviewAttachment[];
  notes?: string;
  consentGiven: boolean;
  assignedDoctorName?: string;
}
```

---

## 4. Compliance & Privacy Boundaries (DPDP Act 2023)

1. **No Algorithmic Diagnostics:** The portal explicitly disclaims AI diagnostics. Scans and photographs are routed to licensed vascular clinicians.
2. **UIDAI / Aadhaar Protection:** Full 12-digit Aadhaar numbers and Aadhaar card photographs are never collected or stored. Verification is restricted to phone OTP or official ABDM/ABHA health ID tokens.
3. **Zero Third-Party Tracking:** Analytics are localized to session events via custom DOM events without cross-site cookies, external beacons, or third-party ad scripts.

---

## 5. Build & Deployment Artifacts

- **Output Directory:** `dist/`
- **Routing Engine:** Vite single-page application (SPA) with Vercel URL rewrite fallback to `/index.html`.
- **Assets:** Optimized WebP/PNG icons (`public/assets/icons2/`), 2.5D Meridbot character poses (`public/assets/meridbot-25d/`), and background video (`public/assets/meridian-hero-background.mp4`).
