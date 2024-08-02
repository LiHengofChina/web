// http.js
import axios from 'axios';

// 创建 axios 实例
const instance = axios.create({
    baseURL: 'https://api.example.com', // 替换为实际的 API 基础 URL
    timeout: 10000,
});

// 添加请求拦截器
instance.interceptors.request.use(
    config => {
        // 在发送请求之前做些什么，比如添加 token
        // config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    error => {
        // 对请求错误做些什么
        return Promise.reject(error);
    }
);

// 添加响应拦截器
instance.interceptors.response.use(
    response => response.data, // 直接返回数据部分
    error => {
        // 对响应错误做些什么
        return Promise.reject(error);
    }
);

export default instance;

