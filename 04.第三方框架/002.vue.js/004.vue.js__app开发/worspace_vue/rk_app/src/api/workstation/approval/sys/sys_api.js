// src/api/workstation/approval/sys/sys_api.js

const api = {

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


};

export default api;


