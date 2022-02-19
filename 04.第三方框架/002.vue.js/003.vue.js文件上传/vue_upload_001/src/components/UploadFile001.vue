<template>
  <div class="hello">
    <ul>
      <br>
      <li>
      
				 <!-- 示例一：
				 自己写的input上传框子
				 选择文件就开始上传 
				 -->
				 
			 <div class="addFile">
				 <!-- 上传文件的容器，通过css让它不显示出来 
				 说明：
				  accept="image/*"    			限制上传文件的类型，不写就表示所有文件都支持
				  @change="getFile($event)"		上传文件时触发事件
				  multiple="multiple" 			是否支持多个文件上传
				  ref="fileBtn_liheng"     表示如果要引用这个inpu，就要使用这个名字 $refs.fileBtn_liheng
				  						  //dispatchEvent 函数就是用来触发某个事件
				  						  // new MouseEvent("click")  产生一个点击事件
				  				
				 -->
				 <input type="file" 
				 	 ref="fileBtn_liheng"  
				 	 id="uploadFile"
				 	 :hidden="my_hidden"
				      @change="getFile($event)"       
				      multiple="multiple"      />
				  <!-- （1）.  点击"上传按钮"时调用 trigger 方法， 个 -->
				 <button @click="trigger">Upload</button>
			 </div>
      </li>
    </ul>
 
  </div>
</template>

<script>


 
export default {
  name: 'HelloWorld',
  data () {
	    return {
	      my_hidden: 'hidden' //隐藏文本框
	    }
  },
  methods:{
	  	trigger() {
	  			//（2）.通过这个方法，触发真正的“点击上传框子”。
	      		this.$refs.fileBtn_liheng.dispatchEvent(new MouseEvent("click"));
	    },
	    
	    //（3）. 当input框发生改变时（选择了文件之后），自动调用这个方法。
		getFile(event) {
		
		   let file = event.target.files[0];
		   
 
			
		   /**
		    * （4）. 真实开始上传。
		    *
		   fileImport(file).then(res => {
		      
		          //   ...
		          document.getElementById("uploadFile").value = null;
		          //在上传文件成功后，将这个文件的value置为null，因为不清空这个input的value，是不能重复上传相同的文件，原因是input的value值不变，change事件不识别文件有变化。

		      }).catch(error => {
		      
		      //     ...
		      
		   });
		   */
		   
		   
		}	    
	    
  }
}
</script>
<style scoped>
</style>
