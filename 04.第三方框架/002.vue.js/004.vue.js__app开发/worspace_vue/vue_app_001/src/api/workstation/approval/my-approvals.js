// workstation/approval/index.js

const api = {

    getSysTaskInfo: async( data, config, success) => {

        const {  postJson } = await import(/* webpackChunkName: "axios-module" */ "@/libs/mftcc-npm/src/axios/index");
        postJson(
			"/" + config.servers.flowable + "/appcenter/getSysTaskInfo",
            data,
            true,
            success
        );
    }

};

export default api;
