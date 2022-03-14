
//=========================搭建过程
//=========================搭建过程

（1）.  环境准备
	npm install npm -g
	npm install vue -g
	npm install vue-router -g
	npm install vue-cli -g
	vue -V
（2）.  初始化项目
	mkdir vue02   //eclipse导入这个项目
	cd vue02
	
	
	vue init webpack 
 
	
		//回答问题
		? Generate project in current directory? Yes
		? Project name vue02
		? Project description liheng
		? Author liheng
		? Vue build standalone
		? Install vue-router? Yes
		? Use ESLint to lint your code? Yes
		? Set up unit tests No
		? Setup e2e tests with Nightwatch? No
		? Should we run `npm install` for you after the project has been created? (recommended) npm


（3）.  
	cd D:\workspace\vue01
	
	npm install -g
	npm install -g webpack-dev-server
	npm install eslint --save-dev
	
（4）.  
		npm run dev 

//========================================================================== 修改 package.json
//========================================================================== 修改 package.json
这些包升级之后，会自动回写 package.json 文件
 
	npm install @vue/cli --save-dev
	npm install @vue/cli-service  --save-dev
	npm install vue-template-compiler --save-dev
 
	
	
	npm install webpack@latest   --save-dev   //注意：这里需要升级 webpack
	
	npm install webpack-merge@latest --save-dev  
	
	
	npm install babel@latest --save-dev
	npm install webpackbar --save-dev
	
	npm install path-browserify --save-dev

	npm install html-webpack-plugin --save-dev
	
//==========================================================================
//==========================================================================

此时，启动找的是 vue.config.js 文件，而不是 webpack.prod.conf.js

//==========================================================================
//==========================================================================

npm install webpack-merge --save-dev
剩下 就是开始编写配置文件 

//==========================================================================  先打包
//==========================================================================  先打包

 
"dev": "vue-cli-service serve",
"build": "vue-cli-service build",

npm run build
npm run dev
//==========================================================================  配置文件加载顺序
//==========================================================================  配置文件加载顺序

（1）. npm run test
（2）. package.json
（3）. .env.test
（4）. vue.config.js
（5）. developments.
（6）. externals.js
（7）. proxy.js
（8）. base.js
（9）. settings.js




