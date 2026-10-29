import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TreatmentPlan, ExercisePrescription } from '../../types';
import {
  FileText,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  Dumbbell,
  Clock,
  Sparkles,
  Layers,
} from 'lucide-react';

export const TreatmentPlanBuilder: React.FC = () => {
  const {
    patients,
    selectedPatient,
    treatmentPlans,
    saveTreatmentPlan,
    currentStaff,
    setActiveView,
  } = useApp();

  const [patientId, setPatientId] = useState(selectedPatient?.id || patients[0]?.id || '');
  const existingPlan = treatmentPlans.find((p) => p.patientId === patientId);

  const [treatmentFrequency, setTreatmentFrequency] = useState(
    existingPlan?.treatmentFrequency || '3 sessions weekly for 6 weeks'
  );
  const [reviewDate, setReviewDate] = useState(
    existingPlan?.reviewDate || '2026-11-15'
  );

  const [shortTermGoals, setShortTermGoals] = useState<string[]>(
    existingPlan?.shortTermGoals || [
      'Eliminate terminal knee extension lag (achieve symmetric 0°)',
      'Reach active knee flexion >= 120°',
      'Normalize gait mechanics without compensatory limp',
    ]
  );
  const [newShortGoal, setNewShortGoal] = useState('');

  const [longTermGoals, setLongTermGoals] = useState<string[]>(
    existingPlan?.longTermGoals || [
      'Limb Symmetry Index (LSI) >= 90% on dynamometry',
      'Safe progression to straight-line jogging protocol at 16 weeks',
    ]
  );
  const [newLongGoal, setNewLongGoal] = useState('');

  const [plannedInterventions, setPlannedInterventions] = useState<string[]>(
    existingPlan?.plannedInterventions || [
      'Grade III patellar superior and medial mobilizations',
      'Neuromuscular electrical stimulation (NMES) paired with active quad sets',
      'Closed kinetic chain leg press (30-60° range)',
      'Terminal knee extension with resistance band',
    ]
  );
  const [newIntervention, setNewIntervention] = useState('');

  const [exercises, setExercises] = useState<ExercisePrescription[]>(
    existingPlan?.prescribedExercises || [
      {
        id: 'ex-01',
        title: 'Prone Terminal Knee Extension Hangs',
        category: 'mobility',
        bodyRegion: 'Knee',
        sets: 3,
        repetitions: 1,
        holdDurationSeconds: 180,
        frequencyPerDay: 2,
        frequencyPerWeek: 7,
        instructions: 'Lie prone with lower leg off table edge. Allow gravity to draw knee into full extension.',
        precautions: 'Do not bounce or force hyperextension.',
      },
      {
        id: 'ex-02',
        title: 'Terminal Knee Extension (TKE) with Band',
        category: 'strengthening',
        bodyRegion: 'Knee',
        sets: 3,
        repetitions: 15,
        holdDurationSeconds: 3,
        frequencyPerDay: 2,
        frequencyPerWeek: 6,
        instructions: 'Loop resistance band behind knee crease and step back for tension. Straighten knee against resistance.',
        precautions: 'Maintain neutral lumbar posture.',
      },
    ]
  );

  // New Exercise Form
  const [newExTitle, setNewExTitle] = useState('');
  const [newExCategory, setNewExCategory] = useState<ExercisePrescription['category']>('strengthening');
  const [newExSets, setNewExSets] = useState(3);
  const [newExReps, setNewExReps] = useState(12);
  const [newExHold, setNewExHold] = useState(5);
  const [newExFreqDay, setNewExFreqDay] = useState(2);
  const [newExInstructions, setNewExInstructions] = useState('');

  const [isSaved, setIsSaved] = useState(false);

  const handleAddExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExTitle.trim()) return;
    const newEx: ExercisePrescription = {
      id: `ex-${Date.now()}`,
      title: newExTitle,
      category: newExCategory,
      bodyRegion: 'Targeted Region',
      sets: newExSets,
      repetitions: newExReps,
      holdDurationSeconds: newExHold,
      frequencyPerDay: newExFreqDay,
      frequencyPerWeek: 6,
      instructions: newExInstructions || 'Perform with controlled tempo and smooth breathing.',
      precautions: 'Halt if sharp provocative pain is experienced.',
    };
    setExercises([...exercises, newEx]);
    setNewExTitle('');
    setNewExInstructions('');
  };

  const handleRemoveExercise = (id: string) => {
    setExercises(exercises.filter((ex) => ex.id !== id));
  };

  const handleSavePlan = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedPlan: TreatmentPlan = {
      id: existingPlan?.id || `plan-${Date.now()}`,
      patientId,
      createdDate: existingPlan?.createdDate || '2026-10-29',
      lastUpdatedDate: '2026-10-29',
      clinicianId: currentStaff?.id || 'staff-priyanka',
      identifiedProblems: ['Biomechanical impairment', 'Inhibited motor recruitment'],
      shortTermGoals,
      longTermGoals,
      plannedInterventions,
      prescribedExercises: exercises,
      treatmentFrequency,
      reviewDate,
      milestonesExpected: [
        'Week 4: Pain reduction >= 50%',
        'Week 8: Symmetrical active range of motion',
        'Week 12: Strength symmetry >= 85%',
      ],
      status: 'active',
    };

    saveTreatmentPlan(updatedPlan);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 text-left">
      {/* Banner */}
      <div className="bg-white rounded-2xl border border-[#E5E5DF] p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1B4332] mb-1">
            <FileText className="w-4 h-4 text-[#2D6A4F]" />
            <span>Prescription & Care Plan</span>
          </div>
          <h1 className="text-xl font-extrabold text-[#111827]">
            Individualized Treatment Plan Builder
          </h1>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Formulate evidence-based clinical goals, planned manual interventions, and home exercise dosages.
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
          <span>Treatment Plan & Exercise Prescriptions saved and synced with Patient Portal.</span>
        </div>
      )}

      <form onSubmit={handleSavePlan} className="space-y-6">
        {/* Cadence & Review Date */}
        <div className="bg-white p-6 rounded-xl border border-[#E5E5DF] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-[11px] font-semibold text-[#4B5563] block mb-1">
              Planned Treatment Frequency
            </label>
            <input
              type="text"
              value={treatmentFrequency}
              onChange={(e) => setTreatmentFrequency(e.target.value)}
              className="w-full p-2.5 border border-[#E5E5DF] rounded-lg bg-[#FAF9F5] text-xs font-medium"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-[#4B5563] block mb-1">
              Next Formal Reassessment Date
            </label>
            <input
              type="date"
              value={reviewDate}
              onChange={(e) => setReviewDate(e.target.value)}
              className="w-full p-2.5 border border-[#E5E5DF] rounded-lg bg-[#FAF9F5] text-xs font-medium"
            />
          </div>
        </div>

        {/* Goals & Interventions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Short-Term Goals */}
          <div className="bg-white p-6 rounded-xl border border-[#E5E5DF] space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#1B4332]">
              Short-Term Clinical Goals
            </h3>
            <div className="space-y-2">
              {shortTermGoals.map((g, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-[#FAF9F5] rounded-lg border border-[#E5E5DF]">
                  <span className="text-xs text-[#4B5563]">• {g}</span>
                  <button
                    type="button"
                    onClick={() => setShortTermGoals(shortTermGoals.filter((_, i) => i !== idx))}
                    className="text-[#9CA3AF] hover:text-red-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2 pt-1">
              <input
                type="text"
                placeholder="Add goal..."
                value={newShortGoal}
                onChange={(e) => setNewShortGoal(e.target.value)}
                className="flex-1 p-2 border border-[#E5E5DF] rounded-lg text-xs"
              />
              <button
                type="button"
                onClick={() => {
                  if (newShortGoal.trim()) {
                    setShortTermGoals([...shortTermGoals, newShortGoal.trim()]);
                    setNewShortGoal('');
                  }
                }}
                className="px-3 py-2 bg-[#1B4332] text-white rounded-lg text-xs font-medium"
              >
                Add
              </button>
            </div>
          </div>

          {/* Long-Term Goals */}
          <div className="bg-white p-6 rounded-xl border border-[#E5E5DF] space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#1B4332]">
              Long-Term Functional Milestones
            </h3>
            <div className="space-y-2">
              {longTermGoals.map((g, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-[#FAF9F5] rounded-lg border border-[#E5E5DF]">
                  <span className="text-xs text-[#4B5563]">• {g}</span>
                  <button
                    type="button"
                    onClick={() => setLongTermGoals(longTermGoals.filter((_, i) => i !== idx))}
                    className="text-[#9CA3AF] hover:text-red-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2 pt-1">
              <input
                type="text"
                placeholder="Add milestone..."
                value={newLongGoal}
                onChange={(e) => setNewLongGoal(e.target.value)}
                className="flex-1 p-2 border border-[#E5E5DF] rounded-lg text-xs"
              />
              <button
                type="button"
                onClick={() => {
                  if (newLongGoal.trim()) {
                    setLongTermGoals([...longTermGoals, newLongGoal.trim()]);
                    setNewLongGoal('');
                  }
                }}
                className="px-3 py-2 bg-[#1B4332] text-white rounded-lg text-xs font-medium"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Exercise Prescriptions */}
        <div className="bg-white p-6 rounded-xl border border-[#E5E5DF] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1B4332] flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-[#2D6A4F]" />
              <span>Prescribed Home & Clinical Exercises ({exercises.length})</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {exercises.map((ex) => (
              <div
                key={ex.id}
                className="p-3.5 bg-[#FAF9F5] border border-[#E5E5DF] rounded-xl flex flex-col justify-between gap-2"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#111827]">{ex.title}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveExercise(ex.id)}
                      className="text-[#9CA3AF] hover:text-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[11px] text-[#1B4332] font-semibold mt-1 tabular-nums">
                    <span>{ex.sets} Sets</span>
                    <span>×</span>
                    <span>{ex.repetitions} Reps</span>
                    {ex.holdDurationSeconds > 0 && <span>({ex.holdDurationSeconds}s hold)</span>}
                    <span>·</span>
                    <span>{ex.frequencyPerDay}x/day</span>
                  </div>
                  <p className="text-xs text-[#4B5563] mt-1">{ex.instructions}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Add Exercise Inline Form */}
          <div className="p-4 bg-[#F3F4F0]/60 rounded-xl border border-[#E5E5DF] space-y-3 text-xs">
            <h4 className="font-bold text-xs text-[#111827]">Prescribe New Exercise Entry</h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-2">
                <label className="text-[11px] text-[#6B7280] block mb-1">Exercise Name</label>
                <input
                  type="text"
                  placeholder="e.g. Wall Sit with Isometric Adductor Ball Squeeze"
                  value={newExTitle}
                  onChange={(e) => setNewExTitle(e.target.value)}
                  className="w-full p-2 border border-[#E5E5DF] rounded bg-white text-xs"
                />
              </div>
              <div>
                <label className="text-[11px] text-[#6B7280] block mb-1">Category</label>
                <select
                  value={newExCategory}
                  onChange={(e) => setNewExCategory(e.target.value as any)}
                  className="w-full p-2 border border-[#E5E5DF] rounded bg-white text-xs capitalize"
                >
                  <option value="strengthening">Strengthening</option>
                  <option value="mobility">Mobility</option>
                  <option value="stability">Stability</option>
                  <option value="motor_control">Motor Control</option>
                  <option value="stretching">Stretching</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] text-[#6B7280] block mb-1">Frequency (Daily)</label>
                <input
                  type="number"
                  min="1"
                  max="4"
                  value={newExFreqDay}
                  onChange={(e) => setNewExFreqDay(Number(e.target.value))}
                  className="w-full p-2 border border-[#E5E5DF] rounded bg-white text-xs font-mono"
                />
              </div>
              <div>
                <label className="text-[11px] text-[#6B7280] block mb-1">Sets</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={newExSets}
                  onChange={(e) => setNewExSets(Number(e.target.value))}
                  className="w-full p-2 border border-[#E5E5DF] rounded bg-white text-xs font-mono"
                />
              </div>
              <div>
                <label className="text-[11px] text-[#6B7280] block mb-1">Reps</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={newExReps}
                  onChange={(e) => setNewExReps(Number(e.target.value))}
                  className="w-full p-2 border border-[#E5E5DF] rounded bg-white text-xs font-mono"
                />
              </div>
              <div>
                <label className="text-[11px] text-[#6B7280] block mb-1">Hold Duration (Sec)</label>
                <input
                  type="number"
                  min="0"
                  max="300"
                  value={newExHold}
                  onChange={(e) => setNewExHold(Number(e.target.value))}
                  className="w-full p-2 border border-[#E5E5DF] rounded bg-white text-xs font-mono"
                />
              </div>
              <div className="sm:col-span-4">
                <label className="text-[11px] text-[#6B7280] block mb-1">Instructions & Cues</label>
                <input
                  type="text"
                  placeholder="Key form cues: keep torso upright, drive through heels..."
                  value={newExInstructions}
                  onChange={(e) => setNewExInstructions(e.target.value)}
                  className="w-full p-2 border border-[#E5E5DF] rounded bg-white text-xs"
                />
              </div>
            </div>
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={handleAddExercise}
                className="px-4 py-1.5 text-xs font-semibold bg-[#2D6A4F] text-white hover:bg-[#1B4332] rounded-lg transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Exercise to Program</span>
              </button>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 text-xs font-semibold text-white bg-[#1B4332] hover:bg-[#2D6A4F] rounded-lg transition-colors flex items-center gap-2 shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>Save Treatment Plan & Update Portal</span>
          </button>
        </div>
      </form>
    </div>
  );
};
