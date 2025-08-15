
// Core + analytics functionality
import { countSyllablesSync, countTextSyllablesSync } from 'cmu-dictionary';
import { calculateStatistics, analyzePhonemePatterns } from 'cmu-dictionary';

console.log('Core + Analytics bundle loaded');
console.log('Syllables in "statistics":', countSyllablesSync('statistics'));

const stats = calculateStatistics([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
console.log('Statistics result:', stats.mean, 'mean');

export { countSyllablesSync, countTextSyllablesSync, calculateStatistics, analyzePhonemePatterns };
