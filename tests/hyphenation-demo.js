/**
 * Demo: How Hyphenation Works in CMU Dictionary Library
 * 
 * This demo shows the two-tier hyphenation system:
 * 1. CMU Dictionary Hyphenation (most accurate)
 * 2. Fallback Hyphenation (algorithmic)
 */

import('../dist/index.esm.js').then(async (module) => {
  const { getSyllableCount, syllableCounter } = module;
  
  console.log('🔍 Hyphenation System Demo\n');
  
  // Test words with different hyphenation scenarios
  const testWords = [
    'beautiful',    // CMU Dictionary word
    'hello',        // CMU Dictionary word
    'table',        // CMU Dictionary word
    'xyzzy',        // Not in CMU Dictionary (fallback)
    'qwerty',       // Not in CMU Dictionary (fallback)
    'programming',  // CMU Dictionary word
    'computer',     // CMU Dictionary word
    'international' // CMU Dictionary word
  ];
  
  console.log('📊 Hyphenation Analysis:\n');
  
  for (const word of testWords) {
    console.log(`\n🔤 Word: "${word}"`);
    
    // Get syllable info with hyphenation
    const syllableInfo = await syllableCounter.getSyllableInfo(word, {
      includeBoundaries: true
    });
    
    console.log(`   Syllables: ${syllableInfo.syllables}`);
    console.log(`   Source: ${syllableInfo.source}`);
    console.log(`   Hyphenated: ${syllableInfo.hyphenated}`);
    console.log(`   Boundaries: [${syllableInfo.syllableBoundaries.join(', ')}]`);
    
    if (syllableInfo.pronunciation) {
      console.log(`   Pronunciation: ${syllableInfo.pronunciation}`);
    }
  }
  
  console.log('\n🔧 How Hyphenation Works:\n');
  
  console.log('1️⃣ CMU Dictionary Hyphenation (Most Accurate):');
  console.log('   - Uses pronunciation data from CMU Dictionary');
  console.log('   - Maps phonemes to word characters');
  console.log('   - Creates boundaries based on vowel phonemes');
  console.log('   - Example: "beautiful" → "B Y UW1 T AH0 F AH0 L" → [3, 6]');
  console.log('');
  
  console.log('2️⃣ Fallback Hyphenation (Algorithmic):');
  console.log('   - Uses vowel pattern matching');
  console.log('   - Finds midpoints between vowel groups');
  console.log('   - Applies linguistic rules');
  console.log('   - Example: "xyzzy" → vowel positions → boundaries');
  console.log('');
  
  console.log('3️⃣ Hyphenation Process:');
  console.log('   Step 1: Check if word is in CMU Dictionary');
  console.log('   Step 2a: If found → Use CMU pronunciation data');
  console.log('   Step 2b: If not found → Use fallback algorithm');
  console.log('   Step 3: Calculate syllable boundaries');
  console.log('   Step 4: Insert hyphens at boundary positions');
  console.log('');
  
  console.log('📚 Hyphenation Methods:\n');
  
  console.log('🎯 CMU-Based Hyphenation:');
  console.log('   - Most accurate for known words');
  console.log('   - Uses actual pronunciation data');
  console.log('   - Handles complex syllable structures');
  console.log('   - Example: "international" → "in-ter-na-tion-al"');
  console.log('');
  
  console.log('🔄 Fallback Hyphenation:');
  console.log('   - Works for any word');
  console.log('   - Uses vowel-consonant patterns');
  console.log('   - Less accurate but always available');
  console.log('   - Example: "xyzzy" → "xyz-zy"');
  console.log('');
  
  console.log('💡 Key Features:');
  console.log('   ✅ Index-based boundaries (0-indexed)');
  console.log('   ✅ Automatic fallback for unknown words');
  console.log('   ✅ Pronunciation data integration');
  console.log('   ✅ Linguistic rule application');
  console.log('   ✅ Caching for performance');
  console.log('');
  
  console.log('🎨 Use Cases:');
  console.log('   - Text layout and typography');
  console.log('   - Educational tools');
  console.log('   - Speech synthesis');
  console.log('   - Poetry and meter analysis');
  console.log('   - Language learning applications');
  
  // Test the unified getSyllableCount function with hyphenation
  console.log('\n🔄 Testing getSyllableCount with hyphenation:\n');
  
  const testSentence = 'The beautiful international computer';
  const result = await getSyllableCount(testSentence, {
    includeHyp: true,
    delimiter: '-'
  });
  
  console.log(`Sentence: "${testSentence}"`);
  console.log(`Total syllables: ${result.totalSyllableCount}`);
  console.log('Word breakdown:');
  
  if (result.hyp) {
    for (const wordData of result.hyp) {
      console.log(`   ${wordData.hyp} (${wordData.sc} syllables, ${wordData.source})`);
    }
  }
  
}).catch(error => {
  console.error('❌ Error:', error);
});
