
const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  entry: './src/minimal.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'minimal.bundle.js',
    clean: true
  },
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      reportFilename: 'minimal-bundle-report.html'
    })
  ],
  optimization: {
    usedExports: true,
    sideEffects: false
  }
};
