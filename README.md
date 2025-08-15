# CMU Syllable Counter

A fast and accurate syllable counter for English words using the CMU (Carnegie Mellon University) Dictionary. This package provides both synchronous and asynchronous syllable counting with intelligent fallback for words not found in the dictionary, plus advanced text analysis, dictionary utilities, and analytics capabilities.

## Features

- 🎯 **Accurate**: Uses the CMU Dictionary with 135,000+ words for precise syllable counting
- ⚡ **Fast**: Optimized with intelligent caching and efficient data structures
- 🔄 **Flexible**: Both synchronous and asynchronous APIs
- 🛡️ **Reliable**: Intelligent fallback for unknown words
- 📦 **Universal**: Works with ES modules, CommonJS, and UMD
- 🎨 **TypeScript**: Full TypeScript support with type definitions
- 🔗 **Hyphenation**: US/UK English hyphenation with syllable boundaries
- 📊 **Detailed Analysis**: Comprehensive syllable information and statistics
- 🗣️ **Pronunciation**: CMU pronunciation data for dictionary words
- 🚀 **Advanced Utilities**: Text analysis, random word generation, dictionary search
- 📈 **Analytics**: Statistical analysis and data mining capabilities
- 💾 **Optimized**: 3-5x performance improvements with intelligent caching

## Installation

```bash
npm install cmu-syllable-counter
```

## Quick Start

### Unified Syllable Counting

```javascript
import { getSyllableCount } from 'cmu-syllable-counter';

// Count syllables in a single word
const result = await getSyllableCount('beautiful');
console.log(result.totalSyllableCount); // 3

// Count syllables in a sentence
const sentenceResult = await getSyllableCount('The beautiful garden');
console.log(sentenceResult.totalSyllableCount); // 7

// With hyphenation
const detailedResult = await getSyllableCount('beautiful', {
  includeHyp: true,
  delimiter: '-'
});
console.log(detailedResult);
// {
//   totalSyllableCount: 3,
//   hyp: [{ hyp: 'beau-ti-ful', sc: 3, source: 'cmu' }]
// }

// Array of words
const arrayResult = await getSyllableCount(['hello', 'world', 'beautiful'], {
  includeHyp: true
});
console.log(arrayResult);
// {
//   totalSyllableCount: 6,
//   hyp: [
//     { hyp: 'hel-lo', sc: 2, source: 'fallback' },
//     { hyp: 'world', sc: 1, source: 'fallback' },
//     { hyp: 'beau-ti-ful', sc: 3, source: 'cmu' }
//   ]
// }
```
### Advanced Text Analysis

```javascript
import { analyzeText } from 'cmu-syllable-counter';

// Comprehensive text analysis
const result = await analyzeText('Our free syllable counter tool helps writers accurately count syllables.', {
  maxWords: 1000,
  includeBreakdown: true,
  includeHyphenation: true,
  breakdownSeparator: '-'
});

console.log(result);
// {
//   totalSyllables: 23,
//   syllablesPerWord: 2.3,
//   lines: 1,
//   wordCount: 10,
//   characterCount: 67,
//   syllableBreakdown: 'Our1free1syl-la-ble3counter2tool1helps1writ-ers2ac-cu-rate-ly5count1syl-la-bles3',
//   wordDetails: [
//     { word: 'Our', syllables: 1, hyphenated: 'Our', display: 'Our1' },
//     { word: 'free', syllables: 1, hyphenated: 'free', display: 'free1' },
//     // ... more word details
//   ],
//   metadata: {
//     processingTime: 5,
//     wordsProcessed: 10,
//     wordsSkipped: 0,
//     limitsApplied: false
//   }
// }
```

### Random Word Generation

```javascript
import { getRandomWordsWithKey } from 'cmu-syllable-counter';

// Generate random words with uniqueness tracking
const words = await getRandomWordsWithKey(10, {
  uniquenessKey: 'my-app',
  includeAnalysis: true,
  maxCacheSize: 100
});

console.log(words);
// [
//   {
//     word: 'beautiful',
//     syllables: 3,
//     pronunciation: 'B Y UW1 T AH0 F AH0 L',
//     hyphenated: 'beau-ti-ful',
//     complexity: 'moderate',
//     // ... more analysis
//   }
// ]
```

