import { CMU_PRONUNCIATIONS } from './dictionary-data';
import { hasWordBeenUsed, addWordsToCache } from './word-cache';
import {
  analyzePhonemes,
  countSyllablesFromPronunciation,
  countVowelsFromPronunciation,
  countConsonantsFromPronunciation,
  extractStressPattern,
  determineComplexity,
  generateHyphenationFromPronunciation,
  calculatePhonemeSimilarity,
  levenshteinDistance
} from './shared-utils';

// Cache the words array to avoid repeated Object.keys() calls
const ALL_WORDS = Object.keys(CMU_PRONUNCIATIONS);

// Pre-computed length ranges for filtering optimization
const LENGTH_RANGES = new Map<number, string[]>();
const SYLLABLE_RANGES = new Map<number, string[]>();

// Initialize length and syllable ranges for fast filtering
function initializeRanges() {
  for (const word of ALL_WORDS) {
    const length = word.length;
    if (!LENGTH_RANGES.has(length)) {
      LENGTH_RANGES.set(length, []);
    }
    LENGTH_RANGES.get(length)!.push(word);
    
    const data = CMU_PRONUNCIATIONS[word];
    if (data) {
      const pronunciation = data.p;
      const syllables = countSyllablesFromPronunciation(pronunciation);
      if (!SYLLABLE_RANGES.has(syllables)) {
        SYLLABLE_RANGES.set(syllables, []);
      }
      SYLLABLE_RANGES.get(syllables)!.push(word);
    }
  }
}

// Initialize ranges on module load
initializeRanges();

// Types for utility functions
export interface WordSearchOptions {
  /** Maximum number of results to return */
  limit?: number;
  /** Whether to include pronunciation data */
  includePronunciation?: boolean;
  /** Whether to include syllable count */
  includeSyllables?: boolean;
  /** Whether to include hyphenation */
  includeHyphenation?: boolean;
  /** Whether to include detailed analysis */
  includeAnalysis?: boolean;
}

export interface WordAnalysis {
  word: string;
  pronunciation?: string;
  syllables?: number;
  hyphenated?: string;
  phonemeCount?: number;
  vowelCount?: number;
  consonantCount?: number;
  stressPattern?: string;
  complexity?: 'simple' | 'moderate' | 'complex';
  length?: number;
  uniquePhonemes?: string[];
  phonemeDiversity?: number;
}

export interface PhonemeStats {
  totalWords: number;
  averagePhonemes: number;
  averageSyllables: number;
  mostCommonPhonemes: Array<{ phoneme: string; count: number }>;
  stressPatterns: Array<{ pattern: string; count: number }>;
  syllableDistribution: Record<number, number>;
  lengthDistribution: Record<number, number>;
  complexityDistribution: Record<string, number>;
}

export interface BatchProcessingOptions {
  /** Batch size for processing */
  batchSize?: number;
  /** Progress callback function */
  onProgress?: (processed: number, total: number) => void;
  /** Whether to process in parallel */
  parallel?: boolean;
  /** Maximum concurrent operations */
  maxConcurrent?: number;
}

export interface AdvancedSearchOptions extends WordSearchOptions {
  /** Minimum syllable count */
  minSyllables?: number;
  /** Maximum syllable count */
  maxSyllables?: number;
  /** Minimum word length */
  minLength?: number;
  /** Maximum word length */
  maxLength?: number;
  /** Minimum phoneme count */
  minPhonemes?: number;
  /** Maximum phoneme count */
  maxPhonemes?: number;
  /** Specific complexity level */
  complexity?: 'simple' | 'moderate' | 'complex';
  /** Words containing specific phonemes */
  containsPhonemes?: string[];
  /** Words starting with specific phonemes */
  startsWithPhonemes?: string[];
  /** Words ending with specific phonemes */
  endsWithPhonemes?: string[];
  /** Regular expression pattern for word matching */
  wordPattern?: RegExp;
  /** Regular expression pattern for pronunciation matching */
  pronunciationPattern?: RegExp;
}

// Cache for performance optimization
const analysisCache = new Map<string, WordAnalysis>();
const statsCache = new Map<string, any>();

// Helper function to get words in length range
function getWordsInLengthRange(minLength: number, maxLength: number): string[] {
  const words: string[] = [];
  for (let length = minLength; length <= maxLength; length++) {
    const wordsOfLength = LENGTH_RANGES.get(length);
    if (wordsOfLength) {
      words.push(...wordsOfLength);
    }
  }
  return words;
}

