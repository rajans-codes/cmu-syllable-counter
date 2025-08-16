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

export interface SyllableCountOptions {
  /** Whether to include syllable boundaries in the result */
  includeBoundaries?: boolean;
}

export interface HyphenationOptions {
  /** Whether to include syllable boundaries */
  includeBoundaries?: boolean;
  /** Custom hyphenation patterns */
  customPatterns?: Record<string, string>;
  /** Delimiter to use for hyphenation (default: '-') */
  delimiter?: string;
}