import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  User,
  ArrowRight,
  AlertCircle,
  KeyRound,
  CheckCircle2,
  Stethoscope,
  Building,
  Info,
  Sparkles,
} from 'lucide-react';
import { doctorPortalService, INITIAL_PROVISIONED_DOCTORS } from '../../services/doctorPortalService';
import { Doctor, DoctorSession } from '../../types/doctorPortal';

interface DoctorLoginProps {
  onLoginSuccess: (doctor: Doctor, session: DoctorSession) => void;
  onNavigateHome: () => void;
}

export const DoctorLogin: React.FC<DoctorLoginProps> = ({ onLoginSuccess, onNavigateHome }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 2FA / MFA state
  const [showMfaModal, setShowMfaModal] = useState(false);
  const [pendingDoctor, setPendingDoctor] = useState<Doctor | null>(null);
  const [pendingSession, setPendingSession] = useState<DoctorSession | null>(null);
  const [mfaCode, setMfaCode] = useState('');
  const [mfaError, setMfaError] = useState<string | null>(null);

  // Password reset state
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetIdentifier, setResetIdentifier] = useState('');
  const [resetDoctorId, setResetDoctorId] = useState('');
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!identifier.trim()) {
      setErrorMsg('Please enter your official email address or username.');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }
    if (!doctorId.trim()) {
      setErrorMsg('Please provide your registered Doctor ID for identity verification.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await doctorPortalService.login(identifier, password, doctorId);
      if (!res.success || !res.doctor || !res.session) {
        setErrorMsg(res.error || 'Authentication failed. Please verify your credentials.');
        setIsLoading(false);
        return;
      }

      // Check if MFA required
      if (res.doctor.twoFactorEnabled && !res.session.mfaVerified) {
        setPendingDoctor(res.doctor);
        setPendingSession(res.session);
        setShowMfaModal(true);
        setIsLoading(false);
        return;
      }

      onLoginSuccess(res.doctor, res.session);
    } catch (err: any) {
      setErrorMsg(err?.message || 'A network or system error occurred during authentication.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyMfa = (e: React.FormEvent) => {
    e.preventDefault();
    setMfaError(null);

    if (!pendingDoctor || !pendingSession) return;

    const ok = doctorPortalService.verifyMfaCode(pendingDoctor.id, mfaCode);
    if (ok) {
      const updatedSession = doctorPortalService.getActiveSession();
      if (updatedSession) {
        setShowMfaModal(false);
        onLoginSuccess(pendingDoctor, updatedSession);
      }
    } else {
      setMfaError('Invalid MFA verification code. Please enter the 6-digit code (Hint: 123456).');
    }
  };

  const handleQuickSelectDoctor = (doc: Doctor) => {
    setIdentifier(doc.email);
    setPassword('VascularSecure@2026');
    setDoctorId(doc.id);
    setErrorMsg(null);
  };

  const handleRequestPasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    setResetMessage(null);
    if (!resetIdentifier.trim() || !resetDoctorId.trim()) {
      setResetMessage('Please fill in both registered email and Doctor ID.');
      setResetSuccess(false);
      return;
    }
    const res = doctorPortalService.requestPasswordReset(resetIdentifier, resetDoctorId);
    setResetMessage(res.message);
    setResetSuccess(res.success);
  };

  return (
    <div className="min-h-screen bg-[#F7F5EF] flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between pb-6 border-b border-[#8DAA9D]/30">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0B4036] text-[#E4ECE6] shadow-sm">
            <Stethoscope className="w-5 h-5" />
          </span>
          <div>
            <span className="font-serif text-xl font-bold text-[#0B4036] tracking-tight block leading-tight">
              Meridian Vascular
            </span>
            <span className="text-xs uppercase tracking-wider text-[#CE5B40] font-semibold">
              Clinical Doctor Portal · Authorised Access
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onNavigateHome}
          className="text-xs sm:text-sm font-semibold text-[#0B4036] hover:text-[#CE5B40] transition-colors"
        >
          ← Return to Public Site
        </button>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto my-8">
        <div className="bg-white rounded-2xl border border-[#8DAA9D]/40 shadow-[0_12px_36px_rgba(11,64,54,0.08)] p-6 sm:p-8">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-[#0B4036]/10 text-[#0B4036] rounded-xl flex items-center justify-center mx-auto mb-3">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-[#0B4036]">Clinician Workstation Sign In</h1>
            <p className="text-xs text-[#334E44] mt-1.5 leading-relaxed">
              Secure clinical workspace for authorised vascular surgeons and interventional radiologists.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-800">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{errorMsg}</div>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#0B4036] mb-1.5">
                Doctor Email or Username <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. arvind.rao@meridianvascular.com"
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-[#FAF8F5] border border-[#8DAA9D]/40 rounded-lg text-[#0B4036] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0B4036]"
                />
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-[#0B4036]">
                  Password <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowResetModal(true)}
                  className="text-[11px] text-[#CE5B40] hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your clinical password"
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-[#FAF8F5] border border-[#8DAA9D]/40 rounded-lg text-[#0B4036] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0B4036]"
                />
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0B4036] mb-1.5">
                Doctor ID Verification <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={doctorId}
                  onChange={(e) => setDoctorId(e.target.value.toUpperCase())}
                  placeholder="e.g. MVD-BLR-0192"
                  className="w-full pl-9 pr-3 py-2.5 text-sm font-mono uppercase bg-[#FAF8F5] border border-[#8DAA9D]/40 rounded-lg text-[#0B4036] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0B4036]"
                />
                <KeyRound className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </div>
              <p className="text-[11px] text-gray-500 mt-1">
                Your institutional identifier assigned by Clinical Governance.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 bg-[#0B4036] hover:bg-[#083029] text-white py-3 rounded-lg text-sm font-semibold transition-all shadow-sm disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? 'Verifying Credentials...' : 'Authenticate & Open Workstation'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Evaluator Switcher */}
          <div className="mt-6 pt-5 border-t border-[#8DAA9D]/30">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0B4036] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#CE5B40]" />
                Demo Clinician Accounts (1-Click Fill)
              </span>
            </div>
            <div className="space-y-2">
              {INITIAL_PROVISIONED_DOCTORS.map((doc) => (
                <button
                  key={doc.id}
                  type="button"
                  onClick={() => handleQuickSelectDoctor(doc)}
                  className="w-full text-left p-2.5 rounded-lg border border-[#8DAA9D]/30 hover:border-[#0B4036] hover:bg-[#FAF8F5] transition-all flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-semibold text-[#0B4036] block">{doc.name}</span>
                    <span className="text-[11px] text-gray-500">
                      {doc.specialization} · ID: {doc.id}
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-[#CE5B40] bg-[#CE5B40]/10 px-2 py-0.5 rounded">
                    Fill
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Governance Notice */}
          <div className="mt-5 p-3 bg-[#E4ECE6]/50 rounded-xl flex items-start gap-2 text-[11px] text-[#2D453C] leading-relaxed">
            <ShieldCheck className="w-4 h-4 text-[#0B4036] shrink-0 mt-0.5" />
            <span>
              <strong>Restricted System:</strong> Doctor accounts are provisioned and approved by the hospital
              administrator. Public self-registration is strictly prohibited. All access attempts are recorded in the
              tamper-evident audit log.
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto text-center text-xs text-gray-500 py-4">
        Meridian Vascular Clinical Information System · Compliant with Digital Personal Data Protection Standards
      </div>

      {/* MFA Modal */}
      {showMfaModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-[#8DAA9D]/40 shadow-xl">
            <div className="w-12 h-12 bg-amber-50 text-amber-700 rounded-xl flex items-center justify-center mx-auto mb-3">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#0B4036] text-center mb-1">
              Multi-Factor Authentication
            </h3>
            <p className="text-xs text-[#334E44] text-center mb-4">
              Enter the 6-digit verification code sent to your registered authenticator or phone (
              {pendingDoctor?.contactPhone}).
            </p>

            {mfaError && (
              <div className="mb-3 p-2 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs">
                {mfaError}
              </div>
            )}

            <form onSubmit={handleVerifyMfa} className="space-y-4">
              <div>
                <input
                  type="text"
                  maxLength={6}
                  autoFocus
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="e.g. 123456"
                  className="w-full text-center tracking-widest font-mono text-xl py-3 border border-[#8DAA9D] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B4036]"
                />
                <span className="text-[11px] text-gray-400 block text-center mt-1">
                  Demo hint: enter <strong>123456</strong>
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowMfaModal(false)}
                  className="flex-1 py-2.5 text-xs font-semibold text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 text-xs font-semibold text-white bg-[#0B4036] hover:bg-[#083029] rounded-lg"
                >
                  Verify & Enter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Password Reset Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#8DAA9D]/40 shadow-xl">
            <h3 className="font-serif text-lg font-bold text-[#0B4036] mb-1">Clinician Password Reset</h3>
            <p className="text-xs text-[#334E44] mb-4">
              For security compliance, password resets require both your registered institutional email and your
              assigned Doctor ID.
            </p>

            {resetMessage && (
              <div
                className={`mb-4 p-3 rounded-xl text-xs leading-relaxed ${
                  resetSuccess
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                {resetMessage}
              </div>
            )}

            <form onSubmit={handleRequestPasswordReset} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#0B4036] mb-1">Official Doctor Email</label>
                <input
                  type="email"
                  required
                  value={resetIdentifier}
                  onChange={(e) => setResetIdentifier(e.target.value)}
                  placeholder="e.g. arvind.rao@meridianvascular.com"
                  className="w-full px-3 py-2 text-sm border border-[#8DAA9D]/40 rounded-lg text-[#0B4036] focus:outline-none focus:ring-2 focus:ring-[#0B4036]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0B4036] mb-1">Doctor ID</label>
                <input
                  type="text"
                  required
                  value={resetDoctorId}
                  onChange={(e) => setResetDoctorId(e.target.value.toUpperCase())}
                  placeholder="e.g. MVD-BLR-0192"
                  className="w-full px-3 py-2 text-sm font-mono uppercase border border-[#8DAA9D]/40 rounded-lg text-[#0B4036] focus:outline-none focus:ring-2 focus:ring-[#0B4036]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowResetModal(false)}
                  className="flex-1 py-2.5 text-xs font-semibold text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 text-xs font-semibold text-white bg-[#0B4036] hover:bg-[#083029] rounded-lg"
                >
                  Dispatch Reset Instructions
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
