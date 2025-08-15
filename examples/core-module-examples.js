#!/usr/bin/env node

/**
 * Core Module Examples
 * 
 * This example demonstrates all core syllable counting functionality
 * with detailed parameter usage and real-world scenarios.
 * 
 * Run with: node examples/core-module-examples.js
 */

import {
  // Core syllable counting functions
  countSyllables,
  countTextSyllables,
  countSyllablesSync,
  countTextSyllablesSync,
  
  // Dictionary lookup functions
  lookupWord,
  isInDictionary,
  getPronunciation,
  
  // Cache management
  clearCache,
  getCacheStats,
  
  // Enhanced syllable information
  getSyllableInfo,
  getTextSyllableInfo,
  getTextSummary,
  
  // Classes and instances
  CMUSyllableCounter,
  syllableCounter,
  enhancedSyllableCounter,
  EnhancedSyllableCounter,
  
  // Fallback functions
  fallbackSyllableCount,
  enhancedFallbackSyllableCount,
  
  // Dictionary access
  cmuDictionary
} from '../dist/index.esm.js';

console.log('🔤 Core Module Examples\n');

async function demonstrateCoreModule() {
  console.log('=== 1. Basic Syllable Counting ===\n');
  
  // countSyllables(word: string, options?: SyllableCountOptions): Promise<number>
  // Counts syllables in a single word using CMU Dictionary with fallback
  console.log('1.1. Async syllable counting:');
  const words = ['hello', 'beautiful', 'syllable', 'programming', 'algorithm'];
  
  for (const word of words) {
    const syllables = await countSyllables(word);
    console.log(`  "${word}" has ${syllables} syllables`);
  }
  console.log('');
  
  // countSyllablesSync(word: string): number
  // Counts syllables synchronously using fallback algorithm only
  console.log('1.2. Sync syllable counting (fallback only):');
  for (const word of words) {
    const syllables = countSyllablesSync(word);
    console.log(`  "${word}" has ${syllables} syllables (sync)`);
  }
  console.log('');
  
  console.log('=== 2. Text Syllable Counting ===\n');
  
  // countTextSyllables(text: string, options?: SyllableCountOptions): Promise<number>
  // Counts total syllables in text by summing individual word syllables
  console.log('2.1. Async text syllable counting:');
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
  
  // countTextSyllablesSync(text: string): number
  // Counts text syllables synchronously using fallback algorithm
  console.log('2.2. Sync text syllable counting:');
  for (const text of texts) {
    const syllables = countTextSyllablesSync(text);
    console.log(`  "${text}" has ${syllables} total syllables (sync)`);
  }
  console.log('');
  
  console.log('=== 3. Dictionary Lookup Functions ===\n');
  
  // lookupWord(word: string): Promise<string | null>
  // Looks up a word in CMU Dictionary and returns pronunciation or null
  console.log('3.1. Dictionary lookup:');
  const lookupWords = ['hello', 'nonexistentword', 'beautiful'];
  
  for (const word of lookupWords) {
    const pronunciation = await lookupWord(word);
    console.log(`  "${word}": ${pronunciation || 'Not found in dictionary'}`);
  }
  console.log('');
  
  // isInDictionary(word: string): Promise<boolean>
  // Checks if a word exists in the CMU Dictionary
  console.log('3.2. Dictionary membership check:');
  for (const word of lookupWords) {
    const exists = await isInDictionary(word);
    console.log(`  "${word}" in dictionary: ${exists ? 'Yes' : 'No'}`);
  }
  console.log('');
  
  // getPronunciation(word: string): Promise<string | null>
  // Gets the pronunciation for a word from CMU Dictionary
  console.log('3.3. Pronunciation lookup:');
  for (const word of lookupWords) {
    const pronunciation = await getPronunciation(word);
    console.log(`  "${word}": ${pronunciation || 'No pronunciation available'}`);
  }
  console.log('');
  
  console.log('=== 4. Enhanced Syllable Information ===\n');
  
  // getSyllableInfo(word: string, options?: SyllableCountOptions & HyphenationOptions): Promise<SyllableInfo>
  // Gets detailed syllable information including pronunciation, boundaries, etc.
  console.log('4.1. Detailed syllable information:');
  const infoWords = ['hello', 'beautiful', 'programming'];
  
  for (const word of infoWords) {
    const info = await getSyllableInfo(word);
    console.log(`  "${word}":`);
    console.log(`    Syllables: ${info.syllables}`);
    console.log(`    Pronunciation: ${info.pronunciation || 'N/A'}`);
    console.log(`    Source: ${info.source}`);
    console.log(`    Boundaries: ${info.boundaries?.join(', ') || 'N/A'}`);
    console.log(`    Hyphenated: ${info.hyphenated || 'N/A'}`);
  }
  console.log('');
  
  // getTextSyllableInfo(text: string, options?: SyllableCountOptions & HyphenationOptions): Promise<SyllableInfo[]>
  // Gets syllable information for each word in text
  console.log('4.2. Text syllable information:');
  const text = 'Hello beautiful world';
  const textInfo = await getTextSyllableInfo(text);
  
  console.log(`  Text: "${text}"`);
  textInfo.forEach((info, index) => {
    console.log(`    Word ${index + 1}: "${info.word}" - ${info.syllables} syllables`);
  });
  console.log('');
  
  // getTextSummary(text: string, options?: SyllableCountOptions & HyphenationOptions): Promise<TextSummary>
  // Gets comprehensive text analysis with statistics
  console.log('4.3. Text summary analysis:');
  const summary = await getTextSummary(text);
  
  console.log(`  Text: "${text}"`);
  console.log(`    Total syllables: ${summary.totalSyllables}`);
  console.log(`    Total words: ${summary.totalWords}`);
  console.log(`    CMU dictionary words: ${summary.cmuWords}`);
  console.log(`    Fallback words: ${summary.fallbackWords}`);
  console.log(`    Average syllables per word: ${summary.averageSyllablesPerWord.toFixed(2)}`);
  console.log('');
  
  console.log('=== 5. Cache Management ===\n');
  
  // getCacheStats(): { size: number; maxSize: number }
  // Gets current cache statistics
  console.log('5.1. Cache statistics:');
  const stats = getCacheStats();
  console.log(`  Cache size: ${stats.size}/${stats.maxSize} entries`);
  console.log(`  Cache usage: ${((stats.size / stats.maxSize) * 100).toFixed(1)}%`);
  console.log('');
  
  // clearCache(): void
  // Clears the syllable counter cache
  console.log('5.2. Cache clearing:');
  console.log('  Clearing cache...');
  clearCache();
  
  const newStats = getCacheStats();
  console.log(`  Cache size after clearing: ${newStats.size}/${newStats.maxSize} entries`);
  console.log('');
  
  console.log('=== 6. Class-Based Usage ===\n');
  
  // CMUSyllableCounter class
  console.log('6.1. CMUSyllableCounter class:');
  const counter = new CMUSyllableCounter();
  
  for (const word of words.slice(0, 3)) {
    const syllables = await counter.count(word);
    console.log(`  "${word}" has ${syllables} syllables`);
  }
  
  const textSyllables = await counter.countText('Hello world');
  console.log(`  "Hello world" has ${textSyllables} syllables`);
  
  const counterStats = counter.getCacheStats();
  console.log(`  Counter cache: ${counterStats.size}/${counterStats.maxSize} entries`);
  console.log('');
  
  // EnhancedSyllableCounter class
  console.log('6.2. EnhancedSyllableCounter class:');
  const enhancedCounter = new EnhancedSyllableCounter();
  
  for (const word of words.slice(0, 3)) {
    const info = await enhancedCounter.getSyllableInfo(word);
    console.log(`  "${word}": ${info.syllables} syllables (${info.source})`);
  }
  console.log('');
  
  console.log('=== 7. Fallback Functions ===\n');
  
  // fallbackSyllableCount(word: string): number
  // Basic fallback syllable counting algorithm
  console.log('7.1. Basic fallback counting:');
  for (const word of words) {
    const syllables = fallbackSyllableCount(word);
    console.log(`  "${word}" has ${syllables} syllables (basic fallback)`);
  }
  console.log('');
  
  // enhancedFallbackSyllableCount(word: string): number
  // Enhanced fallback algorithm with better accuracy
  console.log('7.2. Enhanced fallback counting:');
  for (const word of words) {
    const syllables = enhancedFallbackSyllableCount(word);
    console.log(`  "${word}" has ${syllables} syllables (enhanced fallback)`);
  }
  console.log('');
  
  console.log('=== 8. Dictionary Access ===\n');
  
  // cmuDictionary instance
  console.log('8.1. Direct dictionary access:');
  const dictWords = ['hello', 'world', 'programming'];
  
  for (const word of dictWords) {
    const entry = cmuDictionary.get(word);
    if (entry) {
      console.log(`  "${word}": ${entry.pronunciation} (${entry.syllables} syllables)`);
    } else {
      console.log(`  "${word}": Not found in dictionary`);
    }
  }
  console.log('');
  
  console.log('=== 9. Poetry Analysis ===\n');
  
  // Real-world poetry analysis
  console.log('9.1. Haiku validation:');
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
  
  console.log('9.2. Sonnet analysis:');
  const sonnet = `Shall I compare thee to a summer's day?
Thou art more lovely and more temperate.
Rough winds do shake the darling buds of May,
And summer's lease hath all too short a date.`;
  
  const sonnetSummary = await getTextSummary(sonnet);
  console.log(`  Sonnet syllables: ${sonnetSummary.totalSyllables}`);
  console.log(`  Sonnet words: ${sonnetSummary.totalWords}`);
  console.log(`  Average syllables per word: ${sonnetSummary.averageSyllablesPerWord.toFixed(2)}`);
  console.log('');
  
  console.log('=== 10. Performance Comparison ===\n');
  
  // Performance comparison between sync and async methods
  console.log('10.1. Performance comparison:');
  const testWord = 'programming';
  const iterations = 1000;
  
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
  
  console.log('=== 11. Error Handling ===\n');
  
  // Error handling examples
  console.log('11.1. Error handling:');
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
  
  console.log('=== 12. Advanced Usage Patterns ===\n');
  
  // Advanced usage patterns
  console.log('12.1. Batch processing:');
  const batchWords = ['hello', 'world', 'programming', 'algorithm', 'computer'];
  
  // Process all words concurrently
  const batchResults = await Promise.all(
    batchWords.map(word => countSyllables(word))
  );
  
  console.log('  Batch results:');
  batchWords.forEach((word, index) => {
    console.log(`    "${word}": ${batchResults[index]} syllables`);
  });
  console.log('');
  
  console.log('12.2. Word complexity analysis:');
  const complexWords = ['antidisestablishmentarianism', 'pneumonoultramicroscopicsilicovolcanoconiosiss', 'hippopotomonstrosesquippedaliophobia'];
  
  for (const word of complexWords) {
    const info = await getSyllableInfo(word);
    console.log(`  "${word}":`);
    console.log(`    Syllables: ${info.syllables}`);
    console.log(`    Source: ${info.source}`);
    console.log(`    Length: ${word.length} characters`);
  }
  console.log('');
  
  console.log('=== 13. Integration Examples ===\n');
  
  // Integration with other modules
  console.log('13.1. Text analysis integration:');
  const sampleText = 'The quick brown fox jumps over the lazy dog.';
  
  // Get comprehensive text analysis
  const textAnalysis = await getTextSummary(sampleText, {
    includeHyphenation: true,
    includePronunciation: true
  });
  
  console.log(`  Text: "${sampleText}"`);
  console.log(`  Analysis:`);
  console.log(`    Total syllables: ${textAnalysis.totalSyllables}`);
  console.log(`    Total words: ${textAnalysis.totalWords}`);
  console.log(`    CMU dictionary coverage: ${((textAnalysis.cmuWords / textAnalysis.totalWords) * 100).toFixed(1)}%`);
  console.log(`    Average syllables per word: ${textAnalysis.averageSyllablesPerWord.toFixed(2)}`);
  
  console.log(`    Word details:`);
  textAnalysis.wordDetails.forEach((wordInfo, index) => {
    console.log(`      ${index + 1}. "${wordInfo.word}": ${wordInfo.syllables} syllables (${wordInfo.source})`);
  });
  console.log('');
  
  console.log('=== 14. Memory Management ===\n');
  
  // Memory management demonstration
  console.log('14.1. Memory usage monitoring:');
  
  // Generate some load to fill cache
  const loadWords = Array.from({ length: 100 }, (_, i) => `word${i}`);
  
  for (const word of loadWords) {
    await countSyllables(word);
  }
  
  const finalStats = getCacheStats();
  console.log(`  Final cache statistics:`);
  console.log(`    Cache size: ${finalStats.size}/${finalStats.maxSize} entries`);
  console.log(`    Cache usage: ${((finalStats.size / finalStats.maxSize) * 100).toFixed(1)}%`);
  
  // Clear cache to free memory
  clearCache();
  const clearedStats = getCacheStats();
  console.log(`  After clearing: ${clearedStats.size}/${clearedStats.maxSize} entries`);
  console.log('');
  
  console.log('✅ Core module demonstration completed!');
  console.log('\n📚 Key takeaways:');
  console.log('  • Use async functions for best accuracy (CMU Dictionary + fallback)');
  console.log('  • Use sync functions for performance-critical applications');
  console.log('  • Cache management helps with repeated lookups');
  console.log('  • Enhanced functions provide detailed syllable information');
  console.log('  • Dictionary lookup functions for pronunciation data');
}

// Run the demonstration
demonstrateCoreModule().catch(console.error);
