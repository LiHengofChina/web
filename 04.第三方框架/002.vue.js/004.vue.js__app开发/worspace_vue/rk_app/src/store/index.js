

// src/store/index.js
import { createStore } from 'vuex';

//index页
import auth from './index/authStore.js';
import index from './index/indexStore.js';


//工作台-审批
import approval from './workstation/approvalStore.js';
//工作台-审批-我的审批
import approval_my_approvals from './workstation/approval/my-approvalsStore.js';

//工作台-审批-我的审批-通用store
import approval_common_store from './workstation/approval/common/approval-common-store.js';

export default createStore({
  modules: {
    auth,
    index,
    approval,
    approval_my_approvals,
    approval_common_store,
  },
});
