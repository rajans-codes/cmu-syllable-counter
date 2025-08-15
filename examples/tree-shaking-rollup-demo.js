#!/usr/bin/env node

/**
 * Rollup Tree-Shaking Demo for CMU Dictionary Library
 * 
 * This demo uses rollup to build different import patterns and analyze
 * the actual bundle sizes to demonstrate tree-shaking effectiveness.
 * 
 * Run with: node examples/tree-shaking-rollup-demo.js
 */

import fs from 'fs';
import path from 'path';

console.log('🌳 CMU Dictionary Library - Rollup Tree-Shaking Demo\n');

// Get current directory for ES modules
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Create demo directory
const demoDir = path.join(__dirname, 'tree-shaking-rollup-demo');
if (!fs.existsSync(demoDir)) {
  fs.mkdirSync(demoDir, { recursive: true });
}

// Create package.json for the demo
const packageJson = {
  "name": "cmu-dictionary-rollup-tree-shaking-demo",
  "version": "1.0.0",
  "description": "Rollup demo of tree-shaking capabilities",
  "main": "index.js",
  "scripts": {
    "build": "rollup -c",
    "build:minimal": "rollup -c rollup.minimal.js",
    "build:hyphenation": "rollup -c rollup.hyphenation.js",
    "build:text-analysis": "rollup -c rollup.text-analysis.js",
    "build:analytics": "rollup -c rollup.analytics.js",
    "build:everything": "rollup -c rollup.everything.js",
    "analyze": "node analyze-rollup-bundles.js"
  },
  "devDependencies": {
    "rollup": "^3.28.0",
    "@rollup/plugin-node-resolve": "^15.0.0",
    "@rollup/plugin-commonjs": "^25.0.0",
    "rollup-plugin-visualizer": "^5.9.0"
  },
  "dependencies": {
    "cmu-dictionary": "file:../"
  }
};

fs.writeFileSync(path.join(demoDir, 'package.json'), JSON.stringify(packageJson, null, 2));

// Create rollup configuration
const rollupConfig = `
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { visualizer } from 'rollup-plugin-visualizer';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'esm',
    sourcemap: true
  },
  plugins: [
    nodeResolve(),
    commonjs(),
    visualizer({
      filename: 'bundle-stats.html',
      open: false
    })
  ],
  treeshake: {
    moduleSideEffects: false,
    propertyReadSideEffects: false,
    unknownGlobalSideEffects: false
  }
};
`;

fs.writeFileSync(path.join(demoDir, 'rollup.config.js'), rollupConfig);

// Create different entry points for testing
const entryPoints = {
  'minimal': `
// Minimal imports - only core functionality
import { countSyllablesSync, countTextSyllablesSync } from 'cmu-dictionary';

console.log('Minimal bundle loaded');
console.log('Syllables in "hello":', countSyllablesSync('hello'));
console.log('Syllables in "Hello world!":', countTextSyllablesSync('Hello world!'));

export { countSyllablesSync, countTextSyllablesSync };
`,

  'hyphenation': `
// Core + hyphenation functionality
import { countSyllablesSync, countTextSyllablesSync } from 'cmu-dictionary';
import { hyphenateWord, enhancedHyphenation } from 'cmu-dictionary';

console.log('Core + Hyphenation bundle loaded');
console.log('Syllables in "international":', countSyllablesSync('international'));
console.log('Hyphenated "international":', hyphenateWord('international'));

export { countSyllablesSync, countTextSyllablesSync, hyphenateWord, enhancedHyphenation };
`,

  'text-analysis': `
// Core + text analysis functionality
import { countSyllablesSync, countTextSyllablesSync } from 'cmu-dictionary';
import { analyzeText, getWordBreakdown } from 'cmu-dictionary';

console.log('Core + Text Analysis bundle loaded');
console.log('Syllables in "analysis":', countSyllablesSync('analysis'));

// Async function to demonstrate text analysis
async function demoTextAnalysis() {
  const result = await analyzeText('Hello world! This is a test.');
  console.log('Text analysis result:', result.totalSyllables, 'syllables');
}

demoTextAnalysis();

export { countSyllablesSync, countTextSyllablesSync, analyzeText, getWordBreakdown };
`,

  'analytics': `
// Core + analytics functionality
import { countSyllablesSync, countTextSyllablesSync } from 'cmu-dictionary';
import { calculateStatistics, analyzePhonemePatterns } from 'cmu-dictionary';

console.log('Core + Analytics bundle loaded');
console.log('Syllables in "statistics":', countSyllablesSync('statistics'));

const stats = calculateStatistics([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
console.log('Statistics result:', stats.mean, 'mean');

export { countSyllablesSync, countTextSyllablesSync, calculateStatistics, analyzePhonemePatterns };
`,

  'everything': `
// Import everything (anti-pattern)
import * as CMUDict from 'cmu-dictionary';

console.log('Everything bundle loaded');
console.log('Available exports:', Object.keys(CMUDict).length);
console.log('Syllables in "everything":', CMUDict.countSyllablesSync('everything'));

export default CMUDict;
`
};

