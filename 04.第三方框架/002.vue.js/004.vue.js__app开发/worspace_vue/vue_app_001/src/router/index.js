// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import IndexLayout from '@/views/index/IndexLayout.vue';

// ====================================================== 顶级页面组件
// index页
const HomePage = () => import(/* webpackChunkName: "home-page" */ '@/views/index/bottom_menu/HomePage.vue');
const WorkstationPage = () => import(/* webpackChunkName: "workstation-page" */ '@/views/index/bottom_menu/WorkstationPage.vue');
const MessageList = () => import(/* webpackChunkName: "message-list" */ '@/views/index/bottom_menu/MessageList.vue');
const UserProfile = () => import(/* webpackChunkName: "user-profile" */ '@/views/index/bottom_menu/UserProfile.vue');
// 登陆页
const LoginPage = () => import(/* webpackChunkName: "log" */ '@/views/login/LoginPage.vue');

// ====================================================== 独立页面组件
// 工作站-审批
const ApprovalLayout = () => import(/* webpackChunkName: "approval-layout" */ '@/views/workstation/approval/ApprovalLayout.vue');
const ApplyPage = () => import(/* webpackChunkName: "apply-page" */ '@/views/workstation/approval/bottom_menu/ApplyPage.vue');
const MyApprovalsPage = () => import(/* webpackChunkName: "my-approvals-page" */ '@/views/workstation/approval/bottom_menu/MyApprovalsPage.vue');
const SubmittedPage = () => import(/* webpackChunkName: "submitted-page" */ '@/views/workstation/approval/bottom_menu/SubmittedPage.vue');

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
    }, 
    {
        path: '/approval',
        component: ApprovalLayout,
        children: [
            {
                path: 'apply',
                name: 'apply',
                component: ApplyPage
            },
            {
                path: 'my-approvals',
                name: 'my-approvals',
                component: MyApprovalsPage
            },
            {
                path: 'submitted',
                name: 'submitted',
                component: SubmittedPage
            }
        ]
    }
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

export default router;
