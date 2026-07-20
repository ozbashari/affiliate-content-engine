import { discoveryLibraryV2 } from './discovery-config';
import { DiscoveryStrategy, DiscoveryConfigV2 } from './discovery-types';
import { IDiversityRepository } from './diversity-repository';

export interface DiversitySchedulerMetrics {
  schedulerVersion: 'V1' | 'V2';
  selectedCategories: string[];
  selectedKeywords: string[];
  cooldownExclusions: string[];
  fallbackUsage: boolean;
  candidateCount: number;
  strategyCount: number;
  fallbackReason?: string;
}

export interface DiversitySchedulerV2Result {
  strategies: DiscoveryStrategy[];
  metrics: DiversitySchedulerMetrics;
}

/**
 * Executes the V2 constraint-first diversity scheduling algorithm.
 * Selects up to N distinct categories and rotates keywords based on usage history.
 */
export async function getScheduledStrategiesV2(
  repository: IDiversityRepository,
  config: DiscoveryConfigV2 = discoveryLibraryV2,
  _timestamp: number = Date.now()
): Promise<DiversitySchedulerV2Result> {
  if (_timestamp) { /* unused check bypass */ }
  const metrics: DiversitySchedulerMetrics = {
    schedulerVersion: 'V2',
    selectedCategories: [],
    selectedKeywords: [],
    cooldownExclusions: [],
    fallbackUsage: false,
    candidateCount: 0,
    strategyCount: 0,
  };

  // 1. Build enabled pool
  const enabledCategories = config.categories.filter(c => c.enabled !== false);
  metrics.candidateCount = enabledCategories.length;

  if (enabledCategories.length === 0) {
    return { strategies: [], metrics };
  }

  // 2. Fetch history records
  const runHistoryLimit = Math.max(10, enabledCategories.length * 2);
  const [recentRuns, lastPublishedCat] = await Promise.all([
    repository.getRecentRunHistory(runHistoryLimit),
    repository.getLastPublishedCategory(),
  ]);

  // Determine immediate exclusions
  const lastRunRecord = recentRuns[0];
  const lastRunCategories = lastRunRecord ? lastRunRecord.categoryIds : [];
  
  const excludedCategories = new Set<string>();
  if (lastRunCategories.length > 0) {
    lastRunCategories.forEach(cid => excludedCategories.add(cid));
  }
  if (lastPublishedCat) {
    excludedCategories.add(lastPublishedCat);
  }

  metrics.cooldownExclusions = Array.from(excludedCategories);

  // Apply cooldown filter if enough alternatives exist
  const pool = enabledCategories.filter(c => !excludedCategories.has(c.id));
  const reqCount = config.categoriesPerRun;

  // Fallback: If not enough alternatives exist, recover excluded categories
  if (pool.length < reqCount && enabledCategories.length > pool.length) {
    metrics.fallbackUsage = true;
    metrics.fallbackReason = 'Not enough categories outside of cooldown. Recovering excluded categories.';
    
    // Recover them sorted by when they were used (oldest first)
    const recovered = enabledCategories
      .filter(c => excludedCategories.has(c.id))
      .sort((a, b) => {
        const lastA = recentRuns.find(r => r.categoryIds.includes(a.id));
        const lastB = recentRuns.find(r => r.categoryIds.includes(b.id));
        const timeA = lastA ? new Date(lastA.runAt).getTime() : 0;
        const timeB = lastB ? new Date(lastB.runAt).getTime() : 0;
        return timeA - timeB;
      });

    for (const cat of recovered) {
      if (pool.length >= reqCount) break;
      pool.push(cat);
    }
  }

  // Stage 3, 4, 5, 6: Rank categories deterministically
  pool.sort((a, b) => {
    // 3. Least recently used (LRU) - larger index = older = higher priority
    const lastIdxA = recentRuns.findIndex(r => r.categoryIds.includes(a.id));
    const lastIdxB = recentRuns.findIndex(r => r.categoryIds.includes(b.id));
    
    const scoreA = lastIdxA === -1 ? Infinity : lastIdxA;
    const scoreB = lastIdxB === -1 ? Infinity : lastIdxB;
    
    if (scoreA !== scoreB) {
      return scoreB - scoreA;
    }

    // 4. Frequency count
    const freqA = recentRuns.filter(r => r.categoryIds.includes(a.id)).length;
    const freqB = recentRuns.filter(r => r.categoryIds.includes(b.id)).length;
    if (freqA !== freqB) {
      return freqA - freqB;
    }

    // 5. Weight (higher weight preferred)
    const weightA = a.weight ?? 1;
    const weightB = b.weight ?? 1;
    if (weightA !== weightB) {
      return weightB - weightA;
    }

    // 6. Alphabetical fallback
    return a.id.localeCompare(b.id);
  });

  // Select top categories
  const selectedCategories = pool.slice(0, Math.min(reqCount, pool.length));
  metrics.selectedCategories = selectedCategories.map(c => c.id);

  const resolvedStrategies: DiscoveryStrategy[] = [];

  // Keywords rotation inside selected categories
  for (let order = 0; order < selectedCategories.length; order++) {
    const cat = selectedCategories[order];
    const kws = cat.keywords;
    if (kws.length === 0) continue;

    const count = cat.keywordsPerRun ?? config.defaultKeywordsPerCategory;
    
    const sortedKws = [...kws].sort((a, b) => {
      const lastIdxA = recentRuns.findIndex(r => r.keywords.includes(a));
      const lastIdxB = recentRuns.findIndex(r => r.keywords.includes(b));
      
      const scoreA = lastIdxA === -1 ? Infinity : lastIdxA;
      const scoreB = lastIdxB === -1 ? Infinity : lastIdxB;
      
      if (scoreA !== scoreB) {
        return scoreB - scoreA;
      }
      
      return a.localeCompare(b);
    });

    const chosenKws = sortedKws.slice(0, Math.min(count, sortedKws.length));
    metrics.selectedKeywords.push(...chosenKws);

    const pages = cat.pages ?? 1;
    const pageSize = cat.pageSize ?? 20;

    for (const kw of chosenKws) {
      resolvedStrategies.push({
        type: 'keyword',
        keyword: kw,
        pages,
        pageSize,
        categoryId: cat.id,
        strategyOrder: order,
      });
    }
  }

  metrics.strategyCount = resolvedStrategies.length;

  console.log(`[DiversitySchedulerV2] schedulerVersion=V2 strategiesCount=${metrics.strategyCount} selectedCategories=${JSON.stringify(metrics.selectedCategories)} selectedKeywords=${JSON.stringify(metrics.selectedKeywords)} cooldownExclusions=${JSON.stringify(metrics.cooldownExclusions)} fallbackUsage=${metrics.fallbackUsage}`);

  return {
    strategies: resolvedStrategies,
    metrics,
  };
}
