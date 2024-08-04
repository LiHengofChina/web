<template>
    <el-dialog 
        :visible.sync="visible"
        @close="$emit('update:show', false)"
        :show="show"
        class="mftcc-table-dialog"
        :width="option.width||'1000px'"
        @open="opened"
        ref="dialog"
        :close-on-click-modal="false"
        :title="option.title||title">
        <div class="dialog-content">
            <template v-if="(option.formId && option.search !== false)?true:false">
                <div class="mftcc-search-form">
                    <el-row>
                        <el-col :span="20">
                        <div class="custom-search">
                            <mftcc-search-form 
                                :formId="option.formId" 
                                :parentVm="parentVm"  
                                ref="searchForm">
                            </mftcc-search-form> 
                        </div>
                        </el-col>
                        <el-col :span="4">
                        <div class="search-button">
                            <el-button type="primary" @click="onSearch">查询</el-button>
                        </div>
                        </el-col>
                    </el-row>
                </div>
            </template>
            <div class="mftcc-dialog-content">
                <mftcc-table 
                    :tableId="option.tableId" 
                    :parentVm="parentVm" 
                    :initData="initData" 
                    :initSearchData="initSearchData" 
                    @current-change="currentChange"
                    @selection-change="$emit('selection-change', $event)"
                    ref="dialogList">
                </mftcc-table> 
            </div>
        </div>
        <div slot="footer" class="dialog-footer" v-if="option.footer === false?false:true">
            <el-button type="primary" @click="submit">确 定</el-button>
            <el-button @click="visible = false">取 消</el-button>
        </div>
    </el-dialog>
</template>
<script>
import {postJson} from '../axios'
import mftccTable from '../components/mftccTable'
import formUtil from '../utils/formUtil'
import mftccSearchForm from '../components/mftccSearchForm'
  export default {
    data() {
      return {
          title: "列表筛选器",
          initData: {},
          visible: this.show,
          initSearchData: "",
          isEmpty: formUtil.isEmpty
      }
    },
    props: ["show","option","parentVm"],
    watch: {
        show () {
            let _this = this
            _this.visible = _this.show;
            if(_this.visible === true){
                if(_this.option.type === "radio"){
                    _this.$set(_this.initData,"isSelect",false)
                }else{
                    _this.$set(_this.initData,"isSelect",true)
                }
                _this.$set(_this.initData,"tableData",_this.option.data)
                _this.$set(_this.initData,"isPagination",_this.option.isPagination)
                _this.$set(_this.initData,"url",_this.option.url)
                _this.initSearchData = _this.option.initSearchData || {}
                
                 _this.$nextTick(() => {
                     if(_this.option.search !== false && !_this.isEmpty(_this.option.formId)){
                        _this.$refs.searchForm.initForm()
                        let searchData = _this.$refs.searchForm.getFormValue() || {};
                        for(let i in searchData){
                            _this.initSearchData[i] = searchData[i]
                        }
                     }
                    _this.$refs.dialogList.initTable(function(){
                        setTimeout(function() {
                            for(let i in _this.option.value){
                                if(_this.option.type === "radio" && _this.option.value[i].key !== undefined){
                                    _this.$refs.dialogList.setCurrentValue(_this.option.value[i].key,_this.option.value[i].value)
                                }else if(_this.option.value[i].key !== undefined){
                                    _this.$refs.dialogList.setSelectValue(_this.option.value[i].key,_this.option.value[i].value)
                                }
                            }
                        },0)
                    })
                })
            }
        },
        option:{//深度监听，可监听到对象、数组的变化
            handler(val, oldVal){
                
            },
            deep:true //true 深度监听
        }
    },
    created(){
        
    },
    methods: {
        getFormRef(callback){
           this.$nextTick(() => {
               if(typeof callback === 'function'){
                    callback(this.$refs.searchForm)
                }
           })
        },
        currentChange(currentRow, oldCurrentRow){
            this.$emit("current-change", currentRow, oldCurrentRow);
        },
        onSearch(){
            let data = this.$refs.searchForm.getFormValue()
            this.$refs.dialogList.search(data);
        },
        submit(){
            let value = [];
            if(this.option.type === "radio"){
                value = this.$refs.dialogList.getCurrentValue()
            }else{
                value = this.$refs.dialogList.getSelectValue()
            }
            this.$emit('callback', value);
            this.visible = false;
        },
        opened(){
            this.$refs.dialog.$el.children[0].style.height = this.option.height||'600px';
        }
    },
    components: {
        mftccTable,
        mftccSearchForm
    }
  }
</script>
<style>
.mftcc-table-dialog .search_form_div{
    display: flex;
    align-items: flex-start;
}
.mftcc-table-dialog .dialog-content{
    height: 100%;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
}

.mftcc-table-dialog .mftcc-search-form .search-button button{
    float: right;
}
.mftcc-table-dialog .mftcc-dialog-content{
    flex-grow: 1;
    display: flex;
}
.mftcc-table-dialog .el-dialog{
    display: flex;
    flex-direction: column;
}
.mftcc-table-dialog .el-dialog__body{
    flex-grow: 1;
    height: 100%;
}
</style>