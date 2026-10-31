import React, { useState, useRef } from 'react';
import {
  ClipboardList,
  Camera,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Upload,
  Trash2,
  ShieldCheck,
  Stethoscope,
  Info,
  Clock,
  Sparkles,
  Phone,
  HelpCircle,
  Eye,
  Activity,
  Calendar,
  AlertOctagon,
  FileCheck,
  Plus
} from 'lucide-react';
import { AppView, PatientUser, ExpertReviewSubmission, ReviewAttachment } from '../../types';
import { trackEvent } from '../../utils/analytics';

interface LegAssessmentPageProps {
  onNavigateHome: () => void;
  onNavigateView: (view: AppView) => void;
  onOpenBooking: () => void;
  currentUser: PatientUser | null;
  onRequireAuth?: () => void;
  onSubmissionComplete?: (submission: ExpertReviewSubmission) => void;
  onOpenAssistantWithPrompt?: (prompt: string) => void;
}

// ---------------------------------------------------------------------------
// QUESTIONNAIRE DATA STRUCTURES
// ---------------------------------------------------------------------------

interface QuestionnaireData {
  visibleSymptoms: string[];
  physicalSymptoms: string[];
  frequency: string;
  duration: string;
  dailyImpact: string;
}

const VISIBLE_SYMPTOM_OPTIONS = [
  { id: 'none', label: 'No visible veins', note: 'Legs appear cosmetically normal with no evident enlargement' },
  { id: 'spider', label: 'Spider veins (fine red/blue threads)', note: 'Small superficial telangiectasias or reticular veins' },
  { id: 'small_varicose', label: 'Small visible varicose veins', note: 'Mild superficial vein enlargement without major rope-like protrusion' },
  { id: 'prominent_bulging', label: 'Prominent or bulging veins', note: 'Elevated, tortuous superficial veins palpable above skin surface' },
  { id: 'discolouration', label: 'Skin discolouration around the ankle', note: 'Brownish or reddish pigmentation (hemosiderin deposition)' },
  { id: 'skin_hardening', label: 'Skin hardening or eczema-like changes', note: 'Tight, firm, or itchy, flaky skin around lower calf/ankle' },
  { id: 'open_ulcer', label: 'Open wound or ulcer near the ankle or lower leg', note: 'Active skin breakdown, shallow sore, or slow-healing venous ulcer' },
];

const PHYSICAL_SYMPTOM_OPTIONS = [
  { id: 'none', label: 'No symptoms', note: 'No noticeable discomfort, pain, or tiredness in legs' },
  { id: 'heaviness', label: 'Leg heaviness', note: 'Sensation of weights on legs, especially in late afternoon' },
  { id: 'aching', label: 'Aching or pain', note: 'Dull, throbbing discomfort relieved by elevation or rest' },
  { id: 'swelling', label: 'Swelling (especially by end of day)', note: 'Puffy ankles, tight socks or shoes after standing' },
  { id: 'itching', label: 'Itching', note: 'Irritation or eczema-like itch over veins or near ankles' },
  { id: 'night_cramps', label: 'Night cramps', note: 'Calf spasms or restlessness awakening you at night' },
  { id: 'burning_throbbing', label: 'Burning or throbbing sensation', note: 'Warmth, tingling, or pulsatile ache along vein courses' },
];

const FREQUENCY_OPTIONS = [
  { id: 'occasionally', label: 'Occasionally', note: 'Once in a while after prolonged strenuous standing' },
  { id: 'few_days', label: 'A few days per week', note: 'Comes and goes intermittently throughout the week' },
  { id: 'most_days', label: 'Most days', note: 'Present on 4–6 days of the week by the evening' },
  { id: 'every_day', label: 'Every day', note: 'Daily, persistent discomfort or visible concern' },
];

const DURATION_OPTIONS = [
  { id: 'less_1m', label: 'Less than one month', note: 'Recently noticed signs or sudden onset' },
  { id: '1_6m', label: '1–6 months', note: 'Sub-acute symptoms developing over recent months' },
  { id: '6_12m', label: '6–12 months', note: 'Ongoing symptoms for approximately one year' },
  { id: 'more_1y', label: 'More than one year', note: 'Long-standing or chronic vein changes' },
];

const IMPACT_OPTIONS = [
  { id: 'none', label: 'No impact', note: 'Does not interfere with work, hobbies, or daily routines' },
  { id: 'mild', label: 'Mild discomfort', note: 'Noticeable at end of day but manages regular routines' },
  { id: 'standing_difficulty', label: 'Difficulty standing for long periods', note: 'Requires sitting down, elevating legs, or taking frequent breaks' },
  { id: 'walking_difficulty', label: 'Difficulty walking or completing daily activities', note: 'Limits walking distance, mobility, exercise, or work tasks' },
];

