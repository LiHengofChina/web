<template>
  <el-dialog
    :visible.sync="visible"
    @close="$emit('update:show', false)"
    :show="show"
    class="form-dialog"
    :width="doption.width"
    @open="opened"
    ref="dialog"
    append-to-body
    :fullscreen="doption.fullscreen"
    :close-on-click-modal="false"
    :center="doption.center"
  >
    <div slot="title" class="dialog-header">
      {{ doption.title }}
    </div>
    <div class="dialog-content">
      <mftcc-form
        v-if="formShow"
        :formId="doption.formId"
        :parentVm="parentVm"
        ref="dialogForm"
      ></mftcc-form>
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
      visible: this.show,
      formShow: false,
      form: null,
    };
  },
  props: {
    show: {
      type: Boolean,
      default() {
        return false;
      },
    },
    formId: {
      type: String,
      default: "",
    },
    width: {
      type: String,
      default: "1000px",
    },
    height: {
      type: String,
      default: "600px",
    },
    fullscreen: {
      type: Boolean,
      default: false,
    },
    center: {
      type: Boolean,
      default: false,
    },
    footer: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
      default: "表单",
    },
    confirmButtonText: {
      type: String,
      default: "确 定",
    },
    cancelButtonText: {
      type: String,
      default: "取 消",
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
  },
  computed: {
    doption() {
      let defaultProp = {
        formId: this.formId,
        width: this.width,
        height: this.height,
        fullscreen: this.fullscreen,
        center: this.center,
        footer: this.footer,
        title: this.title,
        confirmButtonText: this.confirmButtonText,
        cancelButtonText: this.cancelButtonText,
      };
      return Object.assign(defaultProp, this.option);
    },
  },
  watch: {
    show() {
      this.visible = this.show;
      if (this.visible === true) {
        this.formShow = true;
      } else {
        this.formShow = false;
      }
    },
  },
  created() {},
  methods: {
    getFormRef(callback) {
      this.$nextTick(() => {
        if (typeof callback === "function") {
          callback(this.$refs.dialogForm);
        }
      });
    },
    submit() {
      this.$refs.dialogForm.validateForm((valid) => {
        if (valid) {
          debugger;
          var value = this.$refs.dialogForm.getFormValue();
          this.$emit("callback", value);
        }
      });
    },
    opened() {
      this.$refs.dialog.$el.children[0].style.height = this.doption.height;
    },
  },
};
</script>
<style>
.form-dialog .el-dialog {
  display: flex;
  flex-direction: column;
}
.form-dialog .el-dialog__body {
  flex-grow: 1;
  overflow: auto;
  padding-top: 10px;
}
</style>
