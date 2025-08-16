import { CMU_DICTIONARY } from "./dictionary-data";

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

class CMUDictionary {
  /**
   * Get pronunciation for a word from the CMU Dictionary
   */
  async getPronunciation(word: string): Promise<string | null> {
    const normalizedWord = word.toLowerCase();
    const data = CMU_DICTIONARY[normalizedWord];
    return data?.p ?? null;
  }

  /**
   * Get syllable count for a word from the dictionary
   */
  async getSyllableCount(word: string): Promise<number> {
    const normalizedWord = word.toLowerCase();
    const data = CMU_DICTIONARY[normalizedWord];
    return data?.s ?? 0;
  }

  /**
   * Check if a word exists in the dictionary
   */
  async hasWord(word: string): Promise<boolean> {
    const normalizedWord = word.toLowerCase();
    return normalizedWord in CMU_DICTIONARY;
  }

  /**
   * Get dictionary statistics
   */
  getStats(): { totalWords: number } {
    return {
      totalWords: Object.keys(CMU_DICTIONARY).length,
    };
  }
}

// Export singleton instance
export const cmuDictionary = new CMUDictionary();
export { ARPABET_VOWELS, VOWEL_PATTERNS, DIGRAPHS };
