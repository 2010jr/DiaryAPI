const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const paths = {
	SRC: path.resolve(__dirname, 'src'),
	JS: path.resolve(__dirname, 'src/js/'),
	PUBLIC: path.resolve(__dirname,'public'),
};

module.exports = {
	entry: path.join(paths.JS, 'index.js'),
	output: {
		path: paths.PUBLIC,
		filename: 'app.bundle.js',
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: path.join(paths.PUBLIC, 'index.html'),
		}),
	],
	module: {
		rules: [
		    {
		    	test: /\.(js|jsx)$/,
		    	exclude: /node_modules/,
		    	use: [
		    		'babel-loader',
		    	],
		    },
		],
	},
	resolve: {
		extensions: ['.js','.jsx'],
	},
	devServer: { 
		contentBase: [paths.PUBLIC,paths.SRC],
		port: 6001,
	},
};
