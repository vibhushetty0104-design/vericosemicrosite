import React from 'react';

/**
 * MERIDIAN VASCULAR CUSTOM SVG ICON REGISTRY
 *
 * All 25 bespoke vector icons created specifically for Meridian Vascular.
 * Palette: Forest Green (#0B4036), Terracotta (#CE5B40), Sage (#8DAA9D).
 * Each icon is built on a 24x24 viewBox with 1.5px/1.75px stroke precision.
 */

export type MeridianIconName =
  | 'clinic'
  | 'ultrasoundProbe'
  | 'sparkles'
  | 'compressionTherapy'
  | 'venousValve'
  | 'symptoms'
  | 'dopplerWaveform'
  | 'urgentWarning'
  | 'vascularAnatomy'
  | 'vesselLumen'
  | 'dopplerReport'
  | 'diseaseProgression'
  | 'perforatorVeins'
  | 'laserAblation'
  | 'radiofrequencyAblation'
  | 'sclerotherapy'
  | 'specialist'
  | 'appointment'
  | 'symptomChecker'
  | 'educationalGuide'
  | 'faq'
  | 'trust'
  | 'treatmentOptions'
  | 'careJourney'
  | 'spiderVeins';

export interface MeridianIconMeta {
  id: number;
  name: MeridianIconName;
  slug: string;
  originalFile: string;
  label: string;
  description: string;
}

