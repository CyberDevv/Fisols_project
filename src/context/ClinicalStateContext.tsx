import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { 
  AppointmentBooking, 
  NDPRComplianceEntry, 
  PatientVitals, 
  PrescriptionItem, 
  DigitalPrescription, 
  ChatMessage, 
  PostConsultFollowUp,
  PatientProfile,
  HMOPolicyRecord,
  ApiActivityLog,
  DatabaseStats
} from '../types';
import { clinicalDb } from '../services/clinicalDatabase';

interface ClinicalStateContextType {
  appointments: AppointmentBooking[];
  activeAppointmentId: string;
  activeAppointment: AppointmentBooking;
  setActiveAppointmentId: (id: string) => void;
  createAppointment: (appointment: AppointmentBooking) => Promise<void>;
  updateAppointment: (id: string, updates: Partial<AppointmentBooking>) => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;
  
  // Consultation State Helpers
  updateConsultationVitals: (appointmentId: string, vitals: PatientVitals) => Promise<void>;
  updateConsultationNotes: (appointmentId: string, notes: string) => Promise<void>;
  addConsultationPrescriptionItem: (appointmentId: string, item: PrescriptionItem) => Promise<void>;
  removeConsultationPrescriptionItem: (appointmentId: string, itemId: string) => Promise<void>;
  setConsultationGeneratedPrescription: (appointmentId: string, rx: DigitalPrescription | null) => Promise<void>;
  addConsultationChatMessage: (appointmentId: string, msg: { sender: string; text: string }) => Promise<void>;
  updateConsultationFollowUp: (appointmentId: string, followUp: Partial<PostConsultFollowUp>) => Promise<void>;
  updatePatientConditionsAndAllergies: (appointmentId: string, updates: { chronicConditions?: string[]; drugAllergies?: string[] }) => Promise<void>;
  
  // Compliance Audit Logs
  complianceLogs: NDPRComplianceEntry[];
  addComplianceLog: (entry: Omit<NDPRComplianceEntry, 'id' | 'timestamp'> & { id?: string; timestamp?: string }) => Promise<void>;
  
  // Backend & JSON Database State
  patients: PatientProfile[];
  prescriptions: DigitalPrescription[];
  hmoPolicies: HMOPolicyRecord[];
  dbStats: DatabaseStats;
  apiLogs: ApiActivityLog[];
  isSyncing: boolean;
  lastApiAction: string | null;
  verifyHmoPolicy: (provider: string, policyNumber: string) => Promise<{ verified: boolean; message: string }>;
  exportDatabaseJSON: () => string;
  importDatabaseJSON: (rawJson: string) => { success: boolean; message: string };
  resetToDemoState: () => void;
}

const ACTIVE_APT_STORAGE_KEY = 'kbf_telehealth_active_apt_id_v2';

const ClinicalStateContext = createContext<ClinicalStateContextType | null>(null);

