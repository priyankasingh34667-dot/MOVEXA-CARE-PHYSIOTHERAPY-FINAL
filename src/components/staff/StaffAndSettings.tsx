import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  ShieldCheck,
  Download,
  Upload,
  User,
  Phone,
  Mail,
  Award,
  Lock,
  Building,
  RotateCcw,
} from 'lucide-react';

export const StaffAndSettings: React.FC = () => {
  const {
    staff,
    tariffs,
    exportDatabaseBackup,
    importDatabaseBackup,
    resetAllData,
  } = useApp();

  const [importJson, setImportJson] = useState('');
  const [importMessage, setImportMessage] = useState<string | null>(null);

  const handleRestore = () => {
    if (!importJson.trim()) return;
    const ok = importDatabaseBackup(importJson);
    if (ok) {
      setImportMessage('Data restored successfully!');
      setTimeout(() => setImportMessage(null), 2000);
      setImportJson('');
    } else {
      setImportMessage('Invalid JSON backup content.');
    }
  };

  return (
    <div className="space-y-6 text-left max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5E5DF]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1B4332] mb-0.5">
            <Settings className="w-4 h-4 text-[#2D6A4F]" />
            <span>Clinic Administration</span>
            <span>·</span>
            <span>Staff & Governance</span>
          </div>
          <h1 className="text-xl font-extrabold text-[#111827]">
            Staff Directory & Clinic Settings
          </h1>
          <p className="text-xs text-[#6B7280]">
            Medical licensing, clinical roles, operating protocols, and data security configuration.
          </p>
        </div>
      </div>

      {/* Lead Clinician Spotlight: Dr. Priyanka Singh */}
      <div className="bg-white p-6 rounded-2xl border border-[#E5E5DF] shadow-xs flex flex-col md:flex-row gap-6 items-start">
        <img
          src="/src/assets/images/dr_priyanka_singh_1793257507729.jpg"
          alt="Dr. Priyanka Singh"
          referrerPolicy="no-referrer"
          className="w-28 h-28 rounded-2xl object-cover border-2 border-[#1B4332]/20 shadow-sm shrink-0"
        />

        <div className="space-y-2 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-[#111827]">Dr. Priyanka Singh</h2>
              <span className="text-xs font-semibold text-[#1B4332] block">
                MPT (Musculoskeletal & Sports Rehabilitation), MIAP, CMP
              </span>
            </div>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Clinic Director & Principal Physio</span>
            </span>
          </div>

          <p className="text-xs text-[#4B5563] leading-relaxed">
            Over 12 years of specialized clinical practice in complex musculoskeletal rehabilitation,
            post-operative joint reconstruction, and sports athletic return-to-play protocols. Registered with the
            Indian Association of Physiotherapists (IAP).
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-[#6B7280] pt-1">
            <span>Reg #MPT-MSK-28492 / IAP-41829</span>
            <span>·</span>
            <span>dr.priyanka@movexacare.in</span>
            <span>·</span>
            <span>Consultation Fee: ₹1,500</span>
          </div>
        </div>
      </div>

      {/* Clinical Team Grid */}
      <div className="bg-white p-6 rounded-xl border border-[#E5E5DF] space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#1B4332]">
          Clinical & Operational Staff Members
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {staff.map((s) => (
            <div
              key={s.id}
              className="p-4 bg-[#FAF9F5] border border-[#E5E5DF] rounded-xl flex items-start gap-3.5"
            >
              <img
                src={s.avatarUrl}
                alt={s.name}
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-xl object-cover border border-[#E5E5DF] shrink-0"
              />
              <div className="space-y-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-[#111827] truncate">{s.name}</h4>
                  <span className="text-[10px] uppercase font-semibold text-[#1B4332] bg-[#E8F3EE] px-1.5 py-0.5 rounded">
                    {s.role}
                  </span>
                </div>
                <p className="text-[11px] text-[#2D6A4F] font-medium">{s.title}</p>
                <p className="text-[11px] text-[#6B7280] line-clamp-2">{s.bio}</p>
                <div className="flex items-center gap-2 text-[10px] text-[#6B7280] pt-1 font-mono">
                  <span>{s.email}</span>
                  <span>·</span>
                  <span>{s.phone}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Clinic Operating Hours & Compliance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        <div className="bg-white p-6 rounded-xl border border-[#E5E5DF] space-y-3">
          <h3 className="font-bold text-xs uppercase tracking-wider text-[#1B4332]">
            Clinical Hours & Appointments
          </h3>
          <div className="space-y-1.5 text-xs text-[#4B5563]">
            <div className="flex justify-between py-1 border-b border-[#F3F4F0]">
              <span>Monday – Friday:</span>
              <span className="font-semibold text-[#111827]">08:00 AM – 08:00 PM</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#F3F4F0]">
              <span>Saturday:</span>
              <span className="font-semibold text-[#111827]">08:00 AM – 05:00 PM</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#F3F4F0]">
              <span>Sunday:</span>
              <span className="font-semibold text-[#111827]">Emergency / Post-Op By Appointment</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-[#E5E5DF] space-y-3">
          <h3 className="font-bold text-xs uppercase tracking-wider text-[#1B4332] flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-emerald-700" />
            <span>Health Data Security & DPDP Compliance</span>
          </h3>
          <p className="text-xs text-[#6B7280] leading-relaxed">
            MOVEXA Care complies with Indian Digital Personal Data Protection (DPDP) standards. All patient records,
            evaluations, and photographic goniometric records are securely encrypted with role-based access restrictions.
          </p>
          <div className="pt-1 flex items-center gap-2 text-[11px] text-emerald-800 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>Audit logging & electronic signature verification active</span>
          </div>
        </div>
      </div>

      {/* Backup & System Reset */}
      <div className="bg-white p-6 rounded-xl border border-[#E5E5DF] space-y-4 text-xs">
        <h3 className="font-bold text-xs uppercase tracking-wider text-[#1B4332]">
          Data Maintenance & JSON Backup
        </h3>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="font-bold text-[#111827] block">Export Full Database Backup</span>
            <p className="text-[11px] text-[#6B7280]">
              Download complete snapshot of all patients, assessments, treatment plans, and billing.
            </p>
          </div>
          <button
            onClick={exportDatabaseBackup}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#1B4332] hover:bg-[#2D6A4F] rounded-lg flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Download Backup (.json)</span>
          </button>
        </div>

        <div className="pt-3 border-t border-[#E5E5DF] flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="font-bold text-red-600 block">Reset Demo Workspace</span>
            <p className="text-[11px] text-[#6B7280]">
              Restores factory default patients and tariffs configured for Dr. Priyanka Singh.
            </p>
          </div>
          <button
            onClick={() => {
              if (confirm('Are you sure you want to restore default demo records?')) {
                resetAllData();
              }
            }}
            className="px-4 py-2 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
