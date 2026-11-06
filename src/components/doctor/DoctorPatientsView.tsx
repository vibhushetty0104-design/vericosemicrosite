import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  User,
  Calendar,
  Phone,
  MapPin,
  ChevronRight,
  ShieldCheck,
  Plus,
  ExternalLink,
} from 'lucide-react';
import { Doctor, PatientRecord } from '../../types/doctorPortal';

interface DoctorPatientsViewProps {
  doctor: Doctor;
  patients: PatientRecord[];
  onOpenPatientProfile: (patientId: string) => void;
  onOpenScheduleModal: (patientId: string) => void;
}

export const DoctorPatientsView: React.FC<DoctorPatientsViewProps> = ({
  doctor,
  patients,
  onOpenPatientProfile,
  onOpenScheduleModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [ceapFilter, setCeapFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredPatients = patients.filter((p) => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matches =
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.phone.includes(q) ||
        p.primaryDiagnosis.toLowerCase().includes(q);
      if (!matches) return false;
    }

    // CEAP filter
    if (ceapFilter !== 'all') {
      if (!p.ceapClassification.toLowerCase().includes(ceapFilter.toLowerCase())) return false;
    }

    // Status filter
    if (statusFilter !== 'all') {
      if (p.reviewStatus !== statusFilter) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header and Search Bar */}
      <div className="bg-white p-5 sm:p-6 rounded-xl border border-[#0B4036]/10 shadow-[0_1px_3px_rgba(11,64,54,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#CE5B40]">
            Clinical Directory
          </span>
          <h1 className="font-serif text-2xl font-bold text-[#0B4036] tracking-tight">Patient Registry</h1>
          <p className="text-xs text-[#556B64] mt-0.5">
            Electronic health profiles, CEAP classifications, and venous diagnostic records.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative min-w-[220px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, ID, phone..."
              className="w-full pl-8 pr-3 py-2 text-xs bg-[#FAF8F5] border border-[#0B4036]/15 rounded-lg text-[#0B4036] focus:outline-none focus:ring-2 focus:ring-[#0B4036]/20 transition-all"
            />
            <Search className="w-3.5 h-3.5 text-[#8DAA9D] absolute left-2.5 top-2.5" />
          </div>

          <select
            value={ceapFilter}
            onChange={(e) => setCeapFilter(e.target.value)}
            className="text-xs px-2.5 py-2 bg-[#FAF8F5] border border-[#0B4036]/15 rounded-lg text-[#0B4036] focus:outline-none focus:ring-2 focus:ring-[#0B4036]/20"
          >
            <option value="all">All CEAP Stages</option>
            <option value="C1">C1 (Spider & Reticular)</option>
            <option value="C2">C2 (Varicose Veins)</option>
            <option value="C3">C3 (Edema)</option>
            <option value="C4">C4 (Skin Changes / Stasis)</option>
            <option value="C5">C5 (Healed Ulcer)</option>
            <option value="C6">C6 (Active Venous Ulcer)</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs px-2.5 py-2 bg-[#FAF8F5] border border-[#0B4036]/15 rounded-lg text-[#0B4036] focus:outline-none focus:ring-2 focus:ring-[#0B4036]/20"
          >
            <option value="all">All Care Statuses</option>
            <option value="Under Active Care">Under Active Care</option>
            <option value="Triage Pending">Triage Pending</option>
            <option value="Review Completed">Review Completed</option>
          </select>
        </div>
      </div>

      {/* Patient List Container */}
      <div className="bg-white rounded-xl border border-[#0B4036]/10 shadow-[0_1px_3px_rgba(11,64,54,0.02)] overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] border-b border-[#0B4036]/10 text-[#0B4036]">
              <tr>
                <th className="py-3 px-4 font-semibold">Patient Name & ID</th>
                <th className="py-3 px-4 font-semibold">Demographics</th>
                <th className="py-3 px-4 font-semibold">CEAP & Diagnosis</th>
                <th className="py-3 px-4 font-semibold">Care Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4ECE6]/70">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-[#556B64]">
                    No matching patient records found in clinical directory.
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => (
                  <tr
                    key={patient.id}
                    onClick={() => onOpenPatientProfile(patient.id)}
                    className="hover:bg-[#FAF8F5]/80 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenPatientProfile(patient.id);
                        }}
                        className="font-bold text-[#0B4036] hover:text-[#CE5B40] hover:underline text-left block text-sm leading-tight"
                      >
                        {patient.name}
                      </button>
                      <span className="font-mono text-[10px] text-gray-400 block mt-0.5">{patient.id}</span>
                    </td>

                    <td className="py-3.5 px-4 text-[#556B64] whitespace-nowrap">
                      <div>Age {patient.age} · {patient.gender}</div>
                      <div className="text-[11px] text-gray-400 font-mono">{patient.phone}</div>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <span className="font-mono text-[10px] font-bold text-[#0B4036] bg-[#E4ECE6] px-2 py-0.5 rounded inline-block mb-1">
                        {patient.ceapClassification.split(' ')[0]}
                      </span>
                      <p className="text-[#334E44] truncate" title={patient.primaryDiagnosis}>
                        {patient.primaryDiagnosis}
                      </p>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-[#E4ECE6]/80 text-[#0B4036] border border-[#8DAA9D]/30">
                        {patient.reviewStatus}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onOpenScheduleModal(patient.id)}
                          className="px-2.5 py-1.5 text-xs font-semibold bg-[#FAF8F5] hover:bg-[#E4ECE6] text-[#0B4036] border border-[#0B4036]/15 rounded-lg transition-colors"
                        >
                          Book Visit
                        </button>
                        <button
                          type="button"
                          onClick={() => onOpenPatientProfile(patient.id)}
                          className="px-3 py-1.5 text-xs font-semibold bg-[#0B4036] hover:bg-[#072B24] text-white rounded-lg transition-colors shadow-2xs"
                        >
                          View Record →
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Patient Cards (Requirement 9: "Patient cards instead of cramped tables on mobile") */}
        <div className="sm:hidden divide-y divide-[#E4ECE6]/70">
          {filteredPatients.length === 0 ? (
            <div className="text-center py-12 text-[#556B64] text-xs">
              No matching patient records found.
            </div>
          ) : (
            filteredPatients.map((patient) => (
              <div
                key={patient.id}
                onClick={() => onOpenPatientProfile(patient.id)}
                className="p-4 space-y-2.5 hover:bg-[#FAF8F5] transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#0B4036] leading-tight">
                      {patient.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-[#556B64] mt-0.5">
                      <span className="font-mono text-[10px] text-gray-400">{patient.id}</span>
                      <span>·</span>
                      <span>Age {patient.age} ({patient.gender})</span>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] font-bold text-[#0B4036] bg-[#E4ECE6] px-2 py-0.5 rounded">
                    {patient.ceapClassification.split(' ')[0]}
                  </span>
                </div>

                <p className="text-xs text-[#334E44] line-clamp-2">
                  <span className="font-medium text-[#0B4036]">Diagnosis:</span> {patient.primaryDiagnosis}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100" onClick={(e) => e.stopPropagation()}>
                  <span className="text-[10px] font-medium text-[#556B64] bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#0B4036]/10">
                    {patient.reviewStatus}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onOpenScheduleModal(patient.id)}
                      className="px-2.5 py-1 text-xs font-semibold bg-[#FAF8F5] text-[#0B4036] border border-[#0B4036]/15 rounded-lg"
                    >
                      Book Visit
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpenPatientProfile(patient.id)}
                      className="px-3 py-1 text-xs font-semibold bg-[#0B4036] text-white rounded-lg shadow-2xs"
                    >
                      EMR →
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