## API Reference

### Unified Syllable Counting

#### `getSyllableCount(wordsOrSentences, options?)`

Unified function for counting syllables in words or sentences with optional hyphenation.

**Parameters:**
- `wordsOrSentences` (string | string[]): A single word, sentence, or array of words/sentences
- `options` (object, optional):
  - `includeHyp` (boolean, default: false): If true, returns hyphenated form for each word
  - `delimiter` (string, default: '-'): Character(s) to use between syllables when hyphenating

**Returns:** Promise<{
  totalSyllableCount: number;
  hyp?: { hyp: string; sc: number; source: 'cmu' | 'fallback' }[];
}>

**Examples:**
```javascript
// Single word
const result = await getSyllableCount('beautiful', { includeHyp: true });
// { totalSyllableCount: 3, hyp: [{ hyp: 'beau-ti-ful', sc: 3, source: 'cmu' }] }

// Sentence
const sentence = await getSyllableCount('The beautiful garden', { includeHyp: true });
// { totalSyllableCount: 7, hyp: [...] }

// Array of words
const words = await getSyllableCount(['hello', 'world'], { includeHyp: true });
// { totalSyllableCount: 3, hyp: [...] }
```

### Additional Core Functions

#### `getSyllableInfo(word: string, options?: SyllableCountOptions & HyphenationOptions): Promise<SyllableInfo>`

Get detailed syllable information for a word including hyphenation and pronunciation.

```javascript
const info = await getSyllableInfo('beautiful', { includeBoundaries: true });
// { word: 'beautiful', syllables: 3, hyphenated: 'beau-ti-ful', source: 'cmu', pronunciation: 'B Y UW1 T AH0 F AH0 L' }
```

#### `isInDictionary(word: string): Promise<boolean>`

Check if a word exists in the CMU Dictionary.

```javascript
const exists = await isInDictionary('beautiful'); // true
const exists = await isInDictionary('xyzzy'); // false
```

#### `getPronunciation(word: string): Promise<string | null>`

Get CMU pronunciation for a word.

```javascript
const pronunciation = await getPronunciation('beautiful'); // "B Y UW1 T AH0 F AH0 L"
```

### Advanced Text Analysis Functions

#### `analyzeText(text: string, options?: TextAnalysisOptions): Promise<TextSyllableResult>`

Comprehensive text analysis with syllable counting, hyphenation, and detailed breakdown.

```javascript
const result = await analyzeText('Hello beautiful world', {
  maxWords: 1000,
  includeBreakdown: true,
  includeHyphenation: true,
  breakdownSeparator: '-'
});
```

**Options:**
- `maxWords?: number` - Maximum words to process (default: 5000)
- `maxCharacters?: number` - Maximum characters to process (default: 50000)
- `maxLines?: number` - Maximum lines to process (default: 100)
- `includeBreakdown?: boolean` - Include syllable breakdown (default: true)
- `includeHyphenation?: boolean` - Include hyphenation (default: true)
- `breakdownSeparator?: string` - Separator for breakdown (default: '-')
- `customWordProcessor?: (word: string) => Promise<number>` - Custom word processor

#### `quickCountTextSyllables(text: string, options?: { maxWords?: number; maxCharacters?: number }): Promise<{ totalSyllables: number; wordCount: number; syllablesPerWord: number }>`

Fast syllable counting for text without detailed breakdown.

```javascript
const result = await quickCountTextSyllables('Hello world');
// { totalSyllables: 3, wordCount: 2, syllablesPerWord: 1.5 }
```

#### `getWordBreakdown(word: string): Promise<{ word: string; syllables: number; hyphenated: string; pronunciation?: string }>`

Get detailed breakdown for a single word.

```javascript
const breakdown = await getWordBreakdown('beautiful');
// { word: 'beautiful', syllables: 3, hyphenated: 'beau-ti-ful', pronunciation: 'B Y UW1 T AH0 F AH0 L' }
```

#### `batchCountWords(words: string[], options?: { maxBatchSize?: number; includeBreakdown?: boolean; customWordProcessor?: (word: string) => Promise<number> }): Promise<Array<{ word: string; syllables: number; hyphenated?: string; pronunciation?: string }>>`

Process multiple words efficiently in batches.

