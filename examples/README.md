# Tree-Shaking Examples

This folder contains examples demonstrating how to use the `cmu-syllable-counter` library with different bundlers to achieve optimal tree-shaking and bundle optimization.

## 🎯 What is Tree-Shaking?

Tree-shaking is a technique that eliminates dead code from your bundle by analyzing import/export statements. It allows you to import only the functions you need, resulting in smaller bundle sizes.

## 📁 Examples Overview

### 1. **Minimal Import** (`01-minimal-import.js`)
- **Import**: Only `getSyllableCount`
- **Bundle Size**: ~100KB
- **Use Case**: When you only need basic syllable counting
- **Tree-Shaking**: ✅ Optimal - excludes dictionary data and unused utilities

### 2. **Dictionary Utilities Only** (`02-dictionary-only.js`)
- **Import**: Dictionary functions only
- **Bundle Size**: ~2-3MB
- **Use Case**: When you need dictionary search capabilities
- **Tree-Shaking**: ✅ Good - excludes syllable counting logic

### 3. **Full Import** (`03-full-import.js`)
- **Import**: All available functions
- **Bundle Size**: ~7.9MB
- **Use Case**: When you need the complete library
- **Tree-Shaking**: ❌ None - everything included

### 4. **Webpack Configuration** (`04-webpack-example.js`)
- **Purpose**: Webpack setup for tree-shaking
- **Key Settings**: Production mode, used exports, side effects
- **Difficulty**: Medium

### 5. **Rollup Configuration** (`05-rollup-example.js`)
- **Purpose**: Rollup setup for tree-shaking
- **Key Settings**: ES modules, treeshake options
- **Difficulty**: Easy (automatic for ES modules)

### 6. **Vite Configuration** (`06-vite-example.js`)
- **Purpose**: Vite setup for tree-shaking
- **Key Settings**: Automatic (no config needed)
- **Difficulty**: Easiest

## 🚀 Running the Examples

### Prerequisites
```bash
npm install
npm run build
```

### Run Examples
```bash
# Minimal import
node examples/01-minimal-import.js

# Dictionary utilities only
node examples/02-dictionary-only.js

# Full import
node examples/03-full-import.js

# Configuration examples (view only)
node examples/04-webpack-example.js
node examples/05-rollup-example.js
node examples/06-vite-example.js
```

## 📊 Bundle Size Comparison

| Import Pattern | Bundle Size | Tree-Shaking | Use Case |
|----------------|-------------|---------------|----------|
| `getSyllableCount` only | ~100KB | ✅ Optimal | Basic syllable counting |
| Dictionary utilities | ~2-3MB | ✅ Good | Dictionary operations |
| Full library | ~7.9MB | ❌ None | Complete functionality |

## 🔧 Bundler-Specific Setup

### Webpack
```javascript
// webpack.config.js
module.exports = {
  mode: 'production',
  optimization: {
    usedExports: true,
    sideEffects: false
  }
};
```

### Rollup
```javascript
// rollup.config.js
export default {
  output: { format: 'es' },
  treeshake: {
    moduleSideEffects: false,
    propertyReadSideEffects: false
  }
};
```

### Vite
```javascript
// vite.config.js
export default {
  build: {
    target: 'es2015',
    minify: 'terser'
  }
};
```

## 🌟 Best Practices

1. **Import Only What You Need**
   ```javascript
   // ✅ Good - Tree-shakable
   import { getSyllableCount } from 'cmu-syllable-counter';
   
   // ❌ Avoid - No tree-shaking
   import * as CMU from 'cmu-syllable-counter';
   ```

2. **Use ES Modules**
   ```javascript
   // ✅ Good - ES modules enable tree-shaking
   import { findWordsBySyllableCount } from 'cmu-syllable-counter';
   
   // ❌ Avoid - CommonJS doesn't tree-shake well
   const { findWordsBySyllableCount } = require('cmu-syllable-counter');
   ```

3. **Enable Production Mode**
   ```javascript
   // ✅ Good - Production mode enables tree-shaking
   mode: 'production'
   
   // ❌ Avoid - Development mode may not tree-shake
   mode: 'development'
   ```

## 🔍 Verifying Tree-Shaking

1. **Check Bundle Size**: Compare bundle sizes between different import patterns
2. **Bundle Analyzer**: Use tools like `webpack-bundle-analyzer` or `rollup-plugin-visualizer`
3. **Source Maps**: Verify that unused code is not included in the final bundle

## 📚 Additional Resources

- [Webpack Tree-Shaking Guide](https://webpack.js.org/guides/tree-shaking/)
- [Rollup Tree-Shaking](https://rollupjs.org/guide/en/#tree-shaking)
- [Vite Build Optimization](https://vitejs.dev/guide/build.html#chunking-strategy)

## 🎉 Benefits

- **Smaller Bundles**: Only include code you actually use
- **Faster Loading**: Reduced bundle size means faster page loads
- **Better Caching**: Smaller chunks are easier to cache
- **Cost Savings**: Less bandwidth usage in production

---

**Note**: Tree-shaking effectiveness depends on your bundler configuration and the specific functions you import. Always test with your actual build setup to verify the results.
