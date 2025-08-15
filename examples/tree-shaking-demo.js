#!/usr/bin/env node

/**
 * Tree-Shaking Demo for CMU Dictionary Library
 * 
 * This demo shows how different import patterns affect bundle size
 * and demonstrates the tree-shakable nature of the library.
 * 
 * Run with: node examples/tree-shaking-demo.js
 */

import fs from 'fs';
import path from 'path';

// Utility function to measure bundle size
function getBundleSize(code) {
  return Buffer.byteLength(code, 'utf8');
}

// Utility function to format bytes
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

console.log('🌳 CMU Dictionary Library - Tree-Shaking Demo\n');
console.log('This demo shows how different import patterns affect bundle size.\n');

// Demo 1: Minimal imports (only core functionality)
console.log('📦 Demo 1: Minimal Core Imports');
console.log('================================');

const minimalImports = `
// Only import what you need - minimal bundle
import { countSyllables, countTextSyllables } from 'cmu-dictionary';

// Usage
const wordCount = await countSyllables('hello');
const textCount = await countTextSyllables('Hello world!');
`;

console.log('Import pattern:');
console.log('import { countSyllables, countTextSyllables } from "cmu-dictionary";');
console.log(`Bundle size: ${formatBytes(getBundleSize(minimalImports))}`);
console.log('✅ Only core syllable counting is included\n');

// Demo 2: Core + Hyphenation
console.log('📦 Demo 2: Core + Hyphenation');
console.log('==============================');

const hyphenationImports = `
// Core + hyphenation functionality
import { 
  countSyllables, 
  countTextSyllables,
  hyphenateWord,
  enhancedHyphenation 
} from 'cmu-dictionary';

// Usage
const wordCount = await countSyllables('hello');
const hyphenated = await hyphenateWord('hello');
`;

console.log('Import pattern:');
console.log('import { countSyllables, countTextSyllables, hyphenateWord, enhancedHyphenation } from "cmu-dictionary";');
console.log(`Bundle size: ${formatBytes(getBundleSize(hyphenationImports))}`);
console.log('✅ Core + hyphenation modules included\n');

// Demo 3: Core + Text Analysis
console.log('📦 Demo 3: Core + Text Analysis');
console.log('================================');

const textAnalysisImports = `
// Core + text analysis functionality
import { 
  countSyllables, 
  countTextSyllables,
  analyzeText,
  getWordBreakdown 
} from 'cmu-dictionary';

// Usage
const wordCount = await countSyllables('hello');
const analysis = await analyzeText('Hello world!');
`;

console.log('Import pattern:');
console.log('import { countSyllables, countTextSyllables, analyzeText, getWordBreakdown } from "cmu-dictionary";');
console.log(`Bundle size: ${formatBytes(getBundleSize(textAnalysisImports))}`);
console.log('✅ Core + text analysis modules included\n');

// Demo 4: Core + Analytics
console.log('📦 Demo 4: Core + Analytics');
console.log('============================');

const analyticsImports = `
// Core + analytics functionality
import { 
  countSyllables, 
  countTextSyllables,
  calculateStatistics,
  analyzePhonemePatterns 
} from 'cmu-dictionary';

// Usage
const wordCount = await countSyllables('hello');
const stats = await calculateStatistics(['hello', 'world']);
`;

console.log('Import pattern:');
console.log('import { countSyllables, countTextSyllables, calculateStatistics, analyzePhonemePatterns } from "cmu-dictionary";');
console.log(`Bundle size: ${formatBytes(getBundleSize(analyticsImports))}`);
console.log('✅ Core + analytics modules included\n');

// Demo 5: Everything (anti-pattern)
console.log('📦 Demo 5: Everything (Anti-Pattern)');
console.log('====================================');

const everythingImports = `
// Import everything - NOT recommended for production
import * as CMUDict from 'cmu-dictionary';

// Usage
const wordCount = await CMUDict.countSyllables('hello');
const hyphenated = await CMUDict.hyphenateWord('hello');
const analysis = await CMUDict.analyzeText('Hello world!');
const stats = await CMUDict.calculateStatistics(['hello', 'world']);
`;

console.log('Import pattern:');
console.log('import * as CMUDict from "cmu-dictionary";');
console.log(`Bundle size: ${formatBytes(getBundleSize(everythingImports))}`);
console.log('❌ Entire library included - largest bundle size\n');

// Demo 6: Specific module imports
console.log('📦 Demo 6: Specific Module Imports');
console.log('===================================');

