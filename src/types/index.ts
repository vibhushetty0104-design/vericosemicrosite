export interface AssessmentOption {
  label: string;
  score: number;
  description?: string;
}

export interface AssessmentQuestion {
  id: number;
  title: string;
  desc: string;
  clinicalSignificance: string;
  options: AssessmentOption[];
}

export type SymptomSeverityLevel = 'Minimal' | 'Mild' | 'Moderate' | 'Advanced' | 'Severe';

/**
 * Result of the self-reported symptom screener. It describes a pattern of reported symptoms only;
 * it is not a CEAP class, which clinicians assign after examination.
 */
export interface AssessmentResult {
  totalScore: number;
  maxScore: number;
  percentage: number;
  symptomPatternTitle: string;
  severityLevel: SymptomSeverityLevel;
  urgentCareAdvised: boolean;
  severityColor: string;
  summary: string;
  pathologyDetails: string;
  recommendedAction: string;
  suggestedSpecialist: string;
  diagnosticRecommendation: string;
  lifestyleMeasures: string[];
}

export interface AssistantMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text: string;
  recommendedSpecialist?: string;
  recommendedSpecialistRole?: string;
  urgencyLevel?: 'Routine Consultation' | 'Priority Evaluation' | 'Urgent Medical Attention';
  suggestedDiagnostic?: string;
  suggestedQuestions?: string[];
  source?: 'pre-written';
  intent?: string;
}

export interface CEAPStageInfo {
  stage: string;
  name: string;
  clinicalDescription: string;
  physicalManifestations: string[];
  refluxMechanism: string;
  treatmentApproaches: string[];
  reversibility: string;
  urgency: 'Low' | 'Moderate' | 'High' | 'Immediate';
}

export interface PatientUser {
  id: string;
  name: string;
  phone: string;
  fullName?: string;
  phoneNumber?: string;
  email?: string;
  isVerified: boolean;
  authMethod: 'phone_otp' | 'aadhaar_sandbox';
  registeredAt: string;
  abhaNumber?: string;
}

export interface ReviewAttachment {
  id: string;
  name: string;
  size: string;
  type: 'pdf' | 'image';
  dataUrl?: string;
}

export interface ExpertReviewSubmission {
  id: string;
  category: 'medical-reports' | 'leg-photos';
  patientId: string;
  patientName: string;
  patientPhone: string;
  submittedAt: string;
  status: 'Submitted — In Triage' | 'Awaiting Clinician Assignment' | 'In Clinician Review' | 'Completed';
  attachments: ReviewAttachment[];
  notes?: string;
  consentGiven: boolean;
  assignedDoctorName?: string;
}

export type AppView = 'home' | 'learn' | 'research' | 'journey' | 'doppler' | 'assessment' | 'leg-assessment' | 'treatments' | 'specialists' | 'insurance' | 'ai' | 'dashboard' | 'expert-review';
