import React from 'react';
import { 
  CalendarCheck, 
  Stethoscope, 
  ShieldCheck, 
  Building2, 
  PhoneCall, 
  Activity,
  Lock,
  Heart,
  Database
} from 'lucide-react';
import { NetworkQuality } from '../types';

interface HeaderProps {
  currentTab: 'booking' | 'obgyn' | 'surgery-urology' | 'consultation' | 'architecture';
  setCurrentTab: (tab: 'booking' | 'obgyn' | 'surgery-urology' | 'consultation' | 'architecture') => void;
  networkQuality?: NetworkQuality;
  setNetworkQuality?: (net: NetworkQuality) => void;
  onOpenNdprModal: () => void;
  onOpenDatabaseModal: () => void;
  isSyncing?: boolean;
  activeAppointmentCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  onOpenNdprModal,
  onOpenDatabaseModal,
  isSyncing = false,
  activeAppointmentCount = 0
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-2.5 md:py-2.5 gap-2.5 md:gap-3">
          {/* Brand Identity & Mobile Quick Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 text-white shadow-xs shrink-0 ring-2 ring-blue-50">
                <div className="relative flex items-center justify-center">
                  <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  <span className="absolute -bottom-1 -right-1 bg-white text-blue-600 rounded-full p-0.5 shadow-2xs">
                    <Activity className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <h1 className="text-sm sm:text-base font-bold tracking-tight text-slate-950 font-sans">
                    KBF Precision Genomedix Ltd
                  </h1>
                  <span className="hidden xs:inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] sm:text-[11px] font-semibold rounded-md border border-blue-100">
                    Precision Clinic
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium line-clamp-1">
                  LAUTECH Teaching Hospital • University of Geneva CDS
                </p>
              </div>
            </div>

            {/* Mobile Actions: Helpline, JSON DB & NDPR */}
            <div className="flex items-center gap-1.5 md:hidden">
              <button
                onClick={onOpenDatabaseModal}
                className="p-2 text-slate-600 hover:text-blue-700 hover:bg-slate-100 rounded-lg transition min-h-[38px] min-w-[38px] flex items-center justify-center relative"
                title="Clinical JSON Database & REST Console"
              >
                <Database className="w-4 h-4 text-blue-600" />
                <span className={`absolute top-2 right-2 w-1.5 h-1.5 rounded-full ${isSyncing ? 'bg-amber-500 animate-ping' : 'bg-emerald-500'}`}></span>
              </button>
              <a
                href="tel:08005288324"
                className="p-2 text-slate-600 hover:text-blue-700 hover:bg-slate-100 rounded-lg transition min-h-[38px] min-w-[38px] flex items-center justify-center"
                title="Call 0800-LAUTECH"
              >
                <PhoneCall className="w-4 h-4 text-blue-600" />
              </a>
              <button
                onClick={onOpenNdprModal}
                className="p-2 text-slate-600 hover:text-blue-700 hover:bg-slate-100 rounded-lg transition min-h-[38px] min-w-[38px] flex items-center justify-center"
                title="NDPR Patient Privacy Rights"
              >
                <ShieldCheck className="w-4 h-4 text-blue-600" />
              </button>
            </div>
          </div>

          {/* Segmented Navigation Bar - Fully Responsive for Mobile, Tablet & Desktop */}
          <div className="w-full md:w-auto overflow-hidden">
            <nav 
              className="bg-slate-100/90 p-1 rounded-xl flex items-center gap-1 border border-slate-200/70 shadow-2xs w-full sm:w-auto overflow-x-auto no-scrollbar scroll-smooth" 
              aria-label="Clinical Portals"
            >
              <button
                onClick={() => setCurrentTab('booking')}
                className={`shrink-0 sm:flex-initial flex items-center justify-center gap-1.5 py-2 px-3 sm:px-4 rounded-lg text-xs font-semibold transition-all whitespace-nowrap min-h-[40px] sm:min-h-[38px] ${
                  currentTab === 'booking'
                    ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-200/60 font-bold'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200/50'
                }`}
              >
                <CalendarCheck className={`w-3.5 h-3.5 shrink-0 ${currentTab === 'booking' ? 'text-blue-600' : 'text-slate-500'}`} />
                <span className="inline">Book Appointment</span>
              </button>

