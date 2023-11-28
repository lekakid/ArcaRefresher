const prod = require('./webpack.prod.js');

const path = require('path');
const { merge } = require('webpack-merge');
const { UserscriptPlugin } = require('webpack-userscript');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = merge(prod, {
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      generateStatsFile: true,
      statsFilename: 'bundle-report.json',
    }),
  ],
});
