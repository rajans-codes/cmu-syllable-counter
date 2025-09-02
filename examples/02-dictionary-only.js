/**
 * Example 2: Dictionary Utilities Only (Tree-Shakable)
 * 
 * This example imports only dictionary-related functions.
 * Tree-shaking should exclude syllable counting logic but include dictionary data.
 * 
 * Expected bundle size: Medium (dictionary utilities + data)
 */

import { 
  findWordsBySyllableCount,
  getRandomWords,
  getAllWords 
} from '../dist/index.esm.js';

async function dictionaryOnlyExample() {
  console.log('📚 Dictionary Utilities Only (Tree-Shakable)');
  console.log('============================================\n');
  
  console.log('📦 Imported: Dictionary utilities only');
  console.log('🎯 Expected: Dictionary data + utility functions included');
  console.log('📊 Bundle impact: Medium (excludes syllable counting logic)\n');
  
  // Test dictionary functions
  console.log('1. 🔍 Finding words with 2 syllables:');
  const twoSyllableWords = findWordsBySyllableCount(2, { limit: 10 });
  console.log('   Found:', twoSyllableWords.length, 'words');
  console.log('   Sample:', twoSyllableWords.map(w => w.word).join(', '));
  
  console.log('\n2. 🎲 Getting random words:');
  const randomWords = getRandomWords(2);
  console.log('   Random words:', randomWords.map(w => w.word).join(', '));
  
  console.log('\n3. 📊 Dictionary size:');
  const allWords = getAllWords();
  console.log('   Total words:', allWords.length);
  
  console.log('\n🔍 Tree-Shaking Analysis:');
  console.log('   - Dictionary data: Should be included (used by utilities)');
  console.log('   - Dictionary utilities: Should be included (imported)');
  console.log('   - Syllable counting logic: Should be excluded (not imported)');
  console.log('   - Bundle size: Should be medium (larger than minimal, smaller than full)');
}

dictionaryOnlyExample().catch(console.error);