              <button
                onClick={() => setCurrentTab('obgyn')}
                className={`shrink-0 sm:flex-initial flex items-center justify-center gap-1.5 py-2 px-3 sm:px-3.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap min-h-[40px] sm:min-h-[38px] ${
                  currentTab === 'obgyn'
                    ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-200/60 font-bold'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200/50'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 shrink-0 ${currentTab === 'obgyn' ? 'text-rose-600' : 'text-slate-500'}`} />
                <span className="inline">OB/GYN Clinic</span>
              </button>

              <button
                onClick={() => setCurrentTab('surgery-urology')}
                className={`shrink-0 sm:flex-initial flex items-center justify-center gap-1.5 py-2 px-3 sm:px-3.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap min-h-[40px] sm:min-h-[38px] ${
                  currentTab === 'surgery-urology'
                    ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-200/60 font-bold'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200/50'
                }`}
              >
                <Activity className={`w-3.5 h-3.5 shrink-0 ${currentTab === 'surgery-urology' ? 'text-teal-600' : 'text-slate-500'}`} />
                <span className="inline">Surgery &amp; Urology</span>
              </button>

              <button
                onClick={() => setCurrentTab('consultation')}
                className={`shrink-0 sm:flex-initial flex items-center justify-center gap-1.5 py-2 px-3 sm:px-4 rounded-lg text-xs font-semibold transition-all whitespace-nowrap min-h-[40px] sm:min-h-[38px] ${
                  currentTab === 'consultation'
                    ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-200/60 font-bold'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200/50'
                }`}
              >
                <Stethoscope className={`w-3.5 h-3.5 shrink-0 ${currentTab === 'consultation' ? 'text-blue-600' : 'text-slate-500'}`} />
                <span className="inline">Consultation Room</span>
                {activeAppointmentCount > 0 && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold leading-none ${
                    currentTab === 'consultation' ? 'bg-blue-100 text-blue-800' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {activeAppointmentCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setCurrentTab('architecture')}
                className={`shrink-0 sm:flex-initial flex items-center justify-center gap-1.5 py-2 px-3 sm:px-4 rounded-lg text-xs font-semibold transition-all whitespace-nowrap min-h-[40px] sm:min-h-[38px] ${
                  currentTab === 'architecture'
                    ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-200/60 font-bold'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200/50'
                }`}
              >
                <ShieldCheck className={`w-3.5 h-3.5 shrink-0 ${currentTab === 'architecture' ? 'text-blue-600' : 'text-slate-500'}`} />
                <span className="inline">Hospital Standards</span>
              </button>
            </nav>
          </div>

          {/* Right Utilities: Security, Helpline, JSON DB & Privacy (Desktop / Tablet) */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={onOpenDatabaseModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200/90 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-semibold transition-all shadow-2xs group min-h-[36px]"
              title="Open Clinical JSON Database & REST Console"
            >
              <Database className="w-3.5 h-3.5 text-blue-600 group-hover:scale-110 transition-transform" />
              <span className="flex items-center gap-1">
                <span>JSON DB</span>
                <span className={`w-1.5 h-1.5 rounded-full ${isSyncing ? 'bg-amber-500 animate-ping' : 'bg-emerald-500'}`}></span>
              </span>
            </button>

            <a 
              href="tel:08005288324" 
              className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200/80 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium transition-colors"
              title="24/7 Clinical Helpline"
            >
              <PhoneCall className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-[11px]">0800-LAUTECH</span>
            </a>

            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200/80 bg-slate-50 text-slate-600 text-xs font-medium">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-[11px] font-mono">TLS 1.3</span>
            </div>

            <button
              onClick={onOpenNdprModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-blue-200 bg-blue-50/80 hover:bg-blue-100/80 text-blue-700 text-xs font-semibold transition-all shadow-2xs"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>NDPR Rights</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
