import { AssessmentQuestion, AssessmentResult, SymptomSeverityLevel } from '../types';

export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 1,
    title: "1. Visible Veins",
    desc: "Do you have visible, enlarged, or twisted veins on your legs?",
    clinicalSignificance: "Evaluates physical dilation of the subcutaneous and superficial venous network (saphenous tributaries).",
    options: [
      { label: "No visible veins noticed", score: 0, description: "Normal appearance with smooth skin contour." },
      { label: "Mild spider veins (fine web-like lines)", score: 1, description: "Telangiectasias (<1mm) or reticular veins (1-3mm), reddish or bluish." },
      { label: "Noticeably raised or bulging veins in a few areas", score: 2, description: "Palpable, elevated varicose cords (>3mm) typically along calf or thigh." },
      { label: "Extensive, prominent, twisted veins along calves or thighs", score: 3, description: "Severe, tortuous, clustered vein ropes visible while standing." }
    ]
  },
  {
    id: 2,
    title: "2. Pain / Aching",
    desc: "How often do you experience aching, throbbing, or discomfort in your legs?",
    clinicalSignificance: "Reflects elevated venous hypertension stretching perivascular nociceptors and myofascial compartments.",
    options: [
      { label: "Never or rarely", score: 0, description: "No regular leg discomfort or ache." },
      { label: "Mild ache after strenuous activity", score: 1, description: "Discomfort only following rigorous gym workouts or long walks." },
      { label: "Frequent dull ache by the end of the day", score: 2, description: "Consistent tired, burning, or throbbing feeling in calves by evening." },
      { label: "Persistent, severe pain affecting everyday tasks", score: 3, description: "Debilitating chronic ache that interferes with standing, work, or leisure." }
    ]
  },
  {
    id: 3,
    title: "3. Leg Heaviness",
    desc: "Do your legs feel heavy or tired, especially after sitting or standing?",
    clinicalSignificance: "Hallmark sensation of impaired venous return, where pooled blood adds hydrostatic column weight.",
    options: [
      { label: "Never", score: 0, description: "Legs feel light and energetic throughout the day." },
      { label: "Occasionally after very long shifts", score: 1, description: "Mild heaviness after 8+ hours on feet or long international travel." },
      { label: "Frequently noticeable in the afternoons or evenings", score: 2, description: "Regular heavy, leaden sensation that makes climbing stairs feel taxing." },
      { label: "Constant heavy feeling almost every day", score: 3, description: "Chronic fatigue in legs that is present even in morning hours." }
    ]
  },
  {
    id: 4,
    title: "4. Swelling (Edema)",
    desc: "Do you notice swelling around your ankles, feet, or lower legs?",
    clinicalSignificance: "High capillary hydrostatic pressure pushes plasma filtrate into interstitial lower limb spaces (CEAP C3).",
    options: [
      { label: "No swelling", score: 0, description: "Ankles and feet remain defined and slender." },
      { label: "Mild swelling on hot days or long flights", score: 1, description: "Slight transient puffiness that resolves completely overnight." },
      { label: "Regular ankle swelling that leaves sock marks by evening", score: 2, description: "Visible pitting edema and tight shoe fit after normal daily routines." },
      { label: "Persistent, significant swelling throughout the day", score: 3, description: "Chronic edema extending up calves that fails to fully resolve with elevation." }
    ]
  },
  {
    id: 5,
    title: "5. Itching or Burning",
    desc: "Do you experience itching, burning, or heat sensations near your veins?",
    clinicalSignificance: "Leukocyte extravasation and inflammatory cytokine release cause stasis dermatitis and pruritus.",
    options: [
      { label: "None", score: 0, description: "Skin feels calm with no burning or itching sensations." },
      { label: "Occasional mild itchiness", score: 1, description: "Intermittent mild itch, often mistaken for dry winter skin." },
      { label: "Frequent burning sensation or itching around visible veins", score: 2, description: "Hot, stinging or itchy patches directly over varicosities." },
      { label: "Severe, persistent itch, burning or eczema-like skin irritation", score: 3, description: "Intense stasis dermatitis with flaky, irritated, or fragile red skin." }
    ]
  },
  {
    id: 6,
    title: "6. Skin Changes & Discoloration",
    desc: "Have you observed skin darkening, hardening, or eczema patches on your lower leg or ankle?",
    clinicalSignificance: "Critical indicator of CEAP C4 (hemosiderin staining or lipodermatosclerosis) preceding ulceration.",
    options: [
      { label: "Normal skin tone and texture", score: 0, description: "Uniform skin color without dark pigmentation or induration." },
      { label: "Slight brownish or reddish freckling near inner ankles", score: 1, description: "Early hemosiderin deposition from lysed red blood cells." },
      { label: "Thickened, hardened, or dark bronze leathery skin (lipodermatosclerosis)", score: 2, description: "Firm, bound-down skin resembling an inverted champagne bottle leg contour." },
      { label: "Active open sore or history of healed venous leg ulcer", score: 3, description: "Skin breakdown (clinicians classify this as CEAP C5/C6) needing prompt in-person assessment." }
    ]
  },
  {
    id: 7,
    title: "7. Nocturnal Symptoms & Night Cramps",
    desc: "Do painful muscle spasms, calf cramps, or restless leg sensations wake you during the night?",
    clinicalSignificance: "Nocturnal venous stasis and local metabolic waste buildup trigger involuntary muscle contractions.",
    options: [
      { label: "Sleep uninterrupted without leg discomfort", score: 0, description: "No muscle cramps or leg restlessness during sleep." },
      { label: "Mild calf tightness or rare cramp after exertion", score: 1, description: "Infrequent night cramp once a month or less." },
      { label: "Frequent calf cramps or restless legs disturbing sleep", score: 2, description: "Wake up 2-3 times weekly needing to massage or shake legs." },
      { label: "Severe nightly throbbing cramps or crawling sensations", score: 3, description: "Severe disruption of restorative sleep every night." }
    ]
  },
  {
    id: 8,
    title: "8. Occupational Posture & Standing",
    desc: "What best describes your average daytime standing or sitting routine?",
    clinicalSignificance: "Inactivity of the calf muscle pump allows venous pressures to remain at continuous hydrostatic maximum (~90 mmHg).",
    options: [
      { label: "Active movement with frequent walking & posture shifts", score: 0, description: "Dynamic daily routine that continually activates calf muscle pumps." },
      { label: "Continuous sitting or standing for 2–4 hours", score: 1, description: "Moderate desk work with intermittent walking breaks." },
      { label: "Static standing or chair sitting for 5–7 hours daily", score: 2, description: "Prolonged desk bound or retail posture with infrequent walking." },
      { label: "Prolonged static standing or sitting >8 hours daily", score: 3, description: "Healthcare, manufacturing, or commercial driving with virtually no leg elevation." }
    ]
  }
];

