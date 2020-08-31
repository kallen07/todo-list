// webpack.config.js
var HTMLWebpackPlugin = require('html-webpack-plugin')
var HTMLWebpackPluginConfig = new HTMLWebpackPlugin ({
  template: __dirname + '/src/index.html',
  filename: 'index.html',
  inject: 'body'
});
module.exports = [
  module = {
    name: 'client',
    mode: 'development',
    entry: __dirname + '/src/index.js',
    module: {
      rules: [
        {
          test: [/\.jsx?$/, /\.tsx?$/],
          exclude: /node_modules/,
          loader: 'babel-loader'
        }
      ]
    },
    output: {
      filename: 'transformed.js',
      path: __dirname + '/dist'
    },
    plugins: [HTMLWebpackPluginConfig],
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
    }
  },
  module = {
    name: 'server',
    mode: 'development',
    entry: __dirname + '/src/server.ts',
    target: 'node',
    node: {
      __dirname: false,
      __filename: false,
    },
    module: {
      rules: [
        {
          test: [/\.jsx?$/, /\.tsx?$/],
          exclude: /node_modules/,
          loader: 'babel-loader'
        }
      ]
    },
    output: {
      filename: 'server.js',
      path: __dirname + '/dist'
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
    }
  },
];
