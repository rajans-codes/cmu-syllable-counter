#!/usr/bin/env node

/**
 * Webpack Tree-Shaking Demo for CMU Dictionary Library
 * 
 * This demo uses webpack to build different import patterns and analyze
 * the actual bundle sizes to demonstrate tree-shaking effectiveness.
 * 
 * Run with: node examples/tree-shaking-webpack-demo.js
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log('🌳 CMU Dictionary Library - Webpack Tree-Shaking Demo\n');

// Get current directory for ES modules
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Create demo directory
const demoDir = path.join(__dirname, 'tree-shaking-demo');
if (!fs.existsSync(demoDir)) {
  fs.mkdirSync(demoDir, { recursive: true });
}

// Create package.json for the demo
const packageJson = {
  "name": "cmu-dictionary-tree-shaking-demo",
  "version": "1.0.0",
  "description": "Demo of tree-shaking capabilities",
  "main": "index.js",
  "scripts": {
    "build": "webpack --mode production",
    "build:analyze": "webpack --mode production --analyze",
    "build:minimal": "webpack --mode production --config webpack.minimal.js",
    "build:hyphenation": "webpack --mode production --config webpack.hyphenation.js",
    "build:text-analysis": "webpack --mode production --config webpack.text-analysis.js",
    "build:analytics": "webpack --mode production --config webpack.analytics.js",
    "build:everything": "webpack --mode production --config webpack.everything.js"
  },
  "devDependencies": {
    "webpack": "^5.88.0",
    "webpack-cli": "^5.1.0",
    "webpack-bundle-analyzer": "^4.9.0"
  },
  "dependencies": {
    "cmu-dictionary": "file:../"
  }
};

fs.writeFileSync(path.join(demoDir, 'package.json'), JSON.stringify(packageJson, null, 2));

// Create webpack configuration
const webpackConfig = `
const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    clean: true
  },
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      reportFilename: 'bundle-report.html'
    })
  ],
  optimization: {
    usedExports: true,
    sideEffects: false
  }
};
`;

fs.writeFileSync(path.join(demoDir, 'webpack.config.js'), webpackConfig);

// Create different entry points for testing
const entryPoints = {
  'minimal': `
// Minimal imports - only core functionality
import { countSyllablesSync, countTextSyllablesSync } from 'cmu-dictionary';

console.log('Minimal bundle loaded');
console.log('Syllables in "hello":', countSyllablesSync('hello'));
console.log('Syllables in "Hello world!":', countTextSyllablesSync('Hello world!'));
`,

  'hyphenation': `
// Core + hyphenation functionality
import { countSyllablesSync, countTextSyllablesSync } from 'cmu-dictionary';
import { hyphenateWord, enhancedHyphenation } from 'cmu-dictionary';

console.log('Core + Hyphenation bundle loaded');
console.log('Syllables in "international":', countSyllablesSync('international'));
console.log('Hyphenated "international":', hyphenateWord('international'));
`,

  'text-analysis': `
// Core + text analysis functionality
import { countSyllablesSync, countTextSyllablesSync } from 'cmu-dictionary';
import { analyzeText, getWordBreakdown } from 'cmu-dictionary';

console.log('Core + Text Analysis bundle loaded');
console.log('Syllables in "analysis":', countSyllablesSync('analysis'));
analyzeText('Hello world! This is a test.').then(result => {
  console.log('Text analysis result:', result.totalSyllables, 'syllables');
});
`,

  'analytics': `
// Core + analytics functionality
import { countSyllablesSync, countTextSyllablesSync } from 'cmu-dictionary';
import { calculateStatistics, analyzePhonemePatterns } from 'cmu-dictionary';

console.log('Core + Analytics bundle loaded');
console.log('Syllables in "statistics":', countSyllablesSync('statistics'));
const stats = calculateStatistics([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
console.log('Statistics result:', stats.mean, 'mean');
`,

  'everything': `
// Import everything (anti-pattern)
import * as CMUDict from 'cmu-dictionary';

console.log('Everything bundle loaded');
console.log('Available exports:', Object.keys(CMUDict).length);
console.log('Syllables in "everything":', CMUDict.countSyllablesSync('everything'));
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

// Create webpack configs for each entry point
Object.keys(entryPoints).forEach(name => {
  const config = `
const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  entry: './src/${name}.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '${name}.bundle.js',
    clean: true
  },
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      reportFilename: '${name}-bundle-report.html'
    })
  ],
  optimization: {
    usedExports: true,
    sideEffects: false
  }
};
`;
  fs.writeFileSync(path.join(demoDir, `webpack.${name}.js`), config);
});

// Create main demo script
const demoScript = `
#!/usr/bin/env node

/**
 * Webpack Tree-Shaking Analysis Demo
 * 
 * This script builds different import patterns and analyzes bundle sizes
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🌳 Webpack Tree-Shaking Analysis Demo\\n');

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

console.log('Building bundles...\\n');

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
    console.log(\`❌ Failed to build \${bundle.name} bundle\`);
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
  const reportPath = path.join(__dirname, \`\${bundle.name}-bundle-report.html\`);
  if (fs.existsSync(reportPath)) {
    console.log(\`• \${bundle.name}: \${reportPath}\`);
  }
});

console.log('\\n🎯 Key Insights:');
console.log('• Minimal imports result in the smallest bundle size');
console.log('• Each additional feature increases bundle size');
console.log('• Importing everything includes unused code');
console.log('• Tree-shaking eliminates unused exports');
console.log('• Bundle analyzer reports show exactly what\'s included');
`;

fs.writeFileSync(path.join(demoDir, 'analyze-bundles.js'), demoScript);

// Create README for the demo
const readme = `
# CMU Dictionary Tree-Shaking Demo

This demo shows how different import patterns affect bundle size when using webpack.

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
node analyze-bundles.js
\`\`\`

## Bundle Reports

After building, check the generated HTML reports in the \`dist\` directory:
- \`minimal-bundle-report.html\`
- \`hyphenation-bundle-report.html\`
- \`text-analysis-bundle-report.html\`
- \`analytics-bundle-report.html\`
- \`everything-bundle-report.html\`

## Expected Results

- **Minimal**: Smallest bundle (core functionality only)
- **Hyphenation**: Slightly larger (core + hyphenation)
- **Text Analysis**: Larger (core + text processing)
- **Analytics**: Larger (core + statistical analysis)
- **Everything**: Largest (entire library)

## Key Takeaways

1. **Tree-shaking works**: Only imported code is included
2. **Import selectively**: Choose only what you need
3. **Avoid wildcard imports**: \`import *\` includes everything
4. **Bundle analysis**: Use tools to verify what's included
`;

fs.writeFileSync(path.join(demoDir, 'README.md'), readme);

console.log('✅ Webpack tree-shaking demo created successfully!');
console.log(`📁 Demo location: ${demoDir}`);
console.log('\nTo run the demo:');
console.log(`1. cd ${demoDir}`);
console.log('2. npm install');
console.log('3. npm run build:minimal');
console.log('4. node analyze-bundles.js');
console.log('\nThis will show you actual bundle sizes and create HTML reports');
console.log('showing exactly what code is included in each bundle.');
