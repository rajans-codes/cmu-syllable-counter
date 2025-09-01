import { CMU_DICTIONARY } from './dictionary-data';

// ARPAbet vowel phonemes that indicate syllables
const ARPABET_VOWELS = new Set([
  "AA",
  "AE",
  "AH",
  "AO",
  "AW",
  "AY",
  "EH",
  "ER",
  "EY",
  "IH",
  "IY",
  "OW",
  "OY",
  "UH",
  "UW",
]);

const DIGRAPHS = ["th", "sh", "ch", "ph", "gh", "wh"];

// Vowel patterns for fallback syllable counting
const VOWEL_PATTERNS = /[aeiouy]+/gi;

// Dictionary entry type for better type safety
export interface DictionaryEntry {
  s: number;  // syllable count
  p: string;  // pronunciation
  h?: string; // hyphenation
}

export class CMUDictionary {
  private readonly dictionary: Record<string, DictionaryEntry>;
  private readonly wordCount: number;

  constructor() {
    this.dictionary = CMU_DICTIONARY;
    this.wordCount = Object.keys(this.dictionary).length;
  }

  /**
   * Get complete word data from the CMU Dictionary
   * @param word - The word to look up
   * @returns Dictionary entry or null if not found
   */
  getWord(word: string): DictionaryEntry | null {
    if (!word?.trim()) return null;
    
    const normalizedWord = word.toLowerCase().trim();
    return this.dictionary[normalizedWord] || null;
  }

  /**
   * Get pronunciation for a word from the CMU Dictionary
   */
  async getPronunciation(word: string): Promise<string | null> {
    const entry = this.getWord(word);
    return entry?.p ?? null;
  }

  /**
   * Get syllable count for a word from the dictionary
   */
  async getSyllableCount(word: string): Promise<number> {
    const entry = this.getWord(word);
    return entry?.s ?? 0;
  }

  /**
   * Get hyphenated version for a word from the dictionary
   */
  async getHyphenated(word: string): Promise<string | null> {
    const entry = this.getWord(word);
    return entry?.h ?? null;
  }

  /**
   * Check if a word exists in the dictionary
   */
  async hasWord(word: string): Promise<boolean> {
    return this.getWord(word) !== null;
  }

  /**
   * Get dictionary statistics
   */
  getStats(): { totalWords: number } {
    return {
      totalWords: this.wordCount,
    };
  }

  /**
   * Get multiple words at once for better performance
   */
  getWords(words: string[]): Record<string, DictionaryEntry | null> {
    const result: Record<string, DictionaryEntry | null> = {};
    
    for (const word of words) {
      result[word] = this.getWord(word);
    }
    
    return result;
  }

  /**
   * Check if dictionary is loaded and ready
   */
  isReady(): boolean {
    return this.wordCount > 0;
  }
}

// Export singleton instance
export const cmuDictionary = new CMUDictionary();
export { ARPABET_VOWELS, VOWEL_PATTERNS, DIGRAPHS };