export const MERIDIAN_ICON_REGISTRY: Record<MeridianIconName, MeridianIconMeta> = {
  'clinic': {
    id: 1,
    name: 'clinic',
    slug: 'clinic',
    originalFile: 'gemini-svg.svg',
    label: 'Care Base / Clinic',
    description: 'Base clinic, consultation facility and medical home.',
  },
  'ultrasoundProbe': {
    id: 2,
    name: 'ultrasoundProbe',
    slug: 'ultrasound-probe',
    originalFile: 'gemini-svg (1).svg',
    label: 'Duplex Ultrasound Scan',
    description: 'Transducer probe emitting acoustic pulses for duplex venous scan.',
  },
  'sparkles': {
    id: 3,
    name: 'sparkles',
    slug: 'sparkles',
    originalFile: 'gemini-svg (2).svg',
    label: 'Meridbot Companion',
    description: 'Interactive AI educational companion & intelligent guide.',
  },
  'compressionTherapy': {
    id: 4,
    name: 'compressionTherapy',
    slug: 'compression-therapy',
    originalFile: 'gemini-svg (3).svg',
    label: 'Compression Therapy',
    description: 'Graduated elastic compression stocking on lower leg.',
  },
  'venousValve': {
    id: 5,
    name: 'venousValve',
    slug: 'venous-valve',
    originalFile: 'gemini-svg (4).svg',
    label: 'Venous Valve & Reflux',
    description: 'Bicuspid vein valve leaflets and retrograde blood reflux.',
  },
  'symptoms': {
    id: 6,
    name: 'symptoms',
    slug: 'symptoms',
    originalFile: 'gemini-svg (5).svg',
    label: 'Vein Symptoms',
    description: 'Leg calf contour with visible tortuous varicose vein.',
  },
  'dopplerWaveform': {
    id: 7,
    name: 'dopplerWaveform',
    slug: 'doppler-waveform',
    originalFile: 'gemini-svg (6).svg',
    label: 'Doppler Spectral Monitor',
    description: 'Diagnostic monitor showing Doppler velocity spectral trace.',
  },
  'urgentWarning': {
    id: 8,
    name: 'urgentWarning',
    slug: 'urgent-warning',
    originalFile: 'gemini-svg (7).svg',
    label: 'Urgent Signs / DVT Alert',
    description: 'Clinical warning triangle for deep vein thrombosis and complications.',
  },
  'vascularAnatomy': {
    id: 9,
    name: 'vascularAnatomy',
    slug: 'vascular-anatomy',
    originalFile: 'gemini-svg (8).svg',
    label: 'Saphenofemoral Junction (SFJ)',
    description: 'Bifurcating Y-junction of deep and superficial venous trunks.',
  },
  'vesselLumen': {
    id: 10,
    name: 'vesselLumen',
    slug: 'vessel-lumen',
    originalFile: 'gemini-svg (9).svg',
    label: 'Vein Lumen Cross-Section',
    description: 'Compressibility, wall thickness, and intraluminal thrombus assessment.',
  },
  'dopplerReport': {
    id: 11,
    name: 'dopplerReport',
    slug: 'doppler-report',
    originalFile: 'gemini-svg (10).svg',
    label: 'Doppler Scan Report',
    description: 'Medical ultrasound report document with velocity trace.',
  },
  'diseaseProgression': {
    id: 12,
    name: 'diseaseProgression',
    slug: 'disease-progression',
    originalFile: 'gemini-svg (11).svg',
    label: 'CEAP Progression & Staging',
    description: 'Bar chart tracking clinical disease stages from C0 to C6.',
  },
  'perforatorVeins': {
    id: 13,
    name: 'perforatorVeins',
    slug: 'perforator-veins',
    originalFile: 'gemini-svg (12).svg',
    label: 'Perforator Vein Incompetence',
    description: 'Bridging perforator vein connecting deep and superficial systems.',
  },
  'laserAblation': {
    id: 14,
    name: 'laserAblation',
    slug: 'laser-ablation',
    originalFile: 'gemini-svg (13).svg',
    label: 'Endovenous Laser (EVLA)',
    description: 'Laser fiber tip emitting radial thermal energy to close vein.',
  },
  'radiofrequencyAblation': {
    id: 15,
    name: 'radiofrequencyAblation',
    slug: 'radiofrequency-ablation',
    originalFile: 'gemini-svg (14).svg',
    label: 'Radiofrequency Ablation (RFA)',
    description: 'Thermal segmental heating catheter for endovenous closure.',
  },
  'sclerotherapy': {
    id: 16,
    name: 'sclerotherapy',
    slug: 'sclerotherapy',
    originalFile: 'gemini-svg (15).svg',
    label: 'Ultrasound Foam Sclerotherapy',
    description: 'Precision syringe delivery of sclerosant microfoam.',
  },
  'specialist': {
    id: 17,
    name: 'specialist',
    slug: 'specialist',
    originalFile: 'gemini-svg (16).svg',
    label: 'Vascular Specialist',
    description: 'Stethoscope for clinical examination and specialist consultation.',
  },
  'appointment': {
    id: 18,
    name: 'appointment',
    slug: 'appointment',
    originalFile: 'gemini-svg (17).svg',
    label: 'Consultation Appointment',
    description: 'Calendar scheduling for in-person specialist evaluation.',
  },
  'symptomChecker': {
    id: 19,
    name: 'symptomChecker',
    slug: 'symptom-checker',
    originalFile: 'gemini-svg (18).svg',
    label: 'Symptom Assessment Checklist',
    description: '8-question self-assessment checklist and preparation sheet.',
  },
  'educationalGuide': {
    id: 20,
    name: 'educationalGuide',
    slug: 'educational-guide',
    originalFile: 'gemini-svg (19).svg',
    label: 'Educational Guide / Learn Hub',
    description: 'Open educational handbook and evidence-based vascular curriculum.',
  },
  'faq': {
    id: 21,
    name: 'faq',
    slug: 'faq',
    originalFile: 'gemini-svg (20).svg',
    label: 'Questions & FAQs',
    description: 'Speech query bubble with guidance question mark.',
  },
  'trust': {
    id: 22,
    name: 'trust',
    slug: 'trust',
    originalFile: 'gemini-svg (21).svg',
    label: 'Clinical Evidence & Trust',
    description: 'Protective medical shield with validated evidence checkmark.',
  },
  'treatmentOptions': {
    id: 23,
    name: 'treatmentOptions',
    slug: 'treatment-options',
    originalFile: 'gemini-svg (22).svg',
    label: 'Treatment Comparison',
    description: 'Branching pathway comparing EVLA, RFA, medical glue and conservative care.',
  },
  'careJourney': {
    id: 24,
    name: 'careJourney',
    slug: 'care-journey',
    originalFile: 'gemini-svg (23).svg',
    label: 'Patient Care Journey',
    description: 'Step-by-step 5-stage pathway from symptoms to post-care recovery.',
  },
  'spiderVeins': {
    id: 25,
    name: 'spiderVeins',
    slug: 'spider-veins',
    originalFile: 'gemini-svg (24).svg',
    label: 'Spider & Reticular Veins',
    description: 'Starburst telangiectasia and cosmetic surface vascular networks.',
  },
};

