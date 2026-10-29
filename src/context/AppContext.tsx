import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  StaffMember,
  Patient,
  PreAssessmentIntake,
  MSKAssessment,
  TreatmentPlan,
  SessionNote,
  OutcomeRecord,
  Appointment,
  TariffItem,
  Invoice,
  FollowUpTask,
  EnquiryLead,
  DischargeSummary,
} from '../types';
import {
  INITIAL_STAFF,
  INITIAL_TARIFFS,
  INITIAL_PATIENTS,
  INITIAL_PRE_ASSESSMENTS,
  INITIAL_MSK_ASSESSMENTS,
  INITIAL_TREATMENT_PLANS,
  INITIAL_SESSION_NOTES,
  INITIAL_OUTCOMES,
  INITIAL_APPOINTMENTS,
  INITIAL_INVOICES,
  INITIAL_TASKS,
  INITIAL_ENQUIRIES,
  INITIAL_DISCHARGE_SUMMARIES,
} from '../data/initialData';

export type ActiveView =
  | 'dashboard'
  | 'patients'
  | 'enquiries'
  | 'appointments'
  | 'assessments'
  | 'treatment_plans'
  | 'sessions'
  | 'exercises'
  | 'recovery_timeline'
  | 'outcomes'
  | 'discharge'
  | 'tasks'
  | 'billing'
  | 'staff'
  | 'pre_assessment'
  | 'patient_portal';

interface AppContextType {
  // Navigation & Role
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  selectedPatientId: string;
  setSelectedPatientId: (id: string) => void;
  currentStaffId: string;
  setCurrentStaffId: (id: string) => void;

  // Data Collections
  staff: StaffMember[];
  tariffs: TariffItem[];
  patients: Patient[];
  preAssessments: PreAssessmentIntake[];
  assessments: MSKAssessment[];
  treatmentPlans: TreatmentPlan[];
  sessionNotes: SessionNote[];
  outcomes: OutcomeRecord[];
  appointments: Appointment[];
  invoices: Invoice[];
  tasks: FollowUpTask[];
  enquiries: EnquiryLead[];
  dischargeSummaries: DischargeSummary[];

  // Helpers
  selectedPatient: Patient | undefined;
  currentStaff: StaffMember | undefined;

  // Actions
  addPatient: (patient: Omit<Patient, 'id' | 'uhid' | 'registrationDate'>) => Patient;
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  addPreAssessment: (data: Omit<PreAssessmentIntake, 'id' | 'submittedAt'>) => void;
  saveAssessment: (assessment: MSKAssessment) => void;
  saveTreatmentPlan: (plan: TreatmentPlan) => void;
  addSessionNote: (note: Omit<SessionNote, 'id' | 'sessionNumber'>) => void;
  toggleExerciseCompletion: (planId: string, exerciseId: string) => void;
  addAppointment: (apt: Omit<Appointment, 'id' | 'uhid'>) => void;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => void;
  createInvoice: (invoice: Omit<Invoice, 'id' | 'invoiceNumber'>) => Invoice;
  recordPayment: (invoiceId: string, amount: number, method: Invoice['paymentMethod']) => void;
  addTask: (task: Omit<FollowUpTask, 'id' | 'createdAt' | 'isCompleted'>) => void;
  toggleTaskComplete: (taskId: string) => void;
  updateEnquiryStatus: (id: string, status: EnquiryLead['status']) => void;
  saveDischargeSummary: (summary: DischargeSummary) => void;
  exportDatabaseBackup: () => void;
  importDatabaseBackup: (jsonString: string) => boolean;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'movexa_care_clinical_db_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Roles & View
  const [currentRole, setCurrentRole] = useState<UserRole>('admin');
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [selectedPatientId, setSelectedPatientId] = useState<string>('pat-001');
  const [currentStaffId, setCurrentStaffId] = useState<string>('staff-priyanka');

