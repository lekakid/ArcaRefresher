const path = require('path');

const CleanTerminalPlugin = require('clean-terminal-webpack-plugin');

module.exports = {
  output: {
    path: path.join(__dirname, 'dist'),
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
          options: {
            cacheDirectory: true,
          },
        },
      },
    ],
  },
  plugins: [
    new CleanTerminalPlugin({
      beforeCompile: true,
    }),
  ],
};
