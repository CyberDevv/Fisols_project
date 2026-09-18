import { 
  Specialist, 
  PharmacogenomicRule, 
  PatientProfile, 
  NDPRComplianceEntry,
  AppointmentBooking,
  DigitalPrescription,
  PrescriptionItem
} from '../types';

export const SPECIALISTS: Specialist[] = [
  {
    id: 'spec-prof-akintunde',
    name: 'Prof. Adeseye Akintunde',
    title: 'Professor of Medicine & Consultant Cardiologist',
    department: 'Cardiology',
    institution: 'LAUTECH Teaching Hospital, Ogbomoso / Osogbo',
    qualifications: 'MBBS, FWACP, FACC, FESC',
    precisionExpertise: [
      'Cardiovascular Pharmacogenomics',
      'CYP2C19 Antiplatelet Resistance',
      'Hypertension & Post-PCI Stent Care',
      'Geneva-Informed Lipid Management'
    ],
    lautechFacultyRole: 'Head of Clinical Cardiology & Faculty of Clinical Sciences, LAUTECH',
    bio: 'Renowned academic cardiologist leading precision cardiovascular medicine at LAUTECH Teaching Hospital. Specializes in tailoring dual antiplatelet therapy based on CYP2C19 and SLCO1B1 genotypic variants.',
    availableSlots: [
      { date: 'Tomorrow', time: '09:00 AM', available: true },
      { date: 'Tomorrow', time: '11:30 AM', available: true },
      { date: 'Tomorrow', time: '02:00 PM', available: true },
      { date: 'In 2 Days', time: '10:00 AM', available: true },
      { date: 'In 2 Days', time: '03:30 PM', available: true },
    ]
  },
  {
    id: 'spec-dr-adeleke',
    name: 'Dr. Folashade Adeleke',
    title: 'Senior Consultant Neurologist',
    department: 'Neurology',
    institution: 'LAUTECH Teaching Hospital',
    qualifications: 'MBBS, FMCP (Neurol), Postgrad Dipl. Neurogenetics',
    precisionExpertise: [
      'CYP2D6 Analgesic & Antiepileptic Triage',
      'Precision Migraine Management',
      'Drug Resistance Profiling'
    ],
    lautechFacultyRole: 'Consultant Neurologist & Senior Lecturer, LAUTECH College of Health Sciences',
    bio: 'Specialist in precision neuro-pharmacotherapy, focusing on tailored anticonvulsant and analgesic therapies calibrated to CYP metabolic phenotypes.',
    availableSlots: [
      { date: 'Tomorrow', time: '10:00 AM', available: true },
      { date: 'Tomorrow', time: '01:30 PM', available: true },
      { date: 'In 2 Days', time: '11:00 AM', available: true },
    ]
  },
  {
    id: 'spec-dr-okonkwo',
    name: 'Dr. Nneka Okonkwo',
    title: 'Consultant Clinical Geneticist & Precision Oncologist',
    department: 'Oncology & Clinical Genetics',
    institution: 'LAUTECH Teaching Hospital / UniGeneva Affiliate',
    qualifications: 'MBBS, PhD (Geneva), FWACP, Cert. Pharmacogenomics',
    precisionExpertise: [
      'DPYD & TPMT Toxicity Pre-Screening',
      'HLA-B*5701 Hypersensitivity Panels',
      'Genomic Tumor Board Triage'
    ],
    lautechFacultyRole: 'Adjunct Research Lead in Precision Therapeutics & Genomic Surveillance',
    bio: 'Trained at the University of Geneva Precision Medicine Institute, pioneering algorithmic ADR prediction in West African cohorts.',
    availableSlots: [
      { date: 'Tomorrow', time: '02:30 PM', available: true },
      { date: 'In 2 Days', time: '09:30 AM', available: true },
      { date: 'In 2 Days', time: '01:00 PM', available: true },
    ]
  },
  {
    id: 'spec-dr-lawal',
    name: 'Dr. Babatunde Lawal',
    title: 'Consultant Endocrinologist & Diabetologist',
    department: 'Endocrinology',
    institution: 'LAUTECH Teaching Hospital',
    qualifications: 'MBBS, FWACP, FACE',
    precisionExpertise: [
      'Cardiometabolic Risk Sequencing',
      'SLCO1B1 Statin-Induced Myopathy Avoidance',
      'Personalized Glycemic Control'
    ],
    lautechFacultyRole: 'Consultant Physician & Faculty Member, LAUTECH',
    bio: 'Focuses on integrating precision lipidology with metabolic syndrome therapeutics to avert drug-induced adverse events.',
    availableSlots: [
      { date: 'Tomorrow', time: '11:00 AM', available: true },
      { date: 'In 2 Days', time: '02:00 PM', available: true },
    ]
  },
  {
    id: 'spec-dr-adebayo',
    name: 'Dr. Adekunle Adebayo',
    title: 'Consultant Obstetrician & Gynaecologist',
    department: 'Obstetrics & Gynaecology',
    institution: 'LAUTECH Teaching Hospital, Ogbomoso',
    qualifications: 'MBBS, FWACS, FMCOG',
    precisionExpertise: [
      'Routine Antenatal Care & Postpartum Triage',
      'Contraceptive Counseling & Family Planning',
      'Menstrual Disorder & Hormonal Tracking',
      'LAUTECH Tele-Gynecology Routine Protocol'
    ],
    lautechFacultyRole: 'Consultant Obstetrician & Gynaecologist, Department of Obstetrics & Gynaecology, LAUTECH Teaching Hospital, Ogbomoso',
    bio: 'Consultant Obstetrician & Gynaecologist at LAUTECH Teaching Hospital, Ogbomoso. Oversees elective outpatient virtual reviews, postpartum check-ins, contraceptive guidance, and stable gynecological care following strict institutional safety screening.',
    availableSlots: [
      { date: 'Tomorrow', time: '09:30 AM', available: true },
      { date: 'Tomorrow', time: '11:45 AM', available: true },
      { date: 'Tomorrow', time: '02:15 PM', available: true },
      { date: 'In 2 Days', time: '10:00 AM', available: true },
      { date: 'In 2 Days', time: '01:30 PM', available: true },
    ]
  },
  {
    id: 'spec-dr-adeniran',
    name: 'Dr. Adeniran Muibat',
    title: 'Consultant Obstetrician & Gynaecologist',
    department: 'Obstetrics & Gynaecology',
    institution: 'LAUTECH Teaching Hospital, Ogbomoso',
    qualifications: 'MBBS, FWACS (OB/GYN), FMCOG',
    precisionExpertise: [
      'Maternal-Fetal Triage & Routine Antenatal Surveillance',
      'High-Resolution Reproductive Health & Contraceptive Guidance',
      'Adolescent & Adult Menstrual Disorder Management',
      'LAUTECH Tele-Gynecology Routine Protocol'
    ],
    lautechFacultyRole: 'Consultant Obstetrician & Gynaecologist, Department of Obstetrics & Gynaecology, LAUTECH Teaching Hospital, Ogbomoso',
    bio: 'Consultant Obstetrician & Gynaecologist at LAUTECH Teaching Hospital, Ogbomoso. Specializes in routine antenatal wellness surveillance, post-delivery recovery check-ins, reproductive health counseling, and ambulatory gynecological virtual triage under accredited institutional safety protocols.',
    availableSlots: [
      { date: 'Tomorrow', time: '10:15 AM', available: true },
      { date: 'Tomorrow', time: '01:00 PM', available: true },
      { date: 'Tomorrow', time: '03:45 PM', available: true },
      { date: 'In 2 Days', time: '11:15 AM', available: true },
      { date: 'In 2 Days', time: '02:45 PM', available: true },
    ]
  },
  {
    id: 'spec-dr-najimudeen',
    name: 'Dr. Idowu Najimudeen',
    title: 'Consultant Urologist',
    department: 'Surgery & Urology',
    institution: 'LAUTECH Teaching Hospital, Ogbomoso',
    qualifications: 'MBBS, FWACS (Urology), FICS',
    precisionExpertise: [
      'Elective Pre-Operative Urological Evaluation',
      'Post-Operative Surgical Recovery & Wound Tracking',
      'Benign Prostatic Hyperplasia (BPH) & LUTS Management',
      'LAUTECH Elective Surgical & Urological Routine Protocol'
    ],
    lautechFacultyRole: 'Consultant Urologist, Department of Surgery, LAUTECH Teaching Hospital, Ogbomoso',
    bio: 'Consultant Urologist at LAUTECH Teaching Hospital, Ogbomoso. Directs the elective outpatient surgical and urological telehealth service, managing pre-op assessments, catheter follow-ups, PSA and biopsy review, and non-acute surgical recovery.',
    availableSlots: [
      { date: 'Tomorrow', time: '10:00 AM', available: true },
      { date: 'Tomorrow', time: '12:30 PM', available: true },
      { date: 'Tomorrow', time: '03:15 PM', available: true },
      { date: 'In 2 Days', time: '11:00 AM', available: true },
      { date: 'In 2 Days', time: '02:30 PM', available: true },
    ]
  },
  {
    id: 'spec-dr-olayinka',
    name: 'Dr. Oluwajoba A. Olayinka',
    title: 'Consultant Family Physician & CMAC',
    department: 'Family Medicine',
    institution: 'LAUTECH Teaching Hospital, Ogbomoso',
    qualifications: 'MBBS, FMCFM, FWACP (Family Med)',
    precisionExpertise: [
      'Primary Health Care & Ambulatory Medicine',
      'Chronic Disease Management (Hypertension & Diabetes)',
      'General Health Assessments & Wellness Screening',
      'LAUTECH Primary Health Care Routine Protocol'
    ],
    lautechFacultyRole: 'Chairman, Medical Advisory Committee (CMAC) & Consultant Family Physician, LAUTECH Teaching Hospital, Ogbomoso',
    bio: 'Consultant Family Physician and Chairman Medical Advisory Committee (CMAC) at LAUTECH Teaching Hospital, Ogbomoso. Directs the elective primary care telehealth service, providing comprehensive outpatient consultations, chronic disease monitoring, wellness screenings, and coordinated specialist referrals.',
    availableSlots: [
      { date: 'Tomorrow', time: '08:30 AM', available: true },
      { date: 'Tomorrow', time: '11:00 AM', available: true },
      { date: 'Tomorrow', time: '02:00 PM', available: true },
      { date: 'In 2 Days', time: '09:30 AM', available: true },
      { date: 'In 2 Days', time: '01:30 PM', available: true },
    ]
  }
];

