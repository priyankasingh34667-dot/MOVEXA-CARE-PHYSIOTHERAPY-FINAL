import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Appointment } from '../../types';
import {
  Calendar,
  Clock,
  Plus,
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle,
  User,
  CalendarDays,
  Search,
} from 'lucide-react';

export const AppointmentsView: React.FC<{
  onOpenBookAppointmentModal: () => void;
}> = ({ onOpenBookAppointmentModal }) => {
  const {
    appointments,
    updateAppointmentStatus,
    setSelectedPatientId,
    setActiveView,
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAppointments = appointments.filter((apt) => {
    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
    const matchesSearch =
      apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.uhid.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.serviceType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 text-left">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5E5DF]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1B4332] mb-0.5">
            <Calendar className="w-4 h-4 text-[#2D6A4F]" />
            <span>Schedule & Attendance</span>
          </div>
          <h1 className="text-xl font-extrabold text-[#111827]">
            Clinical Appointments & Schedule Management
          </h1>
          <p className="text-xs text-[#6B7280]">
            Manage patient consultations, therapy bookings, check-in statuses, and session follow-ups.
          </p>
        </div>

        <button
          onClick={onOpenBookAppointmentModal}
          className="px-4 py-2 text-xs font-semibold text-white bg-[#1B4332] hover:bg-[#2D6A4F] rounded-lg transition-colors flex items-center gap-1.5 shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Book Appointment</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-[#E5E5DF]">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="Search by patient, UHID or service..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-[#E5E5DF] rounded-lg bg-[#FAF9F5] focus:outline-none focus:border-[#1B4332]"
          />
        </div>

        {/* Segmented status filter */}
        <div className="flex items-center gap-1 overflow-x-auto text-xs">
          {['all', 'scheduled', 'checked_in', 'in_progress', 'completed', 'missed'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap capitalize transition-colors ${
                statusFilter === st
                  ? 'bg-[#1B4332] text-white shadow-xs'
                  : 'bg-[#FAF9F5] text-[#4B5563] hover:text-[#111827]'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Appointments List Grid */}
      <div className="space-y-3">
        {filteredAppointments.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#9CA3AF] bg-white rounded-xl border border-[#E5E5DF]">
            No appointments found matching your filter criteria.
          </div>
        ) : (
          filteredAppointments.map((apt) => (
            <div
              key={apt.id}
              className="p-4 bg-white rounded-xl border border-[#E5E5DF] flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#2D6A4F]/40 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#FAF9F5] border border-[#E5E5DF] rounded-xl text-center shrink-0 min-w-[70px]">
                  <span className="text-[10px] text-[#6B7280] uppercase block">
                    {new Date(apt.date).toLocaleDateString('en-US', { month: 'short' })}
                  </span>
                  <span className="text-xl font-bold text-[#1B4332] block tabular-nums">
                    {new Date(apt.date).getDate()}
                  </span>
                  <span className="text-[10px] font-mono text-[#6B7280]">{apt.time}</span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedPatientId(apt.patientId);
                        setActiveView('patients');
                      }}
                      className="font-bold text-sm text-[#1B4332] hover:underline"
                    >
                      {apt.patientName}
                    </button>
                    <span className="text-xs font-mono text-[#6B7280]">{apt.uhid}</span>
                  </div>

                  <p className="text-xs font-medium text-[#111827]">{apt.serviceType}</p>
                  <div className="flex items-center gap-3 text-xs text-[#6B7280]">
                    <span>Clinician: {apt.clinicianName}</span>
                    <span>·</span>
                    <span>Fee: ₹{apt.chargeAmount}</span>
                  </div>
                  {apt.notes && (
                    <p className="text-[11px] text-[#6B7280] italic">Note: "{apt.notes}"</p>
                  )}
                </div>
              </div>

              {/* Status & Actions */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                <span
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize ${
                    apt.status === 'completed'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : apt.status === 'checked_in'
                      ? 'bg-blue-50 text-blue-800 border border-blue-200'
                      : apt.status === 'in_progress'
                      ? 'bg-purple-50 text-purple-800 border border-purple-200'
                      : apt.status === 'missed'
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}
                >
                  {apt.status.replace('_', ' ')}
                </span>

                {apt.status === 'scheduled' && (
                  <button
                    onClick={() => updateAppointmentStatus(apt.id, 'checked_in')}
                    className="px-2.5 py-1 text-xs font-medium bg-[#E8F3EE] text-[#1B4332] hover:bg-[#D5EADB] rounded-md transition-colors"
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
                    className="px-2.5 py-1 text-xs font-medium bg-[#1B4332] text-white hover:bg-[#2D6A4F] rounded-md transition-colors shadow-xs"
                  >
                    Start Session
                  </button>
                )}
                {apt.status === 'in_progress' && (
                  <button
                    onClick={() => updateAppointmentStatus(apt.id, 'completed')}
                    className="px-2.5 py-1 text-xs font-medium bg-emerald-600 text-white rounded-md transition-colors"
                  >
                    Complete
                  </button>
                )}
                {apt.status !== 'completed' && apt.status !== 'cancelled' && (
                  <button
                    onClick={() => updateAppointmentStatus(apt.id, 'cancelled')}
                    className="px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
