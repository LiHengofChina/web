<template>
  <div class="hello">
    <ul>
      <br>
      <li>
      
      <!-- 示例二：  选择文件，点击上传，才开始。
      		使用 element-ui 控件 +  axios 上传
      -->
      
      <!--

limit： 限制文件个数 1 个
on-remove： 移除附件时的钩子函数， 
on-error： 用于处理上传异常后的处理，本人这主要用来关闭弹窗和全屏等待

file-list： 绑定附件

auto-upload： 禁止自动上传，true 的话选了文件就自动上传


//这是以前网络上的原话，有待考证。TODO
http-request： 自定义上传文件请求方法，默认方法会与 mock 产生 XmlRequest 重新生成导致找不到文件问题，我注释了 mock 还是那样，没具体研究
action： 原上传文件的路径，由于使用了自定义上传文件请求，即 http-request，因此这个字段随便写就好，不写不行好像

      		 -->
	<el-upload
		 :limit="1"
		 :on-remove="handleRemove"
		 :on-error="onError"
		 ref="upload"
		 
		 :file-list="fileList"
		 
		 :auto-upload="false"
		 
		 :http-request="uploadFileLiHeng"

		 action="https://jsonplaceholder.typicode.com/posts/"
		 
		 class="upload-demo">
		 
		 
		 <el-button slot="trigger" size="small" type="primary">
		 选取文件
		 </el-button>
		 
		 
		 <!-- 一个普通的Button，点击时触发它的事件，在事件中引用上面的资源，进行上传操作。-->
		 <el-button 
			style="margin-left: 10px;" 
			size="small"
			type="success" 
			@click="submitUpload">
			上传到服务器
		 </el-button> 

		 <!-- 提示语句 -->
	 	 <div slot="tip" 
	 	 	class="el-upload__tip">支持上传 {{ strRebuild(fileType) }} 格式，且不超过 {{ fileSize }}M
	 	 </div>
	 	 
	</el-upload>
 

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
			 //上传文件大小
			 fileSize: 10,
			 // 允许的文件类型
			 fileType: ['xls', 'xlsx', 'pdf', 'doc', 'docx', 'txt', 'jpg', 'png', 'jpeg'],

			 
			 // 附件列表
			 fileList: [],
			 // 运行上传文件大小，单位 M
		 }
	 },
	 methods: {
		 // 移除附件
		 handleRemove(file, fileList) {
		 	console.log('移除附件...')
		 },
		 // 附件上传失败，打印下失败原因
		 onError(err) {
			 message('error', '附件上传失败')
			 console.log(err)
		 },
		 // 字符串重组
		 strRebuild(str) {
		 	return strRebuildBySplit(str,'、');
		 	//return strRebuildBySplit(str)
		 },
		 // 清空表单
		 clear() {
			 // 清空附件
			 this.$refs.upload.clearFiles()
		 },
		 /**
		  *（2）.检查文件
		  * 检查文件类型 和 文件大小。
		  */
		 checkFile() {
			 var flag = true
			 var tip = ''
			 var files = this.$refs.upload.uploadFiles
			 files.forEach(item => {
				 // 文件过大
				 if (item.size > this.fileSize * 1024 * 1024) {
					 flag = false
					 tip = ' 文件超过' + this.fileSize + 'M'
				 }
				 // 文件类型不属于可上传的类型
				 if (!this.fileType.includes(lastSubstring(item.name, '.'))) {
					 flag = false
					 tip = ' 文件类型不可上传'
				 }
			 })
			 if (!flag) {
			 	message('error', tip)
			 }
			 return flag
		 },
		 /**
		 * （1）.点击上传，先走upload方法
		 */
		 submitUpload() {
			 if (this.checkFile()) {
			 	console.log('上传附件...')
				this.$refs.upload.submit()
				 
			 } else {
			 	console.log('取消上传')
			 }
		 },
		 /**
		  * （3）. 真实开始上传。
		  */
		 uploadFileLiHeng(file) {
		  	 
		  	 //alert(uploadFile_);
		  	 
			 // 把文件放入 FormData 进行提交
			 const param = new FormData()
			 
			 //注意：后台接受的时候，参数名字也必须加  'files' 不能是 'file' 或其它
			 param.append('files', file.file)



			 uploadFile_x(param).then(response => {
				 // TODO 一些关闭弹框，上传成功提示等
				 
			 })
			 
		 }

	 }
}
</script>


<style scoped>
</style>

