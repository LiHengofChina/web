// login/index.js


const api = {

    login: async (data, success, error) => {
        const { default: axiosModule } = await import(/* webpackChunkName: "axios-module" */ "@/libs/mftcc-npm/src/axios/index");
        const { postJsonNoLoading } = axiosModule;
        postJsonNoLoading(
			"/" + this.$config.servers.sys + "/login",
            data,
            true,
            success,
            error
        );
    },
    loginOut: async(data, success, error) => {
        const { default: axiosModule } = await import(/* webpackChunkName: "axios-module" */ "@/libs/mftcc-npm/src/axios/index");
        const { postJsonNoLoading } = axiosModule;
        postJsonNoLoading(
            "/" + this.$config.servers.sys + "/loginOut",
            data,
            true,
            success,
            error
        );
    }
};

export default api;


