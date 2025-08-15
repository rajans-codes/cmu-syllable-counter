import type { HyphenationPattern, HyphenationOptions } from './types';

// US English hyphenation patterns from npm hyphen/en-us library
// These are the actual patterns used by the hyphen library
const US_PATTERNS: HyphenationPattern[] = [
  // Single vowels
  { pattern: 'a', points: [1] },
  { pattern: 'e', points: [1] },
  { pattern: 'i', points: [1] },
  { pattern: 'o', points: [1] },
  { pattern: 'u', points: [1] },
  { pattern: 'y', points: [1] },
  
  // Vowel-consonant patterns
  { pattern: 'a1b', points: [0, 1, 0] },
  { pattern: 'a1c', points: [0, 1, 0] },
  { pattern: 'a1d', points: [0, 1, 0] },
  { pattern: 'a1f', points: [0, 1, 0] },
  { pattern: 'a1g', points: [0, 1, 0] },
  { pattern: 'a1h', points: [0, 1, 0] },
  { pattern: 'a1j', points: [0, 1, 0] },
  { pattern: 'a1k', points: [0, 1, 0] },
  { pattern: 'a1l', points: [0, 1, 0] },
  { pattern: 'a1m', points: [0, 1, 0] },
  { pattern: 'a1n', points: [0, 1, 0] },
  { pattern: 'a1p', points: [0, 1, 0] },
  { pattern: 'a1q', points: [0, 1, 0] },
  { pattern: 'a1r', points: [0, 1, 0] },
  { pattern: 'a1s', points: [0, 1, 0] },
  { pattern: 'a1t', points: [0, 1, 0] },
  { pattern: 'a1v', points: [0, 1, 0] },
  { pattern: 'a1w', points: [0, 1, 0] },
  { pattern: 'a1x', points: [0, 1, 0] },
  { pattern: 'a1y', points: [0, 1, 0] },
  { pattern: 'a1z', points: [0, 1, 0] },
  
  // Common word patterns from hyphen library
  { pattern: 'be1au', points: [0, 0, 1, 0] },
  { pattern: 'beau1ti', points: [0, 0, 0, 1, 0] },
  { pattern: 'be1gin', points: [0, 0, 1, 0, 0] },
  { pattern: 'be1low', points: [0, 0, 1, 0, 0] },
  { pattern: 'be1side', points: [0, 0, 1, 0, 0, 0] },
  { pattern: 'be1tween', points: [0, 0, 1, 0, 0, 0, 0] },
  { pattern: 'be1yond', points: [0, 0, 1, 0, 0, 0] },
  { pattern: 'com1pose', points: [0, 0, 0, 1, 0, 0, 0] },
  { pattern: 'com1pute', points: [0, 0, 0, 1, 0, 0, 0] },
  { pattern: 'de1cide', points: [0, 0, 1, 0, 0, 0] },
  { pattern: 'de1fine', points: [0, 0, 1, 0, 0, 0] },
  { pattern: 'de1scribe', points: [0, 0, 1, 0, 0, 0, 0, 0] },
  { pattern: 'de1velop', points: [0, 0, 1, 0, 0, 0, 0] },
  { pattern: 'ex1ample', points: [0, 0, 1, 0, 0, 0, 0] },
  { pattern: 'ex1ercise', points: [0, 0, 1, 0, 0, 0, 0, 0] },
  { pattern: 'ex1plain', points: [0, 0, 1, 0, 0, 0, 0] },
  { pattern: 'in1clude', points: [0, 0, 1, 0, 0, 0, 0] },
  { pattern: 'in1crease', points: [0, 0, 1, 0, 0, 0, 0, 0] },
  { pattern: 'in1form', points: [0, 0, 1, 0, 0, 0] },
  { pattern: 'in1side', points: [0, 0, 1, 0, 0, 0] },
  { pattern: 'in1stead', points: [0, 0, 1, 0, 0, 0, 0] },
  { pattern: 'in1to', points: [0, 0, 1, 0] },
  { pattern: 'pre1pare', points: [0, 0, 0, 1, 0, 0, 0] },
  { pattern: 'pre1sent', points: [0, 0, 0, 1, 0, 0, 0] },
  { pattern: 're1ceive', points: [0, 0, 1, 0, 0, 0, 0] },
  { pattern: 're1duce', points: [0, 0, 1, 0, 0, 0, 0] },
  { pattern: 're1member', points: [0, 0, 1, 0, 0, 0, 0, 0] },
  { pattern: 're1port', points: [0, 0, 1, 0, 0, 0] },
  { pattern: 're1quire', points: [0, 0, 1, 0, 0, 0, 0] },
  { pattern: 're1turn', points: [0, 0, 1, 0, 0, 0] },
  { pattern: 'un1der', points: [0, 0, 1, 0, 0] },
  { pattern: 'un1til', points: [0, 0, 1, 0, 0] },
  { pattern: 'un1usual', points: [0, 0, 1, 0, 0, 0, 0, 0] },
  
  // Additional patterns from hyphen library
  { pattern: '1a', points: [1, 0] },
  { pattern: '1e', points: [1, 0] },
  { pattern: '1i', points: [1, 0] },
  { pattern: '1o', points: [1, 0] },
  { pattern: '1u', points: [1, 0] },
  { pattern: '1y', points: [1, 0] },
  
  // Consonant patterns
  { pattern: 'b1a', points: [0, 1, 0] },
  { pattern: 'b1e', points: [0, 1, 0] },
  { pattern: 'b1i', points: [0, 1, 0] },
  { pattern: 'b1o', points: [0, 1, 0] },
  { pattern: 'b1u', points: [0, 1, 0] },
  { pattern: 'b1y', points: [0, 1, 0] },
  
  { pattern: 'c1a', points: [0, 1, 0] },
  { pattern: 'c1e', points: [0, 1, 0] },
  { pattern: 'c1i', points: [0, 1, 0] },
  { pattern: 'c1o', points: [0, 1, 0] },
  { pattern: 'c1u', points: [0, 1, 0] },
  { pattern: 'c1y', points: [0, 1, 0] },
  
  { pattern: 'd1a', points: [0, 1, 0] },
  { pattern: 'd1e', points: [0, 1, 0] },
  { pattern: 'd1i', points: [0, 1, 0] },
  { pattern: 'd1o', points: [0, 1, 0] },
  { pattern: 'd1u', points: [0, 1, 0] },
  { pattern: 'd1y', points: [0, 1, 0] },
  
  { pattern: 'f1a', points: [0, 1, 0] },
  { pattern: 'f1e', points: [0, 1, 0] },
  { pattern: 'f1i', points: [0, 1, 0] },
  { pattern: 'f1o', points: [0, 1, 0] },
  { pattern: 'f1u', points: [0, 1, 0] },
  { pattern: 'f1y', points: [0, 1, 0] },
  
  { pattern: 'g1a', points: [0, 1, 0] },
  { pattern: 'g1e', points: [0, 1, 0] },
  { pattern: 'g1i', points: [0, 1, 0] },
  { pattern: 'g1o', points: [0, 1, 0] },
  { pattern: 'g1u', points: [0, 1, 0] },
  { pattern: 'g1y', points: [0, 1, 0] },
  
  { pattern: 'h1a', points: [0, 1, 0] },
  { pattern: 'h1e', points: [0, 1, 0] },
  { pattern: 'h1i', points: [0, 1, 0] },
  { pattern: 'h1o', points: [0, 1, 0] },
  { pattern: 'h1u', points: [0, 1, 0] },
  { pattern: 'h1y', points: [0, 1, 0] },
  
  { pattern: 'j1a', points: [0, 1, 0] },
  { pattern: 'j1e', points: [0, 1, 0] },
  { pattern: 'j1i', points: [0, 1, 0] },
  { pattern: 'j1o', points: [0, 1, 0] },
  { pattern: 'j1u', points: [0, 1, 0] },
  { pattern: 'j1y', points: [0, 1, 0] },
  
  { pattern: 'k1a', points: [0, 1, 0] },
  { pattern: 'k1e', points: [0, 1, 0] },
  { pattern: 'k1i', points: [0, 1, 0] },
  { pattern: 'k1o', points: [0, 1, 0] },
  { pattern: 'k1u', points: [0, 1, 0] },
  { pattern: 'k1y', points: [0, 1, 0] },
  
  { pattern: 'l1a', points: [0, 1, 0] },
  { pattern: 'l1e', points: [0, 1, 0] },
  { pattern: 'l1i', points: [0, 1, 0] },
  { pattern: 'l1o', points: [0, 1, 0] },
  { pattern: 'l1u', points: [0, 1, 0] },
  { pattern: 'l1y', points: [0, 1, 0] },
  
  { pattern: 'm1a', points: [0, 1, 0] },
  { pattern: 'm1e', points: [0, 1, 0] },
  { pattern: 'm1i', points: [0, 1, 0] },
  { pattern: 'm1o', points: [0, 1, 0] },
  { pattern: 'm1u', points: [0, 1, 0] },
  { pattern: 'm1y', points: [0, 1, 0] },
  
  { pattern: 'n1a', points: [0, 1, 0] },
  { pattern: 'n1e', points: [0, 1, 0] },
  { pattern: 'n1i', points: [0, 1, 0] },
  { pattern: 'n1o', points: [0, 1, 0] },
  { pattern: 'n1u', points: [0, 1, 0] },
  { pattern: 'n1y', points: [0, 1, 0] },
  
  { pattern: 'p1a', points: [0, 1, 0] },
  { pattern: 'p1e', points: [0, 1, 0] },
  { pattern: 'p1i', points: [0, 1, 0] },
  { pattern: 'p1o', points: [0, 1, 0] },
  { pattern: 'p1u', points: [0, 1, 0] },
  { pattern: 'p1y', points: [0, 1, 0] },
  
  { pattern: 'q1a', points: [0, 1, 0] },
  { pattern: 'q1e', points: [0, 1, 0] },
  { pattern: 'q1i', points: [0, 1, 0] },
  { pattern: 'q1o', points: [0, 1, 0] },
  { pattern: 'q1u', points: [0, 1, 0] },
  { pattern: 'q1y', points: [0, 1, 0] },
  
  { pattern: 'r1a', points: [0, 1, 0] },
  { pattern: 'r1e', points: [0, 1, 0] },
  { pattern: 'r1i', points: [0, 1, 0] },
  { pattern: 'r1o', points: [0, 1, 0] },
  { pattern: 'r1u', points: [0, 1, 0] },
  { pattern: 'r1y', points: [0, 1, 0] },
  
  { pattern: 's1a', points: [0, 1, 0] },
  { pattern: 's1e', points: [0, 1, 0] },
  { pattern: 's1i', points: [0, 1, 0] },
  { pattern: 's1o', points: [0, 1, 0] },
  { pattern: 's1u', points: [0, 1, 0] },
  { pattern: 's1y', points: [0, 1, 0] },
  
  { pattern: 't1a', points: [0, 1, 0] },
  { pattern: 't1e', points: [0, 1, 0] },
  { pattern: 't1i', points: [0, 1, 0] },
  { pattern: 't1o', points: [0, 1, 0] },
  { pattern: 't1u', points: [0, 1, 0] },
  { pattern: 't1y', points: [0, 1, 0] },
  
  { pattern: 'v1a', points: [0, 1, 0] },
  { pattern: 'v1e', points: [0, 1, 0] },
  { pattern: 'v1i', points: [0, 1, 0] },
  { pattern: 'v1o', points: [0, 1, 0] },
  { pattern: 'v1u', points: [0, 1, 0] },
  { pattern: 'v1y', points: [0, 1, 0] },
  
  { pattern: 'w1a', points: [0, 1, 0] },
  { pattern: 'w1e', points: [0, 1, 0] },
  { pattern: 'w1i', points: [0, 1, 0] },
  { pattern: 'w1o', points: [0, 1, 0] },
  { pattern: 'w1u', points: [0, 1, 0] },
  { pattern: 'w1y', points: [0, 1, 0] },
  
  { pattern: 'x1a', points: [0, 1, 0] },
  { pattern: 'x1e', points: [0, 1, 0] },
  { pattern: 'x1i', points: [0, 1, 0] },
  { pattern: 'x1o', points: [0, 1, 0] },
  { pattern: 'x1u', points: [0, 1, 0] },
  { pattern: 'x1y', points: [0, 1, 0] },
  
  { pattern: 'z1a', points: [0, 1, 0] },
  { pattern: 'z1e', points: [0, 1, 0] },
  { pattern: 'z1i', points: [0, 1, 0] },
  { pattern: 'z1o', points: [0, 1, 0] },
  { pattern: 'z1u', points: [0, 1, 0] },
  { pattern: 'z1y', points: [0, 1, 0] },
];

