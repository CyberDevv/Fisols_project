import { 
  AppointmentBooking, 
  PatientProfile, 
  DigitalPrescription, 
  NDPRComplianceEntry, 
  HMOPolicyRecord, 
  ApiActivityLog, 
  DatabaseStats, 
  DatabaseSnapshot,
  PatientVitals,
  PrescriptionItem,
  ChatMessage,
  PostConsultFollowUp
} from '../types';
import { 
  SEED_APPOINTMENTS, 
  SAMPLE_COMPLIANCE_LOGS, 
  DEMO_PATIENT, 
  DEMO_PATIENT_ZAINAB, 
  DEMO_PATIENT_ALHAJI, 
  DEMO_PATIENT_AMINA, 
  DEMO_PATIENT_CHUKWUEMEKA 
} from '../data/clinicalData';

const DB_STORAGE_KEY = 'kbf_telehealth_json_db_v2';
const CLUSTER_NODE = 'LAUTECH Cloud Node #02 (Ogbomoso Cluster)';

const SEED_HMO_POLICIES: HMOPolicyRecord[] = [
  {
    policyNumber: 'HYG-77492-LAUT',
    provider: 'Hygeia HMO Nigeria',
    enrolleeName: 'Adewale Johnson Adeleke',
    status: 'ACTIVE_APPROVED',
    coveragePercentage: 100,
    coveredDepartments: ['Cardiology', 'Endocrinology', 'Neurology', 'Surgery & Urology'],
    annualCapNgn: 1500000,
    utilizedNgn: 235000,
    preAuthCode: 'AUTH-HYG-2026-9812'
  },
  {
    policyNumber: 'AXA-33821-LAUT',
    provider: 'AXA Mansard Health',
    enrolleeName: 'Zainab Amina Balogun',
    status: 'ACTIVE_APPROVED',
    coveragePercentage: 100,
    coveredDepartments: ['Obstetrics & Gynaecology', 'Cardiology'],
    annualCapNgn: 1200000,
    utilizedNgn: 110000,
    preAuthCode: 'AUTH-AXA-2026-4431'
  },
  {
    policyNumber: 'REL-44019-LAUT',
    provider: 'Reliance HMO',
    enrolleeName: 'Chukwuemeka Anthony Eze',
    status: 'ACTIVE_APPROVED',
    coveragePercentage: 100,
    coveredDepartments: ['Oncology & Clinical Genetics', 'Cardiology'],
    annualCapNgn: 2500000,
    utilizedNgn: 640000,
    preAuthCode: 'AUTH-REL-2026-7789'
  },
  {
    policyNumber: 'LEAD-99120-LAUT',
    provider: 'Leadway Health',
    enrolleeName: 'Alhaji Rasheed Adeleke',
    status: 'ACTIVE_APPROVED',
    coveragePercentage: 100,
    coveredDepartments: ['Surgery & Urology', 'Cardiology', 'Endocrinology'],
    annualCapNgn: 1800000,
    utilizedNgn: 320000,
    preAuthCode: 'AUTH-LEAD-2026-5512'
  },
  {
    policyNumber: 'AVON-55219-LAUT',
    provider: 'Avon Healthcare',
    enrolleeName: 'Dr. Amina Bello',
    status: 'ACTIVE_APPROVED',
    coveragePercentage: 100,
    coveredDepartments: ['Neurology', 'Cardiology'],
    annualCapNgn: 1400000,
    utilizedNgn: 95000,
    preAuthCode: 'AUTH-AVON-2026-1104'
  }
];

