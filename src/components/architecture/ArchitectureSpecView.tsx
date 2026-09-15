import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Database, 
  Check, 
  Copy, 
  Stethoscope, 
  CalendarCheck,
  Building2,
  ArrowRight,
  Server,
  Key,
  Layers,
  Cpu,
  AlertCircle,
  AlertTriangle
} from 'lucide-react';
import { SAMPLE_COMPLIANCE_LOGS } from '../../data/clinicalData';
import { NetworkQuality } from '../../types';

interface ArchitectureSpecViewProps {
  networkQuality: NetworkQuality;
  onNavigateToBooking: () => void;
  onNavigateToConsultation: () => void;
}

export const ArchitectureSpecView: React.FC<ArchitectureSpecViewProps> = ({
  networkQuality,
  onNavigateToBooking,
  onNavigateToConsultation
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [anonymizeResearch, setAnonymizeResearch] = useState<boolean>(true);

  const handleCopyOverviewText = () => {
    const text = `KBF PRECISION GENOMEDIX LTD: PLATFORM ARCHITECTURE & STANDARDS
Lead Founder & Clinical Innovator: Kamil-Bello Faisol (500L Medical Student, LAUTECH)
Clinical Mentor & Academic Sponsor: Prof. Adeseye Akintunde (Consultant Cardiologist, LAUTECH)
Engineering Leads: Engr. Teslim Komolafe, Engr. Oladipo Ridwan Kolawole, Engr. Odesola Ibrahim
Status: Pilot Research Prototype – Pending LAUTECH Teaching Hospital Ethics & Research Committee Approval
Clinical Host: LAUTECH Teaching Hospital (Ogbomoso / Osogbo)
Clinical Protocol: University of Geneva Precision Medicine & CPIC Level 1A
Regulatory Compliance: NDPR 2019 / NDPA 2023, MDCN Telemedicine Guidelines
Emergency Protocol: Mandatory Redirection to LAUTECH Emergency Department (0800-LAUTECH)
Encryption: AES-256 (Data at rest), TLS 1.3 (In transit & WebRTC)`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-5 sm:space-y-6">
      {/* Top Standards & Hospital Governance Header - Modern Clinical Standards */}
      <div className="bg-white text-slate-900 rounded-2xl p-4 sm:p-7 shadow-[0_1px_3px_0_rgba(0,0,0,0.03)] border border-slate-200/80">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200/70">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                Hospital Governance &amp; Patient Safety Standards
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200/70">
                LAUTECH Teaching Hospital Network
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 text-xs font-semibold border border-amber-200">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                Pilot Research Prototype – Pending LAUTECH Ethics Approval
              </span>
            </div>
            <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-slate-950 font-sans">
              Clinical Governance, Safety Standards &amp; Patient Privacy
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-3xl leading-relaxed">
              Institutional telehealth infrastructure compliant with Medical and Dental Council of Nigeria (MDCN) regulations, Nigeria Data Protection Regulation (NDPR 2019 / NDPA 2023), and University of Geneva pharmacogenomic clinical guidelines.
            </p>
          </div>

          <div className="w-full lg:w-auto shrink-0">
            <button
              onClick={handleCopyOverviewText}
              className="w-full sm:w-auto px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-xs hover:shadow-sm transition-all min-h-[42px]"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-blue-300" />}
              <span>{copied ? 'Copied Standards Summary!' : 'Copy Clinical Standards'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* CORE INFRASTRUCTURE & LEADERSHIP TEAM */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 sm:pb-4 mb-4 border-b border-slate-100 gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#005eb8]">
              CLINICAL &amp; BIOMEDICAL GOVERNANCE
            </span>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
              Lead Founder, Clinical Directorate &amp; Engineering Team
            </h3>
            <p className="text-xs text-slate-600">
              Founded by LAUTECH medical innovator Kamil-Bello Faisol with clinical mentorship from Prof. Adeseye Akintunde and multidisciplinary software engineering leads.
            </p>
          </div>
          <span className="self-start sm:self-auto px-2.5 py-1 text-xs bg-slate-100 text-slate-700 font-semibold rounded-md border border-slate-200 flex items-center gap-1 shrink-0">
            <Lock className="w-3 h-3 text-slate-500" /> TLS 1.3 / AES-256
          </span>
        </div>

        {/* Leadership Cards - 5 Member Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5 mb-6">
          {/* Lead Founder */}
          <div className="p-3.5 bg-blue-50/70 border-2 border-blue-300 rounded-xl relative">
            <span className="absolute -top-2.5 left-3 px-2 py-0.5 bg-blue-700 text-white text-[9px] font-bold rounded uppercase tracking-wider">
              Lead Founder
            </span>
            <div className="flex items-center gap-2 mb-2 mt-1">
              <div className="w-8 h-8 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold text-xs">
                KF
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-xs">Kamil-Bello Faisol</h4>
                <p className="text-[10px] text-blue-700 font-semibold">500L Med Student, LAUTECH</p>
              </div>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Platform conceptualizer and research lead driving low-bandwidth pharmacogenomic clinical integration for Nigerian healthcare delivery.
            </p>
          </div>

          {/* Clinical Mentor */}
          <div className="p-3.5 bg-slate-50/80 border border-slate-200 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-[#005eb8] text-white flex items-center justify-center font-bold text-xs">
                AA
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-xs">Prof. Adeseye Akintunde</h4>
                <p className="text-[10px] text-slate-500 font-medium">MBBS, FMCP, FWACP, FACP</p>
              </div>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Professor of Medicine and Consultant Cardiologist at LAUTECH Teaching Hospital. Clinical mentor guiding cardiovascular triage protocols.
            </p>
          </div>

          {/* Engineering Lead 1 */}
          <div className="p-3.5 bg-slate-50/80 border border-slate-200 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-slate-700 text-white flex items-center justify-center font-bold text-xs">
                TK
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-xs">Engr. Teslim Komolafe</h4>
                <p className="text-[10px] text-slate-500 font-medium">Head of Telemedicine Systems</p>
              </div>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Leads hospital network infrastructure, multi-zone server redundancy, and low-latency clinical databases across Nigerian data nodes.
            </p>
          </div>

          {/* Engineering Lead 2 */}
          <div className="p-3.5 bg-slate-50/80 border border-slate-200 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-slate-700 text-white flex items-center justify-center font-bold text-xs">
                OK
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-xs">Engr. Oladipo R. Kolawole</h4>
                <p className="text-[10px] text-slate-500 font-medium">Lead Cryptography &amp; Security</p>
              </div>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Maintains TLS 1.3 WebRTC video encryption, zero-leakage signaling, and cryptographic digital signature seals for digital prescriptions.
            </p>
          </div>

          {/* Engineering Lead 3 */}
          <div className="p-3.5 bg-slate-50/80 border border-slate-200 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-slate-700 text-white flex items-center justify-center font-bold text-xs">
                OI
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-xs">Engr. Odesola Ibrahim</h4>
                <p className="text-[10px] text-slate-500 font-medium">Lead Health Informatics</p>
              </div>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Integrates the University of Geneva pharmacogenomic parsing engine, NDPR consent pipelines, research de-identification, and offline caching.
            </p>
          </div>
        </div>

        {/* Security, Reliability & Emergency Safety Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {/* Encryption */}
          <div className="p-4 bg-white border border-slate-200 rounded-lg space-y-2 shadow-2xs">
            <div className="flex items-center gap-2 text-slate-900 font-semibold text-xs">
              <Lock className="w-3.5 h-3.5 text-[#005eb8]" />
              <span>Clinical Data Encryption</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              AES-256 encryption protects all patient electronic health records, consultation notes, and genomic biomarker panels. TLS 1.3 secures real-time video feeds.
            </p>
            <div className="pt-1 text-[11px] text-slate-500">
              Security Status: <span className="text-emerald-700 font-bold">Active &amp; Audited</span>
            </div>
          </div>

          {/* NDPR Compliance */}
          <div className="p-4 bg-white border border-slate-200 rounded-lg space-y-2 shadow-2xs">
            <div className="flex items-center gap-2 text-slate-900 font-semibold text-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>NDPR / NDPA Consent Checkpoint</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Un-skippable informed consent, explicit genomic data processing permission, and automated de-identification pipelines stripping personal identifiers.
            </p>
            <label className="flex items-center gap-2 text-[11px] font-semibold text-slate-700 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={anonymizeResearch}
                onChange={(e) => setAnonymizeResearch(e.target.checked)}
                className="rounded border-slate-300 text-[#005eb8] focus:ring-[#005eb8]"
              />
              <span>Anonymize Research Data</span>
            </label>
          </div>

          {/* Offline-First Sync */}
          <div className="p-4 bg-white border border-slate-200 rounded-lg space-y-2 shadow-2xs">
            <div className="flex items-center gap-2 text-slate-900 font-semibold text-xs">
              <Database className="w-3.5 h-3.5 text-[#005eb8]" />
              <span>Low-Bandwidth Resilience</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Client-side local caching preserves consultation intake and triage records during 3G cell drops, automatically syncing when connectivity returns.
            </p>
            <div className="text-[11px] text-slate-500 pt-1">
              Local Cache: <strong className="text-slate-800">14.2 MB</strong> staged • 0 errors
            </div>
          </div>

          {/* Emergency Redirection Protocol */}
          <div className="p-4 bg-rose-50/50 border border-rose-200 rounded-lg space-y-2 shadow-2xs">
            <div className="flex items-center gap-2 text-rose-950 font-semibold text-xs">
              <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
              <span>Emergency Casualty Trigger</span>
            </div>
            <p className="text-[11px] text-rose-900 leading-relaxed">
              Automated safety triggers detect life-threatening chest distress or acute dyspnea, immediately redirecting patients to the nearest LAUTECH Emergency Department.
            </p>
            <div className="text-[11px] text-rose-800 font-bold pt-1">
              Emergency Dispatch: 0800-LAUTECH (24/7)
            </div>
          </div>
        </div>
      </div>

      {/* TWO PRIMARY CLINICAL PATHWAYS - Clean Hospital Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Patient Experience */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="p-2 bg-blue-50 text-[#005eb8] rounded-lg border border-blue-200">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#005eb8]">PATIENT PORTAL</span>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">Outpatient Specialist Booking</h3>
              </div>
            </div>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Patient pathway connecting individuals with consultant physicians at LAUTECH Teaching Hospital:
            </p>
            <ol className="space-y-2 text-xs text-slate-700">
              <li className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <strong className="text-slate-900">1. Verification:</strong> Phone/email registration with instant SMS OTP authentication.
              </li>
              <li className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <strong className="text-slate-900">2. Clinical Triage:</strong> Evaluates symptom urgency and matches patient with the appropriate clinical department.
              </li>
              <li className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <strong className="text-slate-900">3. Document Compression:</strong> In-browser image compression reducing mobile data usage by over 90%.
              </li>
              <li className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <strong className="text-slate-900">4. HMO Pre-Authorization:</strong> Instant coverage checks with Hygeia, Reliance, AXA Mansard, or card payment.
              </li>
              <li className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <strong className="text-slate-900">5. Appointment Confirmation:</strong> SMS reminders and immediate pass to the virtual consultation room.
              </li>
            </ol>
          </div>
          <button
            onClick={onNavigateToBooking}
            className="mt-5 w-full py-3 bg-[#005eb8] hover:bg-[#004b94] text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-sm min-h-[44px]"
          >
            <span>Book Outpatient Appointment</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Doctor Experience */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="p-2 bg-blue-50 text-[#005eb8] rounded-lg border border-blue-200">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#005eb8]">CLINICAL SUITE</span>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">Physician Consultation &amp; CDS Console</h3>
              </div>
            </div>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Specialist consultation workstation with University of Geneva pharmacogenomic safety intelligence:
            </p>
            <ol className="space-y-2 text-xs text-slate-700">
              <li className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <strong className="text-slate-900">1. Adaptive WebRTC Video:</strong> Smooth video that automatically switches to audio mode if bandwidth drops.
              </li>
              <li className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <strong className="text-slate-900">2. Integrated EHR:</strong> Vitals, allergies, medical history, and biomarker panels in a single screen.
              </li>
              <li className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <strong className="text-slate-900">3. Geneva Pharmacogenomic CDS:</strong> Real-time drug-gene interaction warnings (e.g. Clopidogrel resistance in CYP2C19 *2/*2).
              </li>
              <li className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <strong className="text-slate-900">4. Signed Digital Prescriptions:</strong> SHA-256 cryptographically sealed prescriptions dispatched to licensed pharmacies.
              </li>
              <li className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <strong className="text-slate-900">5. 48-Hour Recovery Follow-Up:</strong> Automated post-encounter check-in logging recovery progression.
              </li>
            </ol>
          </div>
          <button
            onClick={onNavigateToConsultation}
            className="mt-5 w-full py-3 bg-[#003087] hover:bg-[#002266] text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-sm min-h-[44px]"
          >
            <span>Enter Doctor Consultation Room</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* LIVE AUDIT LOG TABLE - Hospital Standards Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 mb-4 border-b border-slate-100 gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 tracking-tight">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              Hospital Compliance &amp; Patient Record Audit Log
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Verifiable log of cryptographic integrity hashes, consent acknowledgments, and clinical encounters under NDPR 2019 / NDPA 2023.
            </p>
          </div>
          <span className="self-start sm:self-auto text-[11px] sm:text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 shrink-0">
            LAUTECH Clinical Node #04 (Secure)
          </span>
        </div>

        <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
          <table className="w-full text-left text-xs min-w-[620px]">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 text-[11px] uppercase font-bold">
                <th className="pb-2">Timestamp (WAT)</th>
                <th className="pb-2">Actor / Role</th>
                <th className="pb-2">Clinical / Security Event</th>
                <th className="pb-2">Data Classification</th>
                <th className="pb-2">Standard</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {SAMPLE_COMPLIANCE_LOGS.map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-2.5 font-mono text-[11px] text-slate-500">{entry.timestamp}</td>
                  <td className="py-2.5 font-semibold text-slate-800">{entry.actor}</td>
                  <td className="py-2.5 text-slate-600">{entry.action}</td>
                  <td className="py-2.5">
                    <span className="px-2 py-0.5 bg-blue-50 text-[#005eb8] rounded text-[10px] font-semibold border border-blue-100">
                      {entry.dataCategory}
                    </span>
                  </td>
                  <td className="py-2.5">
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[10px] font-semibold border border-emerald-200">
                      {entry.encryptionStandard}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
