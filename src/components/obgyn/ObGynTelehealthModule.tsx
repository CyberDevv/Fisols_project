import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldCheck, 
  CheckCircle2, 
  PhoneCall, 
  Calendar, 
  Clock, 
  Heart, 
  Baby, 
  UserCheck, 
  ArrowRight, 
  Building2, 
  Check, 
  X, 
  AlertCircle, 
  FileText,
  Lock,
  Sparkles,
  MapPin
} from 'lucide-react';
import { 
  SPECIALISTS, 
  LAUTECH_OBGYN_PROTOCOL, 
  DEMO_PATIENT_OBGYN, 
  HMO_LIST 
} from '../../data/clinicalData';
import { 
  NetworkQuality, 
  AppointmentBooking, 
  Specialist, 
  PatientProfile 
} from '../../types';

interface ObGynTelehealthModuleProps {
  networkQuality: NetworkQuality;
  onAppointmentBooked: (booking: AppointmentBooking) => void;
  onNavigateToConsultation: () => void;
  onOpenNdprModal?: () => void;
}

export const ObGynTelehealthModule: React.FC<ObGynTelehealthModuleProps> = ({
  networkQuality,
  onAppointmentBooked,
  onNavigateToConsultation,
  onOpenNdprModal
}) => {
  // Matched Specialists from clinical data
  const obgynSpecialists = SPECIALISTS.filter(s => s.department === 'Obstetrics & Gynaecology');
  const [selectedSpecialistId, setSelectedSpecialistId] = useState<string>('spec-dr-adebayo');
  const obgynSpecialist: Specialist = obgynSpecialists.find(s => s.id === selectedSpecialistId) || obgynSpecialists[0] || {
    id: 'spec-dr-adebayo',
    name: 'Dr. Adekunle Adebayo',
    title: 'Consultant Obstetrician & Gynaecologist',
    department: 'Obstetrics & Gynaecology',
    institution: 'LAUTECH Teaching Hospital, Ogbomoso',
    qualifications: 'MBBS, FWACS, FMCOG',
    precisionExpertise: [
      'Routine Antenatal Care & Postpartum Triage',
      'Contraceptive Counseling & Family Planning',
      'Menstrual Disorder & Hormonal Tracking',
      'LAUTECH Tele-Gynecology Routine Protocol'
    ],
    lautechFacultyRole: 'Consultant Obstetrician & Gynaecologist, Department of Obstetrics & Gynaecology, LAUTECH Teaching Hospital, Ogbomoso',
    bio: 'Consultant Obstetrician & Gynaecologist at LAUTECH Teaching Hospital, Ogbomoso. Oversees elective outpatient virtual reviews, postpartum check-ins, contraceptive guidance, and stable gynecological care following strict institutional safety screening.',
    availableSlots: [
      { date: 'Tomorrow', time: '09:30 AM', available: true },
      { date: 'Tomorrow', time: '11:45 AM', available: true },
      { date: 'Tomorrow', time: '02:15 PM', available: true },
      { date: 'In 2 Days', time: '10:00 AM', available: true },
      { date: 'In 2 Days', time: '01:30 PM', available: true },
    ]
  };

  const getSpecialistInitials = (name: string) =>
    name.replace(/^(Dr\.|Prof\.)\s*/, '').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'MD';

  // Section 1: Red Flag Screen State
  const [selectedRedFlags, setSelectedRedFlags] = useState<string[]>([]);
  const hasEmergencyRedFlags = selectedRedFlags.length > 0;

  // Section 2: Core Elective Category State
  const [selectedCategory, setSelectedCategory] = useState<string>('antenatal');
  const [patientNotes, setPatientNotes] = useState<string>(
    '24 weeks gestational age routine check-in. Tracking blood pressure at home (112/74 mmHg), fetal kicks normal (>10 kicks in 2 hours), reviewing iron supplement tolerance.'
  );
  const [gestationalAgeOrCycle, setGestationalAgeOrCycle] = useState<string>('24 Weeks (2nd Trimester)');

  // Section 3: Patient Safety Acknowledgment State
  const [safetyAcknowledged, setSafetyAcknowledged] = useState<boolean>(true);
  const [attemptedWithoutAck, setAttemptedWithoutAck] = useState<boolean>(false);

  // Patient Profile State
  const [patient, setPatient] = useState<PatientProfile>(DEMO_PATIENT_OBGYN);

  // Section 4: Schedule & Booking State
  const [selectedDate, setSelectedDate] = useState<string>('Tomorrow');
  const [selectedTime, setSelectedTime] = useState<string>('09:30 AM');
  const [selectedPaymentMode, setSelectedPaymentMode] = useState<'HMO' | 'OUT_OF_POCKET'>('HMO');
  const [selectedHmo, setSelectedHmo] = useState<string>('Reliance HMO Nigeria');
  const [hmoNumber, setHmoNumber] = useState<string>('REL-OBG-33918-LAUT');
  const [isBooked, setIsBooked] = useState<boolean>(false);
  const [confirmedBookingId, setConfirmedBookingId] = useState<string | null>(null);

  const toggleRedFlag = (flagId: string) => {
    if (selectedRedFlags.includes(flagId)) {
      setSelectedRedFlags(selectedRedFlags.filter(id => id !== flagId));
    } else {
      setSelectedRedFlags([...selectedRedFlags, flagId]);
    }
  };

  const handleSelectElectiveCategory = (catId: string) => {
    setSelectedCategory(catId);
    if (catId === 'antenatal') {
      setGestationalAgeOrCycle('24 Weeks (2nd Trimester)');
      setPatientNotes('Routine antenatal second-trimester review. Reviewing ultrasound report, blood pressure diary, and iron intake.');
    } else if (catId === 'postpartum') {
      setGestationalAgeOrCycle('6 Weeks Post-Delivery');
      setPatientNotes('Postpartum maternal check-in: healing assessment, breastfeeding guidance, and routine postnatal mood check.');
    } else if (catId === 'menstrual') {
      setGestationalAgeOrCycle('Day 14 of 32-Day Cycle');
      setPatientNotes('Tracking menstrual cycle irregularities and discussing non-steroidal relief for mild primary dysmenorrhea.');
    } else if (catId === 'contraceptive') {
      setGestationalAgeOrCycle('Elective Counseling');
      setPatientNotes('Requesting detailed medical evaluation of low-dose hormonal pills versus copper IUD for postpartum family planning.');
    } else if (catId === 'stable_gyn') {
      setGestationalAgeOrCycle('Routine Review');
      setPatientNotes('Reviewing normal cervical cytology screening and discussion of routine pelvic wellness.');
    }
  };

  const handleConfirmObGynBooking = () => {
    if (hasEmergencyRedFlags) {
      return;
    }
    if (!safetyAcknowledged) {
      setAttemptedWithoutAck(true);
      return;
    }

    const bookingRef = `KBF-OBG-${Math.floor(10000 + Math.random() * 90000)}`;
    const newBooking: AppointmentBooking = {
      id: bookingRef,
      patient: {
        ...patient,
        ndprConsentGiven: true,
        ndprConsentDate: new Date().toISOString()
      },
      specialist: obgynSpecialist,
      selectedDate,
      selectedTime,
      triage: {
        severityLevel: 'Mild',
        recommendedDepartment: 'Obstetrics & Gynaecology',
        matchedSpecialist: obgynSpecialist,
        clinicalPriority: 'Standard (within 48h)',
        triageReasoning: `Elective OB/GYN outpatient consultation routed under ${LAUTECH_OBGYN_PROTOCOL.name}. Safety screen passed: non-emergency elective care confirmed for ${selectedCategory.toUpperCase()}.`,
        flaggedRiskFactors: [
          'Safety Screen Cleared: Non-emergency elective care verified',
          `Clinical Focus: ${selectedCategory.replace('_', ' ').toUpperCase()}`,
          `Protocol: ${LAUTECH_OBGYN_PROTOCOL.name}`
        ]
      },
      documents: [
        {
          id: `doc-obgyn-${Date.now()}`,
          name: 'LAUTECH_Elective_Antenatal_Screening_Record.pdf',
          type: 'lab_report',
          originalSizeBytes: 1450000,
          compressedSizeBytes: 112000,
          compressionRatio: '92.3% Saved',
          uploadDate: new Date().toISOString().split('T')[0],
          status: 'synced_cloud'
        }
      ],
      paymentMode: selectedPaymentMode === 'HMO' ? 'HMO_VERIFICATION' : 'DIRECT_PAYMENT',
      hmoDetails: selectedPaymentMode === 'HMO' ? {
        provider: selectedHmo,
        policyNumber: hmoNumber,
        verified: true
      } : undefined,
      paymentReference: `TXN-OBG-${Date.now().toString().slice(-6)}`,
      teleconsultLink: `https://kbf-telehealth.ng/v/lautech-obgyn-${bookingRef.toLowerCase()}`,
      status: 'SCHEDULED',
      createdAt: new Date().toISOString(),
      consultationState: {
        vitals: {
          bp: '114/72 mmHg',
          heartRate: 74,
          spo2: 99,
          temperature: '36.6 °C',
          weight: '68 kg',
          bmi: '23.8 kg/m²'
        },
        clinicalNotes: `Elective OB/GYN Outpatient Consultation logged under ${LAUTECH_OBGYN_PROTOCOL.name}.\nAttending: ${obgynSpecialist.name}\nRouting: ${LAUTECH_OBGYN_PROTOCOL.routing}\nClinical Track: ${selectedCategory}\nPatient confirms zero red-flag emergency symptoms.`,
        prescriptionItems: [],
        generatedPrescription: null,
        chatMessages: [
          {
            id: 'obg-msg-1',
            sender: obgynSpecialist.name,
            text: `Welcome to the LAUTECH Elective OB/GYN virtual clinic. I am ${obgynSpecialist.name}. I see your elective intake notes and safety confirmation. Let us review your progress.`,
            time: '09:30'
          }
        ],
        followUp: {
          id: `FU-OBG-${Date.now().toString().slice(-6)}`,
          appointmentId: bookingRef,
          patientName: patient.fullName,
          checkInDueHours: 72,
          status: 'PENDING_SCHEDULED',
          symptomScore: 9,
          adverseReactionsReported: [],
          patientNotes: 'Elective antenatal / routine gynecological check-in follow up scheduled.',
          timestamp: new Date().toISOString(),
          auditTrailHash: `SHA256-OBG-${Date.now().toString(16).toUpperCase()}`
        }
      }
    };

    setConfirmedBookingId(bookingRef);
    setIsBooked(true);
    onAppointmentBooked(newBooking);
  };

  const handleLoadDemoPatient = () => {
    setPatient(DEMO_PATIENT_OBGYN);
    setSelectedRedFlags([]);
    setSafetyAcknowledged(true);
    setSelectedCategory('antenatal');
    setGestationalAgeOrCycle('24 Weeks (2nd Trimester)');
    setPatientNotes('Primigravida 24 weeks gestation routine check-in. Normal fetal movements, home blood pressure stable, taking routine ferrous gluconate.');
  };

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-6 animate-fadeIn">
      {/* Module Title & Institutional Governance Card */}
      <div className="bg-white text-slate-900 rounded-2xl p-4 sm:p-6 shadow-xs border border-slate-200">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200">
                <Heart className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                LAUTECH Dept. of Obstetrics &amp; Gynaecology
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200">
                Elective Outpatient Schedule
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950 font-sans">
              OB/GYN Module: Elective Telehealth &amp; Safety Screen
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-3xl leading-relaxed">
              Algorithmic safety triage separating high-risk obstetric emergencies from routine elective outpatient virtual care under the accredited <strong>LAUTECH Tele-Gynecology Routine Protocol</strong>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto shrink-0">
            <button
              onClick={handleLoadDemoPatient}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 border border-slate-200 transition-colors shadow-2xs min-h-[40px]"
              title="Load Zainab Balogun (24W Routine Antenatal)"
            >
              <UserCheck className="w-3.5 h-3.5 text-slate-700" />
              <span>Load Demo Patient (Zainab 24W)</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. EMERGENCY SAFETY CHECK (THE RED FLAG STOP) */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs relative overflow-hidden">
        <div className="flex items-start gap-3 pb-3 mb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[10px] font-bold uppercase tracking-wider border border-slate-200">
                Step 1 • Mandatory Clinical Gate
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-950 tracking-tight">
                1. Emergency Safety Check (The Red Flag Stop)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Strict statutory clinical triage to identify time-critical maternal and fetal complications before any video booking.
            </p>
          </div>
        </div>

        {/* The Exact User Specification Emergency Notice Callout */}
        <div className="p-4 bg-red-50/80 rounded-xl border border-red-200 shadow-2xs mb-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-red-600 text-white rounded-lg shrink-0 mt-0.5">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs sm:text-sm font-bold text-red-950 tracking-tight">
                Emergency Notice:
              </h4>
              <blockquote className="text-xs sm:text-sm text-red-900 font-semibold leading-relaxed border-l-2 border-red-400 pl-3 italic">
                &ldquo;If you are experiencing active heavy vaginal bleeding in pregnancy, severe abdominal pain, or decreased fetal movement, do not use this app. Go immediately to LAUTECH Hospital Emergency.&rdquo;
              </blockquote>
            </div>
          </div>
        </div>

        {/* Interactive Red Flag Checklist (Patient Safety Screener) */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">
              Check any symptoms currently present (Self-Screening Barrier):
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              Zero tolerance for acute obstetric emergencies
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {LAUTECH_OBGYN_PROTOCOL.redFlagTriggers.map((flag) => {
              const isChecked = selectedRedFlags.includes(flag.id);
              return (
                <label
                  key={flag.id}
                  onClick={() => toggleRedFlag(flag.id)}
                  className={`flex items-start gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-all min-h-[44px] select-none ${
                    isChecked
                      ? 'bg-red-50/80 border-red-300 text-red-950 font-bold shadow-xs'
                      : 'bg-slate-50/70 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 border ${
                    isChecked ? 'bg-red-600 border-red-600 text-white' : 'border-slate-300 bg-white'
                  }`}>
                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span className="leading-snug">{flag.label}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Dynamic Red Flag Stop Activation Notice */}
        {hasEmergencyRedFlags ? (
          <div className="mt-4 p-4 rounded-xl bg-red-700 text-white shadow-md">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white/20 rounded-lg shrink-0 mt-1 md:mt-0">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-bold tracking-tight">
                    RED FLAG STOP ACTIVATED: Virtual Consultation Prohibited
                  </h4>
                  <p className="text-xs text-red-100 mt-1 max-w-2xl leading-relaxed">
                    You have flagged one or more acute emergency signs ({selectedRedFlags.length} detected). 
                    Under LAUTECH clinical governance rules, virtual appointments cannot treat active obstetric emergencies. 
                    Please report immediately to the nearest maternity casualty.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto shrink-0">
                <a
                  href="tel:08005288324"
                  className="w-full sm:w-auto px-4 py-2.5 bg-white hover:bg-red-50 text-red-700 font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition min-h-[42px] whitespace-nowrap"
                >
                  <PhoneCall className="w-4 h-4 text-red-600" />
                  <span>Call 0800-LAUTECH (24/7 ER)</span>
                </a>
                <button
                  type="button"
                  onClick={() => setSelectedRedFlags([])}
                  className="w-full sm:w-auto px-3 py-2.5 bg-red-800 hover:bg-red-900 text-white text-xs font-semibold rounded-xl border border-white/20 transition min-h-[42px]"
                >
                  Clear Selection
                </button>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-red-600 flex flex-wrap items-center gap-3 text-[11px] text-red-100">
              <span className="font-bold flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> Emergency Centers:
              </span>
              <span>LAUTECH Teaching Hospital Main Casualty (General Hospital Rd, Ogbomoso)</span>
              <span>•</span>
              <span>Osogbo Trauma &amp; Maternity Complex</span>
            </div>
          </div>
        ) : (
          <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-slate-700 shrink-0" />
              <span>
                <strong>Red Flag Screener Passed:</strong> Zero emergency obstetric red flags indicated. Eligible for elective virtual triage.
              </span>
            </div>
            <span className="text-[10px] font-bold text-slate-800 uppercase tracking-wider bg-slate-200 px-2 py-0.5 rounded">
              Cleared
            </span>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. CORE ELECTIVE FOCUS (WHAT TELEMEDICINE SOLVES HERE) */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs">
        <div className="flex items-start gap-3 pb-3 mb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
            <Baby className="w-5 h-5 text-slate-700" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[10px] font-bold uppercase tracking-wider border border-slate-200">
                Step 2 • Scope of Virtual Practice
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                2. Core Elective Focus (What Telemedicine Solves Here)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Targeted virtual clinical tracks for stable outpatients without the stress of physical waiting rooms.
            </p>
          </div>
        </div>

        {/* The Exact User Specification Core Elective Focus Banner */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 shadow-2xs mb-5">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-slate-900 text-white rounded-lg shrink-0 mt-0.5">
              <Building2 className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs sm:text-sm font-bold text-slate-950 tracking-tight">
                Elective Outpatient Care:
              </h4>
              <blockquote className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed border-l-2 border-slate-400 pl-3">
                &ldquo;This telehealth channel is designed for routine antenatal reviews, postpartum check-ins, menstrual tracking, contraceptive counseling, and stable gynecological care that does not require an immediate physical examination.&rdquo;
              </blockquote>
            </div>
          </div>
        </div>

        {/* 5 Clinical Focus Areas (Interactive Track Selector) */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-700">
            Select Your Elective Clinical Track:
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {LAUTECH_OBGYN_PROTOCOL.eligibleCategories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <div
                  key={cat.id}
                  onClick={() => handleSelectElectiveCategory(cat.id)}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between min-h-[120px] ${
                    isSelected
                      ? 'border-slate-900 bg-slate-100 text-slate-950 font-bold ring-1 ring-slate-900 shadow-xs'
                      : 'border-slate-200 bg-white hover:bg-slate-50/80'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        isSelected ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {cat.badge}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {cat.typicalReviewTime}
                      </span>
                    </div>
                    <h5 className="font-bold text-slate-900 text-xs sm:text-sm leading-snug">
                      {cat.title}
                    </h5>
                    <p className="text-[11px] text-slate-600 mt-1 leading-relaxed font-normal">
                      {cat.description}
                    </p>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-200 text-[10px] text-slate-700 font-semibold flex items-center justify-between">
                    <span>Non-emergency virtual scope</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-slate-900" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Narrative & Clinical Details for Dr. Adebayo */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-1">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Gestation / Cycle Status
            </label>
            <input
              type="text"
              value={gestationalAgeOrCycle}
              onChange={(e) => setGestationalAgeOrCycle(e.target.value)}
              placeholder="e.g. 24 Weeks Gestation"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-slate-900 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Patient Review Narrative &amp; Questions for {obgynSpecialist.name}
            </label>
            <input
              type="text"
              value={patientNotes}
              onChange={(e) => setPatientNotes(e.target.value)}
              placeholder="Describe what you would like to review during your virtual appointment..."
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-slate-900 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. PATIENT SAFETY ACKNOWLEDGMENT */}
      {/* ========================================================================= */}
      <div className={`bg-white rounded-2xl border p-4 sm:p-6 shadow-xs transition-all ${
        attemptedWithoutAck && !safetyAcknowledged 
          ? 'border-red-400 bg-red-50/30 ring-2 ring-red-200' 
          : 'border-slate-200'
      }`}>
        <div className="flex items-start gap-3 pb-3 mb-3 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-2xs mt-0.5 bg-slate-900 text-white">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[10px] font-bold uppercase tracking-wider border border-slate-200">
                Step 3 • Mandatory Legal &amp; Clinical Checkpoint
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                3. Patient Safety Acknowledgment
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Informed patient declaration under Medical and Dental Council of Nigeria (MDCN) Telemedicine Regulations.
            </p>
          </div>
        </div>

        {/* Interactive Safety Checkbox - Exact User Requirement */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 shadow-2xs">
          <label className="flex items-start gap-3.5 cursor-pointer select-none">
            <div className="pt-0.5">
              <input
                type="checkbox"
                id="patientSafetyAckCheckbox"
                checked={safetyAcknowledged}
                onChange={(e) => {
                  setSafetyAcknowledged(e.target.checked);
                  if (e.target.checked) setAttemptedWithoutAck(false);
                }}
                className="w-5 h-5 text-slate-900 rounded border-slate-300 focus:ring-slate-900 focus:ring-offset-0 cursor-pointer"
              />
            </div>
            <div className="space-y-1 flex-1">
              <div className="text-xs sm:text-sm font-semibold text-slate-950 leading-snug">
                {LAUTECH_OBGYN_PROTOCOL.safetyAcknowledgmentText}
              </div>
            </div>
          </label>
        </div>

        {attemptedWithoutAck && !safetyAcknowledged && (
          <div className="mt-3 p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-900 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>
              <strong>Un-skippable Requirement:</strong> You must check the Patient Safety Acknowledgment above to confirm non-emergency status before booking.
            </span>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 4. MATCHED SPECIALIST VIEW */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs">
        <div className="flex items-start gap-3 pb-3 mb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
            <UserCheck className="w-5 h-5 text-slate-700" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[10px] font-bold uppercase tracking-wider border border-slate-200">
                Step 4 • Verified Clinical Assignment
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                4. Matched Specialist View
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Consultant obstetrician matched via institutional protocol specifications.
            </p>
          </div>
        </div>

        {/* Specialist Choice Selector */}
        <div className="mb-4">
          <label className="block text-xs font-bold text-slate-800 mb-2">
            Select Attending OB/GYN Consultant:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {obgynSpecialists.map((spec) => {
              const isSelected = spec.id === obgynSpecialist.id;
              const initials = getSpecialistInitials(spec.name);
              return (
                <button
                  key={spec.id}
                  type="button"
                  onClick={() => {
                    setSelectedSpecialistId(spec.id);
                    if (spec.availableSlots && spec.availableSlots.length > 0) {
                      setSelectedTime(spec.availableSlots[0].time);
                    }
                  }}
                  className={`p-3.5 rounded-xl border text-left transition flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'border-slate-900 bg-white ring-2 ring-slate-900 shadow-xs'
                      : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                      isSelected ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                        {spec.name}
                      </div>
                      <div className="text-[11px] text-slate-600 truncate">
                        {spec.title}
                      </div>
                    </div>
                  </div>
                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Specialist Profile Card */}
        <div className="p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200 shadow-2xs mb-5">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg sm:text-xl shadow-xs shrink-0">
                {getSpecialistInitials(obgynSpecialist.name)}
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-base sm:text-lg font-bold text-slate-950 tracking-tight">
                    {obgynSpecialist.name}
                  </h4>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-900 text-white rounded">
                    Matched Specialist
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-200 text-slate-800 rounded border border-slate-300">
                    Verified Consultant
                  </span>
                </div>
                <p className="text-xs text-slate-700 font-semibold">
                  {obgynSpecialist.title} • {obgynSpecialist.qualifications}
                </p>
                <p className="text-[11px] text-slate-500">
                  {obgynSpecialist.institution}
                </p>
              </div>
            </div>

            {/* Protocol & Routing Badge Group */}
            <div className="flex flex-col gap-1.5 p-3 bg-white rounded-xl border border-slate-200 shadow-2xs w-full md:w-auto text-xs">
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-500 font-medium text-[11px]">Routing:</span>
                <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                  {LAUTECH_OBGYN_PROTOCOL.routing}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-500 font-medium text-[11px]">Protocol:</span>
                <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                  {LAUTECH_OBGYN_PROTOCOL.name}
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
                Clinical Expertise &amp; Maternal Triage:
              </span>
              <ul className="space-y-0.5 text-[11px]">
                {obgynSpecialist.precisionExpertise.map((exp, i) => (
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
                Direct WebRTC encrypted video and audio channel optimized for 3G/4G networks with digital prescription generation, follow-up scheduling, and patient-held record sync.
              </p>
            </div>
          </div>
        </div>

        {/* Schedule & Timing Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-700" />
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
              <Clock className="w-3.5 h-3.5 text-slate-700" />
              <span>Elective Consultation Slot (WAT)</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {obgynSpecialist.availableSlots.map((slot, i) => (
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
                  placeholder="e.g. REL-OBG-33918-LAUT"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                />
              </div>
            </div>
          ) : (
            <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
              <span>Standard LAUTECH Virtual Outpatient Fee: <strong>₦5,000</strong></span>
              <span className="text-[11px] text-slate-700 font-semibold">Subsidized Pilot Rate</span>
            </div>
          )}
        </div>

        {/* Confirmation State Banner if Booked */}
        {isBooked && confirmedBookingId ? (
          <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 animate-fadeIn">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm sm:text-base font-bold text-slate-950">
                    Elective OB/GYN Appointment Confirmed!
                  </h4>
                  <span className="font-mono text-xs px-2 py-0.5 bg-slate-200 text-slate-900 font-bold rounded">
                    {confirmedBookingId}
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Scheduled with <strong>{obgynSpecialist.name}</strong> for <strong>{selectedDate} at {selectedTime}</strong> under the <em>{LAUTECH_OBGYN_PROTOCOL.name}</em>.
                  Encrypted video room created and synced to patient and clinician dashboards.
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
              <ShieldCheck className="w-4 h-4 text-slate-700" />
              <span>Safety screening passed • Routed to {obgynSpecialist.name}</span>
            </div>

            <button
              onClick={handleConfirmObGynBooking}
              disabled={hasEmergencyRedFlags}
              className={`w-full sm:w-auto px-6 py-3 font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition min-h-[44px] ${
                hasEmergencyRedFlags
                  ? 'bg-red-200 text-red-800 cursor-not-allowed'
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
            >
              {hasEmergencyRedFlags ? (
                <>
                  <AlertTriangle className="w-4 h-4" />
                  <span>Blocked: Emergency Red Flags Present</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-slate-300" />
                  <span>Book Elective Consultation with {obgynSpecialist.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
