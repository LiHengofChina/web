<template>
  <div class="hello">
    <ul>
      <br>
      <li>
      
      <!-- 示例四： 
      使用  v-file-upload  上传 TODO 未完成
      -->
 			<file-upload 
	 			:url='url' 
	 			:thumb-url='thumbUrl' 
	 			:headers="headers" 
	 			@change="onFileChange"
	 			@success="onSucess"
	 			@error="onError"
	 			accept="*"
	 			
	 			>
 				
 			</file-upload>
		 
<van-uploader v-model="fileList" :after-read="afterRead" :max-count="3" multiple></van-uploader>
      </li>
    </ul>
 
  </div>
</template>

<script>


import { FileUploadService } from 'v-file-upload';


export default {
	 data() {
		 return {
 			url: 'http://your-post.url',
 			headers: {'access-token': '<your-token>'},
      		filesUploaded: []
		 }
	 },
	 methods: {
 
		onFileChange(file){
			 this.fileUploaded = file;
			 console.log("文件改变");
		},
		thumbUrl(file){
			console.log("_____");
			 //return file.myThumbUrlProperty;
		},
	    onSucess() {
	      	this.error = ''
	      	this.success = true
	    },
	    onError(e) {
	      	this.error = e
	    }		
		 
	 }
}
</script>


<style scoped>
</style>

