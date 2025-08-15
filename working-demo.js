/**
 * Working Demo - Actually runs the getSyllableCount function
 * This demonstrates the real functionality of the unified syllable counting API
 */

// Import using ES modules from ESM build
import('./dist/index.esm.js').then(async (module) => {
  const { getSyllableCount, isInDictionary, getPronunciation, syllableCounter } = module;
  
  console.log('🚀 Working Demo - Real Function Output\n');
  
  try {
    // Test 1: Single word without hyphenation
    console.log('1️⃣ Single word "beautiful" (no hyphenation):');
    const result1 = await getSyllableCount('beautiful');
    console.log('Result:', JSON.stringify(result1, null, 2));
    console.log('✅ Syllable count:', result1.totalSyllableCount);
    
    // Test 2: Single word with hyphenation
    console.log('\n2️⃣ Single word "beautiful" (with hyphenation):');
    const result2 = await getSyllableCount('beautiful', {
      includeHyp: true,
      delimiter: '-'
    });
    console.log('Result:', JSON.stringify(result2, null, 2));
    
    // Test 3: Single word with hyphenation and pronunciation
    console.log('\n3️⃣ Single word "beautiful" (with hyphenation + pronunciation):');
    const result3 = await getSyllableCount('beautiful', {
      includeHyp: true,
      delimiter: '-',
      includePron: true
    });
    console.log('Result:', JSON.stringify(result3, null, 2));
    
    // Test 4: Sentence with hyphenation and pronunciation
    console.log('\n4️⃣ Sentence "The beautiful garden" (with hyphenation + pronunciation):');
    const result4 = await getSyllableCount('The beautiful garden', {
      includeHyp: true,
      delimiter: '-',
      includePron: true
    });
    console.log('Result:', JSON.stringify(result4, null, 2));
    
    // Test 5: Array of words with custom delimiter and pronunciation
    console.log('\n5️⃣ Array of words with custom delimiter + pronunciation:');
    const result5 = await getSyllableCount(['hello', 'world', 'beautiful'], {
      includeHyp: true,
      delimiter: '•',
      includePron: true
    });
    console.log('Result:', JSON.stringify(result5, null, 2));
    
    // Test 6: Complex sentence with pronunciation
    console.log('\n6️⃣ Complex sentence with pronunciation:');
    const result6 = await getSyllableCount('The beautiful sunset over the magnificent mountains', {
      includeHyp: true,
      includePron: true
    });
    console.log('Total syllables:', result6.totalSyllableCount);
    console.log('Word breakdown with pronunciation:');
    result6.hyp.forEach((word, index) => {
      const pronInfo = word.pron ? ` (pron: ${word.pron})` : '';
      console.log(`  ${index + 1}. "${word.hyp}" (${word.sc} syllables, source: ${word.source})${pronInfo}`);
    });
    
    // Test 7: Empty input
    console.log('\n7️⃣ Empty input:');
    const result7 = await getSyllableCount('');
    console.log('Result:', JSON.stringify(result7, null, 2));
    
    // Test 8: Additional utility functions
    console.log('\n8️⃣ Additional utility functions:');
    
    // Check if word is in CMU Dictionary
    const exists = await isInDictionary('beautiful');
    console.log('isInDictionary("beautiful"):', exists);
    
    const exists2 = await isInDictionary('xyzzy');
    console.log('isInDictionary("xyzzy"):', exists2);
    
    // Get pronunciation
    const pronunciation = await getPronunciation('beautiful');
    console.log('getPronunciation("beautiful"):', pronunciation);
    
    // Test direct syllable counter access
    console.log('\n9️⃣ Direct syllable counter access:');
    const syllableInfo = await syllableCounter.getSyllableInfo('beautiful', { includeBoundaries: true });
    console.log('syllableCounter.getSyllableInfo("beautiful"):', JSON.stringify(syllableInfo, null, 2));
    
    console.log('\n🎉 Demo completed successfully!');
    
  } catch (error) {
    console.error('❌ Error running demo:', error);
  }
}).catch(error => {
  console.error('❌ Failed to load module:', error);
});
