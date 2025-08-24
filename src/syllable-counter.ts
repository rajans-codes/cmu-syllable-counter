import { cmuDictionary } from "./dictionary";
import { enhancedFallbackSyllableCount } from "./fallback-syllable-count";
import {
  enhancedHyphenateWord,
  getSyllableBoundaries,
} from "./fallback-hyphenation";
import { enhancedCMUHyphenation } from "./cmu-hyphenation";
import type {
  SyllableInfo,
  SyllableCountOptions,
  HyphenationOptions,
} from "./types";

// Pre-compiled regex for better performance
const WORD_REGEX = /\b[\w']+\b/g;

// Cache entry with timestamp for true LRU
interface CacheEntry {
  info: SyllableInfo;
  timestamp: number;
}

/**
 * Main syllable counter that provides comprehensive syllable analysis
 * Uses CMU Dictionary with intelligent fallback algorithms
 */
export class SyllableCounter {
  private cache: Map<string, CacheEntry> = new Map();
  private maxCacheSize: number;
  private readonly DEFAULT_CACHE_SIZE = 1000;

  constructor(maxCacheSize: number = 1000) {
    this.maxCacheSize = maxCacheSize;
  }

  /**
   * Get detailed syllable information for a word
   */
  async getSyllableInfo(
    word: string,
    options: SyllableCountOptions & HyphenationOptions = {}
  ): Promise<SyllableInfo> {
    // Early return for empty input
    if (!word?.trim()) {
      return this.createEmptySyllableInfo(word || "");
    }

    const normalizedWord = word.trim();

    // Check cache first
    const cached = this.getFromCache(normalizedWord);
    if (cached) {
      return cached;
    }

    // Process the word
    const info = await this.processWord(normalizedWord, options);
    
    // Cache the result
    this.cacheResult(normalizedWord, info);
    
    return info;
  }

  /**
   * Process a word through CMU dictionary or fallback
   */
  private async processWord(
    word: string, 
    options: SyllableCountOptions & HyphenationOptions
  ): Promise<SyllableInfo> {
    // Check for hyphenated version first
    const hyphenated = await cmuDictionary.getHyphenated(word);
    
    if (hyphenated) {
      // Return the hyphenated version directly
      return {
        word,
        syllables: await cmuDictionary.getSyllableCount(word),
        hyphenated,
        source: "cmu",
        pronunciation: await cmuDictionary.getPronunciation(word) || undefined,
        syllableBoundaries: options.includeBoundaries ? this.getSyllableBoundariesFromHyphenated(hyphenated) : undefined,
      };
    }
    
    // Try CMU Dictionary for pronunciation
    const pronunciation = await cmuDictionary.getPronunciation(word);
    
    if (pronunciation) {
      return this.processWithCMU(word, pronunciation, options);
    }
    
    // Use fallback algorithm
    return this.processWithFallback(word, options);
  }

  /**
   * Process word using CMU dictionary data
   */
  private async processWithCMU(
    word: string,
    pronunciation: string,
    options: SyllableCountOptions & HyphenationOptions
  ): Promise<SyllableInfo> {
    const syllableCount = await cmuDictionary.getSyllableCount(word);
    
    // Try CMU-based hyphenation first
    const cmuHyphenationResult = enhancedCMUHyphenation(word, pronunciation, options);
    
    let hyphenated: string;
    let boundaries: number[];

    if (cmuHyphenationResult) {
      hyphenated = cmuHyphenationResult.hyphenated;
      boundaries = cmuHyphenationResult.boundaries;
    } else {
      // Fall back to pattern-based hyphenation
      hyphenated = enhancedHyphenateWord(word, options);
      boundaries = getSyllableBoundaries(word);
    }

    return {
      word,
      syllables: syllableCount,
      hyphenated,
      source: "cmu",
      pronunciation,
      syllableBoundaries: options.includeBoundaries ? boundaries : undefined,
    };
  }

  /**
   * Process word using fallback algorithm
   */
  private processWithFallback(
    word: string,
    options: SyllableCountOptions & HyphenationOptions
  ): SyllableInfo {
    const fallbackCount = enhancedFallbackSyllableCount(word);
    const hyphenated = enhancedHyphenateWord(word, options);
    const boundaries = getSyllableBoundaries(word);

    return {
      word,
      syllables: fallbackCount,
      hyphenated,
      source: "fallback",
      syllableBoundaries: options.includeBoundaries ? boundaries : undefined,
    };
  }

  /**
   * Create empty syllable info for invalid input
   */
  private createEmptySyllableInfo(word: string): SyllableInfo {
    return {
      word,
      syllables: 0,
      hyphenated: word,
      source: "fallback",
      syllableBoundaries: [],
    };
  }

  /**
   * Get syllable boundaries from a hyphenated string
   */
  private getSyllableBoundariesFromHyphenated(hyphenated: string): number[] {
    const boundaries: number[] = [];
    let currentPos = 0;
    
    for (let i = 0; i < hyphenated.length; i++) {
      if (hyphenated[i] === '-') {
        boundaries.push(currentPos);
      } else {
        currentPos++;
      }
    }
    
    return boundaries;
  }

  /**
   * Get result from cache with LRU update
   */
  private getFromCache(word: string): SyllableInfo | null {
    const entry = this.cache.get(word);
    if (!entry) {
      return null;
    }

    // Update timestamp for LRU
    entry.timestamp = Date.now();
    this.cache.set(word, entry);
    
    return entry.info;
  }

  /**
   * Cache a result with true LRU eviction
   */
  private cacheResult(word: string, info: SyllableInfo): void {
    // Evict oldest entries if cache is full
    if (this.cache.size >= this.maxCacheSize) {
      this.evictOldestEntries();
    }

    this.cache.set(word, {
      info,
      timestamp: Date.now()
    });
  }

  /**
   * Evict oldest cache entries (true LRU)
   */
  private evictOldestEntries(): void {
    const entries = Array.from(this.cache.entries());
    
    // Sort by timestamp (oldest first)
    entries.sort(([, a], [, b]) => a.timestamp - b.timestamp);
    
    // Remove oldest 10% of entries
    const toRemove = Math.max(1, Math.floor(this.maxCacheSize * 0.1));
    
    for (let i = 0; i < toRemove; i++) {
      if (entries[i]) {
        this.cache.delete(entries[i][0]);
      }
    }
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
  getCacheStats(): { 
    size: number; 
    maxSize: number; 
    hitRate?: number;
    oldestEntry?: number;
  } {
    const stats = {
      size: this.cache.size,
      maxSize: this.maxCacheSize,
    };

    if (this.cache.size > 0) {
      const entries = Array.from(this.cache.values());
      const oldestTimestamp = Math.min(...entries.map(e => e.timestamp));
      const oldestAge = Date.now() - oldestTimestamp;
      
      return {
        ...stats,
        oldestEntry: oldestAge
      };
    }

    return stats;
  }

  /**
   * Set cache size limit
   */
  setCacheSize(size: number): void {
    if (size < 1) {
      throw new Error("Cache size must be at least 1");
    }
    
    this.maxCacheSize = size;
    
    // Evict excess entries if new size is smaller
    if (this.cache.size > size) {
      this.evictOldestEntries();
    }
  }

  /**
   * Get cache hit rate (requires tracking hits/misses)
   */
  getCacheHitRate(): number | null {
    // This would require additional tracking of hits/misses
    // For now, return null to indicate not implemented
    return null;
  }
}

// Export singleton instance with default cache size
export const syllableCounter = new SyllableCounter();
