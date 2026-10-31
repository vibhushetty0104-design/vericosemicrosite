/**
 * Curated vascular medical photography for Meridian Vascular.
 * High-resolution photographic assets served from public/assets/photos.
 * Adheres strictly to the brand palette (#0B4036, #8DAA9D, #CE5B40, #FAF7F2),
 * warm natural clinical lighting, realistic patient scenarios, and culturally authentic Indian settings.
 */

export interface MedicalPhoto {
  id: string;
  src: string;
  alt: string;
  caption: string;
  clinicalTag: string;
  width: number;
  height: number;
  aspectRatio: string;
}

export const CLINICAL_PHOTOS = {
  heroClinicBg: {
    id: 'hero-clinic-bg',
    src: '/assets/photos/hero-clinic-bg.jpg',
    alt: 'Modern, serene vascular consultation clinic with natural light and ultrasound equipment',
    caption: 'State-of-the-art outpatient vascular suite designed for calm, dignified clinical evaluation.',
    clinicalTag: 'Vascular Consultation Suite',
    width: 1920,
    height: 1080,
    aspectRatio: '16/9',
  },
  clinicalDopplerExam: {
    id: 'clinical-doppler-exam',
    src: '/assets/photos/clinical-doppler-exam.jpg',
    alt: 'Vascular specialist performing a standing lower-limb venous duplex ultrasound scan on an adult patient',
    caption: 'Standing bilateral venous duplex ultrasound evaluating valve reflux and deep venous patency.',
    clinicalTag: 'Diagnostic Venous Duplex',
    width: 1200,
    height: 800,
    aspectRatio: '3/2',
  },
  clinicalConsultation: {
    id: 'clinical-consultation',
    src: '/assets/photos/clinical-consultation.jpg',
    alt: 'Indian vascular specialist compassionately explaining Doppler findings and treatment options to a patient',
    caption: 'One-on-one specialist consultation reviewing diagnostic findings with shared decision-making.',
    clinicalTag: 'Specialist Consultation',
    width: 1200,
    height: 800,
    aspectRatio: '3/2',
  },
  treatmentLaserEvla: {
    id: 'treatment-laser-evla',
    src: '/assets/photos/treatment-laser-evla.jpg',
    alt: 'Endovenous laser ablation (EVLA) modern procedure suite with laser fiber console',
    caption: 'Targeted endothermal laser ablation (EVLA) delivered under local tumescent anaesthesia.',
    clinicalTag: 'Day-Care EVLA Suite',
    width: 1200,
    height: 800,
    aspectRatio: '3/2',
  },
  treatmentVenasealGlue: {
    id: 'treatment-venaseal-glue',
    src: '/assets/photos/treatment-venaseal-glue.jpg',
    alt: 'Non-thermal vein adhesive closure (VenaSeal) sterile tray and catheter system',
    caption: 'Non-thermal medical cyanoacrylate closure eliminating the need for tumescent injections.',
    clinicalTag: 'VenaSeal Closure System',
    width: 1200,
    height: 800,
    aspectRatio: '3/2',
  },
  treatmentCompression: {
    id: 'treatment-compression',
    src: '/assets/photos/treatment-compression.jpg',
    alt: 'Graduated medical compression stocking fitted neatly on lower leg for venous circulation support',
    caption: 'Graduated Class 2 compression therapy providing counter-pressure to reduce venous pooling.',
    clinicalTag: 'Graduated Compression',
    width: 1200,
    height: 800,
    aspectRatio: '3/2',
  },
  habitsElevation: {
    id: 'habits-elevation',
    src: '/assets/photos/habits-elevation.jpg',
    alt: 'Patient comfortably elevating legs above heart level on an ergonomic contour cushion',
    caption: 'Leg elevation for 15 minutes utilizes gravity to encourage venous blood return toward the heart.',
    clinicalTag: 'Circulation & Recovery Habits',
    width: 1200,
    height: 800,
    aspectRatio: '3/2',
  },
  dvtEmergencyHospital: {
    id: 'dvt-emergency-hospital',
    src: '/assets/photos/dvt-emergency-hospital.jpg',
    alt: 'Contemporary hospital emergency department triage for rapid DVT and pulmonary embolism evaluation',
    caption: 'Urgent medical triage ready 24/7 for unilateral swelling, chest pain, or sudden breathlessness.',
    clinicalTag: 'Emergency Vascular Triage',
    width: 1200,
    height: 800,
    aspectRatio: '3/2',
  },
  careJourneyReception: {
    id: 'care-journey-reception',
    src: '/assets/photos/care-journey-reception.jpg',
    alt: 'Welcoming reception and patient lounge at an outpatient vascular health center',
    caption: 'Dignified reception coordinating appointments, records, and seamless day-care visits.',
    clinicalTag: 'Patient Care Lounge',
    width: 1200,
    height: 800,
    aspectRatio: '3/2',
  },
  insuranceTpaDesk: {
    id: 'insurance-tpa-desk',
    src: '/assets/photos/insurance-tpa-desk.jpg',
    alt: 'Hospital cashless insurance and TPA coordination desk reviewing pre-authorization papers',
    caption: 'Dedicated cashless TPA helpdesk supporting pre-authorization for therapeutic vein procedures.',
    clinicalTag: 'Cashless TPA Helpdesk',
    width: 1200,
    height: 800,
    aspectRatio: '3/2',
  },
} as const;

export type ClinicalPhotoKey = keyof typeof CLINICAL_PHOTOS;
