import React, { useState } from 'react';
import { ShieldCheck, Lock, FileText, Trash2, Download, CheckCircle2, X } from 'lucide-react';

interface NDPRModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NDPRModal: React.FC<NDPRModalProps> = ({ isOpen, onClose }) => {
  const [dataDeletedToast, setDataDeletedToast] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExportData = () => {
    const exportPayload = {
      patient: 'Adewale Johnson Adeleke',
      ndprStatus: 'Consent Active (Art 2.1)',
      institution: 'LAUTECH Teaching Hospital',
      encryption: 'AES-256 (At Rest), TLS 1.3 (In Transit)',
      genomics: {
        CYP2C19: '*2/*2 (Poor Metabolizer)',
        SLCO1B1: '521T>C (High Statin Myopathy Risk)'
      },
      exportTimestamp: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'NDPR_Patient_Data_Export_Adeleke.json';
    a.click();
  };

  const handleDeleteRequest = () => {
    setDataDeletedToast('Right-to-be-Forgotten request registered. Identity scrubbed per NDPR §3.1.');
    setTimeout(() => setDataDeletedToast(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[92vh] overflow-y-auto p-4 sm:p-6 shadow-2xl border border-neutral-200 space-y-4 animate-scaleUp">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-neutral-100 text-neutral-800 rounded-lg border border-neutral-200 shrink-0">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 tracking-tight">
                NDPR Compliance &amp; Data Sovereignty Center
              </h3>
              <p className="text-[11px] text-neutral-500 font-mono">
                Nigeria Data Protection Regulation 2019 / NDPA 2023
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-xl text-neutral-400 hover:text-black hover:bg-neutral-100 transition-colors min-h-[44px] min-w-[44px] shrink-0"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {dataDeletedToast && (
          <div className="p-3 bg-neutral-900 border border-neutral-800 text-white rounded-xl text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{dataDeletedToast}</span>
          </div>
        )}

        <div className="space-y-3 text-xs text-neutral-600 leading-relaxed">
          <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
            <div className="flex items-center justify-between font-semibold text-neutral-900">
              <span>Encryption &amp; Data Protection Tier</span>
              <span className="text-emerald-700 font-mono text-[11px]">Verified Level 4</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-neutral-600">
              <li><strong className="text-neutral-900">Data at Rest:</strong> AES-256 standard encryption on all EHR tables &amp; genetic files.</li>
              <li><strong className="text-neutral-900">Data in Transit:</strong> TLS 1.3 cryptographic tunneling for WebRTC &amp; API requests.</li>
              <li><strong className="text-neutral-900">Sovereignty:</strong> Local database caching and primary storage on Nigerian cloud nodes.</li>
            </ul>
          </div>

          <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 space-y-1.5">
            <span className="font-semibold text-neutral-900 block">Patient Privacy Rights Under NDPR:</span>
            <p className="text-[11px] text-neutral-600">
              You retain total ownership of your medical history, genomic markers, and teleconsultation notes. You may export or purge your records at any time without penalty.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-3 border-t border-neutral-100">
          <button
            onClick={handleExportData}
            className="w-full sm:w-auto px-3.5 py-2.5 bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-colors min-h-[42px]"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export My Data (JSON)</span>
          </button>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <button
              onClick={handleDeleteRequest}
              className="w-full sm:w-auto px-3.5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-colors border border-rose-200 min-h-[42px]"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Request Deletion</span>
            </button>
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 bg-[#005eb8] text-white rounded-xl text-xs font-semibold hover:bg-[#004b94] shadow-xs transition-colors min-h-[42px] flex items-center justify-center"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
