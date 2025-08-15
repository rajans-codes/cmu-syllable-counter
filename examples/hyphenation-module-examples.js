#!/usr/bin/env node

/**
 * Hyphenation Module Examples
 * 
 * This example demonstrates all hyphenation functionality
 * with detailed parameter usage and real-world scenarios.
 * 
 * Run with: node examples/hyphenation-module-examples.js
 */

import {
  // Basic hyphenation functions
  hyphenateWord,
  getSyllableBoundaries,
  enhancedHyphenation,
  
  // CMU hyphenation functions
  cmuHyphenation,
  enhancedCMUHyphenation,
  getCMUPronunciation,
  hasCMUPronunciation,
  smartHyphenation,
  getHyphenationStats,
  
  // Advanced hyphenation
  hyphenateWordWithInfo,
  
  // Types
  HyphenationOptions,
  HyphenationPattern,
  SmartHyphenationOptions,
  SmartHyphenationResult,
  CMUHyphenationResult,
  HyphenationStats
} from '../dist/index.esm.js';

console.log('🔗 Hyphenation Module Examples\n');

async function demonstrateHyphenationModule() {
  console.log('=== 1. Basic Hyphenation ===\n');
  
  // hyphenateWord(word: string, options?: HyphenationOptions): string
  // Hyphenates a word using pattern matching with dialect support
  console.log('1.1. Basic word hyphenation:');
  const words = ['hello', 'beautiful', 'programming', 'algorithm', 'computer'];
  
  for (const word of words) {
    const hyphenated = hyphenateWord(word);
    console.log(`  "${word}" → "${hyphenated}"`);
  }
  console.log('');
  
  // Different dialects
  console.log('1.2. Dialect-specific hyphenation:');
  const testWord = 'beautiful';
  
  const usHyphenated = hyphenateWord(testWord, { dialect: 'us' });
  const ukHyphenated = hyphenateWord(testWord, { dialect: 'uk' });
  
  console.log(`  "${testWord}" (US): "${usHyphenated}"`);
  console.log(`  "${testWord}" (UK): "${ukHyphenated}"`);
  console.log('');
  
  // Custom patterns
  console.log('1.3. Custom hyphenation patterns:');
  const customPatterns = {
    'programming': 'pro-gram-ming',
    'algorithm': 'al-go-rithm'
  };
  
  for (const word of words) {
    const hyphenated = hyphenateWord(word, { customPatterns });
    console.log(`  "${word}" → "${hyphenated}"`);
  }
  console.log('');
  
  console.log('=== 2. Syllable Boundaries ===\n');
  
  // getSyllableBoundaries(word: string, options?: HyphenationOptions): number[]
  // Returns array of syllable boundary positions
  console.log('2.1. Syllable boundary detection:');
  const boundaryWords = ['hello', 'beautiful', 'programming', 'algorithm'];
  
  for (const word of boundaryWords) {
    const boundaries = getSyllableBoundaries(word);
    console.log(`  "${word}": boundaries at positions ${boundaries.join(', ')}`);
    
    // Visualize boundaries
    let visualization = word;
    for (let i = boundaries.length - 1; i >= 0; i--) {
      const pos = boundaries[i];
      visualization = visualization.slice(0, pos) + '|' + visualization.slice(pos);
    }
    console.log(`    Visualization: "${visualization}"`);
  }
  console.log('');
  
  console.log('=== 3. Enhanced Hyphenation ===\n');
  
  // enhancedHyphenation(word: string, options?: HyphenationOptions): { hyphenated: string; boundaries: number[] }
  // Returns both hyphenated word and boundary positions
  console.log('3.1. Enhanced hyphenation with boundaries:');
  
  for (const word of boundaryWords) {
    const result = enhancedHyphenation(word);
    console.log(`  "${word}":`);
    console.log(`    Hyphenated: "${result.hyphenated}"`);
    console.log(`    Boundaries: [${result.boundaries.join(', ')}]`);
  }
  console.log('');
  
  console.log('=== 4. CMU Dictionary Hyphenation ===\n');
  
  // cmuHyphenation(word: string): { hyphenated: string; pronunciation: string | null; syllables: number }
  // Uses CMU Dictionary for accurate hyphenation
  console.log('4.1. CMU Dictionary hyphenation:');
  const cmuWords = ['hello', 'beautiful', 'programming', 'nonexistent'];
  
  for (const word of cmuWords) {
    const result = cmuHyphenation(word);
    console.log(`  "${word}":`);
    console.log(`    Hyphenated: "${result.hyphenated}"`);
    console.log(`    Pronunciation: ${result.pronunciation || 'N/A'}`);
    console.log(`    Syllables: ${result.syllables}`);
  }
  console.log('');
  
  // enhancedCMUHyphenation(word: string): { hyphenated: string; pronunciation: string | null; syllables: number; boundaries: number[] }
  // Enhanced CMU hyphenation with boundary information
  console.log('4.2. Enhanced CMU hyphenation:');
  
  for (const word of cmuWords.slice(0, 3)) {
    const result = enhancedCMUHyphenation(word);
    console.log(`  "${word}":`);
    console.log(`    Hyphenated: "${result.hyphenated}"`);
    console.log(`    Pronunciation: ${result.pronunciation || 'N/A'}`);
    console.log(`    Syllables: ${result.syllables}`);
    console.log(`    Boundaries: [${result.boundaries.join(', ')}]`);
  }
  console.log('');
  
  console.log('=== 5. CMU Pronunciation Functions ===\n');
  
  // getCMUPronunciation(word: string): string | null
  // Gets pronunciation from CMU Dictionary
  console.log('5.1. CMU pronunciation lookup:');
  
  for (const word of cmuWords) {
    const pronunciation = getCMUPronunciation(word);
    console.log(`  "${word}": ${pronunciation || 'Not found'}`);
  }
  console.log('');
  
  // hasCMUPronunciation(word: string): boolean
  // Checks if word has CMU pronunciation
  console.log('5.2. CMU pronunciation availability:');
  
  for (const word of cmuWords) {
    const hasPronunciation = hasCMUPronunciation(word);
    console.log(`  "${word}": ${hasPronunciation ? 'Has pronunciation' : 'No pronunciation'}`);
  }
  console.log('');
  
  console.log('=== 6. Smart Hyphenation ===\n');
  
  // smartHyphenation(word: string, options: SmartHyphenationOptions): SmartHyphenationResult
  // Advanced hyphenation with multiple strategies
  console.log('6.1. Smart hyphenation with different strategies:');
  const smartWords = ['hello', 'beautiful', 'programming'];
  
  for (const word of smartWords) {
    const result = smartHyphenation(word, {
      preferCMU: true,
      fallbackToPatterns: true,
      includeBoundaries: true,
      includePronunciation: true
    });
    
    console.log(`  "${word}":`);
    console.log(`    Hyphenated: "${result.hyphenated}"`);
    console.log(`    Strategy: ${result.strategy}`);
    console.log(`    Confidence: ${result.confidence}`);
    console.log(`    Pronunciation: ${result.pronunciation || 'N/A'}`);
    console.log(`    Boundaries: [${result.boundaries.join(', ')}]`);
  }
  console.log('');
  
  console.log('=== 7. Hyphenation Statistics ===\n');
  
  // getHyphenationStats(word: string): HyphenationStats
  // Gets detailed hyphenation statistics
  console.log('7.1. Hyphenation statistics:');
  
  for (const word of smartWords) {
    const stats = getHyphenationStats(word);
    console.log(`  "${word}":`);
    console.log(`    Syllables: ${stats.syllables}`);
    console.log(`    Hyphenation points: ${stats.hyphenationPoints}`);
    console.log(`    Average syllable length: ${stats.averageSyllableLength.toFixed(2)}`);
    console.log(`    Syllable distribution: ${JSON.stringify(stats.syllableDistribution)}`);
  }
  console.log('');
  
  console.log('=== 8. Advanced Hyphenation with Info ===\n');
  
  // hyphenateWordWithInfo(word: string, options?: HyphenationOptions): Promise<HyphenationResult>
  // Gets comprehensive hyphenation information
  console.log('8.1. Comprehensive hyphenation information:');
  
  for (const word of smartWords) {
    const info = await hyphenateWordWithInfo(word);
    console.log(`  "${word}":`);
    console.log(`    Word: "${info.word}"`);
    console.log(`    Hyphenated: "${info.hyphenated}"`);
    console.log(`    Syllables: ${info.syllables}`);
    console.log(`    Source: ${info.source}`);
    console.log(`    Boundaries: [${info.boundaries.join(', ')}]`);
  }
  console.log('');
  
  console.log('=== 9. Text Hyphenation ===\n');
  
  // Hyphenating entire texts
  console.log('9.1. Text hyphenation:');
  const texts = [
    'Hello world',
    'Beautiful programming day',
    'The quick brown fox jumps over the lazy dog'
  ];
  
  for (const text of texts) {
    const words = text.split(' ');
    const hyphenatedWords = words.map(word => hyphenateWord(word));
    const hyphenatedText = hyphenatedWords.join(' ');
    
    console.log(`  Original: "${text}"`);
    console.log(`  Hyphenated: "${hyphenatedText}"`);
    console.log('');
  }
  
  console.log('=== 10. Poetry Hyphenation ===\n');
  
  // Poetry-specific hyphenation
  console.log('10.1. Haiku hyphenation:');
  const haiku = [
    'An old silent pond',
    'A frog jumps into the pond',
    'Splash! Silence again.'
  ];
  
  for (let i = 0; i < haiku.length; i++) {
    const line = haiku[i];
    const words = line.split(' ');
    const hyphenatedWords = words.map(word => hyphenateWord(word));
    const hyphenatedLine = hyphenatedWords.join(' ');
    
    console.log(`  Line ${i + 1}: "${line}"`);
    console.log(`  Hyphenated: "${hyphenatedLine}"`);
  }
  console.log('');
  
  console.log('10.2. Sonnet hyphenation:');
  const sonnetLine = "Shall I compare thee to a summer's day?";
  const sonnetWords = sonnetLine.split(' ');
  const hyphenatedSonnet = sonnetWords.map(word => hyphenateWord(word)).join(' ');
  
  console.log(`  Original: "${sonnetLine}"`);
  console.log(`  Hyphenated: "${hyphenatedSonnet}"`);
  console.log('');
  
  console.log('=== 11. Performance Analysis ===\n');
  
  // Performance comparison
  console.log('11.1. Hyphenation performance:');
  const testWord = 'programming';
  const iterations = 1000;
  
  // Test basic hyphenation
  const basicStart = performance.now();
  for (let i = 0; i < iterations; i++) {
    hyphenateWord(testWord);
  }
  const basicTime = performance.now() - basicStart;
  
  // Test CMU hyphenation
  const cmuStart = performance.now();
  for (let i = 0; i < iterations; i++) {
    cmuHyphenation(testWord);
  }
  const cmuTime = performance.now() - cmuStart;
  
  // Test smart hyphenation
  const smartStart = performance.now();
  for (let i = 0; i < iterations; i++) {
    smartHyphenation(testWord);
  }
  const smartTime = performance.now() - smartStart;
  
  console.log(`  Basic hyphenation (${iterations} iterations): ${basicTime.toFixed(2)}ms`);
  console.log(`  CMU hyphenation (${iterations} iterations): ${cmuTime.toFixed(2)}ms`);
  console.log(`  Smart hyphenation (${iterations} iterations): ${smartTime.toFixed(2)}ms`);
  console.log('');
  
  console.log('=== 12. Error Handling ===\n');
  
  // Error handling examples
  console.log('12.1. Error handling:');
  const errorCases = [
    '',           // Empty string
    'a',          // Single character
    '123',        // Numbers only
    'hello123',   // Mixed alphanumeric
    '   ',        // Whitespace only
  ];
  
  for (const testCase of errorCases) {
    try {
      const hyphenated = hyphenateWord(testCase);
      console.log(`  "${testCase}" → "${hyphenated}"`);
    } catch (error) {
      console.log(`  "${testCase}": Error - ${error.message}`);
    }
  }
  console.log('');
  
  console.log('=== 13. Advanced Usage Patterns ===\n');
  
  // Advanced usage patterns
  console.log('13.1. Batch hyphenation:');
  const batchWords = ['hello', 'world', 'programming', 'algorithm', 'computer'];
  
  const batchResults = batchWords.map(word => ({
    word,
    hyphenated: hyphenateWord(word),
    boundaries: getSyllableBoundaries(word),
    cmuResult: cmuHyphenation(word)
  }));
  
  console.log('  Batch results:');
  batchResults.forEach(result => {
    console.log(`    "${result.word}":`);
    console.log(`      Basic: "${result.hyphenated}"`);
    console.log(`      Boundaries: [${result.boundaries.join(', ')}]`);
    console.log(`      CMU: "${result.cmuResult.hyphenated}" (${result.cmuResult.syllables} syllables)`);
  });
  console.log('');
  
  console.log('13.2. Complex word analysis:');
  const complexWords = ['antidisestablishmentarianism', 'pneumonoultramicroscopicsilicovolcanoconiosiss'];
  
  for (const word of complexWords) {
    const basic = hyphenateWord(word);
    const cmu = cmuHyphenation(word);
    const smart = smartHyphenation(word, { preferCMU: true });
    
    console.log(`  "${word}":`);
    console.log(`    Basic: "${basic}"`);
    console.log(`    CMU: "${cmu.hyphenated}" (${cmu.syllables} syllables)`);
    console.log(`    Smart: "${smart.hyphenated}" (${smart.strategy}, ${smart.confidence} confidence)`);
  }
  console.log('');
  
  console.log('=== 14. Integration Examples ===\n');
  
  // Integration with other modules
  console.log('14.1. Syllable counting integration:');
  const integrationWords = ['hello', 'beautiful', 'programming'];
  
  for (const word of integrationWords) {
    const hyphenated = hyphenateWord(word);
    const boundaries = getSyllableBoundaries(word);
    const cmuResult = cmuHyphenation(word);
    
    console.log(`  "${word}":`);
    console.log(`    Hyphenated: "${hyphenated}"`);
    console.log(`    Syllable count (boundaries): ${boundaries.length + 1}`);
    console.log(`    Syllable count (CMU): ${cmuResult.syllables}`);
    console.log(`    Agreement: ${(boundaries.length + 1) === cmuResult.syllables ? 'Yes' : 'No'}`);
  }
  console.log('');
  
  console.log('14.2. Text analysis integration:');
  const sampleText = 'The quick brown fox jumps over the lazy dog.';
  const textWords = sampleText.split(' ').map(word => word.replace(/[^\w]/g, ''));
  
  console.log(`  Text: "${sampleText}"`);
  console.log(`  Word-by-word hyphenation:`);
  
  textWords.forEach((word, index) => {
    if (word) {
      const hyphenated = hyphenateWord(word);
      const cmuResult = cmuHyphenation(word);
      console.log(`    ${index + 1}. "${word}" → "${hyphenated}" (${cmuResult.syllables} syllables)`);
    }
  });
  console.log('');
  
  console.log('=== 15. Memory Management ===\n');
  
  // Memory management demonstration
  console.log('15.1. Memory usage monitoring:');
  
  // Generate some load
  const loadWords = Array.from({ length: 100 }, (_, i) => `word${i}`);
  
  const startMemory = process.memoryUsage();
  
  for (const word of loadWords) {
    hyphenateWord(word);
    cmuHyphenation(word);
    smartHyphenation(word);
  }
  
  const endMemory = process.memoryUsage();
  
  console.log(`  Memory usage:`);
  console.log(`    Before: ${(startMemory.heapUsed / 1024 / 1024).toFixed(2)}MB`);
  console.log(`    After: ${(endMemory.heapUsed / 1024 / 1024).toFixed(2)}MB`);
  console.log(`    Difference: ${((endMemory.heapUsed - startMemory.heapUsed) / 1024 / 1024).toFixed(2)}MB`);
  console.log('');
  
  console.log('✅ Hyphenation module demonstration completed!');
  console.log('\n📚 Key takeaways:');
  console.log('  • Basic hyphenation uses pattern matching');
  console.log('  • CMU hyphenation provides pronunciation-based accuracy');
  console.log('  • Smart hyphenation combines multiple strategies');
  console.log('  • Boundary detection helps with syllable analysis');
  console.log('  • Different dialects may produce different results');
  console.log('  • Performance varies by method (basic < CMU < smart)');
}

// Run the demonstration
demonstrateHyphenationModule().catch(console.error);
