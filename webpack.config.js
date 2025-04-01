const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/main.js',

  output: {
    filename: 'bundle.[contenthash].js',
    path: path.resolve(__dirname, 'build'),
    clean: true,
  },

  devtool: 'source-map',

  plugins: [
    new HtmlWebpackPlugin({
      template: 'public/index.html',
    }),
    new CopyWebpackPlugin({
      patterns: [
        { 
          from: 'public', 
          to: '', 
          globOptions: {
            ignore: ['**/index.html'], 
          },
        },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          },
        },
      },
      {
        test: /\.css$/i,  // обрабатывает файлы .css
        use: ['style-loader', 'css-loader'],  // загрузчики справа налево
      },
    ],
  },
};