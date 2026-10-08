const common = require('./webpack.common.js');

const path = require('path');
const { merge } = require('webpack-merge');
const { SourceMapDevToolPlugin } = require('webpack');
const { UserscriptPlugin } = require('webpack-userscript');

const headers = require('./script-meta.js');

module.exports = merge(common, {
  mode: 'development',
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
    new SourceMapDevToolPlugin({
      filename: '[file].map',
      publicPath: 'http://localhost:8080/',
    }),
    new UserscriptPlugin({
      headers: {
        ...headers,
        name: `${headers.name} - Debug`,
      },
      metajs: false,
      proxyScript: {
        filename: 'ArcaRefresher.proxy.user.js',
        enable: true,
      },
    }),
  ],
});
