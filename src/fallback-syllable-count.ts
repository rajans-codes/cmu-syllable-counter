import { VOWEL_PATTERNS } from "./dictionary";

// Pre-compiled regex patterns for better performance
const SILENT_E_PATTERN = /(ee|oe)$/;
const CONSONANT_LE_PATTERN = /[bcdfghjklmnpqrstvwxyz]le$/;
const TION_SION_PATTERN = /(tion|sion)$/;
const IOUS_PATTERN = /ious$/;
const Y_AS_VOWEL_PATTERN = /[bcdfghjklmnpqrstvwxz]y/;

// Compound word patterns
const COMPOUND_PATTERNS = [
  /every(one|thing|where)/,
  /some(one|thing|where|body)/,
  /any(one|thing|where|body)/,
  /no(one|thing|where|body)/,
];

// Irregular / exception cases
const EXCEPTIONS: Record<string, number> = {
  choir: 2,
  colonel: 2,
  business: 2,
  one: 1,
  two: 1,
  once: 1,
  done: 1,
  queue: 1,
  beautiful: 3,
  computer: 3,
  action: 2,
  vision: 2,
  nation: 2,
  curious: 3,
  serious: 3,
  table: 2,
};

/**
 * Advanced fallback syllable counter
 * Tries to approximate English syllables when dictionary lookup fails
 */
export function enhancedFallbackSyllableCount(word: string): number {
  if (!word || word.length === 0) return 0;

  // Check if it's a sentence (contains spaces)
  if (word.includes(" ")) {
    const words = word.split(" ");
    return words.reduce(
      (total, w) => total + enhancedFallbackSyllableCount(w),
      0,
    );
  }

  // Early return for very short words
  if (word.length <= 2) return 1;

  const lowerWord = word.toLowerCase();

  // Check exceptions first
  if (EXCEPTIONS[lowerWord] !== undefined) return EXCEPTIONS[lowerWord];

  // Count vowel groups first (before suffix removal)
  const vowelMatches = lowerWord.match(VOWEL_PATTERNS);
  let syllableCount = vowelMatches ? vowelMatches.length : 0;

  // Handle 'y' as vowel if no standard vowels
  if (!vowelMatches && Y_AS_VOWEL_PATTERN.test(lowerWord)) {
    syllableCount++;
  }

  // Handle compound words
  for (const pattern of COMPOUND_PATTERNS) {
    if (pattern.test(lowerWord)) {
      syllableCount = Math.max(syllableCount, 3);
      break;
    }
  }

  // Handle "-ious" (often two syllables: "curious" → 3)
  if (IOUS_PATTERN.test(lowerWord)) {
    syllableCount++;
  }

  // Handle words ending in consonant + "le" (e.g. "bottle", "little")
  if (CONSONANT_LE_PATTERN.test(lowerWord)) {
    syllableCount++;
  }

  // Handle "-tion", "-sion" (usually one syllable)
  if (TION_SION_PATTERN.test(lowerWord)) {
    syllableCount = Math.max(1, syllableCount - 1);
  }

  // Silent 'e' at end (but only if not part of "ee" or "oe")
  if (
    lowerWord.endsWith("e") &&
    !SILENT_E_PATTERN.test(lowerWord) &&
    syllableCount > 1
  ) {
    syllableCount--;
  }

  return Math.max(1, syllableCount);
}
