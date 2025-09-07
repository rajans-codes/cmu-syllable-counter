// Rules for suffix patterns that typically affect syllable count
const RULES = {
  // Suffixes that usually subtract one from the naive count
  singleSyllableSuffixes: ["tion", "sion", "cious", "tious"],

  // Suffixes that usually add one syllable
  plusOneSyllableSuffixes: ["ful", "ly", "ness", "ment"],
};

/**
 * Estimates the number of syllables in an English word.
 * Uses vowel group logic and rule-based adjustments with exceptions.
 * @param {string} word - The word to analyze.
 * @returns {number} Estimated syllable count (minimum 1).
 */
/**
 * Advanced fallback syllable counter
 * Tries to approximate English syllables when dictionary lookup fails
 */
export function enhancedFallbackSyllableCount(word: string): number {
  if (!word || word.length === 0) return 0;

  const lowerWord = word.toLowerCase();

  // 1. Handle multi-word or hyphenated compounds
  if (lowerWord.includes(" ") || lowerWord.includes("-")) {
    return lowerWord
      .split(/[- ]+/)
      .reduce((sum, w) => sum + enhancedFallbackSyllableCount(w), 0);
  }

  // 3. Early return for very short words
  if (lowerWord.length <= 2) {
    return 1;
  }

  // 4. Base syllable count using vowel group transitions
  let count = 0;
  const vowels = "aeiouy";
  let prevCharIsVowel = false;

  for (let i = 0; i < lowerWord.length; i++) {
    const char = lowerWord[i];
    const isVowel = vowels.includes(char);
    if (isVowel && !prevCharIsVowel) {
      count++;
    }
    prevCharIsVowel = isVowel;
  }

  // 5. Rule-based Adjustments

  // Subtract one if ending in known single-syllable suffixes
  for (const suffix of RULES.singleSyllableSuffixes) {
    if (lowerWord.endsWith(suffix)) {
      count = Math.max(1, count - 1);
    }
  }

  // Handle silent 'e' at the end
  if (
    lowerWord.endsWith("e") &&
    !["le", "ee", "oe", "ye"].some((sfx) => lowerWord.endsWith(sfx)) &&
    count > 1
  ) {
    count--;
  }

  // Add one for consonant + "le" endings (e.g., "table")
  if (
    lowerWord.length > 2 &&
    lowerWord.endsWith("le") &&
    !vowels.includes(lowerWord[lowerWord.length - 3])
  ) {
    count++;
  }

  // Add one for past tense "-ed" if pronounced as a full syllable (e.g., "wanted")
  if (lowerWord.endsWith("ed") && /[td]$/.test(lowerWord.slice(0, -2))) {
    count++;
  }

  // Add one for plural "-es" if pronounced (e.g., "passes")
  if (lowerWord.endsWith("es") && /[^sxz]$/.test(lowerWord.slice(0, -2))) {
    count++;
  }

  // Ensure at least one syllable
  return Math.max(1, count);
}
