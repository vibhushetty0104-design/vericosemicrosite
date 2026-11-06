import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, AlertCircle, CheckCircle2, MapPin, Video, Info } from 'lucide-react';
import { Doctor, PatientRecord, AppointmentType, ConsultationMode, ClinicalAppointment } from '../../types/doctorPortal';
import { doctorPortalService } from '../../services/doctorPortalService';

interface DoctorAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: Doctor;
  patients: PatientRecord[];
  onAppointmentCreated: (appointment: ClinicalAppointment) => void;
  initialPatientId?: string;
  initialDate?: string;
}

export const DoctorAppointmentModal: React.FC<DoctorAppointmentModalProps> = ({
  isOpen,
  onClose,
  doctor,
  patients,
  onAppointmentCreated,
  initialPatientId,
  initialDate,
}) => {
  const [patientId, setPatientId] = useState(initialPatientId || '');
  const [date, setDate] = useState(initialDate || new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [appointmentType, setAppointmentType] = useState<AppointmentType>('Initial Evaluation');
  const [consultationMode, setConsultationMode] = useState<ConsultationMode>('In-Person OPD');
  const [reasonForVisit, setReasonForVisit] = useState('');
  const [administrativeNotes, setAdministrativeNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<{ time: string; available: boolean; reason?: string }[]>([]);

  // Update slots when date changes
  useEffect(() => {
    if (doctor && date) {
      const slots = doctorPortalService.getAvailableSlotsForDoctor(doctor.id, date);
      setAvailableSlots(slots);
      // If currently selected slot is no longer available, clear it
      const currentAvailable = slots.find((s) => s.time === selectedSlot && s.available);
      if (!currentAvailable) {
        const firstFree = slots.find((s) => s.available);
        setSelectedSlot(firstFree ? firstFree.time : '');
      }
    }
  }, [doctor, date]);

  useEffect(() => {
    if (initialPatientId) setPatientId(initialPatientId);
    if (initialDate) setDate(initialDate);
  }, [initialPatientId, initialDate]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!patientId) {
      setErrorMsg('Please select a patient.');
      return;
    }
    if (!selectedSlot) {
      setErrorMsg('Please choose an available appointment time slot.');
      return;
    }
    if (!reasonForVisit.trim()) {
      setErrorMsg('Please enter a clinical reason for visit.');
      return;
    }

    const res = doctorPortalService.createAppointment({
      patientId,
      doctorId: doctor.id,
      date,
      startTime: selectedSlot,
      appointmentType,
      consultationMode,
      reasonForVisit,
      administrativeNotes,
      performedByDoctorName: doctor.name,
    });

    if (!res.success || !res.appointment) {
      setErrorMsg(res.error || 'Failed to schedule appointment.');
      return;
    }

    onAppointmentCreated(res.appointment);
    onClose();
  };

  const selectedPatient = patients.find((p) => p.id === patientId);

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto" role="dialog" aria-modal="true">
      <div className="bg-white rounded-xl max-w-xl w-full p-5 sm:p-6 border border-[#0B4036]/10 shadow-2xl my-8 animate-in fade-in-50 zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3.5 border-b border-[#0B4036]/10">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#CE5B40]">
              Clinical Scheduling
            </span>
            <h3 className="font-serif text-xl font-bold text-[#0B4036]">Schedule Patient Consultation</h3>
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

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          {/* Patient Selection */}
          <div>
            <label className="block font-semibold text-[#0B4036] mb-1">
              Select Patient <span className="text-red-500">*</span>
            </label>
            <select
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              required
              className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#0B4036]/15 rounded-lg text-[#0B4036] focus:outline-none focus:ring-2 focus:ring-[#0B4036]/20"
            >
              <option value="">-- Choose registered patient --</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.id}) · {p.age}y {p.gender} · {p.ceapClassification.split(' ')[0]}
                </option>
              ))}
            </select>
          </div>

          {/* Patient Quick Context Note */}
          {selectedPatient && (
            <div className="p-3 bg-[#E4ECE6]/50 rounded-lg border border-[#8DAA9D]/30 text-[11px] text-[#2D453C]">
              <strong>Patient Summary:</strong> {selectedPatient.name} ({selectedPatient.id}), {selectedPatient.age}y {selectedPatient.gender}.
              <br />
              <strong>Primary Diagnosis:</strong> {selectedPatient.primaryDiagnosis}
            </div>
          )}

          {/* Date & Mode */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#0B4036] mb-1">
                Consultation Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={date}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#0B4036]/15 rounded-lg text-[#0B4036] font-mono focus:outline-none focus:ring-2 focus:ring-[#0B4036]/20"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#0B4036] mb-1">
                Consultation Mode <span className="text-red-500">*</span>
              </label>
              <select
                value={consultationMode}
                onChange={(e) => setConsultationMode(e.target.value as ConsultationMode)}
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#0B4036]/15 rounded-lg text-[#0B4036] focus:outline-none focus:ring-2 focus:ring-[#0B4036]/20"
              >
                <option value="In-Person OPD">In-Person OPD (Indiranagar Clinic)</option>
                <option value="Video Teleconsultation">Video Teleconsultation (HD Encrypted)</option>
              </select>
            </div>
          </div>

          {/* Dynamic Available Slot Generator */}
          <div>
            <label className="block font-semibold text-[#0B4036] mb-1">
              Select Available Time Slot ({doctorPortalService.getDoctorAvailability(doctor.id)?.slotDurationMinutes || 30} mins) <span className="text-red-500">*</span>
            </label>
            {availableSlots.length === 0 ? (
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 text-center">
                Doctor is not available on this date (off-day or approved leave).
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 max-h-36 overflow-y-auto p-1 bg-[#FAF8F5] rounded-lg border border-[#0B4036]/10">
                {availableSlots.map((slot) => {
                  const isSelected = selectedSlot === slot.time;
                  return (
                    <button
                      key={slot.time}
                      type="button"
                      disabled={!slot.available}
                      onClick={() => setSelectedSlot(slot.time)}
                      className={`py-1.5 px-2 rounded text-[11px] font-mono font-medium transition-all ${
                        isSelected
                          ? 'bg-[#0B4036] text-white shadow-2xs font-bold'
                          : slot.available
                          ? 'bg-white text-[#0B4036] border border-[#0B4036]/10 hover:border-[#0B4036]'
                          : 'bg-gray-100 text-gray-400 border border-transparent cursor-not-allowed line-through opacity-50'
                      }`}
                      title={slot.reason ? `${slot.time} - ${slot.reason}` : slot.time}
                    >
                      {slot.time}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Appointment Type */}
          <div>
            <label className="block font-semibold text-[#0B4036] mb-1">
              Consultation Type <span className="text-red-500">*</span>
            </label>
            <select
              value={appointmentType}
              onChange={(e) => setAppointmentType(e.target.value as AppointmentType)}
              className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#0B4036]/15 rounded-lg text-[#0B4036] focus:outline-none focus:ring-2 focus:ring-[#0B4036]/20"
            >
              <option value="Initial Evaluation">Initial Evaluation</option>
              <option value="Follow-up Consultation">Follow-up Consultation</option>
              <option value="Duplex Ultrasound Review">Duplex Ultrasound Review</option>
              <option value="Post-EVLA Review">Post-EVLA Review</option>
              <option value="Pre-procedural Counseling">Pre-procedural Counseling</option>
            </select>
          </div>

          {/* Clinical Reason for Visit */}
          <div>
            <label className="block font-semibold text-[#0B4036] mb-1">
              Reason for Visit & Clinical Indication <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={2}
              value={reasonForVisit}
              onChange={(e) => setReasonForVisit(e.target.value)}
              placeholder="e.g. Bilateral lower limb heaviness, suspected GSV reflux, CEAP staging."
              className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#0B4036]/15 rounded-lg text-[#0B4036] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0B4036]/20"
            />
          </div>

          {/* Administrative Notes */}
          <div>
            <label className="block font-semibold text-[#0B4036] mb-1">
              Administrative & Triage Notes (Optional)
            </label>
            <input
              type="text"
              value={administrativeNotes}
              onChange={(e) => setAdministrativeNotes(e.target.value)}
              placeholder="e.g. Patient prefers evening appointment; duplex scan requested on arrival."
              className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#0B4036]/15 rounded-lg text-[#0B4036] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0B4036]/20"
            />
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
              disabled={!selectedSlot}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#0B4036] hover:bg-[#072B24] rounded-lg transition-colors shadow-2xs disabled:opacity-50"
            >
              Confirm Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
