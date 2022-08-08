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
		resolve: {
			alias: {
				vue$: "vue/dist/vue.esm-bundler.js",
			},
		},
	},
};
