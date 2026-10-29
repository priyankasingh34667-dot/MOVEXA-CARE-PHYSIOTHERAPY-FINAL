import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DischargeSummary } from '../../types';
import {
  FileSpreadsheet,
  Printer,
  Plus,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  Award,
  Calendar,
  User,
} from 'lucide-react';

export const DischargeSummaryView: React.FC = () => {
  const {
    patients,
    dischargeSummaries,
    saveDischargeSummary,
    currentStaff,
    selectedPatient,
  } = useApp();

  const [selectedSummaryId, setSelectedSummaryId] = useState<string>(
    dischargeSummaries[0]?.id || ''
  );
  const [showGenerator, setShowGenerator] = useState(false);

  // New Summary Form
  const [newPatientId, setNewPatientId] = useState(selectedPatient?.id || patients[0]?.id || '');
  const [referralReason, setReferralReason] = useState('Referred for conservative musculoskeletal rehabilitation.');
  const [initialPresentation, setInitialPresentation] = useState('Presented with significant pain, joint stiffness, and functional impairment.');
  const [keyFindings, setKeyFindings] = useState('Active range of motion deficits, muscle inhibition, and positive special tests.');
  const [treatmentDelivered, setTreatmentDelivered] = useState('Manual therapy joint mobilizations, progressive strength loading, and home exercise program.');
  const [baselinePain, setBaselinePain] = useState<number>(7);
  const [dischargePain, setDischargePain] = useState<number>(1);
  const [baselineFunc, setBaselineFunc] = useState<number>(3);
  const [dischargeFunc, setDischargeFunc] = useState<number>(9);
  const [goalsAchieved, setGoalsAchieved] = useState<string>('Full range of motion restored\nPain-free functional activity\nIndependent home self-management');
  const [remainingLimitations, setRemainingLimitations] = useState<string>('Avoid maximal unconditioned endurance load without proper warmup.');
  const [homeMaintenancePlan, setHomeMaintenancePlan] = useState('Continue daily mobility circuit and maintain strength training 3x weekly.');
  const [warningSigns, setWarningSigns] = useState('Seek immediate clinical review if sudden severe swelling, locking, or sharp radiating pain re-occurs.');
  const [followUpRec, setFollowUpRec] = useState('Routine review at 8 weeks or SOS if symptomatic relapse occurs.');

  const activeSummary =
    dischargeSummaries.find((d) => d.id === selectedSummaryId) || dischargeSummaries[0];

  const handleCreateSummary = (e: React.FormEvent) => {
    e.preventDefault();
    const pat = patients.find((p) => p.id === newPatientId);
    if (!pat) return;

    const summary: DischargeSummary = {
      id: `dis-${Date.now()}`,
      patientId: pat.id,
      patientName: pat.fullName,
      uhid: pat.uhid,
      dischargeDate: new Date().toISOString().split('T')[0],
      referralReason,
      initialPresentation,
      keyFindings,
      treatmentDelivered,
      baselinePainScore: baselinePain,
      dischargePainScore: dischargePain,
      baselineFunctionalScore: baselineFunc,
      dischargeFunctionalScore: dischargeFunc,
      goalsAchieved: goalsAchieved.split('\n').filter(Boolean),
      remainingLimitations: remainingLimitations.split('\n').filter(Boolean),
      homeMaintenancePlan,
      warningSignsAndAdvice: warningSigns,
      followUpRecommendation: followUpRec,
      dischargingClinician: 'Dr. Priyanka Singh, MPT (MSK & Sports)',
      isSigned: true,
    };

    saveDischargeSummary(summary);
    setSelectedSummaryId(summary.id);
    setShowGenerator(false);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5E5DF] no-print">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1B4332] mb-0.5">
            <FileSpreadsheet className="w-4 h-4 text-[#2D6A4F]" />
            <span>Clinical Documentation</span>
            <span>·</span>
            <span>Discharge & Transition of Care</span>
          </div>
          <h1 className="text-xl font-extrabold text-[#111827]">
            Formal Discharge Summaries
          </h1>
          <p className="text-xs text-[#6B7280]">
            Comprehensive baseline-to-discharge clinical comparisons, warning advice, and print-ready medical records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 text-xs font-semibold text-[#1B4332] bg-[#E8F3EE] hover:bg-[#D5EADB] rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Official Summary</span>
          </button>
          <button
            onClick={() => setShowGenerator(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#1B4332] hover:bg-[#2D6A4F] rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Create Discharge Record</span>
          </button>
        </div>
      </div>

      {/* Main Layout: Selector (no-print) + Formal Document View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Summary Selector (no-print) */}
        <div className="lg:col-span-4 bg-white p-4 rounded-xl border border-[#E5E5DF] space-y-2 no-print">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#1B4332] mb-2">
            Discharged Patient Records ({dischargeSummaries.length})
          </h3>
          <div className="space-y-2">
            {dischargeSummaries.map((dis) => (
              <button
                key={dis.id}
                onClick={() => setSelectedSummaryId(dis.id)}
                className={`w-full text-left p-3 rounded-lg border transition-all text-xs flex flex-col gap-1 ${
                  selectedSummaryId === dis.id
                    ? 'bg-[#E8F3EE] border-[#2D6A4F]/40'
                    : 'bg-[#FAF9F5] border-[#E5E5DF] hover:bg-[#F3F4F0]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#111827]">{dis.patientName}</span>
                  <span className="text-[10px] font-mono text-[#6B7280]">{dis.uhid}</span>
                </div>
                <span className="text-[11px] text-[#4B5563]">
                  Discharged: {dis.dischargeDate}
                </span>
                <div className="flex items-center gap-2 text-[10px] text-emerald-800 font-semibold mt-1">
                  <span>Pain: {dis.baselinePainScore} → {dis.dischargePainScore}/10</span>
                  <span>·</span>
                  <span>PSFS: {dis.baselineFunctionalScore} → {dis.dischargeFunctionalScore}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Formal Discharge Paper (Printable) */}
        <div className="lg:col-span-8 bg-white p-8 rounded-2xl border border-[#E5E5DF] shadow-sm space-y-6 print-page">
          {activeSummary ? (
            <>
              {/* Formal Letterhead */}
              <div className="border-b-2 border-[#1B4332] pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h2 className="text-2xl font-extrabold text-[#1B4332] tracking-tight">
                      MOVEXA PHYSIOTHERAPY
                    </h2>
                    <p className="text-xs text-[#4B5563] font-medium">
                      Clinical Intelligence · Personalised Rehabilitation · Measurable Recovery
                    </p>
                  </div>
                  <div className="text-left sm:text-right text-xs text-[#6B7280]">
                    <span className="font-bold text-[#111827] block">Dr. Priyanka Singh</span>
                    <span>MPT (Musculoskeletal & Sports), MIAP</span>
                    <span className="block text-[11px]">Reg #MPT-MSK-28492</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E5E5DF] flex flex-wrap justify-between text-xs text-[#4B5563]">
                  <div>
                    <strong>Patient:</strong> {activeSummary.patientName} ({activeSummary.uhid})
                  </div>
                  <div>
                    <strong>Discharge Date:</strong> {activeSummary.dischargeDate}
                  </div>
                  <div>
                    <strong>Clinician:</strong> {activeSummary.dischargingClinician}
                  </div>
                </div>
              </div>

              {/* Reason & History */}
              <div className="space-y-4 text-xs">
                <div>
                  <h4 className="font-bold text-[#1B4332] text-xs uppercase tracking-wider mb-1">
                    1. Referral Reason & Initial Presentation
                  </h4>
                  <p className="text-[#4B5563] leading-relaxed bg-[#FAF9F5] p-3 rounded-lg border border-[#E5E5DF]">
                    {activeSummary.referralReason} {activeSummary.initialPresentation}
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-[#1B4332] text-xs uppercase tracking-wider mb-1">
                    2. Rehabilitation Treatment Delivered
                  </h4>
                  <p className="text-[#4B5563] leading-relaxed bg-[#FAF9F5] p-3 rounded-lg border border-[#E5E5DF]">
                    {activeSummary.treatmentDelivered}
                  </p>
                </div>

                {/* Outcome Comparison Matrix */}
                <div>
                  <h4 className="font-bold text-[#1B4332] text-xs uppercase tracking-wider mb-1.5">
                    3. Objective Outcome Measures: Baseline vs. Discharge
                  </h4>
                  <div className="border border-[#E5E5DF] rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#FAF9F5] text-[#6B7280] border-b border-[#E5E5DF]">
                        <tr>
                          <th className="p-2.5">Outcome Measure</th>
                          <th className="p-2.5 text-center">Initial Baseline</th>
                          <th className="p-2.5 text-center">At Discharge</th>
                          <th className="p-2.5 text-center">Measured Change</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F3F4F0]">
                        <tr>
                          <td className="p-2.5 font-medium text-[#111827]">NPRS Pain Score (0 - 10)</td>
                          <td className="p-2.5 text-center font-mono tabular-nums text-red-700">
                            {activeSummary.baselinePainScore} / 10
                          </td>
                          <td className="p-2.5 text-center font-mono tabular-nums font-bold text-emerald-800">
                            {activeSummary.dischargePainScore} / 10
                          </td>
                          <td className="p-2.5 text-center font-bold text-emerald-700 tabular-nums">
                            -{activeSummary.baselinePainScore - activeSummary.dischargePainScore} Points (Significant Relief)
                          </td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-medium text-[#111827]">Patient Specific Functional Scale (PSFS)</td>
                          <td className="p-2.5 text-center font-mono tabular-nums text-[#6B7280]">
                            {activeSummary.baselineFunctionalScore} / 10
                          </td>
                          <td className="p-2.5 text-center font-mono tabular-nums font-bold text-emerald-800">
                            {activeSummary.dischargeFunctionalScore} / 10
                          </td>
                          <td className="p-2.5 text-center font-bold text-emerald-700 tabular-nums">
                            +{(activeSummary.dischargeFunctionalScore - activeSummary.baselineFunctionalScore).toFixed(1)} Points
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Goals Achieved */}
                <div>
                  <h4 className="font-bold text-[#1B4332] text-xs uppercase tracking-wider mb-1">
                    4. Functional Goals Achieved
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-[#4B5563]">
                    {activeSummary.goalsAchieved.map((g, i) => (
                      <li key={i}>{g}</li>
                    ))}
                  </ul>
                </div>

                {/* Home Maintenance & Warning Signs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 bg-[#FAF9F5] border border-[#E5E5DF] rounded-xl space-y-1">
                    <span className="font-bold text-[#1B4332] text-xs block">
                      Home Self-Management Plan:
                    </span>
                    <p className="text-[#4B5563] text-xs leading-relaxed">
                      {activeSummary.homeMaintenancePlan}
                    </p>
                  </div>
                  <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1 text-amber-900">
                    <span className="font-bold text-xs flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      <span>Warning Signs & Advice:</span>
                    </span>
                    <p className="text-xs text-[#4B5563] leading-relaxed">
                      {activeSummary.warningSignsAndAdvice}
                    </p>
                  </div>
                </div>

                {/* Sign-off Strip */}
                <div className="pt-6 border-t border-[#E5E5DF] flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[#6B7280] block text-[11px]">Follow-up Advice:</span>
                    <span className="font-medium text-[#111827]">{activeSummary.followUpRecommendation}</span>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1.5 text-emerald-800 font-bold justify-end">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                      <span>Digitally Signed</span>
                    </div>
                    <span className="text-xs font-bold text-[#111827] block mt-0.5">
                      Dr. Priyanka Singh, MPT (MSK & Sports)
                    </span>
                    <span className="text-[10px] text-[#6B7280]">
                      Clinic Director · MOVEXA Physiotherapy
                    </span>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>

      {/* MODAL: Generate New Discharge Summary */}
      {showGenerator && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-[#E5E5DF] shadow-xl max-w-2xl w-full p-6 text-left space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-sm font-bold text-[#1B4332]">
              Generate Patient Discharge Summary
            </h3>

            <form onSubmit={handleCreateSummary} className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-[#4B5563] block mb-1">
                  Select Patient to Discharge
                </label>
                <select
                  value={newPatientId}
                  onChange={(e) => setNewPatientId(e.target.value)}
                  className="w-full p-2 border border-[#E5E5DF] rounded-lg bg-[#FAF9F5] text-xs"
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
                  Treatment Delivered Summary
                </label>
                <textarea
                  value={treatmentDelivered}
                  onChange={(e) => setTreatmentDelivered(e.target.value)}
                  className="w-full p-2 border border-[#E5E5DF] rounded bg-[#FAF9F5] text-xs h-16"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-[#4B5563] block mb-1">
                    Baseline Pain (0-10)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={baselinePain}
                    onChange={(e) => setBaselinePain(Number(e.target.value))}
                    className="w-full p-2 border border-[#E5E5DF] rounded font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#4B5563] block mb-1">
                    Discharge Pain (0-10)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={dischargePain}
                    onChange={(e) => setDischargePain(Number(e.target.value))}
                    className="w-full p-2 border border-[#E5E5DF] rounded font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#4B5563] block mb-1">
                  Goals Achieved (One per line)
                </label>
                <textarea
                  value={goalsAchieved}
                  onChange={(e) => setGoalsAchieved(e.target.value)}
                  className="w-full p-2 border border-[#E5E5DF] rounded bg-[#FAF9F5] text-xs h-16"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#4B5563] block mb-1">
                  Home Maintenance & Warning Signs
                </label>
                <input
                  type="text"
                  value={homeMaintenancePlan}
                  onChange={(e) => setHomeMaintenancePlan(e.target.value)}
                  className="w-full p-2 border border-[#E5E5DF] rounded text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowGenerator(false)}
                  className="px-4 py-2 border border-[#E5E5DF] text-[#4B5563] rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold text-white bg-[#1B4332] hover:bg-[#2D6A4F] rounded-lg shadow-xs"
                >
                  Finalize & Sign Discharge Summary
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
