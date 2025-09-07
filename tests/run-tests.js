#!/usr/bin/env node

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Test files to run
const TEST_FILES = [
  'core.test.js',
  'dictionary.test.js',
  'types.test.js',
  'integration.test.js'
];

console.log('🧪 Running CMU Syllable Counter Tests...\n');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

for (const testFile of TEST_FILES) {
  console.log(`📋 Running ${testFile}...`);
  
  try {
    const testPath = join(__dirname, testFile);
    const output = execSync(`node --test ${testPath}`, { 
      encoding: 'utf8',
      stdio: 'inherit'
    });
    
    console.log(`✅ ${testFile} - PASSED\n`);
    passedTests++;
  } catch (error) {
    console.log(`❌ ${testFile} - FAILED\n`);
    failedTests++;
    
    if (error.stdout) {
      console.log('STDOUT:', error.stdout);
    }
    if (error.stderr) {
      console.log('STDERR:', error.stderr);
    }
  }
  
  totalTests++;
}

console.log('📊 Test Summary:');
console.log(`   Total Tests: ${totalTests}`);
console.log(`   Passed: ${passedTests}`);
console.log(`   Failed: ${failedTests}`);
console.log(`   Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

if (failedTests > 0) {
  console.log('\n❌ Some tests failed!');
  process.exit(1);
} else {
  console.log('\n🎉 All tests passed!');
  process.exit(0);
}
