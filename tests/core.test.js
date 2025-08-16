import { getSyllableCount } from '../dist/index.esm.js';
import { test, describe } from 'node:test';
import assert from 'node:assert';

describe('Core Module - getSyllableCount', () => {
  test('should count syllables for single word', async () => {
    const result = await getSyllableCount('beautiful');
    assert.strictEqual(result.totalSyllableCount, 3);
    assert.strictEqual(result.wordDetails, undefined);
    assert.strictEqual(result.analysis, undefined);
  });

  test('should count syllables for sentence', async () => {
    const result = await getSyllableCount('hello beautiful world');
    assert.ok(result.totalSyllableCount > 0);
    assert.strictEqual(result.wordDetails, undefined);
    assert.strictEqual(result.analysis, undefined);
  });

  test('should count syllables for array of words', async () => {
    const result = await getSyllableCount(['hello', 'beautiful', 'world']);
    assert.ok(result.totalSyllableCount > 0);
    assert.strictEqual(result.wordDetails, undefined);
    assert.strictEqual(result.analysis, undefined);
  });

  test('should return 0 for empty input', async () => {
    const result = await getSyllableCount('');
    assert.strictEqual(result.totalSyllableCount, 0);
    assert.strictEqual(result.wordDetails, undefined);
    assert.strictEqual(result.analysis, undefined);
  });

  test('should return empty arrays when options are enabled for empty input', async () => {
    const result = await getSyllableCount('', { includeHyp: true, includeAnalysis: true });
    assert.strictEqual(result.totalSyllableCount, 0);
    assert.deepStrictEqual(result.wordDetails, []);
    assert.deepStrictEqual(result.analysis, {
      totalWords: 0,
      avgSyllablesPerWord: 0,
      lines: 0
    });
  });

  test('should include hyphenation when requested', async () => {
    const result = await getSyllableCount('beautiful', { includeHyp: true });
    assert.strictEqual(result.totalSyllableCount, 3);
    assert.ok(result.wordDetails !== undefined);
    assert.ok(result.wordDetails.length > 0);
    assert.ok('word' in result.wordDetails[0]);
    assert.ok('hyp' in result.wordDetails[0]);
    assert.ok('sc' in result.wordDetails[0]);
    assert.ok('source' in result.wordDetails[0]);
  });

  test('should use custom delimiter', async () => {
    const result = await getSyllableCount('algorithm', { 
      includeHyp: true, 
      delimiter: '·' 
    });
    assert.ok(result.wordDetails[0].hyp.includes('·'));
  });

  test('should include pronunciation when requested', async () => {
    const result = await getSyllableCount('hello', { 
      includeHyp: true, 
      includePron: true 
    });
    assert.ok('pron' in result.wordDetails[0]);
    assert.ok(result.wordDetails[0].pron !== undefined);
  });

  test('should include analysis when requested', async () => {
    const result = await getSyllableCount('hello beautiful world', { 
      includeAnalysis: true 
    });
    assert.ok(result.analysis !== undefined);
    assert.strictEqual(result.analysis.totalWords, 3);
    assert.ok(result.analysis.avgSyllablesPerWord > 0);
    assert.strictEqual(result.analysis.lines, 1);
  });

  test('should handle multiple lines', async () => {
    const text = 'hello\nbeautiful\nworld';
    const result = await getSyllableCount(text, { includeAnalysis: true });
    assert.strictEqual(result.analysis.lines, 3);
  });

  test('should handle contractions', async () => {
    const result = await getSyllableCount("don't can't won't");
    assert.ok(result.totalSyllableCount > 0);
  });

  test('should handle possessives', async () => {
    const result = await getSyllableCount("John's Mary's");
    assert.ok(result.totalSyllableCount > 0);
  });
});
