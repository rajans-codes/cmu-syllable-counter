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

// Essential types for users
export type { 
  SyllableCountOptions, 
  CoreHyphenationOptions, 
  SyllableCountResult, 
  HyphenationResult,
  WordAnalysis,
  WordSearchOptions
} from "./core";
