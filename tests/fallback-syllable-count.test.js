import { enhancedFallbackSyllableCount } from '../dist/index.esm.js';
import { test, describe } from 'node:test';
import assert from 'node:assert';

describe('Fallback Syllable Count Module - enhancedFallbackSyllableCount', () => {
  test('should count syllables for simple word', () => {
    const result = enhancedFallbackSyllableCount('beautiful');
    console.log('Raw simple word syllable count result:', result);
    assert.ok(result > 0);
    assert.strictEqual(typeof result, 'number');
  });

  test('should count syllables for single word', () => {
    const result = enhancedFallbackSyllableCount('hello');
    console.log('Raw single word syllable count result:', result);
    assert.ok(result > 0);
    assert.strictEqual(typeof result, 'number');
  });

  test('should count syllables for sentence', () => {
    const result = enhancedFallbackSyllableCount('hello beautiful world');
    console.log('Raw sentence syllable count result:', result);
    assert.ok(result > 0);
    assert.strictEqual(typeof result, 'number');
  });

  test('should return 0 for empty string', () => {
    const result = enhancedFallbackSyllableCount('');
    console.log('Raw empty string syllable count result:', result);
    assert.strictEqual(result, 0);
  });

  test('should handle short words', () => {
    const result = enhancedFallbackSyllableCount('hi');
    console.log('Raw short word syllable count result:', result);
    assert.ok(result > 0);
  });

  test('should handle very short words', () => {
    const result = enhancedFallbackSyllableCount('a');
    console.log('Raw very short word syllable count result:', result);
    assert.ok(result > 0);
  });

  test('should handle single character', () => {
    const result = enhancedFallbackSyllableCount('x');
    console.log('Raw single character syllable count result:', result);
    assert.ok(result > 0);
  });

  test('should handle common words', () => {
    const commonWords = ['computer', 'algorithm', 'programming', 'development', 'international'];
    
    for (const word of commonWords) {
      const result = enhancedFallbackSyllableCount(word);
      console.log(`Raw common word syllable count for "${word}":`, result);
      assert.ok(result > 0);
      assert.strictEqual(typeof result, 'number');
    }
  });

  test('should handle words with silent e', () => {
    const result = enhancedFallbackSyllableCount('like');
    console.log('Raw silent e syllable count result:', result);
    assert.ok(result > 0);
  });

  test('should handle words ending in -le', () => {
    const result = enhancedFallbackSyllableCount('bottle');
    console.log('Raw -le ending syllable count result:', result);
    assert.ok(result > 0);
  });

  test('should handle words ending in -tion', () => {
    const result = enhancedFallbackSyllableCount('action');
    console.log('Raw -tion ending syllable count result:', result);
    assert.ok(result > 0);
  });

  test('should handle words ending in -sion', () => {
    const result = enhancedFallbackSyllableCount('vision');
    console.log('Raw -sion ending syllable count result:', result);
    assert.ok(result > 0);
  });

  test('should handle words ending in -ious', () => {
    const result = enhancedFallbackSyllableCount('curious');
    console.log('Raw -ious ending syllable count result:', result);
    assert.ok(result > 0);
  });

  test('should handle compound words', () => {
    const compoundWords = ['everyone', 'something', 'anything', 'nothing'];
    
    for (const word of compoundWords) {
      const result = enhancedFallbackSyllableCount(word);
      console.log(`Raw compound word syllable count for "${word}":`, result);
      assert.ok(result > 0);
    }
  });

  test('should handle words with y as vowel', () => {
    const result = enhancedFallbackSyllableCount('rhythm');
    console.log('Raw y as vowel syllable count result:', result);
    assert.ok(result > 0);
  });

  test('should handle words with multiple vowels', () => {
    const result = enhancedFallbackSyllableCount('beautiful');
    console.log('Raw multiple vowels syllable count result:', result);
    assert.ok(result > 0);
  });

  test('should handle words with consecutive vowels', () => {
    const result = enhancedFallbackSyllableCount('cooperation');
    console.log('Raw consecutive vowels syllable count result:', result);
    assert.ok(result > 0);
  });

  test('should handle words with prefixes and suffixes', () => {
    const words = ['unhappy', 'quickly', 'wonderful', 'carefully'];
    
    for (const word of words) {
      const result = enhancedFallbackSyllableCount(word);
      console.log(`Raw prefix/suffix syllable count for "${word}":`, result);
      assert.ok(result > 0);
    }
  });

  test('should handle words with numbers', () => {
    const result = enhancedFallbackSyllableCount('test123');
    console.log('Raw numbers syllable count result:', result);
    assert.ok(result > 0);
  });

  test('should handle mixed case words', () => {
    const result = enhancedFallbackSyllableCount('BeAuTiFuL');
    console.log('Raw mixed case syllable count result:', result);
    assert.ok(result > 0);
  });

  test('should handle words with apostrophes', () => {
    const result = enhancedFallbackSyllableCount("don't");
    console.log('Raw apostrophe syllable count result:', result);
    assert.ok(result > 0);
  });

  test('should handle complex words', () => {
    const complexWords = ['internationalization', 'electroencephalography'];
    
    for (const word of complexWords) {
      const result = enhancedFallbackSyllableCount(word);
      console.log(`Raw complex word syllable count for "${word}":`, result);
      assert.ok(result > 0);
      assert.strictEqual(typeof result, 'number');
    }
  });

  test('should handle words with special characters', () => {
    const result = enhancedFallbackSyllableCount('co-operation');
    console.log('Raw special characters syllable count result:', result);
    assert.ok(result > 0);
  });

  test('should handle whitespace in input', () => {
    const result = enhancedFallbackSyllableCount(' hello ');
    console.log('Raw whitespace syllable count result:', result);
    assert.ok(result > 0);
  });

  test('should handle multiple spaces', () => {
    const result = enhancedFallbackSyllableCount('hello   beautiful   world');
    console.log('Raw multiple spaces syllable count result:', result);
    assert.ok(result > 0);
  });
});
