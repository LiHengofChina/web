import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'


import HelloWorld001 from '@/components/HelloWorld001'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/liheng',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
        path: '/liheng_test',
        name: 'HelloWorld001',
        component: HelloWorld001
      }     
  ]
})
