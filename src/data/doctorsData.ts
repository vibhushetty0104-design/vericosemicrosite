export interface CredentialGlossaryItem {
  abbrev: string;
  fullName: string;
  description: string;
}

/**
 * General explanations of qualification types shown on demo profiles. These describe what a
 * qualification usually means; they do not state that any fictional doctor holds it.
 */
export const VASCULAR_CREDENTIALS_GLOSSARY: Record<string, CredentialGlossaryItem> = {
  'MCh': {
    abbrev: 'MCh (Vascular Surgery)',
    fullName: 'Master of Chirurgie in Peripheral Vascular Surgery',
    description: 'A super-specialty surgical qualification in India covering arterial and venous diseases.'
  },
  'DNB': {
    abbrev: 'DNB (Peripheral Vascular Surgery)',
    fullName: 'Diplomate of National Board in Peripheral Vascular Surgery',
    description: 'A super-specialty qualification in India covering open and catheter-based vascular procedures.'
  },
  'FVIR': {
    abbrev: 'FVIR',
    fullName: 'Fellowship in Vascular & Interventional Radiology',
    description: 'Post-doctoral training in catheter-directed and ultrasound-guided vascular procedures.'
  },
  'MS': {
    abbrev: 'MS (General Surgery)',
    fullName: 'Master of Surgery in General Surgery',
    description: 'A postgraduate surgical degree that is usually completed before super-specialty training.'
  }
};

/** Single wording for the fictional-record label, shown beside every demo doctor's name. */
export const DEMO_PROFILE_LABEL = 'Demo profile · fictional';

export interface DoctorProfile {
  id: string;
  name: string;
  credentials: string;
  title: string;
  specialty: 'Vascular Surgery' | 'Interventional Radiology' | 'Phlebology' | 'Venous Wound Care';
  yearsExperience: number;
  bio: string;
  city: 'Bengaluru' | 'Mumbai' | 'Delhi NCR' | 'Hyderabad' | 'Chennai';
  modalities: ('In-Person OPD' | 'Video Teleconsultation')[];
  nextAvailable: string;
  education: string;
  expertise: string[];
  languagesSpoken: string[];
  consultationFeeINR: number;
  insuranceNote: string;
  isSyntheticDemo: boolean;
  demoRecordNotice: string;
}

