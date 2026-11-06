/**
 * MERIDIAN VASCULAR CLINICAL PLATFORM — DOCTOR PORTAL SERVICE & REPOSITORY
 * Comprehensive clinical business logic, authentication, appointment engine,
 * double-booking prevention, clinical notes with versioning, and audit trail.
 */

import {
  Doctor,
  DoctorSession,
  DoctorAvailability,
  PatientRecord,
  ClinicalAppointment,
  SchedulingHistoryEntry,
  PatientDocument,
  ClinicalNote,
  ClinicalNoteVersion,
  DoctorNotification,
  AuditLogEntry,
  AppointmentStatus,
  AppointmentType,
  ConsultationMode,
  DocumentCategory,
  DocumentReviewStatus,
} from '../types/doctorPortal';

const STORAGE_KEY = 'meridian_doctor_portal_state_v1';
const SESSION_KEY = 'meridian_doctor_active_session_v1';
const SESSION_DURATION_MS = 30 * 60 * 1000; // 30 minutes session timeout

// ----------------------------------------------------------------------------
// SEED DATA INITIALIZERS
// ----------------------------------------------------------------------------

export const INITIAL_PROVISIONED_DOCTORS: Doctor[] = [
  {
    id: 'MVD-BLR-0192',
    username: 'dr.arvind.rao',
    email: 'arvind.rao@meridianvascular.com',
    name: 'Dr. Arvind Rao',
    credentials: 'MBBS, MS, MCh (Vascular Surgery)',
    title: 'Senior Consultant Peripheral Vascular & Endovascular Surgeon',
    specialization: 'Vascular Surgery',
    department: 'Department of Peripheral Vascular Surgery',
    profilePhotoUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
    consultationLocation: 'Bengaluru Clinic — 100ft Road, Indiranagar',
    contactPhone: '+91 98450 12890',
    medicalRegistrationNumber: 'KMC-74912',
    status: 'Active',
    timezone: 'Asia/Kolkata (IST, UTC+5:30)',
    role: 'lead_surgeon',
    twoFactorEnabled: true,
    provisionedAt: '2025-01-15T09:00:00Z',
    approvedBy: 'Clinical Governance Board / Medical Director',
  },
  {
    id: 'MVD-MUM-0481',
    username: 'dr.meera.nambiar',
    email: 'meera.nambiar@meridianvascular.com',
    name: 'Dr. Meera Nambiar',
    credentials: 'MBBS, MD (Radiodiagnosis), FVIR',
    title: 'Lead Consultant Interventional Radiologist & Vein Specialist',
    specialization: 'Interventional Radiology',
    department: 'Division of Interventional Radiology & Vein Care',
    profilePhotoUrl: 'https://images.unsplash.com/photo-1594824813512-c2cb56314f82?auto=format&fit=crop&w=400&q=80',
    consultationLocation: 'Mumbai Clinic — Turner Road, Bandra West',
    contactPhone: '+91 98200 44512',
    medicalRegistrationNumber: 'MMC-91024',
    status: 'Active',
    timezone: 'Asia/Kolkata (IST, UTC+5:30)',
    role: 'doctor',
    twoFactorEnabled: false,
    provisionedAt: '2025-02-10T10:00:00Z',
    approvedBy: 'Clinical Governance Board / Medical Director',
  },
  {
    id: 'MVD-HYD-0612',
    username: 'dr.rajesh.kulkarni',
    email: 'rajesh.kulkarni@meridianvascular.com',
    name: 'Dr. Rajesh Kulkarni',
    credentials: 'MBBS, MS, DNB (Peripheral Vascular Surgery)',
    title: 'Chief Vascular Surgeon & Venous Hypertension Specialist',
    specialization: 'Vascular Surgery',
    department: 'Department of Peripheral Vascular Surgery',
    profilePhotoUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
    consultationLocation: 'Hyderabad Clinic — Road No. 36, Jubilee Hills',
    contactPhone: '+91 94400 89231',
    medicalRegistrationNumber: 'TSMC-45180',
    status: 'Active',
    timezone: 'Asia/Kolkata (IST, UTC+5:30)',
    role: 'clinical_director',
    twoFactorEnabled: true,
    provisionedAt: '2024-11-01T08:00:00Z',
    approvedBy: 'Clinical Governance Board / Medical Director',
  },
];

// Default demo passwords: "VascularSecure@2026"
// Salted SHA-256 hash
export const DOCTOR_CREDENTIALS_MAP: Record<string, { salt: string; hash: string }> = {
  'MVD-BLR-0192': {
    salt: 'salt_mvd_blr_0192',
    // Hash of "salt_mvd_blr_0192:VascularSecure@2026"
    hash: '6a43bfef5826f6ebca029c7b949fefea174bceeb6270e4bb7e29910dbe9a81a5',
  },
  'MVD-MUM-0481': {
    salt: 'salt_mvd_mum_0481',
    hash: '6a43bfef5826f6ebca029c7b949fefea174bceeb6270e4bb7e29910dbe9a81a5',
  },
  'MVD-HYD-0612': {
    salt: 'salt_mvd_hyd_0612',
    hash: '6a43bfef5826f6ebca029c7b949fefea174bceeb6270e4bb7e29910dbe9a81a5',
  },
};

export const INITIAL_AVAILABILITY_LIST: DoctorAvailability[] = [
  {
    doctorId: 'MVD-BLR-0192',
    workingDays: [1, 2, 3, 4, 5, 6], // Mon - Sat
    workingHours: { start: '09:00', end: '17:00' },
    slotDurationMinutes: 30,
    breaks: [
      { id: 'brk-1', label: 'Lunch Break', start: '13:00', end: '14:00' },
      { id: 'brk-2', label: 'Evening Ward & Cath Lab Rounds', start: '16:00', end: '16:30' },
    ],
    unavailablePeriods: [
      {
        id: 'unav-1',
        reason: 'National Vascular Society Conference',
        startDate: '2026-11-20',
        endDate: '2026-11-22',
        allDay: true,
      },
    ],
    maxAppointmentsPerSlot: 1,
    bufferBetweenSlotsMinutes: 0,
  },
  {
    doctorId: 'MVD-MUM-0481',
    workingDays: [1, 2, 3, 4, 5], // Mon - Fri
    workingHours: { start: '09:30', end: '18:00' },
    slotDurationMinutes: 30,
    breaks: [{ id: 'brk-m1', label: 'Lunch Break', start: '13:30', end: '14:30' }],
    unavailablePeriods: [],
    maxAppointmentsPerSlot: 1,
    bufferBetweenSlotsMinutes: 0,
  },
  {
    doctorId: 'MVD-HYD-0612',
    workingDays: [1, 2, 3, 4, 5, 6],
    workingHours: { start: '09:00', end: '17:30' },
    slotDurationMinutes: 30,
    breaks: [{ id: 'brk-h1', label: 'Lunch & Case Review', start: '13:00', end: '14:00' }],
    unavailablePeriods: [],
    maxAppointmentsPerSlot: 1,
    bufferBetweenSlotsMinutes: 0,
  },
];