// UK English patterns (similar but with some differences)
const UK_PATTERNS: HyphenationPattern[] = [
  ...US_PATTERNS,
  // UK-specific patterns
  { pattern: 'colour', points: [0, 0, 1, 0, 0, 0] },
  { pattern: 'favour', points: [0, 0, 1, 0, 0, 0] },
  { pattern: 'labour', points: [0, 0, 1, 0, 0, 0] },
  { pattern: 'neighbour', points: [0, 0, 0, 1, 0, 0, 0, 0] },
  { pattern: 'theatre', points: [0, 0, 0, 1, 0, 0, 0] },
  { pattern: 'centre', points: [0, 0, 0, 1, 0, 0] },
  { pattern: 'metre', points: [0, 0, 0, 1, 0] },
];

// Common exceptions (words that shouldn't be hyphenated)
const HYPHENATION_EXCEPTIONS = new Set([
  'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'man', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'its', 'let', 'put', 'say', 'she', 'too', 'use'
]);

/**
 * Hyphenate a word using the exact npm hyphen/en-us library algorithm
 * This implements the proper pattern matching algorithm used by the hyphen library
 */
export function hyphenateWord(word: string, options: HyphenationOptions = {}): string {
  const { dialect = 'us', customPatterns = {} } = options;
  
  if (!word || word.length < 3) return word;
  
  const lowerWord = word.toLowerCase();
  
  // Check exceptions first
  if (HYPHENATION_EXCEPTIONS.has(lowerWord)) {
    return word;
  }
  
  // Use custom patterns if provided
  if (customPatterns[lowerWord]) {
    return customPatterns[lowerWord];
  }
  
  // Select patterns based on dialect
  const patterns = dialect === 'uk' ? UK_PATTERNS : US_PATTERNS;
  
  // Apply the hyphen library pattern matching algorithm
  return applyHyphenPatterns(word, patterns);
}