const SEED_PRESCRIPTIONS: DigitalPrescription[] = [
  {
    id: 'rx-laut-99182',
    appointmentId: 'KBF-APT-88410',
    patientId: DEMO_PATIENT.id,
    patientName: DEMO_PATIENT.fullName,
    physicianName: 'Prof. Adeseye Akintunde',
    physicianLicense: 'MDCN/F/67210 - Consultant Cardiologist',
    institution: 'LAUTECH Teaching Hospital, Ogbomoso',
    issuedAt: '2026-09-08 07:15 WAT',
    items: [
      {
        id: 'rx-item-001',
        medicationName: 'Prasugrel Hydrochloride (Effient)',
        dosage: '10mg',
        frequency: 'Once Daily in Morning',
        duration: '30 Days',
        genomicStatus: 'FLAGGED_ADR_PREVENTED',
        pharmacogenomicNote: 'CYP2C19 *2/*2 Poor Metabolizer: Clopidogrel contraindicated due to high stent thrombosis hazard. Prasugrel substituted per Geneva CPIC 1A guideline.'
      },
      {
        id: 'rx-item-002',
        medicationName: 'Rosuvastatin Calcium (Crestor)',
        dosage: '10mg',
        frequency: 'Once Daily at Bedtime',
        duration: '60 Days',
        genomicStatus: 'TAILORED_DOSAGE',
        pharmacogenomicNote: 'SLCO1B1 521T>C carrier: Simvastatin contraindicated (high risk of rhabdomyolysis). Rosuvastatin lower starting dose prescribed.'
      }
    ],
    partnerPharmacy: {
      id: 'pharm-medplus-ogb',
      name: 'MedPlus Pharmacy & Superstore',
      branch: 'Takie Square, Ogbomoso Branch (1.4 km from LAUTECH)',
      routingStatus: 'READY_FOR_PICKUP',
      estimatedDeliveryHours: 2
    },
    sha256DigitalSignature: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    qrVerificationPayload: 'https://kbf-telehealth.ng/rx/verify?id=rx-laut-99182&hash=e3b0c442'
  }
];

const SEED_PATIENTS: PatientProfile[] = [
  DEMO_PATIENT,
  DEMO_PATIENT_ZAINAB,
  DEMO_PATIENT_ALHAJI,
  DEMO_PATIENT_AMINA,
  DEMO_PATIENT_CHUKWUEMEKA
];

interface DatabaseData {
  version: string;
  lastUpdated: string;
  appointments: AppointmentBooking[];
  patients: PatientProfile[];
  prescriptions: DigitalPrescription[];
  complianceLogs: NDPRComplianceEntry[];
  hmoPolicies: HMOPolicyRecord[];
}

type DatabaseListener = (data: DatabaseData) => void;

class ClinicalDatabaseService {
  private data: DatabaseData;
  private listeners: Set<DatabaseListener> = new Set();
  private apiLogs: ApiActivityLog[] = [];

  constructor() {
    this.data = this.loadFromStorage();
    this.logApiCall('GET', '/api/v1/health', 200, 18, 'Initial database mounted from local JSON store');
  }

  private loadFromStorage(): DatabaseData {
    try {
      const stored = localStorage.getItem(DB_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && Array.isArray(parsed.appointments)) {
          return {
            version: '2.0.0',
            lastUpdated: parsed.lastUpdated || new Date().toISOString(),
            appointments: parsed.appointments,
            patients: Array.isArray(parsed.patients) && parsed.patients.length > 0 ? parsed.patients : SEED_PATIENTS,
            prescriptions: Array.isArray(parsed.prescriptions) ? parsed.prescriptions : SEED_PRESCRIPTIONS,
            complianceLogs: Array.isArray(parsed.complianceLogs) && parsed.complianceLogs.length > 0 ? parsed.complianceLogs : SAMPLE_COMPLIANCE_LOGS,
            hmoPolicies: Array.isArray(parsed.hmoPolicies) && parsed.hmoPolicies.length > 0 ? parsed.hmoPolicies : SEED_HMO_POLICIES
          };
        }
      }
    } catch (e) {
      console.warn('Could not parse clinical DB from localStorage, loading seeds', e);
    }

