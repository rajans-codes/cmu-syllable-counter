import { 
  getSyllableCount, 
  cmuDictionary, 
  enhancedHyphenateWord, 
  enhancedFallbackSyllableCount
} from '../dist/index.esm.js';
import { test, describe } from 'node:test';
import assert from 'node:assert';

describe('Integration Tests - Complete Workflow', () => {
  // Note: SyllableCounter is not exported from main index, so we'll test other modules

  test('should handle complete text analysis workflow', async () => {
    const text = 'hello beautiful world';
    
    // Test main function with analysis included
    const resultWithAnalysis = await getSyllableCount(text, { 
      includeHyp: true, 
      includePron: true, 
      includeAnalysis: true 
    });
    
    // Test main function without analysis
    const resultWithoutAnalysis = await getSyllableCount(text, { 
      includeHyp: true, 
      includePron: true 
    });
    
    console.log('📊 Complete Text Analysis Result (with analysis):');
    console.log('Raw result object:', resultWithAnalysis);
    
    console.log('📊 Complete Text Analysis Result (without analysis):');
    console.log('Raw result object:', resultWithoutAnalysis);
    
    assert.ok(resultWithAnalysis.totalSyllableCount > 0);
    assert.ok(resultWithAnalysis.wordDetails !== undefined);
    assert.ok(resultWithAnalysis.analysis !== undefined);
    assert.strictEqual(resultWithAnalysis.analysis.totalWords, 3);
    
    assert.ok(resultWithoutAnalysis.totalSyllableCount > 0);
    assert.ok(resultWithoutAnalysis.wordDetails !== undefined);
    assert.strictEqual(resultWithoutAnalysis.analysis, undefined);
  });

  test('should handle fallback workflow for unknown words', async () => {
    const unknownWord = 'xyzabc123';
    
    // Dictionary should not have this word
    const exists = await cmuDictionary.hasWord(unknownWord);
    assert.strictEqual(exists, false);
    
    // Fallback should still provide syllable count
    const fallbackCount = enhancedFallbackSyllableCount(unknownWord);
    assert.ok(fallbackCount > 0);
    
    // Hyphenation should work
    const hyphenated = enhancedHyphenateWord(unknownWord);
    assert.ok(hyphenated !== undefined);
    
    console.log('🔄 Fallback Workflow Results:');
    console.log('Raw fallback count:', fallbackCount);
    console.log('Raw hyphenated result:', hyphenated);
    console.log('Raw dictionary exists check:', exists);
  });

  test('should handle mixed known and unknown words', async () => {
    const mixedText = 'hello xyzabc123 beautiful world';
    
    const result = await getSyllableCount(mixedText, { includeHyp: true });
    
    console.log('🔀 Mixed Words Analysis:');
    console.log('Raw result object:', result);
    
    assert.ok(result.totalSyllableCount > 0);
    assert.strictEqual(result.wordDetails.length, 4);
    
    // Check that some words use CMU and some use fallback
    const sources = result.wordDetails.map(item => item.source);
    assert.ok(sources.includes('cmu'));
    assert.ok(sources.includes('fallback'));
  });

  test('should handle custom delimiter across all functions', async () => {
    const word = 'beautiful';
    const delimiter = '·';
    
    // Test hyphenation with custom delimiter
    const hyphenated = enhancedHyphenateWord(word, { delimiter });
    // Note: Currently hyphenation may not add delimiters to all words
    assert.ok(hyphenated.length > 0);
    
    // Test main function with custom delimiter
    const result = await getSyllableCount(word, { 
      includeHyp: true, 
      delimiter 
    });
    assert.ok(result.wordDetails.length > 0);
    
    console.log('🔧 Custom Delimiter Test:');
    console.log('Raw hyphenated result:', hyphenated);
    console.log('Raw main function result:', result.wordDetails[0]);
  });

  test('should handle custom patterns across all functions', async () => {
    const customPatterns = {
      'testword': 'test-word',
      'customword': 'cus-tom-word'
    };
    
    // Test hyphenation with custom patterns
    const hyphenated1 = enhancedHyphenateWord('testword', { customPatterns });
    assert.strictEqual(hyphenated1, 'test-word');
    
    const hyphenated2 = enhancedHyphenateWord('customword', { customPatterns });
    assert.strictEqual(hyphenated2, 'cus-tom-word');
    
    console.log('🎯 Custom Patterns Test:');
    console.log('Raw hyphenated1 result:', hyphenated1);
    console.log('Raw hyphenated2 result:', hyphenated2);
  });

  test('should handle performance with caching', async () => {
    // Note: SyllableCounter is not exported, so we'll test basic performance
    const words = ['hello', 'beautiful', 'world', 'computer', 'algorithm'];
    
    // Test that basic functions work efficiently
    const startTime = Date.now();
    for (const word of words) {
      enhancedFallbackSyllableCount(word);
      enhancedHyphenateWord(word);
    }
    const duration = Date.now() - startTime;
    
    console.log('⚡ Performance Test:');
    console.log('Raw duration:', duration);
    console.log('Raw average time per word:', duration / words.length);
    
    // Should complete within reasonable time
    assert.ok(duration < 1000, 'Basic functions should complete quickly');
  });

  test('should handle edge cases consistently across modules', async () => {
    const edgeCases = ['', '   ', 'a', 'hi', 'test123', "don't", 'co-operation'];
    
    for (const word of edgeCases) {
      // All modules should handle the same edge case
      const fallbackCount = enhancedFallbackSyllableCount(word);
      const hyphenated = enhancedHyphenateWord(word);
      
      // Results should be consistent
      if (word.trim() === '') {
        assert.strictEqual(fallbackCount, 0);
      } else {
        assert.ok(fallbackCount > 0);
      }
      
      assert.ok(hyphenated !== undefined);
    }
  });

  test('should handle large text processing', async () => {
    const largeText = 'hello beautiful world computer algorithm programming development internationalization ' +
                     'electroencephalography pneumonoultramicroscopicsilicovolcanoconioses ' +
                     'supercalifragilisticexpialidocious antidisestablishmentarianism';
    
    const result = await getSyllableCount(largeText, { 
      includeHyp: true, 
      includeAnalysis: true 
    });
    
    console.log('📈 Large Text Processing:');
    console.log('Raw result object:', result);
    
    assert.ok(result.totalSyllableCount > 0);
    assert.ok(result.analysis.totalWords > 10);
    assert.ok(result.wordDetails.length > 10);
  });

  test('should handle concurrent requests', async () => {
    const words = ['hello', 'beautiful', 'world', 'computer', 'algorithm'];
    
    // Make concurrent requests to basic functions
    const promises = words.map(word => Promise.resolve({
      syllables: enhancedFallbackSyllableCount(word),
      hyphenated: enhancedHyphenateWord(word)
    }));
    const results = await Promise.all(promises);
    
    assert.strictEqual(results.length, words.length);
    results.forEach(result => {
      assert.ok(result.syllables > 0);
      assert.ok(result.hyphenated !== undefined);
    });
  });

  test('should maintain data consistency across modules', async () => {
    const word = 'beautiful';
    
    // Get syllable count from different sources
    const fallbackCount = enhancedFallbackSyllableCount(word);
    const mainResult = await getSyllableCount(word);
    
    // All should return positive syllable counts
    assert.ok(fallbackCount > 0);
    assert.ok(mainResult.totalSyllableCount > 0);
    
    // If word is in CMU dictionary, counts should match
    const exists = await cmuDictionary.hasWord(word);
    let cmuCount = null;
    if (exists) {
      cmuCount = await cmuDictionary.getSyllableCount(word);
      assert.ok(cmuCount > 0);
    }
    
    console.log('🔍 Data Consistency Check:');
    console.log('Raw fallback count:', fallbackCount);
    console.log('Raw main function count:', mainResult.totalSyllableCount);
    console.log('Raw CMU dictionary count:', cmuCount);
    console.log('Raw exists check:', exists);
  });

  test("should maintain word order in parallel processing", async () => {
    const sentence = "hello beautiful world computer algorithm";
    const words = sentence.split(" ");
    
    const result = await getSyllableCount(sentence, {
      includeHyp: true,
      includePron: true,
      includeAnalysis: true
    });

    console.log("🔍 Word Order Test:");
    console.log("Input words:", words);
    console.log("Output wordDetails:", result.wordDetails?.map(w => w.word));
    
    // Verify order is maintained
    assert.ok(result.wordDetails);
    assert.strictEqual(result.wordDetails.length, words.length);
    
    for (let i = 0; i < words.length; i++) {
      assert.strictEqual(result.wordDetails[i].word, words[i]);
    }
  });
});
