<template>
  <div class="hello">
    <hr/>
    <h1>site : {{site}}</h1>
    <h1>url : {{url}}</h1>
    <h1>Alexa : {{alexa}}</h1>
    
    <hr/>
    <h1>{{details()}}</h1>
    <hr/>
  </div>
</template>
<script>
	export default {
	  name: 'HelloWorld',
	  data () {
	    return {
		  site: "绑定方法中的数据",
		  url: "www.liheng.com",
		  alexa: "10000"
	      
	    }
	  },
	  methods: {
	            details: function() {
	                return  this.site + " - 学的不仅是技术，更是梦想！";
	            }
	  }
	}
</script>
<style scoped>
	h1, h2 {
	  font-weight: normal;
	}
	ul {
	  list-style-type: none;
	  padding: 0;
	}
	li {
	  display: inline-block;
	  margin: 0 10px;
	}
	a {
	  color: #42b983;
	}
</style>
