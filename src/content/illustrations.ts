/**
 * Approved 2.5D medical icons (design-assets/meridian-icons2). Imported so Vite bundles hashed
 * copies at build time; the source artwork is never edited. Files are 500×500 transparent PNGs of
 * 91–222 KB each, so pages show only a few and size them small (optimised derivatives are a
 * pre-launch task; see docs/demo-boundary.md).
 */
import appointment from '../../design-assets/meridian-icons2/mv-icon-appointment-removebg-preview.png';
import compressionTherapy from '../../design-assets/meridian-icons2/mv-icon-compression-therapy-removebg-preview.png';
import consultation from '../../design-assets/meridian-icons2/mv-icon-consultation-removebg-preview.png';
import dopplerReport from '../../design-assets/meridian-icons2/mv-icon-doppler-report-removebg-preview.png';
import dvtAwareness from '../../design-assets/meridian-icons2/mv-icon-dvt-awareness-removebg-preview.png';
import educationalGuide from '../../design-assets/meridian-icons2/mv-icon-educational-guide-removebg-preview.png';
import laserTreatment from '../../design-assets/meridian-icons2/mv-icon-laser-treatment-removebg-preview.png';
import medicalReports from '../../design-assets/meridian-icons2/mv-icon-medical-reports-removebg-preview.png';
import patientJourney from '../../design-assets/meridian-icons2/mv-icon-patient-journey-removebg-preview.png';
import researchLibrary from '../../design-assets/meridian-icons2/mv-icon-research-library-removebg-preview.png';
import riskFactors from '../../design-assets/meridian-icons2/mv-icon-risk-factors-removebg-preview.png';
import treatmentOptions from '../../design-assets/meridian-icons2/mv-icon-treatment-options-removebg-preview.png';
import valveFunction from '../../design-assets/meridian-icons2/mv-icon-valve-function-removebg-preview.png';
import varicoseVeins from '../../design-assets/meridian-icons2/mv-icon-varicose-veins-removebg-preview.png';
import veinAnatomy from '../../design-assets/meridian-icons2/mv-icon-vein-anatomy-removebg-preview.png';
import venousReflux from '../../design-assets/meridian-icons2/mv-icon-venous-reflux-removebg-preview.png';

export const ILLUSTRATIONS = {
  appointment,
  'compression-therapy': compressionTherapy,
  consultation,
  'doppler-report': dopplerReport,
  'dvt-awareness': dvtAwareness,
  'educational-guide': educationalGuide,
  'laser-treatment': laserTreatment,
  'medical-reports': medicalReports,
  'patient-journey': patientJourney,
  'research-library': researchLibrary,
  'risk-factors': riskFactors,
  'treatment-options': treatmentOptions,
  'valve-function': valveFunction,
  'varicose-veins': varicoseVeins,
  'vein-anatomy': veinAnatomy,
  'venous-reflux': venousReflux,
} as const;

export type IllustrationKey = keyof typeof ILLUSTRATIONS;
