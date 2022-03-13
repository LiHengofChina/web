const {merge} = require("webpack-merge");
const webpackBaseConfig = require("./base.js");

const path = require("path");
function resolve(dir) {
	return path.join(__dirname,dir);
}




const port = 9528;

module.exports = merge(webpackBaseConfig,{
	productionSourceMap: false , 		// 生产环境是否生成 sourceMap 文件
	devServer:{
		host: "localhost",				//指定要使用的 host。
		port: port, 					//指定监听请求的端口号：
		//open: true,					//告诉 dev-server 在服务器已经启动后打开浏览器。设置其为 true 以打开你的默认浏览器。
		open: {
		       app: {
		           name: 'google-chrome',
		         }
			  },
		
		client:{
			overlay:{ 					//当出现编译错误或警告时，在浏览器中显示全屏覆盖。
				warnings: false,
				errors: true
			}
		},
		
		
		
		
		
		
		hot: true,  					//启用 webpack 的 热模块替换 特性：
		compress: true,					//启用 gzip compression：
		
		proxy: require("./proxy.js")	//代理配置
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




