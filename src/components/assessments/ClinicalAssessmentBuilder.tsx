import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MSKAssessment,
  RangeOfMotionEntry,
  MuscleStrengthEntry,
  SpecialTestEntry,
} from '../../types';
import {
  FileCheck2,
  Stethoscope,
  Activity,
  AlertTriangle,
  Sparkles,
  Save,
  CheckCircle2,
  ShieldCheck,
  Plus,
  Trash2,
} from 'lucide-react';

const REGIONAL_TEMPLATES: Record<
  string,
  {
    rom: Array<{ movement: string; normal: number }>;
    strength: string[];
    specialTests: string[];
  }
> = {
  knee: {
    rom: [
      { movement: 'Knee Flexion (Involved)', normal: 140 },
      { movement: 'Knee Extension (Involved)', normal: 0 },
      { movement: 'Patellar Superior-Inferior Glide', normal: 100 },
      { movement: 'Knee Flexion (Contralateral)', normal: 140 },
    ],
    strength: ['Quadriceps (Isometric 60°)', 'Hamstrings (Prone 90°)', 'Gluteus Medius', 'Hip Extensors'],
    specialTests: ['Lachman Test (ACL)', 'Anterior Drawer Test', 'Pivot Shift Test', 'Sweep / Effusion Wave Test', 'McMurray Test (Meniscus)'],
  },
  lumbar: {
    rom: [
      { movement: 'Lumbar Flexion (Schober Index)', normal: 60 },
      { movement: 'Lumbar Extension', normal: 25 },
      { movement: 'Right Lateral Side Flexion', normal: 30 },
      { movement: 'Left Lateral Side Flexion', normal: 30 },
    ],
    strength: ['L2 Hip Flexors (Iliopsoas)', 'L3 Knee Extensors (Quads)', 'L4 Ankle Dorsiflexors (Tibialis Ant)', 'L5 Great Toe Extensor (EHL)', 'S1 Plantarflexors'],
    specialTests: ['Straight Leg Raise (SLR)', 'Slump Test (Neural Tension)', 'Crossed SLR (Well Leg)', 'Prone Instability Test', 'Facet Quadrant Test'],
  },
  shoulder: {
    rom: [
      { movement: 'Shoulder Flexion', normal: 180 },
      { movement: 'Shoulder Abduction', normal: 180 },
      { movement: 'External Rotation (Neutral)', normal: 90 },
      { movement: 'Internal Rotation (Neutral)', normal: 70 },
    ],
    strength: ['Supraspinatus (Empty Can)', 'Infraspinatus / Teres Minor', 'Subscapularis (Bear Hug)', 'Serratus Anterior'],
    specialTests: ['Neer Impingement Test', 'Hawkins-Kennedy Test', 'Empty Can (Jobe) Test', 'Speed Test (Biceps)', 'Apprehension & Relocation Test'],
  },
  cervical: {
    rom: [
      { movement: 'Cervical Flexion', normal: 60 },
      { movement: 'Cervical Extension', normal: 75 },
      { movement: 'Cervical Right Rotation', normal: 80 },
      { movement: 'Cervical Left Rotation', normal: 80 },
    ],
    strength: ['Craniocervical Flexors (Deep Neck)', 'Cervical Extensors', 'Rhomboids & Mid Trapezius', 'Lower Trapezius'],
    specialTests: ['Spurling Compression Test', 'Distraction Test', 'Upper Limb Tension Test 1 (Median)', 'Cervical Flexion-Rotation Test'],
  },
  ankle: {
    rom: [
      { movement: 'Ankle Dorsiflexion (Knee Flexed)', normal: 20 },
      { movement: 'Ankle Plantarflexion', normal: 50 },
      { movement: 'Subtalar Inversion', normal: 35 },
      { movement: 'Subtalar Eversion', normal: 15 },
    ],
    strength: ['Gastrocnemius-Soleus Complex', 'Tibialis Posterior', 'Peroneus Longus & Brevis'],
    specialTests: ['Anterior Drawer (ATFL)', 'Talar Tilt (CFL)', 'Thompson Squeeze Test (Achilles)', 'Squeeze Test (Syndesmosis)'],
  },
  elbow: {
    rom: [
      { movement: 'Elbow Flexion', normal: 145 },
      { movement: 'Elbow Extension', normal: 0 },
      { movement: 'Forearm Pronation', normal: 80 },
      { movement: 'Forearm Supination', normal: 85 },
    ],
    strength: ['Wrist Extensors (ECRB)', 'Wrist Flexors', 'Biceps Brachii', 'Triceps'],
    specialTests: ['Cozen Test (Lateral Epicondylalgia)', 'Mill Test', 'Golfer Elbow Test', 'Phalen Test (Carpal Tunnel)'],
  },
  sports: {
    rom: [
      { movement: 'Hip Internal Rotation (90°)', normal: 40 },
      { movement: 'Hip External Rotation (90°)', normal: 45 },
      { movement: 'Weight-Bearing Lunge Dorsiflexion', normal: 12 },
    ],
    strength: ['Isometric Hip Adductors (Squeeze)', 'Hamstring Nordic Curl Isometric', 'Gluteus Medius Dynamometry'],
    specialTests: ['Single-Leg Hop for Distance', 'Triple Hop Test', 'Y-Balance Test', 'Crossover Hop Test'],
  },
  general: {
    rom: [
      { movement: 'Active Major Joint Flexion', normal: 100 },
      { movement: 'Active Major Joint Extension', normal: 100 },
    ],
    strength: ['Major Flexor Group', 'Major Extensor Group'],
    specialTests: ['Joint Stability Screening', 'Neural Provocation Screen'],
  },
};

