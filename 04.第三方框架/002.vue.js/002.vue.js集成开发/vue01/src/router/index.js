import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld001 from '@/components/HelloWorld001'




Vue.use(Router)

export default new Router({
  routes: [
	
	
    
    
    {
      path: '/helloWorld001',
      name: 'HelloWorld001',
      component: HelloWorld001
    },
 
 
 
    /**
    ,
    {
      path: '/helloWorld010',
      name: 'HelloWorld010',
      component: HelloWorld010
    },
    {
      path: '/helloWorld011',
      name: 'HelloWorld011',
      component: HelloWorld011
    }
    */
  ]
})
