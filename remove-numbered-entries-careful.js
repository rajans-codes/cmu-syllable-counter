import fs from 'fs';

// Read the original file
const content = fs.readFileSync('src/dictionary-data.ts', 'utf8');

// Extract the dictionary object content (remove export and wrapping)
let dictContent = content.replace(/^export const CMU_DICTIONARY: Record<string, \{[^}]*\}> = /, '');
dictContent = dictContent.replace(/;?\s*$/, '');

// Split into individual entries using regex
const entries = [];
const entryRegex = /"([^"]+)":\s*\{s:(\d+),h:'([^']+)',p:"([^"]+)"\}/g;
let match;

while ((match = entryRegex.exec(dictContent)) !== null) {
  const [fullMatch, word, syllables, hyphenation, pronunciation] = match;
  entries.push({
    word,
    syllables: parseInt(syllables),
    hyphenation,
    pronunciation,
    fullMatch
  });
}

console.log(`Found ${entries.length} total entries`);

// Filter out entries with numbers in parentheses
const filteredEntries = entries.filter(entry => {
  // Check if the word contains a pattern like (2), (3), etc.
  return !entry.word.match(/\(\d+\)/);
});

console.log(`After removing numbered entries: ${filteredEntries.length} entries`);
console.log(`Removed ${entries.length - filteredEntries.length} numbered entries`);

// Sort entries alphabetically
filteredEntries.sort((a, b) => a.word.localeCompare(b.word));

// Rebuild the file content
let newContent = `// @ts-nocheck
// CMU Dictionary Data - Optimized structure with syllable count and pronunciation
// Generated with newlines for readability (can be minified during build)

export const CMU_DICTIONARY: Record<string, {
s: number; p: string, h?: string }> = {
`;

// Add all entries with proper formatting
for (let i = 0; i < filteredEntries.length; i++) {
  const entry = filteredEntries[i];
  const isLast = i === filteredEntries.length - 1;
  const comma = isLast ? '' : ',';
  
  newContent += `"${entry.word}":{s:${entry.syllables},h:'${entry.hyphenation}',p:"${entry.pronunciation}"}${comma}\n`;
}

newContent += `};`;

// Write the fixed content
fs.writeFileSync('src/dictionary-data.ts', newContent);

console.log('Dictionary file has been updated - numbered entries removed!');

// Verify the file ends correctly
const finalContent = fs.readFileSync('src/dictionary-data.ts', 'utf8');
const lines = finalContent.split('\n');
console.log('Last few lines of the file:');
console.log(lines.slice(-5).join('\n'));
