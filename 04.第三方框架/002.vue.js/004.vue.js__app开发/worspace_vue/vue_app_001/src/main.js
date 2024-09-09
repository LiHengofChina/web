import { createApp } from 'vue'; // 从 'vue' 模块导入 createApp 函数
import App from '@/App.vue'; // 导入根组件 App
import router from '@/router'; // 导入路由配置
import store from '@/store'; // 导入 Vuex store
import '@fortawesome/fontawesome-free/css/all.css'; // 导入全局样式
import VueLazyload from 'vue-lazyload'; // 导入 VueLazyload 插件

//======== 暴露：Vuex
import Vuex from 'vuex';
window.Vuex = Vuex;

//======== 暴露：VueRouter
import { createRouter, createWebHistory } from 'vue-router';
window.VueRouter = {
    createRouter,
    createWebHistory,
};

// 创建应用实例
const app = createApp(App);

// 使用插件和全局配置
app.use(VueLazyload, {
    preLoad: 1.3,
    error: require('@/assets/error.png'),
    loading: require('@/assets/loading.gif'),
    attempt: 1
});



//======== 暴露：ElementPlus
import ElementPlus from 'element-plus';

import 'element-plus/dist/index.css';
app.use(ElementPlus);
// 挂载全局对象
window.ELEMENT = ElementPlus;

import { ElMessageBox } from 'element-plus';
// 全局挂载 ElMessageBox
app.config.globalProperties.$confirm = ElMessageBox.confirm;
app.config.globalProperties.$alert = ElMessageBox.alert;


// 动态导入配置插件
let loadConfigPlugin;
if (process.env.NODE_ENV === 'development') {
    loadConfigPlugin = import(/* webpackChunkName: "config-dev-plugin" */ '#/config-dev');
} else if (process.env.NODE_ENV === 'production') {
    loadConfigPlugin = import(/* webpackChunkName: "config-prod-plugin" */ '#/config-prod');
}

// 加载配置插件后挂载应用
loadConfigPlugin
    .then(({ default: configPlugin }) => {
        app.use(configPlugin);
        app.use(store).use(router).mount('#app');
    })
    .catch(error => {
        console.error("Failed to load config plugin:", error);
        app.use(store).use(router).mount('#app');
    });




//======== 暴露：应用实例
window.Vue = app; // 这里暴露的是应用实例





//======== 暴露：axios
import axios from 'axios';
window.axios = axios;

window.$$$store = store
