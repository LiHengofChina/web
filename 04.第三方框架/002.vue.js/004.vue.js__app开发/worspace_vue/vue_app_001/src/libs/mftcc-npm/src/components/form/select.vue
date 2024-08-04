<template>
  <mftcc-library-select
    v-if="props.dataType === 'library'"
    v-model="compValue"
    :url="props.library.url"
    :realField="props.library.realField"
    :showField="props.library.showField"
    :props="props"
    :multiple="false"
    :placeholder="isEmpty(props.placeholder) ? '' : props.placeholder"
    v-on="event"
    :disabled="isEmpty(props.disabled) ? false : props.disabled"
    :readonly="isEmpty(props.readOnly) ? false : props.readOnly"
    :designer="designer"
  ></mftcc-library-select>
  <el-select
    v-else
    autocomplete="off"
    clearable
    filterable
    :ref="props.fieldName"
    v-model="compValue"
    :placeholder="isEmpty(props.placeholder) ? '' : props.placeholder"
    :disabled="isEmpty(props.disabled) ? false : props.disabled"
    :class="{
      readonly: isEmpty(props.readOnly) ? false : props.readOnly,
      'mftcc-input': true,
      success: dataColor == 'success',
      warning: dataColor == 'warning',
      danger: dataColor == 'danger',
    }"
    v-on="event"
  >
    <el-option
      v-for="selectItem in selectItem"
      :key="selectItem.optCode"
      :label="selectItem.optName"
      :value="selectItem.optCode"
    ></el-option>
  </el-select>
</template>
<script>
import formUtil from "../../utils/formUtil";
export default {
  data() {
    return {
      isEmpty: formUtil.isEmpty,
      selectItem: [],
      formDisabled: false,
      dataColor: "",
    };
  },
  inject: ["getFormData", "option"],
  computed: {
    formData() {
      return this.getFormData();
    },
    compValue: {
      get() {
        if (this.formDisabled || this.props.readOnly || this.props.disabled) {
          let value = this.value;
          if (this.props.converColorData && this.props.converColorData.length > 0) {
            for (let item of this.props.converColorData) {
              if (item.originalData == value) {
                this.dataColor = item.dataColor;
                break;
              }
            }
          }
        }
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
  watch: {
    "props.dicKey": {
      handler(val, oldVal) {
        // if (this.designer === true) {
        this.getPramDicItem();
        // }
      },
      deep: true,
      immediate: true,
    },
    "props.dicItem": {
      handler(val, oldVal) {
        if (this.designer === true) {
          this.getPramDicItem();
        }
      },
      deep: true,
      immediate: true,
    },
    "props.library": {
      handler(val, oldVal) {
        // this.getOption();
        this.getPramDicItem();
      },
      deep: true,
    },
    "props.optionType": {
      handler(val, oldVal) {
        if (this.designer === true) {
          this.getPramDicItem();
        }
      },
      deep: true,
      immediate: true,
    },
    pramDicItem: {
      handler(val, oldVal) {
        this.getPramDicItem();
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
  model: {
    prop: "value", //值可以随意命名
    event: "returnBack", //方法也可以随意命名
  },
  props: {
    designer: {
      type: Boolean,
      default() {
        return false;
      },
    },
    value: {},
    event: Object,
    pramDicItem: {
      type: Array,
      default() {
        return {};
      },
    },
    props: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  methods: {
    unique(arr1) {
      const res = new Map();
      return arr1.filter((a) => !res.has(a.optCode) && res.set(a.optCode, 1));
    },
    getPramDicItem() {
      /* if (this.designer === true) {
              if (this.props.optionType === "1") {
                this.selectItem = this.unique(this.props.dicItem);
              } else if (this.props.optionType === "2") {
                this.selectItem = [];
                //请求字典json文件
                let keyArray = [this.props.dicKey];
                formUtil.getParmDic(keyArray, (dicKeyData) => {
                  this.selectItem = dicKeyData[this.props.dicKey];
                });
              }
              // if(this.pramDicItem&&this.pramDicItem.length>0){
              //   this.selectItem = this.pramDicItem;
              // }
            } else {
              // if (this.props.changeDicKey) {
              this.selectItem = [];
              //请求字典json文件
              let keyArray = [this.props.dicKey];
              formUtil.getParmDic(keyArray, (dicKeyData) => {
                this.selectItem = dicKeyData[this.props.dicKey];
              });
              // } else {
              //   this.selectItem = this.pramDicItem || [];
              // }
            } */
      if (this.props.optionType === "1") {
        if (this.pramDicItem) {
          this.selectItem = this.unique(this.pramDicItem);
        } else {
          this.selectItem = this.unique(this.props.dicItem);
        }
      } else if (this.props.optionType === "2") {
        this.selectItem = [];
        if (this.pramDicItem && this.pramDicItem.length > 0) {
          this.selectItem = this.unique(this.pramDicItem);
        } else {
          //请求字典json文件
          let keyArray = [this.props.dicKey];
          formUtil.getParmDic(keyArray, (dicKeyData) => {
            this.selectItem = dicKeyData[this.props.dicKey];
          });
        }
      }
    },
  },
};
</script>
