const path = require("path");
const defaultSettings = require("../src/settings.js");

const externals = require("./externals.js");
const WebpackBar = require("webpackbar");

function resolve(dir) {
	return path.join(__dirname,dir);
}

const outputDir = "dist";

const name = defaultSettings.title || "vue Element Admin";


console.log("_____________2_________" );
console.log(  process.env.NODE_ENV === "development");
console.log( name); //名字

console.log( process.env.VUE_APP_USE_TYPE !== "MicroApp" );

console.log("_____________2_________" );

const webpackConfig = {
		
		
		 		
		
		
		
		
		
		outputDir: outputDir,   	 //输出文件目录， 当运行 vue-cli-service build 时生成的生产环境构建文件的目录。
		assetsDir: "static", 		 //放置生成的静态资源,
		lintOnSave: false,			 //是否在保存的时候使用 `eslint-loader` 进行检查
		transpileDependencies:false, //默认情况下 babel-loader 会忽略所有 node_modules 中的文件。如果你想要通过 Babel 显式转译一个依赖，可以在这个选项中列出来。
		
		
		
		devServer: {
			headers: process.env.VUE_APP_USE_TYPE !== "MicroApp" ? {} : { "Access-Control-Allow-Origin": "*" }
		},
		
		
		
		configureWebpack: {
			
			
			
			name: name,
			
			resolve: { //Resolve 配置 Webpack 如何寻找模块所对应的文件。
				alias: {
					"@": resolve("../src")
				},
				
				modules:[
				    
				]
			},
			
			
			
			
			
			
			externals: externals.target === "externals" ? externals.externals : {},
					
			
			module:{
				rules:[
				       {
				    	   test: /(\.jsx|\.js)$/,
				    	   use: {
				    		   loader: "babel-loader"
				    	   },
				    	   exclude: /node_modules/
				       }

				       
				       
				       ]
			},		
					
			plugins: [
			          
			          
			          
			          
			          new WebpackBar()
			],
			
			
			
			resolve:{ // 配置 Webpack 如何寻找模块所对应的文件。
				
				
				fallback:{//退路
					path: require.resolve("path-browserify")
				}
				
				
			},
					
					
					
					
					
			//配置 output 选项可以控制 webpack 如何向硬盘写入编译文件		
			output:
				process.env.VUE_APP_USE_TYPE !== "MicroApp" 
						?
						{} :
						{
							library: `${name}-[name]`,					// 输出一个库，为你的入口做导出。
							libraryTarget: "umd",						// 配置如何暴露 library。
							chunkLoadingGlobal: `webpackJsonp_${name}`	// webpack 用于加载 chunk 的全局变量。
						}
					
		
		
		},
		chainWebpack(config){
			
			
			
			
			
			
			
						
			config.plugin("html").tap((args) => {
					args[0].cdn = externals.target === "externals"
							?
					externals.cdn
							:
					"";
				return args;
			});
			
			config.plugins.delete("preload");

			config.plugins.delete("prefetch");
			
			
			
			
			config.module.rule("svg").exclude.add(resolve("../src/icons")).end();
			
			config.module
				.rule("icons")
				.test(/\.svg$/)
				.include.add(resolve("../src/icons"))
				.end()
				.use("svg-sprite-loader")
				.loader("svg-sprite-loader")
				.options({
					symbolId: "icon-[name]"
				})
				.end();
		}
};
module.exports = webpackConfig;









