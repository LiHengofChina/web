

import axios from "axios";



// create an axios instance
const request = axios.create(basicAxiosConfig);
const instanse = axios.create(basicAxiosConfig);


//添加axios请求拦截器，在请求头添加token、userId等信息。
request.interceptors.request.use(requestHandler,Promise.reject);
instanse.interceptors.request.use(requestHandler,Promise.reject);


const responseHandler = (response) =>{
	if(response.status === 200){
		if(response.headers.newjwt){
			store.dispatch("user/setToken",response.headers.newjwt);
		}
	}
	const res = response.data;
	if(res.status === 16){
		MessageBox.alert("用户没有登陆","警告",{
			confirmButtonText: "确定",
			type: "warning",
			...msgBoxOption
		}).then(() =>{
			store.dispatch("user/resetToken").then(() => {
				window.location.replace("/");
			});
		});
	} else if (res.status !== 0){
		throw new Error(res.statusText);
	}else{
		return res.data;
	}
	
}

request.interceptors.response.use(responseHandler, responseErrorHandler);
instanse.interceptors.response.use((res) => {
	return res;
}, responseErrorHandler);



export const GET = (url) =>
	request({
		url,
		method: "get"
	});

const isFormdata = (data) => (data && data.constructor ? data.constructor.name === "FormData" : false);

export const POST = (url,data = {}) => {
	const conf = {
		url,
		method: "post",
		data
	};
	if(isFormdata(data)){
		conf.headers = {
			"Content-Type": "multipart/form-data"
		};
	}
	return request(conf);
};

export const fileImport = (url,data) => {
	
	const config = {
		url,
		data,
		method: "post",
		responseType: "arraybuffer"
	};
	if(isFormdata(data)){
		config.headers = {
			"Content-Type": "multipart/form-data"
		};
	}
	return instanse(config)
		.then((res) => {
				return res;
		})
		.catch((e) => {
				Message({
					message: e.message,
					type: "error",
					duration: 5 * 1000
				});
		});
};