export const GENEVA_PHARMACOGENOMIC_RULES: PharmacogenomicRule[] = [
  {
    id: 'rule-clopidogrel-cyp2c19',
    drugName: 'Clopidogrel',
    drugClass: 'P2Y12 Antiplatelet Inhibitor',
    primaryIndication: 'Secondary prevention of acute coronary syndrome (ACS) & post-PCI stent thrombosis',
    targetGene: 'CYP2C19',
    triggerVariant: '*2/*2 or *2/*3',
    triggerPhenotype: 'Poor Metabolizer',
    riskSeverity: 'CONTRAINDICATED',
    warningSummary: 'Ineffective Prodrug Bioactivation: High Risk of Fatal Stent Thrombosis & Ischemic Stroke',
    biologicalMechanism: 'Clopidogrel requires sequential hepatic CYP2C19 enzymatic bioactivation into its active thiol metabolite. In CYP2C19 poor metabolizers, active drug exposure is reduced by >70%, leading to acute subtherapeutic platelet inhibition.',
    genevaGuidelineRecommendation: 'CONTRAINDICATED per University of Geneva / CPIC Level 1A guidelines. Do NOT prescribe Clopidogrel. Immediately switch to an active agent not dependent on CYP2C19 bioactivation: Ticagrelor (90mg BID) or Prasugrel (10mg daily if non-elderly/no prior TIA).',
    saferAlternatives: ['Ticagrelor (90mg BID)', 'Prasugrel (10mg OD)'],
    referenceCitation: 'UniGeneva Pharmacogenomic Clinical Protocol §4.2 & CPIC Guideline for CYP2C19 Genotype and Clopidogrel'
  },
  {
    id: 'rule-simvastatin-slco1b1',
    drugName: 'Simvastatin',
    drugClass: 'HMG-CoA Reductase Inhibitor (Statin)',
    primaryIndication: 'Dyslipidemia, atherosclerotic cardiovascular risk reduction',
    targetGene: 'SLCO1B1',
    triggerVariant: '521T>C (*5 or *15 allele)',
    triggerPhenotype: 'High Myopathy Risk',
    riskSeverity: 'HIGH_ADR_ALERT',
    warningSummary: 'Severe Risk of Statin-Induced Myopathy and Toxic Rhabdomyolysis',
    biologicalMechanism: 'The SLCO1B1 gene encodes the organic anion transporting polypeptide OATP1B1, which mediates hepatic uptake of statins. The 521T>C variant severely impedes clearance, multiplying circulating systemic plasma concentrations by up to 220%.',
    genevaGuidelineRecommendation: 'High ADR Alert: Avoid high-dose Simvastatin (>20mg/day). Prefer alternative statin with non-SLCO1B1 clearance pathway, such as Rosuvastatin (5-10mg/day) or Pravastatin, with baseline CK monitoring.',
    saferAlternatives: ['Rosuvastatin (5-10mg OD)', 'Pravastatin (20-40mg OD)', 'Ezetimibe (10mg OD)'],
    referenceCitation: 'University of Geneva Division of Clinical Pharmacology & CPIC Guidelines for SLCO1B1'
  },
  {
    id: 'rule-codeine-cyp2d6-poor',
    drugName: 'Codeine',
    drugClass: 'Opioid Analgesic / Prodrug',
    primaryIndication: 'Moderate musculoskeletal or post-operative pain',
    targetGene: 'CYP2D6',
    triggerVariant: '*4/*4 or *5/*5 (Loss of function)',
    triggerPhenotype: 'Poor Metabolizer',
    riskSeverity: 'EFFICACY_WARNING',
    warningSummary: 'Lack of Analgesic Efficacy: Zero Morphine Bio-conversion',
    biologicalMechanism: 'Codeine is an inactive prodrug that requires CYP2D6 O-demethylation into morphine to exert analgesia. In poor metabolizers, virtually zero morphine is synthesized, resulting in therapeutic failure.',
    genevaGuidelineRecommendation: 'Avoid codeine due to lack of therapeutic effect. Prescribe non-opioid multimodal analgesia (Paracetamol + NSAIDs) or directly active opioid (e.g. low-dose oral morphine) adjusted for clinical pain score.',
    saferAlternatives: ['Paracetamol + Ibuprofen combo', 'Tramadol (caution: also CYP2D6 dependent)', 'Buprenorphine transdermal'],
    referenceCitation: 'UniGeneva Pharmacogenomics Guidelines: CYP2D6 Opioid Panel'
  },
  {
    id: 'rule-tramadol-cyp2d6-ultra',
    drugName: 'Tramadol',
    drugClass: 'Synthetic Opioid Analgesic',
    primaryIndication: 'Neuropathic & severe acute pain',
    targetGene: 'CYP2D6',
    triggerVariant: '*1/*1xN (Gene Duplication)',
    triggerPhenotype: 'Ultrarapid Metabolizer',
    riskSeverity: 'CONTRAINDICATED',
    warningSummary: 'Toxic Opioid Overexposure: Extreme Risk of Fatal Respiratory Depression & Sedation',
    biologicalMechanism: 'Excessive CYP2D6 copy number hyper-converts tramadol into its M1 active metabolite at dangerous velocity, leading to rapid narcotic intoxication at ordinary therapeutic doses.',
    genevaGuidelineRecommendation: 'CONTRAINDICATED in CYP2D6 ultrarapid metabolizers per Geneva clinical protocol. High risk of fatal central apnea. Substitute with alternative non-codeine/non-tramadol analgesic.',
    saferAlternatives: ['Gabapentin (300mg TID for neuropathic pain)', 'Acetaminophen / Naproxen regimen'],
    referenceCitation: 'Swiss Medical Board & Geneva Precision Therapeutics Directive'
  },
  {
    id: 'rule-warfarin-vkorc1',
    drugName: 'Warfarin',
    drugClass: 'Vitamin K Antagonist Anticoagulant',
    primaryIndication: 'Atrial fibrillation, mechanical valve anticoagulation, DVT/PE',
    targetGene: 'VKORC1',
    triggerVariant: '-1639G>A (Promoter Variant) + CYP2C9 *2/*3',
    triggerPhenotype: 'Poor Metabolizer',
    riskSeverity: 'DOSE_ADJUSTMENT',
    warningSummary: 'Extreme Bleeding Vulnerability: Requires 60% Dosage Reduction',
    biologicalMechanism: 'VKORC1 -1639A allele down-regulates vitamin K epoxide reductase synthesis, while CYP2C9 variants slow S-warfarin clearance, creating a dual hyper-sensitive phenotype.',
    genevaGuidelineRecommendation: 'Initiate therapy at reduced dose (<2.0mg/day). Monitor INR at 48-hour intervals until stabilized, or evaluate conversion to Direct Oral Anticoagulant (Apixaban 5mg BID) if non-valvular indication.',
    saferAlternatives: ['Apixaban (5mg BID)', 'Rivaroxaban (20mg OD with food)'],
    referenceCitation: 'Geneva Anticoagulation Taskforce / IWPC Algorithm Standards'
  },
  {
    id: 'rule-abacavir-hla',
    drugName: 'Abacavir',
    drugClass: 'Nucleoside Reverse Transcriptase Inhibitor (NRTI)',
    primaryIndication: 'Antiretroviral therapy (HIV-1 management)',
    targetGene: 'HLA-B*5701',
    triggerVariant: 'Positive Allele',
    triggerPhenotype: 'High Hypersensitivity Risk',
    riskSeverity: 'CONTRAINDICATED',
    warningSummary: 'Lethal Immunological Hypersensitivity Syndrome (HSR)',
    biologicalMechanism: 'Abacavir binds non-covalently within the F-pocket of HLA-B*5701, altering the peptide-binding cleft and provoking massive polyclonal CD8+ T-cell autoimmune attack affecting skin, lungs, and liver.',
    genevaGuidelineRecommendation: 'ABSOLUTE CONTRAINDICATION. Never prescribe Abacavir to HLA-B*5701 positive patients. Life-threatening multiorgan failure. Select Tenofovir Alafenamide (TAF) or Tenofovir Disoproxil (TDF) regimen.',
    saferAlternatives: ['Tenofovir Alafenamide (TAF) + Emtricitabine', 'Dolutegravir-based combination'],
    referenceCitation: 'University of Geneva Infectious Diseases Pharmacogenomics Standard & FDA Black Box Warning'
  },
  {
    id: 'rule-fluorouracil-dpyd',
    drugName: 'Fluorouracil (5-FU)',
    drugClass: 'Fluoropyrimidine Chemotherapeutic',
    primaryIndication: 'Colorectal, gastric, and breast malignancies',
    targetGene: 'DPYD',
    triggerVariant: '*2A (c.1905+1G>A)',
    triggerPhenotype: 'Poor Metabolizer',
    riskSeverity: 'CONTRAINDICATED',
    warningSummary: 'Fatal Chemotherapeutic Toxicity: Severe Agranulocytosis & Mucositis',
    biologicalMechanism: 'Dihydropyrimidine dehydrogenase (DPD) breaks down >80% of administered 5-FU. Complete or intermediate deficiency leads to persistent cytotoxic drug levels and near-100% mortality without rescue.',
    genevaGuidelineRecommendation: 'CONTRAINDICATED in homozygous deficient, or reduce dose by >=50% with therapeutic drug monitoring (TDM) in intermediate phenotypes.',
    saferAlternatives: ['Non-fluoropyrimidine targeted regimen', 'Capecitabine at 50% dose under TDM'],
    referenceCitation: 'CPIC Guidelines for DPYD and Fluoropyrimidines & Swiss Clinical Cancer Registry'
  }
];

