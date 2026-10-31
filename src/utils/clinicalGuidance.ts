/**
 * Meridian Vascular educational guide engine.
 *
 * Deterministic, pre-written educational guidance selected by keyword matching: guideline consensus
 * definitions (AVF, SVS, AVLS), emergency red-flag routing, and an honest fallback for questions the
 * catalogue does not cover. It runs entirely in the browser and makes no network requests.
 */

import { formatEmergencyNumbers } from '../data/emergencyContacts';

/**
 * Where a guide answer came from. Every answer is currently fixed educational text selected by
 * keyword matching; no language model is involved.
 */
export type GuidanceSource = 'pre-written';

/** Stable identifier of the catalogue entry that produced an answer. */
export type GuideIntentId =
  | 'emergency'
  | 'safety-refusal'
  | 'negative-dvt-scan'
  | 'possible-dvt'
  | 'doppler-terms'
  | 'treatment-options'
  | 'wound-or-bleeding'
  | 'swelling-or-skin-changes'
  | 'spider-veins'
  | 'general-vein-symptoms'
  | 'assessment-tool'
  | 'expert-review-info'
  | 'booking-info'
  | 'unmatched';

export interface ClinicalGuidanceResponse {
  reply: string;
  recommendedSpecialist: string;
  recommendedSpecialistRole: string;
  urgencyLevel: 'Routine Consultation' | 'Priority Evaluation' | 'Urgent Medical Attention';
  suggestedDiagnostic: string;
  suggestedQuestions: string[];
  intent: GuideIntentId;
  source: GuidanceSource;
}

export function normalizeGuidanceSource(raw: unknown): GuidanceSource | undefined {
  return raw === 'pre-written' ? raw : undefined;
}

export function describeGuidanceSource(source: GuidanceSource | undefined): { label: string; detail: string } {
  if (source === 'pre-written') {
    return {
      label: 'Pre-written guidance',
      detail: 'Fixed educational text chosen by matching words in your message. Not written for your situation, and not a diagnosis.',
    };
  }
  return {
    label: 'Educational content (source not confirmed)',
    detail: 'The origin of this answer could not be confirmed. Treat it as general education only, not a diagnosis.',
  };
}

const EMERGENCY_RED_FLAGS = [
  'chest pain',
  'chest tightness',
  'shortness of breath',
  'short of breath',
  'breathless',
  'difficulty breathing',
  'coughing blood',
  'coughing up blood',
  'sudden calf',
  'sudden swelling',
  'sudden leg swelling',
  "won't stop bleeding",
  'will not stop bleeding',
  'bleeding heavily',
];

// Words that make a message plausibly about leg or vein health, so the general answer applies.
// Anything without one of these gets the honest 'unmatched' fallback instead of a guessed answer.
const GENERAL_VEIN_WORDS = [
  'vein', 'veins', 'varicose', 'venous', 'leg', 'legs', 'calf', 'calves', 'ankle', 'ankles', 'thigh',
  'knee', 'foot', 'feet', 'heavy', 'heaviness', 'ache', 'aches', 'aching', 'pain', 'painful', 'cramp',
  'cramps', 'throb', 'throbbing', 'bulging', 'itch', 'itchy', 'itching', 'restless', 'swollen', 'circulation', 'symptom', 'symptoms',
];

function mentionsAnyWord(query: string, words: string[]): boolean {
  return words.some((w) => new RegExp(`\\b${w}\\b`).test(query));
}

/** Topics the pre-written catalogue covers, offered when a question can't be answered. */
export const GUIDE_SUPPORTED_TOPICS = [
  'What does reflux on a Doppler report mean?',
  'How do laser (EVLA), radiofrequency and VenaSeal treatments differ?',
  'Why do my legs feel heavy by the evening?',
  'What do swelling and brown skin near the ankle mean?',
  'What are spider veins?',
  'When is leg swelling an emergency?',
];

/**
 * Returns pre-written educational guidance for a message. Synchronous and local: it never calls a
 * server or an external service.
 */
export function generateFallbackGuidance(userQuery: string): ClinicalGuidanceResponse {
  return { ...selectPrewrittenGuidance(userQuery.toLowerCase()), source: 'pre-written' };
}