```javascript
const results = await batchCountWords(['hello', 'beautiful', 'world'], {
  maxBatchSize: 100,
  includeBreakdown: true
});
```

#### `validateTextInput(text: string, options?: { maxWords?: number; maxCharacters?: number; maxLines?: number }): { isValid: boolean; errors: string[]; warnings: string[]; stats: { wordCount: number; characterCount: number; lineCount: number } }`

Validate text input before processing.

```javascript
const validation = validateTextInput('Hello world', { maxWords: 10 });
// { isValid: true, errors: [], warnings: [], stats: { wordCount: 2, characterCount: 11, lineCount: 1 } }
```

### Dictionary Utilities

#### `getRandomWords(count: number = 10, options?: WordSearchOptions): WordAnalysis[]`

Get random words from the dictionary.

```javascript
const words = getRandomWords(5, {
  includePronunciation: true,
  includeSyllables: true,
  includeHyphenation: true
});
```

#### `getRandomWordsWithKey(count: number = 10, options?: WordSearchOptions & { uniquenessKey?: string; maxCacheSize?: number }): Promise<WordAnalysis[]>`

Get random words with uniqueness tracking using a key.

```javascript
const words = await getRandomWordsWithKey(10, {
  uniquenessKey: 'my-app',
  maxCacheSize: 100,
  includeAnalysis: true
});
```

#### `advancedSearch(options?: AdvancedSearchOptions): WordAnalysis[]`

Advanced search with multiple criteria.

```javascript
const results = advancedSearch({
  minSyllables: 3,
  maxSyllables: 5,
  minLength: 8,
  maxLength: 12,
  complexity: 'moderate',
  limit: 50,
  includeAnalysis: true
});
```

**Search Options:**
- `minSyllables?: number` - Minimum syllable count
- `maxSyllables?: number` - Maximum syllable count
- `minLength?: number` - Minimum word length
- `maxLength?: number` - Maximum word length
- `minPhonemes?: number` - Minimum phoneme count
- `maxPhonemes?: number` - Maximum phoneme count
- `complexity?: 'simple' | 'moderate' | 'complex'` - Word complexity
- `containsPhonemes?: string[]` - Words containing specific phonemes
- `startsWithPhonemes?: string[]` - Words starting with phonemes
- `endsWithPhonemes?: string[]` - Words ending with phonemes
- `wordPattern?: RegExp` - Regular expression for word matching
- `pronunciationPattern?: RegExp` - Regular expression for pronunciation

#### `findWordsByCriteria(criteria: { syllableCount?: number; minLength?: number; maxLength?: number; complexity?: 'simple' | 'moderate' | 'complex'; containsPhonemes?: string[]; startsWith?: string; endsWith?: string; pattern?: string }, options?: WordSearchOptions): Array<WordAnalysis & { score: number }>`

Find words matching specific criteria with scoring.

```javascript
const results = findWordsByCriteria({
  syllableCount: 3,
  complexity: 'moderate',
  startsWith: 'be'
}, { limit: 20 });
```

#### `searchWords(pattern: string, options?: WordSearchOptions): WordAnalysis[]`

Search words using a pattern.

```javascript
const results = searchWords('beaut*', { limit: 10 });
```

#### `findWordsBySyllableCount(syllableCount: number, options?: WordSearchOptions): WordAnalysis[]`

Find words with specific syllable count.

```javascript
const threeSyllableWords = findWordsBySyllableCount(3, { limit: 50 });
```

#### `findWordsByComplexity(complexity: 'simple' | 'moderate' | 'complex', options?: WordSearchOptions): WordAnalysis[]`

Find words by complexity level.

```javascript
const complexWords = findWordsByComplexity('complex', { limit: 20 });
```

#### `findRhymingWords(targetWord: string, options?: WordSearchOptions): WordAnalysis[]`

Find words that rhyme with the target word.

```javascript
const rhymes = findRhymingWords('cat', { limit: 10 });
```

#### `findSimilarWords(targetWord: string, similarityThreshold: number = 0.7, options?: WordSearchOptions): Array<WordAnalysis & { similarity: number }>`

Find words similar in pronunciation.

```javascript
const similar = findSimilarWords('beautiful', 0.8, { limit: 10 });
```

