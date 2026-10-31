import React, { useState } from 'react';
import { PageHero } from './scene/PageHero';
import { CLINICAL_PHOTOS } from '../content/photos';
import { ShieldCheck, HelpCircle, CheckCircle2, AlertCircle, FileText, DollarSign, ChevronDown, ChevronUp, ArrowRight, Printer, Camera } from 'lucide-react';

import { AppView } from '../types';

interface InsuranceEducationProps {
  onAskMeridbot?: (prompt?: string) => void;
  onNavigateView?: (view: AppView) => void;
}

interface FaqItem {
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    q: 'Are varicose vein treatments covered under health insurance in India?',
    a: 'Most health insurance policies in India cover endovenous thermal ablation (EVLA, RFA) and surgical procedures when medically necessary—meaning you have documented symptomatic disease (pain, heaviness, edema, skin changes) with duplex ultrasound evidence of venous reflux. Purely cosmetic procedures (such as spider vein sclerotherapy without underlying reflux) are universally excluded.',
  },
  {
    q: 'What is the typical waiting period for varicose vein coverage?',
    a: 'Standard health insurance policies in India typically categorize varicose veins under "specific ailments" with a 1 to 2-year waiting period from policy inception. If the condition was diagnosed before purchasing the policy, pre-existing disease (PED) clauses apply, which historically required 2 to 4 years (reduced to 3 years under revised IRDAI norms). Always verify your specific policy schedule.',
  },
  {
    q: 'How does the cashless hospitalization process work for daycare vein procedures?',
    a: 'Modern endovenous procedures (EVLA, RFA, VenaSeal) are typically performed as daycare surgeries (under 24 hours). For cashless admission, the hospital TPA desk submits a pre-authorization request along with your standing Doppler ultrasound report and doctor\'s prescription 3 to 7 days in advance. Once initial approval is granted, you only pay for non-medical consumables and non-admissible items.',
  },
  {
    q: 'What out-of-pocket expenses should I budget for even with cashless insurance?',
    a: 'Common out-of-pocket expenses include: non-medical administrative charges, post-procedure Class 2 graduated compression stockings (rarely covered as medical devices), outpatient follow-up consultations, and co-payment deductions if your policy has a mandatory co-pay clause or room rent cap.',
  },
  {
    q: 'Does insurance cover VenaSeal (medical adhesive) closure?',
    a: 'Coverage for VenaSeal varies significantly by insurer and TPA. While thermal ablation (EVLA/RFA) has established package rates under GIPSA and most private TPAs, cyanoacrylate adhesive (VenaSeal) catheters are premium consumables that may require special pre-approval or entail out-of-pocket co-payments for the kit cost.',
  },
];

const INSURER_QUESTIONS = [
  'Does my policy cover modern daycare endovenous procedures (EVLA / RFA / VenaSeal) without requiring 24-hour overnight hospitalization?',
  'What is the specific waiting period for varicose vein treatment under my policy number?',
  'Is my chosen hospital within your cashless preferred provider network (GIPSA / PPN)?',
  'Does my policy impose a room rent sub-limit or proportional deduction that would reduce surgeon or theatre fee payouts?',
  'What is the mandatory co-payment percentage (if any) applicable to my age or claim?',
  'Which consumables (laser fibers, radiofrequency catheters, compression stockings) are reimbursable versus non-payable?',
];

const CLINIC_QUESTIONS = [
  'Do you provide an itemized estimation letter for insurance pre-authorization with procedure codes (EVLA / RFA / Phlebectomy)?',
  'Is your facility an empaneled network hospital for my TPA, or will this be handled via post-discharge reimbursement?',
  'What is the all-inclusive estimated cost breakdown: surgeon fee, OT charges, catheter/fiber consumable kit, and day-stay charges?',
  'Are post-procedure surveillance duplex ultrasound scans and follow-up visits included in the treatment package?',
  'What non-payable charges should I prepare to settle directly at discharge?',
];

