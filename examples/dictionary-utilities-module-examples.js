#!/usr/bin/env node

/**
 * Dictionary Utilities Module Examples
 * 
 * This example demonstrates all dictionary utilities functionality
 * with detailed parameter usage and real-world scenarios.
 * 
 * Run with: node examples/dictionary-utilities-module-examples.js
 */

import {
  // Basic search functions
  searchWords,
  findWordsBySyllableCount,
  findWordsByPhonemePattern,
  findRhymingWords,
  findWordsByStressPattern,
  findWordsByComplexity,
  findWordsByVowelCount,
  
  // Random word generation
  getRandomWords,
  getRandomWordsWithKey,
  
  // Dictionary information
  getDictionaryStats,
  isWordInDictionary,
  getAllWords,
  getDictionarySize,
  
  // Advanced utilities
  advancedSearch,
  batchProcessWords,
  getComprehensiveStats,
  findWordsByCriteria,
  getWordsByFrequency,
  findSimilarWords,
  getWordClusters,
  exportDictionaryData,
  
  // Types
  WordSearchOptions,
  WordAnalysis,
  PhonemeStats,
  BatchProcessingOptions,
  AdvancedSearchOptions
} from '../dist/index.esm.js';

console.log('📚 Dictionary Utilities Module Examples\n');

