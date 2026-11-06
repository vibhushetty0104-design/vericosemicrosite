import React, { useState } from 'react';
import {
  X,
  User,
  Calendar,
  FileText,
  FileCheck,
  FolderOpen,
  Activity,
  AlertTriangle,
  Pill,
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  Plus,
} from 'lucide-react';
import {
  Doctor,
  PatientRecord,
  ClinicalAppointment,
  PatientDocument,
  ClinicalNote,
} from '../../types/doctorPortal';
import { doctorPortalService } from '../../services/doctorPortalService';

interface DoctorPatientProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: PatientRecord | null;
  doctor: Doctor;
  onOpenScheduleModal: (patientId: string) => void;
  onOpenUploadDocument: (patientId: string) => void;
  onOpenClinicalNoteDraft: (appointmentId: string, patientId: string) => void;
  onSelectDocument: (doc: PatientDocument) => void;
}

type TabType = 'overview' | 'appointments' | 'documents' | 'notes';

export const DoctorPatientProfileModal: React.FC<DoctorPatientProfileModalProps> = ({
  isOpen,
  onClose,
  patient,
  doctor,
  onOpenScheduleModal,
  onOpenUploadDocument,
  onOpenClinicalNoteDraft,
  onSelectDocument,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  if (!isOpen || !patient) return null;

  const appointments = doctorPortalService.getAppointments({ patientId: patient.id });
  const documents = doctorPortalService.getDocuments({ patientId: patient.id });
  const notes = doctorPortalService.getClinicalNotes({ patientId: patient.id });

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto" role="dialog" aria-modal="true">
      <div className="bg-white rounded-xl max-w-4xl w-full p-5 sm:p-7 border border-[#0B4036]/10 shadow-2xl my-8 animate-in fade-in-50 zoom-in-95 duration-150">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#0B4036]/10 gap-4">
          <div className="flex items-start gap-4">
            <div className="w-13 h-13 rounded-xl bg-[#0B4036] text-white flex items-center justify-center text-xl font-bold font-serif shrink-0 shadow-2xs">
              {patient.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0B4036] tracking-tight">{patient.name}</h2>
                <span className="font-mono text-xs bg-[#FAF8F5] text-[#0B4036] px-2 py-0.5 rounded font-bold border border-[#0B4036]/10">
                  {patient.id}
                </span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#E4ECE6]/80 text-[#0B4036] border border-[#8DAA9D]/30">
                  {patient.reviewStatus}
                </span>
              </div>
              <p className="text-xs text-[#556B64] mt-1">
                Age {patient.age} ({patient.gender}) · DOB: {patient.dob} · Blood: {patient.bloodGroup} · {patient.city}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenScheduleModal(patient.id);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0B4036] hover:bg-[#072B24] text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors"
            >
              <Calendar className="w-3.5 h-3.5 text-[#8DAA9D]" />
              <span>Book Visit</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-[#0B4036]/10 my-4 text-xs font-semibold">
          {[
            { id: 'overview', label: 'Clinical Overview' },
            { id: 'appointments', label: `Visits (${appointments.length})` },
            { id: 'documents', label: `Documents (${documents.length})` },
            { id: 'notes', label: `Clinical Notes (${notes.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`pb-2.5 px-3 border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-[#0B4036] text-[#0B4036]'
                  : 'border-transparent text-[#556B64] hover:text-[#0B4036]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: CLINICAL OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-4 text-xs">
            {/* Primary Diagnosis & CEAP */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#0B4036]/10 space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#556B64]">
                  Vascular Diagnostic Staging
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold bg-[#E4ECE6] text-[#0B4036] px-2 py-0.5 rounded border border-[#8DAA9D]/30">
                    {patient.ceapClassification}
                  </span>
                </div>
                <p className="font-semibold text-sm text-[#0B4036]">{patient.primaryDiagnosis}</p>
              </div>

              {/* Contact Information */}
              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#0B4036]/10 space-y-1.5 text-[#334E44]">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#556B64] block mb-1">
                  Contact & Demographics
                </span>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#8DAA9D]" />
                  <span>Phone: {patient.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#8DAA9D]" />
                  <span>Email: {patient.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#8DAA9D]" />
                  <span>Location: {patient.city}</span>
                </div>
              </div>
            </div>

            {/* Medical History & Allergies */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-white rounded-lg border border-[#0B4036]/10">
                <span className="text-[10px] uppercase font-bold tracking-wider text-rose-700 block mb-1 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-rose-600" />
                  Allergies
                </span>
                <p className="text-[#334E44]">{patient.allergies || 'None reported'}</p>
              </div>

              <div className="p-3 bg-white rounded-lg border border-[#0B4036]/10">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#0B4036] block mb-1 flex items-center gap-1">
                  <Activity className="w-3 h-3 text-[#0B4036]" />
                  Medical History
                </span>
                <p className="text-[#334E44]">{patient.medicalHistory || 'Unremarkable'}</p>
              </div>

              <div className="p-3 bg-white rounded-lg border border-[#0B4036]/10">
                <span className="text-[10px] uppercase font-bold tracking-wider text-blue-800 block mb-1 flex items-center gap-1">
                  <Pill className="w-3 h-3 text-blue-600" />
                  Active Medications
                </span>
                <p className="text-[#334E44]">{patient.currentMedications || 'None recorded'}</p>
              </div>
            </div>

            {/* Quick Actions Footer inside modal */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100">
              <span className="text-[11px] text-[#556B64]">Registered: {patient.registeredDate}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenUploadDocument(patient.id);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-[#0B4036] bg-[#FAF8F5] border border-[#0B4036]/15 rounded-lg hover:bg-[#E4ECE6] transition-colors"
                >
                  Upload Duplex / Document
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenClinicalNoteDraft('', patient.id);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-[#0B4036] hover:bg-[#072B24] rounded-lg transition-colors shadow-2xs"
                >
                  Write Clinical Note →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: APPOINTMENTS */}
        {activeTab === 'appointments' && (
          <div className="space-y-3 text-xs max-h-96 overflow-y-auto">
            {appointments.length === 0 ? (
              <p className="text-center py-10 text-gray-400">No appointments recorded for this patient.</p>
            ) : (
              appointments.map((a) => (
                <div key={a.id} className="p-3 rounded-lg border border-[#0B4036]/10 bg-[#FAF8F5]/60 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-[#0B4036]">{a.date} · {a.startTime}</span>
                    <p className="text-[#556B64] mt-0.5">{a.appointmentType} · {a.consultationMode}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-[#0B4036]/10 text-[#0B4036]">
                    {a.status}
                  </span>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 3: DOCUMENTS */}
        {activeTab === 'documents' && (
          <div className="space-y-3 text-xs max-h-96 overflow-y-auto">
            {documents.length === 0 ? (
              <p className="text-center py-10 text-gray-400">No medical documents uploaded yet.</p>
            ) : (
              documents.map((d) => (
                <div
                  key={d.id}
                  onClick={() => {
                    onClose();
                    onSelectDocument(d);
                  }}
                  className="p-3 rounded-lg border border-[#0B4036]/10 bg-[#FAF8F5]/60 hover:bg-[#FAF8F5] transition-colors cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <span className="font-semibold text-[#0B4036]">{d.fileName}</span>
                    <p className="text-[11px] text-[#556B64]">{d.category} · {d.uploadedAt}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-[#0B4036]/10 text-[#0B4036]">
                    {d.reviewStatus}
                  </span>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 4: CLINICAL NOTES */}
        {activeTab === 'notes' && (
          <div className="space-y-3 text-xs max-h-96 overflow-y-auto">
            {notes.length === 0 ? (
              <p className="text-center py-10 text-gray-400">No clinical notes recorded yet.</p>
            ) : (
              notes.map((n) => (
                <div key={n.id} className="p-3 rounded-lg border border-[#0B4036]/10 bg-[#FAF8F5]/60 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#0B4036]">{n.id} · Signed by {n.signedByDoctorName || n.doctorName}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-[#0B4036]/10 text-[#0B4036]">
                      {n.status}
                    </span>
                  </div>
                  <p className="text-[#334E44]"><strong>Assessment:</strong> {n.assessment}</p>
                  <p className="text-[#556B64]"><strong>Plan:</strong> {n.treatmentPlan}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
