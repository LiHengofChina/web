
const config = {
    servers: {
        sys: "mftcc-sys-server", //登录后台
    }
};

export default {
    install(app) {
        app.config.globalProperties.$config = config;
    }
};
