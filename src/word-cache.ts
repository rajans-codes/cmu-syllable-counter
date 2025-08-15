/**
 * Simple key-based cache for random word uniqueness
 * This provides a lightweight way to avoid repeating random words without session management
 */

import {
  countSyllablesFromPronunciation,
  countVowelsFromPronunciation,
  countConsonantsFromPronunciation,
  extractStressPattern,
  determineComplexity,
  generateHyphenationFromPronunciation
} from './shared-utils';
import { CMU_PRONUNCIATIONS } from './dictionary-data';

// In-memory cache for tracking used words per key
const wordCache = new Map<string, Set<string>>();

// Cache for pronunciation analysis to avoid recalculation
const pronunciationCache = new Map<string, {
  syllables: number;
  vowels: number;
  consonants: number;
  stressPattern: string;
  complexity: 'simple' | 'moderate' | 'complex';
}>();

// Cache cleanup interval (5 minutes)
const CACHE_CLEANUP_INTERVAL = 5 * 60 * 1000;

// Maximum cache size per key to prevent memory leaks
const MAX_CACHE_SIZE_PER_KEY = 1000;

/**
 * Get random words with optional uniqueness tracking
 */
export function getRandomWordsWithCache(
  count: number = 10,
  options: {
    /** Optional key for uniqueness tracking. If provided, words won't repeat for this key */
    uniquenessKey?: string;
    /** Maximum number of words to remember per key (default: 100) */
    maxCacheSize?: number;
    /** Whether to include pronunciation data */
    includePronunciation?: boolean;
    /** Whether to include syllable count */
    includeSyllables?: boolean;
    /** Whether to include hyphenation */
    includeHyphenation?: boolean;
    /** Whether to include detailed analysis */
    includeAnalysis?: boolean;
  } = {}
): Array<{
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
}> {
  const {
    uniquenessKey,
    maxCacheSize = 100,
    includePronunciation = true,
    includeSyllables = true,
    includeHyphenation = true,
    includeAnalysis = true
  } = options;

  const allWords = Object.keys(CMU_PRONUNCIATIONS);
  let availableWords = allWords;

  // If uniqueness key is provided, filter out used words
  if (uniquenessKey) {
    const usedWords = wordCache.get(uniquenessKey) || new Set();
    availableWords = allWords.filter(word => !usedWords.has(word));

    // If not enough words available, clear cache for this key and start fresh
    if (availableWords.length < count) {
      wordCache.delete(uniquenessKey);
      availableWords = allWords;
    }
  }

  // Get random words
  const selectedWords = getRandomWordsFromArray(availableWords, count);

  // Add selected words to cache if uniqueness key is provided
  if (uniquenessKey) {
    // Initialize cleanup on first cache usage
    initializeCleanup();
    
    let usedWords = wordCache.get(uniquenessKey);
    if (!usedWords) {
      usedWords = new Set();
      wordCache.set(uniquenessKey, usedWords);
    }

    selectedWords.forEach(word => usedWords!.add(word));

    // Trim cache if it exceeds max size (more efficient)
    if (usedWords.size > maxCacheSize) {
      const wordsArray = Array.from(usedWords);
      const trimmedWords = wordsArray.slice(-maxCacheSize);
      usedWords.clear();
      trimmedWords.forEach(word => usedWords.add(word));
    }
  }

  // Return word analysis
  return selectedWords.map(word => {
    const data = CMU_PRONUNCIATIONS[word];
    const pronunciation = data ? data.p : '';
    const analysis: any = { word };

    if (includePronunciation) {
      analysis.pronunciation = pronunciation;
    }

    if (includeSyllables) {
      analysis.syllables = countSyllablesFromPronunciation(pronunciation);
    }

    if (includeHyphenation) {
      analysis.hyphenated = generateHyphenationFromPronunciation(word, pronunciation);
    }

    if (includeAnalysis) {
      analysis.phonemeCount = pronunciation.split(' ').length;
      analysis.vowelCount = countVowelsFromPronunciation(pronunciation);
      analysis.consonantCount = countConsonantsFromPronunciation(pronunciation);
      analysis.stressPattern = extractStressPattern(pronunciation);
      analysis.complexity = determineComplexity(pronunciation);
      analysis.length = word.length;
      analysis.uniquePhonemes = [...new Set(pronunciation.split(' '))];
      analysis.phonemeDiversity = analysis.uniquePhonemes.length / analysis.phonemeCount;
    }

    return analysis;
  });
}

/**
 * Check if a word has been used for a specific key
 */
export function hasWordBeenUsed(word: string, uniquenessKey: string): boolean {
  const usedWords = wordCache.get(uniquenessKey);
  return usedWords ? usedWords.has(word) : false;
}

/**
 * Get cache statistics for a key
 */
export function getCacheStats(uniquenessKey: string): {
  usedWordsCount: number;
  maxCacheSize: number;
} | null {
  const usedWords = wordCache.get(uniquenessKey);
  if (!usedWords) return null;

  return {
    usedWordsCount: usedWords.size,
    maxCacheSize: MAX_CACHE_SIZE_PER_KEY
  };
}

/**
 * Clear cache for a specific key
 */
export function clearCache(uniquenessKey: string): void {
  wordCache.delete(uniquenessKey);
}

/**
 * Clear all caches
 */
export function clearAllCaches(): void {
  wordCache.clear();
}

/**
 * Get all cache keys
 */
export function getCacheKeys(): string[] {
  return Array.from(wordCache.keys());
}

/**
 * Get cache size for a key
 */
export function getCacheSize(uniquenessKey: string): number {
  const usedWords = wordCache.get(uniquenessKey);
  return usedWords ? usedWords.size : 0;
}

/**
 * Add words to cache for a specific key
 */
export function addWordsToCache(words: string[], uniquenessKey: string, maxCacheSize: number = 100): void {
  // Initialize cleanup on first cache usage
  initializeCleanup();
  
  let usedWords = wordCache.get(uniquenessKey);
  if (!usedWords) {
    usedWords = new Set();
    wordCache.set(uniquenessKey, usedWords);
  }

  words.forEach(word => usedWords!.add(word));

  // Trim cache if it exceeds max size (more efficient)
  if (usedWords.size > maxCacheSize) {
    const wordsArray = Array.from(usedWords);
    const trimmedWords = wordsArray.slice(-maxCacheSize);
    usedWords.clear();
    trimmedWords.forEach(word => usedWords.add(word));
  }
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

// Helper functions moved to shared-utils.ts

// Set up periodic cache cleanup to prevent memory leaks (lazy initialization)
let cleanupInterval: NodeJS.Timeout | null = null;
let cleanupInitialized = false;

function initializeCleanup() {
  if (cleanupInitialized || typeof setInterval === 'undefined') return;
  
  cleanupInterval = setInterval(() => {
    // Clean up keys that haven't been used recently
    // This is a simple cleanup - in practice, the cache is small and self-limiting
    if (wordCache.size > 100) {
      const keys = Array.from(wordCache.keys());
      // Keep only the most recent 50 keys
      keys.slice(0, -50).forEach(key => wordCache.delete(key));
    }
  }, CACHE_CLEANUP_INTERVAL);
  
  cleanupInitialized = true;
}

// Export function to stop cleanup interval (for testing)
export function stopCacheCleanup(): void {
  if (cleanupInterval) {
    clearInterval(cleanupInterval);
    cleanupInterval = null;
  }
}
