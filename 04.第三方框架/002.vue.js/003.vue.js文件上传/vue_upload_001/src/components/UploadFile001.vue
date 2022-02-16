<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2>Essential Links</h2>
    <ul>
      <br>
      <li>
			 <div class="addFile">
				 <!-- 上传文件的容器，通过css让它不显示出来 
				  accept="image/*"    			限制上传文件的类型，不写就表示所有文件都支持
				  @change="getFile($event)"		上传文件时触发事件
				  multiple="multiple" 			是否支持多个文件上传
				 -->
				 <input type="file" 
				 	 ref="fileBtn"  id="uploadFile"
				 	 :hidden="my_hidden"
				      @change="getFile($event)"       
				      multiple="multiple"      />
				  <!-- 上传按钮 -->
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
	      msg: 'Upload File!',
	      my_hidden: 'hidden'
	    }
  },
  methods:{
	  	trigger() {
	  			//通过这个方法选择文件
	      		this.$refs.fileBtn.dispatchEvent(new MouseEvent("click"));
	    },
	    
	    //当选择了文件之后，会自动调用这个方法，开始上传文件。
		getFile(event) {
		   let file = event.target.files[0];
		   
		   console.log("______________uploading__________"+event.target.files[0]);
		   console.log("______________uploading__________"+event.target.files[1]);
		   console.log("______________uploading__________"+event.target.files[2]);
		   console.log("______________uploading__________"+event.target.files[3]);
		   /**
		   uploadImg(file).then(res => {
		      
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
