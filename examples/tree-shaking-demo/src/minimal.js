
// Minimal imports - only core functionality
import { countSyllablesSync, countTextSyllablesSync } from 'cmu-dictionary';

console.log('Minimal bundle loaded');
console.log('Syllables in "hello":', countSyllablesSync('hello'));
console.log('Syllables in "Hello world!":', countTextSyllablesSync('Hello world!'));
