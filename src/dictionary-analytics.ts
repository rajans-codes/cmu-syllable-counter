import { CMU_PRONUNCIATIONS } from './dictionary-data';
import type { WordAnalysis, PhonemeStats } from './dictionary-core';
import {
  countSyllablesFromPronunciation,
  extractStressPattern,
  determineComplexity,
  calculatePhonemeSimilarity,
  levenshteinDistance
} from './shared-utils';

export interface AnalyticsOptions {
  /** Whether to include detailed analysis */
  detailed?: boolean;
  /** Sample size for large datasets */
  sampleSize?: number;
  /** Confidence level for statistical calculations */
  confidenceLevel?: number;
}

export interface StatisticalSummary {
  mean: number;
  median: number;
  mode: number;
  standardDeviation: number;
  variance: number;
  min: number;
  max: number;
  range: number;
  quartiles: [number, number, number];
  percentiles: Record<number, number>;
}

export interface CorrelationAnalysis {
  correlation: number;
  strength: 'strong' | 'moderate' | 'weak' | 'none';
  significance: boolean;
  sampleSize: number;
}

export interface PhonemeAnalysis {
  phoneme: string;
  frequency: number;
  percentage: number;
  averageWordLength: number;
  averageSyllables: number;
  commonWords: string[];
  stressPatterns: Record<string, number>;
}

export interface WordPatternAnalysis {
  pattern: string;
  frequency: number;
  examples: string[];
  averageLength: number;
  averageSyllables: number;
  complexity: Record<string, number>;
}

/**
 * Calculate statistical summary for a dataset
 */
export function calculateStatistics(data: number[]): StatisticalSummary {
  if (data.length === 0) {
    throw new Error('Cannot calculate statistics for empty dataset');
  }

  const sorted = [...data].sort((a, b) => a - b);
  const n = data.length;
  
  // Basic statistics
  const mean = data.reduce((sum, x) => sum + x, 0) / n;
  const median = n % 2 === 0 
    ? (sorted[n/2 - 1] + sorted[n/2]) / 2 
    : sorted[Math.floor(n/2)];
  
  // Mode
  const frequency: Record<number, number> = {};
  data.forEach(x => frequency[x] = (frequency[x] || 0) + 1);
  const modeEntry = Object.entries(frequency).reduce((a, b) => frequency[parseInt(a[0])] > frequency[parseInt(b[0])] ? a : b);
  const mode = parseFloat(modeEntry[0]);
  
  // Variance and standard deviation
  const variance = data.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / n;
  const standardDeviation = Math.sqrt(variance);
  
  // Quartiles
  const q1 = sorted[Math.floor(n * 0.25)];
  const q2 = median;
  const q3 = sorted[Math.floor(n * 0.75)];
  
  // Percentiles
  const percentiles: Record<number, number> = {};
  [10, 25, 50, 75, 90, 95, 99].forEach(p => {
    const index = Math.floor(n * p / 100);
    percentiles[p] = sorted[index];
  });
  
  return {
    mean,
    median,
    mode,
    standardDeviation,
    variance,
    min: sorted[0],
    max: sorted[n - 1],
    range: sorted[n - 1] - sorted[0],
    quartiles: [q1, q2, q3],
    percentiles
  };
}

/**
 * Calculate correlation between two datasets
 */
export function calculateCorrelation(x: number[], y: number[]): CorrelationAnalysis {
  if (x.length !== y.length || x.length < 2) {
    throw new Error('Datasets must have same length and at least 2 points');
  }
  
  const n = x.length;
  const sumX = x.reduce((sum, val) => sum + val, 0);
  const sumY = y.reduce((sum, val) => sum + val, 0);
  const sumXY = x.reduce((sum, val, i) => sum + val * y[i], 0);
  const sumX2 = x.reduce((sum, val) => sum + val * val, 0);
  const sumY2 = y.reduce((sum, val) => sum + val * val, 0);
  
  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
  
  const correlation = denominator === 0 ? 0 : numerator / denominator;
  
  // Determine strength
  let strength: 'strong' | 'moderate' | 'weak' | 'none';
  const absCorr = Math.abs(correlation);
  if (absCorr >= 0.7) strength = 'strong';
  else if (absCorr >= 0.3) strength = 'moderate';
  else if (absCorr >= 0.1) strength = 'weak';
  else strength = 'none';
  
  // Simple significance test (|r| > 2/√n)
  const significance = absCorr > 2 / Math.sqrt(n);
  
  return {
    correlation,
    strength,
    significance,
    sampleSize: n
  };
}

/**
 * Analyze phoneme distribution and patterns
 */
