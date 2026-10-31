import { CEAPStageInfo } from '../types';

export const DID_YOU_KNOW_FACTS = [
  {
    metric: "1 in 3",
    label: "Adults Affected",
    description: "Varicose veins and chronic venous disease affect over 30% of adults globally, with prevalence climbing to 50%+ in individuals over age 50."
  },
  {
    metric: "90 mmHg",
    label: "Hydrostatic Column",
    description: "When standing motionless, gravity causes pressure in lower leg veins to reach nearly 90 mmHg. Walking activates the calf muscle pump, dropping pressure to 20-30 mmHg in healthy veins."
  },
  {
    metric: ">0.5 sec",
    label: "Ultrasound Reflux Criterion",
    description: "In duplex ultrasound, retrograde blood flow lasting longer than 0.5 seconds in superficial veins confirms valve incompetence and pathological venous reflux."
  },
  {
    metric: "95%+",
    label: "Outpatient Success Rate",
    description: "Modern endovenous thermal and non-thermal ablation procedures take under 45 minutes with local tumescent anesthesia, replacing historic painful vein stripping."
  }
];

export const CEAP_STAGES: CEAPStageInfo[] = [
  {
    stage: "C0",
    name: "Symptomatic / No Visible Signs",
    clinicalDescription: "Patients report leg heaviness, fatigue, or evening achiness, but no visible or palpable venous abnormalities are detected on clinical inspection.",
    physicalManifestations: ["Smooth skin without bulges", "No telangiectasias", "Sensory discomfort only by late afternoon"],
    refluxMechanism: "Early micro-valve laxity or deep venous volume overload without tributary dilation.",
    treatmentApproaches: ["Activity modification", "Calf muscle pump conditioning", "Class 1 compression (15-20 mmHg)"],
    reversibility: "High with lifestyle modifications",
    urgency: "Low"
  },
  {
    stage: "C1",
    name: "Telangiectasias & Reticular Veins",
    clinicalDescription: "Fine, superficial intradermal venules measuring <1mm (spider veins) and bluish sub-dermal venules measuring 1-3mm (reticular 'feeder' veins).",
    physicalManifestations: ["Web-like red or purple arborizations", "Common along outer thighs and medial ankles", "Occasional local burning sensation"],
    refluxMechanism: "Localized capillary hypertension, often driven by underlying feeder reticular veins or mild saphenous branch reflux.",
    treatmentApproaches: ["Visual / Polarized light sclerotherapy", "Surface Nd:YAG laser", "Supportive compression"],
    reversibility: "Excellent cosmetic resolution with micro-sclerotherapy",
    urgency: "Low"
  },
  {
    stage: "C2",
    name: "Varicose Veins (>3mm in diameter)",
    clinicalDescription: "Subcutaneous, dilated, tortuous veins measuring 3mm or greater in diameter when standing. The classic medical definition of varicose veins.",
    physicalManifestations: ["Palpable rope-like tortuosities", "Calf and thigh bulging", "Localized throbbing and aching"],
    refluxMechanism: "Incompetence of major saphenous trunks (Great Saphenous Vein or Small Saphenous Vein) or perforator veins.",
    treatmentApproaches: ["Endovenous Laser Ablation (EVLA)", "Radiofrequency Ablation (RFA)", "VenaSeal Medical Adhesive", "Ambulatory Phlebectomy"],
    reversibility: "Permanent closure of diseased trunk with 98% success",
    urgency: "Moderate"
  },
  {
    stage: "C3",
    name: "Dependent Venous Edema",
    clinicalDescription: "Lower extremity swelling (edema) typically noticeable in the ankle and lower calf that worsens throughout the day and leaves visible shoe/sock impressions.",
    physicalManifestations: ["Pitting edema around malleoli", "Tight footwear by evening", "Sensation of heavy, swollen limbs"],
    refluxMechanism: "Sustained high venous pressure causes transudation of fluid and electrolytes across capillary membranes into interstitial spaces.",
    treatmentApproaches: ["Prescription graduated compression (20-30 mmHg)", "Endovenous trunk ablation", "Pneumatic compression pumps"],
    reversibility: "Substantial edema reduction post-ablation and compression",
    urgency: "Moderate"
  },
  {
    stage: "C4",
    name: "Skin Changes & Trophic Alterations",
    clinicalDescription: "Structural changes of skin and subcutaneous tissues resulting from chronic inflammatory leukocyte trapping and iron pigment breakdown.",
    physicalManifestations: ["C4a: Hemosiderin pigmentation (brown spots) & venous eczema", "C4b: Lipodermatosclerosis (leathery, fibrotic skin) & Atrophie blanche"],
    refluxMechanism: "Extravasation of red blood cells; ferric iron breakdown triggers dermal macrophage activation and dense collagen sclerosis.",
    treatmentApproaches: ["Urgent endovenous ablation of reflux source", "Barrier emollients and topical corticosteroids for eczema", "30-40 mmHg compression"],
    reversibility: "Pigmentation may be permanent; fibrosis can soften once reflux is eliminated",
    urgency: "High"
  },
  {
    stage: "C5",
    name: "Healed Venous Ulcer",
    clinicalDescription: "Skin trophic changes with evidence of a previously open venous ulcer that has successfully re-epithelialized.",
    physicalManifestations: ["Atrophic, fragile scar tissue over gaiter region", "Surrounding lipodermatosclerosis and pigmentation", "High risk of re-ulceration without venous correction"],
    refluxMechanism: "Severe chronic venous hypertension; tissue breakdown followed by protracted healing.",
    treatmentApproaches: ["Definitive superficial ablation to prevent recurrence", "Lifelong maintenance compression", "Skin barrier protection"],
    reversibility: "Healed scar requires continuous surveillance",
    urgency: "High"
  },
  {
    stage: "C6",
    name: "Active Venous Leg Ulcer",
    clinicalDescription: "Full-thickness dermal loss in the lower leg (gaiter zone) that fails to heal spontaneously due to severe, unrelenting venous hypertension.",
    physicalManifestations: ["Irregular, shallow open wound with fibrinous base", "Moderate to heavy exudate", "Perilesional erythema and pain"],
    refluxMechanism: "Capillary bed destruction, pericapillary fibrin cuffs, and impaired cellular oxygen delivery due to severe reflux.",
    treatmentApproaches: ["Early endovenous ablation (EVRA clinical trial protocol)", "Multi-layer compression bandaging", "Advanced moist wound dressings"],
    reversibility: "High healing rates (>90%) with early ablation + compression",
    urgency: "Immediate"
  }
];

