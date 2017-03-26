const webpack = require('webpack');
const path = require('path');
const ROOT_PATH = path.resolve(__dirname);
const _BUILD = path.resolve(ROOT_PATH,'build');
const SRC = path.resolve(ROOT_PATH,'src');
const COMPONENTS = path.resolve(SRC,'components')
//const ExtractTextPlugin = require('extract-text-webpack-plugin');
module.exports = {
    entry: {
    	main: path.resolve(COMPONENTS,'main.js')
//  	vendors: ['react','react-dom']
    },
    output: {
        path: _BUILD, 
        publicPath: '/build/',
        filename: '[name].bundle.js'    
    },
    module: {
		loaders: [
			{
				test: /\.html/,
				exclude: /node_modules/,
				loader: 'html-loader' 
			},
			{
				test:/\.less$/,
				exclude:/node_modules/,
				loader: 'style-loader!css-loader!less-loader'
//				loader:ExtractTextPlugin.extract({fallback: 'style-loader',use:['css-loader','less-loader']})
			},
			{
				test:/\.js$/,
				exclude:/node_modules/,
				loader:'babel-loader'
			},
			{
				test:/\.(png|jpg|woff|ttf|eot|svg)$/,
				exclude:/node_modules/,
				loader:'url-loader?limit=8192&name=images/[hash:8].[name].[ext]'
			},
			{
				test:/\.json$/,
				exclude:/node_modules/,
				loader:'json-loader'
			}
		]
    },
    devServer: {
    	historyApiFallback: true,//不跳转
	    inline: true//实时刷新
	},
	plugins: [ 
		new webpack.HotModuleReplacementPlugin()
//		new webpack.optimize.CommonsChunkPlugin({
//			name: 'reacts',
//			chunks: ['vendors']
//		}),
//		new ExtractTextPlugin('./stylesheets/[name].css')
	]
//  resolve:{
//  	extensions:['','js','json']
//  }
}