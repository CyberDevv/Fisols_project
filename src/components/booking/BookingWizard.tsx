import React, { useState } from 'react';
import { 
  User, 
  Phone, 
  Mail, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Stethoscope, 
  UploadCloud, 
  FileText, 
  Calendar, 
  Clock, 
  CreditCard, 
  Send, 
  Video, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Dna, 
  Building2, 
  FileCheck2, 
  Layers,
  Check,
  Copy,
  Download,
  X,
  Plus,
  AlertTriangle,
  PhoneCall,
  Lock,
  Heart,
  Baby,
  Activity,
  UserCheck
} from 'lucide-react';
import { 
  PatientProfile, 
  Specialist, 
  TriageQuestionnaire, 
  TriageResult, 
  UploadedDocument, 
  AppointmentBooking, 
  NetworkQuality,
  ClinicalDepartment
} from '../../types';
import { 
  SPECIALISTS, 
  DEMO_PATIENT, 
  DEMO_PATIENT_AMINA, 
  DEMO_PATIENT_CHUKWUEMEKA, 
  DEMO_PATIENT_OBGYN, 
  DEMO_PATIENT_SURGERY_UROLOGY,
  LAUTECH_OBGYN_PROTOCOL, 
  LAUTECH_SURGERY_UROLOGY_PROTOCOL,
  HMO_LIST 
} from '../../data/clinicalData';
import { simulateAdaptiveCompression, formatBytes } from '../../utils/cryptoAndCompression';
import { useClinicalState } from '../../context/ClinicalStateContext';

interface BookingWizardProps {
  networkQuality: NetworkQuality;
  onAppointmentConfirmed: (appointment: AppointmentBooking) => void;
  onOpenConsultation: () => void;
  onOpenNdprModal?: () => void;
  onNavigateToObGyn?: () => void;
  onNavigateToSurgeryUrology?: () => void;
}

