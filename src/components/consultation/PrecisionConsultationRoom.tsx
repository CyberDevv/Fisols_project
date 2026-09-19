import React, { useState, useEffect, useRef } from 'react';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  PhoneOff, 
  AlertTriangle, 
  CheckCircle2, 
  Dna, 
  ShieldAlert, 
  ShieldCheck, 
  FileText, 
  QrCode, 
  Send, 
  Sparkles, 
  Activity, 
  Wifi, 
  RefreshCw, 
  Clock, 
  MessageSquare, 
  Award, 
  Pill, 
  Building2, 
  FileCheck2, 
  ChevronDown, 
  Stethoscope, 
  Camera, 
  Share2,
  Lock,
  Download,
  Copy,
  Save,
  Users,
  Trash2,
  Plus,
  X,
  Database
} from 'lucide-react';
import { 
  AppointmentBooking, 
  NetworkQuality, 
  PrescriptionItem, 
  DigitalPrescription, 
  PostConsultFollowUp,
  PharmacogenomicRule,
  PatientVitals,
  NemlDrug
} from '../../types';
import { 
  SPECIALISTS, 
  DEMO_PATIENT, 
  GENEVA_PHARMACOGENOMIC_RULES, 
  PARTNER_PHARMACIES 
} from '../../data/clinicalData';
import { 
  getBitrateProfile, 
  generateSha256 
} from '../../utils/cryptoAndCompression';
import { useClinicalState } from '../../context/ClinicalStateContext';
import { NemlBrowserModal } from '../neml/NemlBrowserModal';
import { NemlApiService } from '../../services/nemlApi';

interface PrecisionConsultationRoomProps {
  networkQuality: NetworkQuality;
  setNetworkQuality: (net: NetworkQuality) => void;
  activeBooking?: AppointmentBooking | null;
  onOpenBooking: () => void;
  onOpenDatabaseModal?: () => void;
}

