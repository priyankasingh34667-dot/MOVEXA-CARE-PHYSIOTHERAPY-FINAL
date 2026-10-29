import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  Users,
  Inbox,
  AlertCircle,
  FileCheck2,
  ReceiptIndianRupee,
  Clock,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  CheckCircle,
  UserCheck,
  CalendarPlus,
  Activity,
  FileText,
  AlertTriangle,
} from 'lucide-react';

export const OverviewDashboard: React.FC<{
  onOpenRegisterModal: () => void;
  onOpenBookAppointmentModal: () => void;
}> = ({ onOpenRegisterModal, onOpenBookAppointmentModal }) => {
  const {
    patients,
    appointments,
    enquiries,
    tasks,
    invoices,
    sessionNotes,
    setActiveView,
    setSelectedPatientId,
    updateAppointmentStatus,
  } = useApp();

  const todayStr = '2026-10-29';
  const todayAppointments = appointments.filter((a) => a.date === todayStr);
  const activePatients = patients.filter((p) => p.status === 'in_rehab' || p.status === 'active');
  const newEnquiries = enquiries.filter((e) => e.status === 'new');
  const reassessmentTasks = tasks.filter((t) => t.taskType === 'reassessment_due' && !t.isCompleted);
  const missedTasks = tasks.filter((t) => t.taskType === 'missed_call' && !t.isCompleted);
  const adherenceAlerts = tasks.filter((t) => t.taskType === 'exercise_review' && !t.isCompleted);

  // Revenue metrics
  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
  const outstandingRevenue = invoices.reduce(
    (sum, inv) => sum + (inv.totalAmount - inv.paidAmount),
    0
  );

  return (
    <div className="space-y-6">
      {/* Clinic Header Banner with Dr. Priyanka Singh */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1B4332] to-[#2D6A4F] text-white p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#A3E4D7] mb-1">
              <span>MOVEXA Physiotherapy</span>
              <span>·</span>
              <span>Lead: Dr. Priyanka Singh, MPT</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight">
              Clinician Executive Dashboard
            </h1>
            <p className="text-sm text-white/80 mt-1 max-w-xl">
              Clinical intelligence. Personalised rehabilitation. Measurable recovery.
            </p>
          </div>

          {/* Quick Actions Strip */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onOpenRegisterModal}
              className="px-3.5 py-2 text-xs font-semibold bg-white text-[#1B4332] hover:bg-[#FAF9F5] rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Register Patient</span>
            </button>
            <button
              onClick={() => setActiveView('assessments')}
              className="px-3.5 py-2 text-xs font-semibold bg-[#52B788] text-white hover:bg-[#40916C] rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>New Assessment</span>
            </button>
            <button
              onClick={onOpenBookAppointmentModal}
              className="px-3.5 py-2 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center gap-1.5 border border-white/20"
            >
              <CalendarPlus className="w-3.5 h-3.5" />
              <span>Book Appointment</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {/* Today's Appointments */}
        <div className="bg-white p-4 rounded-xl border border-[#E5E5DF] text-left">
          <div className="flex items-center justify-between text-[#6B7280] text-xs">
            <span>Today's Schedule</span>
            <Calendar className="w-4 h-4 text-[#1B4332]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[#111827] tabular-nums">
            {todayAppointments.length}
          </div>
          <div className="mt-1 text-[11px] text-[#4B5563]">
            {todayAppointments.filter((a) => a.status === 'completed').length} completed · {todayAppointments.filter((a) => a.status === 'checked_in').length} in clinic
          </div>
        </div>

        {/* Active Patients */}
        <div className="bg-white p-4 rounded-xl border border-[#E5E5DF] text-left">
          <div className="flex items-center justify-between text-[#6B7280] text-xs">
            <span>Active Rehab Cohort</span>
            <Users className="w-4 h-4 text-[#2D6A4F]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[#111827] tabular-nums">
            {activePatients.length}
          </div>
          <div className="mt-1 text-[11px] text-[#4B5563]">
            Across knee, spine & shoulder
          </div>
        </div>

        {/* New Enquiries */}
        <div className="bg-white p-4 rounded-xl border border-[#E5E5DF] text-left">
          <div className="flex items-center justify-between text-[#6B7280] text-xs">
            <span>New Enquiries</span>
            <Inbox className="w-4 h-4 text-[#D97706]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[#111827] tabular-nums">
            {newEnquiries.length}
          </div>
          <button
            onClick={() => setActiveView('enquiries')}
            className="mt-1 text-[11px] text-[#1B4332] font-medium hover:underline text-left block"
          >
            Review leads →
          </button>
        </div>

        {/* Reassessment Due */}
        <div className="bg-white p-4 rounded-xl border border-[#E5E5DF] text-left">
          <div className="flex items-center justify-between text-[#6B7280] text-xs">
            <span>Due for Reassessment</span>
            <AlertCircle className="w-4 h-4 text-[#2563EB]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[#111827] tabular-nums">
            {reassessmentTasks.length}
          </div>
          <div className="mt-1 text-[11px] text-[#4B5563]">
            Milestone reviews pending
          </div>
        </div>

        {/* Adherence & Missed Alerts */}
        <div className="bg-white p-4 rounded-xl border border-[#E5E5DF] text-left">
          <div className="flex items-center justify-between text-[#6B7280] text-xs">
            <span>Adherence & Recalls</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[#111827] tabular-nums">
            {missedTasks.length + adherenceAlerts.length}
          </div>
          <button
            onClick={() => setActiveView('tasks')}
            className="mt-1 text-[11px] text-[#1B4332] font-medium hover:underline text-left block"
          >
            Follow-up tasks →
          </button>
        </div>

        {/* Monthly Revenue */}
        <div className="bg-white p-4 rounded-xl border border-[#E5E5DF] text-left">
          <div className="flex items-center justify-between text-[#6B7280] text-xs">
            <span>Revenue Collected</span>
            <ReceiptIndianRupee className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[#111827] tabular-nums">
            ₹{totalRevenue.toLocaleString()}
          </div>
          <div className="mt-1 text-[11px] text-[#4B5563]">
            ₹{outstandingRevenue.toLocaleString()} pending
          </div>
        </div>
      </div>

      {/* Main Dual-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Today's Schedule & Attendance Queue */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Appointments Card */}
          <div className="bg-white rounded-xl border border-[#E5E5DF] p-5 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-[#F3F4F0]">
              <div>
                <h3 className="text-sm font-bold text-[#111827]">
                  Today's Appointments & Clinical Queue
                </h3>
                <p className="text-xs text-[#6B7280]">
                  Thursday, 29 October 2026 · Supervised by Dr. Priyanka Singh & Team
                </p>
              </div>
              <button
                onClick={() => setActiveView('appointments')}
                className="text-xs font-semibold text-[#1B4332] hover:underline"
              >
                View Full Calendar →
              </button>
            </div>

            <div className="divide-y divide-[#F3F4F0] mt-1">
              {todayAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#FAF9F5] rounded-lg px-2 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="px-2.5 py-1.5 bg-[#F3F4F0] rounded-md text-xs font-semibold text-[#111827] tabular-nums text-center">
                      <Clock className="w-3.5 h-3.5 inline mr-1 text-[#6B7280]" />
                      {apt.time}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedPatientId(apt.patientId);
                            setActiveView('patients');
                          }}
                          className="font-bold text-xs text-[#1B4332] hover:underline text-left"
                        >
                          {apt.patientName}
                        </button>
                        <span className="text-[11px] text-[#6B7280] font-mono">
                          {apt.uhid}
                        </span>
                      </div>
                      <p className="text-xs text-[#4B5563] mt-0.5">{apt.serviceType}</p>
                      {apt.notes && (
                        <p className="text-[11px] text-[#6B7280] mt-0.5 italic">
                          "{apt.notes}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {/* Status Badge */}
                    <span
                      className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full ${
                        apt.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : apt.status === 'checked_in'
                          ? 'bg-blue-50 text-blue-800 border border-blue-200'
                          : apt.status === 'in_progress'
                          ? 'bg-purple-50 text-purple-800 border border-purple-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {apt.status === 'checked_in'
                        ? 'Checked In'
                        : apt.status === 'in_progress'
                        ? 'In Session'
                        : apt.status === 'completed'
                        ? 'Completed'
                        : 'Scheduled'}
                    </span>

                    {/* Quick Status Action */}
                    {apt.status === 'scheduled' && (
                      <button
                        onClick={() => updateAppointmentStatus(apt.id, 'checked_in')}
                        className="px-2 py-1 text-[11px] font-medium bg-[#E8F3EE] text-[#1B4332] hover:bg-[#D5EADB] rounded transition-colors"
                      >
                        Check In
                      </button>
                    )}
                    {apt.status === 'checked_in' && (
                      <button
                        onClick={() => {
                          setSelectedPatientId(apt.patientId);
                          setActiveView('sessions');
                        }}
                        className="px-2 py-1 text-[11px] font-medium bg-[#1B4332] text-white hover:bg-[#2D6A4F] rounded transition-colors"
                      >
                        Start Session
                      </button>
                    )}
                    {apt.status === 'in_progress' && (
                      <button
                        onClick={() => updateAppointmentStatus(apt.id, 'completed')}
                        className="px-2 py-1 text-[11px] font-medium bg-emerald-600 text-white rounded transition-colors"
                      >
                        Complete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Clinical Activity & Recovery Trends */}
          <div className="bg-white rounded-xl border border-[#E5E5DF] p-5 text-left">
            <h3 className="text-sm font-bold text-[#111827] mb-1">
              Recent Treatment Encounters & Progress Notes
            </h3>
            <p className="text-xs text-[#6B7280] mb-4">
              Real-time clinical entries logged by treating physiotherapists
            </p>

            <div className="space-y-3">
              {sessionNotes.slice(0, 3).map((note) => {
                const pat = patients.find((p) => p.id === note.patientId);
                return (
                  <div
                    key={note.id}
                    className="p-3 bg-[#FAF9F5] border border-[#E5E5DF] rounded-xl flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-[#111827]">
                          {pat?.fullName || 'Patient'}
                        </span>
                        <span className="text-[11px] text-[#6B7280]">
                          Session #{note.sessionNumber} · {note.date}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="text-[#6B7280]">Pain NPRS:</span>
                        <span className="font-bold text-[#1B4332] tabular-nums">
                          {note.currentPainScore} / 10
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-[#4B5563]">
                      <strong className="text-[#111827]">Objective:</strong> {note.objectiveFindings}
                    </p>
                    <div className="flex items-center justify-between pt-1 border-t border-[#E5E5DF]/60 text-[11px] text-[#6B7280]">
                      <span>Interventions: {note.interventionsPerformed.join(', ')}</span>
                      <span className="text-emerald-700 font-medium">Signed electronically</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Clinical Alerts & Revenue Insights */}
        <div className="space-y-6">
          {/* Actionable Follow-up Alerts */}
          <div className="bg-white rounded-xl border border-[#E5E5DF] p-5 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-[#F3F4F0]">
              <h3 className="text-sm font-bold text-[#111827] flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Clinical & Follow-up Alerts</span>
              </h3>
              <span className="text-xs font-semibold text-[#D97706] tabular-nums">
                {tasks.filter((t) => !t.isCompleted).length}
              </span>
            </div>

            <div className="mt-3 space-y-2.5">
              {tasks.filter((t) => !t.isCompleted).map((task) => (
                <div
                  key={task.id}
                  className="p-3 bg-[#FAF9F5] border border-[#E5E5DF] rounded-lg text-left"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-[#111827]">
                    <span>{task.patientName}</span>
                    <span
                      className={`text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded ${
                        task.priority === 'urgent'
                          ? 'bg-red-50 text-red-700'
                          : task.priority === 'high'
                          ? 'bg-amber-50 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>
                  <p className="text-xs text-[#4B5563] mt-1">{task.title}</p>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-[#6B7280]">
                    <span>Assigned: {task.assignedTo}</span>
                    <span>Due: {task.dueDate}</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setActiveView('tasks')}
              className="w-full mt-3 py-2 text-center text-xs font-medium text-[#1B4332] bg-[#E8F3EE] hover:bg-[#D5EADB] rounded-lg transition-colors"
            >
              Manage All Follow-ups
            </button>
          </div>

          {/* Revenue Breakdown Card */}
          <div className="bg-white rounded-xl border border-[#E5E5DF] p-5 text-left">
            <h3 className="text-sm font-bold text-[#111827] mb-1">
              Clinic Revenue & Tariffs
            </h3>
            <p className="text-xs text-[#6B7280] mb-3">
              Standard clinical fees & payment collection rate
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-[#F3F4F0]">
                <span className="text-[#4B5563]">Initial Assessment (60m)</span>
                <span className="font-bold text-[#111827] tabular-nums">₹1,500</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-[#F3F4F0]">
                <span className="text-[#4B5563]">Targeted Session (45m)</span>
                <span className="font-bold text-[#111827] tabular-nums">₹900</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-[#F3F4F0]">
                <span className="text-[#4B5563]">Sports Conditioning (60m)</span>
                <span className="font-bold text-[#111827] tabular-nums">₹1,200</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-[#F3F4F0]">
                <span className="text-[#4B5563]">Post-Op Rehab Package (10)</span>
                <span className="font-bold text-[#111827] tabular-nums">₹8,000</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-[#FAF9F5] rounded-xl border border-[#E5E5DF]">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-[#4B5563]">Collection Efficiency</span>
                <span className="font-bold text-emerald-700 tabular-nums">82.4%</span>
              </div>
              <div className="w-full bg-[#E5E5DF] h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div className="bg-[#2D6A4F] h-full rounded-full" style={{ width: '82.4%' }} />
              </div>
            </div>

            <button
              onClick={() => setActiveView('billing')}
              className="w-full mt-3 py-2 text-center text-xs font-semibold text-white bg-[#1B4332] hover:bg-[#2D6A4F] rounded-lg transition-colors shadow-xs"
            >
              Open Revenue & Billing Console →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
