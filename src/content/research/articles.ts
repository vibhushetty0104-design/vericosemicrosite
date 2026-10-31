/**
 * Research Library articles (stakeholder demo).
 *
 * Text markers:
 *   [[source-id]]   inline numbered citation to SOURCES (numbered by first appearance)
 *   [[illustrative]] marks the preceding statement as an illustrative demo claim
 *   [[unverified]]   marks a citation not yet checked against the source's full text
 * Cited sentences only restate what the linked page or record says (checked 22 October 2026).
 * No article has been reviewed by a clinician.
 */

export type ArticleIcon = 'venous-reflux' | 'dvt-awareness' | 'treatment-options';

export interface ArticleRow {
  option: string;
  how: string;
  setting: string;
  illustrativeReturn: string;
}

export interface ArticleSection {
  id: string;
  heading: string;
  paragraphs: string[];
  /** "Explain this simply": pre-written plain-language version of the section. */
  simple: string;
  /** Optional block shown with the section. */
  block?: 'urgent' | 'treatment-table' | 'valve-link';
}

export interface Article {
  slug: string;
  title: string;
  summary: string;
  icon: ArticleIcon;
  readMinutes: number;
  /** When this demo text was last edited (not a clinical review date). */
  lastEdited: string;
  evidenceNote: string;
  sections: ArticleSection[];
  limitations: string[];
  table?: { caption: string; rows: ArticleRow[] };
}

