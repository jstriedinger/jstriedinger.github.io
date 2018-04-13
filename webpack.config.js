const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  context: path.resolve(__dirname, "assets"),
  // webpack folder's entry js - excluded from jekll's build process.
  entry: {
     home: '../webpack/home.js',
     loader: '../webpack/loader.js',
  },
  output: {
    // we're going to put the generated file in the assets folder so jekyll will grab it.
      path: path.resolve(__dirname, 'assets/js/'),
      filename: './[name].js',
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [
            { loader: 'css-loader', options: { url: false, sourceMap: true } }, 
            { loader: 'postcss-loader', options: { sourceMap: true } },
            { loader: 'sass-loader', options: { sourceMap: true } }
            ]
        })
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
              loader: 'babel-loader',
              options: {
                  presets: ['env']
              }   
          }
        ]
      }
    ]
  },
  plugins: [
    require('autoprefixer'),
    new ExtractTextPlugin("../css/[name].css"),
  ]
};