export function analyzePhonemePatterns(options: AnalyticsOptions = {}): PhonemeAnalysis[] {
  const { detailed = true, sampleSize } = options;
  
  const phonemeStats: Record<string, {
    count: number;
    words: string[];
    totalLength: number;
    totalSyllables: number;
    stressPatterns: Record<string, number>;
  }> = {};
  
  const words = Object.entries(CMU_PRONUNCIATIONS);
  const sample = sampleSize ? words.slice(0, sampleSize) : words;
  
  for (const [word, data] of sample) {
    const pronunciation = data.p;
    const phonemes = pronunciation.split(' ');
    const syllables = countSyllablesFromPronunciation(pronunciation);
    
    for (const phoneme of phonemes) {
      const basePhoneme = phoneme.substring(0, 2);
      
      if (!phonemeStats[basePhoneme]) {
        phonemeStats[basePhoneme] = {
          count: 0,
          words: [],
          totalLength: 0,
          totalSyllables: 0,
          stressPatterns: {}
        };
      }
      
      phonemeStats[basePhoneme].count++;
      if (detailed && phonemeStats[basePhoneme].words.length < 10) {
        phonemeStats[basePhoneme].words.push(word);
      }
      phonemeStats[basePhoneme].totalLength += word.length;
      phonemeStats[basePhoneme].totalSyllables += syllables;
      
      // Track stress patterns for this phoneme
      const stressPattern = extractStressPattern(pronunciation);
      phonemeStats[basePhoneme].stressPatterns[stressPattern] = 
        (phonemeStats[basePhoneme].stressPatterns[stressPattern] || 0) + 1;
    }
  }
  
  const totalPhonemes = Object.values(phonemeStats).reduce((sum, stat) => sum + stat.count, 0);
  
  return Object.entries(phonemeStats)
    .map(([phoneme, stats]) => ({
      phoneme,
      frequency: stats.count,
      percentage: (stats.count / totalPhonemes) * 100,
      averageWordLength: stats.totalLength / stats.count,
      averageSyllables: stats.totalSyllables / stats.count,
      commonWords: stats.words,
      stressPatterns: stats.stressPatterns
    }))
    .sort((a, b) => b.frequency - a.frequency);
}

/**
 * Analyze word patterns and structures
 */
export function analyzeWordPatterns(patternType: 'prefix' | 'suffix' | 'phoneme' | 'stress', options: AnalyticsOptions = {}): WordPatternAnalysis[] {
  const { detailed = true, sampleSize } = options;
  
  const patternStats: Record<string, {
    count: number;
    words: string[];
    totalLength: number;
    totalSyllables: number;
    complexity: Record<string, number>;
  }> = {};
  
  const words = Object.entries(CMU_PRONUNCIATIONS);
  const sample = sampleSize ? words.slice(0, sampleSize) : words;
  
  for (const [word, data] of sample) {
    const pronunciation = data.p;
    let pattern: string;
    
    switch (patternType) {
      case 'prefix':
        pattern = word.substring(0, Math.min(3, word.length));
        break;
      case 'suffix':
        pattern = word.substring(Math.max(0, word.length - 3));
        break;
      case 'phoneme':
        const phonemes = pronunciation.split(' ');
        pattern = phonemes.slice(0, Math.min(3, phonemes.length)).map((p: string) => p.substring(0, 2)).join('-');
        break;
      case 'stress':
        pattern = extractStressPattern(pronunciation);
        break;
      default:
        continue;
    }
    
    if (!patternStats[pattern]) {
      patternStats[pattern] = {
        count: 0,
        words: [],
        totalLength: 0,
        totalSyllables: 0,
        complexity: {}
      };
    }
    
    const syllables = countSyllablesFromPronunciation(pronunciation);
    const complexity = determineComplexity(pronunciation);
    
    patternStats[pattern].count++;
    if (detailed && patternStats[pattern].words.length < 10) {
      patternStats[pattern].words.push(word);
    }
    patternStats[pattern].totalLength += word.length;
    patternStats[pattern].totalSyllables += syllables;
    patternStats[pattern].complexity[complexity] = (patternStats[pattern].complexity[complexity] || 0) + 1;
  }
  
  return Object.entries(patternStats)
    .map(([pattern, stats]) => ({
      pattern,
      frequency: stats.count,
      examples: stats.words,
      averageLength: stats.totalLength / stats.count,
      averageSyllables: stats.totalSyllables / stats.count,
      complexity: stats.complexity
    }))
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 50); // Top 50 patterns
}

/**
 * Perform comprehensive dictionary analysis
 */
export function performComprehensiveAnalysis(options: AnalyticsOptions = {}): {
  wordLengthStats: StatisticalSummary;
  syllableStats: StatisticalSummary;
  phonemeStats: StatisticalSummary;
  correlations: {
    lengthVsSyllables: CorrelationAnalysis;
    lengthVsPhonemes: CorrelationAnalysis;
    syllablesVsPhonemes: CorrelationAnalysis;
  };
  topPhonemes: PhonemeAnalysis[];
  commonPatterns: WordPatternAnalysis[];
} {
  const { sampleSize } = options;
  
  const words = Object.entries(CMU_PRONUNCIATIONS);
  const sample = sampleSize ? words.slice(0, sampleSize) : words;
  
  // Extract data arrays
  const lengths: number[] = [];
  const syllables: number[] = [];
  const phonemes: number[] = [];
  
  for (const [word, data] of sample) {
    const pronunciation = data.p;
    lengths.push(word.length);
    syllables.push(countSyllablesFromPronunciation(pronunciation));
    phonemes.push(pronunciation.split(' ').length);
  }
  
  // Calculate statistics
  const wordLengthStats = calculateStatistics(lengths);
  const syllableStats = calculateStatistics(syllables);
  const phonemeStats = calculateStatistics(phonemes);
  
  // Calculate correlations
  const lengthVsSyllables = calculateCorrelation(lengths, syllables);
  const lengthVsPhonemes = calculateCorrelation(lengths, phonemes);
  const syllablesVsPhonemes = calculateCorrelation(syllables, phonemes);
  
  // Get phoneme and pattern analysis
  const topPhonemes = analyzePhonemePatterns({ ...options, sampleSize });
  const commonPatterns = analyzeWordPatterns('phoneme', { ...options, sampleSize });
  
  return {
    wordLengthStats,
    syllableStats,
    phonemeStats,
    correlations: {
      lengthVsSyllables,
      lengthVsPhonemes,
      syllablesVsPhonemes
    },
    topPhonemes: topPhonemes.slice(0, 20),
    commonPatterns: commonPatterns.slice(0, 20)
  };
}

