<template>
	  <div class="hello">
		    
		    <hr/>
		   		<div v-html="message"></div>
		    <hr/>
				
				<label for="r1">修改颜色</label>
					<input type="checkbox" v-model="use" id="r1">
				<br><br>
				<div v-bind:class="{'class1': use}">
				    v-bind:class 指令
			  	</div>
			  	
		    <hr/>
    
			{{5+5}}<br>
			{{ ok ? 'YES' : 'NO' }}<br>
			{{ liheng.split('').reverse().join('') }}
			<div v-bind:id="'list-' + id">菜鸟教程</div>
		    
		    <hr/>
	    	指令是带有 v- 前缀的特殊属性。
	    	
	    	指令用于在表达式的值改变时，将某些行为应用到 DOM 上。

		    <hr/>
	    	
	    	 <!--  v-if 指令将根据表达式 seen 的值(true 或 false )来决定是否插入 p 元素。 -->
	    	 <p v-if="seen">现在你看到我了 v-if  </p>
		     
		     <hr/>
		     
		     <pre><a v-bind:href="url">李恒的网站</a></pre>
		    
		     <hr/>
		     
		     <div  v-on:click="doSomething">点我试下</div>
		     
		     
		     <hr/>
		     
		     <form v-on:submit.prevent="onSubmit">
		     	 <table>
		     	 	11111111
		     	 </table>
		     	 
		    	 <input type="submit" value="submit2222">
		     </form>
		     <hr/>
		     
             <p>{{ message_liheng }}</p>
    	     <input v-model="message_liheng">
		     <hr/>
    	     
  			 <p>{{ message_liheng }}</p>
    		 <button v-on:click="reverseMessage">反转字符串</button>
		     
		     <hr/>
			<!-- 在两个大括号中 -->
			{{ message_liheng | capitalize }}
			
			<!-- 
			
			（1）.在 v-bind 指令中 
			<div v-bind:id="rawId | formatId"></div>
			
			（2）. 过滤器可以串联：
				 {{ message | filterA | filterB }}
				 
			
			
			（3）. 过滤器是 JavaScript 函数，因此可以接受参数：
			
				{{ message | filterA('arg1', arg2) }}
			
			
			
			
					-->     
			    		      
		     
	  </div>
</template>
<script>
	export default {
	  name: 'HelloWorld',
	  data () {
	    return {
	    
	      message: '<h1>v-html</h1>'
	     , use: false
	      
		 , ok: true
		 , liheng: 'LIHENG'
		 , id : 1


		  ,seen: true
		  
		  , url: 'http://www.baidu.com'
		  
		  , 'message_liheng': 'abcdefghigklmn!'
		
	    }
	  },
	  methods: {
	            details: function() {
	                return  this.name + " - 学的不仅是技术，更是梦想！";
	            },
	            doSomething: function(){
	            	alert("xxx");
	            },
	            onSubmit: function(){
	            	alert("提交之前调用！");
	            },
	            reverseMessage: function () {
			      this.message_liheng = this.message_liheng.split('').reverse().join('')
			    }
	  },
	  filters: {
			    capitalize: function (value) {
			      if (!value) return ''
			      value = value.toString()
			      return value.charAt(0).toUpperCase() + value.slice(1)
			    }
	  }
  	  
	}
</script>
<style scoped>
	.class1{
	  background: #444;
	  color: #eee;
	}
 

	 
</style>
