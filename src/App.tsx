/**
 * MOVEXA Care - Clinical Physiotherapy Management Web App
 * Lead Clinician: Dr. Priyanka Singh, MPT (MSK & Sports)
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { OverviewDashboard } from './components/dashboard/OverviewDashboard';
import { PatientManagement } from './components/patients/PatientManagement';
import { EnquiriesAndReferrals } from './components/enquiries/EnquiriesAndReferrals';
import { AppointmentsView } from './components/appointments/AppointmentsView';
import { ClinicalAssessmentBuilder } from './components/assessments/ClinicalAssessmentBuilder';
import { TreatmentPlanBuilder } from './components/treatment/TreatmentPlanBuilder';
import { TreatmentSessions } from './components/sessions/TreatmentSessions';
import { HomeExerciseProgram } from './components/exercises/HomeExerciseProgram';
import { RecoveryTimeline } from './components/outcomes/RecoveryTimeline';
import { DischargeSummaryView } from './components/discharge/DischargeSummaryView';
import { TasksAndFollowUps } from './components/tasks/TasksAndFollowUps';
import { BillingAndRevenue } from './components/billing/BillingAndRevenue';
import { StaffAndSettings } from './components/staff/StaffAndSettings';
import { PreAssessmentForm } from './components/intake/PreAssessmentForm';
import { PatientPortal } from './components/patient-portal/PatientPortal';
import { RegisterPatientModal } from './components/modals/RegisterPatientModal';
import { BookAppointmentModal } from './components/modals/BookAppointmentModal';

const AppContent: React.FC = () => {
  const { activeView, currentRole } = useApp();

  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#1F2937] flex flex-col">
      {/* Top Navigation */}
      <Navbar
        onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
        onOpenBookAppointmentModal={() => setIsBookModalOpen(true)}
      />

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Clinician Sidebar (Hidden if in dedicated patient view or patient role) */}
        {currentRole !== 'patient' && activeView !== 'patient_portal' && <Sidebar />}

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {activeView === 'dashboard' && (
              <OverviewDashboard
                onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
                onOpenBookAppointmentModal={() => setIsBookModalOpen(true)}
              />
            )}
            {activeView === 'patients' && (
              <PatientManagement
                onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
              />
            )}
            {activeView === 'enquiries' && (
              <EnquiriesAndReferrals
                onOpenBookAppointmentModal={() => setIsBookModalOpen(true)}
              />
            )}
            {activeView === 'appointments' && (
              <AppointmentsView
                onOpenBookAppointmentModal={() => setIsBookModalOpen(true)}
              />
            )}
            {activeView === 'assessments' && <ClinicalAssessmentBuilder />}
            {activeView === 'treatment_plans' && <TreatmentPlanBuilder />}
            {activeView === 'sessions' && <TreatmentSessions />}
            {activeView === 'exercises' && <HomeExerciseProgram />}
            {(activeView === 'recovery_timeline' || activeView === 'outcomes') && (
              <RecoveryTimeline />
            )}
            {activeView === 'discharge' && <DischargeSummaryView />}
            {activeView === 'tasks' && <TasksAndFollowUps />}
            {activeView === 'billing' && <BillingAndRevenue />}
            {activeView === 'staff' && <StaffAndSettings />}
            {activeView === 'pre_assessment' && <PreAssessmentForm />}
            {activeView === 'patient_portal' && <PatientPortal />}
          </div>
        </main>
      </div>

      {/* Global Modals */}
      <RegisterPatientModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />
      <BookAppointmentModal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
