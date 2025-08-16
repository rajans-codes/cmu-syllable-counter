import type { HyphenationOptions } from './types';
// @ts-ignore
import patterns from './pattern/en-us.js'; 

// Hyphenation exceptions from TeX / libhyphen
const HYPHENATION_EXCEPTIONS = new Set([
  'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was',
  'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'man', 'new',
  'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'its', 'let', 'put',
  'say', 'she', 'too', 'use'
]);

/**
 * Hyphenate a word or sentence using Knuth–Liang algorithm
 */
export function enhancedHyphenateWord(word: string, options: HyphenationOptions = {}): string {
  const { customPatterns = {}, delimiter = '-' } = options;
  
  if (!word || word.length === 0) return word;

  // Check if it's a sentence (contains spaces)
  if (word.includes(' ')) {
    const words = word.split(' ');
    return words.map(w => enhancedHyphenateWord(w, options)).join(' ');
  }

  // Single word processing
  if (word.length < 3) return word;

  const lowerWord = word.toLowerCase();

  // Check custom patterns first
  if (customPatterns[lowerWord]) {
    return customPatterns[lowerWord];
  }

  // Exceptions second
  if (HYPHENATION_EXCEPTIONS.has(lowerWord)) return word;

  const points = getHyphenationPoints(lowerWord);

  // Build the hyphenated string
  return buildHyphenatedWord(word, points, delimiter);
}

/**
 * Compute hyphenation points using Knuth–Liang algorithm
 */
function getHyphenationPoints(word: string): number[] {
  // Add '.' padding (as in TeX algorithm)
  const padded = '.' + word + '.';
  const points = new Array(padded.length + 1).fill(0);

  for (const pat of patterns) {
    const { chars, nums } = parsePattern(pat);

    let idx = padded.indexOf(chars);
    while (idx !== -1) {
      for (let i = 0; i < nums.length; i++) {
        points[idx + i] = Math.max(points[idx + i], nums[i]);
      }
      idx = padded.indexOf(chars, idx + 1);
    }
  }

  // Remove padding
  return points.slice(1, points.length - 1);
}

/**
 * Parse pattern like "a1bc3" → chars="abc", nums=[0,1,0,3]
 */
function parsePattern(pat: string): { chars: string; nums: number[] } {
  const chars = pat.replace(/\d/g, '');
  const nums: number[] = [];
  let lastWasNum = true; // start with virtual 0

  for (const ch of pat) {
    if (/\d/.test(ch)) {
      nums.push(Number(ch));
      lastWasNum = true;
    } else {
      if (!lastWasNum) nums.push(0); // implicit zero between letters
      nums.push(0); // placeholder for after this letter
      lastWasNum = false;
    }
  }

  return { chars, nums };
}

/**
 * Build hyphenated word from points
 * Odd numbers = hyphenation points
 */
function buildHyphenatedWord(word: string, points: number[], delimiter: string = '-'): string {
  let result = '';
  for (let i = 0; i < word.length; i++) {
    result += word[i];
    if (points[i + 1] % 2 === 1) {
      result += delimiter;
    }
  }
  return result;
}

/**
 * Get syllable boundaries (indexes where hyphens would be)
 */
export function getSyllableBoundaries(word: string, options: HyphenationOptions = {}): number[] {
  const { includeBoundaries = true, customPatterns = {} } = options;
  
  if (!includeBoundaries) return [];
  
  if (!word || word.length === 0) return [];

  // Check if it's a sentence (contains spaces)
  if (word.includes(' ')) {
    const words = word.split(' ');
    const allBoundaries: number[] = [];
    let offset = 0;
    
    for (const w of words) {
      const boundaries = getSyllableBoundaries(w, options);
      allBoundaries.push(...boundaries.map(b => b + offset));
      offset += w.length + 1; // +1 for space
    }
    
    return allBoundaries;
  }

  // Check custom patterns first
  if (customPatterns[word.toLowerCase()]) {
    // For custom patterns, we can't determine boundaries, so return empty
    return [];
  }

  const points = getHyphenationPoints(word);
  const boundaries: number[] = [];

  for (let i = 1; i < points.length - 1; i++) {
    if (points[i] % 2 === 1) boundaries.push(i);
  }

  return boundaries;
}



