// Main syllable counting function
export { getSyllableCount } from "./core";

// Dictionary functionality
export { cmuDictionary } from "./dictionary";

// Syllable counter class
export { syllableCounter } from "./syllable-counter";

// Syllable counter types
export type { SyllableInfo, SyllableCountOptions, HyphenationOptions } from "./syllable-counter";

// Enhanced hyphenation function
export { enhancedHyphenateWord, getSyllableBoundaries } from "./fallback-hyphenation";

// Fallback syllable counting algorithm
export { enhancedFallbackSyllableCount } from "./fallback-syllable-count";