#### `getWordClusters(clusterType: 'syllable' | 'length' | 'complexity' | 'stress'): Record<string, string[]>`

Get word clusters by different criteria.

```javascript
const syllableClusters = getWordClusters('syllable');
// { '1': ['cat', 'dog', ...], '2': ['hello', 'world', ...], ... }
```

#### `getDictionaryStats(): PhonemeStats`

Get comprehensive dictionary statistics.

```javascript
const stats = getDictionaryStats();
// {
//   totalWords: 135000,
//   averagePhonemes: 6.2,
//   averageSyllables: 2.1,
//   mostCommonPhonemes: [...],
//   stressPatterns: [...],
//   syllableDistribution: {...},
//   lengthDistribution: {...},
//   complexityDistribution: {...}
// }
```

#### `getComprehensiveStats(): PhonemeStats`

Get detailed phoneme statistics.

```javascript
const stats = getComprehensiveStats();
```

#### `exportDictionaryData(format: 'json' | 'csv' | 'tsv', options?: WordSearchOptions): string`

Export dictionary data in various formats.

```javascript
const csvData = exportDictionaryData('csv', { limit: 1000 });
const jsonData = exportDictionaryData('json', { includeAnalysis: true });
```

### Analytics Functions

#### `calculateStatistics(data: number[]): StatisticalSummary`

Calculate statistical summary for a dataset.

```javascript
const stats = calculateStatistics([1, 2, 3, 4, 5]);
// {
//   mean: 3,
//   median: 3,
//   mode: 1,
//   standardDeviation: 1.58,
//   variance: 2.5,
//   min: 1,
//   max: 5,
//   range: 4,
//   quartiles: [2, 3, 4],
//   percentiles: { 10: 1, 25: 2, 50: 3, 75: 4, 90: 5 }
// }
```

#### `calculateCorrelation(x: number[], y: number[]): CorrelationAnalysis`

Calculate correlation between two datasets.

```javascript
const correlation = calculateCorrelation([1, 2, 3], [2, 4, 6]);
// {
//   correlation: 1,
//   strength: 'strong',
//   significance: true,
//   sampleSize: 3
// }
```

#### `analyzePhonemePatterns(options?: AnalyticsOptions): PhonemeAnalysis[]`

Analyze phoneme distribution and patterns.

```javascript
const patterns = analyzePhonemePatterns({
  detailed: true,
  sampleSize: 1000
});
```

#### `analyzeWordPatterns(patternType: 'prefix' | 'suffix' | 'phoneme' | 'stress', options?: AnalyticsOptions): WordPatternAnalysis[]`

Analyze word patterns and structures.

```javascript
const prefixes = analyzeWordPatterns('prefix', { detailed: true });
const suffixes = analyzeWordPatterns('suffix', { sampleSize: 500 });
```

#### `performComprehensiveAnalysis(options?: AnalyticsOptions): { wordLengthStats: StatisticalSummary; syllableStats: StatisticalSummary; phonemeStats: StatisticalSummary; correlations: { lengthVsSyllables: CorrelationAnalysis; lengthVsPhonemes: CorrelationAnalysis; syllablesVsPhonemes: CorrelationAnalysis }; topPhonemes: PhonemeAnalysis[]; commonPatterns: WordPatternAnalysis[] }`

Perform comprehensive dictionary analysis.

```javascript
const analysis = performComprehensiveAnalysis({
  detailed: true,
  sampleSize: 5000
});
```

#### `findOutliers(metric: 'length' | 'syllables' | 'phonemes', threshold: number = 2, options?: AnalyticsOptions): WordAnalysis[]`

Find outlier words based on statistical analysis.

```javascript
const outliers = findOutliers('syllables', 2.5, { sampleSize: 1000 });
```

#### `generateWordClusters(similarityMetric: 'phoneme' | 'length' | 'syllable' | 'stress', similarityThreshold: number = 0.8, options?: AnalyticsOptions): Array<{ centroid: string; members: string[]; size: number; averageSimilarity: number }>`

Generate word clusters based on similarity.

```javascript
const clusters = generateWordClusters('phoneme', 0.7, {
  sampleSize: 1000
});
```

### Cache Management Functions

#### `clearPhonemeAnalysisCache(): void`

