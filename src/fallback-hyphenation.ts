import type { HyphenationOptions } from "./syllable-counter";
import enUsPatterns from "./pattern/en-us";

// Hyphenation exceptions from TeX / libhyphen
// These are words that should not be hyphenated
const HYPHENATION_EXCEPTIONS = new Set([
  "the", "and", "for", "are", "but", "not", "you", "all", "can", "had", "her",
  "was", "one", "our", "out", "day", "get", "has", "him", "his", "how", "man",
  "new", "now", "old", "see", "two", "way", "who", "boy", "did", "its", "let",
  "put", "say", "she", "too", "use",
]);

/**
 * Hyphenate a word or sentence using the Knuth–Liang algorithm.
 * @param word The word or sentence to hyphenate.
 * @param options Hyphenation options, including custom patterns and delimiter.
 * @returns The hyphenated word or sentence.
 */
export function enhancedHyphenateWord(
  word: string,
  options: HyphenationOptions = {},
): string {
  const { customPatterns = {}, delimiter = "-" } = options;

  if (!word || word.length === 0) {
    return word;
  }

  // Handle sentences by recursively calling for each word.
  if (word.includes(" ")) {
    const words = word.split(" ");
    return words.map((w) => enhancedHyphenateWord(w, options)).join(" ");
  }

  // Single word processing
  const lowerWord = word.toLowerCase();

  // 1. Check custom patterns first for a direct match.
  if (customPatterns[lowerWord]) {
    return customPatterns[lowerWord];
  }

  // 2. Check a list of known exceptions.
  if (HYPHENATION_EXCEPTIONS.has(lowerWord)) {
    return word;
  }

  // Words shorter than a certain length are typically not hyphenated.
  if (word.length < 3) {
    return word;
  }

  // Compute the hyphenation points using the main algorithm.
  const points = getHyphenationPoints(lowerWord);

  // Build the final hyphenated string.
  return buildHyphenatedWord(word, points, delimiter);
}

/**
 * Compute hyphenation points using the Knuth–Liang algorithm.
 * @param word The word to get hyphenation points for.
 * @returns An array of numerical scores indicating hyphenation opportunities.
 */
function getHyphenationPoints(word: string): number[] {
  const [patterns, patternsTree] = enUsPatterns;
  
  // Pad the word with '.' to handle patterns at the beginning and end.
  const padded = "." + word + ".";
  const points = new Array(padded.length).fill(0);

  // Find all possible patterns in the word
  for (let i = 0; i < padded.length; i++) {
    let currentNode = patternsTree;
    let pattern = "";
    
    for (let j = i; j < padded.length; j++) {
      const char = padded[j];
      pattern += char;
      
      if (currentNode[char]) {
        currentNode = currentNode[char] as any;
        
        // Check if we have a complete pattern
        if (typeof currentNode === 'number') {
          // Apply the pattern score
          const score = currentNode;
          for (let k = 0; k < pattern.length; k++) {
            points[i + k] = Math.max(points[i + k], score);
          }
          break;
        }
      } else {
        break;
      }
    }
  }

  // Remove the padding from the points array.
  return points.slice(1, points.length - 1);
}

/**
 * Build a hyphenated word from the original word and its hyphenation points.
 * A hyphen is inserted after a character if the point score for the next position is odd.
 * @param word The original word.
 * @param points The array of hyphenation scores.
 * @param delimiter The character to use for hyphenation.
 * @returns The final hyphenated word.
 */
function buildHyphenatedWord(
  word: string,
  points: number[],
  delimiter: string = "-",
): string {
  const result: string[] = [];
  
  for (let i = 0; i < word.length; i++) {
    result.push(word[i]);
    // A hyphen is added if the score at the next position is odd.
    if (points[i + 1] % 2 === 1) {
      result.push(delimiter);
    }
  }
  
  return result.join("");
}

/**
 * Get the syllable boundaries (indexes where hyphens would be placed).
 * This function returns the positions within the word where a hyphen can be inserted.
 * @param word The word or sentence.
 * @param options Hyphenation options.
 * @returns An array of indices where hyphens can be placed.
 */
export function getSyllableBoundaries(
  word: string,
  options: HyphenationOptions = {},
): number[] {
  const { includeBoundaries = true, customPatterns = {} } = options;

  if (!includeBoundaries) {
    return [];
  }

  if (!word || word.length === 0) {
    return [];
  }

  // Handle sentences by processing each word and adjusting the boundaries' offset.
  if (word.includes(" ")) {
    const words = word.split(" ");
    const allBoundaries: number[] = [];
    let offset = 0;

    for (const w of words) {
      const boundaries = getSyllableBoundaries(w, options);
      // Map the boundaries to the correct position within the full sentence.
      allBoundaries.push(...boundaries.map((b) => b + offset));
      offset += w.length + 1; // Add 1 for the space.
    }
    return allBoundaries;
  }

  // Check for a custom pattern. If found, we can't reliably return boundaries.
  if (customPatterns[word.toLowerCase()]) {
    return [];
  }

  // Get the hyphenation points and convert them to boundary indices.
  const points = getHyphenationPoints(word);
  const boundaries: number[] = [];

  // A boundary exists at index `i` if the score at that position is odd.
  for (let i = 1; i < points.length - 1; i++) {
    if (points[i] % 2 === 1) {
      boundaries.push(i);
    }
  }

  return boundaries;
}
