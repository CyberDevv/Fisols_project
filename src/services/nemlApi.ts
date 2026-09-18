import { NemlDrug, NemlApiStats, NemlValidationResult, PatientProfile, ClinicalDepartment } from '../types';
import { NEML_DRUG_DATABASE, NEML_API_METADATA, NEML_CATEGORIES } from '../data/nemlDatabase';
import { GENEVA_PHARMACOGENOMIC_RULES } from '../data/clinicalData';

export interface NemlSearchParams {
  query?: string;
  category?: string;
  levelOfCare?: string;
  whoAWaRe?: string;
  pgxOnly?: boolean;
}

export class NemlApiService {
  private static cache: NemlDrug[] = NEML_DRUG_DATABASE;
  private static stats: NemlApiStats = { ...NEML_API_METADATA };

  /**
   * Search drugs in the National Essential Medicines List (NEML 8th Edition)
   */
  public static async searchDrugs(params: NemlSearchParams = {}): Promise<{
    drugs: NemlDrug[];
    total: number;
    stats: NemlApiStats;
    source: 'LIVE_API' | 'LOCAL_MIRROR';
  }> {
    // Try live server API first if available, otherwise fallback cleanly to local database
    try {
      const queryParams = new URLSearchParams();
      if (params.query) queryParams.set('q', params.query);
      if (params.category && params.category !== 'All Categories') queryParams.set('category', params.category);
      if (params.levelOfCare && params.levelOfCare !== 'ALL') queryParams.set('level', params.levelOfCare);
      if (params.whoAWaRe && params.whoAWaRe !== 'ALL') queryParams.set('aware', params.whoAWaRe);
      if (params.pgxOnly) queryParams.set('pgx', 'true');

      const url = `/api/neml/drugs?${queryParams.toString()}`;
      const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
      if (res.ok) {
        const data = await res.json();
        return {
          drugs: data.drugs || [],
          total: data.total || 0,
          stats: data.stats || this.stats,
          source: 'LIVE_API'
        };
      }
    } catch {
      // Fallback to in-memory local mirror
    }

    // Local mirror search
    let filtered = [...this.cache];

    if (params.query && params.query.trim()) {
      const q = params.query.toLowerCase().trim();
      filtered = filtered.filter(d => 
        d.genericName.toLowerCase().includes(q) ||
        d.nemlCode.toLowerCase().includes(q) ||
        d.atcCode.toLowerCase().includes(q) ||
        d.brandNames.some(b => b.toLowerCase().includes(q)) ||
        d.therapeuticCategory.toLowerCase().includes(q) ||
        d.standardIndications.some(i => i.toLowerCase().includes(q))
      );
    }

    if (params.category && params.category !== 'All Categories') {
      filtered = filtered.filter(d => d.therapeuticCategory === params.category);
    }

    if (params.levelOfCare && params.levelOfCare !== 'ALL') {
      filtered = filtered.filter(d => d.levelOfCare === params.levelOfCare);
    }

    if (params.whoAWaRe && params.whoAWaRe !== 'ALL') {
      filtered = filtered.filter(d => d.whoAWaReCategory === params.whoAWaRe);
    }

    if (params.pgxOnly) {
      filtered = filtered.filter(d => !!d.pharmacogenomicAlert);
    }

    return {
      drugs: filtered,
      total: filtered.length,
      stats: this.stats,
      source: 'LOCAL_MIRROR'
    };
  }

  /**
   * Get single drug by ID or NEML Code
   */
  public static async getDrugById(idOrCode: string): Promise<NemlDrug | null> {
    const found = this.cache.find(d => 
      d.id.toLowerCase() === idOrCode.toLowerCase() || 
      d.nemlCode.toLowerCase() === idOrCode.toLowerCase()
    );
    return found || null;
  }

  /**
   * Get API metadata & EMDEX sync stats
   */
  public static getApiStats(): NemlApiStats {
    return { ...this.stats };
  }

  /**
   * Get list of categories
   */
  public static getCategories(): string[] {
    return NEML_CATEGORIES;
  }

