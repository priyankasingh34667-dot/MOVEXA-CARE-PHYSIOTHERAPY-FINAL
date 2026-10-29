import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EnquiryLead } from '../../types';
import {
  Inbox,
  Plus,
  Phone,
  Mail,
  CheckCircle2,
  CalendarPlus,
  Clock,
  Filter,
  UserCheck,
} from 'lucide-react';

export const EnquiriesAndReferrals: React.FC<{
  onOpenBookAppointmentModal: () => void;
}> = ({ onOpenBookAppointmentModal }) => {
  const { enquiries, updateEnquiryStatus, staff } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showNewEnquiryModal, setShowNewEnquiryModal] = useState(false);

  // New enquiry form
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [condition, setCondition] = useState('');
  const [referralSource, setReferralSource] = useState('Google Search / Website');
  const [preferredTiming, setPreferredTiming] = useState('Morning 9:00 - 11:00 AM');
  const [assignedStaff, setAssignedStaff] = useState('Dr. Priyanka Singh');

  const filteredEnquiries = enquiries.filter(
    (e) => statusFilter === 'all' || e.status === statusFilter
  );

  return (
    <div className="space-y-6 text-left">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5E5DF]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1B4332] mb-0.5">
            <Inbox className="w-4 h-4 text-[#2D6A4F]" />
            <span>Intake Pipeline</span>
            <span>·</span>
            <span>Enquiries & Referrals</span>
          </div>
          <h1 className="text-xl font-extrabold text-[#111827]">
            Patient Enquiries & Doctor Referrals
          </h1>
          <p className="text-xs text-[#6B7280]">
            Track inbound clinical leads, surgeon referrals, and conversion to scheduled consultations.
          </p>
        </div>

        <button
          onClick={() => setShowNewEnquiryModal(true)}
          className="px-4 py-2 text-xs font-semibold text-white bg-[#1B4332] hover:bg-[#2D6A4F] rounded-lg transition-colors flex items-center gap-1.5 shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Log New Enquiry</span>
        </button>
      </div>

      {/* KPI Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-4 bg-white rounded-xl border border-[#E5E5DF]">
          <span className="text-[#6B7280]">New Inquiries</span>
          <div className="text-xl font-bold text-[#111827] mt-1 tabular-nums">
            {enquiries.filter((e) => e.status === 'new').length}
          </div>
        </div>
        <div className="p-4 bg-white rounded-xl border border-[#E5E5DF]">
          <span className="text-[#6B7280]">Contacted</span>
          <div className="text-xl font-bold text-[#1B4332] mt-1 tabular-nums">
            {enquiries.filter((e) => e.status === 'contacted').length}
          </div>
        </div>
        <div className="p-4 bg-white rounded-xl border border-[#E5E5DF]">
          <span className="text-[#6B7280]">Booked into Sessions</span>
          <div className="text-xl font-bold text-emerald-700 mt-1 tabular-nums">
            {enquiries.filter((e) => e.status === 'booked').length}
          </div>
        </div>
        <div className="p-4 bg-white rounded-xl border border-[#E5E5DF]">
          <span className="text-[#6B7280]">Conversion Rate</span>
          <div className="text-xl font-bold text-[#2D6A4F] mt-1 tabular-nums">
            {enquiries.length > 0
              ? `${Math.round(
                  (enquiries.filter((e) => e.status === 'booked').length / enquiries.length) * 100
                )}%`
              : '0%'}
          </div>
        </div>
      </div>

      {/* Enquiries List */}
      <div className="space-y-3">
        {filteredEnquiries.map((enq) => (
          <div
            key={enq.id}
            className="p-4 bg-white rounded-xl border border-[#E5E5DF] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-[#111827]">{enq.name}</span>
                <span
                  className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded ${
                    enq.status === 'new'
                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                      : enq.status === 'booked'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {enq.status}
                </span>
              </div>

              <p className="text-xs text-[#4B5563] font-medium">{enq.conditionDescription}</p>

              <div className="flex flex-wrap items-center gap-3 text-[#6B7280] text-[11px] pt-1">
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  <span>{enq.phone}</span>
                </span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  <span>{enq.email}</span>
                </span>
                <span aria-hidden="true">·</span>
                <span>Referral: {enq.referralSource}</span>
                <span aria-hidden="true">·</span>
                <span>Prefers: {enq.preferredTiming}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 self-end sm:self-center">
              {enq.status === 'new' && (
                <button
                  onClick={() => updateEnquiryStatus(enq.id, 'contacted')}
                  className="px-2.5 py-1 text-xs font-medium bg-[#E8F3EE] text-[#1B4332] hover:bg-[#D5EADB] rounded transition-colors"
                >
                  Mark Contacted
                </button>
              )}
              {enq.status !== 'booked' && (
                <button
                  onClick={() => {
                    updateEnquiryStatus(enq.id, 'booked');
                    onOpenBookAppointmentModal();
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-[#1B4332] hover:bg-[#2D6A4F] rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                >
                  <CalendarPlus className="w-3.5 h-3.5" />
                  <span>Book Initial Assessment</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
