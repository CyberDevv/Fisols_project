import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldCheck, 
  CheckCircle2, 
  PhoneCall, 
  Calendar, 
  Clock, 
  UserCheck, 
  ArrowRight, 
  Check, 
  AlertCircle,
  Building2,
  Stethoscope,
  HeartPulse,
  Activity,
  FileText,
  Database,
  Pill
} from 'lucide-react';
import { 
  SPECIALISTS, 
  LAUTECH_FAMILY_MEDICINE_PROTOCOL, 
  DEMO_PATIENT_FAMILY_MEDICINE, 
  HMO_LIST 
} from '../../data/clinicalData';
import { 
  NetworkQuality,
  AppointmentBooking, 
  Specialist, 
  PatientProfile 
} from '../../types';

interface FamilyMedicineModuleProps {
  networkQuality?: NetworkQuality;
  onAppointmentBooked: (booking: AppointmentBooking) => void;
  onNavigateToConsultation: () => void;
  onOpenNdprModal?: () => void;
  onOpenNemlModal?: (initialCategory?: string) => void;
}

export const FamilyMedicineModule: React.FC<FamilyMedicineModuleProps> = ({
  onAppointmentBooked,
  onNavigateToConsultation,
  onOpenNemlModal
}) => {
  // Matched Specialist: Dr. Oluwajoba A. Olayinka – Consultant Family Physician & CMAC
  const familyPhysicianSpecialist: Specialist = SPECIALISTS.find(s => s.id === 'spec-dr-olayinka') || {
    id: 'spec-dr-olayinka',
    name: 'Dr. Oluwajoba A. Olayinka',
    title: 'Consultant Family Physician & CMAC',
    department: 'Family Medicine',
    institution: 'LAUTECH Teaching Hospital, Ogbomoso',
    qualifications: 'MBBS, FMCFM, FWACP (Family Med)',
    precisionExpertise: [
      'Primary Health Care & Ambulatory Medicine',
      'Chronic Disease Management (Hypertension & Diabetes)',
      'General Health Assessments & Wellness Screening',
      'LAUTECH Primary Health Care Routine Protocol'
    ],
    lautechFacultyRole: 'Chairman, Medical Advisory Committee (CMAC) & Consultant Family Physician, LAUTECH Teaching Hospital, Ogbomoso',
    bio: 'Consultant Family Physician and Chairman Medical Advisory Committee (CMAC) at LAUTECH Teaching Hospital, Ogbomoso. Directs the elective primary care telehealth service, providing comprehensive outpatient consultations, chronic disease monitoring, wellness screenings, and coordinated specialist referrals.',
    availableSlots: [
      { date: 'Tomorrow', time: '08:30 AM', available: true },
      { date: 'Tomorrow', time: '11:00 AM', available: true },
      { date: 'Tomorrow', time: '02:00 PM', available: true },
      { date: 'In 2 Days', time: '09:30 AM', available: true },
      { date: 'In 2 Days', time: '01:30 PM', available: true },
    ]
  };

  // Section 1: Red Flag Screen State
  const [selectedRedFlags, setSelectedRedFlags] = useState<string[]>([]);
  const hasEmergencyRedFlags = selectedRedFlags.length > 0;

  // Section 2: Elective Focus State
  const [selectedCategory, setSelectedCategory] = useState<string>('chronic_disease');
  const [patientNotes, setPatientNotes] = useState<string>(
    'Scheduled routine follow-up for essential hypertension and type 2 diabetes. Home BP logs averaging 128/82 mmHg, fasting blood glucose 105 mg/dL. Requesting refill and routine annual wellness lab review.'
  );

  // Section 3: Patient Safety Acknowledgment
  const [safetyAcknowledged, setSafetyAcknowledged] = useState<boolean>(false);
  const [attemptedWithoutAck, setAttemptedWithoutAck] = useState<boolean>(false);

  // Patient Intake & Scheduling State
  const [patient, setPatient] = useState<PatientProfile>(DEMO_PATIENT_FAMILY_MEDICINE);
  const [selectedDate, setSelectedDate] = useState<string>('Tomorrow');
  const [selectedTime, setSelectedTime] = useState<string>('08:30 AM');
  const [selectedPaymentMode, setSelectedPaymentMode] = useState<'HMO' | 'OUT_OF_POCKET'>('HMO');
  const [selectedHmo, setSelectedHmo] = useState<string>('Hygeia HMO Nigeria');
  const [hmoNumber, setHmoNumber] = useState<string>('HYG-FM-88204-LAUT');

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
    setPatient(DEMO_PATIENT_FAMILY_MEDICINE);
    setSelectedRedFlags([]);
    setSafetyAcknowledged(true);
    setSelectedCategory('chronic_disease');
    setPatientNotes(
      'Scheduled routine follow-up for essential hypertension and type 2 diabetes. Home BP logs averaging 128/82 mmHg, fasting blood glucose 105 mg/dL. Requesting refill and routine annual wellness lab review.'
    );
  };

  const handleConfirmBooking = () => {
    if (hasEmergencyRedFlags) return;
    if (!safetyAcknowledged) {
      setAttemptedWithoutAck(true);
      return;
    }

    const bookingRef = `KBF-FM-${Math.floor(10000 + Math.random() * 90000)}`;

    const newBooking: AppointmentBooking = {
      id: bookingRef,
      patient,
      specialist: familyPhysicianSpecialist,
      selectedDate,
      selectedTime,
      triage: {
        severityLevel: 'Moderate',
        recommendedDepartment: 'Family Medicine',
        matchedSpecialist: familyPhysicianSpecialist,
        clinicalPriority: 'Standard (within 48h)',
        triageReasoning: `Elective primary care consultation under ${LAUTECH_FAMILY_MEDICINE_PROTOCOL.name}. Category: ${selectedCategory.toUpperCase()}. Clinical summary: ${patientNotes.slice(0, 140)}`,
        flaggedRiskFactors: [
          'Elective virtual clinical review',
          'Zero acute emergency red flags confirmed',
          `Protocol: ${LAUTECH_FAMILY_MEDICINE_PROTOCOL.name}`
        ]
      },
      documents: [],
      paymentMode: selectedPaymentMode === 'HMO' ? 'HMO_VERIFICATION' : 'DIRECT_PAYMENT',
      hmoDetails: selectedPaymentMode === 'HMO' ? {
        provider: selectedHmo,
        policyNumber: hmoNumber,
        verified: true
      } : undefined,
      paymentReference: `TXN-FM-${Date.now().toString().slice(-6)}`,
      teleconsultLink: `https://kbf-telehealth.ng/v/lautech-fm-${bookingRef.toLowerCase()}`,
      status: 'SCHEDULED',
      createdAt: new Date().toISOString(),
      consultationState: {
        vitals: {
          bp: '128/82 mmHg',
          heartRate: 72,
          spo2: 98,
          temperature: '36.6 °C',
          weight: '68 kg',
          bmi: '25.3 kg/m²'
        },
        clinicalNotes: `Elective Family Medicine Outpatient Consultation logged under ${LAUTECH_FAMILY_MEDICINE_PROTOCOL.name}.\nAttending: ${familyPhysicianSpecialist.name}\nRouting: ${LAUTECH_FAMILY_MEDICINE_PROTOCOL.routing}\nClinical Track: ${selectedCategory}\nPatient confirms zero red-flag emergency symptoms.`,
        prescriptionItems: [],
        generatedPrescription: null,
        chatMessages: [
          {
            id: 'fm-msg-1',
            sender: familyPhysicianSpecialist.name,
            text: `Good day Mrs. Folake Ojo. I am ${familyPhysicianSpecialist.name}, Consultant Family Physician & CMAC at LAUTECH Teaching Hospital. I have reviewed your primary care intake and home vitals. How are your blood pressure and routine medications?`,
            time: '08:30'
          }
        ],
        followUp: {
          id: `FU-FM-${Date.now().toString().slice(-6)}`,
          appointmentId: bookingRef,
          patientName: patient.fullName,
          checkInDueHours: 72,
          status: 'PENDING_SCHEDULED',
          symptomScore: 9,
          adverseReactionsReported: [],
          patientNotes: 'Elective primary care chronic follow-up scheduled.',
          timestamp: new Date().toISOString(),
          auditTrailHash: `SHA256-FM-${Date.now().toString(16).toUpperCase()}`
        }
      }
    };

    onAppointmentBooked(newBooking);
    setConfirmedBookingId(bookingRef);
    setIsBooked(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8 font-sans">
      {/* Module Header & Accreditation Breadcrumb */}
      <div className="bg-slate-900 border border-emerald-500/30 text-white rounded-2xl p-5 sm:p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              <Building2 className="w-3.5 h-3.5" />
              Family Medicine &amp; Primary Care
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/10 text-slate-200 border border-white/15">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              {LAUTECH_FAMILY_MEDICINE_PROTOCOL.name}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-teal-500/20 text-teal-200 border border-teal-400/30">
              Routing: {LAUTECH_FAMILY_MEDICINE_PROTOCOL.routing}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Family Medicine: Elective Telehealth &amp; Safety Screen
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
            Institutional primary care telehealth channel of LAUTECH Teaching Hospital, Ogbomoso. Provides elective outpatient consultations, chronic disease surveillance, wellness screening, and care coordination under CMAC clinical oversight.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleLoadDemoPatient}
            className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-colors shadow-xs"
            title="Load accredited demo patient (Mrs. Folake Ojo - Chronic Disease Management)"
          >
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span>Load Demo Patient (Folake Ojo)</span>
          </button>
        </div>
      </div>

      {/* Confirmation View after Successful Booking */}
      {isBooked ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-xs text-center space-y-6 animate-in fade-in duration-300">
          <div className="w-14 h-14 bg-slate-100 text-slate-900 rounded-full flex items-center justify-center mx-auto border border-slate-300">
            <Check className="w-8 h-8 stroke-[2.5]" />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <span className="inline-block px-2.5 py-0.5 text-xs font-semibold bg-slate-100 text-slate-800 rounded border border-slate-200">
              Booking Confirmed • Reference: {confirmedBookingId}
            </span>
            <h3 className="text-2xl font-bold text-slate-900">
              Elective Primary Care Consultation Scheduled
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Your appointment with <strong className="text-slate-900 font-semibold">{familyPhysicianSpecialist.name}</strong> ({familyPhysicianSpecialist.title}) has been formally logged into the LAUTECH Outpatient Clinic Schedule.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 max-w-xl mx-auto text-left space-y-3 text-xs sm:text-sm">
            <div className="grid grid-cols-2 gap-3 pb-3 border-b border-slate-200">
              <div>
                <span className="text-slate-500 block text-xs">Patient</span>
                <span className="font-semibold text-slate-900">{patient.fullName}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-xs">Time &amp; Date</span>
                <span className="font-semibold text-slate-900">{selectedDate} at {selectedTime}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pb-3 border-b border-slate-200">
              <div>
                <span className="text-slate-500 block text-xs">Protocol</span>
                <span className="font-semibold text-slate-900">{LAUTECH_FAMILY_MEDICINE_PROTOCOL.name}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-xs">Coverage Mode</span>
                <span className="font-semibold text-slate-900">
                  {selectedPaymentMode === 'HMO' ? `${selectedHmo} (${hmoNumber})` : 'Direct Out-of-Pocket Payment'}
                </span>
              </div>
            </div>
            <div>
              <span className="text-slate-500 block text-xs mb-1">Clinical Note / Reason</span>
              <p className="text-slate-700 font-normal leading-relaxed">{patientNotes}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={onNavigateToConsultation}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 transition-colors shadow-2xs"
            >
              <span>Proceed to Virtual Consultation Room</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                setIsBooked(false);
                setSelectedRedFlags([]);
                setSafetyAcknowledged(false);
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm border border-slate-200 transition-colors"
            >
              Schedule Another Consultation
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* 1. Emergency Safety Check (The Red Flag Stop) */}
          <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div className="flex items-start gap-3 border-b border-slate-100 pb-4">
              <div className="p-2 bg-slate-100 rounded-lg text-slate-800 shrink-0">
                <AlertTriangle className="w-5 h-5 text-slate-700" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span>1. Emergency Safety Check</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-semibold">
                    The Red Flag Stop
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Mandatory clinical rule: telehealth is strictly reserved for non-emergent, elective care.
                </p>
              </div>
            </div>

            {/* Exact Emergency Notice Block */}
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 text-xs sm:text-sm leading-relaxed flex items-start gap-3 shadow-2xs">
              <div className="p-1 rounded-md bg-amber-500 text-white shrink-0 mt-0.5">
                <AlertCircle className="w-4 h-4" />
              </div>
              <div>
                <strong className="font-bold text-amber-950 block mb-0.5">
                  Emergency Notice:
                </strong>
                <span>
                  {LAUTECH_FAMILY_MEDICINE_PROTOCOL.emergencyDisclaimer.replace('Emergency Notice: ', '')}
                </span>
              </div>
            </div>

            {/* Red Flag Checkbox Trigger Grid */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                Select any symptom you are currently experiencing:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {LAUTECH_FAMILY_MEDICINE_PROTOCOL.redFlagTriggers.map(flag => {
                  const isChecked = selectedRedFlags.includes(flag.id);
                  return (
                    <button
                      key={flag.id}
                      type="button"
                      onClick={() => toggleRedFlag(flag.id)}
                      className={`text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-start justify-between gap-3 ${
                        isChecked 
                          ? 'bg-red-600 border-red-600 text-white font-medium shadow-xs'
                          : 'bg-white hover:bg-red-50/40 border-slate-200 text-slate-800'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                          isChecked ? 'bg-white border-white text-red-600' : 'border-slate-300 bg-white'
                        }`}>
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className="leading-snug">{flag.label}</span>
                      </div>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold shrink-0 ${
                        isChecked ? 'bg-white/20 text-white' : 'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        Red Flag
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Emergency Red Flag Interceptor */}
            {hasEmergencyRedFlags && (
              <div className="p-4 rounded-xl bg-red-600 text-white space-y-3 animate-in fade-in duration-200 shadow-md">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <AlertTriangle className="w-5 h-5 text-white" />
                  <span>Immediate Hospital Emergency Care Required</span>
                </div>
                <p className="text-xs sm:text-sm text-red-50 leading-relaxed">
                  You selected one or more emergency red flag symptoms. Elective telehealth is clinically contraindicated for acute chest pain, collapse, severe trauma, or acute medical emergencies. Please proceed immediately to LAUTECH Hospital Emergency.
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <a
                    href="tel:+2348033889012"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-red-700 text-xs font-bold hover:bg-red-50 transition-colors shadow-xs"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-red-700" />
                    <span>Call LAUTECH Emergency: +234 803 388 9012</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setSelectedRedFlags([])}
                    className="px-3 py-1.5 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs font-medium border border-red-500 transition-colors"
                  >
                    Clear Emergency Flags (I am not in an emergency)
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* 2. Core Elective Focus (What Telemedicine Solves Here) */}
          <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div className="flex items-start gap-3 border-b border-slate-100 pb-4">
              <div className="p-2 bg-slate-100 rounded-lg text-slate-800 shrink-0">
                <Stethoscope className="w-5 h-5 text-slate-700" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span>2. Core Elective Focus</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-semibold">
                    What Telemedicine Solves Here
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Institutional scope of ambulatory and primary care consultations at LAUTECH Teaching Hospital.
                </p>
              </div>
            </div>

            {/* Core Elective Focus Banner */}
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm leading-relaxed">
              <strong className="font-semibold text-slate-950 block mb-0.5">
                Elective Outpatient Care:
              </strong>
              <span>
                {LAUTECH_FAMILY_MEDICINE_PROTOCOL.coreElectiveFocus.replace('Elective Outpatient Care: ', '')}
              </span>
            </div>

            {/* Service Categories Selection */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                Select Your Care Track:
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {LAUTECH_FAMILY_MEDICINE_PROTOCOL.eligibleCategories.map(cat => {
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`text-left p-4 rounded-xl border transition-all space-y-2 ${
                        isSelected 
                          ? 'bg-slate-50 border-slate-900 ring-1 ring-slate-900 text-slate-900' 
                          : 'bg-white hover:bg-slate-50/60 border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                          {cat.badge}
                        </span>
                        <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {cat.typicalReviewTime}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-950">{cat.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">{cat.description}</p>
                      <div className="pt-1 text-[11px] text-slate-500 border-t border-slate-100 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Scope: {cat.clinicalScope}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* National Essential Medicines List (NEML 8th Ed.) Primary Care Formulary Card */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-slate-900 text-white shrink-0 mt-0.5">
                  <Database className="w-4 h-4 text-slate-100" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-slate-950">
                      National Essential Medicines List (NEML) Primary Care Formulary
                    </span>
                    <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                      Level [P] Approved
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    All primary care prescriptions (Amlodipine, Lisinopril, Metformin, Artemether/Lumefantrine, Paracetamol) map directly to Nigeria FMoH NEML standards, NAFDAC registries, and WHO AWaRe classification.
                  </p>
                </div>
              </div>

              {onOpenNemlModal && (
                <button
                  type="button"
                  onClick={() => onOpenNemlModal('Cardiovascular')}
                  className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition active:scale-98 shrink-0"
                >
                  NEML Drugs
                </button>
              )}
            </div>

            {/* Patient Clinical Summary / Chief Concern Input */}
            <div className="space-y-2 pt-2">
              <label htmlFor="patientNotes" className="text-xs font-semibold text-slate-700 block">
                Primary Care Symptoms &amp; Consultation Objective:
              </label>
              <textarea
                id="patientNotes"
                rows={3}
                value={patientNotes}
                onChange={e => setPatientNotes(e.target.value)}
                placeholder="Describe your current routine primary care symptoms, chronic disease readings, or general health assessment goals..."
                className="w-full text-xs sm:text-sm p-3 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400"
              />
            </div>
          </section>

          {/* 3. Patient Safety Acknowledgment */}
          <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-start gap-3 border-b border-slate-100 pb-4">
              <div className="p-2 bg-slate-100 rounded-lg text-slate-800 shrink-0">
                <CheckCircle2 className="w-5 h-5 text-slate-700" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span>3. Patient Safety Acknowledgment</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-semibold">
                    Mandatory Consent
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Informed affirmation required prior to generating clinic booking.
                </p>
              </div>
            </div>

            <div 
              onClick={() => {
                if (!hasEmergencyRedFlags) {
                  setSafetyAcknowledged(prev => !prev);
                  setAttemptedWithoutAck(false);
                }
              }}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                hasEmergencyRedFlags 
                  ? 'opacity-50 cursor-not-allowed bg-slate-100 border-slate-200' 
                  : safetyAcknowledged 
                    ? 'bg-slate-900 border-slate-900 text-white shadow-xs' 
                    : attemptedWithoutAck
                      ? 'bg-slate-50 border-slate-900 ring-2 ring-slate-900/20 text-slate-900'
                      : 'bg-slate-50 hover:bg-slate-100/70 border-slate-200 text-slate-900'
              }`}
            >
              <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center shrink-0 ${
                safetyAcknowledged ? 'bg-white border-white text-slate-900' : 'border-slate-400 bg-white'
              }`}>
                {safetyAcknowledged && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
              <div className="space-y-0.5">
                <span className={`text-xs sm:text-sm font-semibold leading-relaxed block ${safetyAcknowledged ? 'text-white' : 'text-slate-900'}`}>
                  {LAUTECH_FAMILY_MEDICINE_PROTOCOL.safetyAcknowledgmentText}
                </span>
                <span className={`text-[11px] block ${safetyAcknowledged ? 'text-slate-300' : 'text-slate-500'}`}>
                  Under LAUTECH Institutional Outpatient Telehealth Protocols.
                </span>
              </div>
            </div>

            {attemptedWithoutAck && !safetyAcknowledged && (
              <p className="text-xs text-slate-700 font-medium flex items-center gap-1.5 animate-in fade-in duration-150">
                <AlertCircle className="w-3.5 h-3.5 text-slate-800" />
                <span>Please check the box above to confirm your primary care symptoms are non-emergency.</span>
              </p>
            )}
          </section>

          {/* 4. Matched Specialist View */}
          <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-start gap-3 border-b border-slate-100 pb-4">
              <div className="p-2 bg-slate-100 rounded-lg text-slate-800 shrink-0">
                <UserCheck className="w-5 h-5 text-slate-700" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span>4. Matched Specialist View</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-semibold">
                    CMAC Leadership
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Direct routing to LAUTECH consultant physician supervising primary care telemedicine.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-900 text-white">
                    Lead Specialist
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                    {familyPhysicianSpecialist.department}
                  </span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                    {familyPhysicianSpecialist.qualifications}
                  </span>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-950">
                    {familyPhysicianSpecialist.name}
                  </h4>
                  <p className="text-xs font-medium text-slate-700">
                    {familyPhysicianSpecialist.title}
                  </p>
                  <p className="text-xs text-slate-500">
                    {familyPhysicianSpecialist.institution}
                  </p>
                </div>
                <p className="text-xs text-slate-600 max-w-2xl leading-relaxed pt-1">
                  {familyPhysicianSpecialist.bio}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {familyPhysicianSpecialist.precisionExpertise.map((exp, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 font-medium">
                      {exp}
                    </span>
                  ))}
                </div>
              </div>

              {/* Protocol & Routing Details Card */}
              <div className="shrink-0 bg-white p-4 rounded-xl border border-slate-200 space-y-2.5 min-w-[240px]">
                <div className="text-xs font-semibold text-slate-900 pb-1.5 border-b border-slate-100 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-700" />
                  <span>Clinical Routing Profile</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-medium">Specialist</span>
                  <span className="text-xs font-semibold text-slate-900">{familyPhysicianSpecialist.name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-medium">Routing</span>
                  <span className="text-xs font-semibold text-slate-900">{LAUTECH_FAMILY_MEDICINE_PROTOCOL.routing}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-medium">Protocol</span>
                  <span className="text-xs font-semibold text-slate-900">{LAUTECH_FAMILY_MEDICINE_PROTOCOL.name}</span>
                </div>
              </div>
            </div>
          </section>

          {/* 5. Patient Intake & Appointment Scheduling */}
          <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div className="flex items-start gap-3 border-b border-slate-100 pb-4">
              <div className="p-2 bg-slate-100 rounded-lg text-slate-800 shrink-0">
                <Calendar className="w-5 h-5 text-slate-700" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span>5. Patient Details &amp; Slot Selection</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-semibold">
                    Appointment Details
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Confirm patient details and pick an elective consultation time slot.
                </p>
              </div>
            </div>

            {/* Patient Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={patient.fullName}
                  onChange={e => setPatient({ ...patient, fullName: e.target.value })}
                  className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-slate-200 bg-white text-slate-900"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Phone Number</label>
                <input
                  type="text"
                  value={patient.phone}
                  onChange={e => setPatient({ ...patient, phone: e.target.value })}
                  className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-slate-200 bg-white text-slate-900"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  value={patient.email}
                  onChange={e => setPatient({ ...patient, email: e.target.value })}
                  className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-slate-200 bg-white text-slate-900"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Age &amp; Gender</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={patient.age}
                    onChange={e => setPatient({ ...patient, age: parseInt(e.target.value) || 0 })}
                    className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-slate-200 bg-white text-slate-900"
                  />
                  <select
                    value={patient.gender}
                    onChange={e => setPatient({ ...patient, gender: e.target.value as 'Male' | 'Female' | 'Other' })}
                    className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-slate-200 bg-white text-slate-900"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Date & Time Slot Selection */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                Available Elective Outpatient Slots:
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {familyPhysicianSpecialist.availableSlots.map((slot, index) => {
                  const isSelected = selectedDate === slot.date && selectedTime === slot.time;
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => {
                        setSelectedDate(slot.date);
                        setSelectedTime(slot.time);
                      }}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        isSelected 
                          ? 'bg-emerald-600 border-emerald-600 text-white font-semibold shadow-xs ring-2 ring-emerald-500/20' 
                          : 'bg-white hover:bg-emerald-50/40 border-slate-200 text-slate-800'
                      }`}
                    >
                      <span className={`block text-[11px] font-normal ${isSelected ? 'text-emerald-100' : 'text-slate-500'}`}>{slot.date}</span>
                      <span className="block text-xs sm:text-sm font-bold mt-0.5">{slot.time}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Billing & HMO Selection */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                Payment / Healthcare Coverage:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg">
                <button
                  type="button"
                  onClick={() => setSelectedPaymentMode('HMO')}
                  className={`p-3 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between ${
                    selectedPaymentMode === 'HMO' 
                      ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-600/20 text-emerald-950 font-semibold' 
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>HMO / NHIA Coverage</span>
                  </div>
                  {selectedPaymentMode === 'HMO' && <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPaymentMode('OUT_OF_POCKET')}
                  className={`p-3 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between ${
                    selectedPaymentMode === 'OUT_OF_POCKET' 
                      ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-600/20 text-emerald-950 font-semibold' 
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>Direct Self-Pay (₦5,000)</span>
                  {selectedPaymentMode === 'OUT_OF_POCKET' && <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />}
                </button>
              </div>

              {selectedPaymentMode === 'HMO' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl pt-1">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">Select HMO Partner</label>
                    <select
                      value={selectedHmo}
                      onChange={e => setSelectedHmo(e.target.value)}
                      className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                    >
                      {HMO_LIST.map((hmo, idx) => (
                        <option key={idx} value={hmo}>{hmo}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">Policy / Enrollee Number</label>
                    <input
                      type="text"
                      value={hmoNumber}
                      onChange={e => setHmoNumber(e.target.value)}
                      placeholder="e.g. HYG-FM-88204-LAUT"
                      className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Final Booking Submission Trigger */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-500">
                <span className="font-semibold text-slate-800">Ready to Book:</span> {familyPhysicianSpecialist.name} · {selectedDate} at {selectedTime}
              </div>

              <button
                type="button"
                onClick={handleConfirmBooking}
                disabled={hasEmergencyRedFlags}
                className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-sm ${
                  hasEmergencyRedFlags 
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300' 
                    : !safetyAcknowledged
                      ? 'bg-slate-800 text-white hover:bg-slate-700'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-98'
                }`}
              >
                <span>Confirm Family Medicine Telehealth Booking</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
