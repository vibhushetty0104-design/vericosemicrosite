/**
 * MERIDIAN VASCULAR DOCTOR PORTAL — TYPE DEFINITIONS
 * Strict TypeScript models for clinical workspace, appointments, records, notes, and audit trails.
 */

export type DoctorSpecialty =
  | 'Vascular Surgery'
  | 'Interventional Radiology'
  | 'Phlebology'
  | 'Venous Wound Care'
  | 'Endovascular Surgery';

export type DoctorDepartment =
  | 'Department of Peripheral Vascular Surgery'
  | 'Division of Interventional Radiology & Vein Care'
  | 'Venous & Lymphatic Medicine'
  | 'Wound Healing & Compression Therapy';

export type ConsultationMode = 'In-Person OPD' | 'Video Teleconsultation' | 'Bedside / Cath Lab';

export type AppointmentStatus =
  | 'Confirmed'
  | 'Pending'
  | 'Rescheduled'
  | 'Cancelled'
  | 'Completed'
  | 'No-show';

export type AppointmentType =
  | 'Initial Evaluation'
  | 'Follow-up Consultation'
  | 'Duplex Ultrasound Review'
  | 'Pre-procedure Assessment (EVLA / Glue)'
  | 'Post-procedure Checkup'
  | 'Ulcer & Wound Care Review';

export type DocumentCategory =
  | 'Doppler ultrasound reports'
  | 'Medical prescriptions'
  | 'Laboratory reports'
  | 'Clinical photographs'
  | 'Discharge summaries'
  | 'Other medical documents';

export type DocumentReviewStatus = 'Pending Review' | 'Reviewed' | 'Action Required';

export interface Doctor {
  id: string; // e.g. "MVD-BLR-0192"
  username: string;
  email: string;
  name: string;
  credentials: string; // e.g. "MBBS, MS, MCh (Vascular Surgery)"
  title: string; // e.g. "Senior Consultant Vascular Surgeon"
  specialization: DoctorSpecialty;
  department: DoctorDepartment;
  profilePhotoUrl: string;
  consultationLocation: string; // e.g. "Bengaluru Clinic — 4th Block Indiranagar"
  contactPhone: string;
  medicalRegistrationNumber: string; // e.g. "KMC-74912"
  status: 'Active' | 'Suspended' | 'Pending Approval';
  timezone: string; // e.g. "Asia/Kolkata (IST)"
  role: 'doctor' | 'lead_surgeon' | 'clinical_director';
  twoFactorEnabled: boolean;
  provisionedAt: string;
  approvedBy: string;
}

export interface DoctorSession {
  token: string;
  doctorId: string;
  authenticatedAt: string;
  expiresAt: string;
  lastActiveAt: string;
  ipAddress?: string;
  mfaVerified: boolean;
}

export interface WorkingHours {
  start: string; // "09:00"
  end: string; // "17:00"
}

export interface BreakTime {
  id: string;
  label: string; // "Lunch Break", "Cath Lab Rounds"
  start: string; // "13:00"
  end: string; // "14:00"
}

export interface UnavailablePeriod {
  id: string;
  reason: string; // "Annual Vascular Conference", "Medical Leave"
  startDate: string; // "YYYY-MM-DD"
  endDate: string; // "YYYY-MM-DD"
  allDay: boolean;
}

export interface DoctorAvailability {
  doctorId: string;
  workingDays: number[]; // 0=Sunday, 1=Monday, ..., 6=Saturday
  workingHours: WorkingHours;
  slotDurationMinutes: number; // 15, 20, 30, 45, 60
  breaks: BreakTime[];
  unavailablePeriods: UnavailablePeriod[];
  maxAppointmentsPerSlot: number;
  bufferBetweenSlotsMinutes: number;
}

export interface PatientRecord {
  id: string; // e.g. "MVP-2026-8841"
  name: string;
  age: number;
  gender: 'Female' | 'Male' | 'Other';
  dob: string;
  phone: string;
  email: string;
  city: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  bloodGroup: string;
  ceapClassification: string; // e.g. "C3,s,Ep,As,p,Pr"
  primaryDiagnosis: string;
  medicalHistory: string[];
  allergies: string[];
  currentMedications: string[];
  registeredDate: string;
  assignedDoctorId: string;
  reviewStatus: 'Triage Pending' | 'Under Active Care' | 'Review Completed' | 'Discharged';
}

