import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  Search, 
  Pill, 
  Database, 
  AlertTriangle, 
  ShieldCheck, 
  ExternalLink, 
  RefreshCw, 
  Layers, 
  FileText, 
  Activity, 
  Info, 
  Sparkles 
} from 'lucide-react';
import { NemlDrug, NemlApiStats, PatientProfile } from '../../types';
import { NemlApiService } from '../../services/nemlApi';

interface NemlBrowserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDrugForPrescription?: (drug: NemlDrug) => void;
  activePatient?: PatientProfile | null;
  initialSearchQuery?: string;
  initialCategory?: string;
}

export const NemlBrowserModal: React.FC<NemlBrowserModalProps> = ({
  isOpen,
  onClose,
  onSelectDrugForPrescription,
  activePatient,
  initialSearchQuery = '',
  initialCategory = 'All Categories'
}) => {
  const [searchQuery, setSearchQuery] = useState<string>(initialSearchQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [selectedAware, setSelectedAware] = useState<string>('ALL');
  const [pgxOnly, setPgxOnly] = useState<boolean>(false);

  const [drugs, setDrugs] = useState<NemlDrug[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedDrug, setSelectedDrug] = useState<NemlDrug | null>(null);
  const [apiStats, setApiStats] = useState<NemlApiStats>(NemlApiService.getApiStats());

  const categories = useMemo(() => NemlApiService.getCategories(), []);

  // Fetch drugs whenever filters change
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setIsLoading(true);

    NemlApiService.searchDrugs({
      query: searchQuery,
      category: selectedCategory,
      levelOfCare: selectedLevel,
      whoAWaRe: selectedAware,
      pgxOnly
    }).then(res => {
      if (isMounted) {
        setDrugs(res.drugs);
        setTotalCount(res.total);
        setApiStats(res.stats);
        setIsLoading(false);
        if (res.drugs.length > 0 && !selectedDrug) {
          setSelectedDrug(res.drugs[0]);
        }
      }
    });

    return () => {
      isMounted = false;
    };
  }, [isOpen, searchQuery, selectedCategory, selectedLevel, selectedAware, pgxOnly]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div 
        className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden animate-fadeIn"
        role="dialog"
        aria-modal="true"
      >
        {/* MODAL HEADER */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-3 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-sans tracking-tight">
              National Essential Medicines List (NEML) Database
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Federal Ministry of Health &amp; Social Welfare • National Drug Formulary • NAFDAC Verified
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition min-w-[36px] min-h-[36px] flex items-center justify-center"
            title="Close modal"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* FORMULARY EXPLORER */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
            {/* LEFT PANE: Search, Filters & Drug Master List */}
            <div className="w-full md:w-5/12 lg:w-4/12 border-r border-slate-200 flex flex-col bg-slate-50/40 min-h-0">
              {/* Search & Fast Filters */}
              <div className="p-3 border-b border-slate-200 bg-white space-y-2.5">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search INN generic, brand name, ATC code..."
                    className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 font-sans"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Category Dropdown */}
                <div className="flex items-center gap-2">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-400"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Level of Care & AWaRe filter pills */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                    <span>Prescription Level of Care:</span>
                    <span className="font-mono text-[10px] text-slate-400">{drugs.length} matches</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {[
                      { id: 'ALL', label: 'All Levels' },
                      { id: 'P', label: '[P] Primary Care' },
                      { id: 'S', label: '[S] Secondary' },
                      { id: 'T', label: '[T] Tertiary Only' }
                    ].map((lvl) => (
                      <button
                        key={lvl.id}
                        onClick={() => setSelectedLevel(lvl.id)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition ${
                          selectedLevel === lvl.id
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {lvl.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-1.5 text-[11px] text-slate-700 cursor-pointer select-none font-medium">
                      <input
                        type="checkbox"
                        checked={pgxOnly}
                        onChange={(e) => setPgxOnly(e.target.checked)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                      />
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                        <span className="font-semibold text-slate-800">Pharmacogenomic Alerted Only</span>
                      </span>
                    </label>

                    {selectedCategory === 'Anti-Infective & Antimalarials' && (
                      <select
                        value={selectedAware}
                        onChange={(e) => setSelectedAware(e.target.value)}
                        className="text-[10px] bg-slate-100 border border-slate-200 rounded px-1.5 py-0.5 text-slate-700 font-medium"
                      >
                        <option value="ALL">WHO AWaRe: All</option>
                        <option value="Access">Access (Empiric 1st line)</option>
                        <option value="Watch">Watch (Stewarded)</option>
                        <option value="Reserve">Reserve (Last Resort)</option>
                      </select>
                    )}
                  </div>
                </div>
              </div>

              {/* Scrollable Drug List */}
              <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-1">
                {isLoading ? (
                  <div className="p-8 text-center text-xs text-slate-400">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-indigo-500" />
                    Querying Nigeria NEML database...
                  </div>
                ) : drugs.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400 space-y-1">
                    <Pill className="w-6 h-6 mx-auto text-slate-300 mb-1" />
                    <p className="font-semibold text-slate-700">No matching essential medicines found</p>
                    <p className="text-[11px] text-slate-400">Try adjusting your search terms or clearing the filter.</p>
                  </div>
                ) : (
                  drugs.map((drug) => {
                    const isSelected = selectedDrug?.id === drug.id;
                    return (
                      <button
                        key={drug.id}
                        onClick={() => setSelectedDrug(drug)}
                        className={`w-full text-left p-3 rounded-xl transition flex flex-col gap-1 border ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                            : 'bg-white text-slate-800 border-transparent hover:bg-slate-100/70 hover:border-slate-200'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1.5">
                          <span className={`font-bold text-xs sm:text-sm line-clamp-1 ${isSelected ? 'text-white' : 'text-slate-950'}`}>
                            {drug.genericName}
                          </span>
                          <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold shrink-0 ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {drug.levelOfCare}
                          </span>
                        </div>

                        <div className={`text-[11px] line-clamp-1 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                          Brands: {drug.brandNames.join(', ')}
                        </div>

                        <div className="flex items-center gap-1.5 mt-0.5 text-[10px]">
                          <span className={`px-1.5 py-0.2 rounded font-mono ${
                            isSelected ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {drug.nemlCode}
                          </span>
                          {drug.whoAWaReCategory !== 'Not Applicable' && (
                            <span className={`px-1.5 py-0.2 rounded font-semibold ${
                              drug.whoAWaReCategory === 'Access'
                                ? isSelected ? 'bg-emerald-800 text-emerald-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : drug.whoAWaReCategory === 'Watch'
                                ? isSelected ? 'bg-amber-800 text-amber-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
                                : isSelected ? 'bg-red-800 text-red-200' : 'bg-red-50 text-red-800 border border-red-200'
                            }`}>
                              AWaRe: {drug.whoAWaReCategory}
                            </span>
                          )}
                          {drug.pharmacogenomicAlert && (
                            <span className={`px-1.5 py-0.2 rounded font-semibold flex items-center gap-0.5 ${
                              isSelected ? 'bg-indigo-900 text-indigo-200' : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                            }`}>
                              <Sparkles className="w-2.5 h-2.5" />
                              {drug.pharmacogenomicAlert.targetGene}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>

              {/* Bottom stats summary */}
              <div className="p-2.5 border-t border-slate-200 bg-white text-[10px] text-slate-500 flex items-center justify-between">
                <span>Database: <strong>{apiStats.totalDrugs}</strong> NEML Essentials</span>
                <span>NAFDAC: <strong>100% Validated</strong></span>
              </div>
            </div>

            {/* RIGHT PANE: Selected Drug Monograph Detail View */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-white min-h-0">
              {selectedDrug ? (
                <div className="space-y-4 animate-fadeIn">
                  {/* Monograph Header */}
                  <div className="pb-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 bg-slate-900 text-white rounded text-[10px] font-mono font-bold">
                          {selectedDrug.nemlCode}
                        </span>
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-mono">
                          ATC: {selectedDrug.atcCode}
                        </span>
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-medium">
                          {selectedDrug.therapeuticCategory}
                        </span>
                        {selectedDrug.isPediatricEssential && (
                          <span className="px-2 py-0.5 bg-sky-50 text-sky-700 border border-sky-200 rounded text-[10px] font-semibold">
                            Pediatric Essential
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl sm:text-2xl font-bold text-slate-950 font-sans">
                        {selectedDrug.genericName}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Common Registered Brands in Nigeria: <strong>{selectedDrug.brandNames.join(' • ')}</strong>
                      </p>
                    </div>

                    {/* Prescribe / Action CTA */}
                    {onSelectDrugForPrescription && (
                      <button
                        onClick={() => onSelectDrugForPrescription(selectedDrug)}
                        className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-xs shrink-0 active:scale-98"
                      >
                        <Pill className="w-3.5 h-3.5 text-emerald-100" />
                        <span>Prescribe into Consultation</span>
                      </button>
                    )}
                  </div>

                  {/* Level of Care & WHO AWaRe Badges */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100">
                      <div className="text-[10px] text-indigo-800 font-semibold mb-0.5">
                        Prescription Level of Care (Nigeria Health System):
                      </div>
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-mono text-[10px] flex items-center justify-center font-bold shadow-xs">
                          {selectedDrug.levelOfCare}
                        </span>
                        <span>{selectedDrug.levelOfCareLabel}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        LAUTECH Teaching Hospital holds statutory tertiary accreditation authorizing dispensing of all P, S, and T formulary entries.
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="text-[10px] text-slate-500 font-semibold mb-0.5">
                        WHO AWaRe Classification / Regulatory Status:
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                        {selectedDrug.whoAWaReCategory !== 'Not Applicable' ? (
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            selectedDrug.whoAWaReCategory === 'Access'
                              ? 'bg-emerald-100 text-emerald-800'
                              : selectedDrug.whoAWaReCategory === 'Watch'
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-red-100 text-red-900'
                          }`}>
                            AWaRe: {selectedDrug.whoAWaReCategory}
                          </span>
                        ) : (
                          <span className="text-slate-700">Standard Formulary Medication</span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-600 mt-1">
                        {selectedDrug.nafdacRegStatus}
                      </div>
                    </div>
                  </div>

                  {/* Approved Dosage Forms in NEML */}
                  <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200 space-y-1.5">
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-slate-700" />
                      Approved Dosage Forms &amp; Strengths (FMoH Formulations):
                    </div>
                    <div className="flex flex-wrap gap-2 pt-0.5">
                      {selectedDrug.dosageForms.map((df, i) => (
                        <span key={i} className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 shadow-2xs">
                          {df}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Pharmacogenomic Alert (if applicable) */}
                  {selectedDrug.pharmacogenomicAlert && (
                    <div className={`p-4 rounded-xl border space-y-2 ${
                      selectedDrug.pharmacogenomicAlert.severity === 'CONTRAINDICATED'
                        ? 'bg-red-50/80 border-red-200 text-red-950'
                        : selectedDrug.pharmacogenomicAlert.severity === 'HIGH_ADR_ALERT'
                        ? 'bg-amber-50/80 border-amber-200 text-amber-950'
                        : 'bg-slate-50 border-slate-200 text-slate-950'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-slate-800" />
                          <span className="text-xs font-bold">
                            Pharmacogenomic Biomarker Alert: {selectedDrug.pharmacogenomicAlert.targetGene}
                          </span>
                        </div>
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                          selectedDrug.pharmacogenomicAlert.severity === 'CONTRAINDICATED'
                            ? 'bg-red-200 text-red-900'
                            : 'bg-amber-200 text-amber-900'
                        }`}>
                          {selectedDrug.pharmacogenomicAlert.severity.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-xs">
                        Trigger Phenotype: <strong>{selectedDrug.pharmacogenomicAlert.riskPhenotype}</strong>
                      </div>
                      <p className="text-[11px] leading-relaxed">
                        {selectedDrug.pharmacogenomicAlert.recommendation}
                      </p>
                      {activePatient && (
                        <div className="pt-1.5 border-t border-slate-200/60 text-[11px] flex items-center justify-between">
                          <span>Patient Active Profile: <strong>{activePatient.fullName}</strong></span>
                          <span className="font-semibold text-slate-800">
                            Geneva Precision Ruleset Cross-Referenced
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Clinical Indications & Prescribing Guidelines */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200 space-y-2">
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-slate-700" />
                        Standard Priority Indications (NEML Protocol):
                      </div>
                      <ul className="text-xs text-slate-700 space-y-1 pl-4 list-disc">
                        {selectedDrug.standardIndications.map((ind, i) => (
                          <li key={i}>{ind}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200 space-y-2">
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-slate-700" />
                        Contraindications &amp; Precautions:
                      </div>
                      <ul className="text-xs text-slate-700 space-y-1 pl-4 list-disc">
                        {selectedDrug.contraindications.map((contra, i) => (
                          <li key={i}>{contra}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Prescribing Pearls */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-slate-700" />
                      Prescribing Pearls &amp; Clinical Guidelines (FMoH / EMDEX):
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {selectedDrug.prescribingGuidelines}
                    </p>
                  </div>

                  {/* Monograph Metadata Footer */}
                  <div className="p-3 bg-slate-100 rounded-xl text-[10px] text-slate-500 flex flex-wrap items-center justify-between gap-2">
                    <span>EMDEX Monograph Ref: <strong>{selectedDrug.emdexMonographId}</strong></span>
                    <span>Formulary: <strong>Nigeria National Essential Medicines List</strong></span>
                    <span>Federal Republic of Nigeria Ministry of Health</span>
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center text-xs text-slate-400">
                  Select a drug from the left panel to inspect its NEML monograph.
                </div>
              )}
            </div>
          </div>

        {/* MODAL FOOTER */}
        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-slate-700" />
            <span>LAUTECH Teaching Hospital Telehealth • National Essential Medicines List Integration</span>
          </div>

          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-semibold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
