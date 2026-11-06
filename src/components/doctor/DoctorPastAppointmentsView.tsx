import React, { useState } from 'react';
import {
  History,
  Search,
  Filter,
  Calendar,
  Clock,
  User,
  FileText,
  CheckCircle2,
  AlertCircle,
  FileEdit,
  FolderOpen,
  ArrowRight,
  Eye,
} from 'lucide-react';
import { Doctor, PatientRecord, ClinicalAppointment } from '../../types/doctorPortal';

interface DoctorPastAppointmentsViewProps {
  doctor: Doctor;
  patients: PatientRecord[];
  appointments: ClinicalAppointment[];
  onSelectAppointment: (appointment: ClinicalAppointment) => void;
  onOpenPatientProfile: (patientId: string) => void;
}

export const DoctorPastAppointmentsView: React.FC<DoctorPastAppointmentsViewProps> = ({
  doctor,
  patients,
  appointments,
  onSelectAppointment,
  onOpenPatientProfile,
}) => {
  const [selectedPatientId, setSelectedPatientId] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Past or completed/cancelled appointments
  const pastAppointments = appointments.filter((a) => {
    // Exclude future confirmed visits
    const todayStr = new Date().toISOString().split('T')[0];
    const isPastDate = a.date < todayStr;
    const isCompletedOrResolved =
      a.status === 'Completed' ||
      a.status === 'Cancelled' ||
      a.status === 'No-show' ||
      a.status === 'Rescheduled';

    if (!isPastDate && !isCompletedOrResolved) return false;

    if (selectedPatientId !== 'all' && a.patientId !== selectedPatientId) return false;
    if (selectedStatus !== 'all' && a.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const match =
        a.patientName.toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q) ||
        a.reasonForVisit.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 sm:p-6 rounded-xl border border-[#0B4036]/10 shadow-[0_1px_3px_rgba(11,64,54,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#CE5B40]">
            Clinical Archive
          </span>
          <h1 className="font-serif text-2xl font-bold text-[#0B4036] tracking-tight">Consultation History & Past Visits</h1>
          <p className="text-xs text-[#556B64] mt-0.5">
            Audit-logged record of completed procedures, consultations, cancelled sessions, and follow-up timelines.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          <div className="relative min-w-[200px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by patient or ID..."
              className="w-full pl-8 pr-3 py-2 bg-[#FAF8F5] border border-[#0B4036]/15 rounded-lg text-[#0B4036] focus:outline-none focus:ring-2 focus:ring-[#0B4036]/20"
            />
            <Search className="w-3.5 h-3.5 text-[#8DAA9D] absolute left-2.5 top-2.5" />
          </div>

          <select
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(e.target.value)}
            className="px-2.5 py-2 bg-[#FAF8F5] border border-[#0B4036]/15 rounded-lg text-[#0B4036] focus:outline-none focus:ring-2 focus:ring-[#0B4036]/20"
          >
            <option value="all">All Patients</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-2.5 py-2 bg-[#FAF8F5] border border-[#0B4036]/15 rounded-lg text-[#0B4036] focus:outline-none focus:ring-2 focus:ring-[#0B4036]/20"
          >
            <option value="all">All Statuses</option>
            <option value="Completed">Completed</option>
            <option value="Rescheduled">Rescheduled</option>
            <option value="Cancelled">Cancelled</option>
            <option value="No-show">No-show</option>
          </select>
        </div>
      </div>

      {/* Past Appointments List */}
      <div className="bg-white rounded-xl border border-[#0B4036]/10 shadow-[0_1px_3px_rgba(11,64,54,0.02)] overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] border-b border-[#0B4036]/10 text-[#0B4036]">
              <tr>
                <th className="py-3 px-4 font-semibold">Date & Time</th>
                <th className="py-3 px-4 font-semibold">Patient</th>
                <th className="py-3 px-4 font-semibold">Consultation Type</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Linked Clinical Note</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4ECE6]/70">
              {pastAppointments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-[#556B64]">
                    No past consultation records match your filter criteria.
                  </td>
                </tr>
              ) : (
                pastAppointments.map((appt) => (
                  <tr
                    key={appt.id}
                    onClick={() => onSelectAppointment(appt)}
                    className="hover:bg-[#FAF8F5]/80 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-semibold text-[#0B4036] block">{appt.date}</span>
                      <span className="font-mono text-[11px] text-[#556B64]">
                        {appt.startTime} - {appt.endTime}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenPatientProfile(appt.patientId);
                        }}
                        className="font-bold text-[#0B4036] hover:text-[#CE5B40] hover:underline text-left block"
                      >
                        {appt.patientName}
                      </button>
                      <span className="text-[10px] text-gray-400 font-mono">{appt.patientId}</span>
                    </td>

                    <td className="py-3.5 px-4 text-[#334E44] max-w-xs truncate" title={appt.appointmentType}>
                      {appt.appointmentType}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          appt.status === 'Completed'
                            ? 'bg-[#FAF8F5] text-[#2D5A4C] border-[#0B4036]/15'
                            : appt.status === 'Rescheduled'
                            ? 'bg-purple-50 text-purple-800 border-purple-200'
                            : appt.status === 'Cancelled'
                            ? 'bg-rose-50 text-rose-800 border-rose-200'
                            : 'bg-gray-100 text-gray-700 border-gray-200'
                        }`}
                      >
                        {appt.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {appt.linkedClinicalNoteId ? (
                        <span className="font-mono text-[10px] font-semibold text-[#0B4036] bg-[#E4ECE6] px-2 py-0.5 rounded">
                          {appt.linkedClinicalNoteId}
                        </span>
                      ) : (
                        <span className="text-[11px] text-gray-400">—</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => onSelectAppointment(appt)}
                        className="px-3 py-1.5 text-xs font-semibold text-[#0B4036] bg-[#FAF8F5] hover:bg-[#E4ECE6] border border-[#0B4036]/15 rounded-lg transition-colors"
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

        {/* Mobile Card List View */}
        <div className="md:hidden divide-y divide-[#E4ECE6]/70">
          {pastAppointments.length === 0 ? (
            <div className="text-center py-12 text-[#556B64] text-xs">
              No past consultations found.
            </div>
          ) : (
            pastAppointments.map((appt) => (
              <div
                key={appt.id}
                onClick={() => onSelectAppointment(appt)}
                className="p-4 space-y-2 hover:bg-[#FAF8F5] transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#0B4036]">{appt.date} · {appt.startTime}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FAF8F5] border border-[#0B4036]/10 text-[#0B4036]">
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
    </div>
  );
};
