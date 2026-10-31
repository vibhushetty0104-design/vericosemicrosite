import React, { useState } from 'react';
import {
  User,
  FileText,
  ShieldCheck,
  Calendar,
  LogOut,
  Clock,
  CheckCircle2,
  AlertCircle,
  Upload,
  ArrowRight,
  Trash2,
  Download,
  Info
} from 'lucide-react';
import { PatientUser, ExpertReviewSubmission } from '../../types';

interface PatientDashboardProps {
  user: PatientUser | null;
  submissions: ExpertReviewSubmission[];
  onOpenAuth: () => void;
  onSignOut: () => void;
  onOpenReportUpload: () => void;
  onOpenBooking: () => void;
  onDeleteSubmission?: (id: string) => void;
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({
  user,
  submissions,
  onOpenAuth,
  onSignOut,
  onOpenReportUpload,
  onOpenBooking,
  onDeleteSubmission,
}) => {
  const [activeTab, setActiveTab] = useState<'reviews' | 'consultations' | 'privacy'>('reviews');
  const [privacyNotification, setPrivacyNotification] = useState<string | null>(null);

  if (!user) {
    return (
      <main className="min-h-[70vh] bg-[#FAF7F2] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto text-center bg-white border border-[#8DAA9D]/30 rounded-2xl p-8 sm:p-12 shadow-sm">
          <div className="w-16 h-16 bg-[#0B4036]/10 rounded-full flex items-center justify-center mx-auto mb-6 text-[#0B4036]">
            <User className="w-8 h-8" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#0B4036] mb-3">
            Patient Portal & Records
          </h1>
          <p className="text-[15px] text-[#334E44] leading-relaxed mb-8">
            Sign in with your mobile OTP or digital health ID to view your expert review status, manage your consultation requests, and control your health data.
          </p>
          <button
            type="button"
            onClick={onOpenAuth}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#A9472F] hover:bg-[#8F3B26] text-white px-7 py-3.5 rounded-lg text-sm font-semibold transition-all shadow-sm"
          >
            Sign In with Mobile OTP / Health ID
            <ArrowRight className="w-4 h-4" />
          </button>
          <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-[#52796F]">
            <ShieldCheck className="w-4 h-4 text-[#0B4036]" />
            <span>Digital Personal Data Protection (DPDP) compliant architecture</span>
          </div>
        </div>
      </main>
    );
  }

  const getStatusBadge = (status: ExpertReviewSubmission['status']) => {
    switch (status) {
      case 'Submitted — In Triage':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Submitted — In Triage
          </span>
        );
      case 'Awaiting Clinician Assignment':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-800 border border-blue-200">
            <Info className="w-3.5 h-3.5 text-blue-600" />
            Awaiting Clinician Assignment
          </span>
        );
      case 'In Clinician Review':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-800 border border-purple-200">
            <Clock className="w-3.5 h-3.5 text-purple-600" />
            Clinician Review in Progress
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Review Completed
          </span>
        );
      default:
        return null;
    }
  };

  const userName = user.name || user.fullName || 'Patient';
  const userPhone = user.phone || user.phoneNumber || '';

  const handleExportData = () => {
    const dataStr = JSON.stringify({ user, submissions }, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `meridian-records-${userPhone.replace(/\D/g, '') || 'patient'}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setPrivacyNotification('Your session records were exported to JSON successfully.');
    setTimeout(() => setPrivacyNotification(null), 4000);
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to delete all local review records and sign out? This cannot be undone.')) {
      sessionStorage.removeItem('meridian_expert_submissions');
      sessionStorage.removeItem('meridian_patient_user');
      onSignOut();
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF7F2] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Top Header Card */}
        <div className="bg-white border border-[#8DAA9D]/30 rounded-2xl p-6 sm:p-8 mb-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-gray-100">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-[#0B4036] text-white flex items-center justify-center font-serif text-2xl font-bold shrink-0">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-serif text-2xl font-semibold text-[#0B4036]">
                    {userName}
                  </h1>
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Mobile OTP
                  </span>
                  {user.abhaNumber && (
                    <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium border border-blue-200">
                      ABHA ID Linked
                    </span>
                  )}
                </div>
                <p className="text-sm text-[#334E44] mt-1">
                  Mobile: <span className="font-mono">{userPhone}</span>
                  {user.email && <> · Email: <span>{user.email}</span></>}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onSignOut}
                className="inline-flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-lg text-xs font-semibold text-[#334E44] hover:bg-gray-50 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-4 mt-6 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('reviews')}
              className={`pb-2 px-1 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'reviews'
                  ? 'border-[#0B4036] text-[#0B4036]'
                  : 'border-transparent text-gray-500 hover:text-[#0B4036]'
              }`}
            >
              <FileText className="w-4 h-4" />
              Medical Expert Reviews ({submissions.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('consultations')}
              className={`pb-2 px-1 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'consultations'
                  ? 'border-[#0B4036] text-[#0B4036]'
                  : 'border-transparent text-gray-500 hover:text-[#0B4036]'
              }`}
            >
              <Calendar className="w-4 h-4" />
              Consultation Requests
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('privacy')}
              className={`pb-2 px-1 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'privacy'
                  ? 'border-[#0B4036] text-[#0B4036]'
                  : 'border-transparent text-gray-500 hover:text-[#0B4036]'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Data & Privacy Controls
            </button>
          </div>
        </div>

        {/* Tab 1: Medical Expert Reviews */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-[#0B4036]">Uploaded Reports & Photos for Review</h2>
                <p className="text-xs text-[#334E44]">All reviews are evaluated by qualified human vascular doctors — not automated AI algorithms.</p>
              </div>
              <button
                type="button"
                onClick={onOpenReportUpload}
                className="inline-flex items-center gap-2 bg-[#0B4036] hover:bg-[#072B24] text-white px-4 py-2.5 rounded-lg text-xs font-semibold transition-all self-start sm:self-auto shadow-sm"
              >
                <Upload className="w-4 h-4" />
                Upload New Report
              </button>
            </div>

            {submissions.length === 0 ? (
              <div className="bg-white border border-[#8DAA9D]/30 rounded-2xl p-10 text-center">
                <FileText className="w-12 h-12 text-[#8DAA9D] mx-auto mb-3" />
                <h3 className="text-base font-semibold text-[#0B4036] mb-1">No reports or photographs uploaded yet</h3>
                <p className="text-xs text-[#334E44] max-w-md mx-auto mb-6">
                  You can upload Doppler ultrasound scans, hospital discharge summaries, or clear photographs of your leg veins for an expert vascular opinion.
                </p>
                <button
                  type="button"
                  onClick={onOpenReportUpload}
                  className="inline-flex items-center gap-2 bg-[#A9472F] hover:bg-[#8F3B26] text-white px-6 py-2.5 rounded-lg text-xs font-semibold transition-all"
                >
                  <Upload className="w-4 h-4" />
                  Submit Report for Expert Review
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {submissions.map((sub) => (
                  <div key={sub.id} className="bg-white border border-[#8DAA9D]/30 rounded-2xl p-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
                      <div>
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono text-xs font-bold text-[#0B4036] bg-[#0B4036]/5 px-2 py-0.5 rounded">
                            {sub.id}
                          </span>
                          <span className="text-xs text-[#52796F]">
                            Submitted on {new Date(sub.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                        <h4 className="font-medium text-[#0B4036] text-sm mt-1">
                          {sub.category === 'medical-reports' ? 'Doppler Ultrasound & Clinical Report Review' : 'Leg Vein Clinical Photograph Review'}
                        </h4>
                      </div>
                      <div>
                        {getStatusBadge(sub.status)}
                      </div>
                    </div>

                    {/* Files list */}
                    <div className="mt-4">
                      <p className="text-xs font-semibold text-[#334E44] mb-2 uppercase tracking-wider">
                        Attached Documents ({sub.attachments.length})
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {sub.attachments.map((file, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 bg-[#FAF7F2]/60">
                            <FileText className="w-5 h-5 text-[#0B4036] shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-medium text-[#0B4036] truncate">{file.name}</p>
                              <p className="text-[10px] text-gray-500">{file.size}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Clinical Notes */}
                    {sub.notes && (
                      <div className="mt-4 bg-[#FAF7F2] p-3.5 rounded-lg border border-[#8DAA9D]/20">
                        <p className="text-[11px] font-semibold text-[#0B4036] mb-1">Your Context / Notes:</p>
                        <p className="text-xs text-[#334E44] italic leading-relaxed">"{sub.notes}"</p>
                      </div>
                    )}

                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                      <span className="text-[#52796F]">
                        Assigned Clinician: <span className="font-medium text-[#0B4036]">{sub.assignedDoctorName || 'Pending Triage Allocation'}</span>
                      </span>
                      {onDeleteSubmission && (
                        <button
                          type="button"
                          onClick={() => onDeleteSubmission(sub.id)}
                          className="text-rose-600 hover:text-rose-800 inline-flex items-center gap-1 font-medium text-xs"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete Record
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Consultations */}
        {activeTab === 'consultations' && (
          <div className="bg-white border border-[#8DAA9D]/30 rounded-2xl p-8 shadow-sm">
            <h2 className="text-lg font-semibold text-[#0B4036] mb-2">In-Person & Video Consultations</h2>
            <p className="text-xs text-[#334E44] mb-6">
              Vascular duplex ultrasound examinations and hands-on clinical assessments require an in-person clinic visit.
            </p>
            <div className="p-6 border border-dashed border-[#8DAA9D] rounded-xl bg-[#FAF7F2] text-center max-w-md mx-auto">
              <Calendar className="w-10 h-10 text-[#0B4036] mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-[#0B4036] mb-1">Schedule a Clinic Consultation</h3>
              <p className="text-xs text-[#334E44] mb-5">
                Consult with our senior vascular surgeons in Bengaluru for a dedicated venous duplex scan and personalized treatment roadmap.
              </p>
              <button
                type="button"
                onClick={onOpenBooking}
                className="inline-flex items-center gap-2 bg-[#A9472F] hover:bg-[#8F3B26] text-white px-6 py-2.5 rounded-lg text-xs font-semibold transition-all shadow-sm"
              >
                Request Consultation
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Data & Privacy Controls */}
        {activeTab === 'privacy' && (
          <div className="bg-white border border-[#8DAA9D]/30 rounded-2xl p-8 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-[#0B4036] mb-1">Data Governance & Privacy Management</h2>
              <p className="text-xs text-[#334E44]">
                In adherence to the Digital Personal Data Protection Act (DPDPA 2023), you hold complete ownership of your personal and health records.
              </p>
            </div>

            {privacyNotification && (
              <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-medium rounded-lg border border-emerald-200">
                {privacyNotification}
              </div>
            )}

            <div className="border border-gray-100 rounded-xl p-5 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-[#0B4036]">Export My Data</h3>
                  <p className="text-xs text-[#52796F] mt-0.5">
                    Download a full JSON archive of your profile information, review submissions, and notes.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleExportData}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-gray-200 hover:bg-gray-50 rounded-lg text-xs font-semibold text-[#0B4036]"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download Archive
                </button>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-rose-700">Delete Local Session Data</h3>
                  <p className="text-xs text-[#52796F] mt-0.5">
                    Clear all locally cached review drafts, submission references, and sign out immediately.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleClearData}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-lg text-xs font-semibold"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear & Sign Out
                </button>
              </div>
            </div>

            <div className="p-4 bg-[#0B4036]/5 rounded-xl border border-[#0B4036]/15 flex items-start gap-3 text-xs text-[#0B4036]">
              <AlertCircle className="w-5 h-5 text-[#0B4036] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Security Commitment:</span> We do not sell, broker, or transmit clinical data to advertising platforms. All uploaded scans are treated with strict medical confidentiality and are shared exclusively with certified vascular surgeons.
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};
