/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { AppView, AssessmentResult, SymptomSeverityLevel, PatientUser, ExpertReviewSubmission } from './types';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import {
  VisualEnvironmentsSection,
  CarePathwaySequence,
  TrustAndValueSection,
  CuratedFaqSection,
} from './components/home/HomeSections';
import { LearnView } from './components/LearnView';
import { VascularCareJourney } from './components/VascularCareJourney';
import { DegreeAssessment } from './components/DegreeAssessment';
import { LegAssessmentPage } from './components/assessment/LegAssessmentPage';
import { ClinicalMediaSection } from './components/ClinicalMediaSection';
import { DuplexUltrasoundExplorer } from './components/DuplexUltrasoundExplorer';
import { DopplerEducationGuide } from './components/DopplerEducationGuide';
import { DopplerReportDecoder } from './components/DopplerReportDecoder';
import { DoctorDirectory } from './components/DoctorDirectory';
import { DoctorVisitGuide } from './components/DoctorVisitGuide';
import { PatientPortal, SavedDossierQuestion } from './components/PatientPortal';
import { PatientDashboard } from './components/dashboard/PatientDashboard';
import { PatientAuthModal } from './components/auth/PatientAuthModal';
import { MedicalReportUpload } from './components/review/MedicalReportUpload';
import { MeridbotScrollCompanion } from './components/meridbot/MeridbotScrollCompanion';
import { TreatmentModalities } from './components/TreatmentModalities';
import { TreatmentComparison } from './components/TreatmentComparison';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { ClearPixAssistantModal } from './components/ClearPixAssistantModal';
import { AppointmentModal } from './components/AppointmentModal';
import { UploadedMediaItem } from './components/MediaUploader';
import { DoctorProfile } from './data/doctorsData';
import {
  ROUTED_VIEWS,
  SECTION_ALIASES,
  SECTION_VIEWS,
  VIEW_TITLES,
  hrefForView,
  LearnTopicSlug,
  getLearnTopic,
  ANCHOR_TO_LEARN_SLUG,
} from './content/siteNav';
import { ResearchView } from './components/research/ResearchView';
import { getArticle } from './content/research/articles';
import { InsuranceEducation } from './components/InsuranceEducation';
import { PageHero } from './components/scene/PageHero';

/** Resolves the URL hash to a view and, for in-page anchors, the section to scroll to. */
function parseHash(raw: string): {
  view: AppView | null;
  section: string | null;
  article?: string | null;
  learnTopic?: LearnTopicSlug | null;
} {
  if (!raw || raw === 'top' || raw === 'home') return { view: 'home', section: null, learnTopic: null };
  if (raw.startsWith('research/')) {
    const slug = raw.slice('research/'.length);
    return { view: 'research', section: null, article: getArticle(slug) ? slug : null, learnTopic: null };
  }
  if (raw === 'research') return { view: 'research', section: null, article: null, learnTopic: null };

  if (raw.startsWith('learn/')) {
    const slug = raw.slice('learn/'.length) as LearnTopicSlug;
    const topic = getLearnTopic(slug);
    return { view: 'learn', section: null, learnTopic: topic ? slug : null };
  }
  if (raw === 'learn') return { view: 'learn', section: null, learnTopic: null };

  // Check if raw is a legacy anchor that maps to a dedicated learn topic
  if (ANCHOR_TO_LEARN_SLUG[raw]) {
    return { view: 'learn', section: null, learnTopic: ANCHOR_TO_LEARN_SLUG[raw] };
  }

  if ((ROUTED_VIEWS as string[]).includes(raw)) return { view: raw as AppView, section: null, learnTopic: null };
  if (SECTION_VIEWS[raw]) return { view: SECTION_VIEWS[raw], section: SECTION_ALIASES[raw] ?? raw, learnTopic: null };
  // Any other anchor (e.g. the skip link target) belongs to the current view.
  return { view: null, section: null, learnTopic: null };
}

