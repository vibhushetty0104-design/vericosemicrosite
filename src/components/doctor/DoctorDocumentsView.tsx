import React, { useState } from 'react';
import {
  FolderOpen,
  Upload,
  Search,
  Filter,
  FileText,
  Image as ImageIcon,
  Download,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  FileCheck,
  ShieldCheck,
  User,
} from 'lucide-react';
import { Doctor, PatientRecord, PatientDocument, DocumentCategory, DocumentReviewStatus } from '../../types/doctorPortal';
import { doctorPortalService } from '../../services/doctorPortalService';

interface DoctorDocumentsViewProps {
  doctor: Doctor;
  patients: PatientRecord[];
  documents: PatientDocument[];
  onDocumentUploaded: (doc: PatientDocument) => void;
  onDocumentStatusUpdated: (doc: PatientDocument) => void;
  initialUploadPatientId?: string;
}

export const DoctorDocumentsView: React.FC<DoctorDocumentsViewProps> = ({
  doctor,
  patients,
  documents,
  onDocumentUploaded,
  onDocumentStatusUpdated,
  initialUploadPatientId,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPatientId, setSelectedPatientId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [reviewStatusFilter, setReviewStatusFilter] = useState('all');

  // Upload modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadPatientId, setUploadPatientId] = useState(initialUploadPatientId || '');
  const [uploadCategory, setUploadCategory] = useState<DocumentCategory>('Doppler ultrasound reports');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadNotes, setUploadNotes] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Document preview modal state
  const [previewDoc, setPreviewDoc] = useState<PatientDocument | null>(null);
  const [reviewNotesInput, setReviewNotesInput] = useState('');

  const categories: DocumentCategory[] = [
    'Doppler ultrasound reports',
    'Medical prescriptions',
    'Laboratory reports',
    'Clinical photographs',
    'Discharge summaries',
    'Other medical documents',
  ];

  const filteredDocuments = documents.filter((d) => {
    if (selectedCategory !== 'all' && d.category !== selectedCategory) return false;
    if (selectedPatientId !== 'all' && d.patientId !== selectedPatientId) return false;
    if (reviewStatusFilter !== 'all' && d.reviewStatus !== reviewStatusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const match =
        d.fileName.toLowerCase().includes(q) ||
        d.patientName.toLowerCase().includes(q) ||
        (d.summaryNotes && d.summaryNotes.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError(null);

    if (!uploadPatientId) {
      setUploadError('Please select a patient for this document.');
      return;
    }
    if (!uploadFile) {
      setUploadError('Please select a file to upload.');
      return;
    }

    const res = doctorPortalService.uploadDocument({
      patientId: uploadPatientId,
      category: uploadCategory,
      file: {
        name: uploadFile.name,
        size: uploadFile.size,
        type: uploadFile.type,
      },
      summaryNotes: uploadNotes,
      uploadedBy: doctor.name,
      doctorId: doctor.id,
    });

    if (!res.success || !res.document) {
      setUploadError(res.error || 'Upload failed.');
      return;
    }

    onDocumentUploaded(res.document);
    setShowUploadModal(false);
    setUploadFile(null);
    setUploadNotes('');
  };

  const handleDownload = (doc: PatientDocument) => {
    const content = `MERIDIAN VASCULAR CLINICAL RECORDS ARCHIVE\n============================================\nDocument ID: ${doc.id}\nPatient: ${doc.patientName} (${doc.patientId})\nCategory: ${doc.category}\nFilename: ${doc.fileName}\nUploaded: ${doc.uploadedAt}\nUploaded By: ${doc.uploadedBy}\nReview Status: ${doc.reviewStatus}\nSummary Notes: ${doc.summaryNotes || 'None'}\n\n[VERIFIED CLINICAL RECORD EXPORT · PHI ENCRYPTED]`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = doc.fileName.replace(/\.[^.]+$/, '') + '_clinical_copy.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReviewAction = (status: DocumentReviewStatus) => {
    if (!previewDoc) return;
    const res = doctorPortalService.updateDocumentReviewStatus(
      previewDoc.id,
      status,
      doctor.id,
      doctor.name,
      reviewNotesInput
    );
    if (res.success && res.document) {
      onDocumentStatusUpdated(res.document);
      setPreviewDoc(res.document);
      setReviewNotesInput('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="bg-white p-5 sm:p-6 rounded-xl border border-[#0B4036]/10 shadow-[0_1px_3px_rgba(11,64,54,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#CE5B40]">
            Electronic Medical Records
          </span>
          <h1 className="font-serif text-2xl font-bold text-[#0B4036] tracking-tight">Medical Documents & Imaging</h1>
          <p className="text-xs text-[#556B64] mt-0.5">
            Doppler duplex scans, clinical limb photography, prescriptions, and laboratory reports.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowUploadModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0B4036] hover:bg-[#072B24] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors self-start md:self-center"
        >
          <Upload className="w-4 h-4 text-[#8DAA9D]" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Filter Ribbon */}
      <div className="bg-white p-4 rounded-xl border border-[#0B4036]/10 shadow-[0_1px_3px_rgba(11,64,54,0.02)] space-y-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-[#0B4036] text-white shadow-2xs'
                : 'bg-[#FAF8F5] text-[#556B64] hover:text-[#0B4036] hover:bg-[#E4ECE6]'
            }`}
          >
            All Categories ({documents.length})
          </button>
          {categories.map((cat) => {
            const count = documents.filter((d) => d.category === cat).length;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#0B4036] text-white shadow-2xs'
                    : 'bg-[#FAF8F5] text-[#556B64] hover:text-[#0B4036] hover:bg-[#E4ECE6]'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Secondary Filters */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-gray-100 text-xs">
          <div className="relative flex-1 min-w-[200px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by file name, patient, or notes..."
              className="w-full pl-8 pr-3 py-1.5 bg-[#FAF8F5] border border-[#0B4036]/15 rounded-lg text-[#0B4036] focus:outline-none focus:ring-2 focus:ring-[#0B4036]/20"
            />
            <Search className="w-3.5 h-3.5 text-[#8DAA9D] absolute left-2.5 top-2.5" />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[#556B64]">Patient:</span>
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="px-2.5 py-1.5 bg-[#FAF8F5] border border-[#0B4036]/15 rounded-lg text-[#0B4036] focus:outline-none focus:ring-2 focus:ring-[#0B4036]/20"
            >
              <option value="all">All Patients</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[#556B64]">Review Status:</span>
            <select
              value={reviewStatusFilter}
              onChange={(e) => setReviewStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-[#FAF8F5] border border-[#0B4036]/15 rounded-lg text-[#0B4036] focus:outline-none focus:ring-2 focus:ring-[#0B4036]/20"
            >
              <option value="all">All Statuses</option>
              <option value="Pending Review">Pending Review</option>
              <option value="Reviewed">Reviewed</option>
              <option value="Action Required">Action Required</option>
            </select>
          </div>
        </div>
      </div>

      {/* Document Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocuments.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl border border-gray-100 p-12 text-center text-xs text-[#556B64]">
            <FolderOpen className="w-8 h-8 mx-auto mb-2 text-[#8DAA9D] opacity-60" />
            <p className="font-semibold text-[#0B4036]">No medical documents match your filters.</p>
          </div>
        ) : (
          filteredDocuments.map((doc) => {
            const isImage = doc.mimeType.startsWith('image/');
            return (
              <div
                key={doc.id}
                className="bg-white rounded-xl border border-[#0B4036]/10 p-4 shadow-[0_1px_3px_rgba(11,64,54,0.02)] hover:border-[#0B4036]/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#CE5B40] bg-[#CE5B40]/10 px-2 py-0.5 rounded">
                      {doc.category}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        doc.reviewStatus === 'Reviewed'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : doc.reviewStatus === 'Action Required'
                          ? 'bg-rose-50 text-rose-800 border-rose-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      {doc.reviewStatus}
                    </span>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2.5 bg-[#FAF8F5] rounded-lg border border-[#0B4036]/10 text-[#0B4036] shrink-0">
                      {isImage ? <ImageIcon className="w-5 h-5 text-purple-600" /> : <FileText className="w-5 h-5 text-[#0B4036]" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif font-bold text-xs text-[#0B4036] truncate leading-tight" title={doc.fileName}>
                        {doc.fileName}
                      </h4>
                      <p className="text-[11px] text-[#556B64] mt-0.5">
                        Patient: <strong>{doc.patientName}</strong>
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {(doc.fileSizeBytes / 1024 / 1024).toFixed(2)} MB · Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {doc.summaryNotes && (
                    <p className="mt-3 p-2 bg-[#FAF8F5] rounded-lg text-[11px] text-[#556B64] italic line-clamp-2">
                      "{doc.summaryNotes}"
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-gray-400 font-mono">By: {doc.uploadedBy}</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setPreviewDoc(doc)}
                      className="p-1.5 text-[#556B64] hover:text-[#0B4036] hover:bg-[#FAF8F5] rounded-lg transition-colors"
                      title="Inspect Document"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownload(doc)}
                      className="p-1.5 text-[#556B64] hover:text-[#0B4036] hover:bg-[#FAF8F5] rounded-lg transition-colors"
                      title="Download Certified Record"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* UPLOAD DOCUMENT MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="bg-white rounded-xl max-w-lg w-full p-5 sm:p-6 border border-[#0B4036]/10 shadow-2xl animate-in fade-in-50 zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#0B4036]/10 mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#CE5B40]">
                  Clinical Upload
                </span>
                <h3 className="font-serif text-lg font-bold text-[#0B4036]">Add Patient Medical Document</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {uploadError && (
              <div className="mb-4 p-3 bg-rose-50 text-rose-800 border border-rose-200 rounded-lg text-xs">
                {uploadError}
              </div>
            )}

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#0B4036] mb-1">
                  Target Patient <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={uploadPatientId}
                  onChange={(e) => setUploadPatientId(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#0B4036]/15 rounded-lg text-[#0B4036] focus:outline-none focus:ring-2 focus:ring-[#0B4036]/20"
                >
                  <option value="">-- Choose Patient --</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#0B4036] mb-1">
                  Document Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value as DocumentCategory)}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#0B4036]/15 rounded-lg text-[#0B4036] focus:outline-none focus:ring-2 focus:ring-[#0B4036]/20"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#0B4036] mb-1">
                  File Attachment (PDF, JPG, PNG - Max 15 MB) <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  required
                  accept=".pdf, .jpg, .jpeg, .png"
                  onChange={(e) => setUploadFile(e.target.files ? e.target.files[0] : null)}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-dashed border-[#8DAA9D] rounded-lg text-[#0B4036]"
                />
                {uploadFile && (
                  <p className="text-[11px] text-[#556B64] mt-1">
                    Selected: <strong>{uploadFile.name}</strong> ({(uploadFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>

              <div>
                <label className="block font-semibold text-[#0B4036] mb-1">Clinical Summary / Findings</label>
                <textarea
                  rows={2}
                  value={uploadNotes}
                  onChange={(e) => setUploadNotes(e.target.value)}
                  placeholder="e.g. SFJ reflux duration 2.8s; severe standing venous incompetence."
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#0B4036]/15 rounded-lg text-[#0B4036] focus:outline-none focus:ring-2 focus:ring-[#0B4036]/20"
                />
              </div>

              <div className="p-3 bg-[#E4ECE6]/50 rounded-lg text-[11px] text-[#2D453C] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#0B4036] shrink-0" />
                <span>Uploaded records are private, access-restricted, and cryptographically verified.</span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 py-2 text-gray-600 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!uploadFile}
                  className="flex-1 py-2 text-white bg-[#0B4036] hover:bg-[#072B24] rounded-lg font-semibold disabled:opacity-50 transition-colors shadow-2xs"
                >
                  Upload & Register Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DOCUMENT PREVIEW & CLINICIAN REVIEW MODAL */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="bg-white rounded-xl max-w-2xl w-full p-5 sm:p-6 border border-[#0B4036]/10 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto animate-in fade-in-50 zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#0B4036]/10">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#CE5B40]">
                  {previewDoc.category}
                </span>
                <h3 className="font-serif text-lg font-bold text-[#0B4036]">{previewDoc.fileName}</h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#0B4036]/10 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-[#556B64]">Patient:</span>
                <span className="font-bold text-[#0B4036]">{previewDoc.patientName} ({previewDoc.patientId})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#556B64]">Uploaded On:</span>
                <span className="text-[#334E44]">{new Date(previewDoc.uploadedAt).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#556B64]">Uploaded By:</span>
                <span className="text-[#334E44]">{previewDoc.uploadedBy}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#556B64]">Current Review Status:</span>
                <span className="font-bold text-[#0B4036]">{previewDoc.reviewStatus}</span>
              </div>
              {previewDoc.summaryNotes && (
                <div className="pt-2 border-t border-gray-200">
                  <span className="text-[#556B64] block mb-0.5">Clinical Excerpt / Findings:</span>
                  <p className="text-[#334E44] bg-white p-2.5 rounded border border-gray-200 leading-relaxed font-mono text-[11px]">
                    {previewDoc.summaryNotes}
                  </p>
                </div>
              )}
            </div>

            {/* Clinician Review Actions */}
            <div className="p-4 bg-white rounded-xl border border-[#0B4036]/10 space-y-3">
              <h4 className="font-serif text-sm font-bold text-[#0B4036]">
                Clinician Triage & Review Decision
              </h4>
              <textarea
                rows={2}
                value={reviewNotesInput}
                onChange={(e) => setReviewNotesInput(e.target.value)}
                placeholder="Add clinician evaluation note (optional)..."
                className="w-full p-2.5 text-xs bg-[#FAF8F5] border border-[#0B4036]/15 rounded-lg text-[#0B4036] focus:outline-none focus:ring-2 focus:ring-[#0B4036]/20"
              />
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleReviewAction('Reviewed')}
                  className="px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-300 rounded-lg hover:bg-emerald-100 transition-colors"
                >
                  ✓ Mark Reviewed (Approved)
                </button>
                <button
                  type="button"
                  onClick={() => handleReviewAction('Action Required')}
                  className="px-3 py-1.5 text-xs font-semibold text-rose-800 bg-rose-50 border border-rose-300 rounded-lg hover:bg-rose-100 transition-colors"
                >
                  ⚠ Flag: Further Action Required
                </button>
                <button
                  type="button"
                  onClick={() => handleDownload(previewDoc)}
                  className="px-3 py-1.5 text-xs font-semibold text-[#0B4036] bg-[#FAF8F5] border border-[#0B4036]/15 rounded-lg hover:bg-[#E4ECE6] ml-auto transition-colors"
                >
                  Download Certified Copy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
