import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ARPAbet vowel phonemes that indicate syllables
const ARPABET_VOWELS = new Set([
  'AA', 'AE', 'AH', 'AO', 'AW', 'AY', 'EH', 'ER', 'EY', 'IH', 'IY', 'OW', 'OY', 'UH', 'UW'
]);

function processDictionary() {
  const cmudictPath = path.join(__dirname, '../src/cmudict.txt');
  const outputPath = path.join(__dirname, '../src/dictionary-data.ts');
  
  console.log('Processing CMU Dictionary...');
  
  const data = fs.readFileSync(cmudictPath, 'utf8');
  const lines = data.split('\n');
  const unifiedDictionary = {};
  
  let processedCount = 0;
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith(';;;') || !trimmedLine) {
      continue;
    }

    const parts = trimmedLine.split(' ');
    if (parts.length < 2) continue;

    const word = parts[0];
    const pronunciation = parts.slice(1).join(' ');

    // Count syllables by counting vowel phonemes
    const phonemes = pronunciation.split(' ');
    let syllableCount = 0;

    for (const phoneme of phonemes) {
      if (phoneme.length < 2) continue;
      
      const basePhoneme = phoneme.substring(0, 2);
      if (ARPABET_VOWELS.has(basePhoneme)) {
        syllableCount++;
      }
    }

    // Only store words with valid syllable counts
    if (syllableCount > 0) {
      unifiedDictionary[word] = {
        sc: syllableCount,  // syllable count
        h: word,           // hyphenation (word itself for now, can be enhanced later)
        p: pronunciation   // pronunciation
      };
      processedCount++;
    }
  }
  
  // Create TypeScript file with the unified dictionary data
  const tsContent = `// Auto-generated from CMU Dictionary
// This file contains the processed CMU Dictionary data with unified structure

export const CMU_PRONUNCIATIONS: Record<string, { sc: number; h: string; p: string }> = ${JSON.stringify(unifiedDictionary, null, 2)};

// Legacy exports for backward compatibility
export const CMU_DICTIONARY: Record<string, number> = Object.fromEntries(
  Object.entries(CMU_PRONUNCIATIONS).map(([word, data]) => [word, data.sc])
);

export const DICTIONARY_SIZE = ${processedCount};
`;

  fs.writeFileSync(outputPath, tsContent);
  
  console.log(`Processed ${processedCount} words from CMU Dictionary`);
  console.log(`Unified dictionary data written to ${outputPath}`);
}

processDictionary();
