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

// Extended analysis interface for utility functions
export interface WordAnalysis {
  word: string;
  syllables?: number;
  pronunciation?: string;
  hyphenated?: string;
  phonemeCount?: number;
  vowelCount?: number;
  consonantCount?: number;
  stressPattern?: string;
  complexity?: 'simple' | 'moderate' | 'complex';
}

// Options for word search functions
export interface WordSearchOptions {
  limit?: number;
  includePronunciation?: boolean;
  includeHyphenation?: boolean;
  includeSyllables?: boolean;
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

// Utility functions for advanced dictionary operations

/**
 * Count syllables from pronunciation string
 */
function countSyllablesFromPronunciation(pronunciation: string): number {
  if (!pronunciation) return 0;
  const phonemes = pronunciation.split(' ');
  return phonemes.filter(phoneme => 
    /[0-9]/.test(phoneme) || // Stress markers indicate syllables
    /^[AEIOU]/i.test(phoneme) // Vowel phonemes
  ).length;
}

/**
 * Count vowels from pronunciation
 */
function countVowelsFromPronunciation(pronunciation: string): number {
  if (!pronunciation) return 0;
  const phonemes = pronunciation.split(' ');
  return phonemes.filter(phoneme => 
    /^[AEIOU]/i.test(phoneme) || // Vowel phonemes
    /[0-9]/.test(phoneme) // Stress markers
  ).length;
}

/**
 * Count consonants from pronunciation
 */
function countConsonantsFromPronunciation(pronunciation: string): number {
  if (!pronunciation) return 0;
  const phonemes = pronunciation.split(' ');
  return phonemes.filter(phoneme => 
    /^[BCDFGHJKLMNPQRSTVWXYZ]/i.test(phoneme) && // Consonant phonemes
    !/[0-9]/.test(phoneme) // Exclude stress markers
  ).length;
}

/**
 * Extract stress pattern from pronunciation
 */
function extractStressPattern(pronunciation: string): string {
  if (!pronunciation) return '';
  const phonemes = pronunciation.split(' ');
  return phonemes
    .map(phoneme => {
      if (/\d/.test(phoneme)) {
        return phoneme.match(/\d/)?.[0] || '0';
      }
      return '0';
    })
    .join('');
}

/**
 * Determine word complexity based on phoneme count and structure
 */
function determineComplexity(pronunciation: string): 'simple' | 'moderate' | 'complex' {
  if (!pronunciation) return 'simple';
  const phonemeCount = pronunciation.split(' ').length;
  const syllableCount = countSyllablesFromPronunciation(pronunciation);
  
  if (phonemeCount <= 4 && syllableCount <= 2) return 'simple';
  if (phonemeCount <= 7 && syllableCount <= 3) return 'moderate';
  return 'complex';
}

/**
 * Generate hyphenation from pronunciation
 */
function generateHyphenationFromPronunciation(word: string, pronunciation: string): string {
  if (!pronunciation) return word;
  
  const phonemes = pronunciation.split(' ');
  const syllables: string[] = [];
  let currentSyllable = '';
  let wordIndex = 0;
  
  for (let i = 0; i < phonemes.length; i++) {
    const phoneme = phonemes[i];
    currentSyllable += word[wordIndex] || '';
    
    // Check if this phoneme ends a syllable
    if (/\d/.test(phoneme) || i === phonemes.length - 1) {
      syllables.push(currentSyllable);
      currentSyllable = '';
    }
    
    wordIndex++;
  }
  
  return syllables.join('-');
}

/**
 * Find words by syllable count
 */
export function findWordsBySyllableCount(
  syllableCount: number, 
  options: WordSearchOptions = {}
): WordAnalysis[] {
  const { limit = 10, includePronunciation = true, includeHyphenation = true } = options;
  const results: WordAnalysis[] = [];
  
  for (const [word, data] of Object.entries(CMU_DICTIONARY)) {
    if (data.s === syllableCount) {
      const analysis: WordAnalysis = { 
        word, 
        syllables: data.s,
        phonemeCount: data.p.split(' ').length,
        vowelCount: countVowelsFromPronunciation(data.p),
        consonantCount: countConsonantsFromPronunciation(data.p),
        stressPattern: extractStressPattern(data.p),
        complexity: determineComplexity(data.p)
      };
      
      if (includePronunciation) {
        analysis.pronunciation = data.p;
      }
      
      if (includeHyphenation && data.h) {
        analysis.hyphenated = data.h;
      }
      
      results.push(analysis);
      
      if (results.length >= limit) break;
    }
  }
  
  return results;
}

/**
 * Find words by stress pattern
 */
export function findWordsByStressPattern(
  pattern: string, 
  options: WordSearchOptions = {}
): WordAnalysis[] {
  const { limit = 10, includePronunciation = true, includeSyllables = true } = options;
  const results: WordAnalysis[] = [];
  
  for (const [word, data] of Object.entries(CMU_DICTIONARY)) {
    const stressPattern = extractStressPattern(data.p);
    
    if (stressPattern === pattern) {
      const analysis: WordAnalysis = { 
        word, 
        pronunciation: data.p,
        syllables: data.s,
        stressPattern
      };
      
      results.push(analysis);
      
      if (results.length >= limit) break;
    }
  }
  
  return results;
}

/**
 * Find words by complexity level
 */
export function findWordsByComplexity(
  complexity: 'simple' | 'moderate' | 'complex', 
  options: WordSearchOptions = {}
): WordAnalysis[] {
  const { limit = 10, includePronunciation = true, includeSyllables = true } = options;
  const results: WordAnalysis[] = [];
  
  for (const [word, data] of Object.entries(CMU_DICTIONARY)) {
    const wordComplexity = determineComplexity(data.p);
    
    if (wordComplexity === complexity) {
      const analysis: WordAnalysis = { 
        word, 
        pronunciation: data.p,
        syllables: data.s,
        complexity: wordComplexity,
        phonemeCount: data.p.split(' ').length
      };
      
      results.push(analysis);
      
      if (results.length >= limit) break;
    }
  }
  
  return results;
}

/**
 * Find words by vowel count
 */
export function findWordsByVowelCount(
  vowelCount: number, 
  options: WordSearchOptions = {}
): WordAnalysis[] {
  const { limit = 10, includePronunciation = true, includeSyllables = true } = options;
  const results: WordAnalysis[] = [];
  
  for (const [word, data] of Object.entries(CMU_DICTIONARY)) {
    const vowels = countVowelsFromPronunciation(data.p);
    
    if (vowels === vowelCount) {
      const analysis: WordAnalysis = { 
        word, 
        pronunciation: data.p,
        syllables: data.s,
        vowelCount: vowels,
        consonantCount: countConsonantsFromPronunciation(data.p)
      };
      
      results.push(analysis);
      
      if (results.length >= limit) break;
    }
  }
  
  return results;
}

/**
 * Get random words from dictionary
 */
export function getRandomWords(count: number = 10, options: WordSearchOptions = {}): WordAnalysis[] {
  const { includePronunciation = true, includeSyllables = true, includeHyphenation = true } = options;
  
  const words = Object.keys(CMU_DICTIONARY);
  const selectedWords = words.sort(() => Math.random() - 0.5).slice(0, count);
  
  return selectedWords.map(word => {
    const data = CMU_DICTIONARY[word];
    const analysis: WordAnalysis = { word };
    
    if (includePronunciation) {
      analysis.pronunciation = data.p;
    }
    
    if (includeSyllables) {
      analysis.syllables = data.s;
    }
    
    if (includeHyphenation && data.h) {
      analysis.hyphenated = data.h;
    }
    
    return analysis;
  });
}

/**
 * Find rhyming words based on pronunciation
 */
export function findRhymingWords(
  targetWord: string, 
  options: WordSearchOptions = {}
): WordAnalysis[] {
  const { limit = 10, includePronunciation = true, includeSyllables = true } = options;
  const results: WordAnalysis[] = [];
  
  const targetData = CMU_DICTIONARY[targetWord.toLowerCase()];
  if (!targetData) return results;
  
  const targetPhonemes = targetData.p.split(' ');
  const targetVowels = targetPhonemes.filter(p => /^[AEIOU]/i.test(p) || /\d/.test(p));
  
  if (targetVowels.length === 0) return results;
  
  const lastVowel = targetVowels[targetVowels.length - 1];
  const lastVowelIndex = targetPhonemes.lastIndexOf(lastVowel);
  const rhymingSuffix = targetPhonemes.slice(lastVowelIndex).join(' ');
  
  for (const [word, data] of Object.entries(CMU_DICTIONARY)) {
    if (word === targetWord.toLowerCase()) continue;
    
    const phonemes = data.p.split(' ');
    const vowels = phonemes.filter(p => /^[AEIOU]/i.test(p) || /\d/.test(p));
    
    if (vowels.length === 0) continue;
    
    const lastVowelIndex2 = phonemes.lastIndexOf(vowels[vowels.length - 1]);
    const wordSuffix = phonemes.slice(lastVowelIndex2).join(' ');
    
    if (wordSuffix === rhymingSuffix) {
      const analysis: WordAnalysis = { 
        word, 
        pronunciation: data.p,
        syllables: data.s
      };
      
      results.push(analysis);
      
      if (results.length >= limit) break;
    }
  }
  
  return results;
}

/**
 * Get all words in dictionary
 */
export function getAllWords(): string[] {
  return Object.keys(CMU_DICTIONARY);
}

/**
 * Get total word count in dictionary
 */
export function getDictionarySize(): number {
  return Object.keys(CMU_DICTIONARY).length;
}

/**
 * Check if a word exists in dictionary
 */
export function isWordInDictionary(word: string): boolean {
  return word.toLowerCase() in CMU_DICTIONARY;
}

// Export singleton instance
export const cmuDictionary = new CMUDictionary();
export { ARPABET_VOWELS, VOWEL_PATTERNS, DIGRAPHS };
