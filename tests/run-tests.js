#!/usr/bin/env node

import { execSync } from 'child_process';
import { join } from 'path';

const TEST_DIR = './tests';
const TEST_FILES = [
  // 'core.test.js',
  // 'dictionary.test.js', 
  'hyphenation.test.js',
  'fallback-syllable-count.test.js',
  // 'integration.test.js'
];

function runTests(testFiles = TEST_FILES) {
  console.log('🧪 Running CMU Syllable Counter Tests...\n');
  
  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;
  
  for (const testFile of testFiles) {
    const testPath = join(TEST_DIR, testFile);
    
    try {
      console.log(`📋 Running ${testFile}...`);
      
      // Run the test file with Node.js
      const result = execSync(`node --experimental-vm-modules --test ${testPath}`, {
        encoding: 'utf8',
        stdio: 'inherit'
      });
      
      console.log(`\n✅ ${testFile} - PASSED\n`);
      passedTests++;
      
    } catch (error) {
      console.log(`❌ ${testFile} - FAILED`);
      if (error.stdout) {
        console.log(error.stdout);
      }
      if (error.stderr) {
        console.log(error.stderr);
      }
      console.log('');
      failedTests++;
    }
    
    totalTests++;
  }
  
  // Summary
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
  }
}

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length === 0) {
  // Run all tests
  runTests();
} else if (args[0] === '--list') {
  // List available test files
  console.log('Available test files:');
  TEST_FILES.forEach(file => console.log(`  - ${file}`));
} else {
  // Run specific test files
  const specificTests = args.filter(arg => TEST_FILES.includes(arg));
  if (specificTests.length === 0) {
    console.log('❌ No valid test files specified. Use --list to see available tests.');
    process.exit(1);
  }
  runTests(specificTests);
}
