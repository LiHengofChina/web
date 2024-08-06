// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import IndexLayout from '@/views/home/IndexLayout.vue';


// ====================================================== 顶级页面组件
// index页
const HomePage = () => import(/* webpackChunkName: "home-page" */ '@/views/home/bottom_menu/HomePage.vue');
const WorkstationPage = () => import(/* webpackChunkName: "workstation-page" */ '@/views/home/bottom_menu/WorkstationPage.vue');
const MessageList = () => import(/* webpackChunkName: "message-list" */ '@/views/home/bottom_menu/MessageList.vue');
const UserProfile = () => import(/* webpackChunkName: "user-profile" */ '@/views/home/bottom_menu/UserProfile.vue');
// 登陆页
const LoginPage = () => import(/* webpackChunkName: "log" */ '@/views/login/LoginPage.vue');

// ====================================================== 独立页面组件
// 工作站-审批
const ApprovalPage = () => import(/* webpackChunkName: "approval-page" */ '@/views/workstation/approval/ApprovalPage.vue');

const routes = [
    {
        path: '/login',
        name: 'LoginPage',
        component: LoginPage,
    },
    {
        path: '/index',
        component: IndexLayout,
        children: [
            {
                path: 'home',
                name: 'home',
                component: HomePage
            },
            {
                path: 'workstation',
                name: 'workstation',
                component: WorkstationPage
            },
            {
                path: 'messages',
                name: 'messages',
                component: MessageList
            },
            {
                path: 'profile',
                name: 'profile',
                component: UserProfile
            }
        ]
    }, {
        path: '/approval',
        name: 'approval',
        component: ApprovalPage
    }
    
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

export default router;
