/**
 * Example 1: Minimal Import (Tree-Shakable)
 * 
 * This example imports only the core syllable counting function.
 * Tree-shaking should exclude dictionary data and unused utilities.
 * 
 * Expected bundle size: Small (only core functionality)
 */

import { getSyllableCount } from '../dist/index.esm.js';

async function minimalExample() {
  console.log('🌱 Minimal Import Example (Tree-Shakable)');
  console.log('==========================================\n');
  
  console.log('📦 Imported: getSyllableCount only');
  console.log('🎯 Expected: Only core syllable counting logic included');
  console.log('📊 Bundle impact: Minimal\n');
  
  // Test the function with includeHyp: true to get word details
  const result = await getSyllableCount('hello beautiful world', { includeHyp: true });
  
  console.log('✅ Function works:', result);
  console.log('   - Total syllables:', result.totalSyllableCount);
  console.log('   - Word details:', result.wordDetails?.length || 0, 'words');
  
  if (result.wordDetails) {
    console.log('   - Individual words:');
    result.wordDetails.forEach(detail => {
      console.log(`     * "${detail.word}" -> "${detail.hyp}" (${detail.sc} syllables, ${detail.source})`);
    });
  }
  
  console.log('\n🔍 Tree-Shaking Analysis:');
  console.log('   - Dictionary data: Should be excluded (not imported)');
  console.log('   - Utility functions: Should be excluded (not imported)');
  console.log('   - Core logic: Should be included (imported)');
  console.log('   - Bundle size: Should be significantly smaller than full import');
}

minimalExample().catch(console.error);