export const LEG_PAIN_DIFFERENTIAL = [
  {
    feature: "Venous Insufficiency Pain",
    onset: "Gradual throbbing, heaviness, and ache building by late afternoon/evening",
    aggravating: "Prolonged static standing or chair sitting; hot weather and warm baths",
    relieving: "Leg elevation above heart level, walking, wearing graduated compression stockings",
    location: "Calves, inner lower leg, ankle gaiter area; along prominent vein paths",
    keySign: "Swelling, visible varicosities, sock indentation marks, hemosiderin staining"
  },
  {
    feature: "Arterial Claudication",
    onset: "Sharp, cramping muscle pain that begins reproducibly after walking a fixed distance",
    aggravating: "Walking uphill or brisk strides; leg elevation worsens pain",
    relieving: "Resting in a standing/seated position for 2-5 minutes; hanging leg down",
    location: "Buttock, thigh, or calf muscle groups depending on arterial stenosis level",
    keySign: "Cool, pale or shiny hairless skin, diminished peripheral pulses, thickened toenails"
  },
  {
    feature: "Neurological / Sciatica",
    onset: "Electric, shooting, or burning shock radiating down the leg",
    aggravating: "Bending forward, coughing, sneezing, prolonged sitting in one position",
    relieving: "Lying flat with knees bent, gentle spinal decompression, walking slowly",
    location: "Lower back radiating down posterior buttock, hamstring to foot/toes",
    keySign: "Numbness, tingling ('pins and needles'), positive straight leg raise test"
  },
  {
    feature: "Musculoskeletal / Knee Osteoarthritis",
    onset: "Stiffness upon waking up ('gel phenomenon') or joint aching with weight bearing",
    aggravating: "Stairs descent, prolonged walking, damp cold weather",
    relieving: "Rest, gentle joint range of motion, anti-inflammatory medications",
    location: "Localized to knee, ankle, or hip joint capsules; periarticular tenderness",
    keySign: "Crepitus (joint cracking), joint line tenderness, bony enlargement, reduced ROM"
  }
];

