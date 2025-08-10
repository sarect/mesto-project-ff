
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production';
  return {
    entry: path.resolve(__dirname, 'src', 'index.js'),
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'index.[contenthash].js',
      assetModuleFilename: 'assets/[hash][ext][query]',
      clean: true,
    },
    devtool: isProd ? false : 'source-map',
    devServer: {
      static: path.resolve(__dirname, 'dist'),
      port: 8080,
      open: true,
      hot: true,
    },
    module: {
      rules: [
        {
          test: /\.html$/i,
          loader: 'html-loader',
        },
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
        },
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
            },
          },
        },
        {
          test: /\.(png|jpe?g|gif|svg|webp)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.(woff2?|ttf|eot)$/i,
          type: 'asset/resource',
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'src', 'index.html'),
      }),
      new MiniCssExtractPlugin({
        filename: 'index.[contenthash].css',
      }),
    ],
    resolve: {
      extensions: ['.js'],
    },
  };
};