export const DEMO_PATIENT: PatientProfile = {
  id: 'pat-lautech-8841',
  fullName: 'Adewale Johnson Adeleke',
  email: 'a.adeleke@telemed.kbf.org',
  phone: '+234 803 451 9284',
  age: 54,
  gender: 'Male',
  stateOfResidence: 'Oyo State (Ogbomoso / Ibadan)',
  chronicConditions: [
    'Hypertension (Stage 2, diagnosed 2021)',
    'Post-Percutaneous Coronary Intervention (DES Stent placed in LAD)',
    'Mild Hyperlipidemia'
  ],
  drugAllergies: ['Penicillin (Moderate urticaria)'],
  emergencyContact: {
    name: 'Mrs. Funmilayo Adeleke',
    phone: '+234 802 319 8812',
    relationship: 'Spouse'
  },
  hmoProvider: 'Hygeia HMO Nigeria',
  hmoNumber: 'HYG-77492-LAUT',
  ndprConsentGiven: true,
  ndprConsentDate: '2026-09-08 06:15 UTC',
  geneticProfile: [
    {
      gene: 'CYP2C19',
      variant: '*2/*2',
      phenotype: 'Poor Metabolizer',
      testedDate: '2026-08-14',
      accreditation: 'UniGeneva-Certified Molecular Genetics Lab / 54gene Partner',
      clinicalImpact: 'Inability to activate clopidogrel prodrug into active antiplatelet form. Stent thrombosis danger.'
    },
    {
      gene: 'SLCO1B1',
      variant: '521T>C (*5)',
      phenotype: 'High Myopathy Risk',
      testedDate: '2026-08-14',
      accreditation: 'UniGeneva-Certified Molecular Genetics Lab / 54gene Partner',
      clinicalImpact: 'Defective hepatic uptake transporter OATP1B1. Markedly heightened risk of statin myopathy with Simvastatin.'
    },
    {
      gene: 'CYP2D6',
      variant: '*1/*1',
      phenotype: 'Normal Metabolizer',
      testedDate: '2026-08-14',
      accreditation: 'UniGeneva-Certified Molecular Genetics Lab / 54gene Partner',
      clinicalImpact: 'Standard conversion kinetics for beta-blockers and opioids.'
    },
    {
      gene: 'VKORC1',
      variant: '-1639G>G',
      phenotype: 'Normal Function',
      testedDate: '2026-08-14',
      accreditation: 'UniGeneva-Certified Molecular Genetics Lab / 54gene Partner',
      clinicalImpact: 'Standard baseline sensitivity to vitamin K antagonists.'
    }
  ]
};

