import React from 'react';
import { 
  CalendarCheck, 
  Stethoscope, 
  ShieldCheck, 
  Building2, 
  Activity,
  Heart
} from 'lucide-react';
import { NetworkQuality } from '../types';

interface HeaderProps {
  currentTab: 'booking' | 'obgyn' | 'surgery-urology' | 'consultation' | 'architecture';
  setCurrentTab: (tab: 'booking' | 'obgyn' | 'surgery-urology' | 'consultation' | 'architecture') => void;
  networkQuality?: NetworkQuality;
  setNetworkQuality?: (net: NetworkQuality) => void;
  onOpenNdprModal: () => void;
  onOpenDatabaseModal?: () => void;
  isSyncing?: boolean;
  activeAppointmentCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  onOpenNdprModal,
  activeAppointmentCount = 0
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-2.5 md:py-2.5 gap-2.5 md:gap-3">
          {/* Brand Identity & Mobile Quick Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-slate-900 text-white shrink-0">
                <Building2 className="w-5 h-5 text-white" />
              </div>

              <div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <h1 className="text-sm sm:text-base font-bold tracking-tight text-slate-950 font-sans">
                    KBF Precision Genomedix Ltd
                  </h1>
                  <span className="hidden xs:inline-flex items-center px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] sm:text-[11px] font-medium rounded border border-slate-200">
                    Clinical Telehealth
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium line-clamp-1">
                  LAUTECH Teaching Hospital • University of Geneva CDS
                </p>
              </div>
            </div>

            {/* Mobile Actions: NDPR */}
            <div className="flex items-center gap-1.5 md:hidden">
              <button
                onClick={onOpenNdprModal}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition min-h-[38px] min-w-[38px] flex items-center justify-center border border-slate-200"
                title="NDPR Patient Privacy Rights"
              >
                <ShieldCheck className="w-4 h-4 text-slate-700" />
              </button>
            </div>
          </div>

          {/* Segmented Navigation Bar - Fully Responsive for Mobile, Tablet & Desktop */}
          <div className="w-full md:w-auto overflow-hidden">
            <nav 
              className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200 shadow-2xs w-full sm:w-auto overflow-x-auto no-scrollbar scroll-smooth" 
              aria-label="Clinical Portals"
            >
              <button
                onClick={() => setCurrentTab('booking')}
                className={`shrink-0 sm:flex-initial flex items-center justify-center gap-1.5 py-2 px-3 sm:px-4 rounded-lg text-xs font-semibold transition-all whitespace-nowrap min-h-[40px] sm:min-h-[38px] ${
                  currentTab === 'booking'
                    ? 'bg-white text-slate-950 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200/60'
                }`}
              >
                <CalendarCheck className={`w-3.5 h-3.5 shrink-0 ${currentTab === 'booking' ? 'text-slate-900' : 'text-slate-400'}`} />
                <span className="inline">Book Appointment</span>
              </button>

              <button
                onClick={() => setCurrentTab('obgyn')}
                className={`shrink-0 sm:flex-initial flex items-center justify-center gap-1.5 py-2 px-3 sm:px-3.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap min-h-[40px] sm:min-h-[38px] ${
                  currentTab === 'obgyn'
                    ? 'bg-white text-slate-950 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200/60'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 shrink-0 ${currentTab === 'obgyn' ? 'text-slate-900' : 'text-slate-400'}`} />
                <span className="inline">OB/GYN Clinic</span>
              </button>

              <button
                onClick={() => setCurrentTab('surgery-urology')}
                className={`shrink-0 sm:flex-initial flex items-center justify-center gap-1.5 py-2 px-3 sm:px-3.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap min-h-[40px] sm:min-h-[38px] ${
                  currentTab === 'surgery-urology'
                    ? 'bg-white text-slate-950 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200/60'
                }`}
              >
                <Activity className={`w-3.5 h-3.5 shrink-0 ${currentTab === 'surgery-urology' ? 'text-slate-900' : 'text-slate-400'}`} />
                <span className="inline">Surgery &amp; Urology</span>
              </button>

              <button
                onClick={() => setCurrentTab('consultation')}
                className={`shrink-0 sm:flex-initial flex items-center justify-center gap-1.5 py-2 px-3 sm:px-4 rounded-lg text-xs font-semibold transition-all whitespace-nowrap min-h-[40px] sm:min-h-[38px] ${
                  currentTab === 'consultation'
                    ? 'bg-white text-slate-950 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200/60'
                }`}
              >
                <Stethoscope className={`w-3.5 h-3.5 shrink-0 ${currentTab === 'consultation' ? 'text-slate-900' : 'text-slate-400'}`} />
                <span className="inline">Consultation Room</span>
                {activeAppointmentCount > 0 && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-medium leading-none ${
                    currentTab === 'consultation' ? 'bg-slate-200 text-slate-900' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {activeAppointmentCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setCurrentTab('architecture')}
                className={`shrink-0 sm:flex-initial flex items-center justify-center gap-1.5 py-2 px-3 sm:px-4 rounded-lg text-xs font-semibold transition-all whitespace-nowrap min-h-[40px] sm:min-h-[38px] ${
                  currentTab === 'architecture'
                    ? 'bg-white text-slate-950 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200/60'
                }`}
              >
                <ShieldCheck className={`w-3.5 h-3.5 shrink-0 ${currentTab === 'architecture' ? 'text-slate-900' : 'text-slate-400'}`} />
                <span className="inline">Hospital Standards</span>
              </button>
            </nav>
          </div>

          {/* Right Utilities: NDPR Privacy (Desktop / Tablet) */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={onOpenNdprModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 text-xs font-medium transition-all shadow-2xs"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-slate-600" />
              <span>NDPR Rights</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
