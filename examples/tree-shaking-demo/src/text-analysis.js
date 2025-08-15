
// Core + text analysis functionality
import { countSyllablesSync, countTextSyllablesSync } from 'cmu-dictionary';
import { analyzeText, getWordBreakdown } from 'cmu-dictionary';

console.log('Core + Text Analysis bundle loaded');
console.log('Syllables in "analysis":', countSyllablesSync('analysis'));
analyzeText('Hello world! This is a test.').then(result => {
  console.log('Text analysis result:', result.totalSyllables, 'syllables');
});
