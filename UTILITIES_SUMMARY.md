# CMU Dictionary Utilities Summary

This document outlines the comprehensive utilities available for working with the 135,000+ word CMU Dictionary.

## Overview

The CMU Dictionary utilities provide powerful tools for:
- **Advanced Search & Filtering**: Multi-criteria search with complex patterns
- **Statistical Analysis**: Comprehensive data analysis and insights
- **Batch Processing**: Efficient handling of large datasets
- **Data Mining**: Pattern recognition and clustering
- **Export & Integration**: Multiple format exports and API integration

## Core Utilities

### 1. Advanced Search Functions

#### `advancedSearch(options)`
Multi-criteria search with extensive filtering options:

```javascript
const results = advancedSearch({
  minSyllables: 3,
  maxSyllables: 3,
  minLength: 8,
  complexity: 'complex',
  containsPhonemes: ['TH', 'S'],
  startsWithPhonemes: ['B'],
  endsWithPhonemes: ['T'],
  wordPattern: /^un.*ing$/,
  pronunciationPattern: /.*TH.*/,
  limit: 50,
  includeAnalysis: true
});
```

**Options:**
- `minSyllables` / `maxSyllables`: Syllable count range
- `minLength` / `maxLength`: Word length range
- `minPhonemes` / `maxPhonemes`: Phoneme count range
- `complexity`: 'simple' | 'moderate' | 'complex'
- `containsPhonemes`: Array of phonemes that must be present
- `startsWithPhonemes` / `endsWithPhonemes`: Phoneme patterns
- `wordPattern` / `pronunciationPattern`: Regular expressions
- `includePronunciation` / `includeSyllables` / `includeHyphenation` / `includeAnalysis`

#### `findWordsByCriteria(criteria, options)`
Scored search with multiple criteria:

```javascript
const results = findWordsByCriteria({
  syllableCount: 2,
  minLength: 6,
  maxLength: 10,
  complexity: 'moderate',
  startsWith: 'un',
  containsPhonemes: ['TH'],
  pattern: /^un.*ing$/
}, { limit: 20, includeAnalysis: true });
```

Returns results with similarity scores (0-1).

### 2. Batch Processing

#### `batchProcessWords(words, processor, options)`
Efficient batch processing for large datasets:

```javascript
const results = await batchProcessWords(
  wordList,
  async (word, pronunciation) => {
    return {
      word,
      syllables: countSyllablesFromPronunciation(pronunciation),
      length: word.length,
      phonemeCount: pronunciation.split(' ').length
    };
  },
  {
    batchSize: 1000,
    parallel: true,
    maxConcurrent: 4,
    onProgress: (processed, total) => {
      console.log(`Processed ${processed}/${total} words`);
    }
  }
);
```

**Options:**
- `batchSize`: Number of words per batch (default: 1000)
- `parallel`: Process batches in parallel (default: false)
- `maxConcurrent`: Maximum concurrent operations (default: 4)
- `onProgress`: Progress callback function

### 3. Statistical Analysis

#### `getComprehensiveStats()`
Complete dictionary statistics with caching:

```javascript
const stats = getComprehensiveStats();
console.log(`Total words: ${stats.totalWords.toLocaleString()}`);
console.log(`Average phonemes: ${stats.averagePhonemes.toFixed(2)}`);
console.log(`Average syllables: ${stats.averageSyllables.toFixed(2)}`);
console.log(`Syllable distribution:`, stats.syllableDistribution);
console.log(`Length distribution:`, stats.lengthDistribution);
console.log(`Complexity distribution:`, stats.complexityDistribution);
```

#### `getWordsByFrequency(analysis)`
Frequency analysis by different metrics:

```javascript
const syllableFreq = getWordsByFrequency('syllables');
const lengthFreq = getWordsByFrequency('length');
const complexityFreq = getWordsByFrequency('complexity');
const phonemeFreq = getWordsByFrequency('phonemes');
```

### 4. Similarity & Clustering

#### `findSimilarWords(targetWord, threshold, options)`
Find phonetically similar words:

```javascript
const similar = findSimilarWords('hello', 0.8, {
  limit: 20,
  includePronunciation: true,
  includeAnalysis: true
});
```

#### `getWordClusters(clusterType)`
Group words by common characteristics:

```javascript
const syllableClusters = getWordClusters('syllable');
const lengthClusters = getWordClusters('length');
const complexityClusters = getWordClusters('complexity');
const stressClusters = getWordClusters('stress');
```

### 5. Export & Data Management

#### `exportDictionaryData(format, options)`
Export dictionary data in multiple formats:

