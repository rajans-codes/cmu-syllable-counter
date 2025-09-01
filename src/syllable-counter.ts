import { cmuDictionary } from "./dictionary";
import { enhancedFallbackSyllableCount } from "./fallback-syllable-count";
import {
  enhancedHyphenateWord,
  getSyllableBoundaries,
} from "./fallback-hyphenation";

// Type definitions moved from types.ts
export interface SyllableInfo {
  /** The original word */
  word: string;
  /** Number of syllables */
  syllables: number;
  /** Hyphenated version of the word */
  hyphenated: string;
  /** Source of the syllable count: 'cmu' or 'fallback' */
  source: "cmu" | "fallback";
  /** CMU pronunciation if available */
  pronunciation?: string;
  /** Syllable boundaries for advanced analysis */
  syllableBoundaries?: number[];
}

export interface SyllableCountOptions {
  /** Whether to include syllable boundaries in the result */
  includeBoundaries?: boolean;
}

export interface HyphenationOptions {
  /** Whether to include syllable boundaries */
  includeBoundaries?: boolean;
  /** Custom hyphenation patterns */
  customPatterns?: Record<string, string>;
  /** Delimiter to use for hyphenation (default: '-') */
  delimiter?: string;
}

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

    // Create cache key that excludes delimiter (since it doesn't affect core data)
    const cacheKey = this.createCacheKey(normalizedWord, options);

    // Check cache first
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      // Apply delimiter transformation to cached result
      return this.applyDelimiterToResult(cached, options.delimiter);
    }

    // Process the word
    const info = await this.processWord(normalizedWord, options);
    
    // Cache the result (with default delimiter)
    this.cacheResult(cacheKey, info);
    
    // Apply delimiter transformation to result
    return this.applyDelimiterToResult(info, options.delimiter);
  }

  /**
   * Create a cache key that excludes delimiter (since it doesn't affect core data)
   */
  private createCacheKey(word: string, options: SyllableCountOptions & HyphenationOptions): string {
    const includeBoundaries = options.includeBoundaries || false;
    return `${word}|${includeBoundaries}`;
  }

  /**
   * Apply delimiter transformation to a result
   */
  private applyDelimiterToResult(info: SyllableInfo, delimiter?: string): SyllableInfo {
    if (!delimiter || delimiter === '-') {
      return info; // No transformation needed
    }

    // Apply delimiter transformation to hyphenated word
    const transformedHyphenated = info.hyphenated.replace(/-/g, delimiter);

    return {
      ...info,
      hyphenated: transformedHyphenated
    };
  }

  /**
   * Process a word through CMU dictionary or fallback
   */
  private async processWord(
    word: string, 
    options: SyllableCountOptions & HyphenationOptions
  ): Promise<SyllableInfo> {
    // First, check if word exists in dictionary using the optimized getWord method
    const dictionaryEntry = cmuDictionary.getWord(word);
    
    if (dictionaryEntry) {
      // Word found in dictionary - return immediately with all data
      // Always use default delimiter for caching, transformation will handle custom delimiters
      const hyphenated = dictionaryEntry.h || enhancedHyphenateWord(word, { ...options, delimiter: '-' });
      
      const boundaries = dictionaryEntry.h 
        ? this.getSyllableBoundariesFromHyphenated(dictionaryEntry.h, '-')
        : getSyllableBoundaries(word, { ...options, delimiter: '-' });

      return {
        word,
        syllables: dictionaryEntry.s,
        hyphenated,
        source: "cmu",
        pronunciation: dictionaryEntry.p,
        syllableBoundaries: options.includeBoundaries ? boundaries : undefined,
      };
    }
    
    // Word not found in dictionary - use fallback algorithm
    return this.processWithFallback(word, options);
  }

  /**
   * Process word using fallback algorithm
   */
  private processWithFallback(
    word: string,
    options: SyllableCountOptions & HyphenationOptions
  ): SyllableInfo {
    const fallbackCount = enhancedFallbackSyllableCount(word);
    // Always use default delimiter for caching, transformation will handle custom delimiters
    const hyphenated = enhancedHyphenateWord(word, { ...options, delimiter: '-' });
    const boundaries = getSyllableBoundaries(word, { ...options, delimiter: '-' });

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
  private getSyllableBoundariesFromHyphenated(hyphenated: string, delimiter: string = '-'): number[] {
    const boundaries: number[] = [];
    let currentPos = 0;
    
    for (let i = 0; i < hyphenated.length; i++) {
      if (hyphenated[i] === delimiter) {
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
}

// Export singleton instance with default cache size
export const syllableCounter = new SyllableCounter();
