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
	
	<table class="easyui-datagrid"
	 style="width:600px;height:250px"
	 title="用户列表" iconCls="icon-save" >
	 	<thead>
			<tr>
				<th data-options="field:'code'">Code</th>
				<th data-options="field:'name'">Name</th>
				<th data-options="field:'price'">Price</th>
			</tr>
	    </thead>
 		<tbody>
			<tr>
				<td>001</td>
				<td>name1</td>
				<td>2323</td>
			</tr>
			<tr>
				<td>002</td>
				<td>name2</td>
				<td>4612</td>
			</tr>
		</tbody>
	    
	</table>
 
	</body>
	
	<script type="text/javascript">
	</script>


</html> 