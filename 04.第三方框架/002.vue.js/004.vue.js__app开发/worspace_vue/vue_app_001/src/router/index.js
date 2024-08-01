import { createRouter, createWebHistory } from 'vue-router';



const Home = () => import(/* webpackChunkName: "home" */ '@/components/HomePage.vue');
const LoginPage = () => import(/* webpackChunkName: "log" */ '@/components/LoginPage.vue');




const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/log',
        name: 'LoginPage',
        component: LoginPage,
    }
];


const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

export default router;
