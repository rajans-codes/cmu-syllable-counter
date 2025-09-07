import { describe, test } from 'node:test';
import assert from 'node:assert';
import { getSyllableCount, getHyphenatedString } from '../dist/index.esm.js';

describe('Core Module - getSyllableCount', () => {
  test('should count syllables for single word', async () => {
    const result = await getSyllableCount('hello');
    assert.strictEqual(result.totalSyllableCount, 2);
    assert.strictEqual(result.wordDetails, undefined);
    assert.strictEqual(result.analysis, undefined);
  });

  test('should count syllables for sentence', async () => {
    const result = await getSyllableCount('hello beautiful world');
    assert.strictEqual(result.totalSyllableCount, 6); // 2 + 3 + 1
    assert.strictEqual(result.wordDetails, undefined);
    assert.strictEqual(result.analysis, undefined);
  });

  test('should count syllables for array of words', async () => {
    const result = await getSyllableCount(['hello', 'beautiful', 'world']);
    assert.strictEqual(result.totalSyllableCount, 6);
    assert.strictEqual(result.wordDetails, undefined);
    assert.strictEqual(result.analysis, undefined);
  });

  test('should include word details when requested', async () => {
    const result = await getSyllableCount('hello world', { includeHyp: true });
    assert.strictEqual(result.totalSyllableCount, 3);
    assert.ok(result.wordDetails);
    assert.strictEqual(result.wordDetails.length, 2);
    assert.strictEqual(result.wordDetails[0].word, 'hello');
    assert.strictEqual(result.wordDetails[0].sc, 2);
    assert.strictEqual(result.wordDetails[1].word, 'world');
    assert.strictEqual(result.wordDetails[1].sc, 1);
  });

  test('should include pronunciation when requested', async () => {
    const result = await getSyllableCount('hello', { 
      includeHyp: true, 
      includePron: true 
    });
    assert.strictEqual(result.totalSyllableCount, 2);
    assert.ok(result.wordDetails);
    assert.strictEqual(result.wordDetails[0].word, 'hello');
    assert.ok(result.wordDetails[0].pron);
    assert.strictEqual(result.wordDetails[0].source, 'cmu');
  });

  test('should include analysis when requested', async () => {
    const result = await getSyllableCount('hello beautiful world', { 
      includeAnalysis: true 
    });
    assert.strictEqual(result.totalSyllableCount, 6);
    assert.ok(result.analysis);
    assert.strictEqual(result.analysis.totalWords, 3);
    assert.strictEqual(result.analysis.avgSyllablesPerWord, 2);
    assert.strictEqual(result.analysis.lines, 1);
  });

  test('should handle custom delimiter', async () => {
    const result = await getSyllableCount('algorithm', { 
      includeHyp: true, 
      delimiter: '·' 
    });
    assert.strictEqual(result.totalSyllableCount, 3);
    assert.ok(result.wordDetails);
    assert.ok(result.wordDetails[0].hyp.includes('·'));
  });

  test('should handle empty string', async () => {
    const result = await getSyllableCount('');
    assert.strictEqual(result.totalSyllableCount, 0);
    assert.strictEqual(result.wordDetails, undefined);
    assert.strictEqual(result.analysis, undefined);
  });

  test('should handle empty array', async () => {
    const result = await getSyllableCount([]);
    assert.strictEqual(result.totalSyllableCount, 0);
    assert.strictEqual(result.wordDetails, undefined);
    assert.strictEqual(result.analysis, undefined);
  });

  test('should handle whitespace only', async () => {
    const result = await getSyllableCount('   ');
    assert.strictEqual(result.totalSyllableCount, 0);
    assert.strictEqual(result.wordDetails, undefined);
    assert.strictEqual(result.analysis, undefined);
  });

  test('should handle multiple lines', async () => {
    const result = await getSyllableCount('hello\nbeautiful\nworld', { 
      includeAnalysis: true 
    });
    assert.strictEqual(result.totalSyllableCount, 6);
    assert.ok(result.analysis);
    assert.strictEqual(result.analysis.lines, 3);
  });

  test('should handle words with apostrophes', async () => {
    const result = await getSyllableCount("don't can't won't", { includeHyp: true });
    assert.strictEqual(result.totalSyllableCount, 3); // 1 + 1 + 1
    assert.ok(result.wordDetails);
    assert.strictEqual(result.wordDetails.length, 3);
  });

  test('should handle mixed case', async () => {
    const result = await getSyllableCount('Hello Beautiful World', { includeHyp: true });
    assert.strictEqual(result.totalSyllableCount, 6);
    assert.ok(result.wordDetails);
    assert.strictEqual(result.wordDetails[0].word, 'Hello');
  });

  test('should handle special characters', async () => {
    const result = await getSyllableCount('hello-world! test@example.com', { includeHyp: true });
    assert.strictEqual(result.totalSyllableCount, 8); // hello(2) + world(1) + test(1) + example(3) + com(1)
    assert.ok(result.wordDetails);
  });

  test('should handle numbers in words', async () => {
    const result = await getSyllableCount('test123 word456', { includeHyp: true });
    assert.strictEqual(result.totalSyllableCount, 2); // test(1) + word(1)
    assert.ok(result.wordDetails);
  });

  test('should handle very long text', async () => {
    const longText = 'hello '.repeat(100) + 'world';
    const result = await getSyllableCount(longText, { includeHyp: true });
    assert.strictEqual(result.totalSyllableCount, 201); // 100 * 2 + 1
    assert.ok(result.wordDetails);
    assert.strictEqual(result.wordDetails.length, 101);
  });

  test('should handle fallback for unknown words', async () => {
    const result = await getSyllableCount('xyzqwerty', { includeHyp: true });
    assert.strictEqual(result.totalSyllableCount, 3); // Fallback algorithm
    assert.ok(result.wordDetails);
    assert.strictEqual(result.wordDetails[0].source, 'fallback');
  });

  test('should handle mixed known and unknown words', async () => {
    const result = await getSyllableCount('hello xyzqwerty world', { includeHyp: true });
    assert.strictEqual(result.totalSyllableCount, 6); // 2 + 3 + 1
    assert.ok(result.wordDetails);
    assert.strictEqual(result.wordDetails[0].source, 'cmu');
    assert.strictEqual(result.wordDetails[1].source, 'fallback');
    assert.strictEqual(result.wordDetails[2].source, 'cmu');
  });
});