    return {
      version: '2.0.0',
      lastUpdated: new Date().toISOString(),
      appointments: SEED_APPOINTMENTS,
      patients: SEED_PATIENTS,
      prescriptions: SEED_PRESCRIPTIONS,
      complianceLogs: SAMPLE_COMPLIANCE_LOGS,
      hmoPolicies: SEED_HMO_POLICIES
    };
  }

  private persist() {
    try {
      this.data.lastUpdated = new Date().toISOString();
      localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(this.data));
      this.notifyListeners();
    } catch (e) {
      console.error('Failed to persist database to localStorage', e);
    }
  }

  private notifyListeners() {
    this.listeners.forEach(cb => cb(this.data));
  }

  public subscribe(cb: DatabaseListener): () => void {
    this.listeners.add(cb);
    cb(this.data);
    return () => {
      this.listeners.delete(cb);
    };
  }

  private logApiCall(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE', 
    endpoint: string, 
    statusCode: 200 | 201 | 204 | 400 | 404, 
    latencyMs: number, 
    summary: string
  ) {
    const log: ApiActivityLog = {
      id: `req-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toLocaleTimeString(),
      method,
      endpoint,
      statusCode,
      latencyMs,
      summary
    };
    this.apiLogs = [log, ...this.apiLogs.slice(0, 24)];
  }

  // Simulated latency for authentic backend experience
  private async simulateNetworkDelay(minMs = 25, maxMs = 60): Promise<number> {
    const delay = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
    await new Promise(resolve => setTimeout(resolve, delay));
    return delay;
  }

  // ================= APPOINTMENTS =================
  public async getAppointments(): Promise<AppointmentBooking[]> {
    const latency = await this.simulateNetworkDelay(15, 35);
    this.logApiCall('GET', '/api/v1/appointments', 200, latency, `Retrieved ${this.data.appointments.length} appointments`);
    return [...this.data.appointments];
  }

  public async getAppointmentById(id: string): Promise<AppointmentBooking | null> {
    const latency = await this.simulateNetworkDelay(10, 25);
    const found = this.data.appointments.find(a => a.id === id) || null;
    this.logApiCall('GET', `/api/v1/appointments/${id}`, found ? 200 : 404, latency, found ? `Fetched record [${id}]` : `Appointment [${id}] not found`);
    return found;
  }

  public async createAppointment(newAppt: AppointmentBooking): Promise<AppointmentBooking> {
    const latency = await this.simulateNetworkDelay(35, 75);

    // Initialize consultation state if missing
    const preparedAppt: AppointmentBooking = {
      ...newAppt,
      consultationState: newAppt.consultationState || {
        vitals: {
          bp: '126/82 mmHg',
          heartRate: 72,
          spo2: 98,
          temperature: '36.7°C',
          weight: '75 kg',
          bmi: '24.2 kg/m²'
        },
        clinicalNotes: `Initial outpatient consultation booked with ${newAppt.specialist.name} (${newAppt.specialist.department}). Reason: ${newAppt.triage.triageReasoning}`,
        prescriptionItems: [],
        generatedPrescription: null,
        chatMessages: [
          {
            id: `msg-sys-${Date.now()}`,
            sender: 'LAUTECH Virtual Reception',
            text: `Welcome ${newAppt.patient.fullName}. Your appointment [${newAppt.id}] with ${newAppt.specialist.name} has been securely registered in the hospital database.`,
            time: new Date().toTimeString().slice(0, 5)
          }
        ],
        followUp: {
          id: `fup-${Date.now()}`,
          appointmentId: newAppt.id,
          patientName: newAppt.patient.fullName,
          checkInDueHours: 48,
          status: 'PENDING_SCHEDULED',
          symptomScore: 8,
          adverseReactionsReported: [],
          patientNotes: 'Scheduled for post-consultation pharmacogenomic review.',
          timestamp: new Date().toISOString(),
          auditTrailHash: `SHA256-${Date.now().toString(16).toUpperCase()}`
        }
      }
    };

    this.data.appointments = [preparedAppt, ...this.data.appointments];

    // Ensure patient exists in registry
    await this.upsertPatient(preparedAppt.patient);

    // Add compliance log
    this.data.complianceLogs = [
      {
        id: `ndpr-${Date.now()}`,
        timestamp: `${new Date().toISOString().split('T')[0]} ${new Date().toTimeString().split(' ')[0]}`,
        actor: `Patient (${preparedAppt.patient.fullName})`,
        action: `Appointment [${preparedAppt.id}] registered with ${preparedAppt.specialist.name}`,
        dataCategory: 'EHR_CONSULTATION',
        encryptionStandard: 'AES-256 (At Rest)',
        regulatoryArticle: 'NDPR 2019 Art. 2.1(a) Explicit Consent'
      },
      ...this.data.complianceLogs
    ];

    this.persist();
    this.logApiCall('POST', '/api/v1/appointments', 201, latency, `Created appointment [${preparedAppt.id}] for ${preparedAppt.patient.fullName}`);
    return preparedAppt;
  }

  public async updateAppointment(id: string, updates: Partial<AppointmentBooking>): Promise<AppointmentBooking | null> {
    const latency = await this.simulateNetworkDelay(20, 45);
    const index = this.data.appointments.findIndex(a => a.id === id);
    if (index === -1) {
      this.logApiCall('PATCH', `/api/v1/appointments/${id}`, 404, latency, `Failed update: [${id}] not found`);
      return null;
    }

    const updated = {
      ...this.data.appointments[index],
      ...updates
    };
    this.data.appointments[index] = updated;
    this.persist();
    this.logApiCall('PATCH', `/api/v1/appointments/${id}`, 200, latency, `Updated appointment [${id}] fields: ${Object.keys(updates).join(', ')}`);
    return updated;
  }

  public async deleteAppointment(id: string): Promise<boolean> {
    const latency = await this.simulateNetworkDelay(25, 50);
    const target = this.data.appointments.find(a => a.id === id);
    if (!target) return false;

    this.data.appointments = this.data.appointments.filter(a => a.id !== id);

    // NDPR Right to be Forgotten audit
    this.data.complianceLogs = [
      {
        id: `ndpr-del-${Date.now()}`,
        timestamp: `${new Date().toISOString().split('T')[0]} ${new Date().toTimeString().split(' ')[0]}`,
        actor: 'Data Subject Right Exercise',
        action: `Right to Erasure (Right to be Forgotten) executed for appointment [${id}] and records`,
        dataCategory: 'PATIENT_GENOMIC_DATA',
        encryptionStandard: 'AES-256 (At Rest)',
        regulatoryArticle: 'NDPA 2023 §34 / NDPR 2019 Art. 3.1(g)'
      },
      ...this.data.complianceLogs
    ];

    this.persist();
    this.logApiCall('DELETE', `/api/v1/appointments/${id}`, 200, latency, `Deleted record [${id}] (Right to be Forgotten applied)`);
    return true;
  }

  // ================= CONSULTATION STATE =================
  public async updateConsultationVitals(appointmentId: string, vitals: PatientVitals): Promise<void> {
    const latency = await this.simulateNetworkDelay(15, 35);
    const appt = this.data.appointments.find(a => a.id === appointmentId);
    if (appt && appt.consultationState) {
      appt.consultationState.vitals = vitals;
      this.persist();
      this.logApiCall('PUT', `/api/v1/appointments/${appointmentId}/vitals`, 200, latency, `Recorded vitals: BP ${vitals.bp}, HR ${vitals.heartRate} bpm`);
    }
  }

  public async updateConsultationNotes(appointmentId: string, notes: string): Promise<void> {
    const latency = await this.simulateNetworkDelay(15, 35);
    const appt = this.data.appointments.find(a => a.id === appointmentId);
    if (appt && appt.consultationState) {
      appt.consultationState.clinicalNotes = notes;
      this.persist();
      this.logApiCall('PUT', `/api/v1/appointments/${appointmentId}/notes`, 200, latency, `Updated EHR doctor notes (${notes.length} chars)`);
    }
  }

  public async addPrescriptionItem(appointmentId: string, item: PrescriptionItem): Promise<void> {
    const latency = await this.simulateNetworkDelay(20, 40);
    const appt = this.data.appointments.find(a => a.id === appointmentId);
    if (appt && appt.consultationState) {
      appt.consultationState.prescriptionItems.push(item);
      this.persist();
      this.logApiCall('POST', `/api/v1/appointments/${appointmentId}/prescriptions`, 201, latency, `Added ${item.medicationName} (${item.genomicStatus})`);
    }
  }

  public async removePrescriptionItem(appointmentId: string, itemId: string): Promise<void> {
    const latency = await this.simulateNetworkDelay(15, 30);
    const appt = this.data.appointments.find(a => a.id === appointmentId);
    if (appt && appt.consultationState) {
      appt.consultationState.prescriptionItems = appt.consultationState.prescriptionItems.filter(it => it.id !== itemId);
      this.persist();
      this.logApiCall('DELETE', `/api/v1/appointments/${appointmentId}/prescriptions/${itemId}`, 200, latency, `Removed prescription item [${itemId}]`);
    }
  }

  public async saveGeneratedPrescription(appointmentId: string, rx: DigitalPrescription | null): Promise<void> {
    const latency = await this.simulateNetworkDelay(30, 60);
    const appt = this.data.appointments.find(a => a.id === appointmentId);
    if (appt && appt.consultationState) {
      appt.consultationState.generatedPrescription = rx;
      if (rx) {
        appt.status = 'COMPLETED';
        // Add to global prescriptions table if not present
        const existingIdx = this.data.prescriptions.findIndex(p => p.id === rx.id);
        if (existingIdx >= 0) {
          this.data.prescriptions[existingIdx] = rx;
        } else {
          this.data.prescriptions = [rx, ...this.data.prescriptions];
        }

        this.data.complianceLogs = [
          {
            id: `ndpr-rx-${Date.now()}`,
            timestamp: `${new Date().toISOString().split('T')[0]} ${new Date().toTimeString().split(' ')[0]}`,
            actor: rx.physicianName,
            action: `Cryptographic e-Prescription [${rx.id}] signed and routed to ${rx.partnerPharmacy.name}`,
            dataCategory: 'E_PRESCRIPTION',
            encryptionStandard: 'AES-256 (At Rest)',
            regulatoryArticle: 'NDPR 2019 / National Health Act 2014 §32'
          },
          ...this.data.complianceLogs
        ];
      }
      this.persist();
      this.logApiCall('POST', `/api/v1/prescriptions/sign`, 201, latency, rx ? `Signed e-Prescription [${rx.id}] with SHA-256 seal` : 'Cleared prescription draft');
    }
  }

  public async addChatMessage(appointmentId: string, msg: { sender: string; text: string }): Promise<ChatMessage> {
    const latency = await this.simulateNetworkDelay(10, 20);
    const appt = this.data.appointments.find(a => a.id === appointmentId);
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      sender: msg.sender,
      text: msg.text,
      time: new Date().toTimeString().slice(0, 5)
    };

    if (appt && appt.consultationState) {
      appt.consultationState.chatMessages.push(newMsg);
      this.persist();
      this.logApiCall('POST', `/api/v1/appointments/${appointmentId}/messages`, 201, latency, `Message posted by ${msg.sender}`);
    }
    return newMsg;
  }

  public async updateFollowUp(appointmentId: string, followUp: Partial<PostConsultFollowUp>): Promise<void> {
    const latency = await this.simulateNetworkDelay(20, 45);
    const appt = this.data.appointments.find(a => a.id === appointmentId);
    if (appt && appt.consultationState) {
      appt.consultationState.followUp = {
        ...appt.consultationState.followUp,
        ...followUp
      };
      this.persist();
      this.logApiCall('PATCH', `/api/v1/appointments/${appointmentId}/follow-up`, 200, latency, `Recovery follow-up logged: score ${followUp.symptomScore ?? 'N/A'}/10`);
    }
  }

  // ================= PATIENTS =================
  public async getPatients(): Promise<PatientProfile[]> {
    const latency = await this.simulateNetworkDelay(10, 25);
    this.logApiCall('GET', '/api/v1/patients', 200, latency, `Retrieved ${this.data.patients.length} patient profiles`);
    return [...this.data.patients];
  }

  public async upsertPatient(patient: PatientProfile): Promise<PatientProfile> {
    const latency = await this.simulateNetworkDelay(15, 30);
    const index = this.data.patients.findIndex(p => p.id === patient.id);
    if (index >= 0) {
      this.data.patients[index] = { ...this.data.patients[index], ...patient };
    } else {
      this.data.patients.push(patient);
    }
    this.persist();
    this.logApiCall('PUT', `/api/v1/patients/${patient.id}`, 200, latency, `Upserted clinical profile for ${patient.fullName}`);
    return patient;
  }

  // ================= HMO VERIFICATION =================
  public async verifyHmoPolicy(provider: string, policyNumber: string): Promise<{
    verified: boolean;
    policy?: HMOPolicyRecord;
    message: string;
  }> {
    const latency = await this.simulateNetworkDelay(40, 80);
    const trimmedNum = policyNumber.trim().toUpperCase();
    
    // Check known database
    const match = this.data.hmoPolicies.find(
      p => p.policyNumber.toUpperCase() === trimmedNum || p.provider.toLowerCase().includes(provider.toLowerCase().slice(0, 4))
    );

    if (match) {
      this.logApiCall('POST', '/api/v1/hmo/verify', 200, latency, `HMO verified: ${match.provider} [${match.policyNumber}] 100% Pre-Authorized`);
      return {
        verified: true,
        policy: match,
        message: `HMO pre-authorization verified (100% covered for outpatient clinical review). Pre-Auth: ${match.preAuthCode}`
      };
    }

    // Dynamic auto-approval simulation for newly inputted policy codes
    if (trimmedNum.length >= 5) {
      const generatedPolicy: HMOPolicyRecord = {
        policyNumber: trimmedNum,
        provider,
        enrolleeName: 'Verified Policy Holder',
        status: 'ACTIVE_APPROVED',
        coveragePercentage: 100,
        coveredDepartments: ['Cardiology', 'Obstetrics & Gynaecology', 'Surgery & Urology'],
        annualCapNgn: 1500000,
        utilizedNgn: 150000,
        preAuthCode: `AUTH-${provider.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`
      };

      this.data.hmoPolicies.push(generatedPolicy);
      this.persist();
      this.logApiCall('POST', '/api/v1/hmo/verify', 200, latency, `New HMO policy registered & approved: ${provider} [${trimmedNum}]`);
      return {
        verified: true,
        policy: generatedPolicy,
        message: `HMO clearance approved via national clearinghouse gateway. Pre-Auth: ${generatedPolicy.preAuthCode}`
      };
    }

    this.logApiCall('POST', '/api/v1/hmo/verify', 400, latency, `HMO lookup failed for policy [${policyNumber}]`);
    return {
      verified: false,
      message: 'Policy verification failed. Please recheck your enrollee number or choose Direct Payment.'
    };
  }

  // ================= COMPLIANCE & AUDIT =================
  public async addComplianceEntry(entry: Omit<NDPRComplianceEntry, 'id' | 'timestamp'> & { id?: string; timestamp?: string }): Promise<NDPRComplianceEntry> {
    const latency = await this.simulateNetworkDelay(10, 20);
    const now = new Date();
    const formatted = entry.timestamp || `${now.toISOString().split('T')[0]} ${now.toTimeString().split(' ')[0]}`;
    const newEntry: NDPRComplianceEntry = {
      id: entry.id || `ndpr-${Date.now()}`,
      timestamp: formatted,
      actor: entry.actor,
      action: entry.action,
      dataCategory: entry.dataCategory,
      encryptionStandard: entry.encryptionStandard,
      regulatoryArticle: entry.regulatoryArticle || 'NDPR 2019 / Nigeria Data Protection Act 2023 §31'
    };

    this.data.complianceLogs = [newEntry, ...this.data.complianceLogs];
    this.persist();
    this.logApiCall('POST', '/api/v1/compliance/audit-trail', 201, latency, `NDPR log appended: ${entry.action.slice(0, 45)}...`);
    return newEntry;
  }

  // ================= DATABASE ADMIN & TELEMETRY =================
  public getStats(): DatabaseStats {
    const jsonString = JSON.stringify(this.data);
    const approxBytes = new Blob([jsonString]).size;

    return {
      version: this.data.version,
      clusterNode: CLUSTER_NODE,
      status: 'ONLINE',
      lastSync: this.data.lastUpdated,
      totalAppointments: this.data.appointments.length,
      totalPatients: this.data.patients.length,
      totalPrescriptions: this.data.prescriptions.length,
      totalComplianceLogs: this.data.complianceLogs.length,
      totalHmoPolicies: this.data.hmoPolicies.length,
      approxStorageBytes: approxBytes
    };
  }

  public getApiLogs(): ApiActivityLog[] {
    return [...this.apiLogs];
  }

  public exportDatabaseJSON(): string {
    const snapshot: DatabaseSnapshot = {
      schemaVersion: this.data.version,
      exportedAt: new Date().toISOString(),
      clusterNode: CLUSTER_NODE,
      collections: {
        appointments: this.data.appointments,
        patients: this.data.patients,
        prescriptions: this.data.prescriptions,
        complianceLogs: this.data.complianceLogs,
        hmoPolicies: this.data.hmoPolicies
      }
    };
    return JSON.stringify(snapshot, null, 2);
  }

  public importDatabaseJSON(rawJson: string): { success: boolean; message: string } {
    try {
      const parsed = JSON.parse(rawJson);
      if (!parsed || !parsed.collections || !Array.isArray(parsed.collections.appointments)) {
        return { success: false, message: 'Invalid database snapshot format. Missing collections.appointments.' };
      }

      this.data = {
        version: parsed.schemaVersion || '2.0.0',
        lastUpdated: new Date().toISOString(),
        appointments: parsed.collections.appointments,
        patients: parsed.collections.patients || SEED_PATIENTS,
        prescriptions: parsed.collections.prescriptions || SEED_PRESCRIPTIONS,
        complianceLogs: parsed.collections.complianceLogs || SAMPLE_COMPLIANCE_LOGS,
        hmoPolicies: parsed.collections.hmoPolicies || SEED_HMO_POLICIES
      };

      this.persist();
      this.logApiCall('POST', '/api/v1/database/restore', 200, 45, `Database restored (${this.data.appointments.length} appointments imported)`);
      return { success: true, message: `Successfully restored database snapshot with ${this.data.appointments.length} appointments.` };
    } catch (e: any) {
      return { success: false, message: `Failed to import JSON: ${e.message || 'Syntax error'}` };
    }
  }

  public resetToFactorySeed(): void {
    this.data = {
      version: '2.0.0',
      lastUpdated: new Date().toISOString(),
      appointments: SEED_APPOINTMENTS,
      patients: SEED_PATIENTS,
      prescriptions: SEED_PRESCRIPTIONS,
      complianceLogs: SAMPLE_COMPLIANCE_LOGS,
      hmoPolicies: SEED_HMO_POLICIES
    };
    this.persist();
    this.logApiCall('POST', '/api/v1/database/reset', 200, 20, 'Database reset to default LAUTECH clinical seed data');
  }

  public getRawCollection(collectionName: 'appointments' | 'patients' | 'prescriptions' | 'complianceLogs' | 'hmoPolicies'): any {
    return this.data[collectionName] || [];
  }
}

export const clinicalDb = new ClinicalDatabaseService();
