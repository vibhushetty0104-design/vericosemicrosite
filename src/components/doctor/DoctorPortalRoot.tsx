import React, { useState, useEffect, useCallback } from 'react';
import { DoctorLogin } from './DoctorLogin';
import { DoctorHeader } from './DoctorHeader';
import { DoctorSidebar, DoctorTabKey } from './DoctorSidebar';
import { DoctorDashboardView } from './DoctorDashboardView';
import { DoctorCalendarView } from './DoctorCalendarView';
import { DoctorPatientsView } from './DoctorPatientsView';
import { DoctorPatientProfileModal } from './DoctorPatientProfileModal';
import { DoctorDocumentsView } from './DoctorDocumentsView';
import { DoctorClinicalNotesView } from './DoctorClinicalNotesView';
import { DoctorPastAppointmentsView } from './DoctorPastAppointmentsView';
import { DoctorAvailabilityView } from './DoctorAvailabilityView';
import { DoctorNotificationsView } from './DoctorNotificationsView';
import { DoctorAppointmentModal } from './DoctorAppointmentModal';
import { DoctorRescheduleModal } from './DoctorRescheduleModal';
import { DoctorAppointmentDetailModal } from './DoctorAppointmentDetailModal';
import { DoctorAuditLogsModal } from './DoctorAuditLogsModal';
import { doctorPortalService } from '../../services/doctorPortalService';
import {
  Doctor,
  DoctorSession,
  ClinicalAppointment,
  PatientRecord,
  PatientDocument,
  ClinicalNote,
  DoctorNotification,
} from '../../types/doctorPortal';

interface DoctorPortalRootProps {
  onNavigateHome: () => void;
}

