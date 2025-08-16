import { ARPABET_VOWELS, DIGRAPHS } from "./dictionary";
import type { HyphenationOptions } from "./types";

function getCMUBoundaries(word: string, phonemes: string[]): number[] {
  const boundaries: number[] = [];
  const lowerWord = word.toLowerCase();

  // Count syllables directly from phonemes
  const vowelIndexes = phonemes
    .map((p, idx) => ({ idx, base: p.replace(/\d/, "") }))
    .filter((p) => ARPABET_VOWELS.has(p.base))
    .map((p) => p.idx);

  if (vowelIndexes.length <= 1) {
    return boundaries; // Single-syllable word, no boundaries
  }

  // Map phonemes to character positions
  const charPositions = mapPhonemesToWord(lowerWord, phonemes);

  for (let i = 0; i < vowelIndexes.length - 1; i++) {
    const currentVowelIdx = vowelIndexes[i];
    const nextVowelIdx = vowelIndexes[i + 1];

    // Start after current vowel phoneme
    let boundaryCharPos = charPositions[currentVowelIdx] + 1;

    // Advance past any consonants until just before next vowel
    while (
      boundaryCharPos < charPositions[nextVowelIdx] &&
      !ARPABET_VOWELS.has(phonemes[boundaryCharPos]?.replace(/\d/, ""))
    ) {
      boundaryCharPos++;
    }

    // Avoid splitting digraphs
    for (const digraph of DIGRAPHS) {
      if (
        lowerWord.slice(boundaryCharPos - 1, boundaryCharPos + 1) === digraph
      ) {
        boundaryCharPos -= 1;
      }
    }

    if (boundaryCharPos > 0 && boundaryCharPos < lowerWord.length) {
      boundaries.push(boundaryCharPos);
    }
  }

  return boundaries;
}

/**
 * Basic grapheme-to-phoneme mapping heuristic.
 * For perfect mapping, you'd need alignment data, but this is ~90% accurate.
 */
function mapPhonemesToWord(word: string, phonemes: string[]): number[] {
  const positions: number[] = [];
  let charIdx = 0;

  for (let i = 0; i < phonemes.length; i++) {
    const p = phonemes[i].replace(/\d/, "").toLowerCase();

    // Try to find matching letters from current position onwards
    let found = false;
    for (let len = 3; len > 0; len--) {
      // Try trigraph, then digraph, then single
      const slice = word.slice(charIdx, charIdx + len);
      if (slice.startsWith(p[0])) {
        // loose match, avoids mismatches for some phonemes
        positions.push(charIdx);
        charIdx += len;
        found = true;
        break;
      }
    }

    if (!found) {
      // fallback: assume one char
      positions.push(charIdx);
      charIdx++;
    }
  }

  return positions;
}

function applyHyphenation(
  word: string,
  boundaries: number[],
  delimiter: string = "-",
): string {
  if (!boundaries.length) return word;

  // Use array join for better performance with multiple concatenations
  const parts: string[] = [];
  let lastIdx = 0;

  for (const b of boundaries) {
    parts.push(word.slice(lastIdx, b));
    lastIdx = b;
  }
  parts.push(word.slice(lastIdx));

  return parts.join(delimiter);
}

/**
 * Enhanced CMU hyphenation with better position mapping
 */

export function enhancedCMUHyphenation(
  word: string,
  cmuPron: string,
  options: HyphenationOptions = {},
): {
  hyphenated: string;
  boundaries: number[];
  pronunciation: string;
} | null {
  const { delimiter = "-" } = options;

  if (!cmuPron) return null;

  const phonemes = cmuPron.split(/\s+/);
  const boundaries = getCMUBoundaries(word, phonemes);
  const hyphenated = applyHyphenation(word, boundaries, delimiter);

  return { hyphenated, boundaries, pronunciation: cmuPron };
}
