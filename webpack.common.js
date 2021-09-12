const path = require('path');
const CleanTerminalPlugin = require('clean-terminal-webpack-plugin');
const WebpackUsersript = require('webpack-userscript');

const dev = process.env.NODE_ENV === 'development';

const FILENAME = 'ArcaRefresher';

module.exports = {
  output: {
    path: path.join(__dirname, 'dist'),
    filename: `${FILENAME}.user.js`,
  },
  resolve: {
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    extensions: ['.js', '.jsx', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_module/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  plugins: [
    new CleanTerminalPlugin({
      beforeCompile: true,
    }),
    new WebpackUsersript({
      headers: path.join(__dirname, './src/meta.json'),
      metajs: false,
    }),
  ],
};
