<template>
    <el-upload
    class="upload-demo"
    :action="this.props.uploadUrl"
    :multiple="this.props.multiple"
    :data="this.props.fileData"
    :name="this.props.fieldName"
    :show-file-list="this.props.showFileList"
    :drag="this.props.drag"
    :accept="this.props.accept"
    :auto-upload="this.props.autoUpload"
    :limit="this.props.limit"
    :file-list="fileList"
    :on-preview="handlePreview"
    :on-remove="handleRemove"
    :before-remove="beforeRemove"
    :before-upload="beforeupload"
    :on-change="onChange"
    >
    <el-button size="small" type="primary" v-if="this.props.drag==false">点击上传</el-button>
    <div slot="tip" class="el-upload__tip">只能上传{{this.props.accept}}文件，且不超过500kb</div>
    </el-upload>
</template>
<script>
export default {
     data() {
        return {
            title:"标题",
            fileList: [],
            fileArr:[]
        }
    },
    props: {
        props: {
            type: Object,
            default() {
                return {};
            }
        },
        designer: {
            type: Boolean,
            default() {
                return false;
            }
        }
  },
  computed: {
    compValue: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("returnBack", val);
      },
    },
  },
  model: {
    prop: "value", //值可以随意命名
    event: "returnBack", //方法也可以随意命名
  },
  methods: {
      beforeupload(file){
        return false;
      },
      onChange(file,fileList){
        this.fileArr = [];
        for ( var i = 0; i <fileList.length; i++){
            this.fileArr.push(fileList[i])
        }
        this.compValue = this.fileArr;
      },
      handleRemove(file, fileList) {
          this.fileArr = [];
          for ( var i = 0; i <fileList.length; i++){
              this.fileArr.push(fileList[i])
          }
          this.compValue = this.fileArr;
      },
      handlePreview(file) {
        console.log(file);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
    }
}
</script>
<style>
.title_label{
    margin: 0 !important;
    border-radius: 0;
    background-color: #EDF2FA !important;
    color: rgba(20,20,20,1) !important;
    font-weight: 400;
}
.title_label .el-alert__title{
    font-size: 16px;
}
</style>