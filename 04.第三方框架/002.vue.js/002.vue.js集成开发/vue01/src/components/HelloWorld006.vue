

<template  >
	  <div class="hello">
		    <hr/>
				 <ol>
				    <li v-for="site in sites">
				      {{ site.name }}
				    </li>
				  </ol>
		 
		    <hr/>
		    
		    

			  		<template v-for="site in sites">
						<li>{{ site.name }}</li>
						<li>--------------</li>
		  			</template>
			 		  		      
			 		<hr/>
			 		
					<ul>
					   <li v-for="value in object">
					   {{ value }}
					   </li>
					</ul>
					
					
			 		<hr/>
					 <ul>
					   <li v-for="(value, key) in object">
					   {{ key }} : {{ value }}
					   </li>
					 </ul>	
					 
					 				
			 		<hr/>
					<ul>
					  <li v-for="(value, key, index) in object">
					   {{ index }}. {{ key }} : {{ value }}
					  </li>
					</ul>					
					
					<hr/>
					<ul>
						   <li v-for="n in 10">
						    {{ n }}
						   </li>
					</ul>	
			  </div>
		</template>
<script>
	export default {
	  name: 'HelloWorld',
	  data(){
	    return {
		sites: [
				      { name: 'Runoob' },
				      { name: 'Google' },
				      { name: 'Taobao' }
		     ],
		     
		     
		    object: {
		      name: '李恒教程',
		      url: 'http://www.liheng.com',
		      slogan: '学的不仅是技术，更是梦想！'
		    }		     
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
