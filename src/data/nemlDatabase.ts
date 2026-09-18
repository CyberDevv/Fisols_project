import { NemlDrug, NemlApiStats } from '../types';

export const NEML_API_METADATA: NemlApiStats = {
  source: 'Federal Ministry of Health and Social Welfare (FMoH), Nigeria',
  edition: '8th Edition (2024 Revision) & 1st Edition for Children',
  totalDrugs: 32,
  categoriesCount: 8,
  apiStatus: 'ONLINE_CONNECTED',
  gatewayEndpoint: 'https://api.fmohconnect.gov.ng/v1/neml/formulary',
  emdexApiVersion: 'v8.4.2-EMDEX-NG',
  lastSyncTimestamp: '2026-09-18T08:00:00Z',
  cacheTtlSeconds: 86400,
  primaryCareCoveragePercentage: 78.5,
  nafdacVerificationRate: 100.0
};

export const NEML_CATEGORIES: string[] = [
  'All Categories',
  'Cardiovascular Medicines',
  'Endocrine & Metabolic Medicines',
  'Anti-Infective & Antimalarials',
  'Obstetrics, Gynaecology & Maternal Health',
  'Surgery, Urology & Anaesthesia',
  'Pain Management & Analgesia',
  'Gastrointestinal Medicines',
  'Respiratory Tract Medicines'
];

