const path = require('path');

module.exports = {
	entry: {
		bundle: './src/main.ts',
		'golang-wasm-worker': './src/wasm_worker/main.js'
	},
	output: {
		path: path.resolve(__dirname, '../../../static/mandelbrot_renderer'),
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
