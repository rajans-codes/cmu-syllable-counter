import { CMU_PRONUNCIATIONS } from './dictionary-data';
import { syllableCounter } from './syllable-counter';
import { enhancedCMUHyphenation } from './cmu-hyphenation';
import { countSyllablesFromPronunciation } from './shared-utils';
import { cmuDictionary } from './dictionary';

// Cache for word analysis to avoid recalculation
const wordAnalysisCache = new Map<string, {
  syllables: number;
  hyphenated?: string;
  pronunciation?: string;
}>();

export interface TextAnalysisOptions {
  /** Maximum number of words to process (for performance/rate limiting) */
  maxWords?: number;
  /** Maximum number of characters to process */
  maxCharacters?: number;
  /** Maximum number of lines to process */
  maxLines?: number;
  /** Whether to include detailed syllable breakdown */
  includeBreakdown?: boolean;
  /** Whether to include hyphenation in breakdown */
  includeHyphenation?: boolean;
  /** Custom word processing function */
  customWordProcessor?: (word: string) => Promise<number>;
  /** Breakdown separator (default: '-') */
  breakdownSeparator?: string;
}

export interface TextSyllableResult {
  /** Total number of syllables in the text */
  totalSyllables: number;
  /** Average syllables per word */
  syllablesPerWord: number;
  /** Number of lines in the text */
  lines: number;
  /** Number of words in the text */
  wordCount: number;
  /** Character count (excluding whitespace) */
  characterCount: number;
  /** Syllable breakdown with word counts */
  syllableBreakdown: string;
  /** Array of word details for custom formatting */
  wordDetails: Array<{
    word: string;
    syllables: number;
    hyphenated?: string;
    pronunciation?: string;
    display: string; // Formatted display string (word + syllable count)
  }>;
  /** Processing metadata */
  metadata: {
    processingTime: number;
    wordsProcessed: number;
    wordsSkipped: number;
    limitsApplied: boolean;
  };
}





/**
 * Analyze syllables in multi-line text
 */
export async function analyzeText(
  text: string, 
  options: TextAnalysisOptions = {}
): Promise<TextSyllableResult> {
  const startTime = Date.now();
  
  const {
    maxWords = 5000,
    maxCharacters = 50000,
    maxLines = 100,
    includeBreakdown = true,
    includeHyphenation = true,
    breakdownSeparator = '-',
    customWordProcessor
  } = options;

  // Clean and prepare the text
  const lines = text.trim().split(/\n/).filter(line => line.trim().length > 0);
  
  // Apply line limit
  const originalLineCount = lines.length;
  const processedLines = lines.slice(0, maxLines);

  // Check character limit
  const fullText = processedLines.join('\n');
  const characterCount = fullText.length;
  
  if (characterCount > maxCharacters) {
    // Truncate text to character limit
    const truncatedText = fullText.substring(0, maxCharacters);
    const truncatedLines = truncatedText.split('\n').filter(line => line.trim().length > 0);
    return await analyzeText(truncatedLines.join('\n'), { ...options, maxCharacters: characterCount });
  }

  // Process all lines
  const allWordResults: Array<{
    word: string;
    syllables: number;
    hyphenated?: string;
    pronunciation?: string;
  }> = [];

  let totalSyllables = 0;
  let wordsSkipped = 0;
  let wordCount = 0;

  for (const line of processedLines) {
    const words = line.split(/\s+/).filter(word => word.length > 0);
    
    for (const word of words) {
      // Check word limit
      if (wordCount >= maxWords) {
        break;
      }

      try {
        let syllables: number;
        let hyphenated: string | undefined;
        let pronunciation: string | undefined;

        if (customWordProcessor) {
          syllables = await customWordProcessor(word);
        } else {
          // Check cache first
          const cached = wordAnalysisCache.get(word);
          if (cached) {
            syllables = cached.syllables;
            hyphenated = cached.hyphenated;
            pronunciation = cached.pronunciation;
          } else {
            // Use CMU dictionary first, then fallback
            const cmuPron = await cmuDictionary.lookup(word);
            const cmuResult = cmuPron ? await enhancedCMUHyphenation(word, cmuPron) : null;
            
            if (cmuResult) {
              // Calculate syllables from pronunciation
              syllables = countSyllablesFromPronunciation(cmuResult.pronunciation);
              
              if (includeHyphenation && cmuResult.hyphenated) {
                hyphenated = cmuResult.hyphenated;
              }
              
              pronunciation = cmuResult.pronunciation;
            } else {
              // Fallback to syllable counter
              const syllableInfo = await syllableCounter.getSyllableInfo(word);
              syllables = syllableInfo.syllables;
            }
            
            // Cache the result
            wordAnalysisCache.set(word, {
              syllables,
              hyphenated,
              pronunciation
            });
          }
        }

        allWordResults.push({
          word,
          syllables,
          hyphenated,
          pronunciation
        });

        totalSyllables += syllables;
        wordCount++;
      } catch (error) {
        // Skip problematic words
        wordsSkipped++;
        allWordResults.push({
          word,
          syllables: 0
        });
        wordCount++;
      }
    }
  }

  // Generate word details array and syllable breakdown
  const wordDetails = allWordResults.map(result => {
    let display: string;
    if (includeHyphenation && result.hyphenated) {
      display = `${result.hyphenated}${result.syllables}`;
    } else {
      display = `${result.word}${result.syllables}`;
    }
    
    return {
      word: result.word,
      syllables: result.syllables,
      hyphenated: result.hyphenated,
      pronunciation: result.pronunciation,
      display
    };
  });

  // Generate syllable breakdown string
  let syllableBreakdown = '';
  if (includeBreakdown) {
    syllableBreakdown = wordDetails
      .map(detail => detail.display)
      .join(breakdownSeparator);
  }

  const processingTime = Date.now() - startTime;

  return {
    totalSyllables,
    syllablesPerWord: allWordResults.length > 0 ? totalSyllables / allWordResults.length : 0,
    lines: processedLines.length,
    wordCount: allWordResults.length,
    characterCount,
    syllableBreakdown,
    wordDetails,
    metadata: {
      processingTime,
      wordsProcessed: allWordResults.length,
      wordsSkipped,
      limitsApplied: originalLineCount > maxLines || wordCount >= maxWords || characterCount > maxCharacters
    }
  };
}

