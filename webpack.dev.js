const common = require('./webpack.common.js');

const path = require('path');
const { merge } = require('webpack-merge');
const WebpackUsersript = require('webpack-userscript');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  output: {
    filename: 'ArcaRefresher.debug.user.js',
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    devMiddleware: {
      writeToDisk: true,
    },
    client: false,
    hot: false,
  },
  plugins: [
    new WebpackUsersript({
      headers: path.join(__dirname, './src/meta.json'),
      metajs: false,
      proxyScript: {
        filename: 'ArcaRefresher.proxy.user.js',
      },
    }),
  ],
});
