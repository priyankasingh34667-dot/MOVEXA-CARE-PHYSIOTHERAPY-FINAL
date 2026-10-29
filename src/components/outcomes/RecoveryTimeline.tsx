import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LineChart,
  TrendingDown,
  TrendingUp,
  Award,
  AlertCircle,
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react';

export const RecoveryTimeline: React.FC = () => {
  const { patients, selectedPatient, outcomes } = useApp();
  const [patientId, setPatientId] = useState(selectedPatient?.id || patients[0]?.id || '');

  const patient = patients.find((p) => p.id === patientId) || selectedPatient || patients[0];
  const patientOutcomes = outcomes
    .filter((o) => o.patientId === patient?.id)
    .sort((a, b) => a.date.localeCompare(b.date));

  const baselineOutcome = patientOutcomes[0];
  const latestOutcome = patientOutcomes[patientOutcomes.length - 1];

  const painChange =
    baselineOutcome && latestOutcome
      ? baselineOutcome.nprsPainScore - latestOutcome.nprsPainScore
      : 0;

  const psfsChange =
    baselineOutcome && latestOutcome
      ? (latestOutcome.psfsScore - baselineOutcome.psfsScore).toFixed(1)
      : '0';

  return (
    <div className="max-w-5xl mx-auto space-y-6 text-left">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-[#E5E5DF] p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1B4332] mb-1">
            <LineChart className="w-4 h-4 text-[#2D6A4F]" />
            <span>Objective Metrics</span>
            <span>·</span>
            <span>Measurable Recovery</span>
          </div>
          <h1 className="text-xl font-extrabold text-[#111827]">
            Recovery Timeline & Validated Outcomes
          </h1>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Baseline vs. Follow-up comparisons for NPRS Pain, Patient-Specific Functional Scale, and Goniometry.
          </p>
        </div>

        <div className="w-full md:w-72">
          <label className="text-[11px] font-semibold text-[#4B5563] block mb-1">Select Patient</label>
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
      </div>

      {/* Clinical Context Banner */}
      <div className="p-4 bg-[#FAF9F5] border border-[#E5E5DF] rounded-xl text-xs text-[#4B5563] flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-[#1B4332] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-[#111827]">Clinical Interpretation Notice:</span> Meaningful
          recovery is multidimensional. Symptom reduction (NPRS) must be evaluated alongside objective
          goniometric range of motion, isometric dynamometry, and patient functional goals (PSFS).
        </div>
      </div>

      {/* 3 Metric Delta Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Pain NPRS Delta */}
        <div className="bg-white p-5 rounded-xl border border-[#E5E5DF] space-y-2">
          <span className="text-xs text-[#6B7280] font-medium">NPRS Pain Score (0 - 10)</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#1B4332] tabular-nums">
              {latestOutcome ? `${latestOutcome.nprsPainScore}/10` : '—'}
            </span>
            {baselineOutcome && latestOutcome && (
              <span className="text-xs font-semibold text-emerald-700 flex items-center">
                <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
                -{painChange} pts from baseline
              </span>
            )}
          </div>
          <div className="text-[11px] text-[#6B7280]">
            Baseline: {baselineOutcome?.nprsPainScore ?? '—'}/10 ({baselineOutcome?.date ?? ''})
          </div>
        </div>

        {/* PSFS Functional Score Delta */}
        <div className="bg-white p-5 rounded-xl border border-[#E5E5DF] space-y-2">
          <span className="text-xs text-[#6B7280] font-medium">Functional Scale (PSFS 0 - 10)</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#2D6A4F] tabular-nums">
              {latestOutcome ? `${latestOutcome.psfsScore}` : '—'}
            </span>
            {baselineOutcome && latestOutcome && (
              <span className="text-xs font-semibold text-emerald-700 flex items-center">
                <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                +{psfsChange} pts improvement
              </span>
            )}
          </div>
          <div className="text-[11px] text-[#6B7280]">
            Baseline: {baselineOutcome?.psfsScore ?? '—'} ({baselineOutcome?.date ?? ''})
          </div>
        </div>

        {/* Functional Milestones Met */}
        <div className="bg-white p-5 rounded-xl border border-[#E5E5DF] space-y-2">
          <span className="text-xs text-[#6B7280] font-medium">Functional Milestones</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#111827] tabular-nums">
              {latestOutcome ? `${latestOutcome.functionalMilestonesMet} / 5` : '—'}
            </span>
            <span className="text-xs font-semibold text-emerald-700">On Track</span>
          </div>
          <div className="text-[11px] text-[#6B7280]">
            Symmetrical gait, stairs & single-leg control
          </div>
        </div>
      </div>

      {/* Visual Progress Timeline Chart */}
      <div className="bg-white p-6 rounded-xl border border-[#E5E5DF] space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#111827]">
          Dated Clinical Measurements & Trend Visualization
        </h3>

        {patientOutcomes.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#9CA3AF]">
            No outcome data recorded for this patient yet.
          </div>
        ) : (
          <div className="space-y-6">
            {/* SVG Visual Chart */}
            <div className="p-4 bg-[#FAF9F5] border border-[#E5E5DF] rounded-xl">
              <div className="flex items-center justify-between text-xs text-[#6B7280] mb-4">
                <span>Pain Reduction vs. Functional Gain Over Time</span>
                <div className="flex items-center gap-4 text-[11px]">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1B4332]" />
                    <span>NPRS Pain (Lower is better)</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#52B788]" />
                    <span>PSFS Functional Ability</span>
                  </span>
                </div>
              </div>

              {/* Responsive SVG Chart */}
              <div className="w-full h-44 flex items-end justify-around gap-6 pt-6 border-b border-[#E5E5DF] pb-2">
                {patientOutcomes.map((out, idx) => {
                  const painHeight = Math.max(12, (out.nprsPainScore / 10) * 120);
                  const psfsHeight = Math.max(12, (out.psfsScore / 10) * 120);

                  return (
                    <div key={out.id} className="flex-1 flex flex-col items-center gap-2 group">
                      <div className="flex items-end gap-2 h-32">
                        {/* Pain Bar */}
                        <div className="flex flex-col items-center">
                          <span className="text-[10px] font-mono font-bold text-[#1B4332] mb-1 tabular-nums">
                            {out.nprsPainScore}
                          </span>
                          <div
                            className="w-5 bg-[#1B4332] rounded-t-sm transition-all duration-300 group-hover:bg-[#2D6A4F]"
                            style={{ height: `${painHeight}px` }}
                          />
                        </div>
                        {/* PSFS Bar */}
                        <div className="flex flex-col items-center">
                          <span className="text-[10px] font-mono font-bold text-[#2D6A4F] mb-1 tabular-nums">
                            {out.psfsScore}
                          </span>
                          <div
                            className="w-5 bg-[#52B788] rounded-t-sm transition-all duration-300 group-hover:bg-[#40916C]"
                            style={{ height: `${psfsHeight}px` }}
                          />
                        </div>
                      </div>
                      <span className="text-[11px] font-mono text-[#6B7280]">{out.date}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Table View of Dated Measurements */}
            <div className="border border-[#E5E5DF] rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-[#FAF9F5] text-[#6B7280] border-b border-[#E5E5DF]">
                  <tr>
                    <th className="p-3">Assessment Date</th>
                    <th className="p-3 text-center">NPRS Pain (0 - 10)</th>
                    <th className="p-3 text-center">PSFS Score (0 - 10)</th>
                    <th className="p-3 text-center">Primary ROM</th>
                    <th className="p-3 text-center">Dynamometry</th>
                    <th className="p-3">Milestones & Clinician Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F3F4F0]">
                  {patientOutcomes.map((out) => (
                    <tr key={out.id} className="hover:bg-[#FAF9F5]">
                      <td className="p-3 font-semibold text-[#111827]">{out.date}</td>
                      <td className="p-3 text-center font-bold text-[#1B4332] tabular-nums">
                        {out.nprsPainScore} / 10
                      </td>
                      <td className="p-3 text-center font-bold text-[#2D6A4F] tabular-nums">
                        {out.psfsScore}
                      </td>
                      <td className="p-3 text-center font-mono tabular-nums">
                        {out.primaryRomDegrees ? `${out.primaryRomDegrees}°` : '—'}
                      </td>
                      <td className="p-3 text-center font-mono tabular-nums">
                        {out.dynamometryKg ? `${out.dynamometryKg} kg` : '—'}
                      </td>
                      <td className="p-3 text-[#4B5563] text-xs">{out.clinicianNotes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
