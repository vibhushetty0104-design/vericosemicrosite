/**
 * Clinical Report Vocabulary Parser (Educational, Non-Diagnostic)
 * 
 * IMPORTANT DISCLAIMER:
 * This utility performs educational string pattern matching to identify recognized
 * sonographic vocabulary and alert users to potential red flags or negated findings.
 * It is NOT a validated diagnostic medical device and does NOT formulate clinical diagnoses.
 */

export interface ParsedTermMatch {
  termId: string;
  termLabel: string;
  status: 'positive' | 'negated' | 'reported-negative' | 'urgent';
  explanation: string;
  sourceClause: string;
}

export interface ParsedReportAnalysis {
  rawText: string;
  wordCount: number;
  isIncompleteOrShort: boolean;
  isAmbiguous: boolean;
  hasUrgentDvtFinding: boolean;
  hasNegatedDvtFinding: boolean;
  urgentNotice?: string;
  reportedNegativeNotice?: string;
  detectedTerms: ParsedTermMatch[];
  unmatchedPhrasesSummary?: string;
  clinicalDisclaimer: string;
}

// Split into clauses to evaluate negation locally rather than across the entire document
function splitIntoClauses(text: string): string[] {
  return text
    .split(/[.;\n]+/)
    .map(c => c.trim())
    .filter(c => c.length > 0);
}

// Checks if a phrase is preceded by negation in the same clause
function isClauseNegated(clause: string, keywordRegex: RegExp): boolean {
  const negationPattern = /(?:no|not|none|without|rules?\s+out|ruled\s+out|negative\s+for|absence\s+of|free\s+of|zero\s+evidence\s+of|unremarkable\s+for)\s+[^.!,;]*$/i;
  
  // Find where the keyword appears
  const match = keywordRegex.exec(clause);
  if (!match) return false;

  const prefix = clause.slice(0, match.index);
  return negationPattern.test(prefix);
}

