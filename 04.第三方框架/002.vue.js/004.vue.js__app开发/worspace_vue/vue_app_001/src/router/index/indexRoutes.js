// src/router/index/indexRoutes.js
import IndexLayout from '@/views/index/IndexLayout.vue';

const HomePage = () => import(/* webpackChunkName: "home-page" */ '@/views/index/bottom_menu/HomePage.vue');
const WorkstationPage = () => import(/* webpackChunkName: "workstation-page" */ '@/views/index/bottom_menu/WorkstationPage.vue');
const MessageList = () => import(/* webpackChunkName: "message-list" */ '@/views/index/bottom_menu/MessageList.vue');
const UserProfile = () => import(/* webpackChunkName: "user-profile" */ '@/views/index/bottom_menu/UserProfile.vue');

export default [
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
    }
];
