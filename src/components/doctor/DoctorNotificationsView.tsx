import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  Clock,
  FileCheck,
  AlertCircle,
  Trash2,
  Calendar,
  User,
  Filter,
} from 'lucide-react';
import { Doctor, DoctorNotification } from '../../types/doctorPortal';
import { doctorPortalService } from '../../services/doctorPortalService';

interface DoctorNotificationsViewProps {
  doctor: Doctor;
  notifications: DoctorNotification[];
  onNotificationUpdated: () => void;
  onNavigateTab: (tab: string) => void;
}

export const DoctorNotificationsView: React.FC<DoctorNotificationsViewProps> = ({
  doctor,
  notifications,
  onNotificationUpdated,
  onNavigateTab,
}) => {
  const [filterUnreadOnly, setFilterUnreadOnly] = useState(false);

  const filtered = notifications.filter((n) => {
    if (filterUnreadOnly && n.read) return false;
    return true;
  });

  const handleMarkRead = (id: string) => {
    doctorPortalService.markNotificationAsRead(id);
    onNotificationUpdated();
  };

  const handleDismiss = (id: string) => {
    doctorPortalService.dismissNotification(id);
    onNotificationUpdated();
  };

  const handleMarkAllRead = () => {
    doctorPortalService.markAllNotificationsAsRead(doctor.id);
    onNotificationUpdated();
  };

  const getPriorityBadge = (p: DoctorNotification['priority']) => {
    switch (p) {
      case 'urgent':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200">
            Urgent
          </span>
        );
      case 'normal':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E4ECE6] text-[#0B4036] border border-[#8DAA9D]/30">
            Standard
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-50 text-gray-700 border border-gray-200">
            Notice
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 sm:p-6 rounded-xl border border-[#0B4036]/10 shadow-[0_1px_3px_rgba(11,64,54,0.02)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#CE5B40]">
            Clinical In-Tray
          </span>
          <h1 className="font-serif text-2xl font-bold text-[#0B4036] tracking-tight">Alerts & System Notifications</h1>
          <p className="text-xs text-[#556B64] mt-0.5">
            Real-time feed of patient document uploads, appointment triage requests, and procedural scheduling notices.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => setFilterUnreadOnly(!filterUnreadOnly)}
            className={`px-3 py-1.5 rounded-lg font-semibold border transition-colors ${
              filterUnreadOnly
                ? 'bg-[#0B4036] text-white border-[#0B4036] shadow-2xs'
                : 'bg-[#FAF8F5] text-[#556B64] border-[#0B4036]/15 hover:border-[#0B4036]'
            }`}
          >
            {filterUnreadOnly ? 'Showing Unread Only' : 'Show Unread Only'}
          </button>
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="px-3 py-1.5 bg-[#FAF8F5] hover:bg-[#E4ECE6] text-[#0B4036] font-semibold rounded-lg border border-[#0B4036]/15 transition-colors"
          >
            Mark All Read
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl border border-[#0B4036]/10 shadow-[0_1px_3px_rgba(11,64,54,0.02)] p-4 divide-y divide-[#E4ECE6]/70">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-xs text-[#556B64]">
            <Bell className="w-8 h-8 mx-auto mb-2 text-[#8DAA9D] opacity-60" />
            <p className="font-semibold text-[#0B4036]">No notifications match your current filter.</p>
          </div>
        ) : (
          filtered.map((n) => (
            <div
              key={n.id}
              className={`py-3.5 px-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-colors ${
                !n.read ? 'bg-[#FAF8F5]/60' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                    !n.read ? 'bg-[#CE5B40]' : 'bg-gray-300'
                  }`}
                />
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h4 className="font-serif font-bold text-sm text-[#0B4036]">{n.title}</h4>
                    {getPriorityBadge(n.priority)}
                  </div>
                  <p className="text-[11px] text-[#556B64] leading-relaxed">{n.message}</p>
                  <span className="text-[10px] text-gray-400 font-mono mt-1 block">
                    {new Date(n.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                {!n.read && (
                  <button
                    type="button"
                    onClick={() => handleMarkRead(n.id)}
                    className="px-2.5 py-1 text-[11px] font-semibold bg-[#E4ECE6] text-[#0B4036] hover:bg-[#0B4036] hover:text-white rounded-md transition-colors"
                  >
                    Mark Read
                  </button>
                )}
                {n.relatedEntity && (
                  <button
                    type="button"
                    onClick={() => {
                      handleMarkRead(n.id);
                      if (n.relatedEntity?.type === 'appointment') onNavigateTab('calendar');
                      else if (n.relatedEntity?.type === 'document') onNavigateTab('documents');
                    }}
                    className="px-2.5 py-1 text-[11px] font-semibold text-[#0B4036] bg-[#FAF8F5] border border-[#0B4036]/15 hover:bg-[#E4ECE6] rounded-md transition-colors"
                  >
                    View Item →
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleDismiss(n.id)}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  title="Dismiss alert"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
