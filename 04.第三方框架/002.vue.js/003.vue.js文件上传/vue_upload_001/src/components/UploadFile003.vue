<template>
  <div class="hello">
    <ul>
      <br>
      <li>
      
      <!-- 示例三
      选择文件，点击上传，才开始。
      -->
      		<!--

 
      		 -->
			 <el-upload
			    :limit="1"
			    ref="upload"
			    
			    :file-list="fileList"
			    :before-upload="beforeUpload"
			    action="doUpload"
			    class="upload-demo"
			    >
			    
			<el-button slot="trigger" size="small" type="primary">
			选取文件
			</el-button>

			<!-- 可选一个下载模析的连接
			<a href="./static/moban.xlsx" rel="external nofollow" download="模板">
				<el-button size="small" type="success">下载模板
				</el-button>
			</a>
			 -->
			
			
			<div slot="tip" class="el-upload__tip">
				只能上传excel文件，且不超过5MB
			</div>
			
			<div slot="tip" class="el-upload-list__item-name">{{fileName}}
			</div>

			</el-upload>

			<span slot="footer" class="dialog-footer">
				
				
				<el-button 
				size="small"
				style="margin: 10px 10px 10px 10px;" 
				@click="visible = false"
				>
				取消
				</el-button>
				<el-button 
				size="small"
				type="success" 
				style="margin: 10px 10px 10px 10px;" 
				@click="submitUpload()">
				确定
				</el-button>
				
				
			</span>
 

      </li>
    </ul>
 
  </div>
</template>

<script>

import { strRebuildBySplit, lastSubstring } from '@/utils/test002/strUtil'
import { message } from '@/utils/test002/message'


import { uploadFile_x } from "@/utils/test002/uploadFile002";
 
export default {
	 data() {
		 return {
 			fileName: "",
 			fileList: [],
 			http: require('http')
		 }
	 },
	 methods: {
	 	
	 	/**
	 	上傳之前調用
	 	*/
		beforeUpload(file){
			//debugger
			
			console.log(file,'文件');
			
			this.files = file;
			
			const extension = file.name.split('.')[1] === 'xls'
			
			const extension2 = file.name.split('.')[1] === 'xlsx'
			
			const isLt2M = file.size / 1024 / 1024 < 5
			
			if (!extension && !extension2) {
			 	this.$message.warning('上传模板只能是 xls、xlsx格式!')
			 	return
			}
			
			if (!isLt2M) {
				 this.$message.warning('上传模板大小不能超过 5MB!')
				 return
			}
			
			this.fileName = file.name;
			
			return false // 返回false不会自动上传
		},
		//手动上传确认提交
		submitUpload() {
 
			//debugger
			
			console.log('上传'+this.files)
			console.log('上传'+this.fileName)
			
			if(this.fileName == ""){
				 this.$message.warning('请选择要上传的文件！')
				 return false
			}
			
			let fileFormData = new FormData();

			//filename是键，file是值，就是要传的文件， 
			console.log( this.files + "————————" + this.fileName);
			
			
			//注意：后台接受的时候，参数名字也必须加  'files' 不能是 'file' 或其它
			fileFormData.append('files', this.files);
			
			let requestConfig = {
				 headers: {
				 	'Content-Type': 'multipart/form-data'
				 }
			}
			
			console.log("start...");
			/**
			 *  vue中的http服务需要引入一个叫vue−resource.js的文件，因为vue.js中没有 http服务，下载vue-resource.js 然后引进项目即可。
			 *  
			 *	 （1）. 安装 npm install vue-resource
			 *   （2）. 在main.js中配置import VueResource from 'vue-resource';  
			 *	 （3）. Vue.use(VueResource) 方法启用插件
			 *    不过，现在VUE官方推荐使用axios。
			 */
			this.$http.post( 'http://localhost:8081/uploadFile', 
							fileFormData,requestConfig
			).then((res) => {
					//debugger
					if (data && data.code === 0) {
							 this.$message({
								 message: '操作成功',
								 type: 'success',
								 duration: 1500,
								 onClose: () => {
									 this.visible = false
									 this.$emit('refreshDataList')
								 }
							 })
					 } else {
					 		this.$message.error(data.msg)
					 }
			},function(res){
                            console.log('失败')
            })
            
		}
	 }
}
</script>


<style scoped>
</style>

