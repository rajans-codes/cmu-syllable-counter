export { cmuDictionary } from "./dictionary";
export { syllableCounter, SyllableCounter } from "./syllable-counter";

// Core types
export type { SyllableInfo } from "./types";

// Core convenience functions
import { syllableCounter } from "./syllable-counter";

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

  // Extract words efficiently
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
 * Extract words from input efficiently
 */
function extractWords(input: string | string[]): string[] {
  if (typeof input === "string") {
    return input.match(WORD_REGEX) || [];
  }
  
  return input.flatMap(item => 
    typeof item === "string" ? (item.match(WORD_REGEX) || []) : []
  );
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
  
  // Filter out empty words first
  const validWords = words.filter(word => word?.trim());
  
  if (validWords.length === 0) {
    return { totalSyllableCount: 0, wordDetails: [] };
  }

  // Process words in parallel for better performance
  const syllableInfos = await Promise.all(
    validWords.map(async (word) => {
      const normalizedWord = word.trim();
      
      // Pass all options including delimiter to underlying function
      const syllableInfo = await syllableCounter.getSyllableInfo(normalizedWord, {
        includeBoundaries: includeHyp,
        delimiter, // Pass delimiter to underlying functions
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
        hyp: syllableInfo.hyphenated, // Already uses correct delimiter
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
};
