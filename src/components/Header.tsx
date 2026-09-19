import React from 'react';
import { 
  CalendarCheck, 
  Stethoscope, 
  ShieldCheck, 
  Building2, 
  Activity,
  Heart,
  HeartPulse
} from 'lucide-react';
import { NetworkQuality } from '../types';

interface HeaderProps {
  currentTab: 'booking' | 'family-medicine' | 'obgyn' | 'surgery-urology' | 'consultation' | 'architecture';
  setCurrentTab: (tab: 'booking' | 'family-medicine' | 'obgyn' | 'surgery-urology' | 'consultation' | 'architecture') => void;
  networkQuality?: NetworkQuality;
  setNetworkQuality?: (net: NetworkQuality) => void;
  onOpenNemlModal: () => void;
  onOpenNdprModal?: () => void;
  onOpenDatabaseModal?: () => void;
  isSyncing?: boolean;
  activeAppointmentCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  onOpenNemlModal,
  onOpenNdprModal,
  onOpenDatabaseModal,
  isSyncing,
  activeAppointmentCount = 0
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-[0_1px_4px_0_rgba(0,0,0,0.03)]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between py-2.5 gap-2.5 lg:gap-3">
          {/* Brand Identity & Mobile Quick Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs shrink-0 ring-2 ring-indigo-500/10">
                <Building2 className="w-5 h-5 text-white" />
              </div>

              <div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <h1 className="text-sm sm:text-base font-bold tracking-tight text-slate-900 font-sans">
                    KBF <span className="text-indigo-600">Precision</span> Genomedix
                  </h1>
                  <span className="hidden xs:inline-flex items-center px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] sm:text-[11px] font-bold rounded-md border border-indigo-200">
                    Clinical Telehealth
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium line-clamp-1">
                  <span className="text-teal-700 font-semibold">LAUTECH Teaching Hospital</span> • University of Geneva CDS
                </p>
              </div>
            </div>

            {/* Mobile Actions: NEML Drugs & Doctor Room Quick Jump */}
            <div className="flex items-center gap-1.5 lg:hidden">
              <button
                type="button"
                onClick={() => setCurrentTab('consultation')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-xs ${
                  currentTab === 'consultation'
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
                }`}
                title="Open Doctor Consultation Room"
              >
                <Stethoscope className="w-3.5 h-3.5" />
                <span>Doctor</span>
                {activeAppointmentCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                )}
              </button>

              <button
                type="button"
                onClick={onOpenNemlModal}
                className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition active:scale-98"
                title="National Essential Medicines List (NEML)"
              >
                NEML
              </button>
            </div>
          </div>

          {/* Segmented Navigation Bar - Categorized for Patient Care & Doctor Workstation */}
          <div className="w-full lg:w-auto overflow-hidden">
            <nav 
              className="bg-slate-100/95 p-1 rounded-xl flex items-center gap-1 border border-slate-200/90 shadow-2xs w-full lg:w-auto overflow-x-auto no-scrollbar scroll-smooth" 
              aria-label="Clinical Portals"
            >
              <button
                onClick={() => setCurrentTab('booking')}
                className={`shrink-0 flex items-center justify-center gap-1.5 py-2 px-3 sm:px-3.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap min-h-[40px] sm:min-h-[38px] ${
                  currentTab === 'booking'
                    ? 'bg-white text-indigo-700 shadow-xs border border-indigo-200 ring-1 ring-indigo-500/10'
                    : 'text-slate-600 hover:text-indigo-900 hover:bg-white/60'
                }`}
              >
                <CalendarCheck className={`w-3.5 h-3.5 shrink-0 ${currentTab === 'booking' ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span>Book Appointment</span>
              </button>

              <button
                onClick={() => setCurrentTab('family-medicine')}
                className={`shrink-0 flex items-center justify-center gap-1.5 py-2 px-3 sm:px-3 rounded-lg text-xs font-semibold transition-all whitespace-nowrap min-h-[40px] sm:min-h-[38px] ${
                  currentTab === 'family-medicine'
                    ? 'bg-white text-emerald-700 shadow-xs border border-emerald-200 ring-1 ring-emerald-500/10'
                    : 'text-slate-600 hover:text-emerald-900 hover:bg-white/60'
                }`}
              >
                <HeartPulse className={`w-3.5 h-3.5 shrink-0 ${currentTab === 'family-medicine' ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>Family Medicine</span>
              </button>

              <button
                onClick={() => setCurrentTab('obgyn')}
                className={`shrink-0 flex items-center justify-center gap-1.5 py-2 px-3 sm:px-3 rounded-lg text-xs font-semibold transition-all whitespace-nowrap min-h-[40px] sm:min-h-[38px] ${
                  currentTab === 'obgyn'
                    ? 'bg-white text-rose-700 shadow-xs border border-rose-200 ring-1 ring-rose-500/10'
                    : 'text-slate-600 hover:text-rose-900 hover:bg-white/60'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 shrink-0 ${currentTab === 'obgyn' ? 'text-rose-600' : 'text-slate-400'}`} />
                <span>OB/GYN</span>
              </button>

              <button
                onClick={() => setCurrentTab('surgery-urology')}
                className={`shrink-0 flex items-center justify-center gap-1.5 py-2 px-3 sm:px-3 rounded-lg text-xs font-semibold transition-all whitespace-nowrap min-h-[40px] sm:min-h-[38px] ${
                  currentTab === 'surgery-urology'
                    ? 'bg-white text-violet-700 shadow-xs border border-violet-200 ring-1 ring-violet-500/10'
                    : 'text-slate-600 hover:text-violet-900 hover:bg-white/60'
                }`}
              >
                <Activity className={`w-3.5 h-3.5 shrink-0 ${currentTab === 'surgery-urology' ? 'text-violet-600' : 'text-slate-400'}`} />
                <span>Surgery &amp; Urology</span>
              </button>

              <div className="h-5 w-px bg-slate-300 mx-0.5 shrink-0 hidden sm:block" />

              <button
                onClick={() => setCurrentTab('consultation')}
                className={`shrink-0 flex items-center justify-center gap-1.5 py-2 px-3 sm:px-3.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap min-h-[40px] sm:min-h-[38px] ${
                  currentTab === 'consultation'
                    ? 'bg-white text-blue-700 shadow-xs border border-blue-300 ring-1 ring-blue-500/20'
                    : 'text-slate-600 hover:text-blue-900 hover:bg-white/60'
                }`}
              >
                <Stethoscope className={`w-3.5 h-3.5 shrink-0 ${currentTab === 'consultation' ? 'text-blue-600' : 'text-slate-400'}`} />
                <span className="font-bold">Doctor Workstation</span>
                {activeAppointmentCount > 0 && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold leading-none ${
                    currentTab === 'consultation' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800 border border-blue-200'
                  }`}>
                    {activeAppointmentCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setCurrentTab('architecture')}
                className={`shrink-0 flex items-center justify-center gap-1.5 py-2 px-3 sm:px-3 rounded-lg text-xs font-semibold transition-all whitespace-nowrap min-h-[40px] sm:min-h-[38px] ${
                  currentTab === 'architecture'
                    ? 'bg-white text-amber-800 shadow-xs border border-amber-200 ring-1 ring-amber-500/10'
                    : 'text-slate-600 hover:text-amber-900 hover:bg-white/60'
                }`}
              >
                <ShieldCheck className={`w-3.5 h-3.5 shrink-0 ${currentTab === 'architecture' ? 'text-amber-600' : 'text-slate-400'}`} />
                <span>Standards</span>
              </button>
            </nav>
          </div>

          {/* Right Utility: Essential Drugs & Clinical DB (Desktop / Tablet) */}
          <div className="hidden lg:flex items-center gap-2">
            {onOpenDatabaseModal && (
              <button
                type="button"
                onClick={onOpenDatabaseModal}
                className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-xs font-semibold border border-slate-200 transition-all flex items-center gap-1.5"
                title="View JSON Patient Database & Clinical Audit Log"
              >
                <span className={`w-2 h-2 rounded-full ${isSyncing ? 'bg-amber-500 animate-ping' : 'bg-emerald-500'}`} />
                <span>Clinical DB</span>
              </button>
            )}

            <button
              type="button"
              onClick={onOpenNemlModal}
              className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs active:scale-98 cursor-pointer flex items-center gap-1.5"
              title="National Essential Medicines List (NEML 8th Ed.)"
            >
              <span>NEML Drugs</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
