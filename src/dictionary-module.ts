// Dictionary utilities functionality - separate bundle
export {
  searchWords,
  findWordsBySyllableCount,
  findWordsByPhonemePattern,
  findRhymingWords,
  findWordsByStressPattern,
  getDictionaryStats,
  findWordsByComplexity,
  findWordsByVowelCount,
  getRandomWords,
  getRandomWordsWithKey,
  isWordInDictionary,
  getAllWords,
  getDictionarySize,
  // Advanced utilities
  advancedSearch,
  batchProcessWords,
  getComprehensiveStats,
  findWordsByCriteria,
  getWordsByFrequency,
  findSimilarWords,
  getWordClusters,
  exportDictionaryData
} from './dictionary-core';

export type {
  WordSearchOptions,
  WordAnalysis,
  PhonemeStats,
  BatchProcessingOptions,
  AdvancedSearchOptions
} from './dictionary-core';
