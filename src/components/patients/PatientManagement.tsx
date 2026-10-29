import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Patient } from '../../types';
import {
  Search,
  Filter,
  UserPlus,
  Calendar,
  FileCheck2,
  FileText,
  Dumbbell,
  LineChart,
  ReceiptIndianRupee,
  Clock,
  Phone,
  Mail,
  AlertTriangle,
  CheckCircle2,
  Edit3,
  ChevronRight,
  ShieldAlert,
  Save,
} from 'lucide-react';

export const PatientManagement: React.FC<{
  onOpenRegisterModal: () => void;
}> = ({ onOpenRegisterModal }) => {
  const {
    patients,
    selectedPatientId,
    setSelectedPatientId,
    selectedPatient,
    updatePatient,
    assessments,
    treatmentPlans,
    sessionNotes,
    outcomes,
    appointments,
    invoices,
    staff,
    setActiveView,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<
    'overview' | 'assessment' | 'treatment' | 'exercises' | 'outcomes' | 'appointments' | 'billing' | 'timeline'
  >('overview');

  // Edit demographic modal/form state
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Patient>>({});

  // Filter patients
  const filteredPatients = patients.filter((pat) => {
    const matchesSearch =
      pat.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pat.uhid.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pat.phone.includes(searchQuery) ||
      pat.chiefComplaint.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = regionFilter === 'all' || pat.affectedBodyRegion === regionFilter;
    const matchesStatus = statusFilter === 'all' || pat.status === statusFilter;
    return matchesSearch && matchesRegion && matchesStatus;
  });

  const patientAssessments = assessments.filter((a) => a.patientId === selectedPatient?.id);
  const latestAssessment = patientAssessments[0];
  const patientPlan = treatmentPlans.find((p) => p.patientId === selectedPatient?.id);
  const patientSessions = sessionNotes.filter((s) => s.patientId === selectedPatient?.id);
  const patientOutcomes = outcomes.filter((o) => o.patientId === selectedPatient?.id);
  const patientAppointments = appointments.filter((a) => a.patientId === selectedPatient?.id);
  const patientInvoices = invoices.filter((i) => i.patientId === selectedPatient?.id);

  const startEdit = () => {
    if (selectedPatient) {
      setEditForm({
        fullName: selectedPatient.fullName,
        phone: selectedPatient.phone,
        email: selectedPatient.email,
        occupation: selectedPatient.occupation,
        address: selectedPatient.address,
        chiefComplaint: selectedPatient.chiefComplaint,
        precautions: [...selectedPatient.precautions],
      });
      setIsEditing(true);
    }
  };

  const handleSaveEdit = () => {
    if (selectedPatient && editForm) {
      updatePatient(selectedPatient.id, editForm);
      setIsEditing(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header with Search and New Patient CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5E5DF]">
        <div>
          <h1 className="text-xl font-extrabold text-[#111827]">Patient Management Directory</h1>
          <p className="text-xs text-[#6B7280]">
            Searchable clinical dossiers, demographic records, and complete rehabilitation histories.
          </p>
        </div>

        <button
          onClick={onOpenRegisterModal}
          className="px-4 py-2 text-xs font-semibold text-white bg-[#1B4332] hover:bg-[#2D6A4F] rounded-lg transition-colors flex items-center gap-1.5 shadow-xs self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Register New Patient</span>
        </button>
      </div>

      {/* Main Split Layout: Patient Directory List (Left) & Dossier (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Search, Filters & Patient List (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-[#E5E5DF] p-4 space-y-3">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#9CA3AF]" />
            <input
              type="text"
              placeholder="Search by name, UHID, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-[#E5E5DF] rounded-lg bg-[#FAF9F5] focus:outline-none focus:border-[#1B4332] transition-colors"
            />
          </div>

          {/* Segmented Region Filters */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
            <span className="text-[11px] text-[#6B7280] font-medium mr-1 shrink-0">Region:</span>
            {['all', 'knee', 'lumbar', 'shoulder', 'cervical'].map((reg) => (
              <button
                key={reg}
                onClick={() => setRegionFilter(reg)}
                className={`px-2.5 py-1 rounded text-[11px] font-medium whitespace-nowrap capitalize transition-colors ${
                  regionFilter === reg
                    ? 'bg-[#1B4332] text-white'
                    : 'bg-[#F3F4F0] text-[#4B5563] hover:text-[#111827]'
                }`}
              >
                {reg}
              </button>
            ))}
          </div>

          {/* Patient Directory List */}
          <div className="divide-y divide-[#F3F4F0] max-h-[640px] overflow-y-auto pr-1">
            {filteredPatients.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#9CA3AF]">
                No patients match the search criteria.
              </div>
            ) : (
              filteredPatients.map((pat) => {
                const isSelected = pat.id === selectedPatient?.id;
                return (
                  <button
                    key={pat.id}
                    onClick={() => {
                      setSelectedPatientId(pat.id);
                      setIsEditing(false);
                    }}
                    className={`w-full text-left py-3 px-2.5 rounded-lg transition-all flex flex-col gap-1 ${
                      isSelected
                        ? 'bg-[#E8F3EE] border border-[#2D6A4F]/30'
                        : 'hover:bg-[#FAF9F5]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#111827]">{pat.fullName}</span>
                      <span className="text-[10px] font-mono text-[#6B7280]">{pat.uhid}</span>
                    </div>

                    <div className="text-[11px] text-[#4B5563] line-clamp-1">
                      {pat.chiefComplaint}
                    </div>

                    {/* Unboxed Metadata (Zero-pill discipline) */}
                    <div className="flex items-center gap-1.5 text-[10px] text-[#6B7280]">
                      <span className="capitalize">{pat.affectedBodyRegion}</span>
                      <span aria-hidden="true">·</span>
                      <span className="capitalize">{pat.status.replace('_', ' ')}</span>
                      <span aria-hidden="true">·</span>
                      <span>Reg: {pat.registrationDate}</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Detailed 8-Tab Patient Profile Dossier (8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-[#E5E5DF] p-6 space-y-6">
          {selectedPatient ? (
            <>
              {/* Patient Banner & Identity */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E5DF]">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-[#111827]">{selectedPatient.fullName}</h2>
                    <span className="text-xs font-mono font-semibold px-2 py-0.5 bg-[#FAF9F5] border border-[#E5E5DF] rounded text-[#1B4332]">
                      {selectedPatient.uhid}
                    </span>
                  </div>
                  {/* Clean unboxed metadata with separators */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#6B7280] mt-1">
                    <span>DOB: {selectedPatient.dateOfBirth}</span>
                    <span aria-hidden="true">·</span>
                    <span className="capitalize">{selectedPatient.gender}</span>
                    <span aria-hidden="true">·</span>
                    <span>{selectedPatient.phone}</span>
                    <span aria-hidden="true">·</span>
                    <span>{selectedPatient.occupation}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveView('pre_assessment')}
                    className="px-3 py-1.5 text-xs font-medium text-[#1B4332] bg-[#E8F3EE] hover:bg-[#D5EADB] rounded-lg transition-colors"
                  >
                    View Pre-Assessment
                  </button>
                  <button
                    onClick={startEdit}
                    className="px-3 py-1.5 text-xs font-medium border border-[#E5E5DF] text-[#4B5563] hover:text-[#111827] hover:bg-[#FAF9F5] rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Profile</span>
                  </button>
                </div>
              </div>

              {/* 8-Tab Navigation Bar */}
              <div className="flex items-center gap-1 border-b border-[#E5E5DF] overflow-x-auto pb-px text-xs font-medium">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'assessment', label: 'Clinical Assessment' },
                  { id: 'treatment', label: 'Treatment Plan' },
                  { id: 'exercises', label: 'Prescribed Exercises' },
                  { id: 'outcomes', label: 'Outcomes' },
                  { id: 'appointments', label: 'Appointments' },
                  { id: 'billing', label: 'Invoices & Billing' },
                  { id: 'timeline', label: 'Care Timeline' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-3 py-2 border-b-2 whitespace-nowrap transition-colors ${
                      activeTab === tab.id
                        ? 'border-[#1B4332] text-[#1B4332] font-bold'
                        : 'border-transparent text-[#6B7280] hover:text-[#111827]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-4">
                  {isEditing ? (
                    <div className="p-4 bg-[#FAF9F5] border border-[#E5E5DF] rounded-xl space-y-3">
                      <h3 className="text-xs font-bold text-[#1B4332]">Edit Patient Demographic Info</h3>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="text-[11px] text-[#6B7280] block mb-1">Full Name</label>
                          <input
                            type="text"
                            value={editForm.fullName || ''}
                            onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                            className="w-full p-2 border border-[#E5E5DF] rounded-md bg-white text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-[#6B7280] block mb-1">Phone</label>
                          <input
                            type="text"
                            value={editForm.phone || ''}
                            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                            className="w-full p-2 border border-[#E5E5DF] rounded-md bg-white text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-[#6B7280] block mb-1">Occupation</label>
                          <input
                            type="text"
                            value={editForm.occupation || ''}
                            onChange={(e) => setEditForm({ ...editForm, occupation: e.target.value })}
                            className="w-full p-2 border border-[#E5E5DF] rounded-md bg-white text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-[#6B7280] block mb-1">Address</label>
                          <input
                            type="text"
                            value={editForm.address || ''}
                            onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                            className="w-full p-2 border border-[#E5E5DF] rounded-md bg-white text-xs"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="text-[11px] text-[#6B7280] block mb-1">Chief Complaint</label>
                          <textarea
                            value={editForm.chiefComplaint || ''}
                            onChange={(e) => setEditForm({ ...editForm, chiefComplaint: e.target.value })}
                            className="w-full p-2 border border-[#E5E5DF] rounded-md bg-white text-xs h-16"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          onClick={() => setIsEditing(false)}
                          className="px-3 py-1.5 text-xs text-[#6B7280] hover:bg-[#F3F4F0] rounded"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveEdit}
                          className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#1B4332] rounded flex items-center gap-1"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Save Changes</span>
                        </button>
                      </div>
                    </div>
                  ) : null}

                  {/* Clinical Alert & Precautions */}
                  {selectedPatient.precautions.length > 0 && (
                    <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Clinical Precautions:</span>
                        <ul className="list-disc list-inside mt-0.5 space-y-0.5 text-[#4B5563]">
                          {selectedPatient.precautions.map((p, idx) => (
                            <li key={idx}>{p}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* 2-Column Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 bg-[#FAF9F5] border border-[#E5E5DF] rounded-xl space-y-2">
                      <h4 className="font-bold text-[#1B4332] text-xs">Medical Background</h4>
                      <div>
                        <span className="text-[#6B7280]">Medical & Surgical History:</span>
                        <p className="font-medium text-[#111827] mt-0.5">
                          {selectedPatient.medicalHistory.join(', ') || 'None reported'}
                        </p>
                      </div>
                      <div>
                        <span className="text-[#6B7280]">Current Medications:</span>
                        <p className="font-medium text-[#111827] mt-0.5">
                          {selectedPatient.medications.join(', ') || 'None'}
                        </p>
                      </div>
                      <div>
                        <span className="text-[#6B7280]">Allergies:</span>
                        <p className="font-medium text-[#111827] mt-0.5">
                          {selectedPatient.allergies.join(', ') || 'No known allergies'}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 bg-[#FAF9F5] border border-[#E5E5DF] rounded-xl space-y-2">
                      <h4 className="font-bold text-[#1B4332] text-xs">Administrative & Care Team</h4>
                      <div>
                        <span className="text-[#6B7280]">Assigned Clinician:</span>
                        <p className="font-medium text-[#111827] mt-0.5">
                          {staff.find((s) => s.id === selectedPatient.assignedPhysiotherapistId)?.name || 'Dr. Priyanka Singh'}
                        </p>
                      </div>
                      <div>
                        <span className="text-[#6B7280]">Referral Source:</span>
                        <p className="font-medium text-[#111827] mt-0.5">{selectedPatient.referralSource}</p>
                      </div>
                      <div>
                        <span className="text-[#6B7280]">Emergency Contact:</span>
                        <p className="font-medium text-[#111827] mt-0.5">
                          {selectedPatient.emergencyContact.name} ({selectedPatient.emergencyContact.relationship}) · {selectedPatient.emergencyContact.phone}
                        </p>
                      </div>
                      <div>
                        <span className="text-[#6B7280]">Informed Consent:</span>
                        <p className="font-medium text-emerald-700 mt-0.5 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Signed & Verified (DPDP Act Compliant)</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: CLINICAL ASSESSMENT */}
              {activeTab === 'assessment' && (
                <div className="space-y-4">
                  {latestAssessment ? (
                    <div className="space-y-4 text-xs">
                      <div className="flex items-center justify-between pb-2 border-b border-[#E5E5DF]">
                        <div>
                          <span className="font-bold text-sm text-[#111827]">
                            Initial MSK Clinical Assessment
                          </span>
                          <span className="text-[#6B7280] ml-2">
                            Conducted on {latestAssessment.assessmentDate}
                          </span>
                        </div>
                        <span className="text-[11px] font-medium text-[#1B4332] bg-[#E8F3EE] px-2 py-0.5 rounded">
                          Template: {latestAssessment.templateType.toUpperCase()}
                        </span>
                      </div>

                      <div className="p-3 bg-[#FAF9F5] rounded-lg border border-[#E5E5DF]">
                        <h4 className="font-bold text-[#111827] mb-1">Working Hypothesis</h4>
                        <p className="text-[#4B5563]">{latestAssessment.workingHypothesis}</p>
                      </div>

                      {/* ROM Table */}
                      <div>
                        <h4 className="font-bold text-[#111827] mb-2">Range of Motion (Goniometry)</h4>
                        <div className="border border-[#E5E5DF] rounded-lg overflow-hidden">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-[#FAF9F5] text-[#6B7280] border-b border-[#E5E5DF]">
                              <tr>
                                <th className="p-2">Movement</th>
                                <th className="p-2 text-right">Active ROM</th>
                                <th className="p-2 text-right">Passive ROM</th>
                                <th className="p-2 text-right">Normal</th>
                                <th className="p-2">End Feel</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F3F4F0]">
                              {latestAssessment.rangeOfMotion.map((r, i) => (
                                <tr key={i} className="hover:bg-[#FAF9F5]">
                                  <td className="p-2 font-medium text-[#111827]">{r.movement}</td>
                                  <td className="p-2 text-right font-mono tabular-nums text-[#1B4332] font-semibold">
                                    {r.activeRom}°
                                  </td>
                                  <td className="p-2 text-right font-mono tabular-nums">{r.passiveRom}°</td>
                                  <td className="p-2 text-right font-mono tabular-nums text-[#6B7280]">{r.normalExpected}°</td>
                                  <td className="p-2 capitalize text-[#6B7280]">{r.endFeel.replace('_', ' ')}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Special Tests */}
                      <div>
                        <h4 className="font-bold text-[#111827] mb-2">Special Orthopedic Tests</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {latestAssessment.specialTests.map((test, idx) => (
                            <div
                              key={idx}
                              className="p-2.5 rounded-lg border border-[#E5E5DF] bg-[#FAF9F5] flex flex-col gap-0.5"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-[#111827]">{test.testName}</span>
                                <span
                                  className={`font-semibold capitalize text-[10px] ${
                                    test.result === 'positive'
                                      ? 'text-red-700'
                                      : test.result === 'negative'
                                      ? 'text-emerald-700'
                                      : 'text-[#6B7280]'
                                  }`}
                                >
                                  {test.result.replace('_', ' ')}
                                </span>
                              </div>
                              <span className="text-[11px] text-[#6B7280]">
                                {test.clinicalInterpretation}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          onClick={() => setActiveView('assessments')}
                          className="px-3 py-1.5 text-xs font-semibold text-white bg-[#1B4332] hover:bg-[#2D6A4F] rounded-lg transition-colors"
                        >
                          Open in Assessment Builder →
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="py-12 text-center text-xs text-[#9CA3AF]">
                      No clinical assessment on file yet for this patient.
                      <button
                        onClick={() => setActiveView('assessments')}
                        className="mt-2 block mx-auto text-xs font-semibold text-[#1B4332] underline"
                      >
                        Create Initial MSK Assessment
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: TREATMENT PLAN */}
              {activeTab === 'treatment' && (
                <div className="space-y-4 text-xs">
                  {patientPlan ? (
                    <>
                      <div className="p-3 bg-[#FAF9F5] border border-[#E5E5DF] rounded-xl flex items-center justify-between">
                        <div>
                          <span className="font-bold text-xs text-[#111827]">Plan Frequency & Cadence:</span>
                          <p className="text-xs text-[#1B4332] font-semibold mt-0.5">
                            {patientPlan.treatmentFrequency} · Next Milestone Review: {patientPlan.reviewDate}
                          </p>
                        </div>
                        <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full capitalize">
                          {patientPlan.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3 bg-[#FAF9F5] border border-[#E5E5DF] rounded-xl">
                          <h4 className="font-bold text-[#111827] mb-2">Short-Term Goals (2-4 Weeks)</h4>
                          <ul className="list-disc list-inside space-y-1 text-[#4B5563]">
                            {patientPlan.shortTermGoals.map((g, i) => (
                              <li key={i}>{g}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="p-3 bg-[#FAF9F5] border border-[#E5E5DF] rounded-xl">
                          <h4 className="font-bold text-[#111827] mb-2">Long-Term Goals (3-6 Months)</h4>
                          <ul className="list-disc list-inside space-y-1 text-[#4B5563]">
                            {patientPlan.longTermGoals.map((g, i) => (
                              <li key={i}>{g}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-bold text-[#111827] mb-2">Planned Clinical Interventions</h4>
                        <div className="space-y-1.5">
                          {patientPlan.plannedInterventions.map((item, idx) => (
                            <div
                              key={idx}
                              className="p-2 bg-white border border-[#E5E5DF] rounded-lg text-xs text-[#4B5563]"
                            >
                              • {item}
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="py-12 text-center text-xs text-[#9CA3AF]">
                      No treatment plan created yet.
                      <button
                        onClick={() => setActiveView('treatment_plans')}
                        className="mt-2 block mx-auto text-xs font-semibold text-[#1B4332] underline"
                      >
                        Create Treatment Plan
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: PRESCRIBED EXERCISES */}
              {activeTab === 'exercises' && (
                <div className="space-y-4 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-[#E5E5DF]">
                    <span className="font-bold text-xs text-[#111827]">
                      Home Exercise Program ({patientPlan?.prescribedExercises.length || 0} Prescribed)
                    </span>
                    <button
                      onClick={() => setActiveView('exercises')}
                      className="text-xs font-semibold text-[#1B4332] hover:underline"
                    >
                      Edit Prescriptions →
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {patientPlan?.prescribedExercises.map((ex) => (
                      <div
                        key={ex.id}
                        className="p-3 bg-[#FAF9F5] border border-[#E5E5DF] rounded-xl flex flex-col justify-between gap-2"
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-[#111827]">{ex.title}</span>
                            <span className="text-[10px] uppercase font-semibold text-[#6B7280]">
                              {ex.category}
                            </span>
                          </div>
                          {/* Dosage strip */}
                          <div className="mt-1 flex items-center gap-2 text-[11px] font-mono text-[#1B4332] font-semibold tabular-nums">
                            <span>{ex.sets} Sets</span>
                            <span>×</span>
                            <span>{ex.repetitions} Reps</span>
                            {ex.holdDurationSeconds > 0 && <span>({ex.holdDurationSeconds}s hold)</span>}
                            <span>·</span>
                            <span>{ex.frequencyPerDay}x daily</span>
                          </div>
                          <p className="text-xs text-[#4B5563] mt-1.5">{ex.instructions}</p>
                        </div>

                        {ex.isCompletedToday && (
                          <div className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Logged completed today by patient</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: OUTCOMES */}
              {activeTab === 'outcomes' && (
                <div className="space-y-4 text-xs">
                  <h4 className="font-bold text-xs text-[#111827]">
                    Recovery Progression & Measured Metrics
                  </h4>
                  <div className="border border-[#E5E5DF] rounded-xl overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-[#FAF9F5] text-[#6B7280] border-b border-[#E5E5DF]">
                        <tr>
                          <th className="p-2.5">Date</th>
                          <th className="p-2.5 text-center">NPRS Pain (0-10)</th>
                          <th className="p-2.5 text-center">PSFS Score (0-10)</th>
                          <th className="p-2.5 text-center">ROM (Degrees)</th>
                          <th className="p-2.5 text-center">Dynamometry</th>
                          <th className="p-2.5">Clinician Comments</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F3F4F0]">
                        {patientOutcomes.map((out) => (
                          <tr key={out.id} className="hover:bg-[#FAF9F5]">
                            <td className="p-2.5 font-medium text-[#111827]">{out.date}</td>
                            <td className="p-2.5 text-center font-bold text-[#1B4332] tabular-nums">
                              {out.nprsPainScore} / 10
                            </td>
                            <td className="p-2.5 text-center font-mono tabular-nums text-[#2D6A4F]">
                              {out.psfsScore}
                            </td>
                            <td className="p-2.5 text-center font-mono tabular-nums">
                              {out.primaryRomDegrees ? `${out.primaryRomDegrees}°` : '—'}
                            </td>
                            <td className="p-2.5 text-center font-mono tabular-nums">
                              {out.dynamometryKg ? `${out.dynamometryKg} kg` : '—'}
                            </td>
                            <td className="p-2.5 text-[#6B7280] text-[11px]">{out.clinicianNotes}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => setActiveView('recovery_timeline')}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-[#1B4332] rounded-lg hover:bg-[#2D6A4F] transition-colors"
                    >
                      View Graphical Recovery Charts →
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 6: APPOINTMENTS */}
              {activeTab === 'appointments' && (
                <div className="space-y-4 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-[#E5E5DF]">
                    <span className="font-bold text-xs text-[#111827]">
                      Appointment Attendance History
                    </span>
                    <button
                      onClick={() => setActiveView('appointments')}
                      className="text-xs font-semibold text-[#1B4332] hover:underline"
                    >
                      Book Next Session →
                    </button>
                  </div>

                  <div className="divide-y divide-[#F3F4F0] border border-[#E5E5DF] rounded-xl overflow-hidden">
                    {patientAppointments.map((apt) => (
                      <div key={apt.id} className="p-3 flex items-center justify-between hover:bg-[#FAF9F5]">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-[#111827]">{apt.date}</span>
                            <span className="text-[#6B7280]">{apt.time}</span>
                            <span className="text-[11px] text-[#4B5563] font-medium">({apt.serviceType})</span>
                          </div>
                          <span className="text-[11px] text-[#6B7280]">Clinician: {apt.clinicianName}</span>
                        </div>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded capitalize ${
                            apt.status === 'completed'
                              ? 'bg-emerald-50 text-emerald-800'
                              : apt.status === 'scheduled'
                              ? 'bg-amber-50 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {apt.status.replace('_', ' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 7: BILLING & INVOICES */}
              {activeTab === 'billing' && (
                <div className="space-y-4 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-[#E5E5DF]">
                    <div>
                      <span className="font-bold text-xs text-[#111827]">Patient Invoices & Statements</span>
                      <p className="text-[11px] text-[#6B7280]">
                        Total billed: ₹
                        {patientInvoices
                          .reduce((s, i) => s + i.totalAmount, 0)
                          .toLocaleString()}{' '}
                        · Paid: ₹
                        {patientInvoices
                          .reduce((s, i) => s + i.paidAmount, 0)
                          .toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveView('billing')}
                      className="text-xs font-semibold text-[#1B4332] hover:underline"
                    >
                      Create Invoice →
                    </button>
                  </div>

                  <div className="divide-y divide-[#F3F4F0] border border-[#E5E5DF] rounded-xl overflow-hidden">
                    {patientInvoices.map((inv) => (
                      <div key={inv.id} className="p-3 flex items-center justify-between hover:bg-[#FAF9F5]">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-[#111827]">{inv.invoiceNumber}</span>
                            <span className="text-[#6B7280]">{inv.date}</span>
                          </div>
                          <p className="text-[11px] text-[#4B5563] mt-0.5">
                            {inv.items.map((it) => it.description).join(', ')}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-[#111827] tabular-nums">
                            ₹{inv.totalAmount.toLocaleString()}
                          </div>
                          <span
                            className={`text-[10px] font-semibold uppercase ${
                              inv.paymentStatus === 'paid'
                                ? 'text-emerald-700'
                                : inv.paymentStatus === 'partial'
                                ? 'text-amber-700'
                                : 'text-red-600'
                            }`}
                          >
                            {inv.paymentStatus}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 8: CARE TIMELINE */}
              {activeTab === 'timeline' && (
                <div className="space-y-4 text-xs">
                  <h4 className="font-bold text-xs text-[#111827]">
                    End-to-End Clinical Care Pathway
                  </h4>
                  <div className="relative pl-6 border-l-2 border-[#E5E5DF] space-y-4 ml-2">
                    <div className="relative">
                      <div className="absolute -left-[31px] top-0 w-3 h-3 rounded-full bg-[#1B4332] ring-4 ring-white" />
                      <span className="text-[10px] text-[#6B7280] font-mono">
                        {selectedPatient.registrationDate}
                      </span>
                      <h5 className="font-bold text-xs text-[#111827]">Registration & Digital Pre-Assessment</h5>
                      <p className="text-[#4B5563] text-[11px] mt-0.5">
                        Patient registered via {selectedPatient.referralSource} with chief complaint of{' '}
                        {selectedPatient.chiefComplaint}.
                      </p>
                    </div>

                    {latestAssessment && (
                      <div className="relative">
                        <div className="absolute -left-[31px] top-0 w-3 h-3 rounded-full bg-[#2D6A4F] ring-4 ring-white" />
                        <span className="text-[10px] text-[#6B7280] font-mono">
                          {latestAssessment.assessmentDate}
                        </span>
                        <h5 className="font-bold text-xs text-[#111827]">Initial MSK Assessment Completed</h5>
                        <p className="text-[#4B5563] text-[11px] mt-0.5">
                          Working hypothesis formulated by Dr. Priyanka Singh: {latestAssessment.workingHypothesis}
                        </p>
                      </div>
                    )}

                    {patientSessions.map((s) => (
                      <div key={s.id} className="relative">
                        <div className="absolute -left-[31px] top-0 w-3 h-3 rounded-full bg-[#52B788] ring-4 ring-white" />
                        <span className="text-[10px] text-[#6B7280] font-mono">{s.date}</span>
                        <h5 className="font-bold text-xs text-[#111827]">Session #{s.sessionNumber} Completed</h5>
                        <p className="text-[#4B5563] text-[11px] mt-0.5">
                          Pain score {s.currentPainScore}/10 · Interventions: {s.interventionsPerformed.join(', ')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="py-20 text-center text-xs text-[#9CA3AF]">
              Select a patient from the directory to view details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