export interface MeridianIconProps extends React.SVGProps<SVGSVGElement> {
  name: MeridianIconName;
  size?: number | string;
  className?: string;
  title?: string;
}

export const MeridianIcon: React.FC<MeridianIconProps> = ({
  name,
  size = 24,
  className = '',
  title,
  stroke = 'currentColor',
  strokeWidth = 1.5,
  ...props
}) => {
  const meta = MERIDIAN_ICON_REGISTRY[name];
  const ariaTitle = title || meta?.label;

  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label={ariaTitle}
      {...props}
    >
      {renderIconPaths(name)}
    </svg>
  );
};

function renderIconPaths(name: MeridianIconName): React.ReactNode {
  switch (name) {
    case 'clinic':
      return (
        <>
          <path d="M3 10.5L12 3l9 7.5V20a1.5 1.5 0 0 1-1.5 1.5H4.5A1.5 1.5 0 0 1 3 20v-9.5z" />
  <circle cx="12" cy="14" r="2.5" stroke="#CE5B40" fill="none" />
  <path d="M12 16.5V21" />
        </>
      );
    case 'ultrasoundProbe':
      return (
        <>
          <circle cx="5" cy="18" r="2" fill="#0B4036" />
  <circle cx="12" cy="6" r="2" stroke="#0B4036" />
  <circle cx="19" cy="14" r="2" fill="#CE5B40" stroke="#CE5B40" />
  <path d="M6.5 16.8C8.5 15 10 10 11.5 7.8" stroke-dasharray="0.5 2.5" />
  <path d="M13.5 7.5C15 10 16.5 13 17.5 13.8" />
        </>
      );
    case 'sparkles':
      return (
        <>
          <path d="M12 3c0 4.5-1.5 6-6 6 4.5 0 6 1.5 6 6 0-4.5 1.5-6 6-6-4.5 0-6-1.5-6-6z" fill="rgba(206,91,64,0.08)" />
  
  <circle cx="18.5" cy="5.5" r="1.5" fill="#CE5B40" />
  <circle cx="6" cy="18.5" r="1" fill="#0B4036" stroke="#0B4036" />
        </>
      );
    case 'compressionTherapy':
      return (
        <>
          <path d="M7 3c1 3.5 1.5 6 1 10-.5 3.5-.8 5-.5 8h7.5c-.2-3-.3-5.5.8-8.5 1.2-3.3 1.2-6.5.7-9.5" />
  
  <path d="M11 9.5c1 .5 2 .5 3 0" stroke="#CE5B40" />
  <path d="M10 12.5c1.5.8 3.5.8 5 0" stroke="#CE5B40" />
  <path d="M11 15.5c1 .5 2 .5 3 0" stroke="#CE5B40" />
        </>
      );
    case 'venousValve':
      return (
        <>
          <path d="M6 3v18M18 3v18" />
  
  <path d="M6 12c3 0 5.5-2 6-4" />
  <path d="M18 12c-3 0-5.5-2-6-4" />
  
  <path d="M12 18V9m0-3l-2 2m2-2l2 2" stroke="#0B4036" />
        </>
      );
    case 'symptoms':
      return (
        <>
          <path d="M6.5 3c2 2.5 3.5 4 1.5 7s-1 5.5 1.5 8 1 3 0 3" />
  <path d="M17.5 3c2 2.5 3.5 4 1.5 7s-1 5.5 1.5 8 1 3 0 3" />
  
  <path d="M7.5 10c2.5 0 3.5-1 4-2" />
  <path d="M16.5 10c-2.5 0-3.5-1-4-2" />
  <path d="M12 10v6m0 0l-2-2m2 2l2-2" stroke="#CE5B40" />
        </>
      );
    case 'dopplerWaveform':
      return (
        <>
          <path d="M7 3h10v4a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V3z" />
  <path d="M12 9v3" />
  
  <path d="M3 18h4l2.5-5 3 8 2.5-3h6" stroke="#CE5B40" />
        </>
      );
    case 'urgentWarning':
      return (
        <>
          <path d="M12 3.5L2.5 20a1 1 0 0 0 .86 1.5h17.28a1 1 0 0 0 .86-1.5L12 3.5z" />
  <line x1="12" y1="9" x2="12" y2="14" strokeWidth="1.75" />
  <circle cx="12" cy="17.5" r="0.75" fill="#CE5B40" />
        </>
      );
    case 'vascularAnatomy':
      return (
        <>
          <path d="M12 21V12" />
  <path d="M12 12C12 8.5 7.5 7 7 3" />
  <path d="M12 12C12 8.5 16.5 7 17 3" />
  
  <line x1="8" y1="9" x2="11.5" y2="10.5" stroke="#CE5B40" stroke-dasharray="1 2" />
  <circle cx="12" cy="12" r="1.5" fill="#0B4036" />
        </>
      );
    case 'vesselLumen':
      return (
        <>
          <rect x="6" y="3" width="12" height="18" rx="3" />
  
  <ellipse cx="12" cy="12" rx="3.5" ry="4.5" fill="#CE5B40" stroke="#CE5B40" />
  
  <path d="M8 8.5c.5 2 1.5 2.5 1.5 5.5" stroke="#8DAA9D" />
        </>
      );
    case 'dopplerReport':
      return (
        <>
          <path d="M5 3h10l5 5v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
  <path d="M14 3v5h5" />
  
  <path d="M7 14h2.5l1.5-2.5 2 5 1.5-2.5H17" stroke="#CE5B40" />
  <line x1="7" y1="18" x2="13" y2="18" />
        </>
      );
    case 'diseaseProgression':
      return (
        <>
          <rect x="3" y="16" width="4" height="5" rx="1" fill="#0B4036" />
  <rect x="8.5" y="12" width="4" height="9" rx="1" />
  <rect x="14" y="8" width="4" height="13" rx="1" />
  <rect x="19.5" y="4" width="3.5" height="17" rx="1" stroke="#CE5B40" />
  
  <path d="M4 11l6-5 6 2 4-5" stroke="#CE5B40" />
        </>
      );
    case 'perforatorVeins':
      return (
        <>
          <line x1="12" y1="3" x2="12" y2="21" stroke-dasharray="2 2" stroke="#8DAA9D" />
  
  <rect x="4" y="6" width="5.5" height="12" rx="2" />
  <circle cx="6.75" cy="12" r="1.25" fill="#0B4036" />
  
  <rect x="14.5" y="6" width="5.5" height="12" rx="2" stroke="#CE5B40" />
  <circle cx="17.25" cy="12" r="1.25" fill="#CE5B40" />
        </>
      );
    case 'laserAblation':
      return (
        <>
          <path d="M4 18l7.5-7.5" strokeWidth="2" />
  
  <circle cx="14" cy="8" r="2.5" stroke="#CE5B40" fill="#CE5B40" />
  
  <path d="M14 3.5v2M14 10.5v2M9.5 8h2M16.5 8h2M10.5 4.5l1.5 1.5M16 10l1.5 1.5" stroke="#CE5B40" />
        </>
      );
    case 'radiofrequencyAblation':
      return (
        <>
          <path d="M4 20L11 13" />
  
  <rect x="10.5" y="5.5" width="8" height="8" rx="2" transform="rotate(45 14.5 9.5)" stroke="#CE5B40" />
  
  <path d="M16 4c2.5 1 3.5 3 3.5 3" stroke="#CE5B40" />
  <path d="M20 7.5c1.5 2 1.5 4.5.5 6" stroke="#CE5B40" />
        </>
      );
    case 'sclerotherapy':
      return (
        <>
          <path d="M4 20l5-5m-1-1l4-4 2 2-4 4-2-2z" />
  
  <circle cx="15.5" cy="7.5" r="2" fill="rgba(11,64,54,0.15)" stroke="#0B4036" />
  <circle cx="19" cy="6" r="1.25" fill="#CE5B40" stroke="#CE5B40" />
  <circle cx="18" cy="11" r="1.5" stroke="#0B4036" />
        </>
      );
    case 'specialist':
      return (
        <>
          <path d="M7 3v6a5 5 0 0 0 10 0V3" />
  
  <circle cx="7" cy="3" r="1" fill="#0B4036" />
  <circle cx="17" cy="3" r="1" fill="#0B4036" />
  
  <path d="M12 14v4a2 2 0 0 0 2 2h2" />
  <circle cx="18" cy="20" r="2" stroke="#CE5B40" fill="none" />
        </>
      );
    case 'appointment':
      return (
        <>
          <rect x="3.5" y="4.5" width="17" height="16" rx="3" />
  <line x1="3.5" y1="9.5" x2="20.5" y2="9.5" />
  <line x1="8" y1="2.5" x2="8" y2="5" />
  <line x1="16" y1="2.5" x2="16" y2="5" />
  
  <circle cx="12" cy="14.5" r="2" fill="#CE5B40" stroke="#CE5B40" />
        </>
      );
    case 'symptomChecker':
      return (
        <>
          <rect x="4" y="3.5" width="16" height="17" rx="2" />
  
  <path d="M7.5 8l2 2 4.5-4.5" stroke="#CE5B40" />
  <line x1="16" y1="8" x2="17.5" y2="8" />
  <path d="M7.5 14l2 2 4.5-4.5" stroke="#CE5B40" />
  <line x1="16" y1="14" x2="17.5" y2="14" />
        </>
      );
    case 'educationalGuide':
      return (
        <>
          <path d="M3.5 6.5C5.5 5 8 5 12 6.5v13c-4-1.5-6.5-1.5-8.5 0V6.5z" />
  <path d="M20.5 6.5C18.5 5 16 5 12 6.5v13c4-1.5 6.5-1.5 8.5 0V6.5z" />
  
  <path d="M12 3v5" stroke="#CE5B40" />
        </>
      );
    case 'faq':
      return (
        <>
          <path d="M20 11.5A8.5 8.5 0 0 1 8.5 19.5L4 20.5l1.5-4A8.5 8.5 0 1 1 20 11.5z" />
  
  <path d="M10 9a2 2 0 1 1 3 1.7c-.8.5-1 1-1 1.8" stroke="#CE5B40" />
  <circle cx="12" cy="15.5" r="0.75" fill="#CE5B40" />
        </>
      );
    case 'trust':
      return (
        <>
          <path d="M12 3L4.5 6.5v6c0 5 3.5 8 7.5 9 4-1 7.5-4 7.5-9v-6L12 3z" />
  
  <path d="M9.5 12.5l2 2 3.5-4" stroke="#CE5B40" />
        </>
      );
    case 'treatmentOptions':
      return (
        <>
          <path d="M5 4c2 3 4 5 7 5s5-2 7-5" />
  <path d="M5 20c2-3 4-5 7-5s5 2 7 5" />
  
  <circle cx="12" cy="12" r="2.5" fill="#CE5B40" stroke="#CE5B40" />
  <path d="M12 7.5v2m0 5v2" stroke="#8DAA9D" />
        </>
      );
    case 'careJourney':
      return (
        <>
          <line x1="5" y1="3" x2="5" y2="21" stroke-dasharray="2 3" stroke="#8DAA9D" />
  <line x1="19" y1="3" x2="19" y2="21" stroke-dasharray="2 3" stroke="#8DAA9D" />
  
  <path d="M12 19V5m0 0l-3 3m3-3l3 3" strokeWidth="1.75" />
  <path d="M8.5 16v-6m0 0l-1.5 1.5m1.5-1.5l1.5 1.5" stroke="#CE5B40" />
  <path d="M15.5 16v-6m0 0l-1.5 1.5m1.5-1.5l1.5 1.5" stroke="#CE5B40" />
        </>
      );
    case 'spiderVeins':
      return (
        <>
          <path d="M4.5 7c3 2 4.5 4 4.5 5s-1.5 3-4.5 5" strokeWidth="1.75" />
  <path d="M19.5 7c-3 2-4.5 4-4.5 5s1.5 3 4.5 5" strokeWidth="1.75" />
  
  <line x1="12" y1="3" x2="12" y2="21" />
  
  <path d="M12 9l-2 2m2-2l2 2" stroke="#CE5B40" />
  
  <path d="M7 12h2m6 0h2" stroke="#CE5B40" />
        </>
      );
    default:
      return null;
  }
}
