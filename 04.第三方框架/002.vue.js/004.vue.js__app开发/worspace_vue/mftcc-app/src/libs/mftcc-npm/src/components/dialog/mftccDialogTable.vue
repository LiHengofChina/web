<template>
  <el-dialog
    :visible.sync="visible"
    @close="$emit('update:show', false)"
    :show="show"
    class="mftcc-table-dialog"
    :width="doption.width"
    @open="opened"
    ref="dialog"
    append-to-body
    :fullscreen="doption.fullscreen"
    :center="doption.center"
    :close-on-click-modal="false"
    :title="doption.title"
  >
    <div class="dialog-content">
      <div v-if="dialogTips" class="mftcc-form-tips" style="width: 85%; padding-left: 0px;">
      <i class="el-icon-warning-outline"></i>
      <span>{{ dialogTips }}</span>
      </div>
      <div class="mftcc-dialog-content">
        <mftcc-table
          v-if="tableShow"
          :tableId="doption.tableId"
          :parentVm="parentVm"
          :initOption="initOption"
          :initSearchData="initSearchData"
          isButtonColor="1"
          @current-change="currentChange"
          @selection-change="$emit('selection-change', $event)"
          ref="dialogList"
          @initCallBack="initCallBack"
        >
        </mftcc-table>
      </div>
    </div>
    <div slot="footer" class="dialog-footer" v-if="doption.footer">
      <el-button type="primary" @click="submit">{{
        doption.confirmButtonText
      }}</el-button>
      <el-button @click="visible = false">{{ doption.cancelButtonText }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      initOption: {},
      visible: this.show,
      initSearchData: "",
      tableShow: false,
    };
  },
  props: {
    show: {
      type: Boolean,
      default() {
        return false;
      },
    },
    parentVm: {
      type: Object,
      default() {
        return null;
      },
    },
    option: {
      type: Object,
      default() {
        return {};
      },
    },
    isClose: {
      type: Boolean,
      default() {
        return true;
      },
    },
    dialogTips:{
      type: String,
      default() {
        return "";
      },
    }
  },
  computed: {
    doption() {
      return Object.assign(
        {
          width: "1000px",
          height: "600px",
          fullscreen: false,
          center: false,
          footer: true,
          title: "列表",
          confirmButtonText: "确 定",
          cancelButtonText: "取 消",
        },
        this.option
      );
    },
  },
  watch: {
    show() {
      let _this = this;
      _this.visible = _this.show;
      if (_this.visible === true) {
        if (_this.doption.type === "radio") {
          _this.$set(_this.initOption, "isSelect", false);
          _this.$set(_this.initOption, "isRadio", true);
        } else {
          _this.$set(_this.initOption, "isSelect", true);
          if (_this.doption.selectKey) {
            _this.$set(_this.initOption, "selectKey", _this.doption.selectKey);
          }
        }
        _this.$set(_this.initOption, "tableData", _this.doption.data);
        if (_this.doption.columns && _this.doption.columns.length > 0) {
          _this.$set(_this.initOption, "columns", _this.doption.columns);
        }
        if (_this.doption.initSearchData) {
          _this.$set(_this.initOption, "initSearchData", _this.doption.initSearchData);
        }
        _this.$set(_this.initOption, "isPagination", _this.doption.isPagination);
        let dynamicQuery = {
          prop: "dynamicQueryProp",
          fieldNames: [],
          fieldType: "dynamicQuery",
        };
        if (_this.doption.search) {
          _this.$set(_this.initOption, "isDynamicQuery", _this.doption.search);
          if (_this.doption.columns){
            _this.doption.columns.forEach((item) => {
              if (item.isShow) {
                dynamicQuery.fieldNames.push(item.prop);
              }
            });
            _this.$set(_this.initOption, "dynamicQuery", dynamicQuery);
          }
        } else {
          _this.$set(_this.initOption, "isDynamicQuery", _this.doption.search);
        }
        _this.$set(_this.initOption, "url", _this.doption.url);
        _this.initSearchData = _this.doption.initSearchData || {};

        _this.tableShow = true;
      } else {
        _this.tableShow = false;
      }
    },
  },
  methods: {
    getTableRef(callback) {
      this.$nextTick(() => {
        if (typeof callback === "function") {
          callback(this.$refs.dialogList);
        }
      });
    },
    currentChange(currentRow, oldCurrentRow) {
      this.$emit("current-change", currentRow, oldCurrentRow);
    },
    submit() {
      let value = [];
      if (this.doption.type === "radio") {
        // value = this.$refs.dialogList.getCurrentValue();
        value = this.$refs.dialogList.templateSelection;
      } else {
        value = this.$refs.dialogList.getSelectValue();
      }
      // this.$nextTick(() => {
      this.$emit("callback", value);
      // });
      if (this.isClose) {
        this.visible = false;
      }
    },
    opened() {
      this.$refs.dialog.$el.children[0].style.height = this.doption.height;
    },
    initCallBack() {
      for (let i in this.doption.value) {
        if (this.doption.type === "radio" && this.doption.value[i].key !== undefined) {
          this.$refs.dialogList.setCurrentValue(
            this.doption.value[i].key,
            this.doption.value[i].value
          );
        } else if (this.doption.value[i].key !== undefined) {
          this.$refs.dialogList.setSelectValue(
            this.doption.value[i].key,
            this.doption.value[i].value
          );
        }
      }
    },
  },
};
</script>
<style>
.mftcc-table-dialog .mftcc-form-search {
  padding: 0 20px;
}
.mftcc-table-dialog .search_form_div {
  display: flex;
  align-items: flex-start;
}
.mftcc-table-dialog .dialog-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.mftcc-table-dialog .mftcc-search-form .search-button button {
  float: right;
}
.mftcc-table-dialog .mftcc-dialog-content {
  flex-grow: 1;
  display: flex;
  padding-top: 0px !important;
}
.mftcc-table-dialog .el-dialog {
  display: flex;
  flex-direction: column;
}
.mftcc-table-dialog .el-dialog__body {
  flex-grow: 1;
  height: 100%;
}
</style>
