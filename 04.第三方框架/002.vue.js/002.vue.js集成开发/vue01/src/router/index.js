import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld001 from '@/components/HelloWorld001'
import HelloWorld002 from '@/components/HelloWorld002'
import HelloWorld003 from '@/components/HelloWorld003'
import HelloWorld004 from '@/components/HelloWorld004'
import HelloWorld005 from '@/components/HelloWorld005'
import HelloWorld006 from '@/components/HelloWorld006'
import HelloWorld007 from '@/components/HelloWorld007'
import HelloWorld008 from '@/components/HelloWorld008'
import HelloWorld009 from '@/components/HelloWorld009'

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
    },
    {
      path: '/helloWorld003',
      name: 'HelloWorld003',
      component: HelloWorld003
    },
    {
      path: '/helloWorld004',
      name: 'HelloWorld004',
      component: HelloWorld004
    },
    {
      path: '/helloWorld005',
      name: 'HelloWorld005',
      component: HelloWorld005
    },
    {
      path: '/helloWorld006',
      name: 'HelloWorld006',
      component: HelloWorld006
    },
    {
      path: '/helloWorld007',
      name: 'HelloWorld007',
      component: HelloWorld007
    },
    {
      path: '/helloWorld008',
      name: 'HelloWorld008',
      component: HelloWorld008
    },
    {
      path: '/helloWorld009',
      name: 'HelloWorld009',
      component: HelloWorld009
    }
  ]
})
