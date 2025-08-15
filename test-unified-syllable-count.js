const { getSyllableCount } = require('./dist/index.js');

async function testUnifiedSyllableCount() {
  console.log('=== Testing Unified getSyllableCount Function ===\n');
  
  // Test 1: Single word without hyphenation
  console.log('1. Single word "beautiful" (no hyphenation):');
  const result1 = await getSyllableCount('beautiful');
  console.log(result1);
  // Expected: { totalSyllableCount: 3 }
  
  console.log('\n2. Single word "beautiful" (with hyphenation):');
  const result2 = await getSyllableCount('beautiful', {
    includeHyp: true,
    delimiter: '-'
  });
  console.log(result2);
  // Expected: { totalSyllableCount: 3, hyp: [{ hyp: 'beau-ti-ful', sc: 3, source: 'cmu' }] }
  
  console.log('\n3. Sentence "The beautiful garden" (with hyphenation):');
  const result3 = await getSyllableCount('The beautiful garden', {
    includeHyp: true,
    delimiter: '-'
  });
  console.log(result3);
  // Expected: { totalSyllableCount: 7, hyp: [...] }
  
  console.log('\n4. Array of words (with custom delimiter):');
  const result4 = await getSyllableCount(['hello', 'world', 'beautiful'], {
    includeHyp: true,
    delimiter: '•'
  });
  console.log(result4);
  // Expected: { totalSyllableCount: 6, hyp: [...] }
  
  console.log('\n5. Complex sentence:');
  const result5 = await getSyllableCount('The beautiful sunset over the magnificent mountains', {
    includeHyp: true
  });
  console.log(result5);
  
  console.log('\n6. Empty input:');
  const result6 = await getSyllableCount('');
  console.log(result6);
  // Expected: { totalSyllableCount: 0 }
}

testUnifiedSyllableCount().catch(console.error);
