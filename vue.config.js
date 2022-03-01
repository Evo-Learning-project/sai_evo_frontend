const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");

module.exports = {
  configureWebpack: {
    // module: {
    //   rules: [{ test: /\.js$/, use: "babel-loader" }],
    // },
    plugins: [
      new MonacoWebpackPlugin({
        languages: ["typescript"],
      }),
    ],
  },
};