Clear the phoneme analysis cache.

```javascript
clearPhonemeAnalysisCache();
```

#### `getPhonemeAnalysisCacheStats(): { size: number; hitRate: number }`

Get phoneme analysis cache statistics.

```javascript
const stats = getPhonemeAnalysisCacheStats();
// { size: 5000, hitRate: 0 }
```

#### `hasWordBeenUsed(word: string, uniquenessKey: string): boolean`

Check if a word has been used for a specific key.

```javascript
const used = hasWordBeenUsed('beautiful', 'my-app'); // true/false
```

#### `getWordCacheStats(uniquenessKey: string): { usedWordsCount: number; maxCacheSize: number } | null`

Get cache statistics for a specific key.

```javascript
const stats = getWordCacheStats('my-app');
// { usedWordsCount: 50, maxCacheSize: 100 }
```

#### `clearWordCache(uniquenessKey: string): void`

Clear cache for a specific key.

```javascript
clearWordCache('my-app');
```

#### `clearAllWordCaches(): void`

Clear all word caches.

```javascript
clearAllWordCaches();
```

#### `getWordCacheKeys(): string[]`

Get all active cache keys.

```javascript
const keys = getWordCacheKeys(); // ['my-app', 'other-app']
```

#### `getWordCacheSize(uniquenessKey: string): number`

Get cache size for a specific key.

```javascript
const size = getWordCacheSize('my-app'); // 50
```

#### `addWordsToCache(words: string[], uniquenessKey: string, maxCacheSize: number = 100): void`

Add words to cache for a specific key.

```javascript
addWordsToCache(['hello', 'world'], 'my-app', 100);
```

#### `stopCacheCleanup(): void`

Stop the cache cleanup interval (useful for testing).

```javascript
stopCacheCleanup();
```

### Enhanced Syllable Functions

#### `getSyllableInfo(word: string, options?: SyllableCountOptions & HyphenationOptions): Promise<SyllableInfo>`

Get detailed syllable information for a word.

```javascript
const info = await getSyllableInfo('beautiful', { includeBoundaries: true });
// {
//   word: 'beautiful',
//   syllables: 3,
//   hyphenated: 'beau-ti-ful',
//   source: 'cmu',
//   pronunciation: 'B Y UW1 T AH0 F AH0 L',
//   syllableBoundaries: [3, 6]
// }
```

#### `getTextSyllableInfo(text: string, options?: SyllableCountOptions & HyphenationOptions): Promise<SyllableInfo[]>`

Get syllable information for all words in text.

```javascript
const wordInfos = await getTextSyllableInfo('hello beautiful world');
// Returns array of SyllableInfo objects
```

#### `getTextSummary(text: string, options?: SyllableCountOptions & HyphenationOptions): Promise<TextSummary>`

Get comprehensive text analysis with statistics.

```javascript
const summary = await getTextSummary('hello beautiful world');
// {
//   totalSyllables: 6,
//   totalWords: 3,
//   cmuWords: 3,
//   fallbackWords: 0,
//   averageSyllablesPerWord: 2.0,
//   wordDetails: [...]
// }
```

### Hyphenation Functions

#### `hyphenateWord(word: string, options?: HyphenationOptions): Promise<string>`

Hyphenate a word using US/UK patterns.

```javascript
const hyphenated = await hyphenateWord('beautiful', { dialect: 'us' }); // "beau-ti-ful"
```

#### `hyphenateWordWithInfo(word: string, options?: HyphenationOptions): Promise<HyphenationInfo>`

Hyphenate a word with syllable information.

```javascript
const info = await hyphenateWordWithInfo('beautiful');
// {
//   word: 'beautiful',
//   hyphenated: 'beau-ti-ful',
//   syllables: 3,
//   source: 'cmu',
//   boundaries: [3, 6]
// }
```

#### `smartHyphenation(word: string, options?: SmartHyphenationOptions): SmartHyphenationResult`

Smart hyphenation that combines CMU data with fallback strategies.

```javascript
const result = smartHyphenation('international');
// {
//   hyphenated: 'in-ter-na-ti-onal',
//   boundaries: [2, 5, 7, 9],
//   pronunciation: 'IH2 N T ER0 N AE1 SH AH0 N AH0 L',
//   source: 'cmu'
// }
```

