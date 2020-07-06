const path = require("path");
const { UnusedFilesWebpackPlugin } = require("unused-files-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
    ],
  },
  resolve: {
    extensions: ["*", ".js"],
    alias: {
      "@utils": path.resolve(__dirname, "src/utils/"),
      "@options": path.resolve(__dirname, "src/options/"),
      "@enums": path.resolve(__dirname, "src/enums/"),
    },
  },
  output: {
    path: __dirname + "/dist",
    publicPath: "/",
    filename: "index.js",
    library: "fast-particles-js",
    libraryTarget: "umd",
  },
  devServer: {
    contentBase: "./dist",
  },
  plugins: [new UnusedFilesWebpackPlugin({ patterns: ["src/**/*.js"] })],
};
