
const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  entry: './src/analytics.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'analytics.bundle.js',
    clean: true
  },
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      reportFilename: 'analytics-bundle-report.html'
    })
  ],
  optimization: {
    usedExports: true,
    sideEffects: false
  }
};
