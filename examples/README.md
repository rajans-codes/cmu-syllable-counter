# CMU Dictionary Examples

This directory contains comprehensive examples demonstrating all functionality of the CMU Dictionary library. Each example file focuses on a specific module and provides detailed parameter explanations and real-world usage scenarios.

## 📁 Example Files

### 🚀 Basic Usage
- **`basic-usage.js`** - Getting started with the library
  - Simple syllable counting
  - Dictionary lookup
  - Hyphenation
  - Text analysis
  - Poetry validation
  - Performance comparison

### 🔤 Core Module
- **`core-module-examples.js`** - Core syllable counting functionality
  - Basic and advanced syllable counting
  - Dictionary lookup functions
  - Enhanced syllable information
  - Cache management
  - Class-based usage
  - Poetry analysis
  - Performance optimization

### 🔗 Hyphenation Module
- **`hyphenation-module-examples.js`** - Word hyphenation capabilities
  - Basic and enhanced hyphenation
  - CMU Dictionary hyphenation
  - Syllable boundary detection
  - Smart hyphenation strategies
  - Text and poetry hyphenation
  - Performance analysis

### 📊 Text Analysis Module
- **`text-analysis-module-examples.js`** - Text analysis features
  - Comprehensive text analysis
  - Quick syllable counting
  - Word breakdown analysis
  - Batch processing
  - Input validation
  - Poetry and document analysis
  - Performance monitoring

### 📚 Dictionary Utilities Module
- **`dictionary-utilities-module-examples.js`** - Dictionary search and utilities
  - Pattern-based word search
  - Syllable-based filtering
  - Phoneme pattern search
  - Rhyming words
  - Random word generation
  - Advanced search options
  - Data export capabilities

### 📈 Analytics Module
- **`analytics-module-examples.js`** - Statistical analysis features
  - Basic statistical calculations
  - Correlation analysis
  - Phoneme pattern analysis
  - Word pattern analysis
  - Outlier detection
  - Word clustering
  - Comprehensive analysis

### 💾 Cache Management Module
- **`cache-management-module-examples.js`** - Caching functionality
  - Random word generation with cache
  - Cache statistics and monitoring
  - Cache hit/miss analysis
  - Cache clearing and management
  - Performance optimization
  - Memory management
  - Real-world scenarios

### 🔧 Shared Utilities Module
- **`shared-utilities-module-examples.js`** - Utility functions
  - Phoneme analysis
  - Syllable counting from pronunciation
  - Vowel and consonant counting
  - Stress pattern extraction
  - Complexity determination
  - Similarity calculations
  - Cache management

## 🚀 Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- The CMU Dictionary library installed

### Running Examples

1. **Navigate to the examples directory:**
   ```bash
   cd examples
   ```

2. **Run any example file:**
   ```bash
   node basic-usage.js
   node core-module-examples.js
   node hyphenation-module-examples.js
   # ... etc
   ```

3. **Run all examples (if you have a script):**
   ```bash
   npm run examples
   ```

## 📋 Example Structure

Each example file follows a consistent structure:

1. **Import statements** - Import only the functions needed
2. **Basic functionality** - Simple usage examples
3. **Advanced features** - Complex scenarios and options
4. **Performance analysis** - Speed and memory comparisons
5. **Error handling** - Edge cases and error scenarios
6. **Integration examples** - Combining multiple modules
7. **Real-world scenarios** - Practical use cases

## 🎯 Key Features Demonstrated

### Core Functionality
- ✅ Syllable counting (async and sync)
- ✅ Dictionary lookup and pronunciation
- ✅ Word hyphenation
- ✅ Text analysis and statistics

### Advanced Features
- ✅ Pattern-based word search
- ✅ Random word generation
- ✅ Cache management
- ✅ Performance optimization
- ✅ Statistical analysis
- ✅ Phoneme analysis

### Real-World Applications
- ✅ Poetry validation (haiku, sonnets)
- ✅ Text complexity analysis
- ✅ Word similarity calculations
- ✅ Batch processing
- ✅ Memory management

## 📊 Performance Considerations

### Async vs Sync
- **Async functions**: Best accuracy, uses CMU Dictionary + fallback
- **Sync functions**: Faster performance, fallback algorithm only
- **Use case**: Choose based on accuracy vs speed requirements

### Caching
- **Built-in caching**: Improves performance for repeated operations
- **Cache management**: Monitor memory usage in production
- **Cache clearing**: Use when memory becomes a concern

### Memory Management
- **Monitor usage**: All examples include memory tracking
- **Batch processing**: Efficient for large datasets
- **Cache limits**: Prevent memory leaks

## 🔧 Customization

### Modifying Examples
Each example can be customized by:
- Changing input data
- Adjusting parameters
- Adding new test cases
- Modifying performance thresholds

### Adding New Examples
To create new examples:
1. Follow the existing structure
2. Import only needed functions
3. Include comprehensive documentation
4. Add error handling
5. Include performance analysis

## 📚 Learning Path

### Beginner
1. Start with `basic-usage.js`
2. Understand core functions
3. Practice with simple examples

### Intermediate
1. Explore `core-module-examples.js`
2. Learn advanced features
3. Understand caching

### Advanced
1. Study all module examples
2. Understand integration patterns
3. Optimize for performance

## 🐛 Troubleshooting

### Common Issues
- **Import errors**: Ensure library is properly installed
- **Performance issues**: Check cache settings and memory usage
- **Accuracy problems**: Verify input data and function parameters

### Debugging
- All examples include error handling
- Performance metrics are provided
- Memory usage is monitored
- Clear output formatting

## 📈 Best Practices

### Code Organization
- Import only what you need
- Use descriptive variable names
- Include comprehensive comments
- Handle errors gracefully

### Performance
- Use appropriate functions (async vs sync)
- Implement caching for repeated operations
- Monitor memory usage
- Batch process when possible

### Error Handling
- Validate input data
- Handle edge cases
- Provide meaningful error messages
- Graceful degradation

## 🤝 Contributing

When adding new examples:
1. Follow the existing structure
2. Include comprehensive documentation
3. Add performance analysis
4. Test with various inputs
5. Update this README

## 📄 License

These examples are part of the CMU Dictionary library and follow the same license terms.

---

For more information, see the main library documentation and API reference.
