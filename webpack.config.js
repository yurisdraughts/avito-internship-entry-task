const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/main.tsx",
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    compress: true,
    hot: true,
    port: 7070,
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        use: ["babel-loader"],
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/i,
        use: [
          "style-loader",
          "css-loader",
          "sass-loader",
        ],
      },
    ],
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new HtmlWebpackPlugin({ template: "./src/index.html" }),
    new webpack.EnvironmentPlugin({ TOKEN: null }),
  ],
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", "..."],
  },
};