#### `enhancedCMUHyphenation(word: string): CMUHyphenationResult | null`

CMU-based hyphenation using pronunciation data.

```javascript
const result = enhancedCMUHyphenation('computer');
// {
//   hyphenated: 'com-put-er',
//   boundaries: [3, 6],
//   pronunciation: 'K AH0 M P Y UW1 T ER0'
// }
```

### Utility Functions

#### `lookupWord(word: string): Promise<string | null>`

Look up a word's pronunciation in the CMU Dictionary.

```javascript
const pronunciation = await lookupWord('hello'); // "HH AH0 L OW1"
```

#### `getPronunciation(word: string): Promise<string | null>`

Get CMU pronunciation for a word.

```javascript
const pronunciation = await getPronunciation('hello'); // "HH AH0 L OW1"
```

#### `isInDictionary(word: string): Promise<boolean>`

Check if a word is in the CMU dictionary.

```javascript
const inDict = await isInDictionary('hello'); // true
```

#### `clearCache(): void`

Clear the syllable counter cache.

```javascript
clearCache();
```

#### `getCacheStats(): { size: number; maxSize: number }`

Get cache statistics.

```javascript
const stats = getCacheStats(); // { size: 5, maxSize: 1000 }
```

### Classes

#### `CMUSyllableCounter`

Main syllable counter class with advanced features.

```javascript
import { CMUSyllableCounter } from 'cmu-syllable-counter';

const counter = new CMUSyllableCounter({
  enableCache: true,
  maxCacheSize: 2000
});
```

**Methods:**
- `count(word: string, options?: SyllableCountOptions): Promise<number>`
- `countText(text: string, options?: SyllableCountOptions): Promise<number>`
- `lookup(word: string): Promise<string | null>`
- `getSyllableCount(word: string): number`
- `clearCache(): void`
- `getCacheStats(): { size: number; maxSize: number }`

## Advanced Usage Examples

### Website Integration

```javascript
import { analyzeText, getRandomWordsWithKey } from 'cmu-syllable-counter';

// Text analysis for website
async function analyzeWebsiteText(text) {
  const result = await analyzeText(text, {
    maxWords: 1000,
    includeBreakdown: true,
    includeHyphenation: true,
    breakdownSeparator: '-'
  });
  
  return {
    totalSyllables: result.totalSyllables,
    averageSyllables: result.syllablesPerWord,
    lines: result.lines,
    breakdown: result.syllableBreakdown,
    wordDetails: result.wordDetails
  };
}

// Random word generation with uniqueness
async function getUniqueWords(count, appKey) {
  return await getRandomWordsWithKey(count, {
    uniquenessKey: appKey,
    includeAnalysis: true,
    maxCacheSize: 1000
  });
}
```

### Data Analysis

```javascript
import { 
  performComprehensiveAnalysis, 
  findOutliers, 
  generateWordClusters 
} from 'cmu-syllable-counter';

// Comprehensive dictionary analysis
async function analyzeDictionary() {
  const analysis = await performComprehensiveAnalysis({
    detailed: true,
    sampleSize: 10000
  });
  
  console.log('Word length statistics:', analysis.wordLengthStats);
  console.log('Syllable statistics:', analysis.syllableStats);
  console.log('Correlations:', analysis.correlations);
  console.log('Top phonemes:', analysis.topPhonemes);
}

// Find unusual words
async function findUnusualWords() {
  const outliers = await findOutliers('syllables', 2.5, {
    sampleSize: 5000
  });
  
  console.log('Words with unusual syllable counts:', outliers);
}

// Generate word clusters
async function clusterWords() {
  const clusters = await generateWordClusters('phoneme', 0.8, {
    sampleSize: 1000
  });
  
  console.log('Word clusters:', clusters);
}
```

### Performance Optimization

```javascript
import { 
  analyzeText, 
  clearPhonemeAnalysisCache, 
  getPhonemeAnalysisCacheStats 
} from 'cmu-syllable-counter';

// Monitor cache performance
function monitorCache() {
  const stats = getPhonemeAnalysisCacheStats();
  console.log(`Cache size: ${stats.size}, Hit rate: ${stats.hitRate}%`);
}

// Clear cache when needed
function clearCache() {
  clearPhonemeAnalysisCache();
  console.log('Cache cleared');
}

// Process large texts efficiently
async function processLargeText(text) {
  const result = await analyzeText(text, {
    maxWords: 5000,
    includeBreakdown: true
  });
  
  console.log(`Processed ${result.wordCount} words in ${result.metadata.processingTime}ms`);
  return result;
}
```

