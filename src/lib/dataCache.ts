// Global data cache for performance optimization
import type { CompanyProforma, StatsData, TimelineEvent } from "@/types/placement";

interface DataCache {
  stats: StatsData | null;
  proforma: CompanyProforma[] | null;
  timeline: TimelineEvent[] | null;
  statsLoaded: boolean;
  proformaLoaded: boolean;
  timelineLoaded: boolean;
}

const cache: DataCache = {
  stats: null,
  proforma: null,
  timeline: null,
  statsLoaded: false,
  proformaLoaded: false,
  timelineLoaded: false,
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

export async function getTimelineData(): Promise<TimelineEvent[]> {
  if (cache.timelineLoaded && cache.timeline) {
    return cache.timeline;
  }
  
  const response = await fetch("/data/timeline.json");
  if (!response.ok) throw new Error("Failed to load timeline data");
  cache.timeline = await response.json();
  cache.timelineLoaded = true;
  return cache.timeline!;
}

// Preload all data sets
export function preloadData() {
  getStatsData().catch(console.error);
  getProformaData().catch(console.error);
  getTimelineData().catch(console.error);
}
