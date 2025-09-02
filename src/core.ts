export { cmuDictionary } from "./dictionary";
export { syllableCounter, SyllableCounter } from "./syllable-counter";

// Export types for external use
export type { 
  WordDetail, 
  Analysis, 
  SyllableCountResult, 
  SyllableCountOptions, 
  CoreHyphenationOptions, 
  HyphenationResult 
};

// Import syllableCounter for internal use
import { syllableCounter } from "./syllable-counter";
import type { HyphenationOptions } from "./syllable-counter";

// Pre-compiled regex for better performance
const WORD_REGEX = /\b[\w']+\b/g;

// Type definitions
interface WordDetail {
  word: string;
  hyp: string;
  sc: number;
  source: "cmu" | "fallback";
  pron?: string;
}

interface Analysis {
  totalWords: number;
  avgSyllablesPerWord: number;
  lines: number;
}

interface SyllableCountResult {
  totalSyllableCount: number;
  wordDetails?: WordDetail[];
  analysis?: Analysis;
}

interface SyllableCountOptions {
  includeHyp?: boolean;
  delimiter?: string;
  includePron?: boolean;
  includeAnalysis?: boolean;
}

// Core-specific hyphenation options that extend the base ones
interface CoreHyphenationOptions extends HyphenationOptions {
  includeAnalysis?: boolean;
}

interface HyphenationResult {
  hyp: string;
  words: WordDetail[];
  analysis?: Analysis;
}

// Empty result template for better performance
const EMPTY_RESULT: SyllableCountResult = {
  totalSyllableCount: 0,
  wordDetails: [],
  analysis: { totalWords: 0, avgSyllablesPerWord: 0, lines: 0 }
};

/**
 * Unified syllable counting function for words or sentences
 * @param wordsOrSentences - A single word, sentence, or an array of words/sentences
 * @param options - Configuration options
 * @returns Promise with total syllable count and optional hyphenation/pronunciation data
 */
export async function getSyllableCount(
  wordsOrSentences: string | string[],
  options: SyllableCountOptions = {}
): Promise<SyllableCountResult> {
  const {
    includeHyp = false,
    delimiter = "-",
    includePron = false,
    includeAnalysis = false,
  } = options;

  // Early return for empty input
  if (!wordsOrSentences || 
      (typeof wordsOrSentences === "string" && !wordsOrSentences.trim()) ||
      (Array.isArray(wordsOrSentences) && wordsOrSentences.length === 0)) {
    return {
      totalSyllableCount: 0,
      ...(includeHyp && { wordDetails: [] }),
      ...(includeAnalysis && { 
        analysis: { totalWords: 0, avgSyllablesPerWord: 0, lines: 0 } 
      })
    };
  }

  // Extract and filter words efficiently
  const words = extractWords(wordsOrSentences);
  
  if (words.length === 0) {
    return {
      totalSyllableCount: 0,
      ...(includeHyp && { wordDetails: [] }),
      ...(includeAnalysis && { 
        analysis: { totalWords: 0, avgSyllablesPerWord: 0, lines: 0 } 
      })
    };
  }

  // Calculate lines for analysis (only if needed)
  const lines = includeAnalysis ? calculateLines(wordsOrSentences) : 0;

  // Process words
  const { totalSyllableCount, wordDetails } = await processWords(
    words, 
    { includeHyp, delimiter, includePron }
  );

  // Build result object efficiently
  return {
    totalSyllableCount,
    ...(includeHyp && { wordDetails }),
    ...(includeAnalysis && { 
      analysis: {
        totalWords: words.length,
        avgSyllablesPerWord: words.length > 0 ? totalSyllableCount / words.length : 0,
        lines
      }
    })
  };
}

/**
 * Get hyphenated string with word details
 * @param wordsOrSentences - A single word, sentence, or an array of words/sentences
 * @param options - Configuration options
 * @returns Promise with hyphenated string and word details
 */
export async function getHyphenatedString(
  wordsOrSentences: string | string[],
  options: CoreHyphenationOptions = {}
): Promise<HyphenationResult> {
  const {
    delimiter = "-",
    includeAnalysis = false,
  } = options;

  // Early return for empty input
  if (!wordsOrSentences || 
      (typeof wordsOrSentences === "string" && !wordsOrSentences.trim()) ||
      (Array.isArray(wordsOrSentences) && wordsOrSentences.length === 0)) {
    return {
      hyp: "",
      words: [],
      ...(includeAnalysis && { 
        analysis: { totalWords: 0, avgSyllablesPerWord: 0, lines: 0 } 
      })
    };
  }

  // Extract and filter words efficiently
  const words = extractWords(wordsOrSentences);
  
  if (words.length === 0) {
    return {
      hyp: "",
      words: [],
      ...(includeAnalysis && { 
        analysis: { totalWords: 0, avgSyllablesPerWord: 0, lines: 0 } 
      })
    };
  }

  // Calculate lines for analysis (only if needed)
  const lines = includeAnalysis ? calculateLines(wordsOrSentences) : 0;

  // Process words with hyphenation enabled
  const { wordDetails } = await processWords(
    words, 
    { includeHyp: true, delimiter, includePron: false }
  );

  // Build hyphenated string
  const hyp = wordDetails.map(detail => detail.hyp).join(" ");

  // Build result object efficiently
  return {
    hyp,
    words: wordDetails,
    ...(includeAnalysis && { 
      analysis: {
        totalWords: words.length,
        avgSyllablesPerWord: wordDetails.reduce((sum, detail) => sum + detail.sc, 0) / words.length,
        lines
      }
    })
  };
}

/**
 * Extract words from input efficiently
 */
function extractWords(input: string | string[]): string[] {
  if (typeof input === "string") {
    const matches = input.match(WORD_REGEX);
    return matches ? matches.filter(word => word.trim()) : [];
  }
  
  // Handle array input more efficiently
  const result: string[] = [];
  for (const item of input) {
    if (typeof item === "string") {
      const matches = item.match(WORD_REGEX);
      if (matches) {
        for (const word of matches) {
          if (word.trim()) {
            result.push(word);
          }
        }
      }
    }
  }
  return result;
}

/**
 * Calculate number of lines for analysis
 */
function calculateLines(input: string | string[]): number {
  if (typeof input === "string") {
    return input.split("\n").filter(line => line.trim().length > 0).length;
  }
  return input.length;
}

/**
 * Process words and return syllable count and details
 */
async function processWords(
  words: string[], 
  options: { includeHyp: boolean; delimiter: string; includePron: boolean }
): Promise<{ totalSyllableCount: number; wordDetails: WordDetail[] }> {
  const { includeHyp, delimiter, includePron } = options;
  
  if (words.length === 0) {
    return { totalSyllableCount: 0, wordDetails: [] };
  }

  // Process words in parallel for better performance
  const syllableInfos = await Promise.all(
    words.map(async (word) => {
      const normalizedWord = word.trim();
      
      const syllableInfo = await syllableCounter.getSyllableInfo(normalizedWord, {
        includeBoundaries: includeHyp,
        delimiter,
      });

      return { normalizedWord, syllableInfo };
    })
  );

  // Calculate totals and build word details
  let totalSyllableCount = 0;
  const wordDetails: WordDetail[] = [];

  for (const { normalizedWord, syllableInfo } of syllableInfos) {
    totalSyllableCount += syllableInfo.syllables;

    if (includeHyp) {
      const wordDetail: WordDetail = {
        word: normalizedWord,
        hyp: syllableInfo.hyphenated,
        sc: syllableInfo.syllables,
        source: syllableInfo.source,
        ...(includePron && syllableInfo.pronunciation && { 
          pron: syllableInfo.pronunciation 
        })
      };

      wordDetails.push(wordDetail);
    }
  }

  return { totalSyllableCount, wordDetails };
}

// Default export for CommonJS compatibility
export default {
  getSyllableCount,
  getHyphenatedString,
};