export const BookingWizard: React.FC<BookingWizardProps> = ({
  networkQuality,
  onAppointmentConfirmed,
  onOpenConsultation,
  onOpenNdprModal,
  onNavigateToObGyn,
  onNavigateToSurgeryUrology
}) => {
  const { verifyHmoPolicy, setActiveAppointmentId } = useClinicalState();

  // Current stage: 1 to 5
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Stage 1: Registration State
  const [patient, setPatient] = useState<PatientProfile>(DEMO_PATIENT);
  const [otpSent, setOtpSent] = useState<boolean>(true);
  const [otpValue, setOtpValue] = useState<string>('849201');
  const [otpVerified, setOtpVerified] = useState<boolean>(true);
  const [otpNotification, setOtpNotification] = useState<string | null>(null);
  const [consentErrorPrompt, setConsentErrorPrompt] = useState<boolean>(false);

  // Cardiac Emergency Safety Acknowledgment State (for Step 2 triage)
  const [cardiacEmergencyAcknowledged, setCardiacEmergencyAcknowledged] = useState<boolean>(true);

  // OB/GYN Elective Safety Screen State (for Step 2 triage)
  const [obGynEmergencyAcknowledged, setObGynEmergencyAcknowledged] = useState<boolean>(true);
  const [obGynRedFlags, setObGynRedFlags] = useState<string[]>([]);
  const [obGynElectiveCategory, setObGynElectiveCategory] = useState<string>('antenatal');

  // Surgery & Urology Elective Safety Screen State (for Step 2 triage)
  const [surgeryEmergencyAcknowledged, setSurgeryEmergencyAcknowledged] = useState<boolean>(true);
  const [surgeryRedFlags, setSurgeryRedFlags] = useState<string[]>([]);
  const [surgeryElectiveCategory, setSurgeryElectiveCategory] = useState<string>('post_op');

  // Condition and Allergy inputs for registration
  const [newConditionInput, setNewConditionInput] = useState<string>('');
  const [newAllergyInput, setNewAllergyInput] = useState<string>('');

  const handleAddCondition = () => {
    const trimmed = newConditionInput.trim();
    if (!trimmed) return;
    if (patient.chronicConditions.some(c => c.toLowerCase() === trimmed.toLowerCase())) {
      setNewConditionInput('');
      return;
    }
    setPatient(prev => ({
      ...prev,
      chronicConditions: [...prev.chronicConditions, trimmed]
    }));
    setNewConditionInput('');
  };

  const handleRemoveCondition = (indexToRemove: number) => {
    setPatient(prev => ({
      ...prev,
      chronicConditions: prev.chronicConditions.filter((_, i) => i !== indexToRemove)
    }));
  };

  const handleAddAllergy = () => {
    const trimmed = newAllergyInput.trim();
    if (!trimmed) return;
    if (patient.drugAllergies.some(a => a.toLowerCase() === trimmed.toLowerCase())) {
      setNewAllergyInput('');
      return;
    }
    setPatient(prev => ({
      ...prev,
      drugAllergies: [...prev.drugAllergies, trimmed]
    }));
    setNewAllergyInput('');
  };

  const handleRemoveAllergy = (indexToRemove: number) => {
    setPatient(prev => ({
      ...prev,
      drugAllergies: prev.drugAllergies.filter((_, i) => i !== indexToRemove)
    }));
  };

  // Stage 2: Symptom Triage State
  const [triageInput, setTriageInput] = useState<TriageQuestionnaire>({
    primaryConcern: 'Post-stent chest tightness & mild exertional dyspnea on Clopidogrel therapy',
    symptomCategory: 'Cardiovascular',
    duration: '4 to 7 days',
    severity: 'Moderate',
    chestPainOrDyspnea: true,
    feverOrInfection: false,
    unusualBleedingOrBruising: false,
    hasPriorGenomicTest: true,
    patientNarrative: 'Had a drug-eluting stent placed in my LAD 3 months ago. Recently experiencing recurrent chest tightness and exertional shortness of breath despite taking 75mg Clopidogrel and 40mg Simvastatin daily. Would like clinical review and genomic drug profiling.'
  });

  // Triage calculation result
  const [triageResult, setTriageResult] = useState<TriageResult>({
    severityLevel: 'Severe',
    recommendedDepartment: 'Cardiology',
    matchedSpecialist: SPECIALISTS[0], // Prof. Adeseye Akintunde
    clinicalPriority: 'Expedited (within 12h)',
    triageReasoning: 'Patient has prior percutaneous coronary intervention (PCI stent) presenting with exertional recurrence while on standard antiplatelet therapy. Automated pharmacogenomic alert flags potential CYP2C19 clopidogrel resistance.',
    flaggedRiskFactors: [
      'Post-PCI Drug-Eluting Stent in LAD',
      'Potential CYP2C19 Loss-of-Function Clopidogrel Resistance',
      'Exertional dyspnea on dual antiplatelet regimen',
      'High-risk for stent thrombosis'
    ]
  });

  // Stage 3: Document & Lab Uploader State
  const [documents, setDocuments] = useState<UploadedDocument[]>([
    {
      id: 'doc-genomic-01',
      name: '54gene_UniGeneva_CYP450_Comprehensive_Panel.pdf',
      type: 'genetic_panel',
      originalSizeBytes: 4850000, // ~4.85 MB
      compressedSizeBytes: 395000, // ~395 KB
      compressionRatio: '91.8% Saved',
      uploadDate: '2026-09-08',
      extractedMarkers: ['CYP2C19 (*2/*2)', 'SLCO1B1 (521T>C)', 'CYP2D6 (*1/*1)', 'VKORC1 (-1639G>G)'],
      status: 'synced_cloud'
    },
    {
      id: 'doc-ecg-02',
      name: 'LAUTECH_Post_PCI_Angiography_Summary.pdf',
      type: 'ecg_imaging',
      originalSizeBytes: 2450000, // ~2.45 MB
      compressedSizeBytes: 280000, // ~280 KB
      compressionRatio: '88.5% Saved',
      uploadDate: '2026-09-08',
      status: 'synced_cloud'
    }
  ]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [compressionToast, setCompressionToast] = useState<string | null>(null);

  // Stage 4: Slot & HMO / Payment
  const [selectedDate, setSelectedDate] = useState<string>('Tomorrow');
  const [selectedTime, setSelectedTime] = useState<string>('09:00 AM');
  const [paymentType, setPaymentType] = useState<'HMO' | 'PAYMENT'>('HMO');
  const [selectedHmo, setSelectedHmo] = useState<string>('Hygeia HMO Nigeria');
  const [hmoNumberInput, setHmoNumberInput] = useState<string>('HYG-77492-LAUT');
  const [hmoVerified, setHmoVerified] = useState<boolean>(true);
  const [hmoVerifying, setHmoVerifying] = useState<boolean>(false);

  // Stage 5: Confirmed Booking State
  const [confirmedBooking, setConfirmedBooking] = useState<AppointmentBooking | null>(null);

  // Handler for Stage 1 OTP Verification
  const handleVerifyOtp = () => {
    setOtpVerified(true);
    setOtpNotification('Phone number successfully verified via SMS OTP.');
    setTimeout(() => setOtpNotification(null), 3000);
  };

  // Handler for Stage 2 Triage Computation
  const handleRunTriage = () => {
    let matchedDept: ClinicalDepartment = 'Cardiology';
    let matchedSpec = SPECIALISTS[0];

    if (triageInput.symptomCategory === 'Surgery & Urology') {
      matchedDept = 'Surgery & Urology';
      matchedSpec = SPECIALISTS.find(s => s.id === 'spec-dr-najimudeen') || SPECIALISTS[0];
    } else if (triageInput.symptomCategory === 'Obstetrics & Gynaecology') {
      matchedDept = 'Obstetrics & Gynaecology';
      matchedSpec = SPECIALISTS.find(s => s.id === 'spec-dr-adebayo') || SPECIALISTS[0];
    } else if (triageInput.symptomCategory === 'Neurology') {
      matchedDept = 'Neurology';
      matchedSpec = SPECIALISTS[1];
    } else if (triageInput.symptomCategory === 'Endocrinology') {
      matchedDept = 'Endocrinology';
      matchedSpec = SPECIALISTS[3];
    } else if (triageInput.symptomCategory === 'Oncology') {
      matchedDept = 'Oncology & Clinical Genetics';
      matchedSpec = SPECIALISTS[2];
    }

    const isSurgery = triageInput.symptomCategory === 'Surgery & Urology';
    const isObGyn = triageInput.symptomCategory === 'Obstetrics & Gynaecology';

    setTriageResult({
      severityLevel: isSurgery || isObGyn ? 'Moderate' : triageInput.chestPainOrDyspnea ? 'Severe' : 'Moderate',
      recommendedDepartment: matchedDept,
      matchedSpecialist: matchedSpec,
      clinicalPriority: isSurgery || isObGyn ? 'Standard (within 48h)' : triageInput.chestPainOrDyspnea ? 'Expedited (within 12h)' : 'Standard (within 48h)',
      triageReasoning: isSurgery
        ? `Elective outpatient surgical & urological review matched to Dr. Idowu Najimudeen under LAUTECH Elective Surgical & Urological Routine Protocol. Red-flag emergency screening verified clear.`
        : isObGyn 
        ? `Elective outpatient OB/GYN triage matched to Dr. Adekunle Adebayo under LAUTECH Tele-Gynecology Routine Protocol. Red flag screening verified clear for routine virtual care.`
        : `Automated triage matched presenting symptom profile to ${matchedDept} under ${matchedSpec.name} at ${matchedSpec.institution}. Priority designated as expedited due to cardiovascular risk indicators.`,
      flaggedRiskFactors: isSurgery
        ? [
            'LAUTECH Elective Surgical & Urological Routine Protocol Active',
            'Elective Outpatient Routing Confirmed (Dr. Idowu Najimudeen)',
            'Safety Screen Passed: Zero acute abdominal, retention, hematuria, or trauma red flags'
          ]
        : isObGyn
        ? [
            'LAUTECH Tele-Gynecology Routine Protocol Active',
            'Elective Outpatient Routing Confirmed (Dr. Adekunle Adebayo)',
            'Safety Screen Passed: Zero acute obstetric red flags reported'
          ]
        : [
            'Active clinical surveillance',
            'Genomic profile flagged for pharmacogenomic cross-check',
            'Elevated symptom severity index'
          ]
    });
    setCurrentStep(3);
  };

  // Handler for File Upload Simulation
  const handleFileUploadSim = (fileType: 'lab_report' | 'genetic_panel' | 'past_prescription') => {
    setIsUploading(true);
    setTimeout(() => {
      const origSize = Math.floor(Math.random() * 3000000) + 2000000; // 2MB - 5MB
      const comp = simulateAdaptiveCompression(origSize, networkQuality);
      
      const newDoc: UploadedDocument = {
        id: `doc-${Date.now()}`,
        name: fileType === 'genetic_panel' ? 'UniGeneva_Sequencing_Panel_Upload.pdf' : 'Diagnostic_Blood_Chemistry_Report.pdf',
        type: fileType,
        originalSizeBytes: comp.originalBytes,
        compressedSizeBytes: comp.compressedBytes,
        compressionRatio: `${comp.savedPercentage}% Saved`,
        uploadDate: new Date().toISOString().split('T')[0],
        extractedMarkers: fileType === 'genetic_panel' ? ['CYP2C19 (*2/*2)', 'SLCO1B1 (521T>C)'] : undefined,
        status: networkQuality === 'OFFLINE_CACHED' ? 'offline_cached' : 'synced_cloud'
      };

      setDocuments(prev => [newDoc, ...prev]);
      setIsUploading(false);
      setCompressionToast(`File compressed from ${formatBytes(comp.originalBytes)} to ${formatBytes(comp.compressedBytes)} (${comp.savedPercentage}% data saved for ${networkQuality} bandwidth)`);
      setTimeout(() => setCompressionToast(null), 4500);
    }, 800);
  };

  // Real client-side file upload with actual bytes computation
  const handleRealFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setTimeout(() => {
      const comp = simulateAdaptiveCompression(file.size, networkQuality);
      const isGene = file.name.toLowerCase().includes('gene') || file.name.toLowerCase().includes('cyp') || file.name.toLowerCase().includes('dna');
      const newDoc: UploadedDocument = {
        id: `doc-${Date.now()}`,
        name: file.name,
        type: isGene ? 'genetic_panel' : 'lab_report',
        originalSizeBytes: comp.originalBytes,
        compressedSizeBytes: comp.compressedBytes,
        compressionRatio: `${comp.savedPercentage}% Saved`,
        uploadDate: new Date().toISOString().split('T')[0],
        extractedMarkers: isGene ? ['CYP2C19 (*2/*2)', 'SLCO1B1 (521T>C)'] : undefined,
        status: networkQuality === 'OFFLINE_CACHED' ? 'offline_cached' : 'synced_cloud'
      };

      setDocuments(prev => [newDoc, ...prev]);
      setIsUploading(false);
      setCompressionToast(`"${file.name}" compressed from ${formatBytes(comp.originalBytes)} to ${formatBytes(comp.compressedBytes)} (${comp.savedPercentage}% saved for ${networkQuality})`);
      setTimeout(() => setCompressionToast(null), 4500);
    }, 750);
  };

  // Handler to generate and download real RFC 5545 .ics Calendar Invite
  const handleDownloadIcs = () => {
    if (!confirmedBooking) return;
    const icsString = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//KBF Precision Genomedix Ltd//LAUTECH Telemedicine//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:REQUEST',
      'BEGIN:VEVENT',
      `UID:${confirmedBooking.id}@telehealth.kbf.org`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `SUMMARY:KBF Precision Genomedix Ltd: Session with ${confirmedBooking.specialist.name}`,
      `DESCRIPTION:LAUTECH Teaching Hospital Precision Telemedicine Session.\\nAttending Doctor: ${confirmedBooking.specialist.name} (${confirmedBooking.specialist.department})\\nPatient: ${confirmedBooking.patient.fullName}\\nSecure Room: ${confirmedBooking.teleconsultLink}\\nProtocol: University of Geneva Pharmacogenomic Standards.`,
      `LOCATION:${confirmedBooking.teleconsultLink}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsString], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${confirmedBooking.id}_LAUTECH_Consultation.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const handleCopyLink = () => {
    if (!confirmedBooking) return;
    navigator.clipboard?.writeText(confirmedBooking.teleconsultLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Handler for HMO Verification
  const handleVerifyHmo = async () => {
    setHmoVerifying(true);
    const res = await verifyHmoPolicy(selectedHmo, hmoNumberInput);
    setHmoVerifying(false);
    setHmoVerified(res.verified);
  };

  // Reset handler to book another patient
  const handleResetToNewBooking = () => {
    setConfirmedBooking(null);
    setCurrentStep(1);
    setPatient({
      id: `PAT-LAUT-${Math.floor(10000 + Math.random() * 90000)}`,
      fullName: '',
      email: '',
      phone: '',
      age: 45,
      gender: 'Male',
      stateOfResidence: 'Oyo State',
      chronicConditions: [],
      drugAllergies: [],
      emergencyContact: { name: '', phone: '', relationship: 'Next of Kin' },
      hmoProvider: 'Direct Private Pay',
      hmoNumber: '',
      ndprConsentGiven: true,
      ndprConsentDate: new Date().toISOString(),
      geneticProfile: []
    });
    setOtpVerified(false);
    setDocuments([]);
    setNewConditionInput('');
    setNewAllergyInput('');
    setTriageInput({
      primaryConcern: '',
      symptomCategory: 'Cardiovascular',
      duration: '1 to 3 days',
      severity: 'Mild',
      chestPainOrDyspnea: false,
      feverOrInfection: false,
      unusualBleedingOrBruising: false,
      hasPriorGenomicTest: false,
      patientNarrative: ''
    });
  };

  // Final Confirmation Handler
  const handleFinalBooking = () => {
    const bookingId = `KBF-APT-${Math.floor(10000 + Math.random() * 90000)}`;
    const newBooking: AppointmentBooking = {
      id: bookingId,
      patient,
      specialist: triageResult.matchedSpecialist,
      selectedDate,
      selectedTime,
      triage: triageResult,
      documents,
      paymentMode: paymentType === 'HMO' ? 'HMO_VERIFICATION' : 'DIRECT_PAYMENT',
      hmoDetails: paymentType === 'HMO' ? {
        provider: selectedHmo,
        policyNumber: hmoNumberInput,
        verified: hmoVerified
      } : undefined,
      paymentReference: `TXN-LAUT-${Date.now().toString().slice(-6)}`,
      teleconsultLink: `https://kbf-telehealth.ng/v/lautech-${Date.now().toString().slice(-4)}`,
      status: 'SCHEDULED',
      createdAt: new Date().toISOString(),
      consultationState: {
        vitals: {
          bp: patient.fullName.includes('Amina') ? '118/76 mmHg' : patient.fullName.includes('Chukwuemeka') ? '126/82 mmHg' : '138/88 mmHg',
          heartRate: 74,
          spo2: 98,
          temperature: '36.8°C',
          weight: '78 kg',
          bmi: '25.2 kg/m²'
        },
        prescriptionItems: [],
        generatedPrescription: null,
        chatMessages: [
          {
            id: `msg-${Date.now()}`,
            sender: triageResult.matchedSpecialist.name,
            text: `Welcome ${patient.fullName || 'Patient'}. This is your encrypted telehealth consult line. I am reviewing your triage notes now.`,
            time: '09:00'
          }
        ],
        clinicalNotes: `Initial intake: Patient ${patient.fullName} (${patient.age}y ${patient.gender}) matched to ${triageResult.recommendedDepartment}. Primary presentation: ${triageResult.triageReasoning}`,
        followUp: {
          id: `FU-${Date.now().toString().slice(-6)}`,
          appointmentId: bookingId,
          patientName: patient.fullName,
          checkInDueHours: 48,
          status: 'PENDING_SCHEDULED',
          symptomScore: 8,
          adverseReactionsReported: [],
          patientNotes: '',
          timestamp: new Date().toISOString(),
          auditTrailHash: `SHA256-PENDING-${Date.now().toString(16).toUpperCase()}`
        }
      }
    };

    setConfirmedBooking(newBooking);
    onAppointmentConfirmed(newBooking);
    setActiveAppointmentId(newBooking.id);
    setCurrentStep(5);
  };

  const stepsList = [
    { num: 1, title: 'Patient Details', sub: 'Demographics & Verified Mobile' },
    { num: 2, title: 'Clinical Triage', sub: 'Specialist & Unit Matching' },
    { num: 3, title: 'Medical Records', sub: 'EHR & Genomic Data Sync' },
    { num: 4, title: 'Appointment & HMO', sub: 'Clinic Schedule & Coverage' },
    { num: 5, title: 'Confirmation', sub: 'Clinic Pass & Video Access' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
      {/* Booking Header Card - Modern Clinical Telehealth */}
      <div className="bg-white text-slate-900 rounded-2xl p-4 sm:p-6 lg:p-7 mb-5 sm:mb-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.03)] border border-slate-200">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[11px] sm:text-xs font-medium border border-slate-200">
              <Building2 className="w-3.5 h-3.5 text-slate-600 shrink-0" />
              KBF Precision Genomedix Ltd
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[11px] sm:text-xs font-medium border border-slate-200">
              LAUTECH Consultant Physicians
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] sm:text-xs font-medium border border-slate-200">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
              Pilot Research Prototype – Pending Ethics Approval
            </span>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-slate-950 font-sans">
              Book a Specialist Medical Consultation
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-3xl leading-relaxed">
              Schedule an outpatient video or tele-clinic appointment with our accredited consultant physicians. Complete the clinical intake form below for triage and specialist matching.
            </p>
          </div>

          {/* Quick Clinical Test Cases Toolbar */}
          <div className="pt-3.5 mt-3 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-2.5">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 shrink-0">
              <UserCheck className="w-3.5 h-3.5 text-slate-600" />
              <span>Quick Clinical Test Cases:</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => {
                  setPatient(DEMO_PATIENT);
                  setOtpVerified(true);
                  setTriageInput(prev => ({
                    ...prev,
                    primaryConcern: 'Recurrent exertional retrosternal chest tightness 6 months post-LAD DES stent placement.',
                    symptomCategory: 'Cardiovascular',
                    chestPainOrDyspnea: true
                  }));
                }}
                className="px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-950 text-[11px] font-medium border border-slate-200 transition-all flex items-center gap-1.5"
                title="Load Adewale Adeleke (Cardiology CYP2C19/SLCO1B1)"
              >
                <User className="w-3 h-3 text-slate-500 shrink-0" />
                <span>Mr. Adeleke (Cardio)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setPatient(DEMO_PATIENT_AMINA);
                  setOtpVerified(true);
                  setTriageInput(prev => ({
                    ...prev,
                    primaryConcern: 'Severe unilateral pulsating throbbing headache with photophobia and nausea; poor relief from standard codeine/paracetamol combinations.',
                    symptomCategory: 'Neurology',
                    chestPainOrDyspnea: false
                  }));
                }}
                className="px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-950 text-[11px] font-medium border border-slate-200 transition-all flex items-center gap-1.5"
                title="Load Dr. Amina Bello (Neurology CYP2D6 Migraine)"
              >
                <User className="w-3 h-3 text-slate-500 shrink-0" />
                <span>Dr. Amina (Neuro)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setPatient(DEMO_PATIENT_CHUKWUEMEKA);
                  setOtpVerified(true);
                  setTriageInput(prev => ({
                    ...prev,
                    primaryConcern: 'Pre-chemotherapy assessment for planned fluoropyrimidine 5-FU regimen; routine pharmacogenomic safety screen.',
                    symptomCategory: 'Oncology',
                    chestPainOrDyspnea: false
                  }));
                }}
                className="px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-950 text-[11px] font-medium border border-slate-200 transition-all flex items-center gap-1.5"
                title="Load Chukwuemeka Eze (Oncology DPYD Screen)"
              >
                <User className="w-3 h-3 text-slate-500 shrink-0" />
                <span>Chukwuemeka (Onco)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setPatient(DEMO_PATIENT_OBGYN);
                  setOtpVerified(true);
                  setTriageInput(prev => ({
                    ...prev,
                    primaryConcern: 'Routine second-trimester antenatal check-in (24W). Monitoring home BP, fetal movements normal, review of iron supplements.',
                    symptomCategory: 'Obstetrics & Gynaecology',
                    chestPainOrDyspnea: false,
                    duration: '4 to 7 days',
                    severity: 'Mild',
                    patientNarrative: 'Primigravida 24 weeks gestation. Low-risk elective care under LAUTECH Tele-Gynecology Routine Protocol.'
                  }));
                }}
                className="px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-950 text-[11px] font-medium border border-slate-200 transition-all flex items-center gap-1.5"
                title="Load Zainab Balogun (24W Antenatal OB/GYN Routine Care)"
              >
                <Heart className="w-3 h-3 text-slate-500 shrink-0" />
                <span>Zainab (OB/GYN)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setPatient(DEMO_PATIENT_SURGERY_UROLOGY);
                  setOtpVerified(true);
                  setTriageInput(prev => ({
                    ...prev,
                    primaryConcern: 'Post-TURP 6-week outpatient surveillance. Good urinary stream, zero hematuria, reviewing PSA and medication titration.',
                    symptomCategory: 'Surgery & Urology',
                    chestPainOrDyspnea: false,
                    duration: 'Over 2 weeks',
                    severity: 'Moderate',
                    patientNarrative: 'Post-TURP 6-week follow-up. Normal stream, no retention or hematuria. Review under LAUTECH Elective Surgical & Urological Protocol.'
                  }));
                  setSurgeryEmergencyAcknowledged(true);
                  setSurgeryRedFlags([]);
                }}
                className="px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-950 text-[11px] font-medium border border-slate-200 transition-all flex items-center gap-1.5"
                title="Load Alhaji Rasheed Adeleke (Surgery & Urology Post-Op Review)"
              >
                <Activity className="w-3 h-3 text-slate-500 shrink-0" />
                <span>Alhaji Rasheed (Surgery/Uro)</span>
              </button>
              <button
                type="button"
                onClick={handleResetToNewBooking}
                className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium border border-slate-200 transition-all"
                title="Reset to a blank intake form for any new patient"
              >
                <span>Clear Form</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Progress Bar (Visible on < sm screens) */}
        <div className="sm:hidden mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-slate-900">
              Step {currentStep} of 5: <span className="text-slate-900 font-bold">{stepsList[currentStep - 1]?.title}</span>
            </span>
            <span className="font-mono text-[11px] font-bold text-slate-700">{currentStep * 20}%</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-slate-900 h-full rounded-full transition-all duration-300"
              style={{ width: `${currentStep * 20}%` }}
            />
          </div>
        </div>

        {/* 5-Step Progress Stepper - Adaptive Horizontal Track on Mobile, Full Cards on Desktop */}
        <div className="mt-3 sm:mt-6 pt-3 sm:pt-5 border-t sm:border-t-0 border-slate-100 flex sm:grid sm:grid-cols-5 gap-2 bg-slate-50/70 p-1.5 sm:p-2 rounded-xl border border-slate-200 overflow-x-auto no-scrollbar scroll-smooth">
          {stepsList.map((st) => {
            const isDone = currentStep > st.num;
            const isCurrent = currentStep === st.num;
            return (
              <button
                key={st.num}
                onClick={() => {
                  if (st.num <= currentStep || confirmedBooking) {
                    setCurrentStep(st.num);
                  }
                }}
                className={`min-w-[130px] sm:min-w-0 flex-1 shrink-0 text-left p-2.5 sm:p-3 rounded-lg transition-all border min-h-[44px] flex flex-col justify-center ${
                  isCurrent 
                    ? 'bg-white border-slate-900 text-slate-950 shadow-xs' 
                    : isDone 
                      ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50' 
                      : 'border-transparent opacity-50 cursor-not-allowed text-slate-400'
                }`}
              >
                <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-transform shrink-0 ${
                    isDone 
                      ? 'bg-slate-700 text-white' 
                      : isCurrent 
                        ? 'bg-slate-900 text-white scale-105' 
                        : 'bg-slate-200 text-slate-600'
                  }`}>
                    {isDone ? <Check className="w-3 h-3 stroke-[2.5]" /> : st.num}
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                    Step {st.num}
                  </span>
                </div>
                <div className="text-[11px] sm:text-xs font-semibold text-slate-900 truncate">{st.title}</div>
                <div className="text-[10px] text-slate-500 truncate hidden md:block">{st.sub}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Notification Toast for Compression or OTP */}
      {compressionToast && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 animate-fadeIn">
          <FileCheck2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{compressionToast}</span>
        </div>
      )}

      {/* STEP 1: USER REGISTRATION & PROFILE SETUP */}
      {currentStep === 1 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 sm:pb-4 mb-4 border-b border-slate-100 gap-2">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                1.1 Secure User Registration &amp; Profile Creation
              </h3>
              <p className="text-xs text-slate-500">
                Patient onboarding with phone/email OTP verification and medical history baseline.
              </p>
            </div>
            <span className="self-start sm:self-auto px-2.5 py-1 text-xs bg-emerald-50 text-emerald-700 font-semibold rounded-full border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> NDPR Protected
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Legal Name
              </label>
              <input
                type="text"
                value={patient.fullName}
                onChange={(e) => setPatient({ ...patient, fullName: e.target.value })}
                className="w-full px-3 py-2 text-base sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="e.g. Adewale Johnson Adeleke"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                State of Residence
              </label>
              <input
                type="text"
                value={patient.stateOfResidence}
                onChange={(e) => setPatient({ ...patient, stateOfResidence: e.target.value })}
                className="w-full px-3 py-2 text-base sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="e.g. Oyo State (Ogbomoso / Ibadan)"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phone Number (for Low-Bandwidth SMS &amp; Alerts)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={patient.phone}
                  onChange={(e) => setPatient({ ...patient, phone: e.target.value })}
                  className="w-full px-3 py-2 text-base sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="+234 803 000 0000"
                />
                <button
                  type="button"
                  onClick={() => {
                    setOtpSent(true);
                    setOtpNotification('New 6-digit OTP dispatched to ' + patient.phone);
                    setTimeout(() => setOtpNotification(null), 3000);
                  }}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg shrink-0 border border-slate-300 min-h-[40px]"
                >
                  Send OTP
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                OTP Verification Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={otpValue}
                  onChange={(e) => setOtpValue(e.target.value)}
                  className="w-full px-3 py-2 text-base sm:text-sm border border-slate-300 rounded-lg font-mono tracking-widest text-center"
                  placeholder="6-digit code"
                />
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shrink-0 min-h-[40px]"
                >
                  {otpVerified ? 'Verified ✓' : 'Verify'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Age &amp; Gender
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  value={patient.age}
                  onChange={(e) => setPatient({ ...patient, age: parseInt(e.target.value) || 40 })}
                  className="px-3 py-2 text-base sm:text-sm border border-slate-300 rounded-lg"
                  placeholder="Age"
                />
                <select
                  value={patient.gender}
                  onChange={(e) => setPatient({ ...patient, gender: e.target.value as any })}
                  className="px-3 py-2 text-base sm:text-sm border border-slate-300 rounded-lg bg-white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={patient.email}
                onChange={(e) => setPatient({ ...patient, email: e.target.value })}
                className="w-full px-3 py-2 text-base sm:text-sm border border-slate-300 rounded-lg"
                placeholder="patient@example.com"
              />
            </div>
          </div>

          {/* Chronic Conditions & Drug Allergies */}
          <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Pre-existing Chronic Conditions
                </label>
                <span className="text-[10px] text-slate-400">
                  {patient.chronicConditions.length} listed
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-2 min-h-[30px] p-2 bg-slate-50/70 rounded-lg border border-slate-200/60">
                {patient.chronicConditions.length === 0 ? (
                  <span className="text-slate-400 text-xs italic py-0.5">No chronic conditions listed</span>
                ) : (
                  patient.chronicConditions.map((cond, idx) => (
                    <span 
                      key={idx} 
                      className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 bg-slate-100 text-slate-800 border border-slate-200 rounded-md text-xs font-medium transition-colors"
                    >
                      <span>{cond}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveCondition(idx)}
                        className="p-0.5 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors focus:outline-none"
                        title={`Remove ${cond}`}
                        aria-label={`Remove condition ${cond}`}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newConditionInput}
                  onChange={(e) => setNewConditionInput(e.target.value)}
                  placeholder="e.g. Stage 2 Hypertension, Asthma"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCondition();
                    }
                  }}
                  className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-400"
                />
                <button
                  type="button"
                  onClick={handleAddCondition}
                  disabled={!newConditionInput.trim()}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition shrink-0 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-800">
                  Known Drug Allergies
                </label>
                <span className="text-[10px] text-slate-400">
                  {patient.drugAllergies.length} documented
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-2 min-h-[30px] p-2 bg-slate-50/70 rounded-lg border border-slate-200">
                {patient.drugAllergies.length === 0 ? (
                  <span className="text-slate-400 text-xs italic py-0.5">No known drug allergies reported</span>
                ) : (
                  patient.drugAllergies.map((allergy, idx) => (
                    <span 
                      key={idx} 
                      className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 bg-rose-50 text-rose-900 border border-rose-200 rounded-md text-xs font-medium transition-colors"
                    >
                      <span>⚠️ {allergy}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAllergy(idx)}
                        className="p-0.5 rounded-full text-rose-600 hover:text-rose-900 hover:bg-rose-100 transition-colors focus:outline-none"
                        title={`Remove ${allergy}`}
                        aria-label={`Remove drug allergy ${allergy}`}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newAllergyInput}
                  onChange={(e) => setNewAllergyInput(e.target.value)}
                  placeholder="e.g. Penicillin, Sulfa drugs"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddAllergy();
                    }
                  }}
                  className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-400"
                />
                <button
                  type="button"
                  onClick={handleAddAllergy}
                  disabled={!newAllergyInput.trim()}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition shrink-0 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="text-xs font-semibold text-slate-800 mb-2">Emergency Contact Details</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                value={patient.emergencyContact.name}
                onChange={(e) => setPatient({
                  ...patient,
                  emergencyContact: { ...patient.emergencyContact, name: e.target.value }
                })}
                placeholder="Contact Name"
                className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
              />
              <input
                type="text"
                value={patient.emergencyContact.phone}
                onChange={(e) => setPatient({
                  ...patient,
                  emergencyContact: { ...patient.emergencyContact, phone: e.target.value }
                })}
                placeholder="Contact Phone"
                className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
              />
              <input
                type="text"
                value={patient.emergencyContact.relationship}
                onChange={(e) => setPatient({
                  ...patient,
                  emergencyContact: { ...patient.emergencyContact, relationship: e.target.value }
                })}
                placeholder="Relationship (e.g. Spouse)"
                className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
              />
            </div>
          </div>

          {/* EXPLICIT DATA PRIVACY / CONSENT CHECKPOINT UI (UN-SKIPPABLE) */}
          <div className={`mt-6 p-4 sm:p-5 rounded-2xl border transition-all ${
            patient.ndprConsentGiven
              ? 'bg-slate-50/80 border-slate-300'
              : consentErrorPrompt 
                ? 'bg-rose-50/60 border-rose-300 ring-1 ring-rose-200' 
                : 'bg-slate-50/50 border-slate-200'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  patient.ndprConsentGiven ? 'bg-slate-900 text-white' : 'bg-slate-600 text-white'
                }`}>
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                    Statutory Data Privacy &amp; Genomic Consent Checkpoint
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Mandatory compliance with Nigeria Data Protection Regulation (NDPR 2019 / NDPA 2023)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className={`px-2.5 py-1 text-[11px] font-medium rounded-full border ${
                  patient.ndprConsentGiven
                    ? 'bg-slate-200 text-slate-800 border-slate-300'
                    : 'bg-amber-50 text-amber-900 border-amber-200'
                }`}>
                  {patient.ndprConsentGiven ? '✓ Consent Verified' : '⚠️ Consent Required'}
                </span>
                {onOpenNdprModal && (
                  <button
                    type="button"
                    onClick={onOpenNdprModal}
                    className="text-[11px] text-slate-700 hover:text-slate-950 font-medium underline underline-offset-2 ml-1"
                  >
                    View NDPR Policy
                  </button>
                )}
              </div>
            </div>

            {/* Interactive Toggle Switch Row */}
            <div className="flex items-start gap-3 bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-2xs">
              <div className="pt-0.5 shrink-0">
                <button
                  type="button"
                  role="switch"
                  aria-checked={patient.ndprConsentGiven}
                  onClick={() => {
                    const next = !patient.ndprConsentGiven;
                    setPatient({ ...patient, ndprConsentGiven: next });
                    if (next) setConsentErrorPrompt(false);
                  }}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 ${
                    patient.ndprConsentGiven ? 'bg-slate-900' : 'bg-slate-300'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      patient.ndprConsentGiven ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="text-xs text-slate-700 space-y-1.5 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs">
                    Explicit Patient Authorization for Genomic &amp; Clinical Data Processing
                  </span>
                  <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">
                    Un-skippable
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
                  I hereby grant explicit, informed consent for <strong>KBF Precision Genomedix Ltd</strong> and accredited <strong>LAUTECH Teaching Hospital</strong> clinical specialists to securely collect, store, and analyze my demographic records, medical history, and sensitive <strong>pharmacogenomic DNA biomarkers</strong> (including CYP450 gene sequencing variants) in strict compliance with the <em>Nigeria Data Protection Regulation (NDPR 2019)</em> and <em>Nigeria Data Protection Act (NDPA 2023)</em>. 
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-1 text-[10px] sm:text-[11px] text-slate-500 font-mono">
                  <span className="flex items-center gap-1">
                    <Lock className="w-3 h-3 text-slate-600" />
                    AES-256 Storage
                  </span>
                  <span>•</span>
                  <span>TLS 1.3 Transport</span>
                  <span>•</span>
                  <span>Nigerian Data Sovereignty</span>
                </div>
              </div>
            </div>

            {/* Warning Prompt when untoggled */}
            {!patient.ndprConsentGiven && (
              <div className="mt-3 p-2.5 bg-slate-100 border border-slate-200 rounded-lg text-[11px] text-slate-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-slate-600 shrink-0" />
                <span>
                  <strong>NDPR Statutory Requirement:</strong> You must toggle and confirm consent above to authorize pharmacogenomic review and proceed to symptom triage.
                </span>
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-slate-100">
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-slate-700" />
              <span>Step 1 of 5: Profile &amp; NDPR Consent Verified</span>
            </div>

            {patient.ndprConsentGiven && patient.fullName ? (
              <button
                onClick={() => setCurrentStep(2)}
                className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition shadow-xs min-h-[44px]"
              >
                <span>Continue to Symptom Triage</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => {
                  if (!patient.ndprConsentGiven) {
                    setConsentErrorPrompt(true);
                  }
                }}
                className="w-full sm:w-auto px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-600 font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition shadow-2xs min-h-[44px] cursor-not-allowed"
                title="NDPR Consent must be toggled on to proceed"
              >
                <Lock className="w-4 h-4 text-slate-500" />
                <span>NDPR Consent Required to Continue</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* STEP 2: SYMPTOM TRIAGE & SPECIALIST MATCH */}
      {currentStep === 2 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs">
          {/* BOLD EMERGENCY REDIRECTION WARNING BANNER (MANDATORY CLINICAL SAFETY TRIGGER) */}
          <div className="mb-5 p-4 rounded-xl bg-rose-50 border-2 border-rose-300/90 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <AlertTriangle className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs sm:text-sm font-bold text-rose-950">
                      Emergency Redirection Warning
                    </h4>
                    <span className="px-2 py-0.5 bg-rose-200 text-rose-900 text-[10px] rounded font-bold uppercase tracking-wider">
                      Statutory Clinical Safety Notice
                    </span>
                  </div>
                  <p className="text-xs text-rose-900 font-bold mt-1 leading-snug">
                    If you are experiencing a life-threatening medical emergency, please visit the nearest LAUTECH Emergency Department immediately.
                  </p>
                  <p className="text-[11px] text-rose-800 mt-0.5">
                    Telehealth is strictly designed for elective outpatient triage and pharmacogenomic dosing review—not acute resuscitation.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                <a
                  href="tel:08005288324"
                  className="w-full sm:w-auto px-4 py-2.5 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition shadow-xs whitespace-nowrap min-h-[42px]"
                  title="Direct Emergency Dispatch Hotline"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Call 0800-LAUTECH (24/7 ER)</span>
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 sm:pb-4 mb-4 border-b border-slate-100 gap-2">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                1.2 Guided Symptom Triage &amp; Specialist Routing
              </h3>
              <p className="text-xs text-slate-500">
                Algorithmic questionnaire to determine clinical severity and match you with the right LAUTECH unit.
              </p>
            </div>
            <span className="self-start sm:self-auto px-2 py-0.5 text-xs font-mono bg-indigo-50 text-indigo-700 rounded-md border border-indigo-200">
              CDS Triage v2.4
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Clinical Concern Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                {[
                  { id: 'Cardiovascular', label: 'Cardiovascular / Heart' },
                  { id: 'Obstetrics & Gynaecology', label: 'OB/GYN & Women\'s Health' },
                  { id: 'Surgery & Urology', label: 'Surgery & Urology' },
                  { id: 'Neurology', label: 'Neurology / Brain & Nerves' },
                  { id: 'Endocrinology', label: 'Metabolic & Diabetes' },
                  { id: 'Oncology', label: 'Oncology / Cancer Genetics' }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setTriageInput({ ...triageInput, symptomCategory: cat.id });
                      if (cat.id === 'Obstetrics & Gynaecology' && !patient.fullName.includes('Zainab')) {
                        setPatient(DEMO_PATIENT_OBGYN);
                      } else if (cat.id === 'Surgery & Urology' && !patient.fullName.includes('Rasheed')) {
                        setPatient(DEMO_PATIENT_SURGERY_UROLOGY);
                      }
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-medium text-left transition min-h-[44px] ${
                      triageInput.symptomCategory === cat.id
                        ? 'border-blue-600 bg-blue-50 text-blue-800 font-semibold'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* OB/GYN MODULE: ELECTIVE TELEHEALTH & SAFETY SCREEN (USER MANDATE) */}
            {triageInput.symptomCategory === 'Obstetrics & Gynaecology' && (
              <div className="p-4 sm:p-5 bg-white border border-slate-200 rounded-2xl space-y-4 shadow-xs">
                <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-slate-900 text-white">
                      <Heart className="w-4 h-4" />
                    </span>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-950">
                        OB/GYN Module: Elective Telehealth &amp; Safety Screen
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        LAUTECH Teaching Hospital, Ogbomoso &bull; Women's Health &amp; Antenatal Service
                      </p>
                    </div>
                  </div>
                  {onNavigateToObGyn && (
                    <button
                      type="button"
                      onClick={onNavigateToObGyn}
                      className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:text-slate-950 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition shrink-0 shadow-2xs"
                    >
                      Open Full OB/GYN Clinic Screen &rarr;
                    </button>
                  )}
                </div>

                {/* 1. Emergency Safety Check (The Red Flag Stop) */}
                <div className="p-3.5 bg-slate-50/60 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>1. Emergency Safety Check (The Red Flag Stop)</span>
                  </div>
                  <div className="p-3 bg-red-50/80 border border-red-200 rounded-lg text-red-950 text-xs font-semibold leading-relaxed">
                    <strong>Emergency Notice:</strong> If you are experiencing active heavy vaginal bleeding in pregnancy, severe abdominal pain, or decreased fetal movement, do not use this app. Go immediately to LAUTECH Hospital Emergency.
                  </div>
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-semibold text-slate-700 block">
                      Screen for acute obstetric red flags:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {[
                        { id: 'bleeding', label: 'Active heavy vaginal bleeding' },
                        { id: 'pain', label: 'Severe abdominal pain' },
                        { id: 'fetal', label: 'Decreased fetal movement' }
                      ].map((flag) => {
                        const checked = obGynRedFlags.includes(flag.id);
                        return (
                          <label
                            key={flag.id}
                            className={`flex items-start gap-2 p-2.5 rounded-lg border text-xs cursor-pointer transition min-h-[44px] ${
                              checked
                                ? 'bg-red-50 border-red-300 text-red-950 font-semibold ring-1 ring-red-300'
                                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setObGynRedFlags(prev => [...prev, flag.id]);
                                } else {
                                  setObGynRedFlags(prev => prev.filter(x => x !== flag.id));
                                }
                              }}
                              className="mt-0.5 w-4 h-4 text-red-600 rounded shrink-0"
                            />
                            <span className="leading-snug">{flag.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {obGynRedFlags.length > 0 && (
                    <div className="p-3 bg-red-700 text-white rounded-lg text-xs space-y-2">
                      <div className="font-bold flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4" />
                        <span>EMERGENCY STOP TRIGGERED: Virtual Consultation Blocked</span>
                      </div>
                      <p className="text-[11px] leading-relaxed">
                        Virtual consultation is disabled due to red-flag obstetric symptoms requiring immediate in-person clinical assessment, ultrasound, and physical examination.
                      </p>
                      <a
                        href="tel:08005288324"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-red-700 font-bold rounded-lg text-xs hover:bg-red-50"
                      >
                        <PhoneCall className="w-3.5 h-3.5" /> Call LAUTECH Emergency Casualty (0800-LAUTECH)
                      </a>
                    </div>
                  )}
                </div>

                {/* 2. Core Elective Focus (What Telemedicine Solves Here) */}
                <div className="p-3.5 bg-slate-50/60 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                    <Baby className="w-4 h-4 text-slate-700 shrink-0" />
                    <span>2. Core Elective Focus (What Telemedicine Solves Here)</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    <strong className="text-slate-900">Elective Outpatient Care:</strong> This telehealth channel is designed for routine antenatal reviews, postpartum check-ins, menstrual tracking, contraceptive counseling, and stable gynecological care that does not require an immediate physical examination.
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 pt-1">
                    {[
                      { id: 'antenatal', label: 'Routine Antenatal' },
                      { id: 'postpartum', label: 'Postpartum Review' },
                      { id: 'menstrual', label: 'Menstrual Tracking' },
                      { id: 'contraceptive', label: 'Contraceptive Counseling' },
                      { id: 'gynae', label: 'Stable Gynecology' }
                    ].map((track) => (
                      <button
                        key={track.id}
                        type="button"
                        onClick={() => setObGynElectiveCategory(track.id)}
                        className={`p-2 rounded-lg text-[11px] font-medium border text-center transition ${
                          obGynElectiveCategory === track.id
                            ? 'bg-slate-900 border-slate-900 text-white font-semibold'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {track.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Patient Safety Acknowledgment */}
                <div className="p-3.5 bg-slate-50/60 rounded-xl border border-slate-200 shadow-2xs">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-xs mb-2">
                    <CheckCircle2 className="w-4 h-4 text-slate-700 shrink-0" />
                    <span>3. Patient Safety Acknowledgment</span>
                  </div>
                  <label className="flex items-start gap-2.5 text-xs text-slate-800 font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={obGynEmergencyAcknowledged}
                      onChange={(e) => setObGynEmergencyAcknowledged(e.target.checked)}
                      className="mt-0.5 w-4 h-4 text-slate-900 rounded shrink-0"
                    />
                    <span className="leading-snug font-semibold text-slate-900">
                      I confirm my current OB/GYN symptoms are non-emergency and suitable for an elective virtual consultation.
                    </span>
                  </label>
                </div>

                {/* 4. Matched Specialist View */}
                <div className="p-3.5 bg-slate-50/60 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                    <Stethoscope className="w-4 h-4 text-slate-700 shrink-0" />
                    <span>4. Matched Specialist View</span>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-white rounded-xl border border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs">
                        AA
                      </div>
                      <div>
                        <div className="font-bold text-xs sm:text-sm text-slate-950">
                          Dr. Adekunle Adebayo
                        </div>
                        <div className="text-[11px] text-slate-600">
                          Consultant Obstetrician &amp; Gynaecologist, LAUTECH Teaching Hospital, Ogbomoso
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-800 text-[10px] font-semibold rounded border border-slate-200">
                            Routing: Elective Outpatient Schedule
                          </span>
                          <span className="px-2 py-0.5 bg-white text-slate-700 text-[10px] font-medium rounded border border-slate-200 font-mono">
                            Protocol: LAUTECH Tele-Gynecology Routine Protocol
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SURGERY & UROLOGY MODULE: ELECTIVE TELEHEALTH & SAFETY SCREEN */}
            {triageInput.symptomCategory === 'Surgery & Urology' && (
              <div className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-slate-900 text-white shadow-2xs">
                      <Activity className="w-4 h-4" />
                    </span>
                    <div>
                      <h4 className="font-bold text-sm sm:text-base text-slate-950">
                        Surgery &amp; Urology Module: Elective Telehealth &amp; Safety Screen
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Standardized surgical triage &amp; non-emergency verification protocol
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {onNavigateToSurgeryUrology && (
                      <button
                        type="button"
                        onClick={onNavigateToSurgeryUrology}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition flex items-center gap-1 border border-slate-200 shadow-2xs"
                      >
                        <span>Open Full Module</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                {/* 1. Emergency Safety Check (The Red Flag Stop) */}
                <div className={`p-4 rounded-xl border transition-all ${
                  surgeryRedFlags.length > 0
                    ? 'bg-red-50 border-red-300 text-red-950'
                    : 'bg-slate-50/60 border-slate-200'
                }`}>
                  <div className="flex items-start gap-2.5 mb-2.5">
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-bold text-xs sm:text-sm text-slate-900">
                        1. Emergency Safety Check (The Red Flag Stop)
                      </h5>
                      <p className="text-[11px] text-slate-500">
                        Acute surgical and urological emergencies require physical resuscitation, immediate catheterization, or surgical exploration.
                      </p>
                    </div>
                  </div>

                  {/* Mandated Emergency Notice Box */}
                  <div className="p-3 bg-red-50/80 border border-red-200 rounded-lg text-xs text-red-950 font-medium leading-relaxed mb-3">
                    <strong className="text-red-900">Emergency Notice:</strong> If you are experiencing <strong>acute severe abdominal pain</strong>, <strong>sudden urinary retention with severe distress</strong>, <strong>active gross hematuria with clots</strong>, or <strong>acute trauma</strong>, do not use this app. Go immediately to LAUTECH Hospital Emergency.
                  </div>

                  {/* Red flag checklist */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-700 block">
                      Check if you have any of these emergency symptoms:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[
                        { id: 'acute_abdominal_pain', label: 'Acute severe abdominal pain' },
                        { id: 'urinary_retention', label: 'Sudden urinary retention with severe distress' },
                        { id: 'gross_hematuria_clots', label: 'Active gross hematuria with clots' },
                        { id: 'acute_trauma', label: 'Acute trauma' },
                      ].map((flag) => {
                        const isChecked = surgeryRedFlags.includes(flag.id);
                        return (
                          <label
                            key={flag.id}
                            className={`flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer transition ${
                              isChecked
                                ? 'bg-red-100 border-red-300 font-semibold text-red-950'
                                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {
                                const next = isChecked
                                  ? surgeryRedFlags.filter(id => id !== flag.id)
                                  : [...surgeryRedFlags, flag.id];
                                setSurgeryRedFlags(next);
                                if (next.length > 0) {
                                  setSurgeryEmergencyAcknowledged(false);
                                }
                              }}
                              className="w-3.5 h-3.5 text-red-600 rounded border-slate-300"
                            />
                            <span>{flag.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {surgeryRedFlags.length > 0 && (
                    <div className="mt-3 p-3 bg-red-700 text-white rounded-lg text-xs space-y-2">
                      <div className="font-bold flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-white shrink-0" />
                        <span>EMERGENCY STOP TRIGGERED</span>
                      </div>
                      <p className="text-[11px] text-red-100">
                        Virtual consultation is blocked. Please present to LAUTECH Teaching Hospital Casualty Emergency Department immediately.
                      </p>
                      <a
                        href="tel:08005288324"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-red-700 font-bold rounded text-xs shadow-2xs hover:bg-red-50"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Call LAUTECH ER (0800-LAUTECH)</span>
                      </a>
                    </div>
                  )}
                </div>

                {/* 2. Core Elective Focus (What Telemedicine Solves Here) */}
                <div className="p-4 bg-slate-50/60 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-slate-700" />
                    <h5 className="font-bold text-xs sm:text-sm text-slate-900">
                      2. Core Elective Focus (What Telemedicine Solves Here)
                    </h5>
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 leading-relaxed font-medium">
                    <strong className="text-slate-900">Elective Outpatient Care:</strong> This telehealth channel is designed for elective urological and surgical pre-operative evaluations, post-operative follow-up care, chronic symptom tracking, and routine specialist referrals.
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {[
                      { id: 'pre_op', title: 'Pre-operative Evaluations', desc: 'Surgical clearance, lab reviews (E/U/Cr, PSA), anesthesia review' },
                      { id: 'post_op', title: 'Post-operative Follow-up Care', desc: 'Wound healing photo review, catheter removal plan, histology discussion' },
                      { id: 'chronic', title: 'Chronic Symptom Tracking', desc: 'BPH/LUTS medical therapy, IPSS tracking, stable stone surveillance' },
                      { id: 'referral', title: 'Routine Specialist Referrals', desc: 'Ultrasound and PSA review, elective surgical outpatient booking' }
                    ].map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setSurgeryElectiveCategory(item.id)}
                        className={`p-2.5 rounded-lg border text-xs cursor-pointer transition ${
                          surgeryElectiveCategory === item.id
                            ? 'bg-slate-900 border-slate-900 text-white font-medium'
                            : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className={`font-bold flex items-center justify-between ${surgeryElectiveCategory === item.id ? 'text-white' : 'text-slate-900'}`}>
                          <span>{item.title}</span>
                          {surgeryElectiveCategory === item.id && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <p className={`text-[11px] mt-0.5 ${surgeryElectiveCategory === item.id ? 'text-slate-300' : 'text-slate-500'}`}>{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Patient Safety Acknowledgment */}
                <div className="p-4 bg-slate-50/60 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className="w-4 h-4 text-slate-700" />
                    <h5 className="font-bold text-xs sm:text-sm text-slate-900">
                      3. Patient Safety Acknowledgment
                    </h5>
                  </div>
                  <label className={`flex items-start gap-2.5 p-3 rounded-lg border cursor-pointer transition ${
                    surgeryEmergencyAcknowledged 
                      ? 'bg-white border-slate-400' 
                      : 'bg-white border-slate-200'
                  } ${surgeryRedFlags.length > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <input
                      type="checkbox"
                      disabled={surgeryRedFlags.length > 0}
                      checked={surgeryEmergencyAcknowledged}
                      onChange={(e) => {
                        if (surgeryRedFlags.length === 0) {
                          setSurgeryEmergencyAcknowledged(e.target.checked);
                        }
                      }}
                      className="mt-0.5 w-4 h-4 text-slate-900 rounded border-slate-300"
                    />
                    <span className="text-xs font-semibold text-slate-900 leading-snug">
                      I confirm my current surgical/urological symptoms are non-emergency and suitable for an elective virtual consultation.
                    </span>
                  </label>
                </div>

                {/* 4. Matched Specialist View */}
                <div className="p-4 bg-slate-50/60 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-slate-700" />
                      <h5 className="font-bold text-xs sm:text-sm text-slate-900">
                        4. Matched Specialist View
                      </h5>
                    </div>
                    <span className="px-2 py-0.5 bg-slate-200 text-slate-800 text-[10px] font-semibold rounded">
                      Allocated
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-slate-200 flex items-start gap-3">
                    <div className="w-11 h-11 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs">
                      IN
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-xs sm:text-sm text-slate-950">
                        Dr. Idowu Najimudeen
                      </div>
                      <div className="text-[11px] text-slate-600 font-medium">
                        Consultant Urologist, LAUTECH Teaching Hospital, Ogbomoso
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-1.5">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-800 text-[10px] font-semibold rounded border border-slate-200">
                          Routing: Elective Outpatient Schedule
                        </span>
                        <span className="px-2 py-0.5 bg-white text-slate-700 text-[10px] font-medium rounded border border-slate-200 font-mono">
                          Protocol: LAUTECH Elective Surgical &amp; Urological Routine Protocol
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Primary Symptoms &amp; Duration
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  value={triageInput.primaryConcern}
                  onChange={(e) => setTriageInput({ ...triageInput, primaryConcern: e.target.value })}
                  placeholder="e.g. Chest tightness on medication"
                  className="sm:col-span-2 px-3 py-2 text-base sm:text-sm border border-slate-300 rounded-lg"
                />
                <select
                  value={triageInput.duration}
                  onChange={(e) => setTriageInput({ ...triageInput, duration: e.target.value })}
                  className="px-3 py-2 text-base sm:text-sm border border-slate-300 rounded-lg bg-white"
                >
                  <option value="Under 24 hours">Under 24 hours</option>
                  <option value="1 to 3 days">1 to 3 days</option>
                  <option value="4 to 7 days">4 to 7 days</option>
                  <option value="Over 2 weeks">Over 2 weeks</option>
                </select>
              </div>
            </div>

            {/* High-Risk Red Flag Indicators */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <span className="text-xs font-semibold text-slate-800 block">
                High-Risk Clinical Screening Checklist:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <label className="flex items-center gap-2 p-2.5 bg-white rounded-lg border border-slate-200 cursor-pointer min-h-[44px]">
                  <input
                    type="checkbox"
                    checked={triageInput.chestPainOrDyspnea}
                    onChange={(e) => setTriageInput({ ...triageInput, chestPainOrDyspnea: e.target.checked })}
                    className="w-4 h-4 text-rose-600 rounded"
                  />
                  <span>Chest pain, tightness, or shortness of breath</span>
                </label>
                <label className="flex items-center gap-2 p-2.5 bg-white rounded-lg border border-slate-200 cursor-pointer min-h-[44px]">
                  <input
                    type="checkbox"
                    checked={triageInput.unusualBleedingOrBruising}
                    onChange={(e) => setTriageInput({ ...triageInput, unusualBleedingOrBruising: e.target.checked })}
                    className="w-4 h-4 text-rose-600 rounded"
                  />
                  <span>Unexplained bruising, bleeding, or muscle aches</span>
                </label>
                <label className="flex items-center gap-2 p-2.5 bg-white rounded-lg border border-slate-200 cursor-pointer min-h-[44px]">
                  <input
                    type="checkbox"
                    checked={triageInput.hasPriorGenomicTest}
                    onChange={(e) => setTriageInput({ ...triageInput, hasPriorGenomicTest: e.target.checked })}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                  <span>Have existing pharmacogenomic DNA / CYP450 lab panel</span>
                </label>
                <label className="flex items-center gap-2 p-2.5 bg-white rounded-lg border border-slate-200 cursor-pointer min-h-[44px]">
                  <input
                    type="checkbox"
                    checked={triageInput.feverOrInfection}
                    onChange={(e) => setTriageInput({ ...triageInput, feverOrInfection: e.target.checked })}
                    className="w-4 h-4 text-amber-600 rounded"
                  />
                  <span>Current acute fever, chills, or infectious signs</span>
                </label>
              </div>
            </div>

            {/* AUTOMATED CARDIOLOGY & HIGH-RISK SAFETY TRIGGER PROMPT */}
            {(triageInput.chestPainOrDyspnea || triageInput.symptomCategory === 'Cardiovascular') && (
              <div className="p-4 bg-amber-50/80 border-2 border-amber-300 rounded-xl space-y-3">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs sm:text-sm font-bold text-amber-950">
                      Cardiology Safety Trigger: Active Chest Symptoms Detected
                    </h5>
                    <p className="text-xs text-amber-900 leading-relaxed mt-0.5">
                      You have reported symptoms linked to cardiac or post-stent concerns (e.g. chest tightness, exertional dyspnea). 
                      If you are experiencing severe, crushing retrosternal pain, radiating pressure to the left arm or jaw, profound sweating, or syncope, <strong>do not wait for a scheduled video appointment</strong>.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-white/95 rounded-lg border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
                  <label className="flex items-start sm:items-center gap-2.5 text-xs text-slate-800 font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={cardiacEmergencyAcknowledged}
                      onChange={(e) => setCardiacEmergencyAcknowledged(e.target.checked)}
                      className="mt-0.5 sm:mt-0 w-4 h-4 text-amber-600 rounded"
                    />
                    <span>
                      <strong className="text-amber-950">Mandatory Clinical Safety Acknowledgment:</strong> I confirm my symptoms are currently stable for elective outpatient teleconsultation. If severe chest pain escalates, I will seek immediate in-person emergency care at LAUTECH Hospital.
                    </span>
                  </label>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-[11px] text-amber-900 font-medium">
                  <span className="font-bold">LAUTECH Hospital Casualty Units:</span>
                  <span className="px-2 py-0.5 rounded bg-white border border-amber-200 text-slate-700">Ogbomoso Main Casualty (General Hospital Rd)</span>
                  <span className="px-2 py-0.5 rounded bg-white border border-amber-200 text-slate-700">Osogbo Trauma Center</span>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Detailed Patient Narrative &amp; Current Medications
              </label>
              <textarea
                rows={3}
                value={triageInput.patientNarrative}
                onChange={(e) => setTriageInput({ ...triageInput, patientNarrative: e.target.value })}
                className="w-full px-3 py-2 text-base sm:text-sm border border-slate-300 rounded-lg"
                placeholder="Describe what medications you are taking and how you feel..."
              />
            </div>
          </div>

          <div className="mt-6 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(1)}
              className="w-full sm:w-auto px-4 py-2.5 text-slate-600 hover:text-slate-800 text-sm font-medium flex items-center justify-center gap-1.5 min-h-[44px]"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Profile
            </button>
            <button
              onClick={handleRunTriage}
              disabled={
                ((triageInput.chestPainOrDyspnea || triageInput.symptomCategory === 'Cardiovascular') && !cardiacEmergencyAcknowledged) ||
                (triageInput.symptomCategory === 'Obstetrics & Gynaecology' && (!obGynEmergencyAcknowledged || obGynRedFlags.length > 0)) ||
                (triageInput.symptomCategory === 'Surgery & Urology' && (!surgeryEmergencyAcknowledged || surgeryRedFlags.length > 0))
              }
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 shadow-xs transition min-h-[44px]"
            >
              <span>Compute Clinical Match</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: DOCUMENT & LAB RESULT UPLOADER */}
      {currentStep === 3 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 sm:pb-4 mb-4 border-b border-slate-100 gap-2">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                1.3 Offline-Ready Document &amp; Lab Result Uploader
              </h3>
              <p className="text-xs text-slate-500">
                Preserve patient data under 3G/4G constraints via client-side adaptive compression.
              </p>
            </div>
            <span className="self-start sm:self-auto px-2.5 py-1 text-xs bg-slate-100 text-slate-800 rounded-full font-semibold border border-slate-200">
              Current Mode: {networkQuality.replace('_', ' ')}
            </span>
          </div>

          {/* Matched Specialist Preview Card */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl mb-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-base sm:text-lg shadow-sm shrink-0">
                  PA
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-sm">
                      {triageResult.matchedSpecialist.name}
                    </h4>
                    <span className="px-2 py-0.5 text-[10px] bg-slate-800 text-white font-semibold rounded">
                      Matched Specialist
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 font-medium">
                    {triageResult.matchedSpecialist.title} — {triageResult.matchedSpecialist.institution}
                  </p>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Priority: <span className="font-semibold text-slate-900">{triageResult.clinicalPriority}</span>
                  </p>
                </div>
              </div>

              <div className="text-xs bg-white p-2.5 rounded-lg border border-slate-200 max-w-full sm:max-w-xs">
                <span className="font-semibold text-slate-800 block text-[11px] mb-1">
                  University of Geneva Protocol Triggered:
                </span>
                <span className="text-[11px] text-slate-600 leading-tight block">
                  Genomic panel cross-referencing enabled for CYP2C19 antiplatelet and SLCO1B1 statin markers.
                </span>
              </div>
            </div>
          </div>

          {/* Uploader Box */}
          <div className="border-2 border-dashed border-slate-300 hover:border-slate-400 rounded-2xl p-4 sm:p-6 text-center bg-slate-50/70 transition">
            <UploadCloud className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-800">
              Upload Diagnostic Results, Genomic Reports or Prescriptions
            </h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
              Diagnostic files and genomic reports are automatically encrypted with AES-256 and optimized on-device for instant clinical review.
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap justify-center items-stretch sm:items-center gap-2">
              <label className="px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition min-h-[42px]">
                <UploadCloud className="w-3.5 h-3.5" />
                <span>{isUploading ? 'Compressing...' : 'Browse Local File (PDF/IMG)'}</span>
                <input
                  type="file"
                  onChange={handleRealFileUpload}
                  disabled={isUploading}
                  className="hidden"
                  accept=".pdf,.png,.jpg,.jpeg,.dcm,.txt"
                />
              </label>

              <button
                type="button"
                disabled={isUploading}
                onClick={() => handleFileUploadSim('genetic_panel')}
                className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 shadow-xs transition min-h-[42px]"
              >
                <Dna className="w-3.5 h-3.5 text-slate-600" />
                <span>{isUploading ? 'Compressing...' : 'Sample Genetic Panel'}</span>
              </button>
              <button
                type="button"
                disabled={isUploading}
                onClick={() => handleFileUploadSim('lab_report')}
                className="px-3.5 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition min-h-[42px]"
              >
                <FileText className="w-3.5 h-3.5 text-slate-600" />
                <span>Sample Lab PDF</span>
              </button>
            </div>
          </div>

          {/* Uploaded Documents List with Compression Metrics */}
          <div className="mt-5 space-y-2">
            <span className="text-xs font-bold text-slate-800 block">
              Attached Clinical Documents ({documents.length}):
            </span>
            {documents.map((doc) => (
              <div key={doc.id} className="p-3 bg-white border border-slate-200 rounded-xl flex flex-wrap items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 text-slate-700 rounded-lg">
                    {doc.type === 'genetic_panel' ? <Dna className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      {doc.name}
                      <span className="px-1.5 py-0.2 bg-slate-100 text-slate-700 text-[10px] rounded font-semibold">
                        {doc.compressionRatio}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-1.5 sm:gap-2 mt-0.5">
                      <span>Raw: {formatBytes(doc.originalSizeBytes)}</span>
                      <span>→</span>
                      <span className="font-semibold text-slate-800">
                        Compressed: {formatBytes(doc.compressedSizeBytes)}
                      </span>
                      <span>•</span>
                      <span className="capitalize">{doc.status.replace('_', ' ')}</span>
                    </div>
                  </div>
                </div>

                {doc.extractedMarkers && (
                  <div className="flex flex-wrap gap-1">
                    {doc.extractedMarkers.map((m, i) => (
                      <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-mono font-semibold border border-slate-200">
                        {m}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(2)}
              className="w-full sm:w-auto px-4 py-2.5 text-slate-600 hover:text-slate-800 text-sm font-medium flex items-center justify-center gap-1.5 min-h-[44px]"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Triage
            </button>
            <button
              onClick={() => setCurrentStep(4)}
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 shadow-xs transition min-h-[44px]"
            >
              <span>Continue to Calendar &amp; HMO</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: CALENDAR SLOT SELECTION & HMO / PAYMENT VALIDATION */}
      {currentStep === 4 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 sm:pb-4 mb-4 border-b border-slate-100 gap-2">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                1.4 LAUTECH Clinical Slot Selection &amp; HMO Validation
              </h3>
              <p className="text-xs text-slate-500">
                Choose an available slot with {triageResult.matchedSpecialist.name} and verify HMO coverage or private checkout.
              </p>
            </div>
            <span className="self-start sm:self-auto px-2.5 py-1 text-xs bg-slate-100 text-slate-800 rounded-full font-semibold border border-slate-200 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" /> LAUTECH Ogbomoso / Osogbo
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Slot Picker */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-2 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-600" /> Available Consultation Date
              </label>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {['Tomorrow', 'In 2 Days'].map((date) => (
                  <button
                    key={date}
                    type="button"
                    onClick={() => setSelectedDate(date)}
                    className={`p-3 rounded-xl border text-left transition min-h-[44px] ${
                      selectedDate === date
                        ? 'border-slate-900 bg-slate-100 text-slate-950 font-bold'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="text-xs font-semibold">{date}</div>
                    <div className="text-[11px] text-slate-500">Telehealth Video Session</div>
                  </button>
                ))}
              </div>

              <label className="block text-xs font-semibold text-slate-800 mb-2 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-600" /> Time Slot (West Africa Time - WAT)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {triageResult.matchedSpecialist.availableSlots.map((slot, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedTime(slot.time)}
                    className={`p-2.5 rounded-lg border text-xs text-center transition min-h-[42px] ${
                      selectedTime === slot.time
                        ? 'border-slate-900 bg-slate-900 text-white font-semibold shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment / HMO Verification Module */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-slate-600" /> Payment or HMO Coverage
                </span>
                <div className="inline-flex rounded-lg bg-slate-200 p-0.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setPaymentType('HMO')}
                    className={`px-3 py-1 rounded-md transition ${
                      paymentType === 'HMO' ? 'bg-white font-bold text-slate-950 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    HMO Insurance
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentType('PAYMENT')}
                    className={`px-3 py-1 rounded-md transition ${
                      paymentType === 'PAYMENT' ? 'bg-white font-bold text-slate-950 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Direct Pay
                  </button>
                </div>
              </div>

              {paymentType === 'HMO' ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      HMO Provider Network
                    </label>
                    <select
                      value={selectedHmo}
                      onChange={(e) => setSelectedHmo(e.target.value)}
                      className="w-full px-3 py-2 text-base sm:text-xs border border-slate-300 rounded-lg bg-white"
                    >
                      {HMO_LIST.map((hmo) => (
                        <option key={hmo} value={hmo}>{hmo}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      HMO Policy / Enrollee Number
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={hmoNumberInput}
                        onChange={(e) => setHmoNumberInput(e.target.value)}
                        className="w-full px-3 py-2 text-base sm:text-xs border border-slate-300 rounded-lg bg-white font-mono"
                        placeholder="e.g. HYG-77492-LAUT"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyHmo}
                        disabled={hmoVerifying}
                        className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shrink-0 min-h-[40px]"
                      >
                        {hmoVerifying ? 'Verifying...' : 'Verify HMO'}
                      </button>
                    </div>
                  </div>

                  {hmoVerified && (
                    <div className="p-3 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block">HMO Pre-Authorization Approved (100% Covered)</span>
                        <span className="text-[11px] text-slate-600 block">
                          Policy valid for Consultant Tele-Cardiology &amp; Geneva Pharmacogenomic Decision Support at LAUTECH Teaching Hospital.
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-white border border-slate-200 rounded-xl">
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Consultation Fee</span>
                      <span className="font-semibold text-slate-800">₦15,000.00</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Geneva Pharmacogenomic CDS Module</span>
                      <span className="font-semibold text-slate-700">₦0.00 (Included in Consultation)</span>
                    </div>
                    <div className="flex justify-between py-1 text-sm font-bold text-slate-900 pt-2">
                      <span>Total Due</span>
                      <span>₦15,000.00</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Supports Paystack, Flutterwave, Card, Bank Transfer, and USSD (*737#, *894#, etc.).
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(3)}
              className="w-full sm:w-auto px-4 py-2.5 text-slate-600 hover:text-slate-800 text-sm font-medium flex items-center justify-center gap-1.5 min-h-[44px]"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Uploads
            </button>
            <button
              onClick={handleFinalBooking}
              className="w-full sm:w-auto px-6 py-3 sm:py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm transition min-h-[44px]"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm Booking &amp; Generate Invites</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: APPOINTMENT CONFIRMATION & AUTOMATED REMINDERS */}
      {currentStep === 5 && confirmedBooking && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm animate-fadeIn">
          <div className="text-center max-w-lg mx-auto mb-6">
            <div className="w-14 h-14 bg-slate-100 text-slate-900 rounded-full flex items-center justify-center mx-auto mb-3 border border-slate-200">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              1.5 Appointment Confirmed &amp; Calendar Dispatched!
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Both patient and attending doctor at LAUTECH Teaching Hospital have received secure calendar invites and encrypted video session credentials.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Appointment Details Card */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5 text-xs">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-medium">Appointment Reference</span>
                <span className="font-mono font-bold text-slate-900">{confirmedBooking.id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Patient</span>
                <span className="font-semibold text-slate-800">{confirmedBooking.patient.fullName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Attending Clinician</span>
                <span className="font-semibold text-slate-800">{confirmedBooking.specialist.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Clinical Department</span>
                <span className="font-semibold text-slate-800">{confirmedBooking.specialist.department}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Scheduled Time</span>
                <span className="font-semibold text-slate-900 font-mono">
                  {confirmedBooking.selectedDate} at {confirmedBooking.selectedTime} (WAT)
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                <span className="text-slate-500 font-medium">Payment Authorization</span>
                <span className="font-bold text-slate-900">
                  {confirmedBooking.paymentMode === 'HMO_VERIFICATION' ? 'HMO Pre-Approved (100%)' : 'Payment Confirmed'}
                </span>
              </div>
            </div>

            {/* Low-Bandwidth Video Link & Dispatched Reminders */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs">
              <div>
                <span className="font-bold text-slate-900 block mb-1">
                  Secure Low-Bandwidth WebRTC Room Link:
                </span>
                <div className="p-2.5 bg-white rounded-lg border border-slate-200 font-mono text-[11px] text-slate-800 break-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <span className="truncate max-w-full">{confirmedBooking.teleconsultLink}</span>
                  <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
                    <button
                      onClick={handleCopyLink}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-[10px] font-sans font-semibold flex items-center gap-1 transition min-h-[30px]"
                    >
                      {copiedLink ? <Check className="w-3 h-3 text-slate-900" /> : <Copy className="w-3 h-3" />}
                      {copiedLink ? 'Copied!' : 'Copy Link'}
                    </button>
                    <span className="px-1.5 py-1 bg-slate-100 text-slate-700 rounded text-[10px] font-sans font-semibold">
                      TLS 1.3
                    </span>
                  </div>
                </div>

                <div className="mt-2 flex items-center gap-2">
                  <button
                    onClick={handleDownloadIcs}
                    className="w-full py-2 px-3 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs transition min-h-[38px]"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-700" />
                    <span>Download Calendar Event (.ics)</span>
                  </button>
                </div>
              </div>

              {/* Automated Reminder Simulation */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-bold text-slate-900 block">
                  Automated Multi-Channel Dispatch:
                </span>
                <div className="p-2 bg-white rounded-lg border border-slate-200 flex items-center gap-2 text-[11px] text-slate-700">
                  <Phone className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                  <span>SMS alert sent to <strong>{confirmedBooking.patient.phone}</strong></span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-slate-200 flex items-center gap-2 text-[11px] text-slate-700">
                  <Mail className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                  <span>Calendar .ICS invite sent to <strong>{confirmedBooking.patient.email}</strong> &amp; hospital doctor console</span>
                </div>
              </div>
            </div>
          </div>

          {/* Compliance & Emergency Safety Strip */}
          <div className="mb-5 p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-800 font-semibold">
              <ShieldCheck className="w-4 h-4 text-slate-600 shrink-0" />
              <span>NDPR &amp; Genomic Consent Cryptographically Bound &amp; Logged (AES-256)</span>
            </div>
            <div className="flex items-center gap-2 text-red-800 text-[11px] font-medium">
              <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0" />
              <span>In acute emergency, proceed to nearest LAUTECH Emergency Dept (0800-LAUTECH)</span>
            </div>
          </div>

          {/* Transition CTA to Consultation Room - Hospital Style */}
          <div className="p-4 sm:p-6 bg-slate-900 text-white rounded-xl text-center shadow-md">
            <h4 className="text-base sm:text-lg font-bold tracking-tight text-white mb-2">
              Appointment Confirmed — Ready to Join Your Consultant?
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto mb-4 sm:mb-5 leading-relaxed">
              Your appointment is logged with the LAUTECH virtual outpatient clinic. You can now enter the consultation room to meet with your consultant physician, review clinical history, and receive your verified prescription.
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={onOpenConsultation}
                className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-lg text-sm flex items-center justify-center gap-2 shadow-md transition-colors min-h-[44px]"
              >
                <Stethoscope className="w-4 h-4 text-slate-900" />
                <span>Proceed to Doctor Consultation Room</span>
                <ArrowRight className="w-4 h-4 text-slate-900" />
              </button>
              <button
                onClick={handleResetToNewBooking}
                className="w-full sm:w-auto px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg text-sm flex items-center justify-center gap-2 border border-slate-700 transition-colors min-h-[44px]"
              >
                <span>+ Book Another Patient Appointment</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
