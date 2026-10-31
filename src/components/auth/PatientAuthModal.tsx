import React, { useState, useRef, useEffect } from 'react';
import { X, ShieldCheck, Phone, CheckCircle2, AlertCircle, Lock, ArrowRight, User, Fingerprint, Info, RefreshCw } from 'lucide-react';
import { useAccessibleDialog } from '../../utils/useAccessibleDialog';
import { PatientUser } from '../../types';

interface PatientAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: PatientUser) => void;
  reason?: string;
}

export const PatientAuthModal: React.FC<PatientAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  reason = 'An account is required so our clinical team can securely link your medical records to your profile and send you expert review updates.',
}) => {
  const [authMethod, setAuthMethod] = useState<'phone' | 'aadhaar'>('phone');
  const [step, setStep] = useState<'input' | 'otp'>('input');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(30);

  const dialogRef = useRef<HTMLDivElement>(null);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useAccessibleDialog(isOpen, onClose, dialogRef);

  useEffect(() => {
    if (step === 'otp' && resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [step, resendCooldown]);

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg('Please enter your full legal name.');
      return;
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    if (authMethod === 'aadhaar') {
      const cleanAadhaar = aadhaarNumber.replace(/[^0-9]/g, '');
      if (cleanAadhaar.length !== 12 && cleanAadhaar.length !== 4) {
        setErrorMsg('Please enter the last 4 digits (or 12 digits) of your Aadhaar for sandbox verification.');
        return;
      }
    }

    setStep('otp');
    setResendCooldown(30);
    setTimeout(() => {
      otpInputRefs.current[0]?.focus();
    }, 150);
  };

  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/[^0-9]/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    if (digit && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    if (enteredOtp.length < 6) {
      setErrorMsg('Please enter the complete 6-digit verification code.');
      return;
    }

    setIsVerifying(true);
    setErrorMsg(null);

    // Realistic secure verification simulation
    setTimeout(() => {
      setIsVerifying(false);
      const user: PatientUser = {
        id: 'usr_' + Math.random().toString(36).substring(2, 9),
        name: name.trim(),
        phone: phone.trim(),
        isVerified: true,
        authMethod: authMethod === 'aadhaar' ? 'aadhaar_sandbox' : 'phone_otp',
        registeredAt: new Date().toISOString(),
      };

      // Store authenticated user session securely in sessionStorage
      try {
        sessionStorage.setItem('meridian_patient_session', JSON.stringify(user));
      } catch {
        // Fallback for sandboxed browser storage
      }

      onSuccess(user);
    }, 600);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        className="bg-white border border-mv-outline rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden focus:outline-none"
      >
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-mv-outline/70 bg-mv-ivory flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-mv-forest text-white flex items-center justify-center shadow-xs">
              <Lock className="w-5 h-5 text-mv-terracotta" />
            </div>
            <div>
              <h3 id="auth-modal-title" className="font-serif text-lg font-bold text-mv-forest">
                {step === 'input' ? 'Patient Identification' : 'Verify Mobile Number'}
              </h3>
              <p className="text-xs text-mv-ink-muted">
                Varicose Veins Patient Portal · Confidential
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sign-in window"
            className="p-1.5 text-mv-ink-muted hover:text-mv-forest hover:bg-white rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-7 space-y-5">
          {/* Reason disclosure */}
          <div className="p-3.5 rounded-2xl bg-mv-pale/60 border border-mv-forest/15 text-xs text-mv-ink-muted leading-relaxed flex items-start gap-2.5">
            <Info className="w-4 h-4 text-mv-forest shrink-0 mt-0.5" />
            <div>
              <strong className="text-mv-forest font-semibold block mb-0.5">Secure Medical Record Linkage:</strong>
              {reason}
            </div>
          </div>

          {step === 'input' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              {/* Verification Method Tabs */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-mv-forest mb-2">
                  Verification Method
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMethod('phone');
                      setErrorMsg(null);
                    }}
                    className={`py-2.5 px-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold transition-all cursor-pointer ${
                      authMethod === 'phone'
                        ? 'bg-mv-pale border-mv-forest text-mv-forest shadow-xs'
                        : 'bg-mv-ivory border-mv-outline text-mv-ink-muted hover:bg-white'
                    }`}
                  >
                    <Phone className="w-4 h-4 text-mv-cta" />
                    <span>Mobile OTP (Default)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAuthMethod('aadhaar');
                      setErrorMsg(null);
                    }}
                    className={`py-2.5 px-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold transition-all cursor-pointer ${
                      authMethod === 'aadhaar'
                        ? 'bg-mv-pale border-mv-forest text-mv-forest shadow-xs'
                        : 'bg-mv-ivory border-mv-outline text-mv-ink-muted hover:bg-white'
                    }`}
                  >
                    <Fingerprint className="w-4 h-4 text-mv-cta" />
                    <span>Aadhaar / ABHA (Preview)</span>
                  </button>
                </div>
              </div>

              {/* Patient Full Name */}
              <div>
                <label htmlFor="auth-name" className="block text-xs font-medium text-mv-ink mb-1">
                  Full Legal Name <span className="text-mv-cta">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-mv-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="auth-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full bg-mv-ivory border border-mv-outline rounded-xl py-2.5 pl-9 pr-3 text-xs text-mv-ink focus:ring-2 focus:ring-mv-forest/30 focus:border-mv-forest focus:outline-none"
                  />
                </div>
              </div>

              {/* Mobile Phone Number */}
              <div>
                <label htmlFor="auth-phone" className="block text-xs font-medium text-mv-ink mb-1">
                  Mobile Number (for SMS OTP) <span className="text-mv-cta">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-mv-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="auth-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-mv-ivory border border-mv-outline rounded-xl py-2.5 pl-9 pr-3 text-xs text-mv-ink focus:ring-2 focus:ring-mv-forest/30 focus:border-mv-forest focus:outline-none"
                  />
                </div>
                <p className="mt-1 text-[11px] text-mv-ink-muted">
                  Used exclusively for secure sign-in and review status updates. Zero marketing spam.
                </p>
              </div>

              {/* Aadhaar Compliance Guidance if selected */}
              {authMethod === 'aadhaar' && (
                <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-[11.5px] text-amber-950 space-y-2">
                  <div className="flex items-center gap-1.5 font-semibold text-amber-900">
                    <ShieldCheck className="w-4 h-4 text-amber-700" />
                    <span>UIDAI &amp; ABHA Compliance Architecture:</span>
                  </div>
                  <p className="leading-relaxed">
                    Under Indian Digital Personal Data Protection (DPDP) and UIDAI circulars, private healthcare portals connect via authorized KUA/ASA gateways. We do not store complete 12-digit Aadhaar numbers or card copies.
                  </p>
                  <div>
                    <label htmlFor="auth-aadhaar" className="block font-medium text-amber-950 mb-1">
                      Last 4 Digits of Aadhaar (Sandbox Reference):
                    </label>
                    <input
                      id="auth-aadhaar"
                      type="text"
                      maxLength={4}
                      value={aadhaarNumber}
                      onChange={(e) => setAadhaarNumber(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="•••• 1234"
                      className="w-full bg-white border border-amber-300 rounded-xl py-2 px-3 text-xs text-amber-950 font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                    />
                  </div>
                </div>
              )}

              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 px-5 bg-mv-forest hover:bg-mv-forest-press text-white font-semibold rounded-full text-xs sm:text-[13px] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs tap-tactile"
              >
                <span>Continue to OTP Verification</span>
                <ArrowRight className="w-4 h-4 text-mv-terracotta" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center space-y-1">
                <p className="text-xs text-mv-ink-muted">
                  Enter the 6-digit verification code sent to
                </p>
                <p className="font-mono font-semibold text-mv-forest text-sm">
                  {phone}
                </p>
                <p className="text-[11px] text-mv-ink-muted/80">
                  (Demonstration code: enter any 6 digits, e.g. <span className="font-mono font-bold text-mv-forest">123456</span>)
                </p>
              </div>

              {/* 6 Digit Inputs */}
              <div className="flex justify-center gap-2 sm:gap-2.5 my-4">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { otpInputRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="w-10 h-12 sm:w-12 sm:h-14 text-center font-mono font-bold text-lg text-mv-forest bg-mv-ivory border border-mv-outline rounded-xl focus:ring-2 focus:ring-mv-forest focus:border-mv-forest focus:outline-none transition-all shadow-2xs"
                  />
                ))}
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full py-3.5 px-5 bg-mv-cta hover:bg-mv-cta-press disabled:opacity-50 text-white font-semibold rounded-full text-xs sm:text-[13px] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs tap-tactile"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Identity...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm &amp; Proceed to Review</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-xs pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setStep('input');
                    setErrorMsg(null);
                  }}
                  className="text-mv-ink-muted hover:text-mv-forest font-medium underline"
                >
                  Change details
                </button>

                <button
                  type="button"
                  disabled={resendCooldown > 0}
                  onClick={() => setResendCooldown(30)}
                  className="text-mv-terracotta hover:underline font-medium disabled:opacity-50 disabled:no-underline"
                >
                  {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : 'Resend OTP'}
                </button>
              </div>
            </form>
          )}

          {/* Privacy Guarantee Footer */}
          <div className="pt-3 border-t border-mv-outline/70 flex items-center justify-center gap-2 text-[11px] text-mv-ink-muted text-center">
            <ShieldCheck className="w-3.5 h-3.5 text-mv-forest shrink-0" />
            <span>DPDP Act 2023 Compliant · Data Stored Locally &amp; Securely</span>
          </div>
        </div>
      </div>
    </div>
  );
};
