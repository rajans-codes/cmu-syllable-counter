#!/usr/bin/env node

/**
 * CommonJS Usage Examples
 * 
 * This file demonstrates how to use the cmu-syllable-counter library
 * in CommonJS format with require statements.
 * 
 * Run with: node examples/commonjs-example.js
 */

const {
  getSyllableCount,
  getHyphenatedString,
  cmuDictionary,
  findWordsBySyllableCount,
  findWordsByComplexity,
  findWordsByStressPattern,
  findWordsByVowelCount,
  getRandomWords,
  findRhymingWords,
  getAllWords,
  getDictionarySize,
  isWordInDictionary,
  CMU_DICTIONARY
} = require('../dist/index.cjs');

console.log('🎵 CMU Syllable Counter - CommonJS Examples\n');

// Example 1: Basic syllable counting
console.log('1. Basic Syllable Counting:');
getSyllableCount('beautiful').then(result => {
  console.log(`"beautiful" has ${result.totalSyllableCount} syllables\n`);
  
  // Example 2: Syllable counting with word details
  console.log('2. Syllable Counting with Word Details:');
  return getSyllableCount('hello world', {
    includeHyp: true,
    delimiter: '·',
    includePron: true,
    includeAnalysis: true
  });
}).then(detailedResult => {
  console.log('Result:', JSON.stringify(detailedResult, null, 2));
  console.log();
  
  // Example 3: Hyphenation
  console.log('3. Hyphenation:');
  return getHyphenatedString('programming is fun', {
    delimiter: '·',
    includeAnalysis: true
  });
}).then(hyphenated => {
  console.log('Hyphenated:', hyphenated.hyp);
  console.log('Analysis:', hyphenated.analysis);
  console.log();
  
  // Example 4: Dictionary lookups
  console.log('4. Dictionary Operations:');
  console.log('Is "hello" in dictionary?', isWordInDictionary('hello'));
  console.log('Is "xyz123" in dictionary?', isWordInDictionary('xyz123'));
  console.log('Dictionary size:', getDictionarySize());
  console.log();
  
  // Example 5: Word search by syllable count
  console.log('5. Words with 3 syllables:');
  const threeSyllableWords = findWordsBySyllableCount(3, {
    limit: 5,
    includePronunciation: true,
    includeHyphenation: true
  });
  threeSyllableWords.forEach(word => {
    console.log(`- ${word.word} (${word.syllables} syllables): ${word.hyphenated}`);
  });
  console.log();
  
  // Example 6: Word search by complexity
  console.log('6. Complex words:');
  const complexWords = findWordsByComplexity('complex', {
    limit: 3,
    includePronunciation: true
  });
  complexWords.forEach(word => {
    console.log(`- ${word.word}: ${word.pronunciation} (${word.phonemeCount} phonemes)`);
  });
  console.log();
  
  // Example 7: Word search by stress pattern
  console.log('7. Words with stress pattern "010":');
  const stressWords = findWordsByStressPattern('010', {
    limit: 3,
    includePronunciation: true
  });
  stressWords.forEach(word => {
    console.log(`- ${word.word}: ${word.stressPattern}`);
  });
  console.log();
  
  // Example 8: Word search by vowel count
  console.log('8. Words with 2 vowels:');
  const vowelWords = findWordsByVowelCount(2, {
    limit: 3,
    includePronunciation: true
  });
  vowelWords.forEach(word => {
    console.log(`- ${word.word}: ${word.vowelCount} vowels, ${word.consonantCount} consonants`);
  });
  console.log();
  
  // Example 9: Random words
  console.log('9. Random words:');
  const randomWords = getRandomWords(3, {
    includePronunciation: true,
    includeHyphenation: true
  });
  randomWords.forEach(word => {
    console.log(`- ${word.word}: ${word.hyphenated} (${word.syllables} syllables)`);
  });
  console.log();
  
  // Example 10: Rhyming words
  console.log('10. Words that rhyme with "cat":');
  const rhymingWords = findRhymingWords('cat', {
    limit: 3,
    includePronunciation: true
  });
  rhymingWords.forEach(word => {
    console.log(`- ${word.word}: ${word.pronunciation}`);
  });
  console.log();
  
  // Example 11: Direct dictionary access
  console.log('11. Direct Dictionary Access:');
  const helloData = CMU_DICTIONARY['hello'];
  console.log('Hello data:', helloData);
  
  // Example 12: Custom utility using raw dictionary
  console.log('12. Custom Utility - Words ending with "ing":');
  const ingWords = Object.entries(CMU_DICTIONARY)
    .filter(([word, data]) => word.endsWith('ing') && data.s === 2)
    .slice(0, 3)
    .map(([word, data]) => ({ word, ...data }));
  ingWords.forEach(word => {
    console.log(`- ${word.word}: ${word.h} (${word.s} syllables)`);
  });
  console.log();
  
  // Example 13: Processing a poem
  console.log('13. Processing a Poem:');
  const poem = `The quick brown fox
jumps over the lazy dog
in the moonlight`;
  
  return getSyllableCount(poem, {
    includeHyp: true,
    includeAnalysis: true
  });
}).then(poemResult => {
  console.log('Poem analysis:');
  console.log(`Total syllables: ${poemResult.totalSyllableCount}`);
  console.log(`Average syllables per word: ${poemResult.analysis.avgSyllablesPerWord.toFixed(2)}`);
  console.log(`Total words: ${poemResult.analysis.totalWords}`);
  console.log(`Lines: ${poemResult.analysis.lines}`);
  console.log();
  
  // Example 14: Batch processing
  console.log('14. Batch Processing:');
  const words = ['algorithm', 'beautiful', 'programming', 'syllable', 'counter'];
  
  return Promise.all(
    words.map(async word => {
      const result = await getSyllableCount(word, { includeHyp: true });
      return { word, syllables: result.totalSyllableCount, hyphenated: result.wordDetails[0].hyp };
    })
  );
}).then(batchResults => {
  batchResults.forEach(result => {
    console.log(`${result.word}: ${result.syllables} syllables (${result.hyphenated})`);
  });
  
  console.log('\n✅ CommonJS Examples Complete!');
}).catch(error => {
  console.error('Error:', error);
});