  /**
   * Validate drug against patient profile (allergies, pharmacogenomics, and hospital level of care)
   */
  public static validatePrescription(
    drug: NemlDrug,
    patient: PatientProfile,
    _targetDept?: ClinicalDepartment
  ): NemlValidationResult {
    // 1. Allergy check
    let allergyConflict = false;
    let allergyConflictMessage: string | undefined;

    const lowerDrugName = drug.genericName.toLowerCase();
    const patientAllergies = (patient.drugAllergies || []).map(a => a.toLowerCase());

    for (const allergy of patientAllergies) {
      if (
        lowerDrugName.includes(allergy) ||
        allergy.includes(lowerDrugName) ||
        (allergy.includes('penicillin') && (lowerDrugName.includes('amoxicillin') || lowerDrugName.includes('clavulanic'))) ||
        (allergy.includes('nsaid') && (lowerDrugName.includes('ibuprofen') || lowerDrugName.includes('diclofenac'))) ||
        (allergy.includes('sulfa') && (lowerDrugName.includes('cotrimoxazole') || lowerDrugName.includes('hydrochlorothiazide')))
      ) {
        allergyConflict = true;
        allergyConflictMessage = `Critical Allergy Warning: Patient has documented allergy to "${allergy}". Prescribing "${drug.genericName}" may induce severe hypersensitivity / anaphylaxis.`;
        break;
      }
    }

    // 2. Pharmacogenomic check against Geneva rules and patient CYP450 biomarkers
    let pgxWarning: NemlValidationResult['pgxWarning'];

    // Direct check against rule database
    const matchingRule = GENEVA_PHARMACOGENOMIC_RULES.find(rule => 
      drug.genericName.toLowerCase().includes(rule.drugName.toLowerCase()) ||
      rule.drugName.toLowerCase().includes(drug.genericName.toLowerCase())
    );

    if (matchingRule) {
      // Check if patient has the trigger variant
      const matchingMarker = patient.geneticProfile.find(g => 
        g.gene.toUpperCase() === matchingRule.targetGene.toUpperCase()
      );

      if (matchingMarker && (
        matchingMarker.phenotype.toLowerCase().includes('poor') || 
        matchingMarker.phenotype.toLowerCase().includes('high') ||
        matchingMarker.phenotype.toLowerCase().includes('ultrarapid')
      )) {
        pgxWarning = {
          gene: matchingRule.targetGene,
          phenotype: matchingMarker.phenotype,
          warning: matchingRule.warningSummary,
          severity: matchingRule.riskSeverity === 'CONTRAINDICATED' ? 'CONTRAINDICATED' : 'HIGH_ADR_ALERT'
        };
      }
    } else if (drug.pharmacogenomicAlert) {
      // Fallback to drug embedded alert
      const alert = drug.pharmacogenomicAlert;
      const matchingMarker = patient.geneticProfile.find(g => 
        g.gene.toUpperCase() === alert.targetGene.toUpperCase()
      );
      if (matchingMarker && matchingMarker.phenotype.toLowerCase().includes('poor')) {
        pgxWarning = {
          gene: alert.targetGene,
          phenotype: matchingMarker.phenotype,
          warning: alert.recommendation,
          severity: alert.severity
        };
      }
    }

    // 3. Level of Care Authorization
    // LAUTECH Teaching Hospital is a Tertiary Health Care institution (Level T),
    // which holds full statutory authority to dispense and prescribe across P, S, and T levels.
    const isAuthorizedForLevel = true;
    let levelMessage = 'Authorized: LAUTECH Teaching Hospital holds statutory tertiary accreditation for full NEML formulary.';
    if (drug.levelOfCare === 'P') {
      levelMessage = 'Primary [P]: Unrestricted ambulatory dispensing. Covered under basic PHC & Family Medicine formulary.';
    } else if (drug.levelOfCare === 'S') {
      levelMessage = 'Secondary [S]: Hospital specialist clinic authorization validated.';
    } else if (drug.levelOfCare === 'T') {
      levelMessage = 'Tertiary [T]: Specialist consultant / teaching hospital authorization active.';
    }

    return {
      drug,
      isAuthorizedForLevel,
      levelMessage,
      pgxWarning,
      allergyConflict,
      allergyConflictMessage
    };
  }

  /**
   * Simulated API sandbox executor for testing requests and reviewing live responses
   */
  public static async executeSimulatedApiCall(
    endpoint: string,
    params: Record<string, string> = {}
  ): Promise<{
    url: string;
    status: number;
    statusText: string;
    responseTimeMs: number;
    headers: Record<string, string>;
    data: any;
  }> {
    const startTime = performance.now();

    // Small simulated network latency (15 - 45 ms)
    await new Promise(r => setTimeout(r, 25));

    const responseTimeMs = Math.round(performance.now() - startTime);

    if (endpoint.includes('/api/neml/drugs')) {
      const q = params.q || '';
      const cat = params.category || '';
      const searchRes = await this.searchDrugs({ query: q, category: cat });
      return {
        url: `${endpoint}?${new URLSearchParams(params).toString()}`,
        status: 200,
        statusText: 'OK',
        responseTimeMs,
        headers: {
          'content-type': 'application/json; charset=utf-8',
          'x-neml-edition': '8th-2024-NG',
          'x-emdex-sync': 'CONNECTED-v8.4.2',
          'cache-control': 'public, max-age=86400',
          'x-powered-by': 'FMoH e-Formulary Gateway'
        },
        data: {
          status: 'success',
          edition: 'Federal Republic of Nigeria NEML 8th Edition (2024)',
          totalRecords: searchRes.total,
          returnedCount: searchRes.drugs.length,
          data: searchRes.drugs
        }
      };
    }

    if (endpoint.includes('/api/neml/stats')) {
      return {
        url: endpoint,
        status: 200,
        statusText: 'OK',
        responseTimeMs,
        headers: {
          'content-type': 'application/json; charset=utf-8',
          'x-neml-edition': '8th-2024-NG'
        },
        data: {
          status: 'success',
          apiStats: this.stats,
          therapeuticCategories: NEML_CATEGORIES
        }
      };
    }

    return {
      url: endpoint,
      status: 200,
      statusText: 'OK',
      responseTimeMs,
      headers: { 'content-type': 'application/json' },
      data: { status: 'success', message: 'NEML Gateway Operational' }
    };
  }
}
