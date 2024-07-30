import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/components/HelloWorld.vue';
import ApprovalForm from '@/components/ApprovalForm.vue';
import LoginPage from '@/components/LoginPage.vue';


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
