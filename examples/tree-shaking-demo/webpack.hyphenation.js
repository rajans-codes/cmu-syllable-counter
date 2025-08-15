
const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  entry: './src/hyphenation.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'hyphenation.bundle.js',
    clean: true
  },
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      reportFilename: 'hyphenation-bundle-report.html'
    })
  ],
  optimization: {
    usedExports: true,
    sideEffects: false
  }
};
