import { cmuDictionary } from '../dist/index.esm.js';
import { test, describe } from 'node:test';
import assert from 'node:assert';

describe('Dictionary Module - cmuDictionary', () => {
  test('should get pronunciation for known word', async () => {
    const pronunciation = await cmuDictionary.getPronunciation('hello');
    console.log('Raw pronunciation result:', pronunciation);
    assert.ok(pronunciation !== undefined);
    assert.strictEqual(typeof pronunciation, 'string');
    assert.ok(pronunciation.length > 0);
  });

  test('should get syllable count for known word', async () => {
    const syllableCount = await cmuDictionary.getSyllableCount('hello');
    console.log('Raw syllable count result:', syllableCount);
    assert.ok(syllableCount > 0);
    assert.strictEqual(typeof syllableCount, 'number');
  });

  test('should check if word exists in dictionary', async () => {
    const exists = await cmuDictionary.hasWord('hello');
    console.log('Raw exists check result:', exists);
    assert.strictEqual(exists, true);
  });

  test('should return null for unknown word pronunciation', async () => {
    const pronunciation = await cmuDictionary.getPronunciation('xyzabc123');
    console.log('Raw unknown word pronunciation result:', pronunciation);
    assert.strictEqual(pronunciation, null);
  });

  test('should return 0 for unknown word syllable count', async () => {
    const syllableCount = await cmuDictionary.getSyllableCount('xyzabc123');
    console.log('Raw unknown word syllable count result:', syllableCount);
    assert.strictEqual(syllableCount, 0);
  });

  test('should return false for unknown word existence', async () => {
    const exists = await cmuDictionary.hasWord('xyzabc123');
    console.log('Raw unknown word exists check result:', exists);
    assert.strictEqual(exists, false);
  });

  test('should handle case insensitive lookups', async () => {
    const pronunciation1 = await cmuDictionary.getPronunciation('HELLO');
    const pronunciation2 = await cmuDictionary.getPronunciation('hello');
    console.log('Raw case insensitive results:', { HELLO: pronunciation1, hello: pronunciation2 });
    assert.strictEqual(pronunciation1, pronunciation2);
  });

  test('should get dictionary statistics', () => {
    const stats = cmuDictionary.getStats();
    console.log('Raw dictionary stats result:', stats);
    assert.ok('totalWords' in stats);
    assert.ok(stats.totalWords > 0);
    assert.strictEqual(typeof stats.totalWords, 'number');
  });

  test('should handle common words', async () => {
    const commonWords = ['the', 'and', 'beautiful', 'computer', 'algorithm'];
    
    for (const word of commonWords) {
      const exists = await cmuDictionary.hasWord(word);
      console.log(`Raw exists check for "${word}":`, exists);
      if (exists) {
        const pronunciation = await cmuDictionary.getPronunciation(word);
        const syllableCount = await cmuDictionary.getSyllableCount(word);
        console.log(`Raw results for "${word}":`, { pronunciation, syllableCount });
        
        assert.ok(pronunciation !== undefined);
        assert.ok(syllableCount > 0);
      }
    }
  });

  test('should handle words with multiple pronunciations', async () => {
    // Some words might have multiple pronunciations in CMU dictionary
    const pronunciation = await cmuDictionary.getPronunciation('read');
    console.log('Raw multiple pronunciations result:', pronunciation);
    assert.ok(pronunciation !== undefined);
  });

  test('should handle empty string input', async () => {
    const pronunciation = await cmuDictionary.getPronunciation('');
    const syllableCount = await cmuDictionary.getSyllableCount('');
    const exists = await cmuDictionary.hasWord('');
    
    console.log('Raw empty string results:', { pronunciation, syllableCount, exists });
    
    assert.strictEqual(pronunciation, null);
    assert.strictEqual(syllableCount, 0);
    assert.strictEqual(exists, false);
  });

  test('should handle whitespace in input', async () => {
    const pronunciation = await cmuDictionary.getPronunciation(' hello ');
    const syllableCount = await cmuDictionary.getSyllableCount(' hello ');
    const exists = await cmuDictionary.hasWord(' hello ');
    
    console.log('Raw whitespace results:', { pronunciation, syllableCount, exists });
    
    assert.strictEqual(pronunciation, null);
    assert.strictEqual(syllableCount, 0);
    assert.strictEqual(exists, false);
  });
});