/** Question 6 option scored 3: "Active open sore or history of healed venous leg ulcer". */
const SKIN_BREAKDOWN_QUESTION_ID = 6;
const SKIN_BREAKDOWN_SCORE = 3;

export function symptomPatternLabel(level: SymptomSeverityLevel): string {
  return `${level} symptom pattern`;
}

/**
 * Explains why the screener result is not a CEAP class. CEAP is a clinician-assigned classification
 * based on examination (and often imaging); a symptom questionnaire cannot assign it.
 */
export const SYMPTOM_PATTERN_DISCLAIMER =
  'This is a summary of the symptoms you reported, not a diagnosis or a CEAP class. CEAP is a classification clinicians assign after examining your legs, often with a duplex ultrasound.';

export function calculateAssessmentResult(answers: Record<number, number>): AssessmentResult {
  const result = scoreSymptomPattern(answers);
  return {
    ...result,
    urgentCareAdvised:
      result.severityLevel === 'Severe' || answers[SKIN_BREAKDOWN_QUESTION_ID] === SKIN_BREAKDOWN_SCORE,
  };
}

function scoreSymptomPattern(answers: Record<number, number>): Omit<AssessmentResult, 'urgentCareAdvised'> {
  const totalScore = Object.values(answers).reduce((sum, val) => sum + val, 0);
  const maxScore = ASSESSMENT_QUESTIONS.length * 3; // 24
  const percentage = Math.round((totalScore / maxScore) * 100);

  if (totalScore <= 3) {
    return {
      totalScore,
      maxScore,
      percentage,
      symptomPatternTitle: "Few or no self-reported venous symptoms",
      severityLevel: "Minimal",
      severityColor: "#2E6E62", // Teal
      summary: "You reported few or no symptoms commonly linked to venous disease, such as aching, heaviness, swelling or skin changes.",
      pathologyDetails: "A questionnaire cannot check how your vein valves work. If you notice new or worsening symptoms, a clinician can examine you and decide whether a scan is needed.",
      recommendedAction: "Maintain preventive habits: regular walking, avoiding prolonged static standing, and elevating legs after long journeys.",
      suggestedSpecialist: "Primary Care Physician or Phlebologist (if spider vein cosmetic clearance is desired)",
      diagnosticRecommendation: "Discuss with your doctor if symptoms appear or spider veins become bothersome; they will decide whether any test is needed.",
      lifestyleMeasures: [
        "Stay active: aim for 30 minutes of aerobic walking daily to engage calf muscle pump",
        "Take 2-minute walking or ankle-pumping breaks every 60 minutes of desk sitting",
        "Maintain adequate hydration to support optimal blood rheology",
        "Consider mild 15-20 mmHg travel socks on flights or long road trips"
      ]
    };
  }

  if (totalScore <= 8) {
    return {
      totalScore,
      maxScore,
      percentage,
      symptomPatternTitle: "Some symptoms often associated with early venous disease",
      severityLevel: "Mild",
      severityColor: "#B98B2E", // Gold
      summary: "You reported some symptoms, such as visible veins, leg heaviness or evening tiredness, that are often seen in early venous disease but can also have other causes.",
      pathologyDetails: "When one-way valves in the superficial veins stop closing properly, blood can flow backwards and pool. Only an examination, and a duplex ultrasound if your clinician advises it, can show whether this is happening.",
      recommendedAction: "Consider discussing your symptoms with a doctor, who can examine your legs and decide whether a venous duplex ultrasound is needed.",
      suggestedSpecialist: "Phlebologist or Board-Certified Vascular Specialist",
      diagnosticRecommendation: "If your clinician recommends imaging, the usual test is a standing venous duplex ultrasound with reflux assessment.",
      lifestyleMeasures: [
        "Incorporate graduated compression stockings (Class 1, 15-20 mmHg or Class 2, 20-30 mmHg) during work hours",
        "Elevate legs above heart level for 15-20 minutes every evening",
        "Avoid high-temperature baths, saunas, and prolonged hot tubs that cause venous vasodilatation",
        "Perform heel-to-toe calf raises when standing in stationary lines"
      ]
    };
  }

  if (totalScore <= 14) {
    return {
      totalScore,
      maxScore,
      percentage,
      symptomPatternTitle: "Symptoms often associated with venous disease, including swelling",
      severityLevel: "Moderate",
      severityColor: "#D97706", // Amber
      summary: "You reported regular swelling, aching and visible veins. This pattern is common in chronic venous disease, but swelling in particular has other possible causes that a clinician should consider.",
      pathologyDetails: "In venous disease, backward flow (reflux) in the saphenous veins can raise pressure and push fluid into the tissues. Whether you have reflux, and how long it lasts, can only be measured with a duplex ultrasound.",
      recommendedAction: "Arrange an assessment with a doctor or vein specialist, who can examine you, decide whether a duplex ultrasound is needed, and discuss treatment options if venous disease is confirmed.",
      suggestedSpecialist: "Board-Certified Vascular Surgeon or Phlebologist",
      diagnosticRecommendation: "If your clinician recommends imaging, a venous duplex ultrasound can map the veins and check the saphenofemoral junction (SFJ).",
      lifestyleMeasures: [
        "Ask your clinician whether graduated compression stockings are suitable for you, and which strength to use",
        "Frequent leg elevation (at least 3-4 times daily for 15 minutes)",
        "Gentle non-impact exercise: swimming, cycling, and brisk walking",
        "Inspect lower leg skin regularly for redness, flakiness, or heat"
      ]
    };
  }

  if (totalScore <= 19) {
    return {
      totalScore,
      maxScore,
      percentage,
      symptomPatternTitle: "Symptoms that may reflect skin changes from venous disease",
      severityLevel: "Advanced",
      severityColor: "#EA580C", // Deep Orange
      summary: "You reported symptoms such as skin darkening, itching, eczema-like patches or hardened skin, alongside other venous symptoms. These skin changes can occur in more advanced venous disease, and also with other skin or circulation conditions.",
      pathologyDetails: "Long-standing high pressure in the leg veins can lead to skin staining, inflammation and hardening. A clinician needs to examine your skin to confirm the cause.",
      recommendedAction: "Arrange a prompt (non-emergency) assessment with a doctor or vascular specialist so that skin changes can be examined and protected.",
      suggestedSpecialist: "Vascular Surgeon or Vein Clinic Medical Director",
      diagnosticRecommendation: "Your clinician may recommend a venous duplex ultrasound, including the perforator veins.",
      lifestyleMeasures: [
        "Use compression only as advised by your clinician, who will check it is safe for you",
        "Hydrate and protect fragile skin with barrier emollients (avoid fragranced lotions)",
        "Prompt medical attention if skin feels warm, tight, or displays new localized red tender spots",
        "Ask your clinician whether treating any vein reflux found on ultrasound could help protect your skin"
      ]
    };
  }

  return {
    totalScore,
    maxScore,
    percentage,
    symptomPatternTitle: "Symptoms that may reflect advanced venous disease, including possible skin breakdown",
    severityLevel: "Severe",
    severityColor: "#6B2737", // Wine
    summary: "You reported many severe symptoms, which may include skin breakdown or a leg ulcer. This pattern needs prompt in-person medical assessment.",
    pathologyDetails: "Advanced venous disease can affect the skin's ability to heal. Leg wounds can also be caused by arterial disease, diabetes or infection, so a clinician needs to examine you to find the cause.",
    recommendedAction: "Arrange an in-person assessment soon (within days), and sooner if a wound is getting worse. Use the emergency guidance below if you have any emergency warning signs.",
    suggestedSpecialist: "Vascular Surgeon, Phlebologist, and Wound Care Specialist",
    diagnosticRecommendation: "Your clinician may arrange a wound assessment, a venous duplex ultrasound, and an ankle-brachial index (ABI) to check the arteries.",
    lifestyleMeasures: [
      "Follow specialized multi-layer compression bandage protocols under clinical supervision",
      "Do not walk barefoot; protect ankles and gaiter zones from micro-trauma",
      "Keep wounds clean, dry, and dressed with non-adherent foam dressings",
      "Arrange a prompt in-person assessment with a doctor or wound care service"
    ]
  };
}
