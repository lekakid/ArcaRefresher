const common = require('./webpack.common.js');

const path = require('path');
const { merge } = require('webpack-merge');
const WebpackUsersript = require('webpack-userscript');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  output: {
    filename: `ArcaRefresher.debug.user.js`,
  },
  plugins: [
    new WebpackUsersript({
      headers: path.join(__dirname, './src/meta.json'),
      metajs: false,
    }),
  ],
});
