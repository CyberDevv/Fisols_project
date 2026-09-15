import React, { useState, useMemo } from 'react';
import { 
  Database, 
  Server, 
  Terminal, 
  Download, 
  Upload, 
  RefreshCw, 
  Copy, 
  Check, 
  X, 
  Activity, 
  ShieldCheck, 
  FileText, 
  Users, 
  Pill, 
  CreditCard,
  Search,
  Sparkles
} from 'lucide-react';
import { useClinicalState } from '../../context/ClinicalStateContext';
import { AppointmentBooking } from '../../types';

interface JsonDatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToConsultation?: (appointmentId: string) => void;
}

export const JsonDatabaseModal: React.FC<JsonDatabaseModalProps> = ({
  isOpen,
  onClose,
  onNavigateToConsultation
}) => {
  const {
    appointments,
    patients,
    prescriptions,
    complianceLogs,
    hmoPolicies,
    dbStats,
    apiLogs,
    isSyncing,
    lastApiAction,
    exportDatabaseJSON,
    importDatabaseJSON,
    resetToDemoState,
    createAppointment
  } = useClinicalState();

  const [activeTab, setActiveTab] = useState<'collections' | 'logs' | 'admin'>('collections');
  const [selectedCollection, setSelectedCollection] = useState<'appointments' | 'patients' | 'prescriptions' | 'complianceLogs' | 'hmoPolicies'>('appointments');
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [importText, setImportText] = useState('');
  const [importStatus, setImportStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  const activeCollectionData = useMemo(() => {
    switch (selectedCollection) {
      case 'appointments':
        if (!searchQuery) return appointments;
        return appointments.filter(a => 
          a.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
          a.patient.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.specialist.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      case 'patients':
        if (!searchQuery) return patients;
        return patients.filter(p => 
          p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.phone.includes(searchQuery)
        );
      case 'prescriptions':
        if (!searchQuery) return prescriptions;
        return prescriptions.filter(p => 
          p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.patientName.toLowerCase().includes(searchQuery.toLowerCase())
        );
      case 'complianceLogs':
        if (!searchQuery) return complianceLogs;
        return complianceLogs.filter(l => 
          l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.actor.toLowerCase().includes(searchQuery.toLowerCase())
        );
      case 'hmoPolicies':
        if (!searchQuery) return hmoPolicies;
        return hmoPolicies.filter(h => 
          h.policyNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          h.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
          h.enrolleeName.toLowerCase().includes(searchQuery.toLowerCase())
        );
      default:
        return [];
    }
  }, [selectedCollection, searchQuery, appointments, patients, prescriptions, complianceLogs, hmoPolicies]);

  if (!isOpen) return null;

  const handleCopyJson = () => {
    const jsonStr = JSON.stringify(activeCollectionData, null, 2);
    navigator.clipboard.writeText(jsonStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFullDatabase = () => {
    const fullDb = exportDatabaseJSON();
    const blob = new Blob([fullDb], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lautech_telehealth_db_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportSubmit = () => {
    if (!importText.trim()) return;
    const res = importDatabaseJSON(importText);
    setImportStatus(res);
    if (res.success) {
      setTimeout(() => {
        setImportStatus(null);
        setImportText('');
        setActiveTab('collections');
      }, 1500);
    }
  };

  const handleSeedSampleObGyn = async () => {
    const randomId = `KBF-APT-${Math.floor(10000 + Math.random() * 90000)}`;
    const newEncounter: AppointmentBooking = {
      id: randomId,
      patient: {
        id: `pat-seed-${Date.now()}`,
        fullName: 'Mrs. Fatima Alabi',
        email: 'f.alabi@telehealth.kbf.org',
        phone: '+234 803 712 9901',
        age: 29,
        gender: 'Female',
        stateOfResidence: 'Oyo State (Ogbomoso)',
        chronicConditions: ['None reported'],
        drugAllergies: ['None'],
        emergencyContact: {
          name: 'Mr. Ibrahim Alabi',
          phone: '+234 802 884 1022',
          relationship: 'Spouse'
        },
        hmoProvider: 'AXA Mansard Health',
        hmoNumber: 'AXA-33821-LAUT',
        ndprConsentGiven: true,
        ndprConsentDate: new Date().toISOString(),
        geneticProfile: [
          {
            gene: 'CYP2D6',
            variant: '*1/*1',
            phenotype: 'Normal Metabolizer',
            testedDate: '2026-08-10',
            accreditation: 'UniGeneva-Certified Molecular Genetics Lab',
            clinicalImpact: 'Normal analgesic clearance.'
          }
        ]
      },
      specialist: {
        id: 'spec-dr-adebayo',
        name: 'Dr. Adekunle Adebayo',
        title: 'Consultant Obstetrician & Gynaecologist',
        department: 'Obstetrics & Gynaecology',
        institution: 'LAUTECH Teaching Hospital, Ogbomoso',
        qualifications: 'MBBS, FWACS, FMCOG',
        precisionExpertise: ['Antenatal Care', 'Tele-Gynecology'],
        lautechFacultyRole: 'Consultant Obstetrician & Gynaecologist',
        bio: 'Consultant Obstetrician & Gynaecologist leading outpatient virtual maternal health.',
        availableSlots: []
      },
      selectedDate: 'Today',
      selectedTime: '02:30 PM',
      triage: {
        severityLevel: 'Moderate',
        recommendedDepartment: 'Obstetrics & Gynaecology',
        matchedSpecialist: null as any,
        clinicalPriority: 'Standard (within 48h)',
        triageReasoning: 'Elective antenatal routine wellness consult. Zero emergency obstetric red flags.',
        flaggedRiskFactors: ['Routine Gestational Week 26 Tele-Check']
      },
      documents: [],
      paymentMode: 'HMO_VERIFICATION',
      hmoDetails: {
        provider: 'AXA Mansard Health',
        policyNumber: 'AXA-33821-LAUT',
        verified: true
      },
      paymentReference: `TXN-SEED-${Date.now().toString(16).toUpperCase()}`,
      teleconsultLink: `https://kbf-telehealth.ng/v/obgyn-${randomId}`,
      status: 'SCHEDULED',
      createdAt: new Date().toISOString()
    };

    await createAppointment(newEncounter);
    if (onNavigateToConsultation) {
      onNavigateToConsultation(newEncounter.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden text-slate-900"
        role="dialog"
        aria-labelledby="json-db-title"
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-600/30 text-blue-400 border border-blue-500/40">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="json-db-title" className="text-base sm:text-lg font-bold tracking-tight text-white font-sans">
                  Clinical JSON Database &amp; Backend Console
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-semibold border border-emerald-500/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  REST API Online
                </span>
              </div>
              <p className="text-slate-400 text-xs mt-0.5">
                {dbStats.clusterNode} • Schema v{dbStats.version} • Local JSON Store
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={handleDownloadFullDatabase}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 flex items-center gap-1.5 transition min-h-[36px]"
              title="Download full db.json snapshot"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              <span>Export DB</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition min-h-[36px] min-w-[36px] flex items-center justify-center"
              title="Close Console"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Network & Storage Banner */}
        <div className="bg-slate-950 px-4 py-2 border-b border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-300 gap-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 font-mono text-[11px]">
              <Server className="w-3.5 h-3.5 text-emerald-400" />
              <span>Node Latency: <strong className="text-emerald-300">~28ms</strong></span>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-[11px]">
              <Activity className="w-3.5 h-3.5 text-blue-400" />
              <span>Storage: <strong className="text-blue-300">{(dbStats.approxStorageBytes / 1024).toFixed(1)} KB</strong></span>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>Standard: <strong className="text-indigo-300">NDPR / AES-256</strong></span>
            </div>
          </div>

          {lastApiAction && (
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60">
              <span className={`w-1.5 h-1.5 rounded-full ${isSyncing ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`}></span>
              <span className="truncate max-w-[280px]">{lastApiAction}</span>
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-slate-200 bg-slate-50 px-4 pt-2 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('collections')}
              className={`px-3.5 py-2 text-xs font-bold rounded-t-xl border-t border-x transition-all flex items-center gap-1.5 min-h-[38px] ${
                activeTab === 'collections'
                  ? 'bg-white text-blue-700 border-slate-200 shadow-2xs'
                  : 'bg-transparent text-slate-600 border-transparent hover:text-slate-900'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Collections Explorer</span>
            </button>

            <button
              onClick={() => setActiveTab('logs')}
              className={`px-3.5 py-2 text-xs font-bold rounded-t-xl border-t border-x transition-all flex items-center gap-1.5 min-h-[38px] ${
                activeTab === 'logs'
                  ? 'bg-white text-blue-700 border-slate-200 shadow-2xs'
                  : 'bg-transparent text-slate-600 border-transparent hover:text-slate-900'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>REST API Monitor</span>
              <span className="px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700 text-[10px] font-mono">
                {apiLogs.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`px-3.5 py-2 text-xs font-bold rounded-t-xl border-t border-x transition-all flex items-center gap-1.5 min-h-[38px] ${
                activeTab === 'admin'
                  ? 'bg-white text-blue-700 border-slate-200 shadow-2xs'
                  : 'bg-transparent text-slate-600 border-transparent hover:text-slate-900'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>DB Management</span>
            </button>
          </div>

          <span className="text-[11px] text-slate-500 hidden sm:inline font-medium">
            Active Records: {dbStats.totalAppointments} apts • {dbStats.totalPatients} patients • {dbStats.totalPrescriptions} rx
          </span>
        </div>

        {/* Tab 1: Collections Explorer */}
        {activeTab === 'collections' && (
          <div className="p-4 flex-1 flex flex-col overflow-hidden space-y-3">
            {/* Collection Selectors & Filter */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
                <button
                  onClick={() => setSelectedCollection('appointments')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shrink-0 ${
                    selectedCollection === 'appointments'
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>appointments.json ({appointments.length})</span>
                </button>

                <button
                  onClick={() => setSelectedCollection('patients')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shrink-0 ${
                    selectedCollection === 'patients'
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>patients.json ({patients.length})</span>
                </button>

                <button
                  onClick={() => setSelectedCollection('prescriptions')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shrink-0 ${
                    selectedCollection === 'prescriptions'
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Pill className="w-3.5 h-3.5" />
                  <span>prescriptions.json ({prescriptions.length})</span>
                </button>

                <button
                  onClick={() => setSelectedCollection('hmoPolicies')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shrink-0 ${
                    selectedCollection === 'hmoPolicies'
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>hmo_claims.json ({hmoPolicies.length})</span>
                </button>

                <button
                  onClick={() => setSelectedCollection('complianceLogs')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shrink-0 ${
                    selectedCollection === 'complianceLogs'
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>audit_trail.json ({complianceLogs.length})</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative flex-1 sm:w-56">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search records..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={handleCopyJson}
                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1 transition shrink-0 min-h-[32px]"
                  title="Copy formatted JSON to clipboard"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Formatted Code Block */}
            <div className="flex-1 bg-slate-950 text-slate-200 p-3.5 rounded-xl border border-slate-800 font-mono text-xs overflow-auto no-scrollbar select-text shadow-inner">
              <pre className="whitespace-pre text-[11px] leading-relaxed">
                {JSON.stringify(activeCollectionData, null, 2)}
              </pre>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
              <span>Collection: <strong>{selectedCollection}</strong> • {Array.isArray(activeCollectionData) ? activeCollectionData.length : 0} records filtered</span>
              <span>Storage Driver: Indexed Local JSON Key-Value Store</span>
            </div>
          </div>
        )}

        {/* Tab 2: REST API Transactions Monitor */}
        {activeTab === 'logs' && (
          <div className="p-4 flex-1 flex flex-col overflow-hidden space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Real-Time Backend HTTP Activity Log</h4>
                <p className="text-slate-500 text-xs">Simulated low-latency RESTful transactions across clinical micro-endpoints</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono text-xs font-semibold">
                HTTP 200/201 Healthy
              </span>
            </div>

            <div className="flex-1 bg-slate-950 text-slate-200 rounded-xl border border-slate-800 p-3 overflow-y-auto no-scrollbar font-mono text-xs space-y-1.5 shadow-inner">
              {apiLogs.length === 0 ? (
                <div className="text-center py-10 text-slate-500">No API calls recorded yet.</div>
              ) : (
                apiLogs.map((log) => {
                  const isGet = log.method === 'GET';
                  const isPost = log.method === 'POST';
                  const isPatch = log.method === 'PATCH';
                  const isDelete = log.method === 'DELETE';

                  const badgeColor = isGet
                    ? 'bg-blue-900/60 text-blue-300 border-blue-700'
                    : isPost
                    ? 'bg-emerald-900/60 text-emerald-300 border-emerald-700'
                    : isPatch
                    ? 'bg-amber-900/60 text-amber-300 border-amber-700'
                    : 'bg-rose-900/60 text-rose-300 border-rose-700';

                  return (
                    <div 
                      key={log.id} 
                      className="p-2 rounded bg-slate-900/70 border border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 hover:bg-slate-900 transition"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${badgeColor}`}>
                          {log.method}
                        </span>
                        <span className="text-slate-300 font-semibold text-[11px]">{log.endpoint}</span>
                        <span className="text-slate-500 text-[10px] hidden md:inline">({log.summary})</span>
                      </div>

                      <div className="flex items-center gap-3 text-[11px] shrink-0 self-end sm:self-auto">
                        <span className="text-emerald-400 font-bold">{log.statusCode}</span>
                        <span className="text-slate-400">{log.latencyMs}ms</span>
                        <span className="text-slate-500 text-[10px]">{log.timestamp}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Database Administration & Seed Engine */}
        {activeTab === 'admin' && (
          <div className="p-4 sm:p-6 flex-1 overflow-y-auto no-scrollbar space-y-5">
            {/* Seed Actions */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <h4 className="text-sm font-bold text-slate-900">Synthetic Clinical Data Generator</h4>
              </div>
              <p className="text-xs text-slate-600">
                Inject realistic clinical appointments directly into the database to test doctor consultation and prescription dispatch flows.
              </p>

              <div className="flex flex-wrap gap-2.5">
                <button
                  onClick={handleSeedSampleObGyn}
                  className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition min-h-[38px]"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Seed Routine Antenatal Encounter (Mrs. Fatima Alabi)</span>
                </button>
                <button
                  onClick={resetToDemoState}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition min-h-[38px]"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset to Factory Clinical Seed</span>
                </button>
              </div>
            </div>

            {/* Import JSON Snapshot */}
            <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-indigo-600" />
                <h4 className="text-sm font-bold text-slate-900">Import / Restore JSON Database Snapshot</h4>
              </div>
              <p className="text-xs text-slate-600">
                Paste a complete database JSON string (with <code>collections.appointments</code>) to restore or replace current state.
              </p>

              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder='Paste database JSON snapshot here... e.g. { "schemaVersion": "2.0.0", "collections": { "appointments": [...] } }'
                rows={4}
                className="w-full p-2.5 text-xs font-mono border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              />

              {importStatus && (
                <div className={`p-2.5 rounded-lg text-xs font-medium ${importStatus.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>
                  {importStatus.message}
                </div>
              )}

              <div className="flex items-center gap-2">
                <button
                  onClick={handleImportSubmit}
                  disabled={!importText.trim()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition min-h-[38px]"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Restore Snapshot</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-3.5 bg-slate-100 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Local JSON Engine Synchronized • Auto-persisted to browser storage</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-lg font-semibold transition text-xs"
          >
            Close Console
          </button>
        </div>
      </div>
    </div>
  );
};