/**
 * Quick syllable count for text (without detailed breakdown)
 */
export async function quickCountTextSyllables(
  text: string,
  options: { maxWords?: number; maxCharacters?: number } = {}
): Promise<{
  totalSyllables: number;
  wordCount: number;
  syllablesPerWord: number;
}> {
  const result = await analyzeText(text, {
    ...options,
    includeBreakdown: false,
    includeHyphenation: false
  });

  return {
    totalSyllables: result.totalSyllables,
    wordCount: result.wordCount,
    syllablesPerWord: result.syllablesPerWord
  };
}

/**
 * Get syllable breakdown for a single word
 */
export async function getWordBreakdown(word: string): Promise<{
  word: string;
  syllables: number;
  hyphenated: string;
  pronunciation?: string;
}> {
  const cmuPron = await cmuDictionary.lookup(word);
  const result = cmuPron ? await enhancedCMUHyphenation(word, cmuPron) : null;
  
  if (result) {
    return {
      word,
      syllables: countSyllablesFromPronunciation(result.pronunciation),
      hyphenated: result.hyphenated || word,
      pronunciation: result.pronunciation
    };
  } else {
    // Fallback
    const syllableInfo = await syllableCounter.getSyllableInfo(word);
    return {
      word,
      syllables: syllableInfo.syllables,
      hyphenated: word,
      pronunciation: undefined
    };
  }
}

/**
 * Batch process multiple words for syllable counting
 */
export async function batchCountWords(
  words: string[],
  options: {
    maxBatchSize?: number;
    includeBreakdown?: boolean;
    customWordProcessor?: (word: string) => Promise<number>;
  } = {}
): Promise<Array<{
  word: string;
  syllables: number;
  hyphenated?: string;
  pronunciation?: string;
}>> {
  const {
    maxBatchSize = 1000,
    includeBreakdown = true,
    customWordProcessor
  } = options;

  const results: Array<{
    word: string;
    syllables: number;
    hyphenated?: string;
    pronunciation?: string;
  }> = [];

  // Process in batches
  for (let i = 0; i < words.length; i += maxBatchSize) {
    const batch = words.slice(i, i + maxBatchSize);
    
    const batchPromises = batch.map(async (word) => {
      try {
        if (customWordProcessor) {
          const syllables = await customWordProcessor(word);
          return { word, syllables };
        } else {
          const cmuPron = await cmuDictionary.lookup(word);
          const result = cmuPron ? await enhancedCMUHyphenation(word, cmuPron) : null;
          
          if (result) {
            return {
              word,
              syllables: countSyllablesFromPronunciation(result.pronunciation),
              hyphenated: includeBreakdown ? result.hyphenated : undefined,
              pronunciation: result.pronunciation
            };
          } else {
            // Fallback
            const syllableInfo = await syllableCounter.getSyllableInfo(word);
            return {
              word,
              syllables: syllableInfo.syllables,
              hyphenated: includeBreakdown ? word : undefined,
              pronunciation: undefined
            };
          }
        }
      } catch (error) {
        return { word, syllables: 0 };
      }
    });

    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
  }

  return results;
}

/**
 * Validate text input for processing
 */
export function validateTextInput(
  text: string,
  options: {
    maxWords?: number;
    maxCharacters?: number;
    maxLines?: number;
  } = {}
): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  stats: {
    wordCount: number;
    characterCount: number;
    lineCount: number;
  };
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  const lines = text.trim().split(/\n/).filter(line => line.trim().length > 0);
  const words = text.trim().split(/\s+/).filter(word => word.length > 0);
  const characterCount = text.length;

  const stats = {
    wordCount: words.length,
    characterCount,
    lineCount: lines.length
  };

  // Check limits
  if (options.maxWords && words.length > options.maxWords) {
    errors.push(`Text exceeds maximum word limit of ${options.maxWords} words`);
  }

  if (options.maxCharacters && characterCount > options.maxCharacters) {
    errors.push(`Text exceeds maximum character limit of ${options.maxCharacters} characters`);
  }

  if (options.maxLines && lines.length > options.maxLines) {
    errors.push(`Text exceeds maximum line limit of ${options.maxLines} lines`);
  }

  // Check for empty text
  if (text.trim().length === 0) {
    errors.push('Text is empty');
  }

  // Warnings for large texts
  if (words.length > 1000) {
    warnings.push('Large text detected - processing may take longer');
  }

  if (lines.length > 50) {
    warnings.push('Many lines detected - consider processing in smaller chunks');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    stats
  };
}

// Helper function moved to shared-utils.ts
