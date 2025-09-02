/**
 * Example 5: Rollup Configuration for Tree-Shaking
 * 
 * This example shows how to configure rollup to enable tree-shaking
 * and demonstrates the expected bundle size differences.
 */

// This is a configuration example, not a runnable script
// Copy this configuration to your rollup.config.js

const rollupConfig = {
  input: 'src/main.js',
  output: {
    file: 'dist/bundle.js',
    format: 'es', // ES modules enable tree-shaking
    sourcemap: true
  },
  plugins: [
    // Essential plugins for tree-shaking
    resolve({
      preferBuiltins: true,
      extensions: ['.js', '.ts']
    }),
    commonjs({
      include: /node_modules/,
      transformMixedEsModules: true
    }),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: false, // Disable for production builds
      sourceMap: true
    }),
    terser({
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info'],
        passes: 2,
        dead_code: true,
        unused: true
      },
      mangle: {
        toplevel: true
      }
    })
  ],
  treeshake: {
    moduleSideEffects: false,
    propertyReadSideEffects: false,
    unknownGlobalSideEffects: false,
    tryCatchDeoptimization: false
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

console.log('📋 Rollup Configuration Example');
console.log('===============================\n');
console.log('This file contains rollup configuration for optimal tree-shaking.');
console.log('Copy the configuration to your rollup.config.js file.');
console.log('\nKey settings for tree-shaking:');
console.log('- output.format: "es" (ES modules)');
console.log('- treeshake.moduleSideEffects: false');
console.log('- treeshake.propertyReadSideEffects: false');
console.log('- terser with dead_code and unused options');
console.log('\nExpected bundle size differences:');
console.log('- Minimal import: ~100KB');
console.log('- Dictionary only: ~2-3MB');
console.log('- Full library: ~7.9MB');
console.log('\nRollup automatically enables tree-shaking for ES modules!');
