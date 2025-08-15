import { CMU_DICTIONARY, CMU_PRONUNCIATIONS } from './dictionary-data';

// ARPAbet vowel phonemes that indicate syllables
const ARPABET_VOWELS = new Set([
  'AA', 'AE', 'AH', 'AO', 'AW', 'AY', 'EH', 'ER', 'EY', 'IH', 'IY', 'OW', 'OY', 'UH', 'UW'
]);

const DIGRAPHS = ['th', 'sh', 'ch', 'ph', 'gh', 'wh'];

// Vowel patterns for fallback syllable counting
const VOWEL_PATTERNS = /[aeiouy]+/gi;

class CMUDictionary {
  private cache: Map<string, number> = new Map();
  private maxCacheSize = 1000;

  /**
   * Look up a word in the CMU Dictionary
   */
  async lookup(word: string): Promise<string | null> {
    const normalizedWord = word.toLowerCase();
    const data = CMU_PRONUNCIATIONS[normalizedWord];
    return data ? data.p : null;
  }

  /**
   * Get syllable count for a word from the dictionary
   */
  async getSyllableCount(word: string): Promise<number> {
    const normalizedWord = word.toLowerCase();
    return CMU_DICTIONARY[normalizedWord] || 0;
  }

  /**
   * Check if a word exists in the dictionary
   */
  async hasWord(word: string): Promise<boolean> {
    const normalizedWord = word.toLowerCase();
    return CMU_DICTIONARY[normalizedWord] !== undefined;
  }

  /**
   * Get cached syllable count or compute and cache it
   */
  async getCachedSyllableCount(word: string): Promise<number> {
    if (this.cache.has(word)) {
      return this.cache.get(word)!;
    }

    const count = await this.getSyllableCount(word);
    
    // Implement LRU cache
    if (this.cache.size >= this.maxCacheSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }
    
    this.cache.set(word, count);
    return count;
  }

  /**
   * Clear the cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Set maximum cache size
   */
  setMaxCacheSize(size: number): void {
    this.maxCacheSize = size;
  }

  /**
   * Get dictionary statistics
   */
  getStats(): { totalWords: number; cacheSize: number } {
    return {
      totalWords: Object.keys(CMU_DICTIONARY).length,
      cacheSize: this.cache.size
    };
  }
}

// Export singleton instance
export const cmuDictionary = new CMUDictionary();
export { ARPABET_VOWELS, VOWEL_PATTERNS, DIGRAPHS };