export const DOCTORS_DATA: DoctorProfile[] = [
  {
    id: 'dr-arvind-rao',
    name: 'Dr. Arvind Rao',
    credentials: 'MBBS, MS, MCh (Vascular Surgery) · Vascular ultrasound interpretation certificate (sample)',
    title: 'Senior Consultant Peripheral Vascular & Endovascular Surgeon',
    specialty: 'Vascular Surgery',
    yearsExperience: 17,
    bio: 'Fellowship-trained vascular surgeon specializing in day-care thermal ablation (EVLA/RFA), deep venous thrombosis management, and complex saphenofemoral junction incompetence.',
    city: 'Bengaluru',
    modalities: ['In-Person OPD', 'Video Teleconsultation'],
    nextAvailable: 'Tomorrow, 11:00 AM',
    education: 'Demo Medical College A, Bengaluru (fictional) · MCh, Demo Institute B (fictional)',
    expertise: ['Endovenous Laser Ablation (EVLA)', 'Standing Saphenous Reflux Mapping', 'Ambulatory Microphlebectomy'],
    languagesSpoken: ['English', 'Kannada', 'Hindi'],
    consultationFeeINR: 1200,
    insuranceNote: 'Sample insurer note (demo): cashless eligibility depends on the patient’s policy',
    isSyntheticDemo: true,
    demoRecordNotice: DEMO_PROFILE_LABEL
  },
  {
    id: 'dr-meera-nambiar',
    name: 'Dr. Meera Nambiar',
    credentials: 'MBBS, MD (Radiodiagnosis), FVIR',
    title: 'Lead Consultant Interventional Radiologist & Vein Specialist',
    specialty: 'Interventional Radiology',
    yearsExperience: 14,
    bio: 'Pioneer in non-tumescent, non-thermal adhesive vein closure (VenaSeal) and ultrasound-guided foam sclerotherapy for recurrent tributary and perforator varicosities.',
    city: 'Mumbai',
    modalities: ['In-Person OPD', 'Video Teleconsultation'],
    nextAvailable: 'Thursday, 02:30 PM',
    education: 'Demo Medical College C, Mumbai (fictional) · Fellowship, Demo Institute D (fictional)',
    expertise: ['VenaSeal Medical Adhesive', 'Ultrasound-Guided Foam Sclerotherapy', 'Pelvic Congestion Syndrome Embolization'],
    languagesSpoken: ['English', 'Hindi', 'Marathi'],
    consultationFeeINR: 1500,
    insuranceNote: 'Sample insurer note (demo): no empanelment is implied',
    isSyntheticDemo: true,
    demoRecordNotice: DEMO_PROFILE_LABEL
  },
  {
    id: 'dr-rajesh-kulkarni',
    name: 'Dr. Rajesh Kulkarni',
    credentials: 'MBBS, MS, DNB (Peripheral Vascular Surgery)',
    title: 'Chief Vascular Surgeon & Venous Hypertension Specialist',
    specialty: 'Vascular Surgery',
    yearsExperience: 19,
    bio: 'Dedicated to outpatient catheter treatments for chronic venous disease, post-thrombotic syndrome evaluation, and advanced perforator vein interruption.',
    city: 'Delhi NCR',
    modalities: ['In-Person OPD', 'Video Teleconsultation'],
    nextAvailable: 'Friday, 10:00 AM',
    education: 'Demo Medical College E, Delhi (fictional) · DNB (Peripheral Vascular Surgery)',
    expertise: ['Radiofrequency Ablation (RFA)', 'Perforator Vein Laser Ablation', 'Deep Venous Valve Assessment'],
    languagesSpoken: ['English', 'Hindi', 'Punjabi'],
    consultationFeeINR: 1400,
    insuranceNote: 'Sample insurer note (demo): government scheme eligibility isn’t modelled',
    isSyntheticDemo: true,
    demoRecordNotice: DEMO_PROFILE_LABEL
  },
  {
    id: 'dr-ananya-sen',
    name: 'Dr. Ananya Sen',
    credentials: 'MBBS, MS (Gen Surg) · Venous wound care training (sample)',
    title: 'Director of Advanced Venous Wound Care & Phlebology',
    specialty: 'Venous Wound Care',
    yearsExperience: 12,
    bio: 'Focuses on CEAP C4–C6 advanced venous insufficiency, lipodermatosclerosis, venous eczema, and active venous stasis ulcer healing using targeted compression and vein closure.',
    city: 'Hyderabad',
    modalities: ['In-Person OPD', 'Video Teleconsultation'],
    nextAvailable: 'Wednesday, 04:00 PM',
    education: 'Demo Medical College F, Hyderabad (fictional) · Fellowship, Demo Venous Society (fictional)',
    expertise: ['Venous Stasis Ulcer Healing', 'Multi-Layer Paste Bandage Systems', 'Cockett Perforator Vein Closure'],
    languagesSpoken: ['English', 'Telugu', 'Hindi'],
    consultationFeeINR: 1000,
    insuranceNote: 'Sample insurer note (demo): coverage depends on the patient’s policy',
    isSyntheticDemo: true,
    demoRecordNotice: DEMO_PROFILE_LABEL
  },
  {
    id: 'dr-karthik-raman',
    name: 'Dr. Karthik Raman',
    credentials: 'MBBS, MS (Gen Surg), Fellowship in Aesthetic Phlebology',
    title: 'Consultant Phlebologist & Aesthetic Vein Specialist',
    specialty: 'Phlebology',
    yearsExperience: 11,
    bio: 'Specialist in cosmetic and symptomatic spider vein mapping, high-magnification microsclerotherapy, and feeder reticular vein clearance.',
    city: 'Chennai',
    modalities: ['In-Person OPD', 'Video Teleconsultation'],
    nextAvailable: 'Saturday, 11:30 AM',
    education: 'Demo Medical College G, Chennai (fictional) · Aesthetic phlebology fellowship (sample)',
    expertise: ['Liquid Microsclerotherapy', 'Spider Vein Feeder Mapping', 'Surface Vascular Laser'],
    languagesSpoken: ['English', 'Tamil', 'Malayalam'],
    consultationFeeINR: 900,
    insuranceNote: 'Sample insurer note (demo): cosmetic treatment is usually self-pay',
    isSyntheticDemo: true,
    demoRecordNotice: DEMO_PROFILE_LABEL
  }
];
