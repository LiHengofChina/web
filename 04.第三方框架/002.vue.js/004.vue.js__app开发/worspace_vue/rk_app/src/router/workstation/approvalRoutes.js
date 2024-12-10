// src/router/approval/approvalRoutes.js

import ApprovalLayout from '@/views/workstation/approval/ApprovalLayout.vue';

const ApplyPage = () => import(/* webpackChunkName: "apply-page" */ '@/views/workstation/approval/bottom_menu/ApplyPage.vue');
const MyApprovalsPage = () => import(/* webpackChunkName: "my-approvals-page" */ '@/views/workstation/approval/bottom_menu/MyApprovalsPage.vue');
const SubmittedPage = () => import(/* webpackChunkName: "submitted-page" */ '@/views/workstation/approval/bottom_menu/SubmittedPage.vue');

// 租赁-立项审批页
const BeforehandApprovalPage = () => import(/* webpackChunkName: "lease-beforehand_approval-page" */ '@/views/workstation/approval/bottom_menu/my_approvals/pending/lease/beforehand_approval/BeforehandApprovalPage.vue');

// 租赁-项目尽调审批页
const ProjectInvestigationApprovePage = () => import(/* webpackChunkName: "lease-project_investigation_approve-page" */ '@/views/workstation/approval/bottom_menu/my_approvals/pending/lease/project_investigation_approve/ProjectInvestigationApprovePage.vue');

// 租赁-合同申请审批
const  ContractApprovalPage=()=> import(/* webpackChunkName: "lease-contract-approval-page" */ '@/views/workstation/approval/bottom_menu/my_approvals/pending/lease/contract_create_approval/ContractApprovalPage.vue');


// 租赁-放贷申请审批
const  PutoutApprovalPage=()=> import(/* webpackChunkName: "lease-putout_approval-page" */ '@/views/workstation/approval/bottom_menu/my_approvals/pending/lease/putout_approval/PutoutApprovalPage.vue');




// 委贷-业务审批
const ApplyApprovalPage = () => import(/* webpackChunkName: "loan-apply_approval-page" */ '@/views/workstation/approval/bottom_menu/my_approvals/pending/loan/apply_approval/ApplyApprovalPage.vue');

// 委贷-合同审批
const ContractSignApprovalPage = () => import(/* webpackChunkName: "loan-contract_sign_approval-page" */ '@/views/workstation/approval/bottom_menu/my_approvals/pending/loan/contract_sign_approval/ContractSignApprovalPage.vue');


// 委贷-支付审批
const PutoutConfirmApprovalPage = () => import(/* webpackChunkName: "loan-putout_confirm-page" */ '@/views/workstation/approval/bottom_menu/my_approvals/pending/loan/putoutConfirm/PutoutConfirmApprovalPage.vue');

//委贷-放款审批
const LoanPutoutApprovalPage = () => import(/* webpackChunkName: "loan-apply_putout-approval-page" */ '@/views/workstation/approval/bottom_menu/my_approvals/pending/loan/putout_approval/PutoutApprovalPage.vue');

// 委贷-提交还款审批
const LoanAfterPage = () => import(/* webpackChunkName: "loan-loan_after-page" */ '@/views/workstation/approval/bottom_menu/my_approvals/pending/loan/loanAfter/LoanAfterPage.vue');


const TransferPage = () => import(/* webpackChunkName: "transfer-page" */ '@/views/workstation/approval/bottom_menu/my_approvals/pending/TransferPage.vue');



// 审批-文件预览页
const FileViewerPage = () => import(/* webpackChunkName: "file-viewer-page" */ '@/components/workstation/approval/common/file/FileViewerPage.vue');


// 错误提示页面
const ErrorPage = () => import(/* webpackChunkName: "error-page" */ '@/views/common/ErrorPage.vue');
const SuccessfulPage = () => import(/* webpackChunkName: "successful-page" */ '@/views/common/SuccessfulPage.vue');




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

    //租赁-立项审批
    {
        path: '/workstation/approval/my-approvals/pending/lease/beforehand_approval/:task_id/:trace_no/:biz_id/:op_no/:task_def_id/:approve_title',
        name: 'workstation_approval_my-approvals_pending_lease_beforehand_approval',
        component: BeforehandApprovalPage
    },
    //租赁-尽调审批
    {
        path: '/workstation/approval/my-approvals/pending/lease/project_investigation_approve/:task_id/:trace_no/:biz_id/:op_no/:task_def_id/:approve_title',
        name: 'workstation_approval_my-approvals_pending_lease_project_investigation_approve',
        component: ProjectInvestigationApprovePage
    },
    //租赁-合同审批
    {
        path: '/workstation/approval/my-approvals/pending/lease/contract_create_approval/:task_id/:trace_no/:biz_id/:op_no/:task_def_id/:approve_title',
        name: 'workstation_approval_my-approvals_pending_lease_contract-approval-page',
        component: ContractApprovalPage
    },
    //租赁-放贷审批
    {
        path: '/workstation/approval/my-approvals/pending/lease/putout_approval/:task_id/:trace_no/:biz_id/:op_no/:task_def_id/:approve_title',
        name: 'workstation_approval_my-approvals_pending_lease_putout_approval-page',
        component: PutoutApprovalPage
    },



    //委贷-业务审批
    {
        path: '/workstation/approval/my-approvals/pending/loan/apply_approval/:task_id/:trace_no/:biz_id/:op_no/:task_def_id/:approve_title',
        name: 'workstation_approval_my-approvals_pending_loan_apply_approval',
        component: ApplyApprovalPage
    },
    //委贷-合同审批
    {
        path: '/workstation/approval/my-approvals/pending/loan/contract_sign_approval/:task_id/:trace_no/:biz_id/:op_no/:task_def_id/:approve_title',
        name: 'workstation_approval_my-approvals_pending_loan_contract_sign_approval',
        component: ContractSignApprovalPage
    },
    //委贷-支付审批
    {
        path: '/workstation/approval/my-approvals/pending/loan/putoutConfirm/:task_id/:trace_no/:biz_id/:op_no/:task_def_id/:approve_title',
        name: 'workstation_approval_my-approvals_pending_loan_putoutConfirm',
        component: PutoutConfirmApprovalPage
    },

    //委贷-放款审批
    {
        path: '/workstation/approval/my-approvals/pending/loan/putout_approval/:task_id/:trace_no/:biz_id/:op_no/:task_def_id/:approve_title',
        name: 'workstation_approval_my-approvals_pending_loan_putoutAppoval',
        component: LoanPutoutApprovalPage
    },
    //委贷-提前还款审批
    {
        path: '/workstation/approval/my-approvals/pending/loan/loanAfter/:task_id/:trace_no/:biz_id/:op_no/:task_def_id/:approve_title',
        name: 'workstation_approval_my-approvals_pending_loan_loanAfter',
        component: LoanAfterPage
    },
    

    //转办
    {
        path: '/workstation/approval/my-approvals/pending/transfer/:id',
        name: 'workstation_approval_my-approvals_pending_transfer',
        component: TransferPage
    },

    //错误页面
    {
        path: '/error',
        name: 'ErrorPage',
        component: ErrorPage
    },
    //错误页面
    {
        path: '/successful',
        name: 'SuccessfulPage',
        component: SuccessfulPage
    },
    

    // 文件预览
    {
        path: '/file-viewer-page',
        name: 'FileViewerPage',
        component: FileViewerPage
    }


];