export const SAMPLE_COMPLIANCE_LOGS: NDPRComplianceEntry[] = [
  {
    id: 'ndpr-901',
    timestamp: '2026-09-08 07:12:04',
    actor: 'Patient (Self-Service Onboarding)',
    action: 'Affirmative Consent Granted under NDPR Art. 2.1(a) for Genomic & Health Data Processing',
    dataCategory: 'PATIENT_GENOMIC_DATA',
    encryptionStandard: 'AES-256 (At Rest)',
    regulatoryArticle: 'NDPR 2019 / Nigeria Data Protection Act 2023 §31'
  },
  {
    id: 'ndpr-902',
    timestamp: '2026-09-08 07:15:30',
    actor: 'LAUTECH Clinical Triage Engine',
    action: 'Encrypted Lab compression & Zero-Leakage Specialist Allocation',
    dataCategory: 'EHR_CONSULTATION',
    encryptionStandard: 'TLS 1.3 (In Transit)',
    regulatoryArticle: 'NDPR Art. 2.6 (Security of Processing)'
  },
  {
    id: 'ndpr-903',
    timestamp: '2026-09-08 07:18:22',
    actor: 'Prof. Adeseye Akintunde (Physician Console)',
    action: 'Bi-directional Ephemeral Token Generation for WebRTC Audio/Video Session',
    dataCategory: 'TELEMED_STREAM',
    encryptionStandard: 'TLS 1.3 (In Transit)',
    regulatoryArticle: 'NDPR Confidentiality Standards & Medical Ethics Act'
  },
  {
    id: 'ndpr-904',
    timestamp: '2026-09-08 07:22:45',
    actor: 'Geneva Pharmacogenomic CDS Module',
    action: 'Automated Cryptographic Hash generated for E-Prescription with SHA-256 validation',
    dataCategory: 'E_PRESCRIPTION',
    encryptionStandard: 'AES-256 (At Rest)',
    regulatoryArticle: 'NDPR Integrity & Accountability Directive'
  }
];

export const PARTNER_PHARMACIES = [
  {
    id: 'pharm-lautech-central',
    name: 'LAUTECH Teaching Hospital Central Pharmacy',
    branch: 'Ogbomoso Main Clinical Complex, Oyo State',
    estimatedDeliveryHours: 2,
    certifiedPrecisionDispenser: true
  },
  {
    id: 'pharm-medplus-ibadan',
    name: 'Medplus Pharmacy Network',
    branch: 'Ring Road Branch, Ibadan & Southwest Express Hub',
    estimatedDeliveryHours: 4,
    certifiedPrecisionDispenser: true
  },
  {
    id: 'pharm-healthplus',
    name: 'HealthPlus Precision Care Pharmacy',
    branch: 'Bodija Regional Dispatch, Ibadan',
    estimatedDeliveryHours: 6,
    certifiedPrecisionDispenser: true
  }
];

export const HMO_LIST = [
  'Hygeia HMO Nigeria',
  'Reliance HMO',
  'AXA Mansard Health',
  'Leadway Health',
  'Avon Healthcare',
  'National Health Insurance Authority (NHIA / NHIS)',
  'Direct Private Pay (Paystack / Flutterwave / USSD)'
];

export const DEMO_PATIENT_AMINA: PatientProfile = {
  id: 'pat-lautech-9204',
  fullName: 'Dr. Amina Bello',
  email: 'amina.bello@telemed.kbf.org',
  phone: '+234 802 771 4432',
  age: 39,
  gender: 'Female',
  stateOfResidence: 'Oyo State (Ibadan)',
  chronicConditions: ['Refractory Migraine with Aura', 'Post-Craniotomy Neuropathic Pain'],
  drugAllergies: ['Sulfonamides (Severe exanthema)'],
  emergencyContact: {
    name: 'Alhaji Usman Bello',
    phone: '+234 803 118 9021',
    relationship: 'Brother'
  },
  hmoProvider: 'AXA Mansard Health',
  hmoNumber: 'AXA-99214-LAUT',
  ndprConsentGiven: true,
  ndprConsentDate: '2026-09-08 07:00 UTC',
  geneticProfile: [
    {
      gene: 'CYP2D6',
      variant: '*4/*4',
      phenotype: 'Poor Metabolizer',
      testedDate: '2026-08-20',
      accreditation: 'UniGeneva Molecular Core Lab',
      clinicalImpact: 'Zero bioactivation of codeine prodrug to active morphine. Ineffective analgesia.'
    },
    {
      gene: 'CYP2C19',
      variant: '*1/*1',
      phenotype: 'Normal Metabolizer',
      testedDate: '2026-08-20',
      accreditation: 'UniGeneva Molecular Core Lab',
      clinicalImpact: 'Standard antiplatelet and PPI metabolic kinetics.'
    }
  ]
};

export const DEMO_PATIENT_CHUKWUEMEKA: PatientProfile = {
  id: 'pat-lautech-5519',
  fullName: 'Chukwuemeka Anthony Eze',
  email: 'c.eze@telemed.kbf.org',
  phone: '+234 806 883 1920',
  age: 61,
  gender: 'Male',
  stateOfResidence: 'Osun State (Osogbo)',
  chronicConditions: ['Stage III Colorectal Adenocarcinoma (Post-resection)', 'Type 2 Diabetes Mellitus'],
  drugAllergies: ['None reported'],
  emergencyContact: {
    name: 'Mrs. Chinyere Eze',
    phone: '+234 805 442 8119',
    relationship: 'Wife'
  },
  hmoProvider: 'Reliance HMO',
  hmoNumber: 'REL-44019-LAUT',
  ndprConsentGiven: true,
  ndprConsentDate: '2026-09-08 06:45 UTC',
  geneticProfile: [
    {
      gene: 'DPYD',
      variant: '*2A (c.1905+1G>A)',
      phenotype: 'Poor Metabolizer',
      testedDate: '2026-08-28',
      accreditation: 'UniGeneva Precision Oncology Laboratory',
      clinicalImpact: 'Intermediate dihydropyrimidine dehydrogenase deficiency. High risk of 5-FU fatal myelosuppression.'
    }
  ]
};

export const DEMO_PATIENT_OBGYN: PatientProfile = {
  id: 'pat-lautech-obgyn-402',
  fullName: 'Zainab Olawale Balogun',
  email: 'z.balogun@telemed.kbf.org',
  phone: '+234 805 119 4432',
  age: 29,
  gender: 'Female',
  stateOfResidence: 'Oyo State (Ogbomoso)',
  chronicConditions: [
    'Primigravida (24 Weeks Gestation – Low Risk Routine Care)',
    'Stable mild iron deficiency anemia on oral ferrous gluconate'
  ],
  drugAllergies: ['None known'],
  emergencyContact: {
    name: 'Mr. Babajide Balogun',
    phone: '+234 802 555 1902',
    relationship: 'Spouse'
  },
  hmoProvider: 'Reliance HMO Nigeria',
  hmoNumber: 'REL-OBG-33918-LAUT',
  ndprConsentGiven: true,
  ndprConsentDate: '2026-09-15 08:30 UTC',
  geneticProfile: [
    {
      gene: 'SLCO1B1',
      variant: '*1/*1',
      phenotype: 'Normal Function',
      testedDate: '2026-09-01',
      accreditation: 'UniGeneva Maternal & Prenatal Precision Lab',
      clinicalImpact: 'Standard hepatic drug clearance kinetics for pregnancy-safe supplements.'
    }
  ]
};

