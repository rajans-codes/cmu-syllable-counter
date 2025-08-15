// Cache management functionality - separate bundle
export {
  getRandomWordsWithCache,
  hasWordBeenUsed,
  getCacheStats as getWordCacheStats,
  clearCache as clearWordCache,
  clearAllCaches as clearAllWordCaches,
  getCacheKeys as getWordCacheKeys,
  getCacheSize as getWordCacheSize,
  addWordsToCache,
  stopCacheCleanup
} from './word-cache';

// Shared utilities for cache management
export {
  clearPhonemeAnalysisCache,
  getPhonemeAnalysisCacheStats
} from './shared-utils';
