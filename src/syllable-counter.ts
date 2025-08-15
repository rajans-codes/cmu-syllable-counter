import { cmuDictionary } from './dictionary';
import { fallbackSyllableCount } from './fallback';
import { enhancedHyphenation } from './hyphenation';
import { enhancedCMUHyphenation } from './cmu-hyphenation';
import type { SyllableInfo, SyllableCountOptions, HyphenationOptions } from './types';

/**
 * Main syllable counter that provides comprehensive syllable analysis
 * Uses CMU Dictionary with intelligent fallback algorithms
 */
export class SyllableCounter {
  private cache: Map<string, SyllableInfo> = new Map();
  private maxCacheSize = 1000;
  private useCache = true;

  constructor(options?: SyllableCountOptions) {
    if (options?.enableCache === false) {
      this.useCache = false;
    }
    if (options?.maxCacheSize) {
      this.maxCacheSize = options.maxCacheSize;
    }
  }

  /**
   * Get detailed syllable information for a word
   */
  async getSyllableInfo(
    word: string, 
    options: SyllableCountOptions & HyphenationOptions = {}
  ): Promise<SyllableInfo> {
    if (!word || word.length === 0) {
      return {
        word: word,
        syllables: 0,
        hyphenated: word,
        source: 'fallback',
        syllableBoundaries: []
      };
    }

    const normalizedWord = word.trim();
    
    // Check cache first
    if (this.useCache && this.cache.has(normalizedWord)) {
      return this.cache.get(normalizedWord)!;
    }

    // Try CMU Dictionary first
    const pronunciation = await cmuDictionary.lookup(normalizedWord);
    if (pronunciation) {
      const syllableCount = await cmuDictionary.getSyllableCount(normalizedWord);
      
      // Try CMU-based hyphenation first
      const cmuHyphenationResult = enhancedCMUHyphenation(normalizedWord, pronunciation);
      let hyphenated: string;
      let boundaries: number[];
      
      if (cmuHyphenationResult) {
        hyphenated = cmuHyphenationResult.hyphenated;
        boundaries = cmuHyphenationResult.boundaries;
      } else {
        // Fall back to vowel-based hyphenation
        const fallbackResult = enhancedHyphenation(normalizedWord, options);
        hyphenated = fallbackResult.hyphenated;
        boundaries = fallbackResult.boundaries;
      }
      
      const info: SyllableInfo = {
        word: normalizedWord,
        syllables: syllableCount,
        hyphenated,
        source: 'cmu',
        pronunciation,
        syllableBoundaries: options.includeBoundaries ? boundaries : undefined
      };
      
      this.cacheResult(normalizedWord, info);
      return info;
    }

    // Use fallback if enabled
    if (options?.useFallback !== false) {
      const fallbackCount = options?.fallbackCounter 
        ? options.fallbackCounter(normalizedWord)
        : fallbackSyllableCount(normalizedWord);
      
      const { hyphenated, boundaries } = enhancedHyphenation(normalizedWord, options);
      
      const info: SyllableInfo = {
        word: normalizedWord,
        syllables: fallbackCount,
        hyphenated,
        source: 'fallback',
        syllableBoundaries: options.includeBoundaries ? boundaries : undefined
      };
      
      this.cacheResult(normalizedWord, info);
      return info;
    }

    // Return empty info if no fallback
    return {
      word: normalizedWord,
      syllables: 0,
      hyphenated: normalizedWord,
      source: 'fallback',
      syllableBoundaries: []
    };
  }

  /**
   * Get syllable information for multiple words
   */
  async getTextSyllableInfo(
    text: string, 
    options: SyllableCountOptions & HyphenationOptions = {}
  ): Promise<SyllableInfo[]> {
    if (!text || text.length === 0) return [];

    const words = this.textToWords(text);
    const results: SyllableInfo[] = [];

    for (const word of words) {
      const info = await this.getSyllableInfo(word, options);
      results.push(info);
    }

    return results;
  }

  /**
   * Get summary statistics for text
   */
  async getTextSummary(
    text: string, 
    options: SyllableCountOptions & HyphenationOptions = {}
  ): Promise<{
    totalSyllables: number;
    totalWords: number;
    cmuWords: number;
    fallbackWords: number;
    averageSyllablesPerWord: number;
    wordDetails: SyllableInfo[];
  }> {
    const wordDetails = await this.getTextSyllableInfo(text, options);
    
    const totalSyllables = wordDetails.reduce((sum, info) => sum + info.syllables, 0);
    const totalWords = wordDetails.length;
    const cmuWords = wordDetails.filter(info => info.source === 'cmu').length;
    const fallbackWords = wordDetails.filter(info => info.source === 'fallback').length;
    const averageSyllablesPerWord = totalWords > 0 ? totalSyllables / totalWords : 0;

    return {
      totalSyllables,
      totalWords,
      cmuWords,
      fallbackWords,
      averageSyllablesPerWord,
      wordDetails
    };
  }

  /**
   * Hyphenate a word with syllable information
   */
  async hyphenateWord(
    word: string, 
    options: HyphenationOptions = {}
  ): Promise<{
    word: string;
    hyphenated: string;
    syllables: number;
    source: 'cmu' | 'fallback';
    boundaries: number[];
  }> {
    const info = await this.getSyllableInfo(word, { ...options, includeBoundaries: true });
    
    return {
      word: info.word,
      hyphenated: info.hyphenated,
      syllables: info.syllables,
      source: info.source,
      boundaries: info.syllableBoundaries || []
    };
  }

  /**
   * Get pronunciation for a word
   */
  async getPronunciation(word: string): Promise<string | null> {
    return await cmuDictionary.lookup(word);
  }

  /**
   * Check if a word is in the CMU dictionary
   */
  async isInDictionary(word: string): Promise<boolean> {
    return await cmuDictionary.hasWord(word);
  }



  /**
   * Clear the cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; maxSize: number } {
    return {
      size: this.cache.size,
      maxSize: this.maxCacheSize
    };
  }

  /**
   * Convert text to words for processing
   */
  private textToWords(text: string): string[] {
    // Match words including contractions and possessives
    const wordRegex = /\b[\w']+\b/g;
    const matches = text.match(wordRegex);
    return matches || [];
  }

  /**
   * Cache a result with LRU eviction
   */
  private cacheResult(word: string, info: SyllableInfo): void {
    if (!this.useCache) return;

    // Implement LRU cache
    if (this.cache.size >= this.maxCacheSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }
    
    this.cache.set(word, info);
  }
}

// Export singleton instance
export const syllableCounter = new SyllableCounter();
