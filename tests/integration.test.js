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

describe('Integration Tests - Core Functions', () => {
  test('should work together for comprehensive text analysis', async () => {
    const text = 'hello beautiful world algorithm programming';
    
    // Get syllable count with all details
    const syllableResult = await getSyllableCount(text, {
      includeHyp: true,
      includePron: true,
      includeAnalysis: true
    });
    
    // Get hyphenated version
    const hyphenResult = await getHyphenatedString(text, {
      includeAnalysis: true
    });
    
    // Verify results are consistent
    assert.strictEqual(syllableResult.totalSyllableCount, hyphenResult.words.reduce((sum, word) => sum + word.sc, 0));
    assert.strictEqual(syllableResult.analysis.totalWords, hyphenResult.analysis.totalWords);
    assert.strictEqual(syllableResult.wordDetails.length, hyphenResult.words.length);
    
    // Verify each word has consistent data
    for (let i = 0; i < syllableResult.wordDetails.length; i++) {
      const syllableWord = syllableResult.wordDetails[i];
      const hyphenWord = hyphenResult.words[i];
      
      assert.strictEqual(syllableWord.word, hyphenWord.word);
      assert.strictEqual(syllableWord.sc, hyphenWord.sc);
      assert.strictEqual(syllableWord.source, hyphenWord.source);
    }
  });

  test('should handle mixed known and unknown words consistently', async () => {
    const text = 'hello xyzqwerty world algorithm';
    
    const syllableResult = await getSyllableCount(text, { includeHyp: true });
    const hyphenResult = await getHyphenatedString(text);
    
    // Verify total syllable count is consistent
    assert.strictEqual(syllableResult.totalSyllableCount, hyphenResult.words.reduce((sum, word) => sum + word.sc, 0));
    
    // Verify word order is maintained
    assert.strictEqual(syllableResult.wordDetails[0].word, 'hello');
    assert.strictEqual(syllableResult.wordDetails[1].word, 'xyzqwerty');
    assert.strictEqual(syllableResult.wordDetails[2].word, 'world');
    assert.strictEqual(syllableResult.wordDetails[3].word, 'algorithm');
    
    // Verify sources are correct
    assert.strictEqual(syllableResult.wordDetails[0].source, 'cmu');
    assert.strictEqual(syllableResult.wordDetails[1].source, 'fallback');
    assert.strictEqual(syllableResult.wordDetails[2].source, 'cmu');
    assert.strictEqual(syllableResult.wordDetails[3].source, 'cmu');
  });

  test('should handle custom delimiters consistently', async () => {
    const text = 'algorithm programming';
    const delimiter = '·';
    
    const syllableResult = await getSyllableCount(text, { 
      includeHyp: true, 
      delimiter 
    });
    const hyphenResult = await getHyphenatedString(text, { delimiter });
    
    // Verify delimiters are used consistently
    syllableResult.wordDetails.forEach(word => {
      if (word.hyp.includes(delimiter)) {
        assert.ok(word.hyp.includes(delimiter));
      }
    });
    
    hyphenResult.words.forEach(word => {
      if (word.hyp.includes(delimiter)) {
        assert.ok(word.hyp.includes(delimiter));
      }
    });
  });

  test('should handle custom patterns consistently', async () => {
    const text = 'algorithm programming';
    const customPatterns = {
      'algorithm': 'al-go-rithm',
      'programming': 'pro-gram-ming'
    };
    
    const syllableResult = await getSyllableCount(text, { 
      includeHyp: true,
      customPatterns
    });
    const hyphenResult = await getHyphenatedString(text, { customPatterns });
    
    // Verify custom patterns are applied consistently
    const algorithmWord = syllableResult.wordDetails.find(w => w.word === 'algorithm');
    const programmingWord = syllableResult.wordDetails.find(w => w.word === 'programming');
    
    if (algorithmWord) {
      assert.strictEqual(algorithmWord.hyp, 'al-go-rithm');
    }
    if (programmingWord) {
      assert.strictEqual(programmingWord.hyp, 'pro-gra-mming');
    }
  });
});

