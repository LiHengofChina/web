// workstation/approval/my-approvals.js

import store from '@/store';  // 导入 Vuex store 实例


const api = {


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
    submitApprove: async(data, config, success, error) => {
        const {  postJson } = await import(/* webpackChunkName: "axios-module" */ "@/libs/mftcc-npm/src/axios/index");
        const url = `/${config.servers.lease}/approve/apply/leaseApplyHis/submitApprove`;
        postJson(
            url,
            data,
            true,
            success,
            error
        );
    },
    

    /***
     * 获取系统参数
     */
    getParmDic: async(data, config, success, error) => {
        const {  postJson } = await import(/* webpackChunkName: "axios-module" */ "@/libs/mftcc-npm/src/axios/index");
        const url = `/${config.servers.sys}/sys/sysParmKey/getParmDic`;
        postJson(
            url, 
            data, 
            true, 
            success,
            error
        );
    },
    
    /***
     * 获取用户列表
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
     * POST 获取文件资料
     */
    relatedFileList: async( data, config, success, error) => {
        const {  postJson } = await import(/* webpackChunkName: "axios-module" */ "@/libs/mftcc-npm/src/axios/index");
        const url = `/${config.servers.doc}/file/docFileInf/relatedFileList`;
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
     * POST 文件参数列表
     */
    getFileParamList: async( data, config, success, error) => {
        const {  postJson } = await import(/* webpackChunkName: "axios-module" */ "@/libs/mftcc-npm/src/axios/index");
        const url = `/${config.servers.lease}/main/leaseMain/getFileParamList`;
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
     * POST 获取申请ID、按钮列表等等
     */
    getApprovalDetail: async( data, config, success, error) => {
        const {  postJson } = await import(/* webpackChunkName: "axios-module" */ "@/libs/mftcc-npm/src/axios/index");

        const exemptionfromlogin = store.getters['auth/isExemptionfromlogin'];
        let url = '';
        if(exemptionfromlogin){//免登陆
            url = `/${config.servers.flowable}/appcenter/getApprovalDetail////`;

            // data = data;

        }else{
            url = `/${config.servers.flowable}/appcenter/getApprovalDetail`;
        }
        console.log("xxx:"+url);
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
};

export default api;


