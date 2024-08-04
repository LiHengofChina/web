<template>
  <div class="mftcc-filter-item">
    <span v-if="index == 0" class="xuanze">请选择:</span>
    <el-radio-group v-else v-model="filterData.andor" size="mini">
      <el-radio-button label="and">并且</el-radio-button>
      <el-radio-button label="or">或者</el-radio-button>
    </el-radio-group>
    <el-select
      v-model="filterData.fieldName"
      @change="colSelected"
      placeholder="请选择字段"
      :disabled="disabled"
    >
      <template v-for="col in columns">
        <el-option
          v-if="col.prop != ''"
          :key="col.prop"
          :label="col.label"
          :value="col.prop"
        >
        </el-option>
      </template>
    </el-select>
    <el-select
      v-if="props.fieldType != 'switch'"
      v-model="filterData.conditions"
      :disabled="disabled"
      placeholder="请选择"
    >
      <el-option
        v-for="cond in getConditions()"
        :key="cond.value"
        :label="cond.label"
        :value="cond.value"
      >
      </el-option>
    </el-select>
    <component
      class="resultInput"
      :is="$Component[props.fieldType || 'text']"
      v-model="compValue"
      :props="props"
      :pramDicItem="pramDicItem"
    >
    </component>
    <i
      v-if="!disabled"
      class="el-icon-circle-close filterDel"
      @click="$emit('delFilterItem', index)"
    ></i>
  </div>
