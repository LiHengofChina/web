package com.liheng.demo.ribbon;

import org.springframework.context.annotation.Bean;

import com.netflix.client.config.IClientConfig;
import com.netflix.loadbalancer.AvailabilityFilteringRule;
import com.netflix.loadbalancer.DynamicServerListLoadBalancer;
import com.netflix.loadbalancer.IPing;
import com.netflix.loadbalancer.IRule;
import com.netflix.loadbalancer.Server;
import com.netflix.loadbalancer.ServerList;
import com.netflix.niws.loadbalancer.NIWSDiscoveryPing;


public class RibbonEurekaClientConfig {

	//初始化一个Spring的Bean
    @Bean
    public IPing ribbonPing(IClientConfig config) {
        return new NIWSDiscoveryPing();
    }

   //初始化一个Spring的Bean
    @Bean
    public IRule ribbonRule(IClientConfig config) {
        return new AvailabilityFilteringRule();
    }

    /*


		获取服务列表：方式一
		
		在 application.yml 中添加配置ribbon:
		  NIWSServerListClassName: com.netflix.niws.loadbalancer.DiscoveryEnabledNIWSServerList
		
	*/
    @Bean
    public ServerList<Server> getServerList(IClientConfig config) {
        DynamicServerListLoadBalancer<Server> serverDynamicServerListLoadBalancer = new DynamicServerListLoadBalancer<>();
        serverDynamicServerListLoadBalancer.initWithNiwsConfig(config);

        return serverDynamicServerListLoadBalancer.getServerListImpl();
    }

	/**
		获取服务列表：方式二
		@Autowired
		DiscoveryClient discoveryClient;

		@Bean
		public ServerList<Server> getServerList(IClientConfig config) {

			return new ServerList<Server>() {
				@Override
				public List<Server> getInitialListOfServers() {
					return new ArrayList<>();
				}

				@Override
				public List<Server> getUpdatedListOfServers() {
					List<Server> serverList = new ArrayList<>();

					List<ServiceInstance> list = discoveryClient.getInstances(config.getClientName());
					for (ServiceInstance instance : list) {
						serverList.add(new Server(instance.getHost(), instance.getPort()));
					}
					return serverList;
				}
			};
		}

	*/

}
