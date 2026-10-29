import React from 'react';
import { useApp, ActiveView } from '../../context/AppContext';
import {
  LayoutDashboard,
  Users,
  Inbox,
  Calendar,
  FileCheck2,
  FileText,
  Activity,
  Dumbbell,
  LineChart,
  Target,
  FileSpreadsheet,
  CheckSquare,
  ReceiptIndianRupee,
  Settings,
  ClipboardPen,
  Smartphone,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

interface NavItem {
  id: ActiveView;
  label: string;
  icon: React.ElementType;
  badge?: number;
  roles: Array<'admin' | 'physio' | 'reception' | 'patient'>;
}

export const Sidebar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    currentRole,
    tasks,
    appointments,
    enquiries,
    invoices,
    patients,
  } = useApp();

  const pendingTasksCount = tasks.filter((t) => !t.isCompleted).length;
  const newEnquiriesCount = enquiries.filter((e) => e.status === 'new').length;
  const pendingInvoicesCount = invoices.filter((i) => i.paymentStatus === 'pending').length;

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Overview Dashboard',
      icon: LayoutDashboard,
      roles: ['admin', 'physio', 'reception'],
    },
    {
      id: 'patients',
      label: 'Patient Management',
      icon: Users,
      badge: patients.length,
      roles: ['admin', 'physio', 'reception'],
    },
    {
      id: 'enquiries',
      label: 'Enquiries & Referrals',
      icon: Inbox,
      badge: newEnquiriesCount > 0 ? newEnquiriesCount : undefined,
      roles: ['admin', 'reception'],
    },
    {
      id: 'appointments',
      label: 'Appointments',
      icon: Calendar,
      roles: ['admin', 'physio', 'reception', 'patient'],
    },
    {
      id: 'assessments',
      label: 'Clinical Assessments',
      icon: FileCheck2,
      roles: ['admin', 'physio'],
    },
    {
      id: 'treatment_plans',
      label: 'Treatment Plans',
      icon: FileText,
      roles: ['admin', 'physio'],
    },
    {
      id: 'sessions',
      label: 'Treatment Sessions (SOAP)',
      icon: Activity,
      roles: ['admin', 'physio'],
    },
    {
      id: 'exercises',
      label: 'Home Exercise Programs',
      icon: Dumbbell,
      roles: ['admin', 'physio', 'patient'],
    },
    {
      id: 'recovery_timeline',
      label: 'Recovery Timeline',
      icon: LineChart,
      roles: ['admin', 'physio', 'patient'],
    },
    {
      id: 'outcomes',
      label: 'Reassessment & Outcomes',
      icon: Target,
      roles: ['admin', 'physio'],
    },
    {
      id: 'discharge',
      label: 'Discharge Summaries',
      icon: FileSpreadsheet,
      roles: ['admin', 'physio'],
    },
    {
      id: 'tasks',
      label: 'Tasks & Follow-ups',
      icon: CheckSquare,
      badge: pendingTasksCount > 0 ? pendingTasksCount : undefined,
      roles: ['admin', 'physio', 'reception'],
    },
    {
      id: 'billing',
      label: 'Billing & Revenue',
      icon: ReceiptIndianRupee,
      badge: pendingInvoicesCount > 0 ? pendingInvoicesCount : undefined,
      roles: ['admin', 'reception'],
    },
    {
      id: 'staff',
      label: 'Staff & Settings',
      icon: Settings,
      roles: ['admin'],
    },
  ];

  const filteredNav = navItems.filter((item) => item.roles.includes(currentRole));

  return (
    <aside className="w-64 bg-white border-r border-[#E5E5DF] flex flex-col justify-between shrink-0 h-[calc(100vh-53px)] sticky top-[53px]">
      {/* Upper Navigation List */}
      <div className="overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
          Clinical Modules
        </div>

        {filteredNav.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-[#1B4332] text-white shadow-xs'
                  : 'text-[#4B5563] hover:bg-[#FAF9F5] hover:text-[#111827]'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-white' : 'text-[#6B7280] group-hover:text-[#1B4332]'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-[#FAF9F5] text-[#1B4332] border border-[#E5E5DF]'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Quick Patient Intake Action */}
        <div className="pt-3 border-t border-[#F3F4F0] mt-3">
          <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
            Intake & Portals
          </div>
          <button
            onClick={() => setActiveView('pre_assessment')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              activeView === 'pre_assessment'
                ? 'bg-[#2D6A4F] text-white'
                : 'text-[#4B5563] hover:bg-[#FAF9F5] hover:text-[#111827]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ClipboardPen className="w-4 h-4 text-[#2D6A4F]" />
              <span>Digital Pre-Assessment</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-[#9CA3AF]" />
          </button>
          <button
            onClick={() => setActiveView('patient_portal')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all mt-1 ${
              activeView === 'patient_portal'
                ? 'bg-[#2D6A4F] text-white'
                : 'text-[#4B5563] hover:bg-[#FAF9F5] hover:text-[#111827]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Smartphone className="w-4 h-4 text-[#2D6A4F]" />
              <span>Patient Mobile Portal</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-[#9CA3AF]" />
          </button>
        </div>
      </div>

      {/* Footer: Clinic Leadership Card */}
      <div className="p-3 border-t border-[#E5E5DF] bg-[#FAF9F5]">
        <div className="flex items-center gap-2.5">
          <img
            src="/src/assets/images/dr_priyanka_singh_1793257507729.jpg"
            alt="Dr. Priyanka Singh"
            referrerPolicy="no-referrer"
            className="w-10 h-10 rounded-full object-cover border-2 border-[#1B4332]/30 shadow-xs shrink-0"
          />
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-[#1B4332] truncate">
              Dr. Priyanka Singh
            </span>
            <span className="text-[10px] text-[#4B5563] truncate">
              MPT (MSK & Sports) · Lead
            </span>
            <div className="flex items-center gap-1 mt-0.5 text-[9px] text-[#2D6A4F]">
              <ShieldCheck className="w-3 h-3 text-[#2D6A4F]" />
              <span>Reg #MPT-28492</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
