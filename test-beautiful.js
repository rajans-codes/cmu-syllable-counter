const { 
  countSyllables, 
  getSyllableInfo, 
  countSyllablesSync,
  countTextSyllables,
  getTextSummary 
} = require('./dist/index.js');

async function testBeautiful() {
  console.log('=== Testing "beautiful" ===\n');
  
  // Method 1: Simple syllable count
  const syllables = await countSyllables("beautiful");
  console.log(`1. Syllable count: ${syllables}`);
  
  // Method 2: Detailed information
  const info = await getSyllableInfo("beautiful");
  console.log(`2. Detailed info:`, info);
  
  // Method 3: Synchronous count
  const syncSyllables = countSyllablesSync("beautiful");
  console.log(`3. Sync syllable count: ${syncSyllables}`);
  
  // Method 4: Text with multiple words
  const textSyllables = await countTextSyllables("The beautiful sunset");
  console.log(`4. Text syllables: ${textSyllables}`);
  
  // Method 5: Text summary
  const summary = await getTextSummary("The beautiful sunset");
  console.log(`5. Text summary:`, {
    totalSyllables: summary.totalSyllables,
    totalWords: summary.totalWords,
    averageSyllablesPerWord: summary.averageSyllablesPerWord.toFixed(2)
  });
}

testBeautiful().catch(console.error);