</template>
<script>
import formUtil from "../../../utils/formUtil";
export default {
  data() {
    return {
      isEmpty: formUtil.isEmpty,
      props: {},
      filterData: {
        andor: "and",
        conditions: "",
        value: "",
        fieldName: "",
      },
      compValue: "",
      stringConditions: [
        { label: "是", value: "eq" },
        { label: "不是", value: "ne" },
        { label: "包括", value: "like" },
        { label: "不包括", value: "notLike" },
      ],
      numberConditions: [
        { label: "大于", value: "gt" },
        { label: "等于", value: "eq" },
        { label: "小于", value: "lt" },
        { label: "不等于", value: "ne" },
        { label: "大于等于", value: "ge" },
        { label: "小于等于", value: "le" },
      ],
      selectConditions: [
        { label: "是", value: "eq" },
        { label: "不是", value: "ne" },
      ],
      multipleSelectionConditions: [
        { label: "是", value: "eqMultiple" },
        { label: "不是", value: "neMultiple" },
        { label: "包含", value: "in" },
        { label: "不包含", value: "notIn" },
      ],
      dateConditions: [
        { label: "大于", value: "gt" },
        { label: "等于", value: "eq" },
        { label: "小于", value: "lt" },
        { label: "不等于", value: "ne" },
        { label: "大于等于", value: "ge" },
        { label: "小于等于", value: "le" },
      ],
      dateGroupConditions: [{ label: "包含", value: "between" }],
    };
  },
  props: {
    designer: {
      type: Boolean,
      default() {
        return false;
      },
    },
    event: {
      type: Object,
      default() {
        return {};
      },
    },
    pramDicItem: {
      type: Array,
      default() {
        return null;
      },
    },
    columns: {
      type: Array,
      default: [],
    },
    filter: {
      type: Object,
      default() {
        return {};
      },
    },
    index: {
      type: Number,
      default: 0,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  /* computed: {
    compValue: {
      get() {
        let value = this.filterData.value;
        let formField = this.props;
        if (formField.fieldType === "text" && value) {
          if (formField.dataType === "money(yuan)") {
            value = formUtil.formatMoney(value);
          } else if (formField.dataType === "money(wan)") {
            value = formUtil.numDiv(value, 10000);
            value = formUtil.formatMoney(value);
          } else if (formField.dataType === "money(baiwan)") {
            value = formUtil.numDiv(value, 1000000);
            value = formUtil.formatMoney(value);
          } else if (formField.dataType === "money(yi)") {
            value = formUtil.numDiv(value, 100000000);
            value = formUtil.formatMoney(value);
          } else if (formField.dataType === "percentile") {
            value = formUtil.numMulti(value, 100);
          } else if (formField.dataType === "thousand") {
            value = formUtil.numMulti(value, 1000);
          } else if (formField.dataType === "tenThousand") {
            value = formUtil.numMulti(value, 10000);
          }
          if (value.trim() == "") {
            value = "";
          }
        }
        return value;
      },
      set(val) {
        let formField = this.props;
        if (formField.fieldType === "text") {
          if (formField.dataType === "money(yuan)") {
            val = formUtil.delcommafy(val);
          } else if (formField.dataType === "money(wan)") {
            val = formUtil.delcommafy(val);
            val = formUtil.numMulti(val, 10000);
          } else if (formField.dataType === "money(baiwan)") {
            val = formUtil.delcommafy(val);
            val = formUtil.numMulti(val, 1000000);
          } else if (formField.dataType === "money(yi)") {
            val = formUtil.delcommafy(val);
            val = formUtil.numMulti(val, 100000000);
          } else if (formField.dataType === "percentile") {
            val = formUtil.numDiv(val, 100);
          } else if (formField.dataType === "thousand") {
            val = formUtil.numDiv(val, 1000);
          } else if (formField.dataType === "tenThousand") {
            val = formUtil.numDiv(val, 10000);
          }
        }
        this.filterData.value = val;
        this.$emit("returnBack", val);
      },
    },
  },
  model: {
    prop: "value", //值可以随意命名
    event: "returnBack", //方法也可以随意命名
  }, */
  watch: {
    compValue(val) {
      let formField = this.props;
      if (formField.fieldType === "text") {
        if (formField.dataType === "money(yuan)") {
          val = formUtil.delcommafy(val);
        } else if (formField.dataType === "money(wan)") {
          val = formUtil.delcommafy(val);
          val = formUtil.numMulti(val, 10000);
        } else if (formField.dataType === "money(baiwan)") {
          val = formUtil.delcommafy(val);
          val = formUtil.numMulti(val, 1000000);
        } else if (formField.dataType === "money(yi)") {
          val = formUtil.delcommafy(val);
          val = formUtil.numMulti(val, 100000000);
        } else if (formField.dataType === "percentile") {
          val = formUtil.numDiv(val, 100);
        } else if (formField.dataType === "thousand") {
          val = formUtil.numDiv(val, 1000);
        } else if (formField.dataType === "tenThousand") {
          val = formUtil.numDiv(val, 10000);
        }
        if (val == 0) {
          val = "";
        }
      }
      this.filterData.value = val;
    },
    filterData(val) {
      this.$emit("setFilter", val, this.index);
    },
    "filterData.value": {
      handler(val, oldVal) {
        if (val == "") {
          this.compValue = val;
        }
      },
    },
    filter: {
      handler(val, oldVal) {
        this.filterData = Object.assign({}, this.filterData, val);
      },
      immediate: true,
    },
    "filter.fieldName": {
      handler(val, oldVal) {
        if (val) {
          this.colSelected(val);
          let value = this.filterData.value;
          let formField = this.props;
          if (formField.fieldType === "text" && value) {
            if (formField.dataType === "money(yuan)") {
              value = formUtil.formatMoney(value);
            } else if (formField.dataType === "money(wan)") {
              value = formUtil.numDiv(value, 10000);
              value = formUtil.formatMoney(value);
            } else if (formField.dataType === "money(baiwan)") {
              value = formUtil.numDiv(value, 1000000);
              value = formUtil.formatMoney(value);
            } else if (formField.dataType === "money(yi)") {
              value = formUtil.numDiv(value, 100000000);
              value = formUtil.formatMoney(value);
            } else if (formField.dataType === "percentile") {
              value = formUtil.numMulti(value, 100);
            } else if (formField.dataType === "thousand") {
              value = formUtil.numMulti(value, 1000);
            } else if (formField.dataType === "tenThousand") {
              value = formUtil.numMulti(value, 10000);
            }
            if (value.trim() == "") {
              value = "";
            }
          }
          this.compValue = value;
        }
      },
      immediate: true,
    },
  },
  created() {},
  methods: {
    colSelected(value) {
      for (let item of this.columns) {
        if (item.prop == value) {
          item.changeDicKey = true;
          item.disabled = this.disabled;
          this.props = item;
          break;
        }
      }
    },
    getConditions(item) {
      if (this.props.fieldType == "text" && this.props.dataType == "") {
        //普通文本
        return this.stringConditions;
      } else if (this.props.fieldType == "text" && this.props.dataType != "") {
        //数字
        return this.numberConditions;
      } else if (this.props.fieldType == "select") {
        //下拉单选
        return this.selectConditions;
      } else if (this.props.fieldType == "multipleSelection") {
        //下拉多选
        return this.multipleSelectionConditions;
      } else if (this.props.fieldType == "date" || this.props.fieldType == "datetime") {
        //日期框
        return this.dateConditions;
      } else if (
        this.props.fieldType == "dateGroup" ||
        this.props.fieldType == "datetimeGroup"
      ) {
        //日期组框
        return this.dateGroupConditions;
      } else {
        return [];
      }
    },
  },
};
</script>
<style>
.mftcc-filter-item {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}
.mftcc-filter-item > .el-select {
  width: 180px;
  margin: 0 6px;
}
.mftcc-filter-item > .resultInput {
  width: 320px;
  margin: 0 6px;
}
.mftcc-filter-item > .xuanze {
  width: 136px;
  text-align: center;
}
.mftcc-filter-item .el-input__inner {
  border-radius: 2px;
}
.mftcc-filter-item > .el-radio-group {
  display: flex;
  justify-content: center;
  margin-right: 26px;
}
.mftcc-filter-item > .el-radio-group .el-radio-button--mini .el-radio-button__inner {
  padding: 12px 7px;
}
.mftcc-filter-item .filterDel {
  color: #999999;
  cursor: pointer;
  visibility: hidden;
  margin-left: 5px;
  margin-right: 12px;
}
.mftcc-filter-item:hover .filterDel {
  visibility: visible;
}
</style>