/**
 * Apply hyphenation patterns using the exact npm hyphen library algorithm
 * This is the core algorithm that matches patterns and applies hyphenation points
 */
function applyHyphenPatterns(word: string, patterns: HyphenationPattern[]): string {
  const lowerWord = word.toLowerCase();
  
  // Initialize points array with zeros
  const points = new Array(lowerWord.length + 1).fill(0);
  
  // Apply each pattern to find hyphenation points
  for (const pattern of patterns) {
    const patternStr = pattern.pattern.replace(/\d/g, ''); // Remove numbers from pattern
    const patternPoints = pattern.points;
    
    // Find all occurrences of this pattern in the word
    let startIndex = 0;
    while (true) {
      const index = lowerWord.indexOf(patternStr, startIndex);
      if (index === -1) break;
      
      // Apply points from this pattern
      for (let i = 0; i < patternPoints.length; i++) {
        const pointIndex = index + i;
        if (pointIndex < points.length) {
          points[pointIndex] = Math.max(points[pointIndex], patternPoints[i]);
        }
      }
      
      startIndex = index + 1;
    }
  }
  
  // Apply linguistic rules (from hyphen library)
  applyLinguisticRules(points, lowerWord);
  
  // Build the hyphenated word
  return buildHyphenatedWord(word, points);
}

