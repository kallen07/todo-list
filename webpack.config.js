// webpack.config.js
var HTMLWebpackPlugin = require('html-webpack-plugin')
var HTMLWebpackPluginConfig = new HTMLWebpackPlugin ({
  template: __dirname + '/src/client/index.html',
  filename: 'index.html',
  inject: 'body'
});
module.exports = [
  module = {
    name: 'client',
    mode: 'development',
    entry: __dirname + '/src/client/index.js',
    module: {
      rules: [
        {
          test: [/\.jsx?$/, /\.tsx?$/],
          exclude: /node_modules/,
          loader: 'babel-loader'
        },
        {
          test: /\.css$/,
          use: [{ loader: 'style-loader' }, { loader: 'css-loader' }]
        }
      ]
    },
    output: {
      filename: 'transformed.js',
      path: __dirname + '/dist/client'
    },
    plugins: [HTMLWebpackPluginConfig],
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
    }
  },
  module = {
    name: 'server',
    mode: 'development',
    entry: __dirname + '/src/server/server.ts',
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
      path: __dirname + '/dist/server'
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
    }
  },
];