export const LAUTECH_OBGYN_PROTOCOL = {
  name: 'LAUTECH Tele-Gynecology Routine Protocol',
  routing: 'Elective Outpatient Schedule',
  leadSpecialist: 'Dr. Adekunle Adebayo & Dr. Adeniran Muibat',
  institution: 'LAUTECH Teaching Hospital, Ogbomoso',
  emergencyDisclaimer: 'Emergency Notice: If you are experiencing active heavy vaginal bleeding in pregnancy, severe abdominal pain, or decreased fetal movement, do not use this app. Go immediately to LAUTECH Hospital Emergency.',
  coreElectiveFocus: 'Elective Outpatient Care: This telehealth channel is designed for routine antenatal reviews, postpartum check-ins, menstrual tracking, contraceptive counseling, and stable gynecological care that does not require an immediate physical examination.',
  safetyAcknowledgmentText: 'I confirm my current OB/GYN symptoms are non-emergency and suitable for an elective virtual consultation.',
  eligibleCategories: [
    {
      id: 'antenatal',
      title: 'Routine Antenatal Reviews',
      badge: 'Obstetrics',
      description: 'Scheduled trimester check-in, dietary advice, routine ultrasound review, and fetal kick count education for stable pregnancies.',
      clinicalScope: 'For low-risk pregnancies with normal fetal movement, no contractions, and no bleeding.',
      typicalReviewTime: '20-25 mins'
    },
    {
      id: 'postpartum',
      title: 'Postpartum Check-ins',
      badge: 'Maternal Care',
      description: 'Follow-up at 2 to 12 weeks post-delivery: lochia tracking, cesarean/perineal wound recovery advice, lactation support, and postnatal mental wellness.',
      clinicalScope: 'For normal postpartum healing without heavy hemorrhage, foul odor, or persistent high fever.',
      typicalReviewTime: '20 mins'
    },
    {
      id: 'menstrual',
      title: 'Menstrual Tracking & Dysmenorrhea',
      badge: 'Gynecology',
      description: 'Management of menstrual irregularities, cycle tracking, primary dysmenorrhea management, and non-acute pelvic comfort counseling.',
      clinicalScope: 'For chronic, predictable menstrual concerns without acute sudden collapse or severe unilateral pelvic pain.',
      typicalReviewTime: '15-20 mins'
    },
    {
      id: 'contraceptive',
      title: 'Contraceptive Counseling & Family Planning',
      badge: 'Family Health',
      description: 'Personalized evaluation of barrier methods, oral contraceptives, progesterone implants, IUD pre-consultation, and side-effect reviews.',
      clinicalScope: 'Elective family planning decision support and prescription adjustments.',
      typicalReviewTime: '15-20 mins'
    },
    {
      id: 'stable_gyn',
      title: 'Stable Gynecological Care',
      badge: 'Outpatient Gyn',
      description: 'Review of benign vaginal swabs, routine cervical screening results, pre-conception nutrition planning, and follow-up on treated uncomplicated infections.',
      clinicalScope: 'Conditions not requiring immediate hands-on bimanual pelvic or sterile speculum examination.',
      typicalReviewTime: '20 mins'
    }
  ],
  redFlagTriggers: [
    { id: 'bleeding', label: 'Active heavy vaginal bleeding in pregnancy' },
    { id: 'pain', label: 'Severe abdominal pain' },
    { id: 'fetal_movement', label: 'Decreased fetal movement' }
  ]
};

export const DEMO_PATIENT_SURGERY_UROLOGY: PatientProfile = {
  id: 'pat-lautech-uro-601',
  fullName: 'Alhaji Rasheed Adeleke',
  email: 'r.adeleke@telemed.kbf.org',
  phone: '+234 803 774 2901',
  age: 58,
  gender: 'Male',
  stateOfResidence: 'Osun State (Ede / Ogbomoso corridor)',
  chronicConditions: [
    'Benign Prostatic Hyperplasia (BPH) – Stable on Tamsulosin 0.4mg daily',
    'Post-TURP 6-Week Outpatient Surveillance – Normal urinary stream, zero hematuria'
  ],
  drugAllergies: ['Penicillin (Mild urticarial rash)'],
  emergencyContact: {
    name: 'Mr. Taofeek Adeleke',
    phone: '+234 802 331 8904',
    relationship: 'Son'
  },
  hmoProvider: 'AXA Mansard Health',
  hmoNumber: 'AXA-URO-49102-LAUT',
  ndprConsentGiven: true,
  ndprConsentDate: '2026-09-15 08:45 UTC',
  geneticProfile: [
    {
      gene: 'CYP2D6',
      variant: '*1/*1',
      phenotype: 'Normal Metabolizer',
      testedDate: '2026-08-15',
      accreditation: 'UniGeneva Pharmacogenomics Laboratory',
      clinicalImpact: 'Normal metabolic clearance for post-operative analgesic protocols.'
    }
  ]
};

export const DEMO_PATIENT_ZAINAB: PatientProfile = DEMO_PATIENT_OBGYN;
export const DEMO_PATIENT_ALHAJI: PatientProfile = DEMO_PATIENT_SURGERY_UROLOGY;

export const LAUTECH_SURGERY_UROLOGY_PROTOCOL = {
  name: 'LAUTECH Elective Surgical & Urological Routine Protocol',
  routing: 'Elective Outpatient Schedule',
  leadSpecialist: 'Dr. Idowu Najimudeen',
  institution: 'LAUTECH Teaching Hospital, Ogbomoso',
  emergencyDisclaimer: 'Emergency Notice: If you are experiencing acute severe abdominal pain, sudden urinary retention with severe distress, active gross hematuria with clots, or acute trauma, do not use this app. Go immediately to LAUTECH Hospital Emergency.',
  coreElectiveFocus: 'Elective Outpatient Care: This telehealth channel is designed for elective urological and surgical pre-operative evaluations, post-operative follow-up care, chronic symptom tracking, and routine specialist referrals.',
  safetyAcknowledgmentText: 'I confirm my current surgical/urological symptoms are non-emergency and suitable for an elective virtual consultation.',
  eligibleCategories: [
    {
      id: 'pre_op',
      title: 'Pre-operative Evaluations',
      badge: 'Surgical Prep',
      description: 'Pre-surgical medical clearance, laboratory panel evaluation (e/u/cr, FBC, PSA, coagulogram), anesthesia questionnaire reviews, and fasting instructions.',
      clinicalScope: 'For planned elective surgeries (herniotomy, TURP, cholecystectomy, hydrocelectomy) with stable baseline vitals.',
      typicalReviewTime: '20-25 mins'
    },
    {
      id: 'post_op',
      title: 'Post-operative Follow-up Care',
      badge: 'Recovery & Wound',
      description: 'Routine recovery check-in (1-8 weeks post-surgery): wound dressing photography review, catheter / stent removal scheduling, pain control review, and histology discussion.',
      clinicalScope: 'For uncomplicated post-op recovery without active wound discharge, dehiscence, or high spiking fevers.',
      typicalReviewTime: '20 mins'
    },
    {
      id: 'chronic_symptoms',
      title: 'Chronic Symptom Tracking',
      badge: 'Urology Tracking',
      description: 'Long-term surveillance for Lower Urinary Tract Symptoms (LUTS), International Prostate Symptom Score (IPSS) tracking, stable urolithiasis dietary management, and medication titration.',
      clinicalScope: 'For gradual, predictable urinary flow changes or stable stone surveillance without acute colic.',
      typicalReviewTime: '15-20 mins'
    },
    {
      id: 'specialist_referrals',
      title: 'Routine Specialist Referrals',
      badge: 'Clinical Review',
      description: 'Secondary opinion and triage review for pelvic ultrasounds, elevated serum PSA trends, non-acute testicular swellings, or elective surgical consultation bookings.',
      clinicalScope: 'Non-emergency diagnostic review and formal LAUTECH surgical outpatient clinic scheduling.',
      typicalReviewTime: '20 mins'
    }
  ],
  redFlagTriggers: [
    { id: 'acute_pain', label: 'Acute severe abdominal pain' },
    { id: 'urinary_retention', label: 'Sudden urinary retention with severe distress' },
    { id: 'hematuria_clots', label: 'Active gross hematuria with clots' },
    { id: 'acute_trauma', label: 'Acute trauma' }
  ]
};

