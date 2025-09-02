/**
 * Example 6: Vite Configuration for Tree-Shaking
 * 
 * This example shows how Vite automatically enables tree-shaking
 * and demonstrates the expected bundle size differences.
 */

// Vite automatically enables tree-shaking for ES modules!
// No special configuration needed for basic tree-shaking.

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

// Optional: Advanced Vite configuration for production builds
const viteConfig = {
  build: {
    target: 'es2015', // Target modern browsers for better tree-shaking
    minify: 'terser', // Use terser for better dead code elimination
    terserOptions: {
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
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // Optional: Split dictionary data into separate chunk
          'cmu-dictionary': ['cmu-syllable-counter']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['cmu-syllable-counter'] // Pre-bundle for faster dev
  }
};

console.log('📋 Vite Configuration Example');
console.log('=============================\n');
console.log('Vite automatically enables tree-shaking for ES modules!');
console.log('No special configuration needed for basic tree-shaking.');
console.log('\nOptional optimizations:');
console.log('- build.target: "es2015" (modern browsers)');
console.log('- build.minify: "terser" (better dead code elimination)');
console.log('- manualChunks for dictionary data separation');
console.log('\nExpected bundle size differences:');
console.log('- Minimal import: ~100KB');
console.log('- Dictionary only: ~2-3MB');
console.log('- Full library: ~7.9MB');
console.log('\nVite is the easiest bundler for tree-shaking! 🚀');
