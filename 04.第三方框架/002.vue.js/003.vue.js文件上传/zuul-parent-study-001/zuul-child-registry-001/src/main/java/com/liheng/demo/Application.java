package com.liheng.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;


@EnableEurekaServer // 标志它是一个"服务注册(注册中心)"服务
@SpringBootApplication
public class Application {

	public static void main(String[] args) {
		System.out.println("___________Eureka Server 注册中心________________");
		SpringApplication.run(Application.class, args);
		System.out.println("___________Eureka Server 注册中心________________");
	}

}
