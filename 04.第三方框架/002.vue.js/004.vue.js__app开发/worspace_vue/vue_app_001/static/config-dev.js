
const config = {
    host: {
        gateway_path: "http://192.168.100.11:7019"
    },

    router_white_list: ["/login"],

    servers: {

        flowable: "mftcc-flowable-server", //流程后台

        sys: "mftcc-sys-server-liheng-remote", //登录后台
    },
    //首页路由地址
    index_router: "/index/home",
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
