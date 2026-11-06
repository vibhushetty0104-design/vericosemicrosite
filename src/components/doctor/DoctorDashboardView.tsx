import React from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  ArrowRight,
  Video,
  MapPin,
  FileCheck,
  ChevronRight,
  Plus,
  Stethoscope,
  Activity,
  CalendarCheck,
  ClipboardList,
  Sparkles,
} from 'lucide-react';
import { Doctor, ClinicalAppointment, PatientDocument, DoctorNotification } from '../../types/doctorPortal';

interface DoctorDashboardViewProps {
  doctor: Doctor;
  appointments: ClinicalAppointment[];
  documents: PatientDocument[];
  notifications: DoctorNotification[];
  onOpenScheduleModal: () => void;
  onSelectAppointment: (appointment: ClinicalAppointment) => void;
  onOpenPatientProfile: (patientId: string) => void;
  onOpenClinicalNoteDraft: (appointmentId: string, patientId: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const DoctorDashboardView: React.FC<DoctorDashboardViewProps> = ({
  doctor,
  appointments,
  documents,
  notifications,
  onOpenScheduleModal,
  onSelectAppointment,
  onOpenPatientProfile,
  onOpenClinicalNoteDraft,
  onNavigateTab,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  const todayAppointments = appointments.filter((a) => a.date === todayStr);
  const upcomingAppointments = appointments.filter((a) => a.date > todayStr && a.status === 'Confirmed');
  const completedConsultations = appointments.filter((a) => a.status === 'Completed');
  const pendingConfirmations = appointments.filter((a) => a.status === 'Pending');
  const pendingDocReviews = documents.filter((d) => d.reviewStatus === 'Pending Review');

  // Next upcoming confirmed appointment today
  const nextAppointment = todayAppointments
    .filter((a) => a.status === 'Confirmed')
    .sort((a, b) => a.startTime.localeCompare(b.startTime))[0];

  // Dynamic time greeting
  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const todayFormatted = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const getStatusBadge = (status: ClinicalAppointment['status']) => {
    switch (status) {
      case 'Confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#E4ECE6]/80 text-[#0B4036] border border-[#8DAA9D]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0B4036]" />
            Confirmed
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
            Pending Action
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#FAF8F5] text-[#2D5A4C] border border-[#0B4036]/15">
            <CheckCircle2 className="w-3 h-3 text-[#0B4036]" />
            Completed
          </span>
        );
      case 'Rescheduled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-purple-50 text-purple-800 border border-purple-200">
            <Activity className="w-3 h-3 text-purple-600" />
            Rescheduled
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle className="w-3 h-3 text-rose-600" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-gray-50 text-gray-700 border border-gray-200">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. DASHBOARD HERO: Refined greeting & prominent schedule action */}
      <section className="bg-white rounded-xl border border-[#0B4036]/10 p-5 sm:p-7 shadow-[0_1px_3px_rgba(11,64,54,0.03)] transition-all">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            {/* Subtle Date & Clinic Indicator */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#556B64]">
              <span className="inline-flex items-center gap-1.5 font-medium text-[#0B4036]">
                <Calendar className="w-3.5 h-3.5 text-[#8DAA9D]" />
                <span>{todayFormatted}</span>
              </span>
              <span className="text-[#8DAA9D]">·</span>
              <span className="inline-flex items-center gap-1 text-[#556B64]">
                <MapPin className="w-3.5 h-3.5 text-[#8DAA9D]" />
                <span>{doctor.consultationLocation}</span>
              </span>
            </div>

            {/* Doctor Greeting Focal Point */}
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B4036] tracking-tight">
              {getTimeGreeting()}, {doctor.name}
            </h1>

            {/* Supporting Information */}
            <p className="text-xs sm:text-sm text-[#4E675E] max-w-2xl font-normal leading-relaxed">
              Your clinical schedule and patient reviews for today. You have{' '}
              <strong className="text-[#0B4036] font-semibold">{todayAppointments.length} patients</strong> booked and{' '}
              <strong className="text-[#CE5B40] font-semibold">{pendingDocReviews.length} diagnostic reports</strong> awaiting triage.
            </p>
          </div>

          {/* Prominent Action Button */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onOpenScheduleModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0B4036] hover:bg-[#072B24] text-white text-xs font-semibold rounded-lg shadow-xs hover:shadow-sm transition-all duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0B4036]/20"
            >
              <Plus className="w-4 h-4 text-[#8DAA9D]" />
              <span>Schedule Appointment</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. SUMMARY METRICS: Cohesive Information System */}
      <section aria-label="Clinical Metrics Overview">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {/* Card 1: Today's OPD */}
          <div
            onClick={() => onNavigateTab('calendar')}
            className="bg-white p-4 rounded-xl border border-[#0B4036]/10 shadow-[0_1px_3px_rgba(11,64,54,0.02)] hover:border-[#0B4036]/30 hover:shadow-sm transition-all duration-150 cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#556B64]">Today's OPD</span>
              <div className="w-7 h-7 rounded-lg bg-[#E4ECE6]/80 text-[#0B4036] flex items-center justify-center group-hover:scale-105 transition-transform">
                <Calendar className="w-3.5 h-3.5" strokeWidth={2} />
              </div>
            </div>
            <div className="font-serif text-2xl sm:text-3xl font-bold text-[#0B4036] tracking-tight">
              {todayAppointments.length}
            </div>
            <span className="text-[11px] text-[#556B64] mt-1 block">Scheduled for today</span>
          </div>

          {/* Card 2: Upcoming Visits */}
          <div
            onClick={() => onNavigateTab('calendar')}
            className="bg-white p-4 rounded-xl border border-[#0B4036]/10 shadow-[0_1px_3px_rgba(11,64,54,0.02)] hover:border-[#0B4036]/30 hover:shadow-sm transition-all duration-150 cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#556B64]">Upcoming Visits</span>
              <div className="w-7 h-7 rounded-lg bg-[#E4ECE6]/80 text-[#0B4036] flex items-center justify-center group-hover:scale-105 transition-transform">
                <CalendarCheck className="w-3.5 h-3.5" strokeWidth={2} />
              </div>
            </div>
            <div className="font-serif text-2xl sm:text-3xl font-bold text-[#0B4036] tracking-tight">
              {upcomingAppointments.length}
            </div>
            <span className="text-[11px] text-[#556B64] mt-1 block">Confirmed future slots</span>
          </div>

          {/* Card 3: Completed Cases */}
          <div
            onClick={() => onNavigateTab('past-appointments')}
            className="bg-white p-4 rounded-xl border border-[#0B4036]/10 shadow-[0_1px_3px_rgba(11,64,54,0.02)] hover:border-[#0B4036]/30 hover:shadow-sm transition-all duration-150 cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#556B64]">Completed Cases</span>
              <div className="w-7 h-7 rounded-lg bg-[#FAF8F5] text-[#2D5A4C] flex items-center justify-center border border-[#0B4036]/10 group-hover:scale-105 transition-transform">
                <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2} />
              </div>
            </div>
            <div className="font-serif text-2xl sm:text-3xl font-bold text-[#2D5A4C] tracking-tight">
              {completedConsultations.length}
            </div>
            <span className="text-[11px] text-[#556B64] mt-1 block">Historical consultations</span>
          </div>

          {/* Card 4: Pending Triage */}
          <div
            onClick={() => onNavigateTab('calendar')}
            className="bg-white p-4 rounded-xl border border-[#0B4036]/10 shadow-[0_1px_3px_rgba(11,64,54,0.02)] hover:border-[#CE5B40]/40 hover:shadow-sm transition-all duration-150 cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#CE5B40]">Pending Triage</span>
              <div className="w-7 h-7 rounded-lg bg-[#CE5B40]/10 text-[#CE5B40] flex items-center justify-center group-hover:scale-105 transition-transform">
                <Clock className="w-3.5 h-3.5" strokeWidth={2} />
              </div>
            </div>
            <div className="font-serif text-2xl sm:text-3xl font-bold text-[#CE5B40] tracking-tight">
              {pendingConfirmations.length}
            </div>
            <span className="text-[11px] text-[#556B64] mt-1 block">Awaiting confirmation</span>
          </div>

          {/* Card 5: Document Reviews */}
          <div
            onClick={() => onNavigateTab('documents')}
            className="bg-white p-4 rounded-xl border border-[#0B4036]/10 shadow-[0_1px_3px_rgba(11,64,54,0.02)] hover:border-[#CE5B40]/40 hover:shadow-sm transition-all duration-150 cursor-pointer group col-span-2 sm:col-span-1"
          >
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#CE5B40]">Document Reviews</span>
              <div className="w-7 h-7 rounded-lg bg-[#CE5B40]/10 text-[#CE5B40] flex items-center justify-center group-hover:scale-105 transition-transform">
                <FileCheck className="w-3.5 h-3.5" strokeWidth={2} />
              </div>
            </div>
            <div className="font-serif text-2xl sm:text-3xl font-bold text-[#CE5B40] tracking-tight">
              {pendingDocReviews.length}
            </div>
            <span className="text-[11px] text-[#556B64] mt-1 block">Doppler & photo reviews</span>
          </div>
        </div>
      </section>

      {/* 3. NEXT PATIENT SECTION: Elegant consultation focus panel */}
      {nextAppointment && (
        <section
          aria-label="Next Scheduled Consultation"
          className="bg-gradient-to-r from-[#0B4036] via-[#0E493E] to-[#125347] rounded-xl p-5 sm:p-6 text-white shadow-sm border border-[#0B4036]/20 relative overflow-hidden"
        >
          {/* Subtle anatomical contour watermark */}
          <div className="absolute right-0 top-0 bottom-0 w-80 opacity-5 pointer-events-none hidden md:block">
            <svg viewBox="0 0 200 200" className="w-full h-full" fill="none" stroke="currentColor">
              <path d="M 50 10 C 80 60, 40 120, 90 190" strokeWidth="6" />
              <path d="M 90 60 C 130 90, 110 140, 160 180" strokeWidth="4" />
            </svg>
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-lg bg-white/10 flex items-center justify-center shrink-0 border border-white/15">
                <Stethoscope className="w-5 h-5 text-[#E4ECE6]" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 text-[#E4ECE6] px-2 py-0.5 rounded leading-none">
                    Next Patient · Consultation Focus
                  </span>
                  <span className="text-xs text-white/90 font-mono font-medium">
                    {nextAppointment.startTime} - {nextAppointment.endTime}
                  </span>
                  <span className="text-xs text-[#8DAA9D]">·</span>
                  <span className="text-xs text-white/80">
                    {nextAppointment.consultationMode}
                  </span>
                </div>

                <h3 className="font-serif text-lg sm:text-xl font-bold text-white tracking-tight">
                  {nextAppointment.patientName}
                  <span className="text-xs font-sans font-normal text-white/80 ml-2">
                    (Age {nextAppointment.patientAge}, {nextAppointment.patientGender} · ID: {nextAppointment.patientId})
                  </span>
                </h3>

                <p className="text-xs text-[#E4ECE6]/90 line-clamp-1 max-w-2xl">
                  <strong className="text-white font-medium">{nextAppointment.appointmentType}:</strong>{' '}
                  {nextAppointment.reasonForVisit}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 self-start md:self-center shrink-0">
              <button
                type="button"
                onClick={() => onOpenClinicalNoteDraft(nextAppointment.id, nextAppointment.patientId)}
                className="px-4 py-2 bg-white text-[#0B4036] hover:bg-[#FAF8F5] rounded-lg text-xs font-semibold shadow-xs transition-all duration-150 cursor-pointer"
              >
                Start Consultation / Note
              </button>
              <button
                type="button"
                onClick={() => onSelectAppointment(nextAppointment)}
                className="px-3.5 py-2 bg-white/15 hover:bg-white/25 text-white rounded-lg text-xs font-medium border border-white/20 transition-all duration-150 cursor-pointer"
              >
                View Patient Record
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 4. MAIN WORKSPACE GRID: Appointment Schedule (2/3) + Clinical Work Queue (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule Table & Mobile Cards */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#0B4036]/10 p-5 sm:p-6 shadow-[0_1px_3px_rgba(11,64,54,0.02)]">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
            <div>
              <h2 className="font-serif text-lg font-bold text-[#0B4036] tracking-tight">
                Today's Consultation Schedule
              </h2>
              <p className="text-xs text-[#556B64] mt-0.5">
                Scheduled consultations with real-time status and 1-click clinical notes.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('calendar')}
              className="text-xs font-semibold text-[#0B4036] hover:text-[#CE5B40] flex items-center gap-1 transition-colors"
            >
              <span>Full Calendar</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {todayAppointments.length === 0 ? (
            <div className="text-center py-12 text-[#556B64] text-xs">
              <Calendar className="w-8 h-8 text-[#8DAA9D] mx-auto mb-2 opacity-60" />
              <p className="font-semibold text-[#0B4036]">No consultations scheduled for today.</p>
              <p className="text-gray-400 mt-1">Use "Schedule Appointment" to book patient slots.</p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#0B4036]/10 text-[#556B64] font-semibold">
                      <th className="pb-3 pl-1 font-semibold">Time</th>
                      <th className="pb-3 font-semibold">Patient</th>
                      <th className="pb-3 font-semibold">Type</th>
                      <th className="pb-3 font-semibold">Mode</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 pr-1 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E4ECE6]/70">
                    {todayAppointments.map((appt) => (
                      <tr
                        key={appt.id}
                        onClick={() => onSelectAppointment(appt)}
                        className="hover:bg-[#FAF8F5]/80 transition-colors duration-100 group cursor-pointer"
                      >
                        <td className="py-3.5 pl-1 font-mono font-semibold text-[#0B4036] whitespace-nowrap">
                          {appt.startTime}
                        </td>
                        <td className="py-3.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenPatientProfile(appt.patientId);
                            }}
                            className="font-bold text-[#0B4036] hover:text-[#CE5B40] hover:underline text-left block leading-tight"
                          >
                            {appt.patientName}
                          </button>
                          <span className="text-[10px] text-gray-400 font-mono mt-0.5 block">{appt.patientId}</span>
                        </td>
                        <td className="py-3.5 text-[#334E44] max-w-[150px] truncate" title={appt.appointmentType}>
                          {appt.appointmentType}
                        </td>
                        <td className="py-3.5 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 text-[11px] text-[#556B64]">
                            {appt.consultationMode === 'Video Teleconsultation' ? (
                              <Video className="w-3.5 h-3.5 text-blue-600" />
                            ) : (
                              <MapPin className="w-3.5 h-3.5 text-[#0B4036]" />
                            )}
                            {appt.consultationMode === 'Video Teleconsultation' ? 'Teleconsult' : 'OPD Clinic'}
                          </span>
                        </td>
                        <td className="py-3.5 whitespace-nowrap">{getStatusBadge(appt.status)}</td>
                        <td className="py-3.5 pr-1 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              onClick={() => onOpenClinicalNoteDraft(appt.id, appt.patientId)}
                              className="px-2.5 py-1 text-[11px] font-semibold bg-[#E4ECE6] text-[#0B4036] hover:bg-[#0B4036] hover:text-white rounded-md transition-colors"
                              title="Open or draft clinical consultation note"
                            >
                              Note
                            </button>
                            <button
                              type="button"
                              onClick={() => onSelectAppointment(appt)}
                              className="px-2.5 py-1 text-[11px] font-semibold text-gray-600 hover:text-[#0B4036] hover:bg-gray-100 rounded-md transition-colors"
                            >
                              Details
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card List View (clean, readable touch targets) */}
              <div className="md:hidden space-y-3">
                {todayAppointments.map((appt) => (
                  <div
                    key={appt.id}
                    onClick={() => onSelectAppointment(appt)}
                    className="p-3.5 rounded-lg border border-[#0B4036]/10 bg-[#FAF8F5]/50 hover:bg-[#FAF8F5] transition-colors cursor-pointer space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#0B4036]">{appt.startTime}</span>
                        <span className="text-[10px] text-gray-400 font-mono">({appt.endTime})</span>
                      </div>
                      {getStatusBadge(appt.status)}
                    </div>

                    <div>
                      <h4 className="font-serif font-bold text-sm text-[#0B4036]">{appt.patientName}</h4>
                      <p className="text-[11px] text-[#556B64]">{appt.appointmentType} · {appt.consultationMode}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-100" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => onOpenPatientProfile(appt.patientId)}
                        className="text-[11px] font-semibold text-[#0B4036] hover:underline"
                      >
                        Patient EMR →
                      </button>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onOpenClinicalNoteDraft(appt.id, appt.patientId)}
                          className="px-2.5 py-1 text-[11px] font-semibold bg-[#E4ECE6] text-[#0B4036] hover:bg-[#0B4036] hover:text-white rounded-md transition-colors"
                        >
                          Write Note
                        </button>
                        <button
                          type="button"
                          onClick={() => onSelectAppointment(appt)}
                          className="px-2.5 py-1 text-[11px] font-semibold text-gray-600 bg-white border border-gray-200 rounded-md"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Clinical Work Queue & Recent Alerts (1 Col) */}
        <div className="space-y-6">
          {/* Pending Tasks Queue */}
          <div className="bg-white rounded-xl border border-[#0B4036]/10 p-5 sm:p-6 shadow-[0_1px_3px_rgba(11,64,54,0.02)]">
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="font-serif text-base font-bold text-[#0B4036] flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-[#8DAA9D]" />
                <span>Clinical Work Queue</span>
              </h3>
              <span className="text-[10px] bg-[#CE5B40]/10 text-[#CE5B40] px-2 py-0.5 rounded-full font-bold">
                {pendingDocReviews.length + pendingConfirmations.length} items
              </span>
            </div>

            <div className="space-y-2.5">
              {/* Document reviews */}
              {pendingDocReviews.slice(0, 3).map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => onNavigateTab('documents')}
                  className="p-3 rounded-lg border border-gray-100 bg-[#FAF8F5] hover:border-[#8DAA9D] transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-xs font-semibold text-[#0B4036] mb-1">
                    <span className="truncate max-w-[180px]">{doc.category}</span>
                    <span className="text-[10px] text-[#CE5B40] uppercase font-bold tracking-wider">
                      Review Needed
                    </span>
                  </div>
                  <p className="text-[11px] text-[#556B64] truncate">{doc.fileName}</p>
                  <span className="text-[10px] text-gray-400 mt-1 block font-mono">Patient: {doc.patientName}</span>
                </div>
              ))}

              {/* Pending booking confirmations */}
              {pendingConfirmations.slice(0, 2).map((pAppt) => (
                <div
                  key={pAppt.id}
                  onClick={() => onSelectAppointment(pAppt)}
                  className="p-3 rounded-lg border border-amber-200/80 bg-amber-50/40 hover:border-amber-300 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between text-xs font-semibold text-amber-900 mb-1">
                    <span>Awaiting Booking Approval</span>
                    <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-bold">
                      Triage
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-900/80 font-medium">
                    {pAppt.patientName} — {pAppt.appointmentType}
                  </p>
                </div>
              ))}

              {pendingDocReviews.length === 0 && pendingConfirmations.length === 0 && (
                <div className="text-center py-6 text-xs text-[#556B64]">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto mb-1 opacity-80" />
                  All clinical triage tasks are up to date!
                </div>
              )}
            </div>
          </div>

          {/* Recent Patient Activity / Alerts */}
          <div className="bg-white rounded-xl border border-[#0B4036]/10 p-5 sm:p-6 shadow-[0_1px_3px_rgba(11,64,54,0.02)]">
            <h3 className="font-serif text-base font-bold text-[#0B4036] mb-3 flex items-center justify-between">
              <span>Recent Patient Alerts</span>
              <button
                type="button"
                onClick={() => onNavigateTab('notifications')}
                className="text-[11px] text-[#556B64] hover:text-[#0B4036] font-medium"
              >
                View all
              </button>
            </h3>

            <div className="space-y-3">
              {notifications.slice(0, 4).map((n) => (
                <div
                  key={n.id}
                  className="flex items-start gap-2.5 text-xs pb-2.5 border-b border-gray-100 last:border-none last:pb-0"
                >
                  <span className="w-2 h-2 rounded-full bg-[#0B4036] mt-1.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#0B4036] truncate">{n.title}</p>
                    <p className="text-[11px] text-[#556B64] line-clamp-1">{n.message}</p>
                    <span className="text-[10px] text-gray-400 font-mono">
                      {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
