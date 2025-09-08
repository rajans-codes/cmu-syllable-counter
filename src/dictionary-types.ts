// CMU Dictionary Types

export interface CMUDictionaryEntry {
  s: number;  // syllable count
  p: string;  // pronunciation (ARPAbet)
  h?: string; // hyphenation (optional)
}

export type CMUDictionary = Record<string, CMUDictionaryEntry>;
