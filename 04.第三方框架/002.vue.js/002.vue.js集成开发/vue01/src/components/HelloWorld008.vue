

<template  >
	  <div class="hello">
		
		    
		    <hr/>
			 	<p style = "font-size:25px;">计数器: {{ counter }}</p>
   			 	<button @click="counter++" style = "font-size:25px;">点我</button>
		    
		    <hr/>
				千米 : <input type = "text" v-model = "kilometers">
				米 : <input type = "text" v-model = "meters">



	  </div>
	  
</template>
<script>
	export default {
		  name: 'HelloWorld',
		  data(){
			    return {
				     counter: 1,
					 
					 kilometers : 0,
					 meters:0				     
				     
			    }
		  },
		  

		  watch : {
				  /**
				  另一种写法：
				  	var vm = new Vue({....
				    vm.$watch('counter', function(nval, oval) {
					    alert('计数器值的变化 :' + oval + ' 变为 ' + nval + '!');
					});
				  */
		  		counter: function(nval, oval) {
		  			  alert('计数器值的变化 :' + oval + ' 变为 ' + nval + '!');
		  		},
		  		
		  		  /** $watch 是一个实例方法
				      vm.$watch('kilometers', function (newValue, oldValue) {
					    // 这个回调将在 vm.kilometers 改变后调用
					    document.getElementById ("info").innerHTML = "修改前值为: " + oldValue + "，修改后值为: " + newValue;
					});
					*/		  		
   				kilometers:function(val) {
            		this.kilometers = val;
            		this.meters = this.kilometers * 1000
        		},
		        meters : function (val) {
		            this.kilometers = val/ 1000;
		            this.meters = val;
		        }
		  		
		  }
		  
		 
		  
	}

	
</script>

<style scoped>
</style>