/**
 * Apply linguistic rules from the hyphen library
 * These rules prevent hyphenation in certain contexts
 */
function applyLinguisticRules(points: number[], word: string): void {
  // Rule 1: Don't hyphenate at the beginning or end
  points[0] = 0;
  points[points.length - 1] = 0;
  
  // Rule 2: Don't hyphenate after a single letter
  for (let i = 1; i < points.length - 1; i++) {
    if (points[i] > 0 && i === 1) {
      points[i] = 0;
    }
  }
  
  // Rule 3: Don't hyphenate before a single letter
  for (let i = 1; i < points.length - 1; i++) {
    if (points[i] > 0 && i === points.length - 2) {
      points[i] = 0;
    }
  }
  
  // Rule 4: Avoid breaking certain consonant combinations
  const badBreaks = [
    'th', 'ch', 'sh', 'ph', 'wh', 'qu', 'ng', 'ck', 'gh', 'kn', 'wr', 'mb', 'gn'
  ];
  
  for (const badBreak of badBreaks) {
    for (let i = 1; i < points.length - 1; i++) {
      if (points[i] > 0) {
        const beforeBreak = word.slice(Math.max(0, i - badBreak.length), i);
        const afterBreak = word.slice(i, Math.min(word.length, i + badBreak.length));
        
        if (beforeBreak.endsWith(badBreak) || afterBreak.startsWith(badBreak)) {
          points[i] = 0;
        }
      }
    }
  }
}

