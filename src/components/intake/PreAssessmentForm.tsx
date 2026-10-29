import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PreAssessmentIntake } from '../../types';
import {
  ClipboardCheck,
  CheckCircle2,
  AlertTriangle,
  User,
  Activity,
  Shield,
  Send,
  HelpCircle,
} from 'lucide-react';

export const PreAssessmentForm: React.FC = () => {
  const { patients, selectedPatient, addPreAssessment, setActiveView } = useApp();

  const [patientId, setPatientId] = useState(selectedPatient?.id || patients[0]?.id || '');
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [affectedRegion, setAffectedRegion] = useState('knee');
  const [onset, setOnset] = useState('Gradual over 2 months');
  const [duration, setDuration] = useState('Constant with morning stiffness');
  const [mechanismOfInjury, setMechanismOfInjury] = useState('Sports pivot or repetitive overload');
  const [painScoreBaseline, setPainScoreBaseline] = useState<number>(6);
  const [painNature, setPainNature] = useState<string[]>(['Aching', 'Sharp on movement']);
  const [aggravatingFactors, setAggravatingFactors] = useState('Prolonged sitting, climbing stairs');
  const [easingFactors, setEasingFactors] = useState('Rest, ice application');
  const [functionalLimitations, setFunctionalLimitations] = useState<string[]>(['Walking > 20 mins', 'Squatting', 'Sleeping on side']);
  const [previousTreatments, setPreviousTreatments] = useState('Painkillers, heat pad');
  const [investigations, setInvestigations] = useState('X-ray normal, MRI advised');
  const [surgicalHistory, setSurgicalHistory] = useState('None');
  const [patientGoals, setPatientGoals] = useState('Be able to walk 5km pain-free and return to badminton');
  const [consentAgreed, setConsentAgreed] = useState(true);

  // Red Flags
  const [redFlags, setRedFlags] = useState({
    nightPainUnexplained: false,
    unexplainedWeightLoss: false,
    bowelBladderChanges: false,
    bilateralNumbnessPinsNeedles: false,
    feverOrChills: false,
    gaitInstability: false,
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentAgreed) {
      alert('Please review and check the informed consent agreement.');
      return;
    }

    addPreAssessment({
      patientId,
      chiefComplaint: chiefComplaint || `Primary discomfort in ${affectedRegion} area`,
      affectedRegion,
      onset,
      duration,
      mechanismOfInjury,
      painScoreBaseline,
      painNature,
      aggravatingFactors,
      easingFactors,
      functionalLimitations,
      previousTreatments,
      investigations,
      surgicalHistory,
      redFlagsScreening: redFlags,
      patientGoals,
      consentAgreed,
    });

    setIsSubmitted(true);
  };

  const handleNatureToggle = (val: string) => {
    setPainNature((prev) =>
      prev.includes(val) ? prev.filter((item) => item !== val) : [...prev, val]
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-left">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-[#E5E5DF] p-6 text-left">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1B4332] mb-1">
          <ClipboardCheck className="w-4 h-4 text-[#2D6A4F]" />
          <span>Patient Intake Form</span>
          <span>·</span>
          <span>Digital Pre-Assessment</span>
        </div>
        <h1 className="text-xl font-extrabold text-[#111827]">
          MOVEXA Care Digital Intake & Symptom Survey
        </h1>
        <p className="text-xs text-[#6B7280] mt-1 max-w-2xl">
          Completed by the patient prior to clinical consultation. Information is marked as
          "Patient-Reported" and confirmed by Dr. Priyanka Singh or your treating physiotherapist during the examination.
        </p>
      </div>

      {isSubmitted ? (
        <div className="p-8 bg-white border border-[#E5E5DF] rounded-2xl text-center space-y-4">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-[#111827]">
            Pre-Assessment Submitted Successfully
          </h2>
          <p className="text-xs text-[#6B7280] max-w-md mx-auto">
            Your responses have been attached to the patient profile and are now accessible in the
            clinician's MSK Clinical Assessment workspace.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => setActiveView('assessments')}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#1B4332] hover:bg-[#2D6A4F] rounded-lg transition-colors"
            >
              Open MSK Assessment Workspace →
            </button>
            <button
              onClick={() => setIsSubmitted(false)}
              className="px-4 py-2 text-xs font-medium text-[#4B5563] border border-[#E5E5DF] hover:bg-[#FAF9F5] rounded-lg"
            >
              Submit Another Form
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section A: Patient Selection */}
          <div className="bg-white p-6 rounded-xl border border-[#E5E5DF] space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1B4332]">
              A. Patient Identification
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-[#4B5563] block mb-1">
                  Select Registered Patient
                </label>
                <select
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="w-full p-2.5 border border-[#E5E5DF] rounded-lg bg-[#FAF9F5] text-xs font-medium focus:outline-none focus:border-[#1B4332]"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.fullName} ({p.uhid}) - {p.chiefComplaint.slice(0, 30)}...
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-[#4B5563] block mb-1">
                  Affected Body Region
                </label>
                <select
                  value={affectedRegion}
                  onChange={(e) => setAffectedRegion(e.target.value)}
                  className="w-full p-2.5 border border-[#E5E5DF] rounded-lg bg-[#FAF9F5] text-xs font-medium capitalize focus:outline-none focus:border-[#1B4332]"
                >
                  <option value="knee">Knee Joint</option>
                  <option value="lumbar">Lumbar Spine / Lower Back</option>
                  <option value="cervical">Cervical Spine / Neck & Shoulder</option>
                  <option value="shoulder">Shoulder & Rotator Cuff</option>
                  <option value="ankle">Ankle & Foot</option>
                  <option value="elbow">Elbow & Wrist</option>
                  <option value="sports">Multi-Joint / Sports Injury</option>
                  <option value="general">General Musculoskeletal</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section B & C: Chief Complaint & Injury History */}
          <div className="bg-white p-6 rounded-xl border border-[#E5E5DF] space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1B4332]">
              B & C. Chief Complaint & Mechanism of Injury
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-[#4B5563] block mb-1">
                  In your own words, describe your primary discomfort or injury:
                </label>
                <textarea
                  value={chiefComplaint}
                  onChange={(e) => setChiefComplaint(e.target.value)}
                  placeholder="e.g. Pain in right front knee after football match, feeling stiff on waking up..."
                  className="w-full p-2.5 border border-[#E5E5DF] rounded-lg bg-[#FAF9F5] text-xs focus:outline-none focus:border-[#1B4332] h-20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-semibold text-[#4B5563] block mb-1">
                    Symptom Onset & Duration
                  </label>
                  <input
                    type="text"
                    value={onset}
                    onChange={(e) => setOnset(e.target.value)}
                    placeholder="e.g. Sudden after lifting weight, 3 weeks ago"
                    className="w-full p-2.5 border border-[#E5E5DF] rounded-lg bg-[#FAF9F5] text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#4B5563] block mb-1">
                    Mechanism of Injury
                  </label>
                  <input
                    type="text"
                    value={mechanismOfInjury}
                    onChange={(e) => setMechanismOfInjury(e.target.value)}
                    placeholder="e.g. Non-contact twisting, repetitive gym work"
                    className="w-full p-2.5 border border-[#E5E5DF] rounded-lg bg-[#FAF9F5] text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section D: Pain Intensity & Behaviour */}
          <div className="bg-white p-6 rounded-xl border border-[#E5E5DF] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1B4332]">
                D. Pain Score (NPRS 0 - 10)
              </h3>
              <span className="text-sm font-extrabold text-[#1B4332] tabular-nums">
                {painScoreBaseline} / 10
              </span>
            </div>

            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="10"
                step="1"
                value={painScoreBaseline}
                onChange={(e) => setPainScoreBaseline(Number(e.target.value))}
                className="w-full accent-[#1B4332] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#6B7280]">
                <span>0 (No pain)</span>
                <span>5 (Moderate)</span>
                <span>10 (Worst imaginable)</span>
              </div>
            </div>

            <div className="pt-2">
              <label className="text-[11px] font-semibold text-[#4B5563] block mb-2">
                Pain Nature (Select all that apply):
              </label>
              <div className="flex flex-wrap gap-2 text-xs">
                {['Sharp', 'Aching', 'Burning', 'Stiff', 'Throbbing', 'Pins & Needles', 'Numbness'].map(
                  (item) => (
                    <button
                      type="button"
                      key={item}
                      onClick={() => handleNatureToggle(item)}
                      className={`px-3 py-1 rounded-md text-xs font-medium border transition-colors ${
                        painNature.includes(item)
                          ? 'bg-[#1B4332] text-white border-[#1B4332]'
                          : 'bg-[#FAF9F5] text-[#4B5563] border-[#E5E5DF] hover:bg-[#F3F4F0]'
                      }`}
                    >
                      {item}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Section E & F: Aggravating / Easing Factors & Goals */}
          <div className="bg-white p-6 rounded-xl border border-[#E5E5DF] space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1B4332]">
              E & J. Functional Limitations & Patient Goals
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-[#4B5563] block mb-1">
                  What makes your symptoms worse?
                </label>
                <input
                  type="text"
                  value={aggravatingFactors}
                  onChange={(e) => setAggravatingFactors(e.target.value)}
                  className="w-full p-2.5 border border-[#E5E5DF] rounded-lg bg-[#FAF9F5] text-xs"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-[#4B5563] block mb-1">
                  What provides relief?
                </label>
                <input
                  type="text"
                  value={easingFactors}
                  onChange={(e) => setEasingFactors(e.target.value)}
                  className="w-full p-2.5 border border-[#E5E5DF] rounded-lg bg-[#FAF9F5] text-xs"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-[11px] font-semibold text-[#4B5563] block mb-1">
                  What are your main rehabilitation goals?
                </label>
                <input
                  type="text"
                  value={patientGoals}
                  onChange={(e) => setPatientGoals(e.target.value)}
                  placeholder="e.g. Return to running, pick up my child without back pain, sleep comfortably"
                  className="w-full p-2.5 border border-[#E5E5DF] rounded-lg bg-[#FAF9F5] text-xs"
                />
              </div>
            </div>
          </div>

          {/* Section K: Safety Screening & Red Flags */}
          <div className="bg-white p-6 rounded-xl border border-[#E5E5DF] space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#111827]">
                K. Medical Safety & Red Flag Screening
              </h3>
            </div>
            <p className="text-xs text-[#6B7280]">
              Please check if you are currently experiencing any of the following symptoms:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {[
                { key: 'nightPainUnexplained', label: 'Severe unrelenting night pain waking you from sleep' },
                { key: 'unexplainedWeightLoss', label: 'Recent unexplained significant weight loss' },
                { key: 'bowelBladderChanges', label: 'Sudden loss of bowel or bladder control / saddle numbness' },
                { key: 'bilateralNumbnessPinsNeedles', label: 'Pins and needles or numbness spreading in both legs/arms' },
                { key: 'feverOrChills', label: 'High fever, unexplained chills, or recent systemic infection' },
                { key: 'gaitInstability', label: 'Sudden progressive weakness causing tripping or dropping items' },
              ].map((rf) => (
                <label
                  key={rf.key}
                  className="flex items-start gap-2.5 p-2.5 rounded-lg border border-[#E5E5DF] bg-[#FAF9F5] cursor-pointer hover:bg-[#F3F4F0]"
                >
                  <input
                    type="checkbox"
                    checked={(redFlags as any)[rf.key]}
                    onChange={(e) =>
                      setRedFlags({ ...redFlags, [rf.key]: e.target.checked })
                    }
                    className="mt-0.5 accent-[#1B4332]"
                  />
                  <span className="text-xs text-[#4B5563] leading-snug">{rf.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Section L: Consent & Submit */}
          <div className="bg-white p-6 rounded-xl border border-[#E5E5DF] space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1B4332]">
              L. Consent & Digital Signature
            </h3>
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={consentAgreed}
                onChange={(e) => setConsentAgreed(e.target.checked)}
                className="mt-0.5 accent-[#1B4332]"
              />
              <span className="text-xs text-[#4B5563] leading-relaxed">
                I hereby confirm that the health information supplied above is accurate to the best of my knowledge. I consent to undergoing clinical assessment and musculoskeletal physical rehabilitation with MOVEXA Physiotherapy under Dr. Priyanka Singh and the clinical team.
              </span>
            </label>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-semibold text-white bg-[#1B4332] hover:bg-[#2D6A4F] rounded-lg transition-colors flex items-center gap-2 shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Digital Pre-Assessment</span>
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