describe('Core Module - getHyphenatedString', () => {
  test('should hyphenate single word', async () => {
    const result = await getHyphenatedString('hello');
    assert.strictEqual(result.hyp, 'hel-lo');
    assert.strictEqual(result.words.length, 1);
    assert.strictEqual(result.words[0].word, 'hello');
    assert.strictEqual(result.words[0].sc, 2);
  });

  test('should hyphenate sentence', async () => {
    const result = await getHyphenatedString('hello beautiful world');
    assert.strictEqual(result.hyp, 'hel-lo beau-ti-ful world');
    assert.strictEqual(result.words.length, 3);
    assert.strictEqual(result.words[0].word, 'hello');
    assert.strictEqual(result.words[1].word, 'beautiful');
    assert.strictEqual(result.words[2].word, 'world');
  });

  test('should use custom delimiter', async () => {
    const result = await getHyphenatedString('algorithm', { delimiter: '·' });
    assert.ok(result.hyp.includes('·'));
    assert.strictEqual(result.words.length, 1);
    assert.strictEqual(result.words[0].word, 'algorithm');
  });

  test('should include analysis when requested', async () => {
    const result = await getHyphenatedString('hello world', { includeAnalysis: true });
    assert.strictEqual(result.hyp, 'hel-lo world');
    assert.ok(result.analysis);
    assert.strictEqual(result.analysis.totalWords, 2);
    assert.strictEqual(result.analysis.avgSyllablesPerWord, 1.5);
    assert.strictEqual(result.analysis.lines, 1);
  });

  test('should handle empty string', async () => {
    const result = await getHyphenatedString('');
    assert.strictEqual(result.hyp, '');
    assert.strictEqual(result.words.length, 0);
    assert.strictEqual(result.analysis, undefined);
  });

  test('should handle empty array', async () => {
    const result = await getHyphenatedString([]);
    assert.strictEqual(result.hyp, '');
    assert.strictEqual(result.words.length, 0);
    assert.strictEqual(result.analysis, undefined);
  });

  test('should handle array of words', async () => {
    const result = await getHyphenatedString(['hello', 'beautiful', 'world']);
    assert.strictEqual(result.hyp, 'hel-lo beau-ti-ful world');
    assert.strictEqual(result.words.length, 3);
  });

  test('should handle multiple lines', async () => {
    const result = await getHyphenatedString('hello\nbeautiful\nworld', { includeAnalysis: true });
    assert.strictEqual(result.hyp, 'hel-lo beau-ti-ful world');
    assert.ok(result.analysis);
    assert.strictEqual(result.analysis.lines, 3);
  });

  test('should handle words with apostrophes', async () => {
    const result = await getHyphenatedString("don't can't won't");
    assert.strictEqual(result.hyp, "don't can't won't");
    assert.strictEqual(result.words.length, 3);
  });

  test('should handle mixed case', async () => {
    const result = await getHyphenatedString('Hello Beautiful World');
    assert.strictEqual(result.hyp, 'hel-lo beau-ti-ful world');
    assert.strictEqual(result.words.length, 3);
  });

  test('should handle special characters', async () => {
    const result = await getHyphenatedString('hello-world! test@example.com');
    assert.strictEqual(result.hyp, 'hel-lo world test ex-am-ple com');
    assert.strictEqual(result.words.length, 5); // hello, world, test, example, com
  });

  test('should handle numbers in words', async () => {
    const result = await getHyphenatedString('test123 word456');
    assert.strictEqual(result.hyp, 'test123 word456');
    assert.strictEqual(result.words.length, 2);
  });

  test('should handle very long text', async () => {
    const longText = 'hello '.repeat(100) + 'world';
    const result = await getHyphenatedString(longText);
    assert.ok(result.hyp.includes('hel-lo'));
    assert.strictEqual(result.words.length, 101);
  });

  test('should handle fallback for unknown words', async () => {
    const result = await getHyphenatedString('xyzqwerty');
    assert.strictEqual(result.hyp, 'xyzqwerty');
    assert.strictEqual(result.words.length, 1);
    assert.strictEqual(result.words[0].source, 'fallback');
  });

  test('should handle mixed known and unknown words', async () => {
    const result = await getHyphenatedString('hello xyzqwerty world');
    assert.strictEqual(result.hyp, 'hel-lo xyzqwerty world');
    assert.strictEqual(result.words.length, 3);
    assert.strictEqual(result.words[0].source, 'cmu');
    assert.strictEqual(result.words[1].source, 'fallback');
    assert.strictEqual(result.words[2].source, 'cmu');
  });

  test('should handle custom patterns', async () => {
    const result = await getHyphenatedString('algorithm', { 
      customPatterns: { 'algorithm': 'al-go-rithm' }
    });
    assert.strictEqual(result.hyp, 'al-go-rithm');
    assert.strictEqual(result.words.length, 1);
  });

  test('should handle multiple custom patterns', async () => {
    const result = await getHyphenatedString('algorithm programming', { 
      customPatterns: { 
        'algorithm': 'al-go-rithm',
        'programming': 'pro-gram-ming'
      }
    });
    assert.strictEqual(result.hyp, 'al-go-rithm pro-gra-mming');
    assert.strictEqual(result.words.length, 2);
  });
});
