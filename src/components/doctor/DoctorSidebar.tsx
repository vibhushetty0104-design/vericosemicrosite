import React from 'react';
import {
  LayoutDashboard,
  Calendar,
  Users,
  FolderOpen,
  FileEdit,
  History,
  Clock,
  Bell,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  X,
  Stethoscope,
  ShieldCheck,
} from 'lucide-react';
import { Doctor } from '../../types/doctorPortal';

export type DoctorTabKey =
  | 'overview'
  | 'calendar'
  | 'patients'
  | 'documents'
  | 'notes'
  | 'past-appointments'
  | 'availability'
  | 'notifications';

interface DoctorSidebarProps {
  activeTab: DoctorTabKey;
  onTabChange: (tab: DoctorTabKey) => void;
  doctor: Doctor;
  counts: {
    todayAppointments: number;
    pendingReviews: number;
    unreadNotifications: number;
  };
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onNavigateHome: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const DoctorSidebar: React.FC<DoctorSidebarProps> = ({
  activeTab,
  onTabChange,
  doctor,
  counts,
  isCollapsed,
  onToggleCollapse,
  onNavigateHome,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const navItems: {
    key: DoctorTabKey;
    label: string;
    icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
    badge?: number;
    badgeVariant?: 'primary' | 'attention';
  }[] = [
    { key: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
    {
      key: 'calendar',
      label: 'Appointment Calendar',
      icon: Calendar,
      badge: counts.todayAppointments > 0 ? counts.todayAppointments : undefined,
      badgeVariant: 'primary',
    },
    { key: 'patients', label: 'Patient Directory', icon: Users },
    {
      key: 'documents',
      label: 'Medical Documents',
      icon: FolderOpen,
      badge: counts.pendingReviews > 0 ? counts.pendingReviews : undefined,
      badgeVariant: 'attention',
    },
    { key: 'notes', label: 'Clinical Notes', icon: FileEdit },
    { key: 'past-appointments', label: 'Consultation History', icon: History },
    { key: 'availability', label: 'Doctor Availability', icon: Clock },
    {
      key: 'notifications',
      label: 'Notifications',
      icon: Bell,
      badge: counts.unreadNotifications > 0 ? counts.unreadNotifications : undefined,
      badgeVariant: 'attention',
    },
  ];

  const renderNavList = (mobile = false) => (
    <nav className="space-y-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.key;
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => {
              onTabChange(item.key);
              if (mobile && onCloseMobile) {
                onCloseMobile();
              }
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 ${
              isActive
                ? 'bg-[#0B4036] text-white shadow-2xs font-semibold'
                : 'text-[#2D453C] hover:bg-[#FAF8F5] hover:text-[#0B4036]'
            } ${!mobile && isCollapsed ? 'justify-center px-2' : ''}`}
            title={!mobile && isCollapsed ? item.label : undefined}
          >
            <Icon
              className={`w-4 h-4 shrink-0 transition-colors ${
                isActive ? 'text-[#E4ECE6]' : 'text-[#8DAA9D]'
              }`}
              strokeWidth={1.75}
            />
            {(mobile || !isCollapsed) && (
              <span className="flex-1 text-left truncate tracking-tight">{item.label}</span>
            )}
            {(mobile || !isCollapsed) && item.badge !== undefined && (
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold leading-none ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : item.badgeVariant === 'attention'
                    ? 'bg-[#CE5B40]/10 text-[#CE5B40]'
                    : 'bg-[#0B4036]/10 text-[#0B4036]'
                }`}
              >
                {item.badge}
              </span>
            )}
            {!mobile && isCollapsed && item.badge !== undefined && (
              <span
                className={`w-2 h-2 rounded-full absolute top-2 right-2 ${
                  item.badgeVariant === 'attention' ? 'bg-[#CE5B40]' : 'bg-[#0B4036]'
                }`}
              />
            )}
          </button>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Mobile Off-Canvas Drawer Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 lg:hidden transition-opacity"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Mobile Off-Canvas Drawer */}
      {isMobileOpen && (
        <aside className="fixed inset-y-0 left-0 w-72 bg-white shadow-2xl z-50 lg:hidden flex flex-col justify-between p-4 border-r border-[#0B4036]/10 animate-in slide-in-from-left duration-200">
          <div>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#0B4036]/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#0B4036] text-white flex items-center justify-center">
                  <Stethoscope className="w-4 h-4 text-[#E4ECE6]" />
                </div>
                <div>
                  <h3 className="font-serif text-sm font-bold text-[#0B4036] leading-none">
                    Meridian Vascular
                  </h3>
                  <span className="text-[10px] text-gray-500 font-mono">Workstation</span>
                </div>
              </div>
              <button
                type="button"
                onClick={onCloseMobile}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close navigation drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-[10px] uppercase font-bold tracking-wider text-gray-400 px-2 mb-2">
              Clinical Navigation
            </div>
            {renderNavList(true)}
          </div>

          <div className="pt-4 border-t border-[#0B4036]/10 space-y-2">
            <button
              type="button"
              onClick={() => {
                if (onCloseMobile) onCloseMobile();
                onNavigateHome();
              }}
              className="w-full flex items-center gap-2.5 p-2 rounded-lg text-xs font-semibold text-[#556B64] hover:text-[#0B4036] hover:bg-[#FAF8F5] transition-colors"
            >
              <ExternalLink className="w-4 h-4 text-[#8DAA9D]" />
              <span>Public Patient Site</span>
            </button>
            <div className="p-2.5 bg-[#FAF8F5] rounded-lg border border-[#0B4036]/10 text-[10px] text-[#556B64]">
              <span className="font-semibold text-[#0B4036] block">Indiranagar Vascular Centre</span>
              <span>EMR Node: BLR-VAS-01</span>
            </div>
          </div>
        </aside>
      )}

      {/* Desktop Sticky/Collapsible Sidebar */}
      <aside
        className={`hidden lg:flex flex-col justify-between bg-white border-r border-[#0B4036]/10 transition-all duration-200 shrink-0 select-none ${
          isCollapsed ? 'w-16' : 'w-60'
        }`}
      >
        {/* Navigation List */}
        <div className="py-4">
          <div
            className={`px-3 mb-3 flex items-center ${
              isCollapsed ? 'justify-center' : 'justify-between'
            }`}
          >
            {!isCollapsed && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8DAA9D] px-1">
                Clinical Workspace
              </span>
            )}
            <button
              type="button"
              onClick={onToggleCollapse}
              className="p-1 rounded-md text-[#8DAA9D] hover:text-[#0B4036] hover:bg-[#FAF8F5] transition-colors"
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          </div>

          <div className="px-2">{renderNavList(false)}</div>
        </div>

        {/* Bottom Switcher & Node Footnote */}
        <div className="p-3 border-t border-[#0B4036]/10 space-y-2">
          <button
            type="button"
            onClick={onNavigateHome}
            className={`w-full flex items-center gap-2.5 p-2 rounded-lg text-xs font-semibold text-[#556B64] hover:text-[#0B4036] hover:bg-[#FAF8F5] transition-colors ${
              isCollapsed ? 'justify-center' : ''
            }`}
            title="Exit Doctor Portal & View Patient Site"
          >
            <ExternalLink className="w-4 h-4 shrink-0 text-[#8DAA9D]" />
            {!isCollapsed && <span className="truncate">Public Patient Site</span>}
          </button>

          {!isCollapsed && (
            <div className="p-2.5 bg-[#FAF8F5] rounded-lg border border-[#0B4036]/10 text-[10px] text-[#556B64] leading-normal">
              <span className="font-semibold text-[#0B4036] block">Hospital EMR Station</span>
              <span className="font-mono text-gray-400">Node: BLR-VAS-01 · Active</span>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
