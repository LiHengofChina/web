<template>
  <el-time-picker
    :ref="props.fieldName"
    v-model="compValue"
    is-range
    :range-separator="props.separator"
    :start-placeholder="isEmpty(props.placeholder) ? '开始日期' : props.placeholder"
    :end-placeholder="isEmpty(props.endPlaceholder) ? '结束日期' : props.endPlaceholder"
    :format="isEmpty(props.dateFormat.format) ? 'HH:mm:ss' : props.dateFormat.format"
    :value-format="
      isEmpty(props.dateFormat.valueFormat) ? 'HH:mm:ss' : props.dateFormat.valueFormat
    "
    :disabled="isEmpty(props.disabled) ? false : props.disabled"
    :readonly="isEmpty(props.readOnly) ? false : props.readOnly"
    :class="{ readonly: isEmpty(props.readOnly) ? false : props.readOnly }"
    :picker-options="isEmpty(props.dateOption) ? {} : props.dateOption"
    v-on="event"
  ></el-time-picker>
</template>
<script>
import formUtil from "../../utils/formUtil";
export default {
  data() {
    return {
      isEmpty: formUtil.isEmpty,
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
    props: {
      type: Object,
      default() {
        return {};
      },
    },
  },
};
</script>
