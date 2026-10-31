export interface DopplerTermDefinition {
  id: string;
  term: string;
  category: 'Hemodynamics' | 'Anatomy' | 'Diagnostic Metric' | 'Deep Vein Safety' | 'Perforators';
  plainEnglish: string;
  anatomicalContext: string;
  clinicalThreshold: string;
  urgencyLevel: 'Described Negative in Text' | 'Normal / Reassuring' | 'Routine Clinical Discussion' | 'Priority Evaluation' | 'Urgent Medical Attention';
  urgencyBadgeColor: string;
  questionsForDoctor: string[];
}

export interface SyntheticDopplerReport {
  id: string;
  title: string;
  facility: string;
  date: string;
  patientReference: string;
  indication: string;
  protocol: string;
  findingsSummary: {
    label: string;
    value: string;
    highlightColor: string;
  }[];
  excerptHtml: {
    textBefore: string;
    termId: string;
    termLabel: string;
    textAfter: string;
  }[];
  sonographerNotes: string;
}

export const DOPPLER_DICTIONARY: Record<string, DopplerTermDefinition> = {
  'sfj-incompetence': {
    id: 'sfj-incompetence',
    term: 'Saphenofemoral Junction (SFJ) Incompetence',
    category: 'Anatomy',
    plainEnglish: 'The primary gatekeeper valve where the superficial Great Saphenous Vein meets the deep Common Femoral Vein in the groin is failing to close completely. Instead of moving upward toward the heart, blood is spilling backwards down the thigh, creating hydrostatic pressure.',
    anatomicalContext: 'The SFJ is the highest superficial-to-deep connection in the leg. When incompetent, it acts like an open tap feeding high pressure down the entire length of the medial leg.',
    clinicalThreshold: 'Retrograde flow > 500 ms (>0.5s) upon release of distal compression confirms valvular incompetence (American Venous Forum / SVS Consensus).',
    urgencyLevel: 'Priority Evaluation',
    urgencyBadgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    questionsForDoctor: [
      'Is the reflux originated right at the terminal valve of the junction, or the sub-terminal valve?',
      'Does the incompetent junction require endovenous thermal ablation (EVLA/RFA) or non-thermal adhesive closure?',
      'Will treating the SFJ relieve the swelling and pressure in my lower calf?'
    ]
  },
  'reflux-duration': {
    id: 'reflux-duration',
    term: 'Reflux Duration > 0.5 Seconds',
    category: 'Diagnostic Metric',
    plainEnglish: 'Healthy vein valves snap shut within 0.2 to 0.5 seconds when calf compression is released. A measured backward flow duration exceeding 500 milliseconds (0.5s) indicates reflux. However, ultrasound numbers alone do not dictate surgery; they are evaluated alongside your physical symptoms and clinical history by a qualified physician.',
    anatomicalContext: 'Measured with pulsed-wave spectral Doppler while you stand, after a calibrated calf squeeze or Valsalva maneuver.',
    clinicalThreshold: 'Superficial veins: > 0.5s (>500ms) is pathological. Deep femoral/popliteal veins: > 1.0s (>1000ms) is pathological. Perforator veins: >= 0.5s (>=500ms) with diameter >= 3.5mm is pathological (SVS/AVF/AVLS consensus).',
    urgencyLevel: 'Priority Evaluation',
    urgencyBadgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    questionsForDoctor: [
      'What was my exact measured reflux time in milliseconds?',
      'Does this reflux duration meet the medical necessity threshold for insurance or private healthcare coverage?',
      'Is the reflux continuous throughout the cardiac cycle, or only provoked by standing?'
    ]
  },
  'gsv-caliber': {
    id: 'gsv-caliber',
    term: 'Great Saphenous Vein (GSV) Caliber / Diameter',
    category: 'Diagnostic Metric',
    plainEnglish: 'The physical width of your main superficial leg vein. Normal veins are typically 3 to 4 mm wide. Chronic high venous pressure causes the vein wall to stretch and dilate over time.',
    anatomicalContext: 'Measured at standard anatomical landmarks: at the saphenofemoral junction, proximal thigh, mid-thigh, and below the knee.',
    clinicalThreshold: 'Veins dilated > 5.5 mm to 6.0 mm with documented reflux frequently cause noticeable symptoms and qualify for catheter ablation.',
    urgencyLevel: 'Routine Clinical Discussion',
    urgencyBadgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
    questionsForDoctor: [
      'Is my vein diameter within the optimal range for endovenous laser or VenaSeal adhesive?',
      'Is the vein dilated only above the knee, or does the dilation extend down into the lower calf?',
      'Is the vein straight or tortuous (curved), and how does that affect catheter access?'
    ]
  },
  'perforator-incompetence': {
    id: 'perforator-incompetence',
    term: 'Incompetent Perforator Vein',
    category: 'Perforators',
    plainEnglish: 'Perforator veins act as connecting bridges that channel blood from the skin surface inward into the deep muscular veins. When their one-way valves fail, high-pressure muscular pumps blast blood outward towards the skin, often causing skin discoloration or ulcerations.',
    anatomicalContext: 'Commonly located in the lower third of the calf (Cockett, Sherman, and Dodd perforator groups) in the gaiter zone.',
    clinicalThreshold: 'Outward flow duration >= 0.5 seconds (>=500ms) with a fascial defect diameter >= 3.5 mm indicates pathological perforator incompetence (SVS/AVF/AVLS consensus).',
    urgencyLevel: 'Priority Evaluation',
    urgencyBadgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    questionsForDoctor: [
      'Is this perforator vein feeding the area of skin darkening or tenderness near my inner ankle?',
      'Should we treat the main saphenous trunk first, or treat the perforator simultaneously?',
      'Can this perforator be closed with ultrasound-guided foam sclerotherapy or targeted laser?'
    ]
  },
  'deep-vein-compressibility': {
    id: 'deep-vein-compressibility',
    term: 'Deep Veins Compressible & Patent',
    category: 'Deep Vein Safety',
    plainEnglish: 'When the sonographer presses the ultrasound probe against the leg, normal deep veins collapse completely under pressure. In duplex protocols, full compressibility indicates that no occlusive thrombus (Deep Vein Thrombosis / DVT) was identified in the visualized deep venous conduits.',
    anatomicalContext: 'Evaluates the Common Femoral, Femoral, and Popliteal deep venous conduits inside the leg muscles.',
    clinicalThreshold: 'Complete luminal collapse under gentle probe pressure is the international diagnostic gold standard for ruling out acute DVT.',
    urgencyLevel: 'Described Negative in Text',
    urgencyBadgeColor: 'bg-slate-100 text-slate-800 border-slate-300',
    questionsForDoctor: [
      'Are my deep veins carrying 90% of the venous return normally?',
      'Does full deep vein patency confirm that it is safe to close the diseased superficial vein?',
      'Were any signs of old, resolved clot scarring observed?'
    ]
  },
  'non-compressible-alert': {
    id: 'non-compressible-alert',
    term: 'Non-Compressible Vein Segment / Intraluminal Thrombus',
    category: 'Deep Vein Safety',
    plainEnglish: 'CRITICAL SAFETY FINDING: The vein does not collapse under ultrasound probe pressure, indicating that an intraluminal blood clot (thrombus) is present. If located in the deep venous system (DVT), this requires urgent medical evaluation to start anticoagulation medication.',
    anatomicalContext: 'Can occur in deep muscular veins (DVT) or superficial saphenous branches (superficial thrombophlebitis). Deep vein involvement carries pulmonary embolism risks.',
    clinicalThreshold: 'Failure of complete compression confirms luminal obstruction by thrombus.',
    urgencyLevel: 'Urgent Medical Attention',
    urgencyBadgeColor: 'bg-rose-100 text-rose-900 border-rose-300',
    questionsForDoctor: [
      'Is the clot in the deep venous system (DVT) or confined to a superficial vein?',
      'Do I need immediate prescription blood thinners (anticoagulants)?',
      'Do I need urgent hospital evaluation or emergency department assessment?'
    ]
  },
  'ssv-incompetence': {
    id: 'ssv-incompetence',
    term: 'Small Saphenous Vein (SSV) / SPJ Reflux',
    category: 'Anatomy',
    plainEnglish: 'The Small Saphenous Vein runs up the back of your calf and drains into the deep popliteal vein behind your knee (at the Saphenopopliteal Junction / SPJ). When its valves fail, it causes bulging veins and throbbing pain along the back of the calf and outer ankle.',
    anatomicalContext: 'Located in the posterior calf compartment, closely adjacent to the sensory Sural Nerve.',
    clinicalThreshold: 'Retrograde reflux > 0.5s in the standing position.',
    urgencyLevel: 'Routine Clinical Discussion',
    urgencyBadgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
    questionsForDoctor: [
      'Is my reflux in the Small Saphenous Vein (back of calf) or Great Saphenous Vein (inner thigh)?',
      'What precautions are taken during treatment to protect the adjacent sural sensory nerve?',
      'Will closing the SSV relieve the aching behind my knee and calf?'
    ]
  }
};