export const LegAssessmentPage: React.FC<LegAssessmentPageProps> = ({
  onNavigateHome,
  onNavigateView,
  onOpenBooking,
  currentUser,
  onRequireAuth,
  onSubmissionComplete,
  onOpenAssistantWithPrompt,
}) => {
  // Step State: 1 to 5 = Questions, 6 = Results & Photo Upload, 7 = Completed Confirmation
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Questionnaire responses
  const [answers, setAnswers] = useState<QuestionnaireData>({
    visibleSymptoms: [],
    physicalSymptoms: [],
    frequency: '',
    duration: '',
    dailyImpact: '',
  });

  // Photo uploads by category
  const [leftLegPhotos, setLeftLegPhotos] = useState<ReviewAttachment[]>([]);
  const [rightLegPhotos, setRightLegPhotos] = useState<ReviewAttachment[]>([]);
  const [closeupPhotos, setCloseupPhotos] = useState<ReviewAttachment[]>([]);
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [consentGiven, setConsentGiven] = useState(false);

  // Inline patient details (if not logged in)
  const [guestName, setGuestName] = useState(currentUser?.name || '');
  const [guestPhone, setGuestPhone] = useState(currentUser?.phone || '');
  const [guestCity, setGuestCity] = useState('Bengaluru');

  // Submission handling
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [completedSubmission, setCompletedSubmission] = useState<ExpertReviewSubmission | null>(null);

  // References
  const photoSectionRef = useRef<HTMLDivElement>(null);
  const leftInputRef = useRef<HTMLInputElement>(null);
  const rightInputRef = useRef<HTMLInputElement>(null);
  const closeupInputRef = useRef<HTMLInputElement>(null);

  // Helpers for multi-select
  const handleToggleVisible = (label: string) => {
    setAnswers((prev) => {
      if (label === 'No visible veins') {
        return { ...prev, visibleSymptoms: ['No visible veins'] };
      }
      const filtered = prev.visibleSymptoms.filter((item) => item !== 'No visible veins');
      if (filtered.includes(label)) {
        return { ...prev, visibleSymptoms: filtered.filter((item) => item !== label) };
      } else {
        return { ...prev, visibleSymptoms: [...filtered, label] };
      }
    });
  };

  const handleTogglePhysical = (label: string) => {
    setAnswers((prev) => {
      if (label === 'No symptoms') {
        return { ...prev, physicalSymptoms: ['No symptoms'] };
      }
      const filtered = prev.physicalSymptoms.filter((item) => item !== 'No symptoms');
      if (filtered.includes(label)) {
        return { ...prev, physicalSymptoms: filtered.filter((item) => item !== label) };
      } else {
        return { ...prev, physicalSymptoms: [...filtered, label] };
      }
    });
  };

  // File Upload Helper
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleFileUpload = (
    files: FileList | null,
    target: 'left' | 'right' | 'closeup'
  ) => {
    if (!files) return;
    setUploadError(null);

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const totalCurrentPhotos = leftLegPhotos.length + rightLegPhotos.length + closeupPhotos.length;

    if (totalCurrentPhotos + files.length > 8) {
      setUploadError('You can upload a maximum of 8 leg photographs in total.');
      return;
    }

    Array.from(files).forEach((file) => {
      if (!validTypes.includes(file.type)) {
        setUploadError(`Unsupported format: ${file.name}. Please upload JPEG, PNG, or WEBP photos.`);
        return;
      }

      if (file.size > 15 * 1024 * 1024) {
        setUploadError(`File exceeds 15MB limit: ${file.name}`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const attachment: ReviewAttachment = {
          id: 'photo_' + Math.random().toString(36).substring(2, 9),
          name: file.name,
          size: formatFileSize(file.size),
          type: 'image',
          dataUrl: e.target?.result as string,
        };

        if (target === 'left') setLeftLegPhotos((prev) => [...prev, attachment]);
        else if (target === 'right') setRightLegPhotos((prev) => [...prev, attachment]);
        else setCloseupPhotos((prev) => [...prev, attachment]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemovePhoto = (id: string, target: 'left' | 'right' | 'closeup') => {
    if (target === 'left') setLeftLegPhotos((prev) => prev.filter((p) => p.id !== id));
    else if (target === 'right') setRightLegPhotos((prev) => prev.filter((p) => p.id !== id));
    else setCloseupPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  // Severity Evaluation
  const computeSeverity = () => {
    let score = 0;
    const contributingFactors: string[] = [];

    // Visible signs scoring
    if (answers.visibleSymptoms.includes('Open wound or ulcer near the ankle or lower leg')) {
      score += 8;
      contributingFactors.push('Active lower leg or ankle ulceration reported');
    }
    if (answers.visibleSymptoms.includes('Skin hardening or eczema-like changes')) {
      score += 6;
      contributingFactors.push('Firm, indurated skin or venous eczema changes');
    }
    if (answers.visibleSymptoms.includes('Skin discolouration around the ankle')) {
      score += 4;
      contributingFactors.push('Hyperpigmentation / skin staining around lower leg');
    }
    if (answers.visibleSymptoms.includes('Prominent or bulging veins')) {
      score += 3;
      contributingFactors.push('Prominently bulging, palpable superficial veins');
    }
    if (answers.visibleSymptoms.includes('Small visible varicose veins')) {
      score += 2;
      contributingFactors.push('Small visible varicose veins');
    }
    if (answers.visibleSymptoms.includes('Spider veins (fine red/blue threads)')) {
      score += 1;
      contributingFactors.push('Superficial spider veins (telangiectasias)');
    }

    // Physical symptoms scoring
    if (answers.physicalSymptoms.includes('Swelling (especially by end of day)')) {
      score += 3;
      contributingFactors.push('End-of-day lower limb swelling / oedema');
    }
    if (answers.physicalSymptoms.includes('Aching or pain')) {
      score += 2;
      contributingFactors.push('Vascular aching relieved by elevation');
    }
    if (answers.physicalSymptoms.includes('Burning or throbbing sensation')) {
      score += 2;
      contributingFactors.push('Localized burning or pulsatile vein discomfort');
    }
    if (answers.physicalSymptoms.includes('Night cramps')) {
      score += 1;
      contributingFactors.push('Nocturnal muscle spasms / cramps');
    }
    if (answers.physicalSymptoms.includes('Itching')) {
      score += 1;
      contributingFactors.push('Venous stasis pruritus / itching');
    }
    if (answers.physicalSymptoms.includes('Leg heaviness')) {
      score += 1;
      contributingFactors.push('Tired, heavy sensation in lower legs');
    }

    // Frequency scoring
    if (answers.frequency === 'Every day') {
      score += 4;
      contributingFactors.push('Daily persistent symptom occurrence');
    } else if (answers.frequency === 'Most days') {
      score += 3;
      contributingFactors.push('Frequent occurrence on most days of the week');
    } else if (answers.frequency === 'A few days per week') {
      score += 2;
    } else if (answers.frequency === 'Occasionally') {
      score += 1;
    }

    // Duration scoring
    if (answers.duration === 'More than one year') {
      score += 3;
      contributingFactors.push('Chronic timeline exceeding twelve months');
    } else if (answers.duration === '6–12 months') {
      score += 2;
    } else if (answers.duration === '1–6 months') {
      score += 1;
    }

    // Impact scoring
    if (answers.dailyImpact === 'Difficulty walking or completing daily activities') {
      score += 5;
      contributingFactors.push('Direct interference with walking mobility and daily activities');
    } else if (answers.dailyImpact === 'Difficulty standing for long periods') {
      score += 3;
      contributingFactors.push('Significant limitation during prolonged standing');
    } else if (answers.dailyImpact === 'Mild discomfort') {
      score += 1;
    }

    const hasUlcer = answers.visibleSymptoms.includes('Open wound or ulcer near the ankle or lower leg');
    const hasSkinHardening = answers.visibleSymptoms.includes('Skin hardening or eczema-like changes');
    const hasSevereImpairment = answers.dailyImpact === 'Difficulty walking or completing daily activities';

    let severityCategory = 'Minimal reported symptoms';
    let severityColor = 'text-gray-700 bg-gray-50 border-gray-200';
    let summaryText = 'Few or no prominent visible vein changes or physical discomfort reported. Regular walking and circulation support habits are recommended.';

    if (hasUlcer || (hasSkinHardening && hasSevereImpairment) || score >= 18) {
      severityCategory = 'Symptoms requiring prompt clinical assessment';
      severityColor = 'text-red-900 bg-red-50 border-red-200';
      summaryText = 'The combination of reported skin changes, active ulceration, or severe mobility interference warrants prompt in-person clinical assessment by a vascular surgeon.';
    } else if (score >= 12) {
      severityCategory = 'Significant symptoms';
      severityColor = 'text-amber-900 bg-amber-50 border-amber-200';
      summaryText = 'Notable combination of visible venous engorgement, frequent leg swelling or pain, and standing discomfort. A venous duplex ultrasound scan is recommended to map refluxing veins.';
    } else if (score >= 7) {
      severityCategory = 'Moderate symptoms';
      severityColor = 'text-mv-forest bg-[#EBF3EF] border-[#C5D9CE]';
      summaryText = 'Visible vein enlargement accompanied by recurring ache or end-of-day swelling without active skin breakdown. Medical evaluation and graduated compression can provide structured relief.';
    } else if (score >= 3) {
      severityCategory = 'Mild symptoms';
      severityColor = 'text-mv-forest bg-[#F4F7F5] border-mv-outline';
      summaryText = 'Early or localized signs such as spider veins or intermittent leg fatigue. Monitoring changes, elevating legs, and staying active are helpful first steps.';
    }

    return {
      score,
      severityCategory,
      severityColor,
      summaryText,
      contributingFactors,
      hasUlcer,
    };
  };

  const severityData = computeSeverity();

  // Scroll to photo upload
  const handleScrollToPhotos = () => {
    if (photoSectionRef.current) {
      photoSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Submit Handler
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError(null);

    const allPhotos = [...leftLegPhotos, ...rightLegPhotos, ...closeupPhotos];

    if (allPhotos.length === 0) {
      setUploadError('Please upload at least one photograph of the affected leg area for clinical review.');
      return;
    }

    if (!consentGiven) {
      setUploadError('Please tick the consent box to confirm medical review of your details.');
      return;
    }

    const patientName = currentUser?.name || guestName.trim() || 'Patient';
    const patientPhone = currentUser?.phone || guestPhone.trim();

    if (!currentUser && (!patientName || !patientPhone)) {
      setUploadError('Please provide your full name and phone number so our medical team can reach you with review feedback.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);

      const newSubmission: ExpertReviewSubmission = {
        id: 'REV-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000),
        category: 'leg-photos',
        patientId: currentUser?.id || 'guest_' + Math.random().toString(36).substring(2, 8),
        patientName,
        patientPhone: patientPhone || 'Not provided',
        submittedAt: new Date().toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        status: 'Submitted — In Triage',
        attachments: allPhotos,
        notes: [
          `Reported Severity: ${severityData.severityCategory} (Score: ${severityData.score})`,
          `Visible Signs: ${answers.visibleSymptoms.join(', ') || 'None selected'}`,
          `Physical Symptoms: ${answers.physicalSymptoms.join(', ') || 'None selected'}`,
          `Frequency: ${answers.frequency || 'Not stated'} | Duration: ${answers.duration || 'Not stated'}`,
          `Impact: ${answers.dailyImpact || 'Not stated'}`,
          clinicalNotes.trim() ? `Patient Notes: ${clinicalNotes.trim()}` : '',
          guestCity ? `Location: ${guestCity}` : '',
        ]
          .filter(Boolean)
          .join('\n'),
        consentGiven: true,
      };

      setCompletedSubmission(newSubmission);
      setCurrentStep(7); // View confirmation screen

      // Save to localStorage
      try {
        const existing = JSON.parse(localStorage.getItem('meridian_review_submissions') || '[]');
        localStorage.setItem('meridian_review_submissions', JSON.stringify([newSubmission, ...existing]));
      } catch (err) {
        console.warn('Storage save failed', err);
      }

      if (onSubmissionComplete) {
        onSubmissionComplete(newSubmission);
      }

      trackEvent('simulated_booking_submitted', { filesCount: allPhotos.length });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 850);
  };

  // -------------------------------------------------------------------------
  // RENDER: STEP 7 CONFIRMATION STATE
  // -------------------------------------------------------------------------
  if (currentStep === 7 && completedSubmission) {
    return (
      <div className="py-12 sm:py-16 md:py-20 bg-[#FAF7F2]">
        <div className="container-page max-w-3xl px-4 sm:px-6">
          <div className="bg-white rounded-3xl border border-mv-outline/70 p-6 sm:p-10 shadow-sm text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <span className="inline-block px-3.5 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase bg-mv-pale text-mv-forest mb-3">
              Case Reference: {completedSubmission.id}
            </span>

            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-mv-forest tracking-tight">
              Leg Photographs &amp; Assessment Submitted
            </h1>

            <p className="mt-3 text-sm sm:text-base text-mv-ink-muted leading-relaxed max-w-xl mx-auto">
              Your questionnaire responses and {completedSubmission.attachments.length} leg photograph
              {completedSubmission.attachments.length > 1 ? 's have' : ' has'} been securely queued for clinical triage
              by our senior vascular team.
            </p>

            {/* Status Card */}
            <div className="mt-8 p-5 sm:p-6 rounded-2xl bg-[#F7F5EF] border border-mv-outline/50 text-left max-w-xl mx-auto space-y-3">
              <div className="flex items-center justify-between border-b border-mv-outline/40 pb-3">
                <span className="text-xs font-mono font-semibold uppercase text-mv-ink-muted">Triage Status</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  {completedSubmission.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs sm:text-sm text-mv-ink-muted">
                <span>Patient Name</span>
                <span className="font-medium text-mv-forest">{completedSubmission.patientName}</span>
              </div>
              <div className="flex items-center justify-between text-xs sm:text-sm text-mv-ink-muted">
                <span>Indicative Severity</span>
                <span className="font-medium text-mv-forest">{severityData.severityCategory}</span>
              </div>
              <div className="flex items-center justify-between text-xs sm:text-sm text-mv-ink-muted">
                <span>Submitted At</span>
                <span className="font-medium text-mv-forest">{completedSubmission.submittedAt}</span>
              </div>
            </div>

            {/* What happens next */}
            <div className="mt-8 text-left max-w-xl mx-auto space-y-4">
              <h3 className="font-serif text-lg font-semibold text-mv-forest flex items-center gap-2">
                <Clock className="w-5 h-5 text-mv-cta" />
                What Happens Next
              </h3>
              <div className="space-y-3 text-xs sm:text-sm text-mv-ink-muted">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-mv-pale text-mv-forest flex items-center justify-center shrink-0 font-mono text-xs font-bold mt-0.5">
                    1
                  </div>
                  <p>
                    <strong className="text-mv-forest font-semibold">Triage Review (24–48 Hours):</strong> A qualified vascular specialist evaluates your reported symptoms and visible vein images to gauge clinical urgency.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-mv-pale text-mv-forest flex items-center justify-center shrink-0 font-mono text-xs font-bold mt-0.5">
                    2
                  </div>
                  <p>
                    <strong className="text-mv-forest font-semibold">Clinician Feedback:</strong> You will receive a secure clinical summary message with recommendations regarding Doppler ultrasound testing and clinic visit suitability.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-mv-pale text-mv-forest flex items-center justify-center shrink-0 font-mono text-xs font-bold mt-0.5">
                    3
                  </div>
                  <p>
                    <strong className="text-mv-forest font-semibold">Duplex Ultrasound Plan:</strong> If venous reflux or skin damage is indicated, an in-person duplex scan at our clinic will be arranged to map valve function accurately.
                  </p>
                </div>
              </div>
            </div>

            {/* Demo Notice */}
            <div className="mt-8 p-4 rounded-xl bg-amber-50/70 border border-amber-200/60 text-left text-xs text-amber-900 max-w-xl mx-auto flex items-start gap-3">
              <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <p>
                <strong>Demonstration &amp; Clinical Safety Notice:</strong> This interactive review portal runs on demonstration mode. Your uploaded photographs remain securely on your local device. In actual clinical care, in-person duplex ultrasound evaluation is required for all treatment decisions.
              </p>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={onOpenBooking}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-mv-cta text-white font-medium text-sm hover:bg-[#b84e36] transition shadow-sm inline-flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Schedule Clinic Consultation
              </button>
              <button
                type="button"
                onClick={onNavigateHome}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#FAF7F2] text-mv-forest font-medium text-sm border border-mv-outline hover:bg-mv-pale transition inline-flex items-center justify-center gap-2"
              >
                Return to Homepage
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // RENDER: MAIN ASSESSMENT & UPLOAD FLOW
  // -------------------------------------------------------------------------
  return (
    <div className="bg-[#FAF7F2] min-h-screen">
      {/* Hero Header */}
      <section className="border-b border-mv-outline/50 bg-[#F4F1EA] py-10 sm:py-14 md:py-16">
        <div className="container-page max-w-4xl px-4 sm:px-6">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-mv-forest mb-4">
            <button
              onClick={onNavigateHome}
              className="hover:underline flex items-center gap-1 text-mv-ink-muted hover:text-mv-forest"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Home
            </button>
            <span>/</span>
            <span className="font-bold text-mv-forest">Leg Severity Assessment &amp; Expert Review</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-6 justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mv-pale text-mv-forest text-xs font-mono font-bold uppercase tracking-wider mb-3">
                <ClipboardList className="w-3.5 h-3.5 text-mv-cta" />
                <span>Personal Assessment &amp; Review</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-mv-forest tracking-tight">
                Understand Your Leg Symptoms. Take the Next Step.
              </h1>
              <p className="mt-3 text-base sm:text-lg text-mv-ink-muted leading-relaxed">
                Answer a few questions about your symptoms and, if you wish, upload photographs for review by our clinical team.
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-3 bg-white p-3.5 rounded-2xl border border-mv-outline/60 shadow-sm">
              <picture>
                <img
                  src="/assets/icons2/mv-icon-feetscan.png"
                  alt="Feetscan"
                  className="w-16 h-16 object-contain"
                />
              </picture>
              <div className="text-left text-xs text-mv-ink-muted">
                <span className="font-bold text-mv-forest block text-sm">Clinical Triage</span>
                Non-diagnostic screener &amp; photo portal
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="container-page max-w-4xl px-4 sm:px-6 py-8 sm:py-12">
        {/* Step Indicator (Only during Questions 1–5) */}
        {currentStep <= 5 && (
          <div className="mb-8 bg-white p-5 rounded-2xl border border-mv-outline/60 shadow-xs">
            <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-mv-ink-muted mb-2">
              <span>Section 1: Symptom Questionnaire</span>
              <span className="font-bold text-mv-forest">Step {currentStep} of 5</span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-mv-forest h-full transition-all duration-300 ease-out"
                style={{ width: `${(currentStep / 5) * 100}%` }}
              />
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-mv-ink-muted">
              <span>
                {currentStep === 1 && 'Visible leg signs'}
                {currentStep === 2 && 'Physical sensations & discomfort'}
                {currentStep === 3 && 'Frequency & pattern'}
                {currentStep === 4 && 'Duration of symptoms'}
                {currentStep === 5 && 'Impact on mobility & daily life'}
              </span>
              <span className="text-[11px] italic">Card-based self report</span>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* QUESTION 1: VISIBLE SYMPTOMS */}
        {/* ----------------------------------------------------------------- */}
        {currentStep === 1 && (
          <div className="bg-white rounded-3xl border border-mv-outline/70 p-6 sm:p-8 shadow-xs">
            <div className="mb-6">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-mv-cta">Question 1 of 5</span>
              <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-mv-forest">
                What visible vein or skin changes do you see on your legs?
              </h2>
              <p className="mt-2 text-sm text-mv-ink-muted">
                Select all that apply to either leg. If your legs look normal, choose &ldquo;No visible veins&rdquo;.
              </p>
            </div>

            <div className="space-y-3">
              {VISIBLE_SYMPTOM_OPTIONS.map((opt) => {
                const isSelected = answers.visibleSymptoms.includes(opt.label);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleToggleVisible(opt.label)}
                    className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all flex items-start gap-3.5 ${
                      isSelected
                        ? 'border-mv-forest bg-mv-pale/40 ring-1 ring-mv-forest/20 shadow-xs'
                        : 'border-mv-outline/60 hover:border-mv-forest/40 hover:bg-gray-50/60 bg-white'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition ${
                        isSelected ? 'bg-mv-forest border-mv-forest text-white' : 'border-gray-300 bg-white'
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <div className="font-medium text-sm sm:text-base text-mv-forest">{opt.label}</div>
                      <div className="text-xs text-mv-ink-muted mt-0.5">{opt.note}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div className="mt-8 pt-5 border-t border-mv-outline/40 flex items-center justify-between">
              <button
                type="button"
                onClick={onNavigateHome}
                className="px-4 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider text-mv-ink-muted hover:text-mv-forest flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
              </button>

              <button
                type="button"
                disabled={answers.visibleSymptoms.length === 0}
                onClick={() => setCurrentStep(2)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium flex items-center gap-2 transition ${
                  answers.visibleSymptoms.length > 0
                    ? 'bg-mv-forest text-white hover:bg-mv-forest/90 shadow-xs'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* QUESTION 2: PHYSICAL SYMPTOMS */}
        {/* ----------------------------------------------------------------- */}
        {currentStep === 2 && (
          <div className="bg-white rounded-3xl border border-mv-outline/70 p-6 sm:p-8 shadow-xs">
            <div className="mb-6">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-mv-cta">Question 2 of 5</span>
              <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-mv-forest">
                What physical sensations or discomfort do you experience in your legs?
              </h2>
              <p className="mt-2 text-sm text-mv-ink-muted">
                Select all sensations that you notice, particularly towards the end of the day or after prolonged standing.
              </p>
            </div>

            <div className="space-y-3">
              {PHYSICAL_SYMPTOM_OPTIONS.map((opt) => {
                const isSelected = answers.physicalSymptoms.includes(opt.label);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleTogglePhysical(opt.label)}
                    className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all flex items-start gap-3.5 ${
                      isSelected
                        ? 'border-mv-forest bg-mv-pale/40 ring-1 ring-mv-forest/20 shadow-xs'
                        : 'border-mv-outline/60 hover:border-mv-forest/40 hover:bg-gray-50/60 bg-white'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition ${
                        isSelected ? 'bg-mv-forest border-mv-forest text-white' : 'border-gray-300 bg-white'
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <div className="font-medium text-sm sm:text-base text-mv-forest">{opt.label}</div>
                      <div className="text-xs text-mv-ink-muted mt-0.5">{opt.note}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div className="mt-8 pt-5 border-t border-mv-outline/40 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider text-mv-ink-muted hover:text-mv-forest flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>

              <button
                type="button"
                disabled={answers.physicalSymptoms.length === 0}
                onClick={() => setCurrentStep(3)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium flex items-center gap-2 transition ${
                  answers.physicalSymptoms.length > 0
                    ? 'bg-mv-forest text-white hover:bg-mv-forest/90 shadow-xs'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* QUESTION 3: FREQUENCY */}
        {/* ----------------------------------------------------------------- */}
        {currentStep === 3 && (
          <div className="bg-white rounded-3xl border border-mv-outline/70 p-6 sm:p-8 shadow-xs">
            <div className="mb-6">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-mv-cta">Question 3 of 5</span>
              <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-mv-forest">
                How frequently do these symptoms occur?
              </h2>
              <p className="mt-2 text-sm text-mv-ink-muted">
                Choose the statement that best reflects your typical week.
              </p>
            </div>

            <div className="space-y-3">
              {FREQUENCY_OPTIONS.map((opt) => {
                const isSelected = answers.frequency === opt.label;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setAnswers((prev) => ({ ...prev, frequency: opt.label }))}
                    className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all flex items-start gap-3.5 ${
                      isSelected
                        ? 'border-mv-forest bg-mv-pale/40 ring-1 ring-mv-forest/20 shadow-xs'
                        : 'border-mv-outline/60 hover:border-mv-forest/40 hover:bg-gray-50/60 bg-white'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition ${
                        isSelected ? 'border-mv-forest bg-mv-forest text-white' : 'border-gray-300 bg-white'
                      }`}
                    >
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <div>
                      <div className="font-medium text-sm sm:text-base text-mv-forest">{opt.label}</div>
                      <div className="text-xs text-mv-ink-muted mt-0.5">{opt.note}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div className="mt-8 pt-5 border-t border-mv-outline/40 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-4 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider text-mv-ink-muted hover:text-mv-forest flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>

              <button
                type="button"
                disabled={!answers.frequency}
                onClick={() => setCurrentStep(4)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium flex items-center gap-2 transition ${
                  answers.frequency
                    ? 'bg-mv-forest text-white hover:bg-mv-forest/90 shadow-xs'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* QUESTION 4: DURATION */}
        {/* ----------------------------------------------------------------- */}
        {currentStep === 4 && (
          <div className="bg-white rounded-3xl border border-mv-outline/70 p-6 sm:p-8 shadow-xs">
            <div className="mb-6">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-mv-cta">Question 4 of 5</span>
              <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-mv-forest">
                How long have you noticed these leg symptoms?
              </h2>
              <p className="mt-2 text-sm text-mv-ink-muted">
                Approximate timeline of when veins became visible or discomfort started.
              </p>
            </div>

            <div className="space-y-3">
              {DURATION_OPTIONS.map((opt) => {
                const isSelected = answers.duration === opt.label;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setAnswers((prev) => ({ ...prev, duration: opt.label }))}
                    className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all flex items-start gap-3.5 ${
                      isSelected
                        ? 'border-mv-forest bg-mv-pale/40 ring-1 ring-mv-forest/20 shadow-xs'
                        : 'border-mv-outline/60 hover:border-mv-forest/40 hover:bg-gray-50/60 bg-white'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition ${
                        isSelected ? 'border-mv-forest bg-mv-forest text-white' : 'border-gray-300 bg-white'
                      }`}
                    >
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <div>
                      <div className="font-medium text-sm sm:text-base text-mv-forest">{opt.label}</div>
                      <div className="text-xs text-mv-ink-muted mt-0.5">{opt.note}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div className="mt-8 pt-5 border-t border-mv-outline/40 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-4 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider text-mv-ink-muted hover:text-mv-forest flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>

              <button
                type="button"
                disabled={!answers.duration}
                onClick={() => setCurrentStep(5)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium flex items-center gap-2 transition ${
                  answers.duration
                    ? 'bg-mv-forest text-white hover:bg-mv-forest/90 shadow-xs'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* QUESTION 5: IMPACT ON DAILY ACTIVITIES */}
        {/* ----------------------------------------------------------------- */}
        {currentStep === 5 && (
          <div className="bg-white rounded-3xl border border-mv-outline/70 p-6 sm:p-8 shadow-xs">
            <div className="mb-6">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-mv-cta">Question 5 of 5</span>
              <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-mv-forest">
                How do these symptoms impact your daily routine or work?
              </h2>
              <p className="mt-2 text-sm text-mv-ink-muted">
                Understanding physical impairment helps clinicians prioritize care appropriately.
              </p>
            </div>

            <div className="space-y-3">
              {IMPACT_OPTIONS.map((opt) => {
                const isSelected = answers.dailyImpact === opt.label;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setAnswers((prev) => ({ ...prev, dailyImpact: opt.label }))}
                    className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all flex items-start gap-3.5 ${
                      isSelected
                        ? 'border-mv-forest bg-mv-pale/40 ring-1 ring-mv-forest/20 shadow-xs'
                        : 'border-mv-outline/60 hover:border-mv-forest/40 hover:bg-gray-50/60 bg-white'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition ${
                        isSelected ? 'border-mv-forest bg-mv-forest text-white' : 'border-gray-300 bg-white'
                      }`}
                    >
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <div>
                      <div className="font-medium text-sm sm:text-base text-mv-forest">{opt.label}</div>
                      <div className="text-xs text-mv-ink-muted mt-0.5">{opt.note}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div className="mt-8 pt-5 border-t border-mv-outline/40 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="px-4 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider text-mv-ink-muted hover:text-mv-forest flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>

              <button
                type="button"
                disabled={!answers.dailyImpact}
                onClick={() => {
                  setCurrentStep(6);
                  window.scrollTo({ top: 180, behavior: 'smooth' });
                }}
                className={`px-6 py-2.5 rounded-full text-sm font-medium flex items-center gap-2 transition ${
                  answers.dailyImpact
                    ? 'bg-mv-cta text-white hover:bg-[#b84e36] shadow-xs'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                View Results &amp; Upload Photos <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* STEP 6: ASSESSMENT RESULTS SUMMARY + PHOTO UPLOAD SECTION */}
        {/* ----------------------------------------------------------------- */}
        {currentStep === 6 && (
          <div className="space-y-10">
            {/* SECTION TWO: RESULTS SUMMARY */}
            <div className="bg-white rounded-3xl border border-mv-outline/70 p-6 sm:p-10 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-mv-outline/40 pb-6 mb-6">
                <div>
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-mv-forest mb-1">
                    Section 2 &middot; Indicative Symptom Severity
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-mv-forest">
                    Assessment Summary
                  </h2>
                </div>

                <div className={`px-4 py-2 rounded-2xl border text-sm font-bold tracking-tight inline-flex items-center gap-2 self-start ${severityData.severityColor}`}>
                  <Activity className="w-4 h-4" />
                  <span>{severityData.severityCategory}</span>
                </div>
              </div>

              {/* Contributing Factors & Narrative */}
              <div className="space-y-4">
                <p className="text-sm sm:text-base text-mv-ink-muted leading-relaxed">
                  {severityData.summaryText}
                </p>

                {severityData.contributingFactors.length > 0 && (
                  <div className="mt-5 p-5 rounded-2xl bg-[#F7F5EF] border border-mv-outline/40">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-mv-forest mb-3">
                      Key Contributing Factors from Your Answers:
                    </h3>
                    <ul className="space-y-2 text-xs sm:text-sm text-mv-forest">
                      {severityData.contributingFactors.map((factor, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-mv-cta shrink-0 mt-0.5" />
                          <span>{factor}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* CRITICAL MEDICAL DISCLAIMER (STRICT SAFETY) */}
                <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-amber-950">
                    <ShieldCheck className="w-4 h-4 text-amber-700" />
                    Important Clinical &amp; Safety Disclaimer
                  </div>
                  <p>
                    This is an educational symptom assessment based solely on self-reported inputs. It does not provide a formal medical diagnosis, assign a CEAP clinical stage, or confirm venous reflux. A definitive medical diagnosis and customized treatment plan require a physical clinical examination and a bilateral venous duplex ultrasound scan conducted by a vascular specialist.
                  </p>
                </div>

                {/* RED-FLAG ADVISORY (IF ULCER OR EMERGENCY REPORTED) */}
                {severityData.hasUlcer && (
                  <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 text-xs sm:text-sm text-rose-950 space-y-3">
                    <div className="flex items-center gap-2 font-bold text-rose-900">
                      <AlertOctagon className="w-5 h-5 text-rose-600" />
                      Priority Medical Advisory: Lower Leg Skin Breakdown
                    </div>
                    <p className="leading-relaxed">
                      You reported an active skin ulcer or open sore near your ankle or lower leg. Chronic venous ulcers require timely vascular wound care and venous decompression to facilitate healing and prevent bacterial infection. Please arrange an in-person clinical consultation promptly.
                    </p>
                    <div className="pt-2 border-t border-rose-200/60 text-xs text-rose-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <span>Emergency signs (sudden severe one-sided swelling, high fever, chest pain, breathlessness)?</span>
                      <div className="flex items-center gap-2 shrink-0">
                        <a
                          href="tel:112"
                          className="px-3 py-1.5 rounded-full bg-rose-700 text-white font-mono font-bold text-xs hover:bg-rose-800 transition flex items-center gap-1.5"
                        >
                          <Phone className="w-3 h-3" /> Dial 112
                        </a>
                        <a
                          href="tel:108"
                          className="px-3 py-1.5 rounded-full bg-rose-700 text-white font-mono font-bold text-xs hover:bg-rose-800 transition flex items-center gap-1.5"
                        >
                          <Phone className="w-3 h-3" /> Ambulance 108
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions below Results */}
              <div className="mt-8 pt-6 border-t border-mv-outline/40 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={handleScrollToPhotos}
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-mv-cta text-white font-medium text-sm hover:bg-[#b84e36] transition shadow-xs flex items-center justify-center gap-2"
                >
                  Continue to Expert Review (Upload Photos) <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={onOpenBooking}
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#FAF7F2] text-mv-forest font-medium text-sm border border-mv-outline hover:bg-mv-pale transition flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" /> Book Clinic Ultrasound
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="w-full sm:w-auto text-xs font-mono uppercase tracking-wider text-mv-ink-muted hover:text-mv-forest px-3 py-2 text-center"
                >
                  Edit Answers
                </button>
              </div>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* SECTION THREE: UPLOAD LEG PHOTOGRAPHS */}
            {/* ------------------------------------------------------------- */}
            <div
              ref={photoSectionRef}
              className="bg-white rounded-3xl border border-mv-outline/70 p-6 sm:p-10 shadow-xs"
            >
              <div className="border-b border-mv-outline/40 pb-6 mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mv-pale text-mv-forest text-xs font-mono font-bold uppercase tracking-wider mb-2">
                  <Camera className="w-3.5 h-3.5 text-mv-cta" />
                  <span>Section 3 &middot; Visual Triage</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-mv-forest">
                  Upload Leg Photographs for Expert Review
                </h2>
                <p className="mt-2 text-sm sm:text-base text-mv-ink-muted leading-relaxed">
                  Share clear photographs of the affected areas to help our clinical team understand your visible symptoms before your consultation.
                </p>
              </div>

              {/* Photography Guidance Tips */}
              <div className="mb-8 p-5 rounded-2xl bg-[#F7F5EF] border border-mv-outline/50 space-y-3">
                <h3 className="font-serif text-base font-bold text-mv-forest flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-mv-cta" />
                  Tips for Capturing Clinically Useful Photographs:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-mv-ink-muted">
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-mv-forest mt-2 shrink-0" />
                    <span><strong>Natural daylight:</strong> Capture photos in a bright room without harsh camera flash or heavy shadows.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-mv-forest mt-2 shrink-0" />
                    <span><strong>Standing position:</strong> Stand upright if comfortable, allowing venous pressure to reveal bulging veins.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-mv-forest mt-2 shrink-0" />
                    <span><strong>Full lower leg view:</strong> Capture the leg from knee to ankle to show overall vein distribution.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-mv-forest mt-2 shrink-0" />
                    <span><strong>Close-up shots:</strong> Take additional photos of concentrated vein clusters or skin pigmentation.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-mv-forest mt-2 shrink-0" />
                    <span><strong>No filters or editing:</strong> Avoid filters, skin smoothing, or colour adjustments.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-mv-forest mt-2 shrink-0" />
                    <span><strong>Protect privacy:</strong> Do not include faces, background reflections, or identifying marks.</span>
                  </div>
                </div>
              </div>

              {/* Upload Dropzones */}
              <div className="space-y-6">
                {/* Zone 1: Left Leg */}
                <div className="border border-mv-outline/60 rounded-2xl p-4 sm:p-5 bg-[#FAF7F2]/50">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-serif text-base font-semibold text-mv-forest">Left Leg Photographs</h4>
                      <p className="text-xs text-mv-ink-muted">Front, back, or side views of your left leg</p>
                    </div>
                    <span className="text-xs font-mono text-mv-ink-muted">{leftLegPhotos.length} uploaded</span>
                  </div>

                  <input
                    ref={leftInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    className="hidden"
                    onChange={(e) => handleFileUpload(e.target.files, 'left')}
                  />

                  {leftLegPhotos.length === 0 ? (
                    <button
                      type="button"
                      onClick={() => leftInputRef.current?.click()}
                      className="w-full py-6 border-2 border-dashed border-mv-outline/70 rounded-xl hover:border-mv-forest/50 hover:bg-white transition flex flex-col items-center justify-center gap-2 text-mv-ink-muted text-xs sm:text-sm"
                    >
                      <Upload className="w-5 h-5 text-mv-forest/60" />
                      <span>Click to select or drag &amp; drop left leg photos (JPG, PNG, WEBP &middot; Max 15MB)</span>
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {leftLegPhotos.map((photo) => (
                          <div key={photo.id} className="relative group rounded-xl overflow-hidden border border-mv-outline bg-white aspect-square flex flex-col">
                            {photo.dataUrl && (
                              <img src={photo.dataUrl} alt={photo.name} className="w-full h-full object-cover" />
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleRemovePhoto(photo.id, 'left')}
                                className="p-1.5 rounded-full bg-white text-rose-600 hover:bg-rose-50"
                                title="Remove photo"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <span className="absolute bottom-1 left-1 right-1 px-1.5 py-0.5 rounded text-[10px] bg-black/60 text-white truncate">
                              {photo.name}
                            </span>
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => leftInputRef.current?.click()}
                        className="text-xs font-mono text-mv-forest hover:underline flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add more left leg photos
                      </button>
                    </div>
                  )}
                </div>

                {/* Zone 2: Right Leg */}
                <div className="border border-mv-outline/60 rounded-2xl p-4 sm:p-5 bg-[#FAF7F2]/50">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-serif text-base font-semibold text-mv-forest">Right Leg Photographs</h4>
                      <p className="text-xs text-mv-ink-muted">Front, back, or side views of your right leg</p>
                    </div>
                    <span className="text-xs font-mono text-mv-ink-muted">{rightLegPhotos.length} uploaded</span>
                  </div>

                  <input
                    ref={rightInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    className="hidden"
                    onChange={(e) => handleFileUpload(e.target.files, 'right')}
                  />

                  {rightLegPhotos.length === 0 ? (
                    <button
                      type="button"
                      onClick={() => rightInputRef.current?.click()}
                      className="w-full py-6 border-2 border-dashed border-mv-outline/70 rounded-xl hover:border-mv-forest/50 hover:bg-white transition flex flex-col items-center justify-center gap-2 text-mv-ink-muted text-xs sm:text-sm"
                    >
                      <Upload className="w-5 h-5 text-mv-forest/60" />
                      <span>Click to select or drag &amp; drop right leg photos (JPG, PNG, WEBP &middot; Max 15MB)</span>
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {rightLegPhotos.map((photo) => (
                          <div key={photo.id} className="relative group rounded-xl overflow-hidden border border-mv-outline bg-white aspect-square flex flex-col">
                            {photo.dataUrl && (
                              <img src={photo.dataUrl} alt={photo.name} className="w-full h-full object-cover" />
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleRemovePhoto(photo.id, 'right')}
                                className="p-1.5 rounded-full bg-white text-rose-600 hover:bg-rose-50"
                                title="Remove photo"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <span className="absolute bottom-1 left-1 right-1 px-1.5 py-0.5 rounded text-[10px] bg-black/60 text-white truncate">
                              {photo.name}
                            </span>
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => rightInputRef.current?.click()}
                        className="text-xs font-mono text-mv-forest hover:underline flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add more right leg photos
                      </button>
                    </div>
                  )}
                </div>

                {/* Zone 3: Close-Up Photographs */}
                <div className="border border-mv-outline/60 rounded-2xl p-4 sm:p-5 bg-[#FAF7F2]/50">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-serif text-base font-semibold text-mv-forest">Additional Close-Up Photographs</h4>
                      <p className="text-xs text-mv-ink-muted">Close-ups of bulging clusters, ankle discolouration, or sores</p>
                    </div>
                    <span className="text-xs font-mono text-mv-ink-muted">{closeupPhotos.length} uploaded</span>
                  </div>

                  <input
                    ref={closeupInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    className="hidden"
                    onChange={(e) => handleFileUpload(e.target.files, 'closeup')}
                  />

                  {closeupPhotos.length === 0 ? (
                    <button
                      type="button"
                      onClick={() => closeupInputRef.current?.click()}
                      className="w-full py-6 border-2 border-dashed border-mv-outline/70 rounded-xl hover:border-mv-forest/50 hover:bg-white transition flex flex-col items-center justify-center gap-2 text-mv-ink-muted text-xs sm:text-sm"
                    >
                      <Upload className="w-5 h-5 text-mv-forest/60" />
                      <span>Click to select or drag &amp; drop close-up photos (JPG, PNG, WEBP &middot; Max 15MB)</span>
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {closeupPhotos.map((photo) => (
                          <div key={photo.id} className="relative group rounded-xl overflow-hidden border border-mv-outline bg-white aspect-square flex flex-col">
                            {photo.dataUrl && (
                              <img src={photo.dataUrl} alt={photo.name} className="w-full h-full object-cover" />
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleRemovePhoto(photo.id, 'closeup')}
                                className="p-1.5 rounded-full bg-white text-rose-600 hover:bg-rose-50"
                                title="Remove photo"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <span className="absolute bottom-1 left-1 right-1 px-1.5 py-0.5 rounded text-[10px] bg-black/60 text-white truncate">
                              {photo.name}
                            </span>
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => closeupInputRef.current?.click()}
                        className="text-xs font-mono text-mv-forest hover:underline flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add more close-up photos
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Optional Text Field */}
              <div className="mt-6">
                <label className="block text-xs font-mono uppercase tracking-wider text-mv-forest mb-2">
                  Describe the affected area or any specific concerns (Optional)
                </label>
                <textarea
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  placeholder="e.g. Left inner calf aches severely when standing in the evening; discolouration started near ankle 6 months ago..."
                  rows={3}
                  className="w-full rounded-2xl border border-mv-outline/70 p-3.5 text-sm text-mv-forest placeholder-mv-ink-muted/50 focus:border-mv-forest focus:ring-1 focus:ring-mv-forest outline-none transition bg-[#FAF7F2]/40"
                />
              </div>

              {/* Patient Contact Details (if not already logged in) */}
              {!currentUser && (
                <div className="mt-8 p-5 rounded-2xl bg-[#F7F5EF] border border-mv-outline/60">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-serif text-base font-semibold text-mv-forest">
                      Your Contact Details for Clinician Follow-up
                    </h4>
                    {onRequireAuth && (
                      <button
                        type="button"
                        onClick={onRequireAuth}
                        className="text-xs font-mono text-mv-cta hover:underline font-bold"
                      >
                        Have an account? Sign In
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-mv-ink-muted mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        placeholder="e.g. Rajesh Kumar"
                        className="w-full rounded-xl border border-mv-outline/70 p-2.5 text-sm text-mv-forest bg-white focus:border-mv-forest outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-mv-ink-muted mb-1">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        placeholder="e.g. +91 98765 43210"
                        className="w-full rounded-xl border border-mv-outline/70 p-2.5 text-sm text-mv-forest bg-white focus:border-mv-forest outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-mv-ink-muted mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        value={guestCity}
                        onChange={(e) => setGuestCity(e.target.value)}
                        placeholder="e.g. Bengaluru"
                        className="w-full rounded-xl border border-mv-outline/70 p-2.5 text-sm text-mv-forest bg-white focus:border-mv-forest outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Error Notice */}
              {uploadError && (
                <div className="mt-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* SECTION FOUR: CONSENT & PRIVACY */}
              {/* ------------------------------------------------------------- */}
              <div className="mt-8 pt-6 border-t border-mv-outline/40 space-y-4">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={consentGiven}
                    onChange={(e) => setConsentGiven(e.target.checked)}
                    className="w-4 h-4 rounded text-mv-forest border-gray-300 focus:ring-mv-forest mt-0.5 shrink-0"
                  />
                  <span className="text-xs sm:text-sm text-mv-forest leading-relaxed">
                    I consent to the secure clinical review of my symptom details and photographs by the Meridian Vascular medical team. I understand this review is for preliminary evaluation and triage, not a definitive diagnosis or emergency service.
                  </span>
                </label>

                <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-mv-outline/40 text-xs text-mv-ink-muted flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-mv-forest shrink-0 mt-0.5" />
                  <p>
                    <strong>Confidentiality Note:</strong> Your photographs and health information are handled confidentially and stored securely in accordance with healthcare privacy standards. They are only reviewed by authorized clinical staff.
                  </p>
                </div>
              </div>

              {/* ------------------------------------------------------------- */}
              {/* SECTION FIVE: SUBMISSION ACTION */}
              {/* ------------------------------------------------------------- */}
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-mv-outline/40">
                <div className="text-xs text-mv-ink-muted">
                  <span className="font-semibold text-mv-forest block">Next Steps after Submission:</span>
                  Triage within 24–48 hours &middot; Review feedback via phone/WhatsApp
                </div>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleSubmitReview}
                  className={`w-full sm:w-auto px-8 py-3.5 rounded-full text-white font-medium text-sm flex items-center justify-center gap-2 shadow-xs transition ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-wait'
                      : 'bg-mv-cta hover:bg-[#b84e36]'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Submitting for Review...</span>
                    </>
                  ) : (
                    <>
                      <FileCheck className="w-4 h-4" />
                      <span>Submit for Expert Review</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