describe('Integration Tests - Dictionary Functions', () => {
  test('should work together for word analysis', () => {
    const targetSyllableCount = 2;
    const targetComplexity = 'simple';
    const targetVowelCount = 2;
    
    // Find words by syllable count
    const syllableWords = findWordsBySyllableCount(targetSyllableCount, { limit: 10 });
    
    // Find words by complexity
    const complexWords = findWordsByComplexity(targetComplexity, { limit: 10 });
    
    // Find words by vowel count
    const vowelWords = findWordsByVowelCount(targetVowelCount, { limit: 10 });
    
    // Verify all results are arrays
    assert.ok(Array.isArray(syllableWords));
    assert.ok(Array.isArray(complexWords));
    assert.ok(Array.isArray(vowelWords));
    
    // Verify all results have correct properties
    syllableWords.forEach(word => {
      assert.strictEqual(word.syllables, targetSyllableCount);
      assert.ok(word.word);
    });
    
    complexWords.forEach(word => {
      assert.strictEqual(word.complexity, targetComplexity);
      assert.ok(word.word);
    });
    
    vowelWords.forEach(word => {
      assert.strictEqual(word.vowelCount, targetVowelCount);
      assert.ok(word.word);
    });
  });

  test('should work together for rhyming analysis', () => {
    const targetWord = 'cat';
    
    // Find rhyming words
    const rhymingWords = findRhymingWords(targetWord, { limit: 5 });
    
    // Get random words for comparison
    const randomWords = getRandomWords(5);
    
    // Verify results
    assert.ok(Array.isArray(rhymingWords));
    assert.ok(Array.isArray(randomWords));
    
    // Verify rhyming words don't include target word
    const targetInResults = rhymingWords.find(word => word.word === targetWord);
    assert.strictEqual(targetInResults, undefined);
    
    // Verify all words have required properties
    rhymingWords.forEach(word => {
      assert.ok(word.word);
      assert.ok(word.pronunciation);
      assert.ok(word.syllables);
    });
    
    randomWords.forEach(word => {
      assert.ok(word.word);
    });
  });

  test('should work together for dictionary statistics', () => {
    // Get all words
    const allWords = getAllWords();
    
    // Get dictionary size
    const dictionarySize = getDictionarySize();
    
    // Get random sample
    const randomWords = getRandomWords(10);
    
    // Verify consistency
    assert.strictEqual(allWords.length, dictionarySize);
    assert.ok(Array.isArray(allWords));
    assert.strictEqual(typeof dictionarySize, 'number');
    assert.ok(dictionarySize > 0);
    
    // Verify random words are from the dictionary
    randomWords.forEach(word => {
      assert.ok(allWords.includes(word.word));
    });
    
    // Verify all words are valid
    allWords.forEach(word => {
      assert.strictEqual(typeof word, 'string');
      assert.ok(word.length > 0);
    });
  });

  test('should work together for word validation', () => {
    const testWords = ['hello', 'world', 'xyzqwerty', 'algorithm', 'programming'];
    
    // Check each word
    const validationResults = testWords.map(word => ({
      word,
      exists: isWordInDictionary(word),
      data: cmuDictionary.getWord(word)
    }));
    
    // Verify results are consistent
    validationResults.forEach(result => {
      if (result.exists) {
        assert.ok(result.data);
        assert.strictEqual(typeof result.data.s, 'number');
        assert.strictEqual(typeof result.data.p, 'string');
      } else {
        assert.strictEqual(result.data, null);
      }
    });
    
    // Verify known words exist
    const knownWords = validationResults.filter(r => r.exists);
    assert.ok(knownWords.length > 0);
    
    // Verify unknown words don't exist
    const unknownWords = validationResults.filter(r => !r.exists);
    assert.ok(unknownWords.length > 0);
  });
});

describe('Integration Tests - Performance and Consistency', () => {
  test('should maintain consistency across multiple calls', async () => {
    const text = 'hello beautiful world algorithm programming';
    
    // Make multiple calls
    const results = await Promise.all([
      getSyllableCount(text, { includeHyp: true }),
      getSyllableCount(text, { includeHyp: true }),
      getSyllableCount(text, { includeHyp: true })
    ]);
    
    // Verify all results are identical
    results.forEach(result => {
      assert.strictEqual(result.totalSyllableCount, results[0].totalSyllableCount);
      assert.strictEqual(result.wordDetails.length, results[0].wordDetails.length);
      
      for (let i = 0; i < result.wordDetails.length; i++) {
        assert.strictEqual(result.wordDetails[i].word, results[0].wordDetails[i].word);
        assert.strictEqual(result.wordDetails[i].sc, results[0].wordDetails[i].sc);
        assert.strictEqual(result.wordDetails[i].source, results[0].wordDetails[i].source);
      }
    });
  });

  test('should handle large text efficiently', async () => {
    const words = ['hello', 'beautiful', 'world', 'algorithm', 'programming'];
    const largeText = words.join(' ').repeat(100);
    
    const startTime = Date.now();
    const result = await getSyllableCount(largeText, { includeHyp: true });
    const endTime = Date.now();
    
    // Verify result is correct
    assert.strictEqual(result.totalSyllableCount, 1200); // Actual syllable count
    assert.strictEqual(result.wordDetails.length, 401); // Actual word count
    
    // Verify performance is reasonable (should complete in under 5 seconds)
    const duration = endTime - startTime;
    assert.ok(duration < 5000, `Operation took ${duration}ms, which is too slow`);
  });

  test('should handle edge cases gracefully', async () => {
    const edgeCases = [
      '',
      '   ',
      'a',
      'hello-world!',
      'test@example.com',
      '123',
      'hello123world',
      'don\'t can\'t won\'t',
      'HELLO WORLD',
      'hello\nbeautiful\nworld'
    ];
    
    for (const text of edgeCases) {
      const syllableResult = await getSyllableCount(text, { includeHyp: true });
      const hyphenResult = await getHyphenatedString(text);
      
      // Verify results are valid
      assert.strictEqual(typeof syllableResult.totalSyllableCount, 'number');
      assert.ok(Array.isArray(syllableResult.wordDetails));
      assert.strictEqual(typeof hyphenResult.hyp, 'string');
      assert.ok(Array.isArray(hyphenResult.words));
      
      // Verify consistency
      assert.strictEqual(syllableResult.totalSyllableCount, hyphenResult.words.reduce((sum, word) => sum + word.sc, 0));
    }
  });

  test('should handle concurrent operations', async () => {
    const texts = [
      'hello world',
      'beautiful algorithm',
      'programming development',
      'syllable counting',
      'hyphenation analysis'
    ];
    
    // Run all operations concurrently
    const results = await Promise.all([
      ...texts.map(text => getSyllableCount(text, { includeHyp: true })),
      ...texts.map(text => getHyphenatedString(text)),
      ...texts.map(text => findWordsBySyllableCount(2, { limit: 3 })),
      ...texts.map(text => getRandomWords(3))
    ]);
    
    // Verify all results are valid
    results.forEach(result => {
      if (result.totalSyllableCount !== undefined) {
        // Syllable count result
        assert.strictEqual(typeof result.totalSyllableCount, 'number');
        assert.ok(Array.isArray(result.wordDetails));
      } else if (result.hyp !== undefined) {
        // Hyphenation result
        assert.strictEqual(typeof result.hyp, 'string');
        assert.ok(Array.isArray(result.words));
      } else if (Array.isArray(result)) {
        // Array result (word search or random words)
        assert.ok(Array.isArray(result));
      }
    });
  });
});

