/**
 * MOVEXA Care - Data Types & Schema Definitions
 */

export type UserRole = 'admin' | 'physio' | 'reception' | 'patient';

export interface StaffMember {
  id: string;
  name: string;
  title: string;
  credentials: string;
  specialty: string;
  registrationNumber: string;
  avatarUrl: string;
  email: string;
  phone: string;
  role: 'admin' | 'physio' | 'reception';
  bio: string;
  consultationFee: number;
}

export interface Patient {
  id: string;
  uhid: string; // Unique Healthcare ID e.g. MOV-2026-081
  fullName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  phone: string;
  email: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  preferredLanguage: string;
  referralSource: string;
  chiefComplaint: string;
  affectedBodyRegion: 'knee' | 'lumbar' | 'cervical' | 'shoulder' | 'ankle' | 'elbow' | 'sports' | 'general';
  medicalHistory: string[];
  medications: string[];
  allergies: string[];
  precautions: string[];
  consentStatus: 'signed' | 'pending' | 'withdrawn';
  assignedPhysiotherapistId: string;
  registrationDate: string;
  status: 'active' | 'in_rehab' | 'maintenance' | 'discharged';
  address: string;
  occupation: string;
}

export interface PreAssessmentIntake {
  id: string;
  patientId: string;
  submittedAt: string;
  chiefComplaint: string;
  affectedRegion: string;
  onset: string;
  duration: string;
  mechanismOfInjury: string;
  painScoreBaseline: number; // 0 - 10
  painNature: string[]; // sharp, aching, burning, throbbing, etc.
  aggravatingFactors: string;
  easingFactors: string;
  functionalLimitations: string[];
  previousTreatments: string;
  investigations: string; // X-ray, MRI, etc.
  surgicalHistory: string;
  redFlagsScreening: {
    nightPainUnexplained: boolean;
    unexplainedWeightLoss: boolean;
    bowelBladderChanges: boolean;
    bilateralNumbnessPinsNeedles: boolean;
    feverOrChills: boolean;
    gaitInstability: boolean;
  };
  patientGoals: string;
  consentAgreed: boolean;
}

export interface RangeOfMotionEntry {
  movement: string;
  activeRom: number; // degrees
  passiveRom: number; // degrees
  normalExpected: number;
  painReported: boolean;
  endFeel: 'normal' | 'capsular' | 'empty' | 'bone_to_bone' | 'spasm';
}

export interface MuscleStrengthEntry {
  muscleGroup: string;
  grade: number; // 0 to 5 MRC scale
  painful: boolean;
  notes?: string;
}

export interface SpecialTestEntry {
  testName: string;
  result: 'positive' | 'negative' | 'indeterminate' | 'not_tested';
  clinicalInterpretation: string;
}

export interface MSKAssessment {
  id: string;
  patientId: string;
  assessmentDate: string;
  clinicianId: string;
  templateType: 'knee' | 'lumbar' | 'cervical' | 'shoulder' | 'ankle' | 'elbow' | 'sports' | 'general';
  subjectiveHistory: string;
  observationPosture: string;
  gaitFunctionalMovement: string;
  rangeOfMotion: RangeOfMotionEntry[];
  muscleStrength: MuscleStrengthEntry[];
  neurologicalScreening: {
    dermatomesIntact: boolean;
    myotomesIntact: boolean;
    reflexesIntact: boolean;
    neuralTensionSigns: string;
  };
  specialTests: SpecialTestEntry[];
  palpationFindings: string;
  functionalPerformanceTests: string;
  redFlagsIdentified: string[];
  problemList: string[];
  workingHypothesis: string;
  differentialConsiderations: string[];
  shortTermGoals: string[];
  longTermGoals: string[];
  initialManagementPlan: string;
  isFinalized: boolean;
}

export interface ExercisePrescription {
  id: string;
  title: string;
  category: 'mobility' | 'strengthening' | 'stability' | 'motor_control' | 'stretching' | 'plyometric';
  bodyRegion: string;
  sets: number;
  repetitions: number;
  holdDurationSeconds: number;
  frequencyPerDay: number;
  frequencyPerWeek: number;
  instructions: string;
  precautions: string;
  videoPlaceholderUrl?: string;
  imageUrl?: string;
  isCompletedToday?: boolean;
}

