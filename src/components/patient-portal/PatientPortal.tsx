import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Smartphone,
  Calendar,
  CheckCircle2,
  AlertCircle,
  PhoneCall,
  PlayCircle,
  TrendingDown,
  Dumbbell,
  Clock,
  Sparkles,
  Send,
} from 'lucide-react';

export const PatientPortal: React.FC = () => {
  const {
    patients,
    selectedPatient,
    treatmentPlans,
    appointments,
    toggleExerciseCompletion,
    addAppointment,
    addTask,
  } = useApp();

  const patient = selectedPatient || patients[0];
  const activePlan = treatmentPlans.find((p) => p.patientId === patient?.id);
  const nextAppointment = appointments
    .filter((a) => a.patientId === patient?.id && (a.status === 'scheduled' || a.status === 'checked_in'))
    .sort((a, b) => a.date.localeCompare(b.date))[0];

  // Feedback State
  const [prePain, setPrePain] = useState<number>(3);
  const [postPain, setPostPain] = useState<number>(2);
  const [difficultyRating, setDifficultyRating] = useState<'too_easy' | 'just_right' | 'too_hard'>('just_right');
  const [patientNote, setPatientNote] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);

  // Quick Appointment Request
  const [requestSent, setRequestSent] = useState(false);

  const completedCount = activePlan?.prescribedExercises.filter((e) => e.isCompletedToday).length || 0;
  const totalCount = activePlan?.prescribedExercises.length || 0;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (postPain >= 7 || difficultyRating === 'too_hard') {
      // Create a clinical task for Dr. Priyanka Singh
      addTask({
        patientId: patient.id,
        patientName: patient.fullName,
        title: `Exercise Adherence Alert: High post-exercise pain (${postPain}/10) logged`,
        taskType: 'exercise_review',
        dueDate: new Date().toISOString().split('T')[0],
        priority: 'urgent',
        assignedTo: 'Dr. Priyanka Singh',
      });
    }

    setFeedbackSent(true);
    setTimeout(() => setFeedbackSent(false), 3000);
  };

  const handleQuickRequestAppointment = () => {
    addTask({
      patientId: patient.id,
      patientName: patient.fullName,
      title: 'Patient requested appointment callback via Home Portal',
      taskType: 'missed_call',
      dueDate: new Date().toISOString().split('T')[0],
      priority: 'high',
      assignedTo: 'Sunita Rao',
    });
    setRequestSent(true);
    setTimeout(() => setRequestSent(false), 3000);
  };

  return (
    <div className="max-w-xl mx-auto space-y-5 text-left pb-12">
      {/* Mobile Portal Hero Header */}
      <div className="bg-gradient-to-br from-[#1B4332] to-[#2D6A4F] text-white p-5 rounded-2xl shadow-sm space-y-3">
        <div className="flex items-center justify-between text-xs text-white/80">
          <div className="flex items-center gap-1.5 font-semibold">
            <Smartphone className="w-4 h-4 text-[#52B788]" />
            <span>MOVEXA Patient Care Portal</span>
          </div>
          <span className="text-[11px] bg-white/10 px-2 py-0.5 rounded font-mono">
            {patient?.uhid}
          </span>
        </div>

        <div>
          <h1 className="text-xl font-bold">Hello, {patient?.fullName.split(' ')[0]}</h1>
          <p className="text-xs text-white/80 mt-0.5">
            Your personalized rehabilitation program assigned by Dr. Priyanka Singh.
          </p>
        </div>

        {/* Next Appointment Card */}
        {nextAppointment ? (
          <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/20 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-[#A3E4D7]" />
              <div>
                <span className="font-semibold block text-white">Upcoming Session</span>
                <span className="text-[11px] text-white/80">
                  {nextAppointment.date} at {nextAppointment.time} · {nextAppointment.clinicianName}
                </span>
              </div>
            </div>
            <span className="text-[10px] bg-[#52B788] text-white font-bold px-2 py-0.5 rounded">
              Confirmed
            </span>
          </div>
        ) : (
          <div className="bg-white/10 p-3 rounded-xl text-xs flex items-center justify-between">
            <span>No upcoming appointment booked</span>
            <button
              onClick={handleQuickRequestAppointment}
              className="px-2.5 py-1 bg-white text-[#1B4332] font-semibold text-[11px] rounded"
            >
              Request Session
            </button>
          </div>
        )}
      </div>

      {requestSent && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Appointment request sent to reception! Sunita will contact you shortly.</span>
        </div>
      )}

      {/* Daily Exercise Progress Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E5E5DF] space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-[#111827]">Today's Rehab Progress</span>
          <span className="font-mono font-bold text-[#1B4332] tabular-nums">
            {completedCount} of {totalCount} Completed ({progressPercent}%)
          </span>
        </div>
        <div className="w-full bg-[#FAF9F5] h-2.5 rounded-full overflow-hidden border border-[#E5E5DF]">
          <div
            className="bg-[#2D6A4F] h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Prescribed Exercises List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#1B4332] flex items-center gap-1.5">
            <Dumbbell className="w-4 h-4 text-[#2D6A4F]" />
            <span>Prescribed Exercises</span>
          </h2>
          <span className="text-[11px] text-[#6B7280]">Tap checkmark when finished</span>
        </div>

        {activePlan?.prescribedExercises.map((ex) => (
          <div
            key={ex.id}
            className={`p-4 rounded-xl border transition-all text-xs flex flex-col gap-3 ${
              ex.isCompletedToday
                ? 'bg-[#E8F3EE]/50 border-[#2D6A4F]/40'
                : 'bg-white border-[#E5E5DF]'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-bold text-sm text-[#111827]">{ex.title}</h3>
                <span className="text-[10px] text-[#6B7280] uppercase tracking-wider font-semibold">
                  {ex.category} · {ex.bodyRegion}
                </span>

                {/* Dosage Pill Strip */}
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-mono font-semibold text-[#1B4332] tabular-nums">
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
                  <span className="text-[#6B7280] font-sans text-[11px]">
                    {ex.frequencyPerDay}x daily
                  </span>
                </div>
              </div>

              {/* Completion Toggle Button */}
              <button
                onClick={() => toggleExerciseCompletion(activePlan.id, ex.id)}
                className={`p-2.5 rounded-full transition-all shrink-0 ${
                  ex.isCompletedToday
                    ? 'bg-[#2D6A4F] text-white shadow-xs'
                    : 'bg-[#F3F4F0] text-[#9CA3AF] hover:text-[#111827]'
                }`}
                title="Mark exercise complete"
              >
                <CheckCircle2 className="w-5 h-5" />
              </button>
            </div>

            {/* Exercise Instructions */}
            <p className="text-xs text-[#4B5563] bg-[#FAF9F5] p-2.5 rounded-lg border border-[#E5E5DF]">
              {ex.instructions}
            </p>

            {ex.precautions && (
              <span className="text-[11px] text-amber-800 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>Precaution: {ex.precautions}</span>
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Pain & Symptom Response Log */}
      <div className="bg-white p-5 rounded-xl border border-[#E5E5DF] space-y-4 text-xs">
        <h3 className="font-bold text-xs uppercase tracking-wider text-[#1B4332]">
          Session Pain & Difficulty Feedback
        </h3>
        <p className="text-xs text-[#6B7280]">
          Help Dr. Priyanka Singh track your tolerance and adjust your dosage safely.
        </p>

        <form onSubmit={handleSendFeedback} className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[11px] font-semibold text-[#4B5563]">Pre-Exercise Pain</span>
                <span className="font-bold text-[#111827] tabular-nums font-mono">{prePain}/10</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={prePain}
                onChange={(e) => setPrePain(Number(e.target.value))}
                className="w-full accent-[#1B4332]"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[11px] font-semibold text-[#4B5563]">Post-Exercise Pain</span>
                <span className="font-bold text-[#111827] tabular-nums font-mono">{postPain}/10</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={postPain}
                onChange={(e) => setPostPain(Number(e.target.value))}
                className="w-full accent-[#1B4332]"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#4B5563] block mb-1">
              Perceived Difficulty
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'too_easy', label: 'Too Easy' },
                { id: 'just_right', label: 'Just Right' },
                { id: 'too_hard', label: 'Too Intense' },
              ].map((diff) => (
                <button
                  type="button"
                  key={diff.id}
                  onClick={() => setDifficultyRating(diff.id as any)}
                  className={`py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    difficultyRating === diff.id
                      ? 'bg-[#1B4332] text-white border-[#1B4332]'
                      : 'bg-[#FAF9F5] border-[#E5E5DF] text-[#4B5563]'
                  }`}
                >
                  {diff.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#4B5563] block mb-1">
              Symptom Feedback or Questions for Clinician
            </label>
            <textarea
              value={patientNote}
              onChange={(e) => setPatientNote(e.target.value)}
              placeholder="e.g. Felt slight pull on last rep of heel slides..."
              className="w-full p-2 border border-[#E5E5DF] rounded-lg bg-[#FAF9F5] text-xs h-16"
            />
          </div>

          {feedbackSent && (
            <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-lg text-xs flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Feedback logged and synced with clinician chart.</span>
            </div>
          )}

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-[#1B4332] hover:bg-[#2D6A4F] rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Log Session Feedback</span>
            </button>
          </div>
        </form>
      </div>

      {/* Emergency & Clinic Contact Action */}
      <div className="p-4 bg-[#FAF9F5] border border-[#E5E5DF] rounded-xl flex items-center justify-between text-xs">
        <div>
          <span className="font-bold text-[#111827]">Need to speak with MOVEXA?</span>
          <p className="text-[#6B7280] text-[11px]">Direct line to reception desk</p>
        </div>
        <a
          href="tel:+919876543210"
          className="px-3.5 py-1.5 bg-[#1B4332] text-white rounded-lg font-semibold flex items-center gap-1.5 shadow-xs hover:bg-[#2D6A4F] transition-colors"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Call Clinic</span>
        </a>
      </div>
    </div>
  );
};
