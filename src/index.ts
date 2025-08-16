// Main syllable counting function
export { getSyllableCount } from "./core";

// Dictionary functionality
export { cmuDictionary } from "./dictionary";

// Enhanced hyphenation function
export { enhancedHyphenateWord } from "./fallback-hyphenation";

// Fallback syllable counting algorithm
export { enhancedFallbackSyllableCount } from "./fallback-syllable-count";

// Core types
export type { SyllableInfo, HyphenationOptions } from "./types";
