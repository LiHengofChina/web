// login/index.js


const api = {

    login: async (data, success, error) => {
        const {  postJsonNoLoading } = await import(/* webpackChunkName: "axios-module" */ "@/libs/mftcc-npm/src/axios/index");
        postJsonNoLoading(
			"/" + window.$config.servers.sys + "/login",
            data,
            true,
            success,
            error
        );
    },
    loginOut: async(data, success, error) => {
        const {  postJsonNoLoading } = await import(/* webpackChunkName: "axios-module" */ "@/libs/mftcc-npm/src/axios/index");
        postJsonNoLoading(
            "/" + window.$config.servers.sys + "/loginOut",
            data,
            true,
            success,
            error
        );
    }
};

export default api;


