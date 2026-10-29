import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  UserCheck,
  CalendarPlus,
  FileSpreadsheet,
  Stethoscope,
  Download,
  Upload,
  Bell,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export const Navbar: React.FC<{
  onOpenRegisterModal: () => void;
  onOpenBookAppointmentModal: () => void;
}> = ({ onOpenRegisterModal, onOpenBookAppointmentModal }) => {
  const {
    currentRole,
    setCurrentRole,
    activeView,
    setActiveView,
    currentStaff,
    tasks,
    appointments,
    exportDatabaseBackup,
    importDatabaseBackup,
    resetAllData,
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [backupJsonInput, setBackupJsonInput] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const pendingTasksCount = tasks.filter((t) => !t.isCompleted).length;
  const todayAptsCount = appointments.filter((a) => a.date === '2026-10-29').length;

  const handleImportSubmit = () => {
    if (!backupJsonInput.trim()) return;
    const success = importDatabaseBackup(backupJsonInput);
    if (success) {
      setImportStatus('Backup restored successfully!');
      setTimeout(() => {
        setShowBackupModal(false);
        setImportStatus(null);
        setBackupJsonInput('');
      }, 1200);
    } else {
      setImportStatus('Error: Invalid JSON backup file.');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E5E5DF] px-4 lg:px-6 py-2.5 transition-all">
        <div className="flex items-center justify-between gap-4">
          {/* Zone 1: Brand & Current Section */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveView('dashboard')}
              className="flex items-center gap-2.5 text-left group focus-visible:outline-none"
            >
              <div className="w-8 h-8 rounded-lg bg-[#1B4332] text-white flex items-center justify-center font-bold text-base tracking-wider shadow-sm group-hover:bg-[#2D6A4F] transition-colors">
                M
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold tracking-tight text-[#1B4332] whitespace-nowrap">
                  MOVEXA <span className="text-[#2D6A4F] font-semibold">Care</span>
                </span>
                <span className="text-[10px] text-[#6B7280] hidden sm:inline whitespace-nowrap">
                  Clinical Physiotherapy & Rehab
                </span>
              </div>
            </button>

            <span className="text-[#D1D5DB] hidden md:inline" aria-hidden="true">|</span>

            {/* Breadcrumb indicator */}
            <div className="hidden md:flex items-center text-xs text-[#4B5563]">
              <span className="capitalize">{activeView.replace('_', ' ')}</span>
            </div>
          </div>

          {/* Zone 2: Role Switcher & Patient Portal Mode */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#F3F4F0] p-1 rounded-lg border border-[#E5E5DF]">
              <span className="text-[11px] font-semibold text-[#4B5563] px-2 hidden lg:inline">
                Role:
              </span>
              <button
                onClick={() => setCurrentRole('admin')}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                  currentRole === 'admin'
                    ? 'bg-[#1B4332] text-white shadow-xs'
                    : 'text-[#4B5563] hover:text-[#111827]'
                }`}
                title="Clinic Owner / Dr. Priyanka Singh - Full clinical, billing & operations access"
              >
                Clinic Owner (Dr. Priyanka)
              </button>
              <button
                onClick={() => setCurrentRole('physio')}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                  currentRole === 'physio'
                    ? 'bg-[#1B4332] text-white shadow-xs'
                    : 'text-[#4B5563] hover:text-[#111827]'
                }`}
                title="Physiotherapist - Clinical assessment, plans & SOAP notes"
              >
                Physiotherapist
              </button>
              <button
                onClick={() => setCurrentRole('reception')}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                  currentRole === 'reception'
                    ? 'bg-[#1B4332] text-white shadow-xs'
                    : 'text-[#4B5563] hover:text-[#111827]'
                }`}
                title="Receptionist - Intake, appointments & billing"
              >
                Receptionist
              </button>
              <button
                onClick={() => {
                  setCurrentRole('patient');
                  setActiveView('patient_portal');
                }}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                  currentRole === 'patient'
                    ? 'bg-[#2D6A4F] text-white shadow-xs'
                    : 'text-[#4B5563] hover:text-[#111827]'
                }`}
                title="Patient Experience - Home exercises & appointment portal"
              >
                Patient Portal
              </button>
            </div>
          </div>

          {/* Zone 3: Quick Action Buttons & Profile */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Quick Actions (Clinician & Reception) */}
            {currentRole !== 'patient' && (
              <div className="hidden sm:flex items-center gap-1.5">
                <button
                  onClick={onOpenRegisterModal}
                  className="px-2.5 py-1.5 text-xs font-medium text-[#1B4332] bg-[#E8F3EE] hover:bg-[#D5EADB] rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Register Patient</span>
                </button>
                <button
                  onClick={onOpenBookAppointmentModal}
                  className="px-2.5 py-1.5 text-xs font-medium text-white bg-[#1B4332] hover:bg-[#2D6A4F] rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-xs"
                >
                  <CalendarPlus className="w-3.5 h-3.5" />
                  <span>Book Appointment</span>
                </button>
              </div>
            )}

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-1.5 text-[#4B5563] hover:text-[#111827] hover:bg-[#F3F4F0] rounded-md relative transition-colors"
                title="Clinical Alerts & Reminders"
              >
                <Bell className="w-4 h-4" />
                {pendingTasksCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#D97706]" />
                )}
              </button>

              {/* Notification Popover */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-[#E5E5DF] rounded-xl shadow-lg p-3 z-50 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-[#F3F4F0]">
                    <span className="font-semibold text-[#111827]">Clinical Notifications</span>
                    <span className="text-[#6B7280]">{pendingTasksCount} Pending</span>
                  </div>
                  <div className="mt-2 space-y-2 max-h-60 overflow-y-auto">
                    {tasks.slice(0, 4).map((t) => (
                      <div
                        key={t.id}
                        className="p-2 rounded-lg bg-[#FAF9F5] border border-[#E5E5DF] flex flex-col gap-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-[#111827] truncate">{t.patientName}</span>
                          <span className="text-[10px] text-[#D97706] font-semibold uppercase">
                            {t.priority}
                          </span>
                        </div>
                        <p className="text-[#4B5563] text-[11px]">{t.title}</p>
                        <span className="text-[10px] text-[#6B7280]">Due: {t.dueDate}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      setActiveView('tasks');
                      setShowNotifications(false);
                    }}
                    className="w-full mt-2 pt-2 border-t border-[#F3F4F0] text-center text-xs font-medium text-[#1B4332] hover:underline"
                  >
                    View All Tasks & Follow-ups →
                  </button>
                </div>
              )}
            </div>

            {/* Backup / Export Menu */}
            <button
              onClick={() => setShowBackupModal(true)}
              className="p-1.5 text-[#4B5563] hover:text-[#111827] hover:bg-[#F3F4F0] rounded-md transition-colors"
              title="Backup & Restore Database"
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Active User Avatar */}
            <div className="flex items-center gap-2 pl-1 border-l border-[#E5E5DF]">
              <img
                src={currentStaff?.avatarUrl || '/src/assets/images/dr_priyanka_singh_1793257507729.jpg'}
                alt="Profile"
                referrerPolicy="no-referrer"
                className="w-7 h-7 rounded-full object-cover border border-[#2D6A4F]/20"
              />
              <div className="hidden xl:flex flex-col text-left">
                <span className="text-xs font-semibold text-[#111827] leading-none">
                  {currentRole === 'admin'
                    ? 'Dr. Priyanka Singh'
                    : currentRole === 'physio'
                    ? 'Dr. Rohan Mehta'
                    : currentRole === 'reception'
                    ? 'Sunita Rao'
                    : 'Rajesh Sharma'}
                </span>
                <span className="text-[10px] text-[#6B7280] leading-none mt-0.5">
                  {currentRole === 'admin'
                    ? 'Clinic Director (MPT)'
                    : currentRole === 'physio'
                    ? 'Sports Physio (MPT)'
                    : currentRole === 'reception'
                    ? 'Reception Desk'
                    : 'Patient UHID-001'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Backup & Restore Modal */}
      {showBackupModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-[#E5E5DF] shadow-xl max-w-md w-full p-6 text-left">
            <h3 className="text-base font-bold text-[#1B4332]">MOVEXA Care Data Management</h3>
            <p className="text-xs text-[#4B5563] mt-1">
              Export complete patient records, assessments, and invoices as JSON, or restore from a previous backup.
            </p>

            <div className="mt-4 space-y-3">
              <div className="p-3 bg-[#FAF9F5] border border-[#E5E5DF] rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-[#111827]">Export Complete Database</h4>
                  <p className="text-[11px] text-[#6B7280]">Download clean JSON backup with all patients & billing</p>
                </div>
                <button
                  onClick={exportDatabaseBackup}
                  className="px-3 py-1.5 text-xs font-medium text-white bg-[#1B4332] hover:bg-[#2D6A4F] rounded-lg flex items-center gap-1.5 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>

              <div className="p-3 bg-[#FAF9F5] border border-[#E5E5DF] rounded-xl">
                <h4 className="text-xs font-semibold text-[#111827] mb-1">Restore from JSON</h4>
                <textarea
                  value={backupJsonInput}
                  onChange={(e) => setBackupJsonInput(e.target.value)}
                  placeholder="Paste JSON backup content here..."
                  className="w-full text-xs font-mono p-2 border border-[#E5E5DF] rounded-lg bg-white h-24 focus:outline-none focus:border-[#1B4332]"
                />
                {importStatus && (
                  <p className={`text-xs mt-1 ${importStatus.includes('Error') ? 'text-red-600' : 'text-emerald-700'}`}>
                    {importStatus}
                  </p>
                )}
                <div className="flex justify-end mt-2">
                  <button
                    onClick={handleImportSubmit}
                    disabled={!backupJsonInput.trim()}
                    className="px-3 py-1.5 text-xs font-medium text-white bg-[#2D6A4F] hover:bg-[#1B4332] disabled:opacity-50 rounded-lg flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Restore Data</span>
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-[#E5E5DF] flex items-center justify-between">
                <button
                  onClick={() => {
                    if (confirm('Reset all demo data back to clean initial state?')) {
                      resetAllData();
                      setShowBackupModal(false);
                    }
                  }}
                  className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Demo Data</span>
                </button>
                <button
                  onClick={() => setShowBackupModal(false)}
                  className="px-4 py-1.5 text-xs font-medium text-[#4B5563] hover:bg-[#F3F4F0] rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
