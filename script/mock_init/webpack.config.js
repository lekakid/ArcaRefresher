const path = require('path');
const CleanTerminalPlugin = require('clean-terminal-webpack-plugin');

const root = path.resolve(__dirname, '..');

module.exports = {
  mode: 'development',
  context: root,
  entry: path.resolve(__dirname, 'entry.jsx'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'mock.js',
    publicPath: '/',
  },
  devtool: 'eval-source-map',
  resolve: { extensions: ['.js', '.jsx'] },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
    ],
  },
  devServer: {
    static: { directory: __dirname },
    port: 3001,
    hot: true,
    open: true,
  },
  plugins: [
    new CleanTerminalPlugin({
      beforeCompile: true,
    }),
  ],
};
