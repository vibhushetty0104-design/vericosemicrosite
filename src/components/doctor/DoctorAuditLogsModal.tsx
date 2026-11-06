import React, { useState } from 'react';
import { X, ShieldCheck, Search, Filter, Calendar, User, Clock, FileText } from 'lucide-react';
import { Doctor, AuditLogEntry } from '../../types/doctorPortal';
import { doctorPortalService } from '../../services/doctorPortalService';

interface DoctorAuditLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: Doctor;
}

export const DoctorAuditLogsModal: React.FC<DoctorAuditLogsModalProps> = ({ isOpen, onClose, doctor }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  if (!isOpen) return null;

  const allLogs = doctorPortalService.getAuditLogs(doctor.id);
  const logs = allLogs.filter((log) => {
    if (actionFilter !== 'all' && log.action !== actionFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        log.doctorName.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q) ||
        log.entityId.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto" role="dialog" aria-modal="true">
      <div className="bg-white rounded-xl max-w-3xl w-full p-5 sm:p-7 border border-[#0B4036]/10 shadow-2xl my-8 animate-in fade-in-50 zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3.5 border-b border-[#0B4036]/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#0B4036] text-white flex items-center justify-center shadow-2xs">
              <ShieldCheck className="w-5 h-5 text-[#E4ECE6]" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#CE5B40]">
                Hospital Governance
              </span>
              <h3 className="font-serif text-xl font-bold text-[#0B4036]">Clinical Audit Trail</h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-[#556B64] mt-3">
          Tamper-evident, immutable activity ledger recording consultations, patient record views, document reviews, and clinical note digital signatures.
        </p>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 my-4 text-xs">
          <div className="relative flex-1 min-w-[200px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search audit trail by actor, entity ID, or description..."
              className="w-full pl-8 pr-3 py-2 bg-[#FAF8F5] border border-[#0B4036]/15 rounded-lg text-[#0B4036] focus:outline-none focus:ring-2 focus:ring-[#0B4036]/20"
            />
            <Search className="w-3.5 h-3.5 text-[#8DAA9D] absolute left-2.5 top-2.5" />
          </div>

          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-3 py-2 bg-[#FAF8F5] border border-[#0B4036]/15 rounded-lg text-[#0B4036] focus:outline-none focus:ring-2 focus:ring-[#0B4036]/20"
          >
            <option value="all">All Actions</option>
            <option value="LOGIN">LOGIN</option>
            <option value="VIEW_PATIENT_RECORD">VIEW PATIENT</option>
            <option value="CREATE_APPOINTMENT">CREATE APPOINTMENT</option>
            <option value="RESCHEDULE_APPOINTMENT">RESCHEDULE</option>
            <option value="CANCEL_APPOINTMENT">CANCEL</option>
            <option value="FINALIZE_NOTE">DIGITAL SIGNING</option>
            <option value="AMEND_NOTE">AMEND NOTE</option>
          </select>
        </div>

        {/* Logs Table */}
        <div className="max-h-96 overflow-y-auto rounded-lg border border-[#0B4036]/10 text-xs">
          <table className="w-full text-left">
            <thead className="bg-[#FAF8F5] text-[#0B4036] border-b border-[#0B4036]/10 sticky top-0">
              <tr>
                <th className="py-2.5 px-3 font-semibold">Timestamp</th>
                <th className="py-2.5 px-3 font-semibold">Action</th>
                <th className="py-2.5 px-3 font-semibold">Clinician</th>
                <th className="py-2.5 px-3 font-semibold">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-gray-400">
                    No matching audit records found.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                    <td className="py-2.5 px-3 font-mono text-[11px] text-gray-500 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#E4ECE6] text-[#0B4036]">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-medium text-[#0B4036] whitespace-nowrap">
                      {log.doctorName}
                    </td>
                    <td className="py-2.5 px-3 text-[#556B64] max-w-sm truncate" title={log.details}>
                      {log.details}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between text-xs text-[#556B64]">
          <span>Audit Ledger: Immutable & Cryptographically Hashed</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-[#FAF8F5] border border-[#0B4036]/15 hover:bg-[#E4ECE6] text-[#0B4036] font-semibold rounded-lg transition-colors"
          >
            Close Audit View
          </button>
        </div>
      </div>
    </div>
  );
};
