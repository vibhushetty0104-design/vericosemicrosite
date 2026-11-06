import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, AlertCircle, CheckCircle2, History } from 'lucide-react';
import { Doctor, ClinicalAppointment } from '../../types/doctorPortal';
import { doctorPortalService } from '../../services/doctorPortalService';

interface DoctorRescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: Doctor;
  appointment: ClinicalAppointment | null;
  onAppointmentRescheduled: () => void;
}

export const DoctorRescheduleModal: React.FC<DoctorRescheduleModalProps> = ({
  isOpen,
  onClose,
  doctor,
  appointment,
  onAppointmentRescheduled,
}) => {
  const [newDate, setNewDate] = useState('');
  const [newSlot, setNewSlot] = useState('');
  const [reason, setReason] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<{ time: string; available: boolean; reason?: string }[]>([]);

  useEffect(() => {
    if (appointment) {
      setNewDate(appointment.date);
      setNewSlot(appointment.startTime);
      setReason('');
      setErrorMsg(null);
    }
  }, [appointment]);

  useEffect(() => {
    if (doctor && newDate) {
      const slots = doctorPortalService.getAvailableSlotsForDoctor(doctor.id, newDate);
      setAvailableSlots(slots);
      // If current slot isn't free on that date, pick first free
      const currentOk = slots.find((s) => s.time === newSlot && s.available);
      if (!currentOk) {
        const first = slots.find((s) => s.available);
        setNewSlot(first ? first.time : '');
      }
    }
  }, [doctor, newDate]);

  if (!isOpen || !appointment) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!newDate) {
      setErrorMsg('Please select a new date.');
      return;
    }
    if (!newSlot) {
      setErrorMsg('Please select a new available time slot.');
      return;
    }
    if (!reason.trim() || reason.trim().length < 5) {
      setErrorMsg('Please state a valid clinical or scheduling reason for rescheduling (min 5 characters).');
      return;
    }

    const res = doctorPortalService.rescheduleAppointment({
      appointmentId: appointment.id,
      newDate,
      newStartTime: newSlot,
      reason,
      performedByDoctorName: doctor.name,
    });

    if (!res.success) {
      setErrorMsg(res.error || 'Failed to reschedule appointment.');
      return;
    }

    onAppointmentRescheduled();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto" role="dialog" aria-modal="true">
      <div className="bg-white rounded-xl max-w-lg w-full p-5 sm:p-6 border border-[#0B4036]/10 shadow-2xl my-8 animate-in fade-in-50 zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3.5 border-b border-[#0B4036]/10">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#CE5B40]">
              Slot Modification
            </span>
            <h3 className="font-serif text-xl font-bold text-[#0B4036]">Reschedule Appointment</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Current Booking Info */}
        <div className="mt-4 p-3 bg-[#FAF8F5] rounded-lg border border-[#0B4036]/10 text-xs space-y-1">
          <div className="font-semibold text-[#0B4036] flex items-center justify-between">
            <span>Patient: {appointment.patientName}</span>
            <span className="font-mono text-[10px] text-gray-500">{appointment.id}</span>
          </div>
          <p className="text-[#556B64]">
            Currently scheduled: <strong>{appointment.date}</strong> at <strong>{appointment.startTime}</strong> ({appointment.consultationMode})
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#0B4036] mb-1">
              Select New Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              required
              value={newDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#0B4036]/15 rounded-lg text-[#0B4036] font-mono focus:outline-none focus:ring-2 focus:ring-[#0B4036]/20"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#0B4036] mb-1">
              Choose New Time Slot <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 max-h-36 overflow-y-auto p-1 bg-[#FAF8F5] rounded-lg border border-[#0B4036]/10">
              {availableSlots.map((slot) => {
                const isSelected = newSlot === slot.time;
                return (
                  <button
                    key={slot.time}
                    type="button"
                    disabled={!slot.available}
                    onClick={() => setNewSlot(slot.time)}
                    className={`py-1.5 px-2 rounded text-[11px] font-mono font-medium transition-all ${
                      isSelected
                        ? 'bg-[#0B4036] text-white shadow-2xs font-bold'
                        : slot.available
                        ? 'bg-white text-[#0B4036] border border-[#0B4036]/10 hover:border-[#0B4036]'
                        : 'bg-gray-100 text-gray-400 border border-transparent cursor-not-allowed line-through opacity-50'
                    }`}
                  >
                    {slot.time}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#0B4036] mb-1">
              Clinical / Scheduling Reason <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Patient requested morning slot; surgeon delayed in EVLA OT; clinic rescheduled."
              className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#0B4036]/15 rounded-lg text-[#0B4036] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0B4036]/20"
            />
            <p className="text-[11px] text-[#556B64] mt-1">
              This explanation is permanently committed to the consultation audit trail.
            </p>
          </div>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!newSlot}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#0B4036] hover:bg-[#072B24] rounded-lg transition-colors shadow-2xs disabled:opacity-50"
            >
              Confirm Reschedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