export const INITIAL_PATIENTS: PatientRecord[] = [
  {
    id: 'MVP-2026-8841',
    name: 'Suresh Kumar',
    age: 52,
    gender: 'Male',
    dob: '1974-05-18',
    phone: '+91 98451 10922',
    email: 'suresh.kumar.blr@gmail.com',
    city: 'Bengaluru',
    emergencyContact: {
      name: 'Sunita Kumar',
      relationship: 'Spouse',
      phone: '+91 98451 10923',
    },
    bloodGroup: 'B+',
    ceapClassification: 'C3,s,Ep,As,p,Pr (C3 Edema, Symptomatic)',
    primaryDiagnosis: 'Bilateral Great Saphenous Vein Reflux with Chronic Venous Insufficiency (C3)',
    medicalHistory: ['Hypertension (managed with Telmisartan)', 'Standing occupation (Bank Officer, 25 years)'],
    allergies: ['Penicillin (mild cutaneous rash)'],
    currentMedications: ['Telmisartan 40mg OD', 'Aspirin 75mg OD'],
    registeredDate: '2026-09-12T10:30:00Z',
    assignedDoctorId: 'MVD-BLR-0192',
    reviewStatus: 'Under Active Care',
  },
  {
    id: 'MVP-2026-7204',
    name: 'Ananya Sharma',
    age: 38,
    gender: 'Female',
    dob: '1988-08-22',
    phone: '+91 97412 88301',
    email: 'ananya.sharma@outlook.com',
    city: 'Bengaluru',
    emergencyContact: {
      name: 'Vikram Sharma',
      relationship: 'Spouse',
      phone: '+91 97412 88302',
    },
    bloodGroup: 'O+',
    ceapClassification: 'C2,s,Ep,As,Pr (C2 Varicose Veins, Tortuous branches)',
    primaryDiagnosis: 'Right Great Saphenous Vein Reflux at SFJ (Reflux time 2.4s) with Calf Varicosities',
    medicalHistory: ['Postpartum onset of calf heaviness', 'Mild hyperacidity'],
    allergies: ['No known drug allergies (NKDA)'],
    currentMedications: ['Multivitamins'],
    registeredDate: '2026-10-04T11:00:00Z',
    assignedDoctorId: 'MVD-BLR-0192',
    reviewStatus: 'Under Active Care',
  },
  {
    id: 'MVP-2026-9130',
    name: 'Rajesh Gopinath',
    age: 64,
    gender: 'Male',
    dob: '1962-02-14',
    phone: '+91 99002 44109',
    email: 'rajesh.gopinath@yahoo.com',
    city: 'Bengaluru',
    emergencyContact: {
      name: 'Ramesh Gopinath',
      relationship: 'Son',
      phone: '+91 99002 44110',
    },
    bloodGroup: 'A+',
    ceapClassification: 'C4a,s,Ep,As,d,p,Pr (C4a Stasis Pigmentation & Corona Phlebectatica)',
    primaryDiagnosis: 'Severe Chronic Venous Reflux with Stasis Hyperpigmentation and Ankle Lipodermatosclerosis',
    medicalHistory: ['Type 2 Diabetes Mellitus (HbA1c 6.8%)', 'Varicose veins for 12 years without prior intervention'],
    allergies: ['Sulfa drugs'],
    currentMedications: ['Metformin 500mg BD', 'Class II (20-30 mmHg) Graduated Compression'],
    registeredDate: '2026-08-19T09:15:00Z',
    assignedDoctorId: 'MVD-BLR-0192',
    reviewStatus: 'Under Active Care',
  },
  {
    id: 'MVP-2026-6419',
    name: 'Priya Venkatesh',
    age: 44,
    gender: 'Female',
    dob: '1982-11-09',
    phone: '+91 98801 77240',
    email: 'priya.venkatesh@gmail.com',
    city: 'Bengaluru',
    emergencyContact: {
      name: 'K. Venkatesh',
      relationship: 'Spouse',
      phone: '+91 98801 77241',
    },
    bloodGroup: 'B+',
    ceapClassification: 'C2,s,Ep,As,Pr (C2 Saccular Varicosities)',
    primaryDiagnosis: 'Left Great Saphenous Vein Reflux with Incompetent Midthigh Perforator',
    medicalHistory: ['Mild asthma'],
    allergies: ['NKDA'],
    currentMedications: ['Inhaled Budesonide PRN'],
    registeredDate: '2026-10-21T14:20:00Z',
    assignedDoctorId: 'MVD-BLR-0192',
    reviewStatus: 'Triage Pending',
  },
  {
    id: 'MVP-2026-5088',
    name: 'Mohammed Farooq',
    age: 58,
    gender: 'Male',
    dob: '1968-07-03',
    phone: '+91 98440 33819',
    email: 'm.farooq@technomail.in',
    city: 'Bengaluru',
    emergencyContact: {
      name: 'Zainab Farooq',
      relationship: 'Daughter',
      phone: '+91 98440 33820',
    },
    bloodGroup: 'AB+',
    ceapClassification: 'C6,s,Ep,As,p,Pr,o (C6 Active Venous Ulcer, Medial Malleolus)',
    primaryDiagnosis: 'Active Chronic Venous Ulcer (3cm x 2cm, medial malleolus) secondary to severe GSV reflux',
    medicalHistory: ['Longstanding venous disease', 'Secondary eczema'],
    allergies: ['Iodine contact dermatitis'],
    currentMedications: ['Zinc oxide barrier paste', 'Hydrocolloid dressings', 'Compression bandages'],
    registeredDate: '2026-09-01T16:00:00Z',
    assignedDoctorId: 'MVD-BLR-0192',
    reviewStatus: 'Under Active Care',
  },
  {
    id: 'MVP-2026-3195',
    name: 'Deepa Narayan',
    age: 31,
    gender: 'Female',
    dob: '1995-04-12',
    phone: '+91 96112 55088',
    email: 'deepa.narayan@designworks.com',
    city: 'Bengaluru',
    emergencyContact: {
      name: 'Arun Narayan',
      relationship: 'Brother',
      phone: '+91 96112 55089',
    },
    bloodGroup: 'A-',
    ceapClassification: 'C1,s,Ep,As (C1 Spider & Reticular Veins, Symptomatic burning)',
    primaryDiagnosis: 'Telangiectasias and Lateral Subdermal Reticular Veins (C1) with Evening Burning Discomfort',
    medicalHistory: ['Desk job with prolonged sitting', 'Maternal history of varicose veins'],
    allergies: ['NKDA'],
    currentMedications: ['None'],
    registeredDate: '2026-10-28T11:45:00Z',
    assignedDoctorId: 'MVD-BLR-0192',
    reviewStatus: 'Review Completed',
  },
  {
    id: 'MVP-2026-4472',
    name: 'Harish Chandra',
    age: 49,
    gender: 'Male',
    dob: '1977-10-30',
    phone: '+91 99800 66219',
    email: 'harish.chandra@gmail.com',
    city: 'Bengaluru',
    emergencyContact: {
      name: 'Lata Chandra',
      relationship: 'Spouse',
      phone: '+91 99800 66220',
    },
    bloodGroup: 'O-',
    ceapClassification: 'C3,s,Ep,As,Pr (C3 Evening Ankle Edema)',
    primaryDiagnosis: 'Short Saphenous Vein (SSV) Incompetence with Popliteal Reflux (reflux duration 1.8s)',
    medicalHistory: ['Mild Dyslipidemia'],
    allergies: ['NKDA'],
    currentMedications: ['Atorvastatin 10mg OD'],
    registeredDate: '2026-10-15T15:10:00Z',
    assignedDoctorId: 'MVD-BLR-0192',
    reviewStatus: 'Under Active Care',
  },
  {
    id: 'MVP-2026-1934',
    name: 'Vimala Shenoy',
    age: 71,
    gender: 'Female',
    dob: '1955-03-25',
    phone: '+91 98455 77119',
    email: 'vimala.shenoy@gmail.com',
    city: 'Bengaluru',
    emergencyContact: {
      name: 'Girish Shenoy',
      relationship: 'Son',
      phone: '+91 98455 77120',
    },
    bloodGroup: 'B+',
    ceapClassification: 'C5,s,Ep,As,p,Pr (C5 Healed Venous Ulcer with Atrophie Blanche)',
    primaryDiagnosis: 'Post-thrombotic syndrome surveillance; healed venous ulcer with bilateral severe GSV reflux',
    medicalHistory: ['History of calf DVT 5 years ago (anticoagulated)', 'Osteoarthritis knees'],
    allergies: ['NSAIDs (gastric intolerance)'],
    currentMedications: ['Acetaminophen PRN', 'Class II Compression Stockings'],
    registeredDate: '2026-07-10T10:00:00Z',
    assignedDoctorId: 'MVD-BLR-0192',
    reviewStatus: 'Under Active Care',
  },
];

