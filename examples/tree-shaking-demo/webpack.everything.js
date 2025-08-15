
const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  entry: './src/everything.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'everything.bundle.js',
    clean: true
  },
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      reportFilename: 'everything-bundle-report.html'
    })
  ],
  optimization: {
    usedExports: true,
    sideEffects: false
  }
};