// Create src directory and entry files
const srcDir = path.join(demoDir, 'src');
if (!fs.existsSync(srcDir)) {
  fs.mkdirSync(srcDir, { recursive: true });
}

Object.entries(entryPoints).forEach(([name, code]) => {
  fs.writeFileSync(path.join(srcDir, `${name}.js`), code);
});

// Create rollup configs for each entry point
Object.keys(entryPoints).forEach(name => {
  const config = `
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { visualizer } from 'rollup-plugin-visualizer';

export default {
  input: 'src/${name}.js',
  output: {
    file: 'dist/${name}.bundle.js',
    format: 'esm',
    sourcemap: true
  },
  plugins: [
    nodeResolve(),
    commonjs(),
    visualizer({
      filename: '${name}-bundle-stats.html',
      open: false
    })
  ],
  treeshake: {
    moduleSideEffects: false,
    propertyReadSideEffects: false,
    unknownGlobalSideEffects: false
  }
};
`;
  fs.writeFileSync(path.join(demoDir, `rollup.${name}.js`), config);
});

// Create main demo script
const demoScript = `
#!/usr/bin/env node

/**
 * Rollup Tree-Shaking Analysis Demo
 * 
 * This script builds different import patterns and analyzes bundle sizes
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🌳 Rollup Tree-Shaking Analysis Demo\\n');

// Utility function to get file size
function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch (error) {
    return 0;
  }
}

// Utility function to format bytes
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Build and analyze each bundle
const bundles = [
  { name: 'minimal', description: 'Only core functionality' },
  { name: 'hyphenation', description: 'Core + hyphenation' },
  { name: 'text-analysis', description: 'Core + text analysis' },
  { name: 'analytics', description: 'Core + analytics' },
  { name: 'everything', description: 'Everything (anti-pattern)' }
];

console.log('Building bundles with Rollup...\\n');

bundles.forEach(bundle => {
  try {
    console.log(\`📦 Building \${bundle.name} bundle...\`);
    execSync(\`npm run build:\${bundle.name}\`, { 
      cwd: __dirname, 
      stdio: 'pipe' 
    });
    
    const bundlePath = path.join(__dirname, 'dist', \`\${bundle.name}.bundle.js\`);
    const size = getFileSize(bundlePath);
    
    console.log(\`✅ \${bundle.name.padEnd(15)} \${formatBytes(size).padStart(10)} - \${bundle.description}\`);
  } catch (error) {
    console.log(\`❌ Failed to build \${bundle.name} bundle: \${error.message}\`);
  }
});

// Bundle size comparison
console.log('\\n📊 Bundle Size Comparison');
console.log('==========================');

const bundleSizes = bundles.map(bundle => {
  const bundlePath = path.join(__dirname, 'dist', \`\${bundle.name}.bundle.js\`);
  return {
    name: bundle.name,
    size: getFileSize(bundlePath),
    description: bundle.description
  };
}).filter(bundle => bundle.size > 0);

bundleSizes.sort((a, b) => a.size - b.size);

const maxSize = Math.max(...bundleSizes.map(b => b.size));

bundleSizes.forEach((bundle, index) => {
  const percentage = ((bundle.size / maxSize) * 100).toFixed(1);
  console.log(\`\${index + 1}. \${bundle.name.padEnd(15)} \${formatBytes(bundle.size).padStart(10)} (\${percentage}%) - \${bundle.description}\`);
});

// Calculate savings
if (bundleSizes.length >= 2) {
  const minimalSize = bundleSizes[0].size;
  const everythingSize = bundleSizes[bundleSizes.length - 1].size;
  const savings = ((everythingSize - minimalSize) / everythingSize * 100).toFixed(1);
  
  console.log(\`\\n💡 Tree-Shaking Savings: \${savings}% smaller with minimal imports\`);
}

console.log('\\n📈 Bundle Analysis Reports:');
console.log('============================');
bundleSizes.forEach(bundle => {
  const reportPath = path.join(__dirname, \`\${bundle.name}-bundle-stats.html\`);
  if (fs.existsSync(reportPath)) {
    console.log(\`• \${bundle.name}: \${reportPath}\`);
  }
});

// Gzip size estimation
console.log('\\n🗜️  Gzip Size Estimation:');
console.log('==========================');
bundleSizes.forEach(bundle => {
  const bundlePath = path.join(__dirname, 'dist', \`\${bundle.name}.bundle.js\`);
  const content = fs.readFileSync(bundlePath, 'utf8');
  const gzipSize = require('zlib').gzipSync(content).length;
  console.log(\`\${bundle.name.padEnd(15)} \${formatBytes(gzipSize).padStart(10)} (gzipped)\`);
});

console.log('\\n🎯 Key Insights:');
console.log('• Rollup provides excellent tree-shaking out of the box');
console.log('• Minimal imports result in the smallest bundle size');
console.log('• Each additional feature increases bundle size');
console.log('• Importing everything includes unused code');
console.log('• Bundle analyzer reports show exactly what\'s included');
console.log('• Gzip compression further reduces transfer sizes');
`;

