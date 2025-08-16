import { VOWEL_PATTERNS } from "./dictionary";

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

  // Irregular / exception cases
  const exceptions: Record<string, number> = {
    choir: 2,
    colonel: 2,
    business: 2,
    one: 1,
    two: 1,
    once: 1,
    done: 1,
    queue: 1,
  };
  if (exceptions[lowerWord] !== undefined) return exceptions[lowerWord];

  let processedWord = lowerWord;

  // Remove only safe suffixes (don’t over-trim short words like "sing")
  processedWord = processedWord.replace(
    /(ingly|edly|ness|ment|ship|less|ful|ous|able|ible|tion|sion)$/,
    "",
  );
  processedWord = processedWord.replace(/(ing|ed|ly|er|est)$/, (match) =>
    processedWord.length > match.length + 2 ? "" : match,
  );

  // Count vowel groups
  const vowelMatches = processedWord.match(VOWEL_PATTERNS);
  let syllableCount = vowelMatches ? vowelMatches.length : 0;

  // Handle 'y' as vowel if no standard vowels
  if (!vowelMatches && /[bcdfghjklmnpqrstvwxz]y/.test(processedWord)) {
    syllableCount++;
  }

  // Silent 'e' at end (but only if not part of "ee" or "oe")
  if (
    processedWord.endsWith("e") &&
    !processedWord.match(/(ee|oe)$/) &&
    syllableCount > 1
  ) {
    syllableCount--;
  }

  // Handle words ending in consonant + "le" (e.g. "bottle", "little")
  if (processedWord.match(/[bcdfghjklmnpqrstvwxyz]le$/)) {
    syllableCount++;
  }

  // Handle "-tion", "-sion" (usually one syllable)
  if (processedWord.match(/(tion|sion)$/)) {
    syllableCount = Math.max(1, syllableCount - 1);
  }

  // Handle "-ious" (often two syllables: "curious" → 3)
  if (processedWord.match(/ious$/)) {
    syllableCount++;
  }

  // Compound words
  const compoundPatterns = [
    /every(one|thing|where)/,
    /some(one|thing|where|body)/,
    /any(one|thing|where|body)/,
    /no(one|thing|where|body)/,
  ];
  for (const pattern of compoundPatterns) {
    if (pattern.test(processedWord)) {
      syllableCount = Math.max(syllableCount, 3);
      break;
    }
  }

  return Math.max(1, syllableCount);
}
