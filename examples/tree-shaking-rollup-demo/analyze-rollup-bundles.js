
#!/usr/bin/env node

/**
 * Rollup Tree-Shaking Analysis Demo
 * 
 * This script builds different import patterns and analyzes bundle sizes
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🌳 Rollup Tree-Shaking Analysis Demo\n');

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

console.log('Building bundles with Rollup...\n');

bundles.forEach(bundle => {
  try {
    console.log(`📦 Building ${bundle.name} bundle...`);
    execSync(`npm run build:${bundle.name}`, { 
      cwd: __dirname, 
      stdio: 'pipe' 
    });
    
    const bundlePath = path.join(__dirname, 'dist', `${bundle.name}.bundle.js`);
    const size = getFileSize(bundlePath);
    
    console.log(`✅ ${bundle.name.padEnd(15)} ${formatBytes(size).padStart(10)} - ${bundle.description}`);
  } catch (error) {
    console.log(`❌ Failed to build ${bundle.name} bundle: ${error.message}`);
  }
});

// Bundle size comparison
console.log('\n📊 Bundle Size Comparison');
console.log('==========================');

const bundleSizes = bundles.map(bundle => {
  const bundlePath = path.join(__dirname, 'dist', `${bundle.name}.bundle.js`);
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
  console.log(`${index + 1}. ${bundle.name.padEnd(15)} ${formatBytes(bundle.size).padStart(10)} (${percentage}%) - ${bundle.description}`);
});

// Calculate savings
if (bundleSizes.length >= 2) {
  const minimalSize = bundleSizes[0].size;
  const everythingSize = bundleSizes[bundleSizes.length - 1].size;
  const savings = ((everythingSize - minimalSize) / everythingSize * 100).toFixed(1);
  
  console.log(`\n💡 Tree-Shaking Savings: ${savings}% smaller with minimal imports`);
}

console.log('\n📈 Bundle Analysis Reports:');
console.log('============================');
bundleSizes.forEach(bundle => {
  const reportPath = path.join(__dirname, `${bundle.name}-bundle-stats.html`);
  if (fs.existsSync(reportPath)) {
    console.log(`• ${bundle.name}: ${reportPath}`);
  }
});

// Gzip size estimation
console.log('\n🗜️  Gzip Size Estimation:');
console.log('==========================');
bundleSizes.forEach(bundle => {
  const bundlePath = path.join(__dirname, 'dist', `${bundle.name}.bundle.js`);
  const content = fs.readFileSync(bundlePath, 'utf8');
  const gzipSize = require('zlib').gzipSync(content).length;
  console.log(`${bundle.name.padEnd(15)} ${formatBytes(gzipSize).padStart(10)} (gzipped)`);
});

console.log('\n🎯 Key Insights:');
console.log('• Rollup provides excellent tree-shaking out of the box');
console.log('• Minimal imports result in the smallest bundle size');
console.log('• Each additional feature increases bundle size');
console.log('• Importing everything includes unused code');
console.log('• Bundle analyzer reports show exactly what's included');
console.log('• Gzip compression further reduces transfer sizes');
