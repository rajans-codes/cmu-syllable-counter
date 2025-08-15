// Core syllable counting functionality - minimal bundle
export { fallbackSyllableCount } from './fallback';
export { cmuDictionary } from './dictionary';
export { syllableCounter, SyllableCounter } from './syllable-counter';

// Core types
export type { 
  SyllableCountOptions, 
  CMUDictEntry, 
  SyllableInfo, 
  HyphenationOptions,
  HyphenationPattern,
  SmartHyphenationOptions,
  SmartHyphenationResult,
  CMUHyphenationResult,
  HyphenationStats
} from './types';

// Core convenience functions
import { syllableCounter } from './syllable-counter';

/**
 * Unified syllable counting function for words or sentences
 * @param wordsOrSentences - A single word, sentence, or an array of words/sentences
 * @param options - Configuration options
 * @returns Promise with total syllable count and optional hyphenation/pronunciation data
 */
export async function getSyllableCount(
  wordsOrSentences: string | string[],
  options?: {
    includeHyp?: boolean; // default: false
    delimiter?: string;   // default: '-'
    includePron?: boolean; // default: false - include pronunciation if word is in CMU dictionary
  }
): Promise<{
  totalSyllableCount: number;
  hyp?: { hyp: string; sc: number; source: 'cmu' | 'fallback'; pron?: string }[];
}> {
  const { includeHyp = false, delimiter = '-', includePron = false } = options || {};
  
  // Convert input to array of words
  let words: string[];
  if (typeof wordsOrSentences === 'string') {
    // Split sentence into words
    const wordRegex = /\b[\w']+\b/g;
    words = wordsOrSentences.match(wordRegex) || [];
  } else {
    // Already an array
    words = wordsOrSentences.flatMap(item => {
      if (typeof item === 'string') {
        const wordRegex = /\b[\w']+\b/g;
        return item.match(wordRegex) || [];
      }
      return [];
    });
  }

  if (words.length === 0) {
    return {
      totalSyllableCount: 0,
      hyp: includeHyp ? [] : undefined
    };
  }

  let totalSyllableCount = 0;
  const hypData: { hyp: string; sc: number; source: 'cmu' | 'fallback'; pron?: string }[] = [];

  // Process each word
  for (const word of words) {
    if (!word || word.length === 0) continue;

    const normalizedWord = word.trim();
    
    // Get syllable info for the word
    const syllableInfo = await syllableCounter.getSyllableInfo(normalizedWord, {
      includeBoundaries: includeHyp
    });

    totalSyllableCount += syllableInfo.syllables;

    // Add hyphenation data if requested
    if (includeHyp) {
      let hyphenated = syllableInfo.hyphenated;
      
      // Replace default hyphen with custom delimiter if different
      if (delimiter !== '-') {
        hyphenated = hyphenated.replace(/-/g, delimiter);
      }

      const wordData: { hyp: string; sc: number; source: 'cmu' | 'fallback'; pron?: string } = {
        hyp: hyphenated,
        sc: syllableInfo.syllables,
        source: syllableInfo.source
      };

      // Add pronunciation if requested and available
      if (includePron && syllableInfo.pronunciation) {
        wordData.pron = syllableInfo.pronunciation;
      }

      hypData.push(wordData);
    }
  }

  return {
    totalSyllableCount,
    hyp: includeHyp ? hypData : undefined
  };
}

/**
 * Check if a word is in the CMU dictionary
 */
export async function isInDictionary(word: string): Promise<boolean> {
  return await syllableCounter.isInDictionary(word);
}

/**
 * Get pronunciation for a word
 */
export async function getPronunciation(word: string): Promise<string | null> {
  return await syllableCounter.getPronunciation(word);
}

// Default export for CommonJS compatibility
export default {
  getSyllableCount,
  isInDictionary,
  getPronunciation
};
