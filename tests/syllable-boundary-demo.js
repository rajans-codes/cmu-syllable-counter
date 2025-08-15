/**
 * Demo: Understanding Syllable Boundaries
 * 
 * This demo shows how syllable boundaries work and their applications
 */

import('../dist/index.esm.js').then(async (module) => {
  const { getSyllableCount, syllableCounter } = module;
  
  console.log('🔍 Syllable Boundaries Demo\n');
  
  // Test words with different syllable structures
  const testWords = [
    'beautiful',    // beau-ti-ful (3 syllables)
    'hello',        // hel-lo (2 syllables) 
    'table',        // ta-ble (2 syllables)
    'apple',        // ap-ple (2 syllables)
    'computer',     // com-pu-ter (3 syllables)
    'programming',  // pro-gram-ming (3 syllables)
    'international' // in-ter-na-tion-al (5 syllables)
  ];
  
  console.log('📊 Syllable Boundaries Analysis:\n');
  
  for (const word of testWords) {
    console.log(`\n🔤 Word: "${word}"`);
    
    // Get syllable info with boundaries
    const syllableInfo = await syllableCounter.getSyllableInfo(word, {
      includeBoundaries: true
    });
    
    console.log(`   Syllables: ${syllableInfo.syllables}`);
    console.log(`   Hyphenated: ${syllableInfo.hyphenated}`);
    console.log(`   Source: ${syllableInfo.source}`);
    
    if (syllableInfo.syllableBoundaries && syllableInfo.syllableBoundaries.length > 0) {
      console.log(`   Boundaries: [${syllableInfo.syllableBoundaries.join(', ')}]`);
      
      // Visualize the boundaries
      let visualization = word;
      let offset = 0;
      for (const boundary of syllableInfo.syllableBoundaries) {
        const insertPos = boundary + offset;
        visualization = visualization.slice(0, insertPos) + '|' + visualization.slice(insertPos);
        offset++;
      }
      console.log(`   Visualization: ${visualization}`);
      
      // Show character-by-character breakdown
      console.log(`   Character Analysis:`);
      for (let i = 0; i < word.length; i++) {
        const char = word[i];
        const isBoundary = syllableInfo.syllableBoundaries.includes(i);
        const marker = isBoundary ? ' ← BOUNDARY' : '';
        console.log(`     Index ${i}: "${char}"${marker}`);
      }
    } else {
      console.log(`   Boundaries: [] (single syllable)`);
    }
  }
  
  console.log('\n📚 What are Syllable Boundaries?\n');
  console.log('Syllable boundaries are the positions in a word where syllables break.');
  console.log('They indicate where you can safely hyphenate a word.');
  console.log('');
  console.log('Examples:');
  console.log('- "beautiful" → boundaries at [3, 6] → "beau|ti|ful"');
  console.log('- "hello" → boundary at [2] → "hel|lo"');
  console.log('- "table" → boundary at [2] → "ta|ble"');
  console.log('');
  console.log('🔧 How they work:');
  console.log('1. CMU Dictionary: Uses pronunciation data for accurate boundaries');
  console.log('2. Fallback: Uses vowel patterns and linguistic rules');
  console.log('3. Applications: Text wrapping, hyphenation, pronunciation guides');
  console.log('');
  console.log('💡 Use Cases:');
  console.log('- Text layout and typography');
  console.log('- Speech synthesis and pronunciation');
  console.log('- Educational tools for language learning');
  console.log('- Poetry and meter analysis');
  
  // Test boundary manipulation
  console.log('\n🔧 Boundary Manipulation Examples:\n');
  
  const testWord = 'beautiful';
  const syllableInfo = await syllableCounter.getSyllableInfo(testWord, {
    includeBoundaries: true
  });
  
  if (syllableInfo.syllableBoundaries) {
    console.log(`Word: "${testWord}"`);
    console.log(`Boundaries: [${syllableInfo.syllableBoundaries.join(', ')}]`);
    
    // Manual hyphenation using boundaries
    let manualHyphenated = testWord;
    let offset = 0;
    
    for (const boundary of syllableInfo.syllableBoundaries) {
      const insertPos = boundary + offset;
      manualHyphenated = manualHyphenated.slice(0, insertPos) + '-' + manualHyphenated.slice(insertPos);
      offset++;
    }
    
    console.log(`Manual hyphenation: "${manualHyphenated}"`);
    console.log(`Library hyphenation: "${syllableInfo.hyphenated}"`);
    console.log(`Match: ${manualHyphenated === syllableInfo.hyphenated ? '✅' : '❌'}`);
  }
  
}).catch(error => {
  console.error('❌ Error:', error);
});
