// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';

import indexRoutes from './index/indexRoutes.js';
import approvalRoutes from './workstation/approvalRoutes.js';

import LoginPage from '@/views/login/LoginPage.vue';


const routes = [
    {
        path: '/login',
        name: 'LoginPage',
        component: LoginPage,
    },
    ...indexRoutes,
    ...approvalRoutes,
];
const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

//==================================================================== 免登陆 start
//==================================================================== 免登陆 start
import { KJUR } from 'jsrsasign';  // 从 jsrsasign 库导入所需的模块

// 公钥 PEM 格式的字符串
const publicKey = `-----BEGIN PUBLIC KEY-----
MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAExjUb1+aTNZRCEqZcDCw8wbwgKCOyXUaHk0ORGEhQCjKil1HdYPs4KzwIvDwpDffuXd10c668JOXi/XkXcr4vEQ==
-----END PUBLIC KEY-----`;

// JWT 验证函数
function verifyJWT(token) {
    try {
        // 使用 jsrsasign 的 verifyJWT 来验证 JWT 的有效性
        const isValid = KJUR.jws.JWS.verifyJWT(token, publicKey, {
            alg: ['ES256'], // 指定算法
            // iss: ['issuer_name'],  // 可以指定你期望的签发者（可选，根据你的需求）
            // 其他可以指定的验证字段：exp, aud, sub 等
        });
        
        if (isValid) {
            const decoded = KJUR.jws.JWS.parse(token);  // 解析 JWT 获取其内容
            console.log('Decoded payload:', decoded.payloadObj);  // 打印解析后的内容
            return decoded.payloadObj;  // 返回解析后的 JWT 负载
        } else {
            console.error('Invalid JWT.');
            return null;
        }
    } catch (err) {
        console.error('Error verifying JWT:', err.message);
        return null;
    }
}

/**
 * 全局路由守卫
 */
router.beforeEach((to, from, next) => {
    const requestURI = to.path;  // 获取请求的 URI
    // 以 '////' 开头
    if (requestURI.startsWith('////')) {
        const token = requestURI.slice(4); // 截取掉前面的 '////'
        if (token) {
            const decoded = verifyJWT(token);
            if (decoded) { // JWT 验证通过，继续导航到解析出来的路径
                next(decoded.sub);  // `sub` 字段包含原始请求的路径
            } else {
                console.error('Invalid or missing JWT. Redirecting to login.');
            }
        }
    } else {
        next();
    }
});
//==================================================================== 免登陆 end
//==================================================================== 免登陆 end

export default router;
