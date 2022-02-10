<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>


<%
    String path = request.getContextPath();
    String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>


<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<html>
	
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<title>easy_ui_test_001</title>
		
		
		<!-- 引入JQuery -->
		<script type="text/javascript" src="${pageContext.request.contextPath}/script/jquery-easyui-1.9.15/jquery.min.js"></script>
		
		<!-- 引入EasyUI -->
		<script type="text/javascript" src="${pageContext.request.contextPath}/script/jquery-easyui-1.9.15/jquery.easyui.min.js"></script>
		
		<!-- 引入EasyUI的中文国际化js，让EasyUI支持中文 -->
		<script type="text/javascript" src="${pageContext.request.contextPath}/script/jquery-easyui-1.9.15/locale/easyui-lang-zh_CN.js"></script>
		
		
		<!-- 引入EasyUI的样式文件-->
		<link rel="stylesheet" href="${pageContext.request.contextPath}/script/jquery-easyui-1.9.15/themes/default/easyui.css" type="text/css"/>
		<!-- 引入EasyUI的图标样式文件-->
		<link rel="stylesheet" href="${pageContext.request.contextPath}/script/jquery-easyui-1.9.15/themes/icon.css" type="text/css"/>
		
		
	</head>
	
	<body>
	<table id="userList" class="easyui-datagrid" style="width:600px;height:250px"
	            title="用户列表" iconCls="icon-save">
	        <thead>
	            <tr>
	                <th field="productid" width="80" align="center">学号</th>
	                <th field="listprice" width="80" align="center">姓名</th>
	                <th field="unitcost" width="80" align="center">性别</th>
	                <th field="attr1" width="60" algin="center">生日</th>
	                <th field="oper" width="200" algin="center"  >操作</th>
	            </tr>
	        </thead>
	        <tbody>
	            <tr>                           
	                <td>1</td>            
	                <td>宋江</td>            
	                <td>男</td>            
	                <td>1990-01-01</td>
	                <td  >
	                <!-- 页面渲染后，下面有一层DIV，
	                style="height:auto;white-space:pre-wrap;text-align:left;border:1px solid red"
	                 -->
	                	<a>李1恒</a><a>李1恒</a><a>李1恒</a><a>李1恒</a><a>李1恒</a><a>李1恒</a><a>李1恒</a>
	                </td>
	            </tr>                          
	            <tr>                           
	                <td>2</td>            
	                <td>林冲</td>            
	                <td>男</td>            
	                <td>1992-01-01</td>            
	            </tr>   
	            <tr>                           
	                <td>3</td>            
	                <td>吴用</td>            
	                <td>男</td>            
	                <td>1993-01-01</td>            
	            </tr>  
	        </tbody>
	    </table>
	</body>
	
	<script type="text/javascript">
	</script>


</html> 