export const DEMO_PATIENT_FAMILY_MEDICINE: PatientProfile = {
  id: 'pat-lautech-fm-702',
  fullName: 'Mrs. Folake Abosede Ojo',
  email: 'folake.ojo@telemed.kbf.org',
  phone: '+234 803 219 7780',
  age: 48,
  gender: 'Female',
  stateOfResidence: 'Oyo State (Ogbomoso / Oyo)',
  chronicConditions: [
    'Essential Hypertension (Stage 1, stable on Amlodipine 5mg daily)',
    'Type 2 Diabetes Mellitus (Well-controlled on Metformin 500mg BID, HbA1c 6.4%)',
    'Routine Annual Primary Health & Preventive Wellness Check'
  ],
  drugAllergies: ['None known'],
  emergencyContact: {
    name: 'Mr. Babatunde Ojo',
    phone: '+234 802 663 1198',
    relationship: 'Spouse'
  },
  hmoProvider: 'Hygeia HMO Nigeria',
  hmoNumber: 'HYG-FM-88204-LAUT',
  ndprConsentGiven: true,
  ndprConsentDate: '2026-09-15 09:10 UTC',
  geneticProfile: [
    {
      gene: 'CYP2C9',
      variant: '*1/*1',
      phenotype: 'Normal Metabolizer',
      testedDate: '2026-08-25',
      accreditation: 'UniGeneva Primary Care Pharmacogenomics Unit',
      clinicalImpact: 'Normal metabolic clearance for sulfonylureas, ARBs, and oral antidiabetic agents.'
    },
    {
      gene: 'SLCO1B1',
      variant: '*1/*1',
      phenotype: 'Normal Function',
      testedDate: '2026-08-25',
      accreditation: 'UniGeneva Primary Care Pharmacogenomics Unit',
      clinicalImpact: 'Normal statin transporter function; standard lipid-lowering pharmacotherapy tolerance.'
    }
  ]
};

export const DEMO_PATIENT_FOLAKE: PatientProfile = DEMO_PATIENT_FAMILY_MEDICINE;

export const LAUTECH_FAMILY_MEDICINE_PROTOCOL = {
  name: 'LAUTECH Primary Health Care Routine Protocol',
  routing: 'Elective Outpatient Schedule',
  leadSpecialist: 'Dr. Oluwajoba A. Olayinka',
  specialistTitle: 'Consultant Family Physician & CMAC, LAUTECH Teaching Hospital, Ogbomoso',
  institution: 'LAUTECH Teaching Hospital, Ogbomoso',
  emergencyDisclaimer: 'Emergency Notice: If you are experiencing a life-threatening medical emergency, acute chest pain, sudden collapse, or severe trauma, do not use this app. Go immediately to LAUTECH Hospital Emergency.',
  coreElectiveFocus: 'Elective Outpatient Care: This telehealth channel is designed for routine primary care consultations, chronic disease management (e.g., stable hypertension or diabetes check-ins), general health assessments, and coordinated specialist referrals.',
  safetyAcknowledgmentText: 'I confirm my current primary care symptoms are non-emergency and suitable for an elective virtual consultation.',
  eligibleCategories: [
    {
      id: 'chronic_disease',
      title: 'Chronic Disease Management',
      badge: 'Primary Care',
      description: 'Routine check-in for stable hypertension, type 2 diabetes mellitus, dyslipidemia, or mild asthma. Regular blood pressure & blood sugar tracking and lifestyle titration.',
      clinicalScope: 'For stable vitals without hypertensive emergency, severe hypoglycemia, confusion, or acute dyspnea.',
      typicalReviewTime: '20-25 mins'
    },
    {
      id: 'general_assessment',
      title: 'General Health Assessments',
      badge: 'Wellness Screen',
      description: 'Annual adult wellness reviews, preventive health screening advice, immunization guidance, and general laboratory panel reviews (FBC, urinalysis, lipid profile, LFTs, E/U/Cr).',
      clinicalScope: 'Non-acute ambulatory wellness assessments and routine preventive health profiles.',
      typicalReviewTime: '20 mins'
    },
    {
      id: 'routine_primary',
      title: 'Routine Primary Care Consultations',
      badge: 'Ambulatory Care',
      description: 'Subacute non-emergent complaints such as mild tension headaches, uncomplicated allergic rhinitis, gastroesophageal reflux, or mild musculoskeletal aches.',
      clinicalScope: 'Common ambulatory outpatient presentations without red-flag warning signs.',
      typicalReviewTime: '15-20 mins'
    },
    {
      id: 'specialist_referral',
      title: 'Coordinated Specialist Referrals',
      badge: 'Care Coordination',
      description: 'Holistic clinical evaluation to determine appropriate tertiary specialist referral (cardiology, neurology, oncology, surgery, or OB/GYN) within LAUTECH.',
      clinicalScope: 'Pre-referral workup, diagnostic lab scheduling, and secondary care navigation.',
      typicalReviewTime: '20 mins'
    }
  ],
  redFlagTriggers: [
    { id: 'life_threatening', label: 'Life-threatening medical emergency' },
    { id: 'acute_chest_pain', label: 'Acute chest pain' },
    { id: 'sudden_collapse', label: 'Sudden collapse or syncope' },
    { id: 'severe_trauma', label: 'Severe trauma or major injury' }
  ]
};

