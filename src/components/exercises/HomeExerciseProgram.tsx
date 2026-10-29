import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Dumbbell, Plus, Search, Filter, PlayCircle, Clock, CheckCircle2 } from 'lucide-react';

export const HomeExerciseProgram: React.FC = () => {
  const { treatmentPlans, selectedPatient, setActiveView } = useApp();

  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const activePlan = treatmentPlans.find((p) => p.patientId === selectedPatient?.id) || treatmentPlans[0];

  const exercises = activePlan?.prescribedExercises || [];

  const filteredExercises = exercises.filter((ex) => {
    const matchesCat = categoryFilter === 'all' || ex.category === categoryFilter;
    const matchesSearch =
      ex.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.instructions.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6 text-left max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5E5DF]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1B4332] mb-0.5">
            <Dumbbell className="w-4 h-4 text-[#2D6A4F]" />
            <span>Rehabilitation Prescriptions</span>
            <span>·</span>
            <span>Home Exercise Program (HEP)</span>
          </div>
          <h1 className="text-xl font-extrabold text-[#111827]">
            Active Home Exercise Programs
          </h1>
          <p className="text-xs text-[#6B7280]">
            Clinician-prescribed home exercise regimens for {selectedPatient?.fullName || 'the active patient'}.
          </p>
        </div>

        <button
          onClick={() => setActiveView('treatment_plans')}
          className="px-4 py-2 text-xs font-semibold text-white bg-[#1B4332] hover:bg-[#2D6A4F] rounded-lg transition-colors flex items-center gap-1.5 shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Edit & Prescribe New Exercises</span>
        </button>
      </div>

      {/* Filter Ribbon */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-[#E5E5DF]">
        <div className="relative flex-1 max-w-xs">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="Search exercises..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-[#E5E5DF] rounded-lg bg-[#FAF9F5] focus:outline-none focus:border-[#1B4332]"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto text-xs">
          {['all', 'mobility', 'strengthening', 'stability', 'motor_control'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap capitalize transition-colors ${
                categoryFilter === cat
                  ? 'bg-[#1B4332] text-white shadow-xs'
                  : 'bg-[#FAF9F5] text-[#4B5563] hover:text-[#111827]'
              }`}
            >
              {cat.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Exercise Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredExercises.map((ex) => (
          <div
            key={ex.id}
            className="bg-white rounded-xl border border-[#E5E5DF] overflow-hidden flex flex-col justify-between text-xs"
          >
            {ex.imageUrl && (
              <div className="h-44 w-full overflow-hidden bg-slate-100 relative">
                <img
                  src={ex.imageUrl}
                  alt={ex.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 bg-[#1B4332]/90 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded">
                  {ex.category}
                </span>
              </div>
            )}

            <div className="p-4 space-y-2 flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-[#111827]">{ex.title}</h3>
                <span className="text-[10px] text-[#6B7280] font-semibold">{ex.bodyRegion}</span>
              </div>

              {/* Dosage strip */}
              <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#1B4332] tabular-nums">
                <span className="bg-[#FAF9F5] border border-[#E5E5DF] px-2 py-0.5 rounded">
                  {ex.sets} Sets
                </span>
                <span className="bg-[#FAF9F5] border border-[#E5E5DF] px-2 py-0.5 rounded">
                  {ex.repetitions} Reps
                </span>
                {ex.holdDurationSeconds > 0 && (
                  <span className="bg-[#FAF9F5] border border-[#E5E5DF] px-2 py-0.5 rounded">
                    {ex.holdDurationSeconds}s Hold
                  </span>
                )}
                <span>·</span>
                <span>{ex.frequencyPerDay}x/day</span>
              </div>

              <p className="text-xs text-[#4B5563] leading-relaxed pt-1">{ex.instructions}</p>
              {ex.precautions && (
                <p className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded border border-amber-200">
                  ⚠️ Precaution: {ex.precautions}
                </p>
              )}
            </div>

            <div className="p-3 bg-[#FAF9F5] border-t border-[#E5E5DF] flex items-center justify-between">
              <span className="text-[11px] text-[#6B7280]">
                Prescribed by Dr. Priyanka Singh
              </span>
              <button
                onClick={() => setActiveView('patient_portal')}
                className="text-xs font-semibold text-[#1B4332] hover:underline"
              >
                View in Patient Portal →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
