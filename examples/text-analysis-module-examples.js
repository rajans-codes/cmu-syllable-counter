#!/usr/bin/env node

/**
 * Text Analysis Module Examples
 * 
 * This example demonstrates all text analysis functionality
 * with detailed parameter usage and real-world scenarios.
 * 
 * Run with: node examples/text-analysis-module-examples.js
 */

import {
  // Text analysis functions
  analyzeText,
  quickCountTextSyllables,
  getWordBreakdown,
  batchCountWords,
  validateTextInput,
  
  // Types
  TextAnalysisOptions,
  TextSyllableResult
} from '../dist/index.esm.js';

console.log('📊 Text Analysis Module Examples\n');

async function demonstrateTextAnalysisModule() {
  console.log('=== 1. Basic Text Analysis ===\n');
  
  // analyzeText(text: string, options?: TextAnalysisOptions): Promise<TextSyllableResult>
  // Comprehensive text analysis with syllable counting and statistics
  console.log('1.1. Comprehensive text analysis:');
  const texts = [
    'Hello world',
    'Beautiful day for programming',
    'The quick brown fox jumps over the lazy dog',
    'Shall I compare thee to a summer\'s day?'
  ];
  
  for (const text of texts) {
    const analysis = await analyzeText(text);
    console.log(`  Text: "${text}"`);
    console.log(`    Total syllables: ${analysis.totalSyllables}`);
    console.log(`    Total words: ${analysis.totalWords}`);
    console.log(`    Average syllables per word: ${analysis.averageSyllablesPerWord.toFixed(2)}`);
    console.log(`    CMU dictionary coverage: ${((analysis.cmuWords / analysis.totalWords) * 100).toFixed(1)}%`);
    console.log(`    Fallback words: ${analysis.fallbackWords}`);
    console.log('');
  }
  
  // With options
  console.log('1.2. Text analysis with options:');
  const sampleText = 'The quick brown fox jumps over the lazy dog.';
  
  const analysisWithOptions = await analyzeText(sampleText, {
    includeWordDetails: true,
    includeHyphenation: true,
    includePronunciation: true,
    caseSensitive: false,
    ignorePunctuation: true
  });
  
  console.log(`  Text: "${sampleText}"`);
  console.log(`    Total syllables: ${analysisWithOptions.totalSyllables}`);
  console.log(`    Total words: ${analysisWithOptions.totalWords}`);
  console.log(`    Average syllables per word: ${analysisWithOptions.averageSyllablesPerWord.toFixed(2)}`);
  
  if (analysisWithOptions.wordDetails) {
    console.log(`    Word details:`);
    analysisWithOptions.wordDetails.forEach((wordInfo, index) => {
      console.log(`      ${index + 1}. "${wordInfo.word}": ${wordInfo.syllables} syllables (${wordInfo.source})`);
      if (wordInfo.hyphenated) {
        console.log(`         Hyphenated: "${wordInfo.hyphenated}"`);
      }
      if (wordInfo.pronunciation) {
        console.log(`         Pronunciation: ${wordInfo.pronunciation}`);
      }
    });
  }
  console.log('');
  
  console.log('=== 2. Quick Syllable Counting ===\n');
  
  // quickCountTextSyllables(text: string, options?: TextAnalysisOptions): Promise<number>
  // Fast syllable counting for text without detailed analysis
  console.log('2.1. Quick syllable counting:');
  
  for (const text of texts) {
    const syllables = await quickCountTextSyllables(text);
    console.log(`  "${text}" has ${syllables} syllables`);
  }
  console.log('');
  
  // Performance comparison
  console.log('2.2. Performance comparison:');
  const testText = 'The quick brown fox jumps over the lazy dog.';
  const iterations = 100;
  
  // Test comprehensive analysis
  const comprehensiveStart = performance.now();
  for (let i = 0; i < iterations; i++) {
    await analyzeText(testText);
  }
  const comprehensiveTime = performance.now() - comprehensiveStart;
  
  // Test quick counting
  const quickStart = performance.now();
  for (let i = 0; i < iterations; i++) {
    await quickCountTextSyllables(testText);
  }
  const quickTime = performance.now() - quickStart;
  
  console.log(`  Comprehensive analysis (${iterations} iterations): ${comprehensiveTime.toFixed(2)}ms`);
  console.log(`  Quick counting (${iterations} iterations): ${quickTime.toFixed(2)}ms`);
  console.log(`  Quick is ${(comprehensiveTime / quickTime).toFixed(2)}x faster`);
  console.log('');
  
  console.log('=== 3. Word Breakdown ===\n');
  
  // getWordBreakdown(word: string): Promise<{ word: string; syllables: number; source: string; pronunciation?: string; hyphenated?: string }>
  // Detailed analysis of a single word
  console.log('3.1. Word breakdown analysis:');
  const breakdownWords = ['hello', 'beautiful', 'programming', 'algorithm', 'nonexistent'];
  
  for (const word of breakdownWords) {
    const breakdown = await getWordBreakdown(word);
    console.log(`  "${word}":`);
    console.log(`    Syllables: ${breakdown.syllables}`);
    console.log(`    Source: ${breakdown.source}`);
    if (breakdown.pronunciation) {
      console.log(`    Pronunciation: ${breakdown.pronunciation}`);
    }
    if (breakdown.hyphenated) {
      console.log(`    Hyphenated: "${breakdown.hyphenated}"`);
    }
  }
  console.log('');
  
  console.log('=== 4. Batch Word Counting ===\n');
  
  // batchCountWords(words: string[], options?: TextAnalysisOptions): Promise<Array<{ word: string; syllables: number; source: string }>>
  // Process multiple words efficiently
  console.log('4.1. Batch word counting:');
  const batchWords = ['hello', 'world', 'programming', 'algorithm', 'computer', 'beautiful', 'syllable'];
  
  const batchResults = await batchCountWords(batchWords);
  
  console.log('  Batch results:');
  batchResults.forEach((result, index) => {
    console.log(`    ${index + 1}. "${result.word}": ${result.syllables} syllables (${result.source})`);
  });
  console.log('');
  
  // With options
  console.log('4.2. Batch counting with options:');
  const batchWithOptions = await batchCountWords(batchWords, {
    includePronunciation: true,
    includeHyphenation: true
  });
  
  console.log('  Batch results with details:');
  batchWithOptions.forEach((result, index) => {
    console.log(`    ${index + 1}. "${result.word}": ${result.syllables} syllables (${result.source})`);
    if (result.pronunciation) {
      console.log(`       Pronunciation: ${result.pronunciation}`);
    }
    if (result.hyphenated) {
      console.log(`       Hyphenated: "${result.hyphenated}"`);
    }
  });
  console.log('');
  
  console.log('=== 5. Input Validation ===\n');
  
  // validateTextInput(text: string): { isValid: boolean; errors: string[]; warnings: string[] }
  // Validates text input for analysis
  console.log('5.1. Text input validation:');
  const validationTests = [
    'Hello world',                    // Valid
    '',                               // Empty
    '   ',                            // Whitespace only
    '123',                            // Numbers only
    'Hello123world',                  // Mixed alphanumeric
    'a',                              // Single character
    'The quick brown fox jumps over the lazy dog.', // Long text
    'Hello\nworld',                   // With newlines
    'Hello\tworld',                   // With tabs
    'Hello   world'                   // Multiple spaces
  ];
  
  for (const test of validationTests) {
    const validation = validateTextInput(test);
    console.log(`  "${test}":`);
    console.log(`    Valid: ${validation.isValid ? 'Yes' : 'No'}`);
    if (validation.errors.length > 0) {
      console.log(`    Errors: ${validation.errors.join(', ')}`);
    }
    if (validation.warnings.length > 0) {
      console.log(`    Warnings: ${validation.warnings.join(', ')}`);
    }
  }
  console.log('');
  
  console.log('=== 6. Poetry Analysis ===\n');
  
  // Poetry-specific analysis
  console.log('6.1. Haiku analysis:');
  const haiku = [
    'An old silent pond',
    'A frog jumps into the pond',
    'Splash! Silence again.'
  ];
  
  for (let i = 0; i < haiku.length; i++) {
    const analysis = await analyzeText(haiku[i]);
    console.log(`  Line ${i + 1}: "${haiku[i]}"`);
    console.log(`    Syllables: ${analysis.totalSyllables}`);
    console.log(`    Words: ${analysis.totalWords}`);
    console.log(`    Average: ${analysis.averageSyllablesPerWord.toFixed(2)} syllables per word`);
  }
  
  const [line1, line2, line3] = await Promise.all(
    haiku.map(line => quickCountTextSyllables(line))
  );
  
  if (line1 === 5 && line2 === 7 && line3 === 5) {
    console.log('  ✅ Valid haiku (5-7-5 pattern)');
  } else {
    console.log(`  ❌ Invalid haiku. Expected 5-7-5, got ${line1}-${line2}-${line3}`);
  }
  console.log('');
  
  console.log('6.2. Sonnet analysis:');
  const sonnet = `Shall I compare thee to a summer's day?
Thou art more lovely and more temperate.
Rough winds do shake the darling buds of May,
And summer's lease hath all too short a date.`;
  
  const sonnetAnalysis = await analyzeText(sonnet, {
    includeWordDetails: true,
    includeHyphenation: true
  });
  
  console.log(`  Sonnet analysis:`);
  console.log(`    Total syllables: ${sonnetAnalysis.totalSyllables}`);
  console.log(`    Total words: ${sonnetAnalysis.totalWords}`);
  console.log(`    Average syllables per word: ${sonnetAnalysis.averageSyllablesPerWord.toFixed(2)}`);
  console.log(`    CMU dictionary coverage: ${((sonnetAnalysis.cmuWords / sonnetAnalysis.totalWords) * 100).toFixed(1)}%`);
  
  // Analyze each line
  const sonnetLines = sonnet.split('\n');
  console.log(`    Line-by-line analysis:`);
  for (let i = 0; i < sonnetLines.length; i++) {
    const lineSyllables = await quickCountTextSyllables(sonnetLines[i]);
    console.log(`      Line ${i + 1}: ${lineSyllables} syllables`);
  }
  console.log('');
  
  console.log('=== 7. Document Analysis ===\n');
  
  // Document-level analysis
  console.log('7.1. Document analysis:');
  const document = `This is a sample document for analysis.
It contains multiple paragraphs with various words.
The purpose is to demonstrate text analysis capabilities.
We can analyze syllable patterns and word complexity.`;
  
  const documentAnalysis = await analyzeText(document, {
    includeWordDetails: true,
    includeHyphenation: true,
    includePronunciation: true
  });
  
  console.log(`  Document analysis:`);
  console.log(`    Total syllables: ${documentAnalysis.totalSyllables}`);
  console.log(`    Total words: ${documentAnalysis.totalWords}`);
  console.log(`    Average syllables per word: ${documentAnalysis.averageSyllablesPerWord.toFixed(2)}`);
  console.log(`    CMU dictionary coverage: ${((documentAnalysis.cmuWords / documentAnalysis.totalWords) * 100).toFixed(1)}%`);
  
  // Word frequency analysis
  if (documentAnalysis.wordDetails) {
    const wordFrequency = {};
    documentAnalysis.wordDetails.forEach(wordInfo => {
      const word = wordInfo.word.toLowerCase();
      wordFrequency[word] = (wordFrequency[word] || 0) + 1;
    });
    
    console.log(`    Word frequency:`);
    Object.entries(wordFrequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .forEach(([word, count]) => {
        console.log(`      "${word}": ${count} times`);
      });
  }
  console.log('');
  
  console.log('=== 8. Performance Analysis ===\n');
  
  // Performance analysis
  console.log('8.1. Performance analysis:');
  const performanceTexts = [
    'Short text',
    'This is a medium length text for testing performance',
    'This is a much longer text that contains many more words and will take longer to process. It includes various types of words with different syllable counts and complexity levels.',
    'The quick brown fox jumps over the lazy dog. '.repeat(10) // Repeated text
  ];
  
  for (const text of performanceTexts) {
    const start = performance.now();
    const analysis = await analyzeText(text);
    const end = performance.now();
    
    console.log(`  "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}":`);
    console.log(`    Time: ${(end - start).toFixed(2)}ms`);
    console.log(`    Words: ${analysis.totalWords}`);
    console.log(`    Syllables: ${analysis.totalSyllables}`);
    console.log(`    Words per second: ${(analysis.totalWords / ((end - start) / 1000)).toFixed(0)}`);
  }
  console.log('');
  
  console.log('=== 9. Error Handling ===\n');
  
  // Error handling examples
  console.log('9.1. Error handling:');
  const errorCases = [
    '',                               // Empty string
    null,                             // Null
    undefined,                        // Undefined
    '123',                            // Numbers only
    'a'.repeat(1000),                 // Very long single character
    '   ',                            // Whitespace only
    'Hello\n\n\nworld',               // Multiple newlines
    'Hello\t\t\tworld'                // Multiple tabs
  ];
  
  for (const testCase of errorCases) {
    try {
      if (testCase === null || testCase === undefined) {
        console.log(`  ${testCase}: Cannot analyze null/undefined`);
        continue;
      }
      
      const validation = validateTextInput(testCase);
      if (!validation.isValid) {
        console.log(`  "${testCase}": Invalid - ${validation.errors.join(', ')}`);
        continue;
      }
      
      const syllables = await quickCountTextSyllables(testCase);
      console.log(`  "${testCase}": ${syllables} syllables`);
    } catch (error) {
      console.log(`  "${testCase}": Error - ${error.message}`);
    }
  }
  console.log('');
  
  console.log('=== 10. Advanced Usage Patterns ===\n');
  
  // Advanced usage patterns
  console.log('10.1. Concurrent analysis:');
  const concurrentTexts = [
    'Hello world',
    'Beautiful day',
    'Programming is fun',
    'Algorithm complexity',
    'Computer science'
  ];
  
  const concurrentStart = performance.now();
  const concurrentResults = await Promise.all(
    concurrentTexts.map(text => analyzeText(text))
  );
  const concurrentEnd = performance.now();
  
  console.log(`  Concurrent analysis (${concurrentTexts.length} texts): ${(concurrentEnd - concurrentStart).toFixed(2)}ms`);
  
  concurrentResults.forEach((result, index) => {
    console.log(`    ${index + 1}. "${concurrentTexts[index]}": ${result.totalSyllables} syllables`);
  });
  console.log('');
  
  console.log('10.2. Progressive analysis:');
  const progressiveText = 'The quick brown fox jumps over the lazy dog.';
  const words = progressiveText.split(' ');
  
  console.log(`  Progressive analysis of: "${progressiveText}"`);
  for (let i = 1; i <= words.length; i++) {
    const partialText = words.slice(0, i).join(' ');
    const analysis = await analyzeText(partialText);
    console.log(`    Words 1-${i}: ${analysis.totalSyllables} syllables`);
  }
  console.log('');
  
  console.log('=== 11. Integration Examples ===\n');
  
  // Integration with other modules
  console.log('11.1. Integration with core module:');
  const integrationText = 'Hello beautiful world of programming';
  
  // Use text analysis for overview
  const textAnalysis = await analyzeText(integrationText);
  console.log(`  Text overview: "${integrationText}"`);
  console.log(`    Total syllables: ${textAnalysis.totalSyllables}`);
  console.log(`    Total words: ${textAnalysis.totalWords}`);
  
  // Use batch counting for detailed word analysis
  const words = integrationText.split(' ');
  const wordAnalysis = await batchCountWords(words, {
    includePronunciation: true,
    includeHyphenation: true
  });
  
  console.log(`    Word-by-word analysis:`);
  wordAnalysis.forEach((wordInfo, index) => {
    console.log(`      ${index + 1}. "${wordInfo.word}": ${wordInfo.syllables} syllables (${wordInfo.source})`);
    if (wordInfo.pronunciation) {
      console.log(`         Pronunciation: ${wordInfo.pronunciation}`);
    }
    if (wordInfo.hyphenated) {
      console.log(`         Hyphenated: "${wordInfo.hyphenated}"`);
    }
  });
  console.log('');
  
  console.log('11.2. Text complexity analysis:');
  const complexityTexts = [
    'Hello world',                    // Simple
    'Beautiful programming day',      // Medium
    'Algorithmic complexity analysis' // Complex
  ];
  
  for (const text of complexityTexts) {
    const analysis = await analyzeText(text, { includeWordDetails: true });
    const avgSyllables = analysis.averageSyllablesPerWord;
    
    let complexity = 'Simple';
    if (avgSyllables > 2.5) complexity = 'Complex';
    else if (avgSyllables > 1.8) complexity = 'Medium';
    
    console.log(`  "${text}":`);
    console.log(`    Average syllables per word: ${avgSyllables.toFixed(2)}`);
    console.log(`    Complexity: ${complexity}`);
    console.log(`    CMU coverage: ${((analysis.cmuWords / analysis.totalWords) * 100).toFixed(1)}%`);
  }
  console.log('');
  
  console.log('=== 12. Memory Management ===\n');
  
  // Memory management demonstration
  console.log('12.1. Memory usage monitoring:');
  
  const startMemory = process.memoryUsage();
  
  // Generate some load
  const loadTexts = Array.from({ length: 50 }, (_, i) => `Text ${i} with various words for testing memory usage`);
  
  for (const text of loadTexts) {
    await analyzeText(text);
  }
  
  const endMemory = process.memoryUsage();
  
  console.log(`  Memory usage:`);
  console.log(`    Before: ${(startMemory.heapUsed / 1024 / 1024).toFixed(2)}MB`);
  console.log(`    After: ${(endMemory.heapUsed / 1024 / 1024).toFixed(2)}MB`);
  console.log(`    Difference: ${((endMemory.heapUsed - startMemory.heapUsed) / 1024 / 1024).toFixed(2)}MB`);
  console.log('');
  
  console.log('✅ Text analysis module demonstration completed!');
  console.log('\n📚 Key takeaways:');
  console.log('  • analyzeText() provides comprehensive text analysis');
  console.log('  • quickCountTextSyllables() is faster for simple counting');
  console.log('  • batchCountWords() efficiently processes multiple words');
  console.log('  • validateTextInput() ensures data quality');
  console.log('  • getWordBreakdown() provides detailed single-word analysis');
  console.log('  • Performance varies with text length and complexity');
}

// Run the demonstration
demonstrateTextAnalysisModule().catch(console.error);
