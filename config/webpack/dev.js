const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  name: "client",
  target: "web",
  mode: "development",
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, use: "babel-loader" },
      { use: ["style-loader", "css-loader"], test: /\.(css|scss)$/ },
      { test: /\.(svg)$/, use: "svg-inline-loader" },
    ],
  },
  devtool: "eval",
  entry: [
    "babel-polyfill",
    path.resolve(__dirname, "../../src/index.js"),
    "webpack-hot-middleware/client",
  ],
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "../../public/dist"),
  },
  plugins: [
    new HtmlWebpackPlugin({ template: "src/index.html", inject: "body" }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
};
