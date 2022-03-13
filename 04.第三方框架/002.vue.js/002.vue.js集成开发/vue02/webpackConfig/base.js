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
		
		
		 		
		
		
		
		
		
		outputDir: outputDir,
		assetsDir: "static",
		lintOnSave: process.env.NODE_ENV === "development",
		transpileDependencies:false,
		
		
		
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