export const TREATMENT_MODALITIES = [
  {
    name: "Parameter",
    category: "Clinical Selection Standards",
    howItWorks: "Evidence-based anatomical and hemodynamic parameters—including standing duplex reflux duration (>=500ms), vein caliber (5-15mm), vessel tortuosity, and skin proximity—synthesized from SVS, AVF, and NICE guidelines to guide tailored treatment selection.",
    anesthesia: "Determined by procedure: tumescent local anesthesia, access-site local, or none",
    duration: "30 – 45 minutes",
    recovery: "Immediate same-day walking across all modern outpatient modalities. Most patients resume desk duties within 24 hours.",
    idealFor: "All patients evaluating treatment options based on standing venous duplex ultrasound mapping.",
    successRate: "90% – 95% 5-year anatomical occlusion across consensus standards (SVS, AVF, NICE CG168)"
  },
  {
    name: "Micro-Phlebectomy",
    category: "Micro-Surgical Extraction",
    howItWorks: "Tiny 1-2mm micro-incisions are made directly over bulging, tortuous surface varicosities. Using specialized micro-hooks, the diseased vein segments are gently removed. Incisions heal without stitches.",
    anesthesia: "Local infiltration anesthesia",
    duration: "30 – 60 minutes",
    recovery: "Immediate relief from visible bulging; pressure dressing for 48 hours, followed by light compression for 1-2 weeks.",
    idealFor: "Large, bulging surface varicosities that cannot be straight-cannulated by laser fibers.",
    successRate: "<5% local recurrence for physically extracted segments; does not treat underlying trunk reflux"
  },
  {
    name: "Foam Sclerotherapy",
    category: "Chemical Ablation",
    howItWorks: "A sclerosant medication (such as Polidocanol or Sodium Tetradecyl Sulfate) is foamed with physiological gas and injected into tortuous or recurrent vein branches under live ultrasound visualization.",
    anesthesia: "None required (virtually painless micro-injections)",
    duration: "15 – 30 minutes",
    recovery: "Immediate walking; compression stockings worn for 1-2 weeks. Avoid hot baths to minimize skin staining.",
    idealFor: "Tortuous branch varicosities, recurrent veins after prior surgery, and venous ulcer feeder beds.",
    successRate: "70% – 85% long-term occlusion when used for tributary branches and perforators"
  },
  {
    name: "Radiofrequency Ablation (RFA)",
    category: "Thermal Ablation",
    howItWorks: "A catheter with a 7cm heating element delivers controlled thermal energy at 120°C in 20-second cycles, collapsing the vein collagen matrix without burning adjacent tissue.",
    anesthesia: "Local tumescent anesthesia",
    duration: "30 – 45 minutes",
    recovery: "Immediate ambulation; return to desk duties within 24-48 hours. Compression stockings worn for 7-10 days.",
    idealFor: "Axial saphenous vein incompetence with high patient comfort preference.",
    successRate: "90% – 94% 5-year occlusion rate (comparable efficacy to EVLA with low post-op bruising)"
  },
  {
    name: "Laser Ablation (EVLA)",
    category: "Thermal Ablation",
    howItWorks: "Under ultrasound guidance, a hair-thin laser fiber is inserted into the diseased saphenous vein. Targeted radial laser energy gently heats and permanently seals the vein shut from the inside.",
    anesthesia: "Local tumescent anesthesia (numbing fluid along vein sheath)",
    duration: "30 – 45 minutes",
    recovery: "Walk out immediately; return to sedentary work the next day. Wear compression stockings for 7-14 days. Avoid high-impact lifting for 7 days.",
    idealFor: "Straight, large-caliber Great or Small Saphenous Veins with significant axial reflux.",
    successRate: "90% – 95% 5-year anatomical occlusion in randomized trials (CLASS, Rass et al.)"
  },
  {
    name: "VenaSeal (Glue)",
    category: "Non-Thermal / Non-Tumescent",
    howItWorks: "A specialized medical-grade cyanoacrylate adhesive is micro-injected along the vein segment with gentle ultrasound transducer compression, polymerizing in seconds to close the vessel.",
    anesthesia: "Single small local lidocaine injection at catheter access site (eliminates extensive tumescent fluid sticks)",
    duration: "25 – 35 minutes",
    recovery: "Post-op compression stockings not mandated by manufacturer protocol; pause heavy weightlifting for 3-7 days.",
    idealFor: "Patients seeking to avoid perivenous needle sticks or who cannot tolerate tight compression stockings.",
    successRate: "91% – 94% 5-year occlusion (VeClose trial: 94.6% non-inferior to RFA; ~5-10% experience temporary inflammatory phlebitis)"
  }
];

