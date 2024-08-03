
const config = {
    servers: {
        sys: "mftcc-sys-server", //登录后台
    }
};

export default {
    install(Vue) {
        Vue.prototype.$config = config;
    }
};
