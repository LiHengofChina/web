

<template  >
	  <div class="hello">
		
		      <hr/>
			  <button v-on:click="counter += 1">增加 1</button>
			  <p>这个按钮被点击了 {{ counter }} 次。</p>

			  
			  <hr/>
			  <!-- `greet` 是在下面定义的方法名 -->
			  <button v-on:click="greet">Greet</button>
		   
			  
			  <hr/>
			  <!-- 也可以用内联 JavaScript 语句： -->
			  <button v-on:click="say('hi')">Say hi</button>
			  <button v-on:click="say('what')">Say what</button>
			  
			  <hr/>
			  <!--
					Vue.js 为 v-on 提供了事件修饰符来处理 DOM 事件细节，如：event.preventDefault() 或 event.stopPropagation()。
					Vue.js 通过由点 . 表示的指令后缀来调用修饰符。
					.stop - 阻止冒泡
					.prevent - 阻止默认事件
					.capture - 阻止捕获
					.self - 只监听触发该元素的事件
					.once - 只触发一次
					.left - 左键事件
					.right - 右键事件
					.middle - 中间滚轮事件
			  
				<!-- 阻止单击事件冒泡 -->
				<a v-on:click.stop="doThis"></a>
				<!-- 提交事件不再重载页面 -->
				<form v-on:submit.prevent="onSubmit"></form>
				<!-- 修饰符可以串联  -->
				<a v-on:click.stop.prevent="doThat"></a>
				<!-- 只有修饰符 -->
				<form v-on:submit.prevent></form>
				<!-- 添加事件侦听器时使用事件捕获模式 -->
				<div v-on:click.capture="doThis">...</div>
				<!-- 只当事件在该元素本身（而不是子元素）触发时触发回调 -->
				<div v-on:click.self="doThat">...</div>
				
				<!-- click 事件只能点击一次，2.1.4版本新增  -->
				<a v-on:click.once="doThis"></a>
				
				<hr/>
			    <!--
			    	按键修饰符:
			    
			    	Vue 允许为 v-on 在监听键盘事件时添加按键修饰符：
			    
			    -->
				<!-- 只有在 keyCode 是 13 时调用 vm.submit() -->
				<input v-on:keyup.13="submit">
				
				<!-- 同上 -->
				<input v-on:keyup.enter="submit">
				<!-- 缩写语法 -->
				<input @keyup.enter="submit">
		<!-- 
			全部的按键别名：
			
			.enter
			.tab
			.delete (捕获 "删除" 和 "退格" 键)
			.esc
			.space
			.up
			.down
			.left
			.right
			.ctrl
			.alt
			.shift
			.meta		
		 -->

	  </div>
	  
</template>
<script>
	export default {
		  name: 'HelloWorld',
		  data(){
			    return {
					 counter: 0,
					 
					 name: 'Vue.js'
					 
					  
			    }
		  },
		  // 在 `methods` 对象中定义方法
		  methods: {
				say: function (message) {
				      alert(message);
				}
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


