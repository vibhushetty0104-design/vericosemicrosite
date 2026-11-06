import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  User,
  MapPin,
  Video,
  FileText,
  AlertCircle,
  CheckCircle2,
  Activity,
  History,
  FileEdit,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { Doctor, ClinicalAppointment, AppointmentStatus } from '../../types/doctorPortal';
import { doctorPortalService } from '../../services/doctorPortalService';

interface DoctorAppointmentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: ClinicalAppointment | null;
  doctor: Doctor;
  onOpenReschedule: (appointment: ClinicalAppointment) => void;
  onOpenPatientProfile: (patientId: string) => void;
  onOpenClinicalNoteDraft: (appointmentId: string, patientId: string) => void;
  onAppointmentUpdated: (updated: ClinicalAppointment) => void;
}

export const DoctorAppointmentDetailModal: React.FC<DoctorAppointmentDetailModalProps> = ({
  isOpen,
  onClose,
  appointment,
  doctor,
  onOpenReschedule,
  onOpenPatientProfile,
  onOpenClinicalNoteDraft,
  onAppointmentUpdated,
}) => {
  const [showCancelPrompt, setShowCancelPrompt] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelError, setCancelError] = useState<string | null>(null);

  if (!isOpen || !appointment) return null;

  const handleStatusChange = (status: AppointmentStatus) => {
    const res = doctorPortalService.updateAppointmentStatus(
      appointment.id,
      status,
      doctor.name,
      `Clinician updated appointment status directly from appointment drawer.`
    );
    if (res.success && res.appointment) {
      onAppointmentUpdated(res.appointment);
    }
  };

  const handleCancelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCancelError(null);

    if (!cancelReason.trim() || cancelReason.trim().length < 5) {
      setCancelError('Please specify a clinical or administrative reason for cancellation (minimum 5 characters).');
      return;
    }

    const res = doctorPortalService.cancelAppointment({
      appointmentId: appointment.id,
      reason: cancelReason,
      performedByDoctorName: doctor.name,
    });

    if (res.success && res.appointment) {
      onAppointmentUpdated(res.appointment);
      setShowCancelPrompt(false);
    } else {
      setCancelError(res.error || 'Failed to cancel appointment.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over Drawer Container */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-xl md:max-w-2xl bg-white shadow-2xl border-l border-[#0B4036]/10 flex flex-col justify-between animate-in slide-in-from-right duration-250">
          {/* Drawer Header */}
          <div className="p-5 sm:p-6 border-b border-[#0B4036]/10 flex items-start justify-between gap-4 bg-white sticky top-0 z-10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-[10px] font-bold text-[#0B4036] bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#0B4036]/10">
                  {appointment.id}
                </span>
                <span className="text-xs font-semibold text-[#556B64]">{appointment.appointmentType}</span>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0B4036] tracking-tight">
                Consultation: {appointment.patientName}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Close appointment drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
            {/* Schedule & Status Bar */}
            <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#0B4036]/10 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 font-semibold text-[#0B4036]">
                  <Calendar className="w-4 h-4 text-[#8DAA9D]" />
                  <span>{appointment.date}</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-[#334E44]">
                  <Clock className="w-4 h-4 text-[#8DAA9D]" />
                  <span>
                    {appointment.startTime} - {appointment.endTime}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[#556B64]">Status:</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] tracking-wider ${
                    appointment.status === 'Confirmed'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : appointment.status === 'Completed'
                      ? 'bg-[#FAF8F5] text-[#0B4036] border border-[#0B4036]/20'
                      : appointment.status === 'Rescheduled'
                      ? 'bg-purple-50 text-purple-800 border border-purple-200'
                      : appointment.status === 'Cancelled'
                      ? 'bg-rose-50 text-rose-800 border border-rose-200'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}
                >
                  {appointment.status}
                </span>
              </div>
            </div>

            {/* Patient Snapshot Card */}
            <div className="p-4 rounded-xl border border-[#0B4036]/10 bg-white shadow-2xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#556B64]">
                  Patient Electronic Record
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenPatientProfile(appointment.patientId);
                  }}
                  className="text-xs font-semibold text-[#0B4036] hover:text-[#CE5B40] hover:underline flex items-center gap-1"
                >
                  <span>Open Full EMR</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <h4 className="font-serif font-bold text-base text-[#0B4036]">{appointment.patientName}</h4>
                  <p className="text-[#556B64] mt-0.5">
                    Age {appointment.patientAge} · {appointment.patientGender} · Phone: {appointment.patientPhone}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <span className="font-mono text-[10px] font-bold bg-[#FAF8F5] text-[#0B4036] px-2 py-0.5 rounded border border-[#0B4036]/10 block">
                    ID: {appointment.patientId}
                  </span>
                </div>
              </div>
            </div>

            {/* Location & Mode */}
            <div className="p-4 rounded-xl border border-[#0B4036]/10 bg-white text-xs space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#556B64] block">
                Consultation Mode & Location
              </span>
              <div className="flex items-center gap-2 text-[#334E44]">
                {appointment.consultationMode === 'Video Teleconsultation' ? (
                  <Video className="w-4 h-4 text-blue-600 shrink-0" />
                ) : (
                  <MapPin className="w-4 h-4 text-[#0B4036] shrink-0" />
                )}
                <span className="font-medium">{appointment.consultationMode}</span>
                <span>·</span>
                <span className="text-[#556B64]">{appointment.location}</span>
              </div>
              {appointment.meetingLink && (
                <div className="pt-2">
                  <a
                    href={appointment.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg border border-blue-200 transition-colors"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Launch Encrypted Teleconsultation Room</span>
                  </a>
                </div>
              )}
            </div>

            {/* Clinical Indication & Symptoms */}
            <div className="space-y-3 text-xs">
              <div>
                <h4 className="font-semibold text-[#0B4036] mb-1.5">Presenting Symptoms & Clinical Indication:</h4>
                <p className="text-[#334E44] bg-[#FAF8F5] p-3.5 rounded-xl border border-[#0B4036]/10 leading-relaxed font-normal">
                  {appointment.reasonForVisit}
                </p>
              </div>

              {appointment.administrativeNotes && (
                <div>
                  <h4 className="font-semibold text-[#0B4036] mb-1.5">Administrative & Coordination Notes:</h4>
                  <p className="text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 leading-relaxed">
                    {appointment.administrativeNotes}
                  </p>
                </div>
              )}

              {appointment.reschedulingReason && (
                <div className="p-3 bg-purple-50 text-purple-900 rounded-lg border border-purple-200 text-xs">
                  <strong>Rescheduling Audit Note:</strong> {appointment.reschedulingReason}
                </div>
              )}

              {appointment.cancellationReason && (
                <div className="p-3 bg-rose-50 text-rose-900 rounded-lg border border-rose-200 text-xs">
                  <strong>Cancellation Rationale:</strong> {appointment.cancellationReason}
                </div>
              )}
            </div>

            {/* Linked Clinical Note */}
            <div className="p-4 rounded-xl border border-[#0B4036]/10 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#E4ECE6] text-[#0B4036] flex items-center justify-center shrink-0">
                  <FileEdit className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-[#0B4036] block">Consultation Note</span>
                  {appointment.linkedClinicalNoteId ? (
                    <span className="text-[11px] text-emerald-800 font-medium">
                      Signed Note: {appointment.linkedClinicalNoteId}
                    </span>
                  ) : (
                    <span className="text-[11px] text-amber-700">Not yet drafted</span>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenClinicalNoteDraft(appointment.id, appointment.patientId);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-[#0B4036] hover:bg-[#072B24] text-white rounded-lg shadow-xs transition-colors self-start sm:self-center"
              >
                <span>{appointment.linkedClinicalNoteId ? 'Open Clinical Note' : 'Draft Clinical Note'}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#8DAA9D]" />
              </button>
            </div>

            {/* Scheduling Audit History Trail */}
            <div className="pt-2">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#556B64] mb-2 flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-[#8DAA9D]" />
                <span>Scheduling Audit Trail</span>
              </h4>
              <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                {appointment.history.map((h, i) => (
                  <div key={i} className="text-[11px] text-[#556B64] flex items-start gap-2 bg-[#FAF8F5] p-2 rounded-lg border border-[#0B4036]/5">
                    <span className="text-gray-400 font-mono text-[10px] shrink-0">
                      {new Date(h.timestamp).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <span className="font-semibold text-[#0B4036]">{h.action}</span>
                    <span>by {h.performedBy}</span>
                    {h.reason && <span className="italic text-gray-500">({h.reason})</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Cancellation Sub-Form */}
            {showCancelPrompt && (
              <div className="p-4 bg-rose-50/80 border border-rose-200 rounded-xl space-y-3">
                <h4 className="font-serif text-sm font-bold text-rose-900">
                  Confirm Appointment Cancellation
                </h4>
                <p className="text-xs text-rose-700">
                  Provide a mandatory clinical or administrative rationale for the audit ledger. The slot will be returned to doctor availability.
                </p>
                {cancelError && <div className="text-xs text-red-600 font-semibold">{cancelError}</div>}
                <form onSubmit={handleCancelSubmit} className="space-y-2.5">
                  <input
                    type="text"
                    required
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder="e.g. Patient requested cancellation; acute hospital transfer; symptom resolution."
                    className="w-full px-3 py-2 text-xs bg-white border border-rose-300 rounded-lg text-rose-900 focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => setShowCancelPrompt(false)}
                      className="px-3 py-1.5 text-xs text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Dismiss
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded-lg transition-colors shadow-2xs"
                    >
                      Confirm Cancellation
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Drawer Sticky Footer Actions */}
          {!showCancelPrompt && (
            <div className="p-4 sm:p-5 border-t border-[#0B4036]/10 bg-[#FAF8F5] flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleStatusChange('Completed')}
                  className="px-3 py-1.5 text-xs font-semibold text-[#0B4036] bg-white border border-[#0B4036]/20 rounded-lg hover:bg-[#E4ECE6] transition-colors"
                >
                  Mark Completed
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange('No-show')}
                  className="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Mark No-Show
                </button>
              </div>

              <div className="flex items-center gap-2">
                {appointment.status !== 'Cancelled' && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenReschedule(appointment);
                      }}
                      className="px-3 py-1.5 text-xs font-semibold text-[#0B4036] bg-white border border-[#0B4036]/20 rounded-lg hover:bg-[#E4ECE6] transition-colors"
                    >
                      Reschedule
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCancelPrompt(true)}
                      className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-white border border-rose-200 rounded-lg hover:bg-rose-50 transition-colors"
                    >
                      Cancel Slot
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
