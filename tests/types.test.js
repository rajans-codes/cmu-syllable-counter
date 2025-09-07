import { describe, test } from 'node:test';
import assert from 'node:assert';
import { 
  getSyllableCount, 
  getHyphenatedString,
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

describe('Type System - SyllableCountOptions', () => {
  test('should accept all optional properties', async () => {
    const options = {
      includeHyp: true,
      delimiter: '·',
      includePron: true,
      includeAnalysis: true
    };
    
    const result = await getSyllableCount('hello world', options);
    assert.ok(result);
    assert.ok(result.wordDetails);
    assert.ok(result.analysis);
  });

  test('should work with empty options object', async () => {
    const result = await getSyllableCount('hello world', {});
    assert.ok(result);
    assert.strictEqual(result.totalSyllableCount, 3);
  });

  test('should work with no options', async () => {
    const result = await getSyllableCount('hello world');
    assert.ok(result);
    assert.strictEqual(result.totalSyllableCount, 3);
  });

  test('should handle partial options', async () => {
    const result = await getSyllableCount('hello world', { includeHyp: true });
    assert.ok(result);
    assert.ok(result.wordDetails);
    assert.strictEqual(result.analysis, undefined);
  });
});

describe('Type System - CoreHyphenationOptions', () => {
  test('should accept all optional properties', async () => {
    const options = {
      delimiter: '·',
      includeAnalysis: true,
      customPatterns: { 'algorithm': 'al-go-rithm' }
    };
    
    const result = await getHyphenatedString('algorithm', options);
    assert.ok(result);
    assert.ok(result.analysis);
  });

  test('should work with empty options object', async () => {
    const result = await getHyphenatedString('hello world', {});
    assert.ok(result);
    assert.strictEqual(result.hyp, 'hel-lo world');
  });

  test('should work with no options', async () => {
    const result = await getHyphenatedString('hello world');
    assert.ok(result);
    assert.strictEqual(result.hyp, 'hel-lo world');
  });

  test('should handle partial options', async () => {
    const result = await getHyphenatedString('hello world', { delimiter: '·' });
    assert.ok(result);
    assert.strictEqual(result.analysis, undefined);
  });
});

describe('Type System - SyllableCountResult', () => {
  test('should return correct structure for basic usage', async () => {
    const result = await getSyllableCount('hello world');
    
    assert.strictEqual(typeof result.totalSyllableCount, 'number');
    assert.strictEqual(result.wordDetails, undefined);
    assert.strictEqual(result.analysis, undefined);
  });

  test('should return correct structure with word details', async () => {
    const result = await getSyllableCount('hello world', { includeHyp: true });
    
    assert.strictEqual(typeof result.totalSyllableCount, 'number');
    assert.ok(Array.isArray(result.wordDetails));
    assert.strictEqual(result.analysis, undefined);
    
    result.wordDetails.forEach(detail => {
      assert.strictEqual(typeof detail.word, 'string');
      assert.strictEqual(typeof detail.hyp, 'string');
      assert.strictEqual(typeof detail.sc, 'number');
      assert.ok(['cmu', 'fallback'].includes(detail.source));
    });
  });

  test('should return correct structure with analysis', async () => {
    const result = await getSyllableCount('hello world', { includeAnalysis: true });
    
    assert.strictEqual(typeof result.totalSyllableCount, 'number');
    assert.strictEqual(result.wordDetails, undefined);
    assert.ok(result.analysis);
    
    assert.strictEqual(typeof result.analysis.totalWords, 'number');
    assert.strictEqual(typeof result.analysis.avgSyllablesPerWord, 'number');
    assert.strictEqual(typeof result.analysis.lines, 'number');
  });

  test('should return correct structure with all options', async () => {
    const result = await getSyllableCount('hello world', { 
      includeHyp: true, 
      includePron: true, 
      includeAnalysis: true 
    });
    
    assert.strictEqual(typeof result.totalSyllableCount, 'number');
    assert.ok(Array.isArray(result.wordDetails));
    assert.ok(result.analysis);
    
    result.wordDetails.forEach(detail => {
      assert.strictEqual(typeof detail.word, 'string');
      assert.strictEqual(typeof detail.hyp, 'string');
      assert.strictEqual(typeof detail.sc, 'number');
      assert.ok(['cmu', 'fallback'].includes(detail.source));
      if (detail.pron) {
        assert.strictEqual(typeof detail.pron, 'string');
      }
    });
  });
});

describe('Type System - HyphenationResult', () => {
  test('should return correct structure for basic usage', async () => {
    const result = await getHyphenatedString('hello world');
    
    assert.strictEqual(typeof result.hyp, 'string');
    assert.ok(Array.isArray(result.words));
    assert.strictEqual(result.analysis, undefined);
    
    result.words.forEach(word => {
      assert.strictEqual(typeof word.word, 'string');
      assert.strictEqual(typeof word.hyp, 'string');
      assert.strictEqual(typeof word.sc, 'number');
      assert.ok(['cmu', 'fallback'].includes(word.source));
    });
  });

  test('should return correct structure with analysis', async () => {
    const result = await getHyphenatedString('hello world', { includeAnalysis: true });
    
    assert.strictEqual(typeof result.hyp, 'string');
    assert.ok(Array.isArray(result.words));
    assert.ok(result.analysis);
    
    assert.strictEqual(typeof result.analysis.totalWords, 'number');
    assert.strictEqual(typeof result.analysis.avgSyllablesPerWord, 'number');
    assert.strictEqual(typeof result.analysis.lines, 'number');
  });
});

describe('Type System - WordAnalysis', () => {
  test('should return correct structure from findWordsBySyllableCount', () => {
    const words = findWordsBySyllableCount(2, { limit: 3 });
    
    words.forEach(word => {
      assert.strictEqual(typeof word.word, 'string');
      assert.strictEqual(typeof word.syllables, 'number');
      
      if (word.pronunciation) {
        assert.strictEqual(typeof word.pronunciation, 'string');
      }
      if (word.hyphenated) {
        assert.strictEqual(typeof word.hyphenated, 'string');
      }
      if (word.phonemeCount) {
        assert.strictEqual(typeof word.phonemeCount, 'number');
      }
      if (word.vowelCount) {
        assert.strictEqual(typeof word.vowelCount, 'number');
      }
      if (word.consonantCount) {
        assert.strictEqual(typeof word.consonantCount, 'number');
      }
      if (word.stressPattern) {
        assert.strictEqual(typeof word.stressPattern, 'string');
      }
      if (word.complexity) {
        assert.ok(['simple', 'moderate', 'complex'].includes(word.complexity));
      }
    });
  });

  test('should return correct structure from findWordsByStressPattern', () => {
    const words = findWordsByStressPattern('10', { limit: 3 });
    
    words.forEach(word => {
      assert.strictEqual(typeof word.word, 'string');
      assert.strictEqual(typeof word.pronunciation, 'string');
      assert.strictEqual(typeof word.syllables, 'number');
      assert.strictEqual(typeof word.stressPattern, 'string');
    });
  });

  test('should return correct structure from findWordsByComplexity', () => {
    const words = findWordsByComplexity('simple', { limit: 3 });
    
    words.forEach(word => {
      assert.strictEqual(typeof word.word, 'string');
      assert.strictEqual(typeof word.pronunciation, 'string');
      assert.strictEqual(typeof word.syllables, 'number');
      assert.strictEqual(typeof word.complexity, 'string');
      assert.strictEqual(typeof word.phonemeCount, 'number');
    });
  });

  test('should return correct structure from findWordsByVowelCount', () => {
    const words = findWordsByVowelCount(2, { limit: 3 });
    
    words.forEach(word => {
      assert.strictEqual(typeof word.word, 'string');
      assert.strictEqual(typeof word.pronunciation, 'string');
      assert.strictEqual(typeof word.syllables, 'number');
      assert.strictEqual(typeof word.vowelCount, 'number');
      assert.strictEqual(typeof word.consonantCount, 'number');
    });
  });

  test('should return correct structure from getRandomWords', () => {
    const words = getRandomWords(3, { 
      includePronunciation: true, 
      includeSyllables: true, 
      includeHyphenation: true 
    });
    
    words.forEach(word => {
      assert.strictEqual(typeof word.word, 'string');
      
      if (word.pronunciation) {
        assert.strictEqual(typeof word.pronunciation, 'string');
      }
      if (word.syllables) {
        assert.strictEqual(typeof word.syllables, 'number');
      }
      if (word.hyphenated) {
        assert.strictEqual(typeof word.hyphenated, 'string');
      }
    });
  });

  test('should return correct structure from findRhymingWords', () => {
    const words = findRhymingWords('cat', { limit: 3 });
    
    words.forEach(word => {
      assert.strictEqual(typeof word.word, 'string');
      assert.strictEqual(typeof word.pronunciation, 'string');
      assert.strictEqual(typeof word.syllables, 'number');
    });
  });
});

describe('Type System - WordSearchOptions', () => {
  test('should accept all optional properties', () => {
    const options = {
      limit: 5,
      includePronunciation: true,
      includeHyphenation: true,
      includeSyllables: true
    };
    
    const words = findWordsBySyllableCount(2, options);
    assert.ok(words.length <= 5);
  });

  test('should work with empty options object', () => {
    const words = findWordsBySyllableCount(2, {});
    assert.ok(words.length > 0);
  });

  test('should work with no options', () => {
    const words = findWordsBySyllableCount(2);
    assert.ok(words.length > 0);
  });

  test('should handle partial options', () => {
    const words = findWordsBySyllableCount(2, { limit: 3 });
    assert.ok(words.length <= 3);
  });
});

describe('Type System - Function Parameter Types', () => {
  test('should accept string input for getSyllableCount', async () => {
    const result = await getSyllableCount('hello world');
    assert.ok(result);
  });

  test('should accept array input for getSyllableCount', async () => {
    const result = await getSyllableCount(['hello', 'world']);
    assert.ok(result);
  });

  test('should accept string input for getHyphenatedString', async () => {
    const result = await getHyphenatedString('hello world');
    assert.ok(result);
  });

  test('should accept array input for getHyphenatedString', async () => {
    const result = await getHyphenatedString(['hello', 'world']);
    assert.ok(result);
  });

  test('should accept number input for findWordsBySyllableCount', () => {
    const words = findWordsBySyllableCount(2);
    assert.ok(Array.isArray(words));
  });

  test('should accept string input for findWordsByStressPattern', () => {
    const words = findWordsByStressPattern('10');
    assert.ok(Array.isArray(words));
  });

  test('should accept valid complexity input for findWordsByComplexity', () => {
    const words = findWordsByComplexity('simple');
    assert.ok(Array.isArray(words));
  });

  test('should accept number input for findWordsByVowelCount', () => {
    const words = findWordsByVowelCount(2);
    assert.ok(Array.isArray(words));
  });

  test('should accept number input for getRandomWords', () => {
    const words = getRandomWords(5);
    assert.ok(Array.isArray(words));
  });

  test('should accept string input for findRhymingWords', () => {
    const words = findRhymingWords('cat');
    assert.ok(Array.isArray(words));
  });

  test('should accept string input for isWordInDictionary', () => {
    const exists = isWordInDictionary('hello');
    assert.strictEqual(typeof exists, 'boolean');
  });
});

describe('Type System - Return Type Consistency', () => {
  test('should return consistent types for multiple calls', async () => {
    const result1 = await getSyllableCount('hello');
    const result2 = await getSyllableCount('world');
    
    assert.strictEqual(typeof result1.totalSyllableCount, 'number');
    assert.strictEqual(typeof result2.totalSyllableCount, 'number');
  });

  test('should return consistent types for dictionary functions', () => {
    const words1 = findWordsBySyllableCount(2, { limit: 3 });
    const words2 = findWordsBySyllableCount(3, { limit: 3 });
    
    assert.ok(Array.isArray(words1));
    assert.ok(Array.isArray(words2));
    assert.strictEqual(words1.length, 3);
    assert.strictEqual(words2.length, 3);
  });

  test('should return consistent types for random functions', () => {
    const words1 = getRandomWords(5);
    const words2 = getRandomWords(5);
    
    assert.ok(Array.isArray(words1));
    assert.ok(Array.isArray(words2));
    assert.strictEqual(words1.length, 5);
    assert.strictEqual(words2.length, 5);
  });
});
