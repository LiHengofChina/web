<template>
  <el-input v-if="reload"
            ref="textarea"
            type="textarea"
            v-model="compValue"
            :placeholder="isEmpty(props.placeholder) ? '' : props.placeholder"
            :disabled="isEmpty(props.disabled) ? false : props.disabled"
            :readonly="isQuery === true ? true : isEmpty(props.readOnly) ? false : props.readOnly"
            :class="{ readonly: isEmpty(props.readOnly) ? false : props.readOnly }"
            v-on="event"
            :maxlength="props.maxlength"
            :autosize="autosize"
            :show-word-limit="isEmpty(props['show-word-limit']) ? true : props['show-word-limit']"
            clearable>
  </el-input>
</template>
<script>
  import formUtil from "../../utils/formUtil";
  export default {
    data() {
      return {
        reload: true,
        isEmpty: formUtil.isEmpty,
        autosize: { minRows: 2 },
        formDisabled: false
      };
    },
    computed: {
      formData() {
        return this.getFormData()
      },
      compValue: {
        get() {
          /* 数据脱敏 */
          if ((this.formDisabled || this.props.readOnly || this.props.disabled) && this.props.desensitization) {
            let dese = {
              desensitization: this.props.desensitization,
              front: this.props.desensitizationFront,
              after: this.props.desensitizationAfter
            };
            let value = this.value;
            value = formUtil.desensitization(value, dese);
            return value;
          } else {
            return this.value;
          }
        },
        set(val) {
          if (this.props.pkType === "table") {
            this.$emit("returnBack", val);
          } else if (!this.props.disabled && !this.props.readOnly) {
            this.$emit("returnBack", val);
          }
        },
      },
    },
    model: {
      prop: "value", //值可以随意命名
      event: "returnBack", //方法也可以随意命名
    },
    props: {
      value: {},
      event: Object,
      isQuery: Boolean,
      props: {
        type: Object,
        default() {
          return {};
        },
      },
    },
    inject: ["getFormData", "formItem", "option"],
    watch: {
      "props.isAutoRows": {
        handler(val, oldVal) {
          if (val) {
            this.autosize = { minRows: 2 };
          } else {
            this.autosize = {
              minRows: this.props.minRows || 3,
              maxRows: this.props.maxRows || 6,
            };
          }
          this.reload = false;
          this.$nextTick(() => {
            this.reload = true;
          });
        },
        immediate: true,
      },
      "props.minRows": {
        handler(val, oldVal) {
          this.autosize.minRows = this.props.minRows || 3;
          this.reload = false;
          this.$nextTick(() => {
            this.reload = true;
          });
        },
      },
      "props.maxRows": {
        handler(val, oldVal) {
          this.autosize.maxRows = this.props.maxRows || 6;
          this.reload = false;
          this.$nextTick(() => {
            this.reload = true;
          });
        },
      },
      reload: {
        handler(val, oldVal) {
          if (this.isQuery && val === true) {
            this.$nextTick(() => {
              this.$refs.textarea.$el.parentNode.style.height = "auto";
            });
          }
        },
      },
      "option": {
        handler(val, oldVal) {
          if (val && (val.formDisabled || val.query == "query")) {
            this.formDisabled = true;
          } else {
            this.formDisabled = false;
          }
        },
        deep: true,
        immediate: true,
      }
    },
  };
</script>
