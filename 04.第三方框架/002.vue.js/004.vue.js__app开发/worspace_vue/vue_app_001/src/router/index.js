// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';

import indexRoutes from './index/indexRoutes.js';
import approvalRoutes from './workstation/approvalRoutes.js';

import LoginPage from '@/views/login/LoginPage.vue';

const routes = [
    {
        path: '/login',
        name: 'LoginPage',
        component: LoginPage,
    },
    ...indexRoutes,
    ...approvalRoutes,
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

export default router;