## Performance Benchmarks

The optimized library shows significant performance improvements:

### Text Analysis
```
✅ Processed 690 words in 2ms
📊 Total syllables: 1410
📈 Average syllables per word: 2.04
⚡ Processing time per word: 0.00ms
```

### Random Word Generation
```
✅ First batch (50 words): 10ms
✅ Second batch (50 words): 6ms
📈 Cache performance improvement: 1.7x faster
```

### Advanced Search
```
✅ Found 100 words in 34ms
📊 Average search time per result: 0.34ms
```

### Phoneme Analysis
```
✅ Analyzed 47 phoneme patterns in 39ms
📊 Top phoneme: AH (1006 occurrences)
```

## Types and Interfaces

### Core Types

```typescript
interface SyllableCountOptions {
  useFallback?: boolean;
  fallbackCounter?: (word: string) => number;
  enableCache?: boolean;
  maxCacheSize?: number;
}

interface HyphenationOptions {
  dialect?: 'us' | 'uk';
  includeBoundaries?: boolean;
  customPatterns?: Record<string, string>;
}

interface SyllableInfo {
  word: string;
  syllables: number;
  hyphenated: string;
  source: 'cmu' | 'fallback';
  pronunciation?: string;
  syllableBoundaries?: number[];
}
```

### Advanced Types

```typescript
interface TextAnalysisOptions {
  maxWords?: number;
  maxCharacters?: number;
  maxLines?: number;
  includeBreakdown?: boolean;
  includeHyphenation?: boolean;
  breakdownSeparator?: string;
  customWordProcessor?: (word: string) => Promise<number>;
}

interface TextSyllableResult {
  totalSyllables: number;
  syllablesPerWord: number;
  lines: number;
  wordCount: number;
  characterCount: number;
  syllableBreakdown: string;
  wordDetails: Array<{
    word: string;
    syllables: number;
    hyphenated?: string;
    pronunciation?: string;
    display: string;
  }>;
  metadata: {
    processingTime: number;
    wordsProcessed: number;
    wordsSkipped: number;
    limitsApplied: boolean;
  };
}

interface WordAnalysis {
  word: string;
  pronunciation?: string;
  syllables?: number;
  hyphenated?: string;
  phonemeCount?: number;
  vowelCount?: number;
  consonantCount?: number;
  stressPattern?: string;
  complexity?: 'simple' | 'moderate' | 'complex';
  length?: number;
  uniquePhonemes?: string[];
  phonemeDiversity?: number;
}

interface AdvancedSearchOptions extends WordSearchOptions {
  minSyllables?: number;
  maxSyllables?: number;
  minLength?: number;
  maxLength?: number;
  minPhonemes?: number;
  maxPhonemes?: number;
  complexity?: 'simple' | 'moderate' | 'complex';
  containsPhonemes?: string[];
  startsWithPhonemes?: string[];
  endsWithPhonemes?: string[];
  wordPattern?: RegExp;
  pronunciationPattern?: RegExp;
}

interface AnalyticsOptions {
  detailed?: boolean;
  sampleSize?: number;
  confidenceLevel?: number;
}

interface StatisticalSummary {
  mean: number;
  median: number;
  mode: number;
  standardDeviation: number;
  variance: number;
  min: number;
  max: number;
  range: number;
  quartiles: [number, number, number];
  percentiles: Record<number, number>;
}

interface CorrelationAnalysis {
  correlation: number;
  strength: 'strong' | 'moderate' | 'weak' | 'none';
  significance: boolean;
  sampleSize: number;
}
```

## Browser Support

This package works in all modern browsers and Node.js environments:

- Node.js 14+
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

- [CMU Dictionary](https://github.com/cmusphinx/cmudict) - The pronunciation dictionary
- [syllable-count-english](https://github.com/fresswolf/syllable-count-english) - Inspiration for the original implementation
