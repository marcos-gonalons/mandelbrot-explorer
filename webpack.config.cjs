const path = require('path');

module.exports = {
	entry: {
		'golang-wasm-worker': './src/lib/mandelbrot_renderer/src/wasm_worker/main.js'
	},
	output: {
		path: path.resolve(__dirname, 'static/mandelbrot_renderer'),
		filename: '[name].js'
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js']
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: 'ts-loader',
				options: { allowTsInNodeModules: true }
			}
		]
	}
};
