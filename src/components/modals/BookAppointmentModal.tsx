import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CalendarPlus, X, Clock, Calendar, CheckCircle2 } from 'lucide-react';

export const BookAppointmentModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { patients, staff, tariffs, addAppointment, selectedPatient } = useApp();

  const [patientId, setPatientId] = useState(selectedPatient?.id || patients[0]?.id || '');
  const [clinicianId, setClinicianId] = useState('staff-priyanka');
  const [date, setDate] = useState('2026-10-30');
  const [time, setTime] = useState('10:00 AM');
  const [serviceCode, setServiceCode] = useState('SESS-STD');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const selectedTariff = tariffs.find((t) => t.code === serviceCode) || tariffs[0];
  const selectedClinician = staff.find((s) => s.id === clinicianId) || staff[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pat = patients.find((p) => p.id === patientId);
    if (!pat) return;

    addAppointment({
      patientId: pat.id,
      patientName: pat.fullName,
      clinicianId: selectedClinician.id,
      clinicianName: selectedClinician.name,
      date,
      time,
      durationMinutes,
      serviceType: selectedTariff.name,
      status: 'scheduled',
      notes,
      chargeAmount: selectedTariff.rate,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl border border-[#E5E5DF] shadow-2xl max-w-md w-full p-6 text-left space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#E5E5DF]">
          <div>
            <h3 className="text-sm font-bold text-[#1B4332] flex items-center gap-1.5">
              <CalendarPlus className="w-4 h-4 text-[#2D6A4F]" />
              <span>Book Clinical Appointment</span>
            </h3>
            <span className="text-[11px] text-[#6B7280]">
              Links automatically with tariff schedule for revenue generation.
            </span>
          </div>
          <button onClick={onClose} className="text-[#9CA3AF] hover:text-[#111827]">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="text-[11px] font-semibold text-[#4B5563] block mb-1">
              Select Patient
            </label>
            <select
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="w-full p-2 border border-[#E5E5DF] rounded-lg bg-[#FAF9F5] text-xs font-medium"
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.fullName} ({p.uhid})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#4B5563] block mb-1">
              Treating Clinician
            </label>
            <select
              value={clinicianId}
              onChange={(e) => setClinicianId(e.target.value)}
              className="w-full p-2 border border-[#E5E5DF] rounded-lg bg-[#FAF9F5] text-xs font-medium"
            >
              {staff.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.title.split('&')[0]})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#4B5563] block mb-1">
              Service / Procedure Tariff
            </label>
            <select
              value={serviceCode}
              onChange={(e) => setServiceCode(e.target.value)}
              className="w-full p-2 border border-[#E5E5DF] rounded-lg bg-[#FAF9F5] text-xs font-medium"
            >
              {tariffs.map((t) => (
                <option key={t.id} value={t.code}>
                  {t.name} — ₹{t.rate}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-[#4B5563] block mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2 border border-[#E5E5DF] rounded-lg text-xs"
                required
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#4B5563] block mb-1">Time Slot</label>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full p-2 border border-[#E5E5DF] rounded-lg text-xs font-mono"
              >
                <option value="09:00 AM">09:00 AM</option>
                <option value="09:45 AM">09:45 AM</option>
                <option value="10:30 AM">10:30 AM</option>
                <option value="11:15 AM">11:15 AM</option>
                <option value="12:00 PM">12:00 PM</option>
                <option value="02:00 PM">02:00 PM</option>
                <option value="02:45 PM">02:45 PM</option>
                <option value="03:30 PM">03:30 PM</option>
                <option value="04:15 PM">04:15 PM</option>
                <option value="05:00 PM">05:00 PM</option>
                <option value="06:00 PM">06:00 PM</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#4B5563] block mb-1">
              Clinical Notes / Focus Areas
            </label>
            <input
              type="text"
              placeholder="e.g. Progression to single-leg balance and reassess swelling"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2 border border-[#E5E5DF] rounded-lg text-xs"
            />
          </div>

          {/* Fee Strip */}
          <div className="p-3 bg-[#FAF9F5] rounded-xl border border-[#E5E5DF] flex items-center justify-between">
            <span className="text-[#6B7280]">Chargeable Clinical Fee:</span>
            <span className="font-bold text-sm text-[#1B4332] tabular-nums font-mono">
              ₹{selectedTariff.rate.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#E5E5DF] text-[#4B5563] rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-semibold text-white bg-[#1B4332] hover:bg-[#2D6A4F] rounded-lg shadow-xs"
            >
              Confirm Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
