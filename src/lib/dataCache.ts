// Global data cache for performance optimization
import type { CompanyProforma, StatsData } from "@/types/placement";

interface DataCache {
  stats: StatsData | null;
  proforma: CompanyProforma[] | null;
  statsLoaded: boolean;
  proformaLoaded: boolean;
}

const cache: DataCache = {
  stats: null,
  proforma: null,
  statsLoaded: false,
  proformaLoaded: false,
};

export async function getStatsData(): Promise<StatsData> {
  if (cache.statsLoaded && cache.stats) {
    return cache.stats;
  }
  
  const response = await fetch("/data/stats.json");
  if (!response.ok) throw new Error("Failed to load stats data");
  cache.stats = await response.json();
  cache.statsLoaded = true;
  return cache.stats!;
}

export async function getProformaData(): Promise<CompanyProforma[]> {
  if (cache.proformaLoaded && cache.proforma) {
    return cache.proforma;
  }
  
  const response = await fetch("/data/linked_company_details.json");
  if (!response.ok) throw new Error("Failed to load company data");
  cache.proforma = await response.json();
  cache.proformaLoaded = true;
  return cache.proforma!;
}

// Preload both data sets
export function preloadData() {
  getStatsData().catch(console.error);
  getProformaData().catch(console.error);
}
