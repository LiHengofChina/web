
import axios from "axios";

const request = axios.create();

/**
 * 调用后台服务
 */
export const uploadFile_x = (file) => {

		 console.log("start....");
		 return request({
//			 url: '/to_spring/uploadFile',
			 url: '/to_struts2/liheng_uploads3.action',  
			 
			 url: '/to_zuul_struts/struts2-upload-001/liheng_uploads3.action',	// 到zuul转发到struts2 
			 
			 method: 'post',
			 headers: {
				 'Content-Type': 'multipart/form-data; charset=utf-8'
			 },
			 data: file
		 });

}
