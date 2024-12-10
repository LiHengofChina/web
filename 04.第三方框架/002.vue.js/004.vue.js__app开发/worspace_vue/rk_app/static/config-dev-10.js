
const config = {
    host: {
        // gateway_path: "http://192.168.100.11:7019"
        
        gateway_path: "http://192.168.100.10:7019" //自己的网关
    },

    router_white_list: ["/login"],

    servers: {
        flowable: "mftcc-flowable-server", //流程后台

        doc: "mftcc-doc-server-liheng-remote", //文档

        lease: "mftcc-lease-server-liheng-remote", //租赁

        loan: "mftcc-loan-server-liheng-remote",//委贷

        sys: "mftcc-sys-server-liheng-remote", //登录后台

        config: "mftcc-config-server-liheng-remote" //配置服务

    },
    certificate: {

pemPublicKey: `-----BEGIN PUBLIC KEY-----
MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAExjUb1+aTNZRCEqZcDCw8wbwgKCOyXUaHk0ORGEhQCjKil1HdYPs4KzwIvDwpDffuXd10c668JOXi/XkXcr4vEQ==
-----END PUBLIC KEY-----`,

pgpPublicKey: `-----BEGIN PGP PUBLIC KEY BLOCK-----

mDMEZuwr7BYJKwYBBAHaRw8BAQdAq/cNbUZuW5c7dRlmuVH2H4PZoIvPQhuzF5DU
z4Oz/f20ImxpaGVuZyAoZWNjKSA8MTM2ODgwMDcxNjVAMTM5LmNvbT6IkAQTFggA
OBYhBDuX1ic7Oanzt3aRP3mUP8IgawE/BQJm7CvsAhsDBQsJCAcCBhUKCQgLAgQW
AgMBAh4BAheAAAoJEHmUP8IgawE/ZpkBAN0xHwMyv6sM/punxpvx0B7E8y4EHeSj
ZM4pb4DghgFgAQCdXN5wseMD8AeVzIdPDsFPeyBhPBwbYxbZZii3nMT3CLg4BGbs
K+wSCisGAQQBl1UBBQEBB0CGOa/durKqagchUSZdiGsHe7gEmQ8+mnwnGPx39Q7W
cQMBCAeIeAQYFggAIBYhBDuX1ic7Oanzt3aRP3mUP8IgawE/BQJm7CvsAhsMAAoJ
EHmUP8IgawE/E0MBANwTcJFxdSSJF4rt72sceG/sYc7GmG7boT8aQwHfehmgAP9x
QlDGbFcrnuMWmyinPxODrz+CPzlG0apj+MvSIiq7CQ==
=4uep
-----END PGP PUBLIC KEY BLOCK-----`

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
