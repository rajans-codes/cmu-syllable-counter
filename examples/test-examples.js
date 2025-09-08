#!/usr/bin/env node

/**
 * Test runner for all example formats
 * 
 * This script tests that all three formats (ESM, CommonJS, UMD) work correctly
 * by running basic functionality tests.
 * 
 * Run with: node examples/test-examples.js
 */

import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';

console.log('🧪 Testing CMU Syllable Counter Examples\n');

// Test configuration
const tests = [
  {
    name: 'ESM Example',
    command: 'node',
    args: ['examples/esm-example.js'],
    timeout: 30000
  },
  {
    name: 'CommonJS Example', 
    command: 'node',
    args: ['examples/commonjs-example.cjs'],
    timeout: 30000
  }
];

// Check if dist files exist
async function checkDistFiles() {
  const requiredFiles = [
    'dist/index.esm.js',
    'dist/index.cjs', 
    'dist/index.umd.min.js'
  ];
  
  console.log('📁 Checking build files...');
  
  for (const file of requiredFiles) {
    try {
      const stats = await fs.stat(file);
      console.log(`✅ ${file} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
    } catch (error) {
      console.log(`❌ ${file} - Not found`);
      console.log('   Run "npm run build" to create the required files.');
      return false;
    }
  }
  
  return true;
}

// Run a single test
function runTest(test) {
  return new Promise((resolve, reject) => {
    console.log(`\n🚀 Running ${test.name}...`);
    
    const child = spawn(test.command, test.args, {
      stdio: 'pipe',
      timeout: test.timeout
    });
    
    let stdout = '';
    let stderr = '';
    
    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    
    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        console.log(`✅ ${test.name} - PASSED`);
        resolve({ success: true, stdout, stderr });
      } else {
        console.log(`❌ ${test.name} - FAILED (exit code: ${code})`);
        if (stderr) {
          console.log('Error output:', stderr);
        }
        resolve({ success: false, stdout, stderr, code });
      }
    });
    
    child.on('error', (error) => {
      console.log(`❌ ${test.name} - ERROR: ${error.message}`);
      resolve({ success: false, error: error.message });
    });
    
    // Handle timeout
    setTimeout(() => {
      child.kill();
      console.log(`⏰ ${test.name} - TIMEOUT`);
      resolve({ success: false, error: 'Timeout' });
    }, test.timeout);
  });
}

// Test UMD file structure
async function testUMDFile() {
  console.log('\n🌐 Testing UMD file structure...');
  
  try {
    const umdContent = await fs.readFile('dist/index.umd.min.js', 'utf8');
    
    const checks = [
      { name: 'Contains CMU_DICTIONARY', test: umdContent.includes('CMU_DICTIONARY') },
      { name: 'Contains getSyllableCount', test: umdContent.includes('getSyllableCount') },
      { name: 'Contains getHyphenatedString', test: umdContent.includes('getHyphenatedString') },
      { name: 'Contains global assignment', test: umdContent.includes('CMUSyllableCounter') },
      { name: 'Has reasonable size', test: umdContent.length > 1000000 } // > 1MB
    ];
    
    let allPassed = true;
    checks.forEach(check => {
      if (check.test) {
        console.log(`✅ ${check.name}`);
      } else {
        console.log(`❌ ${check.name}`);
        allPassed = false;
      }
    });
    
    return allPassed;
  } catch (error) {
    console.log(`❌ UMD file test failed: ${error.message}`);
    return false;
  }
}

// Test HTML file exists
async function testHTMLFile() {
  console.log('\n📄 Testing HTML example file...');
  
  try {
    const htmlContent = await fs.readFile('examples/umd-example.html', 'utf8');
    
    const checks = [
      { name: 'Contains script tag', test: htmlContent.includes('<script src="../dist/index.umd.min.js">') },
      { name: 'Contains CMUSyllableCounter usage', test: htmlContent.includes('CMUSyllableCounter') },
      { name: 'Has interactive elements', test: htmlContent.includes('<button') },
      { name: 'Has proper structure', test: htmlContent.includes('<!DOCTYPE html>') }
    ];
    
    let allPassed = true;
    checks.forEach(check => {
      if (check.test) {
        console.log(`✅ ${check.name}`);
      } else {
        console.log(`❌ ${check.name}`);
        allPassed = false;
      }
    });
    
    return allPassed;
  } catch (error) {
    console.log(`❌ HTML file test failed: ${error.message}`);
    return false;
  }
}

// Main test runner
async function runAllTests() {
  console.log('Starting comprehensive example tests...\n');
  
  // Check dist files first
  const distFilesOk = await checkDistFiles();
  if (!distFilesOk) {
    console.log('\n❌ Build files missing. Please run "npm run build" first.');
    process.exit(1);
  }
  
  // Test UMD file structure
  const umdOk = await testUMDFile();
  
  // Test HTML file
  const htmlOk = await testHTMLFile();
  
  // Run executable tests
  const results = [];
  for (const test of tests) {
    const result = await runTest(test);
    results.push({ ...test, result });
  }
  
  // Summary
  console.log('\n📊 Test Summary:');
  console.log('================');
  
  const passed = results.filter(r => r.result.success).length;
  const total = results.length;
  
  console.log(`Executable tests: ${passed}/${total} passed`);
  console.log(`UMD file structure: ${umdOk ? 'PASSED' : 'FAILED'}`);
  console.log(`HTML example file: ${htmlOk ? 'PASSED' : 'FAILED'}`);
  
  if (passed === total && umdOk && htmlOk) {
    console.log('\n🎉 All tests passed! Examples are ready to use.');
    console.log('\n📋 Next steps:');
    console.log('1. Run: node examples/esm-example.js');
    console.log('2. Run: node examples/commonjs-example.js');
    console.log('3. Open: examples/umd-example.html in a browser');
  } else {
    console.log('\n❌ Some tests failed. Please check the output above.');
    process.exit(1);
  }
}

// Handle errors
process.on('unhandledRejection', (error) => {
  console.error('Unhandled rejection:', error);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  process.exit(1);
});

// Run tests
runAllTests().catch(error => {
  console.error('Test runner error:', error);
  process.exit(1);
});
