import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SessionNote } from '../../types';
import {
  Activity,
  Plus,
  Save,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertTriangle,
  History,
} from 'lucide-react';

export const TreatmentSessions: React.FC = () => {
  const {
    patients,
    selectedPatient,
    sessionNotes,
    addSessionNote,
    currentStaff,
    treatmentPlans,
  } = useApp();

  const [patientId, setPatientId] = useState(selectedPatient?.id || patients[0]?.id || '');

  // Current session form
  const [date, setDate] = useState('2026-10-29');
  const [time, setTime] = useState('11:00 AM');
  const [subjectiveFeedback, setSubjectiveFeedback] = useState(
    'Patient reports noticeable reduction in morning stiffness. Managed 30-min walk yesterday without flare-up.'
  );
  const [currentPainScore, setCurrentPainScore] = useState<number>(3);
  const [objectiveFindings, setObjectiveFindings] = useState(
    'Passive range of motion fully symmetrical at 0° extension. Active knee flexion improved to 124°. Trace effusion.'
  );
  const [interventionsPerformed, setInterventionsPerformed] = useState<string>([
    'Grade III patellofemoral glides',
    'Leg press 30kg (3 sets x 12 reps)',
    'Eccentric step-downs on 6-inch aerobic step',
    'Cryo-compression 10 mins',
  ].join('\n'));
  const [exerciseDosageProgression, setExerciseDosageProgression] = useState(
    'Progressed resistance band for terminal knee extension from red to blue heavy band. Introduced single leg balance drills.'
  );
  const [patientTolerance, setPatientTolerance] = useState<SessionNote['patientTolerance']>('excellent');
  const [educationProvided, setEducationProvided] = useState(
    'Advised on pacing physical activity and wearing supportive footwear during outdoor walking.'
  );
  const [homeProgramUpdates, setHomeProgramUpdates] = useState(
    'Maintain daily morning mobility circuit; progress single leg calf raises to 3 sets of 15.'
  );
  const [planForNextSession, setPlanForNextSession] = useState(
    'Initiate low-impact elliptical trainer cross-training and test lateral agility step-overs.'
  );

  const [isSaved, setIsSaved] = useState(false);

  const patientNotes = sessionNotes.filter((s) => s.patientId === patientId);

  const handleSaveSession = (e: React.FormEvent) => {
    e.preventDefault();
    const splitInterventions = interventionsPerformed
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    addSessionNote({
      patientId,
      date,
      time,
      clinicianId: currentStaff?.id || 'staff-priyanka',
      subjectiveFeedback,
      currentPainScore,
      objectiveFindings,
      interventionsPerformed: splitInterventions,
      exerciseDosageProgression,
      patientTolerance,
      educationProvided,
      homeProgramUpdates,
      planForNextSession,
      signedByClinician: true,
      signedAt: new Date().toISOString(),
      isFinalized: true,
    });

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 text-left">
      {/* Top Header */}
      <div className="bg-white rounded-2xl border border-[#E5E5DF] p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1B4332] mb-1">
            <Activity className="w-4 h-4 text-[#2D6A4F]" />
            <span>Clinical Encounter</span>
            <span>·</span>
            <span>SOAP Session Documentation</span>
          </div>
          <h1 className="text-xl font-extrabold text-[#111827]">
            Treatment Session Note (Electronic Signature)
          </h1>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Document patient symptom response, objective test findings, manual interventions, and tolerance.
          </p>
        </div>

        <div className="w-full md:w-72">
          <label className="text-[11px] font-semibold text-[#4B5563] block mb-1">Patient</label>
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

      {isSaved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>
            Session Encounter finalized and signed by Dr. Priyanka Singh. Outcome record updated.
          </span>
        </div>
      )}

      {/* Main Grid: New Session Form (Left 7 cols) & Historical Sessions (Right 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Session Entry Form */}
        <form onSubmit={handleSaveSession} className="lg:col-span-7 bg-white p-6 rounded-xl border border-[#E5E5DF] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E5DF]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1B4332]">
              New Encounter Documentation (Session #{patientNotes.length + 1})
            </h3>
            <span className="text-[11px] text-[#6B7280]">
              Treating Clinician: Dr. Priyanka Singh, MPT
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-[11px] font-semibold text-[#4B5563] block mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2 border border-[#E5E5DF] rounded bg-[#FAF9F5] text-xs"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#4B5563] block mb-1">Time</label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full p-2 border border-[#E5E5DF] rounded bg-[#FAF9F5] text-xs font-mono"
              />
            </div>
          </div>

          {/* Subjective & Pain */}
          <div className="space-y-3 text-xs">
            <div>
              <label className="text-[11px] font-semibold text-[#4B5563] block mb-1">
                Subjective Changes Since Last Visit (S)
              </label>
              <textarea
                value={subjectiveFeedback}
                onChange={(e) => setSubjectiveFeedback(e.target.value)}
                className="w-full p-2 border border-[#E5E5DF] rounded bg-[#FAF9F5] text-xs h-16"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-semibold text-[#4B5563]">
                  Current Pain Intensity (NPRS 0 - 10)
                </label>
                <span className="font-bold text-[#1B4332] tabular-nums font-mono">
                  {currentPainScore} / 10
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={currentPainScore}
                onChange={(e) => setCurrentPainScore(Number(e.target.value))}
                className="w-full accent-[#1B4332]"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#4B5563] block mb-1">
                Objective Reassessment Findings (O)
              </label>
              <textarea
                value={objectiveFindings}
                onChange={(e) => setObjectiveFindings(e.target.value)}
                className="w-full p-2 border border-[#E5E5DF] rounded bg-[#FAF9F5] text-xs h-16"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#4B5563] block mb-1">
                Interventions & Manual Therapy Performed (One per line)
              </label>
              <textarea
                value={interventionsPerformed}
                onChange={(e) => setInterventionsPerformed(e.target.value)}
                className="w-full p-2 border border-[#E5E5DF] rounded bg-[#FAF9F5] text-xs h-20"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#4B5563] block mb-1">
                Exercise Progression & Loading Dosage
              </label>
              <input
                type="text"
                value={exerciseDosageProgression}
                onChange={(e) => setExerciseDosageProgression(e.target.value)}
                className="w-full p-2 border border-[#E5E5DF] rounded bg-[#FAF9F5] text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-[#4B5563] block mb-1">
                  Patient Tolerance
                </label>
                <select
                  value={patientTolerance}
                  onChange={(e) => setPatientTolerance(e.target.value as any)}
                  className="w-full p-2 border border-[#E5E5DF] rounded bg-[#FAF9F5] text-xs capitalize"
                >
                  <option value="excellent">Excellent - No adverse reaction</option>
                  <option value="good">Good - Mild fatigue</option>
                  <option value="moderate">Moderate - Slight post-exercise soreness</option>
                  <option value="poor">Poor - Excessive pain reported</option>
                  <option value="adverse_reaction">Adverse Reaction - Load reduced</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-[#4B5563] block mb-1">
                  Plan for Next Session
                </label>
                <input
                  type="text"
                  value={planForNextSession}
                  onChange={(e) => setPlanForNextSession(e.target.value)}
                  className="w-full p-2 border border-[#E5E5DF] rounded bg-[#FAF9F5] text-xs"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#E5E5DF] flex items-center justify-between">
            <span className="text-[11px] text-[#6B7280] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Signed by Dr. Priyanka Singh</span>
            </span>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-[#1B4332] hover:bg-[#2D6A4F] rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Sign & Finalize Encounter</span>
            </button>
          </div>
        </form>

        {/* Historical Encounter Notes Feed */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-xl border border-[#E5E5DF] text-left">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#111827] mb-3 flex items-center gap-2">
              <History className="w-4 h-4 text-[#2D6A4F]" />
              <span>Patient Encounter History ({patientNotes.length})</span>
            </h3>

            {patientNotes.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#9CA3AF]">
                No previous session notes recorded for this patient yet.
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {patientNotes.map((note) => (
                  <div
                    key={note.id}
                    className="p-3.5 bg-[#FAF9F5] border border-[#E5E5DF] rounded-xl space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#1B4332]">
                        Session #{note.sessionNumber} · {note.date}
                      </span>
                      <span className="font-mono text-[11px] font-bold text-[#111827] tabular-nums">
                        Pain: {note.currentPainScore}/10
                      </span>
                    </div>

                    <p className="text-[#4B5563] text-xs">
                      <strong>Subjective:</strong> {note.subjectiveFeedback}
                    </p>
                    <p className="text-[#4B5563] text-xs">
                      <strong>Objective:</strong> {note.objectiveFindings}
                    </p>

                    <div className="pt-1 border-t border-[#E5E5DF] flex items-center justify-between text-[10px] text-[#6B7280]">
                      <span className="capitalize">Tolerance: {note.patientTolerance.replace('_', ' ')}</span>
                      <span className="text-emerald-700 font-medium">Electronically Signed</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
