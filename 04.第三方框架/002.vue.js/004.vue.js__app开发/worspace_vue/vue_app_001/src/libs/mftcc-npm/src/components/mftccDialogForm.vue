<template>
    <el-dialog 
        :visible.sync="visible"
        @close="$emit('update:show', false)"
        :show="show"
        class="form-dialog"
        :width="width||'1000px'"
        @open="opened"
        ref="dialog"
        :fullscreen="fullscreen||false"
        :close-on-click-modal="false"
        :center="center||false">
        <div slot="title" class="dialog-header">
           {{ title||"form表单" }}
        </div>
        <div class="dialog-content">
            <mftcc-form :formId="formId" :parentVm="parentVm" ref="dialogForm"></mftcc-form> 
        </div>
        <div slot="footer" class="dialog-footer" v-if="footer === false?false:true">  
            <el-button type="primary" @click="submit">{{confirmButtonText||"确 定"}}</el-button>
            <el-button @click="visible = false">{{cancelButtonText||"取 消"}}</el-button>
        </div>
    </el-dialog>
</template>
<script>
import mftccForm from '../components/mftccForm'
  export default {
    data() {
      return {
          visible: this.show
      }
    },
    props: ["show","width","height","fullscreen","center","formId","parentVm","footer","title","confirmButtonText","cancelButtonText"],
    watch: {
        show () {
            this.visible = this.show;
        },
    },
    created(){
        
    },
    methods: {
        getFormRef(callback){
           this.$nextTick(() => {
               if(typeof callback === 'function'){
                    callback(this.$refs.dialogForm)
                }
           })
        },
        submit(){
            var value = this.$refs.dialogForm.getFormValue();
            this.$emit('callback', value);
        },
        opened(){
            this.$refs.dialog.$el.children[0].style.height = this.height||'600px';
        }
    },
    components: {
        mftccForm
    }
  }
</script>
<style>
.form-dialog .el-dialog{
    display: flex;
    flex-direction: column;
}
.form-dialog .el-dialog__body{
    flex-grow: 1;
    overflow: auto;
    padding-top: 10px;
}
</style>