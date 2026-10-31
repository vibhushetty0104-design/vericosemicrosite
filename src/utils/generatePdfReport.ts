import { jsPDF } from 'jspdf';
import { AssessmentResult } from '../types';
import { ASSESSMENT_QUESTIONS, symptomPatternLabel, SYMPTOM_PATTERN_DISCLAIMER } from '../data/assessmentQuestions';
import { formatEmergencyNumbers } from '../data/emergencyContacts';

interface GeneratePdfOptions {
  result: AssessmentResult;
  answers: Record<number, number>;
  patientName?: string;
  imageCount?: number;
  videoCount?: number;
}

export function generatePdfReport({
  result,
  answers,
  patientName = 'Anonymous Patient',
  imageCount = 0,
  videoCount = 0,
}: GeneratePdfOptions): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 18;

  // Header Banner
  doc.setFillColor(30, 41, 59); // Slate Dark
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Brand text
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text('MERIDIAN VASCULAR · SYMPTOM SCREENER SUMMARY', 14, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(203, 213, 225);
  doc.text('Meridian Vascular (demo) · Educational summary, not a medical record', 14, 18);
  doc.text(`Generated: ${new Date().toLocaleDateString()} | Demo document, no reference number`, 14, 23);

  y = 38;

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(27, 36, 48);
  doc.text('Self-Reported Vein Symptom Summary (Not a Diagnosis)', 14, y);

  y += 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(74, 85, 99);
  doc.text(`Patient Reference: ${patientName} | Status: Pre-Consultation Screening`, 14, y);

  y += 8;

  // Score Box
  doc.setFillColor(247, 248, 244);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, y, pageWidth - 28, 26, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(107, 39, 55); // Wine
  doc.text(`Symptom Score: ${result.totalScore} / ${result.maxScore} (${result.percentage}% of maximum)`, 20, y + 8);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(46, 110, 98); // Teal
  doc.text(`Symptom Pattern: ${symptomPatternLabel(result.severityLevel)}`, 20, y + 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(74, 85, 99);
  doc.text(result.symptomPatternTitle, 20, y + 22);

  y += 34;

  // Summary & Pathology Section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(27, 36, 48);
  doc.text('1. What Your Answers Suggest', 14, y);

  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(74, 85, 99);

  const summaryLines = doc.splitTextToSize(result.summary, pageWidth - 28);
  doc.text(summaryLines, 14, y);
  y += summaryLines.length * 4.5 + 3;

  const pathologyLines = doc.splitTextToSize(`What this can mean: ${result.pathologyDetails} ${SYMPTOM_PATTERN_DISCLAIMER}`, pageWidth - 28);
  doc.text(pathologyLines, 14, y);
  y += pathologyLines.length * 4.5 + 6;

  // Recommended Specialist & Diagnostic Box (wrapped so longer guidance text stays inside the box)
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  const actionLines = doc.splitTextToSize(
    `Suggested next step: ${result.recommendedAction} Possible next test: ${result.diagnosticRecommendation}`,
    pageWidth - 36
  );
  const boxHeight = 12 + actionLines.length * 4;

  doc.setFillColor(228, 236, 232); // Soft Teal
  doc.roundedRect(14, y, pageWidth - 28, boxHeight, 2, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(32, 80, 74);
  doc.text(`Who could help: ${result.suggestedSpecialist}`, 18, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(27, 36, 48);
  doc.text(actionLines, 18, y + 12);

  y += boxHeight + 8;

  // Questionnaire Responses Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(27, 36, 48);
  doc.text('2. Patient Screening Item Breakdown', 14, y);
  y += 5;

  ASSESSMENT_QUESTIONS.slice(0, 6).forEach((q) => {
    const selectedScore = answers[q.id] ?? 0;
    const selectedOpt = q.options.find((o) => o.score === selectedScore);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(27, 36, 48);
    doc.text(`${q.title}:`, 16, y);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(74, 85, 99);
    doc.text(`Score ${selectedScore}/3 — ${selectedOpt?.label || 'Not answered'}`, 70, y);

    y += 5;
  });

  y += 4;

  // Attached Visual Evidence info
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(27, 36, 48);
  doc.text('3. Photos and Videos (kept on your device, not included)', 14, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(74, 85, 99);
  doc.text(`Photos added on this device: ${imageCount} | Videos added on this device: ${videoCount}`, 16, y);
  doc.text('These files are not included in this PDF and were not uploaded or sent to anyone.', 16, y + 4.5);

  y += 12;

  // Conservative Measures
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(27, 36, 48);
  doc.text('4. Recommended Conservative Management Plan', 14, y);
  y += 5;

  result.lifestyleMeasures.slice(0, 3).forEach((measure) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(74, 85, 99);
    doc.text(`• ${measure}`, 16, y);
    y += 4.5;
  });

  // Footer Disclaimer
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(112, 126, 148);
  doc.text(
    `Medical Notice: This document is an educational self-assessment based on patient reporting. It is not a diagnosis and does not replace an examination by a licensed clinician. Emergency (India): call ${formatEmergencyNumbers()} for chest pain, breathlessness, sudden one-sided leg swelling or heavy bleeding.`,
    14,
    285,
    { maxWidth: pageWidth - 28 }
  );

  // Save the PDF
  doc.save(`Meridian-Vascular-Symptom-Summary-${result.severityLevel}.pdf`);
}