export interface SchedulingHistoryEntry {
  timestamp: string;
  action: 'Created' | 'Rescheduled' | 'Cancelled' | 'Status Changed';
  performedBy: string; // Doctor name or system
  previousDate?: string;
  previousTime?: string;
  newDate?: string;
  newTime?: string;
  reason?: string;
  notes?: string;
}

export interface ClinicalAppointment {
  id: string; // e.g. "APT-2026-0491"
  patientId: string;
  patientName: string;
  patientPhone: string;
  patientAge: number;
  patientGender: string;
  doctorId: string;
  doctorName: string;
  date: string; // "YYYY-MM-DD"
  startTime: string; // "10:00"
  endTime: string; // "10:30"
  appointmentType: AppointmentType;
  consultationMode: ConsultationMode;
  status: AppointmentStatus;
  location: string;
  meetingLink?: string;
  reasonForVisit: string;
  administrativeNotes?: string;
  cancellationReason?: string;
  reschedulingReason?: string;
  linkedClinicalNoteId?: string;
  linkedDocumentIds?: string[];
  followUpDate?: string;
  history: SchedulingHistoryEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface PatientDocument {
  id: string; // e.g. "DOC-2026-3301"
  patientId: string;
  patientName: string;
  appointmentId?: string;
  category: DocumentCategory;
  fileName: string;
  fileSizeBytes: number;
  mimeType: 'application/pdf' | 'image/jpeg' | 'image/png';
  uploadedAt: string;
  uploadedBy: string; // "Patient" or Doctor ID/Name
  reviewStatus: DocumentReviewStatus;
  reviewedAt?: string;
  reviewedByDoctorId?: string;
  summaryNotes?: string;
  dataUrl?: string; // Stored simulated private document URI
  secureSignedExpiry: string; // ISO string representing token expiry
}

export interface ClinicalNoteVersion {
  versionNumber: number;
  amendedAt: string;
  amendedByDoctorId: string;
  amendedByDoctorName: string;
  amendmentReason: string;
  previousContent: {
    presentingComplaint: string;
    clinicalObservations: string;
    examinationFindings: string;
    assessment: string;
    treatmentPlan: string;
    followUpRecommendations: string;
    additionalNotes: string;
  };
}

export interface ClinicalNote {
  id: string; // e.g. "NOTE-2026-1102"
  patientId: string;
  patientName: string;
  appointmentId: string;
  doctorId: string;
  doctorName: string;
  consultationDate: string;
  status: 'Draft' | 'Finalized' | 'Amended';
  presentingComplaint: string;
  clinicalObservations: string;
  examinationFindings: string;
  assessment: string;
  treatmentPlan: string;
  followUpRecommendations: string;
  additionalNotes: string;
  signedAt?: string;
  signedByDoctorName?: string;
  signatureVerificationHash?: string;
  version: number;
  versionHistory: ClinicalNoteVersion[];
  createdAt: string;
  updatedAt: string;
}

export type NotificationType =
  | 'new_appointment_request'
  | 'appointment_confirmed'
  | 'appointment_rescheduled'
  | 'upcoming_consultation'
  | 'document_uploaded'
  | 'pending_clinical_review';

export interface DoctorNotification {
  id: string;
  doctorId: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  dismissed: boolean;
  priority: 'low' | 'normal' | 'urgent';
  relatedEntity?: {
    type: 'appointment' | 'patient' | 'document' | 'clinical_note';
    id: string;
  };
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  doctorId: string;
  doctorName: string;
  action:
    | 'LOGIN_SUCCESS'
    | 'LOGIN_FAILED'
    | 'LOGOUT'
    | 'PASSWORD_RESET_REQUEST'
    | 'PASSWORD_RESET_COMPLETED'
    | 'VIEW_PATIENT_RECORD'
    | 'VIEW_DOCUMENT'
    | 'UPLOAD_DOCUMENT'
    | 'DOWNLOAD_DOCUMENT'
    | 'CREATE_APPOINTMENT'
    | 'RESCHEDULE_APPOINTMENT'
    | 'CANCEL_APPOINTMENT'
    | 'UPDATE_APPOINTMENT_STATUS'
    | 'CREATE_CLINICAL_NOTE'
    | 'UPDATE_CLINICAL_NOTE'
    | 'FINALIZE_CLINICAL_NOTE'
    | 'AMEND_CLINICAL_NOTE'
    | 'UPDATE_AVAILABILITY';
  entityType: 'Doctor' | 'Patient' | 'Appointment' | 'Document' | 'ClinicalNote' | 'Availability';
  entityId: string;
  details: string;
  ipAddress?: string;
}
