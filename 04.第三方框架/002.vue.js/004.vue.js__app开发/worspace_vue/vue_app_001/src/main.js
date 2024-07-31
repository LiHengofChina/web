import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import '@fortawesome/fontawesome-free/css/all.css';
import VueLazyload from 'vue-lazyload';

// 配置 VueLazyload
const app = createApp(App);

app.use(VueLazyload, {
    preLoad: 1.3,
    error: '@/assets/error.png', // 加载错误时显示的图片
    loading: '@/assets/loading.gif', 
    attempt: 1
});

app.use(store).use(router).mount('#app');
