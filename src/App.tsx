import React, { useState } from 'react';
import { Header } from './components/Header';
import { BookingWizard } from './components/booking/BookingWizard';
import { FamilyMedicineModule } from './components/family-medicine/FamilyMedicineModule';
import { ObGynTelehealthModule } from './components/obgyn/ObGynTelehealthModule';
import { SurgeryUrologyModule } from './components/surgery-urology/SurgeryUrologyModule';
import { PrecisionConsultationRoom } from './components/consultation/PrecisionConsultationRoom';
import { ArchitectureSpecView } from './components/architecture/ArchitectureSpecView';
import { NDPRModal } from './components/compliance/NDPRModal';
import { JsonDatabaseModal } from './components/database/JsonDatabaseModal';
import { NemlBrowserModal } from './components/neml/NemlBrowserModal';
import { NetworkQuality, AppointmentBooking, NemlDrug } from './types';
import { ClinicalStateProvider, useClinicalState } from './context/ClinicalStateContext';
import { Database, CheckCircle2, ShieldCheck } from 'lucide-react';

function MainTelehealthApp() {
  const [currentTab, setCurrentTab] = useState<'booking' | 'family-medicine' | 'obgyn' | 'surgery-urology' | 'consultation' | 'architecture'>('booking');
  const [networkQuality, setNetworkQuality] = useState<NetworkQuality>('4G_HIGH');
  const [isNdprOpen, setIsNdprOpen] = useState<boolean>(false);
  const [isDatabaseOpen, setIsDatabaseOpen] = useState<boolean>(false);
  const [isNemlOpen, setIsNemlOpen] = useState<boolean>(false);
  const [nemlCategory, setNemlCategory] = useState<string>('All Categories');

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
    <div className="min-h-screen bg-slate-50/70 text-slate-900 flex flex-col font-sans selection:bg-slate-800 selection:text-white">
      {/* Institutional Ethical Clearance & Research Prototype Disclaimer Banner */}
      <div className="bg-slate-100/90 border-b border-slate-200 text-slate-700 text-xs px-3 sm:px-6 py-1.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800 text-white font-semibold text-[10px] tracking-wide uppercase shrink-0">
              Governance
            </span>
            <p className="font-normal text-slate-700 text-[11px] sm:text-xs">
              <strong className="text-slate-900 font-semibold">Pilot Research Prototype</strong> — Pending LAUTECH Teaching Hospital Ethics &amp; Research Committee Approval.
            </p>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-500">
            <span className="hidden md:inline font-mono">Ref: LTH/ERC/2026/PILOT-091</span>
            <button
              onClick={() => setCurrentTab('architecture')}
              className="inline-flex items-center gap-1 font-medium text-slate-900 hover:text-slate-700 underline underline-offset-2 transition-colors"
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
        onOpenNemlModal={() => {
          setNemlCategory('All Categories');
          setIsNemlOpen(true);
        }}
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
            onNavigateToFamilyMedicine={() => setCurrentTab('family-medicine')}
            onNavigateToObGyn={() => setCurrentTab('obgyn')}
            onNavigateToSurgeryUrology={() => setCurrentTab('surgery-urology')}
          />
        )}

        {currentTab === 'family-medicine' && (
          <FamilyMedicineModule
            networkQuality={networkQuality}
            onAppointmentBooked={handleAppointmentConfirmed}
            onNavigateToConsultation={() => setCurrentTab('consultation')}
            onOpenNdprModal={() => setIsNdprOpen(true)}
            onOpenNemlModal={(cat) => {
              if (cat) setNemlCategory(cat);
              setIsNemlOpen(true);
            }}
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

      {/* Nigeria National Essential Medicines List (NEML 8th Ed.) Modal & API Console */}
      <NemlBrowserModal
        isOpen={isNemlOpen}
        onClose={() => setIsNemlOpen(false)}
        activePatient={activeAppointment?.patient || null}
        initialCategory={nemlCategory}
        onSelectDrugForPrescription={() => {
          setIsNemlOpen(false);
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
            <div className="w-2 h-2 rounded-full bg-slate-400 animate-ping"></div>
            <Database className="w-3.5 h-3.5 text-slate-400" />
            <div className="flex flex-col">
              <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">JSON DB Sync</span>
              <span className="font-semibold text-[11px] text-slate-200">{lastApiAction}</span>
            </div>
            <CheckCircle2 className="w-4 h-4 text-slate-300 ml-1" />
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
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-medium">
                Pending Ethics Approval
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2.5 text-[11px]">
              <button
                type="button"
                onClick={() => setIsNdprOpen(true)}
                className="inline-flex items-center gap-1.5 text-slate-800 hover:text-slate-950 font-semibold bg-white hover:bg-slate-50 px-3 py-1 rounded-lg border border-slate-300 hover:border-slate-400 transition shadow-2xs group cursor-pointer"
                title="View Nigeria Data Protection Regulation (NDPR) Patient Privacy Rights & Data Sovereignty"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-slate-700 group-hover:text-slate-950" />
                <span>NDPR Rights</span>
                <span className="text-[10px] text-slate-500 font-normal group-hover:text-slate-700">
                  (NDPA 2023)
                </span>
              </button>

              <span className="inline-flex items-center gap-1.5 text-slate-700 font-medium bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-500"></span>
                UniGeneva CPIC Level 1A CDS
              </span>
            </div>
          </div>

          {/* Bottom Row: Lead Founder & Multidisciplinary Engineering Attribution */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] text-slate-600">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="font-semibold text-slate-900">Lead Founder:</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-900 font-medium rounded-md border border-slate-200">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
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