export const ARTICLES: Article[] = [
  {
    slug: 'venous-reflux',
    title: 'Venous reflux: when leg veins stop working one way',
    summary: 'How one-way valves keep blood moving up the leg, what happens when they leak, and how a scan describes it.',
    icon: 'venous-reflux',
    readMinutes: 4,
    lastEdited: '22 October 2026',
    evidenceNote: 'Patient information from the NHS and MedlinePlus, a UK clinical guideline (NICE), a European clinician guideline and the CEAP classification standard.',
    sections: [
      {
        id: 'valves',
        heading: 'One-way valves',
        paragraphs: [
          'Veins in the legs contain one-way valves that help keep blood flowing toward the heart.[[medlineplus-varicose]] When those valves are weak or damaged, blood can flow backward and collect in the veins, which then swell and twist.[[medlineplus-varicose]][[nhs-varicose]]',
          'Doctors call this backward flow reflux. It is one of the changes a duplex (Doppler) ultrasound scan is used to look for.[[nice-cg168]]',
        ],
        simple:
          'Your leg veins have tiny doors that only open one way, upward. If the doors stop shutting properly, blood slips back down and the veins can bulge.',
        block: 'valve-link',
      },
      {
        id: 'symptoms',
        heading: 'What people notice',
        paragraphs: [
          'Common symptoms include pain, aching or heaviness in the legs, swollen ankles or legs, and skin changes. They are often worse after standing for a long time and may ease when the legs are raised.[[nhs-varicose]]',
          'Without treatment, varicose veins usually get worse slowly, over several years.[[nhs-varicose]]',
        ],
        simple:
          'Legs may feel heavy, achy or swollen, especially after a long day on your feet. Putting your feet up often helps for a while.',
      },
      {
        id: 'scan',
        heading: 'How a scan describes reflux',
        paragraphs: [
          'A UK guideline recommends duplex ultrasound to confirm the diagnosis, show how far reflux extends along the main (truncal) veins, and plan treatment.[[nice-cg168]]',
          'Scan reports often record how long blood flows backward after the calf is squeezed and released. The cut-off values used to call that reflux are set out in clinician guidelines,[[esvs-2022]][[unverified]] and only the clinician reading your scan can say what your own numbers mean.',
        ],
        simple:
          'The scan is a painless ultrasound. It watches which way blood moves when your calf is squeezed and let go, and measures how long any backward flow lasts.',
      },
      {
        id: 'stages',
        heading: 'How doctors describe stages',
        paragraphs: [
          'Specialists use CEAP, an internationally accepted standard, to describe chronic venous disorders by their clinical signs, cause, the veins involved and the underlying problem.[[ceap-2020]] Its clinical classes run from C0 (no visible signs) to C6 (an active ulcer).[[unverified]] A CEAP class describes what is seen; it is not a score of how worried to be.',
        ],
        simple:
          'Doctors use a label from C0 to C6 to describe what they see on the leg, from nothing visible up to an open sore.',
      },
    ],
    limitations: [
      'This is a demo article. It summarises general information and has not been reviewed by a clinician.',
      'Most cited sources are from the UK, the US and Europe. Practice and services in India may differ.',
      'It cannot interpret your own scan or symptoms.',
    ],
  },
  {
    slug: 'dvt-warning-signs',
    title: 'Blood clot (DVT) warning signs: when leg swelling is urgent',
    summary: 'The signs of a deep vein clot, the symptoms that mean emergency help, and who is more at risk.',
    icon: 'dvt-awareness',
    readMinutes: 3,
    lastEdited: '22 October 2026',
    evidenceNote: 'Patient information from the NHS. Emergency numbers for India are Meridian Vascular guidance, not from the cited source.',
    sections: [
      {
        id: 'signs',
        heading: 'Signs of a clot in the leg',
        paragraphs: [
          'Symptoms usually affect one leg: throbbing pain in the calf or thigh, swelling, red or darkened skin around the painful area (harder to see on brown or black skin), and swollen veins.[[nhs-dvt]]',
        ],
        simple: 'A clot usually affects one leg. It can throb, swell, look red or darker, and feel sore to touch.',
        block: 'urgent',
      },
      {
        id: 'emergency',
        heading: 'When it is an emergency',
        paragraphs: [
          'Shortness of breath or chest pain together with these symptoms can mean a clot has travelled to the lungs (pulmonary embolism), which can be life-threatening.[[nhs-dvt]] The source page advises not to drive yourself.[[nhs-dvt]]',
          'In India, call 112 or 108 for emergency help. Elsewhere, use your local emergency number.',
        ],
        simple:
          'If your leg has these signs and you also feel breathless or have chest pain, get emergency help straight away. Don’t drive yourself.',
      },
      {
        id: 'risk',
        heading: 'Who is more at risk',
        paragraphs: [
          'Risk is higher with age over 60, being overweight, smoking, a previous clot, a recent operation or hospital stay, being in bed for 3 days or more, long journeys of over 4 hours, pregnancy or a recent birth, some hormone treatments, cancer and varicose veins.[[nhs-dvt]]',
        ],
        simple:
          'Clots are more likely after surgery, long trips or lots of time in bed, in pregnancy, and in people who are older, smoke or have had a clot before.',
      },
    ],
    limitations: [
      'This is a demo article and has not been reviewed by a clinician.',
      'If you think you have a clot, get medical help now; this page is not a substitute.',
      'The cited source is written for the UK; emergency numbers and services differ in India.',
    ],
  },
  {
    slug: 'treatment-options',
    title: 'Treating varicose veins: what the guidelines say',
    summary: 'The order of treatments in a UK guideline, what each involves, and where compression stockings fit.',
    icon: 'treatment-options',
    readMinutes: 4,
    lastEdited: '22 October 2026',
    evidenceNote: 'A UK clinical guideline (NICE) and NHS patient information. Comparison figures are illustrative demo values.',
    sections: [
      {
        id: 'order',
        heading: 'Which treatment comes first',
        paragraphs: [
          'For confirmed varicose veins with truncal reflux, a UK guideline recommends offering endothermal ablation first; if that is unsuitable, ultrasound-guided foam sclerotherapy; and if that is unsuitable, surgery.[[nice-cg168]]',
          'Endothermal ablation uses heat from radiofrequency or laser energy to close the affected vein, usually as a same-day procedure under local anaesthetic.[[nhs-varicose]]',
        ],
        simple:
          'The usual first choice is a quick procedure that seals the faulty vein with heat. If that won’t suit you, there are injection and surgery options.',
      },
      {
        id: 'other',
        heading: 'Other options',
        paragraphs: [
          'Foam sclerotherapy blocks the vein with an injected foam and is usually offered when endothermal ablation is not suitable. Surgery ties off and removes the vein, usually under general anaesthetic.[[nhs-varicose]]',
          'Some clinics also offer non-thermal closure, such as medical adhesive.[[illustrative]][[demo-placeholder-nonthermal]] Ask your specialist whether it is an option for you.',
        ],
        simple: 'An injection can block the vein, or a small operation can remove it. Some clinics have other newer options too.',
        block: 'treatment-table',
      },
      {
        id: 'stockings',
        heading: 'Where compression stockings fit',
        paragraphs: [
          'Compression stockings press on the lower leg to help blood flow and ease swelling and pain.[[nhs-varicose]] The UK guideline advises against offering them as a treatment for varicose veins unless interventional treatment is unsuitable.[[nice-cg168]] Recent US clinician guidelines review the evidence on compression in detail.[[svs-2023-part2]]',
        ],
        simple:
          'Tight medical stockings can ease aching and swelling, but in the UK they are not the main treatment if a procedure is possible.',
      },
    ],
    table: {
      caption: 'Treatment options at a glance. The last column holds illustrative demo values, not research results.',
      rows: [
        { option: 'Endothermal ablation', how: 'Heat closes the vein', setting: 'Usually same day, local anaesthetic', illustrativeReturn: '1–2 days' },
        { option: 'Foam sclerotherapy', how: 'Injected foam blocks the vein', setting: 'Usually outpatient', illustrativeReturn: '1–2 days' },
        { option: 'Surgery (ligation and stripping)', how: 'Vein tied off and removed', setting: 'Usually general anaesthetic', illustrativeReturn: '1–3 weeks' },
        { option: 'Adhesive closure', how: 'Medical adhesive seals the vein', setting: 'Varies by clinic', illustrativeReturn: '1–2 days' },
      ],
    },
    limitations: [
      'This is a demo article and has not been reviewed by a clinician.',
      'The guideline cited is from the UK. Availability, cost and insurance cover in India are not covered here.',
      'Recovery figures in the table are illustrative values made for the demo.',
    ],
  },
];

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

const MARKER = /\[\[([a-z0-9-]+)\]\]/g;

/** Source ids in order of first appearance, used to number citations. */
export function citationOrder(article: Article): string[] {
  const order: string[] = [];
  for (const s of article.sections) {
    for (const p of s.paragraphs) {
      for (const m of p.matchAll(MARKER)) {
        if (m[1] !== 'illustrative' && m[1] !== 'unverified' && !order.includes(m[1])) order.push(m[1]);
      }
    }
  }
  return order;
}

export type TextPart =
  | { kind: 'text'; value: string }
  | { kind: 'cite'; id: string }
  | { kind: 'illustrative' }
  | { kind: 'unverified' };

export function parseParagraph(text: string): TextPart[] {
  const parts: TextPart[] = [];
  let last = 0;
  for (const m of text.matchAll(MARKER)) {
    if (m.index! > last) parts.push({ kind: 'text', value: text.slice(last, m.index) });
    if (m[1] === 'illustrative' || m[1] === 'unverified') parts.push({ kind: m[1] });
    else parts.push({ kind: 'cite', id: m[1] });
    last = m.index! + m[0].length;
  }
  if (last < text.length) parts.push({ kind: 'text', value: text.slice(last) });
  return parts;
}