fs.writeFileSync(path.join(demoDir, 'analyze-rollup-bundles.js'), demoScript);

// Create README for the demo
const readme = `
# CMU Dictionary Rollup Tree-Shaking Demo

This demo shows how different import patterns affect bundle size when using Rollup.

## Setup

\`\`\`bash
npm install
\`\`\`

## Build Bundles

\`\`\`bash
# Build all bundles
npm run build:minimal
npm run build:hyphenation
npm run build:text-analysis
npm run build:analytics
npm run build:everything
\`\`\`

## Analyze Results

\`\`\`bash
npm run analyze
\`\`\`

## Bundle Reports

After building, check the generated HTML reports in the \`dist\` directory:
- \`minimal-bundle-stats.html\`
- \`hyphenation-bundle-stats.html\`
- \`text-analysis-bundle-stats.html\`
- \`analytics-bundle-stats.html\`
- \`everything-bundle-stats.html\`

## Expected Results

- **Minimal**: Smallest bundle (core functionality only)
- **Hyphenation**: Slightly larger (core + hyphenation)
- **Text Analysis**: Larger (core + text processing)
- **Analytics**: Larger (core + statistical analysis)
- **Everything**: Largest (entire library)

## Key Takeaways

1. **Rollup tree-shaking**: Excellent tree-shaking out of the box
2. **Import selectively**: Choose only what you need
3. **Avoid wildcard imports**: \`import *\` includes everything
4. **Bundle analysis**: Use visualizer to verify what's included
5. **Gzip compression**: Further reduces transfer sizes

## Rollup vs Webpack

- **Rollup**: Better tree-shaking, smaller bundles
- **Webpack**: More features, larger ecosystem
- **Both**: Support tree-shaking effectively
`;

fs.writeFileSync(path.join(demoDir, 'README.md'), readme);

console.log('✅ Rollup tree-shaking demo created successfully!');
console.log(`📁 Demo location: ${demoDir}`);
console.log('\nTo run the demo:');
console.log(`1. cd ${demoDir}`);
console.log('2. npm install');
console.log('3. npm run build:minimal');
console.log('4. npm run analyze');
console.log('\nThis will show you actual bundle sizes and create HTML reports');
console.log('showing exactly what code is included in each bundle.');
