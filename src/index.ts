// Main syllable counting function
export { getSyllableCount, getHyphenatedString } from "./core";

// Dictionary functionality
export { cmuDictionary } from "./dictionary";

// Essential types for users
export type { 
  SyllableCountOptions, 
  CoreHyphenationOptions, 
  SyllableCountResult, 
  HyphenationResult 
} from "./core";