export const DoctorPortalRoot: React.FC<DoctorPortalRootProps> = ({ onNavigateHome }) => {
  const [activeSession, setActiveSession] = useState<DoctorSession | null>(() =>
    doctorPortalService.getActiveSession()
  );
  const [activeDoctor, setActiveDoctor] = useState<Doctor | null>(() => {
    const s = doctorPortalService.getActiveSession();
    return s ? doctorPortalService.getDoctorById(s.doctorId) || null : null;
  });

  const [activeTab, setActiveTab] = useState<DoctorTabKey>('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Synchronized clinical data
  const [appointments, setAppointments] = useState<ClinicalAppointment[]>([]);
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [documents, setDocuments] = useState<PatientDocument[]>([]);
  const [clinicalNotes, setClinicalNotes] = useState<ClinicalNote[]>([]);
  const [notifications, setNotifications] = useState<DoctorNotification[]>([]);

  // Modals
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [scheduleInitialDate, setScheduleInitialDate] = useState<string | undefined>(undefined);
  const [scheduleInitialPatientId, setScheduleInitialPatientId] = useState<string | undefined>(undefined);

  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [rescheduleTargetAppointment, setRescheduleTargetAppointment] = useState<ClinicalAppointment | null>(null);

  const [isAppointmentDetailOpen, setIsAppointmentDetailOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<ClinicalAppointment | null>(null);

  const [isPatientProfileOpen, setIsPatientProfileOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(null);

  const [isAuditLogsOpen, setIsAuditLogsOpen] = useState(false);

  // Document upload target patient shortcut
  const [uploadDocumentInitialPatientId, setUploadDocumentInitialPatientId] = useState<string | undefined>(undefined);

  // Refresh all state from service
  const refreshData = useCallback(() => {
    if (!activeDoctor) return;
    setAppointments(doctorPortalService.getAppointments({ doctorId: activeDoctor.id }));
    setPatients(doctorPortalService.getPatients());
    setDocuments(doctorPortalService.getDocuments());
    setClinicalNotes(doctorPortalService.getClinicalNotes({ doctorId: activeDoctor.id }));
    setNotifications(doctorPortalService.getNotifications(activeDoctor.id));
  }, [activeDoctor]);

  useEffect(() => {
    if (activeDoctor) {
      refreshData();
    }
  }, [activeDoctor, refreshData]);

  const handleLoginSuccess = (doc: Doctor, session: DoctorSession) => {
    setActiveDoctor(doc);
    setActiveSession(session);
    setActiveTab('overview');
  };

  const handleLogout = useCallback(() => {
    doctorPortalService.logout();
    setActiveSession(null);
    setActiveDoctor(null);
  }, []);

  // Modal Triggers
  const handleOpenScheduleModal = (initialDate?: string, initialPatientId?: string) => {
    setScheduleInitialDate(initialDate);
    setScheduleInitialPatientId(initialPatientId);
    setIsScheduleModalOpen(true);
  };

  const handleOpenRescheduleModal = (appt: ClinicalAppointment) => {
    setRescheduleTargetAppointment(appt);
    setIsRescheduleModalOpen(true);
  };

  const handleOpenAppointmentDetail = (appt: ClinicalAppointment) => {
    setSelectedAppointment(appt);
    setIsAppointmentDetailOpen(true);
  };

  const handleOpenPatientProfile = (patientId: string) => {
    const p = doctorPortalService.getPatientById(patientId);
    if (p) {
      setSelectedPatient(p);
      setIsPatientProfileOpen(true);
      // Record access in audit log
      if (activeDoctor) {
        doctorPortalService.recordAudit({
          doctorId: activeDoctor.id,
          doctorName: activeDoctor.name,
          action: 'VIEW_PATIENT_RECORD',
          entityType: 'Patient',
          entityId: p.id,
          details: `Clinician opened electronic medical record of ${p.name} (${p.id}).`,
        });
      }
    }
  };

  const handleOpenClinicalNoteDraft = (appointmentId: string, patientId: string) => {
    setActiveTab('notes');
    // Pre-select patient / appointment in notes view
    refreshData();
  };

  const handleOpenUploadDocument = (patientId: string) => {
    setUploadDocumentInitialPatientId(patientId);
    setActiveTab('documents');
  };

  // If unauthenticated or no active session, show Login page
  if (!activeSession || !activeDoctor) {
    return <DoctorLogin onLoginSuccess={handleLoginSuccess} onNavigateHome={onNavigateHome} />;
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppointmentsCount = appointments.filter((a) => a.date === todayStr).length;
  const pendingReviewsCount = documents.filter((d) => d.reviewStatus === 'Pending Review').length;
  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-[#F7F5EF] flex flex-col text-[#0B4036] antialiased selection:bg-[#0B4036] selection:text-white">
      {/* Top Header */}
      <DoctorHeader
        doctor={activeDoctor}
        session={activeSession}
        unreadNotificationCount={unreadNotificationsCount}
        onLogout={handleLogout}
        onOpenAuditLogs={() => setIsAuditLogsOpen(true)}
        onNavigateTab={(tab) => {
          setActiveTab(tab as DoctorTabKey);
          setIsMobileSidebarOpen(false);
        }}
        onToggleMobileMenu={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        isMobileMenuOpen={isMobileSidebarOpen}
      />

      {/* Main Workspace Body with Sidebar */}
      <div className="flex-1 flex overflow-hidden min-w-0">
        {/* Desktop & Mobile Responsive Sidebar */}
        <DoctorSidebar
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setIsMobileSidebarOpen(false);
          }}
          doctor={activeDoctor}
          counts={{
            todayAppointments: todayAppointmentsCount,
            pendingReviews: pendingReviewsCount,
            unreadNotifications: unreadNotificationsCount,
          }}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          onNavigateHome={onNavigateHome}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Central Workspace Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 min-w-0">
          <div className="max-w-7xl mx-auto space-y-6">
            {activeTab === 'overview' && (
              <DoctorDashboardView
                doctor={activeDoctor}
                appointments={appointments}
                documents={documents}
                notifications={notifications}
                onOpenScheduleModal={() => handleOpenScheduleModal()}
                onSelectAppointment={handleOpenAppointmentDetail}
                onOpenPatientProfile={handleOpenPatientProfile}
                onOpenClinicalNoteDraft={handleOpenClinicalNoteDraft}
                onNavigateTab={(t) => setActiveTab(t as DoctorTabKey)}
              />
            )}

            {activeTab === 'calendar' && (
              <DoctorCalendarView
                doctor={activeDoctor}
                appointments={appointments}
                onOpenScheduleModal={(d) => handleOpenScheduleModal(d)}
                onSelectAppointment={handleOpenAppointmentDetail}
              />
            )}

            {activeTab === 'patients' && (
              <DoctorPatientsView
                doctor={activeDoctor}
                patients={patients}
                onOpenPatientProfile={handleOpenPatientProfile}
                onOpenScheduleModal={(pId) => handleOpenScheduleModal(undefined, pId)}
              />
            )}

            {activeTab === 'documents' && (
              <DoctorDocumentsView
                doctor={activeDoctor}
                patients={patients}
                documents={documents}
                initialUploadPatientId={uploadDocumentInitialPatientId}
                onDocumentUploaded={() => refreshData()}
                onDocumentStatusUpdated={() => refreshData()}
              />
            )}

            {activeTab === 'notes' && (
              <DoctorClinicalNotesView
                doctor={activeDoctor}
                patients={patients}
                appointments={appointments}
                notes={clinicalNotes}
                onNoteCreatedOrUpdated={() => refreshData()}
              />
            )}

            {activeTab === 'past-appointments' && (
              <DoctorPastAppointmentsView
                doctor={activeDoctor}
                patients={patients}
                appointments={appointments}
                onSelectAppointment={handleOpenAppointmentDetail}
                onOpenPatientProfile={handleOpenPatientProfile}
              />
            )}

            {activeTab === 'availability' && (
              <DoctorAvailabilityView
                doctor={activeDoctor}
                onAvailabilityUpdated={() => refreshData()}
              />
            )}

            {activeTab === 'notifications' && (
              <DoctorNotificationsView
                doctor={activeDoctor}
                notifications={notifications}
                onNotificationUpdated={() => refreshData()}
                onNavigateTab={(t) => setActiveTab(t as DoctorTabKey)}
              />
            )}
          </div>
        </main>
      </div>

      {/* SCHEDULE APPOINTMENT MODAL */}
      <DoctorAppointmentModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        doctor={activeDoctor}
        patients={patients}
        initialDate={scheduleInitialDate}
        initialPatientId={scheduleInitialPatientId}
        onAppointmentCreated={(appt) => {
          refreshData();
          handleOpenAppointmentDetail(appt);
        }}
      />

      {/* RESCHEDULE APPOINTMENT MODAL */}
      <DoctorRescheduleModal
        isOpen={isRescheduleModalOpen}
        onClose={() => setIsRescheduleModalOpen(false)}
        doctor={activeDoctor}
        appointment={rescheduleTargetAppointment}
        onAppointmentRescheduled={() => refreshData()}
      />

      {/* APPOINTMENT DETAIL INSPECTOR DRAWER */}
      <DoctorAppointmentDetailModal
        isOpen={isAppointmentDetailOpen}
        onClose={() => setIsAppointmentDetailOpen(false)}
        appointment={selectedAppointment}
        doctor={activeDoctor}
        onOpenReschedule={handleOpenRescheduleModal}
        onOpenPatientProfile={handleOpenPatientProfile}
        onOpenClinicalNoteDraft={handleOpenClinicalNoteDraft}
        onAppointmentUpdated={(updated) => {
          setSelectedAppointment(updated);
          refreshData();
        }}
      />

      {/* PATIENT PROFILE INSPECTOR MODAL */}
      <DoctorPatientProfileModal
        isOpen={isPatientProfileOpen}
        onClose={() => setIsPatientProfileOpen(false)}
        patient={selectedPatient}
        doctor={activeDoctor}
        onOpenScheduleModal={(pId) => handleOpenScheduleModal(undefined, pId)}
        onOpenUploadDocument={handleOpenUploadDocument}
        onOpenClinicalNoteDraft={handleOpenClinicalNoteDraft}
        onSelectDocument={() => {
          setActiveTab('documents');
        }}
      />

      {/* AUDIT LOGS INSPECTOR MODAL */}
      <DoctorAuditLogsModal
        isOpen={isAuditLogsOpen}
        onClose={() => setIsAuditLogsOpen(false)}
        doctor={activeDoctor}
      />
    </div>
  );
};
