import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldCheck, 
  CheckCircle2, 
  PhoneCall, 
  Calendar, 
  Clock, 
  Activity, 
  UserCheck, 
  ArrowRight, 
  Check, 
  AlertCircle
} from 'lucide-react';
import { 
  SPECIALISTS, 
  LAUTECH_SURGERY_UROLOGY_PROTOCOL, 
  DEMO_PATIENT_SURGERY_UROLOGY, 
  HMO_LIST 
} from '../../data/clinicalData';
import { 
  NetworkQuality,
  AppointmentBooking, 
  Specialist, 
  PatientProfile 
} from '../../types';

interface SurgeryUrologyModuleProps {
  networkQuality?: NetworkQuality;
  onAppointmentBooked: (booking: AppointmentBooking) => void;
  onNavigateToConsultation: () => void;
  onOpenNdprModal?: () => void;
}

export const SurgeryUrologyModule: React.FC<SurgeryUrologyModuleProps> = ({
  onAppointmentBooked,
  onNavigateToConsultation
}) => {
  // Matched Specialist
  const urologistSpecialist: Specialist = SPECIALISTS.find(s => s.id === 'spec-dr-najimudeen') || {
    id: 'spec-dr-najimudeen',
    name: 'Dr. Idowu Najimudeen',
    title: 'Consultant Urologist',
    department: 'Surgery & Urology',
    institution: 'LAUTECH Teaching Hospital, Ogbomoso',
    qualifications: 'MBBS, FWACS (Urology), FICS',
    precisionExpertise: [
      'Elective Pre-Operative Urological Evaluation',
      'Post-Operative Surgical Recovery & Wound Tracking',
      'Benign Prostatic Hyperplasia (BPH) & LUTS Management',
      'LAUTECH Elective Surgical & Urological Routine Protocol'
    ],
    lautechFacultyRole: 'Consultant Urologist, Department of Surgery, LAUTECH Teaching Hospital, Ogbomoso',
    bio: 'Consultant Urologist at LAUTECH Teaching Hospital, Ogbomoso. Directs the elective outpatient surgical and urological telehealth service.',
    availableSlots: [
      { date: 'Tomorrow', time: '10:00 AM', available: true },
      { date: 'Tomorrow', time: '12:30 PM', available: true },
      { date: 'Tomorrow', time: '03:15 PM', available: true },
      { date: 'In 2 Days', time: '11:00 AM', available: true },
      { date: 'In 2 Days', time: '02:30 PM', available: true },
    ]
  };

  // Section 1: Red Flag Screen State
  const [selectedRedFlags, setSelectedRedFlags] = useState<string[]>([]);
  const hasEmergencyRedFlags = selectedRedFlags.length > 0;

  // Section 2: Elective Focus State
  const [selectedCategory, setSelectedCategory] = useState<string>('post_op');
  const [patientNotes, setPatientNotes] = useState<string>(
    'Scheduled 6-week post-TURP check-in. Urinary stream is clear, zero hematuria, taking prescribed medications regularly.'
  );

  // Section 3: Patient Safety Acknowledgment
  const [safetyAcknowledged, setSafetyAcknowledged] = useState<boolean>(false);
  const [attemptedWithoutAck, setAttemptedWithoutAck] = useState<boolean>(false);

  // Patient Intake & Scheduling State
  const [patient, setPatient] = useState<PatientProfile>(DEMO_PATIENT_SURGERY_UROLOGY);
  const [selectedDate, setSelectedDate] = useState<string>('Tomorrow');
  const [selectedTime, setSelectedTime] = useState<string>('10:00 AM');
  const [selectedPaymentMode, setSelectedPaymentMode] = useState<'HMO' | 'OUT_OF_POCKET'>('HMO');
  const [selectedHmo, setSelectedHmo] = useState<string>('AXA Mansard Health');
  const [hmoNumber, setHmoNumber] = useState<string>('AXA-URO-49102-LAUT');

  // Booking Confirmation State
  const [isBooked, setIsBooked] = useState<boolean>(false);
  const [confirmedBookingId, setConfirmedBookingId] = useState<string>('');

  const toggleRedFlag = (flagId: string) => {
    setSelectedRedFlags(prev => {
      const exists = prev.includes(flagId);
      const updated = exists ? prev.filter(id => id !== flagId) : [...prev, flagId];
      if (updated.length > 0) {
        setSafetyAcknowledged(false);
      }
      return updated;
    });
  };

  const handleLoadDemoPatient = () => {
    setPatient(DEMO_PATIENT_SURGERY_UROLOGY);
    setSelectedRedFlags([]);
    setSafetyAcknowledged(true);
    setSelectedCategory('post_op');
    setPatientNotes(
      'Scheduled 6-week post-TURP check-in. Urinary stream is clear, zero hematuria, taking Tamsulosin as prescribed. Baseline labs reviewed.'
    );
  };

  const handleConfirmBooking = () => {
    if (hasEmergencyRedFlags) return;
    if (!safetyAcknowledged) {
      setAttemptedWithoutAck(true);
      return;
    }

    const bookingRef = `KBF-URO-${Math.floor(10000 + Math.random() * 90000)}`;

    const newBooking: AppointmentBooking = {
      id: bookingRef,
      patient,
      specialist: urologistSpecialist,
      selectedDate,
      selectedTime,
      triage: {
        severityLevel: 'Moderate',
        recommendedDepartment: 'Surgery & Urology',
        matchedSpecialist: urologistSpecialist,
        clinicalPriority: 'Standard (within 48h)',
        triageReasoning: `Elective outpatient review under ${LAUTECH_SURGERY_UROLOGY_PROTOCOL.name}. Track: ${selectedCategory.toUpperCase()}. Clinical presentation: ${patientNotes.slice(0, 140)}`,
        flaggedRiskFactors: [
          'Elective virtual clinical review',
          'Zero acute emergency red flags confirmed',
          `Protocol: ${LAUTECH_SURGERY_UROLOGY_PROTOCOL.name}`
        ]
      },
      documents: [],
      paymentMode: selectedPaymentMode === 'HMO' ? 'HMO_VERIFICATION' : 'DIRECT_PAYMENT',
      hmoDetails: selectedPaymentMode === 'HMO' ? {
        provider: selectedHmo,
        policyNumber: hmoNumber,
        verified: true
      } : undefined,
      paymentReference: `TXN-URO-${Date.now().toString().slice(-6)}`,
      teleconsultLink: `https://kbf-telehealth.ng/v/lautech-uro-${bookingRef.toLowerCase()}`,
      status: 'SCHEDULED',
      createdAt: new Date().toISOString(),
      consultationState: {
        vitals: {
          bp: '128/82 mmHg',
          heartRate: 72,
          spo2: 98,
          temperature: '36.5 °C',
          weight: '76 kg',
          bmi: '25.1 kg/m²'
        },
        clinicalNotes: `Elective Surgical & Urological Outpatient Consultation logged under ${LAUTECH_SURGERY_UROLOGY_PROTOCOL.name}.\nAttending: ${urologistSpecialist.name}\nRouting: ${LAUTECH_SURGERY_UROLOGY_PROTOCOL.routing}\nClinical Track: ${selectedCategory}\nPatient confirms zero red-flag emergency symptoms.`,
        prescriptionItems: [],
        generatedPrescription: null,
        chatMessages: [
          {
            id: 'uro-msg-1',
            sender: urologistSpecialist.name,
            text: `Good day Alhaji Adeleke. I am ${urologistSpecialist.name}, Consultant Urologist at LAUTECH Teaching Hospital. I have reviewed your elective profile. How is your urinary stream and recovery?`,
            time: '10:00'
          }
        ],
        followUp: {
          id: `FU-URO-${Date.now().toString().slice(-6)}`,
          appointmentId: bookingRef,
          patientName: patient.fullName,
          checkInDueHours: 72,
          status: 'PENDING_SCHEDULED',
          symptomScore: 9,
          adverseReactionsReported: [],
          patientNotes: 'Elective urological follow-up scheduled.',
          timestamp: new Date().toISOString(),
          auditTrailHash: `SHA256-URO-${Date.now().toString(16).toUpperCase()}`
        }
      }
    };

    setConfirmedBookingId(bookingRef);
    setIsBooked(true);
    onAppointmentBooked(newBooking);
  };

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-6">
      {/* Top Banner: Module Overview & Institutional Affiliation */}
      <div className="bg-slate-900 border border-violet-500/30 text-white rounded-2xl p-4 sm:p-6 shadow-md">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 text-xs font-semibold border border-violet-400/30">
                <Activity className="w-3.5 h-3.5 text-violet-300 shrink-0" />
                LAUTECH Dept. of Surgery &amp; Urology
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/10 text-slate-200 text-xs font-semibold border border-white/15">
                Elective Outpatient Schedule
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-sans">
              Surgery &amp; Urology: Elective Telehealth &amp; Safety Screen
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-3xl leading-relaxed">
              Algorithmic safety triage separating emergency acute surgical conditions from routine elective outpatient virtual care under the accredited <strong>LAUTECH Elective Surgical &amp; Urological Routine Protocol</strong>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto shrink-0">
            <button
              onClick={handleLoadDemoPatient}
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 border border-white/20 transition-colors shadow-2xs min-h-[40px]"
              title="Load Alhaji Rasheed Adeleke (Post-TURP 6W Follow-up)"
            >
              <UserCheck className="w-3.5 h-3.5 text-violet-300" />
              <span>Load Demo Patient (Alhaji Rasheed)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 1. EMERGENCY SAFETY CHECK (THE RED FLAG STOP) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-900 text-white shadow-xs">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-950">
                1. Emergency Safety Check (The Red Flag Stop)
              </h3>
              <p className="text-xs text-slate-500">
                Mandatory screening before elective booking. Any positive symptom blocks virtual care.
              </p>
            </div>
          </div>
          {hasEmergencyRedFlags ? (
            <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-red-600 text-white text-xs font-bold uppercase tracking-wider">
              Red Flag Triggered
            </span>
          ) : (
            <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-slate-700" />
              Screen Clear
            </span>
          )}
        </div>

        {/* Mandated Emergency Notice */}
        <div className="p-4 bg-red-50/80 border border-red-200 rounded-xl mb-4 text-xs sm:text-sm text-red-950 leading-relaxed font-medium">
          <strong className="text-red-900 font-bold block sm:inline">Emergency Notice: </strong>
          If you are experiencing acute severe abdominal pain, sudden urinary retention with severe distress, active gross hematuria with clots, or acute trauma, do not use this app. Go immediately to LAUTECH Hospital Emergency.
        </div>

        {/* Interactive Red Flag Symptom Checklist */}
        <div className="space-y-2 mb-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Check any symptoms present right now:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {LAUTECH_SURGERY_UROLOGY_PROTOCOL.redFlagTriggers.map((flag) => {
              const checked = selectedRedFlags.includes(flag.id);
              return (
                <label
                  key={flag.id}
                  className={`flex items-start gap-3 p-3 rounded-xl border text-xs cursor-pointer select-none transition min-h-[48px] ${
                    checked
                      ? 'border-red-400 bg-red-50 text-red-950 font-bold'
                      : 'border-slate-200 bg-slate-50/70 text-slate-700 hover:border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleRedFlag(flag.id)}
                    className="w-4 h-4 mt-0.5 rounded border-slate-300 text-red-600 focus:ring-red-500 shrink-0"
                  />
                  <span className="leading-snug">{flag.label}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Emergency Stop Guidance if Red Flag is Selected */}
        {hasEmergencyRedFlags && (
          <div className="p-4 bg-red-700 text-white rounded-xl space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-white shrink-0" />
              <h4 className="font-bold text-sm sm:text-base">
                EMERGENCY STOP ACTIVATED
              </h4>
            </div>
            <p className="text-xs sm:text-sm text-red-100 leading-relaxed">
              Virtual teleconsultation is not safe for acute surgical emergencies, acute urinary blockage, severe bleeding, or trauma. Present immediately to the Emergency Casualty at LAUTECH Teaching Hospital, Ogbomoso.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href="tel:08005288324"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-red-700 hover:bg-red-50 font-bold text-xs rounded-xl shadow-xs transition"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call LAUTECH ER (0800-LAUTECH)</span>
              </a>
              <span className="text-xs text-red-200 font-medium">
                Casualty Unit: LAUTECH Teaching Hospital, General Hospital Road, Ogbomoso
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 2. CORE ELECTIVE FOCUS (WHAT TELEMEDICINE SOLVES HERE) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <div className="p-2 rounded-xl bg-slate-900 text-white shadow-xs">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-950">
              2. Core Elective Focus (What Telemedicine Solves Here)
            </h3>
            <p className="text-xs text-slate-500">
              Approved clinical scope for outpatient surgery and urology virtual consultations
            </p>
          </div>
        </div>

        {/* Mandated Core Elective Focus Statement */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 leading-relaxed font-medium">
          <strong className="text-slate-950 font-bold block sm:inline">Elective Outpatient Care: </strong>
          This telehealth channel is designed for elective urological and surgical pre-operative evaluations, post-operative follow-up care, chronic symptom tracking, and routine specialist referrals.
        </div>

        {/* Selectable Elective Clinical Categories */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Select your primary consultation track:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {LAUTECH_SURGERY_UROLOGY_PROTOCOL.eligibleCategories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <div
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition flex flex-col justify-between ${
                    isSelected
                      ? 'border-slate-900 bg-slate-100 text-slate-950 shadow-2xs'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-200 text-slate-800">
                        {cat.badge}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">
                        {cat.typicalReviewTime}
                      </span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 pt-1">
                      {cat.title}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="italic text-slate-500">{cat.clinicalScope}</span>
                    {isSelected && (
                      <span className="text-slate-900 font-bold flex items-center gap-1 shrink-0 ml-1">
                        <Check className="w-3.5 h-3.5 text-slate-900" /> Selected
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Clinical Notes / Reason for Review */}
        <div className="space-y-1.5 pt-1">
          <label className="block text-xs font-bold text-slate-700">
            Current Clinical Notes / Reason for Consultation (Optional):
          </label>
          <textarea
            rows={2}
            value={patientNotes}
            onChange={(e) => setPatientNotes(e.target.value)}
            placeholder="Describe your current recovery status, symptoms, or surgical questions..."
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
          />
        </div>
      </div>

      {/* 3. PATIENT SAFETY ACKNOWLEDGMENT */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-3">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <div className="p-2 rounded-xl bg-slate-900 text-white shadow-xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-950">
              3. Patient Safety Acknowledgment
            </h3>
            <p className="text-xs text-slate-500">
              Mandatory confirmation required before scheduling an elective virtual visit
            </p>
          </div>
        </div>

        {/* Mandated Safety Acknowledgment Checkbox */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <label className="flex items-start gap-3.5 cursor-pointer select-none">
            <div className="pt-0.5">
              <input
                type="checkbox"
                id="surgeryPatientSafetyAckCheckbox"
                checked={safetyAcknowledged}
                disabled={hasEmergencyRedFlags}
                onChange={(e) => {
                  if (!hasEmergencyRedFlags) {
                    setSafetyAcknowledged(e.target.checked);
                    if (e.target.checked) setAttemptedWithoutAck(false);
                  }
                }}
                className="w-5 h-5 text-slate-900 rounded border-slate-300 focus:ring-slate-900 focus:ring-offset-0 cursor-pointer disabled:opacity-50"
              />
            </div>
            <div className="space-y-1 flex-1">
              <div className="text-xs sm:text-sm font-semibold text-slate-950 leading-snug">
                {LAUTECH_SURGERY_UROLOGY_PROTOCOL.safetyAcknowledgmentText}
              </div>
            </div>
          </label>
        </div>

        {attemptedWithoutAck && !safetyAcknowledged && !hasEmergencyRedFlags && (
          <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-900 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>
              <strong>Required:</strong> Please check the Patient Safety Acknowledgment above to confirm non-emergency status before booking.
            </span>
          </div>
        )}

        {hasEmergencyRedFlags && (
          <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-900 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>Cannot acknowledge safety while acute emergency red flags are checked.</span>
          </div>
        )}
      </div>

      {/* 4. MATCHED SPECIALIST VIEW */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-900 text-white shadow-xs">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-950">
                4. Matched Specialist View
              </h3>
              <p className="text-xs text-slate-500">
                Attending consultant allocated in accordance with the LAUTECH Elective Surgical &amp; Urological Routine Protocol
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            <span className="px-2.5 py-1 bg-slate-100 text-slate-800 text-xs font-semibold rounded-full border border-slate-200">
              Specialist Allocated
            </span>
          </div>
        </div>

        {/* Specialist Profile Card */}
        <div className="p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200 shadow-2xs mb-5">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg sm:text-xl shadow-xs shrink-0 ring-4 ring-slate-100">
                IN
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-base sm:text-lg font-bold text-slate-950 tracking-tight">
                    {urologistSpecialist.name}
                  </h4>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-800 text-white rounded">
                    Matched Specialist
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-200 text-slate-800 rounded border border-slate-300">
                    Verified Consultant
                  </span>
                </div>
                <p className="text-xs text-slate-700 font-semibold">
                  {urologistSpecialist.title}, LAUTECH Teaching Hospital, Ogbomoso
                </p>
                <p className="text-[11px] text-slate-500">
                  Qualifications: {urologistSpecialist.qualifications}
                </p>
              </div>
            </div>

            {/* Protocol & Routing Badge Group */}
            <div className="flex flex-col gap-1.5 p-3 bg-white rounded-xl border border-slate-200 shadow-2xs w-full md:w-auto text-xs">
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-500 font-medium text-[11px]">Routing:</span>
                <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                  {LAUTECH_SURGERY_UROLOGY_PROTOCOL.routing}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-500 font-medium text-[11px]">Protocol:</span>
                <span className="font-bold text-slate-800 bg-slate-50 px-2 py-0.5 rounded text-[11px] font-mono">
                  {LAUTECH_SURGERY_UROLOGY_PROTOCOL.name}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-500 font-medium text-[11px]">Institution:</span>
                <span className="font-semibold text-slate-800 text-[11px]">
                  LAUTECH Hospital
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-600">
            <div>
              <span className="font-bold text-slate-800 block mb-1">
                Clinical Expertise &amp; Scope:
              </span>
              <ul className="space-y-0.5 text-[11px]">
                {urologistSpecialist.precisionExpertise.map((exp, i) => (
                  <li key={i} className="flex items-center gap-1.5 text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                    <span>{exp}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <span className="font-bold text-slate-800 block mb-1">
                Telemedicine Consultation Format:
              </span>
              <p className="text-[11px] leading-relaxed text-slate-600">
                Direct WebRTC encrypted video and audio channel optimized for low-bandwidth networks with digital prescription generation, follow-up scheduling, and clinical record sync.
              </p>
            </div>
          </div>
        </div>

        {/* Schedule & Timing Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-600" />
              <span>Select Appointment Date</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['Tomorrow', 'In 2 Days'].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setSelectedDate(d)}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold transition min-h-[40px] ${
                    selectedDate === d
                      ? 'border-slate-900 bg-slate-900 text-white'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-600" />
              <span>Elective Consultation Slot (WAT)</span>
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {urologistSpecialist.availableSlots.slice(0, 3).map((slot, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedTime(slot.time)}
                  className={`py-2 px-2 rounded-xl border text-xs font-semibold text-center transition min-h-[40px] ${
                    selectedTime === slot.time
                      ? 'border-slate-900 bg-slate-900 text-white'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* HMO & Outpatient Coverage Selector */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs font-bold text-slate-800">
              Health Insurance (HMO) &amp; Outpatient Coverage
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedPaymentMode('HMO')}
                className={`px-3 py-1 text-xs rounded-lg font-semibold transition ${
                  selectedPaymentMode === 'HMO'
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-700 border border-slate-200'
                }`}
              >
                HMO Pre-Authorized
              </button>
              <button
                type="button"
                onClick={() => setSelectedPaymentMode('OUT_OF_POCKET')}
                className={`px-3 py-1 text-xs rounded-lg font-semibold transition ${
                  selectedPaymentMode === 'OUT_OF_POCKET'
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-700 border border-slate-200'
                }`}
              >
                Self-Pay / Direct
              </button>
            </div>
          </div>

          {selectedPaymentMode === 'HMO' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Accredited HMO Provider
                </label>
                <select
                  value={selectedHmo}
                  onChange={(e) => setSelectedHmo(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                >
                  {HMO_LIST.map((h) => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Enrollee / Policy Number
                </label>
                <input
                  type="text"
                  value={hmoNumber}
                  onChange={(e) => setHmoNumber(e.target.value)}
                  placeholder="e.g. AXA-URO-49102-LAUT"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                >
                </input>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
              <span>Standard LAUTECH Virtual Outpatient Fee: <strong>₦7,500</strong></span>
              <span className="text-[11px] text-slate-700 font-semibold">Hospital Tariff</span>
            </div>
          )}
        </div>

        {/* Confirmation State Banner if Booked */}
        {isBooked && confirmedBookingId ? (
          <div className="p-4 sm:p-5 bg-slate-50 border border-slate-300 rounded-2xl space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm sm:text-base font-bold text-slate-950">
                    Elective Surgery &amp; Urology Appointment Confirmed!
                  </h4>
                  <span className="font-mono text-xs px-2 py-0.5 bg-slate-200 text-slate-900 font-bold rounded">
                    {confirmedBookingId}
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Scheduled with <strong>{urologistSpecialist.name}</strong> for <strong>{selectedDate} at {selectedTime}</strong> under the <em>{LAUTECH_SURGERY_UROLOGY_PROTOCOL.name}</em>.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onNavigateToConsultation}
                className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition min-h-[42px]"
              >
                <span>Enter Doctor Consultation Room</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsBooked(false)}
                className="w-full sm:w-auto px-4 py-2.5 bg-white text-slate-700 hover:bg-slate-100 font-semibold text-xs rounded-xl border border-slate-300 transition min-h-[42px]"
              >
                Modify Booking
              </button>
            </div>
          </div>
        ) : (
          /* Final Action Button */
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-slate-100">
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-slate-600" />
              <span>Elective non-emergency telehealth with attending consultant</span>
            </div>

            <button
              type="button"
              id="confirmSurgeryBookingBtn"
              onClick={handleConfirmBooking}
              disabled={hasEmergencyRedFlags}
              className={`px-6 py-3 font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition min-h-[44px] ${
                hasEmergencyRedFlags
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
            >
              <span>Book Elective Consultation with Dr. Najimudeen</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
