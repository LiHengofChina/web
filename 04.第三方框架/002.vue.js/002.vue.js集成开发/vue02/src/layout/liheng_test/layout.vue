<template>
  <div id="app">
   	
   	<el-header height="50px">
   		<HeadBar></HeadBar>
   	</el-header>
   	
   	
   	<el-container>
   	
   		<el-aside width="200px" >
   			<SlideBar></SlideBar>
   		</el-aside>
   		
   		<el-main>
   			<AppMain></AppMain>
   		</el-main>

   	</el-container>
  </div>
</template>

<script>
 	import {HeadBar,SlideBar,AppMain} from './components'
 	export default{
 		components:{
 				HeadBar,
 				SlideBar,
 				AppMain
 		}
 	}
</script>

<style>
 
</style>
