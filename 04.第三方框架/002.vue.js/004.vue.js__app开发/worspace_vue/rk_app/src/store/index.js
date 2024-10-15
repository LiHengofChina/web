

// src/store/index.js
import { createStore } from 'vuex';

//index页
import auth from './index/authStore.js';
import index from './index/indexStore.js';


//工作台-审批
import approval from './workstation/approvalStore.js';
//工作台-审批-我的审批
import approval_my_approvals from './workstation/approval/my-approvalsStore.js';

//工作台-审批-我的审批-立项审批
import approval_project_initiation_approval_page from './workstation/approval/pending/project-initiation-approval-page.js';

export default createStore({
  modules: {
    auth,
    index,
    approval,
    approval_my_approvals,
    approval_project_initiation_approval_page,
  },
});
