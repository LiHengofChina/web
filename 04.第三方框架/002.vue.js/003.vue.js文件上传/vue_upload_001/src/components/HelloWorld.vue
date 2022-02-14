<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2>Essential Links</h2>
    <ul>
      <br>
      <li>
			<div class="addFile">
				 <!-- 上传文件的容器，通过css让它不显示出来 -->
				 <input type="file" 
				 	 ref="fileBtn"  id="uploadFile"
				 	 :hidden="my_hidden"
				      @change="getFile($event)"       
				      multiple="multiple"      />
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
		   
		   console.log("______________uploading__________");
		   /**
		   uploadImg(file).then(res => {
		      
		          //   ...
		          document.getElementById("uploadFile").value = null;
		             
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