export const PrecisionConsultationRoom: React.FC<PrecisionConsultationRoomProps> = ({
  networkQuality,
  setNetworkQuality,
  activeBooking,
  onOpenBooking,
  onOpenDatabaseModal
}) => {
  // Global clinical state context
  const {
    appointments,
    activeAppointmentId,
    setActiveAppointmentId,
    updateConsultationVitals,
    updateConsultationNotes,
    addConsultationPrescriptionItem,
    removeConsultationPrescriptionItem,
    setConsultationGeneratedPrescription,
    addConsultationChatMessage,
    updateConsultationFollowUp,
    updatePatientConditionsAndAllergies,
  } = useClinicalState();

  // Current active appointment from state, prop, or fallback
  const currentBooking: AppointmentBooking = 
    appointments.find(a => a.id === activeAppointmentId) || 
    activeBooking || 
    appointments[0] || {
      id: 'KBF-APT-88410',
      patient: DEMO_PATIENT,
      specialist: SPECIALISTS[0],
      selectedDate: 'Today',
      selectedTime: '09:00 AM',
      triage: {
        severityLevel: 'Severe',
        recommendedDepartment: 'Cardiology',
        matchedSpecialist: SPECIALISTS[0],
        clinicalPriority: 'Expedited (within 12h)',
        triageReasoning: 'Cardiology consultation baseline.',
        flaggedRiskFactors: []
      },
      documents: [],
      paymentMode: 'DIRECT_PAYMENT',
      paymentReference: 'TXN-LAUT-000',
      teleconsultLink: 'https://kbf-telehealth.ng',
      status: 'SCHEDULED',
      createdAt: new Date().toISOString()
    };

  const patient = currentBooking.patient;
  const specialist = currentBooking.specialist;
  const consultState = currentBooking.consultationState;

  // 2.1 WebRTC Call State
  const [callActive, setCallActive] = useState<boolean>(true);
  const [audioMuted, setAudioMuted] = useState<boolean>(false);
  const [videoMuted, setVideoMuted] = useState<boolean>(false);
  const [callSeconds, setCallSeconds] = useState<number>(142);
  const [useRealCamera, setUseRealCamera] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // In-session consultation chat
  const chatMessages = consultState?.chatMessages || [
    { id: 'msg-1', sender: specialist.name, text: `Welcome ${patient.fullName}. This is your encrypted telehealth consult line.`, time: '09:00' }
  ];
  const [chatInput, setChatInput] = useState<string>('');

  // 2.3 Pharmacogenomic Decision Support State
  const [candidateDrug, setCandidateDrug] = useState<string>(
    patient.fullName.includes('Amina') ? 'Codeine' : patient.fullName.includes('Chukwuemeka') ? 'Fluorouracil' : 'Clopidogrel'
  );
  const [evaluatedRule, setEvaluatedRule] = useState<PharmacogenomicRule | null>(null);
  const [evaluatingCds, setEvaluatingCds] = useState<boolean>(false);

  // Vitals State & Draft Editing
  const currentVitals: PatientVitals = consultState?.vitals || {
    bp: '138/88 mmHg',
    heartRate: 74,
    spo2: 98,
    temperature: '36.8°C',
    weight: '82 kg',
    bmi: '26.4 kg/m²'
  };
  const [isEditingVitals, setIsEditingVitals] = useState<boolean>(false);
  const [vitalsDraft, setVitalsDraft] = useState<PatientVitals>(currentVitals);
  const [vitalsSavedToast, setVitalsSavedToast] = useState<string | null>(null);

  useEffect(() => {
    if (consultState?.vitals) {
      setVitalsDraft(consultState.vitals);
    }
  }, [currentBooking.id, consultState?.vitals]);

  const handleSaveVitals = () => {
    updateConsultationVitals(currentBooking.id, vitalsDraft);
    setIsEditingVitals(false);
    setVitalsSavedToast('Vitals updated and saved to patient EHR.');
    setTimeout(() => setVitalsSavedToast(null), 3000);
  };

  // Condition and Allergy Clinical Editing State
  const [newConsultCondition, setNewConsultCondition] = useState<string>('');
  const [newConsultAllergy, setNewConsultAllergy] = useState<string>('');

  const handleRemoveConsultCondition = (condToRemove: string) => {
    const updated = (patient.chronicConditions || []).filter(c => c !== condToRemove);
    updatePatientConditionsAndAllergies(currentBooking.id, { chronicConditions: updated });
    setVitalsSavedToast(`Condition "${condToRemove}" removed from clinical record.`);
    setTimeout(() => setVitalsSavedToast(null), 3000);
  };

  const handleAddConsultCondition = () => {
    const trimmed = newConsultCondition.trim();
    if (!trimmed) return;
    const current = patient.chronicConditions || [];
    if (current.some(c => c.toLowerCase() === trimmed.toLowerCase())) {
      setNewConsultCondition('');
      return;
    }
    updatePatientConditionsAndAllergies(currentBooking.id, { chronicConditions: [...current, trimmed] });
    setNewConsultCondition('');
    setVitalsSavedToast(`Condition "${trimmed}" added to patient record.`);
    setTimeout(() => setVitalsSavedToast(null), 3000);
  };

  const handleRemoveConsultAllergy = (allergyToRemove: string) => {
    const updated = (patient.drugAllergies || []).filter(a => a !== allergyToRemove);
    updatePatientConditionsAndAllergies(currentBooking.id, { drugAllergies: updated });
    setVitalsSavedToast(`Allergy "${allergyToRemove}" removed from clinical record.`);
    setTimeout(() => setVitalsSavedToast(null), 3000);
  };

  const handleAddConsultAllergy = () => {
    const trimmed = newConsultAllergy.trim();
    if (!trimmed) return;
    const current = patient.drugAllergies || [];
    if (current.some(a => a.toLowerCase() === trimmed.toLowerCase())) {
      setNewConsultAllergy('');
      return;
    }
    updatePatientConditionsAndAllergies(currentBooking.id, { drugAllergies: [...current, trimmed] });
    setNewConsultAllergy('');
    setVitalsSavedToast(`Drug allergy "${trimmed}" documented in patient record.`);
    setTimeout(() => setVitalsSavedToast(null), 3000);
  };

  // 2.4 Digital Precision Prescription State
  const prescriptionItems = consultState?.prescriptionItems || [];
  const generatedPrescription = consultState?.generatedPrescription || null;
  const [selectedPharmacy, setSelectedPharmacy] = useState(PARTNER_PHARMACIES[0]);
  const [isSigning, setIsSigning] = useState<boolean>(false);
  const [qrCopiedToast, setQrCopiedToast] = useState<string | null>(null);

  // 2.5 Post-Consultation Follow-up Loop State
  const followUp: PostConsultFollowUp = consultState?.followUp || {
    id: `fup-${currentBooking.id}`,
    appointmentId: currentBooking.id,
    patientName: patient.fullName,
    checkInDueHours: 48,
    status: 'PENDING_SCHEDULED',
    symptomScore: 8,
    adverseReactionsReported: [],
    patientNotes: '',
    timestamp: new Date().toISOString(),
    auditTrailHash: `SHA256-${currentBooking.id}-EHR`
  };
  const [showFollowUpModal, setShowFollowUpModal] = useState<boolean>(false);

  // Call timer effect
  useEffect(() => {
    let timer: any;
    if (callActive) {
      timer = setInterval(() => setCallSeconds(prev => prev + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [callActive]);

  // Real camera toggle effect
  useEffect(() => {
    if (useRealCamera && videoRef.current) {
      navigator.mediaDevices?.getUserMedia({ video: true, audio: false })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(() => {
          setUseRealCamera(false);
        });
    } else if (!useRealCamera && videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  }, [useRealCamera]);

  // Trigger Pharmacogenomic Parsing when candidate drug changes
  useEffect(() => {
    setEvaluatingCds(true);
    const timeout = setTimeout(() => {
      // Find rule for drug
      const rule = GENEVA_PHARMACOGENOMIC_RULES.find(
        r => r.drugName.toLowerCase() === candidateDrug.toLowerCase()
      );
      setEvaluatedRule(rule || null);
      setEvaluatingCds(false);
    }, 250);
    return () => clearTimeout(timeout);
  }, [candidateDrug]);

  const bitrate = getBitrateProfile(networkQuality);

  // Format seconds into MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    addConsultationChatMessage(currentBooking.id, {
      sender: specialist.name,
      text: chatInput.trim()
    });
    setChatInput('');
  };

  const [isNemlBrowserOpen, setIsNemlBrowserOpen] = useState<boolean>(false);

  // Add Genetically Tailored Alternative Drug to Prescription
  const handleApplyAlternative = (altName: string, notes: string) => {
    const newItem: PrescriptionItem = {
      id: `rx-${Date.now()}`,
      medicationName: altName,
      dosage: altName.includes('Ticagrelor') ? '90mg' : altName.includes('Naproxen') ? '500mg' : '10mg',
      frequency: altName.includes('Ticagrelor') || altName.includes('Naproxen') ? 'Twice Daily (BID)' : 'Once Daily',
      duration: '90 Days',
      genomicStatus: 'FLAGGED_ADR_PREVENTED',
      pharmacogenomicNote: notes
    };
    addConsultationPrescriptionItem(currentBooking.id, newItem);
  };

  // Add drug from National Essential Medicines List (NEML 8th Edition)
  const handlePrescribeNemlDrug = (drug: NemlDrug) => {
    const defaultDosage = drug.dosageForms[0] || '1 tablet';
    const isTwiceDaily = drug.genericName.toLowerCase().includes('ticagrelor') || 
                         drug.genericName.toLowerCase().includes('co-amoxiclav') || 
                         drug.genericName.toLowerCase().includes('naproxen') || 
                         drug.genericName.toLowerCase().includes('artemether');
    const isTds = drug.genericName.toLowerCase().includes('paracetamol');
    const frequency = isTwiceDaily ? 'Twice Daily (BID)' : isTds ? 'Three Times Daily (TDS)' : 'Once Daily (OD)';

    const validation = NemlApiService.validatePrescription(drug, patient, currentBooking.triage.recommendedDepartment);

    const newItem: PrescriptionItem = {
      id: `rx-neml-${Date.now()}`,
      medicationName: drug.genericName,
      dosage: defaultDosage,
      frequency,
      duration: drug.therapeuticCategory.includes('Anti-Infective') ? '5-7 Days' : '30-90 Days',
      genomicStatus: validation.pgxWarning ? 'FLAGGED_ADR_PREVENTED' : 'GENETICALLY_SAFE',
      pharmacogenomicNote: validation.pgxWarning 
        ? `[NEML Code: ${drug.nemlCode} | Level: ${drug.levelOfCare}] PGx Alert (${validation.pgxWarning.gene}): ${validation.pgxWarning.warning}`
        : `[NEML Code: ${drug.nemlCode} | Level: ${drug.levelOfCare} | NAFDAC: ${drug.nafdacRegNumber || drug.nafdacRegStatus}] Certified Nigeria Essential Formulary. ${drug.prescribingGuidelines.slice(0, 110)}...`,
      nemlCode: drug.nemlCode,
      levelOfCare: drug.levelOfCare,
      whoAWaRe: drug.whoAWaReCategory,
      nafdacRegNumber: drug.nafdacRegNumber || drug.nafdacRegStatus
    };

    addConsultationPrescriptionItem(currentBooking.id, newItem);
    setIsNemlBrowserOpen(false);
  };

  const handleRemovePrescriptionItem = (itemId: string) => {
    removeConsultationPrescriptionItem(currentBooking.id, itemId);
  };

  // Cryptographically Sign & Dispatch Digital Prescription
  const handleSignAndDispatch = async () => {
    setIsSigning(true);
    const payload = JSON.stringify({
      patientId: patient.id,
      patientName: patient.fullName,
      doctor: specialist.name,
      license: specialist.qualifications,
      items: prescriptionItems,
      timestamp: new Date().toISOString()
    });

    const hash = await generateSha256(payload);
    setTimeout(() => {
      const digitalRx: DigitalPrescription = {
        id: `RX-LAUTECH-${Math.floor(100000 + Math.random() * 900000)}`,
        appointmentId: currentBooking.id,
        patientId: patient.id,
        patientName: patient.fullName,
        physicianName: specialist.name,
        physicianLicense: 'MDC-NG/SPEC/78419',
        institution: specialist.institution,
        issuedAt: new Date().toLocaleString('en-NG', { timeZone: 'Africa/Lagos' }) + ' WAT',
        items: prescriptionItems,
        partnerPharmacy: {
          id: selectedPharmacy.id,
          name: selectedPharmacy.name,
          branch: selectedPharmacy.branch,
          routingStatus: 'ACCEPTED_DISPENSING',
          estimatedDeliveryHours: selectedPharmacy.estimatedDeliveryHours
        },
        sha256DigitalSignature: hash,
        qrVerificationPayload: `https://kbf-telehealth.ng/rx/verify?id=RX-LAUTECH-${hash.slice(0, 12)}`
      };
      setConsultationGeneratedPrescription(currentBooking.id, digitalRx);
      setIsSigning(false);
    }, 800);
  };

  // State for Live Physician Clinical Notes
  const [physicianClinicalNotes, setPhysicianClinicalNotes] = useState<string>(
    consultState?.clinicalNotes || ''
  );
  const [notesSavedToast, setNotesSavedToast] = useState<string | null>(null);

  useEffect(() => {
    setPhysicianClinicalNotes(consultState?.clinicalNotes || '');
  }, [currentBooking.id, consultState?.clinicalNotes]);

  const handleSaveClinicalNotes = () => {
    updateConsultationNotes(currentBooking.id, physicianClinicalNotes);
    setNotesSavedToast('Clinical consultation notes securely saved & signed to LAUTECH EHR.');
    setTimeout(() => setNotesSavedToast(null), 3500);
  };

  // Handler to download official electronic prescription slip (.txt)
  const handleDownloadPrescription = () => {
    if (!generatedPrescription) return;
    const genomicSummary = patient.geneticProfile && patient.geneticProfile.length > 0
      ? patient.geneticProfile.map(g => `${g.gene} (${g.variant} ${g.phenotype})`).join(' | ')
      : 'Standard Clinical Profile (CPIC Tier 1A)';

    const content = [
      '=========================================================================',
      '         LAUTECH TEACHING HOSPITAL - CLINICAL PRECISION TELEHEALTH',
      '                   ELECTRONIC PRESCRIPTION ORDER SLIP',
      '=========================================================================',
      `Prescription ID:      ${generatedPrescription.id}`,
      `Appointment Ref:      ${generatedPrescription.appointmentId}`,
      `Issue Timestamp:      ${generatedPrescription.issuedAt}`,
      `Attending Physician:  ${generatedPrescription.physicianName} (${generatedPrescription.physicianLicense})`,
      `Clinical Department:  ${currentBooking.triage.recommendedDepartment || 'Internal Medicine'} & Precision Genomic Therapeutics`,
      `Hospital / Center:    ${generatedPrescription.institution}`,
      '-------------------------------------------------------------------------',
      'PATIENT IDENTIFICATION & PHARMACOGENOMIC PROFILE',
      `Full Name:            ${generatedPrescription.patientName}`,
      `Hospital ID:          ${patient.id}`,
      `Genomic Biomarkers:   ${genomicSummary}`,
      '-------------------------------------------------------------------------',
      'PRESCRIBED MEDICATIONS (GENOMICS-VALIDATED REPLACEMENTS):',
      ...generatedPrescription.items.map((it, idx) => 
        `${idx + 1}. ${it.medicationName} ${it.dosage} (${it.frequency}) - Duration: ${it.duration}\n   Clinical Rationale: ${it.pharmacogenomicNote}`
      ),
      '-------------------------------------------------------------------------',
      'DISPATCH & PHARMACY FULFILLMENT:',
      `Designated Pharmacy:  ${generatedPrescription.partnerPharmacy.name} (${generatedPrescription.partnerPharmacy.branch})`,
      `Fulfillment Status:   ${generatedPrescription.partnerPharmacy.routingStatus}`,
      `Estimated Delivery:   Within ${generatedPrescription.partnerPharmacy.estimatedDeliveryHours} hours to patient`,
      '-------------------------------------------------------------------------',
      'CRYPTOGRAPHIC INTEGRITY & NDPR COMPLIANCE SEAL:',
      `SHA-256 Signature:    ${generatedPrescription.sha256DigitalSignature}`,
      `Verification URL:     ${generatedPrescription.qrVerificationPayload}`,
      '=========================================================================',
      'Standard: NDPR 2019 / NDPA 2023 Compliant. Validated under UniGeneva CDS.'
    ].join('\r\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${generatedPrescription.id}_Official_LAUTECH_Prescription.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // State for interactive 48h Follow-up simulation
  const [followUpRecoveryScore, setFollowUpRecoveryScore] = useState<number>(followUp.symptomScore || 9);
  const [followUpFeedbackText, setFollowUpFeedbackText] = useState<string>(
    followUp.patientNotes || "Symptoms noticeably improved after adjusting treatment. No muscle aches or fatigue noted."
  );
  const [followUpCheckboxes, setFollowUpCheckboxes] = useState({
    chestPainResolved: true,
    noMuscleMyopathy: true,
    noAdverseBleeding: true,
    adherenceConfirmed: true
  });
  const [followUpSubmittedToast, setFollowUpSubmittedToast] = useState<string | null>(null);

  const handleSubmitFollowUpCheckIn = () => {
    const isOptimal = followUpCheckboxes.chestPainResolved && followUpCheckboxes.noMuscleMyopathy && followUpCheckboxes.noAdverseBleeding;
    updateConsultationFollowUp(currentBooking.id, {
      status: isOptimal ? 'COMPLETED_OPTIMAL' : 'ADVERSE_EVENT_FLAGGED',
      symptomScore: followUpRecoveryScore,
      adverseReactionsReported: [
        followUpCheckboxes.chestPainResolved ? 'Primary symptoms resolved' : 'Persistent discomfort reported',
        followUpCheckboxes.noMuscleMyopathy ? 'Zero muscle myopathy' : 'Muscle soreness / myopathy reported',
        followUpCheckboxes.noAdverseBleeding ? 'No adverse bleeding' : 'Bleeding tendency noted'
      ],
      patientNotes: followUpFeedbackText,
      auditTrailHash: `SHA256-48H-FOLLOWUP-ACK-${Date.now().toString(16).toUpperCase()}-LAUTECH-VALID`
    });
    setFollowUpSubmittedToast('48-Hour Recovery check-in recorded & hashed into LAUTECH EHR Audit Trail!');
    setTimeout(() => setFollowUpSubmittedToast(null), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
      {/* Top Clinical Banner - Modern Telemedicine Workstation */}
      <div className="bg-indigo-950 text-white rounded-2xl p-4 sm:p-6 mb-5 sm:mb-6 shadow-xl border border-indigo-900 relative overflow-hidden">
        {/* Ambient subtle glow */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-72 h-72 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-8 w-72 h-72 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-indigo-200 text-[11px] sm:text-xs font-semibold border border-white/15 backdrop-blur-xs">
                <Building2 className="w-3.5 h-3.5 text-indigo-300 shrink-0" />
                KBF Precision Genomedix Outpatients
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] sm:text-xs font-semibold border border-emerald-400/30 backdrop-blur-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Active Telehealth Encounter
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-200 text-[11px] sm:text-xs font-medium border border-cyan-400/30 backdrop-blur-xs">
                Geneva CDS • CPIC Level 1A
              </span>
            </div>

            <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-white font-sans">
              Clinical Tele-Consultation &amp; Pharmacogenomics Workstation
            </h2>
            <p className="text-indigo-200/90 text-xs sm:text-sm mt-1 max-w-3xl leading-relaxed">
              Conduct high-fidelity video consult with automatic bandwidth fallback, evaluate patient genomic biomarkers against University of Geneva CPIC guidelines, issue digital prescriptions, and record clinical EHR notes.
            </p>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto shrink-0">
            <button
              onClick={onOpenBooking}
              className="w-full sm:w-auto px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl border border-white/20 shadow-xs transition-all flex items-center justify-center gap-1.5 min-h-[42px] backdrop-blur-xs"
            >
              <span>← Book Appointment</span>
            </button>
            <button
              onClick={() => setShowFollowUpModal(true)}
              className="w-full sm:w-auto px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 min-h-[42px] active:scale-98"
            >
              <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
              <span>Patient 48h Recovery Check-In</span>
            </button>
          </div>
        </div>

        {/* Patient Identity Strip (Modern Epic / Cerner / NHS EHR Banner) */}
        <div className="relative z-10 mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-xs bg-white/5 backdrop-blur-xs p-3 sm:p-3.5 rounded-xl border border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
              {patient.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'PT'}
            </div>
            <div>
              <span className="text-indigo-300 block text-[10px] font-medium uppercase tracking-wider">Patient Name</span>
              <strong className="text-white font-bold text-xs">{patient.fullName}</strong>
            </div>
          </div>
          <div>
            <span className="text-indigo-300 block text-[10px] font-medium uppercase tracking-wider">Hospital MRN</span>
            <strong className="text-indigo-100 font-mono text-xs">{patient.id}</strong>
          </div>
          <div>
            <span className="text-indigo-300 block text-[10px] font-medium uppercase tracking-wider">Attending Physician</span>
            <strong className="text-white font-semibold text-xs">{specialist.name}</strong>
          </div>
          <div>
            <span className="text-indigo-300 block text-[10px] font-medium uppercase tracking-wider">Clinical Specialty</span>
            <strong className="text-indigo-100 text-xs">{specialist.department}</strong>
          </div>
        </div>
      </div>

      {/* 2.0 MULTI-PATIENT CLINICAL APPOINTMENTS ROSTER (STATEFUL SWITCHER) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 mb-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 flex-wrap">
            <Users className="w-4 h-4 text-indigo-600 shrink-0" />
            <span className="text-xs font-bold text-slate-900">Virtual Clinic Outpatient Queue</span>
            <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-mono font-bold border border-indigo-200">
              {appointments.length} Consultations
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              JSON DB Synced
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 text-[11px] hidden sm:inline">Active Consultation:</span>
            <span className="font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
              {patient.fullName} ({currentBooking.id})
            </span>
            {onOpenDatabaseModal && (
              <button
                type="button"
                onClick={onOpenDatabaseModal}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold rounded-lg border border-slate-200 flex items-center gap-1 transition"
                title="Inspect in Clinical JSON Database Console"
              >
                <Database className="w-3 h-3 text-indigo-600" />
                <span className="hidden sm:inline">View JSON</span>
              </button>
            )}
          </div>
        </div>

        {/* Scrollable cards of appointments */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
          {appointments.map((appt) => {
            const isSelected = appt.id === currentBooking.id;
            const initials = appt.patient.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'PT';
            return (
              <button
                key={appt.id}
                type="button"
                onClick={() => setActiveAppointmentId(appt.id)}
                className={`text-left p-3 rounded-xl border transition-all flex flex-col justify-between gap-2 ${
                  isSelected
                    ? 'bg-indigo-50/60 border-indigo-600 shadow-sm'
                    : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                      isSelected ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-xs text-slate-900 truncate">{appt.patient.fullName}</div>
                      <div className="text-[10px] text-slate-500 truncate">{appt.triage.recommendedDepartment}</div>
                    </div>
                  </div>
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold uppercase shrink-0 border ${
                    isSelected 
                      ? 'bg-indigo-100 text-indigo-800 border-indigo-200' 
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}>
                    {appt.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100">
                  <span className="font-mono font-medium text-slate-700">{appt.selectedTime}</span>
                  <span className="truncate max-w-[120px]">{appt.specialist.name.split(' ')[0]} {appt.specialist.name.split(' ').slice(-1)[0]}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Clinical Grid: Left (Video & Chat) / Right (EHR & Geneva CDS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: 2.1 LOW-BANDWIDTH VIDEO TELE-CONSULTATION ENGINE (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-md text-white">
            {/* Clinical Telehealth Consultation Status Bar */}
            <div className="px-4 py-2.5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                <span className="font-mono text-slate-200 font-semibold">{formatTime(callSeconds)}</span>
                <span className="text-slate-500">|</span>
                <span className="text-slate-200 font-medium truncate">Consultation In Progress</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px]">
                <span className="px-2 py-0.5 bg-slate-800 text-slate-300 border border-slate-700 rounded text-[10px] font-semibold">
                  Encrypted HD Stream
                </span>
              </div>
            </div>

            {/* Video Canvas Container */}
            <div className="relative aspect-4/3 bg-slate-950 flex items-center justify-center overflow-hidden">
              {/* Patient Video Feed (Primary) */}
              {!videoMuted ? (
                <div className="w-full h-full relative flex items-center justify-center bg-slate-900">
                  {/* Simulated Clinical Avatar or Real Camera */}
                  {useRealCamera ? (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-6">
                      <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-slate-600 text-slate-200 flex items-center justify-center text-2xl font-bold mx-auto mb-3 shadow-inner">
                        AJ
                      </div>
                      <h4 className="font-bold text-white text-base">{patient.fullName}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Patient Feed • {patient.stateOfResidence}
                      </p>
                      <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/90 text-[11px] text-slate-300 border border-slate-700">
                        <Activity className="w-3.5 h-3.5 text-slate-400" />
                        <span>Connected • Secure Clinical Audio &amp; Video</span>
                      </div>
                    </div>
                  )}

                  {/* Network Alert Pill if 2G/Low */}
                  {networkQuality === '2G_LOW' && (
                    <div className="absolute top-3 left-3 right-3 bg-amber-500/90 text-slate-950 text-xs px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 shadow-md">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>Audio-priority mode active: Video minimized for clear voice communication</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center p-6 text-slate-400">
                  <VideoOff className="w-12 h-12 mx-auto mb-2 text-slate-600" />
                  <p className="text-xs">Patient Video Paused (Audio Only Mode)</p>
                </div>
              )}

              {/* Physician Picture-in-Picture (Bottom-Right) */}
              <div className="absolute bottom-3 right-3 w-28 h-20 bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-lg flex flex-col items-center justify-center text-center p-1">
                <div className="w-7 h-7 rounded-full bg-slate-700 text-white flex items-center justify-center text-xs font-bold mb-0.5">
                  PA
                </div>
                <span className="text-[10px] font-semibold text-white truncate max-w-full px-1">
                  Prof. Akintunde
                </span>
                <span className="text-[9px] text-slate-400 font-mono">LAUTECH</span>
              </div>
            </div>

            {/* In-Call Action Toolbar */}
            <div className="p-2.5 sm:p-3 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={() => setAudioMuted(!audioMuted)}
                  className={`p-2.5 rounded-xl transition min-h-[44px] min-w-[44px] flex items-center justify-center ${
                    audioMuted ? 'bg-red-700 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                  title={audioMuted ? 'Unmute Mic' : 'Mute Mic'}
                >
                  {audioMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setVideoMuted(!videoMuted)}
                  className={`p-2.5 rounded-xl transition min-h-[44px] min-w-[44px] flex items-center justify-center ${
                    videoMuted ? 'bg-red-700 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                  title={videoMuted ? 'Enable Video' : 'Disable Video'}
                >
                  {videoMuted ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setUseRealCamera(!useRealCamera)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition min-h-[44px] ${
                    useRealCamera ? 'bg-slate-700 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                  title="Toggle device webcam"
                >
                  <Camera className="w-4 h-4" />
                  <span className="hidden sm:inline">{useRealCamera ? 'Webcam On' : 'Test Webcam'}</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCallActive(!callActive)}
                  className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 min-h-[44px] ${
                    callActive
                      ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                  }`}
                >
                  <PhoneOff className="w-3.5 h-3.5" />
                  <span>{callActive ? 'End Call' : 'Reconnect'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Consultation Chat Box (Low-Bandwidth Fallback) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                Live Consultation Clinical Notes & Chat
              </span>
              <span className="text-[10px] text-slate-500 font-mono">TLS 1.3 Encrypted</span>
            </div>

            <div className="h-36 overflow-y-auto space-y-2 pr-1 text-xs">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`p-2 rounded-xl ${
                  msg.sender.includes('Prof') ? 'bg-slate-100 text-slate-900 ml-4 border border-slate-200' : 'bg-slate-50 text-slate-800 mr-4 border border-slate-200'
                }`}>
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 mb-0.5">
                    <span>{msg.sender}</span>
                    <span>{msg.time}</span>
                  </div>
                  <p className="leading-snug">{msg.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendChat} className="mt-3 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type a clinical instruction or message..."
                className="w-full px-3 py-2 text-base sm:text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400 min-h-[42px]"
              />
              <button
                type="submit"
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shrink-0 min-h-[42px] min-w-[42px] flex items-center justify-center transition"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Patient Vitals & Clinical History Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
            <div className="text-xs font-bold text-slate-800 mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-slate-700" />
                Patient Telemetry &amp; Baseline Records
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingVitals(!isEditingVitals)}
                  className="text-[11px] text-slate-700 hover:text-slate-950 font-semibold underline"
                >
                  {isEditingVitals ? 'Cancel' : 'Edit Telemetry'}
                </button>
                <span className="text-[10px] text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full font-medium border border-slate-200">Logged Today</span>
              </div>
            </div>

            {vitalsSavedToast && (
              <div className="mb-2 p-2 bg-slate-100 border border-slate-200 text-slate-800 rounded-lg text-[11px] flex items-center gap-1.5 font-medium animate-fadeIn">
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                <span>{vitalsSavedToast}</span>
              </div>
            )}

            {isEditingVitals ? (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 mb-3 text-xs">
                <span className="text-[11px] font-bold text-slate-700 block">Update Physical Vitals:</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">Blood Pressure</label>
                    <input
                      type="text"
                      value={vitalsDraft.bp}
                      onChange={(e) => setVitalsDraft({ ...vitalsDraft, bp: e.target.value })}
                      className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">Heart Rate (bpm)</label>
                    <input
                      type="number"
                      value={vitalsDraft.heartRate}
                      onChange={(e) => setVitalsDraft({ ...vitalsDraft, heartRate: Number(e.target.value) || 72 })}
                      className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">SpO2 Oxygen (%)</label>
                    <input
                      type="number"
                      value={vitalsDraft.spo2}
                      onChange={(e) => setVitalsDraft({ ...vitalsDraft, spo2: Number(e.target.value) || 98 })}
                      className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">Temperature</label>
                    <input
                      type="text"
                      value={vitalsDraft.temperature}
                      onChange={(e) => setVitalsDraft({ ...vitalsDraft, temperature: e.target.value })}
                      className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">Weight</label>
                    <input
                      type="text"
                      value={vitalsDraft.weight}
                      onChange={(e) => setVitalsDraft({ ...vitalsDraft, weight: e.target.value })}
                      className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">BMI</label>
                    <input
                      type="text"
                      value={vitalsDraft.bmi}
                      onChange={(e) => setVitalsDraft({ ...vitalsDraft, bmi: e.target.value })}
                      className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white font-mono"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={handleSaveVitals}
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shadow-xs active:scale-98"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Vitals to State</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-center text-xs mb-3">
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-slate-500 block text-[10px]">Blood Pressure</span>
                  <span className="font-bold text-slate-900 font-mono">{currentVitals.bp}</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-slate-500 block text-[10px]">Heart Rate</span>
                  <span className="font-bold text-slate-900 font-mono">{currentVitals.heartRate} bpm</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-slate-500 block text-[10px]">SpO2 Oxygen</span>
                  <span className="font-bold text-slate-900 font-mono">{currentVitals.spo2}% Room Air</span>
                </div>
              </div>
            )}

            <div className="text-[11px] space-y-2.5 text-slate-700 pt-2 border-t border-slate-100">
              {/* Chronic Conditions */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-slate-800">
                    Pre-existing Conditions ({(patient.chronicConditions || []).length}):
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 min-h-[26px]">
                  {(!patient.chronicConditions || patient.chronicConditions.length === 0) ? (
                    <span className="text-slate-400 italic text-[11px]">None documented</span>
                  ) : (
                    patient.chronicConditions.map((cond, idx) => (
                      <span 
                        key={idx}
                        className="inline-flex items-center gap-1 pl-2 pr-1 py-0.5 bg-slate-100 text-slate-900 border border-slate-200 rounded text-[11px] font-medium"
                      >
                        <span>{cond}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveConsultCondition(cond)}
                          className="p-0.5 rounded text-slate-500 hover:text-red-700 hover:bg-slate-200 transition-colors"
                          title={`Remove ${cond}`}
                          aria-label={`Remove condition ${cond}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))
                  )}
                </div>
                <div className="mt-1 flex gap-1.5">
                  <input
                    type="text"
                    value={newConsultCondition}
                    onChange={(e) => setNewConsultCondition(e.target.value)}
                    placeholder="Add condition..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddConsultCondition();
                      }
                    }}
                    className="flex-1 px-2 py-1 text-[11px] border border-slate-200 rounded bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-400"
                  />
                  <button
                    type="button"
                    onClick={handleAddConsultCondition}
                    disabled={!newConsultCondition.trim()}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-900 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded text-[10px] font-semibold flex items-center gap-1 transition"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add</span>
                  </button>
                </div>
              </div>

              {/* Drug Allergies */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-slate-800">
                    Known Drug Allergies ({(patient.drugAllergies || []).length}):
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 min-h-[26px]">
                  {(!patient.drugAllergies || patient.drugAllergies.length === 0) ? (
                    <span className="text-slate-600 font-medium text-[11px]">No known drug allergies reported</span>
                  ) : (
                    patient.drugAllergies.map((allergy, idx) => (
                      <span 
                        key={idx}
                        className="inline-flex items-center gap-1 pl-2 pr-1 py-0.5 bg-red-50 text-red-950 border border-red-200 rounded text-[11px] font-medium"
                      >
                        <span>{allergy}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveConsultAllergy(allergy)}
                          className="p-0.5 rounded text-red-600 hover:text-red-900 hover:bg-red-100 transition-colors"
                          title={`Remove allergy ${allergy}`}
                          aria-label={`Remove allergy ${allergy}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))
                  )}
                </div>
                <div className="mt-1 flex gap-1.5">
                  <input
                    type="text"
                    value={newConsultAllergy}
                    onChange={(e) => setNewConsultAllergy(e.target.value)}
                    placeholder="Add drug allergy..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddConsultAllergy();
                      }
                    }}
                    className="flex-1 px-2 py-1 text-[11px] border border-slate-200 rounded bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-400"
                  />
                  <button
                    type="button"
                    onClick={handleAddConsultAllergy}
                    disabled={!newConsultAllergy.trim()}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-900 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded text-[10px] font-semibold flex items-center gap-1 transition"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add</span>
                  </button>
                </div>
              </div>

              {/* HMO / Coverage */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-medium">HMO / Coverage:</span>
                <span className="font-semibold text-slate-800">
                  {patient.hmoProvider || 'Direct Private Pay'} {patient.hmoNumber ? `(${patient.hmoNumber})` : ''}
                </span>
              </div>
            </div>
          </div>

          {/* Live Physician Clinical Notes Editor */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-slate-700" />
                <span className="text-xs font-bold text-slate-800">Physician Live Consultation Notes</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">EHR Note #LAUT-884</span>
            </div>

            {notesSavedToast && (
              <div className="p-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-800 text-[11px] flex items-center gap-1.5 font-medium animate-fadeIn">
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                <span>{notesSavedToast}</span>
              </div>
            )}

            <textarea
              rows={4}
              value={physicianClinicalNotes}
              onChange={(e) => setPhysicianClinicalNotes(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400 font-sans leading-relaxed"
              placeholder="Record physician observations, telemetry readings, and precision rationale..."
            />

            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-slate-400">
                {physicianClinicalNotes.length} characters • AES-256 Encrypted
              </span>
              <button
                onClick={handleSaveClinicalNotes}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shadow-xs active:scale-98"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save to EHR</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: 2.2 EHR GENOMIC DASHBOARD & 2.3 GENEVA CDS ENGINE (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* 2.2 PATIENT GENOMIC PROFILE DASHBOARD */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Dna className="w-4 h-4 text-slate-700" />
                  2.2 Patient Pharmacogenomic Biomarker Profile
                </h3>
                <p className="text-[11px] text-slate-500">
                  Sequenced via 54gene Precision BioLab / University of Geneva Clinical Reference Standard
                </p>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-100 text-slate-800 rounded-full border border-slate-200">
                CYP450 Panel
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {patient.geneticProfile.map((marker, idx) => {
                const isPoor = marker.phenotype.includes('Poor') || marker.phenotype.includes('High');
                return (
                  <div 
                    key={idx} 
                    className={`p-3 rounded-xl border transition ${
                      isPoor 
                        ? 'bg-red-50/70 border-red-200 text-red-950' 
                        : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono font-bold text-xs">{marker.gene}</span>
                      <span className={`px-1.5 py-0.2 rounded text-[10px] font-semibold ${
                        isPoor ? 'bg-red-100 text-red-900' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {marker.variant}
                      </span>
                    </div>
                    <div className="text-xs font-bold mb-1">
                      Phenotype: <span className={isPoor ? 'text-red-700' : 'text-slate-700'}>{marker.phenotype}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-tight">
                      {marker.clinicalImpact}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2.3 UNIVERSITY OF GENEVA PHARMACOGENOMIC DECISION-SUPPORT ENGINE */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-slate-700" />
                    2.3 Pharmacogenomic Decision-Support Parsing Engine
                  </h3>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-800 rounded font-mono border border-slate-200">
                    Geneva Ruleset v4.2
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Select or type a proposed medication to cross-reference with patient alleles and detect Adverse Drug Reactions (ADRs).
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsNemlBrowserOpen(true)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition active:scale-98"
                >
                  NEML Drugs
                </button>
              </div>
            </div>

            {/* Interactive Drug Selector */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Select or Test Proposed Medication for {patient.fullName}:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { name: 'Clopidogrel', label: 'Clopidogrel (Antiplatelet)', flag: 'HIGH RISK' },
                  { name: 'Simvastatin', label: 'Simvastatin (Statin)', flag: 'HIGH RISK' },
                  { name: 'Ticagrelor', label: 'Ticagrelor (Alternative Antiplatelet)', flag: 'SAFE' },
                  { name: 'Rosuvastatin', label: 'Rosuvastatin (Alternative Statin)', flag: 'SAFE' },
                  { name: 'Codeine', label: 'Codeine (Analgesic)', flag: 'POOR ANALGESIA' },
                  { name: 'Warfarin', label: 'Warfarin (Anticoagulant)', flag: 'DOSE ADJUST' }
                ].map((drug) => (
                  <button
                    key={drug.name}
                    type="button"
                    onClick={() => setCandidateDrug(drug.name)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      candidateDrug === drug.name
                        ? 'bg-indigo-600 text-white font-bold shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {drug.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Real-time Geneva CDS Parsing Output */}
            {candidateDrug === 'Ticagrelor' ? (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-slate-800 shrink-0" />
                  <span className="font-bold text-sm text-slate-950">
                    Genomically Safe: Ticagrelor 90mg BID Validated
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Ticagrelor is a direct-acting cyclopentyl-triazolo-pyrimidine P2Y12 inhibitor that does NOT require hepatic CYP2C19 bioactivation. It completely bypasses Mr. Adeleke's <strong>CYP2C19 *2/*2 Poor Metabolizer</strong> limitation, securing prompt and consistent antiplatelet inhibition to protect against stent thrombosis.
                </p>
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => handleApplyAlternative('Ticagrelor', 'Direct P2Y12 inhibitor chosen to bypass CYP2C19 *2/*2 poor metabolizer state.')}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xs"
                  >
                    + Add Ticagrelor to Digital Prescription
                  </button>
                </div>
              </div>
            ) : candidateDrug === 'Rosuvastatin' ? (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-slate-800 shrink-0" />
                  <span className="font-bold text-sm text-slate-950">
                    Genomically Safe: Rosuvastatin 10mg OD Validated
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Rosuvastatin utilizes alternative non-SLCO1B1 hepatic clearance pathways. In patients with the <strong>SLCO1B1 521T&gt;C</strong> variant who cannot safely tolerate Simvastatin, Rosuvastatin at moderate doses (5–10mg daily) provides superior LDL-C lowering with minimal risk of rhabdomyolysis or toxic muscle myopathy.
                </p>
              </div>
            ) : evaluatedRule ? (
              <div className="p-4 bg-red-50/70 border border-red-200 rounded-xl text-xs text-red-950 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-red-600 shrink-0" />
                    <span className="font-bold text-sm text-red-900">
                      🚨 {evaluatedRule.riskSeverity}: {evaluatedRule.warningSummary}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 bg-red-100 text-red-900 rounded font-mono text-[10px] font-bold">
                    Target Gene: {evaluatedRule.targetGene}
                  </span>
                </div>

                {/* Biological Mechanism Card */}
                <div className="p-3 bg-white/90 rounded-lg border border-red-200 text-[11px] text-slate-700 leading-relaxed">
                  <strong>Biological Mechanism:</strong> {evaluatedRule.biologicalMechanism}
                </div>

                {/* University of Geneva Recommendation */}
                <div className="p-3 bg-slate-100/90 rounded-lg border border-slate-200 text-[11px] text-slate-900 leading-relaxed">
                  <strong>University of Geneva Clinical Protocol:</strong> {evaluatedRule.genevaGuidelineRecommendation}
                  <div className="mt-1 text-[10px] text-slate-600 font-mono">
                    Citation: {evaluatedRule.referenceCitation}
                  </div>
                </div>

                {/* Recommended Genetically Tailored Alternatives */}
                <div>
                  <span className="font-bold text-red-950 block mb-1 text-[11px]">
                    Recommended Precision Medicine Substitutions:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {evaluatedRule.saferAlternatives.map((alt, i) => (
                      <button
                        key={i}
                        onClick={() => handleApplyAlternative(alt, `Prescribed instead of ${candidateDrug} per Geneva Pharmacogenomic Guidelines to prevent ADR.`)}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-xs flex items-center gap-1 shadow-xs transition"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-slate-300" />
                        Switch to {alt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* 2.4 DIGITAL PRECISION PRESCRIPTION & PHARMACY ROUTING */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-slate-700" />
                  2.4 Digital Precision Prescription & Pharmacy Dispatch
                </h3>
                <p className="text-[11px] text-slate-500">
                  Cryptographically signed e-prescription with SHA-256 hash and automated routing to accredited pharmacies.
                </p>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-100 text-slate-800 rounded-full border border-slate-200">
                SHA-256 Digital Sign
              </span>
            </div>

            {/* Prescribed Items Table */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 block">
                  Formulated Prescriptions ({prescriptionItems.length}):
                </span>
                <button
                  type="button"
                  onClick={() => setIsNemlBrowserOpen(true)}
                  className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition active:scale-98"
                >
                  NEML Drugs
                </button>
              </div>

              {prescriptionItems.length === 0 ? (
                <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center text-xs text-slate-500">
                  <Pill className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                  <p className="font-semibold text-slate-700">No Prescriptions Formulated Yet</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Select a drug in the CDS engine above or search the National Essential Medicines List (NEML) database.
                  </p>
                </div>
              ) : (
                prescriptionItems.map((item) => (
                  <div key={item.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1.5">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-900 text-sm">{item.medicationName}</span>
                        {item.nemlCode && (
                          <span className="px-1.5 py-0.2 rounded bg-slate-900 text-white font-mono text-[9px] font-bold">
                            {item.nemlCode}
                          </span>
                        )}
                        {item.levelOfCare && (
                          <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 font-mono text-[9px] font-bold border border-slate-200">
                            Care: [{item.levelOfCare}]
                          </span>
                        )}
                        {item.whoAWaRe && item.whoAWaRe !== 'Not Applicable' && (
                          <span className={`px-1.5 py-0.2 rounded font-medium text-[9px] ${
                            item.whoAWaRe === 'Access'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : item.whoAWaRe === 'Watch'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-red-50 text-red-800 border border-red-200'
                          }`}>
                            AWaRe: {item.whoAWaRe}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-slate-200 text-slate-800 rounded text-[10px] font-bold">
                          {item.genomicStatus.replace('_', ' ')}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemovePrescriptionItem(item.id)}
                          className="p-1 text-slate-400 hover:text-red-600 rounded transition"
                          title="Remove prescription"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="text-slate-600 text-[11px] flex flex-wrap items-center gap-x-2">
                      <span>Dose: <strong>{item.dosage}</strong></span> • <span>Freq: <strong>{item.frequency}</strong></span> • <span>Duration: <strong>{item.duration}</strong></span>
                      {item.nafdacRegNumber && (
                        <>
                          <span>•</span>
                          <span className="text-slate-500 font-mono text-[10px]">NAFDAC Reg: {item.nafdacRegNumber}</span>
                        </>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-800 bg-slate-100 p-1.5 rounded border border-slate-200">
                      <strong>Formulary &amp; CDS Rationale:</strong> {item.pharmacogenomicNote}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Pharmacy Routing Selector */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl mb-4">
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-slate-700" /> Route to Accredited Partner Pharmacy:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {PARTNER_PHARMACIES.map((pharm) => (
                  <button
                    key={pharm.id}
                    type="button"
                    onClick={() => setSelectedPharmacy(pharm)}
                    className={`p-2 rounded-lg border text-left transition ${
                      selectedPharmacy.id === pharm.id
                        ? 'border-slate-900 bg-slate-100 text-slate-950 font-bold'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="text-[11px] font-bold truncate">{pharm.name}</div>
                    <div className="text-[10px] text-slate-500 truncate">{pharm.branch}</div>
                    <div className="text-[10px] text-slate-600 font-semibold mt-0.5">
                      Est. {pharm.estimatedDeliveryHours}h Dispatch
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Generated Cryptographic Signature Card */}
            {generatedPrescription ? (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-slate-800" />
                    <span className="font-bold text-sm text-slate-950">
                      Prescription Cryptographically Signed &amp; Dispatched!
                    </span>
                  </div>
                  <span className="font-mono text-[10px] bg-slate-200 text-slate-800 px-2 py-0.5 rounded font-bold">
                    {generatedPrescription.id}
                  </span>
                </div>

                <div className="p-2.5 bg-white rounded-lg border border-slate-200 font-mono text-[10px] break-all text-slate-700">
                  <span className="font-bold text-slate-900 block font-sans mb-0.5">SHA-256 Digital Signature:</span>
                  {generatedPrescription.sha256DigitalSignature}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-slate-700">
                  <span>Dispensing Partner: <strong>{generatedPrescription.partnerPharmacy.name}</strong></span>
                  <span className="font-semibold text-slate-900">Status: En Route to Patient</span>
                </div>

                {qrCopiedToast && (
                  <div className="p-2 bg-slate-100 border border-slate-200 rounded text-slate-800 text-xs font-semibold flex items-center gap-1.5 animate-fadeIn">
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                    <span>{qrCopiedToast}</span>
                  </div>
                )}

                <div className="pt-2 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-end gap-2 border-t border-slate-200">
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(generatedPrescription.qrVerificationPayload);
                      setQrCopiedToast('Prescription verification QR payload copied to clipboard!');
                      setTimeout(() => setQrCopiedToast(null), 3500);
                    }}
                    className="w-full sm:w-auto px-3.5 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition min-h-[42px]"
                  >
                    <Copy className="w-3.5 h-3.5 text-slate-700" />
                    <span>Copy Verification URL</span>
                  </button>
                  <button
                    onClick={handleDownloadPrescription}
                    className="w-full sm:w-auto px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition min-h-[42px] active:scale-98"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Official Prescription Slip (.txt)</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-end">
                <button
                  onClick={handleSignAndDispatch}
                  disabled={isSigning || prescriptionItems.length === 0}
                  className="w-full sm:w-auto px-5 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition min-h-[44px] active:scale-98"
                >
                  <Lock className="w-4 h-4" />
                  {isSigning ? 'Hashing with SHA-256...' : 'Sign Cryptographically & Dispatch Prescription'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2.5 FOLLOW-UP & MONITORING LOOP MODAL */}
      {showFollowUpModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 shadow-2xl border border-slate-200 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-slate-100 text-slate-800 rounded-xl shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    2.5 Post-Consultation Follow-Up & Monitoring Loop
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-500">
                    48-Hour automated recovery check-in prompt for {patient.fullName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowFollowUpModal(false)}
                className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 text-lg font-bold min-h-[44px] min-w-[44px] shrink-0"
              >
                ✕
              </button>
            </div>

            {followUpSubmittedToast && (
              <div className="p-2.5 bg-slate-100 border border-slate-200 text-slate-900 rounded-xl text-xs flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-slate-700 shrink-0" />
                <span>{followUpSubmittedToast}</span>
              </div>
            )}

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Automated Audit Schedule</span>
                <span className="font-semibold text-slate-800">48 Hours Post-Prescription Formulation</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Recorded Recovery Status</span>
                <span className="font-bold text-slate-900 font-mono text-xs">
                  {followUp.status.replace('_', ' ')} (Score: {followUp.symptomScore || 8} / 10)
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Adverse Drug Reactions Reported</span>
                <span className="font-semibold text-slate-800">
                  {followUp.adverseReactionsReported && followUp.adverseReactionsReported.length > 0 
                    ? followUp.adverseReactionsReported.join(', ') 
                    : 'Zero ADRs documented'}
                </span>
              </div>
            </div>

            {/* Interactive 48h Patient Check-in Simulation Form */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-slate-700" />
                  Simulate Patient 48-Hour Check-In Submission:
                </span>
                <span className="text-[10px] bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded font-semibold">
                  Patient App Portal
                </span>
              </div>

              {/* Recovery Score Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-600">Symptom Improvement / Recovery Score:</span>
                  <span className="font-bold text-slate-900 font-mono">{followUpRecoveryScore} / 10</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={followUpRecoveryScore}
                  onChange={(e) => setFollowUpRecoveryScore(Number(e.target.value))}
                  className="w-full accent-slate-900 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              {/* Checkboxes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-700 pt-1">
                <label className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/70 transition cursor-pointer min-h-[36px]">
                  <input
                    type="checkbox"
                    checked={followUpCheckboxes.chestPainResolved}
                    onChange={(e) => setFollowUpCheckboxes({ ...followUpCheckboxes, chestPainResolved: e.target.checked })}
                    className="w-4 h-4 rounded text-slate-900"
                  />
                  <span>Chest pain resolved</span>
                </label>
                <label className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/70 transition cursor-pointer min-h-[36px]">
                  <input
                    type="checkbox"
                    checked={followUpCheckboxes.noMuscleMyopathy}
                    onChange={(e) => setFollowUpCheckboxes({ ...followUpCheckboxes, noMuscleMyopathy: e.target.checked })}
                    className="w-4 h-4 rounded text-slate-900"
                  />
                  <span>No muscle aches</span>
                </label>
                <label className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/70 transition cursor-pointer min-h-[36px]">
                  <input
                    type="checkbox"
                    checked={followUpCheckboxes.noAdverseBleeding}
                    onChange={(e) => setFollowUpCheckboxes({ ...followUpCheckboxes, noAdverseBleeding: e.target.checked })}
                    className="w-4 h-4 rounded text-slate-900"
                  />
                  <span>No bleeding / bruising</span>
                </label>
                <label className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/70 transition cursor-pointer min-h-[36px]">
                  <input
                    type="checkbox"
                    checked={followUpCheckboxes.adherenceConfirmed}
                    onChange={(e) => setFollowUpCheckboxes({ ...followUpCheckboxes, adherenceConfirmed: e.target.checked })}
                    className="w-4 h-4 rounded text-slate-900"
                  />
                  <span>100% medication adherence</span>
                </label>
              </div>

              <textarea
                rows={2}
                value={followUpFeedbackText}
                onChange={(e) => setFollowUpFeedbackText(e.target.value)}
                className="w-full text-base sm:text-xs p-2.5 bg-white border border-slate-300 rounded-lg text-slate-700 focus:outline-none"
                placeholder="Patient comments on medication tolerance..."
              />

              <button
                type="button"
                onClick={handleSubmitFollowUpCheckIn}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition min-h-[44px] active:scale-98"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Submit Patient Check-In & Update Audit Trail</span>
              </button>
            </div>

            <div className="p-3 bg-slate-100 border border-slate-200 rounded-xl text-[11px] text-slate-800 font-mono space-y-1">
              <span className="font-bold block font-sans">Institutional Audit Trail Stamp (LAUTECH EHR):</span>
              <p className="break-all">{followUp.auditTrailHash}</p>
              <p className="text-[10px] text-slate-600 font-sans">Verified by Prof. Adeseye Akintunde • Immutable NDPR Article 2.6 Record</p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowFollowUpModal(false)}
                className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition min-h-[44px] flex items-center justify-center shadow-xs"
              >
                Close Follow-Up Monitor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* National Essential Medicines List (NEML 8th Edition) & API Browser Modal */}
      <NemlBrowserModal
        isOpen={isNemlBrowserOpen}
        onClose={() => setIsNemlBrowserOpen(false)}
        onSelectDrugForPrescription={handlePrescribeNemlDrug}
        activePatient={patient}
      />
    </div>
  );
};
