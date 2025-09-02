/**
 * Example 4: Webpack Configuration for Tree-Shaking
 * 
 * This example shows how to configure webpack to enable tree-shaking
 * and demonstrates the expected bundle size differences.
 */

// This is a configuration example, not a runnable script
// Copy this configuration to your webpack.config.js

const webpackConfig = {
  mode: 'production', // Essential for tree-shaking
  optimization: {
    usedExports: true, // Enable tree-shaking
    sideEffects: false, // Mark package as side-effect free
    minimize: true, // Enable minification
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ['console.log', 'console.info'],
            passes: 2
          },
          mangle: true
        }
      })
    ]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                modules: false, // Preserve ES modules for tree-shaking
                targets: {
                  browsers: ['> 1%', 'last 2 versions']
                }
              }]
            ]
          }
        }
      }
    ]
  }
};

// Example usage patterns for different bundle sizes:

// 1. Minimal bundle (tree-shakable)
// import { getSyllableCount } from 'cmu-syllable-counter';
// Bundle size: ~100KB (core logic only)

// 2. Dictionary utilities only
// import { findWordsBySyllableCount, getRandomWords } from 'cmu-syllable-counter';
// Bundle size: ~2-3MB (dictionary data + utilities)

// 3. Full library
// import * as CMU from 'cmu-syllable-counter';
// Bundle size: ~7.9MB (everything included)

console.log('📋 Webpack Configuration Example');
console.log('================================\n');
console.log('This file contains webpack configuration for optimal tree-shaking.');
console.log('Copy the configuration to your webpack.config.js file.');
console.log('\nKey settings for tree-shaking:');
console.log('- mode: "production"');
console.log('- optimization.usedExports: true');
console.log('- optimization.sideEffects: false');
console.log('- babel preset modules: false');
console.log('\nExpected bundle size differences:');
console.log('- Minimal import: ~100KB');
console.log('- Dictionary only: ~2-3MB');
console.log('- Full library: ~7.9MB');