export const InsuranceEducation: React.FC<InsuranceEducationProps> = ({ onAskMeridbot, onNavigateView }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [checkedInsurer, setCheckedInsurer] = useState<Record<number, boolean>>({});
  const [checkedClinic, setCheckedClinic] = useState<Record<number, boolean>>({});

  const toggleInsurer = (idx: number) => {
    setCheckedInsurer((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleClinic = (idx: number) => {
    setCheckedClinic((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <>
      <PageHero
        id="insurance"
        title="Insurance & Financial Education"
        lede="Navigate health insurance coverage, pre-authorization requirements, out-of-pocket expenses, and questions to ask your insurer before treatment. Practical guidance, not financial or policy advice."
        illustrations={['medical-reports', 'appointment', 'doppler-report']}
        meridbotPose="present"
        chips={[
          { label: 'Coverage criteria', href: '#coverage-criteria' },
          { label: 'Out-of-pocket costs', href: '#out-of-pocket' },
          { label: 'Pre-auth checklist', href: '#insurance-checklist' },
          { label: 'Common questions', href: '#insurance-faqs' },
        ]}
        onAskMeridbot={() => onAskMeridbot?.('What questions should I ask my insurer about vein treatment?')}
      />

      <div className="container-page max-w-[1200px] py-12 lg:py-16 space-y-16">
        
        {/* Core Notice Banner */}
        <div className="rounded-2xl border border-[#0B4036]/15 bg-[#FAF7F2] p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <ShieldCheck className="w-6 h-6 text-[#0B4036] shrink-0 mt-1" />
            <div>
              <h2 className="font-serif text-[20px] sm:text-[22px] font-semibold text-[#0B4036]">
                General Educational Guidance · Demo
              </h2>
              <p className="mt-2 text-[14px] sm:text-[15px] text-[#1A2421]/80 leading-relaxed">
                Meridian Vascular does not sell insurance, process claims, verify individual policy terms, or guarantee reimbursement. Health insurance terms in India vary between insurers (public sector PSU insurers under GIPSA, private insurers, and standalone health TPAs). Always verify your specific policy wording with your insurance provider.
              </p>
            </div>
          </div>
        </div>

        {/* Section 1: Medical Necessity vs Cosmetic Exclusions */}
        <section id="coverage-criteria" className="space-y-6">
          <div className="border-b border-[#0B4036]/10 pb-4">
            <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#0B4036]">Coverage Foundations</p>
            <h2 className="font-serif text-[26px] sm:text-[32px] font-semibold text-[#0B4036] mt-1">
              Medical Necessity vs. Cosmetic Exclusions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-2xl border border-emerald-900/15 bg-emerald-50/40 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[12px] font-semibold mb-4">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Typically Covered (Medically Indicated)</span>
                </div>
                <h3 className="font-serif text-[20px] font-semibold text-emerald-950 mb-3">
                  Symptomatic Venous Insufficiency
                </h3>
                <p className="text-[14px] text-emerald-900/80 leading-relaxed mb-4">
                  Insurers generally approve claims when venous disease causes physical symptoms and demonstrable physiological dysfunction.
                </p>
                <ul className="space-y-2 text-[13.5px] text-emerald-900/90">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-700 font-bold">•</span>
                    <span><strong>Duplex Confirmation:</strong> Standing venous duplex report documenting retrograde reflux exceeding 500 ms in saphenous trunks.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-700 font-bold">•</span>
                    <span><strong>Clinical Severity:</strong> CEAP class C2 with chronic aching, C3 (swelling), C4 (skin pigmentation/eczema), or C5–C6 (venous ulcers).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-700 font-bold">•</span>
                    <span><strong>Failed Conservative Care:</strong> Documented trial of compression stockings or lifestyle modifications where mandated by policy.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-emerald-900/10 text-[12px] text-emerald-800/80">
                Requires surgeon consultation notes and ultrasound scan films.
              </div>
            </div>

            <div className="rounded-2xl border border-amber-900/15 bg-amber-50/40 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-[12px] font-semibold mb-4">
                  <AlertCircle className="w-4 h-4" />
                  <span>Typically Excluded (Cosmetic)</span>
                </div>
                <h3 className="font-serif text-[20px] font-semibold text-amber-950 mb-3">
                  Asymptomatic / Cosmetic Spider Veins
                </h3>
                <p className="text-[14px] text-amber-900/80 leading-relaxed mb-4">
                  Procedures undertaken purely for aesthetic improvement without documented reflux or clinical symptoms are standard policy exclusions.
                </p>
                <ul className="space-y-2 text-[13.5px] text-amber-900/90">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-700 font-bold">•</span>
                    <span><strong>Isolated Spider Veins:</strong> Telangiectasias or reticular veins (CEAP C1) without underlying saphenofemoral junction incompetence.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-700 font-bold">•</span>
                    <span><strong>Aesthetic Sclerotherapy:</strong> Surface liquid or foam injections performed without clinical edema or skin impairment.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-700 font-bold">•</span>
                    <span><strong>Absence of Duplex Evidence:</strong> Claims submitted without a certified vascular radiologist or sonographer Doppler report.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-amber-900/10 text-[12px] text-amber-800/80">
                Exclusions are explicitly enumerated under IRDAI standard guidelines.
              </div>
            </div>
          </div>
        </section>

        {/* Visual Cashless Workflow Diagram */}
        <section id="cashless-process" className="space-y-6">
          <div className="border-b border-[#0B4036]/10 pb-4">
            <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#0B4036]">STEP-BY-STEP PROCESS</p>
            <h2 className="font-serif text-[26px] sm:text-[32px] font-semibold text-[#0B4036] mt-1">
              How Cashless TPA Pre-Authorization Works
            </h2>
            <p className="text-[15px] text-[#1A2421]/75 max-w-2xl mt-2">
              A standard 4-stage pathway for day-care minimally invasive vein procedures under network hospitals in India.
            </p>
          </div>

          {/* Hospital TPA Helpdesk Photography Card */}
          <div className="overflow-hidden rounded-3xl border border-mv-outline/70 bg-white shadow-2xs">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              <div className="relative aspect-[16/10] lg:aspect-auto lg:col-span-5 overflow-hidden bg-mv-pale/20">
                <img
                  src={CLINICAL_PHOTOS.insuranceTpaDesk.src}
                  alt={CLINICAL_PHOTOS.insuranceTpaDesk.alt}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover object-center"
                />
                <span className="absolute bottom-3 left-3 rounded-md bg-mv-forest/85 px-2.5 py-1 text-[11px] font-mono font-medium text-white backdrop-blur-xs flex items-center gap-1.5">
                  <Camera className="w-3 h-3 text-mv-terracotta" />
                  <span>{CLINICAL_PHOTOS.insuranceTpaDesk.clinicalTag}</span>
                </span>
              </div>
              <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-mv-terracotta block mb-1">
                    Hospital Insurance Coordination
                  </span>
                  <h3 className="font-serif text-[22px] sm:text-[24px] font-semibold text-mv-forest leading-snug">
                    Navigating Cashless Approval at the Hospital TPA Desk
                  </h3>
                  <p className="mt-2.5 text-[14px] sm:text-[15px] leading-relaxed text-mv-ink-muted">
                    Most Indian network hospitals maintain a dedicated Third-Party Administrator (TPA) helpdesk. Once your vascular specialist generates a procedure estimation and clinical dossier with your standing Doppler scan, the desk electronically submits pre-authorization documents 3 to 7 days before your scheduled day-care appointment.
                  </p>
                  <div className="mt-4 pt-4 border-t border-mv-outline/60 flex flex-wrap gap-3 text-[12.5px] text-mv-ink">
                    <span className="bg-mv-ivory px-3 py-1 rounded-md border border-mv-outline/50 font-mono">Day-Care Package Codes</span>
                    <span className="bg-mv-ivory px-3 py-1 rounded-md border border-mv-outline/50 font-mono">Doppler Scan Evidence</span>
                    <span className="bg-mv-ivory px-3 py-1 rounded-md border border-mv-outline/50 font-mono">Pre-Auth Sanction (3-5 Days)</span>
                  </div>
                </div>
                <div className="mt-6 pt-3 border-t border-mv-outline/50 text-[12px] text-mv-ink-muted">
                  {CLINICAL_PHOTOS.insuranceTpaDesk.caption}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-[#0B4036]/10 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-[11px] font-bold text-mv-terracotta uppercase tracking-wider">Step 01</span>
                  <div className="w-8 h-8 rounded-lg bg-mv-ivory flex items-center justify-center text-mv-forest border border-mv-outline/50">
                    <FileText className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="font-serif text-[18px] font-semibold text-mv-forest mb-1.5">
                  OPD &amp; Doppler Scan
                </h3>
                <p className="text-[13px] text-[#1A2421]/75 leading-relaxed">
                  Surgeon consultation and standing duplex ultrasound confirming pathologic reflux (&gt;500ms) with clinical indication.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#0B4036]/10 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-[11px] font-bold text-mv-terracotta uppercase tracking-wider">Step 02</span>
                  <div className="w-8 h-8 rounded-lg bg-mv-ivory flex items-center justify-center text-mv-forest border border-mv-outline/50">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="font-serif text-[18px] font-semibold text-mv-forest mb-1.5">
                  TPA Desk Submission
                </h3>
                <p className="text-[13px] text-[#1A2421]/75 leading-relaxed">
                  Hospital TPA desk submits pre-auth form, clinical history, Doppler report, and doctor estimation letter 3–5 days prior.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#0B4036]/10 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-[11px] font-bold text-mv-terracotta uppercase tracking-wider">Step 03</span>
                  <div className="w-8 h-8 rounded-lg bg-mv-ivory flex items-center justify-center text-mv-forest border border-mv-outline/50">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  </div>
                </div>
                <h3 className="font-serif text-[18px] font-semibold text-mv-forest mb-1.5">
                  Pre-Auth Sanction
                </h3>
                <p className="text-[13px] text-[#1A2421]/75 leading-relaxed">
                  TPA grants initial sanction letter approving package admission for day-care procedure (EVLA / RFA / VenaSeal).
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#0B4036]/10 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-[11px] font-bold text-mv-terracotta uppercase tracking-wider">Step 04</span>
                  <div className="w-8 h-8 rounded-lg bg-mv-ivory flex items-center justify-center text-mv-forest border border-mv-outline/50">
                    <DollarSign className="w-4 h-4 text-amber-700" />
                  </div>
                </div>
                <h3 className="font-serif text-[18px] font-semibold text-mv-forest mb-1.5">
                  Daycare Discharge
                </h3>
                <p className="text-[13px] text-[#1A2421]/75 leading-relaxed">
                  Patient completes procedure, walks immediately, and only settles non-medical consumables or co-pay at discharge.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Out-of-Pocket Expense Breakdown */}
        <section id="out-of-pocket" className="space-y-6">
          <div className="border-b border-[#0B4036]/10 pb-4">
            <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#0B4036]">Cost Transparency</p>
            <h2 className="font-serif text-[26px] sm:text-[32px] font-semibold text-[#0B4036] mt-1">
              Common Out-of-Pocket Costs to Anticipate
            </h2>
            <p className="text-[15px] text-[#1A2421]/75 max-w-2xl mt-2">
              Even with 100% sum-insured cashless approval, patients frequently encounter non-admissible deductions. Understanding these in advance prevents surprise hospital bills.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-[#0B4036]/10 bg-white shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-[#E4ECE8] text-[#0B4036] flex items-center justify-center font-bold mb-4">
                1
              </div>
              <h3 className="font-serif text-[18px] font-semibold text-[#0B4036] mb-2">
                Non-Medical Consumables
              </h3>
              <p className="text-[13.5px] text-[#1A2421]/75 leading-relaxed">
                Hospital registration fees, biohazard disposal kits, sterile drapes, and administrative documentation charges are commonly classified as non-payable items by TPAs.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-[#0B4036]/10 bg-white shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-[#E4ECE8] text-[#0B4036] flex items-center justify-center font-bold mb-4">
                2
              </div>
              <h3 className="font-serif text-[18px] font-semibold text-[#0B4036] mb-2">
                Post-Procedure Stockings
              </h3>
              <p className="text-[13.5px] text-[#1A2421]/75 leading-relaxed">
                Graduated medical compression stockings (Class 2, 20–30 mmHg) required for post-operative recovery are external medical appliances and are usually out-of-pocket.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-[#0B4036]/10 bg-white shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-[#E4ECE8] text-[#0B4036] flex items-center justify-center font-bold mb-4">
                3
              </div>
              <h3 className="font-serif text-[18px] font-semibold text-[#0B4036] mb-2">
                Room Rent Sub-Limits
              </h3>
              <p className="text-[13.5px] text-[#1A2421]/75 leading-relaxed">
                If you select a private room category exceeding your policy\'s daily room rent limit (e.g. 1% of sum insured), insurers apply proportional deductions across all associated fees.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Interactive Question Checklists */}
        <section id="insurance-checklist" className="space-y-8">
          <div className="border-b border-[#0B4036]/10 pb-4">
            <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#0B4036]">Preparation Tools</p>
            <h2 className="font-serif text-[26px] sm:text-[32px] font-semibold text-[#0B4036] mt-1">
              Your Pre-Authorization Question Checklist
            </h2>
            <p className="text-[15px] text-[#1A2421]/75 max-w-2xl mt-2">
              Print or review these verified questions when contacting your insurance customer desk and the hospital\'s insurance billing coordinator.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Insurer Checklist */}
            <div className="rounded-2xl border border-[#0B4036]/15 bg-[#FAF7F2] p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-serif text-[20px] font-semibold text-[#0B4036]">
                    Questions for Your Insurer / TPA
                  </h3>
                  <p className="text-[13px] text-[#1A2421]/70">Call the toll-free number on your health card</p>
                </div>
                <span className="text-[12px] font-mono px-2.5 py-1 rounded-full bg-white border border-[#0B4036]/15 text-[#0B4036]">
                  {Object.values(checkedInsurer).filter(Boolean).length} / {INSURER_QUESTIONS.length} Checked
                </span>
              </div>

              <div className="space-y-3">
                {INSURER_QUESTIONS.map((q, idx) => (
                  <label
                    key={idx}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                      checkedInsurer[idx]
                        ? 'bg-emerald-50/60 border-emerald-700/30'
                        : 'bg-white border-[#0B4036]/10 hover:border-[#0B4036]/30'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={!!checkedInsurer[idx]}
                      onChange={() => toggleInsurer(idx)}
                      className="mt-1 h-4 w-4 rounded text-[#0B4036] focus:ring-[#0B4036]"
                    />
                    <span className={`text-[13.5px] leading-relaxed ${checkedInsurer[idx] ? 'text-emerald-950 font-medium line-through opacity-80' : 'text-[#1A2421]'}`}>
                      {q}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Clinic Checklist */}
            <div className="rounded-2xl border border-[#0B4036]/15 bg-[#FAF7F2] p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-serif text-[20px] font-semibold text-[#0B4036]">
                    Questions for the Clinic Billing Desk
                  </h3>
                  <p className="text-[13px] text-[#1A2421]/70">Ask before confirming procedure scheduling</p>
                </div>
                <span className="text-[12px] font-mono px-2.5 py-1 rounded-full bg-white border border-[#0B4036]/15 text-[#0B4036]">
                  {Object.values(checkedClinic).filter(Boolean).length} / {CLINIC_QUESTIONS.length} Checked
                </span>
              </div>

              <div className="space-y-3">
                {CLINIC_QUESTIONS.map((q, idx) => (
                  <label
                    key={idx}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                      checkedClinic[idx]
                        ? 'bg-emerald-50/60 border-emerald-700/30'
                        : 'bg-white border-[#0B4036]/10 hover:border-[#0B4036]/30'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={!!checkedClinic[idx]}
                      onChange={() => toggleClinic(idx)}
                      className="mt-1 h-4 w-4 rounded text-[#0B4036] focus:ring-[#0B4036]"
                    />
                    <span className={`text-[13.5px] leading-relaxed ${checkedClinic[idx] ? 'text-emerald-950 font-medium line-through opacity-80' : 'text-[#1A2421]'}`}>
                      {q}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0B4036] text-white text-[13px] font-medium hover:bg-[#062620] transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Checklist for Consultation</span>
            </button>
          </div>
        </section>

        {/* Section 4: Frequently Asked Insurance Questions */}
        <section id="insurance-faqs" className="space-y-6">
          <div className="border-b border-[#0B4036]/10 pb-4">
            <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#0B4036]">Knowledge Base</p>
            <h2 className="font-serif text-[26px] sm:text-[32px] font-semibold text-[#0B4036] mt-1">
              Frequently Asked Insurance Questions
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="rounded-xl border border-[#0B4036]/10 bg-white overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-serif text-[16px] sm:text-[17px] font-semibold text-[#0B4036] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-5 h-5 shrink-0 text-[#0B4036]/70" /> : <ChevronDown className="w-5 h-5 shrink-0 text-[#0B4036]/70" />}
                  </button>
                  {isOpen && (
                    <div className="p-5 pt-0 text-[14px] sm:text-[14.5px] text-[#1A2421]/80 leading-relaxed border-t border-[#0B4036]/8 bg-[#FAF7F2]/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Footer Next Steps Navigation */}
        <div className="p-8 rounded-3xl bg-[#0B4036] text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h3 className="font-serif text-[22px] sm:text-[24px] font-semibold">
              Ready to discuss options with a specialist?
            </h3>
            <p className="text-[14px] text-white/80 mt-1 max-w-xl">
              Explore demonstration profiles of vascular specialists across India, or review our guide to preparing for your initial venous duplex consultation.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onNavigateView?.('specialists')}
              className="px-5 py-2.5 rounded-full bg-[#CE5B40] hover:bg-[#A9472F] text-white text-[13px] font-semibold transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <span>Find Care Profiles</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigateView?.('treatments')}
              className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-[13px] font-semibold transition-all cursor-pointer"
            >
              Compare Treatments
            </button>
          </div>
        </div>

      </div>
    </>
  );
};
