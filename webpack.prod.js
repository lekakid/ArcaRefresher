const common = require('./webpack.common.js');

const { merge } = require('webpack-merge');
const { UserscriptPlugin } = require('webpack-userscript');

const headers = require('./script-meta.js');

module.exports = merge(common, {
  mode: 'production',
  output: {
    filename: 'ArcaRefresher.user.js',
  },
  plugins: [
    new UserscriptPlugin({
      headers,
    }),
  ],
});
