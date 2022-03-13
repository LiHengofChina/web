module.exports = {
		
		
		
		
		
		target: "externals",
		
		
		
		
		
		
		cdn: {
			css: [],
			js: [

			     ]
		},
		
		
		
		
		
		externals:{
			
		
		
		
		
		},

		cacheGroups: {
			elementUI:{
				name: "chunk-elementUI",
				priority: 20,
				test: /[\\/]node_modules[\\/]_?element-ui(.*)/,
				maxSize:240000
			}
		}
		
};
