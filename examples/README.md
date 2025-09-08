# CMU Syllable Counter - Usage Examples

This directory contains comprehensive examples showing how to use the `cmu-syllable-counter` library in all three supported formats: ESM, CommonJS, and UMD.

## 📁 Files Overview

- **`esm-example.js`** - ESM (ES Modules) usage examples
- **`commonjs-example.cjs`** - CommonJS usage examples  
- **`umd-example.html`** - UMD browser usage examples
- **`README.md`** - This documentation file

## 🚀 Quick Start

### ESM (ES Modules)

```javascript
import { getSyllableCount, getHyphenatedString } from 'cmu-syllable-counter';

// Basic usage
const result = await getSyllableCount('beautiful');
console.log(result.totalSyllableCount); // 3

// With options
const detailed = await getSyllableCount('hello world', {
  includeHyp: true,
  delimiter: '·',
  includePron: true,
  includeAnalysis: true
});
```

### CommonJS

```javascript
const { getSyllableCount, getHyphenatedString } = require('cmu-syllable-counter');

// Basic usage
getSyllableCount('beautiful').then(result => {
  console.log(result.totalSyllableCount); // 3
});
```

### UMD (Browser)

```html
<script src="path/to/index.umd.min.js"></script>
<script>
  // Available as global CMUSyllableCounter
  CMUSyllableCounter.getSyllableCount('beautiful').then(result => {
    console.log(result.totalSyllableCount); // 3
  });
</script>
```

## 📋 Running the Examples

### Prerequisites

1. Make sure you have built the library:
   ```bash
   npm run build
   ```

2. Ensure the `dist/` directory contains the built files:
   - `dist/index.esm.js` (ESM format)
   - `dist/index.cjs` (CommonJS format)
   - `dist/index.umd.min.js` (UMD format)

### ESM Example

```bash
node examples/esm-example.js
```

**Note**: This requires Node.js 14+ with ES modules support.

### CommonJS Example

```bash
node examples/commonjs-example.cjs
```

**Note**: This works with any Node.js version that supports CommonJS.

### UMD Example

1. Open `examples/umd-example.html` in a web browser
2. Or serve it via a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Then visit: http://localhost:8000/examples/umd-example.html
   ```

## 🎯 Example Features

Each example demonstrates:

### Core Functions
- **`getSyllableCount()`** - Count syllables in text
- **`getHyphenatedString()`** - Hyphenate text
- **`cmuDictionary`** - Dictionary operations

### Search Functions
- **`findWordsBySyllableCount()`** - Find words by syllable count
- **`findWordsByComplexity()`** - Find words by complexity level
- **`findWordsByStressPattern()`** - Find words by stress pattern
- **`findWordsByVowelCount()`** - Find words by vowel count
- **`findRhymingWords()`** - Find rhyming words
- **`getRandomWords()`** - Get random words

### Utility Functions
- **`isWordInDictionary()`** - Check if word exists
- **`getDictionarySize()`** - Get dictionary size
- **`getAllWords()`** - Get all words
- **`CMU_DICTIONARY`** - Direct dictionary access

## 🔧 Configuration Options

### getSyllableCount Options

```javascript
const options = {
  includeHyp: true,           // Include hyphenation in results
  delimiter: '·',            // Custom delimiter for hyphenation
  includePron: true,         // Include pronunciation
  includeAnalysis: true      // Include text analysis
};
```

### getHyphenatedString Options

```javascript
const options = {
  delimiter: '·',            // Custom delimiter
  includeAnalysis: true      // Include text analysis
};
```

### Search Function Options

```javascript
const options = {
  limit: 10,                 // Maximum number of results
  includePronunciation: true, // Include pronunciation
  includeSyllables: true,    // Include syllable count
  includeHyphenation: true   // Include hyphenation
};
```

## 📊 Output Examples

### Basic Syllable Count

```javascript
{
  totalSyllableCount: 3
}
```

### Detailed Syllable Count

```javascript
{
  totalSyllableCount: 8,
  wordDetails: [
    {
      word: "hello",
      hyp: "hel-lo",
      sc: 2,
      source: "cmu",
      pron: "HH AH0 L OW1"
    },
    {
      word: "world",
      hyp: "world",
      sc: 1,
      source: "cmu",
      pron: "W ER1 L D"
    }
  ],
  analysis: {
    totalWords: 2,
    avgSyllablesPerWord: 1.5,
    lines: 1
  }
}
```

### Hyphenated String

```javascript
{
  hyp: "hel-lo world pro-gram-ming",
  words: [
    { word: "hello", hyp: "hel-lo", sc: 2, source: "cmu" },
    { word: "world", hyp: "world", sc: 1, source: "cmu" },
    { word: "programming", hyp: "pro-gram-ming", sc: 3, source: "cmu" }
  ],
  analysis: {
    totalWords: 3,
    avgSyllablesPerWord: 2,
    lines: 1
  }
}
```

## 🎨 Custom Utilities

The examples also show how to create custom utilities using the raw dictionary data:

```javascript
// Find words ending with "ing" that have 2 syllables
const ingWords = Object.entries(CMU_DICTIONARY)
  .filter(([word, data]) => word.endsWith('ing') && data.s === 2)
  .slice(0, 10)
  .map(([word, data]) => ({ word, ...data }));

// Find words with specific stress patterns
const stressWords = Object.entries(CMU_DICTIONARY)
  .filter(([word, data]) => {
    const stressPattern = data.p.split(' ')
      .map(phoneme => /\d/.test(phoneme) ? phoneme.match(/\d/)[0] : '0')
      .join('');
    return stressPattern === '010';
  })
  .slice(0, 10);
```

## 🐛 Troubleshooting

### ESM Issues

If you get "Cannot use import statement outside a module":
- Ensure your `package.json` has `"type": "module"`
- Or use `.mjs` extension for the file
- Or use Node.js 14+ with proper ES modules support

### CommonJS Issues

If you get "require is not defined":
- Ensure you're running in a Node.js environment
- Check that the file has `.js` extension (not `.mjs`)

### UMD Issues

If the library doesn't load in browser:
- Check that the script path is correct
- Ensure the file is served over HTTP/HTTPS (not file://)
- Check browser console for errors

### Build Issues

If examples don't work:
- Run `npm run build` to ensure all formats are built
- Check that `dist/` directory contains all required files
- Verify file sizes (UMD should be ~6MB, others smaller)

## 📚 Additional Resources

- [Main README](../README.md) - Complete library documentation
- [API Reference](../README.md#api-reference) - Detailed API documentation
- [GitHub Repository](https://github.com/rajans-codes/cmu-syllable-counter) - Source code and issues

## 🤝 Contributing

Found an issue with the examples? Please:

1. Check the [troubleshooting section](#-troubleshooting)
2. Open an issue on GitHub
3. Or submit a pull request with improvements

---

**Happy syllable counting!** 🎵