export const ClinicalAssessmentBuilder: React.FC = () => {
  const {
    patients,
    selectedPatientId,
    setSelectedPatientId,
    selectedPatient,
    assessments,
    saveAssessment,
    currentStaff,
    setActiveView,
  } = useApp();

  const [patientId, setPatientId] = useState(selectedPatient?.id || patients[0]?.id || '');
  const [templateType, setTemplateType] = useState<
    'knee' | 'lumbar' | 'cervical' | 'shoulder' | 'ankle' | 'elbow' | 'sports' | 'general'
  >((selectedPatient?.affectedBodyRegion as any) || 'knee');

  // Form Fields
  const [subjectiveHistory, setSubjectiveHistory] = useState(
    'Patient presents for clinical evaluation. Describes localized discomfort aggravated by functional weight-bearing and prolonged load.'
  );
  const [observationPosture, setObservationPosture] = useState(
    'Slight antalgic posture. Minimal local edema. Muscle bulk comparison reveals subtle atrophy on symptomatic limb.'
  );
  const [gaitFunctionalMovement, setGaitFunctionalMovement] = useState(
    'Mild reduction in terminal extension at late stance. Step length shortened on involved side.'
  );

  // Dynamic ROM based on template
  const [romEntries, setRomEntries] = useState<RangeOfMotionEntry[]>(() =>
    REGIONAL_TEMPLATES[templateType]?.rom.map((r) => ({
      movement: r.movement,
      activeRom: r.normal - 20,
      passiveRom: r.normal - 10,
      normalExpected: r.normal,
      painReported: true,
      endFeel: 'capsular',
    })) || []
  );

  // Dynamic Strength
  const [strengthEntries, setStrengthEntries] = useState<MuscleStrengthEntry[]>(() =>
    REGIONAL_TEMPLATES[templateType]?.strength.map((s) => ({
      muscleGroup: s,
      grade: 4,
      painful: false,
    })) || []
  );

  // Dynamic Special Tests
  const [specialTests, setSpecialTests] = useState<SpecialTestEntry[]>(() =>
    REGIONAL_TEMPLATES[templateType]?.specialTests.map((t) => ({
      testName: t,
      result: 'negative',
      clinicalInterpretation: 'End-point intact without instability',
    })) || []
  );

  const [palpationFindings, setPalpationFindings] = useState(
    'Tenderness over peri-articular soft tissues. No palpable warmth or crepitus.'
  );
  const [functionalPerformanceTests, setFunctionalPerformanceTests] = useState(
    'Sit-to-stand reveals asymmetric weight shift. Single-leg squat demonstrates dynamic knee valgus.'
  );
  const [redFlags, setRedFlags] = useState<string[]>([]);
  const [problemList, setProblemList] = useState<string[]>([
    'Restricted range of motion compared to contralateral side',
    'Inhibited neuromuscular motor control and strength deficit (Grade 4/5)',
    'Altered movement biomechanics during functional loading',
  ]);
  const [workingHypothesis, setWorkingHypothesis] = useState(
    'Subacute musculoskeletal dysfunction with arthrogenic inhibition and mechanical movement impairment.'
  );
  const [differentialConsiderations, setDifferentialConsiderations] = useState<string[]>([
    'Myofascial pain referral',
    'Tendinopathy / overload reaction',
  ]);
  const [shortTermGoals, setShortTermGoals] = useState<string[]>([
    'Reduce NPRS pain by >= 50% in 3 weeks',
    'Restore symmetrical passive range of motion',
  ]);
  const [longTermGoals, setLongTermGoals] = useState<string[]>([
    'Achieve 90% limb symmetry on functional performance tests',
    'Return to unrestricted recreational activity within 8 weeks',
  ]);
  const [initialManagementPlan, setInitialManagementPlan] = useState(
    'Targeted joint mobilizations, progressive isometric-to-isotonic resistance exercises, neuromuscular re-education, and structured home exercise program.'
  );

  const [isSaved, setIsSaved] = useState(false);
  const [isAiDrafting, setIsAiDrafting] = useState(false);

  // When template changes, load relevant clinical defaults
  const handleTemplateChange = (newTemplate: any) => {
    setTemplateType(newTemplate);
    const config = REGIONAL_TEMPLATES[newTemplate];
    if (config) {
      setRomEntries(
        config.rom.map((r) => ({
          movement: r.movement,
          activeRom: r.normal - 15,
          passiveRom: r.normal - 8,
          normalExpected: r.normal,
          painReported: true,
          endFeel: 'capsular',
        }))
      );
      setStrengthEntries(
        config.strength.map((s) => ({
          muscleGroup: s,
          grade: 4,
          painful: false,
        }))
      );
      setSpecialTests(
        config.specialTests.map((t) => ({
          testName: t,
          result: 'negative',
          clinicalInterpretation: 'Negative finding',
        }))
      );
    }
  };

  const handleAiDraftAssistant = () => {
    setIsAiDrafting(true);
    setTimeout(() => {
      setSubjectiveHistory(
        `Patient reports symptomatic onset localized to the ${templateType} region. Pain is mechanical in nature, aggravated by sustained loading and alleviated by rest. No constitutional red flags noted.`
      );
      setWorkingHypothesis(
        `Clinical presentation aligns with ${templateType.toUpperCase()} mechanical dysfunction characterized by Grade 4/5 strength inhibition and ROM restriction, responsive to targeted manual therapy and kinetic rehabilitation.`
      );
      setIsAiDrafting(false);
    }, 700);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newAssessment: MSKAssessment = {
      id: `msk-${Date.now()}`,
      patientId,
      assessmentDate: '2026-10-29',
      clinicianId: currentStaff?.id || 'staff-priyanka',
      templateType,
      subjectiveHistory,
      observationPosture,
      gaitFunctionalMovement,
      rangeOfMotion: romEntries,
      muscleStrength: strengthEntries,
      neurologicalScreening: {
        dermatomesIntact: true,
        myotomesIntact: true,
        reflexesIntact: true,
        neuralTensionSigns: 'Neural provocation tests within normal limits',
      },
      specialTests,
      palpationFindings,
      functionalPerformanceTests,
      redFlagsIdentified: redFlags,
      problemList,
      workingHypothesis,
      differentialConsiderations,
      shortTermGoals,
      longTermGoals,
      initialManagementPlan,
      isFinalized: true,
    };

    saveAssessment(newAssessment);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 text-left">
      {/* Top Header */}
      <div className="bg-white rounded-2xl border border-[#E5E5DF] p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1B4332] mb-1">
            <Stethoscope className="w-4 h-4 text-[#2D6A4F]" />
            <span>Clinical Workspace</span>
            <span>·</span>
            <span>Dr. Priyanka Singh, Lead Clinician</span>
          </div>
          <h1 className="text-xl font-extrabold text-[#111827]">
            Advanced MSK Clinical Assessment Builder
          </h1>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Objective orthopedic examination, standardized ROM goniometry, muscle strength grades, and working hypothesis.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAiDraftAssistant}
            disabled={isAiDrafting}
            className="px-3.5 py-2 text-xs font-semibold bg-[#FAF9F5] border border-[#2D6A4F]/30 text-[#1B4332] hover:bg-[#E8F3EE] rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            title="Clinician AI assistant to synthesize findings into clinical summary"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#2D6A4F]" />
            <span>{isAiDrafting ? 'Drafting Summary...' : 'AI Clinical Note Draft'}</span>
          </button>
        </div>
      </div>

      {isSaved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>
            Clinical Assessment finalized and signed by Dr. Priyanka Singh. Patient status updated to In Rehab.
          </span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Selector & Anatomical Template */}
        <div className="bg-white p-6 rounded-xl border border-[#E5E5DF] space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-[11px] font-semibold text-[#4B5563] block mb-1">
                Patient Under Examination
              </label>
              <select
                value={patientId}
                onChange={(e) => {
                  setPatientId(e.target.value);
                  setSelectedPatientId(e.target.value);
                }}
                className="w-full p-2.5 border border-[#E5E5DF] rounded-lg bg-[#FAF9F5] text-xs font-medium focus:outline-none focus:border-[#1B4332]"
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.fullName} ({p.uhid}) - {p.chiefComplaint.slice(0, 35)}...
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#4B5563] block mb-1">
                Anatomical / Condition Template
              </label>
              <select
                value={templateType}
                onChange={(e) => handleTemplateChange(e.target.value)}
                className="w-full p-2.5 border border-[#E5E5DF] rounded-lg bg-[#FAF9F5] text-xs font-semibold capitalize text-[#1B4332] focus:outline-none focus:border-[#1B4332]"
              >
                <option value="knee">Knee Joint Pain & Post-Op</option>
                <option value="lumbar">Low Back Pain & Radiculopathy</option>
                <option value="cervical">Neck Pain & Cervicogenic Headache</option>
                <option value="shoulder">Shoulder & Rotator Cuff Impingement</option>
                <option value="ankle">Ankle & Foot Sprain / Tendinopathy</option>
                <option value="elbow">Elbow & Wrist Overload</option>
                <option value="sports">Sports Kinetic Performance</option>
                <option value="general">General Musculoskeletal Assessment</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 1: Subjective & Posture & Gait */}
        <div className="bg-white p-6 rounded-xl border border-[#E5E5DF] space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#1B4332]">
            1. Subjective Examination, Posture & Gait
          </h3>
          <div className="space-y-3 text-xs">
            <div>
              <label className="text-[11px] font-semibold text-[#4B5563] block mb-1">
                Subjective History & Chronology of Symptoms
              </label>
              <textarea
                value={subjectiveHistory}
                onChange={(e) => setSubjectiveHistory(e.target.value)}
                className="w-full p-2.5 border border-[#E5E5DF] rounded-lg bg-[#FAF9F5] text-xs focus:outline-none focus:border-[#1B4332] h-20"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-semibold text-[#4B5563] block mb-1">
                  Static Observation & Postural Alignment
                </label>
                <textarea
                  value={observationPosture}
                  onChange={(e) => setObservationPosture(e.target.value)}
                  className="w-full p-2.5 border border-[#E5E5DF] rounded-lg bg-[#FAF9F5] text-xs focus:outline-none focus:border-[#1B4332] h-18"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-[#4B5563] block mb-1">
                  Gait & Functional Movement Pattern
                </label>
                <textarea
                  value={gaitFunctionalMovement}
                  onChange={(e) => setGaitFunctionalMovement(e.target.value)}
                  className="w-full p-2.5 border border-[#E5E5DF] rounded-lg bg-[#FAF9F5] text-xs focus:outline-none focus:border-[#1B4332] h-18"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Active & Passive Range of Motion */}
        <div className="bg-white p-6 rounded-xl border border-[#E5E5DF] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1B4332]">
              2. Range of Motion (Goniometry in Degrees)
            </h3>
            <span className="text-[11px] text-[#6B7280]">
              Units: Degrees (°) · Standard universal goniometer
            </span>
          </div>

          <div className="border border-[#E5E5DF] rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-[#FAF9F5] text-[#6B7280] border-b border-[#E5E5DF]">
                <tr>
                  <th className="p-2.5">Movement Plane</th>
                  <th className="p-2.5 text-center">Active ROM (°)</th>
                  <th className="p-2.5 text-center">Passive ROM (°)</th>
                  <th className="p-2.5 text-center">Normal Expected</th>
                  <th className="p-2.5">End-Feel</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3F4F0]">
                {romEntries.map((r, idx) => (
                  <tr key={idx} className="hover:bg-[#FAF9F5]">
                    <td className="p-2.5 font-medium text-[#111827]">{r.movement}</td>
                    <td className="p-2.5 text-center">
                      <input
                        type="number"
                        value={r.activeRom}
                        onChange={(e) => {
                          const updated = [...romEntries];
                          updated[idx].activeRom = Number(e.target.value);
                          setRomEntries(updated);
                        }}
                        className="w-16 p-1 text-center font-mono font-bold text-[#1B4332] border border-[#E5E5DF] rounded bg-white tabular-nums"
                      />
                    </td>
                    <td className="p-2.5 text-center">
                      <input
                        type="number"
                        value={r.passiveRom}
                        onChange={(e) => {
                          const updated = [...romEntries];
                          updated[idx].passiveRom = Number(e.target.value);
                          setRomEntries(updated);
                        }}
                        className="w-16 p-1 text-center font-mono border border-[#E5E5DF] rounded bg-white tabular-nums"
                      />
                    </td>
                    <td className="p-2.5 text-center font-mono text-[#6B7280] tabular-nums">
                      {r.normalExpected}°
                    </td>
                    <td className="p-2.5">
                      <select
                        value={r.endFeel}
                        onChange={(e) => {
                          const updated = [...romEntries];
                          updated[idx].endFeel = e.target.value as any;
                          setRomEntries(updated);
                        }}
                        className="p-1 text-xs border border-[#E5E5DF] rounded bg-white"
                      >
                        <option value="normal">Normal</option>
                        <option value="capsular">Capsular / Firm</option>
                        <option value="empty">Empty / Pain-limited</option>
                        <option value="bone_to_bone">Bone-to-bone / Hard</option>
                        <option value="spasm">Muscle Spasm</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Muscle Strength (MRC Grade 0 - 5) */}
        <div className="bg-white p-6 rounded-xl border border-[#E5E5DF] space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#1B4332]">
            3. Resisted Muscle Testing (MRC 0 - 5 Grade)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {strengthEntries.map((s, idx) => (
              <div
                key={idx}
                className="p-3 bg-[#FAF9F5] border border-[#E5E5DF] rounded-xl flex items-center justify-between"
              >
                <span className="font-semibold text-[#111827]">{s.muscleGroup}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-[#6B7280]">Grade:</span>
                  <select
                    value={s.grade}
                    onChange={(e) => {
                      const updated = [...strengthEntries];
                      updated[idx].grade = Number(e.target.value);
                      setStrengthEntries(updated);
                    }}
                    className="p-1 font-mono font-bold text-xs border border-[#E5E5DF] rounded bg-white text-[#1B4332]"
                  >
                    <option value="5">5/5 (Normal)</option>
                    <option value="4">4/5 (Moderate resistance)</option>
                    <option value="3">3/5 (Against gravity only)</option>
                    <option value="2">2/5 (Gravity eliminated)</option>
                    <option value="1">1/5 (Trace flicker)</option>
                    <option value="0">0/5 (No contraction)</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Special Orthopedic Tests */}
        <div className="bg-white p-6 rounded-xl border border-[#E5E5DF] space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#1B4332]">
            4. Special Orthopedic Tests & Clinical Interpretation
          </h3>
          <div className="space-y-2 text-xs">
            {specialTests.map((t, idx) => (
              <div
                key={idx}
                className="p-3 bg-[#FAF9F5] border border-[#E5E5DF] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="w-1/3">
                  <span className="font-bold text-[#111827]">{t.testName}</span>
                </div>
                <div className="w-1/4">
                  <select
                    value={t.result}
                    onChange={(e) => {
                      const updated = [...specialTests];
                      updated[idx].result = e.target.value as any;
                      setSpecialTests(updated);
                    }}
                    className={`p-1.5 text-xs font-semibold rounded border ${
                      t.result === 'positive'
                        ? 'border-red-300 text-red-700 bg-red-50'
                        : t.result === 'negative'
                        ? 'border-emerald-300 text-emerald-800 bg-emerald-50'
                        : 'border-[#E5E5DF] text-[#6B7280] bg-white'
                    }`}
                  >
                    <option value="negative">Negative</option>
                    <option value="positive">Positive</option>
                    <option value="indeterminate">Indeterminate</option>
                    <option value="not_tested">Not Tested / Contraindicated</option>
                  </select>
                </div>
                <div className="w-5/12">
                  <input
                    type="text"
                    value={t.clinicalInterpretation}
                    onChange={(e) => {
                      const updated = [...specialTests];
                      updated[idx].clinicalInterpretation = e.target.value;
                      setSpecialTests(updated);
                    }}
                    placeholder="Findings / notes..."
                    className="w-full p-1.5 text-xs border border-[#E5E5DF] rounded bg-white text-[#4B5563]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Working Hypothesis & Initial Plan */}
        <div className="bg-white p-6 rounded-xl border border-[#E5E5DF] space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#1B4332]">
            5. Working Hypothesis, Clinical Goals & Plan
          </h3>
          <div className="space-y-3 text-xs">
            <div>
              <label className="text-[11px] font-semibold text-[#4B5563] block mb-1">
                Working Hypothesis (Clinician Formulated)
              </label>
              <textarea
                value={workingHypothesis}
                onChange={(e) => setWorkingHypothesis(e.target.value)}
                className="w-full p-2.5 border border-[#E5E5DF] rounded-lg bg-[#FAF9F5] text-xs font-medium focus:outline-none focus:border-[#1B4332] h-20"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#4B5563] block mb-1">
                Initial Management Plan & Frequency
              </label>
              <textarea
                value={initialManagementPlan}
                onChange={(e) => setInitialManagementPlan(e.target.value)}
                className="w-full p-2.5 border border-[#E5E5DF] rounded-lg bg-[#FAF9F5] text-xs focus:outline-none focus:border-[#1B4332] h-20"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#E5E5DF] flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-[#6B7280]">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Will be electronically signed by Dr. Priyanka Singh, MPT</span>
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-semibold text-white bg-[#1B4332] hover:bg-[#2D6A4F] rounded-lg transition-colors flex items-center gap-2 shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>Save & Finalize Assessment</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
