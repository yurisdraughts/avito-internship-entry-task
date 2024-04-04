const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = function (env, arg) {
  return {
    entry: "./src/main.jsx",
    devServer: {
      static: {
        directory: path.join(__dirname, "dist"),
      },
      compress: true,
      hot: true,
      port: 9000,
    },
    mode: env.production ? "production" : "development",
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/i,
          exclude: /node_modules/,
          use: { loader: "babel-loader" },
        },
        {
          test: /\.scss$/i,
          use: [
            "style-loader",
            {
              loader: "css-loader",
              options: { modules: true },
            },
            "sass-loader",
          ],
        },
      ],
    },
    output: {
      filename: "bundle.js",
      path: path.resolve(__dirname, "dist"),
    },
    plugins: [new HtmlWebpackPlugin({ template: "./src/index.html" })],
    resolve: {
      extensions: [".js", ".jsx"],
    },
  };
};
