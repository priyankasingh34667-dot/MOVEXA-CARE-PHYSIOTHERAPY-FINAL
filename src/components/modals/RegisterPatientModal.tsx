import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Patient } from '../../types';
import { UserPlus, X, AlertTriangle, ShieldCheck } from 'lucide-react';

export const RegisterPatientModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { patients, addPatient, staff } = useApp();

  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('1992-04-15');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('female');
  const [phone, setPhone] = useState('+91 9');
  const [email, setEmail] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyRel, setEmergencyRel] = useState('Spouse');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('English / Hindi');
  const [referralSource, setReferralSource] = useState('Dr. Priyanka Singh / Direct Walk-in');
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [affectedBodyRegion, setAffectedBodyRegion] = useState<Patient['affectedBodyRegion']>('knee');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [medications, setMedications] = useState('');
  const [allergies, setAllergies] = useState('NKDA');
  const [precautions, setPrecautions] = useState('');
  const [assignedPhysio, setAssignedPhysio] = useState('staff-priyanka');
  const [address, setAddress] = useState('Bengaluru');
  const [occupation, setOccupation] = useState('Corporate Professional');
  const [consentSigned, setConsentSigned] = useState(true);

  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !chiefComplaint.trim()) {
      alert('Please fill in required fields: Patient Name, Contact Number, and Chief Complaint.');
      return;
    }

    // Duplicate check by phone or full name
    const existing = patients.find(
      (p) =>
        p.phone.replace(/\s+/g, '') === phone.replace(/\s+/g, '') ||
        p.fullName.toLowerCase() === fullName.trim().toLowerCase()
    );

    if (existing && !duplicateWarning) {
      setDuplicateWarning(
        `Duplicate warning: A patient with name "${existing.fullName}" or phone "${existing.phone}" already exists (${existing.uhid}). Click Register again if this is a distinct registration.`
      );
      return;
    }

    addPatient({
      fullName: fullName.trim(),
      dateOfBirth,
      gender,
      phone: phone.trim(),
      email: email.trim() || `${fullName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      emergencyContact: {
        name: emergencyName || 'Relative',
        relationship: emergencyRel,
        phone: emergencyPhone || phone,
      },
      preferredLanguage,
      referralSource,
      chiefComplaint: chiefComplaint.trim(),
      affectedBodyRegion,
      medicalHistory: medicalHistory ? [medicalHistory] : ['No prior chronic illness reported'],
      medications: medications ? [medications] : ['None'],
      allergies: allergies ? [allergies] : ['No known drug allergies'],
      precautions: precautions ? [precautions] : [],
      consentStatus: consentSigned ? 'signed' : 'pending',
      assignedPhysiotherapistId: assignedPhysio,
      status: 'active',
      address,
      occupation,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl border border-[#E5E5DF] shadow-2xl max-w-2xl w-full p-6 text-left space-y-4 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-2 border-b border-[#E5E5DF]">
          <div>
            <h3 className="text-sm font-bold text-[#1B4332] flex items-center gap-1.5">
              <UserPlus className="w-4 h-4 text-[#2D6A4F]" />
              <span>Register New Patient to MOVEXA Care</span>
            </h3>
            <span className="text-[11px] text-[#6B7280]">
              Unique Healthcare ID (UHID) will be automatically generated.
            </span>
          </div>
          <button onClick={onClose} className="text-[#9CA3AF] hover:text-[#111827]">
            <X className="w-4 h-4" />
          </button>
        </div>

        {duplicateWarning && (
          <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>{duplicateWarning}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Identity & Contact */}
          <div className="space-y-3">
            <h4 className="font-bold text-[#1B4332] uppercase text-[11px]">1. Demographics & Contact</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="text-[11px] font-semibold text-[#4B5563] block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Priya Venkatesh"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-2 border border-[#E5E5DF] rounded-lg text-xs"
                  required
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-[#4B5563] block mb-1">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full p-2 border border-[#E5E5DF] rounded-lg text-xs capitalize"
                >
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-[#4B5563] block mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full p-2 border border-[#E5E5DF] rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-[#4B5563] block mb-1">Phone Number *</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2 border border-[#E5E5DF] rounded-lg text-xs font-mono"
                  required
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-[#4B5563] block mb-1">Email</label>
                <input
                  type="email"
                  placeholder="name@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border border-[#E5E5DF] rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-[#4B5563] block mb-1">Occupation</label>
                <input
                  type="text"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  className="w-full p-2 border border-[#E5E5DF] rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-[#4B5563] block mb-1">City / Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-2 border border-[#E5E5DF] rounded-lg text-xs"
                />
              </div>
            </div>
          </div>

          {/* Clinical Presentation */}
          <div className="space-y-3 pt-2 border-t border-[#E5E5DF]">
            <h4 className="font-bold text-[#1B4332] uppercase text-[11px]">2. Clinical Presentation</h4>
            <div>
              <label className="text-[11px] font-semibold text-[#4B5563] block mb-1">
                Chief Complaint *
              </label>
              <textarea
                placeholder="e.g. Right knee medial joint ache after running, feeling stiff in the mornings..."
                value={chiefComplaint}
                onChange={(e) => setChiefComplaint(e.target.value)}
                className="w-full p-2 border border-[#E5E5DF] rounded-lg text-xs h-16"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-[#4B5563] block mb-1">
                  Affected Body Region
                </label>
                <select
                  value={affectedBodyRegion}
                  onChange={(e) => setAffectedBodyRegion(e.target.value as any)}
                  className="w-full p-2 border border-[#E5E5DF] rounded-lg text-xs capitalize"
                >
                  <option value="knee">Knee Joint</option>
                  <option value="lumbar">Lumbar Spine / Lower Back</option>
                  <option value="cervical">Cervical Spine / Neck</option>
                  <option value="shoulder">Shoulder & Rotator Cuff</option>
                  <option value="ankle">Ankle & Foot</option>
                  <option value="elbow">Elbow & Wrist</option>
                  <option value="sports">Sports Kinetic Injury</option>
                  <option value="general">General MSK</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#4B5563] block mb-1">
                  Assigned Physiotherapist
                </label>
                <select
                  value={assignedPhysio}
                  onChange={(e) => setAssignedPhysio(e.target.value)}
                  className="w-full p-2 border border-[#E5E5DF] rounded-lg text-xs"
                >
                  {staff.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#4B5563] block mb-1">
                  Referral Source
                </label>
                <input
                  type="text"
                  value={referralSource}
                  onChange={(e) => setReferralSource(e.target.value)}
                  className="w-full p-2 border border-[#E5E5DF] rounded-lg text-xs"
                />
              </div>
            </div>
          </div>

          {/* Safety & Consent */}
          <div className="space-y-3 pt-2 border-t border-[#E5E5DF]">
            <h4 className="font-bold text-[#1B4332] uppercase text-[11px]">3. Safety & Informed Consent</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-[#4B5563] block mb-1">Allergies</label>
                <input
                  type="text"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  className="w-full p-2 border border-[#E5E5DF] rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-[#4B5563] block mb-1">
                  Clinical Precautions
                </label>
                <input
                  type="text"
                  placeholder="e.g. Pacemaker, recent surgery, hypertension..."
                  value={precautions}
                  onChange={(e) => setPrecautions(e.target.value)}
                  className="w-full p-2 border border-[#E5E5DF] rounded-lg text-xs"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={consentSigned}
                onChange={(e) => setConsentSigned(e.target.checked)}
                className="accent-[#1B4332]"
              />
              <span className="text-[11px] text-[#4B5563]">
                Informed consent signed by patient for assessment and rehabilitation treatment.
              </span>
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#E5E5DF]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#E5E5DF] text-[#4B5563] hover:bg-[#FAF9F5] rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-semibold text-white bg-[#1B4332] hover:bg-[#2D6A4F] rounded-lg shadow-xs"
            >
              Register & Open Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
