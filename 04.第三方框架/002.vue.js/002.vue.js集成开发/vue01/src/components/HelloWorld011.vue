

<template  >
	  <div class="hello">
		
		        <hr/>
				<p>input 元素：</p>
				<input v-model="message" placeholder="编辑我……">
				<p>消息是: {{ message }}</p>
				
				
				<hr/>
				<p>textarea 元素：</p>
				<p style="white-space: pre">{{ message2 }}</p>
				<textarea v-model="message2" placeholder="多行文本输入……"></textarea>


				<hr/>
				<p>单个复选框：</p>
				<input type="checkbox" id="checkbox" v-model="checked">
				<label for="checkbox">{{ checked }}</label>
				
				<hr/>
				<p>多个复选框：</p>
				<input type="checkbox" id="runoob" value="Runoob" v-model="checkedNames">
				<label for="runoob">Runoob</label>
				<input type="checkbox" id="google" value="Google" v-model="checkedNames">
				<label for="google">Google</label>
				<input type="checkbox" id="taobao" value="Taobao" v-model="checkedNames">
				<label for="taobao">taobao</label>
				<br/>
				<span>选择的值为: {{ checkedNames }}</span>
				
				
				
				<hr/>
				<input type="radio" id="runoob" value="Runoob" v-model="picked">
				<label for="runoob">Runoob</label>
				<br>
				<input type="radio" id="google" value="Google" v-model="picked">
				<label for="google">Google</label>
				<br>
				<span>选中值为: {{ picked }}</span>
				
				<hr/>		
				<select v-model="selected" name="fruit">
					<option value="">选择一个网站</option>
					<option value="www.runoob.com">Runoob</option>
					<option value="www.google.com">Google</option>
				</select>
				<div id="output">
					选择的网站是: {{selected}}
				</div>
				
				
<!-- 在 "change" 而不是 "input" 事件中更新 -->
<input v-model.lazy="msg" >	
<input v-model.number="age" type="number">
<!--
.trim 
如果要自动过滤用户输入的首尾空格，可以添加 trim 修饰符到 v-model 上过滤输入：
 -->
<input v-model.trim="msg">

	  </div>
	  
</template>
<script>
	export default {
		  name: 'HelloWorld',
		  data(){
			    return {
					message: 'Liheng',
					message2: 'liheng_test'
					
									
					,checked : false,
				    checkedNames: ['Google']
									
									
					,picked:'Google'
					
					,selected:[]
					
					,msg:  ''
					,age: 10
				
					
			    }
		  },
		  methods: {

		  }		  
	}
	
</script>

<style scoped>

.base {
  width: 100px;
  height: 100px;
}


.active {
	width: 100px;
	height: 100px;
	background: green;
}

.text-danger {
	background: red;
}

</style>


