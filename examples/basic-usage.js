#!/usr/bin/env node

/**
 * Basic Usage Examples
 * 
 * This example demonstrates basic usage of the CMU Dictionary library
 * with simple, practical examples for getting started.
 * 
 * Run with: node examples/basic-usage.js
 */

import { 
  // Core functions
  countSyllables, 
  countTextSyllables, 
  countSyllablesSync, 
  countTextSyllablesSync,
  
  // Dictionary lookup
  lookupWord,
  cmuDictionary,
  
  // Hyphenation
  hyphenateWord,
  cmuHyphenation,
  
  // Text analysis
  analyzeText,
  quickCountTextSyllables,
  
  // Dictionary utilities
  searchWords,
  getRandomWords,
  findWordsBySyllableCount,
  
  // Cache management
  getRandomWordsWithCache,
  clearCache,
  getCacheStats
} from '../dist/index.esm.js';

console.log('🚀 Basic Usage Examples\n');

async function demonstrateBasicUsage() {
  console.log('=== 1. Basic Syllable Counting ===\n');
  
  // Simple word syllable counting
  console.log('1.1. Count syllables in words:');
  const words = ['hello', 'beautiful', 'syllable', 'programming', 'algorithm'];
  
  for (const word of words) {
    const syllables = await countSyllables(word);
    console.log(`  "${word}" has ${syllables} syllables`);
  }
  console.log('');
  
  // Text syllable counting
  console.log('1.2. Count syllables in text:');
  const texts = [
    'Hello world',
    'Beautiful day for programming',
    'The quick brown fox jumps over the lazy dog'
  ];
  
  for (const text of texts) {
    const syllables = await countTextSyllables(text);
    console.log(`  "${text}" has ${syllables} total syllables`);
  }
  console.log('');
  
  // Synchronous counting (faster, less accurate)
  console.log('1.3. Synchronous syllable counting:');
  for (const word of words) {
    const syllables = countSyllablesSync(word);
    console.log(`  "${word}" has ${syllables} syllables (sync)`);
  }
  console.log('');
  
  console.log('=== 2. Dictionary Lookup ===\n');
  
  // Check if words are in dictionary
  console.log('2.1. Dictionary membership:');
  const testWords = ['hello', 'nonexistent', 'beautiful', 'xyz123'];
  
  for (const word of testWords) {
    const exists = await cmuDictionary.hasWord(word);
    console.log(`  "${word}" in dictionary: ${exists ? 'Yes' : 'No'}`);
  }
  console.log('');
  
  // Get pronunciations
  console.log('2.2. Word pronunciations:');
  for (const word of words) {
    const pronunciation = await lookupWord(word);
    console.log(`  "${word}": ${pronunciation || 'No pronunciation available'}`);
  }
  console.log('');
  
  console.log('=== 3. Hyphenation ===\n');
  
  // Basic hyphenation
  console.log('3.1. Word hyphenation:');
  for (const word of words) {
    const hyphenated = hyphenateWord(word);
    console.log(`  "${word}" → "${hyphenated}"`);
  }
  console.log('');
  
  // CMU-based hyphenation
  console.log('3.2. CMU-based hyphenation:');
  for (const word of words.slice(0, 3)) {
    const result = cmuHyphenation(word);
    if (result) {
      console.log(`  "${word}": "${result.hyphenated}" (pronunciation: ${result.pronunciation})`);
    } else {
      console.log(`  "${word}": No CMU pronunciation available`);
    }
  }
  console.log('');
  
  console.log('=== 4. Text Analysis ===\n');
  
  // Comprehensive text analysis
  console.log('4.1. Text analysis:');
  const sampleText = 'The quick brown fox jumps over the lazy dog.';
  
  const analysis = await analyzeText(sampleText);
  console.log(`  Text: "${sampleText}"`);
  console.log(`    Total syllables: ${analysis.totalSyllables}`);
  console.log(`    Total words: ${analysis.wordCount}`);
  console.log(`    Average syllables per word: ${analysis.syllablesPerWord.toFixed(2)}`);
  console.log(`    Processing time: ${analysis.metadata.processingTime}ms`);
  console.log('');
  
  // Quick syllable counting
  console.log('4.2. Quick text syllable counting:');
  for (const text of texts) {
    const result = await quickCountTextSyllables(text);
    console.log(`  "${text}" has ${result.totalSyllables} syllables (quick)`);
  }
  console.log('');
  
  console.log('=== 5. Dictionary Search ===\n');
  
  // Search for words
  console.log('5.1. Pattern-based word search:');
  const patterns = ['pro*', '*ing', 'beautiful'];
  
  for (const pattern of patterns) {
    const results = searchWords(pattern, { limit: 5 });
    console.log(`  Pattern "${pattern}":`);
    results.forEach((word, index) => {
      console.log(`    ${index + 1}. "${word.word}" - ${word.syllables} syllables`);
    });
    console.log('');
  }
  
  // Find words by syllable count
  console.log('5.2. Words by syllable count:');
  const syllableCounts = [1, 2, 3];
  
  for (const count of syllableCounts) {
    const words = findWordsBySyllableCount(count, { limit: 5 });
    console.log(`  ${count} syllable words:`);
    words.forEach((word, index) => {
      console.log(`    ${index + 1}. "${word.word}"`);
    });
    console.log('');
  }
  
  // Random word generation
  console.log('5.3. Random word generation:');
  const randomWords = getRandomWords(5);
  console.log('  Random words:');
  randomWords.forEach((word, index) => {
    console.log(`    ${index + 1}. "${word.word}" - ${word.syllables} syllables`);
  });
  console.log('');
  
  console.log('=== 6. Cache Management ===\n');
  
  // Cached random word generation
  console.log('6.1. Cached random word generation:');
  const cachedWords = await getRandomWordsWithCache(5, {
    uniquenessKey: 'demo-session',
    includeAnalysis: true
  });
  
  console.log('  Cached words:');
  cachedWords.forEach((word, index) => {
    if (typeof word === 'string') {
      console.log(`    ${index + 1}. ${word}`);
    } else {
      console.log(`    ${index + 1}. ${word.word} (${word.syllables} syllables)`);
    }
  });
  console.log('');
  
  // Cache statistics
  console.log('6.2. Cache statistics:');
  const stats = getCacheStats();
  console.log(`  Cache size: ${stats.size}/${stats.maxSize} entries`);
  console.log(`  Cache usage: ${((stats.size / stats.maxSize) * 100).toFixed(1)}%`);
  console.log('');
  
  console.log('=== 7. Poetry Analysis ===\n');
  
  // Haiku validation
  console.log('7.1. Haiku validation:');
  const haiku = [
    'An old silent pond',
    'A frog jumps into the pond',
    'Splash! Silence again.'
  ];
  
  for (let i = 0; i < haiku.length; i++) {
    const syllables = await countSyllables(haiku[i]);
    console.log(`  Line ${i + 1}: "${haiku[i]}" - ${syllables} syllables`);
  }
  
  const [line1, line2, line3] = await Promise.all(
    haiku.map(line => countSyllables(line))
  );
  
  if (line1 === 5 && line2 === 7 && line3 === 5) {
    console.log('  ✅ Valid haiku (5-7-5 pattern)');
  } else {
    console.log(`  ❌ Invalid haiku. Expected 5-7-5, got ${line1}-${line2}-${line3}`);
  }
  console.log('');
  
  // Sonnet analysis
  console.log('7.2. Sonnet analysis:');
  const sonnet = `Shall I compare thee to a summer's day?
Thou art more lovely and more temperate.`;
  
  const sonnetSyllables = await countTextSyllables(sonnet);
  console.log(`  Sonnet syllables: ${sonnetSyllables}`);
  console.log('');
  
  console.log('=== 8. Performance Comparison ===\n');
  
  // Performance comparison
  console.log('8.1. Performance comparison:');
  const testWord = 'programming';
  const iterations = 100;
  
  // Test async method
  const asyncStart = performance.now();
  for (let i = 0; i < iterations; i++) {
    await countSyllables(testWord);
  }
  const asyncTime = performance.now() - asyncStart;
  
  // Test sync method
  const syncStart = performance.now();
  for (let i = 0; i < iterations; i++) {
    countSyllablesSync(testWord);
  }
  const syncTime = performance.now() - syncStart;
  
  console.log(`  Async method (${iterations} iterations): ${asyncTime.toFixed(2)}ms`);
  console.log(`  Sync method (${iterations} iterations): ${syncTime.toFixed(2)}ms`);
  console.log(`  Sync is ${(asyncTime / syncTime).toFixed(2)}x faster`);
  console.log('');
  
  console.log('=== 9. Error Handling ===\n');
  
  // Error handling
  console.log('9.1. Error handling:');
  const errorCases = [
    '',           // Empty string
    '123',        // Numbers
    'hello123',   // Mixed alphanumeric
    'a',          // Single character
    '   ',        // Whitespace only
  ];
  
  for (const testCase of errorCases) {
    try {
      const syllables = countSyllablesSync(testCase);
      console.log(`  "${testCase}": ${syllables} syllables`);
    } catch (error) {
      console.log(`  "${testCase}": Error - ${error.message}`);
    }
  }
  console.log('');
  
  console.log('=== 10. Integration Example ===\n');
  
  // Integration example
  console.log('10.1. Complete word analysis:');
  const analysisWords = ['hello', 'beautiful', 'programming'];
  
  for (const word of analysisWords) {
    console.log(`  "${word}":`);
    
    // Syllable count
    const syllables = await countSyllables(word);
    console.log(`    Syllables: ${syllables}`);
    
    // Dictionary lookup
    const exists = await cmuDictionary.hasWord(word);
    console.log(`    In dictionary: ${exists ? 'Yes' : 'No'}`);
    
    // Pronunciation
    const pronunciation = await lookupWord(word);
    if (pronunciation) {
      console.log(`    Pronunciation: ${pronunciation}`);
    }
    
    // Hyphenation
    const hyphenated = hyphenateWord(word);
    console.log(`    Hyphenated: "${hyphenated}"`);
    
    // CMU analysis
    const cmuResult = cmuHyphenation(word);
    if (cmuResult) {
      console.log(`    CMU pronunciation: ${cmuResult.pronunciation}`);
    }
    console.log('');
  }
  
  console.log('✅ Basic usage demonstration completed!');
  console.log('\n📚 Key takeaways:');
  console.log('  • Use async functions for best accuracy');
  console.log('  • Use sync functions for performance');
  console.log('  • Dictionary lookup provides pronunciation data');
  console.log('  • Hyphenation helps with syllable analysis');
  console.log('  • Cache management improves repeated operations');
  console.log('  • Text analysis provides comprehensive insights');
}

// Run the demonstration
demonstrateBasicUsage()
  .then(() => {
    console.log('\n🎉 Example completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
