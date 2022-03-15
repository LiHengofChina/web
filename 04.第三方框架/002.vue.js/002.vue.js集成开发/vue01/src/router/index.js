import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld001 from '@/components/HelloWorld001'


console.log("_________________1________________");


Vue.use(Router)
console.log("_________________2________________");
export default new Router({
  routes: [
	
	

 
    {
      path: '/liheng_test', //http://localhost:8080/#/liheng_test
      name: 'HelloWorld001',
      component: HelloWorld001
    } 
 
 
 
  ]
});

console.log("_________________3________________");
