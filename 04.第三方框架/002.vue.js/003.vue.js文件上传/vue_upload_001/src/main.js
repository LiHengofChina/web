// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'





// 引入element-ui
import Element from "element-ui";
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(Element);


// http服务资源
import VueResource from 'vue-resource';
Vue.use(VueResource);



/**
 * 	（1.1）.安装
			npm i --save v-file-upload
	（1.2）.安装
			npm install -g yarn
			yarn add v-file-upload
 * */
import FileUpload from 'v-file-upload';
Vue.use(FileUpload);



Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
;
