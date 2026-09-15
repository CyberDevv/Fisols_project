import React, { useState } from 'react';
import { Header } from './components/Header';
import { BookingWizard } from './components/booking/BookingWizard';
import { ObGynTelehealthModule } from './components/obgyn/ObGynTelehealthModule';
import { SurgeryUrologyModule } from './components/surgery-urology/SurgeryUrologyModule';
import { PrecisionConsultationRoom } from './components/consultation/PrecisionConsultationRoom';
import { ArchitectureSpecView } from './components/architecture/ArchitectureSpecView';
import { NDPRModal } from './components/compliance/NDPRModal';
import { JsonDatabaseModal } from './components/database/JsonDatabaseModal';
import { NetworkQuality, AppointmentBooking } from './types';
import { ClinicalStateProvider, useClinicalState } from './context/ClinicalStateContext';
import { Database, CheckCircle2 } from 'lucide-react';

function MainTelehealthApp() {
  const [currentTab, setCurrentTab] = useState<'booking' | 'obgyn' | 'surgery-urology' | 'consultation' | 'architecture'>('booking');
  const [networkQuality, setNetworkQuality] = useState<NetworkQuality>('4G_HIGH');
  const [isNdprOpen, setIsNdprOpen] = useState<boolean>(false);
  const [isDatabaseOpen, setIsDatabaseOpen] = useState<boolean>(false);

  const { 
    appointments, 
    activeAppointment, 
    createAppointment,
    setActiveAppointmentId,
    isSyncing,
    lastApiAction
  } = useClinicalState();

  const handleAppointmentConfirmed = (newBooking: AppointmentBooking) => {
    createAppointment(newBooking);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Institutional Ethical Clearance & Research Prototype Disclaimer Banner */}
      <div className="bg-amber-500/10 border-b border-amber-300/70 text-amber-950 text-xs px-3 sm:px-6 py-2">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-600 text-white font-bold text-[10px] tracking-wide uppercase shrink-0 shadow-2xs">
              Governance Notice
            </span>
            <p className="font-medium text-slate-800 text-[11px] sm:text-xs">
              <strong className="text-amber-950 font-bold">Pilot Research Prototype</strong> – Pending LAUTECH Teaching Hospital Ethics &amp; Research Committee Approval.
            </p>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-600">
            <span className="hidden md:inline text-slate-500 font-mono">Protocol Ref: LTH/ERC/2026/PILOT-091</span>
            <button
              onClick={() => setCurrentTab('architecture')}
              className="inline-flex items-center gap-1 font-semibold text-blue-700 hover:text-blue-900 transition-colors"
            >
              <span>Governance &amp; Team</span>
              <span>&rarr;</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top Application Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        networkQuality={networkQuality}
        setNetworkQuality={setNetworkQuality}
        onOpenNdprModal={() => setIsNdprOpen(true)}
        onOpenDatabaseModal={() => setIsDatabaseOpen(true)}
        isSyncing={isSyncing}
        activeAppointmentCount={appointments.length}
      />

      {/* Main Viewport Body */}
      <main className="flex-1">
        {currentTab === 'booking' && (
          <BookingWizard
            networkQuality={networkQuality}
            onAppointmentConfirmed={handleAppointmentConfirmed}
            onOpenConsultation={() => setCurrentTab('consultation')}
            onOpenNdprModal={() => setIsNdprOpen(true)}
            onNavigateToObGyn={() => setCurrentTab('obgyn')}
            onNavigateToSurgeryUrology={() => setCurrentTab('surgery-urology')}
          />
        )}

        {currentTab === 'obgyn' && (
          <ObGynTelehealthModule
            networkQuality={networkQuality}
            onAppointmentBooked={handleAppointmentConfirmed}
            onNavigateToConsultation={() => setCurrentTab('consultation')}
            onOpenNdprModal={() => setIsNdprOpen(true)}
          />
        )}

        {currentTab === 'surgery-urology' && (
          <SurgeryUrologyModule
            networkQuality={networkQuality}
            onAppointmentBooked={handleAppointmentConfirmed}
            onNavigateToConsultation={() => setCurrentTab('consultation')}
            onOpenNdprModal={() => setIsNdprOpen(true)}
          />
        )}

        {currentTab === 'consultation' && (
          <PrecisionConsultationRoom
            networkQuality={networkQuality}
            setNetworkQuality={setNetworkQuality}
            activeBooking={activeAppointment}
            onOpenBooking={() => setCurrentTab('booking')}
            onOpenDatabaseModal={() => setIsDatabaseOpen(true)}
          />
        )}

        {currentTab === 'architecture' && (
          <ArchitectureSpecView
            networkQuality={networkQuality}
            onNavigateToBooking={() => setCurrentTab('booking')}
            onNavigateToConsultation={() => setCurrentTab('consultation')}
          />
        )}
      </main>

      {/* Persistent NDPR & Data Sovereignty Modal */}
      <NDPRModal
        isOpen={isNdprOpen}
        onClose={() => setIsNdprOpen(false)}
      />

      {/* Clinical JSON Database & Backend Console Modal */}
      <JsonDatabaseModal
        isOpen={isDatabaseOpen}
        onClose={() => setIsDatabaseOpen(false)}
        onNavigateToConsultation={(aptId) => {
          setActiveAppointmentId(aptId);
          setCurrentTab('consultation');
        }}
      />

      {/* Real-Time Database Sync / REST Activity Notification */}
      {lastApiAction && (
        <aside 
          aria-label="Database activity notifications"
          className={`fixed bottom-4 right-4 z-40 transition-all duration-300 transform pointer-events-none ${
            isSyncing ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-2 opacity-0 scale-95'
          }`}
        >
          <div className="bg-slate-950/95 text-slate-100 text-xs px-3.5 py-2 rounded-xl border border-slate-800 shadow-2xl flex items-center gap-2.5 backdrop-blur-md">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
            <Database className="w-3.5 h-3.5 text-blue-400" />
            <div className="flex flex-col">
              <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">JSON DB Sync</span>
              <span className="font-semibold text-[11px] text-emerald-300">{lastApiAction}</span>
            </div>
            <CheckCircle2 className="w-4 h-4 text-emerald-400 ml-1" />
          </div>
        </aside>
      )}

      {/* Institutional Hospital Platform & Founder Attribution Footer */}
      <footer className="border-t border-slate-200/90 bg-white/90 backdrop-blur-xs py-6 text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          {/* Top Row: Institution, Ethics Status & Compliance Badges */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 text-center lg:text-left">
              <span className="font-bold text-slate-950 tracking-tight text-sm">
                KBF Precision Genomedix Ltd
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-700 font-medium">
                LAUTECH Teaching Hospital Clinical Pilot
              </span>
              <span className="text-slate-300">•</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-[11px] font-semibold">
                Pending LAUTECH Ethics &amp; Research Committee Approval
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 text-[11px]">
              <span className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/80">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                NDPR 2019 / NDPA 2023 Compliant
              </span>
              <span className="inline-flex items-center gap-1.5 text-blue-700 font-semibold bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200/80">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                UniGeneva CPIC Level 1A CDS
              </span>
            </div>
          </div>

          {/* Bottom Row: Lead Founder & Multidisciplinary Engineering Attribution */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] text-slate-600">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="font-semibold text-slate-900">Lead Founder:</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200/70 text-slate-900 font-bold rounded-md border border-slate-200 transition-colors">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                Kamil-Bello Faisol, 500L Med Student, LAUTECH
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 text-slate-500">
              <span className="text-slate-700">
                <strong className="text-slate-800">Clinical Lead:</strong> Prof. Adeseye Akintunde (Consultant Cardiologist)
              </span>
              <span className="hidden sm:inline text-slate-300">•</span>
              <span className="text-slate-700">
                <strong className="text-slate-800">Engineering Team:</strong> Engr. Teslim Komolafe, Engr. Oladipo Ridwan Kolawole, Engr. Odesola Ibrahim
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ClinicalStateProvider>
      <MainTelehealthApp />
    </ClinicalStateProvider>
  );
}
