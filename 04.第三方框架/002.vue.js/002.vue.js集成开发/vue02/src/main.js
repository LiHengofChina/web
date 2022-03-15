// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

//import Vue from 'vue'
import Vue from 'vue/dist/vue.js';

import App from './App'


import router from './router'



import ElementUI from 'element-ui' 		 //npm install element-ui  --save-dev
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI) ;

Vue.config.productionTip = false


new Vue({
  el: '#app_index_xxxx',
  
  router,
  
  components: { App },
  
  template: '<App/>'
	  
	  
})
