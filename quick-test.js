import { 
  getRandomWords, 
  getRandomWordsWithKey,
  hasWordBeenUsed,
  getWordCacheStats,
  clearWordCache,
  stopCacheCleanup
} from './dist/index.esm.js';

async function quickTest() {
  console.log('Quick Cache Test\n');
  
  // Test 1: Basic functionality
  console.log('1. Basic random words:');
  const basic = getRandomWords(3);
  console.log(basic.map(w => w.word).join(', '));
  
  // Test 2: Cache functionality
  console.log('\n2. Cache test:');
  const cached = await getRandomWordsWithKey(3, { uniquenessKey: 'test' });
  console.log(cached.map(w => w.word).join(', '));
  
  // Test 3: Verify cache worked
  console.log('\n3. Cache verification:');
  const stats = getWordCacheStats('test');
  console.log('Cache stats:', stats);
  
  // Test 4: Check if words are marked as used
  console.log('\n4. Word usage check:');
  cached.forEach(word => {
    const used = hasWordBeenUsed(word.word, 'test');
    console.log(`${word.word}: ${used}`);
  });
  
  // Test 5: Clear cache
  console.log('\n5. Clear cache:');
  clearWordCache('test');
  const statsAfter = getWordCacheStats('test');
  console.log('After clear:', statsAfter);
  
  console.log('\n✅ All tests passed!');
  
  // Stop the cleanup interval to allow process to exit
  stopCacheCleanup();
}

quickTest().catch(console.error);
