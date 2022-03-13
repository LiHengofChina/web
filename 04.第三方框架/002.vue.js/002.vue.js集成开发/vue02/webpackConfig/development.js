const {merge} = require("webpack-merge");
const webpackBaseConfig = require("./base.js");

const path = require("path");
function resolve(dir) {
	return path.join(__dirname,dir);
}




const port = 9528;

module.exports = merge(webpackBaseConfig,{
	productionSourceMap: false , // 生产环境是否生成 sourceMap 文件
	devServer:{
		host: "localhost",
		port: port,
		open: true,
		client:{
			overlay:{
				warnings: false,
				errors: true
			}
		},
		
		
		
		
		
		
		hot: true,
		compress: true
		,
		proxy: require("./proxy.js")
	},
	configureWebpack: {
		plugins: []
	},
	chainWebpack(config){

		
		
		
		
		config.devtool("eval") //配置 source-map
		
		config.optimization.splitChunks({
			chunks: "all",
			
			cacheGroups:{
				libs: {
					name: "chunk-libs",
					test: /[\\/]node_modules[\\/]/,
					priority:10,
					chunks: "initial"
				},
				
				elementUI:{
					name: "chunk-elementUI",
					priority: 20,
					test: /[\\/]node_modules[\\/]_?element-ui(.*)/
				},
				
				commons: {
					name: "chunk-commons",
					test: resolve("src/components"),
					minChunks: 3,
					priority: 5,
					reuseExistingChunk: true
				}
			}
			
		});
	} 
	
});