export interface TreatmentPlan {
  id: string;
  patientId: string;
  createdDate: string;
  lastUpdatedDate: string;
  clinicianId: string;
  identifiedProblems: string[];
  shortTermGoals: string[];
  longTermGoals: string[];
  plannedInterventions: string[];
  prescribedExercises: ExercisePrescription[];
  treatmentFrequency: string; // e.g. "3x weekly for 4 weeks"
  reviewDate: string;
  milestonesExpected: string[];
  status: 'active' | 'under_review' | 'completed';
}

export interface SessionNote {
  id: string;
  patientId: string;
  sessionNumber: number;
  date: string;
  time: string;
  clinicianId: string;
  subjectiveFeedback: string;
  currentPainScore: number; // 0 - 10 NPRS
  objectiveFindings: string;
  interventionsPerformed: string[];
  exerciseDosageProgression: string;
  patientTolerance: 'excellent' | 'good' | 'moderate' | 'poor' | 'adverse_reaction';
  educationProvided: string;
  homeProgramUpdates: string;
  planForNextSession: string;
  signedByClinician: boolean;
  signedAt?: string;
  isFinalized: boolean;
}

export interface OutcomeRecord {
  id: string;
  patientId: string;
  date: string;
  nprsPainScore: number; // 0 - 10
  psfsScore: number; // 0 - 10 (Patient Specific Functional Scale)
  primaryRomDegrees?: number;
  dynamometryKg?: number;
  functionalMilestonesMet: number; // out of total
  clinicianNotes: string;
}

export interface Appointment {
  id: string;
  uhid: string;
  patientId: string;
  patientName: string;
  clinicianId: string;
  clinicianName: string;
  date: string;
  time: string;
  durationMinutes: number;
  serviceType: string;
  status: 'scheduled' | 'checked_in' | 'in_progress' | 'completed' | 'cancelled' | 'missed';
  notes?: string;
  chargeAmount: number;
  invoiceId?: string;
}

export interface TariffItem {
  id: string;
  code: string;
  name: string;
  category: 'consultation' | 'therapy' | 'specialized' | 'package' | 'digital';
  rate: number; // in INR
  description: string;
}

export interface InvoiceItem {
  tariffCode: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  patientId: string;
  patientName: string;
  uhid: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  tax: number;
  totalAmount: number;
  paidAmount: number;
  paymentStatus: 'paid' | 'partial' | 'pending' | 'overdue';
  paymentMethod?: 'UPI' | 'Card' | 'Cash' | 'NetBanking' | 'Insurance';
  notes?: string;
}

export interface FollowUpTask {
  id: string;
  patientId: string;
  patientName: string;
  title: string;
  taskType: 'reassessment_due' | 'missed_call' | 'exercise_review' | 'doc_pending' | 'insurance';
  dueDate: string;
  priority: 'urgent' | 'high' | 'medium' | 'routine';
  assignedTo: string;
  isCompleted: boolean;
  createdAt: string;
}

export interface EnquiryLead {
  id: string;
  name: string;
  phone: string;
  email: string;
  conditionDescription: string;
  referralSource: string;
  status: 'new' | 'contacted' | 'booked' | 'declined';
  receivedAt: string;
  preferredTiming: string;
  assignedStaff: string;
}

export interface DischargeSummary {
  id: string;
  patientId: string;
  patientName: string;
  uhid: string;
  dischargeDate: string;
  referralReason: string;
  initialPresentation: string;
  keyFindings: string;
  treatmentDelivered: string;
  baselinePainScore: number;
  dischargePainScore: number;
  baselineFunctionalScore: number;
  dischargeFunctionalScore: number;
  goalsAchieved: string[];
  remainingLimitations: string[];
  homeMaintenancePlan: string;
  warningSignsAndAdvice: string;
  followUpRecommendation: string;
  dischargingClinician: string;
  isSigned: boolean;
}