// Helper function to get words in syllable range
function getWordsInSyllableRange(minSyllables: number, maxSyllables: number): string[] {
  const words: string[] = [];
  for (let syllables = minSyllables; syllables <= maxSyllables; syllables++) {
    const wordsOfSyllables = SYLLABLE_RANGES.get(syllables);
    if (wordsOfSyllables) {
      words.push(...wordsOfSyllables);
    }
  }
  return words;
}

/**
 * Advanced search with multiple criteria
 */
export function advancedSearch(options: AdvancedSearchOptions = {}): WordAnalysis[] {
  const {
    limit = 50,
    includePronunciation = true,
    includeSyllables = true,
    includeHyphenation = true,
    includeAnalysis = true,
    minSyllables,
    maxSyllables,
    minLength,
    maxLength,
    minPhonemes,
    maxPhonemes,
    complexity,
    containsPhonemes,
    startsWithPhonemes,
    endsWithPhonemes,
    wordPattern,
    pronunciationPattern
  } = options;

  const results: WordAnalysis[] = [];
  
  for (const [word, data] of Object.entries(CMU_PRONUNCIATIONS)) {
    const pronunciation = data.p;
    // Apply filters
    if (minLength && word.length < minLength) continue;
    if (maxLength && word.length > maxLength) continue;
    
    const phonemes = pronunciation.split(' ');
    if (minPhonemes && phonemes.length < minPhonemes) continue;
    if (maxPhonemes && phonemes.length > maxPhonemes) continue;
    
    const syllables = countSyllablesFromPronunciation(pronunciation);
    if (minSyllables && syllables < minSyllables) continue;
    if (maxSyllables && syllables > maxSyllables) continue;
    
    if (complexity) {
      const wordComplexity = determineComplexity(pronunciation);
      if (wordComplexity !== complexity) continue;
    }
    
    if (containsPhonemes && containsPhonemes.length > 0) {
      const wordPhonemes = new Set(phonemes.map(p => p.substring(0, 2)));
      if (!containsPhonemes.every(p => wordPhonemes.has(p))) continue;
    }
    
    if (startsWithPhonemes && startsWithPhonemes.length > 0) {
      const startPhonemes = phonemes.slice(0, startsWithPhonemes.length).map(p => p.substring(0, 2));
      if (!startsWithPhonemes.every((p, i) => startPhonemes[i] === p)) continue;
    }
    
    if (endsWithPhonemes && endsWithPhonemes.length > 0) {
      const endPhonemes = phonemes.slice(-endsWithPhonemes.length).map(p => p.substring(0, 2));
      if (!endsWithPhonemes.every((p, i) => endPhonemes[i] === p)) continue;
    }
    
    if (wordPattern && !wordPattern.test(word)) continue;
    if (pronunciationPattern && !pronunciationPattern.test(pronunciation)) continue;
    
    // Create analysis
    const analysis: WordAnalysis = { word };
    
    if (includePronunciation) {
      analysis.pronunciation = pronunciation;
    }
    
    if (includeSyllables) {
      analysis.syllables = syllables;
    }
    
    if (includeHyphenation) {
      analysis.hyphenated = generateHyphenationFromPronunciation(word, pronunciation);
    }
    
    if (includeAnalysis) {
      analysis.phonemeCount = phonemes.length;
      analysis.vowelCount = countVowelsFromPronunciation(pronunciation);
      analysis.consonantCount = countConsonantsFromPronunciation(pronunciation);
      analysis.stressPattern = extractStressPattern(pronunciation);
      analysis.complexity = determineComplexity(pronunciation);
      analysis.length = word.length;
      analysis.uniquePhonemes = [...new Set(phonemes.map(p => p.substring(0, 2)))];
      analysis.phonemeDiversity = analysis.uniquePhonemes.length / phonemes.length;
    }
    
    results.push(analysis);
    
    if (results.length >= limit) break;
  }
  
  return results;
}

/**
 * Batch process words for analysis
 */
