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
			
			resolve: {
				alias: {
					"@": resolve("../src")
				}
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
			
			
			
			resolve:{
				fallback:{
					path: require.resolve("path-browserify")
				}
			},
					
					
					
					
					
					
			output:
				process.env.VUE_APP_USE_TYPE !== "MicroApp" 
				?
						{} :
						{
							library: `${name}-[name]`,
							libraryTarget: "umd",
							chunkLoadingGlobal: `webpackJsonp_${name}`
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









