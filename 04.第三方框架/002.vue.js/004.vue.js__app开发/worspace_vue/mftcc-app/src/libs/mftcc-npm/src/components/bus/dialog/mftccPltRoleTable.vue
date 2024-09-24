<template>
  <el-dialog :visible.sync="visible"
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
             :title="doption.title">
    <div class="dialog-content">
      <div class="mftcc-dialog-content">
        <mftcc-table v-if="tableShow"
                     tableId="sys/pltRoleList"
                     :parentVm="parentVm"
                     :initOption="initData"
                     :initSearchData="initSearchData"
                     @current-change="currentChange"
                     @selection-change="$emit('selection-change', $event)"
                     @initCallBack="initCallBack"
                     ref="dialogList">
        </mftcc-table>
      </div>
    </div>
    <div slot="footer"
         class="dialog-footer"
         v-if="doption.footer">
      <el-button type="primary"
                 @click="submit">{{
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
        initData: {},
        visible: this.show,
        initSearchData: {},
        tableShow: false
      };
    },
    props: {
      show: {
        type: Boolean,
        default() {
          return false;
        }
      },
      parentVm: {
        type: Object,
        default() {
          return null;
        }
      },
      option: {
        type: Object,
        default() {
          return {};
        }
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
            title: "选择角色",
            isPagination: true,
            confirmButtonText: "确 定",
            cancelButtonText: "取 消"
          },
          this.option
        );
      }
    },
    watch: {
      show() {
        this.visible = this.show;
        if (this.visible === true) {
          this.initData = {};
          if (this.doption.type === "radio") {
            this.$set(this.initData, "isSelect", false);
            this.$set(this.initData, "isRadio", true);
          } else {
            this.$set(this.initData, "isSelect", true);
          }
          if (this.doption.initSearchData) {
            this.$set(this.initData, "initSearchData", this.doption.initSearchData);
          }
          if (this.doption.customUrl) {
            this.$set(this.initData, "url", this.doption.customUrl);
          }
          this.$set(this.initData, "isPagination", this.doption.isPagination);
          this.$set(this.initData, "isDynamicQuery", this.doption.search);

          this.tableShow = true;
        } else {
          this.tableShow = false;
        }
      }
    },
    methods: {
      initCallBack() {
        for (let i in this.doption.value) {
          if (this.doption.type === "radio" && this.doption.value[i].key !== undefined) {
            this.$refs.dialogList.setCurrentValue(this.doption.value[i].key, this.doption.value[i].value);
          } else if (this.doption.value[i].key !== undefined) {
            this.$refs.dialogList.setSelectValue(this.doption.value[i].key, this.doption.value[i].value);
          }
        }
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
        this.$emit("callback", value);
        this.visible = false;
      },
      opened() {
        this.$refs.dialog.$el.children[0].style.height = this.doption.height;
      }
    }
  };
</script>
