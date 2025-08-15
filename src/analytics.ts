// Analytics functionality - separate bundle
export {
  calculateStatistics,
  calculateCorrelation,
  analyzePhonemePatterns,
  analyzeWordPatterns,
  performComprehensiveAnalysis,
  findOutliers,
  generateWordClusters
} from './dictionary-analytics';

export type {
  AnalyticsOptions,
  StatisticalSummary,
  CorrelationAnalysis,
  WordPatternAnalysis
} from './dictionary-analytics';

// Re-export PhonemeAnalysis with a different name to avoid conflicts
export type { PhonemeAnalysis as PhonemeAnalysisResult } from './dictionary-analytics';