  // Core Data Stores (initialized with localStorage or initial mock data)
  const [staff, setStaff] = useState<StaffMember[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_staff`);
    return saved ? JSON.parse(saved) : INITIAL_STAFF;
  });

  const [tariffs, setTariffs] = useState<TariffItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_tariffs`);
    return saved ? JSON.parse(saved) : INITIAL_TARIFFS;
  });

  const [patients, setPatients] = useState<Patient[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_patients`);
    return saved ? JSON.parse(saved) : INITIAL_PATIENTS;
  });

  const [preAssessments, setPreAssessments] = useState<PreAssessmentIntake[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_preAssessments`);
    return saved ? JSON.parse(saved) : INITIAL_PRE_ASSESSMENTS;
  });

  const [assessments, setAssessments] = useState<MSKAssessment[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_assessments`);
    return saved ? JSON.parse(saved) : INITIAL_MSK_ASSESSMENTS;
  });

  const [treatmentPlans, setTreatmentPlans] = useState<TreatmentPlan[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_treatmentPlans`);
    return saved ? JSON.parse(saved) : INITIAL_TREATMENT_PLANS;
  });

  const [sessionNotes, setSessionNotes] = useState<SessionNote[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_sessionNotes`);
    return saved ? JSON.parse(saved) : INITIAL_SESSION_NOTES;
  });

  const [outcomes, setOutcomes] = useState<OutcomeRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_outcomes`);
    return saved ? JSON.parse(saved) : INITIAL_OUTCOMES;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_appointments`);
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_invoices`);
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });

  const [tasks, setTasks] = useState<FollowUpTask[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_tasks`);
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [enquiries, setEnquiries] = useState<EnquiryLead[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_enquiries`);
    return saved ? JSON.parse(saved) : INITIAL_ENQUIRIES;
  });

  const [dischargeSummaries, setDischargeSummaries] = useState<DischargeSummary[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_dischargeSummaries`);
    return saved ? JSON.parse(saved) : INITIAL_DISCHARGE_SUMMARIES;
  });

  // Persist state updates to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_patients`, JSON.stringify(patients));
      localStorage.setItem(`${STORAGE_KEY}_tariffs`, JSON.stringify(tariffs));
      localStorage.setItem(`${STORAGE_KEY}_preAssessments`, JSON.stringify(preAssessments));
      localStorage.setItem(`${STORAGE_KEY}_assessments`, JSON.stringify(assessments));
      localStorage.setItem(`${STORAGE_KEY}_treatmentPlans`, JSON.stringify(treatmentPlans));
      localStorage.setItem(`${STORAGE_KEY}_sessionNotes`, JSON.stringify(sessionNotes));
      localStorage.setItem(`${STORAGE_KEY}_outcomes`, JSON.stringify(outcomes));
      localStorage.setItem(`${STORAGE_KEY}_appointments`, JSON.stringify(appointments));
      localStorage.setItem(`${STORAGE_KEY}_invoices`, JSON.stringify(invoices));
      localStorage.setItem(`${STORAGE_KEY}_tasks`, JSON.stringify(tasks));
      localStorage.setItem(`${STORAGE_KEY}_enquiries`, JSON.stringify(enquiries));
      localStorage.setItem(`${STORAGE_KEY}_dischargeSummaries`, JSON.stringify(dischargeSummaries));
    } catch {
      // LocalStorage quota handling
    }
  }, [patients, tariffs, preAssessments, assessments, treatmentPlans, sessionNotes, outcomes, appointments, invoices, tasks, enquiries, dischargeSummaries]);

  // Selected Helpers
  const selectedPatient = patients.find((p) => p.id === selectedPatientId) || patients[0];
  const currentStaff = staff.find((s) => s.id === currentStaffId) || staff[0];

  // Actions
  const addPatient = (newPatData: Omit<Patient, 'id' | 'uhid' | 'registrationDate'>): Patient => {
    const nextNum = patients.length + 1;
    const padNum = String(nextNum).padStart(3, '0');
    const newPatient: Patient = {
      ...newPatData,
      id: `pat-${Date.now()}`,
      uhid: `MOV-2026-${padNum}`,
      registrationDate: new Date().toISOString().split('T')[0],
    };
    setPatients((prev) => [newPatient, ...prev]);
    setSelectedPatientId(newPatient.id);
    return newPatient;
  };

  const updatePatient = (id: string, updates: Partial<Patient>) => {
    setPatients((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const addPreAssessment = (data: Omit<PreAssessmentIntake, 'id' | 'submittedAt'>) => {
    const intake: PreAssessmentIntake = {
      ...data,
      id: `intake-${Date.now()}`,
      submittedAt: new Date().toISOString(),
    };
    setPreAssessments((prev) => [intake, ...prev]);
  };

  const saveAssessment = (assessment: MSKAssessment) => {
    setAssessments((prev) => {
      const idx = prev.findIndex((a) => a.id === assessment.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = assessment;
        return updated;
      }
      return [assessment, ...prev];
    });

    // Update patient status to in_rehab
    updatePatient(assessment.patientId, { status: 'in_rehab' });
  };

  const saveTreatmentPlan = (plan: TreatmentPlan) => {
    setTreatmentPlans((prev) => {
      const idx = prev.findIndex((p) => p.id === plan.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = plan;
        return updated;
      }
      return [plan, ...prev];
    });
  };

  const addSessionNote = (noteData: Omit<SessionNote, 'id' | 'sessionNumber'>) => {
    const patientNotes = sessionNotes.filter((n) => n.patientId === noteData.patientId);
    const nextSessionNum = patientNotes.length + 1;
    const newNote: SessionNote = {
      ...noteData,
      id: `sn-${Date.now()}`,
      sessionNumber: nextSessionNum,
    };
    setSessionNotes((prev) => [newNote, ...prev]);

    // Also append an outcome record for pain tracking
    const newOutcome: OutcomeRecord = {
      id: `out-${Date.now()}`,
      patientId: noteData.patientId,
      date: noteData.date,
      nprsPainScore: noteData.currentPainScore,
      psfsScore: Math.min(10, Math.max(0, 10 - noteData.currentPainScore * 0.9)),
      functionalMilestonesMet: Math.min(5, Math.ceil(nextSessionNum / 2)),
      clinicianNotes: `Session #${nextSessionNum}: ${noteData.objectiveFindings.slice(0, 80)}...`,
    };
    setOutcomes((prev) => [...prev, newOutcome]);
  };

  const toggleExerciseCompletion = (planId: string, exerciseId: string) => {
    setTreatmentPlans((prev) =>
      prev.map((plan) => {
        if (plan.id !== planId) return plan;
        return {
          ...plan,
          prescribedExercises: plan.prescribedExercises.map((ex) =>
            ex.id === exerciseId ? { ...ex, isCompletedToday: !ex.isCompletedToday } : ex
          ),
        };
      })
    );
  };

  const addAppointment = (aptData: Omit<Appointment, 'id' | 'uhid'>) => {
    const pat = patients.find((p) => p.id === aptData.patientId);
    const newApt: Appointment = {
      ...aptData,
      id: `apt-${Date.now()}`,
      uhid: pat?.uhid || 'MOV-2026-000',
    };
    setAppointments((prev) => [newApt, ...prev]);

    // Automatically create a corresponding invoice for revenue generation
    if (aptData.chargeAmount > 0) {
      const invNum = `INV-2026-${String(invoices.length + 1).padStart(3, '0')}`;
      const newInvoice: Invoice = {
        id: `inv-${Date.now()}`,
        invoiceNumber: invNum,
        patientId: aptData.patientId,
        patientName: aptData.patientName,
        uhid: pat?.uhid || 'MOV-2026-000',
        date: aptData.date,
        dueDate: aptData.date,
        items: [
          {
            tariffCode: 'SESS-STD',
            description: aptData.serviceType,
            quantity: 1,
            unitPrice: aptData.chargeAmount,
            amount: aptData.chargeAmount,
          },
        ],
        subtotal: aptData.chargeAmount,
        discount: 0,
        tax: 0,
        totalAmount: aptData.chargeAmount,
        paidAmount: 0,
        paymentStatus: 'pending',
        notes: `Auto-generated billing for appointment on ${aptData.date}`,
      };
      setInvoices((prev) => [newInvoice, ...prev]);
    }
  };

  const updateAppointmentStatus = (id: string, status: Appointment['status']) => {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  };

  const createInvoice = (invData: Omit<Invoice, 'id' | 'invoiceNumber'>): Invoice => {
    const invNum = `INV-2026-${String(invoices.length + 1).padStart(3, '0')}`;
    const newInv: Invoice = {
      ...invData,
      id: `inv-${Date.now()}`,
      invoiceNumber: invNum,
    };
    setInvoices((prev) => [newInv, ...prev]);
    return newInv;
  };

  const recordPayment = (invoiceId: string, amount: number, method: Invoice['paymentMethod']) => {
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id !== invoiceId) return inv;
        const newPaid = inv.paidAmount + amount;
        let newStatus: Invoice['paymentStatus'] = inv.paymentStatus;
        if (newPaid >= inv.totalAmount) {
          newStatus = 'paid';
        } else if (newPaid > 0) {
          newStatus = 'partial';
        }
        return {
          ...inv,
          paidAmount: newPaid,
          paymentStatus: newStatus,
          paymentMethod: method || inv.paymentMethod,
        };
      })
    );
  };

  const addTask = (taskData: Omit<FollowUpTask, 'id' | 'createdAt' | 'isCompleted'>) => {
    const newTask: FollowUpTask = {
      ...taskData,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      isCompleted: false,
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const toggleTaskComplete = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t))
    );
  };

  const updateEnquiryStatus = (id: string, status: EnquiryLead['status']) => {
    setEnquiries((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
  };

  const saveDischargeSummary = (summary: DischargeSummary) => {
    setDischargeSummaries((prev) => {
      const idx = prev.findIndex((d) => d.id === summary.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = summary;
        return updated;
      }
      return [summary, ...prev];
    });

    // Mark patient as discharged
    updatePatient(summary.patientId, { status: 'discharged' });
  };

  const exportDatabaseBackup = () => {
    const backupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      clinic: 'MOVEXA Physiotherapy',
      director: 'Dr. Priyanka Singh',
      patients,
      tariffs,
      preAssessments,
      assessments,
      treatmentPlans,
      sessionNotes,
      outcomes,
      appointments,
      invoices,
      tasks,
      enquiries,
      dischargeSummaries,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `movexa_care_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importDatabaseBackup = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.patients && Array.isArray(parsed.patients)) {
        setPatients(parsed.patients);
        if (parsed.tariffs) setTariffs(parsed.tariffs);
        if (parsed.assessments) setAssessments(parsed.assessments);
        if (parsed.treatmentPlans) setTreatmentPlans(parsed.treatmentPlans);
        if (parsed.sessionNotes) setSessionNotes(parsed.sessionNotes);
        if (parsed.outcomes) setOutcomes(parsed.outcomes);
        if (parsed.appointments) setAppointments(parsed.appointments);
        if (parsed.invoices) setInvoices(parsed.invoices);
        if (parsed.tasks) setTasks(parsed.tasks);
        if (parsed.enquiries) setEnquiries(parsed.enquiries);
        if (parsed.dischargeSummaries) setDischargeSummaries(parsed.dischargeSummaries);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const resetAllData = () => {
    localStorage.clear();
    setPatients(INITIAL_PATIENTS);
    setTariffs(INITIAL_TARIFFS);
    setPreAssessments(INITIAL_PRE_ASSESSMENTS);
    setAssessments(INITIAL_MSK_ASSESSMENTS);
    setTreatmentPlans(INITIAL_TREATMENT_PLANS);
    setSessionNotes(INITIAL_SESSION_NOTES);
    setOutcomes(INITIAL_OUTCOMES);
    setAppointments(INITIAL_APPOINTMENTS);
    setInvoices(INITIAL_INVOICES);
    setTasks(INITIAL_TASKS);
    setEnquiries(INITIAL_ENQUIRIES);
    setDischargeSummaries(INITIAL_DISCHARGE_SUMMARIES);
    setSelectedPatientId('pat-001');
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        activeView,
        setActiveView,
        selectedPatientId,
        setSelectedPatientId,
        currentStaffId,
        setCurrentStaffId,
        staff,
        tariffs,
        patients,
        preAssessments,
        assessments,
        treatmentPlans,
        sessionNotes,
        outcomes,
        appointments,
        invoices,
        tasks,
        enquiries,
        dischargeSummaries,
        selectedPatient,
        currentStaff,
        addPatient,
        updatePatient,
        addPreAssessment,
        saveAssessment,
        saveTreatmentPlan,
        addSessionNote,
        toggleExerciseCompletion,
        addAppointment,
        updateAppointmentStatus,
        createInvoice,
        recordPayment,
        addTask,
        toggleTaskComplete,
        updateEnquiryStatus,
        saveDischargeSummary,
        exportDatabaseBackup,
        importDatabaseBackup,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
