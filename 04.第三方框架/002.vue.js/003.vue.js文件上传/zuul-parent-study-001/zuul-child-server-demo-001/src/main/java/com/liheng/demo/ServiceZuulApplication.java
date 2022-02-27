package com.liheng.demo;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.cloud.netflix.ribbon.RibbonClients;
import org.springframework.cloud.netflix.zuul.EnableZuulProxy;
 
import com.liheng.demo.filter.MyZuulFilter;
import com.liheng.demo.ribbon.RibbonEurekaClientConfig;


@SpringBootApplication
@EnableEurekaClient
//@EnableDiscoveryClient

/**
 * zull节点
 * @author 86136
 *
 */
@EnableZuulProxy

//
@RibbonClients(defaultConfiguration = RibbonEurekaClientConfig.class)
public class ServiceZuulApplication {
	public static void main(String[] args) {
		System.out.println("_________________________");
        SpringApplication.run( ServiceZuulApplication.class, args );
        System.out.println("_________________________");
    }
	
	
//	@Bean
//	public MyZuulFilter myZuulFilter() {
//		return new MyZuulFilter();
//	}

	
	
	
}
