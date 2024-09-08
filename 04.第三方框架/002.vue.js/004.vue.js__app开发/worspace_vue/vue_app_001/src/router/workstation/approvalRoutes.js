// src/router/approval/approvalRoutes.js

import ApprovalLayout from '@/views/workstation/approval/ApprovalLayout.vue';

const ApplyPage = () => import(/* webpackChunkName: "apply-page" */ '@/views/workstation/approval/bottom_menu/ApplyPage.vue');
const MyApprovalsPage = () => import(/* webpackChunkName: "my-approvals-page" */ '@/views/workstation/approval/bottom_menu/MyApprovalsPage.vue');
const SubmittedPage = () => import(/* webpackChunkName: "submitted-page" */ '@/views/workstation/approval/bottom_menu/SubmittedPage.vue');

//立项审批页
const ProjectInitiationApprovalPage = () => import(/* webpackChunkName: "project-initiation-approval-page" */ '@/views/workstation/approval/bottom_menu/my_approvals/pending/ProjectInitiationApprovalPage.vue');
const TransferPage = () => import(/* webpackChunkName: "transfer-page" */ '@/views/workstation/approval/bottom_menu/my_approvals/pending/TransferPage.vue');

export default [
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
    },

    

    {
        path: '/workstation/approval/my-approvals/pending/project-initiation-approval/:task_id/:task_type/:trace_no/:biz_id/:op_no/:task_def_id/:approve_title',
        name: 'workstation_approval_my-approvals_pending_project-initiation-approval',
        component: ProjectInitiationApprovalPage
    },

    {
        path: '/workstation/approval/my-approvals/pending/transfer/:id',
        name: 'workstation_approval_my-approvals_pending_transfer',
        component: TransferPage
    }
];
