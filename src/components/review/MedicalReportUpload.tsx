import React, { useState, useRef } from 'react';
import {
  Upload,
  FileText,
  Image as ImageIcon,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Stethoscope,
  Info,
  Clock,
  ArrowRight,
  UserCheck,
  FileCheck,
  HelpCircle,
  Lock,
} from 'lucide-react';
import { PatientUser, ExpertReviewSubmission, ReviewAttachment } from '../../types';
import { trackEvent } from '../../utils/analytics';

interface MedicalReportUploadProps {
  currentUser: PatientUser | null;
  onRequireAuth: (pendingSubmission: { files: ReviewAttachment[]; notes: string }) => void;
  onSubmissionComplete: (submission: ExpertReviewSubmission) => void;
  onOpenBooking: () => void;
  onNavigateToDashboard?: () => void;
}

export const MedicalReportUpload: React.FC<MedicalReportUploadProps> = ({
  currentUser,
  onRequireAuth,
  onSubmissionComplete,
  onOpenBooking,
  onNavigateToDashboard,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachments, setAttachments] = useState<ReviewAttachment[]>([]);
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [consentGiven, setConsentGiven] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedSubmission, setCompletedSubmission] = useState<ExpertReviewSubmission | null>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    setErrorMsg(null);

    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    const maxFiles = 5;

    if (attachments.length + files.length > maxFiles) {
      setErrorMsg(`You can upload a maximum of ${maxFiles} medical documents per review request.`);
      return;
    }

    Array.from(files).forEach((file) => {
      if (!validTypes.includes(file.type)) {
        setErrorMsg(`Unsupported file type: ${file.name}. Please upload PDF, JPG, or PNG files.`);
        return;
      }

      if (file.size > 15 * 1024 * 1024) {
        setErrorMsg(`File exceeds 15MB size limit: ${file.name}`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const isPdf = file.type === 'application/pdf';
        const newAttachment: ReviewAttachment = {
          id: 'doc_' + Math.random().toString(36).substring(2, 9),
          name: file.name,
          size: formatFileSize(file.size),
          type: isPdf ? 'pdf' : 'image',
          dataUrl: isPdf ? undefined : (e.target?.result as string),
        };
        setAttachments((prev) => [...prev, newAttachment]);
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (attachments.length === 0) {
      setErrorMsg('Please select at least one medical report file (PDF, JPG, or PNG) to upload.');
      return;
    }

    if (!consentGiven) {
      setErrorMsg('Please confirm clinical review consent to proceed.');
      return;
    }

    // Require patient authentication before final submission
    if (!currentUser) {
      onRequireAuth({ files: attachments, notes: clinicalNotes });
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const submission: ExpertReviewSubmission = {
        id: 'REV-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000),
        category: 'medical-reports',
        patientId: currentUser.id,
        patientName: currentUser.name,
        patientPhone: currentUser.phone,
        submittedAt: new Date().toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        status: 'Submitted — In Triage',
        attachments: [...attachments],
        notes: clinicalNotes.trim() || undefined,
        consentGiven: true,
      };

      setCompletedSubmission(submission);
      onSubmissionComplete(submission);
      trackEvent('simulated_booking_submitted', { filesCount: attachments.length });
    }, 700);
  };

  return (
    <div className="py-12 sm:py-16 md:py-20 bg-[#FAF7F2] border-b border-mv-outline/50">
      <div className="container-page max-w-4xl px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-mv-pale text-mv-forest text-xs font-mono font-bold uppercase tracking-wider mb-3">
            <Stethoscope className="w-3.5 h-3.5 text-mv-cta" />
            <span>Physician Case Review</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-mv-forest tracking-tight">
            Upload Your Medical Reports for Expert Review
          </h1>
          <p className="mt-3 text-sm sm:text-base text-mv-ink-muted leading-relaxed">
            Have you already had a venous Doppler ultrasound or clinical scan? Share your medical reports for comprehensive review by a qualified vascular specialist.
          </p>
        </div>

        {!completedSubmission ? (
          <div className="bg-white border border-mv-outline rounded-3xl p-6 sm:p-9 shadow-xs space-y-8">
            
            {/* Clinical Governance Banner */}
            <div className="p-4 sm:p-5 rounded-2xl bg-mv-ivory border border-mv-outline text-xs sm:text-[13px] text-mv-ink-muted leading-relaxed space-y-2">
              <div className="flex items-center gap-2 font-semibold text-mv-forest">
                <ShieldCheck className="w-4 h-4 text-mv-cta shrink-0" />
                <span>Reviewed by Medical Specialists · Zero Algorithmic Guesswork</span>
              </div>
              <p>
                We do not use artificial intelligence or automated machine-learning algorithms to diagnose medical scans or prescribe treatments. Every report you submit is reviewed by an experienced vascular surgeon who evaluates your saphenous reflux duration, vein caliber, and deep venous patency.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* File Upload Zone */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-mv-forest mb-2">
                  1. Select Medical Documents (PDF, JPG, PNG · Max 15MB each, up to 5 files)
                </label>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => handleFiles(e.target.files)}
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleFiles(e.dataTransfer.files);
                  }}
                  className="border-2 border-dashed border-mv-outline hover:border-mv-forest bg-mv-ivory/60 hover:bg-mv-pale/40 rounded-2xl p-8 sm:p-10 text-center transition-all cursor-pointer group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-white border border-mv-outline/80 text-mv-forest group-hover:text-mv-cta mx-auto flex items-center justify-center shadow-2xs mb-3 transition-colors">
                    <Upload className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-base sm:text-lg font-semibold text-mv-forest">
                    Drag and drop your reports here, or <span className="text-mv-cta underline underline-offset-4">browse files</span>
                  </h3>
                  <p className="mt-1 text-xs text-mv-ink-muted max-w-sm mx-auto">
                    Supports standing venous duplex ultrasounds, color Doppler scans, prior surgery summaries, or doctor consultation notes.
                  </p>
                </div>
              </div>

              {/* Selected Files List */}
              {attachments.length > 0 && (
                <div className="space-y-2">
                  <span className="block text-xs font-semibold text-mv-forest">
                    Attached Documents ({attachments.length}/5):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {attachments.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-mv-ivory border border-mv-outline text-xs text-mv-ink shadow-2xs"
                      >
                        <div className="flex items-center gap-2.5 truncate pr-2">
                          {item.type === 'pdf' ? (
                            <FileText className="w-5 h-5 text-red-600 shrink-0" />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-mv-cta shrink-0" />
                          )}
                          <div className="truncate">
                            <span className="font-medium truncate block">{item.name}</span>
                            <span className="text-[11px] text-mv-ink-muted font-mono">{item.size}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveAttachment(item.id)}
                          aria-label={`Remove ${item.name}`}
                          className="p-1.5 text-mv-ink-muted hover:text-red-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Optional Clinical Context */}
              <div>
                <label htmlFor="report-notes" className="block text-xs font-semibold uppercase tracking-wider text-mv-forest mb-1.5">
                  2. Clinical Context / Notes (Optional)
                </label>
                <textarea
                  id="report-notes"
                  rows={3}
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  placeholder="e.g. Scan done 3 months ago due to right calf aching. Prior sclerotherapy done in 2022. Experiencing swelling in evenings."
                  className="w-full bg-mv-ivory border border-mv-outline rounded-2xl p-3.5 text-xs text-mv-ink placeholder:text-mv-ink-muted/60 focus:ring-2 focus:ring-mv-forest/30 focus:border-mv-forest focus:outline-none"
                />
              </div>

              {/* Patient Consent & Confidentiality */}
              <div className="p-4 rounded-2xl bg-mv-pale/40 border border-mv-forest/15 space-y-3">
                <label className="flex items-start gap-3 cursor-pointer text-xs text-mv-ink">
                  <input
                    type="checkbox"
                    checked={consentGiven}
                    onChange={(e) => {
                      setConsentGiven(e.target.checked);
                      if (errorMsg) setErrorMsg(null);
                    }}
                    className="mt-0.5 rounded border-mv-outline text-mv-forest focus:ring-mv-forest w-4 h-4 cursor-pointer"
                  />
                  <span className="leading-relaxed">
                    I confirm that I am uploading my own medical records (or records of someone I am legally authorized to assist). I consent to having these documents securely stored and reviewed by a qualified vascular clinician for educational evaluation and treatment guidance.
                  </span>
                </label>

                <div className="text-[11px] text-mv-ink-muted flex items-center gap-1.5 pt-1 border-t border-mv-forest/10">
                  <Lock className="w-3.5 h-3.5 text-mv-forest" />
                  <span>Confidentiality guaranteed: Files are stored in private cloud storage and never indexed by search engines.</span>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Submission Action */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 bg-mv-cta hover:bg-mv-cta-press disabled:opacity-50 text-white rounded-full text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs tap-tactile"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>
                    {isSubmitting ? 'Securing & Submitting Documents...' : 'Submit Medical Reports for Expert Review'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {currentUser && (
                <div className="text-center text-xs text-mv-ink-muted flex items-center justify-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-mv-forest" />
                  <span>
                    Submitting as authenticated patient: <strong className="text-mv-forest">{currentUser.name}</strong> ({currentUser.phone})
                  </span>
                </div>
              )}
            </form>

            {/* How Review Works - 4 Clear Stages */}
            <div className="pt-6 border-t border-mv-outline/70">
              <h3 className="font-serif text-base font-semibold text-mv-forest mb-4">
                What Happens After You Submit:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-mv-ivory border border-mv-outline/60 space-y-1">
                  <span className="font-mono text-[10px] font-bold text-mv-cta uppercase">Step 01</span>
                  <h4 className="font-semibold text-mv-forest">Secure Intake</h4>
                  <p className="text-[11.5px] text-mv-ink-muted leading-relaxed">
                    Documents are encrypted and cataloged in your private patient vault.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-mv-ivory border border-mv-outline/60 space-y-1">
                  <span className="font-mono text-[10px] font-bold text-mv-cta uppercase">Step 02</span>
                  <h4 className="font-semibold text-mv-forest">Triage Verification</h4>
                  <p className="text-[11.5px] text-mv-ink-muted leading-relaxed">
                    Coordinator checks scan completeness, SFJ parameters, and Doppler clarity.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-mv-ivory border border-mv-outline/60 space-y-1">
                  <span className="font-mono text-[10px] font-bold text-mv-cta uppercase">Step 03</span>
                  <h4 className="font-semibold text-mv-forest">Surgeon Review</h4>
                  <p className="text-[11.5px] text-mv-ink-muted leading-relaxed">
                    Vascular specialist evaluates reflux pathways and disease severity.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-mv-ivory border border-mv-outline/60 space-y-1">
                  <span className="font-mono text-[10px] font-bold text-mv-cta uppercase">Step 04</span>
                  <h4 className="font-semibold text-mv-forest">Review Guidance</h4>
                  <p className="text-[11.5px] text-mv-ink-muted leading-relaxed">
                    Structured findings and personalized care advice sent to your dashboard.
                  </p>
                </div>
              </div>
            </div>

          </div>
        ) : (
          /* Submission Completed & Tracking View */
          <div className="bg-white border border-mv-outline rounded-3xl p-7 sm:p-10 shadow-xs text-center space-y-6 animate-in fade-in">
            <div className="w-16 h-16 rounded-2xl bg-mv-pale text-mv-forest mx-auto flex items-center justify-center shadow-xs border border-mv-forest/15">
              <CheckCircle2 className="w-8 h-8 text-mv-cta" />
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-mono uppercase tracking-[0.14em] font-bold text-mv-forest bg-mv-pale px-3 py-1 rounded-full">
                Review Request Received
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-mv-forest">
                Your Reports Have Been Submitted for Expert Review
              </h2>
              <p className="text-xs sm:text-sm text-mv-ink-muted max-w-md mx-auto leading-relaxed">
                Your medical records are registered under case reference <strong className="font-mono text-mv-forest">{completedSubmission.id}</strong>.
              </p>
            </div>

            {/* Case Details Card */}
            <div className="bg-mv-ivory p-5 sm:p-6 rounded-2xl border border-mv-outline text-left text-xs sm:text-[13px] space-y-3 max-w-lg mx-auto">
              <div className="flex items-center justify-between pb-2.5 border-b border-mv-outline/50">
                <span className="text-mv-ink-muted">Case Reference:</span>
                <span className="font-mono font-bold text-mv-forest">{completedSubmission.id}</span>
              </div>

              <div className="flex items-center justify-between pb-2.5 border-b border-mv-outline/50">
                <span className="text-mv-ink-muted">Current Review Status:</span>
                <span className="inline-flex items-center gap-1 font-semibold text-amber-900 bg-amber-100/70 border border-amber-300 px-2.5 py-0.5 rounded-full text-[11px]">
                  <Clock className="w-3 h-3 text-amber-700" />
                  {completedSubmission.status}
                </span>
              </div>

              <div className="flex items-center justify-between pb-2.5 border-b border-mv-outline/50">
                <span className="text-mv-ink-muted">Patient:</span>
                <span className="font-medium text-mv-forest">{completedSubmission.patientName} ({completedSubmission.patientPhone})</span>
              </div>

              <div className="flex items-center justify-between pb-2.5 border-b border-mv-outline/50">
                <span className="text-mv-ink-muted">Submitted At:</span>
                <span className="text-mv-forest">{completedSubmission.submittedAt}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-mv-ink-muted">Attached Documents:</span>
                <span className="font-medium text-mv-forest">{completedSubmission.attachments.length} file(s)</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 text-left max-w-lg mx-auto leading-relaxed">
              <strong className="text-slate-900 block mb-1">What Happens Next:</strong>
              Our clinical coordinator will verify the Doppler measurements (SFJ reflux and vein calibers). Your case will be assigned to a credentialed vascular surgeon. In a live hospital deployment, you will receive an SMS notification once your written clinical summary is ready in your Patient Dashboard.
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              {onNavigateToDashboard && (
                <button
                  type="button"
                  onClick={onNavigateToDashboard}
                  className="w-full sm:w-auto px-6 py-3 text-xs sm:text-[13px] font-semibold text-white bg-mv-forest hover:bg-mv-forest-press rounded-full transition-colors cursor-pointer shadow-xs"
                >
                  View Case in Patient Dashboard
                </button>
              )}

              <button
                type="button"
                onClick={onOpenBooking}
                className="w-full sm:w-auto px-6 py-3 text-xs sm:text-[13px] font-semibold text-mv-forest bg-white hover:bg-mv-ivory border border-mv-outline rounded-full transition-colors cursor-pointer"
              >
                Schedule Clinic Consultation
              </button>

              <button
                type="button"
                onClick={() => {
                  setCompletedSubmission(null);
                  setAttachments([]);
                  setClinicalNotes('');
                }}
                className="w-full sm:w-auto px-5 py-3 text-xs font-semibold text-mv-ink-muted hover:text-mv-forest transition-colors cursor-pointer"
              >
                Upload Another Report
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
