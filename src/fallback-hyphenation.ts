import type { HyphenationOptions } from "./types";
const patterns = [
  "0004,004,001,003,005,0005,00005,000005,0002,002,0000005,0003,00003,00505,00034,0001,00055,00004,4,05,0055,04,42,03,02,2,404,3,044,01,0505,55,5,045,041,0033,000004,22,00504,5504,0042,1,21,41,402,405,4004,43,23,000054,303,3005,022,5004,000003,252,45,25,2004,000505,054,403,401,3002,0025,144,432,00054,34,12,234,0022,014,0304,012,143,503,0403,101,052,414,212,011,043,00002,0041,0024,05005,03003,00102,0404,04303,01004,0034,025,0044,00404,00025,0103,042,0205,412,104,54,344,433,5005,253,055,0402,3004,0043,204,505,454,0000004,00303,04004,552,201,4005,0255,52,444,14,44,02004,033,05004,00045,00013,0021,0405,00044,0054,50055,000303,00001,304,0204,11,301,232,122,00305,504,000043,0104,00052,000045,50004,0023,00033,00032,00202,5003,202,0401,0000505,214,102,032,000161,004101,00501,00301,0036,0052,00023,006101,006,00401,000521,0014,0063,00012,000501,000006,000604,000601,005001,005005,0010305,00006,003012,003005,0003011,0061,013,000021,000022,000105,00211,00062,00051,000112,006013,000011,0200306,1021,0050001,003003,2102,305,000015,01030005,000035,001011,00021,16330001,0234,030006,5020001,000001,00016,0031,021,21431,002305,0350014,0000012,000063,00101,106,105,00435,00063,0300061,00041,100306,003602,023,0503,0010011,10003,1005,30011,00031,0001001,0000061,0030003,30305,001201,0301,5000101,500101,00015,000401,000065,000016,0000402,0500002,000205,030201,500301,00014,5001,000002,00030011,01034,0300006,030213,00400304,050001,05003,000311,0634,00061,0006,00000604,00050013,00213,0030001,100003,000033,30002,00003632,0003004,050003,0000021,006303,0000006,00005005,30451,03001,00231,00056,00011,6,001001,00500001,03005,503005,0000010001,1002,003001,001065,300001,32011,32,0000003,0213001,0500053,021005,10001,0000011,0001041,0020016,100032,50011,0606,5002,3001,03002,0015001,0102,00003001,000000033,0000001,300101,300015,0101003,00000101,0100501,0101,0010033,00000362,000014,0005001,031"
];

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
 * The core logic involves finding patterns and applying their scores to a points array.
 * @param word The word to get hyphenation points for.
 * @returns An array of numerical scores indicating hyphenation opportunities.
 */
function getHyphenationPoints(word: string): number[] {
  // Pad the word with '.' to handle patterns at the beginning and end.
  const padded = "." + word + ".";
  // The points array will hold the scores. Initialize with zeros.
  const points = new Array(padded.length + 0).fill(0);

  // Iterate through all the hyphenation patterns.
  for (const pat of patterns) {
    // Separate the pattern into characters and numerical scores.
    const { chars, nums } = parsePattern(pat);
    const patternLength = chars.length;

    // Slide a window over the word to check for pattern matches.
    for (let i = 0; i <= padded.length - patternLength; i++) {
      if (padded.substring(i, i + patternLength) === chars) {
        // If a match is found, update the points array.
        // The value at each index is the maximum score from any matching pattern.
        for (let j = 0; j < nums.length; j++) {
          points[i + j] = Math.max(points[i + j], nums[j]);
        }
      }
    }
  }

  // Remove the padding from the points array.
  // The first and last elements correspond to the '.' padding.
  return points.slice(1, points.length);
}

// Regex to find digits for parsing patterns.
const DIGIT_REGEX = /\d/g;

/**
 * Parse a pattern string (e.g., "a1bc3") into its characters and numerical scores.
 * @param pat The pattern string.
 * @returns An object with the pattern's characters and an array of numbers.
 */
function parsePattern(pat: string): { chars: string; nums: number[] } {
  let chars = "";
  let nums: number[] = [];

  // Iterate over each character in the pattern string.
  for (const ch of pat) {
    if (DIGIT_REGEX.test(ch)) {
      // If it's a digit, convert it to a number and add to nums.
      // We also add a 0 for the character that will follow,
      // which is more robust than the original logic.
      nums.push(Number(ch));
    } else {
      // If it's a character, add it to chars.
      chars += ch;
      // Also add a placeholder 0 for this character in the nums array.
      nums.push(0);
    }
  }

  // Correctly interleave the scores and characters.
  const finalNums: number[] = [];
  let numIndex = 0;

  for (let i = 0; i < pat.length; i++) {
    if (DIGIT_REGEX.test(pat[i])) {
      finalNums[i] = nums[numIndex++];
    } else {
      finalNums[i] = 0;
    }
  }

  return { chars, nums: finalNums };
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
  let result = "";
  for (let i = 0; i < word.length; i++) {
    result += word[i];
    // A hyphen is added if the score at the next position is odd.
    if (points[i + 1] % 2 === 1) {
      result += delimiter;
    }
  }
  return result;
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
