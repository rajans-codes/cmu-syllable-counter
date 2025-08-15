/**
 * Demonstration of the simplified CMU Dictionary API
 * 
 * The library now provides a unified syllable counting function that replaces
 * multiple separate functions with a single, comprehensive API.
 * 
 * Main function:
 * async function getSyllableCount(
 *   wordsOrSentences: string | string[],
 *   options?: {
 *     includeHyp?: boolean; // default: false
 *     delimiter?: string;   // default: '-'
 *   }
 * ): Promise<{
 *   totalSyllableCount: number;
 *   hyp?: { hyp: string; sc: number; source: 'cmu' | 'fallback' }[];
 * }>;
 */

// Example usage scenarios:

console.log('=== Simplified CMU Dictionary API Demo ===\n');

console.log('📝 Main Function: getSyllableCount()');
console.log('This single function handles all syllable counting needs!\n');

console.log('1. Single word "beautiful":');
console.log(`
import { getSyllableCount } from 'cmu-dictionary';

const result = await getSyllableCount('beautiful', {
  includeHyp: true,
  delimiter: '-'
});

console.log(result);
/*
{
  totalSyllableCount: 3,
  hyp: [
    { hyp: 'beau-ti-ful', sc: 3, source: 'cmu' }
  ]
}
*/
`);

console.log('\n2. Sentence "The beautiful garden":');
console.log(`
const result = await getSyllableCount('The beautiful garden', {
  includeHyp: true,
  delimiter: '-'
});

console.log(result);
/*
{
  totalSyllableCount: 7,
  hyp: [
    { hyp: 'the', sc: 1, source: 'fallback' },
    { hyp: 'beau-ti-ful', sc: 3, source: 'cmu' },
    { hyp: 'gar-den', sc: 3, source: 'fallback' }
  ]
}
*/
`);

console.log('\n3. Array of words with custom delimiter:');
console.log(`
const result = await getSyllableCount(['hello', 'world', 'beautiful'], {
  includeHyp: true,
  delimiter: '•'
});

console.log(result);
/*
{
  totalSyllableCount: 6,
  hyp: [
    { hyp: 'hel•lo', sc: 2, source: 'fallback' },
    { hyp: 'world', sc: 1, source: 'fallback' },
    { hyp: 'beau•ti•ful', sc: 3, source: 'cmu' }
  ]
}
*/
`);

console.log('\n4. Simple count without hyphenation:');
console.log(`
const result = await getSyllableCount('beautiful');
console.log(result.totalSyllableCount); // 3
`);

console.log('\n🔧 Additional Utility Functions:');
console.log(`
import { getSyllableInfo, isInDictionary, getPronunciation } from 'cmu-dictionary';

// Get detailed syllable information
const info = await getSyllableInfo('beautiful', { includeBoundaries: true });
// { word: 'beautiful', syllables: 3, hyphenated: 'beau-ti-ful', source: 'cmu', pronunciation: 'B Y UW1 T AH0 F AH0 L' }

// Check if word is in CMU Dictionary
const exists = await isInDictionary('beautiful'); // true

// Get pronunciation
const pronunciation = await getPronunciation('beautiful'); // "B Y UW1 T AH0 F AH0 L"
`);

console.log('\n=== Key Benefits ===');
console.log('✅ Single function for all syllable counting needs');
console.log('✅ Handles single words, sentences, and arrays');
console.log('✅ Optional hyphenation with custom delimiters');
console.log('✅ Shows source (cmu/fallback) for transparency');
console.log('✅ Consistent async API');
console.log('✅ Tree-shakable - only import what you need');
console.log('✅ Simplified API - no more confusion about which function to use');
console.log('✅ Reduced bundle size - fewer exported functions');