async function demonstrateDictionaryUtilitiesModule() {
  console.log('=== 1. Basic Word Search ===\n');
  
  // searchWords(pattern: string, options?: WordSearchOptions): WordAnalysis[]
  // Search for words matching a pattern
  console.log('1.1. Pattern-based word search:');
  const patterns = ['pro*', '*ing', 'beautiful', 'a*e'];
  
  for (const pattern of patterns) {
    const results = searchWords(pattern, { limit: 5 });
    console.log(`  Pattern "${pattern}":`);
    results.forEach((word, index) => {
      console.log(`    ${index + 1}. "${word.word}" - ${word.syllables} syllables`);
    });
    console.log('');
  }
  
  // With options
  console.log('1.2. Advanced pattern search:');
  const advancedResults = searchWords('pro*', {
    limit: 10,
    minSyllables: 2,
    maxSyllables: 4,
    includePronunciation: true,
    includeHyphenation: true
  });
  
  console.log('  Advanced search for "pro*" (2-4 syllables):');
  advancedResults.forEach((word, index) => {
    console.log(`    ${index + 1}. "${word.word}" - ${word.syllables} syllables`);
    if (word.pronunciation) {
      console.log(`       Pronunciation: ${word.pronunciation}`);
    }
    if (word.hyphenated) {
      console.log(`       Hyphenated: "${word.hyphenated}"`);
    }
  });
  console.log('');
  
  console.log('=== 2. Syllable-Based Search ===\n');
  
  // findWordsBySyllableCount(syllableCount: number, options?: WordSearchOptions): WordAnalysis[]
  // Find words with specific syllable count
  console.log('2.1. Words by syllable count:');
  const syllableCounts = [1, 2, 3, 4];
  
  for (const count of syllableCounts) {
    const words = findWordsBySyllableCount(count, { limit: 8 });
    console.log(`  ${count} syllable words:`);
    words.forEach((word, index) => {
      console.log(`    ${index + 1}. "${word.word}" - ${word.syllables} syllables`);
    });
    console.log('');
  }
  
  // Range search
  console.log('2.2. Words by syllable range:');
  const rangeResults = findWordsBySyllableCount(3, {
    limit: 10,
    minSyllables: 2,
    maxSyllables: 4
  });
  
  console.log('  Words with 2-4 syllables:');
  rangeResults.forEach((word, index) => {
    console.log(`    ${index + 1}. "${word.word}" - ${word.syllables} syllables`);
  });
  console.log('');
  
  console.log('=== 3. Phoneme Pattern Search ===\n');
  
  // findWordsByPhonemePattern(pattern: string, options?: WordSearchOptions): WordAnalysis[]
  // Find words matching phoneme patterns
  console.log('3.1. Phoneme pattern search:');
  const phonemePatterns = ['HH*', '*AH*', 'B*T', 'P*NG'];
  
  for (const pattern of phonemePatterns) {
    const results = findWordsByPhonemePattern(pattern, { limit: 5 });
    console.log(`  Pattern "${pattern}":`);
    results.forEach((word, index) => {
      console.log(`    ${index + 1}. "${word.word}" - ${word.pronunciation || 'N/A'}`);
    });
    console.log('');
  }
  
  console.log('=== 4. Rhyming Words ===\n');
  
  // findRhymingWords(targetWord: string, options?: WordSearchOptions): WordAnalysis[]
  // Find words that rhyme with the target word
  console.log('4.1. Rhyming words:');
  const rhymingTargets = ['cat', 'dog', 'beautiful', 'programming'];
  
  for (const target of rhymingTargets) {
    const rhymes = findRhymingWords(target, { limit: 5 });
    console.log(`  Words rhyming with "${target}":`);
    rhymes.forEach((word, index) => {
      console.log(`    ${index + 1}. "${word.word}" - ${word.pronunciation || 'N/A'}`);
    });
    console.log('');
  }
  
  console.log('=== 5. Stress Pattern Search ===\n');
  
  // findWordsByStressPattern(pattern: string, options?: WordSearchOptions): WordAnalysis[]
  // Find words with specific stress patterns
  console.log('5.1. Stress pattern search:');
  const stressPatterns = ['10', '01', '100', '010'];
  
  for (const pattern of stressPatterns) {
    const results = findWordsByStressPattern(pattern, { limit: 5 });
    console.log(`  Stress pattern "${pattern}":`);
    results.forEach((word, index) => {
      console.log(`    ${index + 1}. "${word.word}" - ${word.pronunciation || 'N/A'}`);
    });
    console.log('');
  }
  
  console.log('=== 6. Complexity-Based Search ===\n');
  
  // findWordsByComplexity(complexity: 'simple' | 'moderate' | 'complex', options?: WordSearchOptions): WordAnalysis[]
  // Find words by complexity level
  console.log('6.1. Words by complexity:');
  const complexities = ['simple', 'moderate', 'complex'];
  
  for (const complexity of complexities) {
    const words = findWordsByComplexity(complexity, { limit: 8 });
    console.log(`  ${complexity} words:`);
    words.forEach((word, index) => {
      console.log(`    ${index + 1}. "${word.word}" - ${word.syllables} syllables`);
    });
    console.log('');
  }
  
  console.log('=== 7. Vowel Count Search ===\n');
  
  // findWordsByVowelCount(vowelCount: number, options?: WordSearchOptions): WordAnalysis[]
  // Find words with specific vowel count
  console.log('7.1. Words by vowel count:');
  const vowelCounts = [1, 2, 3, 4];
  
  for (const count of vowelCounts) {
    const words = findWordsByVowelCount(count, { limit: 6 });
    console.log(`  Words with ${count} vowel(s):`);
    words.forEach((word, index) => {
      console.log(`    ${index + 1}. "${word.word}" - ${word.syllables} syllables`);
    });
    console.log('');
  }
  
  console.log('=== 8. Random Word Generation ===\n');
  
  // getRandomWords(count: number = 10, options?: WordSearchOptions): WordAnalysis[]
  // Generate random words from dictionary
  console.log('8.1. Random word generation:');
  const randomCounts = [5, 10, 15];
  
  for (const count of randomCounts) {
    const words = getRandomWords(count);
    console.log(`  ${count} random words:`);
    words.forEach((word, index) => {
      console.log(`    ${index + 1}. "${word.word}" - ${word.syllables} syllables`);
    });
    console.log('');
  }
  
  // With constraints
  console.log('8.2. Constrained random words:');
  const constrainedWords = getRandomWords(8, {
    minSyllables: 2,
    maxSyllables: 4,
    complexity: 'moderate'
  });
  
  console.log('  Random words (2-4 syllables, moderate complexity):');
  constrainedWords.forEach((word, index) => {
    console.log(`    ${index + 1}. "${word.word}" - ${word.syllables} syllables`);
  });
  console.log('');
  
  // getRandomWordsWithKey(count: number, options: WordSearchOptions & { uniquenessKey: string }): Promise<WordAnalysis[]>
  // Generate random words with uniqueness key for caching
  console.log('8.3. Random words with uniqueness key:');
  const keyWords = await getRandomWordsWithKey(5, {
    uniquenessKey: 'demo-session-1',
    minSyllables: 2,
    maxSyllables: 3
  });
  
  console.log('  Random words with key "demo-session-1":');
  keyWords.forEach((word, index) => {
    console.log(`    ${index + 1}. "${word.word}" - ${word.syllables} syllables`);
  });
  console.log('');
  
  console.log('=== 9. Dictionary Information ===\n');
  
  // getDictionaryStats(): PhonemeStats
  // Get comprehensive dictionary statistics
  console.log('9.1. Dictionary statistics:');
  const stats = getDictionaryStats();
  
  console.log('  Dictionary statistics:');
  console.log(`    Total words: ${stats.totalWords}`);
  console.log(`    Average syllables per word: ${stats.averageSyllablesPerWord.toFixed(2)}`);
  console.log(`    Average word length: ${stats.averageWordLength.toFixed(2)}`);
  console.log(`    Syllable distribution: ${JSON.stringify(stats.syllableDistribution)}`);
  console.log(`    Complexity distribution: ${JSON.stringify(stats.complexityDistribution)}`);
  console.log('');
  
  // isWordInDictionary(word: string): boolean
  // Check if word exists in dictionary
  console.log('9.2. Dictionary membership:');
  const membershipTests = ['hello', 'nonexistent', 'beautiful', 'xyz123'];
  
  for (const word of membershipTests) {
    const exists = isWordInDictionary(word);
    console.log(`  "${word}" in dictionary: ${exists ? 'Yes' : 'No'}`);
  }
  console.log('');
  
  // getAllWords(): string[]
  // Get all words in dictionary
  console.log('9.3. Dictionary size:');
  const allWords = getAllWords();
  const dictSize = getDictionarySize();
  
  console.log(`  Total words in dictionary: ${dictSize}`);
  console.log(`  Sample words: ${allWords.slice(0, 10).join(', ')}...`);
  console.log('');
  
  console.log('=== 10. Advanced Search ===\n');
  
  // advancedSearch(options: AdvancedSearchOptions = {}): WordAnalysis[]
  // Advanced search with multiple criteria
  console.log('10.1. Advanced search:');
  const advancedResults = advancedSearch({
    pattern: 'pro*',
    minSyllables: 2,
    maxSyllables: 4,
    complexity: 'moderate',
    minLength: 6,
    maxLength: 12,
    limit: 10
  });
  
  console.log('  Advanced search results:');
  advancedResults.forEach((word, index) => {
    console.log(`    ${index + 1}. "${word.word}" - ${word.syllables} syllables, ${word.word.length} chars`);
  });
  console.log('');
  
  console.log('=== 11. Batch Processing ===\n');
  
  // batchProcessWords(words: string[], options?: BatchProcessingOptions): Promise<WordAnalysis[]>
  // Process multiple words efficiently
  console.log('11.1. Batch word processing:');
  const batchWords = ['hello', 'world', 'programming', 'algorithm', 'computer', 'beautiful'];
  
  const batchResults = await batchProcessWords(batchWords, {
    includePronunciation: true,
    includeHyphenation: true,
    includeComplexity: true
  });
  
  console.log('  Batch processing results:');
  batchResults.forEach((word, index) => {
    console.log(`    ${index + 1}. "${word.word}":`);
    console.log(`       Syllables: ${word.syllables}`);
    console.log(`       Complexity: ${word.complexity || 'N/A'}`);
    if (word.pronunciation) {
      console.log(`       Pronunciation: ${word.pronunciation}`);
    }
    if (word.hyphenated) {
      console.log(`       Hyphenated: "${word.hyphenated}"`);
    }
  });
  console.log('');
  
  console.log('=== 12. Comprehensive Statistics ===\n');
  
  // getComprehensiveStats(): PhonemeStats
  // Get detailed phoneme statistics
  console.log('12.1. Comprehensive statistics:');
  const comprehensiveStats = getComprehensiveStats();
  
  console.log('  Comprehensive statistics:');
  console.log(`    Total words: ${comprehensiveStats.totalWords}`);
  console.log(`    Average syllables: ${comprehensiveStats.averageSyllablesPerWord.toFixed(2)}`);
  console.log(`    Average length: ${comprehensiveStats.averageWordLength.toFixed(2)}`);
  console.log(`    Syllable distribution: ${JSON.stringify(comprehensiveStats.syllableDistribution)}`);
  console.log(`    Complexity distribution: ${JSON.stringify(comprehensiveStats.complexityDistribution)}`);
  console.log(`    Length distribution: ${JSON.stringify(comprehensiveStats.lengthDistribution)}`);
  console.log('');
  
  console.log('=== 13. Criteria-Based Search ===\n');
  
  // findWordsByCriteria(criteria: { pattern?: string; minSyllables?: number; maxSyllables?: number; complexity?: string; minLength?: number; maxLength?: number }, options?: WordSearchOptions): WordAnalysis[]
  // Find words matching multiple criteria
  console.log('13.1. Criteria-based search:');
  const criteriaResults = findWordsByCriteria({
    pattern: 'be*',
    minSyllables: 2,
    maxSyllables: 4,
    complexity: 'moderate',
    minLength: 5,
    maxLength: 10
  }, { limit: 8 });
  
  console.log('  Criteria-based search results:');
  criteriaResults.forEach((word, index) => {
    console.log(`    ${index + 1}. "${word.word}" - ${word.syllables} syllables, ${word.word.length} chars`);
  });
  console.log('');
  
  console.log('=== 14. Frequency Analysis ===\n');
  
  // getWordsByFrequency(analysis: 'phonemes' | 'syllables' | 'length' | 'complexity'): Array<{ value: string | number; count: number; percentage: number }>
  // Get frequency analysis of various metrics
  console.log('14.1. Frequency analysis:');
  const frequencyTypes = ['syllables', 'length', 'complexity'];
  
  for (const type of frequencyTypes) {
    const frequencies = getWordsByFrequency(type);
    console.log(`  ${type} frequency analysis (top 5):`);
    frequencies.slice(0, 5).forEach((item, index) => {
      console.log(`    ${index + 1}. ${item.value}: ${item.count} words (${item.percentage.toFixed(1)}%)`);
    });
    console.log('');
  }
  
  console.log('=== 15. Similar Word Search ===\n');
  
  // findSimilarWords(targetWord: string, similarityThreshold: number = 0.7, options?: WordSearchOptions): Array<WordAnalysis & { similarity: number }>
  // Find words similar to target word
  console.log('15.1. Similar words:');
  const similarTargets = ['hello', 'beautiful', 'programming'];
  
  for (const target of similarTargets) {
    const similar = findSimilarWords(target, 0.6, { limit: 5 });
    console.log(`  Words similar to "${target}":`);
    similar.forEach((word, index) => {
      console.log(`    ${index + 1}. "${word.word}" - similarity: ${word.similarity.toFixed(3)}`);
    });
    console.log('');
  }
  
  console.log('=== 16. Word Clustering ===\n');
  
  // getWordClusters(clusterType: 'syllable' | 'length' | 'complexity' | 'stress'): Record<string, string[]>
  // Get word clusters by various criteria
  console.log('16.1. Word clustering:');
  const clusterTypes = ['syllable', 'length', 'complexity'];
  
  for (const type of clusterTypes) {
    const clusters = getWordClusters(type);
    console.log(`  ${type} clusters:`);
    Object.entries(clusters).slice(0, 3).forEach(([key, words]) => {
      console.log(`    ${key}: ${words.slice(0, 5).join(', ')}${words.length > 5 ? '...' : ''}`);
    });
    console.log('');
  }
  
  console.log('=== 17. Data Export ===\n');
  
  // exportDictionaryData(format: 'json' | 'csv' | 'tsv', options?: WordSearchOptions): string
  // Export dictionary data in various formats
  console.log('17.1. Data export:');
  const exportFormats = ['json', 'csv', 'tsv'];
  
  for (const format of exportFormats) {
    const exported = exportDictionaryData(format, {
      limit: 10,
      minSyllables: 2,
      maxSyllables: 3
    });
    
    console.log(`  ${format.toUpperCase()} export (first 200 chars):`);
    console.log(`    ${exported.substring(0, 200)}${exported.length > 200 ? '...' : ''}`);
    console.log('');
  }
  
  console.log('=== 18. Performance Analysis ===\n');
  
  // Performance comparison
  console.log('18.1. Search performance:');
  const searchMethods = [
    { name: 'Pattern search', fn: () => searchWords('pro*', { limit: 50 }) },
    { name: 'Syllable search', fn: () => findWordsBySyllableCount(3, { limit: 50 }) },
    { name: 'Complexity search', fn: () => findWordsByComplexity('moderate', { limit: 50 }) },
    { name: 'Advanced search', fn: () => advancedSearch({ pattern: 'pro*', limit: 50 }) }
  ];
  
  for (const method of searchMethods) {
    const start = performance.now();
    const results = method.fn();
    const end = performance.now();
    
    console.log(`  ${method.name}: ${results.length} results in ${(end - start).toFixed(2)}ms`);
  }
  console.log('');
  
  console.log('=== 19. Memory Management ===\n');
  
  // Memory management demonstration
  console.log('19.1. Memory usage monitoring:');
  
  const startMemory = process.memoryUsage();
  
  // Generate some load
  const loadSearches = [
    () => searchWords('a*', { limit: 100 }),
    () => findWordsBySyllableCount(2, { limit: 100 }),
    () => getRandomWords(100),
    () => advancedSearch({ pattern: 'b*', limit: 100 })
  ];
  
  for (const search of loadSearches) {
    search();
  }
  
  const endMemory = process.memoryUsage();
  
  console.log(`  Memory usage:`);
  console.log(`    Before: ${(startMemory.heapUsed / 1024 / 1024).toFixed(2)}MB`);
  console.log(`    After: ${(endMemory.heapUsed / 1024 / 1024).toFixed(2)}MB`);
  console.log(`    Difference: ${((endMemory.heapUsed - startMemory.heapUsed) / 1024 / 1024).toFixed(2)}MB`);
  console.log('');
  
  console.log('✅ Dictionary utilities module demonstration completed!');
  console.log('\n📚 Key takeaways:');
  console.log('  • searchWords() for pattern-based searches');
  console.log('  • findWordsBySyllableCount() for syllable-based filtering');
  console.log('  • getRandomWords() for random word generation');
  console.log('  • advancedSearch() for complex multi-criteria searches');
  console.log('  • batchProcessWords() for efficient bulk processing');
  console.log('  • Various specialized search functions for specific needs');
}

// Run the demonstration
demonstrateDictionaryUtilitiesModule().catch(console.error);
