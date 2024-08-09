// src/router/workstation/workstationRoutes.js
import ApprovalLayout from '@/views/workstation/approval/ApprovalLayout.vue';

export default [
    {
        path: '/workstation',
        name: 'workstation',
        component: ApprovalLayout,  // or WorkstationPage if it should be different
        // 如果需要，其他工作站相关的路由可以在此添加
    }
];
