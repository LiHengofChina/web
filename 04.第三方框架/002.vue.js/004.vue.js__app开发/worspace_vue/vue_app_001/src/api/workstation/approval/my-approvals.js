// workstation/approval/index.js

const api = {


    /***
     * POST 获取:获取审批列表
     */
    getSysTaskInfo: async( data, config, success) => {
        const {  postJson } = await import(/* webpackChunkName: "axios-module" */ "@/libs/mftcc-npm/src/axios/index");
        postJson(
			"/" + config.servers.flowable + "/appcenter/getSysTaskInfo",
            data,
            true,
            success
        );
    },

    /***
     * POST 获取申请ID
     */
    getTaskResultData: async( data, config, success, error) => {
        const {  postJson } = await import(/* webpackChunkName: "axios-module" */ "@/libs/mftcc-npm/src/axios/index");
        const url = `/${config.servers.lease}/main/leaseMain/getTaskResultData`;
        postJson(
			url,
            data,
            true,
            success,
            error
        );
    },

    /***
     * GET 根据ID 查看 “申请项目” 的详细信息
     */
    getOfferInfoById: async(apply_id, config, success, error) => {
        const { get } = await import(/* webpackChunkName: "axios-module" */ "@/libs/mftcc-npm/src/axios/index");
        const url = `/${config.servers.lease}/apply/leaseApply/getOfferInfoById/${apply_id}`;
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


