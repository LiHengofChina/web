// src/api/workstation/approval/loan/loan_api.js

const api = {

    /***
     * GET 根据 payId 查看申请详情
     */
    findDuePayApproveInit: async(data, config, success, error) => {
        const { get } = await import(/* webpackChunkName: "axios-module" */ "@/libs/mftcc-npm/src/axios/index");
        const url = `/${config.servers.loan}/due/loanDuePayHis/findDuePayApproveInit/${data.payId}`;
        get(
			url,
            null,
            true,
            success,
            error
        );
    },

    /***
     * GET 根据 prepayId 提前还款信息
     */
    findPrepRepayApproveInit: async(data, config, success, error) => {
        const { get } = await import(/* webpackChunkName: "axios-module" */ "@/libs/mftcc-npm/src/axios/index");
        const url = `/${config.servers.loan}/prepay/loanPrepRepayApply/findPrepRepayApproveInit/${data.prepayId}`;
        get(
			url,
            null,
            true,
            success,
            error
        );
    },
    
    /***
     * POST 查询“还款计划”
     */
    findRepayPlanList: async(data, config, success, error) => {
        const { postJson } = await import(/* webpackChunkName: "axios-module" */ "@/libs/mftcc-npm/src/axios/index");
        const url = `/${config.servers.loan}/due/loanDue/findRepayPlanList`;
        postJson(
			url,
            data,
            true,
            success,
            error
        );
    },


    /***
     * POST 查询“资金支付计划”
     */
    findByDueIdAll: async(data, config, success, error) => {
        const { postJson } = await import(/* webpackChunkName: "axios-module" */ "@/libs/mftcc-npm/src/axios/index");
        const url = `/${config.servers.loan}/due/loanPrcpRepayPlan/findByDueIdAll`;

        postJson(
			url,
            data,
            true,
            success,
            error
        );

    },


    /**
     * 查询合同信息
     */
    findPactApproveInit: async(data, config, success, error) => {
        const { postJson } = await import(/* webpackChunkName: "axios-module" */ "@/libs/mftcc-npm/src/axios/index");
        const url = `/${config.servers.loan}/approve/pact/loanPactHis/findPactApproveInit/${data.pactId}`;
        postJson(
            url,
            data,
            true,
            success,
            error
        );
    },


    /***
     * POST 根据ID 查看 “申请项目” 的详细信息
     */
    findApplyApproveInit: async(data, config, success, error) => {
        const { postJson } = await import(/* webpackChunkName: "axios-module" */ "@/libs/mftcc-npm/src/axios/index");
        const url = `/${config.servers.loan}/approve/apply/loanApplyHis/findApplyApproveInit`;
        
        postJson(
			url,
            data,
            true,
            success,
            error
        );
    },


    /***
     * 校验文件上传
     */
    checkFileUpload: async(data, config, success, error) => {
        const {  postJson } = await import(/* webpackChunkName: "axios-module" */ "@/libs/mftcc-npm/src/axios/index");
        const url = `/${config.servers.loan}/main/loanMain/checkFileUpload`;
        postJson(
            url,
            data,
            true,
            success,
            error
        );
    },
    
    /***
     * 审批的“最终提交”
     */
    submitApprove: async(data,submitUrl, config, success, error) => {
        const {  postJson } = await import(/* webpackChunkName: "axios-module" */ "@/libs/mftcc-npm/src/axios/index");
        postJson(
            submitUrl,
            data,
            true,
            success,
            error
        );
    },
    //放款审批信息查询
    findDueApproveInitChild: async(data, config, success, error) => {
        const { get } = await import(/* webpackChunkName: "axios-module" */ "@/libs/mftcc-npm/src/axios/index");
        const url = `/${config.servers.loan}/approve/due/loanDueHis/findDueApproveInitChild/${data}`;
        get(
			url,
            null,
            true,
            success,
            error
        );
    },

};

export default api;


