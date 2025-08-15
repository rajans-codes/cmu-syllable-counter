/**
 * Phoneme-to-character mapping for CMU pronunciation data
 * This provides more accurate mapping between phonemes and word characters
 */

// Common phoneme-to-grapheme mappings
const PHONEME_MAPPINGS: Record<string, string[]> = {
  // Vowels
  'AA': ['a', 'o'], // father, hot
  'AE': ['a'], // cat
  'AH': ['a', 'u', 'o'], // about, cut, but
  'AO': ['aw', 'au', 'o'], // law, caught
  'AW': ['ow', 'ou'], // now, out
  'AY': ['i', 'y', 'igh'], // bite, my, high
  'EH': ['e'], // bed
  'ER': ['er', 'ir', 'ur'], // bird, her
  'EY': ['ay', 'ai', 'a'], // say, rain, face
  'IH': ['i'], // sit
  'IY': ['ee', 'ea', 'i'], // see, eat, machine
  'OW': ['o', 'oa', 'ow'], // go, boat, low
  'OY': ['oi', 'oy'], // boy, coin
  'UH': ['oo', 'u'], // book, put
  'UW': ['oo', 'u', 'ue'], // boot, blue
  
  // Consonants
  'B': ['b'],
  'CH': ['ch', 'tch'],
  'D': ['d'],
  'DH': ['th'],
  'F': ['f', 'ph'],
  'G': ['g'],
  'HH': ['h'],
  'JH': ['j', 'g', 'dge'],
  'K': ['k', 'c', 'ck'],
  'L': ['l'],
  'M': ['m'],
  'N': ['n'],
  'NG': ['ng'],
  'P': ['p'],
  'R': ['r'],
  'S': ['s', 'c'],
  'SH': ['sh', 'ti', 'ci'],
  'T': ['t'],
  'TH': ['th'],
  'V': ['v'],
  'W': ['w'],
  'Y': ['y'],
  'Z': ['z', 's'],
  'ZH': ['si', 'ge']
};

/**
 * Enhanced phoneme-to-character mapping with better syllable boundary detection
 */
export function mapPhonemesToWord(word: string, phonemes: string[]): number[] {
  const wordLower = word.toLowerCase();
  const positions: number[] = [];
  let currentPos = 0;
  
  for (let i = 0; i < phonemes.length; i++) {
    const phoneme = phonemes[i];
    const basePhoneme = phoneme.substring(0, 2);
    
    // Find the best match for this phoneme in the remaining word
    const match = findPhonemeMatch(wordLower, currentPos, basePhoneme);
    
    if (match !== -1) {
      positions.push(match);
      currentPos = match + 1;
    } else {
      // Fallback: estimate position
      const estimatedPos = Math.round((i / phonemes.length) * word.length);
      positions.push(Math.min(estimatedPos, word.length - 1));
      currentPos = estimatedPos + 1;
    }
  }
  
  return positions;
}

/**
 * Find the best match for a phoneme in the word starting from a given position
 */
function findPhonemeMatch(word: string, startPos: number, phoneme: string): number {
  const possibleGraphemes = PHONEME_MAPPINGS[phoneme] || [];
  
  for (const grapheme of possibleGraphemes) {
    const pos = word.indexOf(grapheme, startPos);
    if (pos !== -1) {
      return pos;
    }
  }
  
  // If no exact match, try to find similar patterns
  return findSimilarMatch(word, startPos, phoneme);
}

/**
 * Find similar patterns when exact grapheme match fails
 */
function findSimilarMatch(word: string, startPos: number, phoneme: string): number {
  // For vowels, look for vowel characters
  if (isVowelPhoneme(phoneme)) {
    for (let i = startPos; i < word.length; i++) {
      if (isVowelChar(word[i])) {
        return i;
      }
    }
  }
  
  // For consonants, look for consonant characters
  if (isConsonantPhoneme(phoneme)) {
    for (let i = startPos; i < word.length; i++) {
      if (isConsonantChar(word[i])) {
        return i;
      }
    }
  }
  
  return -1;
}

