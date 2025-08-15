#!/usr/bin/env node

/**
 * Analytics Module Examples
 * 
 * This example demonstrates all analytics functionality
 * with detailed parameter usage and real-world scenarios.
 * 
 * Run with: node examples/analytics-module-examples.js
 */

import {
  // Basic analytics functions
  calculateStatistics,
  calculateCorrelation,
  analyzePhonemePatterns,
  analyzeWordPatterns,
  performComprehensiveAnalysis,
  findOutliers,
  generateWordClusters,
  
  // Types
  AnalyticsOptions,
  StatisticalSummary,
  CorrelationAnalysis,
  WordPatternAnalysis,
  PhonemeAnalysisResult
} from '../dist/index.esm.js';

console.log('📈 Analytics Module Examples\n');

async function demonstrateAnalyticsModule() {
  console.log('=== 1. Basic Statistics ===\n');
  
  // calculateStatistics(data: number[]): StatisticalSummary
  // Calculate basic statistical measures for numerical data
  console.log('1.1. Basic statistical analysis:');
  const datasets = [
    [1, 2, 3, 4, 5],                    // Simple sequence
    [10, 20, 30, 40, 50, 60, 70, 80],  // Larger range
    [1, 1, 2, 2, 3, 3, 4, 4, 5, 5],    // Duplicates
    [100, 200, 300, 400, 500]           // Large numbers
  ];
  
  for (let i = 0; i < datasets.length; i++) {
    const data = datasets[i];
    const stats = calculateStatistics(data);
    
    console.log(`  Dataset ${i + 1}: [${data.join(', ')}]`);
    console.log(`    Count: ${stats.count}`);
    console.log(`    Sum: ${stats.sum}`);
    console.log(`    Mean: ${stats.mean.toFixed(2)}`);
    console.log(`    Median: ${stats.median.toFixed(2)}`);
    console.log(`    Mode: ${stats.mode || 'N/A'}`);
    console.log(`    Min: ${stats.min}`);
    console.log(`    Max: ${stats.max}`);
    console.log(`    Range: ${stats.range}`);
    console.log(`    Variance: ${stats.variance.toFixed(2)}`);
    console.log(`    Standard Deviation: ${stats.standardDeviation.toFixed(2)}`);
    console.log(`    Coefficient of Variation: ${stats.coefficientOfVariation.toFixed(2)}`);
    console.log('');
  }
  
  console.log('=== 2. Correlation Analysis ===\n');
  
  // calculateCorrelation(x: number[], y: number[]): CorrelationAnalysis
  // Calculate correlation between two datasets
  console.log('2.1. Correlation analysis:');
  const correlationDatasets = [
    {
      name: 'Perfect positive correlation',
      x: [1, 2, 3, 4, 5],
      y: [2, 4, 6, 8, 10]
    },
    {
      name: 'Perfect negative correlation',
      x: [1, 2, 3, 4, 5],
      y: [10, 8, 6, 4, 2]
    },
    {
      name: 'No correlation',
      x: [1, 2, 3, 4, 5],
      y: [1, 3, 2, 4, 1]
    },
    {
      name: 'Strong positive correlation',
      x: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      y: [1.1, 2.3, 2.8, 4.1, 4.9, 6.2, 6.8, 8.1, 8.9, 10.2]
    }
  ];
  
  for (const dataset of correlationDatasets) {
    const correlation = calculateCorrelation(dataset.x, dataset.y);
    
    console.log(`  ${dataset.name}:`);
    console.log(`    Pearson correlation: ${correlation.pearson.toFixed(3)}`);
    console.log(`    Spearman correlation: ${correlation.spearman.toFixed(3)}`);
    console.log(`    Strength: ${correlation.strength}`);
    console.log(`    Direction: ${correlation.direction}`);
    console.log(`    Sample size: ${correlation.sampleSize}`);
    console.log(`    P-value: ${correlation.pValue?.toFixed(3) || 'N/A'}`);
    console.log('');
  }
  
  console.log('=== 3. Phoneme Pattern Analysis ===\n');
  
  // analyzePhonemePatterns(options: AnalyticsOptions = {}): PhonemeAnalysisResult[]
  // Analyze phoneme patterns in the dictionary
  console.log('3.1. Phoneme pattern analysis:');
  const phonemeAnalysis = analyzePhonemePatterns({
    limit: 10,
    includeStatistics: true,
    includeFrequency: true
  });
  
  console.log('  Phoneme pattern analysis (top 10):');
  phonemeAnalysis.forEach((analysis, index) => {
    console.log(`    ${index + 1}. "${analysis.word}":`);
    console.log(`       Syllables: ${analysis.syllables}`);
    console.log(`       Vowels: ${analysis.vowels}`);
    console.log(`       Consonants: ${analysis.consonants}`);
    console.log(`       Stress pattern: ${analysis.stressPattern}`);
    console.log(`       Complexity: ${analysis.complexity}`);
    console.log(`       Phoneme diversity: ${analysis.phonemeDiversity.toFixed(3)}`);
  });
  console.log('');
  
  // With specific filters
  console.log('3.2. Filtered phoneme analysis:');
  const filteredPhonemeAnalysis = analyzePhonemePatterns({
    limit: 8,
    minSyllables: 2,
    maxSyllables: 4,
    complexity: 'moderate',
    includeStatistics: true
  });
  
  console.log('  Moderate complexity words (2-4 syllables):');
  filteredPhonemeAnalysis.forEach((analysis, index) => {
    console.log(`    ${index + 1}. "${analysis.word}" - ${analysis.syllables} syllables, ${analysis.complexity} complexity`);
  });
  console.log('');
  
  console.log('=== 4. Word Pattern Analysis ===\n');
  
  // analyzeWordPatterns(patternType: 'prefix' | 'suffix' | 'phoneme' | 'stress', options: AnalyticsOptions = {}): WordPatternAnalysis[]
  // Analyze word patterns by type
  console.log('4.1. Word pattern analysis:');
  const patternTypes = ['prefix', 'suffix', 'phoneme', 'stress'];
  
  for (const patternType of patternTypes) {
    const patterns = analyzeWordPatterns(patternType, {
      limit: 5,
      includeFrequency: true,
      includeExamples: true
    });
    
    console.log(`  ${patternType.charAt(0).toUpperCase() + patternType.slice(1)} patterns:`);
    patterns.forEach((pattern, index) => {
      console.log(`    ${index + 1}. Pattern: "${pattern.pattern}"`);
      console.log(`       Frequency: ${pattern.frequency}`);
      console.log(`       Percentage: ${pattern.percentage.toFixed(1)}%`);
      if (pattern.examples) {
        console.log(`       Examples: ${pattern.examples.join(', ')}`);
      }
    });
    console.log('');
  }
  
  console.log('=== 5. Comprehensive Analysis ===\n');
  
  // performComprehensiveAnalysis(options: AnalyticsOptions = {}): ComprehensiveAnalysisResult
  // Perform comprehensive analysis of the dictionary
  console.log('5.1. Comprehensive dictionary analysis:');
  const comprehensiveAnalysis = performComprehensiveAnalysis({
    includePhonemeAnalysis: true,
    includePatternAnalysis: true,
    includeStatisticalAnalysis: true,
    includeOutlierAnalysis: true,
    limit: 100
  });
  
  console.log('  Comprehensive analysis results:');
  console.log(`    Total words analyzed: ${comprehensiveAnalysis.totalWords}`);
  console.log(`    Average syllables per word: ${comprehensiveAnalysis.averageSyllablesPerWord.toFixed(2)}`);
  console.log(`    Average word length: ${comprehensiveAnalysis.averageWordLength.toFixed(2)}`);
  console.log(`    Complexity distribution: ${JSON.stringify(comprehensiveAnalysis.complexityDistribution)}`);
  console.log(`    Syllable distribution: ${JSON.stringify(comprehensiveAnalysis.syllableDistribution)}`);
  
  if (comprehensiveAnalysis.phonemeAnalysis) {
    console.log(`    Phoneme analysis: ${comprehensiveAnalysis.phonemeAnalysis.length} patterns found`);
  }
  
  if (comprehensiveAnalysis.patternAnalysis) {
    console.log(`    Pattern analysis: ${comprehensiveAnalysis.patternAnalysis.length} patterns found`);
  }
  
  if (comprehensiveAnalysis.statisticalAnalysis) {
    const stats = comprehensiveAnalysis.statisticalAnalysis;
    console.log(`    Statistical analysis:`);
    console.log(`      Syllable count stats: mean=${stats.syllableStats.mean.toFixed(2)}, std=${stats.syllableStats.standardDeviation.toFixed(2)}`);
    console.log(`      Word length stats: mean=${stats.lengthStats.mean.toFixed(2)}, std=${stats.lengthStats.standardDeviation.toFixed(2)}`);
  }
  
  if (comprehensiveAnalysis.outlierAnalysis) {
    console.log(`    Outliers found: ${comprehensiveAnalysis.outlierAnalysis.length}`);
  }
  console.log('');
  
  console.log('=== 6. Outlier Detection ===\n');
  
  // findOutliers(metric: 'length' | 'syllables' | 'phonemes', threshold: number = 2, options: AnalyticsOptions = {}): WordAnalysis[]
  // Find outliers in the dictionary based on various metrics
  console.log('6.1. Outlier detection:');
  const outlierMetrics = ['length', 'syllables', 'phonemes'];
  const thresholds = [2, 2.5, 3];
  
  for (const metric of outlierMetrics) {
    for (const threshold of thresholds) {
      const outliers = findOutliers(metric, threshold, { limit: 5 });
      
      console.log(`  ${metric} outliers (threshold: ${threshold}):`);
      outliers.forEach((outlier, index) => {
        console.log(`    ${index + 1}. "${outlier.word}" - ${outlier[metric]} ${metric}`);
      });
      console.log('');
    }
  }
  
  console.log('=== 7. Word Clustering ===\n');
  
  // generateWordClusters(clusterType: 'syllable' | 'length' | 'complexity' | 'stress', options: AnalyticsOptions = {}): WordClusterResult
  // Generate word clusters based on various criteria
  console.log('7.1. Word clustering:');
  const clusterTypes = ['syllable', 'length', 'complexity', 'stress'];
  
  for (const clusterType of clusterTypes) {
    const clusters = generateWordClusters(clusterType, {
      limit: 50,
      includeStatistics: true,
      includeExamples: true
    });
    
    console.log(`  ${clusterType.charAt(0).toUpperCase() + clusterType.slice(1)} clusters:`);
    console.log(`    Total clusters: ${clusters.totalClusters}`);
    console.log(`    Total words: ${clusters.totalWords}`);
    
    Object.entries(clusters.clusters).slice(0, 3).forEach(([key, cluster]) => {
      console.log(`    Cluster "${key}":`);
      console.log(`      Size: ${cluster.size}`);
      console.log(`      Percentage: ${cluster.percentage.toFixed(1)}%`);
      if (cluster.examples) {
        console.log(`      Examples: ${cluster.examples.join(', ')}`);
      }
      if (cluster.statistics) {
        console.log(`      Statistics: mean=${cluster.statistics.mean.toFixed(2)}, std=${cluster.statistics.standardDeviation.toFixed(2)}`);
      }
    });
    console.log('');
  }
  
  console.log('=== 8. Advanced Analytics ===\n');
  
  // Advanced analytics scenarios
  console.log('8.1. Syllable distribution analysis:');
  const syllableAnalysis = analyzePhonemePatterns({
    limit: 100,
    includeStatistics: true
  });
  
  const syllableCounts = syllableAnalysis.map(a => a.syllables);
  const syllableStats = calculateStatistics(syllableCounts);
  
  console.log('  Syllable distribution statistics:');
  console.log(`    Mean syllables: ${syllableStats.mean.toFixed(2)}`);
  console.log(`    Median syllables: ${syllableStats.median.toFixed(2)}`);
  console.log(`    Standard deviation: ${syllableStats.standardDeviation.toFixed(2)}`);
  console.log(`    Range: ${syllableStats.range}`);
  console.log(`    Coefficient of variation: ${syllableStats.coefficientOfVariation.toFixed(2)}`);
  console.log('');
  
  console.log('8.2. Complexity vs. length correlation:');
  const complexityLengthData = syllableAnalysis.map(a => ({
    complexity: a.complexity === 'simple' ? 1 : a.complexity === 'moderate' ? 2 : 3,
    length: a.word.length
  }));
  
  const complexityValues = complexityLengthData.map(d => d.complexity);
  const lengthValues = complexityLengthData.map(d => d.length);
  
  const complexityCorrelation = calculateCorrelation(complexityValues, lengthValues);
  
  console.log('  Complexity vs. length correlation:');
  console.log(`    Pearson correlation: ${complexityCorrelation.pearson.toFixed(3)}`);
  console.log(`    Strength: ${complexityCorrelation.strength}`);
  console.log(`    Direction: ${complexityCorrelation.direction}`);
  console.log('');
  
  console.log('=== 9. Performance Analysis ===\n');
  
  // Performance analysis
  console.log('9.1. Analytics performance:');
  const performanceTests = [
    { name: 'Basic statistics', fn: () => calculateStatistics([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) },
    { name: 'Correlation analysis', fn: () => calculateCorrelation([1, 2, 3, 4, 5], [2, 4, 6, 8, 10]) },
    { name: 'Phoneme analysis (10 words)', fn: () => analyzePhonemePatterns({ limit: 10 }) },
    { name: 'Phoneme analysis (100 words)', fn: () => analyzePhonemePatterns({ limit: 100 }) },
    { name: 'Word patterns', fn: () => analyzeWordPatterns('prefix', { limit: 10 }) },
    { name: 'Comprehensive analysis', fn: () => performComprehensiveAnalysis({ limit: 50 }) },
    { name: 'Outlier detection', fn: () => findOutliers('syllables', 2, { limit: 10 }) },
    { name: 'Word clustering', fn: () => generateWordClusters('syllable', { limit: 50 }) }
  ];
  
  for (const test of performanceTests) {
    const start = performance.now();
    const result = test.fn();
    const end = performance.now();
    
    console.log(`  ${test.name}: ${(end - start).toFixed(2)}ms`);
  }
  console.log('');
  
  console.log('=== 10. Error Handling ===\n');
  
  // Error handling examples
  console.log('10.1. Error handling:');
  const errorCases = [
    { name: 'Empty array', data: [] },
    { name: 'Single value', data: [5] },
    { name: 'Non-numeric values', data: [1, 2, 'three', 4, 5] },
    { name: 'Null values', data: [1, 2, null, 4, 5] },
    { name: 'Undefined values', data: [1, 2, undefined, 4, 5] }
  ];
  
  for (const testCase of errorCases) {
    try {
      const stats = calculateStatistics(testCase.data);
      console.log(`  ${testCase.name}: Success - mean=${stats.mean.toFixed(2)}`);
    } catch (error) {
      console.log(`  ${testCase.name}: Error - ${error.message}`);
    }
  }
  console.log('');
  
  console.log('=== 11. Advanced Usage Patterns ===\n');
  
  // Advanced usage patterns
  console.log('11.1. Multi-metric analysis:');
  const multiMetricAnalysis = syllableAnalysis.map(a => ({
    word: a.word,
    syllables: a.syllables,
    length: a.word.length,
    complexity: a.complexity,
    phonemeDiversity: a.phonemeDiversity
  }));
  
  console.log('  Multi-metric analysis (top 10):');
  multiMetricAnalysis.slice(0, 10).forEach((item, index) => {
    console.log(`    ${index + 1}. "${item.word}":`);
    console.log(`       Syllables: ${item.syllables}, Length: ${item.length}`);
    console.log(`       Complexity: ${item.complexity}, Phoneme diversity: ${item.phonemeDiversity.toFixed(3)}`);
  });
  console.log('');
  
  console.log('11.2. Comparative analysis:');
  const simpleWords = syllableAnalysis.filter(a => a.complexity === 'simple').slice(0, 5);
  const complexWords = syllableAnalysis.filter(a => a.complexity === 'complex').slice(0, 5);
  
  console.log('  Simple vs. complex words comparison:');
  console.log('    Simple words:');
  simpleWords.forEach((word, index) => {
    console.log(`      ${index + 1}. "${word.word}" - ${word.syllables} syllables, ${word.word.length} chars`);
  });
  
  console.log('    Complex words:');
  complexWords.forEach((word, index) => {
    console.log(`      ${index + 1}. "${word.word}" - ${word.syllables} syllables, ${word.word.length} chars`);
  });
  console.log('');
  
  console.log('=== 12. Integration Examples ===\n');
  
  // Integration with other modules
  console.log('12.1. Integration with dictionary utilities:');
  const sampleWords = ['hello', 'beautiful', 'programming', 'algorithm', 'computer'];
  
  // Get word analysis
  const wordAnalyses = sampleWords.map(word => {
    const analysis = syllableAnalysis.find(a => a.word === word);
    return analysis || { word, syllables: 0, complexity: 'unknown' };
  });
  
  console.log('  Word analysis integration:');
  wordAnalyses.forEach((analysis, index) => {
    console.log(`    ${index + 1}. "${analysis.word}":`);
    console.log(`       Syllables: ${analysis.syllables}`);
    console.log(`       Complexity: ${analysis.complexity}`);
    if (analysis.phonemeDiversity !== undefined) {
      console.log(`       Phoneme diversity: ${analysis.phonemeDiversity.toFixed(3)}`);
    }
  });
  console.log('');
  
  console.log('12.2. Statistical insights:');
  const insights = {
    totalWords: syllableAnalysis.length,
    averageSyllables: syllableAnalysis.reduce((sum, a) => sum + a.syllables, 0) / syllableAnalysis.length,
    complexityBreakdown: syllableAnalysis.reduce((acc, a) => {
      acc[a.complexity] = (acc[a.complexity] || 0) + 1;
      return acc;
    }, {}),
    averagePhonemeDiversity: syllableAnalysis.reduce((sum, a) => sum + a.phonemeDiversity, 0) / syllableAnalysis.length
  };
  
  console.log('  Statistical insights:');
  console.log(`    Total words analyzed: ${insights.totalWords}`);
  console.log(`    Average syllables per word: ${insights.averageSyllables.toFixed(2)}`);
  console.log(`    Complexity breakdown: ${JSON.stringify(insights.complexityBreakdown)}`);
  console.log(`    Average phoneme diversity: ${insights.averagePhonemeDiversity.toFixed(3)}`);
  console.log('');
  
  console.log('=== 13. Memory Management ===\n');
  
  // Memory management demonstration
  console.log('13.1. Memory usage monitoring:');
  
  const startMemory = process.memoryUsage();
  
  // Generate some load
  const loadTests = [
    () => analyzePhonemePatterns({ limit: 1000 }),
    () => performComprehensiveAnalysis({ limit: 500 }),
    () => generateWordClusters('syllable', { limit: 1000 }),
    () => findOutliers('syllables', 2, { limit: 1000 })
  ];
  
  for (const test of loadTests) {
    test();
  }
  
  const endMemory = process.memoryUsage();
  
  console.log(`  Memory usage:`);
  console.log(`    Before: ${(startMemory.heapUsed / 1024 / 1024).toFixed(2)}MB`);
  console.log(`    After: ${(endMemory.heapUsed / 1024 / 1024).toFixed(2)}MB`);
  console.log(`    Difference: ${((endMemory.heapUsed - startMemory.heapUsed) / 1024 / 1024).toFixed(2)}MB`);
  console.log('');
  
  console.log('✅ Analytics module demonstration completed!');
  console.log('\n📚 Key takeaways:');
  console.log('  • calculateStatistics() for basic statistical measures');
  console.log('  • calculateCorrelation() for relationship analysis');
  console.log('  • analyzePhonemePatterns() for phoneme analysis');
  console.log('  • analyzeWordPatterns() for pattern recognition');
  console.log('  • performComprehensiveAnalysis() for full dictionary analysis');
  console.log('  • findOutliers() for anomaly detection');
  console.log('  • generateWordClusters() for grouping analysis');
}

// Run the demonstration
demonstrateAnalyticsModule().catch(console.error);
