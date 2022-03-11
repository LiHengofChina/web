

const WebpackBar = require("webpackbar");

const webpackConfig = {

//module.exports = {

  devtool: 'source-map',  
  devtool: 'eval',  


  
  entry:  __dirname + "/app/main.js",//已多次提及的唯一入口文件
  
  output: {
    path: __dirname + "/public",//打包后的文件存放的地方
    filename: "bundle-[hash].js"//打包后输出文件的文件名
  },

	devServer: {
		contentBase: "./public",//本地服务器所加载的页面所在的目录
		historyApiFallback: true,//不跳转
		inline: true//实时刷新
	}
  	,
  	module:{
  		rules: [
  		        //排除 node_modules 目录
				{
					test: /(\.jsx|\.js)$/,
					use: {
						loader: "babel-loader"
					},
					exclude: /node_modules/
				}
  		
  		
  		]
  	},
  	
  	plugins:[
  	         //让打包时出现进度条
  	         new WebpackBar()
	]
  	
  
  	  
}


// 分析打包速度 使用
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin()

module.exports = smp.wrap(webpackConfig)

