// login/index.js


const api = {

    login: async (data,config,success, error) => {
        const {  postJsonNoLoading } = await import(/* webpackChunkName: "axios-module" */ "@/libs/mftcc-npm/src/axios/index");
        postJsonNoLoading(
			"/" + config.servers.sys + "/login",
            data,
            true,
            success,
            error
        );
    },
    loginOut: async(data,config,success, error) => {
        const {  postJsonNoLoading } = await import(/* webpackChunkName: "axios-module" */ "@/libs/mftcc-npm/src/axios/index");
        postJsonNoLoading(
            "/" + config.servers.sys + "/loginOut",
            data,
            true,
            success,
            error
        );
    }
};

export default api;