export async function batchProcessWords(
  words: string[],
  processor: (word: string, pronunciation: string) => any,
  options: BatchProcessingOptions = {}
): Promise<any[]> {
  const {
    batchSize = 1000,
    onProgress,
    parallel = false,
    maxConcurrent = 4
  } = options;

  const results: any[] = [];
  const total = words.length;
  let processed = 0;

  if (parallel) {
    // Process in parallel batches
    for (let i = 0; i < words.length; i += batchSize * maxConcurrent) {
      const batch = words.slice(i, i + batchSize * maxConcurrent);
      const batchPromises = batch.map(async (word) => {
        const data = CMU_PRONUNCIATIONS[word.toLowerCase()];
        if (data) {
          return await processor(word, data.p);
        }
        return null;
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults.filter(r => r !== null));
      processed += batch.length;
      
      if (onProgress) {
        onProgress(processed, total);
      }
    }
  } else {
    // Process sequentially in batches
    for (let i = 0; i < words.length; i += batchSize) {
      const batch = words.slice(i, i + batchSize);
      
      for (const word of batch) {
        const data = CMU_PRONUNCIATIONS[word.toLowerCase()];
        if (data) {
          const result = await processor(word, data.p);
          results.push(result);
        }
        processed++;
      }
      
      if (onProgress) {
        onProgress(processed, total);
      }
    }
  }

  return results;
}

/**
 * Get comprehensive dictionary statistics
 */
export function getComprehensiveStats(): PhonemeStats {
  const cacheKey = 'comprehensive_stats';
  if (statsCache.has(cacheKey)) {
    return statsCache.get(cacheKey);
  }

  const stats: PhonemeStats = {
    totalWords: Object.keys(CMU_PRONUNCIATIONS).length,
    averagePhonemes: 0,
    averageSyllables: 0,
    mostCommonPhonemes: [],
    stressPatterns: [],
    syllableDistribution: {},
    lengthDistribution: {},
    complexityDistribution: {}
  };

  const phonemeCounts: Record<string, number> = {};
  const stressPatternCounts: Record<string, number> = {};
  let totalPhonemes = 0;
  let totalSyllables = 0;

  for (const [word, data] of Object.entries(CMU_PRONUNCIATIONS)) {
    const pronunciation = data.p;
    const phonemes = pronunciation.split(' ');
    const syllables = countSyllablesFromPronunciation(pronunciation);
    const complexity = determineComplexity(pronunciation);
    
    totalPhonemes += phonemes.length;
    totalSyllables += syllables;
    
    // Count distributions
    stats.syllableDistribution[syllables] = (stats.syllableDistribution[syllables] || 0) + 1;
    stats.lengthDistribution[word.length] = (stats.lengthDistribution[word.length] || 0) + 1;
    stats.complexityDistribution[complexity] = (stats.complexityDistribution[complexity] || 0) + 1;
    
    // Count individual phonemes
    for (const phoneme of phonemes) {
      const basePhoneme = phoneme.substring(0, 2);
      phonemeCounts[basePhoneme] = (phonemeCounts[basePhoneme] || 0) + 1;
    }
    
    // Count stress patterns
    const stressPattern = extractStressPattern(pronunciation);
    stressPatternCounts[stressPattern] = (stressPatternCounts[stressPattern] || 0) + 1;
  }

  stats.averagePhonemes = totalPhonemes / stats.totalWords;
  stats.averageSyllables = totalSyllables / stats.totalWords;

  // Get most common phonemes
  stats.mostCommonPhonemes = Object.entries(phonemeCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 20)
    .map(([phoneme, count]) => ({ phoneme, count }));

  // Get stress patterns
  stats.stressPatterns = Object.entries(stressPatternCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([pattern, count]) => ({ pattern, count }));

  statsCache.set(cacheKey, stats);
  return stats;
}

/**
 * Find words by multiple criteria with scoring
 */
export function findWordsByCriteria(criteria: {
  syllableCount?: number;
  minLength?: number;
  maxLength?: number;
  complexity?: 'simple' | 'moderate' | 'complex';
  containsPhonemes?: string[];
  startsWith?: string;
  endsWith?: string;
  pattern?: string;
}, options: WordSearchOptions = {}): Array<WordAnalysis & { score: number }> {
  const results: Array<WordAnalysis & { score: number }> = [];
  
  for (const [word, data] of Object.entries(CMU_PRONUNCIATIONS)) {
    const pronunciation = data.p;
    let score = 0;
    let matches = 0;
    const totalCriteria = Object.keys(criteria).length;
    
    if (criteria.syllableCount) {
      const syllables = countSyllablesFromPronunciation(pronunciation);
      if (syllables === criteria.syllableCount) {
        score += 1;
        matches++;
      }
    }
    
    if (criteria.minLength && word.length >= criteria.minLength) {
      score += 1;
      matches++;
    }
    
    if (criteria.maxLength && word.length <= criteria.maxLength) {
      score += 1;
      matches++;
    }
    
    if (criteria.complexity) {
      const complexity = determineComplexity(pronunciation);
      if (complexity === criteria.complexity) {
        score += 1;
        matches++;
      }
    }
    
    if (criteria.containsPhonemes && criteria.containsPhonemes.length > 0) {
      const phonemes = pronunciation.split(' ').map(p => p.substring(0, 2));
      const containsAll = criteria.containsPhonemes.every(p => phonemes.includes(p));
      if (containsAll) {
        score += 1;
        matches++;
      }
    }
    
    if (criteria.startsWith && word.startsWith(criteria.startsWith)) {
      score += 1;
      matches++;
    }
    
    if (criteria.endsWith && word.endsWith(criteria.endsWith)) {
      score += 1;
      matches++;
    }
    
    if (criteria.pattern) {
      const regex = new RegExp(criteria.pattern, 'i');
      if (regex.test(word)) {
        score += 1;
        matches++;
      }
    }
    
    // Only include words that match at least one criterion
    if (matches > 0) {
      const analysis: WordAnalysis & { score: number } = {
        word,
        score: score / totalCriteria
      };
      
      if (options.includePronunciation) {
        analysis.pronunciation = pronunciation;
      }
      
      if (options.includeSyllables) {
        analysis.syllables = countSyllablesFromPronunciation(pronunciation);
      }
      
      if (options.includeHyphenation) {
        analysis.hyphenated = generateHyphenationFromPronunciation(word, pronunciation);
      }
      
      if (options.includeAnalysis) {
        const phonemes = pronunciation.split(' ');
        analysis.phonemeCount = phonemes.length;
        analysis.vowelCount = countVowelsFromPronunciation(pronunciation);
        analysis.consonantCount = countConsonantsFromPronunciation(pronunciation);
        analysis.stressPattern = extractStressPattern(pronunciation);
        analysis.complexity = determineComplexity(pronunciation);
        analysis.length = word.length;
      }
      
      results.push(analysis);
    }
  }
  
  // Sort by score (highest first)
  return results.sort((a, b) => b.score - a.score);
}

/**
 * Get words by frequency analysis
 */
export function getWordsByFrequency(analysis: 'phonemes' | 'syllables' | 'length' | 'complexity'): Array<{ value: string | number; count: number; percentage: number }> {
  const stats = getComprehensiveStats();
  const total = stats.totalWords;
  
  switch (analysis) {
    case 'phonemes':
      return stats.mostCommonPhonemes.map(({ phoneme, count }) => ({
        value: phoneme,
        count,
        percentage: (count / total) * 100
      }));
    
    case 'syllables':
      return Object.entries(stats.syllableDistribution)
        .sort(([a], [b]) => parseInt(a) - parseInt(b))
        .map(([syllables, count]) => ({
          value: parseInt(syllables),
          count,
          percentage: (count / total) * 100
        }));
    
    case 'length':
      return Object.entries(stats.lengthDistribution)
        .sort(([a], [b]) => parseInt(a) - parseInt(b))
        .map(([length, count]) => ({
          value: parseInt(length),
          count,
          percentage: (count / total) * 100
        }));
    
    case 'complexity':
      return Object.entries(stats.complexityDistribution)
        .map(([complexity, count]) => ({
          value: complexity,
          count,
          percentage: (count / total) * 100
        }));
    
    default:
      return [];
  }
}

/**
 * Calculate similarity between two phoneme sequences
 */
// Helper functions moved to shared-utils.ts

/**
 * Find similar words based on pronunciation similarity
 */
export function findSimilarWords(targetWord: string, similarityThreshold: number = 0.7, options: WordSearchOptions = {}): Array<WordAnalysis & { similarity: number }> {
  const targetData = CMU_PRONUNCIATIONS[targetWord.toLowerCase()];
    const targetPronunciation = targetData ? targetData.p : '';
  if (!targetPronunciation) return [];
  
  const targetPhonemes = targetPronunciation.split(' ');
  const results: Array<WordAnalysis & { similarity: number }> = [];
  
  for (const [word, data] of Object.entries(CMU_PRONUNCIATIONS)) {
    const pronunciation = data.p;
    if (word === targetWord.toLowerCase()) continue;
    
    const phonemes = pronunciation.split(' ');
    const similarity = calculatePhonemeSimilarity(targetPhonemes, phonemes);
    
    if (similarity >= similarityThreshold) {
      const analysis: WordAnalysis & { similarity: number } = {
        word,
        similarity
      };
      
      if (options.includePronunciation) {
        analysis.pronunciation = pronunciation;
      }
      
      if (options.includeSyllables) {
        analysis.syllables = countSyllablesFromPronunciation(pronunciation);
      }
      
      if (options.includeHyphenation) {
        analysis.hyphenated = generateHyphenationFromPronunciation(word, pronunciation);
      }
      
      results.push(analysis);
    }
  }
  
  return results.sort((a, b) => b.similarity - a.similarity);
}

/**
 * Get word clusters by common patterns
 */
export function getWordClusters(clusterType: 'syllable' | 'length' | 'complexity' | 'stress'): Record<string, string[]> {
  const clusters: Record<string, string[]> = {};
  
  for (const [word, data] of Object.entries(CMU_PRONUNCIATIONS)) {
    const pronunciation = data.p;
    let key: string;
    
    switch (clusterType) {
      case 'syllable':
        key = countSyllablesFromPronunciation(pronunciation).toString();
        break;
      case 'length':
        key = word.length.toString();
        break;
      case 'complexity':
        key = determineComplexity(pronunciation);
        break;
      case 'stress':
        key = extractStressPattern(pronunciation);
        break;
      default:
        continue;
    }
    
    if (!clusters[key]) {
      clusters[key] = [];
    }
    clusters[key].push(word);
  }
  
  return clusters;
}

/**
 * Export dictionary data in various formats
 */
export function exportDictionaryData(format: 'json' | 'csv' | 'tsv', options: WordSearchOptions = {}): string {
  const words = Object.entries(CMU_PRONUNCIATIONS).map(([word, data]) => ({ word, pronunciation: data.p }));
  const { includePronunciation = true, includeSyllables = true, includeHyphenation = true, includeAnalysis = true } = options;
  
  switch (format) {
    case 'json':
      return JSON.stringify(words.map(({ word, pronunciation }) => {
        const data: any = { word };
        if (includePronunciation) data.pronunciation = pronunciation;
        if (includeSyllables) data.syllables = countSyllablesFromPronunciation(pronunciation);
        if (includeHyphenation) data.hyphenated = generateHyphenationFromPronunciation(word, pronunciation);
        if (includeAnalysis) {
          const phonemes = pronunciation.split(' ');
          data.phonemeCount = phonemes.length;
          data.vowelCount = countVowelsFromPronunciation(pronunciation);
          data.consonantCount = countConsonantsFromPronunciation(pronunciation);
          data.stressPattern = extractStressPattern(pronunciation);
          data.complexity = determineComplexity(pronunciation);
          data.length = word.length;
        }
        return data;
      }), null, 2);
    
    case 'csv':
    case 'tsv':
      const delimiter = format === 'csv' ? ',' : '\t';
      const headers = ['word'];
      if (includePronunciation) headers.push('pronunciation');
      if (includeSyllables) headers.push('syllables');
      if (includeHyphenation) headers.push('hyphenated');
      if (includeAnalysis) {
        headers.push('phonemeCount', 'vowelCount', 'consonantCount', 'stressPattern', 'complexity', 'length');
      }
      
      const rows = [headers.join(delimiter)];
      
      for (const { word, pronunciation } of words) {
        const row = [word];
        if (includePronunciation) row.push(pronunciation);
        if (includeSyllables) row.push(countSyllablesFromPronunciation(pronunciation).toString());
        if (includeHyphenation) row.push(generateHyphenationFromPronunciation(word, pronunciation));
        if (includeAnalysis) {
          const phonemes = pronunciation.split(' ');
          row.push(
            phonemes.length.toString(),
            countVowelsFromPronunciation(pronunciation).toString(),
            countConsonantsFromPronunciation(pronunciation).toString(),
            extractStressPattern(pronunciation),
            determineComplexity(pronunciation),
            word.length.toString()
          );
        }
        rows.push(row.join(delimiter));
      }
      
      return rows.join('\n');
    
    default:
      return '';
  }
}

/**
 * Search for words by pattern matching
 */
export function searchWords(pattern: string, options: WordSearchOptions = {}): WordAnalysis[] {
  const { limit = 50, includePronunciation = true, includeSyllables = true, includeHyphenation = true } = options;
  const results: WordAnalysis[] = [];
  
  // Convert pattern to regex (support wildcards)
  const regexPattern = pattern
    .replace(/\*/g, '.*')  // * -> .*
    .replace(/\?/g, '.')   // ? -> .
    .toLowerCase();
  
  const regex = new RegExp(`^${regexPattern}$`);
  
  for (const [word, data] of Object.entries(CMU_PRONUNCIATIONS)) {
    const pronunciation = data.p;
    if (regex.test(word)) {
      const analysis: WordAnalysis = { word };
      
      if (includePronunciation) {
        analysis.pronunciation = pronunciation;
      }
      
      if (includeSyllables) {
        analysis.syllables = countSyllablesFromPronunciation(pronunciation);
      }
      
      if (includeHyphenation) {
        analysis.hyphenated = generateHyphenationFromPronunciation(word, pronunciation);
      }
      
      results.push(analysis);
      
      if (results.length >= limit) break;
    }
  }
  
  return results;
}

/**
 * Find words with specific syllable count
 */
export function findWordsBySyllableCount(syllableCount: number, options: WordSearchOptions = {}): WordAnalysis[] {
  const { limit = 50, includePronunciation = true, includeHyphenation = true } = options;
  const results: WordAnalysis[] = [];
  
  for (const [word, data] of Object.entries(CMU_PRONUNCIATIONS)) {
    const pronunciation = data.p;
    const syllables = countSyllablesFromPronunciation(pronunciation);
    
    if (syllables === syllableCount) {
      const analysis: WordAnalysis = { 
        word, 
        syllables,
        phonemeCount: pronunciation.split(' ').length,
        vowelCount: countVowelsFromPronunciation(pronunciation),
        consonantCount: countConsonantsFromPronunciation(pronunciation),
        stressPattern: extractStressPattern(pronunciation),
        complexity: determineComplexity(pronunciation)
      };
      
      if (includePronunciation) {
        analysis.pronunciation = pronunciation;
      }
      
      if (includeHyphenation) {
        analysis.hyphenated = generateHyphenationFromPronunciation(word, pronunciation);
      }
      
      results.push(analysis);
      
      if (results.length >= limit) break;
    }
  }
  
  return results;
}

/**
 * Find words with specific phoneme patterns
 */
export function findWordsByPhonemePattern(pattern: string, options: WordSearchOptions = {}): WordAnalysis[] {
  const { limit = 50, includePronunciation = true, includeSyllables = true } = options;
  const results: WordAnalysis[] = [];
  
  // Convert pattern to regex (e.g., "B.*T" finds words starting with B and ending with T)
  const regexPattern = pattern
    .replace(/\*/g, '.*')
    .replace(/\?/g, '.')
    .toUpperCase();
  
  const regex = new RegExp(`^${regexPattern}$`);
  
  for (const [word, data] of Object.entries(CMU_PRONUNCIATIONS)) {
    const pronunciation = data.p;
    if (regex.test(pronunciation)) {
      const analysis: WordAnalysis = { 
        word, 
        pronunciation,
        syllables: countSyllablesFromPronunciation(pronunciation),
        phonemeCount: pronunciation.split(' ').length
      };
      
      results.push(analysis);
      
      if (results.length >= limit) break;
    }
  }
  
  return results;
}

/**
 * Find rhyming words
 */
export function findRhymingWords(targetWord: string, options: WordSearchOptions = {}): WordAnalysis[] {
  const { limit = 50, includePronunciation = true, includeSyllables = true } = options;
  const results: WordAnalysis[] = [];
  
  const targetData = CMU_PRONUNCIATIONS[targetWord.toLowerCase()];
    const targetPronunciation = targetData ? targetData.p : '';
  if (!targetPronunciation) return results;
  
  const targetPhonemes = targetPronunciation.split(' ');
  const targetAnalysis = analyzePhonemes(targetPronunciation);
  const targetVowels = targetAnalysis.basePhonemes.filter(p => targetAnalysis.uniquePhonemes.has(p));
  
  if (targetVowels.length === 0) return results;
  
  const lastVowel = targetVowels[targetVowels.length - 1];
  const lastVowelIndex = targetPhonemes.lastIndexOf(lastVowel);
  const rhymingSuffix = targetPhonemes.slice(lastVowelIndex).join(' ');
  
  for (const [word, data] of Object.entries(CMU_PRONUNCIATIONS)) {
    const pronunciation = data.p;
    if (word === targetWord.toLowerCase()) continue;
    
    const phonemes = pronunciation.split(' ');
    const analysis = analyzePhonemes(pronunciation);
    const vowels = analysis.basePhonemes.filter(p => analysis.uniquePhonemes.has(p));
    
    if (vowels.length === 0) continue;
    
    const lastVowelIndex2 = phonemes.lastIndexOf(vowels[vowels.length - 1]);
    const wordSuffix = phonemes.slice(lastVowelIndex2).join(' ');
    
    if (wordSuffix === rhymingSuffix) {
      const analysis: WordAnalysis = { 
        word, 
        pronunciation,
        syllables: countSyllablesFromPronunciation(pronunciation)
      };
      
      results.push(analysis);
      
      if (results.length >= limit) break;
    }
  }
  
  return results;
}

/**
 * Find words with specific stress patterns
 */
export function findWordsByStressPattern(pattern: string, options: WordSearchOptions = {}): WordAnalysis[] {
  const { limit = 50, includePronunciation = true, includeSyllables = true } = options;
  const results: WordAnalysis[] = [];
  
  for (const [word, data] of Object.entries(CMU_PRONUNCIATIONS)) {
    const pronunciation = data.p;
    const stressPattern = extractStressPattern(pronunciation);
    
    if (stressPattern === pattern) {
      const analysis: WordAnalysis = { 
        word, 
        pronunciation,
        syllables: countSyllablesFromPronunciation(pronunciation),
        stressPattern
      };
      
      results.push(analysis);
      
      if (results.length >= limit) break;
    }
  }
  
  return results;
}

/**
 * Get statistics about the dictionary
 */
export function getDictionaryStats(): PhonemeStats {
  const stats: PhonemeStats = {
    totalWords: Object.keys(CMU_PRONUNCIATIONS).length,
    averagePhonemes: 0,
    averageSyllables: 0,
    mostCommonPhonemes: [],
    stressPatterns: [],
    syllableDistribution: {},
    lengthDistribution: {},
    complexityDistribution: {}
  };
  
  const phonemeCounts: Record<string, number> = {};
  const stressPatternCounts: Record<string, number> = {};
  let totalPhonemes = 0;
  let totalSyllables = 0;
  
  for (const [word, data] of Object.entries(CMU_PRONUNCIATIONS)) {
    const pronunciation = data.p;
    const phonemes = pronunciation.split(' ');
    const syllables = countSyllablesFromPronunciation(pronunciation);
    const complexity = determineComplexity(pronunciation);
    
    totalPhonemes += phonemes.length;
    totalSyllables += syllables;
    
    // Count distributions
    stats.syllableDistribution[syllables] = (stats.syllableDistribution[syllables] || 0) + 1;
    stats.lengthDistribution[word.length] = (stats.lengthDistribution[word.length] || 0) + 1;
    stats.complexityDistribution[complexity] = (stats.complexityDistribution[complexity] || 0) + 1;
    
    // Count individual phonemes
    for (const phoneme of phonemes) {
      const basePhoneme = phoneme.substring(0, 2);
      phonemeCounts[basePhoneme] = (phonemeCounts[basePhoneme] || 0) + 1;
    }
    
    // Count stress patterns
    const stressPattern = extractStressPattern(pronunciation);
    stressPatternCounts[stressPattern] = (stressPatternCounts[stressPattern] || 0) + 1;
  }
  
  stats.averagePhonemes = totalPhonemes / stats.totalWords;
  stats.averageSyllables = totalSyllables / stats.totalWords;
  
  // Get most common phonemes
  stats.mostCommonPhonemes = Object.entries(phonemeCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 20)
    .map(([phoneme, count]) => ({ phoneme, count }));
  
  // Get stress patterns
  stats.stressPatterns = Object.entries(stressPatternCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([pattern, count]) => ({ pattern, count }));
  
  return stats;
}

/**
 * Find words by complexity level
 */
export function findWordsByComplexity(complexity: 'simple' | 'moderate' | 'complex', options: WordSearchOptions = {}): WordAnalysis[] {
  const { limit = 50, includePronunciation = true, includeSyllables = true } = options;
  const results: WordAnalysis[] = [];
  
  for (const [word, data] of Object.entries(CMU_PRONUNCIATIONS)) {
    const pronunciation = data.p;
    const wordComplexity = determineComplexity(pronunciation);
    
    if (wordComplexity === complexity) {
      const analysis: WordAnalysis = { 
        word, 
        pronunciation,
        syllables: countSyllablesFromPronunciation(pronunciation),
        complexity: wordComplexity,
        phonemeCount: pronunciation.split(' ').length
      };
      
      results.push(analysis);
      
      if (results.length >= limit) break;
    }
  }
  
  return results;
}

/**
 * Find words with specific vowel count
 */
export function findWordsByVowelCount(vowelCount: number, options: WordSearchOptions = {}): WordAnalysis[] {
  const { limit = 50, includePronunciation = true, includeSyllables = true } = options;
  const results: WordAnalysis[] = [];
  
  for (const [word, data] of Object.entries(CMU_PRONUNCIATIONS)) {
    const pronunciation = data.p;
    const vowels = countVowelsFromPronunciation(pronunciation);
    
    if (vowels === vowelCount) {
      const analysis: WordAnalysis = { 
        word, 
        pronunciation,
        syllables: countSyllablesFromPronunciation(pronunciation),
        vowelCount: vowels,
        consonantCount: countConsonantsFromPronunciation(pronunciation)
      };
      
      results.push(analysis);
      
      if (results.length >= limit) break;
    }
  }
  
  return results;
}

// Helper functions moved to shared-utils.ts

/**
 * Get random words from the dictionary
 */
export function getRandomWords(count: number = 10, options: WordSearchOptions = {}): WordAnalysis[] {
  const { includePronunciation = true, includeSyllables = true, includeHyphenation = true } = options;
  
  // Use cached words array and Fisher-Yates shuffle for better performance
  const selectedWords = getRandomWordsFromArray(ALL_WORDS, count);
  
  return selectedWords.map(word => {
    const data = CMU_PRONUNCIATIONS[word];
    const pronunciation = data ? data.p : '';
    const analysis: WordAnalysis = { word };
    
    if (includePronunciation) {
      analysis.pronunciation = pronunciation;
    }
    
    if (includeSyllables) {
      analysis.syllables = countSyllablesFromPronunciation(pronunciation);
    }
    
    if (includeHyphenation) {
      analysis.hyphenated = generateHyphenationFromPronunciation(word, pronunciation);
    }
    
    return analysis;
  });
}

/**
 * Get random words with optional uniqueness tracking using a key
 */
export async function getRandomWordsWithKey(
  count: number = 10,
  options: WordSearchOptions & {
    /** Optional key for uniqueness tracking. If provided, words won't repeat for this key */
    uniquenessKey?: string;
    /** Maximum number of words to remember per key (default: 100) */
    maxCacheSize?: number;
  } = {}
): Promise<WordAnalysis[]> {
  const { 
    includePronunciation = true, 
    includeSyllables = true, 
    includeHyphenation = true,
    uniquenessKey,
    maxCacheSize = 100
  } = options;

  let availableWords = ALL_WORDS;

  // If uniqueness key is provided, filter out used words
  if (uniquenessKey) {
    availableWords = ALL_WORDS.filter(word => !hasWordBeenUsed(word, uniquenessKey));

    // If not enough words available, return what we have
    if (availableWords.length < count) {
      availableWords = ALL_WORDS; // Reset to all words
    }

    // Get random words
    const selectedWords = getRandomWordsFromArray(availableWords, count);

    // Add selected words to cache
    addWordsToCache(selectedWords, uniquenessKey, maxCacheSize);

    // Return word analysis
    return selectedWords.map(word => {
      const data = CMU_PRONUNCIATIONS[word];
    const pronunciation = data ? data.p : '';
      const analysis: WordAnalysis = { word };
      
      if (includePronunciation) {
        analysis.pronunciation = pronunciation;
      }
      
      if (includeSyllables) {
        analysis.syllables = countSyllablesFromPronunciation(pronunciation);
      }
      
      if (includeHyphenation) {
        analysis.hyphenated = generateHyphenationFromPronunciation(word, pronunciation);
      }
      
      return analysis;
    });
  }

  // Get random words (no cache)
  const selectedWords = getRandomWordsFromArray(availableWords, count);

  return selectedWords.map(word => {
    const data = CMU_PRONUNCIATIONS[word];
    const pronunciation = data ? data.p : '';
    const analysis: WordAnalysis = { word };
    
    if (includePronunciation) {
      analysis.pronunciation = pronunciation;
    }
    
    if (includeSyllables) {
      analysis.syllables = countSyllablesFromPronunciation(pronunciation);
    }
    
    if (includeHyphenation) {
      analysis.hyphenated = generateHyphenationFromPronunciation(word, pronunciation);
    }
    
    return analysis;
  });
}

/**
 * Get random words from array using Fisher-Yates shuffle
 */
function getRandomWordsFromArray(words: string[], count: number): string[] {
  if (count >= words.length) {
    return [...words];
  }

  const shuffled = [...words];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, count);
}

/**
 * Check if a word exists in the CMU dictionary
 */
export function isWordInDictionary(word: string): boolean {
  return word.toLowerCase() in CMU_PRONUNCIATIONS;
}

/**
 * Get all words in the dictionary
 */
export function getAllWords(): string[] {
  return Object.keys(CMU_PRONUNCIATIONS);
}

/**
 * Get total word count in dictionary
 */
export function getDictionarySize(): number {
  return Object.keys(CMU_PRONUNCIATIONS).length;
}
