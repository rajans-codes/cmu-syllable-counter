
// Core + hyphenation functionality
import { countSyllablesSync, countTextSyllablesSync } from 'cmu-dictionary';
import { hyphenateWord, enhancedHyphenation } from 'cmu-dictionary';

console.log('Core + Hyphenation bundle loaded');
console.log('Syllables in "international":', countSyllablesSync('international'));
console.log('Hyphenated "international":', hyphenateWord('international'));

export { countSyllablesSync, countTextSyllablesSync, hyphenateWord, enhancedHyphenation };
