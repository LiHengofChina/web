<template>
  <el-checkbox-group
    style="display: inline-block"
    :ref="props.fieldName"
    :class="disabled"
    v-model="compValue"
    :placeholder="isEmpty(props.placeholder) ? '' : props.placeholder"
    :disabled="isEmpty(props.disabled) ? false : props.disabled"
    :readonly="isEmpty(props.readOnly) ? false : props.readOnly"
    v-on="event"
  >
    <el-checkbox
      v-for="boxItem in checkboxItem"
      :key="boxItem.optCode"
      :label="boxItem.optCode"
    >
      {{ boxItem.optName }}
    </el-checkbox>
  </el-checkbox-group>
</template>
<script>
import formUtil from "../../utils/formUtil";
import { getParameter } from "../../axios";
export default {
  data() {
    return {
      isEmpty: formUtil.isEmpty,
      checkboxItem: [],
      disabled: "",
    };
  },
  computed: {
    compValue: {
      get() {
        return this.value || [];
      },
      set(val) {
        if (!this.props.disabled && !this.props.readOnly) {
          this.$emit("returnBack", val);
        }
      },
    },
  },
  watch: {
    "props.dicKey": {
      handler(val, oldVal) {
        this.getPramDicItem();
      },
    },
    "props.dicItem": {
      handler(val, oldVal) {
        this.getPramDicItem();
      },
    },
    "props.optionType": {
      handler(val, oldVal) {
        this.getPramDicItem();
      },
    },
    "props.library": {
      handler(val, oldVal) {
        this.getPramDicItem();
      },
      deep: true,
    },
    pramDicItem: {
      handler(val, oldVal) {
        this.getPramDicItem();
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {
    if (this.props.optionType === "3") {
      this.getOption();
    } else {
      this.getPramDicItem();
    }
    let option = this.$parent.$parent.$parent.$parent.$parent.$parent.option;
    if (this.props.disabled || (option && option.formDisabled)) {
      this.disabled = "is-disabled";
    }
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
    pramDicItem: Array,
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
      // if (this.designer === true) {
      if (this.props.optionType === "1") {
        if (this.pramDicItem) {
          this.checkboxItem = this.unique(this.pramDicItem);
        } else {
          this.checkboxItem = this.unique(this.props.dicItem);
        }
      } else if (this.props.optionType === "2") {
        this.checkboxItem = [];
        if (this.pramDicItem && this.pramDicItem.length > 0) {
          this.checkboxItem = this.unique(this.pramDicItem);
        } else {
          //请求字典json文件
          let keyArray = [this.props.dicKey];
          formUtil.getParmDic(keyArray, (dicKeyData) => {
            this.checkboxItem = dicKeyData[this.props.dicKey];
          });
        }
      } else if (this.props.optionType === "3") {
        this.getOption();
      }
      // } else {
      //   this.checkboxItem = this.pramDicItem || [];
      // }
    },
    getOption() {
      let _this = this;
      let optionType = _this.props.optionType;
      if (optionType != "3") {
        return;
      }
      let library = _this.props.library;
      let searchData = library.searchData;
      if (_this.designer === true) {
        let searchDatas = {};
        let searchDataStr = library.searchDataStr || "";
        let searchDataArray = searchDataStr.split(";");
        for (let i in searchDataArray) {
          if (!this.isEmpty(searchDataArray[i])) {
            let searchDataObj = searchDataArray[i].split("-");
            if (searchDataObj.length === 2) {
              let value = "";
              var reg = /^\${.*}$/;
              if (reg.test(searchDataObj[1]) !== true) {
                value = searchDataObj[1];
              }
              searchDatas[searchDataObj[0]] = value;
            }
          }
        }
        searchData = searchDatas;
      }
      let url = library.url;
      url = formUtil.converUrl(url);
      getParameter(
        url,
        searchData,
        true,
        function (reponse) {
          _this.checkboxItem = [];
          if (reponse.code === 0) {
            let list = reponse.list;
            let realField = "optCode";
            let showField = "optName";
            if (!_this.isEmpty(library.realField)) {
              realField = library.realField;
            }
            if (!_this.isEmpty(library.showField)) {
              showField = library.showField;
            }
            for (let i in list) {
              let option = {
                optCode: list[i][realField],
                optName: list[i][showField],
              };
              _this.checkboxItem.push(option);
            }
          } else {
            console.error(reponse.msg);
          }
        },
        function (error) {
          _this.checkboxItem = [];
        }
      );
    },
  },
};
</script>