```javascript
// JSON export
const jsonData = exportDictionaryData('json', {
  includePronunciation: true,
  includeSyllables: true,
  includeHyphenation: true,
  includeAnalysis: true
});

// CSV export
const csvData = exportDictionaryData('csv', {
  includePronunciation: true,
  includeAnalysis: true
});

// TSV export
const tsvData = exportDictionaryData('tsv', {
  includeSyllables: true,
  includeAnalysis: true
});
```

## Advanced Analytics Module

### Statistical Functions

#### `calculateStatistics(data)`
Complete statistical summary:

```javascript
const stats = calculateStatistics(wordLengths);
console.log(`Mean: ${stats.mean.toFixed(2)}`);
console.log(`Median: ${stats.median}`);
console.log(`Mode: ${stats.mode}`);
console.log(`Standard Deviation: ${stats.standardDeviation.toFixed(2)}`);
console.log(`Quartiles: [${stats.quartiles.join(', ')}]`);
console.log(`Percentiles:`, stats.percentiles);
```

#### `calculateCorrelation(x, y)`
Correlation analysis with significance testing:

```javascript
const correlation = calculateCorrelation(wordLengths, syllableCounts);
console.log(`Correlation: ${correlation.correlation.toFixed(3)}`);
console.log(`Strength: ${correlation.strength}`);
console.log(`Significant: ${correlation.significance}`);
```

### Data Mining Functions

#### `analyzePhonemes(options)`
Detailed phoneme analysis:

```javascript
const phonemeAnalysis = analyzePhonemes({
  detailed: true,
  sampleSize: 10000
});

phonemeAnalysis.forEach(phoneme => {
  console.log(`${phoneme.phoneme}: ${phoneme.frequency} occurrences`);
  console.log(`  Avg word length: ${phoneme.averageWordLength.toFixed(1)}`);
  console.log(`  Avg syllables: ${phoneme.averageSyllables.toFixed(1)}`);
  console.log(`  Common words: ${phoneme.commonWords.join(', ')}`);
});
```

#### `analyzeWordPatterns(patternType, options)`
Pattern analysis by type:

```javascript
// Prefix patterns
const prefixPatterns = analyzeWordPatterns('prefix', { sampleSize: 10000 });

// Suffix patterns
const suffixPatterns = analyzeWordPatterns('suffix', { sampleSize: 10000 });

// Phoneme patterns
const phonemePatterns = analyzeWordPatterns('phoneme', { sampleSize: 10000 });

// Stress patterns
const stressPatterns = analyzeWordPatterns('stress', { sampleSize: 10000 });
```

#### `performComprehensiveAnalysis(options)`
Complete dictionary analysis:

```javascript
const analysis = performComprehensiveAnalysis({
  sampleSize: 10000,
  detailed: true
});

console.log('Word Length Stats:', analysis.wordLengthStats);
console.log('Syllable Stats:', analysis.syllableStats);
console.log('Phoneme Stats:', analysis.phonemeStats);
console.log('Correlations:', analysis.correlations);
console.log('Top Phonemes:', analysis.topPhonemes);
console.log('Common Patterns:', analysis.commonPatterns);
```

#### `findOutliers(metric, threshold, options)`
Identify statistical outliers:

```javascript
// Longest words
const lengthOutliers = findOutliers('length', 2, { sampleSize: 10000 });

// Most syllable-heavy words
const syllableOutliers = findOutliers('syllables', 2, { sampleSize: 10000 });

// Most phoneme-heavy words
const phonemeOutliers = findOutliers('phonemes', 2, { sampleSize: 10000 });
```

#### `generateWordClusters(similarityMetric, threshold, options)`
Advanced clustering analysis:

```javascript
const clusters = generateWordClusters('phoneme', 0.8, {
  sampleSize: 5000
});

clusters.forEach(cluster => {
  console.log(`Cluster: ${cluster.size} words`);
  console.log(`  Centroid: "${cluster.centroid}"`);
  console.log(`  Members: ${cluster.members.slice(0, 5).join(', ')}`);
});
```

## Performance Optimizations

### Caching
- **Statistics Cache**: Comprehensive stats are cached for performance
- **Analysis Cache**: Word analysis results are cached
- **Batch Processing**: Efficient memory management for large datasets

### Sampling
- **Sample Size Options**: All analysis functions support sampling for performance
- **Progressive Processing**: Batch processing with progress callbacks
- **Parallel Processing**: Optional parallel execution for faster results