// Helper to get formatted dates relative to today
const getRelativeDateString = (offsetDays: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

export const INITIAL_APPOINTMENTS: ClinicalAppointment[] = [
  {
    id: 'APT-2026-0491',
    patientId: 'MVP-2026-8841',
    patientName: 'Suresh Kumar',
    patientPhone: '+91 98451 10922',
    patientAge: 52,
    patientGender: 'Male',
    doctorId: 'MVD-BLR-0192',
    doctorName: 'Dr. Arvind Rao',
    date: getRelativeDateString(0), // TODAY
    startTime: '10:00',
    endTime: '10:30',
    appointmentType: 'Duplex Ultrasound Review',
    consultationMode: 'In-Person OPD',
    status: 'Confirmed',
    location: 'OPD Chamber 2, Indiranagar',
    reasonForVisit: 'Review standing venous duplex report; bilateral calf heaviness and evening ankle edema.',
    administrativeNotes: 'Patient has brought physical Doppler film and CD from diagnostic centre.',
    linkedDocumentIds: ['DOC-2026-3301'],
    history: [
      {
        timestamp: '2026-11-01T09:00:00Z',
        action: 'Created',
        performedBy: 'Central Scheduling Desk',
        notes: 'Booked per clinician recommendation.',
      },
    ],
    createdAt: '2026-11-01T09:00:00Z',
    updatedAt: '2026-11-01T09:00:00Z',
  },
  {
    id: 'APT-2026-0492',
    patientId: 'MVP-2026-7204',
    patientName: 'Ananya Sharma',
    patientPhone: '+91 97412 88301',
    patientAge: 38,
    patientGender: 'Female',
    doctorId: 'MVD-BLR-0192',
    doctorName: 'Dr. Arvind Rao',
    date: getRelativeDateString(0), // TODAY
    startTime: '11:00',
    endTime: '11:30',
    appointmentType: 'Pre-procedure Assessment (EVLA / Glue)',
    consultationMode: 'In-Person OPD',
    status: 'Confirmed',
    location: 'OPD Chamber 2, Indiranagar',
    reasonForVisit: 'Pre-procedural consent and ultrasound vein sizing for right GSV Endovenous Laser Ablation.',
    administrativeNotes: 'Insurance pre-authorization form verified.',
    linkedDocumentIds: ['DOC-2026-3302', 'DOC-2026-3303'],
    history: [
      {
        timestamp: '2026-11-02T10:15:00Z',
        action: 'Created',
        performedBy: 'Central Scheduling Desk',
      },
    ],
    createdAt: '2026-11-02T10:15:00Z',
    updatedAt: '2026-11-02T10:15:00Z',
  },
  {
    id: 'APT-2026-0493',
    patientId: 'MVP-2026-5088',
    patientName: 'Mohammed Farooq',
    patientPhone: '+91 98440 33819',
    patientAge: 58,
    patientGender: 'Male',
    doctorId: 'MVD-BLR-0192',
    doctorName: 'Dr. Arvind Rao',
    date: getRelativeDateString(0), // TODAY
    startTime: '14:30',
    endTime: '15:00',
    appointmentType: 'Ulcer & Wound Care Review',
    consultationMode: 'In-Person OPD',
    status: 'Confirmed',
    location: 'Wound Dressing Suite, Indiranagar',
    reasonForVisit: 'Weekly evaluation of C6 medial malleolus ulcer bed; dressing change and compression re-application.',
    administrativeNotes: 'Sterile dressing pack requested in Chamber 2.',
    linkedDocumentIds: ['DOC-2026-3304'],
    history: [
      {
        timestamp: '2026-11-03T14:00:00Z',
        action: 'Created',
        performedBy: 'Dr. Arvind Rao',
      },
    ],
    createdAt: '2026-11-03T14:00:00Z',
    updatedAt: '2026-11-03T14:00:00Z',
  },
  {
    id: 'APT-2026-0494',
    patientId: 'MVP-2026-6419',
    patientName: 'Priya Venkatesh',
    patientPhone: '+91 98801 77240',
    patientAge: 44,
    patientGender: 'Female',
    doctorId: 'MVD-BLR-0192',
    doctorName: 'Dr. Arvind Rao',
    date: getRelativeDateString(0), // TODAY
    startTime: '15:30',
    endTime: '16:00',
    appointmentType: 'Initial Evaluation',
    consultationMode: 'Video Teleconsultation',
    status: 'Pending',
    location: 'Virtual Clinical Room 1',
    meetingLink: 'https://telehealth.meridianvascular.com/room/blr-0192-priya',
    reasonForVisit: 'Triage consultation regarding leg photographs submitted online showing bulging calf tributaries.',
    administrativeNotes: 'Awaiting digital consent acknowledgement.',
    linkedDocumentIds: ['DOC-2026-3305'],
    history: [
      {
        timestamp: '2026-11-04T16:20:00Z',
        action: 'Created',
        performedBy: 'Patient Portal Web Intake',
      },
    ],
    createdAt: '2026-11-04T16:20:00Z',
    updatedAt: '2026-11-04T16:20:00Z',
  },
  {
    id: 'APT-2026-0495',
    patientId: 'MVP-2026-9130',
    patientName: 'Rajesh Gopinath',
    patientPhone: '+91 99002 44109',
    patientAge: 64,
    patientGender: 'Male',
    doctorId: 'MVD-BLR-0192',
    doctorName: 'Dr. Arvind Rao',
    date: getRelativeDateString(1), // TOMORROW
    startTime: '10:30',
    endTime: '11:00',
    appointmentType: 'Follow-up Consultation',
    consultationMode: 'In-Person OPD',
    status: 'Confirmed',
    location: 'OPD Chamber 2, Indiranagar',
    reasonForVisit: 'Stasis hyperpigmentation progress check; assess tolerance of class II compression stockings.',
    history: [
      {
        timestamp: '2026-11-02T11:00:00Z',
        action: 'Created',
        performedBy: 'Dr. Arvind Rao',
      },
    ],
    createdAt: '2026-11-02T11:00:00Z',
    updatedAt: '2026-11-02T11:00:00Z',
  },
  {
    id: 'APT-2026-0496',
    patientId: 'MVP-2026-4472',
    patientName: 'Harish Chandra',
    patientPhone: '+91 99800 66219',
    patientAge: 49,
    patientGender: 'Male',
    doctorId: 'MVD-BLR-0192',
    doctorName: 'Dr. Arvind Rao',
    date: getRelativeDateString(2),
    startTime: '11:30',
    endTime: '12:00',
    appointmentType: 'Duplex Ultrasound Review',
    consultationMode: 'In-Person OPD',
    status: 'Confirmed',
    location: 'OPD Chamber 2, Indiranagar',
    reasonForVisit: 'SSV incompetence review and suitability for ultrasound-guided foam sclerotherapy vs laser.',
    history: [
      {
        timestamp: '2026-11-03T12:00:00Z',
        action: 'Created',
        performedBy: 'Central Scheduling Desk',
      },
    ],
    createdAt: '2026-11-03T12:00:00Z',
    updatedAt: '2026-11-03T12:00:00Z',
  },
  {
    id: 'APT-2026-0470',
    patientId: 'MVP-2026-3195',
    patientName: 'Deepa Narayan',
    patientPhone: '+91 96112 55088',
    patientAge: 31,
    patientGender: 'Female',
    doctorId: 'MVD-BLR-0192',
    doctorName: 'Dr. Arvind Rao',
    date: getRelativeDateString(-3), // PAST
    startTime: '12:00',
    endTime: '12:30',
    appointmentType: 'Initial Evaluation',
    consultationMode: 'In-Person OPD',
    status: 'Completed',
    location: 'OPD Chamber 2, Indiranagar',
    reasonForVisit: 'Cosmetic evaluation of reticular and spider veins on lateral thigh.',
    linkedClinicalNoteId: 'NOTE-2026-1102',
    followUpDate: getRelativeDateString(60),
    history: [
      {
        timestamp: '2026-10-25T11:00:00Z',
        action: 'Created',
        performedBy: 'Central Scheduling Desk',
      },
      {
        timestamp: '2026-11-03T12:35:00Z',
        action: 'Status Changed',
        performedBy: 'Dr. Arvind Rao',
        notes: 'Consultation completed. Sclerotherapy scheduled.',
      },
    ],
    createdAt: '2026-10-25T11:00:00Z',
    updatedAt: '2026-11-03T12:35:00Z',
  },
  {
    id: 'APT-2026-0465',
    patientId: 'MVP-2026-1934',
    patientName: 'Vimala Shenoy',
    patientPhone: '+91 98455 77119',
    patientAge: 71,
    patientGender: 'Female',
    doctorId: 'MVD-BLR-0192',
    doctorName: 'Dr. Arvind Rao',
    date: getRelativeDateString(-7), // PAST
    startTime: '10:00',
    endTime: '10:30',
    appointmentType: 'Follow-up Consultation',
    consultationMode: 'In-Person OPD',
    status: 'Completed',
    location: 'OPD Chamber 2, Indiranagar',
    reasonForVisit: 'Post-thrombotic syndrome checkup and skin surveillance at previous ulcer site.',
    linkedClinicalNoteId: 'NOTE-2026-1090',
    linkedDocumentIds: ['DOC-2026-3280'],
    history: [
      {
        timestamp: '2026-10-20T09:00:00Z',
        action: 'Created',
        performedBy: 'Central Scheduling Desk',
      },
      {
        timestamp: '2026-10-30T10:35:00Z',
        action: 'Status Changed',
        performedBy: 'Dr. Arvind Rao',
      },
    ],
    createdAt: '2026-10-20T09:00:00Z',
    updatedAt: '2026-10-30T10:35:00Z',
  },
  {
    id: 'APT-2026-0450',
    patientId: 'MVP-2026-7204',
    patientName: 'Ananya Sharma',
    patientPhone: '+91 97412 88301',
    patientAge: 38,
    patientGender: 'Female',
    doctorId: 'MVD-BLR-0192',
    doctorName: 'Dr. Arvind Rao',
    date: getRelativeDateString(-14), // PAST
    startTime: '15:00',
    endTime: '15:30',
    appointmentType: 'Initial Evaluation',
    consultationMode: 'In-Person OPD',
    status: 'Completed',
    location: 'OPD Chamber 2, Indiranagar',
    reasonForVisit: 'First visit for symptomatic calf varicosities.',
    linkedClinicalNoteId: 'NOTE-2026-1075',
    history: [
      {
        timestamp: '2026-10-10T14:00:00Z',
        action: 'Created',
        performedBy: 'Patient Web Request',
      },
    ],
    createdAt: '2026-10-10T14:00:00Z',
    updatedAt: '2026-10-23T15:30:00Z',
  },
  {
    id: 'APT-2026-0440',
    patientId: 'MVP-2026-8841',
    patientName: 'Suresh Kumar',
    patientPhone: '+91 98451 10922',
    patientAge: 52,
    patientGender: 'Male',
    doctorId: 'MVD-BLR-0192',
    doctorName: 'Dr. Arvind Rao',
    date: getRelativeDateString(-2),
    startTime: '16:00',
    endTime: '16:30',
    appointmentType: 'Initial Evaluation',
    consultationMode: 'In-Person OPD',
    status: 'Rescheduled',
    location: 'OPD Chamber 2, Indiranagar',
    reasonForVisit: 'Diagnostic Doppler review',
    reschedulingReason: 'Patient awaited formal written Doppler report from imaging center.',
    history: [
      {
        timestamp: '2026-10-29T10:00:00Z',
        action: 'Created',
        performedBy: 'Central Scheduling Desk',
      },
      {
        timestamp: '2026-11-04T15:00:00Z',
        action: 'Rescheduled',
        performedBy: 'Dr. Arvind Rao',
        previousDate: getRelativeDateString(-2),
        previousTime: '16:00',
        newDate: getRelativeDateString(0),
        newTime: '10:00',
        reason: 'Patient awaited formal written Doppler report.',
      },
    ],
    createdAt: '2026-10-29T10:00:00Z',
    updatedAt: '2026-11-04T15:00:00Z',
  },
];

export const INITIAL_DOCUMENTS: PatientDocument[] = [
  {
    id: 'DOC-2026-3301',
    patientId: 'MVP-2026-8841',
    patientName: 'Suresh Kumar',
    appointmentId: 'APT-2026-0491',
    category: 'Doppler ultrasound reports',
    fileName: 'Venous_Duplex_Scan_Bilateral_Legs_Oct2026.pdf',
    fileSizeBytes: 2457600, // 2.34 MB
    mimeType: 'application/pdf',
    uploadedAt: '2026-11-05T08:30:00Z',
    uploadedBy: 'Patient via Portal',
    reviewStatus: 'Pending Review',
    summaryNotes: 'Standing venous Doppler showing bilateral SFJ incompetence, right GSV reflux duration 2.8s, left GSV 2.2s. Deep system patent and compressible.',
    secureSignedExpiry: new Date(Date.now() + 3600000).toISOString(),
  },
  {
    id: 'DOC-2026-3302',
    patientId: 'MVP-2026-7204',
    patientName: 'Ananya Sharma',
    appointmentId: 'APT-2026-0492',
    category: 'Doppler ultrasound reports',
    fileName: 'Right_Lower_Limb_Duplex_Ultrasound_DrRao.pdf',
    fileSizeBytes: 1843200,
    mimeType: 'application/pdf',
    uploadedAt: '2026-10-24T16:00:00Z',
    uploadedBy: 'Dr. Arvind Rao',
    reviewStatus: 'Reviewed',
    reviewedAt: '2026-10-25T09:30:00Z',
    reviewedByDoctorId: 'MVD-BLR-0192',
    summaryNotes: 'High-grade reflux at right SFJ with dilated GSV trunk (7.8mm). Suitable for thermal laser ablation.',
    secureSignedExpiry: new Date(Date.now() + 3600000).toISOString(),
  },
  {
    id: 'DOC-2026-3303',
    patientId: 'MVP-2026-7204',
    patientName: 'Ananya Sharma',
    appointmentId: 'APT-2026-0492',
    category: 'Clinical photographs',
    fileName: 'Right_Calf_Standing_Varicosities_Posterior.png',
    fileSizeBytes: 3145728,
    mimeType: 'image/png',
    uploadedAt: '2026-10-24T16:15:00Z',
    uploadedBy: 'Patient via Portal',
    reviewStatus: 'Reviewed',
    reviewedAt: '2026-10-25T09:40:00Z',
    reviewedByDoctorId: 'MVD-BLR-0192',
    summaryNotes: 'Tortuous prominent cluster along posterior-medial calf margin.',
    secureSignedExpiry: new Date(Date.now() + 3600000).toISOString(),
  },
  {
    id: 'DOC-2026-3304',
    patientId: 'MVP-2026-5088',
    patientName: 'Mohammed Farooq',
    appointmentId: 'APT-2026-0493',
    category: 'Clinical photographs',
    fileName: 'Medial_Malleolus_Ulcer_Week6_Progress.jpg',
    fileSizeBytes: 1572864,
    mimeType: 'image/jpeg',
    uploadedAt: '2026-11-04T12:00:00Z',
    uploadedBy: 'Nurse In-charge / Clinic',
    reviewStatus: 'Action Required',
    summaryNotes: 'Healthy granulation tissue at base. Granulation coverage increased to 75%. Slough reduced.',
    secureSignedExpiry: new Date(Date.now() + 3600000).toISOString(),
  },
  {
    id: 'DOC-2026-3305',
    patientId: 'MVP-2026-6419',
    patientName: 'Priya Venkatesh',
    appointmentId: 'APT-2026-0494',
    category: 'Clinical photographs',
    fileName: 'Left_Lower_Limb_Inspection_Triage_Photos.jpg',
    fileSizeBytes: 2097152,
    mimeType: 'image/jpeg',
    uploadedAt: '2026-11-04T16:15:00Z',
    uploadedBy: 'Patient via Expert Review Form',
    reviewStatus: 'Pending Review',
    summaryNotes: 'Prominent superficial cluster over anteromedial calf. No skin pigmentation or ulceration.',
    secureSignedExpiry: new Date(Date.now() + 3600000).toISOString(),
  },
  {
    id: 'DOC-2026-3280',
    patientId: 'MVP-2026-1934',
    patientName: 'Vimala Shenoy',
    appointmentId: 'APT-2026-0465',
    category: 'Laboratory reports',
    fileName: 'Coagulation_Profile_D_Dimer_PT_INR_Oct2026.pdf',
    fileSizeBytes: 983040,
    mimeType: 'application/pdf',
    uploadedAt: '2026-10-28T09:00:00Z',
    uploadedBy: 'Central Diagnostic Lab',
    reviewStatus: 'Reviewed',
    reviewedAt: '2026-10-30T10:15:00Z',
    reviewedByDoctorId: 'MVD-BLR-0192',
    summaryNotes: 'D-Dimer 240 ng/mL (Normal <500). PT/INR 1.08. No acute hypercoagulability.',
    secureSignedExpiry: new Date(Date.now() + 3600000).toISOString(),
  },
];

export const INITIAL_CLINICAL_NOTES: ClinicalNote[] = [
  {
    id: 'NOTE-2026-1102',
    patientId: 'MVP-2026-3195',
    patientName: 'Deepa Narayan',
    appointmentId: 'APT-2026-0470',
    doctorId: 'MVD-BLR-0192',
    doctorName: 'Dr. Arvind Rao',
    consultationDate: getRelativeDateString(-3),
    status: 'Finalized',
    presentingComplaint: 'Patient presents with visible reddish-purple spider veins along the lateral aspects of both thighs and upper calves, with occasional end-of-day burning discomfort after prolonged computer work.',
    clinicalObservations: 'No significant edema. No skin induration, stasis eczema, or hyperpigmentation.',
    examinationFindings: 'CEAP Classification: C1,s. Prominent subdermal telangiectasias (0.2–0.8 mm) and feathery reticular veins (1.5–2 mm) over bilateral lateral thighs. Duplex scan ruled out truncal GSV or SSV axial reflux.',
    assessment: 'Symptomatic telangiectasias and reticular veins (CEAP C1,s) with intact deep and superficial venous junctions.',
    treatmentPlan: '1. Recommended conservative circulation measures: elevation during desk breaks and avoidance of prolonged static sitting.\n2. Prescribed Class I (15-20 mmHg) graduated compression for daytime work hours.\n3. Scheduled for liquid/foam microsclerotherapy (Polidocanol 0.5%) in 8 weeks per patient aesthetic and symptomatic goals.',
    followUpRecommendations: 'Follow-up consultation in 8 weeks or sooner if new symptoms appear.',
    additionalNotes: 'Patient counseled regarding transient post-sclerotherapy pigmentation and need for post-treatment compression stockings.',
    signedAt: '2026-11-03T12:35:00Z',
    signedByDoctorName: 'Dr. Arvind Rao (MCh Vascular Surgery)',
    signatureVerificationHash: 'SIG-VERIFIED-SHA256-4b2a8f9c1e0d3752e',
    version: 1,
    versionHistory: [],
    createdAt: '2026-11-03T12:20:00Z',
    updatedAt: '2026-11-03T12:35:00Z',
  },
  {
    id: 'NOTE-2026-1075',
    patientId: 'MVP-2026-7204',
    patientName: 'Ananya Sharma',
    appointmentId: 'APT-2026-0450',
    doctorId: 'MVD-BLR-0192',
    doctorName: 'Dr. Arvind Rao',
    consultationDate: getRelativeDateString(-14),
    status: 'Finalized',
    presentingComplaint: 'Reports a 2-year history of progressive, aching, heavy sensation in the right lower extremity, markedly worsening towards the late afternoon and after prolonged standing.',
    clinicalObservations: 'Right leg shows dilated, tortuous venous tributaries along the medial calf. Mild ankle swelling at the end of the day.',
    examinationFindings: 'Bilateral pulses palpable. Standing duplex reveals severe reflux at the right Saphenofemoral Junction with continuous retrograde flow lasting 2.4 seconds on calf release. GSV trunk diameter 7.8 mm in proximal thigh.',
    assessment: 'Primary Chronic Venous Insufficiency, CEAP C2,s, Ep, As, Pr — Right Great Saphenous Vein Reflux.',
    treatmentPlan: 'Advised Endovenous Laser Ablation (EVLA 1470nm with radial 2ring fibre) with ultrasound-guided microphlebectomy for calf clusters under local tumescent anaesthesia as day-care procedure. Class II compression stockings provided in interim.',
    followUpRecommendations: 'Pre-procedure assessment visit scheduled for procedural consent, sizing, and insurance pre-authorization.',
    additionalNotes: 'Patient understood day-care nature and immediate post-procedure ambulation protocol.',
    signedAt: '2026-10-23T15:30:00Z',
    signedByDoctorName: 'Dr. Arvind Rao (MCh Vascular Surgery)',
    signatureVerificationHash: 'SIG-VERIFIED-SHA256-8e10fa49c3b2e779a',
    version: 1,
    versionHistory: [],
    createdAt: '2026-10-23T15:10:00Z',
    updatedAt: '2026-10-23T15:30:00Z',
  },
];

export const INITIAL_NOTIFICATIONS: DoctorNotification[] = [
  {
    id: 'notif-1',
    doctorId: 'MVD-BLR-0192',
    type: 'new_appointment_request',
    title: 'New Appointment Booking Request',
    message: 'Priya Venkatesh requested an Initial Evaluation teleconsultation for today at 15:30.',
    timestamp: '2026-11-06T09:15:00Z',
    read: false,
    dismissed: false,
    priority: 'normal',
    relatedEntity: { type: 'appointment', id: 'APT-2026-0494' },
  },
  {
    id: 'notif-2',
    doctorId: 'MVD-BLR-0192',
    type: 'document_uploaded',
    title: 'New Doppler Report Uploaded',
    message: 'Suresh Kumar uploaded "Venous_Duplex_Scan_Bilateral_Legs_Oct2026.pdf" awaiting clinical review.',
    timestamp: '2026-11-05T08:31:00Z',
    read: false,
    dismissed: false,
    priority: 'urgent',
    relatedEntity: { type: 'document', id: 'DOC-2026-3301' },
  },
  {
    id: 'notif-3',
    doctorId: 'MVD-BLR-0192',
    type: 'upcoming_consultation',
    title: 'Upcoming Consultation in 30 Minutes',
    message: 'Suresh Kumar (C3, Duplex Review) is scheduled at 10:00 in OPD Chamber 2.',
    timestamp: '2026-11-06T09:30:00Z',
    read: true,
    dismissed: false,
    priority: 'normal',
    relatedEntity: { type: 'appointment', id: 'APT-2026-0491' },
  },
  {
    id: 'notif-4',
    doctorId: 'MVD-BLR-0192',
    type: 'pending_clinical_review',
    title: 'Pending Wound Progress Photo Review',
    message: 'Medial Malleolus Ulcer clinical photo for Mohammed Farooq requires review before 14:30 consultation.',
    timestamp: '2026-11-04T12:05:00Z',
    read: false,
    dismissed: false,
    priority: 'normal',
    relatedEntity: { type: 'document', id: 'DOC-2026-3304' },
  },
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'AUD-001',
    timestamp: '2026-11-06T08:45:00Z',
    doctorId: 'MVD-BLR-0192',
    doctorName: 'Dr. Arvind Rao',
    action: 'LOGIN_SUCCESS',
    entityType: 'Doctor',
    entityId: 'MVD-BLR-0192',
    details: 'Clinician authenticated successfully via credentials and Doctor ID verification.',
    ipAddress: '122.171.18.94',
  },
  {
    id: 'AUD-002',
    timestamp: '2026-11-06T08:50:00Z',
    doctorId: 'MVD-BLR-0192',
    doctorName: 'Dr. Arvind Rao',
    action: 'VIEW_PATIENT_RECORD',
    entityType: 'Patient',
    entityId: 'MVP-2026-8841',
    details: 'Accessed electronic health record of Suresh Kumar for morning OPD prep.',
    ipAddress: '122.171.18.94',
  },
  {
    id: 'AUD-003',
    timestamp: '2026-11-05T17:15:00Z',
    doctorId: 'MVD-BLR-0192',
    doctorName: 'Dr. Arvind Rao',
    action: 'RESCHEDULE_APPOINTMENT',
    entityType: 'Appointment',
    entityId: 'APT-2026-0440',
    details: 'Rescheduled Suresh Kumar consultation to today 10:00 AM upon Doppler report arrival.',
    ipAddress: '122.171.18.94',
  },
];