export const DOCTOR_VISIT_QUESTIONS = [
  "Which specific vein trunks (Great Saphenous, Small Saphenous, or Accessory) are causing my reflux?",
  "What is the measured reflux time and vein diameter on my duplex ultrasound report?",
  "Are my deep veins completely open, healthy, and free of past blood clots (DVT)?",
  "Between thermal laser ablation, radiofrequency, and VenaSeal glue, which procedure best matches my anatomy?",
  "Will my insurance policy require a formal 6-to-12-week trial of conservative compression therapy before approving treatment?",
  "How soon after the procedure can I resume my exercise routine, running, and heavy lifting?",
  "What are the risks of nerve irritation (saphenous or sural nerve numbness), and how do you minimize them?",
  "What follow-up ultrasound schedule do you recommend to verify that the closed vein remains permanently sealed?"
];

export const FAQS = [
  {
    question: "Is varicose vein treatment covered by health insurance and Medicare?",
    answer: "Yes, in the vast majority of cases where patients experience symptoms (pain, swelling, heaviness, skin discoloration, or ulcers) and duplex ultrasound confirms pathological reflux (>0.5 seconds), treatments like EVLA, RFA, and microphlebectomy are deemed medically necessary and covered. Spider vein treatment performed purely for cosmetic reasons is typically self-pay."
  },
  {
    question: "What actually happens to the blood flow when a diseased vein is closed?",
    answer: "Diseased varicose veins are already dysfunctional; rather than carrying blood upward, they allow blood to pool backward. Once the faulty vein is sealed, your body naturally reroutes circulation into the dozens of healthy, competent deep and superficial veins in the leg, immediately improving overall circulatory efficiency."
  },
  {
    question: "How does duplex ultrasound diagnose varicose veins?",
    answer: "Duplex ultrasound combines conventional B-mode anatomical imaging with Color Flow Doppler and Spectral waveform analysis. While you stand upright, the sonographer places a warm gel probe along your leg and gently squeezes your calf. If blood rushes backwards toward your feet for more than 0.5 seconds upon release, valve incompetence is confirmed."
  },
  {
    question: "Can varicose veins come back after endovenous laser or glue treatment?",
    answer: "The specific vein segment that has been closed by laser, radiofrequency, or VenaSeal cannot reopen or become varicose again (it is absorbed by the body over time). However, because chronic venous insufficiency is a progressive condition, untreated adjacent veins may develop valve weakness years later. Regular low-impact exercise and weight maintenance help protect other veins."
  },
  {
    question: "What is the difference between a Phlebologist and a Vascular Surgeon?",
    answer: "A Phlebologist is a physician who has specialized certification and dedicated clinical training in diagnosing and treating vein disorders. A Vascular Surgeon is a surgeon trained in all aspects of arterial and venous surgery. Both specialists perform modern minimally invasive endovenous ablations, duplex ultrasounds, and sclerotherapy in clinic settings."
  },
  {
    question: "Do I need to take days off work after modern vein procedures?",
    answer: "Most patients walk out of the clinic unassisted immediately after treatment and return to sedentary or light desk work the very next morning. Strenuous high-impact workouts, heavy squats, and hot tubs are typically avoided for 7 to 10 days."
  }
];
