

// src/store/index.js
import { createStore } from 'vuex';

//index页
import auth from './index/auth.js';
import index from './index/index.js';


//工作台-审批
import approval from './workstation/approval.js';
//工作台-审批-我的审批
import approval_my_approvals from './workstation/approval/my-approvals.js';



export default createStore({
  modules: {
    auth,
    index,
    approval,
    approval_my_approvals,
  },
});
