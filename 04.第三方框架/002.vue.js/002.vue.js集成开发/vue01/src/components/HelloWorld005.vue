

<template  >
	  <div class="hello">
	  
	  
			<template v-if="liheng" >
				  <h1>李恒教程</h1>
			      <p>学的不仅是技术，更是梦想！</p>
			      <p>哈哈哈，打字辛苦啊！！！</p>
			</template>
			
		    <p v-if="seen">现在你看到我了</p>
		    <hr/>
				
			  	
		    <hr/>
				    <div v-if="Math.random() > 0.5">
				      Sorry
				    </div>
				    <div v-else>
				      Not sorry
				    </div>
	 		
	 		
	 		<hr/>	  
	 		
				 	<div v-if="type === 'A'">
				      A
				    </div>
				    <div v-else-if="type === 'B'">
				      B
				    </div>
				    <div v-else-if="type === 'C'">
				      C
				    </div>
				    <div v-else>
				      Not A/B/C
				    </div>
	 		  		      
	 		<hr/>
	 			    <h1 v-show="ok">Hello!</h1>
		     
	  </div>
</template>
<script>
	export default {
	  name: 'HelloWorld',
	  data () {
	    return {
	    
	    liheng: true,
	
		seen: true ,
	    ok: true,
	    
	    type: 'C'
	    
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
