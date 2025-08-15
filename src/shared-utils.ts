import { ARPABET_VOWELS } from './dictionary';

// Pre-computed lookup tables for performance
const PHONEME_ANALYSIS_CACHE = new Map<string, PhonemeAnalysis>();

export interface PhonemeAnalysis {
  syllables: number;
  vowels: number;
  consonants: number;
  stressPattern: string;
  complexity: 'simple' | 'moderate' | 'complex';
  uniquePhonemes: Set<string>;
  phonemeDiversity: number;
  basePhonemes: string[];
}

/**
 * Optimized phoneme analysis with caching
 */
export function analyzePhonemes(pronunciation: string): PhonemeAnalysis {
  // Check cache first
  const cached = PHONEME_ANALYSIS_CACHE.get(pronunciation);
  if (cached) {
    return cached;
  }

  // Single pass analysis for optimal performance
  const phonemes = pronunciation.split(' ');
  const basePhonemes: string[] = [];
  const uniquePhonemes = new Set<string>();
  let vowelCount = 0;
  let consonantCount = 0;
  let syllableCount = 0;
  const stressPattern: string[] = [];

  for (const phoneme of phonemes) {
    const basePhoneme = phoneme.substring(0, 2);
    basePhonemes.push(basePhoneme);
    uniquePhonemes.add(basePhoneme);

    if (ARPABET_VOWELS.has(basePhoneme)) {
      vowelCount++;
      syllableCount++;
      
      // Extract stress pattern
      if (phoneme.length > 2) {
        const stress = phoneme.substring(2);
        stressPattern.push(stress);
      } else {
        stressPattern.push('0');
      }
    } else {
      consonantCount++;
    }
  }

  const analysis: PhonemeAnalysis = {
    syllables: syllableCount,
    vowels: vowelCount,
    consonants: consonantCount,
    stressPattern: stressPattern.join(''),
    complexity: determineComplexityInternal(vowelCount, consonantCount, syllableCount),
    uniquePhonemes,
    phonemeDiversity: uniquePhonemes.size / phonemes.length,
    basePhonemes
  };

  // Cache the result
  PHONEME_ANALYSIS_CACHE.set(pronunciation, analysis);
  
  // Limit cache size to prevent memory leaks
  if (PHONEME_ANALYSIS_CACHE.size > 10000) {
    const firstKey = PHONEME_ANALYSIS_CACHE.keys().next().value;
    if (firstKey) {
      PHONEME_ANALYSIS_CACHE.delete(firstKey);
    }
  }

  return analysis;
}

/**
 * Optimized syllable counting from pronunciation
 */
export function countSyllablesFromPronunciation(pronunciation: string): number {
  const analysis = analyzePhonemes(pronunciation);
  return analysis.syllables;
}

/**
 * Optimized vowel counting from pronunciation
 */
export function countVowelsFromPronunciation(pronunciation: string): number {
  const analysis = analyzePhonemes(pronunciation);
  return analysis.vowels;
}

/**
 * Optimized consonant counting from pronunciation
 */
export function countConsonantsFromPronunciation(pronunciation: string): number {
  const analysis = analyzePhonemes(pronunciation);
  return analysis.consonants;
}

/**
 * Optimized stress pattern extraction
 */
export function extractStressPattern(pronunciation: string): string {
  const analysis = analyzePhonemes(pronunciation);
  return analysis.stressPattern;
}

/**
 * Optimized complexity determination
 */
export function determineComplexity(pronunciation: string): 'simple' | 'moderate' | 'complex' {
  const analysis = analyzePhonemes(pronunciation);
  return analysis.complexity;
}

/**
 * Internal complexity calculation (used by analyzePhonemes)
 */
function determineComplexityInternal(vowels: number, consonants: number, syllables: number): 'simple' | 'moderate' | 'complex' {
  const totalPhonemes = vowels + consonants;
  const vowelRatio = vowels / totalPhonemes;
  
  if (syllables <= 2 && totalPhonemes <= 6 && vowelRatio >= 0.3) {
    return 'simple';
  } else if (syllables <= 4 && totalPhonemes <= 10) {
    return 'moderate';
  } else {
    return 'complex';
  }
}

/**
 * Optimized hyphenation generation
 */
export function generateHyphenationFromPronunciation(word: string, pronunciation: string): string {
  const analysis = analyzePhonemes(pronunciation);
  const phonemes = analysis.basePhonemes;
  
  if (phonemes.length === 0) return word;
  
  const syllables: string[] = [];
  let currentSyllable = '';
  let phonemeIndex = 0;
  
  for (let i = 0; i < word.length; i++) {
    const char = word[i];
    currentSyllable += char;
    
    // Check if we've reached a vowel (syllable boundary)
    if (phonemeIndex < phonemes.length && ARPABET_VOWELS.has(phonemes[phonemeIndex])) {
      // Look ahead for consonant clusters
      let nextVowelIndex = phonemeIndex + 1;
      while (nextVowelIndex < phonemes.length && !ARPABET_VOWELS.has(phonemes[nextVowelIndex])) {
        nextVowelIndex++;
      }
      
      // If there are consonants after this vowel, include them in this syllable
      if (nextVowelIndex < phonemes.length) {
        const consonantsAfter = nextVowelIndex - phonemeIndex - 1;
        if (consonantsAfter > 0) {
          // Include some consonants in this syllable
          const consonantsToInclude = Math.min(consonantsAfter, 1);
          for (let j = 0; j < consonantsToInclude; j++) {
            if (i + 1 < word.length) {
              currentSyllable += word[i + 1];
              i++;
            }
          }
        }
      }
      
      syllables.push(currentSyllable);
      currentSyllable = '';
    }
    
    phonemeIndex++;
  }
  
  // Add any remaining characters
  if (currentSyllable) {
    syllables.push(currentSyllable);
  }
  
  return syllables.join('-');
}

/**
 * Optimized phoneme similarity calculation
 */
export function calculatePhonemeSimilarity(phonemes1: string[], phonemes2: string[]): number {
  const set1 = new Set(phonemes1);
  const set2 = new Set(phonemes2);
  
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  
  return intersection.size / union.size;
}

/**
 * Optimized Levenshtein distance calculation
 */
export function levenshteinDistance(arr1: string[], arr2: string[]): number {
  const matrix: number[][] = [];
  
  for (let i = 0; i <= arr1.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= arr2.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= arr1.length; i++) {
    for (let j = 1; j <= arr2.length; j++) {
      if (arr1[i - 1] === arr2[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,     // deletion
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j - 1] + 1  // substitution
        );
      }
    }
  }
  
  return matrix[arr1.length][arr2.length];
}

/**
 * Clear the phoneme analysis cache
 */
export function clearPhonemeAnalysisCache(): void {
  PHONEME_ANALYSIS_CACHE.clear();
}

/**
 * Get cache statistics
 */
export function getPhonemeAnalysisCacheStats(): { size: number; hitRate: number } {
  return {
    size: PHONEME_ANALYSIS_CACHE.size,
    hitRate: 0 // Would need to track hits/misses for accurate rate
  };
}
