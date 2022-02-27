package com.liheng.demo.filter;

import java.net.MalformedURLException;
import java.net.URL;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Component;

import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;
import com.netflix.zuul.exception.ZuulException;

@Component
public class MyZuulFilter extends ZuulFilter {
	
 
	/**
	 * shouldFilter：这里可以写逻辑判断，是否要过滤，
	 * 本文true,永远过滤。
	 */
	@Override
	public boolean shouldFilter() {
		System.out.println("__________1____");
		return true;
	}
	
	/**
	 * run：过滤器的具体逻辑。可用很复杂，包括查sql，nosql去判断该请求到底有没有权限访问。
	 */
	@Override
	public Object run() throws ZuulException {
		System.out.println("========================================");
		RequestContext requestContext = RequestContext.getCurrentContext();
		HttpServletRequest request = requestContext.getRequest();
		String url = request.getRequestURI();
		System.out.println(url); 
		System.out.println("=================================1=======");

		try {
			requestContext.setRouteHost(new URL("http://localhost:8080/"));
		} catch (MalformedURLException e) {
			e.printStackTrace();
		}
//		requestContext.put("RequestURI", url);
		
		return null;
	}

	@PostConstruct
	private void init() {
		System.out.println("____________init()________________");
	}
	/**
		filterType：返回一个字符串代表过滤器的类型，在zuul中定义了四种不同生命周期的过滤器类型
		pre：路由之前
		routing：路由之时
		post： 路由之后
		error：发送错误调用
	 */
	@Override
	public String filterType() {
		System.out.println("__________3____");
		return "pre";
	}
	
	/**
	 * filterOrder：过滤的顺序
	 */
	@Override
	public int filterOrder() {
		System.out.println("__________4____");
		return 1;
	}

 
	

}
