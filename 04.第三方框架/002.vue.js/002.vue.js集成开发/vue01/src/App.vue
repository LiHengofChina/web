<template>
  <div class="app">
    <img src="./assets/logo.png">
    
    <!-- 通过这个标签，把路由中的内容包含进来了
    面在路由中再导入了最后的显示页面。
     -->
    <router-view/>
    
  </div>
</template>

<script>
export default {
	  name: 'App',
	  data(){
	  	return {
	  		 lihengx: false,
	  	}
	  }
}
</script>

<style>
.app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
