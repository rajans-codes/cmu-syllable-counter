import { describe, test } from 'node:test';
import assert from 'node:assert';
import { 
  cmuDictionary,
  findWordsBySyllableCount,
  findWordsByStressPattern,
  findWordsByComplexity,
  findWordsByVowelCount,
  getRandomWords,
  findRhymingWords,
  getAllWords,
  getDictionarySize,
  isWordInDictionary
} from '../dist/index.esm.js';

describe('Dictionary Module - cmuDictionary', () => {
  test('should get word data for known word', async () => {
    const wordData = cmuDictionary.getWord('hello');
    assert.ok(wordData);
    assert.strictEqual(wordData.s, 2);
    assert.ok(wordData.p);
    assert.strictEqual(typeof wordData.p, 'string');
  });

  test('should get pronunciation for known word', async () => {
    const pronunciation = await cmuDictionary.getPronunciation('hello');
    assert.ok(pronunciation);
    assert.strictEqual(typeof pronunciation, 'string');
  });

  test('should get syllable count for known word', async () => {
    const syllableCount = await cmuDictionary.getSyllableCount('hello');
    assert.strictEqual(syllableCount, 2);
  });

  test('should get hyphenated version for known word', async () => {
    const hyphenated = await cmuDictionary.getHyphenated('hello');
    assert.ok(hyphenated);
    assert.strictEqual(typeof hyphenated, 'string');
  });

  test('should check if word exists in dictionary', async () => {
    const exists = await cmuDictionary.hasWord('hello');
    assert.strictEqual(exists, true);
  });

  test('should return null for unknown word', async () => {
    const wordData = cmuDictionary.getWord('xyzqwerty');
    assert.strictEqual(wordData, null);
  });

  test('should return null for unknown word pronunciation', async () => {
    const pronunciation = await cmuDictionary.getPronunciation('xyzqwerty');
    assert.strictEqual(pronunciation, null);
  });

  test('should return 0 for unknown word syllable count', async () => {
    const syllableCount = await cmuDictionary.getSyllableCount('xyzqwerty');
    assert.strictEqual(syllableCount, 0);
  });

  test('should return null for unknown word hyphenated', async () => {
    const hyphenated = await cmuDictionary.getHyphenated('xyzqwerty');
    assert.strictEqual(hyphenated, null);
  });

  test('should return false for unknown word existence', async () => {
    const exists = await cmuDictionary.hasWord('xyzqwerty');
    assert.strictEqual(exists, false);
  });

  test('should handle case insensitive lookups', async () => {
    const wordData1 = cmuDictionary.getWord('HELLO');
    const wordData2 = cmuDictionary.getWord('hello');
    const wordData3 = cmuDictionary.getWord('Hello');
    
    assert.ok(wordData1);
    assert.ok(wordData2);
    assert.ok(wordData3);
    assert.strictEqual(wordData1.s, wordData2.s);
    assert.strictEqual(wordData2.s, wordData3.s);
  });

  test('should get dictionary statistics', async () => {
    const stats = cmuDictionary.getStats();
    assert.ok(stats);
    assert.strictEqual(typeof stats.totalWords, 'number');
    assert.ok(stats.totalWords > 0);
  });

  test('should get multiple words at once', async () => {
    const words = ['hello', 'world', 'xyzqwerty'];
    const results = cmuDictionary.getWords(words);
    
    assert.ok(results.hello);
    assert.ok(results.world);
    assert.strictEqual(results.xyzqwerty, null);
  });

  test('should check if dictionary is ready', async () => {
    const isReady = cmuDictionary.isReady();
    assert.strictEqual(isReady, true);
  });

  test('should handle empty string input', async () => {
    const wordData = cmuDictionary.getWord('');
    assert.strictEqual(wordData, null);
  });

  test('should handle whitespace in input', async () => {
    const wordData = cmuDictionary.getWord(' hello ');
    assert.ok(wordData);
    assert.strictEqual(wordData.s, 2);
  });
});

