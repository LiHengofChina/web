// src/api/workstation/approval/flowable/flowable_api.js

const api = {

    /***
     * POST 获取申请ID、按钮列表等等
     */
    getApprovalDetail: async( data, config, success, error) => {
        const {  postJson } = await import(/* webpackChunkName: "axios-module" */ "@/libs/mftcc-npm/src/axios/index");
        const url = `/${config.servers.flowable}/appcenter/getApprovalDetail`;
        postJson(
			url,
            data,
            true,
            success,
            error
        );
    },

    /**
     * POST form 提交
     */
    needOperated: async(data, config, success, error) => {
        const {  postForm } = await import(/* webpackChunkName: "axios-module" */ "@/libs/mftcc-npm/src/axios/index");
        const url = `/${config.servers.flowable}/flowable/needOperated`;
        postForm(url,
            data,
            true,
            success,
            error
        );
    },

    /***
     * 获取下一节点用户的审批列表
     */
    getNextUserList: async(data, config, success, error) => {
        const {  postJson } = await import(/* webpackChunkName: "axios-module" */ "@/libs/mftcc-npm/src/axios/index");
        const url = `/${config.servers.flowable}/user/pageByUserId`;
        postJson(
            url, 
            data, 
            true, 
            success,
            error
        );
    },

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
     * POST 获取审批历史
     */
    getTimeLine: async( data, config, success, error) => {
        const {  postJson } = await import(/* webpackChunkName: "axios-module" */ "@/libs/mftcc-npm/src/axios/index");
        const url = `/${config.servers.flowable}/bpmn/getTimeLine`;
        postJson(
			url,
            data,
            true,
            success,
            error
        );
    },
    /**
     * 查询目标审批节点
     * 
     */
    getFinishNodeList: async(data, config, success, error) => {
        const {  postJson } = await import(/* webpackChunkName: "axios-module" */ "@/libs/mftcc-npm/src/axios/index");
        const url = `/${config.servers.flowable}/appcenter/${window.$$$store.state.approval_common_store.queryTagetNodeMethod}`;
        postJson(
            url,
            data,
            true,
            success,
            error
        );
    },
    //getBizList
    getBizList: async(data, config, success, error) => {
        const {  postJson } = await import(/* webpackChunkName: "axios-module" */ "@/libs/mftcc-npm/src/axios/index");
        const url = `/${config.servers.flowable}/appcenter/getBizList`;
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


