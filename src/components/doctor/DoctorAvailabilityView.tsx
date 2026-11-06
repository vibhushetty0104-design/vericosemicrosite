import React, { useState } from 'react';
import {
  Clock,
  Calendar,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Save,
  Coffee,
  ShieldCheck,
} from 'lucide-react';
import { Doctor, DoctorAvailability, BreakTime, UnavailablePeriod } from '../../types/doctorPortal';
import { doctorPortalService } from '../../services/doctorPortalService';

interface DoctorAvailabilityViewProps {
  doctor: Doctor;
  onAvailabilityUpdated: (avail: DoctorAvailability) => void;
}

export const DoctorAvailabilityView: React.FC<DoctorAvailabilityViewProps> = ({
  doctor,
  onAvailabilityUpdated,
}) => {
  const currentAvailability = doctorPortalService.getDoctorAvailability(doctor.id) || {
    doctorId: doctor.id,
    workingDays: [1, 2, 3, 4, 5, 6],
    workingHours: { start: '09:00', end: '17:00' },
    slotDurationMinutes: 30,
    breaks: [],
    unavailablePeriods: [],
    maxAppointmentsPerSlot: 1,
    bufferBetweenSlotsMinutes: 0,
  };

  const [workingDays, setWorkingDays] = useState<number[]>(currentAvailability.workingDays);
  const [workingStart, setWorkingStart] = useState(currentAvailability.workingHours.start);
  const [workingEnd, setWorkingEnd] = useState(currentAvailability.workingHours.end);
  const [slotDuration, setSlotDuration] = useState(currentAvailability.slotDurationMinutes);
  const [breaks, setBreaks] = useState<BreakTime[]>(currentAvailability.breaks);
  const [unavailables, setUnavailables] = useState<UnavailablePeriod[]>(currentAvailability.unavailablePeriods);

  // New break form
  const [newBreakLabel, setNewBreakLabel] = useState('');
  const [newBreakStart, setNewBreakStart] = useState('13:00');
  const [newBreakEnd, setNewBreakEnd] = useState('14:00');

  // New leave form
  const [newLeaveReason, setNewLeaveReason] = useState('');
  const [newLeaveStart, setNewLeaveStart] = useState('');
  const [newLeaveEnd, setNewLeaveEnd] = useState('');

  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const daysMap = [
    { label: 'Sunday', value: 0 },
    { label: 'Monday', value: 1 },
    { label: 'Tuesday', value: 2 },
    { label: 'Wednesday', value: 3 },
    { label: 'Thursday', value: 4 },
    { label: 'Friday', value: 5 },
    { label: 'Saturday', value: 6 },
  ];

  const toggleDay = (dayVal: number) => {
    if (workingDays.includes(dayVal)) {
      setWorkingDays(workingDays.filter((d) => d !== dayVal));
    } else {
      setWorkingDays([...workingDays, dayVal].sort());
    }
  };

  const handleAddBreak = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBreakLabel.trim()) return;
    const b: BreakTime = {
      id: `brk-${Date.now()}`,
      label: newBreakLabel.trim(),
      start: newBreakStart,
      end: newBreakEnd,
    };
    setBreaks([...breaks, b]);
    setNewBreakLabel('');
  };

  const handleRemoveBreak = (id: string) => {
    setBreaks(breaks.filter((b) => b.id !== id));
  };

  const handleAddLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeaveReason.trim() || !newLeaveStart || !newLeaveEnd) return;
    const l: UnavailablePeriod = {
      id: `leave-${Date.now()}`,
      reason: newLeaveReason.trim(),
      startDate: newLeaveStart,
      endDate: newLeaveEnd,
      allDay: true,
    };
    setUnavailables([...unavailables, l]);
    setNewLeaveReason('');
    setNewLeaveStart('');
    setNewLeaveEnd('');
  };

  const handleRemoveLeave = (id: string) => {
    setUnavailables(unavailables.filter((l) => l.id !== id));
  };

  const handleSaveAvailability = () => {
    const updated: DoctorAvailability = {
      ...currentAvailability,
      workingDays,
      workingHours: { start: workingStart, end: workingEnd },
      slotDurationMinutes: slotDuration,
      breaks,
      unavailablePeriods: unavailables,
    };

    const res = doctorPortalService.updateDoctorAvailability(updated, doctor.name);
    if (res.success) {
      onAvailabilityUpdated(res.availability);
      setSaveMessage('Consultation availability schedule updated successfully.');
      setTimeout(() => setSaveMessage(null), 4000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 sm:p-6 rounded-xl border border-[#0B4036]/10 shadow-[0_1px_3px_rgba(11,64,54,0.02)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#CE5B40]">
            Scheduling Configuration
          </span>
          <h1 className="font-serif text-2xl font-bold text-[#0B4036] tracking-tight">Doctor Availability & Shifts</h1>
          <p className="text-xs text-[#556B64] mt-0.5">
            Configure clinical consultation hours, slot durations, operating theatre breaks, and approved leave.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveAvailability}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0B4036] hover:bg-[#072B24] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors self-start sm:self-center"
        >
          <Save className="w-4 h-4 text-[#8DAA9D]" />
          <span>Save Changes</span>
        </button>
      </div>

      {saveMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        {/* Working Days & Shift Hours */}
        <div className="bg-white rounded-xl border border-[#0B4036]/10 p-5 shadow-[0_1px_3px_rgba(11,64,54,0.02)] space-y-4">
          <h3 className="font-serif text-base font-bold text-[#0B4036]">Weekly Consultation Days</h3>
          <div className="flex flex-wrap gap-2">
            {daysMap.map((d) => {
              const active = workingDays.includes(d.value);
              return (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => toggleDay(d.value)}
                  className={`px-3 py-2 rounded-lg font-semibold transition-colors ${
                    active
                      ? 'bg-[#0B4036] text-white shadow-2xs'
                      : 'bg-[#FAF8F5] text-[#556B64] border border-[#0B4036]/10 hover:border-[#0B4036]'
                  }`}
                >
                  {d.label}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-gray-100 space-y-3">
            <h4 className="font-bold text-[#0B4036]">Daily Consultation Hours</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#556B64] mb-1">Shift Start Time</label>
                <input
                  type="time"
                  value={workingStart}
                  onChange={(e) => setWorkingStart(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#0B4036]/15 rounded-lg text-[#0B4036] font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#0B4036]/20"
                />
              </div>

              <div>
                <label className="block text-[#556B64] mb-1">Shift End Time</label>
                <input
                  type="time"
                  value={workingEnd}
                  onChange={(e) => setWorkingEnd(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#0B4036]/15 rounded-lg text-[#0B4036] font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#0B4036]/20"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 space-y-2">
            <h4 className="font-bold text-[#0B4036]">Consultation Slot Duration</h4>
            <div className="flex gap-2">
              {[15, 20, 30, 45, 60].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setSlotDuration(mins)}
                  className={`flex-1 py-2 rounded-lg font-mono font-semibold transition-colors ${
                    slotDuration === mins
                      ? 'bg-[#0B4036] text-white shadow-2xs'
                      : 'bg-[#FAF8F5] text-[#556B64] border border-[#0B4036]/10 hover:border-[#0B4036]'
                  }`}
                >
                  {mins}m
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Breaks & OT Periods */}
        <div className="bg-white rounded-xl border border-[#0B4036]/10 p-5 shadow-[0_1px_3px_rgba(11,64,54,0.02)] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-base font-bold text-[#0B4036]">Scheduled Breaks & Procedures</h3>
            <span className="text-[10px] text-[#556B64]">Auto-blocked in slot picker</span>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto">
            {breaks.length === 0 ? (
              <p className="text-gray-400 py-3 text-center">No regular breaks configured.</p>
            ) : (
              breaks.map((b) => (
                <div
                  key={b.id}
                  className="p-2.5 rounded-lg border border-[#0B4036]/10 bg-[#FAF8F5] flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Coffee className="w-3.5 h-3.5 text-[#CE5B40]" />
                    <span className="font-semibold text-[#0B4036]">{b.label}</span>
                    <span className="font-mono text-gray-500">
                      ({b.start} - {b.end})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveBreak(b.id)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleAddBreak} className="pt-3 border-t border-gray-100 space-y-2">
            <span className="font-semibold text-[#0B4036] block">Add Scheduled Break</span>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                required
                placeholder="Break label (e.g. Lunch)"
                value={newBreakLabel}
                onChange={(e) => setNewBreakLabel(e.target.value)}
                className="col-span-3 px-3 py-1.5 bg-[#FAF8F5] border border-[#0B4036]/15 rounded-lg text-[#0B4036]"
              />
              <input
                type="time"
                value={newBreakStart}
                onChange={(e) => setNewBreakStart(e.target.value)}
                className="px-2 py-1.5 bg-[#FAF8F5] border border-[#0B4036]/15 rounded-lg font-mono text-[11px]"
              />
              <input
                type="time"
                value={newBreakEnd}
                onChange={(e) => setNewBreakEnd(e.target.value)}
                className="px-2 py-1.5 bg-[#FAF8F5] border border-[#0B4036]/15 rounded-lg font-mono text-[11px]"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-[#0B4036] text-white font-semibold rounded-lg hover:bg-[#072B24] transition-colors"
              >
                + Add Break
              </button>
            </div>
          </form>
        </div>

        {/* Unavailable & Leave Periods (Full Width) */}
        <div className="md:col-span-2 bg-white rounded-xl border border-[#0B4036]/10 p-5 shadow-[0_1px_3px_rgba(11,64,54,0.02)] space-y-4">
          <h3 className="font-serif text-base font-bold text-[#0B4036]">
            Approved Leaves & Conference Block-outs
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {unavailables.length === 0 ? (
                <p className="text-gray-400 py-6 text-center">No leave or conference dates scheduled.</p>
              ) : (
                unavailables.map((u) => (
                  <div
                    key={u.id}
                    className="p-3 rounded-lg border border-[#0B4036]/10 bg-[#FAF8F5] flex items-center justify-between"
                  >
                    <div>
                      <span className="font-semibold text-[#0B4036] block">{u.reason}</span>
                      <span className="font-mono text-gray-500 text-[11px]">
                        {u.startDate} to {u.endDate}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveLeave(u.id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleAddLeave} className="space-y-2.5 p-4 rounded-lg bg-[#FAF8F5] border border-[#0B4036]/10">
              <span className="font-semibold text-[#0B4036] block">Block Leave / Conference Dates</span>
              <input
                type="text"
                required
                placeholder="Reason (e.g. SVS Annual Conference, Medical Leave)"
                value={newLeaveReason}
                onChange={(e) => setNewLeaveReason(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-[#0B4036]/15 rounded-lg text-[#0B4036]"
              />
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] text-gray-500 mb-0.5">From</label>
                  <input
                    type="date"
                    required
                    value={newLeaveStart}
                    onChange={(e) => setNewLeaveStart(e.target.value)}
                    className="w-full px-2 py-1.5 bg-white border border-[#0B4036]/15 rounded-lg font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-500 mb-0.5">To</label>
                  <input
                    type="date"
                    required
                    value={newLeaveEnd}
                    onChange={(e) => setNewLeaveEnd(e.target.value)}
                    className="w-full px-2 py-1.5 bg-white border border-[#0B4036]/15 rounded-lg font-mono text-[11px]"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-[#0B4036] text-white font-semibold rounded-lg hover:bg-[#072B24] transition-colors"
              >
                + Register Leave Period
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
