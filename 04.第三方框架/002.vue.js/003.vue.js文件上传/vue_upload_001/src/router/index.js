import Vue from 'vue'
import Router from 'vue-router'
import UploadFile001 from '@/components/UploadFile001'
import UploadFile002 from '@/components/UploadFile002'
import UploadFile003 from '@/components/UploadFile003'
import UploadFile004 from '@/components/UploadFile004'


Vue.use(Router)

export default new Router({
  mode: 'history',  // 启用 HTML5 history 模式
  base: '/vue_upload_001/',  // 设置基础路径
  routes: [
    {
      path: '/uploadFile001',
      name: 'UploadFile001',
      component: UploadFile001
    },
 	{
      path: '/uploadFile002',
      name: 'UploadFile002',
      component: UploadFile002
    },
    {
    	path: '/uploadFile003',
    	name: 'UploadFile003',
    	component: UploadFile003
    },
    {
    	path: '/uploadFile004',
    	name: 'UploadFile004',
    	component: UploadFile004
    }
  ]
})