const specificImports = `
// Import from specific modules for maximum tree-shaking
import { countSyllables, countTextSyllables } from 'cmu-dictionary/core';
import { hyphenateWord } from 'cmu-dictionary/hyphenation';
import { analyzeText } from 'cmu-dictionary/text-analysis';

// Usage
const wordCount = await countSyllables('hello');
const hyphenated = await hyphenateWord('hello');
const analysis = await analyzeText('Hello world!');
`;

console.log('Import pattern:');
console.log('import { countSyllables } from "cmu-dictionary/core";');
console.log('import { hyphenateWord } from "cmu-dictionary/hyphenation";');
console.log('import { analyzeText } from "cmu-dictionary/text-analysis";');
console.log(`Bundle size: ${formatBytes(getBundleSize(specificImports))}`);
console.log('✅ Maximum tree-shaking - only needed modules included\n');

// Demo 7: Sync vs Async imports
console.log('📦 Demo 7: Sync vs Async Imports');
console.log('=================================');

const syncImports = `
// Sync-only imports (smaller bundle)
import { countSyllablesSync, countTextSyllablesSync } from 'cmu-dictionary';

// Usage
const wordCount = countSyllablesSync('hello');
const textCount = countTextSyllablesSync('Hello world!');
`;

const asyncImports = `
// Async imports (includes CMU dictionary)
import { countSyllables, countTextSyllables } from 'cmu-dictionary';

// Usage
const wordCount = await countSyllables('hello');
const textCount = await countTextSyllables('Hello world!');
`;

console.log('Sync imports:');
console.log('import { countSyllablesSync, countTextSyllablesSync } from "cmu-dictionary";');
console.log(`Bundle size: ${formatBytes(getBundleSize(syncImports))}`);
console.log('✅ Uses fallback algorithm only - no CMU dictionary\n');

console.log('Async imports:');
console.log('import { countSyllables, countTextSyllables } from "cmu-dictionary";');
console.log(`Bundle size: ${formatBytes(getBundleSize(asyncImports))}`);
console.log('✅ Includes CMU dictionary for better accuracy\n');

// Bundle size comparison
console.log('\n📊 Bundle Size Comparison');
console.log('==========================');

const bundleSizes = [
  { name: 'Minimal Core', size: getBundleSize(minimalImports) },
  { name: 'Core + Hyphenation', size: getBundleSize(hyphenationImports) },
  { name: 'Core + Text Analysis', size: getBundleSize(textAnalysisImports) },
  { name: 'Core + Analytics', size: getBundleSize(analyticsImports) },
  { name: 'Everything (Anti-Pattern)', size: getBundleSize(everythingImports) },
  { name: 'Specific Modules', size: getBundleSize(specificImports) },
  { name: 'Sync Only', size: getBundleSize(syncImports) },
  { name: 'Async with CMU', size: getBundleSize(asyncImports) }
];

bundleSizes.sort((a, b) => a.size - b.size);

bundleSizes.forEach((bundle, index) => {
  const percentage = ((bundle.size / bundleSizes[bundleSizes.length - 1].size) * 100).toFixed(1);
  console.log(`${index + 1}. ${bundle.name.padEnd(25)} ${formatBytes(bundle.size).padStart(10)} (${percentage}%)`);
});

// Best practices
console.log('\n💡 Tree-Shaking Best Practices');
console.log('===============================');
console.log('✅ Use specific named imports: import { countSyllables } from "cmu-dictionary"');
console.log('✅ Import only what you need');
console.log('✅ Use sync functions if you don\'t need CMU dictionary accuracy');
console.log('✅ Consider importing from specific modules for maximum control');
console.log('❌ Avoid: import * as CMUDict from "cmu-dictionary"');
console.log('❌ Avoid: import everything when you only need core functionality');

// Real-world examples
console.log('\n🌍 Real-World Usage Examples');
console.log('============================');

console.log('1. Simple syllable counter (minimal bundle):');
console.log('   import { countSyllablesSync } from "cmu-dictionary";');

console.log('\n2. Accurate syllable counter with CMU dictionary:');
console.log('   import { countSyllables } from "cmu-dictionary";');

console.log('\n3. Text analysis with hyphenation:');
console.log('   import { analyzeText, hyphenateWord } from "cmu-dictionary";');

console.log('\n4. Advanced analytics:');
console.log('   import { calculateStatistics, analyzePhonemePatterns } from "cmu-dictionary";');

console.log('\n5. Maximum tree-shaking (specific modules):');
console.log('   import { countSyllables } from "cmu-dictionary/core";');
console.log('   import { hyphenateWord } from "cmu-dictionary/hyphenation";');

console.log('\n🎯 Key Takeaway:');
console.log('The library is designed to be tree-shakable, meaning your bundler');
console.log('will only include the code you actually use, keeping your bundle size minimal!');
