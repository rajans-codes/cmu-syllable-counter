#!/usr/bin/env node

/**
 * Shared Utilities Module Examples
 * 
 * This example demonstrates all shared utilities functionality
 * with detailed parameter usage and real-world scenarios.
 * 
 * Run with: node examples/shared-utilities-module-examples.js
 */

import {
  // Phoneme analysis functions
  analyzePhonemes,
  countSyllablesFromPronunciation,
  countVowelsFromPronunciation,
  countConsonantsFromPronunciation,
  extractStressPattern,
  determineComplexity,
  generateHyphenationFromPronunciation,
  
  // Similarity and distance functions
  calculatePhonemeSimilarity,
  levenshteinDistance,
  
  // Cache management
  clearPhonemeAnalysisCache,
  getPhonemeAnalysisCacheStats
} from '../dist/index.esm.js';

console.log('🔧 Shared Utilities Module Examples\n');

async function demonstrateSharedUtilitiesModule() {
  console.log('=== 1. Phoneme Analysis ===\n');
  
  // analyzePhonemes(pronunciation: string): PhonemeAnalysis
  // Comprehensive phoneme analysis with caching
  console.log('1.1. Comprehensive phoneme analysis:');
  const pronunciations = [
    'HH AH L OW',           // hello
    'B Y UW T AH F AH L',   // beautiful
    'P R OW G R AE M IH NG', // programming
    'AE L G AH R IH DH AH M' // algorithm
  ];
  
  for (const pronunciation of pronunciations) {
    const analysis = analyzePhonemes(pronunciation);
    
    console.log(`  Pronunciation: "${pronunciation}"`);
    console.log(`    Syllables: ${analysis.syllables}`);
    console.log(`    Vowels: ${analysis.vowels}`);
    console.log(`    Consonants: ${analysis.consonants}`);
    console.log(`    Stress pattern: ${analysis.stressPattern}`);
    console.log(`    Complexity: ${analysis.complexity}`);
    console.log(`    Phoneme diversity: ${analysis.phonemeDiversity.toFixed(3)}`);
    console.log(`    Base phonemes: [${analysis.basePhonemes.join(', ')}]`);
    console.log(`    Unique phonemes: ${analysis.uniquePhonemes.size}`);
    console.log('');
  }
  
  console.log('=== 2. Syllable Counting from Pronunciation ===\n');
  
  // countSyllablesFromPronunciation(pronunciation: string): number
  // Count syllables directly from pronunciation
  console.log('2.1. Syllable counting from pronunciation:');
  
  for (const pronunciation of pronunciations) {
    const syllables = countSyllablesFromPronunciation(pronunciation);
    console.log(`  "${pronunciation}": ${syllables} syllables`);
  }
  console.log('');
  
  // Performance comparison
  console.log('2.2. Performance comparison:');
  const testPronunciation = 'P R OW G R AE M IH NG';
  const iterations = 1000;
  
  // Test with caching (analyzePhonemes)
  const cachedStart = performance.now();
  for (let i = 0; i < iterations; i++) {
    analyzePhonemes(testPronunciation);
  }
  const cachedTime = performance.now() - cachedStart;
  
  // Test without caching (countSyllablesFromPronunciation)
  const uncachedStart = performance.now();
  for (let i = 0; i < iterations; i++) {
    countSyllablesFromPronunciation(testPronunciation);
  }
  const uncachedTime = performance.now() - uncachedStart;
  
  console.log(`  Performance comparison (${iterations} iterations):`);
  console.log(`    With caching: ${cachedTime.toFixed(2)}ms`);
  console.log(`    Without caching: ${uncachedTime.toFixed(2)}ms`);
  console.log(`    Caching speedup: ${(uncachedTime / cachedTime).toFixed(2)}x faster`);
  console.log('');
  
  console.log('=== 3. Vowel and Consonant Counting ===\n');
  
  // countVowelsFromPronunciation(pronunciation: string): number
  // Count vowels from pronunciation
  console.log('3.1. Vowel counting:');
  
  for (const pronunciation of pronunciations) {
    const vowels = countVowelsFromPronunciation(pronunciation);
    console.log(`  "${pronunciation}": ${vowels} vowels`);
  }
  console.log('');
  
  // countConsonantsFromPronunciation(pronunciation: string): number
  // Count consonants from pronunciation
  console.log('3.2. Consonant counting:');
  
  for (const pronunciation of pronunciations) {
    const consonants = countConsonantsFromPronunciation(pronunciation);
    console.log(`  "${pronunciation}": ${consonants} consonants`);
  }
  console.log('');
  
  // Vowel-to-consonant ratio analysis
  console.log('3.3. Vowel-to-consonant ratio analysis:');
  
  for (const pronunciation of pronunciations) {
    const vowels = countVowelsFromPronunciation(pronunciation);
    const consonants = countConsonantsFromPronunciation(pronunciation);
    const ratio = vowels / (vowels + consonants);
    
    console.log(`  "${pronunciation}":`);
    console.log(`    Vowels: ${vowels}, Consonants: ${consonants}`);
    console.log(`    Vowel ratio: ${ratio.toFixed(3)} (${(ratio * 100).toFixed(1)}%)`);
  }
  console.log('');
  
  console.log('=== 4. Stress Pattern Extraction ===\n');
  
  // extractStressPattern(pronunciation: string): string
  // Extract stress pattern from pronunciation
  console.log('4.1. Stress pattern extraction:');
  const stressPronunciations = [
    'HH AH L OW',           // hello (no stress)
    'B Y UW T AH F AH L',   // beautiful (stress on first syllable)
    'P R OW G R AE M IH NG', // programming (stress on second syllable)
    'AE L G AH R IH DH AH M' // algorithm (stress on first syllable)
  ];
  
  for (const pronunciation of stressPronunciations) {
    const stressPattern = extractStressPattern(pronunciation);
    console.log(`  "${pronunciation}": "${stressPattern}"`);
  }
  console.log('');
  
  console.log('=== 5. Complexity Determination ===\n');
  
  // determineComplexity(pronunciation: string): 'simple' | 'moderate' | 'complex'
  // Determine word complexity based on pronunciation
  console.log('5.1. Complexity determination:');
  const complexityPronunciations = [
    'HH AH L OW',           // simple
    'B Y UW T AH F AH L',   // moderate
    'P R OW G R AE M IH NG', // complex
    'AE L G AH R IH DH AH M', // complex
    'K AE T',               // simple
    'D AH G'                // simple
  ];
  
  for (const pronunciation of complexityPronunciations) {
    const complexity = determineComplexity(pronunciation);
    console.log(`  "${pronunciation}": ${complexity} complexity`);
  }
  console.log('');
  
  // Complexity distribution analysis
  console.log('5.2. Complexity distribution analysis:');
  const complexityCounts = {
    simple: 0,
    moderate: 0,
    complex: 0
  };
  
  for (const pronunciation of complexityPronunciations) {
    const complexity = determineComplexity(pronunciation);
    complexityCounts[complexity]++;
  }
  
  const total = complexityPronunciations.length;
  console.log('  Complexity distribution:');
  Object.entries(complexityCounts).forEach(([complexity, count]) => {
    const percentage = (count / total) * 100;
    console.log(`    ${complexity}: ${count} words (${percentage.toFixed(1)}%)`);
  });
  console.log('');
  
  console.log('=== 6. Hyphenation from Pronunciation ===\n');
  
  // generateHyphenationFromPronunciation(word: string, pronunciation: string): string
  // Generate hyphenation based on pronunciation
  console.log('6.1. Hyphenation generation:');
  const hyphenationPairs = [
    { word: 'hello', pronunciation: 'HH AH L OW' },
    { word: 'beautiful', pronunciation: 'B Y UW T AH F AH L' },
    { word: 'programming', pronunciation: 'P R OW G R AE M IH NG' },
    { word: 'algorithm', pronunciation: 'AE L G AH R IH DH AH M' }
  ];
  
  for (const pair of hyphenationPairs) {
    const hyphenated = generateHyphenationFromPronunciation(pair.word, pair.pronunciation);
    console.log(`  "${pair.word}" (${pair.pronunciation}): "${hyphenated}"`);
  }
  console.log('');
  
  console.log('=== 7. Phoneme Similarity ===\n');
  
  // calculatePhonemeSimilarity(phonemes1: string[], phonemes2: string[]): number
  // Calculate similarity between phoneme arrays
  console.log('7.1. Phoneme similarity calculation:');
  const phonemePairs = [
    {
      name: 'Similar words',
      phonemes1: ['HH', 'AH', 'L', 'OW'],
      phonemes2: ['HH', 'EH', 'L', 'OW']
    },
    {
      name: 'Different words',
      phonemes1: ['HH', 'AH', 'L', 'OW'],
      phonemes2: ['K', 'AE', 'T']
    },
    {
      name: 'Identical words',
      phonemes1: ['B', 'Y', 'UW', 'T', 'AH', 'F', 'AH', 'L'],
      phonemes2: ['B', 'Y', 'UW', 'T', 'AH', 'F', 'AH', 'L']
    }
  ];
  
  for (const pair of phonemePairs) {
    const similarity = calculatePhonemeSimilarity(pair.phonemes1, pair.phonemes2);
    console.log(`  ${pair.name}:`);
    console.log(`    Phonemes 1: [${pair.phonemes1.join(', ')}]`);
    console.log(`    Phonemes 2: [${pair.phonemes2.join(', ')}]`);
    console.log(`    Similarity: ${similarity.toFixed(3)} (${(similarity * 100).toFixed(1)}%)`);
    console.log('');
  }
  
  console.log('=== 8. Levenshtein Distance ===\n');
  
  // levenshteinDistance(arr1: string[], arr2: string[]): number
  // Calculate Levenshtein distance between arrays
  console.log('8.1. Levenshtein distance calculation:');
  const distancePairs = [
    {
      name: 'Similar arrays',
      arr1: ['HH', 'AH', 'L', 'OW'],
      arr2: ['HH', 'EH', 'L', 'OW']
    },
    {
      name: 'Different arrays',
      arr1: ['HH', 'AH', 'L', 'OW'],
      arr2: ['K', 'AE', 'T']
    },
    {
      name: 'Identical arrays',
      arr1: ['B', 'Y', 'UW', 'T'],
      arr2: ['B', 'Y', 'UW', 'T']
    },
    {
      name: 'Empty arrays',
      arr1: [],
      arr2: ['K', 'AE', 'T']
    }
  ];
  
  for (const pair of distancePairs) {
    const distance = levenshteinDistance(pair.arr1, pair.arr2);
    console.log(`  ${pair.name}:`);
    console.log(`    Array 1: [${pair.arr1.join(', ')}]`);
    console.log(`    Array 2: [${pair.arr2.join(', ')}]`);
    console.log(`    Distance: ${distance}`);
    console.log('');
  }
  
  console.log('=== 9. Cache Management ===\n');
  
  // getPhonemeAnalysisCacheStats(): { size: number; hitRate: number }
  // Get phoneme analysis cache statistics
  console.log('9.1. Phoneme analysis cache statistics:');
  
  // Generate some load to fill cache
  for (const pronunciation of pronunciations) {
    analyzePhonemes(pronunciation);
  }
  
  const cacheStats = getPhonemeAnalysisCacheStats();
  console.log(`  Cache statistics:`);
  console.log(`    Size: ${cacheStats.size} entries`);
  console.log(`    Hit rate: ${cacheStats.hitRate.toFixed(2)}%`);
  console.log('');
  
  // clearPhonemeAnalysisCache(): void
  // Clear the phoneme analysis cache
  console.log('9.2. Cache clearing:');
  console.log('  Clearing phoneme analysis cache...');
  clearPhonemeAnalysisCache();
  
  const clearedStats = getPhonemeAnalysisCacheStats();
  console.log(`  After clearing:`);
  console.log(`    Size: ${clearedStats.size} entries`);
  console.log(`    Hit rate: ${clearedStats.hitRate.toFixed(2)}%`);
  console.log('');
  
  console.log('=== 10. Performance Analysis ===\n');
  
  // Performance analysis
  console.log('10.1. Function performance comparison:');
  const testData = {
    pronunciation: 'P R OW G R AE M IH NG',
    phonemes1: ['HH', 'AH', 'L', 'OW'],
    phonemes2: ['HH', 'EH', 'L', 'OW'],
    word: 'programming'
  };
  
  const performanceTests = [
    { name: 'analyzePhonemes', fn: () => analyzePhonemes(testData.pronunciation) },
    { name: 'countSyllablesFromPronunciation', fn: () => countSyllablesFromPronunciation(testData.pronunciation) },
    { name: 'countVowelsFromPronunciation', fn: () => countVowelsFromPronunciation(testData.pronunciation) },
    { name: 'countConsonantsFromPronunciation', fn: () => countConsonantsFromPronunciation(testData.pronunciation) },
    { name: 'extractStressPattern', fn: () => extractStressPattern(testData.pronunciation) },
    { name: 'determineComplexity', fn: () => determineComplexity(testData.pronunciation) },
    { name: 'generateHyphenationFromPronunciation', fn: () => generateHyphenationFromPronunciation(testData.word, testData.pronunciation) },
    { name: 'calculatePhonemeSimilarity', fn: () => calculatePhonemeSimilarity(testData.phonemes1, testData.phonemes2) },
    { name: 'levenshteinDistance', fn: () => levenshteinDistance(testData.phonemes1, testData.phonemes2) }
  ];
  
  const iterations = 1000;
  
  for (const test of performanceTests) {
    const start = performance.now();
    for (let i = 0; i < iterations; i++) {
      test.fn();
    }
    const end = performance.now();
    
    console.log(`  ${test.name}: ${(end - start).toFixed(2)}ms (${iterations} iterations)`);
  }
  console.log('');
  
  console.log('=== 11. Error Handling ===\n');
  
  // Error handling examples
  console.log('11.1. Error handling:');
  const errorCases = [
    { name: 'Empty pronunciation', pronunciation: '' },
    { name: 'Single phoneme', pronunciation: 'HH' },
    { name: 'Invalid phonemes', pronunciation: 'INVALID PHONEME' },
    { name: 'Mixed case', pronunciation: 'hh ah l ow' },
    { name: 'Extra spaces', pronunciation: '  HH  AH  L  OW  ' }
  ];
  
  for (const testCase of errorCases) {
    try {
      const analysis = analyzePhonemes(testCase.pronunciation);
      console.log(`  ${testCase.name}: Success - ${analysis.syllables} syllables`);
    } catch (error) {
      console.log(`  ${testCase.name}: Error - ${error.message}`);
    }
  }
  console.log('');
  
  console.log('=== 12. Advanced Usage Patterns ===\n');
  
  // Advanced usage patterns
  console.log('12.1. Batch phoneme analysis:');
  const batchPronunciations = [
    'HH AH L OW',
    'B Y UW T AH F AH L',
    'P R OW G R AE M IH NG',
    'AE L G AH R IH DH AH M',
    'K AE T',
    'D AH G'
  ];
  
  const batchResults = batchPronunciations.map(pronunciation => ({
    pronunciation,
    analysis: analyzePhonemes(pronunciation)
  }));
  
  console.log('  Batch analysis results:');
  batchResults.forEach((result, index) => {
    console.log(`    ${index + 1}. "${result.pronunciation}":`);
    console.log(`       Syllables: ${result.analysis.syllables}, Complexity: ${result.analysis.complexity}`);
    console.log(`       Vowel ratio: ${(result.analysis.vowels / (result.analysis.vowels + result.analysis.consonants) * 100).toFixed(1)}%`);
  });
  console.log('');
  
  console.log('12.2. Phoneme clustering:');
  const clusters = {
    simple: [],
    moderate: [],
    complex: []
  };
  
  for (const result of batchResults) {
    clusters[result.analysis.complexity].push(result.pronunciation);
  }
  
  console.log('  Phoneme clusters by complexity:');
  Object.entries(clusters).forEach(([complexity, pronunciations]) => {
    console.log(`    ${complexity}: ${pronunciations.length} words`);
    console.log(`      Examples: ${pronunciations.slice(0, 3).join(', ')}${pronunciations.length > 3 ? '...' : ''}`);
  });
  console.log('');
  
  console.log('=== 13. Integration Examples ===\n');
  
  // Integration with other modules
  console.log('13.1. Integration with core module:');
  const integrationWords = ['hello', 'beautiful', 'programming', 'algorithm'];
  
  console.log('  Word analysis with phoneme integration:');
  for (const word of integrationWords) {
    // Simulate getting pronunciation from core module
    const mockPronunciations = {
      'hello': 'HH AH L OW',
      'beautiful': 'B Y UW T AH F AH L',
      'programming': 'P R OW G R AE M IH NG',
      'algorithm': 'AE L G AH R IH DH AH M'
    };
    
    const pronunciation = mockPronunciations[word];
    if (pronunciation) {
      const analysis = analyzePhonemes(pronunciation);
      const hyphenated = generateHyphenationFromPronunciation(word, pronunciation);
      
      console.log(`    "${word}":`);
      console.log(`      Pronunciation: ${pronunciation}`);
      console.log(`      Syllables: ${analysis.syllables}, Complexity: ${analysis.complexity}`);
      console.log(`      Hyphenated: "${hyphenated}"`);
    }
  }
  console.log('');
  
  console.log('13.2. Similarity analysis:');
  const similarityWords = [
    { word: 'hello', pronunciation: 'HH AH L OW' },
    { word: 'help', pronunciation: 'HH EH L P' },
    { word: 'cat', pronunciation: 'K AE T' }
  ];
  
  console.log('  Word similarity analysis:');
  for (let i = 0; i < similarityWords.length; i++) {
    for (let j = i + 1; j < similarityWords.length; j++) {
      const word1 = similarityWords[i];
      const word2 = similarityWords[j];
      
      const phonemes1 = word1.pronunciation.split(' ');
      const phonemes2 = word2.pronunciation.split(' ');
      
      const similarity = calculatePhonemeSimilarity(phonemes1, phonemes2);
      const distance = levenshteinDistance(phonemes1, phonemes2);
      
      console.log(`    "${word1.word}" vs "${word2.word}":`);
      console.log(`      Similarity: ${similarity.toFixed(3)}, Distance: ${distance}`);
    }
  }
  console.log('');
  
  console.log('=== 14. Memory Management ===\n');
  
  // Memory management demonstration
  console.log('14.1. Memory usage monitoring:');
  
  const startMemory = process.memoryUsage();
  
  // Generate some load
  const loadPronunciations = Array.from({ length: 100 }, (_, i) => 
    `HH AH L OW ${i}`.split(' ').slice(0, 4).join(' ')
  );
  
  for (const pronunciation of loadPronunciations) {
    analyzePhonemes(pronunciation);
  }
  
  const endMemory = process.memoryUsage();
  
  console.log(`  Memory usage:`);
  console.log(`    Before: ${(startMemory.heapUsed / 1024 / 1024).toFixed(2)}MB`);
  console.log(`    After: ${(endMemory.heapUsed / 1024 / 1024).toFixed(2)}MB`);
  console.log(`    Difference: ${((endMemory.heapUsed - startMemory.heapUsed) / 1024 / 1024).toFixed(2)}MB`);
  
  const finalCacheStats = getPhonemeAnalysisCacheStats();
  console.log(`  Final cache statistics:`);
  console.log(`    Size: ${finalCacheStats.size} entries`);
  console.log(`    Hit rate: ${finalCacheStats.hitRate.toFixed(2)}%`);
  console.log('');
  
  console.log('✅ Shared utilities module demonstration completed!');
  console.log('\n📚 Key takeaways:');
  console.log('  • analyzePhonemes() provides comprehensive phoneme analysis');
  console.log('  • Individual counting functions for specific metrics');
  console.log('  • determineComplexity() for word complexity assessment');
  console.log('  • generateHyphenationFromPronunciation() for pronunciation-based hyphenation');
  console.log('  • calculatePhonemeSimilarity() and levenshteinDistance() for comparison');
  console.log('  • Built-in caching improves performance for repeated operations');
  console.log('  • All functions handle edge cases gracefully');
}

// Run the demonstration
demonstrateSharedUtilitiesModule().catch(console.error);
