package com.liheng.demo.ctrl;

import java.io.BufferedOutputStream;
import java.io.FileOutputStream;
import java.io.IOException;

import javax.servlet.http.HttpServletRequest;

import org.apache.tomcat.util.http.fileupload.IOUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;


/**
 * 文件上传服务
 * @author 86136
 *
 */
@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
public class FileController {
	
	@Value("${server.port}")
	private String port;

	

	@RequestMapping("/liheng")
	@ResponseBody
	public String hi(@RequestParam(value = "name", defaultValue = "minbo") String name) {
		String result = "你好， " + name + " , 我的端口号是:" + port;
		System.out.println(result);
		return result;
	}
	
	
	/**
	 * MultipartFile 接受文件并通过IO二进制流(MultipartFile.getInputStream())
	 * 输入到FileOutStream保存文件
	 * @param files
	 * @return
	 * @throws IOException 
	 */
	@PostMapping(value="/uploadFile")
	@CrossOrigin("http://localhost:8080/")
	public String uploadFile(@RequestBody MultipartFile[] files,HttpServletRequest request) throws IOException {
		
		
 
		for (MultipartFile multipartFile : files) {
			String fileName = multipartFile.getOriginalFilename();
//			String path = request.getServletContext().getRealPath("/upload/excel");
			String path = "F:\\web\\04.第三方框架\\002.vue.js\\003.vue.js文件上传\\spring-boot-fileupload-001\\upload";
			System.out.println(path);
			System.out.println(fileName);
			 
			FileOutputStream fos = new FileOutputStream(path+"\\" +fileName); 
			IOUtils.copy(multipartFile.getInputStream(),new BufferedOutputStream(fos));
			
			fos.flush();
			fos.close();
			 
		}
		System.out.println("_________" + files);
		return "22222222222";
	}


}
