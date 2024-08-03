import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import '@fortawesome/fontawesome-free/css/all.css';
import VueLazyload from 'vue-lazyload';

// 引入全局样式
import '@/assets/styles/global.css';

// 创建 app
const app = createApp(App);

// 配置 VueLazyload
app.use(VueLazyload, {
    preLoad: 1.3,
    error: require('@/assets/error.png'), // 使用 require 导入资源路径
    loading: require('@/assets/loading.gif'),
    attempt: 1
});

// 引入配置中的 系统配置 部分配置
let loadConfigPlugin;
if (process.env.NODE_ENV === 'development') {
    loadConfigPlugin = import(/* webpackChunkName: "config-dev-plugin" */ '@/plugins/config-dev-plugin');
} else if (process.env.NODE_ENV === 'production') {
    loadConfigPlugin = import(/* webpackChunkName: "config-prod-plugin" */ '@/plugins/config-prod-plugin');
}


loadConfigPlugin
.then(({ default: configPlugin }) => {
    app.use(configPlugin);
    // 在插件加载完后再挂载 app
    app.use(store).use(router).mount('#app');
})
.catch(error => {
    console.error("Failed to load config plugin:", error);
    // 在插件加载失败的情况下也挂载 app，以免应用无法使用
    app.use(store).use(router).mount('#app');
});
