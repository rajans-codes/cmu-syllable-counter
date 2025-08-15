import { 
  getRandomWords, 
  getRandomWordsWithKey,
  hasWordBeenUsed,
  getWordCacheStats,
  clearWordCache
} from './dist/index.esm.js';

async function testCache() {
  console.log('Testing cache functionality...');
  
  // Test 1: Basic random words
  console.log('\n1. Basic random words:');
  const words1 = getRandomWords(5);
  console.log(words1.map(w => w.word).join(', '));
  
  // Test 2: With cache
  console.log('\n2. With cache:');
  const words2 = await getRandomWordsWithKey(5, { uniquenessKey: 'test' });
  console.log(words2.map(w => w.word).join(', '));
  
  // Test 3: Check cache stats
  console.log('\n3. Cache stats:');
  const stats = getWordCacheStats('test');
  console.log(stats);
  
  // Test 4: Check if words were used
  console.log('\n4. Check word usage:');
  words2.forEach(word => {
    const used = hasWordBeenUsed(word.word, 'test');
    console.log(`${word.word}: ${used}`);
  });
  
  // Test 5: Clear cache
  console.log('\n5. Clear cache:');
  clearWordCache('test');
  const statsAfter = getWordCacheStats('test');
  console.log('Stats after clear:', statsAfter);
  
  console.log('\nTest completed successfully!');
}

testCache().catch(console.error);
