import { 
  countSyllables, 
  countTextSyllables, 
  countSyllablesSync,
  lookupWord,
  cmuDictionary,
  hyphenateWord,
  cmuHyphenation,
  analyzeText,
  quickCountTextSyllables,
  searchWords,
  findWordsBySyllableCount,
  getRandomWords,
  getRandomWordsWithCache,
  getCacheStats,
  clearCache
} from '../dist/index.esm.js';

console.log('Starting debug test...');

// Test 1: Basic syllable counting
console.log('Test 1: Basic syllable counting');
try {
  const result = await countSyllables('hello');
  console.log('✓ countSyllables works:', result);
} catch (error) {
  console.log('✗ countSyllables failed:', error.message);
}

// Test 2: Text syllable counting
console.log('Test 2: Text syllable counting');
try {
  const result = await countTextSyllables('Hello world');
  console.log('✓ countTextSyllables works:', result);
} catch (error) {
  console.log('✗ countTextSyllables failed:', error.message);
}

// Test 3: Dictionary lookup
console.log('Test 3: Dictionary lookup');
try {
  const result = lookupWord('hello');
  console.log('✓ lookupWord works:', result);
} catch (error) {
  console.log('✗ lookupWord failed:', error.message);
}

// Test 4: CMU dictionary check
console.log('Test 4: CMU dictionary check');
try {
  const result = cmuDictionary.has('hello');
  console.log('✓ cmuDictionary.has works:', result);
} catch (error) {
  console.log('✗ cmuDictionary.has failed:', error.message);
}

// Test 5: Hyphenation
console.log('Test 5: Hyphenation');
try {
  const result = hyphenateWord('hello');
  console.log('✓ hyphenateWord works:', result);
} catch (error) {
  console.log('✗ hyphenateWord failed:', error.message);
}

// Test 6: CMU hyphenation
console.log('Test 6: CMU hyphenation');
try {
  const result = cmuHyphenation('hello');
  console.log('✓ cmuHyphenation works:', result);
} catch (error) {
  console.log('✗ cmuHyphenation failed:', error.message);
}

console.log('Debug test completed.');
