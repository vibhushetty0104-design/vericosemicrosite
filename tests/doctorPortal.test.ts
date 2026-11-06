/**
 * MERIDIAN VASCULAR CLINICAL PLATFORM — DOCTOR PORTAL TEST SUITE
 * Rigorous automated tests for Doctor Authentication, Calendar Engine,
 * Double-Booking Prevention, Clinical Notes Versioning, and Audit Trail.
 */

import { doctorPortalService } from '../src/services/doctorPortalService';
import { AppointmentType, ConsultationMode, DocumentCategory } from '../src/types/doctorPortal';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${testName}`);
    if (detail) console.error(`    Detail: ${detail}`);
    failed++;
  }
}

async function runDoctorPortalTests() {
  console.log('\n====================================================');
  console.log('Running Meridian Vascular Doctor Portal Test Suite');
  console.log('====================================================\n');

  // --------------------------------------------------------------------------
  // TEST GROUP 1: Doctor Authentication & Session Management
  // --------------------------------------------------------------------------
  console.log('Test Group 1: Doctor Authentication & Identity Verification');

  // Test 1.1: Valid login with email, password, and doctor ID
  const loginRes = await doctorPortalService.login(
    'arvind.rao@meridianvascular.com',
    'VascularSecure@2026',
    'MVD-BLR-0192'
  );
  assert(loginRes.success === true && loginRes.doctor !== undefined, 'Successful login with valid credentials and Doctor ID');
  assert(loginRes.doctor?.name === 'Dr. Arvind Rao', 'Correct doctor profile retrieved upon login');
  assert(loginRes.session?.doctorId === 'MVD-BLR-0192', 'Session initialized with correct Doctor ID');

  // Test 1.2: Incorrect Doctor ID rejects authentication
  const badIdRes = await doctorPortalService.login(
    'arvind.rao@meridianvascular.com',
    'VascularSecure@2026',
    'MVD-WRONG-9999'
  );
  assert(badIdRes.success === false, 'Rejects login when Doctor ID does not match records');

  // Test 1.3: Incorrect password rejects authentication
  const badPassRes = await doctorPortalService.login(
    'arvind.rao@meridianvascular.com',
    'wrong-password',
    'MVD-BLR-0192'
  );
  assert(badPassRes.success === false, 'Rejects login when password is incorrect');

  // Test 1.4: MFA verification
  const mfaOk = doctorPortalService.verifyMfaCode('MVD-BLR-0192', '123456');
  assert(mfaOk === true, 'MFA code 123456 verifies successfully');

  // Test 1.5: Password reset request dispatches securely
  const resetRes = doctorPortalService.requestPasswordReset('arvind.rao@meridianvascular.com', 'MVD-BLR-0192');
  assert(resetRes.success === true, 'Password reset request dispatches to registered institutional email');

  // Test 1.6: Explicit logout invalidates active session
  doctorPortalService.logout();
  const sessionAfterLogout = doctorPortalService.getActiveSession();
  assert(sessionAfterLogout === null, 'Session is cleanly invalidated on logout');

  // Re-login for remaining operational tests
  await doctorPortalService.login('arvind.rao@meridianvascular.com', 'VascularSecure@2026', 'MVD-BLR-0192');

  // --------------------------------------------------------------------------
  // TEST GROUP 2: Double-Booking Prevention & Appointment Scheduling
  // --------------------------------------------------------------------------
  console.log('\nTest Group 2: Appointment Scheduling & Double-Booking Prevention');

  const testDate = '2026-11-25';
  const slotTime = '11:00';

  // Test 2.1: Initial appointment booking succeeds
  const appt1 = doctorPortalService.createAppointment({
    patientId: 'MVP-2026-8841',
    doctorId: 'MVD-BLR-0192',
    date: testDate,
    startTime: slotTime,
    appointmentType: 'Initial Evaluation',
    consultationMode: 'In-Person OPD',
    reasonForVisit: 'Test bilateral calf heaviness consultation',
    performedByDoctorName: 'Dr. Arvind Rao',
  });
  assert(appt1.success === true && appt1.appointment !== undefined, 'Successfully scheduled appointment in available slot');

  // Test 2.2: Double-booking attempt for the SAME doctor at SAME date and time is BLOCKED
  const appt2Duplicate = doctorPortalService.createAppointment({
    patientId: 'MVP-2026-7204',
    doctorId: 'MVD-BLR-0192',
    date: testDate,
    startTime: slotTime,
    appointmentType: 'Duplex Ultrasound Review',
    consultationMode: 'In-Person OPD',
    reasonForVisit: 'Attempted duplicate booking during busy hours',
    performedByDoctorName: 'Dr. Arvind Rao',
  });
  assert(appt2Duplicate.success === false, 'Strictly prevents double-booking for the same doctor at the same slot');
  assert(
    appt2Duplicate.error?.includes('Schedule conflict') === true,
    'Returns informative clinical conflict error message'
  );

  // Test 2.3: Available slots calculation detects occupied slot
  const availableSlots = doctorPortalService.getAvailableSlotsForDoctor('MVD-BLR-0192', testDate);
  const slot11 = availableSlots.find((s) => s.time === slotTime);
  assert(slot11 !== undefined && slot11.available === false, 'Availability calculator flags booked slot as unavailable');

  // Test 2.4: Break times are respected in slot calculation
  const lunchSlot = availableSlots.find((s) => s.time === '13:00');
  assert(lunchSlot !== undefined && lunchSlot.available === false && lunchSlot.reason === 'Lunch Break', 'Lunch break is respected and marked unavailable');

  // --------------------------------------------------------------------------
  // TEST GROUP 3: Rescheduling & Cancellation with Audit Trail
  // --------------------------------------------------------------------------
  console.log('\nTest Group 3: Rescheduling & Cancellation Workflows');

  const createdId = appt1.appointment!.id;

  // Test 3.1: Reschedule with availability check
  const newDate = '2026-11-26';
  const newTime = '14:30';
  const reschedRes = doctorPortalService.rescheduleAppointment({
    appointmentId: createdId,
    newDate,
    newStartTime: newTime,
    reason: 'Patient requested afternoon appointment due to travel delay',
    performedByDoctorName: 'Dr. Arvind Rao',
  });
  assert(reschedRes.success === true, 'Successfully rescheduled appointment to available slot');
  assert(reschedRes.appointment?.date === newDate, 'Updated appointment date reflects new schedule');
  assert(reschedRes.appointment?.status === 'Rescheduled', 'Appointment status updated to Rescheduled');
  assert(reschedRes.appointment?.history.length! >= 2, 'Previous scheduling history is preserved (not overwritten)');

  // Test 3.2: Cancelling appointment requires a reason and updates status
  const cancelRes = doctorPortalService.cancelAppointment({
    appointmentId: createdId,
    reason: 'Patient underwent emergency treatment at another hospital',
    performedByDoctorName: 'Dr. Arvind Rao',
  });
  assert(cancelRes.success === true, 'Successfully cancelled appointment');
  assert(cancelRes.appointment?.status === 'Cancelled', 'Status correctly set to Cancelled');
  assert(cancelRes.appointment?.cancellationReason !== undefined, 'Cancellation reason recorded in clinical record');

  // --------------------------------------------------------------------------
  // TEST GROUP 4: Patient Record Privacy & Authorised Directory
  // --------------------------------------------------------------------------
  console.log('\nTest Group 4: Patient Directory & Health Record Access');

  const patients = doctorPortalService.getPatients();
  assert(patients.length >= 8, 'Retrieved active patient cohort for vascular doctor');
  assert(patients.every((p) => p.ceapClassification && p.primaryDiagnosis), 'All patients possess CEAP stage and primary diagnosis');

  const suresh = doctorPortalService.getPatientById('MVP-2026-8841');
  assert(suresh !== undefined && suresh.name === 'Suresh Kumar', 'Specific patient record retrieved by ID');
  assert(suresh?.allergies.includes('Penicillin (mild cutaneous rash)') === true, 'Patient clinical allergy warnings present');

  // --------------------------------------------------------------------------
  // TEST GROUP 5: Document Management & File Restrictions
  // --------------------------------------------------------------------------
  console.log('\nTest Group 5: Document Management, Category Filtering & Security');

  // Test 5.1: File size limit enforcement (> 15 MB rejected)
  const oversizeRes = doctorPortalService.uploadDocument({
    patientId: 'MVP-2026-8841',
    category: 'Doppler ultrasound reports',
    file: { name: 'Giant_MRI_Scan.pdf', size: 20 * 1024 * 1024, type: 'application/pdf' },
    uploadedBy: 'Dr. Arvind Rao',
    doctorId: 'MVD-BLR-0192',
  });
  assert(oversizeRes.success === false, 'Rejects files exceeding 15 MB limit');

  // Test 5.2: Invalid file extension rejected
  const invalidExtRes = doctorPortalService.uploadDocument({
    patientId: 'MVP-2026-8841',
    category: 'Other medical documents',
    file: { name: 'executable_file.exe', size: 1024, type: 'application/x-msdownload' },
    uploadedBy: 'Dr. Arvind Rao',
    doctorId: 'MVD-BLR-0192',
  });
  assert(invalidExtRes.success === false, 'Rejects unsupported executable file formats');

  // Test 5.3: Valid upload succeeds and generates private identifier
  const validUpload = doctorPortalService.uploadDocument({
    patientId: 'MVP-2026-8841',
    category: 'Laboratory reports',
    file: { name: 'Serum_Creatinine_PreOp_Nov2026.pdf', size: 1048576, type: 'application/pdf' },
    summaryNotes: 'Serum creatinine 0.9 mg/dL (Normal). eGFR >90. Cleared for IV sedation.',
    uploadedBy: 'Dr. Arvind Rao',
    doctorId: 'MVD-BLR-0192',
  });
  assert(validUpload.success === true && validUpload.document !== undefined, 'Valid medical document uploaded and registered');
  assert(validUpload.document?.reviewStatus === 'Pending Review', 'Initial review status set to Pending Review');

  // --------------------------------------------------------------------------
  // TEST GROUP 6: Clinical Notes, Verified Digital Signing & Immutability
  // --------------------------------------------------------------------------
  console.log('\nTest Group 6: Clinical Notes, Verified Signing & Versioned Amendments');

  // Test 6.1: Draft saving
  const draftRes = doctorPortalService.saveClinicalNoteDraft({
    patientId: 'MVP-2026-8841',
    appointmentId: 'APT-2026-0491',
    doctorId: 'MVD-BLR-0192',
    doctorName: 'Dr. Arvind Rao',
    presentingComplaint: 'Evening ankle edema and burning sensation.',
    clinicalObservations: 'C3 non-pitting edema.',
    examinationFindings: 'Duplex shows right GSV reflux 2.8s.',
    assessment: 'Primary CVI CEAP C3,s — Right GSV incompetence.',
    treatmentPlan: 'Advised EVLA 1470nm radial laser ablation.',
    followUpRecommendations: 'Repeat scan in 4 weeks.',
    additionalNotes: 'Patient counseled on compression therapy.',
  });
  assert(draftRes.success === true && draftRes.note !== undefined, 'Clinical note draft saved successfully');
  const draftNoteId = draftRes.note!.id;

  // Test 6.2: Finalizing and digitally signing note
  const signRes = doctorPortalService.finalizeAndSignNote({
    noteId: draftNoteId,
    doctorId: 'MVD-BLR-0192',
    doctorName: 'Dr. Arvind Rao',
    signingConfirmation: true,
  });
  assert(signRes.success === true, 'Finalized note digitally signed by clinician');
  assert(signRes.note?.status === 'Finalized', 'Note status is Finalized');
  assert(signRes.note?.signatureVerificationHash?.startsWith('SIG-VERIFIED') === true, 'Generates verified cryptographic signature hash');

  // Test 6.3: Attempt to directly overwrite a finalized note is BLOCKED
  const overwriteRes = doctorPortalService.saveClinicalNoteDraft({
    noteId: draftNoteId,
    patientId: 'MVP-2026-8841',
    appointmentId: 'APT-2026-0491',
    doctorId: 'MVD-BLR-0192',
    doctorName: 'Dr. Arvind Rao',
    presentingComplaint: 'Silently altered complaint',
    clinicalObservations: 'Silently altered observations',
    examinationFindings: '',
    assessment: 'Silently altered assessment',
    treatmentPlan: '',
    followUpRecommendations: '',
    additionalNotes: '',
  });
  assert(overwriteRes.success === false, 'Strictly prevents silent overwriting of finalized clinical notes');

  // Test 6.4: Versioned Amendment preserves previous history
  const amendRes = doctorPortalService.amendFinalizedNote({
    noteId: draftNoteId,
    doctorId: 'MVD-BLR-0192',
    doctorName: 'Dr. Arvind Rao',
    amendmentReason: 'Patient reported NSAID intolerance; revised pain management order.',
    newContent: {
      presentingComplaint: 'Evening ankle edema and burning sensation.',
      clinicalObservations: 'C3 non-pitting edema.',
      examinationFindings: 'Duplex shows right GSV reflux 2.8s.',
      assessment: 'Primary CVI CEAP C3,s — Right GSV incompetence.',
      treatmentPlan: 'Advised EVLA 1470nm radial laser ablation. Prescribed Paracetamol 650mg PRN (avoid NSAIDs).',
      followUpRecommendations: 'Repeat scan in 4 weeks.',
      additionalNotes: 'Noted NSAID allergy.',
    },
  });
  assert(amendRes.success === true, 'Successfully amended clinical note via authorized protocol');
  assert(amendRes.note?.version === 2, 'Version incremented to 2');
  assert(amendRes.note?.versionHistory.length === 1, 'Previous version archived into version history');
  assert(
    amendRes.note?.versionHistory[0].amendmentReason === 'Patient reported NSAID intolerance; revised pain management order.',
    'Amendment reason and clinical rationale recorded in version history'
  );

  // --------------------------------------------------------------------------
  // TEST GROUP 7: Audit Trail Ledger & Tamper-Evidence
  // --------------------------------------------------------------------------
  console.log('\nTest Group 7: Clinical Audit Trail Ledger');

  const auditLogs = doctorPortalService.getAuditLogs('MVD-BLR-0192');
  assert(auditLogs.length > 5, 'Comprehensive audit entries generated across all clinical operations');
  assert(
    auditLogs.some((l) => l.action === 'LOGIN_SUCCESS'),
    'Audit logs track successful clinician logins'
  );
  assert(
    auditLogs.some((l) => l.action === 'CREATE_APPOINTMENT'),
    'Audit logs track appointment bookings'
  );
  assert(
    auditLogs.some((l) => l.action === 'FINALIZE_CLINICAL_NOTE'),
    'Audit logs track clinical note finalization and digital signing'
  );
  assert(
    auditLogs.some((l) => l.action === 'AMEND_CLINICAL_NOTE'),
    'Audit logs track clinical note amendments'
  );

  console.log('\n====================================================');
  console.log(`Doctor Portal Test Results: ${passed} passed, ${failed} failed`);
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runDoctorPortalTests();