export const ClinicalStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Read snapshot from clinicalDb
  const [dbData, setDbData] = useState(() => ({
    appointments: clinicalDb.getRawCollection('appointments') as AppointmentBooking[],
    patients: clinicalDb.getRawCollection('patients') as PatientProfile[],
    prescriptions: clinicalDb.getRawCollection('prescriptions') as DigitalPrescription[],
    complianceLogs: clinicalDb.getRawCollection('complianceLogs') as NDPRComplianceEntry[],
    hmoPolicies: clinicalDb.getRawCollection('hmoPolicies') as HMOPolicyRecord[]
  }));

  const [apiLogs, setApiLogs] = useState<ApiActivityLog[]>(() => clinicalDb.getApiLogs());
  const [dbStats, setDbStats] = useState<DatabaseStats>(() => clinicalDb.getStats());
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastApiAction, setLastApiAction] = useState<string | null>(null);

  // Active appointment tracking
  const [activeAppointmentId, setActiveAppointmentIdState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(ACTIVE_APT_STORAGE_KEY);
      if (saved) return saved;
    } catch {
      // ignore
    }
    const initial = clinicalDb.getRawCollection('appointments')[0]?.id;
    return initial || 'KBF-APT-88410';
  });

  // Subscribe to database updates
  useEffect(() => {
    const unsubscribe = clinicalDb.subscribe((data) => {
      setDbData({
        appointments: data.appointments,
        patients: data.patients,
        prescriptions: data.prescriptions,
        complianceLogs: data.complianceLogs,
        hmoPolicies: data.hmoPolicies
      });
      setDbStats(clinicalDb.getStats());
      setApiLogs(clinicalDb.getApiLogs());
    });

    return () => unsubscribe();
  }, []);

  // Save active appointment ID
  useEffect(() => {
    try {
      localStorage.setItem(ACTIVE_APT_STORAGE_KEY, activeAppointmentId);
    } catch {
      // ignore
    }
  }, [activeAppointmentId]);

  // Derive active appointment
  const activeAppointment = useMemo<AppointmentBooking>(() => {
    const found = dbData.appointments.find(a => a.id === activeAppointmentId);
    if (found) return found;
    if (dbData.appointments.length > 0) return dbData.appointments[0];
    return {
      id: 'FALLBACK-01',
      patient: dbData.patients[0],
      specialist: {
        id: 'spec-prof-akintunde',
        name: 'Prof. Adeseye Akintunde',
        title: 'Professor of Medicine & Consultant Cardiologist',
        department: 'Cardiology',
        institution: 'LAUTECH Teaching Hospital',
        qualifications: 'MBBS, FWACP',
        availableSlots: [],
        precisionExpertise: [],
        bio: '',
        lautechFacultyRole: ''
      },
      selectedDate: 'Today',
      selectedTime: '09:00 AM',
      triage: {
        severityLevel: 'Moderate',
        recommendedDepartment: 'Cardiology',
        matchedSpecialist: null as any,
        clinicalPriority: 'Standard (within 48h)',
        triageReasoning: 'Initial consultation',
        flaggedRiskFactors: []
      },
      documents: [],
      paymentMode: 'HMO_VERIFICATION',
      paymentReference: 'TXN-001',
      teleconsultLink: 'https://kbf-telehealth.ng/v/telehealth',
      status: 'SCHEDULED',
      createdAt: new Date().toISOString()
    };
  }, [dbData.appointments, dbData.patients, activeAppointmentId]);

  const triggerApiIndicator = (actionText: string) => {
    setIsSyncing(true);
    setLastApiAction(actionText);
    setTimeout(() => {
      setIsSyncing(false);
      setDbStats(clinicalDb.getStats());
      setApiLogs(clinicalDb.getApiLogs());
    }, 450);
  };

  const setActiveAppointmentId = useCallback((id: string) => {
    setActiveAppointmentIdState(id);
  }, []);

  // Database mutations
  const createAppointment = useCallback(async (appointment: AppointmentBooking) => {
    triggerApiIndicator(`POST /api/v1/appointments • [${appointment.id}]`);
    await clinicalDb.createAppointment(appointment);
    setActiveAppointmentIdState(appointment.id);
  }, []);

  const updateAppointment = useCallback(async (id: string, updates: Partial<AppointmentBooking>) => {
    triggerApiIndicator(`PATCH /api/v1/appointments/${id}`);
    await clinicalDb.updateAppointment(id, updates);
  }, []);

  const deleteAppointment = useCallback(async (id: string) => {
    triggerApiIndicator(`DELETE /api/v1/appointments/${id} • Right to be Forgotten`);
    await clinicalDb.deleteAppointment(id);
    if (activeAppointmentId === id) {
      const remaining = clinicalDb.getRawCollection('appointments');
      if (remaining.length > 0) {
        setActiveAppointmentIdState(remaining[0].id);
      }
    }
  }, [activeAppointmentId]);

  const updateConsultationVitals = useCallback(async (appointmentId: string, vitals: PatientVitals) => {
    triggerApiIndicator(`PUT /api/v1/consultations/${appointmentId}/vitals • BP ${vitals.bp}`);
    await clinicalDb.updateConsultationVitals(appointmentId, vitals);
  }, []);

  const updateConsultationNotes = useCallback(async (appointmentId: string, notes: string) => {
    triggerApiIndicator(`PUT /api/v1/consultations/${appointmentId}/notes • EHR Updated`);
    await clinicalDb.updateConsultationNotes(appointmentId, notes);
  }, []);

  const addConsultationPrescriptionItem = useCallback(async (appointmentId: string, item: PrescriptionItem) => {
    triggerApiIndicator(`POST /api/v1/consultations/${appointmentId}/prescriptions • ${item.medicationName}`);
    await clinicalDb.addPrescriptionItem(appointmentId, item);
  }, []);

  const removeConsultationPrescriptionItem = useCallback(async (appointmentId: string, itemId: string) => {
    triggerApiIndicator(`DELETE /api/v1/consultations/${appointmentId}/prescriptions/${itemId}`);
    await clinicalDb.removePrescriptionItem(appointmentId, itemId);
  }, []);

  const setConsultationGeneratedPrescription = useCallback(async (appointmentId: string, rx: DigitalPrescription | null) => {
    triggerApiIndicator(rx ? `POST /api/v1/prescriptions/sign • SHA-256 Seal` : `DELETE /api/v1/prescriptions/draft`);
    await clinicalDb.saveGeneratedPrescription(appointmentId, rx);
  }, []);

  const addConsultationChatMessage = useCallback(async (appointmentId: string, msg: { sender: string; text: string }) => {
    triggerApiIndicator(`POST /api/v1/consultations/${appointmentId}/messages`);
    await clinicalDb.addChatMessage(appointmentId, msg);
  }, []);

  const updateConsultationFollowUp = useCallback(async (appointmentId: string, followUp: Partial<PostConsultFollowUp>) => {
    triggerApiIndicator(`PATCH /api/v1/consultations/${appointmentId}/follow-up • Score ${followUp.symptomScore ?? 8}/10`);
    await clinicalDb.updateFollowUp(appointmentId, followUp);
  }, []);

  const updatePatientConditionsAndAllergies = useCallback(async (appointmentId: string, updates: { chronicConditions?: string[]; drugAllergies?: string[] }) => {
    triggerApiIndicator(`PATCH /api/v1/patients/${appointmentId}/medical-history`);
    const appt = dbData.appointments.find(a => a.id === appointmentId);
    if (appt) {
      const updatedPatient: PatientProfile = {
        ...appt.patient,
        ...(updates.chronicConditions !== undefined ? { chronicConditions: updates.chronicConditions } : {}),
        ...(updates.drugAllergies !== undefined ? { drugAllergies: updates.drugAllergies } : {})
      };
      await clinicalDb.upsertPatient(updatedPatient);
      await clinicalDb.updateAppointment(appointmentId, { patient: updatedPatient });
      await clinicalDb.addComplianceEntry({
        actor: 'Attending Physician',
        action: `Clinical profile (conditions/allergies) updated for patient [${appointmentId}]`,
        dataCategory: 'PATIENT_GENOMIC_DATA',
        encryptionStandard: 'AES-256 (At Rest)',
        regulatoryArticle: 'NDPR 2019 Art. 2.2(d) Data Accuracy'
      });
    }
  }, [dbData.appointments]);

  const addComplianceLog = useCallback(async (entry: Omit<NDPRComplianceEntry, 'id' | 'timestamp'> & { id?: string; timestamp?: string }) => {
    await clinicalDb.addComplianceEntry(entry);
  }, []);

  const verifyHmoPolicy = useCallback(async (provider: string, policyNumber: string) => {
    triggerApiIndicator(`POST /api/v1/hmo/verify • Provider: ${provider}`);
    const res = await clinicalDb.verifyHmoPolicy(provider, policyNumber);
    return res;
  }, []);

  const exportDatabaseJSON = useCallback(() => {
    return clinicalDb.exportDatabaseJSON();
  }, []);

  const importDatabaseJSON = useCallback((rawJson: string) => {
    triggerApiIndicator(`POST /api/v1/database/restore • JSON Import`);
    const res = clinicalDb.importDatabaseJSON(rawJson);
    if (res.success) {
      const first = clinicalDb.getRawCollection('appointments')[0]?.id;
      if (first) setActiveAppointmentIdState(first);
    }
    return res;
  }, []);

  const resetToDemoState = useCallback(() => {
    triggerApiIndicator(`POST /api/v1/database/reset • Factory Seed Restored`);
    clinicalDb.resetToFactorySeed();
    const first = clinicalDb.getRawCollection('appointments')[0]?.id;
    if (first) setActiveAppointmentIdState(first);
  }, []);

  const value = useMemo<ClinicalStateContextType>(() => ({
    appointments: dbData.appointments,
    activeAppointmentId,
    activeAppointment,
    setActiveAppointmentId,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    updateConsultationVitals,
    updateConsultationNotes,
    addConsultationPrescriptionItem,
    removeConsultationPrescriptionItem,
    setConsultationGeneratedPrescription,
    addConsultationChatMessage,
    updateConsultationFollowUp,
    updatePatientConditionsAndAllergies,
    complianceLogs: dbData.complianceLogs,
    addComplianceLog,
    patients: dbData.patients,
    prescriptions: dbData.prescriptions,
    hmoPolicies: dbData.hmoPolicies,
    dbStats,
    apiLogs,
    isSyncing,
    lastApiAction,
    verifyHmoPolicy,
    exportDatabaseJSON,
    importDatabaseJSON,
    resetToDemoState
  }), [
    dbData,
    activeAppointmentId,
    activeAppointment,
    setActiveAppointmentId,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    updateConsultationVitals,
    updateConsultationNotes,
    addConsultationPrescriptionItem,
    removeConsultationPrescriptionItem,
    setConsultationGeneratedPrescription,
    addConsultationChatMessage,
    updateConsultationFollowUp,
    updatePatientConditionsAndAllergies,
    addComplianceLog,
    dbStats,
    apiLogs,
    isSyncing,
    lastApiAction,
    verifyHmoPolicy,
    exportDatabaseJSON,
    importDatabaseJSON,
    resetToDemoState
  ]);

  return (
    <ClinicalStateContext.Provider value={value}>
      {children}
    </ClinicalStateContext.Provider>
  );
};

export const useClinicalState = () => {
  const context = useContext(ClinicalStateContext);
  if (!context) {
    throw new Error('useClinicalState must be used within a ClinicalStateProvider');
  }
  return context;
};
