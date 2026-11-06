import React, { useState, useEffect } from 'react';
import {
  Stethoscope,
  Bell,
  Clock,
  ShieldCheck,
  LogOut,
  ChevronDown,
  RefreshCw,
  MapPin,
  CheckCircle2,
  Calendar,
  FileText,
  AlertCircle,
  ExternalLink,
  Menu,
  X,
  User,
} from 'lucide-react';
import { Doctor, DoctorSession, DoctorNotification } from '../../types/doctorPortal';
import { doctorPortalService } from '../../services/doctorPortalService';

interface DoctorHeaderProps {
  doctor: Doctor;
  session: DoctorSession;
  unreadNotificationCount: number;
  onLogout: () => void;
  onOpenAuditLogs: () => void;
  onNavigateTab: (tab: string) => void;
  onSelectNotificationItem?: (item: DoctorNotification) => void;
  onToggleMobileMenu?: () => void;
  isMobileMenuOpen?: boolean;
}

export const DoctorHeader: React.FC<DoctorHeaderProps> = ({
  doctor,
  session,
  unreadNotificationCount,
  onLogout,
  onOpenAuditLogs,
  onNavigateTab,
  onSelectNotificationItem,
  onToggleMobileMenu,
  isMobileMenuOpen = false,
}) => {
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(1800); // 30 min default
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<DoctorNotification[]>([]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Live countdown timer for session expiration
  useEffect(() => {
    const updateCountdown = () => {
      const activeSession = doctorPortalService.getActiveSession();
      if (!activeSession) {
        onLogout();
        return;
      }
      const exp = new Date(activeSession.expiresAt).getTime();
      const now = Date.now();
      const diff = Math.max(0, Math.floor((exp - now) / 1000));
      setTimeLeftSeconds(diff);
      if (diff <= 0) {
        onLogout();
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [onLogout]);

  // Load notifications when dropdown opens
  useEffect(() => {
    if (isNotifOpen) {
      setNotifications(doctorPortalService.getNotifications(doctor.id));
    }
  }, [isNotifOpen, doctor.id]);

  const handleExtendSession = () => {
    doctorPortalService.touchSession();
    setTimeLeftSeconds(1800);
  };

  const handleNotificationClick = (n: DoctorNotification) => {
    doctorPortalService.markNotificationAsRead(n.id);
    setIsNotifOpen(false);
    if (onSelectNotificationItem) {
      onSelectNotificationItem(n);
    } else if (n.relatedEntity?.type === 'appointment') {
      onNavigateTab('calendar');
    } else if (n.relatedEntity?.type === 'document') {
      onNavigateTab('documents');
    }
  };

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s.toString().padStart(2, '0')}s`;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#0B4036]/10 shadow-[0_1px_3px_rgba(11,64,54,0.04)] w-full overflow-hidden">
      <div className="px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4 max-w-full">
        {/* Left: Mobile Toggle + Brand & Clinical Environment */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          {onToggleMobileMenu && (
            <button
              type="button"
              onClick={onToggleMobileMenu}
              className="lg:hidden p-1.5 -ml-1 text-[#0B4036] hover:bg-[#FAF8F5] rounded-lg transition-colors focus:outline-none shrink-0"
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}

          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-[#0B4036] text-white shadow-2xs shrink-0">
              <Stethoscope className="w-4 h-4 text-[#E4ECE6]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-serif text-base sm:text-lg font-semibold text-[#0B4036] tracking-tight leading-none whitespace-nowrap">
                  Meridian Vascular
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider bg-[#E4ECE6]/80 text-[#0B4036] px-2 py-0.5 rounded-full border border-[#8DAA9D]/30 hidden xl:inline-block whitespace-nowrap">
                  Doctor Workstation
                </span>
              </div>
              <p className="text-[11px] text-[#556B64] font-normal hidden md:block truncate mt-0.5">
                {doctor.department} · {doctor.consultationLocation}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Actions, Timer, Notifications & Profile */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Subtle Session Countdown Indicator */}
          <div
            className={`hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-lg text-xs border transition-colors ${
              timeLeftSeconds < 180
                ? 'bg-rose-50/80 border-rose-200 text-rose-800'
                : 'bg-[#FAF8F5] border-[#0B4036]/10 text-[#2D453C]'
            }`}
            title="Clinician workstation session expiration countdown"
          >
            <Clock
              className={`w-3.5 h-3.5 ${
                timeLeftSeconds < 180 ? 'text-[#CE5B40] animate-pulse' : 'text-[#8DAA9D]'
              }`}
            />
            <span className="font-mono text-[11px] font-medium tracking-tight">
              Session:{' '}
              <strong
                className={
                  timeLeftSeconds < 180
                    ? 'text-[#CE5B40] font-bold font-mono'
                    : 'text-[#0B4036] font-semibold font-mono'
                }
              >
                {formatCountdown(timeLeftSeconds)}
              </strong>
            </span>
            <button
              type="button"
              onClick={handleExtendSession}
              title="Extend session by 30 minutes"
              className="text-[#8DAA9D] hover:text-[#0B4036] ml-0.5 p-0.5 rounded hover:bg-white transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>

          {/* Clinical Audit Log Trigger */}
          <button
            type="button"
            onClick={onOpenAuditLogs}
            className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-[#0B4036] bg-[#FAF8F5] hover:bg-[#E4ECE6] border border-[#0B4036]/10 rounded-lg transition-all"
            title="Inspect Immutable Clinical Audit Log"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#0B4036]" />
            <span>Audit Trail</span>
          </button>

          {/* Polished Notifications Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsNotifOpen(!isNotifOpen);
                setIsProfileOpen(false);
              }}
              className="relative p-2 rounded-lg text-[#0B4036] hover:bg-[#FAF8F5] border border-transparent hover:border-[#0B4036]/10 transition-colors focus:outline-none"
              aria-label="Clinical notifications"
            >
              <Bell className="w-4 h-4 text-[#0B4036]" />
              {unreadNotificationCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#CE5B40] text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-xs">
                  {unreadNotificationCount}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-[#0B4036]/10 rounded-xl shadow-lg p-4 z-50 animate-in fade-in-50 zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-sm font-bold text-[#0B4036]">Clinical Work Queue Alerts</span>
                    <span className="text-[10px] bg-[#E4ECE6] text-[#0B4036] px-2 py-0.5 rounded-full font-bold">
                      {notifications.length}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      doctorPortalService.markAllNotificationsAsRead(doctor.id);
                      setNotifications(doctorPortalService.getNotifications(doctor.id));
                    }}
                    className="text-[11px] text-[#CE5B40] hover:underline font-semibold"
                  >
                    Mark all read
                  </button>
                </div>

                <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                  {notifications.length === 0 ? (
                    <div className="text-center py-6 text-xs text-gray-500">
                      No notifications at this time.
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => handleNotificationClick(n)}
                        className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                          n.read
                            ? 'bg-white border-gray-100 text-gray-600 hover:bg-[#FAF8F5]'
                            : 'bg-[#E4ECE6]/40 border-[#8DAA9D]/30 text-[#0B4036] font-medium hover:bg-[#E4ECE6]/60'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <span className="font-semibold text-[#0B4036]">{n.title}</span>
                          <span className="text-[10px] text-gray-400 shrink-0 font-mono">
                            {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#334E44] line-clamp-2">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>

                <div className="pt-3 border-t border-gray-100 mt-3 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setIsNotifOpen(false);
                      onNavigateTab('notifications');
                    }}
                    className="text-xs font-semibold text-[#0B4036] hover:text-[#CE5B40] transition-colors"
                  >
                    View All Notifications & Activity →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Doctor Profile Badge & Refined Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsProfileOpen(!isProfileOpen);
                setIsNotifOpen(false);
              }}
              className="flex items-center gap-2 p-1 rounded-lg hover:bg-[#FAF8F5] border border-transparent hover:border-[#0B4036]/10 transition-colors focus:outline-none"
              aria-label="Clinician profile and account settings"
            >
              <div className="relative">
                <img
                  src={doctor.profilePhotoUrl}
                  alt={doctor.name}
                  className="w-8 h-8 rounded-lg object-cover border border-[#0B4036]/15"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-600 ring-2 ring-white" />
              </div>
              <div className="text-left hidden sm:block">
                <span className="text-xs font-bold text-[#0B4036] block leading-tight">{doctor.name}</span>
                <span className="text-[10px] font-mono text-gray-500">{doctor.id}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-[#0B4036]/10 rounded-xl shadow-lg p-4 z-50 animate-in fade-in-50 zoom-in-95 duration-150">
                <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                  <img
                    src={doctor.profilePhotoUrl}
                    alt={doctor.name}
                    className="w-12 h-12 rounded-lg object-cover border border-[#0B4036]/15"
                  />
                  <div>
                    <h4 className="font-serif font-bold text-sm text-[#0B4036]">{doctor.name}</h4>
                    <p className="text-[11px] text-gray-500">{doctor.credentials}</p>
                    <span className="inline-block mt-0.5 text-[10px] font-mono font-bold bg-[#FAF8F5] text-[#0B4036] px-1.5 py-0.5 rounded border border-[#0B4036]/10">
                      ID: {doctor.id}
                    </span>
                  </div>
                </div>

                <div className="py-3 text-xs space-y-1.5 text-gray-600 border-b border-gray-100">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Specialty:</span>
                    <span className="font-medium text-[#0B4036]">{doctor.specialization}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Reg No:</span>
                    <span className="font-medium text-[#0B4036]">{doctor.medicalRegistrationNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Role:</span>
                    <span className="font-medium text-[#0B4036] capitalize">{doctor.role.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Timezone:</span>
                    <span className="font-medium text-gray-700">{doctor.timezone}</span>
                  </div>
                </div>

                <div className="pt-3 space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileOpen(false);
                      onNavigateTab('availability');
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-[#0B4036] hover:bg-[#FAF8F5] rounded-lg transition-colors flex items-center justify-between"
                  >
                    <span>Manage My Schedule</span>
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileOpen(false);
                      onOpenAuditLogs();
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-[#0B4036] hover:bg-[#FAF8F5] rounded-lg transition-colors flex items-center justify-between"
                  >
                    <span>View Audit Records</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-gray-400" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileOpen(false);
                      onLogout();
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 rounded-lg transition-colors flex items-center justify-between"
                  >
                    <span>Sign Out</span>
                    <LogOut className="w-3.5 h-3.5 text-rose-600" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