export const NEML_DRUG_DATABASE: NemlDrug[] = [
  // 1. CARDIOVASCULAR MEDICINES
  {
    id: 'neml-amlodipine',
    nemlCode: 'NEML-08-CVD-001',
    edition: '8th Edition (2024)',
    genericName: 'Amlodipine Besylate',
    brandNames: ['Norvasc', 'Amlodac', 'Amlovas', 'Amlovasc'],
    therapeuticCategory: 'Cardiovascular Medicines',
    atcCode: 'C08CA01',
    levelOfCare: 'P',
    levelOfCareLabel: 'Primary [P] • Dispensable at Primary Health Center & Family Medicine',
    whoAWaReCategory: 'Not Applicable',
    dosageForms: ['Tablet 5mg', 'Tablet 10mg'],
    standardIndications: [
      'Essential hypertension (first-line in black African population)',
      'Chronic stable angina pectoris',
      'Vasospastic (Prinzmetal\'s) angina'
    ],
    prescribingGuidelines: 'Initial dose 5mg PO once daily, titrated to 10mg PO once daily after 2-4 weeks based on clinic or home BP response. Safe in mild-to-moderate renal impairment.',
    contraindications: ['Severe hypotension', 'Cardiogenic shock', 'Hypersensitivity to dihydropyridines'],
    nafdacRegStatus: 'NAFDAC Reg No: 04-1298 (Verified in NAFDAC Green Book)',
    emdexMonographId: 'EMDEX-NG-2024-CVD-014',
    isPediatricEssential: false
  },
  {
    id: 'neml-lisinopril',
    nemlCode: 'NEML-08-CVD-002',
    edition: '8th Edition (2024)',
    genericName: 'Lisinopril',
    brandNames: ['Zestril', 'Prinivil', 'Lisodur'],
    therapeuticCategory: 'Cardiovascular Medicines',
    atcCode: 'C09AA03',
    levelOfCare: 'P',
    levelOfCareLabel: 'Primary [P] • Dispensable at Primary Health Center & Family Medicine',
    whoAWaReCategory: 'Not Applicable',
    dosageForms: ['Tablet 5mg', 'Tablet 10mg', 'Tablet 20mg'],
    standardIndications: [
      'Hypertension (especially with diabetic nephropathy or microalbuminuria)',
      'Heart failure with reduced ejection fraction (HFrEF)',
      'Post-myocardial infarction hemodynamically stable'
    ],
    prescribingGuidelines: 'Start at 5-10mg PO daily with baseline serum creatinine and potassium monitoring. Discontinue immediately if dry persistent cough or angioedema develops.',
    contraindications: ['Pregnancy (Teratogenic / Category D)', 'Bilateral renal artery stenosis', 'History of ACEI angioedema'],
    nafdacRegStatus: 'NAFDAC Reg No: 04-2201 (Verified in NAFDAC Green Book)',
    emdexMonographId: 'EMDEX-NG-2024-CVD-056',
    isPediatricEssential: false
  },
  {
    id: 'neml-hydrochlorothiazide',
    nemlCode: 'NEML-08-CVD-003',
    edition: '8th Edition (2024)',
    genericName: 'Hydrochlorothiazide (HCTZ)',
    brandNames: ['Esidrex', 'Aquazide', 'Hydrodiuril'],
    therapeuticCategory: 'Cardiovascular Medicines',
    atcCode: 'C03AA03',
    levelOfCare: 'P',
    levelOfCareLabel: 'Primary [P] • Dispensable at Primary Health Center & Family Medicine',
    whoAWaReCategory: 'Not Applicable',
    dosageForms: ['Tablet 12.5mg', 'Tablet 25mg'],
    standardIndications: [
      'Essential hypertension (combination regimen with CCB or ACEI)',
      'Mild-to-moderate fluid retention in congestive heart failure'
    ],
    prescribingGuidelines: 'Standard dose is 12.5mg to 25mg PO once daily taken in the morning to avoid nocturnal diuresis. Monitor serum electrolytes for hypokalemia and hyponatremia.',
    contraindications: ['Anuria', 'Severe hypokalemia', 'Severe gout / acute hyperuricemia'],
    nafdacRegStatus: 'NAFDAC Reg No: 04-0312 (Verified in NAFDAC Green Book)',
    emdexMonographId: 'EMDEX-NG-2024-CVD-031',
    isPediatricEssential: false
  },
  {
    id: 'neml-clopidogrel',
    nemlCode: 'NEML-08-CVD-004',
    edition: '8th Edition (2024)',
    genericName: 'Clopidogrel Bisulfate',
    brandNames: ['Plavix', 'Clopivas', 'Plagril'],
    therapeuticCategory: 'Cardiovascular Medicines',
    atcCode: 'B01AC04',
    levelOfCare: 'S',
    levelOfCareLabel: 'Secondary / Tertiary [S/T] • General Hospital & Teaching Hospital Specialist Care',
    whoAWaReCategory: 'Not Applicable',
    dosageForms: ['Tablet 75mg'],
    standardIndications: [
      'Dual antiplatelet therapy (DAPT) post-coronary stent (PCI)',
      'Recent myocardial infarction or ischemic stroke',
      'Established peripheral arterial disease (PAD)'
    ],
    prescribingGuidelines: 'Loading dose 300-600mg PO, maintenance 75mg once daily. Ineffective in CYP2C19 Poor Metabolizers; requires pharmacogenomic screening before long-term DAPT.',
    contraindications: ['Active pathological bleeding (peptic ulcer or intracranial)', 'Severe hepatic impairment'],
    pharmacogenomicAlert: {
      targetGene: 'CYP2C19',
      riskPhenotype: 'Poor Metabolizer (*2/*2, *2/*3)',
      recommendation: 'CONTRAINDICATED: Ineffective prodrug activation. Switch to Ticagrelor or Prasugrel per CPIC & Geneva Precision guidelines.',
      severity: 'CONTRAINDICATED'
    },
    nafdacRegStatus: 'NAFDAC Reg No: 04-5891 (Verified in NAFDAC Green Book)',
    emdexMonographId: 'EMDEX-NG-2024-CVD-089',
    isPediatricEssential: false
  },
  {
    id: 'neml-ticagrelor',
    nemlCode: 'NEML-08-CVD-005',
    edition: '8th Edition (2024)',
    genericName: 'Ticagrelor',
    brandNames: ['Brilinta', 'Tigret', 'Ticalog'],
    therapeuticCategory: 'Cardiovascular Medicines',
    atcCode: 'B01AC24',
    levelOfCare: 'T',
    levelOfCareLabel: 'Tertiary [T] • Specialist Cardiologist / Teaching Hospital Only',
    whoAWaReCategory: 'Not Applicable',
    dosageForms: ['Tablet 90mg', 'Tablet 60mg'],
    standardIndications: [
      'Acute coronary syndromes (ACS) with Aspirin co-therapy',
      'Post-PCI antiplatelet therapy in CYP2C19 poor metabolizers'
    ],
    prescribingGuidelines: 'Loading dose 180mg PO, followed by 90mg twice daily with low-dose Aspirin (75-100mg). Direct-acting; does not require CYP2C19 bioactivation.',
    contraindications: ['History of intracranial hemorrhage', 'Active pathological bleeding', 'Severe hepatic impairment'],
    pharmacogenomicAlert: {
      targetGene: 'CYP2C19',
      riskPhenotype: 'Poor Metabolizer (*2/*2)',
      recommendation: 'GENETICALLY SAFE: Direct-acting P2Y12 inhibitor. Validated alternative for Clopidogrel resistance.',
      severity: 'SAFE_STANDARD'
    },
    nafdacRegStatus: 'NAFDAC Reg No: B4-0211 (Verified in NAFDAC Green Book)',
    emdexMonographId: 'EMDEX-NG-2024-CVD-112',
    isPediatricEssential: false
  },
  {
    id: 'neml-simvastatin',
    nemlCode: 'NEML-08-CVD-006',
    edition: '8th Edition (2024)',
    genericName: 'Simvastatin',
    brandNames: ['Zocor', 'Simvotin', 'Simvast'],
    therapeuticCategory: 'Cardiovascular Medicines',
    atcCode: 'C10AA01',
    levelOfCare: 'P',
    levelOfCareLabel: 'Primary [P] • Primary Care & Family Medicine Follow-up',
    whoAWaReCategory: 'Not Applicable',
    dosageForms: ['Tablet 10mg', 'Tablet 20mg', 'Tablet 40mg'],
    standardIndications: [
      'Primary hypercholesterolemia and combined hyperlipidemia',
      'Atherosclerotic cardiovascular disease (ASCVD) risk reduction'
    ],
    prescribingGuidelines: 'Initial 20mg PO once daily in the evening. Avoid high doses (>20mg) in patients carrying SLCO1B1 521T>C due to elevated risk of toxic rhabdomyolysis.',
    contraindications: ['Active liver disease', 'Pregnancy and lactation', 'Concomitant potent CYP3A4 inhibitors'],
    pharmacogenomicAlert: {
      targetGene: 'SLCO1B1',
      riskPhenotype: 'High Myopathy Risk (521T>C)',
      recommendation: 'HIGH ADR ALERT: 220% higher systemic exposure. Cap dose at 20mg or switch to Rosuvastatin / Pravastatin.',
      severity: 'HIGH_ADR_ALERT'
    },
    nafdacRegStatus: 'NAFDAC Reg No: 04-1022 (Verified in NAFDAC Green Book)',
    emdexMonographId: 'EMDEX-NG-2024-CVD-044',
    isPediatricEssential: false
  },
  {
    id: 'neml-rosuvastatin',
    nemlCode: 'NEML-08-CVD-007',
    edition: '8th Edition (2024)',
    genericName: 'Rosuvastatin Calcium',
    brandNames: ['Crestor', 'Rosuvas', 'Rozucor'],
    therapeuticCategory: 'Cardiovascular Medicines',
    atcCode: 'C10AA07',
    levelOfCare: 'S',
    levelOfCareLabel: 'Secondary / Tertiary [S/T] • Specialist Clinic & Hospital Care',
    whoAWaReCategory: 'Not Applicable',
    dosageForms: ['Tablet 5mg', 'Tablet 10mg', 'Tablet 20mg'],
    standardIndications: [
      'High-intensity lipid-lowering therapy',
      'Alternative statin in patients with SLCO1B1 variant intolerance to Simvastatin'
    ],
    prescribingGuidelines: 'Start at 5-10mg PO once daily. Hydrophilic statin with minimal CYP3A4 metabolism, demonstrating safer pharmacokinetic profile in SLCO1B1 variants.',
    contraindications: ['Active liver disease', 'Severe renal impairment (CrCl < 30mL/min)', 'Pregnancy'],
    pharmacogenomicAlert: {
      targetGene: 'SLCO1B1',
      riskPhenotype: 'Intermediate / Normal Risk',
      recommendation: 'GENETICALLY SAFE: Hydrophilic statin. Preferred alternative when Simvastatin triggers SLCO1B1 warnings.',
      severity: 'SAFE_STANDARD'
    },
    nafdacRegStatus: 'NAFDAC Reg No: B4-1189 (Verified in NAFDAC Green Book)',
    emdexMonographId: 'EMDEX-NG-2024-CVD-098',
    isPediatricEssential: false
  },
  {
    id: 'neml-warfarin',
    nemlCode: 'NEML-08-CVD-008',
    edition: '8th Edition (2024)',
    genericName: 'Warfarin Sodium',
    brandNames: ['Coumadin', 'Marevan'],
    therapeuticCategory: 'Cardiovascular Medicines',
    atcCode: 'B01AA03',
    levelOfCare: 'S',
    levelOfCareLabel: 'Secondary / Tertiary [S/T] • Requires INR Monitoring Facilities',
    whoAWaReCategory: 'Not Applicable',
    dosageForms: ['Tablet 1mg', 'Tablet 2.5mg', 'Tablet 5mg'],
    standardIndications: [
      'Prophylaxis & treatment of venous thrombosis and pulmonary embolism',
      'Prevention of systemic thromboembolism in mechanical heart valves and atrial fibrillation'
    ],
    prescribingGuidelines: 'Individualized dosing guided by PT/INR (target 2.0-3.0; 2.5-3.5 in mechanical valves). Highly sensitive to CYP2C9 and VKORC1 genetic variants.',
    contraindications: ['Hemorrhagic tendencies', 'Pregnancy (Teratogenic / Warfarin embryopathy)', 'Severe hepatic insufficiency'],
    pharmacogenomicAlert: {
      targetGene: 'VKORC1 / CYP2C9',
      riskPhenotype: 'CYP2C9*2/*3 or VKORC1 -1639G>A',
      recommendation: 'DOSE ADJUSTMENT: Extreme sensitivity with delayed clearance. Reduce initial dose by 50% with frequent INR checks.',
      severity: 'DOSE_ADJUSTMENT'
    },
    nafdacRegStatus: 'NAFDAC Reg No: 04-0091 (Verified in NAFDAC Green Book)',
    emdexMonographId: 'EMDEX-NG-2024-CVD-009',
    isPediatricEssential: false
  },

  // 2. ENDOCRINE & METABOLIC MEDICINES
  {
    id: 'neml-metformin',
    nemlCode: 'NEML-08-END-001',
    edition: '8th Edition (2024)',
    genericName: 'Metformin Hydrochloride',
    brandNames: ['Glucophage', 'Diabetmin', 'Formin', 'Cetapin'],
    therapeuticCategory: 'Endocrine & Metabolic Medicines',
    atcCode: 'A10BA02',
    levelOfCare: 'P',
    levelOfCareLabel: 'Primary [P] • Dispensable at Primary Health Center & Family Medicine',
    whoAWaReCategory: 'Not Applicable',
    dosageForms: ['Tablet 500mg', 'Tablet 850mg', 'Tablet 1000mg', 'SR 500mg'],
    standardIndications: [
      'Type 2 diabetes mellitus (first-line monotherapy or combination)',
      'Polycystic ovary syndrome (PCOS) insulin resistance'
    ],
    prescribingGuidelines: 'Initial 500mg PO once or twice daily with meals to mitigate gastrointestinal side effects. Titrate weekly up to 2000mg daily. Monitor eGFR; contraindicate if eGFR < 30 mL/min.',
    contraindications: ['Severe renal impairment (eGFR < 30)', 'Acute metabolic acidosis / lactic acidosis', 'Severe dehydration'],
    nafdacRegStatus: 'NAFDAC Reg No: 04-1845 (Verified in NAFDAC Green Book)',
    emdexMonographId: 'EMDEX-NG-2024-END-002',
    isPediatricEssential: false
  },
  {
    id: 'neml-glimepiride',
    nemlCode: 'NEML-08-END-002',
    edition: '8th Edition (2024)',
    genericName: 'Glimepiride',
    brandNames: ['Amaryl', 'Glimer', 'Diapride'],
    therapeuticCategory: 'Endocrine & Metabolic Medicines',
    atcCode: 'A10BB12',
    levelOfCare: 'P',
    levelOfCareLabel: 'Primary [P] • Primary Care Second-line Sulfonylurea',
    whoAWaReCategory: 'Not Applicable',
    dosageForms: ['Tablet 1mg', 'Tablet 2mg', 'Tablet 4mg'],
    standardIndications: [
      'Type 2 diabetes mellitus as adjunct to diet and Metformin when glycemic targets unmet'
    ],
    prescribingGuidelines: 'Initial 1mg PO once daily with breakfast. Titrate in 1-2mg increments at 1-2 week intervals (max 6mg daily). Educate patient on hypoglycemia recognition.',
    contraindications: ['Type 1 diabetes', 'Diabetic ketoacidosis', 'Severe hepatic or renal impairment'],
    nafdacRegStatus: 'NAFDAC Reg No: 04-4512 (Verified in NAFDAC Green Book)',
    emdexMonographId: 'EMDEX-NG-2024-END-018',
    isPediatricEssential: false
  },
  {
    id: 'neml-soluble-insulin',
    nemlCode: 'NEML-08-END-003',
    edition: '8th Edition (2024)',
    genericName: 'Soluble Insulin (Human Regular)',
    brandNames: ['Actrapid', 'Humulin R', 'Insuman Rapid'],
    therapeuticCategory: 'Endocrine & Metabolic Medicines',
    atcCode: 'A10AB01',
    levelOfCare: 'S',
    levelOfCareLabel: 'Secondary / Tertiary [S/T] • Hospital Emergency, Inpatient & Outpatient Diabetes Clinic',
    whoAWaReCategory: 'Not Applicable',
    dosageForms: ['Injection 100 IU/mL in 10mL vial', 'Cartridge 3mL (100 IU/mL)'],
    standardIndications: [
      'Diabetic ketoacidosis (DKA) and hyperosmolar hyperglycemic state (HHS)',
      'Type 1 diabetes basal-bolus regimens',
      'Gestational diabetes mellitus unmanaged by diet/metformin'
    ],
    prescribingGuidelines: 'Dosed SC or IV according to blood glucose monitoring protocol. In DKA, continuous IV infusion at 0.1 units/kg/hr alongside potassium repletion.',
    contraindications: ['Hypoglycemia (blood glucose < 70 mg/dL)', 'Hypokalemia prior to repletion'],
    nafdacRegStatus: 'NAFDAC Reg No: 04-0994 (Verified in NAFDAC Green Book)',
    emdexMonographId: 'EMDEX-NG-2024-END-030',
    isPediatricEssential: true
  },

  // 3. ANTI-INFECTIVE & ANTIMALARIALS
  {
    id: 'neml-artemether-lumefantrine',
    nemlCode: 'NEML-08-INF-001',
    edition: '8th Edition (2024)',
    genericName: 'Artemether + Lumefantrine (ACT)',
    brandNames: ['Coartem', 'Lonart', 'Amatem', 'Camosunate'],
    therapeuticCategory: 'Anti-Infective & Antimalarials',
    atcCode: 'P01BF01',
    levelOfCare: 'P',
    levelOfCareLabel: 'Primary [P] • First-Line Uncomplicated Malaria (Free / Subsidized at PHC)',
    whoAWaReCategory: 'Not Applicable',
    dosageForms: [
      'Tablet 20mg Artemether + 120mg Lumefantrine (Adult: 4 tabs BID x 3 days)',
      'Tablet 80mg Artemether + 480mg Lumefantrine (Forte: 1 tab BID x 3 days)',
      'Dispersible Pediatric Tablet 20/120mg'
    ],
    standardIndications: [
      'First-line treatment of uncomplicated Plasmodium falciparum malaria in adults and children'
    ],
    prescribingGuidelines: 'Standard 6-dose regimen over 60 hours (0h, 8h, 24h, 36h, 48h, 60h). Administer with fatty food or milk to optimize lumefantrine bioabsorption.',
    contraindications: ['First trimester of pregnancy (use oral Quinine)', 'Known QTc prolongation'],
    nafdacRegStatus: 'NAFDAC Reg No: 04-3321 (Verified in NAFDAC Green Book)',
    emdexMonographId: 'EMDEX-NG-2024-MAL-001',
    isPediatricEssential: true
  },
  {
    id: 'neml-artesunate-injection',
    nemlCode: 'NEML-08-INF-002',
    edition: '8th Edition (2024)',
    genericName: 'Artesunate (Injectable)',
    brandNames: ['Artesunat', 'Larinate', 'G-Artesunate'],
    therapeuticCategory: 'Anti-Infective & Antimalarials',
    atcCode: 'P01BE03',
    levelOfCare: 'S',
    levelOfCareLabel: 'Secondary / Tertiary [S/T] • Hospital Inpatient / Severe Malaria Protocol',
    whoAWaReCategory: 'Not Applicable',
    dosageForms: ['Powder for Injection 60mg vial + Sodium Bicarbonate & Saline diluents'],
    standardIndications: [
      'First-line treatment of severe Plasmodium falciparum malaria (cerebral malaria, severe anemia, hyperparasitemia)'
    ],
    prescribingGuidelines: 'Dose 2.4 mg/kg IV or IM at 0h, 12h, 24h, then once daily until oral ACT can be tolerated. WHO & FMoH gold standard for severe malaria.',
    contraindications: ['Known hypersensitivity to artemisinin derivatives'],
    nafdacRegStatus: 'NAFDAC Reg No: 04-8902 (Verified in NAFDAC Green Book)',
    emdexMonographId: 'EMDEX-NG-2024-MAL-008',
    isPediatricEssential: true
  },
  {
    id: 'neml-amoxicillin-clavulanic',
    nemlCode: 'NEML-08-INF-003',
    edition: '8th Edition (2024)',
    genericName: 'Amoxicillin + Clavulanic Acid (Co-amoxiclav)',
    brandNames: ['Augmentin', 'Curam', 'Amoksiklav', 'Fleming'],
    therapeuticCategory: 'Anti-Infective & Antimalarials',
    atcCode: 'J01CR02',
    levelOfCare: 'P',
    levelOfCareLabel: 'Primary [P] • Community & Ambulatory Anti-Infective',
    whoAWaReCategory: 'Access',
    dosageForms: [
      'Tablet 625mg (500mg/125mg)',
      'Tablet 1000mg (875mg/125mg)',
      'Oral Suspension 156mg/5mL & 312mg/5mL',
      'Injection 1.2g vial'
    ],
    standardIndications: [
      'Community-acquired pneumonia (CAP)',
      'Acute bacterial rhinosinusitis and otitis media',
      'Complicated urinary tract infections',
      'Skin and soft tissue infections'
    ],
    prescribingGuidelines: 'Adult 625mg PO TID or 1g PO BID for 5-7 days. Take at the start of a meal to decrease GI upset. AWaRe Access classification encourages use as preferred empiric beta-lactam.',
    contraindications: ['Penicillin allergy', 'History of co-amoxiclav associated jaundice/hepatic impairment'],
    nafdacRegStatus: 'NAFDAC Reg No: 04-0824 (Verified in NAFDAC Green Book)',
    emdexMonographId: 'EMDEX-NG-2024-ANT-012',
    isPediatricEssential: true
  },
  {
    id: 'neml-ciprofloxacin',
    nemlCode: 'NEML-08-INF-004',
    edition: '8th Edition (2024)',
    genericName: 'Ciprofloxacin Hydrochloride',
    brandNames: ['Ciprotab', 'Cifran', 'Ciproxin'],
    therapeuticCategory: 'Anti-Infective & Antimalarials',
    atcCode: 'J01MA02',
    levelOfCare: 'S',
    levelOfCareLabel: 'Secondary / Tertiary [S/T] • Specialist & Inpatient Care',
    whoAWaReCategory: 'Watch',
    dosageForms: ['Tablet 500mg', 'IV Infusion 200mg/100mL'],
    standardIndications: [
      'Complicated pyelonephritis and urinary tract infections',
      'Typhoid (enteric) fever caused by sensitive Salmonella enterica',
      'Infectious bacterial diarrhea and prostatitis'
    ],
    prescribingGuidelines: 'Standard dose 500mg PO BID x 7-14 days. Classified under WHO AWaRe "Watch" list — reserve for culture-confirmed or high-risk indications to curb fluoroquinolone resistance.',
    contraindications: ['Pregnancy and nursing mothers', 'Children under 18 (tendon rupture risk)', 'QTc prolongation'],
    nafdacRegStatus: 'NAFDAC Reg No: 04-2981 (Verified in NAFDAC Green Book)',
    emdexMonographId: 'EMDEX-NG-2024-ANT-045',
    isPediatricEssential: false
  },
  {
    id: 'neml-ceftriaxone',
    nemlCode: 'NEML-08-INF-005',
    edition: '8th Edition (2024)',
    genericName: 'Ceftriaxone Sodium',
    brandNames: ['Rocephin', 'Powercef', 'Triaxone'],
    therapeuticCategory: 'Anti-Infective & Antimalarials',
    atcCode: 'J01DD04',
    levelOfCare: 'S',
    levelOfCareLabel: 'Secondary / Tertiary [S/T] • Hospital Inpatient Parenteral Therapy',
    whoAWaReCategory: 'Watch',
    dosageForms: ['Powder for Injection 500mg vial', 'Powder for Injection 1g vial'],
    standardIndications: [
      'Bacterial meningitis',
      'Severe hospital and community-acquired sepsis',
      'Pre-operative surgical antibiotic prophylaxis',
      'Gonococcal infections resistant to first-line agents'
    ],
    prescribingGuidelines: 'Adult dose 1-2g IV or IM once daily (2g BID in bacterial meningitis). Classified under WHO AWaRe "Watch" group — requires antimicrobial stewardship committee oversight.',
    contraindications: ['Severe cephalosporin anaphylaxis', 'Neonates with hyperbilirubinemia', 'Co-administration with IV calcium solutions'],
    nafdacRegStatus: 'NAFDAC Reg No: 04-5112 (Verified in NAFDAC Green Book)',
    emdexMonographId: 'EMDEX-NG-2024-ANT-067',
    isPediatricEssential: true
  },
  {
    id: 'neml-meropenem',
    nemlCode: 'NEML-08-INF-006',
    edition: '8th Edition (2024)',
    genericName: 'Meropenem',
    brandNames: ['Meronem', 'Mepon', 'Ronem'],
    therapeuticCategory: 'Anti-Infective & Antimalarials',
    atcCode: 'J01DH02',
    levelOfCare: 'T',
    levelOfCareLabel: 'Tertiary [T] • Teaching Hospital ID Specialist & ICU Authorization Only',
    whoAWaReCategory: 'Reserve',
    dosageForms: ['Powder for Injection 500mg vial', 'Powder for Injection 1g vial'],
    standardIndications: [
      'Hospital-acquired pneumonia / ventilator-associated pneumonia (VAP)',
      'Complicated intra-abdominal infections with ESBL-producing enterobacteriaceae',
      'Neutropenic sepsis with suspected multidrug-resistant pathogens'
    ],
    prescribingGuidelines: 'Dose 1g IV every 8 hours as an extended infusion (3-4 hours). Restricted under WHO AWaRe "Reserve" category. Requires infectious disease physician sign-off.',
    contraindications: ['Severe hypersensitivity to carbapenems'],
    nafdacRegStatus: 'NAFDAC Reg No: B4-0899 (Verified in NAFDAC Green Book)',
    emdexMonographId: 'EMDEX-NG-2024-ANT-109',
    isPediatricEssential: true
  },

  // 4. OBSTETRICS, GYNAECOLOGY & MATERNAL HEALTH
  {
    id: 'neml-oxytocin',
    nemlCode: 'NEML-08-OBG-001',
    edition: '8th Edition (2024)',
    genericName: 'Oxytocin',
    brandNames: ['Syntocinon', 'Pitocin'],
    therapeuticCategory: 'Obstetrics, Gynaecology & Maternal Health',
    atcCode: 'H01BB02',
    levelOfCare: 'P',
    levelOfCareLabel: 'Primary / Secondary / Tertiary [P/S/T] • Essential Maternity Delivery Suite',
    whoAWaReCategory: 'Not Applicable',
    dosageForms: ['Injection 10 IU/mL in 1mL ampoule'],
    standardIndications: [
      'Active management of the third stage of labor (AMTSL) to prevent postpartum hemorrhage (PPH)',
      'Induction and augmentation of labor',
      'Treatment of uterine atony and secondary PPH'
    ],
    prescribingGuidelines: 'Standard AMTSL: 10 IU IM immediately after the birth of the baby. For PPH treatment, 20-40 IU in 1000mL normal saline infused at 60 drops/min. Maintain cold chain (2-8°C).',
    contraindications: ['Cephalopelvic disproportion', 'Fetal distress when delivery not imminent', 'Hypertonic uterine contractions'],
    nafdacRegStatus: 'NAFDAC Reg No: 04-0118 (Verified in NAFDAC Green Book)',
    emdexMonographId: 'EMDEX-NG-2024-OBG-001',
    isPediatricEssential: false
  },
  {
    id: 'neml-misoprostol',
    nemlCode: 'NEML-08-OBG-002',
    edition: '8th Edition (2024)',
    genericName: 'Misoprostol',
    brandNames: ['Cytotec', 'Misofem', 'Isovent'],
    therapeuticCategory: 'Obstetrics, Gynaecology & Maternal Health',
    atcCode: 'G02AD06',
    levelOfCare: 'P',
    levelOfCareLabel: 'Primary / Secondary / Tertiary [P/S/T] • Community Maternal Health Essential',
    whoAWaReCategory: 'Not Applicable',
    dosageForms: ['Tablet 200mcg', 'Tablet 25mcg (vaginal insert)'],
    standardIndications: [
      'Prevention and treatment of postpartum hemorrhage where injectable oxytocics unavailable',
      'Medical management of incomplete abortion and miscarriage',
      'Cervical ripening prior to gynecologic procedures'
    ],
    prescribingGuidelines: 'For PPH prevention when oxytocin unavailable: 600mcg sublingually or orally immediately post-delivery. For PPH treatment: 800mcg sublingually. Heat-stable alternative to oxytocin.',
    contraindications: ['Known allergy to prostaglandins', 'Previous uterine rupture / extensive uterine scar without specialist oversight'],
    nafdacRegStatus: 'NAFDAC Reg No: 04-7621 (Verified in NAFDAC Green Book)',
    emdexMonographId: 'EMDEX-NG-2024-OBG-005',
    isPediatricEssential: false
  },
  {
    id: 'neml-magnesium-sulphate',
    nemlCode: 'NEML-08-OBG-003',
    edition: '8th Edition (2024)',
    genericName: 'Magnesium Sulphate (MgSO4)',
    brandNames: ['Magnesulf', 'MgSO4 Injection'],
    therapeuticCategory: 'Obstetrics, Gynaecology & Maternal Health',
    atcCode: 'B05CX03',
    levelOfCare: 'S',
    levelOfCareLabel: 'Secondary / Tertiary [S/T] • Pre-eclampsia & Eclampsia Protocol',
    whoAWaReCategory: 'Not Applicable',
    dosageForms: ['Injection 50% w/v (5g in 10mL ampoule)'],
    standardIndications: [
      'Prevention and treatment of seizures in severe pre-eclampsia and eclampsia (Pritchard regimen)'
    ],
    prescribingGuidelines: 'Pritchard regimen: 4g IV (20% solution over 5-10 min) + 10g IM (5g in each buttock) loading dose, then 5g IM every 4 hours alternating buttocks. Check patellar reflexes, respiratory rate (>16/min), and urine output before each dose. Keep Calcium Gluconate at bedside as antidote.',
    contraindications: ['Myasthenia gravis', 'Severe renal failure', 'Heart block'],
    nafdacRegStatus: 'NAFDAC Reg No: 04-3319 (Verified in NAFDAC Green Book)',
    emdexMonographId: 'EMDEX-NG-2024-OBG-012',
    isPediatricEssential: false
  },
  {
    id: 'neml-ferrous-folate',
    nemlCode: 'NEML-08-OBG-004',
    edition: '8th Edition (2024)',
    genericName: 'Ferrous Sulphate + Folic Acid',
    brandNames: ['Fefol', 'Pregnacare Core', 'Feroglobin', 'Haem-up'],
    therapeuticCategory: 'Obstetrics, Gynaecology & Maternal Health',
    atcCode: 'B03AA07',
    levelOfCare: 'P',
    levelOfCareLabel: 'Primary [P] • Routine Antenatal Care (ANC) Dispensary',
    whoAWaReCategory: 'Not Applicable',
    dosageForms: ['Capsule / Tablet 200mg Ferrous Sulphate (60mg elemental Iron) + 400mcg Folic Acid'],
    standardIndications: [
      'Routine antenatal prophylaxis of iron deficiency anemia and neural tube defects (NTDs)',
      'Nutritional anemia in reproductive-age women'
    ],
    prescribingGuidelines: '1 tablet PO once daily throughout pregnancy and 3 months postpartum. Take with water or orange juice; avoid taking with tea, coffee, or antacids.',
    contraindications: ['Hemosiderosis / hemochromatosis', 'Active peptic ulceration'],
    nafdacRegStatus: 'NAFDAC Reg No: 04-0012 (Verified in NAFDAC Green Book)',
    emdexMonographId: 'EMDEX-NG-2024-OBG-022',
    isPediatricEssential: false
  },
  {
    id: 'neml-tranexamic-acid',
    nemlCode: 'NEML-08-OBG-005',
    edition: '8th Edition (2024)',
    genericName: 'Tranexamic Acid',
    brandNames: ['Cyklokapron', 'Transamin', 'Trapic'],
    therapeuticCategory: 'Obstetrics, Gynaecology & Maternal Health',
    atcCode: 'B02AA02',
    levelOfCare: 'S',
    levelOfCareLabel: 'Secondary / Tertiary [S/T] • Emergency PPH & Major Surgical Hemostasis',
    whoAWaReCategory: 'Not Applicable',
    dosageForms: ['Injection 500mg/5mL ampoule', 'Tablet 500mg'],
    standardIndications: [
      'Postpartum hemorrhage management per WOMAN Trial & WHO/FMoH protocol',
      'Heavy menstrual bleeding (menorrhagia)',
      'Peri-operative surgical antifibrinolytic therapy'
    ],
    prescribingGuidelines: 'In PPH: 1g (100mg/mL) IV administered over 10 minutes within 3 hours of delivery. A second dose of 1g IV may be given if bleeding persists after 30 minutes.',
    contraindications: ['Active thromboembolic disease', 'Severe renal impairment', 'Subarachnoid hemorrhage'],
    nafdacRegStatus: 'NAFDAC Reg No: 04-6218 (Verified in NAFDAC Green Book)',
    emdexMonographId: 'EMDEX-NG-2024-OBG-034',
    isPediatricEssential: false
  },

  // 5. SURGERY, UROLOGY & ANAESTHESIA
  {
    id: 'neml-tamsulosin',
    nemlCode: 'NEML-08-SUR-001',
    edition: '8th Edition (2024)',
    genericName: 'Tamsulosin Hydrochloride',
    brandNames: ['Flomax', 'Omnic', 'Contiflo', 'Urimax'],
    therapeuticCategory: 'Surgery, Urology & Anaesthesia',
    atcCode: 'G04CA02',
    levelOfCare: 'S',
    levelOfCareLabel: 'Secondary / Tertiary [S/T] • Elective Urology & Surgical Outpatient Clinic',
    whoAWaReCategory: 'Not Applicable',
    dosageForms: ['Modified-Release Capsule 0.4mg'],
    standardIndications: [
      'Lower urinary tract symptoms (LUTS) associated with benign prostatic hyperplasia (BPH)',
      'Medical expulsive therapy for distal ureteral calculi'
    ],
    prescribingGuidelines: 'Standard dose is 0.4mg PO once daily taken approximately 30 minutes after the same meal each day. Selective alpha-1A blocker; minimal risk of orthostatic hypotension.',
    contraindications: ['Severe orthostatic hypotension', 'Severe hepatic insufficiency', 'History of intraoperative floppy iris syndrome (IFIS)'],
    nafdacRegStatus: 'NAFDAC Reg No: 04-9412 (Verified in NAFDAC Green Book)',
    emdexMonographId: 'EMDEX-NG-2024-URO-001',
    isPediatricEssential: false
  },
  {
    id: 'neml-finasteride',
    nemlCode: 'NEML-08-SUR-002',
    edition: '8th Edition (2024)',
    genericName: 'Finasteride',
    brandNames: ['Proscar', 'Finast', 'Propecia'],
    therapeuticCategory: 'Surgery, Urology & Anaesthesia',
    atcCode: 'G04CB01',
    levelOfCare: 'S',
    levelOfCareLabel: 'Secondary / Tertiary [S/T] • Urology Clinic Long-term BPH Management',
    whoAWaReCategory: 'Not Applicable',
    dosageForms: ['Tablet 5mg'],
    standardIndications: [
      'Treatment and control of benign prostatic hyperplasia (BPH) with enlarged prostate (>30cc)',
      'Reduction in the risk of acute urinary retention and requirement for TURP surgery'
    ],
    prescribingGuidelines: 'Dose 5mg PO once daily with or without food. Requires 6-12 months of therapy to assess clinical efficacy. Reduces serum PSA by approximately 50%; adjust PSA interpretation accordingly.',
    contraindications: ['Women who are or may become pregnant (teratogenic / Category X)', 'Hypersensitivity'],
    nafdacRegStatus: 'NAFDAC Reg No: 04-7123 (Verified in NAFDAC Green Book)',
    emdexMonographId: 'EMDEX-NG-2024-URO-008',
    isPediatricEssential: false
  },
  {
    id: 'neml-lidocaine',
    nemlCode: 'NEML-08-SUR-003',
    edition: '8th Edition (2024)',
    genericName: 'Lidocaine Hydrochloride (+/- Adrenaline)',
    brandNames: ['Xylocaine', 'Lignocaine Injection', 'Lidocad'],
    therapeuticCategory: 'Surgery, Urology & Anaesthesia',
    atcCode: 'N01BB02',
    levelOfCare: 'P',
    levelOfCareLabel: 'Primary / Secondary / Tertiary [P/S/T] • Minor Theatre & Ambulatory Procedure Room',
    whoAWaReCategory: 'Not Applicable',
    dosageForms: [
      'Injection 1% & 2% plain in 20mL vial',
      'Injection 2% with Adrenaline 1:200,000 in 20mL vial',
      'Topical Jelly 2% (Urethral catheterization anesthesia)'
    ],
    standardIndications: [
      'Infiltration anesthesia and peripheral nerve blocks for minor surgical procedures and wound repair',
      'Urethral topical anesthesia prior to Foley catheterization or cystoscopy',
      'Ventricular arrhythmias emergency management (IV plain)'
    ],
    prescribingGuidelines: 'Maximum safe dose: 3 mg/kg plain; 7 mg/kg with adrenaline. DO NOT use adrenaline preparations on end-arteriolar digits, penis, nose, or earlobes.',
    contraindications: ['Complete heart block', 'Severe sinoatrial block', 'Amide local anesthetic allergy'],
    nafdacRegStatus: 'NAFDAC Reg No: 04-0105 (Verified in NAFDAC Green Book)',
    emdexMonographId: 'EMDEX-NG-2024-SUR-012',
    isPediatricEssential: true
  },
  {
    id: 'neml-bupivacaine',
    nemlCode: 'NEML-08-SUR-004',
    edition: '8th Edition (2024)',
    genericName: 'Bupivacaine Hydrochloride (Heavy 0.5%)',
    brandNames: ['Marcaine Spinal Heavy', 'Sensorcaine', 'Bupican Heavy'],
    therapeuticCategory: 'Surgery, Urology & Anaesthesia',
    atcCode: 'N01BB01',
    levelOfCare: 'S',
    levelOfCareLabel: 'Secondary / Tertiary [S/T] • Operating Theatre & Spinal Anaesthesia',
    whoAWaReCategory: 'Not Applicable',
    dosageForms: ['Injection 0.5% Heavy with Dextrose 80mg/mL in 4mL ampoule'],
    standardIndications: [
      'Subarachnoid (spinal) anesthesia for urological procedures (TURP, prostatectomy, urethroplasty)',
      'Spinal anesthesia for Cesarean delivery and lower abdominal/limb surgery'
    ],
    prescribingGuidelines: 'Administered intrathecally by qualified anesthetist. Usual adult dose 2-4mL (10-20mg). Monitor blood pressure every 2 minutes for post-spinal hypotension.',
    contraindications: ['Infection at lumbar puncture site', 'Uncorrected hypovolemia or coagulopathy', 'Increased intracranial pressure'],
    nafdacRegStatus: 'NAFDAC Reg No: 04-4419 (Verified in NAFDAC Green Book)',
    emdexMonographId: 'EMDEX-NG-2024-SUR-025',
    isPediatricEssential: false
  },

  // 6. PAIN MANAGEMENT & ANALGESIA
  {
    id: 'neml-paracetamol',
    nemlCode: 'NEML-08-ANA-001',
    edition: '8th Edition (2024)',
    genericName: 'Paracetamol (Acetaminophen)',
    brandNames: ['Panadol', 'Emzor Paracetamol', 'Para-Denk', 'Perfalgan IV'],
    therapeuticCategory: 'Pain Management & Analgesia',
    atcCode: 'N02BE01',
    levelOfCare: 'P',
    levelOfCareLabel: 'Primary [P] • Universal Essential Analgesic & Antipyretic',
    whoAWaReCategory: 'Not Applicable',
    dosageForms: [
      'Tablet 500mg, 1000mg',
      'Syrup 120mg/5mL, 250mg/5mL',
      'IV Infusion 10mg/mL (1g in 100mL vial)'
    ],
    standardIndications: [
      'Mild-to-moderate somatic pain and fever',
      'First-line osteoarthritic analgesia',
      'Multimodal peri-operative analgesia'
    ],
    prescribingGuidelines: 'Adult 500mg-1000mg PO every 4-6 hours (maximum 4000mg/24h). Pediatric 15mg/kg every 4-6 hours. Avoid alcohol co-ingestion to prevent hepatotoxicity.',
    contraindications: ['Severe active liver disease / hepatic failure'],
    nafdacRegStatus: 'NAFDAC Reg No: 04-0001 (Verified in NAFDAC Green Book)',
    emdexMonographId: 'EMDEX-NG-2024-ANA-001',
    isPediatricEssential: true
  },
  {
    id: 'neml-ibuprofen',
    nemlCode: 'NEML-08-ANA-002',
    edition: '8th Edition (2024)',
    genericName: 'Ibuprofen',
    brandNames: ['Brufen', 'Advil', 'Emprofen'],
    therapeuticCategory: 'Pain Management & Analgesia',
    atcCode: 'M01AE01',
    levelOfCare: 'P',
    levelOfCareLabel: 'Primary [P] • First-line Non-Steroidal Anti-Inflammatory (NSAID)',
    whoAWaReCategory: 'Not Applicable',
    dosageForms: ['Tablet 200mg, 400mg', 'Suspension 100mg/5mL'],
    standardIndications: [
      'Inflammatory joint conditions (osteoarthritis, rheumatoid arthritis)',
      'Dysmenorrhea and pelvic cramps',
      'Dental pain, musculoskeletal sprains and tension headaches'
    ],
    prescribingGuidelines: 'Adult 400mg PO every 6-8 hours with or after food (max 1200mg/day OTC, 2400mg under physician supervision). Co-prescribe PPI in elderly or high ulcer risk patients.',
    contraindications: ['Active peptic ulcer or gastrointestinal bleeding', 'Severe renal impairment', 'Third trimester of pregnancy'],
    nafdacRegStatus: 'NAFDAC Reg No: 04-0239 (Verified in NAFDAC Green Book)',
    emdexMonographId: 'EMDEX-NG-2024-ANA-009',
    isPediatricEssential: true
  },
  {
    id: 'neml-tramadol',
    nemlCode: 'NEML-08-ANA-003',
    edition: '8th Edition (2024)',
    genericName: 'Tramadol Hydrochloride',
    brandNames: ['Tramal', 'Ultram', 'Tramata'],
    therapeuticCategory: 'Pain Management & Analgesia',
    atcCode: 'N02AX02',
    levelOfCare: 'S',
    levelOfCareLabel: 'Secondary / Tertiary [S/T] • Controlled Substance (NAFDAC Prescription Only)',
    whoAWaReCategory: 'Not Applicable',
    dosageForms: ['Capsule 50mg', 'Injection 50mg/mL & 100mg/2mL ampoule'],
    standardIndications: [
      'Moderate to severe acute post-surgical pain',
      'Chronic severe musculoskeletal pain when non-opioids fail'
    ],
    prescribingGuidelines: 'Adult 50mg-100mg PO or IV every 6 hours (max 400mg/24h). Under strict NAFDAC controlled prescription registry. Extreme caution in CYP2D6 Ultrarapid Metabolizers due to respiratory depression risk.',
    contraindications: ['Acute intoxication with alcohol, hypnotics or psychotropics', 'CYP2D6 Ultrarapid Metabolizers', 'Uncontrolled epilepsy'],
    pharmacogenomicAlert: {
      targetGene: 'CYP2D6',
      riskPhenotype: 'Ultrarapid Metabolizer (*1/*1xN)',
      recommendation: 'CONTRAINDICATED: Accelerated hyper-conversion to M1 narcotic metabolite. High risk of fatal central apnea.',
      severity: 'CONTRAINDICATED'
    },
    nafdacRegStatus: 'NAFDAC Reg No: 04-8910 (Strict Controlled Substance License)',
    emdexMonographId: 'EMDEX-NG-2024-ANA-045',
    isPediatricEssential: false
  },
  {
    id: 'neml-codeine',
    nemlCode: 'NEML-08-ANA-004',
    edition: '8th Edition (2024)',
    genericName: 'Codeine Phosphate',
    brandNames: ['Codafen', 'Codeine Linctus (Controlled)'],
    therapeuticCategory: 'Pain Management & Analgesia',
    atcCode: 'R05DA04',
    levelOfCare: 'S',
    levelOfCareLabel: 'Secondary / Tertiary [S/T] • Controlled Substance Restricted Formulary',
    whoAWaReCategory: 'Not Applicable',
    dosageForms: ['Tablet 30mg', 'Syrup (Hospital Inpatient Only)'],
    standardIndications: [
      'Short-term relief of moderate pain unresponsive to paracetamol/ibuprofen alone'
    ],
    prescribingGuidelines: 'Adult 30-60mg every 4-6 hours (max 240mg daily). Prodrug requiring CYP2D6 bioactivation; ineffective in CYP2D6 Poor Metabolizers. Under strict FMoH/NAFDAC restriction.',
    contraindications: ['Children under 12 years', 'Post-adenotonsillectomy in pediatrics', 'CYP2D6 Poor or Ultrarapid Metabolizers'],
    pharmacogenomicAlert: {
      targetGene: 'CYP2D6',
      riskPhenotype: 'Poor Metabolizer (*4/*4, *5/*5)',
      recommendation: 'EFFICACY WARNING: Inactive prodrug. In CYP2D6 poor metabolizers, zero morphine is generated. Switch to direct non-opioid multimodal analgesia.',
      severity: 'HIGH_ADR_ALERT'
    },
    nafdacRegStatus: 'NAFDAC Reg No: 04-0801 (Strict FMoH Controlled Substance Directive)',
    emdexMonographId: 'EMDEX-NG-2024-ANA-052',
    isPediatricEssential: false
  },

  // 7. GASTROINTESTINAL MEDICINES
  {
    id: 'neml-omeprazole',
    nemlCode: 'NEML-08-GAS-001',
    edition: '8th Edition (2024)',
    genericName: 'Omeprazole',
    brandNames: ['Losec', 'Omez', 'Omepra-Denk', 'Prazole'],
    therapeuticCategory: 'Gastrointestinal Medicines',
    atcCode: 'A02BC01',
    levelOfCare: 'P',
    levelOfCareLabel: 'Primary [P] • Primary Care Gastric Acid Suppression',
    whoAWaReCategory: 'Not Applicable',
    dosageForms: ['Capsule 20mg, 40mg', 'Powder for Injection 40mg vial'],
    standardIndications: [
      'Gastroesophageal reflux disease (GERD) and reflux esophagitis',
      'Duodenal and gastric ulcers; Helicobacter pylori eradication regimens',
      'NSAID-associated gastric ulcer prophylaxis in high-risk patients'
    ],
    prescribingGuidelines: 'Standard dose 20mg PO once daily taken 30-60 minutes before breakfast. For H. pylori eradication: 20mg BID combined with Amoxicillin 1g BID and Clarithromycin 500mg BID x 14 days.',
    contraindications: ['Hypersensitivity to proton pump inhibitors', 'Concomitant Nelfinavir'],
    nafdacRegStatus: 'NAFDAC Reg No: 04-2299 (Verified in NAFDAC Green Book)',
    emdexMonographId: 'EMDEX-NG-2024-GAS-004',
    isPediatricEssential: false
  },
  {
    id: 'neml-ors-zinc',
    nemlCode: 'NEML-08-GAS-002',
    edition: '8th Edition (2024)',
    genericName: 'Oral Rehydration Salts (Low-Osmolarity) + Zinc Sulphate',
    brandNames: ['ORS Low Osmolality', 'Zincfant', 'Hydra-Plus'],
    therapeuticCategory: 'Gastrointestinal Medicines',
    atcCode: 'A07CA01',
    levelOfCare: 'P',
    levelOfCareLabel: 'Primary [P] • Universal Child Health Diarrhea Management',
    whoAWaReCategory: 'Not Applicable',
    dosageForms: [
      'Sachet to dissolve in 1 Liter of clean drinking water',
      'Zinc Dispersible Tablet 20mg (10mg for infants < 6 months)'
    ],
    standardIndications: [
      'First-line treatment and prevention of dehydration from acute gastroenteritis and diarrhea in children and adults'
    ],
    prescribingGuidelines: 'Administer ORS freely after each loose stool. Co-administer Zinc Sulphate 20mg daily for 10-14 days to reduce diarrheal duration, severity, and subsequent episode recurrence.',
    contraindications: ['Severe dehydration with shock (requires immediate IV Ringer\'s Lactate)', 'Paralytic ileus'],
    nafdacRegStatus: 'NAFDAC Reg No: 04-0088 (Verified in NAFDAC Green Book)',
    emdexMonographId: 'EMDEX-NG-2024-GAS-011',
    isPediatricEssential: true
  }
];
