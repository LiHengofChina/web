 
//import Vue from 'vue'
import Vue from 'vue/dist/vue.js';

import VueRouter from 'vue-router'


import layout from '@/layout/liheng_test/layout'


Vue.use(VueRouter)


import HelloWorld from '@/components/HelloWorld'


import HelloWorld001 from '@/components/HelloWorld001'

 

//export const constantRoutes = [
//                               {
//                            	   path: '/',
//                            	   component: Layout,
//                            	   redirect: "dashboard",
//                            	   hidden: true
//                            	   
//                               }
//                               
//                               ];


const createRouter = () =>
new VueRouter({
	  routes: [
	           

	           
	           {
	        	   path: '/',
	        	   component:layout,
	        	   redirect: "dashboard",
	        	   hidden: true,
	        	   meta:{
	        		   title:'首页'
	        	   },
	        	   children:[
					   {  //http://localhost:9528/index.html#/liheng
								 path: '/liheng',
								 name: 'HelloWorld',
							     component: HelloWorld
					   },
					   	{ //http://localhost:9528/index.html#/dashboard
								   path: '/dashboard',
								   name: 'HelloWorld001',
								   component: HelloWorld001
					   	}               
				   	]
	        			   
	        	   
	           },
 
	           {  //http://localhost:9528/index.html#/lihengxxx
					 path: '/lihengxxx',
					 name: 'HelloWorld',
				     component: HelloWorld
			   },
			   	{ //http://localhost:9528/index.html#/dashboardxxx
						   path: '/dashboardxxx',
						   name: 'HelloWorld001',
						   component: HelloWorld001
			   	}  	           
  
	         ]
	       }) ;

const router = createRouter();

export default router;



