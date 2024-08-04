<template>
  <el-input
    :ref="props.fieldName"
    type="password"
    autocomplete="off"
    v-model="compValue"
    :placeholder="isEmpty(props.placeholder) ? '' : props.placeholder"
    :disabled="isEmpty(props.disabled) ? false : props.disabled"
    :readonly="isEmpty(props.readOnly) ? false : props.readOnly"
    v-on="event"
    @blur="func_uior_valTypeImm($event, props.dataType)"
  ></el-input>
</template>
<script>
import formUtil from "../../utils/formUtil";
export default {
  data() {
    return {
      isEmpty: formUtil.isEmpty,
      func_uior_valTypeImm: formUtil.func_uior_valTypeImm
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
    }
  }
};
</script>
