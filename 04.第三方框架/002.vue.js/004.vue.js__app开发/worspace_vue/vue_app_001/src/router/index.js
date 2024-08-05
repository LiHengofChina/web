// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import IndexLayout from '@/views/home/IndexLayout.vue';

const HomePage = () => import(/* webpackChunkName: "home-page" */ '@/views/home/bottom_menu/HomePage.vue');
const WorkstationPage = () => import(/* webpackChunkName: "workstation-page" */ '@/views/home/bottom_menu/WorkstationPage.vue');
const TaskList = () => import(/* webpackChunkName: "task-list" */ '@/views/home/bottom_menu/TaskList.vue');
const UserProfile = () => import(/* webpackChunkName: "user-profile" */ '@/views/home/bottom_menu/UserProfile.vue');

const LoginPage = () => import(/* webpackChunkName: "log" */ '@/views/login/LoginPage.vue');

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
                path: 'tasks',
                name: 'tasks',
                component: TaskList
            },
            {
                path: 'profile',
                name: 'profile',
                component: UserProfile
            }
        ]
    }
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

export default router;