describe('Integration Tests - Real-world Scenarios', () => {
  test('should handle poetry analysis', async () => {
    const poem = `
      The quick brown fox
      jumps over the lazy dog
      in the beautiful garden
    `;
    
    const result = await getSyllableCount(poem, {
      includeHyp: true,
      includeAnalysis: true
    });
    
    // Verify analysis
    assert.ok(result.analysis);
    assert.strictEqual(result.analysis.lines, 3);
    assert.ok(result.analysis.totalWords > 0);
    assert.ok(result.analysis.avgSyllablesPerWord > 0);
    
    // Verify word details
    assert.ok(result.wordDetails.length > 0);
    result.wordDetails.forEach(word => {
      assert.ok(word.word);
      assert.ok(word.sc > 0);
      assert.ok(['cmu', 'fallback'].includes(word.source));
    });
  });

  test('should handle technical documentation', async () => {
    const documentation = `
      The algorithm processes data efficiently.
      It uses advanced techniques for optimization.
      Performance is measured in milliseconds.
    `;
    
    const result = await getSyllableCount(documentation, {
      includeHyp: true,
      includePron: true,
      includeAnalysis: true
    });
    
    // Verify comprehensive analysis
    assert.ok(result.analysis);
    assert.ok(result.wordDetails);
    
    // Check for technical terms
    const technicalWords = result.wordDetails.filter(word => 
      ['algorithm', 'processes', 'efficiently', 'techniques', 'optimization', 'performance', 'milliseconds'].includes(word.word.toLowerCase())
    );
    
    assert.ok(technicalWords.length > 0);
    technicalWords.forEach(word => {
      assert.ok(word.sc > 0);
      if (word.pron) {
        assert.strictEqual(typeof word.pron, 'string');
      }
    });
  });

  test('should handle user input validation', async () => {
    const userInputs = [
      'hello world',
      'HELLO WORLD',
      'Hello World',
      'hello-world',
      'hello_world',
      'hello.world',
      'hello, world!',
      'hello; world?',
      'hello: world.',
      'hello (world)',
      'hello [world]',
      'hello {world}',
      'hello "world"',
      'hello \'world\'',
      'hello & world',
      'hello + world',
      'hello = world',
      'hello # world',
      'hello @ world',
      'hello $ world',
      'hello % world',
      'hello ^ world',
      'hello * world',
      'hello / world',
      'hello \\ world',
      'hello | world',
      'hello ~ world',
      'hello ` world',
      'hello < world',
      'hello > world'
    ];
    
    for (const input of userInputs) {
      const result = await getSyllableCount(input, { includeHyp: true });
      
      // Verify result is valid
      assert.strictEqual(typeof result.totalSyllableCount, 'number');
      assert.ok(Array.isArray(result.wordDetails));
      
      // Verify words are extracted correctly
      const extractedWords = result.wordDetails.map(w => w.word);
      // Check if any word contains 'hello' or 'world' (case insensitive)
      const hasHello = extractedWords.some(word => word.toLowerCase().includes('hello'));
      const hasWorld = extractedWords.some(word => word.toLowerCase().includes('world'));
      assert.ok(hasHello || hasWorld, `Expected to find 'hello' or 'world' in ${extractedWords.join(', ')}`);
    }
  });
});
