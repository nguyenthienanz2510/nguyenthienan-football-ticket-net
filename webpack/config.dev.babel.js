const express = require('express');
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const htmlFileNames = fs.readdirSync('./src/html/');
const htmlFileNamesComponents = fs.readdirSync('./src/components/');

const getEntries = () => {
  const entries = [
    './src/js/app.js',
    './src/scss/app.scss',
  ];

  htmlFileNames.forEach((filename) => {
    entries.push(`./src/html/${filename}`);
  });

  return entries;
};

const getPlugins = () => {
  const plugins = [
    new webpack.HotModuleReplacementPlugin(),
    new FriendlyErrorsWebpackPlugin({
      clearConsole: true,
    }),
  ];

  htmlFileNames.forEach((filename) => {
    const splitted = filename.split('.');
    if (splitted[1] === 'html') {
      plugins.push(
        new HtmlWebpackPlugin({
          template: `./src/html/${filename}`,
          filename: `./${filename}`,
        }),
      );
    }
  });

  const componentFileNames = fs.readdirSync('./src/components/');
  componentFileNames.forEach((filename) => {
    const splitted = filename.split('.');
    if (splitted[1] === 'html' && splitted[0][0] !== '_') {
      plugins.push(
        new HtmlWebpackPlugin({
          template: `./src/components/${filename}`,
          filename: `./${filename}`,
        }),
      );
    }
  });

  return plugins;
};

module.exports = {
  entry: getEntries(),
  output: {
    filename: 'bundle.js',
  },
  devServer: {
    contentBase: './src/html',
    watchContentBase: true,
    hot: true,
    open: true,
    inline: true,
    quiet: true,
    historyApiFallback: true,
    before(app) {
      app.use('/assets', express.static('./src/assets'));
      app.use("/images", express.static("./src/assets/images"));
      app.use("/css", express.static("./src/assets/css"));
      app.use("/js", express.static("./src/assets/js"));
      app.use("/fonts", express.static("./src/assets/fonts"));
    },
  },
  plugins: getPlugins(),
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.(html)$/,
        loader: path.resolve(__dirname, 'loader/html-loader.js'),
        options: {
          html: htmlFileNamesComponents,
        },
      },
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.(css|scss)$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              url: false,
            },
          }, {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              sourceMap: true,
              plugins: () => [
                require('autoprefixer')({
                  browsers: ['ie >= 8', 'last 4 version'],
                }),
              ],
            },
          }, {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jpg', '.html', '.scss'],
  },
};
