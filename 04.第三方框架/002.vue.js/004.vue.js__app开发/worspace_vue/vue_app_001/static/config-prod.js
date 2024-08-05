
const config = {
    host: {
        gateway_path: "http://192.168.100.191:7019"
    },

    router_white_list: ["/login"],

    servers: {
        sys: "mftcc-sys-server", //登录后台
    },
    //首页路由地址
    index_router: "/",
    session_storage_key: "sys",
};

export default {
    install(app) {
        app.config.globalProperties.$config = config;
    }
};
// 确保在浏览器环境中才执行以下代码
if (typeof window !== 'undefined') {
    window.config = config;
}

