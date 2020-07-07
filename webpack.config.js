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
    library: "slim-particles-js",
    libraryTarget: "umd",
    globalObject: `(() => {
      if (typeof self !== 'undefined') {
          return self;
      } else if (typeof window !== 'undefined') {
          return window;
      } else if (typeof global !== 'undefined') {
          return global;
      } else {
          return Function('return this')();
      }
  })()`,
  },
  devServer: {
    contentBase: "./dist",
  },
  externals: {
    react: "react",
  },
  plugins: [new UnusedFilesWebpackPlugin({ patterns: ["src/**/*.js"] })],
};