/**
 * Find outliers in the dictionary
 */
export function findOutliers(metric: 'length' | 'syllables' | 'phonemes', threshold: number = 2, options: AnalyticsOptions = {}): WordAnalysis[] {
  const { sampleSize } = options;
  
  const words = Object.entries(CMU_PRONUNCIATIONS);
  const sample = sampleSize ? words.slice(0, sampleSize) : words;
  
  // Extract data
  const data: Array<{ word: string; value: number; pronunciation: string }> = [];
  
  for (const [word, wordData] of sample) {
    const pronunciation = wordData.p;
    let value: number;
    switch (metric) {
      case 'length':
        value = word.length;
        break;
      case 'syllables':
        value = countSyllablesFromPronunciation(pronunciation);
        break;
      case 'phonemes':
        value = pronunciation.split(' ').length;
        break;
      default:
        continue;
    }
    
    data.push({ word, value, pronunciation });
  }
  
  // Calculate statistics
  const values = data.map(d => d.value);
  const stats = calculateStatistics(values);
  
  // Find outliers (beyond threshold standard deviations from mean)
  const lowerBound = stats.mean - threshold * stats.standardDeviation;
  const upperBound = stats.mean + threshold * stats.standardDeviation;
  
  return data
    .filter(d => d.value < lowerBound || d.value > upperBound)
    .map(d => ({
      word: d.word,
      pronunciation: d.pronunciation,
      syllables: countSyllablesFromPronunciation(d.pronunciation),
      phonemeCount: d.pronunciation.split(' ').length,
      length: d.word.length,
      [metric]: d.value
    }))
    .sort((a, b) => (b[metric] as number) - (a[metric] as number));
}

/**
 * Generate word clusters based on similarity
 */
export function generateWordClusters(
  similarityMetric: 'phoneme' | 'length' | 'syllable' | 'stress',
  similarityThreshold: number = 0.8,
  options: AnalyticsOptions = {}
): Array<{
  centroid: string;
  members: string[];
  size: number;
  averageSimilarity: number;
}> {
  const { sampleSize } = options;
  
  const words = Object.entries(CMU_PRONUNCIATIONS);
  const sample = sampleSize ? words.slice(0, sampleSize) : words;
  
  const clusters: Array<{
    centroid: string;
    members: string[];
    size: number;
    averageSimilarity: number;
  }> = [];
  
  const processed = new Set<string>();
  
  for (const [word, data] of sample) {
    const pronunciation = data.p;
    if (processed.has(word)) continue;
    
    const cluster = [word];
    processed.add(word);
    
    // Find similar words
    for (const [otherWord, otherData] of sample) {
      const otherPronunciation = otherData.p;
      if (processed.has(otherWord) || word === otherWord) continue;
      
      let similarity = 0;
      switch (similarityMetric) {
        case 'phoneme':
          const phonemes1 = pronunciation.split(' ');
          const phonemes2 = otherPronunciation.split(' ');
          similarity = calculatePhonemeSimilarity(phonemes1, phonemes2);
          break;
        case 'length':
          similarity = 1 - Math.abs(word.length - otherWord.length) / Math.max(word.length, otherWord.length);
          break;
        case 'syllable':
          const syllables1 = countSyllablesFromPronunciation(pronunciation);
          const syllables2 = countSyllablesFromPronunciation(otherPronunciation);
          similarity = 1 - Math.abs(syllables1 - syllables2) / Math.max(syllables1, syllables2);
          break;
        case 'stress':
          const stress1 = extractStressPattern(pronunciation);
          const stress2 = extractStressPattern(otherPronunciation);
          similarity = stress1 === stress2 ? 1 : 0;
          break;
      }
      
      if (similarity >= similarityThreshold) {
        cluster.push(otherWord);
        processed.add(otherWord);
      }
    }
    
    if (cluster.length > 1) {
      clusters.push({
        centroid: word,
        members: cluster,
        size: cluster.length,
        averageSimilarity: similarityThreshold // Simplified for performance
      });
    }
  }
  
  return clusters.sort((a, b) => b.size - a.size);
}

// Helper functions moved to shared-utils.ts
