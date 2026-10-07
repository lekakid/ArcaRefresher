const prod = require('./webpack.prod.js');

const path = require('path');
const { merge } = require('webpack-merge');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { SourceMapDevToolPlugin } = require('webpack');

module.exports = merge(prod, {
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    client: false,
    hot: false,
  },
  plugins: [
    new SourceMapDevToolPlugin({
      filename: '[file].map',
      publicPath: 'http://localhost:8080/',
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      generateStatsFile: true,
      statsFilename: 'bundle-report.json',
    }),
  ],
});
