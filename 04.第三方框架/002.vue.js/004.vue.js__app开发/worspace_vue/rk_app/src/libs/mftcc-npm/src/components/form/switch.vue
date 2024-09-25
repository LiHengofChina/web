<template>
  <el-switch
    v-model="compValue"
    :active-value="
      isEmpty(props.switchValue.activeValue) ? 0 : props.switchValue.activeValue
    "
    :inactive-value="
      isEmpty(props.switchValue.inActiveValue)
        ? 1
        : props.switchValue.inActiveValue
    "
    :active-text="props.switchValue.activeText"
    :inactive-text="props.switchValue.inActiveText"
    :placeholder="isEmpty(props.placeholder) ? '' : props.placeholder"
    :disabled="isEmpty(props.disabled) ? false : props.disabled"
    :readonly="isEmpty(props.readOnly) ? false : props.readOnly"
    :class="{
      readonly: isEmpty(props.readOnly) ? false : props.readOnly,
      'mf-switch': autoWidth
    }"
    v-on="event"
    @change="changeSwitch"
  >
  </el-switch>
</template>
<script>
import formUtil from "../../utils/formUtil";
export default {
  data() {
    return {
      isEmpty: formUtil.isEmpty,
      autoWidth: false
    };
  },
  computed: {
    compValue: {
      get() {
        if (this.props.pkType === "table" && this.isSearch == false) {
          this.props.disabled = this.props.switchValue.readOnly;
        }
        this.change(this.value);
        return this.value;
      },
      set(val) {
        if (this.props.pkType === "table") {
          this.props.readOnly = this.props.switchValue.readOnly;
          this.$emit("returnBack", val);
        } else if (!this.props.disabled && !this.props.readOnly) {
          this.$emit("returnBack", val);
        }
      }
    }
  },
  model: {
    prop: "value", //值可以随意命名
    event: "returnBack" //方法也可以随意命名
  },
  props: {
    value: {},
    event: Object,
    props: {
      type: Object,
      default() {
        return {};
      }
    },
    isSearch: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  methods: {
    changeSwitch(value){
      this.change(value);
      this.$emit("change", value);
    },
    change(value) {
      if (
        value == this.props.switchValue.activeValue &&
        this.props.switchValue.activeText
      ) {
        this.autoWidth = true;
      } else if (
        value == this.props.switchValue.inActiveValue &&
        this.props.switchValue.inActiveText
      ) {
        this.autoWidth = true;
      } else {
        this.autoWidth = false;
      }
      if (this.isSearch) {
        this.props.disabled = false;
      }
    }
  }
};
</script>
<style>
/* switch按钮样式 */
.el-switch__label {
  display: none;
  color: #fff !important;
}
/*打开时文字位置设置*/
.mf-switch .el-switch__label--right {
  z-index: 1;
}
/* 调整打开时文字的显示位子 */
.mf-switch .el-switch__label--right span {
  margin-right: 20px;
  padding-left: 8px;
}
/*关闭时文字位置设置*/
.mf-switch .el-switch__label--left {
  z-index: 1;
}
/* 调整关闭时文字的显示位子 */
.mf-switch .el-switch__label--left span {
  margin-left: 20px;
  padding-right: 8px;
}
/*显示文字*/
.mf-switch .el-switch__label.is-active {
  display: block;
}
/* 调整按钮的宽度 */
.mf-switch.el-switch .el-switch__core {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.mf-switch.el-switch .el-switch__core,
.el-switch .el-switch__label {
  width: auto !important;
  margin: 0;
}
</style>
