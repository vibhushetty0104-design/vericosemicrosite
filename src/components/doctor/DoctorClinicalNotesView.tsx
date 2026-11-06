import React, { useState } from 'react';
import {
  FileEdit,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  History,
  Lock,
  Plus,
  Search,
  User,
  Calendar,
  ShieldCheck,
  X,
  ChevronDown,
  ArrowRight,
  Eye,
} from 'lucide-react';
import { Doctor, PatientRecord, ClinicalAppointment, ClinicalNote, ClinicalNoteVersion } from '../../types/doctorPortal';
import { doctorPortalService } from '../../services/doctorPortalService';

interface DoctorClinicalNotesViewProps {
  doctor: Doctor;
  patients: PatientRecord[];
  appointments: ClinicalAppointment[];
  notes: ClinicalNote[];
  onNoteCreatedOrUpdated: (note: ClinicalNote) => void;
  initialPatientId?: string;
  initialAppointmentId?: string;
}

export const DoctorClinicalNotesView: React.FC<DoctorClinicalNotesViewProps> = ({
  doctor,
  patients,
  appointments,
  notes,
  onNoteCreatedOrUpdated,
  initialPatientId,
  initialAppointmentId,
}) => {
  const [selectedNote, setSelectedNote] = useState<ClinicalNote | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Form Fields
  const [noteId, setNoteId] = useState<string | undefined>(undefined);
  const [patientId, setPatientId] = useState(initialPatientId || '');
  const [appointmentId, setAppointmentId] = useState(initialAppointmentId || '');
  const [presentingComplaint, setPresentingComplaint] = useState('');
  const [clinicalObservations, setClinicalObservations] = useState('');
  const [examinationFindings, setExaminationFindings] = useState('');
  const [assessment, setAssessment] = useState('');
  const [treatmentPlan, setTreatmentPlan] = useState('');
  const [followUpRecommendations, setFollowUpRecommendations] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');

  // Modals
  const [showSignModal, setShowSignModal] = useState(false);
  const [signConsent, setSignConsent] = useState(false);
  const [showAmendModal, setShowAmendModal] = useState(false);
  const [amendmentReason, setAmendmentReason] = useState('');
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const startNewNote = () => {
    setNoteId(undefined);
    setPatientId(patients[0]?.id || '');
    setAppointmentId(appointments[0]?.id || '');
    setPresentingComplaint('');
    setClinicalObservations('');
    setExaminationFindings('');
    setAssessment('');
    setTreatmentPlan('');
    setFollowUpRecommendations('');
    setAdditionalNotes('');
    setSelectedNote(null);
    setIsEditing(true);
    setFormError(null);
  };

  const handleSelectNote = (n: ClinicalNote) => {
    setSelectedNote(n);
    setNoteId(n.id);
    setPatientId(n.patientId);
    setAppointmentId(n.appointmentId);
    setPresentingComplaint(n.presentingComplaint);
    setClinicalObservations(n.clinicalObservations);
    setExaminationFindings(n.examinationFindings);
    setAssessment(n.assessment);
    setTreatmentPlan(n.treatmentPlan);
    setFollowUpRecommendations(n.followUpRecommendations);
    setAdditionalNotes(n.additionalNotes);
    setIsEditing(n.status === 'Draft');
    setFormError(null);
  };

  const handleSaveDraft = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!patientId) {
      setFormError('Please select a patient.');
      return;
    }
    if (!assessment.trim() && !presentingComplaint.trim()) {
      setFormError('Please provide at least a presenting complaint or assessment.');
      return;
    }

    const res = doctorPortalService.saveClinicalNoteDraft({
      noteId,
      patientId,
      appointmentId,
      doctorId: doctor.id,
      doctorName: doctor.name,
      presentingComplaint,
      clinicalObservations,
      examinationFindings,
      assessment,
      treatmentPlan,
      followUpRecommendations,
      additionalNotes,
    });

    if (!res.success || !res.note) {
      setFormError(res.error || 'Failed to save draft.');
      return;
    }

    onNoteCreatedOrUpdated(res.note);
    setSelectedNote(res.note);
    setNoteId(res.note.id);
    setIsEditing(false);
  };

  const handleFinalizeAndSign = () => {
    if (!selectedNote) return;
    const res = doctorPortalService.finalizeAndSignNote({
      noteId: selectedNote.id,
      doctorId: doctor.id,
      doctorName: doctor.name,
      signingConfirmation: signConsent,
    });

    if (res.success && res.note) {
      onNoteCreatedOrUpdated(res.note);
      setSelectedNote(res.note);
      setShowSignModal(false);
      setIsEditing(false);
    } else {
      setFormError(res.error || 'Signing verification failed.');
    }
  };

  const handleAmendSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNote) return;

    const res = doctorPortalService.amendFinalizedNote({
      noteId: selectedNote.id,
      doctorId: doctor.id,
      doctorName: doctor.name,
      amendmentReason,
      newContent: {
        presentingComplaint,
        clinicalObservations,
        examinationFindings,
        assessment,
        treatmentPlan,
        followUpRecommendations,
        additionalNotes,
      },
    });

    if (res.success && res.note) {
      onNoteCreatedOrUpdated(res.note);
      setSelectedNote(res.note);
      setShowAmendModal(false);
      setAmendmentReason('');
      setIsEditing(false);
    } else {
      setFormError(res.error || 'Amendment failed.');
    }
  };

  const filteredNotes = notes.filter((n) => {
    if (statusFilter !== 'all' && n.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const match =
        n.patientName.toLowerCase().includes(q) ||
        n.id.toLowerCase().includes(q) ||
        n.assessment.toLowerCase().includes(q) ||
        n.treatmentPlan.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="bg-white p-5 sm:p-6 rounded-xl border border-[#0B4036]/10 shadow-[0_1px_3px_rgba(11,64,54,0.02)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#CE5B40]">
            Clinical Documentation
          </span>
          <h1 className="font-serif text-2xl font-bold text-[#0B4036] tracking-tight">Consultation Notes & Orders</h1>
          <p className="text-xs text-[#556B64] mt-0.5">
            Structured clinical findings, CEAP evaluations, procedural plans, and tamper-evident amendments.
          </p>
        </div>

        <button
          type="button"
          onClick={startNewNote}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0B4036] hover:bg-[#072B24] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors self-start sm:self-center"
        >
          <Plus className="w-4 h-4 text-[#8DAA9D]" />
          <span>New Clinical Note</span>
        </button>
      </div>

      {/* Main Dual-Pane Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Pane: Notes List (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-[#0B4036]/10 p-4 sm:p-5 shadow-[0_1px_3px_rgba(11,64,54,0.02)] space-y-3">
          <div className="space-y-2">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes or patient..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#FAF8F5] border border-[#0B4036]/15 rounded-lg text-[#0B4036] focus:outline-none focus:ring-2 focus:ring-[#0B4036]/20"
              />
              <Search className="w-3.5 h-3.5 text-[#8DAA9D] absolute left-2.5 top-2.5" />
            </div>

            <div className="flex gap-1 text-[11px] overflow-x-auto pb-1">
              {['all', 'Draft', 'Finalized', 'Amended'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-md font-semibold capitalize whitespace-nowrap transition-colors ${
                    statusFilter === st
                      ? 'bg-[#0B4036] text-white shadow-2xs'
                      : 'bg-[#FAF8F5] text-[#556B64] hover:text-[#0B4036]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pt-2">
            {filteredNotes.length === 0 ? (
              <div className="text-center py-8 text-xs text-[#556B64]">No notes found.</div>
            ) : (
              filteredNotes.map((n) => {
                const isSelected = selectedNote?.id === n.id;
                return (
                  <div
                    key={n.id}
                    onClick={() => handleSelectNote(n)}
                    className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#0B4036] bg-[#FAF8F5] shadow-2xs'
                        : 'border-gray-100 hover:border-[#0B4036]/20 hover:bg-[#FAF8F5]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-serif font-bold text-[#0B4036]">{n.patientName}</span>
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                          n.status === 'Finalized'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : n.status === 'Amended'
                            ? 'bg-purple-50 text-purple-800 border-purple-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        {n.status} {n.version > 1 ? `(v${n.version})` : ''}
                      </span>
                    </div>

                    <p className="text-[11px] text-[#556B64] line-clamp-1">{n.assessment}</p>
                    <div className="flex items-center justify-between text-[10px] text-gray-400 mt-2 font-mono">
                      <span>{n.id}</span>
                      <span>{n.consultationDate}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Pane: Active Note Workspace (8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-[#0B4036]/10 p-5 sm:p-6 shadow-[0_1px_3px_rgba(11,64,54,0.02)] space-y-5">
          {formError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Note Status Banner */}
          {selectedNote && (
            <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-[#FAF8F5] rounded-xl border border-[#0B4036]/10 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-[#0B4036]">{selectedNote.id}</span>
                <span className="text-[#556B64]">· Version {selectedNote.version}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    selectedNote.status === 'Finalized'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : selectedNote.status === 'Amended'
                      ? 'bg-purple-100 text-purple-800 border-purple-300'
                      : 'bg-amber-100 text-amber-800 border-amber-300'
                  }`}
                >
                  {selectedNote.status}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {selectedNote.status === 'Draft' && (
                  <button
                    type="button"
                    onClick={() => setShowSignModal(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0B4036] hover:bg-[#072B24] text-white font-semibold rounded-lg transition-colors shadow-2xs"
                  >
                    <Lock className="w-3.5 h-3.5 text-[#8DAA9D]" />
                    <span>Finalize & Sign</span>
                  </button>
                )}

                {(selectedNote.status === 'Finalized' || selectedNote.status === 'Amended') && (
                  <>
                    <button
                      type="button"
                      onClick={() => setShowAmendModal(true)}
                      className="px-3 py-1.5 bg-[#FAF8F5] border border-[#0B4036]/15 text-[#0B4036] font-semibold rounded-lg hover:bg-[#E4ECE6] transition-colors"
                    >
                      Amend Note
                    </button>
                    {selectedNote.versionHistory.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setShowHistoryModal(true)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-50 border border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <History className="w-3.5 h-3.5" />
                        <span>History ({selectedNote.versionHistory.length})</span>
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Form Fields */}
          <form onSubmit={handleSaveDraft} className="space-y-4 text-xs">
            {/* Patient & Appointment Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-[#0B4036] mb-1">
                  Patient <span className="text-red-500">*</span>
                </label>
                <select
                  disabled={!isEditing || !!selectedNote}
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#0B4036]/15 rounded-lg text-[#0B4036] disabled:opacity-75 focus:outline-none focus:ring-2 focus:ring-[#0B4036]/20"
                >
                  <option value="">-- Choose Patient --</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.id}) · {p.ceapClassification.split(' ')[0]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#0B4036] mb-1">Linked Consultation ID</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={appointmentId}
                  onChange={(e) => setAppointmentId(e.target.value)}
                  placeholder="e.g. appt-today-01"
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#0B4036]/15 rounded-lg text-[#0B4036] font-mono disabled:opacity-75 focus:outline-none focus:ring-2 focus:ring-[#0B4036]/20"
                />
              </div>
            </div>

            {/* Presenting Complaint */}
            <div>
              <label className="block font-semibold text-[#0B4036] mb-1">
                Chief Complaint & Presenting Symptoms <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={2}
                disabled={!isEditing}
                value={presentingComplaint}
                onChange={(e) => setPresentingComplaint(e.target.value)}
                placeholder="e.g. Persistent bilateral calf heaviness, nocturnal cramping, noticeable ankle pigmentation for 14 months."
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#0B4036]/15 rounded-lg text-[#0B4036] disabled:opacity-75 focus:outline-none focus:ring-2 focus:ring-[#0B4036]/20"
              />
            </div>

            {/* Physical Exam & CEAP Evaluation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-[#0B4036] mb-1">Clinical Observations</label>
                <textarea
                  rows={3}
                  disabled={!isEditing}
                  value={clinicalObservations}
                  onChange={(e) => setClinicalObservations(e.target.value)}
                  placeholder="e.g. Tortuous dilated superficial veins over medial calf, stasis dermatitis."
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#0B4036]/15 rounded-lg text-[#0B4036] disabled:opacity-75 focus:outline-none focus:ring-2 focus:ring-[#0B4036]/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0B4036] mb-1">Physical Examination Findings</label>
                <textarea
                  rows={3}
                  disabled={!isEditing}
                  value={examinationFindings}
                  onChange={(e) => setExaminationFindings(e.target.value)}
                  placeholder="e.g. Positive cough impulse over SFJ, non-tender cord, distal pulses intact."
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#0B4036]/15 rounded-lg text-[#0B4036] disabled:opacity-75 focus:outline-none focus:ring-2 focus:ring-[#0B4036]/20"
                />
              </div>
            </div>

            {/* Assessment & Clinical Diagnosis */}
            <div>
              <label className="block font-semibold text-[#0B4036] mb-1">
                Clinical Assessment & Diagnosis <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={2}
                disabled={!isEditing}
                value={assessment}
                onChange={(e) => setAssessment(e.target.value)}
                placeholder="e.g. Chronic venous insufficiency (CEAP C4a). Incompetent Great Saphenous Vein with secondary medial ankle hyperpigmentation."
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#0B4036]/15 rounded-lg text-[#0B4036] disabled:opacity-75 focus:outline-none focus:ring-2 focus:ring-[#0B4036]/20"
              />
            </div>

            {/* Treatment Plan & Follow-up */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-[#0B4036] mb-1">Treatment Plan & Orders</label>
                <textarea
                  rows={3}
                  disabled={!isEditing}
                  value={treatmentPlan}
                  onChange={(e) => setTreatmentPlan(e.target.value)}
                  placeholder="e.g. Advised EVLA under local tumescent anesthesia + Class II compression stockings (20-30 mmHg)."
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#0B4036]/15 rounded-lg text-[#0B4036] disabled:opacity-75 focus:outline-none focus:ring-2 focus:ring-[#0B4036]/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0B4036] mb-1">Follow-up & Instructions</label>
                <textarea
                  rows={3}
                  disabled={!isEditing}
                  value={followUpRecommendations}
                  onChange={(e) => setFollowUpRecommendations(e.target.value)}
                  placeholder="e.g. Post-procedure duplex scan at 1 week; avoid strenuous weight training for 7 days."
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#0B4036]/15 rounded-lg text-[#0B4036] disabled:opacity-75 focus:outline-none focus:ring-2 focus:ring-[#0B4036]/20"
                />
              </div>
            </div>

            {/* Verified Digital Signature Stamp (if Finalized) */}
            {selectedNote && (selectedNote.status === 'Finalized' || selectedNote.status === 'Amended') && (
              <div className="p-4 bg-[#FAF8F5] border border-[#0B4036]/10 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-[#0B4036] font-semibold">
                  <ShieldCheck className="w-4 h-4 text-[#0B4036]" />
                  <span>Verified Clinical Digital Signature</span>
                </div>
                <div className="text-[11px] text-[#556B64] space-y-1">
                  <p>
                    Digitally signed by <strong>{selectedNote.signedByDoctorName || selectedNote.doctorName}</strong> (ID: {selectedNote.doctorId})
                  </p>
                  <p>Signed At: {new Date(selectedNote.signedAt || '').toLocaleString()}</p>
                  <p className="font-mono text-[10px] text-gray-400 break-all">
                    Signature Hash: {selectedNote.signatureVerificationHash}
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {isEditing && (
              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2.5">
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#0B4036] hover:bg-[#072B24] rounded-lg transition-colors shadow-2xs"
                >
                  Save Draft Note
                </button>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* DIGITAL SIGNING MODAL */}
      {showSignModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="bg-white rounded-xl max-w-md w-full p-5 sm:p-6 border border-[#0B4036]/10 shadow-2xl space-y-4 animate-in fade-in-50 zoom-in-95 duration-150">
            <div className="w-12 h-12 bg-[#E4ECE6] text-[#0B4036] rounded-xl flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#0B4036] text-center">
              Digitally Sign Consultation Note
            </h3>
            <p className="text-xs text-[#556B64] text-center leading-relaxed">
              Finalizing will affix your verified clinical identity (<strong>{doctor.name}</strong>, Reg: {doctor.medicalRegistrationNumber}) and make this note immutable.
            </p>

            <div className="p-3 bg-[#FAF8F5] rounded-lg border border-[#0B4036]/10 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-[#556B64]">Doctor ID:</span>
                <span className="font-mono font-bold text-[#0B4036]">{doctor.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#556B64]">Department:</span>
                <span className="text-[#334E44]">{doctor.department}</span>
              </div>
            </div>

            <label className="flex items-start gap-2.5 text-xs text-[#334E44] cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={signConsent}
                onChange={(e) => setSignConsent(e.target.checked)}
                className="mt-0.5 rounded border-gray-300 text-[#0B4036] focus:ring-[#0B4036]"
              />
              <span>
                I certify that I have reviewed these clinical findings, diagnosis, and treatment orders for accuracy.
              </span>
            </label>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowSignModal(false)}
                className="flex-1 py-2 text-xs font-semibold text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!signConsent}
                onClick={handleFinalizeAndSign}
                className="flex-1 py-2 text-xs font-semibold text-white bg-[#0B4036] hover:bg-[#072B24] rounded-lg disabled:opacity-50 transition-colors shadow-2xs"
              >
                Sign & Finalize
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AMENDMENT MODAL */}
      {showAmendModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="bg-white rounded-xl max-w-lg w-full p-5 sm:p-6 border border-[#0B4036]/10 shadow-2xl space-y-4 animate-in fade-in-50 zoom-in-95 duration-150">
            <h3 className="font-serif text-lg font-bold text-[#0B4036]">
              Amend Finalized Note (Version {selectedNote ? selectedNote.version + 1 : 2})
            </h3>
            <p className="text-xs text-[#556B64] leading-relaxed">
              Under medical record governance, finalized notes cannot be silently overwritten. Please provide a formal clinical justification for this revision.
            </p>

            <form onSubmit={handleAmendSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#0B4036] mb-1">
                  Amendment Clinical Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={amendmentReason}
                  onChange={(e) => setAmendmentReason(e.target.value)}
                  placeholder="e.g. Amended treatment orders following updated standing duplex scan results."
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#0B4036]/15 rounded-lg text-[#0B4036] focus:outline-none focus:ring-2 focus:ring-[#0B4036]/20"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAmendModal(false)}
                  className="flex-1 py-2 text-xs font-semibold text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!amendmentReason.trim()}
                  className="flex-1 py-2 text-xs font-semibold text-white bg-[#0B4036] hover:bg-[#072B24] rounded-lg disabled:opacity-50 transition-colors shadow-2xs"
                >
                  Confirm & Commit Amendment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VERSION HISTORY MODAL */}
      {showHistoryModal && selectedNote && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="bg-white rounded-xl max-w-2xl w-full p-5 sm:p-6 border border-[#0B4036]/10 shadow-2xl space-y-4 max-h-[80vh] overflow-y-auto animate-in fade-in-50 zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-serif text-lg font-bold text-[#0B4036]">
                Amendment & Version History ({selectedNote.id})
              </h3>
              <button
                type="button"
                onClick={() => setShowHistoryModal(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {selectedNote.versionHistory.map((v, i) => (
                <div key={i} className="p-4 bg-[#FAF8F5] rounded-xl border border-[#0B4036]/10 space-y-2">
                  <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                    <span className="font-bold text-[#0B4036]">Version {v.versionNumber}</span>
                    <span className="text-gray-500 font-mono text-[11px]">{new Date(v.amendedAt).toLocaleString()}</span>
                  </div>
                  <p className="text-[#334E44]">
                    <strong>Amended By:</strong> {v.amendedByDoctorName}
                  </p>
                  <p className="text-purple-900 bg-purple-50 p-2 rounded border border-purple-200">
                    <strong>Reason for Amendment:</strong> {v.amendmentReason}
                  </p>
                  <div className="text-[11px] text-[#556B64] bg-white p-2.5 rounded border border-gray-200 whitespace-pre-line leading-relaxed">
                    <strong>Previous Assessment:</strong> {v.previousContent.assessment}
                    {'\n'}
                    <strong>Previous Plan:</strong> {v.previousContent.treatmentPlan}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
