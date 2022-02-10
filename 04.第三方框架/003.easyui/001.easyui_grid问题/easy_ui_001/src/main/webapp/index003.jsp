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
		<title>使用 javascript 创建数据网格（datagrid）</title>
		
		
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
	
	111111111111111
		<table 
			id="dg"
			class="easyui-datagrid"
			style="width:600px;height:250px"
			title="用户列表" iconCls="icon-save"
			>
		</table>
		22222222222222
 
 
	</body>
	
	<script type="text/javascript">
	
	
		$('#dg').datagrid({
		    url:'data/datagrid_data.json',

		    		//调用接口查询数据
		    		//http://localhost:8080/easy_ui_001/datagrid_data.json
		    		//或者在这个位置放置一个文件,返回JSON的数据。

		    columns:[[
				{field:'code',title:'Code',width:100},
				{field:'name',title:'Name',width:100},
				{field:'price',title:'Price',width:100,align:'right'}, 
				{field:'oper',title:'Oper',
					height:'auto',
					width:200,
					align:'center'}, 
		    ]],
		    
		    fitColumns: true 
		    
		});
		
		$('#dg').datagrid({"onLoadSuccess":function(data){
				var tr = $('#dg').datagrid('getPanel').find('div.datagrid-body tr');
				//所有行
			    tr.each(function () {
			    	//某一行
                    var div = $(this).children('td[field=oper]').children("div");
                    div.css({
	   					 "height":"auto",
	   					 "white-space":"pre-wrap"
   					});
			    });
		}});
  
		
	</script>


</html> 