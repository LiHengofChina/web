// src/api/workstation/approval/lease/lease_api.js

const api = {

    /***
     * POST 根据ID 查看 “申请项目” 的详细信息
     */
    findApplyApproveInit: async(data, config, success, error) => {
        const { postJson } = await import(/* webpackChunkName: "axios-module" */ "@/libs/mftcc-npm/src/axios/index");
        const url = `/${config.servers.lease}/approve/apply/leaseApplyHis/findApplyApproveInit`;
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
        const url = `/${config.servers.lease}/main/leaseMain/checkFileUpload`;
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

    //合同信息查看接口 /approve/pact/leasePactHis/findPactApproveInit
    findPactApproveInit: async(data, config, success, error) => {
        const { postJson } = await import(/* webpackChunkName: "axios-module" */ "@/libs/mftcc-npm/src/axios/index");
        const url = `/${config.servers.lease}/approve/pact/leasePactHis/findPactApproveInit/`+data;
        postJson(
			url,
            data,
            true,
            success,
            error
        );
    },
    //费用信息查询
    getfeeList: async(data, config, success, error) => {
        const {  postJson } = await import(/* webpackChunkName: "axios-module" */ "@/libs/mftcc-npm/src/axios/index");
        const url = `/${config.servers.lease}/fee/leaseAppFee/getFeeList`;
        postJson(
            url,
            data,
            true,
            success,
            error
        );
    },
    //放贷信息查看接口 /approve/pact/leasePactHis/findPactApproveInit
    findDueApproveInit: async(data, config, success, error) => {
        const { postJson } = await import(/* webpackChunkName: "axios-module" */ "@/libs/mftcc-npm/src/axios/index");
        const url = `/${config.servers.lease}/approve/due/leaseDueHis/findDueApproveInit/`+data;
        postJson(
            url,
            data,
            true,
            success,
            error
        );
    },
    



};

export default api;


