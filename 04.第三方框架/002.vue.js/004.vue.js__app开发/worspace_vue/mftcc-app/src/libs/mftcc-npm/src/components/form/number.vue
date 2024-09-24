<template>
  <el-input-number
    v-model="compValue"
    :step="this.props.dateNumber"
    :max="this.props.dateMax"
    :min="this.props.dateMin"
    :precision="this.props.dateDouble"
    :controls-position="this.props.dateButton"
    :disabled="isEmpty(props.disabled) ? false : props.disabled"
    label="数字选择器"
  >
  </el-input-number>
</template>
<script>
import formUtil from "../../utils/formUtil";
export default {
  data() {
    return {
      isEmpty: formUtil.isEmpty,
      // dateNumber:{step : 1},
      // max : 100,
      // min : 0,
      // button : "left",
      // precision : 0
    };
  },
  computed: {
    compValue: {
      get() {
        return this.value;
      },
      set(val) {
        if (this.props.pkType === "table") {
          this.$emit("returnBack", val);
        }else if (!this.props.disabled && !this.props.readOnly){
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
    props: {
      type: Object,
      default() {
        return {};
      },
    },
    designer: {
      type: Boolean,
      default() {
        return false;
      },
    },
  },
  watch: {},
};
</script>
