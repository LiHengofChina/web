 
//import Vue from 'vue'
import Vue from 'vue/dist/vue.js';

import VueRouter from 'vue-router'

Vue.use(VueRouter)


import HelloWorld from '@/components/HelloWorld'


import HelloWorld001 from '@/components/HelloWorld001'

 
const createRouter = () =>
new VueRouter({
	  routes: [
	           {  //http://localhost:9528/index.html#/liheng
	             path: '/liheng',
	             name: 'HelloWorld',
	             component: HelloWorld
	           },
	           { //http://localhost:9528/index.html#/liheng_test
	               path: '/liheng_test',
	               name: 'HelloWorld001',
	               component: HelloWorld001
	             }     
	         ]
	       }) ;

const router = createRouter();

export default router;



