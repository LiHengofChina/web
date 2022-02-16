<template>
  <div class="hello">
    <ul>
      <br>
      <li>
      
      
      
      		<!--   
limit： 限制文件个数 1 个
on-remove： 移除附件时的钩子函数，主要就 console 输出下
on-error： 用于处理上传异常后的处理，本人这主要用来关闭弹窗和全屏等待
file-list： 绑定附件
auto-upload： 禁止自动上传，true 的话选了文件就自动上传
http-request： 自定义上传文件请求方法，默认方法会与 mock 产生 XmlRequest 重新生成导致找不到文件问题，我注释了 mock 还是那样，没具体研究
action： 原上传文件的路径，由于使用了自定义上传文件请求，即 http-request，因此这个字段随便写就好，不写不行好像

      		 -->
	<el-upload
		 ref="upload"
		 :limit="2"
		 :on-remove="handleRemove"
		 :on-error="onError"
		 :file-list="fileList"
		 :auto-upload="false"
		 :http-request="uploadFile"
		 action="https://jsonplaceholder.typicode.com/posts/"
		 class="upload-demo">
		 <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
		 <!-- <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button> -->
	 <div slot="tip" class="el-upload__tip">支持上传 {{ strRebuild(fileType) }} 格式，且不超过 {{ fileSize }}M</div>
	</el-upload>


      </li>
    </ul>
 
  </div>
</template>

<script>

import { strRebuild, lastSubstring } from '@/utils/strUtil'
import { message } from '@/utils/message'
 
export default {
	 data() {
		 return {
			 // 附件列表
			 fileList: [],
			 // 允许的文件类型
			 fileType: ['xls', 'xlsx', 'pdf', 'doc', 'docx', 'txt', 'jpg', 'png', 'jpeg'],
			 // 运行上传文件大小，单位 M
			 fileSize: 10,
		 }
	 },
	 methods: {
		 // 清空表单
		 clear() {
			 // 清空附件
			 this.$refs.upload.clearFiles()
		 },
		  
		 // 附件检查
		 // 检查附件是否属于可上传类型
		 // 检查附件是否超过限制大小
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
		  
		 // 提交附件
		 submitUpload() {
			 if (this.checkFile()) {
			 	console.log('上传附件...')
				 this.$refs.upload.submit()
			 } else {
			 	console.log('取消上传')
			 }
		 },
		 
		 // 自定义文件上传方法
		 uploadFile(file) {
			 // 把文件放入 FormData 进行提交
			 const param = new FormData()
			 param.append('files', file.file)
			 uploadFile(param).then(response => {
			 // TODO 一些关闭弹框，上传成功提示等
			 })
		 },
		 
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
		 	return strRebuild(str)
		 }
	 }
}
</script>


<style scoped>
</style>

