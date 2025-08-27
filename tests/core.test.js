import { getSyllableCount } from '../src/index.ts';

describe('Core Module - getSyllableCount', () => {
  test('should count syllables for single word', async () => {
    const result = await getSyllableCount('beautiful');
    expect(result.totalSyllableCount).toBe(3);
    expect(result.wordDetails).toBeUndefined();
    expect(result.analysis).toBeUndefined();
  });

  test('should count syllables for sentence', async () => {
    const result = await getSyllableCount('hello beautiful world');
    expect(result.totalSyllableCount).toBeGreaterThan(0);
    expect(result.wordDetails).toBeUndefined();
    expect(result.analysis).toBeUndefined();
  });

  test('should count syllables for array of words', async () => {
    const result = await getSyllableCount(['hello', 'beautiful', 'world']);
    expect(result.totalSyllableCount).toBeGreaterThan(0);
    expect(result.wordDetails).toBeUndefined();
    expect(result.analysis).toBeUndefined();
  });

  test('should return 0 for empty input', async () => {
    const result = await getSyllableCount('');
    expect(result.totalSyllableCount).toBe(0);
    expect(result.wordDetails).toBeUndefined();
    expect(result.analysis).toBeUndefined();
  });

  test('should return empty arrays when options are enabled for empty input', async () => {
    const result = await getSyllableCount('', { includeHyp: true, includeAnalysis: true });
    expect(result.totalSyllableCount).toBe(0);
    expect(result.wordDetails).toEqual([]);
    expect(result.analysis).toEqual({
      totalWords: 0,
      avgSyllablesPerWord: 0,
      lines: 0
    });
  });

  test('should include hyphenation when requested', async () => {
    const result = await getSyllableCount('beautiful', { includeHyp: true });
    expect(result.totalSyllableCount).toBe(3);
    expect(result.wordDetails).toBeDefined();
    expect(result.wordDetails.length).toBeGreaterThan(0);
    expect('word' in result.wordDetails[0]).toBe(true);
    expect('hyp' in result.wordDetails[0]).toBe(true);
    expect('sc' in result.wordDetails[0]).toBe(true);
    expect('source' in result.wordDetails[0]).toBe(true);
  });

  test('should use custom delimiter', async () => {
    const result = await getSyllableCount('algorithm', { 
      includeHyp: true, 
      delimiter: '·' 
    });
    expect(result.wordDetails[0].hyp).toContain('·');
  });

  test('should include pronunciation when requested', async () => {
    const result = await getSyllableCount('hello', { 
      includeHyp: true, 
      includePron: true 
    });
    expect('pron' in result.wordDetails[0]).toBe(true);
    expect(result.wordDetails[0].pron).toBeDefined();
  });

  test('should include analysis when requested', async () => {
    const result = await getSyllableCount('hello beautiful world', { 
      includeAnalysis: true 
    });
    expect(result.analysis).toBeDefined();
    expect(result.analysis.totalWords).toBe(3);
    expect(result.analysis.avgSyllablesPerWord).toBeGreaterThan(0);
    expect(result.analysis.lines).toBe(1);
  });

  test('should handle multiple lines', async () => {
    const text = 'hello\nbeautiful\nworld';
    const result = await getSyllableCount(text, { includeAnalysis: true });
    expect(result.analysis.lines).toBe(3);
  });

  test('should handle contractions', async () => {
    const result = await getSyllableCount("don't can't won't");
    expect(result.totalSyllableCount).toBeGreaterThan(0);
  });

  test('should handle possessives', async () => {
    const result = await getSyllableCount("John's Mary's");
    expect(result.totalSyllableCount).toBeGreaterThan(0);
  });
});