export function analyzeClinicalExcerpt(text: string): ParsedReportAnalysis {
  const trimmed = text.trim();
  const words = trimmed.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  const analysis: ParsedReportAnalysis = {
    rawText: trimmed,
    wordCount,
    isIncompleteOrShort: wordCount < 5,
    isAmbiguous: false,
    hasUrgentDvtFinding: false,
    hasNegatedDvtFinding: false,
    detectedTerms: [],
    clinicalDisclaimer: 'Educational terminology explorer only. Not a validated diagnostic tool. Requires clinical correlation by an interpreting physician.'
  };

  if (!trimmed) {
    return analysis;
  }

  if (wordCount < 5) {
    analysis.isIncompleteOrShort = true;
    analysis.isAmbiguous = true;
    return analysis;
  }

  const clauses = splitIntoClauses(trimmed);
  const detectedIds = new Set<string>();

  for (const clause of clauses) {
    const lower = clause.toLowerCase();

    // 1. Deep Vein Safety & Clot checks
    const dvtKeywords = /(?:thrombus|thrombosis|dvt|blood\s+clot|clot\b|non-?compressible|noncompressible|luminal\s+obstruction)/i;
    if (dvtKeywords.test(lower)) {
      const isNegated = isClauseNegated(clause, dvtKeywords) ||
        lower.includes('no dvt') ||
        lower.includes('negative for dvt') ||
        lower.includes('no thrombus') ||
        lower.includes('without thrombus') ||
        lower.includes('rules out dvt') ||
        lower.includes('ruled out dvt') ||
        lower.includes('no evidence of dvt') ||
        lower.includes('no evidence of deep vein') ||
        lower.includes('no deep vein thrombosis') ||
        lower.includes('free of thrombus') ||
        lower.includes('absence of thrombus');

      if (isNegated) {
        analysis.hasNegatedDvtFinding = true;
        if (!detectedIds.has('deep-vein-compressibility')) {
          detectedIds.add('deep-vein-compressibility');
          analysis.detectedTerms.push({
            termId: 'deep-vein-compressibility',
            termLabel: 'Excerpt Text: Described as Negative for Clot / Compressible',
            status: 'reported-negative',
            explanation: 'The entered excerpt states that deep veins were described as without thrombus or negative for DVT. Note: This reflects solely the wording in the provided text; this tool cannot verify that your complete sonographic examination was normal or technically adequate.',
            sourceClause: clause
          });
        }
      } else {
        // True positive DVT or non-compressible finding
        analysis.hasUrgentDvtFinding = true;
        if (!detectedIds.has('non-compressible-alert')) {
          detectedIds.add('non-compressible-alert');
          analysis.detectedTerms.push({
            termId: 'non-compressible-alert',
            termLabel: 'Non-Compressible Vein / Suspected Thrombus',
            status: 'urgent',
            explanation: 'The excerpt describes an uncompressed vein segment or intraluminal thrombus. This requires prompt, in-person clinical assessment.',
            sourceClause: clause
          });
        }
      }
    }

    // 2. Deep veins compressible / patent in text (when no clot was mentioned or confirmed patent)
    const patentKeywords = /(?:fully\s+compressible|normal\s+compressibility|veins\s+are\s+compressible|patent\s+deep|respiratory\s+phasicity)/i;
    if (patentKeywords.test(lower) && !analysis.hasUrgentDvtFinding) {
      if (!detectedIds.has('deep-vein-compressibility')) {
        detectedIds.add('deep-vein-compressibility');
        analysis.detectedTerms.push({
          termId: 'deep-vein-compressibility',
          termLabel: 'Excerpt Text: Deep Veins Described as Compressible & Patent',
          status: 'reported-negative',
          explanation: 'The excerpt states that deep veins collapsed under transducer compression. Note: This describes the entered text only and does not establish overall clinical normality.',
          sourceClause: clause
        });
      }
    }

    // 3. Saphenofemoral Junction (SFJ) Incompetence
    const sfjKeywords = /(?:sfj|saphenofemoral\s+junction|terminal\s+valve)/i;
    if (sfjKeywords.test(lower)) {
      const isNegated = isClauseNegated(clause, sfjKeywords) ||
        lower.includes('no sfj incompetence') ||
        lower.includes('sfj competent') ||
        lower.includes('normal sfj') ||
        lower.includes('sfj is competent') ||
        lower.includes('negative for sfj');

      if (!detectedIds.has('sfj-incompetence')) {
        detectedIds.add('sfj-incompetence');
        analysis.detectedTerms.push({
          termId: 'sfj-incompetence',
          termLabel: isNegated ? 'SFJ Competent (No Incompetence)' : 'Saphenofemoral Junction (SFJ) Reflux / Incompetence',
          status: isNegated ? 'negated' : 'positive',
          explanation: isNegated
            ? 'The gatekeeper valve at the groin (SFJ) was tested and found competent, meaning it is not spilling blood backward.'
            : 'Valvular incompetence at the saphenofemoral junction allows backward blood flow under gravity, driving lower limb venous hypertension.',
          sourceClause: clause
        });
      }
    }

    // 4. Reflux Duration
    const refluxKeywords = /(?:reflux|retrograde\s+flow|valvular\s+incompetence)/i;
    if (refluxKeywords.test(lower) && !detectedIds.has('reflux-duration')) {
      const isNegated = isClauseNegated(clause, refluxKeywords) ||
        lower.includes('no reflux') ||
        lower.includes('reflux not demonstrated') ||
        lower.includes('no significant reflux') ||
        lower.includes('no pathological reflux');

      detectedIds.add('reflux-duration');
      analysis.detectedTerms.push({
        termId: 'reflux-duration',
        termLabel: isNegated ? 'No Significant Reflux Demonstrated' : 'Pathological Venous Reflux (>0.5s consensus)',
        status: isNegated ? 'negated' : 'positive',
        explanation: isNegated
          ? 'No backward leakage exceeding diagnostic thresholds was documented in this evaluated segment.'
          : 'Retrograde flow exceeding 500ms (>0.5s) in superficial veins confirms that valves fail to close against gravity.',
        sourceClause: clause
      });
    }

    // 5. Great Saphenous Vein (GSV) Caliber / Diameter
    const gsvKeywords = /(?:gsv|great\s+saphenous|vein\s+caliber|vein\s+diameter)/i;
    if (gsvKeywords.test(lower) && !detectedIds.has('gsv-caliber')) {
      detectedIds.add('gsv-caliber');
      analysis.detectedTerms.push({
        termId: 'gsv-caliber',
        termLabel: 'Great Saphenous Vein (GSV) Caliber & Dimensions',
        status: 'positive',
        explanation: 'Measurement of venous diameter at anatomical landmarks (groin, mid-thigh, knee) determines candidacy for catheter ablation.',
        sourceClause: clause
      });
    }

    // 6. Incompetent Perforator Veins (>=0.5s, >=3.5mm)
    const perforatorKeywords = /(?:perforator|perforating\s+vein|cockett|sherman|dodd)/i;
    if (perforatorKeywords.test(lower) && !detectedIds.has('perforator-incompetence')) {
      const isNegated = isClauseNegated(clause, perforatorKeywords) ||
        lower.includes('no perforator incompetence') ||
        lower.includes('perforators competent');

      detectedIds.add('perforator-incompetence');
      analysis.detectedTerms.push({
        termId: 'perforator-incompetence',
        termLabel: isNegated ? 'Perforator Veins Competent' : 'Incompetent Perforator Vein (Outward Flow >=0.5s)',
        status: isNegated ? 'negated' : 'positive',
        explanation: isNegated
          ? 'Perforator connecting channels show normal inward flow without high-pressure blowout toward the skin surface.'
          : 'Valvular failure allows muscular pump pressure to blast outward toward the skin (consensus threshold: >=0.5s duration, >=3.5mm diameter).',
        sourceClause: clause
      });
    }

    // 7. Small Saphenous Vein (SSV / SPJ)
    const ssvKeywords = /(?:ssv|small\s+saphenous|short\s+saphenous|spj|saphenopopliteal)/i;
    if (ssvKeywords.test(lower) && !detectedIds.has('ssv-incompetence')) {
      const isNegated = isClauseNegated(clause, ssvKeywords) ||
        lower.includes('no ssv reflux') ||
        lower.includes('ssv competent') ||
        lower.includes('spj competent');

      detectedIds.add('ssv-incompetence');
      analysis.detectedTerms.push({
        termId: 'ssv-incompetence',
        termLabel: isNegated ? 'Small Saphenous Vein Competent' : 'Small Saphenous Vein (SSV) / SPJ Reflux',
        status: isNegated ? 'negated' : 'positive',
        explanation: isNegated
          ? 'The vein running along the back of the calf shows normal valvular competence.'
          : 'Reflux along the posterior calf saphenous trunk, often causing pain behind the knee and outer ankle varicosities.',
        sourceClause: clause
      });
    }
  }

  // Determine notices
  if (analysis.hasUrgentDvtFinding) {
    analysis.urgentNotice = 'High-Urgency Clinical Alert: The text describes a non-compressible vein, thrombus, or possible DVT. Seek immediate in-person medical evaluation to evaluate anticoagulation.';
  } else if (analysis.hasNegatedDvtFinding) {
    analysis.reportedNegativeNotice = 'Report Excerpt Text: Described as Negative for Clot / Compressible. Note: This reflects solely the patient-provided text fragment and cannot establish clinical normalcy or study completeness.';
  }

  if (analysis.detectedTerms.length === 0 && wordCount >= 5) {
    analysis.isAmbiguous = true;
    analysis.unmatchedPhrasesSummary = 'No standardized lower-extremity hemodynamic terms (e.g. SFJ, reflux duration, GSV caliber, perforator, DVT patency) were identified. General symptoms or clinical notes require direct discussion with your physician.';
  }

  return analysis;
}
