const common = require('./webpack.common.js');

const path = require('path');
const { merge } = require('webpack-merge');
const { UserscriptPlugin } = require('webpack-userscript');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = merge(common, {
  mode: 'production',
  output: {
    filename: 'ArcaRefresher.user.js',
  },
  plugins: [
    new UserscriptPlugin({
      headers: path.join(__dirname, './src/meta.json'),
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      generateStatsFile: true,
      statsFilename: 'bundle-report.json',
    }),
  ],
});