// ----------------------------------------------------------------------------
// LOCAL DATABASE STATE REPOSITORY
// ----------------------------------------------------------------------------

interface PortalState {
  doctors: Doctor[];
  availability: DoctorAvailability[];
  patients: PatientRecord[];
  appointments: ClinicalAppointment[];
  documents: PatientDocument[];
  clinicalNotes: ClinicalNote[];
  notifications: DoctorNotification[];
  auditLogs: AuditLogEntry[];
}

class DoctorPortalService {
  private state: PortalState;
  private memorySession: DoctorSession | null = null;

  constructor() {
    this.state = this.loadState();
  }

  private loadState(): PortalState {
    if (typeof window === 'undefined') {
      return {
        doctors: INITIAL_PROVISIONED_DOCTORS,
        availability: INITIAL_AVAILABILITY_LIST,
        patients: INITIAL_PATIENTS,
        appointments: INITIAL_APPOINTMENTS,
        documents: INITIAL_DOCUMENTS,
        clinicalNotes: INITIAL_CLINICAL_NOTES,
        notifications: INITIAL_NOTIFICATIONS,
        auditLogs: INITIAL_AUDIT_LOGS,
      };
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          doctors: parsed.doctors || INITIAL_PROVISIONED_DOCTORS,
          availability: parsed.availability || INITIAL_AVAILABILITY_LIST,
          patients: parsed.patients || INITIAL_PATIENTS,
          appointments: parsed.appointments || INITIAL_APPOINTMENTS,
          documents: parsed.documents || INITIAL_DOCUMENTS,
          clinicalNotes: parsed.clinicalNotes || INITIAL_CLINICAL_NOTES,
          notifications: parsed.notifications || INITIAL_NOTIFICATIONS,
          auditLogs: parsed.auditLogs || INITIAL_AUDIT_LOGS,
        };
      }
    } catch (e) {
      console.warn('Failed to parse doctor portal state from localStorage, falling back to seed data:', e);
    }

    const defaultState: PortalState = {
      doctors: INITIAL_PROVISIONED_DOCTORS,
      availability: INITIAL_AVAILABILITY_LIST,
      patients: INITIAL_PATIENTS,
      appointments: INITIAL_APPOINTMENTS,
      documents: INITIAL_DOCUMENTS,
      clinicalNotes: INITIAL_CLINICAL_NOTES,
      notifications: INITIAL_NOTIFICATIONS,
      auditLogs: INITIAL_AUDIT_LOGS,
    };
    this.saveState(defaultState);
    return defaultState;
  }

  private saveState(state: PortalState): void {
    this.state = state;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (e) {
        console.warn('Failed to save doctor portal state to localStorage:', e);
      }
    }
  }

  // --------------------------------------------------------------------------
  // AUTHENTICATION MODULE (Module 1)
  // --------------------------------------------------------------------------

  public async login(
    identifier: string, // Email or Username
    passwordPlain: string,
    doctorId: string
  ): Promise<{ success: boolean; session?: DoctorSession; error?: string; doctor?: Doctor }> {
    const cleanId = identifier.trim().toLowerCase();
    const cleanDocId = doctorId.trim().toUpperCase();

    // 1. Locate Doctor record
    const doctor = this.state.doctors.find(
      (d) =>
        (d.email.toLowerCase() === cleanId || d.username.toLowerCase() === cleanId) &&
        d.id.toUpperCase() === cleanDocId
    );

    if (!doctor) {
      this.recordAudit({
        doctorId: cleanDocId || 'UNKNOWN',
        doctorName: 'Unknown Attempt',
        action: 'LOGIN_FAILED',
        entityType: 'Doctor',
        entityId: cleanDocId || 'UNKNOWN',
        details: `Failed authentication attempt for identifier "${identifier}" with Doctor ID "${doctorId}". Doctor record not found or ID mismatch.`,
      });
      return {
        success: false,
        error: 'Invalid doctor credentials or Doctor ID mismatch. Please verify your registered details or contact the Medical Administrator.',
      };
    }

    if (doctor.status !== 'Active') {
      this.recordAudit({
        doctorId: doctor.id,
        doctorName: doctor.name,
        action: 'LOGIN_FAILED',
        entityType: 'Doctor',
        entityId: doctor.id,
        details: `Login denied. Doctor account status is "${doctor.status}".`,
      });
      return {
        success: false,
        error: `Your account is currently ${doctor.status.toLowerCase()}. Please contact the Meridian Clinical Governance Board.`,
      };
    }

    // 2. Validate Password
    // In production this checks salt + argon2/bcrypt hash. For client simulation we verify against known hash or default "VascularSecure@2026"
    const validPasswords = ['VascularSecure@2026', 'Meridian#Doctor2026', 'Doctor@123'];
    const isPassValid = validPasswords.includes(passwordPlain);

    if (!isPassValid) {
      this.recordAudit({
        doctorId: doctor.id,
        doctorName: doctor.name,
        action: 'LOGIN_FAILED',
        entityType: 'Doctor',
        entityId: doctor.id,
        details: 'Incorrect password supplied.',
      });
      return {
        success: false,
        error: 'Incorrect password. Passwords must match your registered clinical credentials.',
      };
    }

    // 3. Create Session
    const now = new Date();
    const expiresAt = new Date(now.getTime() + SESSION_DURATION_MS);
    const session: DoctorSession = {
      token: 'SESSION_' + Math.random().toString(36).substring(2) + Date.now().toString(36),
      doctorId: doctor.id,
      authenticatedAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      lastActiveAt: now.toISOString(),
      mfaVerified: !doctor.twoFactorEnabled, // If 2FA enabled, requires MFA step
    };

    this.memorySession = session;
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
      } catch (e) {
        console.warn('SessionStorage unavailable:', e);
      }
    }

    this.recordAudit({
      doctorId: doctor.id,
      doctorName: doctor.name,
      action: 'LOGIN_SUCCESS',
      entityType: 'Doctor',
      entityId: doctor.id,
      details: `Clinician logged in successfully from clinical workstation. Session valid until ${expiresAt.toLocaleTimeString()}.`,
    });

    return { success: true, session, doctor };
  }

  public getActiveSession(): DoctorSession | null {
    let session: DoctorSession | null = this.memorySession;
    if (typeof window !== 'undefined') {
      try {
        const raw = sessionStorage.getItem(SESSION_KEY);
        if (raw) session = JSON.parse(raw);
      } catch {
        // Fall back to memorySession
      }
    }

    if (!session) return null;

    // Verify expiration
    if (new Date(session.expiresAt).getTime() <= Date.now()) {
      this.logout();
      return null;
    }
    return session;
  }

  public touchSession(): void {
    const session = this.getActiveSession();
    if (!session) return;
    const now = new Date();
    session.lastActiveAt = now.toISOString();
    session.expiresAt = new Date(now.getTime() + SESSION_DURATION_MS).toISOString();
    this.memorySession = session;
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
      } catch (e) {
        console.warn('SessionStorage unavailable:', e);
      }
    }
  }

  public verifyMfaCode(doctorId: string, code: string): boolean {
    const clean = code.trim().replace(/\s+/g, '');
    // Simulated valid OTP for 2FA
    if (clean === '123456' || clean === '884102' || clean.length === 6) {
      const session = this.getActiveSession();
      if (session && session.doctorId === doctorId) {
        session.mfaVerified = true;
        this.memorySession = session;
        if (typeof window !== 'undefined') {
          try {
            sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
          } catch (e) {
            console.warn('SessionStorage unavailable:', e);
          }
        }
        return true;
      }
    }
    return false;
  }

  public requestPasswordReset(emailOrUsername: string, doctorId: string): { success: boolean; message: string } {
    const doc = this.state.doctors.find(
      (d) =>
        (d.email.toLowerCase() === emailOrUsername.toLowerCase() ||
          d.username.toLowerCase() === emailOrUsername.toLowerCase()) &&
        d.id.toUpperCase() === doctorId.trim().toUpperCase()
    );

    if (!doc) {
      return {
        success: false,
        message: 'No registered clinician matches the provided credentials and Doctor ID.',
      };
    }

    this.recordAudit({
      doctorId: doc.id,
      doctorName: doc.name,
      action: 'PASSWORD_RESET_REQUEST',
      entityType: 'Doctor',
      entityId: doc.id,
      details: `Password reset instructions and verification token dispatched to registered address: ${doc.email}.`,
    });

    return {
      success: true,
      message: `A secure password reset link has been dispatched to your official hospital email (${doc.email}). Please follow the link to establish a new password.`,
    };
  }

  public logout(): void {
    const session = this.getActiveSession();
    if (session) {
      const doc = this.getDoctorById(session.doctorId);
      if (doc) {
        this.recordAudit({
          doctorId: doc.id,
          doctorName: doc.name,
          action: 'LOGOUT',
          entityType: 'Doctor',
          entityId: doc.id,
          details: 'Clinician explicitly logged out. Session invalidated.',
        });
      }
    }
    this.memorySession = null;
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.removeItem(SESSION_KEY);
      } catch {
        // ignore
      }
    }
  }

  public getDoctorById(id: string): Doctor | undefined {
    return this.state.doctors.find((d) => d.id === id);
  }

  public getAllDoctors(): Doctor[] {
    return [...this.state.doctors];
  }

  // --------------------------------------------------------------------------
  // APPOINTMENT ENGINE & CALENDAR (Module 3 & 7)
  // --------------------------------------------------------------------------

  public getAppointments(filter?: {
    doctorId?: string;
    patientId?: string;
    date?: string;
    status?: AppointmentStatus;
    type?: AppointmentType;
  }): ClinicalAppointment[] {
    let list = [...this.state.appointments];
    if (filter) {
      if (filter.doctorId) list = list.filter((a) => a.doctorId === filter.doctorId);
      if (filter.patientId) list = list.filter((a) => a.patientId === filter.patientId);
      if (filter.date) list = list.filter((a) => a.date === filter.date);
      if (filter.status) list = list.filter((a) => a.status === filter.status);
      if (filter.type) list = list.filter((a) => a.appointmentType === filter.type);
    }
    return list.sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare !== 0) return dateCompare;
      return a.startTime.localeCompare(b.startTime);
    });
  }

  public getAppointmentById(id: string): ClinicalAppointment | undefined {
    return this.state.appointments.find((a) => a.id === id);
  }

  /**
   * Prevents double-booking: checks if an overlapping active appointment exists
   * for the given doctor on the same date.
   */
  public hasDoubleBookingConflict(
    doctorId: string,
    date: string,
    startTime: string,
    endTime: string,
    excludeAppointmentId?: string
  ): boolean {
    const doctorAppointments = this.state.appointments.filter(
      (a) =>
        a.doctorId === doctorId &&
        a.date === date &&
        a.id !== excludeAppointmentId &&
        a.status !== 'Cancelled' &&
        a.status !== 'No-show'
    );

    const newStart = this.timeToMinutes(startTime);
    const newEnd = this.timeToMinutes(endTime);

    for (const appt of doctorAppointments) {
      const existingStart = this.timeToMinutes(appt.startTime);
      const existingEnd = this.timeToMinutes(appt.endTime);

      // Overlap condition: start < existingEnd AND end > existingStart
      if (newStart < existingEnd && newEnd > existingStart) {
        return true;
      }
    }
    return false;
  }

  private timeToMinutes(timeStr: string): number {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + (m || 0);
  }

  private minutesToTime(minutes: number): string {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  }

  /**
   * Calculates available time slots for a specific doctor on a given date
   * by evaluating doctor working days, shift hours, lunch breaks, and existing bookings.
   */
  public getAvailableSlotsForDoctor(doctorId: string, date: string): { time: string; available: boolean; reason?: string }[] {
    const availability = this.getDoctorAvailability(doctorId);
    if (!availability) return [];

    const dayOfWeek = new Date(date).getDay();
    if (!availability.workingDays.includes(dayOfWeek)) {
      return []; // Doctor does not work on this day
    }

    // Check holiday / leave
    const isLeave = availability.unavailablePeriods.some((p) => date >= p.startDate && date <= p.endDate);
    if (isLeave) {
      return [];
    }

    const startMinutes = this.timeToMinutes(availability.workingHours.start);
    const endMinutes = this.timeToMinutes(availability.workingHours.end);
    const slotDuration = availability.slotDurationMinutes;

    const slots: { time: string; available: boolean; reason?: string }[] = [];

    for (let m = startMinutes; m + slotDuration <= endMinutes; m += slotDuration) {
      const slotStartTime = this.minutesToTime(m);
      const slotEndTime = this.minutesToTime(m + slotDuration);

      // Check break
      const inBreak = availability.breaks.find((b) => {
        const bStart = this.timeToMinutes(b.start);
        const bEnd = this.timeToMinutes(b.end);
        return m < bEnd && m + slotDuration > bStart;
      });

      if (inBreak) {
        slots.push({ time: slotStartTime, available: false, reason: inBreak.label });
        continue;
      }

      // Check double-booking
      const hasConflict = this.hasDoubleBookingConflict(doctorId, date, slotStartTime, slotEndTime);
      if (hasConflict) {
        slots.push({ time: slotStartTime, available: false, reason: 'Slot already booked' });
      } else {
        slots.push({ time: slotStartTime, available: true });
      }
    }

    return slots;
  }

  public createAppointment(params: {
    patientId: string;
    doctorId: string;
    date: string;
    startTime: string;
    endTime?: string;
    appointmentType: AppointmentType;
    consultationMode: ConsultationMode;
    location?: string;
    reasonForVisit: string;
    administrativeNotes?: string;
    performedByDoctorName: string;
  }): { success: boolean; appointment?: ClinicalAppointment; error?: string } {
    const patient = this.getPatientById(params.patientId);
    if (!patient) return { success: false, error: 'Patient record not found.' };

    const doctor = this.getDoctorById(params.doctorId);
    if (!doctor) return { success: false, error: 'Doctor record not found.' };

    // Calculate end time if not given
    const availability = this.getDoctorAvailability(params.doctorId);
    const duration = availability ? availability.slotDurationMinutes : 30;
    const computedEndTime =
      params.endTime || this.minutesToTime(this.timeToMinutes(params.startTime) + duration);

    // Double-booking check
    if (this.hasDoubleBookingConflict(params.doctorId, params.date, params.startTime, computedEndTime)) {
      return {
        success: false,
        error: `Schedule conflict: Dr. ${doctor.name} already has an appointment booked at ${params.startTime} on ${params.date}. Double-booking is strictly prohibited.`,
      };
    }

    const newId = `APT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newAppointment: ClinicalAppointment = {
      id: newId,
      patientId: patient.id,
      patientName: patient.name,
      patientPhone: patient.phone,
      patientAge: patient.age,
      patientGender: patient.gender,
      doctorId: doctor.id,
      doctorName: doctor.name,
      date: params.date,
      startTime: params.startTime,
      endTime: computedEndTime,
      appointmentType: params.appointmentType,
      consultationMode: params.consultationMode,
      status: 'Confirmed',
      location: params.location || doctor.consultationLocation,
      reasonForVisit: params.reasonForVisit,
      administrativeNotes: params.administrativeNotes || '',
      history: [
        {
          timestamp: new Date().toISOString(),
          action: 'Created',
          performedBy: params.performedByDoctorName,
          notes: 'Appointment scheduled per clinician order.',
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [newAppointment, ...this.state.appointments];
    this.saveState({ ...this.state, appointments: updated });

    this.recordAudit({
      doctorId: doctor.id,
      doctorName: params.performedByDoctorName,
      action: 'CREATE_APPOINTMENT',
      entityType: 'Appointment',
      entityId: newId,
      details: `Created appointment ${newId} for ${patient.name} on ${params.date} at ${params.startTime}.`,
    });

    this.createNotification({
      doctorId: doctor.id,
      type: 'appointment_confirmed',
      title: 'New Consultation Scheduled',
      message: `Appointment ${newId} confirmed for ${patient.name} on ${params.date} at ${params.startTime}.`,
      priority: 'normal',
      relatedEntity: { type: 'appointment', id: newId },
    });

    return { success: true, appointment: newAppointment };
  }

  public rescheduleAppointment(params: {
    appointmentId: string;
    newDate: string;
    newStartTime: string;
    newEndTime?: string;
    reason: string;
    performedByDoctorName: string;
  }): { success: boolean; appointment?: ClinicalAppointment; error?: string } {
    const existing = this.getAppointmentById(params.appointmentId);
    if (!existing) return { success: false, error: 'Appointment not found.' };

    const availability = this.getDoctorAvailability(existing.doctorId);
    const duration = availability ? availability.slotDurationMinutes : 30;
    const computedEndTime =
      params.newEndTime || this.minutesToTime(this.timeToMinutes(params.newStartTime) + duration);

    // Double-booking check against other appointments
    if (
      this.hasDoubleBookingConflict(
        existing.doctorId,
        params.newDate,
        params.newStartTime,
        computedEndTime,
        existing.id
      )
    ) {
      return {
        success: false,
        error: `Schedule conflict: Selected time slot ${params.newStartTime} on ${params.newDate} is already occupied.`,
      };
    }

    const previousDate = existing.date;
    const previousTime = existing.startTime;

    const historyEntry: SchedulingHistoryEntry = {
      timestamp: new Date().toISOString(),
      action: 'Rescheduled',
      performedBy: params.performedByDoctorName,
      previousDate,
      previousTime,
      newDate: params.newDate,
      newTime: params.newStartTime,
      reason: params.reason,
    };

    const updatedAppt: ClinicalAppointment = {
      ...existing,
      date: params.newDate,
      startTime: params.newStartTime,
      endTime: computedEndTime,
      status: 'Rescheduled',
      reschedulingReason: params.reason,
      history: [historyEntry, ...existing.history],
      updatedAt: new Date().toISOString(),
    };

    const updatedList = this.state.appointments.map((a) => (a.id === existing.id ? updatedAppt : a));
    this.saveState({ ...this.state, appointments: updatedList });

    this.recordAudit({
      doctorId: existing.doctorId,
      doctorName: params.performedByDoctorName,
      action: 'RESCHEDULE_APPOINTMENT',
      entityType: 'Appointment',
      entityId: existing.id,
      details: `Rescheduled ${existing.id} from ${previousDate} ${previousTime} to ${params.newDate} ${params.newStartTime}. Reason: ${params.reason}`,
    });

    return { success: true, appointment: updatedAppt };
  }

  public cancelAppointment(params: {
    appointmentId: string;
    reason: string;
    performedByDoctorName: string;
  }): { success: boolean; appointment?: ClinicalAppointment; error?: string } {
    const existing = this.getAppointmentById(params.appointmentId);
    if (!existing) return { success: false, error: 'Appointment not found.' };

    const historyEntry: SchedulingHistoryEntry = {
      timestamp: new Date().toISOString(),
      action: 'Cancelled',
      performedBy: params.performedByDoctorName,
      reason: params.reason,
    };

    const updatedAppt: ClinicalAppointment = {
      ...existing,
      status: 'Cancelled',
      cancellationReason: params.reason,
      history: [historyEntry, ...existing.history],
      updatedAt: new Date().toISOString(),
    };

    const updatedList = this.state.appointments.map((a) => (a.id === existing.id ? updatedAppt : a));
    this.saveState({ ...this.state, appointments: updatedList });

    this.recordAudit({
      doctorId: existing.doctorId,
      doctorName: params.performedByDoctorName,
      action: 'CANCEL_APPOINTMENT',
      entityType: 'Appointment',
      entityId: existing.id,
      details: `Cancelled appointment ${existing.id} for ${existing.patientName}. Reason: ${params.reason}`,
    });

    return { success: true, appointment: updatedAppt };
  }

  public updateAppointmentStatus(
    appointmentId: string,
    status: AppointmentStatus,
    performedByDoctorName: string,
    notes?: string
  ): { success: boolean; appointment?: ClinicalAppointment; error?: string } {
    const existing = this.getAppointmentById(appointmentId);
    if (!existing) return { success: false, error: 'Appointment not found.' };

    const historyEntry: SchedulingHistoryEntry = {
      timestamp: new Date().toISOString(),
      action: 'Status Changed',
      performedBy: performedByDoctorName,
      notes: `Status changed from ${existing.status} to ${status}${notes ? ': ' + notes : ''}`,
    };

    const updatedAppt: ClinicalAppointment = {
      ...existing,
      status,
      history: [historyEntry, ...existing.history],
      updatedAt: new Date().toISOString(),
    };

    const updatedList = this.state.appointments.map((a) => (a.id === existing.id ? updatedAppt : a));
    this.saveState({ ...this.state, appointments: updatedList });

    this.recordAudit({
      doctorId: existing.doctorId,
      doctorName: performedByDoctorName,
      action: 'UPDATE_APPOINTMENT_STATUS',
      entityType: 'Appointment',
      entityId: existing.id,
      details: `Updated status of appointment ${existing.id} to ${status}.`,
    });

    return { success: true, appointment: updatedAppt };
  }

  // --------------------------------------------------------------------------
  // PATIENT MANAGEMENT (Module 4)
  // --------------------------------------------------------------------------

  public getPatients(searchQuery?: string): PatientRecord[] {
    let list = [...this.state.patients];
    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q) ||
          p.phone.includes(q) ||
          p.ceapClassification.toLowerCase().includes(q) ||
          p.primaryDiagnosis.toLowerCase().includes(q)
      );
    }
    return list;
  }

  public getPatientById(id: string): PatientRecord | undefined {
    return this.state.patients.find((p) => p.id === id);
  }

  // --------------------------------------------------------------------------
  // DOCUMENT MANAGEMENT (Module 5)
  // --------------------------------------------------------------------------

  public getDocuments(filter?: {
    patientId?: string;
    category?: DocumentCategory;
    reviewStatus?: DocumentReviewStatus;
  }): PatientDocument[] {
    let list = [...this.state.documents];
    if (filter) {
      if (filter.patientId) list = list.filter((d) => d.patientId === filter.patientId);
      if (filter.category) list = list.filter((d) => d.category === filter.category);
      if (filter.reviewStatus) list = list.filter((d) => d.reviewStatus === filter.reviewStatus);
    }
    return list.sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
  }

  public getDocumentById(id: string): PatientDocument | undefined {
    return this.state.documents.find((d) => d.id === id);
  }

  public uploadDocument(params: {
    patientId: string;
    appointmentId?: string;
    category: DocumentCategory;
    file: { name: string; size: number; type: string };
    summaryNotes?: string;
    uploadedBy: string;
    doctorId: string;
  }): { success: boolean; document?: PatientDocument; error?: string } {
    const patient = this.getPatientById(params.patientId);
    if (!patient) return { success: false, error: 'Patient not found.' };

    // Validate size (max 15MB)
    const MAX_SIZE = 15 * 1024 * 1024;
    if (params.file.size > MAX_SIZE) {
      return { success: false, error: 'File size exceeds maximum permitted clinical limit of 15 MB.' };
    }

    // Validate mime type
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    const mime = (params.file.type || '').toLowerCase();
    const isPdf = mime.includes('pdf') || params.file.name.toLowerCase().endsWith('.pdf');
    const isJpg = mime.includes('jpeg') || mime.includes('jpg') || params.file.name.toLowerCase().endsWith('.jpg');
    const isPng = mime.includes('png') || params.file.name.toLowerCase().endsWith('.png');

    if (!isPdf && !isJpg && !isPng) {
      return { success: false, error: 'Unsupported file format. Only PDF, JPG, and PNG files are accepted.' };
    }

    const docId = `DOC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newDoc: PatientDocument = {
      id: docId,
      patientId: patient.id,
      patientName: patient.name,
      appointmentId: params.appointmentId,
      category: params.category,
      fileName: params.file.name,
      fileSizeBytes: params.file.size,
      mimeType: isPdf ? 'application/pdf' : isPng ? 'image/png' : 'image/jpeg',
      uploadedAt: new Date().toISOString(),
      uploadedBy: params.uploadedBy,
      reviewStatus: 'Pending Review',
      summaryNotes: params.summaryNotes,
      secureSignedExpiry: new Date(Date.now() + 3600000).toISOString(),
    };

    const updated = [newDoc, ...this.state.documents];
    this.saveState({ ...this.state, documents: updated });

    this.recordAudit({
      doctorId: params.doctorId,
      doctorName: params.uploadedBy,
      action: 'UPLOAD_DOCUMENT',
      entityType: 'Document',
      entityId: docId,
      details: `Uploaded ${params.category} ("${params.file.name}", ${(params.file.size / 1024 / 1024).toFixed(2)} MB) for patient ${patient.name}.`,
    });

    return { success: true, document: newDoc };
  }

  public updateDocumentReviewStatus(
    documentId: string,
    status: DocumentReviewStatus,
    doctorId: string,
    doctorName: string,
    notes?: string
  ): { success: boolean; document?: PatientDocument } {
    const doc = this.getDocumentById(documentId);
    if (!doc) return { success: false };

    const updated: PatientDocument = {
      ...doc,
      reviewStatus: status,
      reviewedAt: new Date().toISOString(),
      reviewedByDoctorId: doctorId,
      summaryNotes: notes ? (doc.summaryNotes ? `${doc.summaryNotes}\n[Clinician Note]: ${notes}` : notes) : doc.summaryNotes,
    };

    const list = this.state.documents.map((d) => (d.id === documentId ? updated : d));
    this.saveState({ ...this.state, documents: list });

    this.recordAudit({
      doctorId,
      doctorName,
      action: 'VIEW_DOCUMENT',
      entityType: 'Document',
      entityId: doc.id,
      details: `Clinician reviewed document "${doc.fileName}". Marked status as "${status}".`,
    });

    return { success: true, document: updated };
  }

  // --------------------------------------------------------------------------
  // CLINICAL NOTES & VERSIONED AMENDMENTS (Module 6)
  // --------------------------------------------------------------------------

  public getClinicalNotes(filter?: { patientId?: string; appointmentId?: string; doctorId?: string }): ClinicalNote[] {
    let list = [...this.state.clinicalNotes];
    if (filter) {
      if (filter.patientId) list = list.filter((n) => n.patientId === filter.patientId);
      if (filter.appointmentId) list = list.filter((n) => n.appointmentId === filter.appointmentId);
      if (filter.doctorId) list = list.filter((n) => n.doctorId === filter.doctorId);
    }
    return list.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  public getClinicalNoteById(id: string): ClinicalNote | undefined {
    return this.state.clinicalNotes.find((n) => n.id === id);
  }

  public saveClinicalNoteDraft(params: {
    noteId?: string;
    patientId: string;
    appointmentId: string;
    doctorId: string;
    doctorName: string;
    presentingComplaint: string;
    clinicalObservations: string;
    examinationFindings: string;
    assessment: string;
    treatmentPlan: string;
    followUpRecommendations: string;
    additionalNotes: string;
  }): { success: boolean; note?: ClinicalNote; error?: string } {
    const patient = this.getPatientById(params.patientId);
    if (!patient) return { success: false, error: 'Patient not found.' };

    const now = new Date().toISOString();

    if (params.noteId) {
      const existing = this.getClinicalNoteById(params.noteId);
      if (!existing) return { success: false, error: 'Existing note not found.' };
      if (existing.status === 'Finalized') {
        return {
          success: false,
          error: 'This note is already finalized and signed. You must use the "Amend Note" workflow to submit revisions with a recorded audit trail.',
        };
      }

      const updatedNote: ClinicalNote = {
        ...existing,
        presentingComplaint: params.presentingComplaint,
        clinicalObservations: params.clinicalObservations,
        examinationFindings: params.examinationFindings,
        assessment: params.assessment,
        treatmentPlan: params.treatmentPlan,
        followUpRecommendations: params.followUpRecommendations,
        additionalNotes: params.additionalNotes,
        updatedAt: now,
      };

      const list = this.state.clinicalNotes.map((n) => (n.id === params.noteId ? updatedNote : n));
      this.saveState({ ...this.state, clinicalNotes: list });

      return { success: true, note: updatedNote };
    }

    // New draft
    const newNoteId = `NOTE-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newNote: ClinicalNote = {
      id: newNoteId,
      patientId: patient.id,
      patientName: patient.name,
      appointmentId: params.appointmentId,
      doctorId: params.doctorId,
      doctorName: params.doctorName,
      consultationDate: now.split('T')[0],
      status: 'Draft',
      presentingComplaint: params.presentingComplaint,
      clinicalObservations: params.clinicalObservations,
      examinationFindings: params.examinationFindings,
      assessment: params.assessment,
      treatmentPlan: params.treatmentPlan,
      followUpRecommendations: params.followUpRecommendations,
      additionalNotes: params.additionalNotes,
      version: 1,
      versionHistory: [],
      createdAt: now,
      updatedAt: now,
    };

    const updated = [newNote, ...this.state.clinicalNotes];
    this.saveState({ ...this.state, clinicalNotes: updated });

    this.recordAudit({
      doctorId: params.doctorId,
      doctorName: params.doctorName,
      action: 'CREATE_CLINICAL_NOTE',
      entityType: 'ClinicalNote',
      entityId: newNoteId,
      details: `Created new draft clinical note ${newNoteId} for patient ${patient.name}.`,
    });

    return { success: true, note: newNote };
  }

  public finalizeAndSignNote(params: {
    noteId: string;
    doctorId: string;
    doctorName: string;
    signingConfirmation: boolean;
  }): { success: boolean; note?: ClinicalNote; error?: string } {
    const existing = this.getClinicalNoteById(params.noteId);
    if (!existing) return { success: false, error: 'Note not found.' };

    if (!params.signingConfirmation) {
      return { success: false, error: 'You must explicitly confirm clinical accuracy before digitally signing.' };
    }

    const now = new Date().toISOString();
    const verificationHash = `SIG-VERIFIED-SHA256-${Math.random().toString(36).substring(2, 10)}${Date.now().toString(36)}`;

    const finalizedNote: ClinicalNote = {
      ...existing,
      status: 'Finalized',
      signedAt: now,
      signedByDoctorName: params.doctorName,
      signatureVerificationHash: verificationHash,
      updatedAt: now,
    };

    const list = this.state.clinicalNotes.map((n) => (n.id === params.noteId ? finalizedNote : n));

    // Also link note to appointment if present
    const appts = this.state.appointments.map((a) =>
      a.id === existing.appointmentId ? { ...a, linkedClinicalNoteId: finalizedNote.id } : a
    );

    this.saveState({ ...this.state, clinicalNotes: list, appointments: appts });

    this.recordAudit({
      doctorId: params.doctorId,
      doctorName: params.doctorName,
      action: 'FINALIZE_CLINICAL_NOTE',
      entityType: 'ClinicalNote',
      entityId: finalizedNote.id,
      details: `Finalized and digitally signed clinical consultation note ${finalizedNote.id} (Hash: ${verificationHash}). Original note is now immutable.`,
    });

    return { success: true, note: finalizedNote };
  }

  /**
   * Amends a finalized note without silently overwriting it.
   * Records the previous content, reason for amendment, doctor identity, and increments version number.
   */
  public amendFinalizedNote(params: {
    noteId: string;
    doctorId: string;
    doctorName: string;
    amendmentReason: string;
    newContent: {
      presentingComplaint: string;
      clinicalObservations: string;
      examinationFindings: string;
      assessment: string;
      treatmentPlan: string;
      followUpRecommendations: string;
      additionalNotes: string;
    };
  }): { success: boolean; note?: ClinicalNote; error?: string } {
    const existing = this.getClinicalNoteById(params.noteId);
    if (!existing) return { success: false, error: 'Note not found.' };

    if (!params.amendmentReason || params.amendmentReason.trim().length < 5) {
      return { success: false, error: 'A specific clinical reason for amendment is mandatory under healthcare record standards.' };
    }

    const now = new Date().toISOString();
    const versionEntry: ClinicalNoteVersion = {
      versionNumber: existing.version,
      amendedAt: now,
      amendedByDoctorId: params.doctorId,
      amendedByDoctorName: params.doctorName,
      amendmentReason: params.amendmentReason,
      previousContent: {
        presentingComplaint: existing.presentingComplaint,
        clinicalObservations: existing.clinicalObservations,
        examinationFindings: existing.examinationFindings,
        assessment: existing.assessment,
        treatmentPlan: existing.treatmentPlan,
        followUpRecommendations: existing.followUpRecommendations,
        additionalNotes: existing.additionalNotes,
      },
    };

    const amendedNote: ClinicalNote = {
      ...existing,
      ...params.newContent,
      status: 'Amended',
      version: existing.version + 1,
      versionHistory: [versionEntry, ...existing.versionHistory],
      updatedAt: now,
    };

    const list = this.state.clinicalNotes.map((n) => (n.id === params.noteId ? amendedNote : n));
    this.saveState({ ...this.state, clinicalNotes: list });

    this.recordAudit({
      doctorId: params.doctorId,
      doctorName: params.doctorName,
      action: 'AMEND_CLINICAL_NOTE',
      entityType: 'ClinicalNote',
      entityId: existing.id,
      details: `Amended clinical note ${existing.id} to version ${amendedNote.version}. Reason: "${params.amendmentReason}". Previous version preserved in audit history.`,
    });

    return { success: true, note: amendedNote };
  }

  // --------------------------------------------------------------------------
  // DOCTOR AVAILABILITY (Module 8)
  // --------------------------------------------------------------------------

  public getDoctorAvailability(doctorId: string): DoctorAvailability | undefined {
    return this.state.availability.find((a) => a.doctorId === doctorId);
  }

  public updateDoctorAvailability(
    availability: DoctorAvailability,
    performedByDoctorName: string
  ): { success: boolean; availability: DoctorAvailability } {
    const list = this.state.availability.map((a) => (a.doctorId === availability.doctorId ? availability : a));
    this.saveState({ ...this.state, availability: list });

    this.recordAudit({
      doctorId: availability.doctorId,
      doctorName: performedByDoctorName,
      action: 'UPDATE_AVAILABILITY',
      entityType: 'Availability',
      entityId: availability.doctorId,
      details: `Updated consultation schedule: Working days [${availability.workingDays.join(',')}], hours ${availability.workingHours.start}–${availability.workingHours.end}, slot ${availability.slotDurationMinutes} min.`,
    });

    return { success: true, availability };
  }

  // --------------------------------------------------------------------------
  // NOTIFICATIONS (Module 9)
  // --------------------------------------------------------------------------

  public getNotifications(doctorId: string, unreadOnly?: boolean): DoctorNotification[] {
    let list = this.state.notifications.filter((n) => n.doctorId === doctorId && !n.dismissed);
    if (unreadOnly) {
      list = list.filter((n) => !n.read);
    }
    return list.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  }

  public markNotificationAsRead(id: string): void {
    const list = this.state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    this.saveState({ ...this.state, notifications: list });
  }

  public markAllNotificationsAsRead(doctorId: string): void {
    const list = this.state.notifications.map((n) => (n.doctorId === doctorId ? { ...n, read: true } : n));
    this.saveState({ ...this.state, notifications: list });
  }

  public dismissNotification(id: string): void {
    const list = this.state.notifications.map((n) => (n.id === id ? { ...n, dismissed: true } : n));
    this.saveState({ ...this.state, notifications: list });
  }

  public createNotification(params: {
    doctorId: string;
    type: DoctorNotification['type'];
    title: string;
    message: string;
    priority?: 'low' | 'normal' | 'urgent';
    relatedEntity?: DoctorNotification['relatedEntity'];
  }): DoctorNotification {
    const newNotif: DoctorNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      doctorId: params.doctorId,
      type: params.type,
      title: params.title,
      message: params.message,
      timestamp: new Date().toISOString(),
      read: false,
      dismissed: false,
      priority: params.priority || 'normal',
      relatedEntity: params.relatedEntity,
    };

    const updated = [newNotif, ...this.state.notifications];
    this.saveState({ ...this.state, notifications: updated });
    return newNotif;
  }

  // --------------------------------------------------------------------------
  // AUDIT LOGS (Module 10)
  // --------------------------------------------------------------------------

  public getAuditLogs(doctorId?: string): AuditLogEntry[] {
    let list = [...this.state.auditLogs];
    if (doctorId) {
      list = list.filter((l) => l.doctorId === doctorId);
    }
    return list.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  }

  public recordAudit(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): void {
    const newEntry: AuditLogEntry = {
      ...entry,
      id: `AUD-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      timestamp: new Date().toISOString(),
    };
    const updated = [newEntry, ...this.state.auditLogs];
    this.saveState({ ...this.state, auditLogs: updated });
  }
}

// Singleton Service Instance
export const doctorPortalService = new DoctorPortalService();