const readHash = () => decodeURIComponent(window.location.hash.replace(/^#/, ''));
const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// A new view is a new page: jump to the top instead of inheriting the CSS smooth scrolling.
const jumpToTop = () => window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>(() => parseHash(readHash()).view ?? 'home');
  const [sectionRequest, setSectionRequest] = useState<{ id: string; at: number } | null>(null);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [assistantPrompt, setAssistantPrompt] = useState('');
  const [bookingScore, setBookingScore] = useState<number | null>(null);
  const [bookingPattern, setBookingPattern] = useState<SymptomSeverityLevel | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorProfile | null>(null);
  const [researchArticle, setResearchArticle] = useState<string | null>(() => parseHash(readHash()).article ?? null);
  const [learnTopic, setLearnTopic] = useState<LearnTopicSlug | null>(() => parseHash(readHash()).learnTopic ?? null);
  const mainRef = useRef<HTMLElement>(null);
  const isFirstViewRender = useRef(true);
  const isFirstArticleRender = useRef(true);
  const isFirstLearnTopicRender = useRef(true);

  // Shared patient media uploads (Photos & Videos)
  const [mediaItems, setMediaItems] = useState<UploadedMediaItem[]>([]);

  // Shared pre-consultation dossier questions collected across journey
  const [savedQuestions, setSavedQuestions] = useState<SavedDossierQuestion[]>([]);

  // Persistent assessment state across view switches
  const [assessmentAnswers, setAssessmentAnswers] = useState<Record<number, number>>({});
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  const [assessmentPatientName, setAssessmentPatientName] = useState<string>('');

  // Patient Auth & Expert Review state
  const [patientUser, setPatientUser] = useState<PatientUser | null>(() => {
    try {
      const raw = sessionStorage.getItem('meridian_patient_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [submissions, setSubmissions] = useState<ExpertReviewSubmission[]>(() => {
    try {
      const raw = sessionStorage.getItem('meridian_expert_submissions');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingUploadFiles, setPendingUploadFiles] = useState<File[]>([]);

  const handleAuthSuccess = (user: PatientUser) => {
    setPatientUser(user);
    sessionStorage.setItem('meridian_patient_user', JSON.stringify(user));
    setIsAuthModalOpen(false);
  };

  const handleSignOut = () => {
    setPatientUser(null);
    sessionStorage.removeItem('meridian_patient_user');
  };

  const handleReviewSubmitSuccess = (sub: ExpertReviewSubmission) => {
    const updated = [sub, ...submissions];
    setSubmissions(updated);
    sessionStorage.setItem('meridian_expert_submissions', JSON.stringify(updated));
  };

  const handleDeleteSubmission = (id: string) => {
    const updated = submissions.filter((s) => s.id !== id);
    setSubmissions(updated);
    sessionStorage.setItem('meridian_expert_submissions', JSON.stringify(updated));
  };

  // Listen to hash changes for browser back/forward, deep links and in-page section anchors
  useEffect(() => {
    const handleHashChange = () => {
      const raw = readHash();
      if (raw === 'ai') {
        setAssistantPrompt('');
        setIsAssistantOpen(true);
        return;
      }
      if (raw === 'booking' || raw === 'consultation' || raw === 'appointment') {
        setSelectedDoctor(null);
        setIsBookingOpen(true);
        return;
      }
      const { view, section, article, learnTopic: parsedTopic } = parseHash(raw);
      if (view) setCurrentView(view);
      if (article !== undefined) setResearchArticle(article);
      if (parsedTopic !== undefined) setLearnTopic(parsedTopic);
      if (section) setSectionRequest({ id: section, at: Date.now() });
    };

    // The app positions the page itself (view top or section). Browser scroll restoration on
    // Back/Forward could otherwise land after, and undo, the section scroll.
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // A new view starts at the top with focus on the main content (not on first load).
  useEffect(() => {
    document.title = VIEW_TITLES[currentView] ?? VIEW_TITLES.home;
    if (isFirstViewRender.current) {
      isFirstViewRender.current = false;
      return;
    }
    jumpToTop();
    mainRef.current?.focus({ preventScroll: true });
  }, [currentView]);

  // Opening another Research article is a new page: start at the top with focus on main.
  useEffect(() => {
    if (isFirstArticleRender.current) {
      isFirstArticleRender.current = false;
      return;
    }
    jumpToTop();
    mainRef.current?.focus({ preventScroll: true });
  }, [researchArticle]);

  // Opening another Learn topic is a new page: start at the top with focus on main.
  useEffect(() => {
    if (isFirstLearnTopicRender.current) {
      isFirstLearnTopicRender.current = false;
      return;
    }
    jumpToTop();
    mainRef.current?.focus({ preventScroll: true });
  }, [learnTopic]);

  // Section anchors scroll once the owning view has rendered. If web fonts are still loading
  // (a cold deep link), text reflow can move the target, so align again once they settle.
  useEffect(() => {
    if (!sectionRequest) return;
    let cancelled = false;
    const scrollToSection = (behavior: ScrollBehavior) =>
      document.getElementById(sectionRequest.id)?.scrollIntoView({ behavior, block: 'start' });
    const fontsPending = document.fonts && document.fonts.status !== 'loaded';
    const frame = requestAnimationFrame(() => {
      scrollToSection(prefersReducedMotion() || fontsPending ? 'instant' : 'smooth');
    });
    if (fontsPending) {
      document.fonts.ready.then(() => {
        if (!cancelled) requestAnimationFrame(() => scrollToSection('instant'));
      });
    }
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, [sectionRequest]);

  const handleNavigateView = (view: AppView) => {
    if (view === 'ai') {
      setAssistantPrompt('');
      setIsAssistantOpen(true);
      return;
    }
    const target = view === 'home' ? '' : view;
    if (readHash() !== target) window.location.hash = target;
    if (view === currentView) {
      jumpToTop();
      mainRef.current?.focus({ preventScroll: true });
    } else {
      setCurrentView(view);
    }
  };

  const handleAddMedia = (item: UploadedMediaItem) => {
    setMediaItems(prev => [...prev, item]);
  };

  const handleRemoveMedia = (id: string) => {
    setMediaItems(prev => prev.filter(m => m.id !== id));
  };

  const handleAddQuestionsToDossier = (questions: string[], sourceName: string) => {
    setSavedQuestions(prev => {
      const existingTexts = new Set(prev.map(p => p.text));
      const newItems = questions
        .filter(q => !existingTexts.has(q))
        .map(q => ({
          id: 'q-' + Math.random().toString(36).substring(2, 9),
          text: q,
          source: sourceName,
        }));
      return [...prev, ...newItems];
    });
  };

  const handleRemoveSavedQuestion = (id: string) => {
    setSavedQuestions(prev => prev.filter(q => q.id !== id));
  };

  const handleOpenBookingWithScore = (score: number, symptomPattern: SymptomSeverityLevel, mediaCount: number) => {
    setBookingScore(score);
    setBookingPattern(symptomPattern);
    setSelectedDoctor(null);
    setIsBookingOpen(true);
  };

  const handleSelectDoctorForBooking = (doc: DoctorProfile) => {
    setSelectedDoctor(doc);
    setIsBookingOpen(true);
  };

  const handleOpenAssistantWithContext = (prompt: string) => {
    setAssistantPrompt(prompt);
    setIsAssistantOpen(true);
  };

  const openGeneralBooking = () => {
    setSelectedDoctor(null);
    setIsBookingOpen(true);
  };

  const openGuide = () => {
    setAssistantPrompt('');
    setIsAssistantOpen(true);
  };

  // Previous / next links at the foot of the tool views
  const openResearchArticle = (slug: string | null) => {
    const target = slug ? `research/${slug}` : 'research';
    if (readHash() !== target) window.location.hash = target;
    setResearchArticle(slug);
    if (currentView !== 'research') setCurrentView('research');
  };

  const handleNavigateTopic = (slug: LearnTopicSlug) => {
    const target = `learn/${slug}`;
    if (readHash() !== target) window.location.hash = target;
    setLearnTopic(slug);
    if (currentView !== 'learn') setCurrentView('learn');
    jumpToTop();
    mainRef.current?.focus({ preventScroll: true });
  };

  type PageLink = { view: AppView; label: string };
  const renderPageLinks = (prev: PageLink, next: PageLink) => (
    <nav aria-label="More pages" className="container-page flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-mv-outline py-10">
      {[{ ...prev, arrow: '←' }, { ...next, arrow: '→' }].map((link, i) => (
        <a
          key={link.view}
          href={hrefForView(link.view)}
          onClick={(e) => {
            e.preventDefault();
            handleNavigateView(link.view);
          }}
          className="inline-flex min-h-[44px] items-center gap-2 text-[15px] font-semibold text-mv-forest underline-offset-4 hover:underline"
        >
          {i === 0 && <span aria-hidden="true">{link.arrow}</span>}
          <span>{link.label}</span>
          {i === 1 && <span aria-hidden="true">{link.arrow}</span>}
        </a>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1A2421] flex flex-col font-sans selection:bg-[#0A3B32] selection:text-white">
      <a
        href="#main"
        className="mv-skip-link"
        onClick={(e) => {
          e.preventDefault();
          mainRef.current?.focus();
        }}
      >
        Skip to main content
      </a>

      <Header
        currentView={currentView}
        onNavigateView={handleNavigateView}
        onOpenAssistant={openGuide}
        onOpenBooking={openGeneralBooking}
        hasAssessmentScore={bookingScore !== null}
        user={patientUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* Main View Router */}
      <main id="main" ref={mainRef} tabIndex={-1} className="flex-1">

        {/* VIEW: Care Pathway / Journey */}
        {currentView === 'journey' && (
          <>
            <PageHero
              id="journey-hero"
              title="Your vascular care pathway"
              lede="A transparent, step-by-step roadmap from initial symptom observation to post-treatment duplex ultrasound surveillance."
              illustrations={['patient-journey', 'appointment', 'consultation']}
              tone="sage"
              chips={[
                { label: 'Milestone 01: Assessment', href: '#stage-01' },
                { label: 'Milestone 02: Doppler scan', href: '#stage-02' },
                { label: 'Milestone 04: Treatment', href: '#stage-04' },
                { label: 'Milestone 06: Long-term health', href: '#stage-06' },
              ]}
              onAskMeridbot={() => handleOpenAssistantWithContext('What happens during a vascular consultation?')}
              meridbotPose="present"
            />
            <VascularCareJourney
              onNavigateView={handleNavigateView}
              onOpenBooking={openGeneralBooking}
              onOpenAssistantWithPrompt={handleOpenAssistantWithContext}
            />
          </>
        )}

        {/* VIEW: Learning hub or dedicated educational page */}
        {currentView === 'learn' && (
          <LearnView
            learnTopic={learnTopic}
            onNavigateView={handleNavigateView}
            onNavigateTopic={handleNavigateTopic}
            onOpenAssistantWithPrompt={handleOpenAssistantWithContext}
            onAskMeridbot={openGuide}
            onOpenBooking={openGeneralBooking}
          />
        )}

        {/* VIEW: Research library and articles (checked and labelled sources) */}
        {currentView === 'research' && (
          <ResearchView
            articleSlug={researchArticle}
            onOpenArticle={openResearchArticle}
            onAskMeridbot={(prompt) => (prompt ? handleOpenAssistantWithContext(prompt) : openGuide())}
          />
        )}

        {/* VIEW: Insurance & Financial Education */}
        {currentView === 'insurance' && (
          <InsuranceEducation
            onAskMeridbot={(prompt) => (prompt ? handleOpenAssistantWithContext(prompt) : openGuide())}
            onNavigateView={handleNavigateView}
          />
        )}

        {/* VIEW: Doppler report guide, preparation and scan explainer */}
        {currentView === 'doppler' && (
          <>
            <PageHero
              id="doppler-hero"
              title="Venous Doppler scan & report decoder"
              lede="Understand ultrasound findings, reflux duration, saphenous junctions, and clinical terminology in clear, plain language."
              illustrations={['doppler-report', 'venous-reflux', 'medical-reports']}
              tone="forest"
              chips={[
                { label: 'Report decoder', href: '#doppler-decoder' },
                { label: 'Ultrasound prep guide', href: '#doppler-education' },
                { label: 'Duplex scan explorer', href: '#duplex-scan' },
              ]}
              onAskMeridbot={() => handleOpenAssistantWithContext('How do I read my Doppler ultrasound report?')}
              meridbotPose="thinking"
            />
            <DopplerReportDecoder
              onOpenAiWithPrompt={handleOpenAssistantWithContext}
              onBookConsultation={openGeneralBooking}
              onNavigateToTreatments={() => handleNavigateView('treatments')}
              onAddQuestionsToDossier={handleAddQuestionsToDossier}
            />
            <DopplerEducationGuide
              onNavigateToDoppler={() =>
                document.getElementById('doppler-decoder')?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
              }
              onOpenAiWithPrompt={handleOpenAssistantWithContext}
            />
            <DuplexUltrasoundExplorer />
            {renderPageLinks({ view: 'assessment', label: 'Symptom check' }, { view: 'treatments', label: 'Compare treatments' })}
          </>
        )}

        {/* VIEW: Treatment comparison and treatment types */}
        {currentView === 'treatments' && (
          <>
            <PageHero
              id="treatments-hero"
              title="Compare modern vein treatments"
              lede="Outpatient, minimally invasive techniques tailored to your anatomy. No surgical stripping, minimal downtime, guided by duplex ultrasound."
              illustrations={['treatment-options', 'laser-treatment', 'compression-therapy']}
              tone="clay"
              chips={[
                { label: 'Modality comparison', href: '#treatment-comparison' },
                { label: 'Treatment profiles', href: '#treatment-modalities' },
                { label: 'Research evidence', href: '#research/treatment-options' },
              ]}
              onAskMeridbot={() => handleOpenAssistantWithContext('Compare EVLA and VenaSeal')}
              meridbotPose="present"
            />
            <TreatmentComparison
              onOpenAiWithPrompt={handleOpenAssistantWithContext}
              onBookConsultation={openGeneralBooking}
              onNavigateToSpecialists={() => handleNavigateView('specialists')}
              onAddQuestionsToDossier={handleAddQuestionsToDossier}
            />
            <TreatmentModalities />
            {renderPageLinks({ view: 'doppler', label: 'Doppler report guide' }, { view: 'specialists', label: 'Find care (demo)' })}
          </>
        )}

        {/* VIEW: Symptom Screener & Media Upload */}
        {currentView === 'assessment' && (
          <>
            <PageHero
              id="assessment-hero"
              title="Vein symptom pattern assessment"
              lede="Structured CEAP-aligned clinical symptom screener and private on-device photo vault. General education, not a medical diagnosis."
              illustrations={['varicose-veins', 'risk-factors', 'medical-reports']}
              tone="clay"
              chips={[
                { label: 'Symptom screener', href: '#degree-assessment' },
                { label: 'Photo & video vault', href: '#media-upload' },
                { label: 'Clot warning signs', href: '#dvt-safety' },
              ]}
              onAskMeridbot={() => handleOpenAssistantWithContext('What do my leg symptoms mean?')}
              meridbotPose="thinking"
            />
            <DegreeAssessment
              onOpenBookingWithScore={handleOpenBookingWithScore}
              onOpenAssistantWithContext={handleOpenAssistantWithContext}
              mediaItems={mediaItems}
              onAddMedia={handleAddMedia}
              onRemoveMedia={handleRemoveMedia}
              onNavigateToDoppler={() => handleNavigateView('doppler')}
              onNavigateToTreatments={() => handleNavigateView('treatments')}
              onNavigateToSpecialists={() => handleNavigateView('specialists')}
              savedAnswers={assessmentAnswers}
              savedResult={assessmentResult}
              savedPatientName={assessmentPatientName}
              onSaveAssessmentState={(answers, result, patientName) => {
                setAssessmentAnswers(answers);
                setAssessmentResult(result);
                setAssessmentPatientName(patientName);
                if (result) {
                  setBookingScore(result.totalScore);
                  setBookingPattern(result.severityLevel);
                }
              }}
            />
            <ClinicalMediaSection
              mediaItems={mediaItems}
              onAddMedia={handleAddMedia}
              onRemoveMedia={handleRemoveMedia}
              onNavigateToAssessment={() => {
                window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
              }}
              onOpenBooking={openGeneralBooking}
            />
          </>
        )}

        {/* VIEW: Dedicated Leg Severity Assessment & Expert Review Page */}
        {currentView === 'leg-assessment' && (
          <LegAssessmentPage
            onNavigateHome={() => handleNavigateView('home')}
            onNavigateView={handleNavigateView}
            onOpenBooking={openGeneralBooking}
            currentUser={patientUser}
            onRequireAuth={() => setIsAuthModalOpen(true)}
            onSubmissionComplete={handleReviewSubmitSuccess}
            onOpenAssistantWithPrompt={handleOpenAssistantWithContext}
          />
        )}

        {/* VIEW: Specialists & Clinics */}
        {currentView === 'specialists' && (
          <>
            <PageHero
              id="specialists-hero"
              title="Find vascular specialists & clinics"
              lede="Explore demonstration specialist profiles and sample consultation guides across major Indian metros. All profiles are illustrative demo records."
              illustrations={['consultation', 'appointment', 'patient-journey']}
              tone="sage"
              chips={[
                { label: 'Doctor directory', href: '#doctor-directory' },
                { label: 'Visit questions', href: '#doctor-visit-guide' },
                { label: 'Patient portal demo', href: '#dashboard' },
              ]}
              onAskMeridbot={() => handleOpenAssistantWithContext('What questions should I ask a vein doctor?')}
              meridbotPose="present"
            />
            <DoctorDirectory
              onSelectDoctor={handleSelectDoctorForBooking}
              onOpenAiWithPrompt={handleOpenAssistantWithContext}
            />
            <DoctorVisitGuide onOpenBooking={openGeneralBooking} onOpenAiWithPrompt={handleOpenAssistantWithContext} />
            {renderPageLinks({ view: 'treatments', label: 'Compare treatments' }, { view: 'dashboard', label: 'Patient portal (demo)' })}
          </>
        )}

        {/* VIEW: Expert Review Submission */}
        {currentView === 'expert-review' && (
          <MedicalReportUpload
            currentUser={patientUser}
            onRequireAuth={() => {
              setIsAuthModalOpen(true);
            }}
            onSubmissionComplete={handleReviewSubmitSuccess}
            onOpenBooking={openGeneralBooking}
            onNavigateToDashboard={() => handleNavigateView('dashboard')}
          />
        )}

        {/* VIEW: Patient Records & Dashboard */}
        {currentView === 'dashboard' && (
          <PatientDashboard
            user={patientUser}
            submissions={submissions}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onSignOut={handleSignOut}
            onOpenReportUpload={() => handleNavigateView('expert-review')}
            onOpenBooking={openGeneralBooking}
            onDeleteSubmission={handleDeleteSubmission}
          />
        )}

        {/* VIEW: Home (Streamlined, icon-led editorial experience) */}
        {currentView === 'home' && (
          <>
            <Hero
              onStartAssessment={() => handleNavigateView('assessment')}
              onNavigateToTreatments={() => handleNavigateView('treatments')}
              onNavigateToSymptoms={() => {
                const el = document.getElementById('symptoms');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else handleNavigateView('learn');
              }}
              onNavigateToExpertReview={() => handleNavigateView('expert-review')}
              onOpenBooking={openGeneralBooking}
            />
            <VisualEnvironmentsSection
              onNavigateView={handleNavigateView}
              onNavigateSection={(view, section) => {
                window.location.hash = section;
                setCurrentView(view);
                setSectionRequest({ id: section, at: Date.now() });
              }}
              onNavigateTopic={handleNavigateTopic}
              onOpenAssistant={openGuide}
              onOpenBooking={openGeneralBooking}
            />
            <CarePathwaySequence
              onNavigateView={handleNavigateView}
              onNavigateTopic={handleNavigateTopic}
            />
            <TrustAndValueSection onNavigateView={handleNavigateView} />
            <CuratedFaqSection
              onOpenAssistant={openGuide}
              onNavigateView={handleNavigateView}
            />
          </>
        )}

      </main>

      {/* Footer */}
      <Footer onNavigateView={handleNavigateView} onOpenAssistant={openGuide} onOpenBooking={openGeneralBooking} />

      {/* Educational guide (pre-written answers only) */}
      <ClearPixAssistantModal
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        initialPrompt={assistantPrompt}
        onSelectBooking={() => {
          setIsBookingOpen(true);
        }}
        context={currentView}
        onNavigateView={handleNavigateView}
      />

      {/* Appointment Consultation Booking Modal */}
      <AppointmentModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        prefilledScore={bookingScore}
        prefilledPattern={bookingPattern}
        preselectedDoctor={selectedDoctor}
        attachedMediaCount={mediaItems.length}
      />

      {/* Patient Authentication Modal (Mobile OTP & ABHA architecture) */}
      <PatientAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* Floating Meridbot Mascot Companion */}
      <MeridbotScrollCompanion
        activeView={currentView}
        onOpenChat={() => setIsAssistantOpen((prev) => !prev)}
        isChatOpen={isAssistantOpen}
      />

    </div>
  );
}
