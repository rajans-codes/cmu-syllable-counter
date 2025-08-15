
// Core + text analysis functionality
import { countSyllablesSync, countTextSyllablesSync } from 'cmu-dictionary';
import { analyzeText, getWordBreakdown } from 'cmu-dictionary';

console.log('Core + Text Analysis bundle loaded');
console.log('Syllables in "analysis":', countSyllablesSync('analysis'));

// Async function to demonstrate text analysis
async function demoTextAnalysis() {
  const result = await analyzeText('Hello world! This is a test.');
  console.log('Text analysis result:', result.totalSyllables, 'syllables');
}

demoTextAnalysis();

export { countSyllablesSync, countTextSyllablesSync, analyzeText, getWordBreakdown };
