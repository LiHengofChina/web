
import axios from "axios";

const request = axios.create();

/**
 * 调用后台服务
 */
export const uploadFile_x = (file) => {

		 console.log("start....");
		 return request({
//			 url: '/uploadFile',
			 url: 'http://localhost:8081/uploadFile',
			 method: 'post',
			 headers: {
				 'Content-Type': 'multipart/form-data; charset=utf-8'
			 },
			 data: file
		 });

}