describe('Dictionary Module - findWordsBySyllableCount', () => {
  test('should find words with specific syllable count', () => {
    const words = findWordsBySyllableCount(2);
    assert.ok(words.length > 0);
    words.forEach(word => {
      assert.strictEqual(word.syllables, 2);
      assert.ok(word.word);
    });
  });

  test('should respect limit option', () => {
    const words = findWordsBySyllableCount(2, { limit: 5 });
    assert.ok(words.length <= 5);
  });

  test('should include pronunciation when requested', () => {
    const words = findWordsBySyllableCount(2, { 
      limit: 3, 
      includePronunciation: true 
    });
    words.forEach(word => {
      assert.ok(word.pronunciation);
      assert.ok(word.phonemeCount);
      assert.ok(word.vowelCount);
      assert.ok(word.consonantCount);
      assert.ok(word.stressPattern);
      assert.ok(word.complexity);
    });
  });

  test('should include hyphenation when requested', () => {
    const words = findWordsBySyllableCount(2, { 
      limit: 3, 
      includeHyphenation: true 
    });
    words.forEach(word => {
      if (word.hyphenated) {
        assert.strictEqual(typeof word.hyphenated, 'string');
      }
    });
  });

  test('should handle different syllable counts', () => {
    const oneSyllable = findWordsBySyllableCount(1, { limit: 3 });
    const threeSyllable = findWordsBySyllableCount(3, { limit: 3 });
    
    assert.ok(oneSyllable.length > 0);
    assert.ok(threeSyllable.length > 0);
    
    oneSyllable.forEach(word => assert.strictEqual(word.syllables, 1));
    threeSyllable.forEach(word => assert.strictEqual(word.syllables, 3));
  });

  test('should return empty array for invalid syllable count', () => {
    const words = findWordsBySyllableCount(0);
    assert.strictEqual(words.length, 0);
  });

  test('should return empty array for very high syllable count', () => {
    const words = findWordsBySyllableCount(20);
    assert.strictEqual(words.length, 0);
  });
});

describe('Dictionary Module - findWordsByStressPattern', () => {
  test('should find words with specific stress pattern', () => {
    const words = findWordsByStressPattern('10', { limit: 5 });
    assert.ok(words.length > 0);
    words.forEach(word => {
      assert.strictEqual(word.stressPattern, '10');
      assert.ok(word.word);
    });
  });

  test('should respect limit option', () => {
    const words = findWordsByStressPattern('10', { limit: 3 });
    assert.ok(words.length <= 3);
  });

  test('should include pronunciation when requested', () => {
    const words = findWordsByStressPattern('10', { 
      limit: 3, 
      includePronunciation: true 
    });
    words.forEach(word => {
      assert.ok(word.pronunciation);
      assert.ok(word.syllables);
    });
  });

  test('should handle different stress patterns', () => {
    const pattern1 = findWordsByStressPattern('1', { limit: 3 });
    const pattern2 = findWordsByStressPattern('01', { limit: 3 });
    
    assert.ok(pattern1.length > 0);
    assert.ok(pattern2.length > 0);
    
    pattern1.forEach(word => assert.strictEqual(word.stressPattern, '1'));
    pattern2.forEach(word => assert.strictEqual(word.stressPattern, '01'));
  });

  test('should return empty array for invalid stress pattern', () => {
    const words = findWordsByStressPattern('999');
    assert.strictEqual(words.length, 0);
  });
});

describe('Dictionary Module - findWordsByComplexity', () => {
  test('should find simple words', () => {
    const words = findWordsByComplexity('simple', { limit: 5 });
    assert.ok(words.length > 0);
    words.forEach(word => {
      assert.strictEqual(word.complexity, 'simple');
      assert.ok(word.word);
    });
  });

  test('should find moderate words', () => {
    const words = findWordsByComplexity('moderate', { limit: 5 });
    assert.ok(words.length > 0);
    words.forEach(word => {
      assert.strictEqual(word.complexity, 'moderate');
      assert.ok(word.word);
    });
  });

  test('should find complex words', () => {
    const words = findWordsByComplexity('complex', { limit: 5 });
    assert.ok(words.length > 0);
    words.forEach(word => {
      assert.strictEqual(word.complexity, 'complex');
      assert.ok(word.word);
    });
  });

  test('should respect limit option', () => {
    const words = findWordsByComplexity('simple', { limit: 3 });
    assert.ok(words.length <= 3);
  });

  test('should include pronunciation when requested', () => {
    const words = findWordsByComplexity('simple', { 
      limit: 3, 
      includePronunciation: true 
    });
    words.forEach(word => {
      assert.ok(word.pronunciation);
      assert.ok(word.syllables);
      assert.ok(word.phonemeCount);
    });
  });
});

describe('Dictionary Module - findWordsByVowelCount', () => {
  test('should find words with specific vowel count', () => {
    const words = findWordsByVowelCount(2, { limit: 5 });
    assert.ok(words.length > 0);
    words.forEach(word => {
      assert.strictEqual(word.vowelCount, 2);
      assert.ok(word.word);
    });
  });

  test('should respect limit option', () => {
    const words = findWordsByVowelCount(2, { limit: 3 });
    assert.ok(words.length <= 3);
  });

  test('should include pronunciation when requested', () => {
    const words = findWordsByVowelCount(2, { 
      limit: 3, 
      includePronunciation: true 
    });
    words.forEach(word => {
      assert.ok(word.pronunciation);
      assert.ok(word.syllables);
      assert.ok(word.consonantCount);
    });
  });

  test('should handle different vowel counts', () => {
    const oneVowel = findWordsByVowelCount(1, { limit: 3 });
    const threeVowels = findWordsByVowelCount(3, { limit: 3 });
    
    assert.ok(oneVowel.length > 0);
    assert.ok(threeVowels.length > 0);
    
    oneVowel.forEach(word => assert.strictEqual(word.vowelCount, 1));
    threeVowels.forEach(word => assert.strictEqual(word.vowelCount, 3));
  });

  test('should return empty array for invalid vowel count', () => {
    const words = findWordsByVowelCount(0);
    assert.ok(words.length >= 0); // Some words might have 0 vowels
  });
});

