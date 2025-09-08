# 🚀 Quick Start Guide

Get up and running with `cmu-syllable-counter` in minutes!

## 📦 Installation

```bash
npm install cmu-syllable-counter
```

## 🎯 Basic Usage

### ESM (ES Modules)

```javascript
import { getSyllableCount } from 'cmu-syllable-counter';

const result = await getSyllableCount('beautiful');
console.log(result.totalSyllableCount); // 3
```

### CommonJS

```javascript
const { getSyllableCount } = require('cmu-syllable-counter');

getSyllableCount('beautiful').then(result => {
  console.log(result.totalSyllableCount); // 3
});
```

### Browser (UMD)

```html
<script src="https://unpkg.com/cmu-syllable-counter/dist/index.umd.min.js"></script>
<script>
  CMUSyllableCounter.getSyllableCount('beautiful').then(result => {
    console.log(result.totalSyllableCount); // 3
  });
</script>
```

## 🧪 Try the Examples

### 1. Run ESM Example
```bash
cd examples
node esm-example.js
```

### 2. Run CommonJS Example
```bash
cd examples
node commonjs-example.cjs
```

### 3. Open Browser Example
```bash
cd examples
python -m http.server 8000
# Then visit: http://localhost:8000/umd-example.html
```

### 4. Test All Examples
```bash
cd examples
node test-examples.js
```

## 🎨 Common Use Cases

### Count Syllables in Text
```javascript
const result = await getSyllableCount('The quick brown fox jumps');
console.log(result.totalSyllableCount); // 6
```

### Hyphenate Text
```javascript
const result = await getHyphenatedString('programming is fun');
console.log(result.hyp); // "pro-gram-ming is fun"
```

### Find Words by Syllable Count
```javascript
const words = findWordsBySyllableCount(3, { limit: 5 });
console.log(words); // Array of 3-syllable words
```

### Check if Word Exists
```javascript
const exists = isWordInDictionary('hello');
console.log(exists); // true
```

## 📚 More Examples

- **Complete Examples**: See `examples/` directory
- **API Reference**: See main README.md
- **Interactive Demo**: Open `examples/umd-example.html`

## 🆘 Need Help?

- Check the [troubleshooting guide](README.md#-troubleshooting)
- Open an issue on [GitHub](https://github.com/rajans-codes/cmu-syllable-counter)
- Read the [full documentation](README.md)

---

**Happy syllable counting!** 🎵
