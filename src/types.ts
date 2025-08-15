export interface SyllableCountOptions {
  /** Whether to use fallback syllable counting for unknown words */
  useFallback?: boolean;
  /** Custom fallback syllable counting function */
  fallbackCounter?: (word: string) => number;
  /** Whether to cache results for better performance */
  enableCache?: boolean;
  /** Maximum cache size (default: 1000) */
  maxCacheSize?: number;
}

export interface CMUDictEntry {
  word: string;
  pronunciation: string;
  syllables: number;
}

export interface SyllableCounter {
  count(word: string, options?: SyllableCountOptions): Promise<number>;
  countText(text: string, options?: SyllableCountOptions): Promise<number>;
  lookup(word: string): Promise<string | null>;
  getSyllableCount(word: string): number;
  clearCache(): void;
}

export interface SyllableInfo {
  /** The original word */
  word: string;
  /** Number of syllables */
  syllables: number;
  /** Hyphenated version of the word */
  hyphenated: string;
  /** Source of the syllable count: 'cmu' or 'fallback' */
  source: 'cmu' | 'fallback';
  /** CMU pronunciation if available */
  pronunciation?: string;
  /** Syllable boundaries for advanced analysis */
  syllableBoundaries?: number[];
}

export interface HyphenationOptions {
  /** Language/dialect: 'us' or 'uk' */
  dialect?: 'us' | 'uk';
  /** Whether to include syllable boundaries */
  includeBoundaries?: boolean;
  /** Custom hyphenation patterns */
  customPatterns?: Record<string, string>;
}

export type HyphenationPattern = {
  pattern: string;
  points: number[];
  exceptions?: string[];
};

export interface SmartHyphenationOptions {
  /** Whether to prefer CMU-based hyphenation */
  preferCMU?: boolean;
  /** Whether to use fallback algorithms for unknown words */
  useFallbackAlgorithms?: boolean;
}

export interface SmartHyphenationResult {
  /** Hyphenated version of the word */
  hyphenated: string;
  /** Syllable boundary positions */
  boundaries: number[];
  /** CMU pronunciation if available */
  pronunciation?: string;
  /** Source of hyphenation: 'cmu', 'fallback', or 'none' */
  source: 'cmu' | 'fallback' | 'none';
}

export interface CMUHyphenationResult {
  /** Hyphenated version of the word */
  hyphenated: string;
  /** Syllable boundary positions */
  boundaries: number[];
  /** CMU pronunciation */
  pronunciation: string;
}

export interface HyphenationStats {
  /** Whether the word has CMU pronunciation data */
  hasCMU: boolean;
  /** Whether the word has a known hyphenation pattern */
  hasKnownPattern: boolean;
  /** Number of vowels in the word */
  vowelCount: number;
  /** Estimated number of syllables */
  estimatedSyllables: number;
}
