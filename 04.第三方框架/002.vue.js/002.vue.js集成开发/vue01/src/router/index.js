import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld001 from '@/components/HelloWorld001'
import HelloWorld002 from '@/components/HelloWorld002'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/helloWorld001',
      name: 'HelloWorld001',
      component: HelloWorld001
    },
    {
      path: '/helloWorld002',
      name: 'HelloWorld002',
      component: HelloWorld002
    }
  ]
})
