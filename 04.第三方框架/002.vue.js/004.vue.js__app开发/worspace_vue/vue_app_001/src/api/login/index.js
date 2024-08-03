// login/index.js


const api = {

    login: async (data, success, error) => {
        const { default: axiosModule } = await import("npm/mftcc-npm/src/axios/index");
        const { postJsonNoLoading } = axiosModule;
        postJsonNoLoading(
			"/" + $servers.sys + "/login",
            data,
            true,
            success,
            error
        );
    },
    loginOut: async(data, success, error) => {
		const { default: axiosModule } = await import("npm/mftcc-npm/src/axios/index");
        const { postJsonNoLoading } = axiosModule;
        postJsonNoLoading(
            "/" + $servers.sys + "/loginOut",
            data,
            true,
            success,
            error
        );
    }

};

export default api;


