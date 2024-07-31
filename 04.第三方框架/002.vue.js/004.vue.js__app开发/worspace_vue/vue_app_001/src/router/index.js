import { createRouter, createWebHistory } from 'vue-router';



const Home = () => import(/* webpackChunkName: "home" */ '@/components/HomePage.vue');
const ApprovalForm = () => import(/* webpackChunkName: "approval" */ '@/components/ApprovalForm.vue');
const LoginPage = () => import(/* webpackChunkName: "log" */ '@/components/LoginPage.vue');




const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/approval',
        name: 'Approval',
        component: ApprovalForm
    }, {
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
