package com.liheng.demo.ctrl;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


/**
 * 文件上传服务
 * @author 86136
 *
 */
@RestController
public class FileController {
	
	@Value("${server.port}")
	private String port;

	

	//第一个接口
	@RequestMapping("/liheng")
	public String hi(@RequestParam(value = "name", defaultValue = "minbo") String name) {
		String result = "你好， " + name + " , 我的端口号是:" + port;
		System.out.println(result);
		return result;
	}
	
	//第二个接口
	@RequestMapping("/qwert")
	public String hi2() {
		return "22222222222";
	}


}