### Memory Management
- **Streaming**: Large datasets processed in chunks
- **Lazy Loading**: Data loaded only when needed
- **Garbage Collection**: Automatic cleanup of temporary data

## Usage Examples

### Basic Search
```javascript
const { advancedSearch, getComprehensiveStats } = require('cmu-syllable-counter');

// Get dictionary overview
const stats = getComprehensiveStats();
console.log(`Dictionary contains ${stats.totalWords.toLocaleString()} words`);

// Find complex 3-syllable words
const complexWords = advancedSearch({
  minSyllables: 3,
  maxSyllables: 3,
  complexity: 'complex',
  limit: 20
});
```

### Advanced Analysis
```javascript
const { 
  performComprehensiveAnalysis, 
  findOutliers, 
  analyzePhonemes 
} = require('cmu-syllable-counter');

// Complete analysis
const analysis = performComprehensiveAnalysis({ sampleSize: 10000 });

// Find unusual words
const outliers = findOutliers('length', 2, { sampleSize: 10000 });

// Analyze phoneme patterns
const phonemes = analyzePhonemes({ detailed: true, sampleSize: 10000 });
```

### Batch Processing
```javascript
const { batchProcessWords, getAllWords } = require('cmu-syllable-counter');

const allWords = getAllWords();
const results = await batchProcessWords(
  allWords.slice(0, 10000),
  async (word, pronunciation) => ({
    word,
    syllables: pronunciation.split(' ').filter(p => 
      ['AA', 'AE', 'AH', 'AO', 'AW', 'AY', 'EH', 'ER', 'EY', 'IH', 'IY', 'OW', 'OY', 'UH', 'UW'].includes(p.substring(0, 2))
    ).length,
    length: word.length,
    phonemeCount: pronunciation.split(' ').length
  }),
  {
    batchSize: 1000,
    parallel: true,
    onProgress: (processed, total) => {
      console.log(`Processed ${processed}/${total} words`);
    }
  }
);
```

## Performance Benchmarks

### Processing Speed
- **10,000 words**: ~2-5 seconds for comprehensive analysis
- **100,000 words**: ~20-50 seconds for comprehensive analysis
- **Full dictionary (135k)**: ~30-75 seconds for comprehensive analysis

### Memory Usage
- **Basic search**: ~10-50MB
- **Comprehensive analysis**: ~100-500MB
- **Batch processing**: ~200-1GB (depending on batch size)

### Scalability
- **Linear scaling**: Processing time scales linearly with sample size
- **Parallel processing**: 2-4x speedup with parallel execution
- **Memory efficient**: Streaming processing for very large datasets

## Integration Examples

### Web Application
```javascript
// Express.js API endpoint
app.get('/api/words/search', (req, res) => {
  const results = advancedSearch({
    minSyllables: parseInt(req.query.minSyllables),
    maxSyllables: parseInt(req.query.maxSyllables),
    minLength: parseInt(req.query.minLength),
    limit: parseInt(req.query.limit) || 50
  });
  
  res.json(results);
});
```

### Data Science Pipeline
```javascript
// Jupyter notebook or data analysis script
const analysis = performComprehensiveAnalysis({ sampleSize: 50000 });

// Export for further analysis
const csvData = exportDictionaryData('csv', { includeAnalysis: true });
fs.writeFileSync('dictionary_analysis.csv', csvData);

// Generate insights
console.log('Key insights:');
console.log(`- Average word length: ${analysis.wordLengthStats.mean.toFixed(1)} letters`);
console.log(`- Word length vs syllables correlation: ${analysis.correlations.lengthVsSyllables.correlation.toFixed(3)}`);
console.log(`- Most common phoneme: ${analysis.topPhonemes[0].phoneme}`);
```

### Educational Tools
```javascript
// Generate word lists for different difficulty levels
const simpleWords = advancedSearch({
  complexity: 'simple',
  minSyllables: 1,
  maxSyllables: 2,
  limit: 100
});

const complexWords = advancedSearch({
  complexity: 'complex',
  minSyllables: 3,
  limit: 100
});

// Create rhyming word lists
const rhymingWords = findRhymingWords('hello', { limit: 20 });
```

## Conclusion

The CMU Dictionary utilities provide a comprehensive toolkit for working with the 135,000+ word dictionary. From simple searches to advanced statistical analysis, these utilities enable efficient processing, analysis, and integration of the dictionary data for various applications including:

- **Natural Language Processing**
- **Educational Software**
- **Text Analysis**
- **Data Science Research**
- **Web Applications**
- **Mobile Apps**

The utilities are designed for both performance and ease of use, with extensive options for customization and optimization based on specific use cases.
