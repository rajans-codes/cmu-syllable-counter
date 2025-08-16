import { cmuDictionary } from './dictionary';
import { enhancedFallbackSyllableCount } from './fallback-syllable-count';
import { enhancedHyphenateWord, getSyllableBoundaries } from './fallback-hyphenation';
import { enhancedCMUHyphenation } from './cmu-hyphenation';
import type { SyllableInfo, SyllableCountOptions, HyphenationOptions } from './types';

/**
 * Main syllable counter that provides comprehensive syllable analysis
 * Uses CMU Dictionary with intelligent fallback algorithms
 */
export class SyllableCounter {
  private cache: Map<string, SyllableInfo> = new Map();
  private maxCacheSize = 1000;

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
    if (this.cache.has(normalizedWord)) {
      return this.cache.get(normalizedWord)!;
    }

    // Try CMU Dictionary first
    const pronunciation = await cmuDictionary.getPronunciation(normalizedWord);
    if (pronunciation) {
      const syllableCount = await cmuDictionary.getSyllableCount(normalizedWord);
      
      // Try CMU-based hyphenation first
      const cmuHyphenationResult = enhancedCMUHyphenation(normalizedWord, pronunciation, options);
      let hyphenated: string;
      let boundaries: number[];
      
      if (cmuHyphenationResult) {
        hyphenated = cmuHyphenationResult.hyphenated;
        boundaries = cmuHyphenationResult.boundaries;
      } else {
        // Fall back to pattern-based hyphenation
        hyphenated = enhancedHyphenateWord(normalizedWord, options);
        boundaries = getSyllableBoundaries(normalizedWord);
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

    // Use fallback when CMU dictionary doesn't have the word
    const fallbackCount = enhancedFallbackSyllableCount(normalizedWord);
    
    const hyphenated = enhancedHyphenateWord(normalizedWord, options);
    const boundaries = getSyllableBoundaries(normalizedWord);
    
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