export const SYNTHETIC_DOPPLER_REPORTS: SyntheticDopplerReport[] = [
  {
    id: 'report-gsv-axial',
    title: 'Bilateral Standing Venous Duplex — Axial GSV Reflux',
    facility: 'Demo Vascular Imaging Lab (fictional) · sample report',
    date: '14 Oct 2026',
    patientReference: 'Synthetic Case: MV-89241 · Age 52',
    indication: 'Progressive end-of-day right calf heaviness, medial ankle throbbing, visible subcutaneous varicosities (CEAP C2-C3).',
    protocol: 'Standing Bilateral Lower Extremity Duplex with rapid pneumatic cuff release reflux assessment (>0.5s threshold).',
    findingsSummary: [
      { label: 'Primary Reflux Origin', value: 'Right SFJ & Proximal GSV', highlightColor: 'text-[#B84A39]' },
      { label: 'Reflux Duration', value: '2.40s (>0.5s threshold)', highlightColor: 'text-[#B84A39]' },
      { label: 'Max GSV Caliber', value: '7.8 mm (Dilated)', highlightColor: 'text-[#063B36]' },
      { label: 'Deep System Status', value: 'Fully Compressible / Patent', highlightColor: 'text-emerald-700' }
    ],
    excerptHtml: [
      {
        textBefore: 'RIGHT LOWER EXTREMITY: Evaluation in upright standing posture reveals significant valvular failure at the ',
        termId: 'sfj-incompetence',
        termLabel: 'Saphenofemoral Junction (SFJ) Incompetence',
        textAfter: '. Following rapid pneumatic cuff decompression, retrograde flow persists for a '
      },
      {
        textBefore: '',
        termId: 'reflux-duration',
        termLabel: 'Reflux Duration: 2.40 seconds (>0.5s threshold)',
        textAfter: ', extending continuously through the proximal and mid-thigh Great Saphenous Vein. The '
      },
      {
        textBefore: '',
        termId: 'gsv-caliber',
        termLabel: 'Great Saphenous Vein (GSV) Caliber: 7.8 mm',
        textAfter: ' at the proximal thigh, tapering to 5.4 mm at the knee level. DEEP SYSTEM: The common femoral, femoral, and popliteal veins are '
      },
      {
        textBefore: '',
        termId: 'deep-vein-compressibility',
        termLabel: 'Deep Veins Compressible & Patent',
        textAfter: ' with normal respiratory phasicity and zero evidence of acute DVT.'
      }
    ],
    sonographerNotes: 'Axial superficial venous reflux meeting clinical criteria for endovenous thermal or non-thermal ablation. Deep system is completely patent.'
  },
  {
    id: 'report-perforator-ssv',
    title: 'Posterior & Gaiter Zone Duplex — SSV & Perforator Incompetence',
    facility: 'Demo Vascular Imaging Lab (fictional) · sample report',
    date: '08 Oct 2026',
    patientReference: 'Synthetic Case: MV-71042 · Age 61',
    indication: 'Medial ankle hyperpigmentation, brownish stasis dermatitis, and posterior calf aching (CEAP C4a).',
    protocol: 'Standing duplex reflux protocol with calf perforator interrogation in transverse and longitudinal planes.',
    findingsSummary: [
      { label: 'Primary Reflux Origin', value: 'Saphenopopliteal Junction & SSV', highlightColor: 'text-[#B84A39]' },
      { label: 'Reflux Duration', value: '1.95s (>0.5s threshold)', highlightColor: 'text-[#B84A39]' },
      { label: 'Perforator Incompetence', value: 'Cockett II Perforator (4.2 mm)', highlightColor: 'text-[#B84A39]' },
      { label: 'Deep System Status', value: 'Compressible & Patent', highlightColor: 'text-emerald-700' }
    ],
    excerptHtml: [
      {
        textBefore: 'POSTERIOR CALF & GAITER ZONE: Interrogation behind the right knee identifies ',
        termId: 'ssv-incompetence',
        termLabel: 'Small Saphenous Vein (SSV) / SPJ Reflux',
        textAfter: ' with retrograde flow lasting 1.95 seconds. Tracing downward into the lower third of the calf reveals an '
      },
      {
        textBefore: '',
        termId: 'perforator-incompetence',
        termLabel: 'Incompetent Perforator Vein (Cockett II, 4.2 mm)',
        textAfter: ' exhibiting bidirectional high-pressure outward jets directly beneath the region of stasis pigmentation. The deep popliteal and posterior tibial veins remain '
      },
      {
        textBefore: '',
        termId: 'deep-vein-compressibility',
        termLabel: 'Deep Veins Compressible & Patent',
        textAfter: ' without acute or chronic thrombus.'
      }
    ],
    sonographerNotes: 'SSV trunk incompetence combined with incompetent Cockett perforator feeding cutaneous gaiter changes. Compression and endovenous closure indicated.'
  },
  {
    id: 'report-dvt-safety-alert',
    title: 'Post-Thrombotic Surveillance & Deep Vein Safety Scan',
    facility: 'Emergency Vascular Ultrasound Suite',
    date: '02 Oct 2026',
    patientReference: 'Synthetic Case: MV-94511 · Age 48',
    indication: 'Sudden onset asymmetrical left calf swelling, firmness, and pain on dorsiflexion following 14-hour flight.',
    protocol: 'Compression duplex sonography from common femoral vein through calf trifurcation.',
    findingsSummary: [
      { label: 'Deep System Finding', value: 'NON-COMPRESSIBLE THROMBUS', highlightColor: 'text-rose-600 font-bold' },
      { label: 'Location', value: 'Left Mid-Femoral Vein', highlightColor: 'text-rose-600' },
      { label: 'Superficial System', value: 'GSV Patent, Non-dilated', highlightColor: 'text-[#063B36]' },
      { label: 'Clinical Urgency', value: 'URGENT MEDICAL ATTENTION', highlightColor: 'text-rose-600 font-bold' }
    ],
    excerptHtml: [
      {
        textBefore: 'LEFT LOWER EXTREMITY DEEP SYSTEM: Gentle probe compression was applied at 1cm intervals. At the mid-femoral segment, there is a distinct ',
        termId: 'non-compressible-alert',
        termLabel: 'Non-Compressible Vein Segment / Intraluminal Thrombus',
        textAfter: ' measuring 4.5 cm in length with absent color Doppler fill and reduced distal augmentation. The superficial system displays a '
      },
      {
        textBefore: '',
        termId: 'gsv-caliber',
        termLabel: 'Great Saphenous Vein (GSV) Caliber: 3.2 mm',
        textAfter: ' with zero reflux. URGENT ALERT: Deep vein thrombosis confirmed; immediate physician anticoagulation assessment required.'
      }
    ],
    sonographerNotes: 'ACUTE DVT IDENTIFIED in left femoral vein. Notifying referring physician and emergency department immediately.'
  }
];