export const SEED_APPOINTMENTS: AppointmentBooking[] = [
  {
    id: 'KBF-APT-88410',
    patient: DEMO_PATIENT,
    specialist: SPECIALISTS[0], // Prof. Adeseye Akintunde
    selectedDate: 'Today',
    selectedTime: '09:00 AM',
    triage: {
      severityLevel: 'Severe',
      recommendedDepartment: 'Cardiology',
      matchedSpecialist: SPECIALISTS[0],
      clinicalPriority: 'Expedited (within 12h)',
      triageReasoning: 'Post-PCI LAD stent patient presenting with recurrent exertional chest tightness on clopidogrel therapy. Genomic cross-reference indicated.',
      flaggedRiskFactors: [
        'Post-PCI Drug-Eluting Stent in LAD',
        'Potential CYP2C19 Loss-of-Function Clopidogrel Resistance',
        'Exertional recurrence on dual antiplatelet regimen'
      ]
    },
    documents: [
      {
        id: 'doc-preloaded-01',
        name: '54gene_UniGeneva_CYP450_Comprehensive_Panel.pdf',
        type: 'genetic_panel',
        originalSizeBytes: 4850000,
        compressedSizeBytes: 395000,
        compressionRatio: '91.8% Saved',
        uploadDate: '2026-09-08',
        extractedMarkers: ['CYP2C19 (*2/*2)', 'SLCO1B1 (521T>C)', 'CYP2D6 (*1/*1)', 'VKORC1 (-1639G>G)'],
        status: 'synced_cloud'
      }
    ],
    paymentMode: 'HMO_VERIFICATION',
    hmoDetails: {
      provider: 'Hygeia HMO Nigeria',
      policyNumber: 'HYG-77492-LAUT',
      verified: true
    },
    paymentReference: 'TXN-LAUT-492102',
    teleconsultLink: 'https://kbf-telehealth.ng/v/lautech-cyp-7891',
    status: 'LIVE_IN_PROGRESS',
    createdAt: '2026-09-08T07:15:00.000Z',
    consultationState: {
      vitals: {
        bp: '138/88 mmHg',
        heartRate: 74,
        spo2: 98,
        temperature: '36.8°C',
        weight: '82 kg',
        bmi: '26.4 kg/m²'
      },
      clinicalNotes: 'Patient presented with exertional retrosternal discomfort 6 months post-LAD DES stent placement while on Clopidogrel 75mg OD + Simvastatin 40mg nocte. Cross-referenced with 54gene & University of Geneva genomic panel: Confirmed CYP2C19 *2/*2 Poor Metabolizer (high stent thrombosis risk due to zero active thiol bioactivation) and SLCO1B1 521T>C (high risk of statin-induced myopathy). Plan: Immediately discontinued Clopidogrel & Simvastatin. Prescribed Ticagrelor 90mg BID + Rosuvastatin 10mg OD. Automated 48h follow-up audit scheduled.',
      prescriptionItems: [
        {
          id: 'rx-seed-01',
          medicationName: 'Rosuvastatin',
          dosage: '10mg',
          frequency: 'Once Daily at Bedtime',
          duration: '90 Days',
          genomicStatus: 'TAILORED_DOSAGE',
          pharmacogenomicNote: 'Substituted for Simvastatin due to SLCO1B1 521T>C variant to prevent rhabdomyolysis & statin myopathy.'
        },
        {
          id: 'rx-seed-02',
          medicationName: 'Ticagrelor',
          dosage: '90mg',
          frequency: 'Twice Daily (BID)',
          duration: '90 Days',
          genomicStatus: 'FLAGGED_ADR_PREVENTED',
          pharmacogenomicNote: 'Substituted for Clopidogrel due to CYP2C19 *2/*2 poor metabolizer variant.'
        }
      ],
      generatedPrescription: {
        id: 'RX-LAUTECH-884192',
        appointmentId: 'KBF-APT-88410',
        patientId: 'pat-lautech-8841',
        patientName: 'Adewale Johnson Adeleke',
        physicianName: 'Prof. Adeseye Akintunde',
        physicianLicense: 'MDC-NG/SPEC/78419',
        institution: 'LAUTECH Teaching Hospital, Ogbomoso / Osogbo',
        issuedAt: '2026-09-08 09:42 WAT',
        items: [
          {
            id: 'rx-seed-01',
            medicationName: 'Rosuvastatin',
            dosage: '10mg',
            frequency: 'Once Daily at Bedtime',
            duration: '90 Days',
            genomicStatus: 'TAILORED_DOSAGE',
            pharmacogenomicNote: 'Substituted for Simvastatin due to SLCO1B1 521T>C variant to prevent rhabdomyolysis & statin myopathy.'
          },
          {
            id: 'rx-seed-02',
            medicationName: 'Ticagrelor',
            dosage: '90mg',
            frequency: 'Twice Daily (BID)',
            duration: '90 Days',
            genomicStatus: 'FLAGGED_ADR_PREVENTED',
            pharmacogenomicNote: 'Substituted for Clopidogrel due to CYP2C19 *2/*2 poor metabolizer variant.'
          }
        ],
        partnerPharmacy: {
          id: 'pharm-lautech-central',
          name: 'LAUTECH Teaching Hospital Central Pharmacy',
          branch: 'Ogbomoso Main Clinical Complex, Oyo State',
          routingStatus: 'ACCEPTED_DISPENSING',
          estimatedDeliveryHours: 2
        },
        sha256DigitalSignature: 'a71e48f7634f590b1c9d816a3bc079e5fa49fbd47a6d8123ef6f4b638b97c412',
        qrVerificationPayload: 'https://kbf-telehealth.ng/rx/verify?id=RX-LAUTECH-a71e48f7634f'
      },
      chatMessages: [
        { id: 'msg-1', sender: 'Prof. Akintunde', text: 'Good day Mr. Adeleke, I have your post-PCI angiography and 54gene genetic panel open on my console.', time: '09:02' },
        { id: 'msg-2', sender: 'Patient', text: 'Thank you Professor. I have been having that recurrent tightness in my chest when walking uphill.', time: '09:03' },
        { id: 'msg-3', sender: 'Prof. Akintunde', text: 'The genetic panel explains it clearly: your CYP2C19 *2/*2 phenotype cannot activate Clopidogrel. We are switching you to Ticagrelor 90mg BID immediately.', time: '09:05' }
      ],
      followUp: {
        id: 'fup-9921',
        appointmentId: 'KBF-APT-88410',
        patientName: 'Adewale Johnson Adeleke',
        checkInDueHours: 48,
        status: 'COMPLETED_OPTIMAL',
        symptomScore: 8,
        adverseReactionsReported: ['No muscle ache on Rosuvastatin', 'Chest tightness fully resolved on Ticagrelor'],
        patientNotes: 'Feeling significantly more energetic. Walking 3km daily with zero chest pain.',
        timestamp: '2026-09-08 14:30 WAT',
        auditTrailHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
      }
    }
  },
  {
    id: 'KBF-APT-62104',
    patient: DEMO_PATIENT_AMINA,
    specialist: SPECIALISTS[1], // Dr. Folashade Adeleke (Neurology)
    selectedDate: 'Tomorrow',
    selectedTime: '10:00 AM',
    triage: {
      severityLevel: 'Moderate',
      recommendedDepartment: 'Neurology',
      matchedSpecialist: SPECIALISTS[1],
      clinicalPriority: 'Standard (within 48h)',
      triageReasoning: 'Refractory post-craniotomy headache with zero analgesic relief on standard codeine. Flagged for CYP2D6 metabolizer status.',
      flaggedRiskFactors: [
        'Post-craniotomy neuropathic pain syndrome',
        'Analgesic failure on opioid prodrug',
        'Suspected CYP2D6 loss-of-function'
      ]
    },
    documents: [
      {
        id: 'doc-preloaded-02',
        name: 'Geneva_Neurogenetics_CYP2D6_Panel.pdf',
        type: 'genetic_panel',
        originalSizeBytes: 3120000,
        compressedSizeBytes: 260000,
        compressionRatio: '91.7% Saved',
        uploadDate: '2026-09-08',
        extractedMarkers: ['CYP2D6 (*4/*4 Poor Metabolizer)'],
        status: 'synced_cloud'
      }
    ],
    paymentMode: 'HMO_VERIFICATION',
    hmoDetails: {
      provider: 'AXA Mansard Health',
      policyNumber: 'AXA-99214-LAUT',
      verified: true
    },
    paymentReference: 'TXN-LAUT-621044',
    teleconsultLink: 'https://kbf-telehealth.ng/v/lautech-neuro-6210',
    status: 'SCHEDULED',
    createdAt: '2026-09-08T07:30:00.000Z',
    consultationState: {
      vitals: {
        bp: '118/76 mmHg',
        heartRate: 68,
        spo2: 99,
        temperature: '36.6°C',
        weight: '64 kg',
        bmi: '22.1 kg/m²'
      },
      clinicalNotes: 'Patient post-craniotomy with debilitating hemicranial headaches. Zero analgesic benefit from oral Codeine 30mg. Genomic test confirms CYP2D6 *4/*4 poor metabolizer (zero bio-conversion into morphine). Plan: Discontinue Codeine immediately. Prescribe multimodal non-opioid analgesia and evaluate Sumatriptan.',
      prescriptionItems: [
        {
          id: 'rx-amina-01',
          medicationName: 'Naproxen',
          dosage: '500mg',
          frequency: 'Twice Daily with Meals',
          duration: '14 Days',
          genomicStatus: 'GENETICALLY_SAFE',
          pharmacogenomicNote: 'Non-CYP2D6 dependent anti-inflammatory analgesia.'
        }
      ],
      generatedPrescription: null,
      chatMessages: [
        { id: 'msg-amina-1', sender: 'Dr. Folashade Adeleke', text: 'Hello Dr. Bello, I am reviewing your post-craniotomy imaging and genomic report.', time: '09:15' }
      ],
      followUp: {
        id: 'fup-amina-01',
        appointmentId: 'KBF-APT-62104',
        patientName: 'Dr. Amina Bello',
        checkInDueHours: 48,
        status: 'PENDING_SCHEDULED',
        symptomScore: 5,
        adverseReactionsReported: [],
        patientNotes: 'Awaiting teleconsultation session.',
        timestamp: '2026-09-08 07:30 WAT',
        auditTrailHash: 'f4c996fb92427ae41e4649b934ca495991b7852b855e3b0c44298fc1c149afbf'
      }
    }
  },
  {
    id: 'KBF-APT-74919',
    patient: DEMO_PATIENT_CHUKWUEMEKA,
    specialist: SPECIALISTS[2], // Dr. Nneka Okonkwo (Oncology & Clinical Genetics)
    selectedDate: 'In 2 Days',
    selectedTime: '01:00 PM',
    triage: {
      severityLevel: 'Severe',
      recommendedDepartment: 'Oncology & Clinical Genetics',
      matchedSpecialist: SPECIALISTS[2],
      clinicalPriority: 'Expedited (within 12h)',
      triageReasoning: 'Stage III colorectal cancer candidate for fluoropyrimidine chemotherapy. DPYD *2A variant flags critical risk of lethal neutropenia and mucositis.',
      flaggedRiskFactors: [
        'DPYD *2A Loss-of-function allele',
        'Extreme 5-FU chemotoxicity hazard',
        'Requires 50% dose reduction and TDM'
      ]
    },
    documents: [
      {
        id: 'doc-preloaded-03',
        name: 'Histopathology_and_DPYD_Genotyping.pdf',
        type: 'genetic_panel',
        originalSizeBytes: 4200000,
        compressedSizeBytes: 340000,
        compressionRatio: '91.9% Saved',
        uploadDate: '2026-09-08',
        extractedMarkers: ['DPYD (*2A)'],
        status: 'synced_cloud'
      }
    ],
    paymentMode: 'HMO_VERIFICATION',
    hmoDetails: {
      provider: 'Reliance HMO',
      policyNumber: 'REL-44019-LAUT',
      verified: true
    },
    paymentReference: 'TXN-LAUT-749199',
    teleconsultLink: 'https://kbf-telehealth.ng/v/lautech-onco-7491',
    status: 'SCHEDULED',
    createdAt: '2026-09-08T08:00:00.000Z',
    consultationState: {
      vitals: {
        bp: '124/80 mmHg',
        heartRate: 72,
        spo2: 98,
        temperature: '36.7°C',
        weight: '76 kg',
        bmi: '24.8 kg/m²'
      },
      clinicalNotes: 'DPYD *2A intermediate deficiency confirmed prior to adjuvant chemotherapy. Absolute contraindication to full-dose 5-FU. Recommended protocol: 50% starting dose reduction with baseline DPD phenotyping and close weekly hematological surveillance.',
      prescriptionItems: [],
      generatedPrescription: null,
      chatMessages: [
        { id: 'msg-eze-1', sender: 'Dr. Nneka Okonkwo', text: 'Welcome Mr. Eze. Your pre-chemo DPYD genomic screen has arrived in time to avert severe drug toxicity.', time: '08:05' }
      ],
      followUp: {
        id: 'fup-eze-01',
        appointmentId: 'KBF-APT-74919',
        patientName: 'Chukwuemeka Anthony Eze',
        checkInDueHours: 48,
        status: 'PENDING_SCHEDULED',
        symptomScore: 6,
        adverseReactionsReported: [],
        patientNotes: 'Scheduled for oncology pre-treatment consultation.',
        timestamp: '2026-09-08 08:00 WAT',
        auditTrailHash: '1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855e3b0c44298fc'
      }
    }
  },
  {
    id: 'KBF-APT-51820',
    patient: DEMO_PATIENT_OBGYN,
    specialist: SPECIALISTS[5], // Dr. Adeniran Muibat (Obstetrics & Gynaecology)
    selectedDate: 'Tomorrow',
    selectedTime: '10:15 AM',
    triage: {
      severityLevel: 'Moderate',
      recommendedDepartment: 'Obstetrics & Gynaecology',
      matchedSpecialist: SPECIALISTS[5],
      clinicalPriority: 'Standard (within 48h)',
      triageReasoning: 'Elective routine antenatal review (24 weeks gestation) matched to Dr. Adeniran Muibat under LAUTECH Tele-Gynecology Routine Protocol. Zero obstetric red flags reported.',
      flaggedRiskFactors: [
        'LAUTECH Tele-Gynecology Routine Protocol Active',
        'Elective Outpatient Routing Confirmed (Dr. Adeniran Muibat)',
        'Safety Screen Passed: Zero acute obstetric red flags reported'
      ]
    },
    documents: [
      {
        id: 'doc-preloaded-obgyn-01',
        name: 'Second_Trimester_Anomaly_Scan_Summary.pdf',
        type: 'ecg_imaging',
        originalSizeBytes: 2840000,
        compressedSizeBytes: 210000,
        compressionRatio: '92.6% Saved',
        uploadDate: '2026-09-15',
        extractedMarkers: ['Normal fetal biometry (24w 2d)', 'Normohydramnios', 'Placenta anterior grade 1'],
        status: 'synced_cloud'
      }
    ],
    paymentMode: 'HMO_VERIFICATION',
    hmoDetails: {
      provider: 'Reliance HMO Nigeria',
      policyNumber: 'REL-OBG-33918-LAUT',
      verified: true
    },
    paymentReference: 'TXN-LAUT-518202',
    teleconsultLink: 'https://kbf-telehealth.ng/v/lautech-obgyn-5182',
    status: 'SCHEDULED',
    createdAt: '2026-09-15T08:30:00.000Z',
    consultationState: {
      vitals: {
        bp: '114/72 mmHg',
        heartRate: 78,
        spo2: 99,
        temperature: '36.6°C',
        weight: '68 kg',
        bmi: '23.8 kg/m²'
      },
      clinicalNotes: 'Routine 24-week antenatal telemedicine check-in under LAUTECH Tele-Gynecology Routine Protocol. Attending: Dr. Adeniran Muibat. Ultrasound confirms satisfactory fetal growth and anatomy. Hemoglobin level stable at 11.2 g/dL. Continued on ferrous gluconate and prenatal multivitamin. Advised on fetal movement counting.',
      prescriptionItems: [],
      generatedPrescription: null,
      chatMessages: [
        { id: 'msg-muibat-1', sender: 'Dr. Adeniran Muibat', text: 'Good morning Mrs. Balogun. I have your second trimester ultrasound and routine lab report open on my clinical terminal. How have your baby kicks been today?', time: '10:15' }
      ],
      followUp: {
        id: 'fup-muibat-01',
        appointmentId: 'KBF-APT-51820',
        patientName: 'Zainab Olawale Balogun',
        checkInDueHours: 72,
        status: 'PENDING_SCHEDULED',
        symptomScore: 9,
        adverseReactionsReported: [],
        patientNotes: 'Scheduled routine 24-week virtual antenatal consultation.',
        timestamp: '2026-09-15 08:30 WAT',
        auditTrailHash: '2d881afbf4c8996fb92427ae41e4649b934ca495991b7852b855e3b0c44298fc'
      }
    }
  }
];


