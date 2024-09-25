<template>
  <div style="height: 100%; display: flex; align-items: center">
    <div style="float: left; width: 100%; height: 100%">
      <el-input
        ref="input"
        type="text"
        v-model="compValue"
        :class="{
          readonly: isEmpty(props.readOnly) ? false : props.readOnly,
          'mftcc-input': true,
          success: dataColor == 'success',
          warning: dataColor == 'warning',
          danger: dataColor == 'danger',
        }"
        :placeholder="isEmpty(props.placeholder) ? '' : props.placeholder"
        :disabled="isEmpty(props.disabled) ? false : props.disabled"
        :readonly="isEmpty(props.readOnly) ? false : props.readOnly"
        v-on="event"
        @keyup.native="toMoneyFn"
        @blur="func_uior_valTypeImm($event, props.dataType)"
        :maxlength="props.maxlength"
        :show-word-limit="
          isEmpty(props['show-word-limit']) ? false : props['show-word-limit']
        "
        :clearable="true"
      >
        <template v-if="!isEmpty(props.prepend)" slot="prepend">{{
          props.prepend
        }}</template>
        <template v-if="!isEmpty(props.suffix)" slot="suffix">{{
          props.suffix
        }}</template>
        <template v-else-if="props.dataType === 'money(yuan)'" slot="suffix">元</template>
        <template v-else-if="props.dataType === 'money(jiao)'" slot="suffix">角</template>
        <template v-else-if="props.dataType === 'money(fen)'" slot="suffix">分</template>
        <template v-else-if="props.dataType === 'money(wan)'" slot="suffix"
          >万元</template
        >
        <template v-else-if="props.dataType === 'money(baiwan)'" slot="suffix"
          >百万元</template
        >
        <template v-else-if="props.dataType === 'money(yi)'" slot="suffix">亿元</template>
        <template v-else-if="props.dataType === 'percentile'" slot="suffix">%</template>
        <template v-else-if="props.dataType === 'thousand'" slot="suffix">‰</template>
        <template v-else-if="props.dataType === 'tenThousand'" slot="suffix">‱</template>
        <template slot="append" v-if="props.optBtn && props.optBtn.length > 0">
          <template v-for="(btn, index) in props.optBtn">
            <i
              class="appendOptBtnIcon"
              :key="index"
              :class="btn.icon"
              style="margin-left: 10px; color: #007afe; cursor: pointer"
              v-if="btn.icon && (designer || $hasPerm(btn.jurisdiction || true))"
              @click.stop="Fn(btn.callBackFunc)"
            >
            </i>
            <span
              :key="index"
              class="appendOptBtn"
              v-if="!btn.icon && (designer || $hasPerm(btn.jurisdiction || true))"
              @mousedown.stop="Fn(btn.callBackFunc)"
              >{{ btn.key }}</span
            >
          </template>
        </template>
        <template slot="append" v-if="props.isBigAmt && setting == false">
          <span class="bigAmt">{{ toBigAmt() }} </span>
        </template>
      </el-input>
    </div>
  </div>
