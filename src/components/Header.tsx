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
  activeAppointmentCount = 0
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-2.5 md:py-2.5 gap-2.5 md:gap-3">
          {/* Brand Identity & Mobile Quick Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs shrink-0">
                <Building2 className="w-5 h-5 text-white" />
              </div>

              <div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <h1 className="text-sm sm:text-base font-bold tracking-tight text-slate-900 font-sans">
                    KBF <span className="text-indigo-600">Precision</span> Genomedix
                  </h1>
                  <span className="hidden xs:inline-flex items-center px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] sm:text-[11px] font-semibold rounded-md border border-indigo-200">
                    Clinical Telehealth
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium line-clamp-1">
                  <span className="text-teal-700 font-semibold">LAUTECH Teaching Hospital</span> • University of Geneva CDS
                </p>
              </div>
            </div>

            {/* Mobile Action: NEML Drugs */}
            <div className="flex items-center md:hidden">
              <button
                type="button"
                onClick={onOpenNemlModal}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition active:scale-98"
                title="National Essential Medicines List (NEML)"
              >
                NEML Drugs
              </button>
            </div>
          </div>

          {/* Segmented Navigation Bar - Fully Responsive for Mobile, Tablet & Desktop */}
          <div className="w-full md:w-auto overflow-hidden">
            <nav 
              className="bg-slate-100/90 p-1 rounded-xl flex items-center gap-1 border border-slate-200/90 shadow-2xs w-full sm:w-auto overflow-x-auto no-scrollbar scroll-smooth" 
              aria-label="Clinical Portals"
            >
              <button
                onClick={() => setCurrentTab('booking')}
                className={`shrink-0 sm:flex-initial flex items-center justify-center gap-1.5 py-2 px-3 sm:px-4 rounded-lg text-xs font-semibold transition-all whitespace-nowrap min-h-[40px] sm:min-h-[38px] ${
                  currentTab === 'booking'
                    ? 'bg-white text-indigo-700 shadow-xs border border-indigo-200 ring-1 ring-indigo-500/10'
                    : 'text-slate-600 hover:text-indigo-900 hover:bg-white/60'
                }`}
              >
                <CalendarCheck className={`w-3.5 h-3.5 shrink-0 ${currentTab === 'booking' ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span className="inline">Book Appointment</span>
              </button>

              <button
                onClick={() => setCurrentTab('family-medicine')}
                className={`shrink-0 sm:flex-initial flex items-center justify-center gap-1.5 py-2 px-3 sm:px-3.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap min-h-[40px] sm:min-h-[38px] ${
                  currentTab === 'family-medicine'
                    ? 'bg-white text-emerald-700 shadow-xs border border-emerald-200 ring-1 ring-emerald-500/10'
                    : 'text-slate-600 hover:text-emerald-900 hover:bg-white/60'
                }`}
              >
                <HeartPulse className={`w-3.5 h-3.5 shrink-0 ${currentTab === 'family-medicine' ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span className="inline">Family Medicine</span>
              </button>

              <button
                onClick={() => setCurrentTab('obgyn')}
                className={`shrink-0 sm:flex-initial flex items-center justify-center gap-1.5 py-2 px-3 sm:px-3.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap min-h-[40px] sm:min-h-[38px] ${
                  currentTab === 'obgyn'
                    ? 'bg-white text-rose-700 shadow-xs border border-rose-200 ring-1 ring-rose-500/10'
                    : 'text-slate-600 hover:text-rose-900 hover:bg-white/60'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 shrink-0 ${currentTab === 'obgyn' ? 'text-rose-600' : 'text-slate-400'}`} />
                <span className="inline">OB/GYN Clinic</span>
              </button>

              <button
                onClick={() => setCurrentTab('surgery-urology')}
                className={`shrink-0 sm:flex-initial flex items-center justify-center gap-1.5 py-2 px-3 sm:px-3.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap min-h-[40px] sm:min-h-[38px] ${
                  currentTab === 'surgery-urology'
                    ? 'bg-white text-violet-700 shadow-xs border border-violet-200 ring-1 ring-violet-500/10'
                    : 'text-slate-600 hover:text-violet-900 hover:bg-white/60'
                }`}
              >
                <Activity className={`w-3.5 h-3.5 shrink-0 ${currentTab === 'surgery-urology' ? 'text-violet-600' : 'text-slate-400'}`} />
                <span className="inline">Surgery &amp; Urology</span>
              </button>

              <button
                onClick={() => setCurrentTab('consultation')}
                className={`shrink-0 sm:flex-initial flex items-center justify-center gap-1.5 py-2 px-3 sm:px-4 rounded-lg text-xs font-semibold transition-all whitespace-nowrap min-h-[40px] sm:min-h-[38px] ${
                  currentTab === 'consultation'
                    ? 'bg-white text-blue-700 shadow-xs border border-blue-200 ring-1 ring-blue-500/10'
                    : 'text-slate-600 hover:text-blue-900 hover:bg-white/60'
                }`}
              >
                <Stethoscope className={`w-3.5 h-3.5 shrink-0 ${currentTab === 'consultation' ? 'text-blue-600' : 'text-slate-400'}`} />
                <span className="inline">Consultation Room</span>
                {activeAppointmentCount > 0 && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold leading-none ${
                    currentTab === 'consultation' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {activeAppointmentCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setCurrentTab('architecture')}
                className={`shrink-0 sm:flex-initial flex items-center justify-center gap-1.5 py-2 px-3 sm:px-4 rounded-lg text-xs font-semibold transition-all whitespace-nowrap min-h-[40px] sm:min-h-[38px] ${
                  currentTab === 'architecture'
                    ? 'bg-white text-amber-700 shadow-xs border border-amber-200 ring-1 ring-amber-500/10'
                    : 'text-slate-600 hover:text-amber-900 hover:bg-white/60'
                }`}
              >
                <ShieldCheck className={`w-3.5 h-3.5 shrink-0 ${currentTab === 'architecture' ? 'text-amber-600' : 'text-slate-400'}`} />
                <span className="inline">Hospital Standards</span>
              </button>
            </nav>
          </div>

          {/* Right Utility: NEML Drugs (Desktop / Tablet) */}
          <div className="hidden md:flex items-center">
            <button
              type="button"
              onClick={onOpenNemlModal}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs active:scale-98 cursor-pointer"
              title="National Essential Medicines List (NEML)"
            >
              NEML Drugs
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
