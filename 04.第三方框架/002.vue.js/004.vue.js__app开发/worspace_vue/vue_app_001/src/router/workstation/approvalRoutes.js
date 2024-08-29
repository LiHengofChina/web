// src/router/approval/approvalRoutes.js

import ApprovalLayout from '@/views/workstation/approval/ApprovalLayout.vue';

const ApplyPage = () => import(/* webpackChunkName: "apply-page" */ '@/views/workstation/approval/bottom_menu/ApplyPage.vue');
const MyApprovalsPage = () => import(/* webpackChunkName: "my-approvals-page" */ '@/views/workstation/approval/bottom_menu/MyApprovalsPage.vue');
const SubmittedPage = () => import(/* webpackChunkName: "submitted-page" */ '@/views/workstation/approval/bottom_menu/SubmittedPage.vue');

const ApprovalPage1 = () => import(/* webpackChunkName: "approval-page" */ '@/views/workstation/approval/bottom_menu/my_approvals/pending/ApprovalPage1.vue');
const ApprovalPage2 = () => import(/* webpackChunkName: "approval-page" */ '@/views/workstation/approval/bottom_menu/my_approvals/pending/ApprovalPage2.vue');


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
        path: '/workstation/approval/my-approvals/pending/approval_1/:id',
        name: 'workstation_approval_my-approvals_pending_approval_1',
        component: ApprovalPage1
    },
    {
        path: '/workstation/approval/my-approvals/pending/approval_2/:id',
        name: 'workstation_approval_my-approvals_pending_approval_2',
        component: ApprovalPage2
    },

    {
        path: '/workstation/approval/my-approvals/pending/transfer/:id',
        name: 'workstation_approval_my-approvals_pending_transfer',
        component: TransferPage
    }
];