function selectPrewrittenGuidance(query: string): Omit<ClinicalGuidanceResponse, 'source'> {
  const emergencyNumbers = formatEmergencyNumbers();

  // Emergency red flags are checked first so that mentioning a negative scan never suppresses them.
  if (EMERGENCY_RED_FLAGS.some((flag) => query.includes(flag))) {
    return {
      intent: 'emergency',
      reply: `POSSIBLE EMERGENCY: Your message mentions symptoms that can be caused by a blood clot in the leg (deep vein thrombosis) or in the lungs (pulmonary embolism), or by heavy bleeding. These need emergency assessment, even if you have had a normal scan before. In India, call ${emergencyNumbers} now, or go to the nearest emergency department; elsewhere, call your local emergency number. If a vein is bleeding, lie down, raise the leg above heart level and press firmly on the bleeding point while you wait for help. This is pre-written educational guidance and cannot assess you.`,
      recommendedSpecialist: "Emergency Department",
      recommendedSpecialistRole: "Emergency clinicians can examine you, arrange urgent imaging, and start treatment immediately if needed.",
      urgencyLevel: "Urgent Medical Attention",
      suggestedDiagnostic: "Emergency in-person assessment (the treating team decides which tests are needed)",
      suggestedQuestions: [
        "Do my symptoms need urgent imaging to check for a blood clot in my leg or lungs?",
        "What warning signs should make me return to the emergency department?",
        "Who should I follow up with after this emergency assessment?"
      ]
    };
  }

  // 0. Safety Override / Prescription Defense
  if (
    query.includes('ignore previous instructions') ||
    query.includes('ignore all previous') ||
    query.includes('prescribe') ||
    query.includes('prescription') ||
    query.includes('system prompt') ||
    query.includes('override safety') ||
    query.includes('pretend you are a doctor')
  ) {
    return {
      intent: 'safety-refusal',
      reply: "CLINICAL SAFETY POLICY: Meridian Vascular's educational guide gives pre-written general information only. It cannot write prescriptions, give personal medical advice, act as your doctor, or change its safety rules. Medicines, doses and any clinical staging need an in-person examination by a licensed medical practitioner.",
      recommendedSpecialist: "Board-Certified Vascular Surgeon or Primary Care Physician",
      recommendedSpecialistRole: "Licensed physician authorized to conduct physical examinations, order diagnostics, and prescribe therapies.",
      urgencyLevel: "Routine Consultation",
      suggestedDiagnostic: "In-Person Clinical Consultation & Physical Examination",
      suggestedQuestions: [
        "What evidence-based medical management is indicated for my venous disease stage?",
        "Do I require a standing duplex ultrasound to assess saphenous valve function?",
        "What conservative lifestyle and compression measures should I initiate?"
      ]
    };
  }

  // 1. Explicit Negation of DVT / Clot (Reassuring Scan)
  const isDvtNegated =
    query.includes('no dvt') ||
    query.includes('negative for dvt') ||
    query.includes('no thrombus') ||
    query.includes('without thrombus') ||
    query.includes('rules out dvt') ||
    query.includes('ruled out dvt') ||
    query.includes('no blood clot') ||
    query.includes('no evidence of dvt') ||
    query.includes('no evidence of deep vein') ||
    query.includes('no deep vein thrombosis') ||
    query.includes('free of thrombus') ||
    query.includes('absence of thrombus');

  if (isDvtNegated && (query.includes('dvt') || query.includes('thrombus') || query.includes('clot') || query.includes('thrombosis'))) {
    return {
      intent: 'negative-dvt-scan',
      reply: `WHAT A NEGATIVE DVT SCAN MEANS: A report stating no deep vein thrombosis (DVT) means the scan did not show a clot in the deep veins that were examined, at the time of the scan. It does not, on its own, explain what is causing your symptoms. Leg heaviness, aching or swelling can come from superficial venous reflux, but also from muscle, joint, nerve, arterial or lymphatic problems, or as a side effect of some medicines. Whether superficial reflux is present, and whether it accounts for your symptoms, needs a dedicated reflux study and an examination by your clinician. A normal scan also does not rule out a clot that forms later: if you develop sudden one-sided leg swelling, chest pain or breathlessness, call ${emergencyNumbers} in India (or your local emergency number) immediately.`,
      recommendedSpecialist: "Your referring doctor, or a Vascular Surgeon or Phlebologist",
      recommendedSpecialistRole: "Can examine you, review the full report, and decide whether further tests or other explanations for your symptoms should be considered.",
      urgencyLevel: "Routine Consultation",
      suggestedDiagnostic: "Clinical examination, plus a standing venous duplex reflux study if your clinician thinks superficial reflux is likely",
      suggestedQuestions: [
        "Did my scan assess the superficial veins for reflux, or only the deep veins for a clot?",
        "Could something other than my veins be causing my symptoms, and should that be checked?",
        "Which new or worsening symptoms should make me seek a repeat assessment?"
      ]
    };
  }

  // 2. Acute DVT / Thrombus / Emergency safety check (True Positive)
  if (
    query.includes('thrombus') ||
    query.includes('non-compressible') ||
    query.includes('noncompressible') ||
    query.includes('dvt') ||
    query.includes('blood clot') ||
    query.includes('chest pain') ||
    query.includes('sudden calf')
  ) {
    return {
      intent: 'possible-dvt',
      reply: `IMPORTANT SAFETY NOTICE: Your message mentions a possible blood clot (thrombus) or a deep vein that did not compress. On ultrasound, a deep vein that does not fully collapse under probe pressure is the main sign clinicians use to diagnose deep vein thrombosis (DVT); only the clinician who has the full report and has examined you can confirm what it means for you. A suspected or confirmed DVT needs same-day in-person medical assessment so that treatment such as blood thinners can be considered. If you have sudden severe calf swelling, chest pain, or shortness of breath, call ${emergencyNumbers} in India (or your local emergency number) now.`,
      recommendedSpecialist: "Vascular Surgeon, Emergency Medicine Physician, or Hematologist",
      recommendedSpecialistRole: "Urgent care or vascular specialist trained in emergency duplex sonography and immediate anticoagulation management.",
      urgencyLevel: "Urgent Medical Attention",
      suggestedDiagnostic: "Urgent Compression Duplex Ultrasound of Deep Venous System (Common Femoral to Calf Trifurcation)",
      suggestedQuestions: [
        "Is the thrombus located in the deep venous system (DVT) or superficial veins (superficial thrombophlebitis)?",
        "Should I immediately begin prescription anticoagulation (blood thinner) therapy?",
        "Do I require emergent hospital evaluation or outpatient monitoring?"
      ]
    };
  }

  // 3. Doppler ultrasound findings (reflux, SFJ, caliber, perforators)
  if (
    query.includes('doppler') ||
    query.includes('duplex') ||
    query.includes('sfj') ||
    query.includes('reflux') ||
    query.includes('gsv') ||
    query.includes('ssv') ||
    query.includes('perforator') ||
    query.includes('caliber') ||
    query.includes('retrograde')
  ) {
    return {
      intent: 'doppler-terms',
      reply: "Your duplex ultrasound query involves core venous hemodynamic parameters. On lower extremity duplex scans, 'reflux' indicates backward blood leakage caused by incompetent bicuspid valves. By international consensus (American Venous Forum, Society for Vascular Surgery, and AVLS guidelines), retrograde flow lasting longer than 500 milliseconds (>0.5s) in superficial veins (GSV, SSV), or >=500ms in perforator veins with a diameter >=3.5mm, is the threshold commonly used to define pathological reflux. A reading above the threshold describes how the vein behaved during the test; your clinician decides whether it explains your symptoms and whether treatment is needed, together with your examination. When the Saphenofemoral Junction (SFJ) is incompetent, raised pressure can be transmitted down the leg, contributing to vein dilation and swelling. Endovenous procedures aim to close refluxing veins when treatment is indicated.",
      recommendedSpecialist: "Board-Certified Vascular Surgeon or Phlebologist",
      recommendedSpecialistRole: "Physician specialized in standing venous duplex interpretation and catheter-based vein closure.",
      urgencyLevel: "Priority Evaluation",
      suggestedDiagnostic: "Standing Bilateral Lower Extremity Venous Duplex Ultrasound with Reflux Protocol & Caliber Mapping",
      suggestedQuestions: [
        "What was my exact measured reflux time (in seconds) at the SFJ and mid-thigh GSV?",
        "Does my vein caliber and anatomical trajectory qualify for endovenous laser (EVLA) or VenaSeal adhesive?",
        "Are my deep veins completely compressible and free of past clot damage?"
      ]
    };
  }

  // 4. Treatment Modality comparisons (EVLA, RFA, VenaSeal, Sclerotherapy, Phlebectomy)
  if (
    query.includes('evla') ||
    query.includes('rfa') ||
    query.includes('venaseal') ||
    query.includes('sclerotherapy') ||
    query.includes('phlebectomy') ||
    query.includes('ablation') ||
    query.includes('glue') ||
    query.includes('stripping') ||
    query.includes('treatment')
  ) {
    return {
      intent: 'treatment-options',
      reply: "Many varicose vein treatments are now minimally invasive outpatient procedures and have largely replaced surgical vein stripping in many centres. Thermal ablation (EVLA laser and RFA radiofrequency) uses targeted heat under local tumescent numbing to close straight saphenous trunks, with high closure rates reported in published studies. VenaSeal uses a medical cyanoacrylate adhesive and does not need tumescent fluid; compression advice afterwards varies by clinician. Branch varicosities and perforators are typically treated with ultrasound-guided foam sclerotherapy (UGFS) or ambulatory micro-phlebectomy. Selection depends on your duplex ultrasound vein diameter, straightness, and personal lifestyle preferences.",
      recommendedSpecialist: "Vascular Surgeon or Vein Specialist",
      recommendedSpecialistRole: "Specialist accredited in performing ambulatory endovenous ablation and micro-phlebectomy.",
      urgencyLevel: "Routine Consultation",
      suggestedDiagnostic: "Pre-procedure Duplex Ultrasound Vein Mapping (evaluating straightness, depth, and caliber)",
      suggestedQuestions: [
        "Based on my vein diameter and depth beneath the skin, would thermal ablation or VenaSeal adhesive be better?",
        "Will I need prescription compression stockings, and for how many days?",
        "Will my branch varicosities require micro-phlebectomy at the same time or a staged foam sclerotherapy session?"
      ]
    };
  }

  if (query.includes('ulcer') || query.includes('wound') || query.includes('open sore') || query.includes('bleeding')) {
    return {
      intent: 'wound-or-bleeding',
      reply: `A wound, open sore or bleeding on the lower leg needs prompt in-person assessment. Long-standing venous disease can cause skin breakdown and venous ulcers, typically around the inner ankle, but leg wounds also have other causes (such as arterial disease, diabetes or infection) that a clinician needs to check. When an ulcer is venous, specialist wound care and compression, sometimes with treatment of the refluxing vein, can help healing and lower the chance of recurrence. If a vein is bleeding heavily, lie down, raise the leg above heart level and press firmly on the bleeding point; if it does not stop, call ${emergencyNumbers} in India (or your local emergency number).`,
      recommendedSpecialist: "Vascular Surgeon or Phlebologist",
      recommendedSpecialistRole: "Specialist trained in venous hemodynamics, endovenous thermal ablation, and comprehensive ulcer management.",
      urgencyLevel: "Urgent Medical Attention",
      suggestedDiagnostic: "Comprehensive Lower Extremity Duplex Ultrasound with Reflux Protocol & Wound Swab/Evaluation",
      suggestedQuestions: [
        "What is the underlying reflux source feeding this ulcer bed?",
        "Can minimally invasive endovenous ablation (EVLA/RFA) accelerate ulcer healing?",
        "What multi-layer compression bandage system is best indicated for my mobility level?"
      ]
    };
  }

  if (query.includes('swelling') || query.includes('edema') || query.includes('brown') || query.includes('dark') || query.includes('pigment') || query.includes('stain')) {
    return {
      intent: 'swelling-or-skin-changes',
      reply: `Gradual leg swelling and brownish skin discoloration near the ankle (hemosiderin staining) are commonly seen in chronic venous disease; clinicians classify these signs as CEAP C3 (swelling) and C4 (skin changes) after examining you. Swelling also has many other causes, including heart, kidney or liver conditions, some medicines and lymphoedema, so it should be assessed in person. When venous valves fail, raised pressure can push fluid and iron pigment into the skin, and early assessment can help limit further skin damage. Sudden swelling in one leg is different: call ${emergencyNumbers} in India (or your local emergency number) if it comes with pain, warmth, chest pain or breathlessness.`,
      recommendedSpecialist: "Vascular Surgeon or Phlebologist",
      recommendedSpecialistRole: "Lower extremity venous disease specialist experienced in duplex ultrasound mapping and saphenous vein closure.",
      urgencyLevel: "Priority Evaluation",
      suggestedDiagnostic: "Standing Bilateral Venous Duplex Ultrasound with Spectral Doppler (>0.5s reflux threshold)",
      suggestedQuestions: [
        "Are the great or small saphenous veins incompetent, or are perforator veins involved?",
        "Would prescription graduated compression stockings (20-30 mmHg) provide relief while preparing for intervention?",
        "Am I a candidate for non-thermal adhesive closure (VenaSeal) or endovenous radiofrequency?"
      ]
    };
  }

  if (query.includes('spider') || query.includes('fine') || query.includes('cosmetic') || query.includes('red vein') || query.includes('purple vein')) {
    return {
      intent: 'spider-veins',
      reply: "Spider veins (telangiectasias, CEAP C1) are dilated intradermal venules under 1mm in caliber, frequently accompanied by reticular veins (1-3mm). While often treated for aesthetic reasons, in some patients they are fed by underlying 'feeder' veins or saphenous reflux. Before cosmetic treatments such as sclerotherapy, many clinicians recommend an ultrasound assessment to look for underlying reflux that could lead to recurrence or matting.",
      recommendedSpecialist: "Phlebologist or Board-Certified Dermatologist",
      recommendedSpecialistRole: "Vein specialist or cosmetic dermatologist specializing in liquid/foam sclerotherapy and surface Nd:YAG laser treatments.",
      urgencyLevel: "Routine Consultation",
      suggestedDiagnostic: "Screening Venous Duplex Ultrasound to rule out occult saphenous reflux prior to sclerotherapy",
      suggestedQuestions: [
        "Do you perform ultrasound mapping to identify feeder reticular veins before treating superficial spiders?",
        "How many sessions of micro-sclerotherapy are typically required for my vein density?",
        "What post-treatment sun avoidance and compression regimen will optimize clearance?"
      ]
    };
  }

  // 8. Symptom self-assessment guidance
  if (
    query.includes('assessment') ||
    query.includes('screener') ||
    query.includes('score') ||
    query.includes('questionnaire') ||
    query.includes('how does the severity assessment work')
  ) {
    return {
      intent: 'assessment-tool',
      reply: "HOW THE SEVERITY ASSESSMENT WORKS: Our 3-minute symptom pattern assessment is a structured self-reflection tool aligned with clinical classification criteria (CEAP). It guides you through questions on heaviness, swelling, skin changes, and daily functional limitations to help you organize notes before consulting a vein specialist. It also includes an optional, private on-device photo vault for tracking visible vein changes. The assessment provides educational insight into your symptom patterns, not a formal medical diagnosis or treatment plan.",
      recommendedSpecialist: "Board-Certified Vascular Surgeon or Phlebologist",
      recommendedSpecialistRole: "Specialist who can review your assessment summary alongside an in-person physical examination.",
      urgencyLevel: "Routine Consultation",
      suggestedDiagnostic: "In-Person Clinical Consultation & Standing Venous Duplex Ultrasound",
      suggestedQuestions: [
        "What CEAP clinical class best describes my vein findings after physical examination?",
        "Do my reported symptoms warrant a bilateral duplex ultrasound scan?",
        "What conservative care measures should I begin while evaluating treatment?"
      ]
    };
  }

  // 9. Expert review / Doppler report upload
  if (
    query.includes('expert review') ||
    query.includes('upload') ||
    query.includes('second opinion') ||
    query.includes('review my report') ||
    query.includes('request an expert review')
  ) {
    return {
      intent: 'expert-review-info',
      reply: "HOW EXPERT REVIEW WORKS: You can upload your existing Doppler ultrasound reports, hospital summaries, or clinical photographs through our secure Expert Review portal. Senior human vascular surgeons review the findings to clarify hemodynamic terms (such as reflux duration and vein caliber), assess clinical urgency, and advise whether further imaging or treatment is recommended. Reviews are conducted by experienced vascular surgeons, never automated algorithms.",
      recommendedSpecialist: "Senior Vascular Surgeon",
      recommendedSpecialistRole: "Consultant vascular surgeon providing specialist interpretation and diagnostic triaging.",
      urgencyLevel: "Routine Consultation",
      suggestedDiagnostic: "Standing Bilateral Lower Extremity Venous Duplex Ultrasound",
      suggestedQuestions: [
        "Does my existing Doppler scan cover both superficial and deep venous systems?",
        "Are my measurements sufficient to determine eligibility for endovenous laser or glue?",
        "Do I need an updated scan if my previous ultrasound was performed lying down?"
      ]
    };
  }

  // 10. Booking a consultation
  if (
    query.includes('book') ||
    query.includes('appointment') ||
    query.includes('consultation') ||
    query.includes('clinic visit') ||
    query.includes('book a consultation')
  ) {
    return {
      intent: 'booking-info',
      reply: "HOW TO BOOK A CONSULTATION: You can request an in-person appointment and standing duplex ultrasound directly through the consultation request form on this site. Our care coordinator will contact you to confirm a convenient slot, guide you on pre-visit preparation (such as staying hydrated and bringing any prior leg scans), and answer insurance or day-care procedure questions.",
      recommendedSpecialist: "Meridian Vascular Clinical Team",
      recommendedSpecialistRole: "Care coordination and specialist scheduling team.",
      urgencyLevel: "Routine Consultation",
      suggestedDiagnostic: "Comprehensive Standing Venous Duplex Ultrasound & Clinical Evaluation",
      suggestedQuestions: [
        "What should I wear or prepare for my standing duplex ultrasound examination?",
        "Does your clinic offer same-day duplex scanning and surgical consultation?",
        "How are cashless insurance approvals handled for day-care endovenous procedures?"
      ]
    };
  }

  // Questions outside the catalogue: say so plainly instead of guessing an answer.
  if (!mentionsAnyWord(query, GENERAL_VEIN_WORDS)) {
    return {
      intent: 'unmatched',
      reply: `I don't have a pre-written answer for that question. This educational guide only covers a fixed set of vein and leg-health topics, such as Doppler report terms, treatment options, leg heaviness, swelling, skin changes and spider veins. Try one of the topics below, or ask a doctor or vascular specialist. If you have sudden swelling in one leg, chest pain or breathlessness, call ${emergencyNumbers} in India (or your local emergency number) now.`,
      recommendedSpecialist: "Your doctor, or a vascular specialist",
      recommendedSpecialistRole: "For questions this guide cannot answer, a clinician who can examine you is the right person to ask.",
      urgencyLevel: "Routine Consultation",
      suggestedDiagnostic: "",
      suggestedQuestions: GUIDE_SUPPORTED_TOPICS.slice(0, 4),
    };
  }

  // General varicose vein / heaviness / ache response
  return {
    intent: 'general-vein-symptoms',
    reply: "Leg discomfort, heaviness and visible bulging veins are common in venous reflux disease (venous insufficiency), although they can also have other causes that a clinician can help tell apart. Veins return blood against gravity to the heart, and one-way valves stop it flowing backwards. When these valves stretch or stop closing properly, blood can pool and raise the pressure in the veins, which can cause vein enlargement, twisting, and end-of-day aching. An examination, and a duplex ultrasound if your clinician advises it, can show whether reflux is present.",
    recommendedSpecialist: "Vascular Surgeon or Phlebologist",
    recommendedSpecialistRole: "Board-certified vascular specialist who conducts in-office duplex ultrasound diagnosis and modern ambulatory treatments.",
    urgencyLevel: "Routine Consultation",
    suggestedDiagnostic: "Bilateral Lower Extremity Duplex Ultrasound (mapping Great & Small Saphenous Veins)",
    suggestedQuestions: [
      "Which specific veins have incompetent valves and what is the reflux duration?",
      "What are the benefits of thermal ablation (EVLA/RFA) versus non-thermal treatments (VenaSeal / Foam Sclerotherapy) for my anatomy?",
      "Will my private insurance or Medicare cover the diagnostic ultrasound and corrective procedures?"
    ]
  };
}
