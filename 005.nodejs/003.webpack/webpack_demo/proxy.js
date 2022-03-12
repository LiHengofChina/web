module.exports = {
        '/to_struts2': {
            target:'http://localhost:8080/struts2-upload-001/',
            	
            changeOrigin:true, // 在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，
            				   // 这样服务端和服务端进行数据的交互就不会有跨域问题
            pathRewrite:{
              '^/to_struts2': ''
            }
        }
}
//proxyTable: {
//        '/to_spring': {
//         //   target:'http://localhost:8079/',
//            changeOrigin:true,  
//            pathRewrite:{
//              '^/to_spring': ''
//            }
//        },
//    }