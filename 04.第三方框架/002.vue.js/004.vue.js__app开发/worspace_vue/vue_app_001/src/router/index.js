import { createRouter, createWebHistory } from 'vue-router';


//延迟：动态导入
const Home = () => import(/* webpackChunkName: "home" */ '@/views/home/HomePage.vue');
const LoginPage = () => import(/* webpackChunkName: "log" */ '@/views/login/LoginPage.vue');




const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/login',
        name: 'LoginPage',
        component: LoginPage,
    }
];


const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

export default router;
