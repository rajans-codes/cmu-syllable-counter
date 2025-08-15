import { VOWEL_PATTERNS } from './dictionary';

/**
 * Fallback syllable counting using vowel patterns
 * This is used when a word is not found in the CMU Dictionary
 */
export function fallbackSyllableCount(word: string): number {
  if (!word || word.length === 0) return 0;

  // Convert to lowercase for consistent processing
  const lowerWord = word.toLowerCase();
  
  // Remove common suffixes that don't add syllables
  let processedWord = lowerWord
    .replace(/e$/, '') // Remove silent 'e' at the end
    .replace(/ed$/, '') // Remove past tense 'ed'
    .replace(/ing$/, '') // Remove present participle 'ing'
    .replace(/ly$/, '') // Remove adverb 'ly'
    .replace(/er$/, '') // Remove comparative 'er'
    .replace(/est$/, '') // Remove superlative 'est'
    .replace(/s$/, '') // Remove plural 's'
    .replace(/'s$/, '') // Remove possessive 's
    .replace(/'re$/, '') // Remove contraction 're
    .replace(/'ve$/, '') // Remove contraction 've
    .replace(/'ll$/, '') // Remove contraction 'll
    .replace(/'d$/, '') // Remove contraction 'd
    .replace(/'t$/, ''); // Remove contraction 't

  // Count vowel groups
  const vowelMatches = processedWord.match(VOWEL_PATTERNS);
  if (!vowelMatches) return 1; // At least one syllable

  let syllableCount = vowelMatches.length;

  // Special cases
  if (processedWord.endsWith('le') && !processedWord.endsWith('ble') && !processedWord.endsWith('cle')) {
    syllableCount++; // Add syllable for words ending in 'le' (except 'ble', 'cle')
  }

  // Ensure minimum of 1 syllable
  return Math.max(1, syllableCount);
}

/**
 * Enhanced fallback with more sophisticated rules
 */
export function enhancedFallbackSyllableCount(word: string): number {
  if (!word || word.length === 0) return 0;

  const lowerWord = word.toLowerCase();
  
  // Handle common prefixes and suffixes
  let processedWord = lowerWord;
  
  // Remove prefixes that don't affect syllable count
  processedWord = processedWord.replace(/^(un|re|pre|dis|mis|non)/, '');
  
  // Remove suffixes that don't add syllables
  processedWord = processedWord.replace(/(ed|ing|ly|er|est|s|'s|'re|'ve|'ll|'d|'t)$/, '');
  
  // Count vowel groups
  const vowelMatches = processedWord.match(VOWEL_PATTERNS);
  if (!vowelMatches) return 1;

  let syllableCount = vowelMatches.length;

  // Special rules
  if (processedWord.endsWith('le') && !processedWord.match(/[bcdfghjklmnpqrstvwxz]le$/)) {
    syllableCount++; // Add syllable for words ending in 'le' (except after certain consonants)
  }

  // Handle 'y' as vowel
  if (processedWord.includes('y') && !vowelMatches.some(match => match.includes('y'))) {
    syllableCount++;
  }

  // Handle silent 'e' at the end
  if (processedWord.endsWith('e') && syllableCount > 1) {
    // Check if the 'e' is silent (not part of a vowel team)
    const beforeE = processedWord.slice(0, -1);
    const beforeEVowels = beforeE.match(VOWEL_PATTERNS);
    if (beforeEVowels && beforeEVowels.length === syllableCount - 1) {
      syllableCount--; // Silent 'e' doesn't add a syllable
    }
  }

  // Handle compound words
  const compoundPatterns = [
    /every(one|thing|where)/,
    /some(one|thing|where|body)/,
    /any(one|thing|where|body)/,
    /no(one|thing|where|body)/
  ];
  
  for (const pattern of compoundPatterns) {
    if (pattern.test(processedWord)) {
      // Compound words typically have more syllables than simple vowel counting suggests
      syllableCount = Math.max(syllableCount, 3);
      break;
    }
  }

  return Math.max(1, syllableCount);
}
