// Main syllable counting function
export { getSyllableCount, getHyphenatedString } from "./core";

// Dictionary functionality
export { 
  cmuDictionary,
  findWordsBySyllableCount,
  findWordsByStressPattern,
  findWordsByComplexity,
  findWordsByVowelCount,
  getRandomWords,
  findRhymingWords,
  getAllWords,
  getDictionarySize,
  isWordInDictionary
} from "./dictionary";

// Raw dictionary data for custom utilities
export { CMU_DICTIONARY } from "./dictionary-data-compressed";

// Essential types for users
export type { 
  SyllableCountOptions, 
  CoreHyphenationOptions, 
  SyllableCountResult, 
  HyphenationResult,
  WordAnalysis,
  WordSearchOptions
} from "./core";

// Dictionary data types
export type { CMUDictionaryEntry, CMUDictionary } from "./dictionary-types";
