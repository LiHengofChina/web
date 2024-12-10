// src/api/workstation/approval/config/config_api.js

const api = {

    /***
     * 查询评委人员
     */
    getNextEvaluatorList: async(data, config, success, error) => {
        const { postJson } = await import(/* webpackChunkName: "axios-module" */ "@/libs/mftcc-npm/src/axios/index");
        const url = `/${config.servers.config}/committee/configCommitteeUser/findByPagePop`;
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


