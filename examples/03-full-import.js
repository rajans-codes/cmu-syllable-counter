/**
 * Example 3: Full Import (No Tree-Shaking)
 * 
 * This example imports all available functions.
 * No tree-shaking occurs - everything is included.
 * 
 * Expected bundle size: Large (full library)
 */

import { 
  getSyllableCount,
  getHyphenatedString,
  cmuDictionary,
  findWordsBySyllableCount,
  findWordsByStressPattern,
  findWordsByComplexity,
  findWordsByVowelCount,
  getRandomWords,
  findRhymingWords,
  getAllWords,
  getDictionarySize,
  isWordInDictionary
} from '../dist/index.esm.js';

async function fullImportExample() {
  console.log('📦 Full Import Example (No Tree-Shaking)');
  console.log('=========================================\n');
  
  console.log('📦 Imported: All available functions');
  console.log('🎯 Expected: Complete library included');
  console.log('📊 Bundle impact: Maximum (everything included)\n');
  
  // Test various functions to ensure they're all available
  console.log('1. 🔢 Syllable counting:');
  const syllableResult = await getSyllableCount('hello beautiful world', { includeHyp: true });
  console.log('   Result:', syllableResult.totalSyllableCount, 'syllables');
  
  console.log('\n2. 🔤 Hyphenation:');
  const hyphenResult = await getHyphenatedString('hello beautiful world', { delimiter: '.' });
  console.log('   Result:', hyphenResult.hyp);
  
  console.log('\n3. 📚 Dictionary utilities:');
  const dictWords = findWordsBySyllableCount(3, { limit: 40 });
  console.log('   3-syllable words:', dictWords.map(w => w.word).join(', '));
  
  console.log('\n4. 🎵 Stress patterns:');
  const stressWords = findWordsByStressPattern('10', { limit: 10 });
  console.log('   Stress pattern "10":', stressWords.map(w => w.word).join(', '));
  
  console.log('\n5. 🧠 Complexity analysis:');
  const simpleWords = findWordsByComplexity('simple', { limit: 2 });
  console.log('   Simple words:', simpleWords.map(w => w.word).join(', '));
  
  console.log('\n6. 🗣️ Vowel counting:');
  const vowelWords = findWordsByVowelCount(3, { limit: 10 });
  console.log('   3-vowel words:', vowelWords.map(w => w.word).join(', '));
  
  console.log('\n7. 🎲 Random words:');
  const randomWords = getRandomWords(2);
  console.log('   Random words:', randomWords.map(w => w.word).join(', '));
  
  console.log('\n8. 🎶 Rhyming words:');
  const rhymingWords = findRhymingWords('cat', { limit: 20 });
  console.log('   Rhymes with "cat":', rhymingWords.map(w => w.word).join(', '));
  
  console.log('\n9. 📊 Dictionary info:');
  console.log('   Total words:', getDictionarySize());
  console.log('   Has "hello":', isWordInDictionary('hello'));
  
  console.log('\n🔍 Tree-Shaking Analysis:');
  console.log('   - Dictionary data: Included (used by utilities)');
  console.log('   - All functions: Included (all imported)');
  console.log('   - Core logic: Included (imported)');
  console.log('   - Bundle size: Maximum (no tree-shaking possible)');
  console.log('   - Use case: When you need the complete library');
}

fullImportExample().catch(console.error);