/**
 * Check if a phoneme is a vowel
 */
function isVowelPhoneme(phoneme: string): boolean {
  const vowels = ['AA', 'AE', 'AH', 'AO', 'AW', 'AY', 'EH', 'ER', 'EY', 'IH', 'IY', 'OW', 'OY', 'UH', 'UW'];
  return vowels.includes(phoneme);
}

/**
 * Check if a phoneme is a consonant
 */
function isConsonantPhoneme(phoneme: string): boolean {
  return !isVowelPhoneme(phoneme);
}

/**
 * Check if a character is a vowel
 */
function isVowelChar(char: string): boolean {
  return 'aeiouy'.includes(char);
}

/**
 * Check if a character is a consonant
 */
function isConsonantChar(char: string): boolean {
  return 'bcdfghjklmnpqrstvwxz'.includes(char);
}

/**
 * Get syllable boundaries from phoneme positions with improved logic
 */
export function getSyllableBoundariesFromPhonemes(word: string, phonemes: string[]): number[] {
  const boundaries: number[] = [];
  
  // Find vowel phonemes and their positions
  const vowelIndices: number[] = [];
  for (let i = 0; i < phonemes.length; i++) {
    const phoneme = phonemes[i];
    const basePhoneme = phoneme.substring(0, 2);
    
    if (isVowelPhoneme(basePhoneme)) {
      vowelIndices.push(i);
    }
  }
  
  // Create boundaries between vowel phonemes
  for (let i = 0; i < vowelIndices.length - 1; i++) {
    const currentVowelIndex = vowelIndices[i];
    const nextVowelIndex = vowelIndices[i + 1];
    
    // Find the boundary position between these vowels
    const boundaryPosition = findSyllableBoundary(word, phonemes, currentVowelIndex, nextVowelIndex);
    
    if (boundaryPosition > 0 && boundaryPosition < word.length - 1) {
      boundaries.push(boundaryPosition);
    }
  }
  
  return boundaries;
}

/**
 * Find the optimal syllable boundary between two vowel phonemes
 */
function findSyllableBoundary(word: string, phonemes: string[], vowel1Index: number, vowel2Index: number): number {
  // For "beautiful": B Y UW1 T AH0 F AH0 L
  // vowel1Index = 2 (UW1), vowel2Index = 4 (AH0)
  // We want to find the boundary between "beau" and "ti"
  
  // Look for consonant clusters between vowels
  const consonantsBetween = [];
  for (let i = vowel1Index + 1; i < vowel2Index; i++) {
    const phoneme = phonemes[i];
    const basePhoneme = phoneme.substring(0, 2);
    if (isConsonantPhoneme(basePhoneme)) {
      consonantsBetween.push(i);
    }
  }
  
  // If there are consonants between vowels, try to split them
  if (consonantsBetween.length > 0) {
    // For "beautiful": consonantsBetween = [3] (T)
    // Try to map this to the word position
    const consonantIndex = consonantsBetween[0];
    const estimatedPosition = estimateWordPosition(word, consonantIndex, phonemes.length);
    return estimatedPosition;
  }
  
  // Fallback: use midpoint between vowels
  const phonemeMidpoint = Math.floor((vowel1Index + vowel2Index) / 2);
  return estimateWordPosition(word, phonemeMidpoint, phonemes.length);
}

/**
 * Estimate word position based on phoneme position with better heuristics
 */
function estimateWordPosition(word: string, phonemeIndex: number, totalPhonemes: number): number {
  // For "beautiful" (9 chars) with 8 phonemes:
  // B Y UW1 T AH0 F AH0 L
  // 0 1 2   3 4   5 6   7
  
  // Simple linear mapping with some adjustments
  const ratio = phonemeIndex / totalPhonemes;
  let position = Math.round(ratio * word.length);
  
  // Ensure position is within bounds
  position = Math.max(0, Math.min(position, word.length - 1));
  
  return position;
}