</template>
<script>
import formUtil from "../../utils/formUtil";
export default {
  data() {
    return {
      clearable: this.props.optBtn && this.props.optBtn.length > 0 ? false : true,
      isEmpty: formUtil.isEmpty,
      toMoney: formUtil.toMoney,
      bigAmt: formUtil.bigAmt,
      func_uior_valTypeImm: formUtil.func_uior_valTypeImm,
      isCalc: false,
      formDisabled: false,
      dataColor: "",
    };
  },
  inject: ["getFormData", "getOption"],
  computed: {
    formData() {
      try {
        return this.getFormData();
      } catch (error) {
        return {};
      }
    },
    option() {
      try {
        return this.getOption();
      } catch (error) {
        return {};
      }
    },
    compValue: {
      get() {
        /* 是否是只读 */
        if (this.formDisabled || this.props.readOnly || this.props.disabled) {
          let value = this.value;
          /* 颜色转换 */
          if (this.props.converColorData && this.props.converColorData.length > 0) {
            value = this.getCalcParamValue(this.props.dataType, value);
            value = value.replace(".00", "");
            for (let item of this.props.converColorData) {
              if (item.originalData == value) {
                this.dataColor = item.dataColor;
                break;
              }
            }
          }
          /* 数据脱敏 */
          if (this.props.desensitization) {
            let dese = {
              desensitization: this.props.desensitization,
              front: this.props.desensitizationFront,
              after: this.props.desensitizationAfter,
            };
            value = formUtil.desensitization(value, dese);
            return value;
          } else if (
            /* 数据转换 */
            this.props.converData &&
            this.props.converData.length > 0
          ) {
            value = this.getCalcParamValue(this.props.dataType, value);
            value = value.replace(".00", "");
            for (let item of this.props.converData) {
              if (item.originalData == value) {
                return item.newData;
              }
            }
            return this.value;
          } else {
            return this.value;
          }
        } else {
          return this.value;
        }
      },
      set(val) {
        val = val + "";
        if (val.trim() == "") {
          val = "";
        }
        if (this.isCalc) {
          this.$emit("returnBack", val);
        }
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
    designer: {
      type: Boolean,
      default() {
        return false;
      },
    },
    setting: {
      type: Boolean,
      default() {
        return false;
      },
    },
    isTable: {
      type: Boolean,
      default() {
        return false;
      },
    },
    parentVm: {
      type: Object,
      required: true,
    },
  },
  watch: {
    formData: {
      handler(val, oldVal) {
        this.calc(this.props.autoCalc);
      },
      deep: true,
    },
    "props.autoCalc": {
      handler(val, oldVal) {
        if (val) {
          this.props.readOnly = true;
        }
        this.calc(val);
      },
      deep: true,
      immediate: true,
    },
    option: {
      handler(val, oldVal) {
        if (val && (val.formDisabled || val.query == "query")) {
          this.formDisabled = true;
        } else {
          this.formDisabled = false;
        }
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    // if (this.isTable) {
    //   let value = this.compValue;
    //   if (this.props.dataType === "money(yuan)") {
    //     value = formUtil.formatMoney(value);
    //   } else if (this.props.dataType === "money(wan)") {
    //     value = formUtil.formatMoney(Number(value) / 10000, 2);
    //   } else if (this.props.dataType === "percentile") {
    //     value = formUtil.numMulti(value, 100);
    //   } else if (this.props.dataType === "thousand") {
    //     value = formUtil.numMulti(value, 1000);
    //   } else if (this.props.dataType === "tenThousand") {
    //     value = formUtil.numMulti(value, 10000);
    //   }
    //   this.compValue = value;
    // }
  },
  methods: {
    toBigAmt() {
      let value = this.value;
      if (this.props.dataType === "money(yuan)") {
        value = formUtil.delcommafy(value);
      } else if (this.props.dataType === "money(wan)") {
        value = formUtil.delcommafy(value);
        value = formUtil.numMulti(value, 10000);
      } else if (this.props.dataType === "money(baiwan)") {
        value = formUtil.delcommafy(value);
        value = formUtil.numMulti(value, 1000000);
      } else if (this.props.dataType === "money(yi)") {
        value = formUtil.delcommafy(value);
        value = formUtil.numMulti(value, 100000000);
      }
      value = this.bigAmt(value);
      if (value) {
        return "(" + value + ")";
      }
      return "";
    },
    toMoneyFn(event) {
      if (
        this.props.dataType === "money(yuan)" ||
        this.props.dataType === "money(wan)" ||
        this.props.dataType === "money(baiwan)" ||
        this.props.dataType === "money(yi)"
      ) {
        this.compValue = this.toMoney(event);
      }
    },
    calc(expr) {
      if (this.props.autoCalc && !this.designer) {
        let formData = this.formData;
        for (let formItem of this.option.formItem) {
          let fieldName = formItem.fieldName;
          if (this.props.autoCalc.indexOf(fieldName) == -1) {
            continue;
          }
          let fieldValue = formData[fieldName];
          fieldValue = this.getCalcParamValue(formItem.dataType, fieldValue);
          if (fieldValue == "" || isNaN(fieldValue)) {
            fieldValue = 0;
          }
          expr = expr.replace(new RegExp("\\$\\{" + fieldName + "\\}", "gm"), fieldValue);
        }
        // for (let fieldName in formData) {
        //   if (this.props.autoCalc.indexOf(fieldName) == -1) {
        //     continue;
        //   }

        //   if (fieldValue == "" || isNaN(fieldValue)) {
        //     fieldValue = 0;
        //   }
        //   expr = expr.replace(new RegExp("\\$\\{" + fieldName + "\\}", "gm"), fieldValue);
        // }
        console.log(expr, eval(expr));
        let value = eval(expr);
        if (isNaN(value) || value == "Infinity") {
          value = "0";
        }

        let type = this.props.dataType;
        if (type === "money(yuan)") {
          value = formUtil.formatMoney(value);
        } else if (type === "money(wan)") {
          value = formUtil.numDiv(value, 10000);
          value = formUtil.formatMoney(value);
        } else if (type === "money(baiwan)") {
          value = formUtil.numDiv(value, 1000000);
          value = formUtil.formatMoney(value);
        } else if (type === "money(yi)") {
          value = formUtil.numDiv(value, 100000000);
          value = formUtil.formatMoney(value);
        } else if (type === "percentile") {
          value = formUtil.numMulti(value, 100);
        } else if (type === "thousand") {
          value = formUtil.numMulti(value, 1000);
        } else if (type === "tenThousand") {
          value = formUtil.numMulti(value, 10000);
        }
        this.compValue = value;
        this.isCalc = true;
      }
    },
    getCalcParamValue(dataType, fieldValue) {
      if (dataType === "money(yuan)") {
        fieldValue = formUtil.delcommafy(fieldValue);
      } else if (dataType === "money(wan)") {
        fieldValue = formUtil.delcommafy(fieldValue);
        fieldValue = formUtil.numMulti(fieldValue, 10000);
      } else if (dataType === "money(baiwan)") {
        fieldValue = formUtil.delcommafy(fieldValue);
        fieldValue = formUtil.numMulti(fieldValue, 1000000);
      } else if (dataType === "money(yi)") {
        fieldValue = formUtil.delcommafy(fieldValue);
        fieldValue = formUtil.numMulti(fieldValue, 100000000);
      } else if (dataType === "percentile") {
        fieldValue = formUtil.numDiv(fieldValue, 100);
      } else if (dataType === "thousand") {
        fieldValue = formUtil.numDiv(fieldValue, 1000);
      } else if (dataType === "tenThousand") {
        fieldValue = formUtil.numDiv(fieldValue, 10000);
      }
      return fieldValue || "";
    },
    Fn(method, param) {
      if (formUtil.parentVmExist(this, method)) {
        this.parentVm._self[method](param);
      }
    },
  },
};
</script>
