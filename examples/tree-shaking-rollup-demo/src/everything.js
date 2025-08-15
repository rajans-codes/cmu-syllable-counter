
// Import everything (anti-pattern)
import * as CMUDict from 'cmu-dictionary';

console.log('Everything bundle loaded');
console.log('Available exports:', Object.keys(CMUDict).length);
console.log('Syllables in "everything":', CMUDict.countSyllablesSync('everything'));

export default CMUDict;
