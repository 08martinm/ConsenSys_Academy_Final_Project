/* eslint-disable import/no-extraneous-dependencies */
const dotenv = require("dotenv");
// Configure environment variables
dotenv.config();
const config = require("config");
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// Plugins below analyze webpack with script "yarn analyze-webpack"
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const constant = require("lodash/constant");

module.exports = {
  name: "client",
  mode: "production",
  target: "web",
  devtool: "source-map",
  entry: path.resolve(__dirname, "../../src/index.js"),
  output: {
    filename: "[name].[chunkhash].js",
    chunkFilename: "[name].[chunkhash].js",
    path: path.resolve(__dirname, "../../public/dist"),
    publicPath: "/dist/",
  },
  module: {
    rules: [{ test: /\.js$/, exclude: /node_modules/, use: "babel-loader" }],
  },
  resolve: {
    extensions: [".js"],
  },
  stats: config.get("WEBPACK_ANALYZER") === true ? "none" : "normal",
  plugins: [
    new HtmlWebpackPlugin({ template: "src/index.html" }),
    new webpack.HashedModuleIdsPlugin(),
  ].concat(
    config.get("WEBPACK_ANALYZER") === true
      ? [
          new BundleAnalyzerPlugin({
            analyzerPort: config.get("ports.bundleAnalyzer"),
            openAnalyzer: true,
          }),
        ]
      : constant,
  ),
  optimization: {
    runtimeChunk: "single",
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
      },
    },
  },
};
