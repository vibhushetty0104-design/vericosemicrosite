import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  User,
  Mail,
  Phone,
  Info,
  ShieldCheck,
  Video,
  Building2,
  Stethoscope,
  CheckCircle2,
  AlertCircle,
  FileText,
  Loader2,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import { DOCTORS_DATA, DoctorProfile } from '../data/doctorsData';
import { trackEvent } from '../utils/analytics';
import { useAccessibleDialog } from '../utils/useAccessibleDialog';
import { symptomPatternLabel } from '../data/assessmentQuestions';
import { SymptomSeverityLevel } from '../types';

// Demonstration profiles have no real clinic, so only the city is shown.
const demoLocationFor = (doctor: DoctorProfile) => `${doctor.city} (demo listing, no real clinic address)`;

/** Exact completion wording for the simulated request. Nothing is transmitted anywhere. */
export const DEMO_REQUEST_RESULT_MESSAGE = 'Demo request: not sent to any clinic';

export interface DemoRequestSummary {
  doctorName: string;
  modality: 'in-person' | 'telehealth';
  consultationType: string;
  location: string;
  timing: string;
  patientName?: string;
}

/**
 * Completion screen for the demo request. It deliberately shows no reference number and no
 * personal details, and states that nothing was sent.
 */
export const DemoRequestResult: React.FC<{ summary: DemoRequestSummary; onClose: () => void }> = ({ summary, onClose }) => (
  <div className="text-center py-6 sm:py-8 px-4 sm:px-6 space-y-6 max-w-xl mx-auto" data-demo-request-result>
    <div className="w-16 h-16 rounded-2xl bg-mv-pale text-mv-forest mx-auto flex items-center justify-center shadow-xs border border-mv-forest/15">
      <CheckCircle2 className="w-8 h-8 text-mv-cta" aria-hidden="true" />
    </div>

    <div className="space-y-1.5">
      <span className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.12em] font-bold text-mv-forest bg-mv-pale px-3 py-1 rounded-full">
        <Info className="w-3.5 h-3.5 text-mv-cta" />
        Demonstration Mode Only
      </span>
      <h3 className="font-serif text-2xl sm:text-3xl font-bold text-mv-forest tracking-tight">
        {DEMO_REQUEST_RESULT_MESSAGE}
      </h3>
      <p className="text-xs sm:text-[13px] text-mv-ink-muted max-w-md mx-auto leading-relaxed">
        Your consultation preferences were simulated inside this browser session.
      </p>
    </div>

    {/* Summary Card */}
    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-mv-outline/80 text-left text-xs sm:text-[13px] space-y-3 shadow-2xs">
      <div className="flex items-center justify-between pb-3 border-b border-mv-outline/50">
        <span className="font-semibold text-mv-forest flex items-center gap-2">
          <Stethoscope className="w-4 h-4 text-mv-cta" />
          Demo specialist:
        </span>
        <span className="text-mv-ink font-medium">{summary.doctorName} (demo profile · fictional)</span>
      </div>

      <div className="flex items-center justify-between pb-3 border-b border-mv-outline/50">
        <span className="font-semibold text-mv-forest flex items-center gap-2">
          {summary.modality === 'in-person' ? <Building2 className="w-4 h-4 text-mv-cta" /> : <Video className="w-4 h-4 text-mv-cta" />}
          Visit type:
        </span>
        <span className="text-mv-ink font-medium">
          {summary.modality === 'in-person' ? 'In-clinic duplex ultrasound' : 'Online video consultation'}
        </span>
      </div>

      <div className="flex items-center justify-between pb-3 border-b border-mv-outline/50">
        <span className="font-semibold text-mv-forest flex items-center gap-2">
          <FileText className="w-4 h-4 text-mv-cta" />
          Service:
        </span>
        <span className="text-mv-ink font-medium text-right max-w-[60%] truncate">{summary.consultationType}</span>
      </div>

      <div className="flex items-center justify-between pb-3 border-b border-mv-outline/50">
        <span className="font-semibold text-mv-forest flex items-center gap-2">
          <MapPin className="w-4 h-4 text-mv-cta" />
          Location:
        </span>
        <span className="text-mv-ink font-medium text-right">{summary.location}</span>
      </div>

      <div className="flex items-center justify-between">
        <span className="font-semibold text-mv-forest flex items-center gap-2">
          <Clock className="w-4 h-4 text-mv-cta" />
          Preferred timing:
        </span>
        <span className="text-mv-ink font-medium">{summary.timing}</span>
      </div>
    </div>

    {/* Truthful Educational Guidance Box */}
    <div className="bg-mv-ivory border border-mv-outline p-4 rounded-2xl text-xs text-mv-ink-muted text-left leading-relaxed space-y-2">
      <p>
        <strong className="text-mv-forest">What happened:</strong> nothing you entered has left this browser. No clinic, doctor or other organisation has received this request, and <strong className="text-mv-forest">no one will contact you</strong>.
      </p>
      <p className="text-[11.5px] text-mv-ink-muted/90">
        With a real partner clinic, an intake coordinator would contact you directly to review prior ultrasound scans, confirm appointment availability, and provide instructions before any visit is finalised.
      </p>
    </div>

    <div className="pt-2">
      <button
        type="button"
        onClick={onClose}
        className="w-full sm:w-auto px-8 py-3 text-xs sm:text-[13px] font-semibold text-white bg-mv-forest hover:bg-mv-forest-press rounded-full transition-colors cursor-pointer tap-tactile shadow-xs"
      >
        Close request preview
      </button>
    </div>
  </div>
);

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledScore?: number | null;
  prefilledPattern?: SymptomSeverityLevel | null;
  preselectedDoctor?: DoctorProfile | null;
  attachedMediaCount?: number;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  prefilledScore,
  prefilledPattern,
  preselectedDoctor,
  attachedMediaCount = 0,
}) => {
  const [modality, setModality] = useState<'in-person' | 'telehealth'>('in-person');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(preselectedDoctor?.id || 'dr-arvind-rao');

  const [formData, setFormData] = useState({
    patientName: '',
    email: '',
    phone: '',
    preferredDate: '',
    preferredTime: 'Morning (09:00 AM - 12:00 PM)',
    consultationType: 'Comprehensive Venous Duplex Ultrasound & Clinical Consultation',
    location: demoLocationFor(preselectedDoctor || DOCTORS_DATA[0]),
    notes: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [demoResult, setDemoResult] = useState<DemoRequestSummary | null>(null);

  useEffect(() => {
    if (preselectedDoctor) {
      setSelectedDoctorId(preselectedDoctor.id);
      setFormData(prev => ({
        ...prev,
        location: demoLocationFor(preselectedDoctor),
      }));
    }
  }, [preselectedDoctor]);

  const handleResetModal = () => {
    setDemoResult(null);
    setFormErrors({});
    setIsSubmitting(false);
    onClose();
  };

  const dialogRef = useRef<HTMLDivElement>(null);
  useAccessibleDialog(isOpen, handleResetModal, dialogRef);

  if (!isOpen) return null;

  const currentDoctor = DOCTORS_DATA.find(d => d.id === selectedDoctorId) || DOCTORS_DATA[0];

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.patientName.trim()) {
      errors.patientName = 'Please enter a name or sample name.';
    }
    if (!formData.email.trim()) {
      errors.email = 'Please provide an email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please provide a valid email format (e.g., patient@example.com).';
    }
    if (!formData.phone.trim()) {
      errors.phone = 'Please provide a contact phone number.';
    } else if (formData.phone.replace(/[^0-9]/g, '').length < 8) {
      errors.phone = 'Please provide a valid telephone number (min 8 digits).';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Demo only: the request is shown back to the user and never transmitted. No reference number is
  // generated, and analytics record only the visit type (no doctor, symptoms or personal details).
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Realistic clinical intake simulation (smooth 500ms feedback transition)
    window.setTimeout(() => {
      setIsSubmitting(false);
      setDemoResult({
        doctorName: currentDoctor.name,
        modality,
        consultationType: formData.consultationType,
        location: modality === 'in-person' ? formData.location : 'Video consultation (demo only)',
        timing: `${formData.preferredDate || 'No date chosen'} — ${formData.preferredTime}`,
        patientName: formData.patientName,
      });
      trackEvent('simulated_booking_submitted', { modality });
    }, 450);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 md:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) handleResetModal();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-dialog-title"
        tabIndex={-1}
        className="bg-white border border-mv-outline rounded-3xl shadow-2xl w-full max-w-4xl my-auto max-h-[94vh] flex flex-col overflow-hidden focus:outline-none"
      >
        {/* Modal Header */}
        <div className="px-5 sm:px-8 py-4 sm:py-5 border-b border-mv-outline/70 bg-mv-ivory flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-mv-forest text-white flex items-center justify-center shadow-xs">
              <Calendar className="w-5 h-5 text-mv-cta" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="booking-dialog-title" className="font-serif text-lg sm:text-xl font-bold text-mv-forest">
                  Request a Vascular Consultation
                </h3>
                <span className="text-[10px] font-mono uppercase bg-mv-pale text-mv-forest px-2.5 py-0.5 rounded-full font-bold border border-mv-forest/15">
                  Demo
                </span>
              </div>
              <p className="text-xs text-mv-ink-muted">
                Explore how an outpatient duplex ultrasound and clinical consultation request works
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleResetModal}
            aria-label="Close booking dialog"
            className="p-2 text-mv-ink-muted hover:text-mv-forest hover:bg-white rounded-full cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8">
          {!demoResult ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Booking Form (7 Cols on Desktop) */}
              <form onSubmit={handleSubmit} noValidate className="lg:col-span-7 space-y-5">
                
                {/* Demo Disclosure Alert */}
                <div className="p-3.5 rounded-2xl bg-mv-pale/60 border border-mv-forest/15 text-mv-ink text-xs leading-relaxed flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-mv-forest shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-mv-forest">Platform Demonstration:</strong> This form shows how a patient consultation request is structured. Specialists are fictional demonstration records. Submitting does not contact any clinic and data remains strictly inside your browser.
                  </div>
                </div>

                {/* Consultation Modality Selector */}
                <div>
                  <label className="block text-xs font-semibold text-mv-forest uppercase tracking-wider mb-2">
                    1. Consultation Setting
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        setModality('in-person');
                        setFormData(prev => ({
                          ...prev,
                          consultationType: 'Comprehensive Venous Duplex Ultrasound & Clinical Consultation',
                        }));
                      }}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer tap-tactile flex flex-col justify-between ${
                        modality === 'in-person'
                          ? 'bg-mv-pale/70 border-mv-forest ring-1 ring-mv-forest text-mv-forest shadow-xs'
                          : 'bg-mv-ivory border-mv-outline text-mv-ink-muted hover:border-mv-forest/40 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <Building2 className={`w-5 h-5 ${modality === 'in-person' ? 'text-mv-cta' : 'text-mv-ink-muted'}`} />
                        {modality === 'in-person' && <span className="w-2 h-2 rounded-full bg-mv-forest" />}
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-mv-forest">In-Clinic Duplex Exam</span>
                        <span className="block text-[11px] text-mv-ink-muted leading-tight mt-0.5">Physical standing venous ultrasound mapping</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setModality('telehealth');
                        setFormData(prev => ({
                          ...prev,
                          consultationType: 'Virtual Vascular Telehealth & Symptom Triage',
                        }));
                      }}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer tap-tactile flex flex-col justify-between ${
                        modality === 'telehealth'
                          ? 'bg-mv-pale/70 border-mv-forest ring-1 ring-mv-forest text-mv-forest shadow-xs'
                          : 'bg-mv-ivory border-mv-outline text-mv-ink-muted hover:border-mv-forest/40 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <Video className={`w-5 h-5 ${modality === 'telehealth' ? 'text-mv-cta' : 'text-mv-ink-muted'}`} />
                        {modality === 'telehealth' && <span className="w-2 h-2 rounded-full bg-mv-forest" />}
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-mv-forest">Online Video Triage</span>
                        <span className="block text-[11px] text-mv-ink-muted leading-tight mt-0.5">Remote discussion of symptoms & past reports</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Patient Score Banner if available */}
                {((prefilledScore !== undefined && prefilledScore !== null) || attachedMediaCount > 0) && (
                  <div className="bg-mv-pale/60 border border-mv-forest/20 p-3 rounded-2xl flex items-center justify-between text-xs">
                    <div>
                      {prefilledScore !== undefined && prefilledScore !== null && (
                        <span className="font-semibold text-mv-forest block">
                          Symptom Screener Score: {prefilledScore}/24 points{prefilledPattern ? ` (${symptomPatternLabel(prefilledPattern)})` : ''}
                        </span>
                      )}
                      {attachedMediaCount > 0 && (
                        <span className="text-[11px] text-mv-ink-muted">
                          {attachedMediaCount} photo(s)/video(s) stored on this device only, not uploaded or sent
                        </span>
                      )}
                    </div>
                    <span className="bg-mv-forest text-white px-2.5 py-1 rounded-full font-mono text-[10px] font-semibold">
                      Private Device Data
                    </span>
                  </div>
                )}

                {/* Doctor & Clinical Focus */}
                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-mv-forest uppercase tracking-wider">
                    2. Specialist & Care Focus
                  </label>
                  
                  {/* Doctor Selector */}
                  <div>
                    <label htmlFor="booking-doctor" className="block text-xs font-medium text-mv-ink mb-1">
                      Consultant (Demonstration Profile)
                    </label>
                    <div className="relative">
                      <Stethoscope className="w-4 h-4 text-mv-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
                      <select
                        id="booking-doctor"
                        value={selectedDoctorId}
                        onChange={(e) => {
                          const docId = e.target.value;
                          setSelectedDoctorId(docId);
                          const chosen = DOCTORS_DATA.find(d => d.id === docId);
                          if (chosen) {
                            setFormData(prev => ({ ...prev, location: demoLocationFor(chosen) }));
                          }
                        }}
                        className="w-full bg-mv-ivory border border-mv-outline rounded-xl py-2.5 pl-9 pr-3 text-xs text-mv-ink focus:ring-2 focus:ring-mv-forest/30 focus:border-mv-forest focus:outline-none"
                      >
                        {DOCTORS_DATA.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.name} (demo profile · fictional) — {d.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Consultation Type Focus */}
                  <div>
                    <label htmlFor="booking-focus" className="block text-xs font-medium text-mv-ink mb-1">
                      Reason for Assessment
                    </label>
                    <select
                      id="booking-focus"
                      value={formData.consultationType}
                      onChange={(e) => setFormData({ ...formData, consultationType: e.target.value })}
                      className="w-full bg-mv-ivory border border-mv-outline rounded-xl p-2.5 text-xs text-mv-ink focus:ring-2 focus:ring-mv-forest/30 focus:border-mv-forest focus:outline-none"
                    >
                      {modality === 'in-person' ? (
                        <>
                          <option value="Comprehensive Venous Duplex Ultrasound & Clinical Consultation">
                            Comprehensive Venous Duplex Ultrasound &amp; Clinical Consultation (Standing mapping)
                          </option>
                          <option value="Cosmetic Spider Vein Evaluation & Sclerotherapy">
                            Cosmetic Spider Vein Evaluation &amp; Polarized Light Sclerotherapy Plan
                          </option>
                          <option value="Second Opinion on Saphenous Reflux / Prior Vein Surgery">
                            Second Opinion on Prior Vein Surgery / Recurrent Vein Check
                          </option>
                          <option value="Venous Stasis Ulcer / Advanced Wound Consultation">
                            Venous Stasis Ulcer / Advanced Skin Wound Care Evaluation
                          </option>
                        </>
                      ) : (
                        <>
                          <option value="Virtual Vascular Telehealth & Symptom Triage">
                            Virtual Vascular Telehealth &amp; Symptom Triage (Video Review)
                          </option>
                          <option value="Pre-Ultrasound Physician Telehealth Orientation">
                            Pre-Ultrasound Physician Telehealth Orientation &amp; History
                          </option>
                          <option value="Post-Ablation Follow-Up Telehealth Review">
                            Post-Ablation Recovery &amp; Compression Stocking Review
                          </option>
                        </>
                      )}
                    </select>
                  </div>
                </div>

                {/* Patient Contact Details */}
                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-mv-forest uppercase tracking-wider">
                    3. Contact Details
                  </label>
                  
                  {/* Full Name */}
                  <div>
                    <label htmlFor="booking-name" className="block text-xs font-medium text-mv-ink mb-1">
                      Full Name (Sample name is welcome) <span className="text-mv-cta" aria-hidden="true">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-mv-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        id="booking-name"
                        type="text"
                        required
                        aria-required="true"
                        aria-invalid={!!formErrors.patientName}
                        value={formData.patientName}
                        onChange={(e) => {
                          setFormData({ ...formData, patientName: e.target.value });
                          if (formErrors.patientName) setFormErrors({ ...formErrors, patientName: '' });
                        }}
                        placeholder="e.g. Priya Sharma"
                        className={`w-full bg-mv-ivory border rounded-xl py-2.5 pl-9 pr-3 text-xs text-mv-ink focus:ring-2 focus:ring-mv-forest/30 focus:outline-none ${
                          formErrors.patientName ? 'border-red-500 ring-1 ring-red-500' : 'border-mv-outline focus:border-mv-forest'
                        }`}
                      />
                    </div>
                    {formErrors.patientName && (
                      <p className="mt-1 text-[11px] text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {formErrors.patientName}
                      </p>
                    )}
                  </div>

                  {/* Contact Info Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="booking-email" className="block text-xs font-medium text-mv-ink mb-1">
                        Email Address <span className="text-mv-cta" aria-hidden="true">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-mv-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          id="booking-email"
                          type="email"
                          required
                          aria-required="true"
                          aria-invalid={!!formErrors.email}
                          value={formData.email}
                          onChange={(e) => {
                            setFormData({ ...formData, email: e.target.value });
                            if (formErrors.email) setFormErrors({ ...formErrors, email: '' });
                          }}
                          placeholder="priya@example.com"
                          className={`w-full bg-mv-ivory border rounded-xl py-2.5 pl-9 pr-3 text-xs text-mv-ink focus:ring-2 focus:ring-mv-forest/30 focus:outline-none ${
                            formErrors.email ? 'border-red-500 ring-1 ring-red-500' : 'border-mv-outline focus:border-mv-forest'
                          }`}
                        />
                      </div>
                      {formErrors.email && (
                        <p className="mt-1 text-[11px] text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {formErrors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="booking-phone" className="block text-xs font-medium text-mv-ink mb-1">
                        Phone Number <span className="text-mv-cta" aria-hidden="true">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-mv-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          id="booking-phone"
                          type="tel"
                          required
                          aria-required="true"
                          aria-invalid={!!formErrors.phone}
                          value={formData.phone}
                          onChange={(e) => {
                            setFormData({ ...formData, phone: e.target.value });
                            if (formErrors.phone) setFormErrors({ ...formErrors, phone: '' });
                          }}
                          placeholder="+91 98765 43210"
                          className={`w-full bg-mv-ivory border rounded-xl py-2.5 pl-9 pr-3 text-xs text-mv-ink focus:ring-2 focus:ring-mv-forest/30 focus:outline-none ${
                            formErrors.phone ? 'border-red-500 ring-1 ring-red-500' : 'border-mv-outline focus:border-mv-forest'
                          }`}
                        />
                      </div>
                      {formErrors.phone && (
                        <p className="mt-1 text-[11px] text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {formErrors.phone}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Preferred Date & Time Window */}
                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-mv-forest uppercase tracking-wider">
                    4. Preferred Timing (Requested Window)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="booking-date" className="block text-xs font-medium text-mv-ink mb-1">
                        Preferred Date
                      </label>
                      <input
                        id="booking-date"
                        type="date"
                        value={formData.preferredDate}
                        onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                        className="w-full bg-mv-ivory border border-mv-outline rounded-xl p-2.5 text-xs text-mv-ink focus:ring-2 focus:ring-mv-forest/30 focus:border-mv-forest focus:outline-none"
                      />
                    </div>

                    <div>
                      <label htmlFor="booking-time" className="block text-xs font-medium text-mv-ink mb-1">
                        Preferred Window
                      </label>
                      <select
                        id="booking-time"
                        value={formData.preferredTime}
                        onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                        className="w-full bg-mv-ivory border border-mv-outline rounded-xl p-2.5 text-xs text-mv-ink focus:ring-2 focus:ring-mv-forest/30 focus:border-mv-forest focus:outline-none"
                      >
                        <option value="Morning (09:00 AM - 12:00 PM)">Morning (09:00 AM - 12:00 PM)</option>
                        <option value="Early Afternoon (12:00 PM - 03:00 PM)">Early Afternoon (12:00 PM - 03:00 PM)</option>
                        <option value="Late Afternoon (03:00 PM - 05:30 PM)">Late Afternoon (03:00 PM - 05:30 PM)</option>
                      </select>
                    </div>
                  </div>
                  <p className="text-[11px] text-mv-ink-muted">
                    Times represent consultation preference windows, not instant live bookings.
                  </p>
                </div>

                {/* Physical Location or Virtual Instructions */}
                {modality === 'in-person' ? (
                  <div>
                    <label className="block text-xs font-semibold text-mv-forest uppercase tracking-wider mb-1">
                      Clinic Location (Demonstration)
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-mv-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        readOnly
                        value={formData.location}
                        className="w-full bg-mv-pale/40 border border-mv-outline rounded-xl py-2 pl-9 pr-3 text-xs text-mv-ink font-medium"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="bg-mv-pale/50 border border-mv-forest/20 p-3.5 rounded-2xl text-xs text-mv-ink leading-relaxed">
                    <strong className="text-mv-forest block mb-0.5">Telehealth Protocol:</strong>
                    In a live clinical service, secure encrypted video links are issued after nurse intake. This prototype does not transmit emails or video meeting invites.
                  </div>
                )}

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-5 bg-mv-cta hover:bg-mv-cta-press disabled:opacity-50 text-white rounded-full text-xs sm:text-[13px] font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs tap-tactile"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Simulating request intake...</span>
                      </>
                    ) : (
                      <>
                        <Calendar className="w-4 h-4 text-white" />
                        <span>
                          {`Complete demo ${modality === 'in-person' ? 'in-clinic' : 'video'} request`}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

                <div className="text-[11px] text-mv-ink-muted text-center flex items-center justify-center gap-1.5 pt-1">
                  <ShieldCheck className="w-4 h-4 text-mv-forest shrink-0" />
                  <span>Demo only · Nothing is sent to any clinic</span>
                </div>
              </form>

              {/* Right Column: Supporting Information & Clinical Guidance (5 Cols on Desktop) */}
              <div className="lg:col-span-5 space-y-5 bg-mv-ivory/70 border border-mv-outline/70 p-5 sm:p-6 rounded-3xl">
                <div>
                  <h4 className="font-serif text-base font-semibold text-mv-forest flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-mv-cta" />
                    What to Expect Next
                  </h4>
                  <p className="mt-1 text-xs text-mv-ink-muted leading-relaxed">
                    How an authentic vascular consultation journey progresses from request to evaluation:
                  </p>
                </div>

                <ol className="space-y-4 text-xs text-mv-ink">
                  <li className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-mv-forest text-white flex items-center justify-center font-mono font-bold text-[11px] shrink-0 mt-0.5">
                      1
                    </span>
                    <div>
                      <strong className="block text-mv-forest">Intake &amp; Document Review</strong>
                      <span className="text-mv-ink-muted leading-relaxed block mt-0.5">
                        In a live center, past ultrasound scans or clinical history are reviewed by a medical coordinator.
                      </span>
                    </div>
                  </li>

                  <li className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-mv-forest text-white flex items-center justify-center font-mono font-bold text-[11px] shrink-0 mt-0.5">
                      2
                    </span>
                    <div>
                      <strong className="block text-mv-forest">Slot &amp; Location Confirmation</strong>
                      <span className="text-mv-ink-muted leading-relaxed block mt-0.5">
                        The clinic contacts you to confirm your standing duplex exam time and provides pre-visit instructions.
                      </span>
                    </div>
                  </li>

                  <li className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-mv-forest text-white flex items-center justify-center font-mono font-bold text-[11px] shrink-0 mt-0.5">
                      3
                    </span>
                    <div>
                      <strong className="block text-mv-forest">Comprehensive Standing Exam</strong>
                      <span className="text-mv-ink-muted leading-relaxed block mt-0.5">
                        A full 30–45 minute standing mapping of both superficial saphenous trunks and deep veins.
                      </span>
                    </div>
                  </li>
                </ol>

                {/* Practical Preparation Checklist */}
                <div className="pt-4 border-t border-mv-outline/70 space-y-2.5">
                  <span className="block text-xs font-semibold text-mv-forest uppercase tracking-wider">
                    Preparation Checklist
                  </span>
                  <ul className="space-y-2 text-xs text-mv-ink-muted">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-mv-forest shrink-0 mt-0.5" />
                      <span>Bring past Doppler reports, CDs, or discharge summaries</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-mv-forest shrink-0 mt-0.5" />
                      <span>Wear loose-fitting trousers or shorts that easily roll above knees</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-mv-forest shrink-0 mt-0.5" />
                      <span>Maintain normal hydration; fasting is not required for leg Doppler</span>
                    </li>
                  </ul>
                </div>

                {/* Emergency Safety Notice */}
                <div className="p-3 rounded-2xl bg-white border border-mv-outline text-[11px] text-mv-ink-muted space-y-1">
                  <strong className="text-mv-forest block">Suspect Acute DVT or Sudden Clot?</strong>
                  <span>
                    Sudden asymmetric calf swelling or shortness of breath requires immediate emergency hospital care. Call 112 or 108.
                  </span>
                </div>
              </div>

            </div>
          ) : (
            <DemoRequestResult summary={demoResult} onClose={handleResetModal} />
          )}
        </div>

      </div>
    </div>
  );
};