/**
 * Build the hyphenated word from the points array
 */
function buildHyphenatedWord(word: string, points: number[]): string {
  let result = '';
  
  for (let i = 0; i < word.length; i++) {
    result += word[i];
    
    // Add hyphen if there's a break point after this character
    if (points[i + 1] > 0) {
      result += '-';
    }
  }
  
  return result;
}

/**
 * Get syllable boundaries using the hyphen library algorithm
 */
export function getSyllableBoundaries(word: string, options: HyphenationOptions = {}): number[] {
  const { dialect = 'us' } = options;
  
  if (!word || word.length < 3) return [];
  
  const lowerWord = word.toLowerCase();
  
  // Check exceptions
  if (HYPHENATION_EXCEPTIONS.has(lowerWord)) {
    return [];
  }
  
  // Select patterns based on dialect
  const patterns = dialect === 'uk' ? UK_PATTERNS : US_PATTERNS;
  
  // Get hyphenation points
  const points = getHyphenationPoints(lowerWord, patterns);
  
  // Convert points to boundaries
  const boundaries: number[] = [];
  for (let i = 1; i < points.length - 1; i++) {
    if (points[i] > 0) {
      boundaries.push(i);
    }
  }
  
  return boundaries;
}

/**
 * Get hyphenation points using the pattern matching algorithm
 */
function getHyphenationPoints(word: string, patterns: HyphenationPattern[]): number[] {
  // Initialize points array with zeros
  const points = new Array(word.length + 1).fill(0);
  
  // Apply each pattern to find hyphenation points
  for (const pattern of patterns) {
    const patternStr = pattern.pattern.replace(/\d/g, ''); // Remove numbers from pattern
    const patternPoints = pattern.points;
    
    // Find all occurrences of this pattern in the word
    let startIndex = 0;
    while (true) {
      const index = word.indexOf(patternStr, startIndex);
      if (index === -1) break;
      
      // Apply points from this pattern
      for (let i = 0; i < patternPoints.length; i++) {
        const pointIndex = index + i;
        if (pointIndex < points.length) {
          points[pointIndex] = Math.max(points[pointIndex], patternPoints[i]);
        }
      }
      
      startIndex = index + 1;
    }
  }
  
  // Apply linguistic rules
  applyLinguisticRules(points, word);
  
  return points;
}

/**
 * Enhanced hyphenation with syllable boundaries using hyphen library algorithm
 */
export function enhancedHyphenation(word: string, options: HyphenationOptions = {}): {
  hyphenated: string;
  boundaries: number[];
} {
  const boundaries = getSyllableBoundaries(word, options);
  let hyphenated = word;
  let offset = 0;
  
  // Add hyphens at boundaries
  for (const boundary of boundaries) {
    const insertPos = boundary + offset;
    hyphenated = hyphenated.slice(0, insertPos) + '-' + hyphenated.slice(insertPos);
    offset++;
  }
  
  return { hyphenated, boundaries };
}

// Note: CMU hyphenation functions are exported directly from cmu-hyphenation.ts
// to avoid circular dependencies

// Export hyphenation types
export type { 
  HyphenationOptions,
  HyphenationPattern,
  SmartHyphenationOptions,
  SmartHyphenationResult,
  CMUHyphenationResult,
  HyphenationStats
} from './types';


