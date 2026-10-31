/**
 * Source register for the Research Library and Meridbot source chips (stakeholder demo).
 *
 * Rules (see docs/demo-boundary.md):
 * - `link-checked`: the page or DOI record was opened on the date shown and its title, publisher
 *   and dates were copied from it. That is all it means: nobody has checked that every sentence
 *   in our articles is a faithful summary, and no clinician has reviewed anything.
 * - `demo-placeholder`: stands in for a source still to be found. It never carries an invented
 *   title, author, journal, DOI or URL.
 */

export type SourceStatus = 'link-checked' | 'demo-placeholder';

export interface SourceRecord {
  id: string;
  /** Short label for chips and citation names. */
  short: string;
  title: string;
  /** Organisation, or authors for journal articles. */
  publisher: string;
  /** Journal citation line, for journal articles. */
  citation?: string;
  kind: 'Clinical guideline' | 'Patient information' | 'Classification standard' | 'Demo placeholder';
  url?: string;
  /** Dates exactly as shown on the source page, when it shows them. */
  datesOnSource?: string;
  status: SourceStatus;
  /** How and when the link or record was checked. */
  checked?: string;
  /** Context a reader should know (region, scope). */
  note?: string;
}

const CHECKED = 'Opened and checked on 22 October 2026';
const DOI_CHECKED = 'DOI record checked in the Crossref registry on 22 October 2026';

export const SOURCES: Record<string, SourceRecord> = {
  'nhs-varicose': {
    id: 'nhs-varicose',
    short: 'NHS · Varicose veins',
    title: 'Varicose veins',
    publisher: 'NHS (UK National Health Service)',
    kind: 'Patient information',
    url: 'https://www.nhs.uk/conditions/varicose-veins/',
    datesOnSource: 'Page last reviewed 1 July 2024 · next review due 1 July 2027',
    status: 'link-checked',
    checked: CHECKED,
    note: 'UK patient information. Services and referral routes in India differ.',
  },
  'nhs-dvt': {
    id: 'nhs-dvt',
    short: 'NHS · DVT',
    title: 'DVT (deep vein thrombosis)',
    publisher: 'NHS (UK National Health Service)',
    kind: 'Patient information',
    url: 'https://www.nhs.uk/conditions/deep-vein-thrombosis-dvt/',
    datesOnSource: 'Page last reviewed 30 April 2026 · next review due 30 April 2029',
    status: 'link-checked',
    checked: CHECKED,
    note: 'UK emergency numbers (999, 111) appear on the source page. In India, call 112 or 108.',
  },
  'medlineplus-varicose': {
    id: 'medlineplus-varicose',
    short: 'MedlinePlus',
    title: 'Varicose Veins',
    publisher: 'MedlinePlus, National Library of Medicine (US National Institutes of Health)',
    kind: 'Patient information',
    url: 'https://medlineplus.gov/varicoseveins.html',
    datesOnSource: 'Last updated 27 June 2025',
    status: 'link-checked',
    checked: CHECKED,
  },
  'nice-cg168': {
    id: 'nice-cg168',
    short: 'NICE CG168',
    title: 'Varicose veins: diagnosis and management (CG168)',
    publisher: 'National Institute for Health and Care Excellence (NICE), UK',
    kind: 'Clinical guideline',
    url: 'https://www.nice.org.uk/guidance/cg168',
    datesOnSource: 'Published 24 July 2013 · last reviewed 4 February 2016',
    status: 'link-checked',
    checked: CHECKED,
    note: 'A UK national guideline. Recommendations are written for the NHS and may differ from practice in India.',
  },
  'esvs-2022': {
    id: 'esvs-2022',
    short: 'ESVS 2022',
    title:
      'European Society for Vascular Surgery (ESVS) 2022 Clinical Practice Guidelines on the Management of Chronic Venous Disease of the Lower Limbs',
    publisher: 'De Maeseneer M, Kakkos S, Aherne T, et al.',
    citation: 'European Journal of Vascular and Endovascular Surgery. 2022;63(2):184–267',
    kind: 'Clinical guideline',
    url: 'https://doi.org/10.1016/j.ejvs.2021.12.024',
    status: 'link-checked',
    checked: DOI_CHECKED,
    note: 'Professional guideline written for clinicians.',
  },
  'svs-2023-part2': {
    id: 'svs-2023-part2',
    short: 'SVS/AVF/AVLS 2023 (Part II)',
    title:
      'The 2023 Society for Vascular Surgery, American Venous Forum, and American Vein and Lymphatic Society clinical practice guidelines for the management of varicose veins of the lower extremities. Part II',
    publisher: 'Gloviczki P, Lawrence P, Wasan S, et al.',
    citation: 'Journal of Vascular Surgery: Venous and Lymphatic Disorders. 2024;12(1):101670',
    kind: 'Clinical guideline',
    url: 'https://doi.org/10.1016/j.jvsv.2023.08.011',
    status: 'link-checked',
    checked: DOI_CHECKED,
    note: 'Professional guideline written for clinicians.',
  },
  'ceap-2020': {
    id: 'ceap-2020',
    short: 'CEAP 2020',
    title: 'The 2020 update of the CEAP classification system and reporting standards',
    publisher: 'Lurie F, Passman M, Meisner M, et al.',
    citation: 'Journal of Vascular Surgery: Venous and Lymphatic Disorders. 2020;8(3):342–352',
    kind: 'Classification standard',
    url: 'https://doi.org/10.1016/j.jvsv.2019.12.075',
    status: 'link-checked',
    checked: DOI_CHECKED,
  },
  'svs-avf-2011': {
    id: 'svs-avf-2011',
    short: 'SVS/AVF 2011',
    title:
      'The care of patients with varicose veins and associated chronic venous diseases: Clinical practice guidelines of the Society for Vascular Surgery and the American Venous Forum',
    publisher: 'Gloviczki P, Comerota A, Dalsing M, et al.',
    citation: 'Journal of Vascular Surgery. 2011;53(5):2S–48S',
    kind: 'Clinical guideline',
    url: 'https://doi.org/10.1016/j.jvs.2011.01.079',
    status: 'link-checked',
    checked: DOI_CHECKED,
    note: 'Older guideline, partly updated by the 2023 SVS/AVF/AVLS guidelines.',
  },
  'demo-placeholder-nonthermal': {
    id: 'demo-placeholder-nonthermal',
    short: 'Demo placeholder',
    title: 'Demo placeholder: source for non-thermal closure options still to be added',
    publisher: 'To be sourced before launch',
    kind: 'Demo placeholder',
    status: 'demo-placeholder',
    note: 'No real source is attached yet. The statement it supports is shown as unverified.',
  },
  'demo-placeholder-recovery': {
    id: 'demo-placeholder-recovery',
    short: 'Demo placeholder',
    title: 'Demo placeholder: source for recovery and comfort figures still to be added',
    publisher: 'To be sourced before launch',
    kind: 'Demo placeholder',
    status: 'demo-placeholder',
    note: 'The figures it supports are illustrative examples made for the demo, not research results.',
  },
};

export const STATUS_LABELS: Record<SourceStatus, string> = {
  'link-checked': 'Link checked',
  'demo-placeholder': 'Demo placeholder',
};

export const CLINICAL_REVIEW_STATUS = 'Not clinically reviewed';

export function getSource(id: string): SourceRecord {
  const s = SOURCES[id];
  if (!s) throw new Error(`Unknown source id: ${id}`);
  return s;
}
