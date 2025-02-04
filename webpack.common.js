const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
const path = require('path')

module.exports = {
  entry: {
    extension: './src/extension.js',
    popup: './src/popup.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.scss$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      },
      {
        test: /\.html$/i,
        loader: 'html-loader'
      },
      {
        resourceQuery: /raw/,
        type: 'asset/source'
      }
    ]
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'src/images', to: 'images' },
        { from: 'manifest.json', to: 'manifest.json' }
      ]
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    }),
    new HtmlWebpackPlugin({
      hash: true,
      scriptLoading: 'blocking',
      template: './src/popup.html',
      filename: './popup.html',
      chunks: ['popup']
    })
  ],
  optimization: {
    minimizer: [new CssMinimizerPlugin()]
  }
}
