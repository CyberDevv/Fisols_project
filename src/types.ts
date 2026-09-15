export type NetworkQuality = '4G_HIGH' | '3G_ADAPTIVE' | '2G_LOW' | 'OFFLINE_CACHED';

export type ClinicalDepartment = 
  | 'Cardiology'
  | 'Neurology'
  | 'Endocrinology'
  | 'Oncology & Clinical Genetics'
  | 'Infectious Diseases & Immunology'
  | 'Nephrology'
  | 'Obstetrics & Gynaecology'
  | 'Surgery & Urology';

export interface GeneticMarker {
  gene: 'CYP2C19' | 'CYP2D6' | 'CYP2C9' | 'VKORC1' | 'SLCO1B1' | 'HLA-B*5701' | 'DPYD' | 'TPMT';
  variant: string; // e.g. "*2/*2", "*1/*17", "521T>C", "Positive"
  phenotype: 'Poor Metabolizer' | 'Intermediate Metabolizer' | 'Normal Metabolizer' | 'Ultrarapid Metabolizer' | 'High Myopathy Risk' | 'High Hypersensitivity Risk' | 'Normal Function';
  testedDate: string;
  accreditation: string; // e.g. "Geneva-Standard Precision BioLab"
  clinicalImpact: string;
}

export interface PatientProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  stateOfResidence: string;
  chronicConditions: string[];
  drugAllergies: string[];
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  hmoProvider?: string;
  hmoNumber?: string;
  geneticProfile: GeneticMarker[];
  ndprConsentGiven: boolean;
  ndprConsentDate: string;
}

export interface Specialist {
  id: string;
  name: string;
  title: string;
  department: ClinicalDepartment;
  institution: string;
  qualifications: string;
  avatarUrl?: string;
  availableSlots: { date: string; time: string; available: boolean }[];
  precisionExpertise: string[];
  bio: string;
  lautechFacultyRole: string;
}

export interface TriageQuestionnaire {
  primaryConcern: string;
  symptomCategory: string;
  duration: string;
  severity: 'Mild' | 'Moderate' | 'Severe' | 'Critical';
  chestPainOrDyspnea: boolean;
  feverOrInfection: boolean;
  unusualBleedingOrBruising: boolean;
  hasPriorGenomicTest: boolean;
  patientNarrative: string;
}

export interface TriageResult {
  severityLevel: 'Mild' | 'Moderate' | 'Severe' | 'Critical';
  recommendedDepartment: ClinicalDepartment;
  matchedSpecialist: Specialist;
  clinicalPriority: 'Standard (within 48h)' | 'Expedited (within 12h)' | 'Urgent Precision Triage (<2h)';
  triageReasoning: string;
  flaggedRiskFactors: string[];
}

export interface UploadedDocument {
  id: string;
  name: string;
  type: 'lab_report' | 'genetic_panel' | 'past_prescription' | 'ecg_imaging';
  originalSizeBytes: number;
  compressedSizeBytes: number;
  compressionRatio: string;
  uploadDate: string;
  extractedMarkers?: string[];
  status: 'offline_cached' | 'synced_cloud';
}

export interface PatientVitals {
  bp: string;
  heartRate: number;
  spo2: number;
  temperature: string;
  weight: string;
  bmi: string;
}

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  time: string;
}

export interface AppointmentConsultationState {
  vitals: PatientVitals;
  clinicalNotes: string;
  prescriptionItems: PrescriptionItem[];
  generatedPrescription: DigitalPrescription | null;
  chatMessages: ChatMessage[];
  followUp: PostConsultFollowUp;
}

export interface AppointmentBooking {
  id: string;
  patient: PatientProfile;
  specialist: Specialist;
  selectedDate: string;
  selectedTime: string;
  triage: TriageResult;
  documents: UploadedDocument[];
  paymentMode: 'HMO_VERIFICATION' | 'DIRECT_PAYMENT';
  hmoDetails?: { provider: string; policyNumber: string; verified: boolean };
  paymentReference: string;
  teleconsultLink: string;
  status: 'SCHEDULED' | 'LIVE_IN_PROGRESS' | 'COMPLETED' | 'FOLLOW_UP_ACTIVE';
  createdAt: string;
  consultationState?: AppointmentConsultationState;
}