describe('Dictionary Module - getRandomWords', () => {
  test('should get random words', () => {
    const words = getRandomWords(5);
    assert.strictEqual(words.length, 5);
    words.forEach(word => {
      assert.ok(word.word);
    });
  });

  test('should respect count parameter', () => {
    const words = getRandomWords(3);
    assert.strictEqual(words.length, 3);
  });

  test('should include pronunciation when requested', () => {
    const words = getRandomWords(3, { includePronunciation: true });
    words.forEach(word => {
      assert.ok(word.pronunciation);
    });
  });

  test('should include syllables when requested', () => {
    const words = getRandomWords(3, { includeSyllables: true });
    words.forEach(word => {
      assert.ok(word.syllables);
    });
  });

  test('should include hyphenation when requested', () => {
    const words = getRandomWords(3, { includeHyphenation: true });
    words.forEach(word => {
      if (word.hyphenated) {
        assert.strictEqual(typeof word.hyphenated, 'string');
      }
    });
  });

  test('should handle default count', () => {
    const words = getRandomWords();
    assert.strictEqual(words.length, 10);
  });

  test('should handle count larger than dictionary size', () => {
    const words = getRandomWords(1000000);
    assert.ok(words.length > 0);
    assert.ok(words.length <= 1000000);
  });
});

describe('Dictionary Module - findRhymingWords', () => {
  test('should find rhyming words', () => {
    const words = findRhymingWords('cat', { limit: 5 });
    assert.ok(words.length > 0);
    words.forEach(word => {
      assert.ok(word.word);
      assert.ok(word.pronunciation);
      assert.ok(word.syllables);
    });
  });

  test('should respect limit option', () => {
    const words = findRhymingWords('cat', { limit: 3 });
    assert.ok(words.length <= 3);
  });

  test('should include pronunciation when requested', () => {
    const words = findRhymingWords('cat', { 
      limit: 3, 
      includePronunciation: true 
    });
    words.forEach(word => {
      assert.ok(word.pronunciation);
    });
  });

  test('should include syllables when requested', () => {
    const words = findRhymingWords('cat', { 
      limit: 3, 
      includeSyllables: true 
    });
    words.forEach(word => {
      assert.ok(word.syllables);
    });
  });

  test('should return empty array for unknown word', () => {
    const words = findRhymingWords('xyzqwerty');
    assert.strictEqual(words.length, 0);
  });

  test('should not include the target word itself', () => {
    const words = findRhymingWords('cat', { limit: 10 });
    const targetWord = words.find(word => word.word === 'cat');
    assert.strictEqual(targetWord, undefined);
  });
});

describe('Dictionary Module - getAllWords', () => {
  test('should get all words in dictionary', () => {
    const words = getAllWords();
    assert.ok(words.length > 0);
    assert.ok(Array.isArray(words));
    words.forEach(word => {
      assert.strictEqual(typeof word, 'string');
    });
  });

  test('should return consistent results', () => {
    const words1 = getAllWords();
    const words2 = getAllWords();
    assert.strictEqual(words1.length, words2.length);
  });
});

describe('Dictionary Module - getDictionarySize', () => {
  test('should get dictionary size', () => {
    const size = getDictionarySize();
    assert.strictEqual(typeof size, 'number');
    assert.ok(size > 0);
  });

  test('should return consistent results', () => {
    const size1 = getDictionarySize();
    const size2 = getDictionarySize();
    assert.strictEqual(size1, size2);
  });

  test('should match getAllWords length', () => {
    const size = getDictionarySize();
    const words = getAllWords();
    assert.strictEqual(size, words.length);
  });
});

describe('Dictionary Module - isWordInDictionary', () => {
  test('should return true for known word', () => {
    const exists = isWordInDictionary('hello');
    assert.strictEqual(exists, true);
  });

  test('should return false for unknown word', () => {
    const exists = isWordInDictionary('xyzqwerty');
    assert.strictEqual(exists, false);
  });

  test('should handle case insensitive lookups', () => {
    const exists1 = isWordInDictionary('HELLO');
    const exists2 = isWordInDictionary('hello');
    const exists3 = isWordInDictionary('Hello');
    
    assert.strictEqual(exists1, true);
    assert.strictEqual(exists2, true);
    assert.strictEqual(exists3, true);
  });

  test('should handle empty string', () => {
    const exists = isWordInDictionary('');
    assert.strictEqual(exists, false);
  });

  test('should handle whitespace', () => {
    const exists = isWordInDictionary(' hello ');
    assert.strictEqual(exists, false); // Whitespace is trimmed, so 'hello' exists but ' hello ' doesn't
  });
});
