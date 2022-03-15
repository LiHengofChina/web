// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false


new Vue({
	
  el: '#app_index_liheng',      /*  将这个VUE对象绑定到 某个 标签 位于 index.html中 */
  
  
  router, 				 //路由决定访问地址 和 去哪个   
  
  components: { App },   //引入一个组件
  				//App 中包括 展示 template
  				//App 中包括 css 样式
  				//App 一个可选的导出模块
  
  template: '<App/>'	 
	  
/*** 
  这个整体（主）的展示面页，
  而 自己写在要通过路由去找，在路由中定义
  */
    					 		
})

