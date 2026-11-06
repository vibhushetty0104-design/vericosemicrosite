import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Plus,
  Filter,
  User,
  MapPin,
  Video,
  CheckCircle2,
  AlertCircle,
  Activity,
  List,
  Grid,
} from 'lucide-react';
import { Doctor, ClinicalAppointment, AppointmentStatus } from '../../types/doctorPortal';

interface DoctorCalendarViewProps {
  doctor: Doctor;
  appointments: ClinicalAppointment[];
  onOpenScheduleModal: (initialDate?: string) => void;
  onSelectAppointment: (appointment: ClinicalAppointment) => void;
}

type CalendarMode = 'day' | 'week' | 'month' | 'list';

export const DoctorCalendarView: React.FC<DoctorCalendarViewProps> = ({
  doctor,
  appointments,
  onOpenScheduleModal,
  onSelectAppointment,
}) => {
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [viewMode, setViewMode] = useState<CalendarMode>('week');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const selectedDateStr = selectedDate.toISOString().split('T')[0];

  // Helper date navigators
  const handlePrev = () => {
    const d = new Date(selectedDate);
    if (viewMode === 'day') d.setDate(d.getDate() - 1);
    else if (viewMode === 'week') d.setDate(d.getDate() - 7);
    else d.setMonth(d.getMonth() - 1);
    setSelectedDate(d);
  };

  const handleNext = () => {
    const d = new Date(selectedDate);
    if (viewMode === 'day') d.setDate(d.getDate() + 1);
    else if (viewMode === 'week') d.setDate(d.getDate() + 7);
    else d.setMonth(d.getMonth() + 1);
    setSelectedDate(d);
  };

  const handleToday = () => {
    setSelectedDate(new Date());
  };

  // Filter appointments
  const filteredAppointments = appointments.filter((a) => {
    if (statusFilter !== 'all' && a.status !== statusFilter) return false;
    return true;
  });

  // Calculate week days for 'week' view
  const getWeekDates = (current: Date): Date[] => {
    const day = current.getDay(); // 0 is Sunday
    const sunday = new Date(current);
    sunday.setDate(current.getDate() - day);
    const week: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(sunday);
      d.setDate(sunday.getDate() + i);
      week.push(d);
    }
    return week;
  };

  const weekDates = getWeekDates(selectedDate);

  // Month days for 'month' view
  const getMonthDays = (current: Date): (Date | null)[] => {
    const year = current.getFullYear();
    const month = current.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    const days: (Date | null)[] = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let d = 1; d <= totalDays; d++) {
      days.push(new Date(year, month, d));
    }
    return days;
  };

  const monthDays = getMonthDays(selectedDate);

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-[#E4ECE6]/80 text-[#0B4036] border-[#8DAA9D]/30';
      case 'Pending':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Completed':
        return 'bg-[#FAF8F5] text-[#2D5A4C] border-[#0B4036]/15';
      case 'Rescheduled':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'Cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200 opacity-70';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Calendar Control Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-[#0B4036]/10 shadow-[0_1px_3px_rgba(11,64,54,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Title & Navigator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleToday}
              className="px-3 py-1.5 text-xs font-semibold text-[#0B4036] bg-[#FAF8F5] border border-[#0B4036]/10 rounded-lg hover:bg-[#E4ECE6] transition-colors"
            >
              Today
            </button>
            <button
              type="button"
              onClick={handlePrev}
              className="p-1.5 text-gray-500 hover:text-[#0B4036] hover:bg-[#FAF8F5] rounded-lg transition-colors"
              title="Previous period"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="p-1.5 text-gray-500 hover:text-[#0B4036] hover:bg-[#FAF8F5] rounded-lg transition-colors"
              title="Next period"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <h2 className="font-serif text-lg sm:text-xl font-bold text-[#0B4036] tracking-tight">
            {selectedDate.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
          </h2>
          <span className="text-[11px] text-[#556B64] font-mono hidden sm:inline-block">({doctor.timezone})</span>
        </div>

        {/* Right: View Selector, Filter & New Appointment */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs px-2.5 py-1.5 bg-[#FAF8F5] border border-[#0B4036]/10 rounded-lg text-[#0B4036] focus:outline-none focus:ring-1 focus:ring-[#0B4036]"
          >
            <option value="all">All Statuses</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Pending">Pending Triage</option>
            <option value="Completed">Completed</option>
            <option value="Rescheduled">Rescheduled</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          {/* Segmented View Mode Switcher */}
          <div className="flex items-center bg-[#FAF8F5] p-1 border border-[#0B4036]/10 rounded-lg text-xs">
            {(['day', 'week', 'month', 'list'] as CalendarMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setViewMode(mode)}
                className={`px-2.5 py-1 rounded-md font-semibold capitalize transition-all duration-150 ${
                  viewMode === mode
                    ? 'bg-[#0B4036] text-white shadow-2xs'
                    : 'text-[#556B64] hover:text-[#0B4036]'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => onOpenScheduleModal(selectedDateStr)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0B4036] hover:bg-[#072B24] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-[#8DAA9D]" />
            <span>New Appointment</span>
          </button>
        </div>
      </div>

      {/* VIEW: WEEK */}
      {viewMode === 'week' && (
        <div className="bg-white rounded-xl border border-[#0B4036]/10 shadow-[0_1px_3px_rgba(11,64,54,0.02)] overflow-hidden">
          {/* Header Row */}
          <div className="grid grid-cols-7 border-b border-[#0B4036]/10 bg-[#FAF8F5] text-center text-xs py-3 font-semibold text-[#0B4036]">
            {weekDates.map((date, idx) => {
              const isToday = date.toDateString() === new Date().toDateString();
              return (
                <div key={idx} className={isToday ? 'text-[#0B4036]' : ''}>
                  <span className="block text-[10px] uppercase font-bold tracking-wider text-[#8DAA9D]">
                    {date.toLocaleDateString('en-GB', { weekday: 'short' })}
                  </span>
                  <span
                    className={`inline-block mt-0.5 text-sm sm:text-base font-bold ${
                      isToday
                        ? 'w-7 h-7 leading-7 rounded-full bg-[#0B4036] text-white mx-auto shadow-2xs'
                        : 'text-[#2D453C]'
                    }`}
                  >
                    {date.getDate()}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Grid Columns */}
          <div className="grid grid-cols-7 divide-x divide-gray-100 min-h-[500px]">
            {weekDates.map((date, colIdx) => {
              const dateStr = date.toISOString().split('T')[0];
              const dayAppts = filteredAppointments.filter((a) => a.date === dateStr);
              return (
                <div key={colIdx} className="p-2 space-y-2 relative group hover:bg-[#FAF8F5]/40 transition-colors">
                  {dayAppts.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-[10px] text-gray-300 select-none py-12">
                      No slots
                    </div>
                  ) : (
                    dayAppts.map((appt) => (
                      <div
                        key={appt.id}
                        onClick={() => onSelectAppointment(appt)}
                        className={`p-2.5 rounded-lg border text-xs cursor-pointer shadow-2xs hover:shadow-xs transition-all ${getStatusColor(
                          appt.status
                        )}`}
                      >
                        <div className="flex items-center justify-between font-mono text-[10px] mb-1 font-bold">
                          <span>{appt.startTime}</span>
                          <span className="truncate max-w-[60px] uppercase text-[9px]">{appt.status}</span>
                        </div>
                        <h4 className="font-bold text-[#0B4036] truncate leading-tight">{appt.patientName}</h4>
                        <p className="text-[10px] text-[#556B64] truncate mt-0.5">{appt.appointmentType}</p>
                        <div className="flex items-center gap-1 mt-1 text-[9px] text-[#556B64]">
                          {appt.consultationMode === 'Video Teleconsultation' ? (
                            <Video className="w-2.5 h-2.5 text-blue-600" />
                          ) : (
                            <MapPin className="w-2.5 h-2.5 text-[#0B4036]" />
                          )}
                          <span className="truncate">{appt.consultationMode === 'Video Teleconsultation' ? 'Teleconsult' : 'OPD'}</span>
                        </div>
                      </div>
                    ))
                  )}

                  {/* Add Slot Quick Button on Hover */}
                  <button
                    type="button"
                    onClick={() => onOpenScheduleModal(dateStr)}
                    className="w-full py-1 text-[10px] font-semibold text-[#8DAA9D] hover:text-[#0B4036] hover:bg-[#E4ECE6] rounded border border-dashed border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    + Book {date.toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW: DAY */}
      {viewMode === 'day' && (
        <div className="bg-white rounded-xl border border-[#0B4036]/10 p-5 sm:p-6 shadow-[0_1px_3px_rgba(11,64,54,0.02)]">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#CE5B40]">
                Single Day Clinical Roster
              </span>
              <h3 className="font-serif text-xl font-bold text-[#0B4036]">
                {selectedDate.toLocaleDateString('en-GB', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </h3>
            </div>
            <span className="text-xs font-semibold text-[#556B64]">
              Total Bookings: {filteredAppointments.filter((a) => a.date === selectedDateStr).length}
            </span>
          </div>

          <div className="space-y-3">
            {filteredAppointments.filter((a) => a.date === selectedDateStr).length === 0 ? (
              <div className="text-center py-16 text-[#556B64] text-xs">
                <CalendarIcon className="w-8 h-8 mx-auto mb-2 text-[#8DAA9D] opacity-60" />
                <p className="font-semibold text-[#0B4036]">No appointments scheduled for this date.</p>
                <button
                  type="button"
                  onClick={() => onOpenScheduleModal(selectedDateStr)}
                  className="mt-3 px-3.5 py-2 bg-[#0B4036] text-white rounded-lg text-xs font-semibold"
                >
                  Schedule Appointment
                </button>
              </div>
            ) : (
              filteredAppointments
                .filter((a) => a.date === selectedDateStr)
                .map((appt) => (
                  <div
                    key={appt.id}
                    onClick={() => onSelectAppointment(appt)}
                    className="p-4 rounded-xl border border-[#0B4036]/10 hover:border-[#0B4036]/30 bg-[#FAF8F5]/60 hover:bg-[#FAF8F5] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-white border border-[#0B4036]/10 text-center shrink-0">
                        <span className="font-mono text-sm font-bold text-[#0B4036] block">{appt.startTime}</span>
                        <span className="text-[10px] text-gray-400 font-mono">{appt.endTime}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif font-bold text-[#0B4036] text-sm">{appt.patientName}</h4>
                          <span className="text-[10px] text-gray-400 font-mono">ID: {appt.patientId}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusColor(appt.status)}`}>
                            {appt.status}
                          </span>
                        </div>
                        <p className="text-xs text-[#334E44] mt-0.5">{appt.appointmentType}</p>
                        <p className="text-[11px] text-[#556B64] mt-1 line-clamp-1 italic">
                          "{appt.reasonForVisit}"
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-[#556B64] flex items-center gap-1.5">
                        {appt.consultationMode === 'Video Teleconsultation' ? (
                          <Video className="w-3.5 h-3.5 text-blue-600" />
                        ) : (
                          <MapPin className="w-3.5 h-3.5 text-[#0B4036]" />
                        )}
                        {appt.consultationMode}
                      </span>
                      <button
                        type="button"
                        className="px-3 py-1.5 bg-white border border-[#0B4036]/15 text-[#0B4036] rounded-lg font-semibold hover:bg-[#E4ECE6] transition-colors"
                      >
                        Details →
                      </button>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      )}

      {/* VIEW: MONTH */}
      {viewMode === 'month' && (
        <div className="bg-white rounded-xl border border-[#0B4036]/10 shadow-[0_1px_3px_rgba(11,64,54,0.02)] overflow-hidden">
          <div className="grid grid-cols-7 border-b border-[#0B4036]/10 bg-[#FAF8F5] text-center text-xs py-2.5 font-semibold text-[#0B4036]">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d} className="py-1 text-[11px] font-bold uppercase tracking-wider text-[#8DAA9D]">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 divide-x divide-y divide-gray-100">
            {monthDays.map((d, idx) => {
              if (!d) {
                return <div key={idx} className="h-28 bg-[#FAF8F5]/30" />;
              }
              const dStr = d.toISOString().split('T')[0];
              const dayAppts = filteredAppointments.filter((a) => a.date === dStr);
              const isToday = d.toDateString() === new Date().toDateString();

              return (
                <div
                  key={idx}
                  onClick={() => {
                    setSelectedDate(d);
                    setViewMode('day');
                  }}
                  className={`h-28 p-2 flex flex-col justify-between hover:bg-[#FAF8F5] transition-colors cursor-pointer ${
                    isToday ? 'bg-[#E4ECE6]/30' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold ${
                        isToday
                          ? 'w-6 h-6 leading-6 rounded-full bg-[#0B4036] text-white text-center'
                          : 'text-[#2D453C]'
                      }`}
                    >
                      {d.getDate()}
                    </span>
                    {dayAppts.length > 0 && (
                      <span className="text-[10px] font-bold text-[#0B4036] bg-[#E4ECE6] px-1.5 rounded-full">
                        {dayAppts.length}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 overflow-hidden">
                    {dayAppts.slice(0, 2).map((a) => (
                      <div
                        key={a.id}
                        className="text-[10px] truncate bg-white border border-[#0B4036]/10 px-1.5 py-0.5 rounded text-[#0B4036] font-medium"
                      >
                        {a.startTime} {a.patientName.split(' ')[0]}
                      </div>
                    ))}
                    {dayAppts.length > 2 && (
                      <div className="text-[9px] text-[#556B64] font-semibold">
                        +{dayAppts.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW: LIST */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-xl border border-[#0B4036]/10 shadow-[0_1px_3px_rgba(11,64,54,0.02)] overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] border-b border-[#0B4036]/10 text-[#0B4036]">
                <tr>
                  <th className="py-3 px-4 font-semibold">Date & Time</th>
                  <th className="py-3 px-4 font-semibold">Patient</th>
                  <th className="py-3 px-4 font-semibold">Type</th>
                  <th className="py-3 px-4 font-semibold">Consultation Mode</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-[#556B64]">
                      No matching appointments found.
                    </td>
                  </tr>
                ) : (
                  filteredAppointments.map((appt) => (
                    <tr
                      key={appt.id}
                      onClick={() => onSelectAppointment(appt)}
                      className="hover:bg-[#FAF8F5]/80 transition-colors cursor-pointer"
                    >
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-semibold text-[#0B4036] block">{appt.date}</span>
                        <span className="font-mono text-[#556B64] text-[11px]">
                          {appt.startTime} - {appt.endTime}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-[#0B4036] block">{appt.patientName}</span>
                        <span className="text-[10px] text-gray-400 font-mono">{appt.patientId}</span>
                      </td>
                      <td className="py-3 px-4 text-[#334E44]">{appt.appointmentType}</td>
                      <td className="py-3 px-4 text-[#556B64] whitespace-nowrap">{appt.consultationMode}</td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusColor(appt.status)}`}>
                          {appt.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectAppointment(appt);
                          }}
                          className="px-3 py-1.5 text-xs font-semibold text-[#0B4036] bg-[#FAF8F5] border border-[#0B4036]/15 rounded-lg hover:bg-[#E4ECE6] transition-colors"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List */}
          <div className="md:hidden divide-y divide-gray-100">
            {filteredAppointments.length === 0 ? (
              <div className="text-center py-12 text-[#556B64] text-xs">
                No matching appointments found.
              </div>
            ) : (
              filteredAppointments.map((appt) => (
                <div
                  key={appt.id}
                  onClick={() => onSelectAppointment(appt)}
                  className="p-4 space-y-2 hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#0B4036]">{appt.date} · {appt.startTime}</span>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusColor(appt.status)}`}>
                      {appt.status}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-sm text-[#0B4036]">{appt.patientName}</h4>
                    <p className="text-[11px] text-[#556B64]">{appt.appointmentType} · {appt.consultationMode}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
