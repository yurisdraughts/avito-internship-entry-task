const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/main.tsx",
  devServer: {
    historyApiFallback: true,
    compress: true,
    hot: true,
    port: 7070,
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        use: ["babel-loader", "ts-loader"],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|ico)$/i,
        // type: "asset/resource",
        loader: "file-loader",
        options: {
          name: "[name][hash].[ext]",
          outputPath: "/",
        },
      },
    ],
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      inject: false,
      favicon: "./src/images/favicon.ico",
    }),
    new webpack.EnvironmentPlugin(["TOKEN"]),
  ],
  resolve: {
    extensions: [".tsx", ".ts", "..."],
  },
};