export interface PharmacogenomicRule {
  id: string;
  drugName: string;
  drugClass: string;
  primaryIndication: string;
  targetGene: 'CYP2C19' | 'CYP2D6' | 'CYP2C9' | 'VKORC1' | 'SLCO1B1' | 'HLA-B*5701' | 'DPYD' | 'TPMT';
  triggerVariant: string;
  triggerPhenotype: string;
  riskSeverity: 'CONTRAINDICATED' | 'HIGH_ADR_ALERT' | 'DOSE_ADJUSTMENT' | 'EFFICACY_WARNING' | 'SAFE_STANDARD';
  warningSummary: string;
  biologicalMechanism: string;
  genevaGuidelineRecommendation: string;
  saferAlternatives: string[];
  referenceCitation: string;
}

export interface PrescriptionItem {
  id: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  genomicStatus: 'FLAGGED_ADR_PREVENTED' | 'TAILORED_DOSAGE' | 'GENETICALLY_SAFE';
  pharmacogenomicNote: string;
}

export interface DigitalPrescription {
  id: string;
  appointmentId: string;
  patientId: string;
  patientName: string;
  physicianName: string;
  physicianLicense: string;
  institution: string;
  issuedAt: string;
  items: PrescriptionItem[];
  partnerPharmacy: {
    id: string;
    name: string;
    branch: string;
    routingStatus: 'ROUTED_PENDING' | 'ACCEPTED_DISPENSING' | 'READY_FOR_PICKUP';
    estimatedDeliveryHours: number;
  };
  sha256DigitalSignature: string;
  qrVerificationPayload: string;
}

export interface PostConsultFollowUp {
  id: string;
  appointmentId: string;
  patientName: string;
  checkInDueHours: number;
  status: 'PENDING_SCHEDULED' | 'COMPLETED_OPTIMAL' | 'ADR_ESCALATION_REQUIRED';
  symptomScore: number; // 1 to 10
  adverseReactionsReported: string[];
  patientNotes: string;
  timestamp: string;
  auditTrailHash: string;
}

export interface NDPRComplianceEntry {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  dataCategory: 'PATIENT_GENOMIC_DATA' | 'EHR_CONSULTATION' | 'E_PRESCRIPTION' | 'TELEMED_STREAM';
  encryptionStandard: 'AES-256 (At Rest)' | 'TLS 1.3 (In Transit)';
  regulatoryArticle: string;
}

export interface HMOPolicyRecord {
  policyNumber: string;
  provider: string;
  enrolleeName: string;
  status: 'ACTIVE_APPROVED' | 'EXPIRED' | 'PENDING_REAUTHORIZATION';
  coveragePercentage: number;
  coveredDepartments: ClinicalDepartment[];
  annualCapNgn: number;
  utilizedNgn: number;
  preAuthCode: string;
}

export interface ApiActivityLog {
  id: string;
  timestamp: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  endpoint: string;
  statusCode: 200 | 201 | 204 | 400 | 404;
  latencyMs: number;
  summary: string;
}

export interface DatabaseStats {
  version: string;
  clusterNode: string;
  status: 'ONLINE' | 'DEGRADED' | 'OFFLINE';
  lastSync: string;
  totalAppointments: number;
  totalPatients: number;
  totalPrescriptions: number;
  totalComplianceLogs: number;
  totalHmoPolicies: number;
  approxStorageBytes: number;
}

export interface DatabaseSnapshot {
  schemaVersion: string;
  exportedAt: string;
  clusterNode: string;
  collections: {
    appointments: AppointmentBooking[];
    patients: PatientProfile[];
    prescriptions: DigitalPrescription[];
    complianceLogs: NDPRComplianceEntry[];
    hmoPolicies: HMOPolicyRecord[];
  };
}

