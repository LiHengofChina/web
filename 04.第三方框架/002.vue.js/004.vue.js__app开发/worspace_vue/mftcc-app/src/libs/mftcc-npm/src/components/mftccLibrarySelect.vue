<template>
  <el-select
    ref="mftccLibrarySelect"
    v-model="selectValue"
    :multiple="multiple"
    filterable
    remote
    clearable
    reserve-keyword
    autocomplete="off"
    :placeholder="placeholder"
    :remote-method="getOption"
    :loading="loading"
    :class="{ readonly: readonly }"
    :disabled="disabled"
    @change="$emit('change', $event)"
    @focus="$emit('focus', $event)"
    @blur="$emit('blur', $event)"
    @clear="$emit('clear', $event)"
    @remove-tag="$emit('remove-tag', $event)"
    @visible-change="visibleChange"
  >
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    >
    </el-option>
  </el-select>
</template>

<script>
import { getParameter } from "../axios";
import formUtil from "../utils/formUtil";
export default {
  data() {
    return {
      options: [],
      loading: false,
      isInit: true,
    };
  },
  inject: ["getFormData"],
  computed: {
    formData() {
      try {
        return this.getFormData();
      } catch (error) {}
    },
    selectValue: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("returnBack", val);
      },
    },
  },
  watch: {
    url(val) {
      this.getOption("");
    },
    realField(val) {
      this.getOption("");
    },
    showField(val) {
      this.getOption("");
    },
    formData: {
      handler(val, oldVal) {
        if (!this.isInit) {
          return;
        }
        let searchDataStr = this.props.library.searchDataStr || "";
        let searchDataArray = searchDataStr.split(";");
        let state = false;
        for (let i in searchDataArray) {
          if (searchDataArray[i]) {
            let searchDataObj = searchDataArray[i].split("-");
            let value = searchDataObj[1] + "";
            var reg = /^\${.*}$/;
            if (searchDataObj.length === 2) {
              if (reg.test(value) == true) {
                let parm = value.replace(/^(\s|\${)+|(\s|})+$/g, "");
                if (val.hasOwnProperty(parm)) {
                  state = true;
                  break;
                }
              }
            }
          }
        }
        if (state) {
          this.isInit = false;
          this.getOption("");
        }
      },
      deep: true,
    },
  },
  model: {
    prop: "value", //值可以随意命名
    event: "returnBack", //方法也可以随意命名
  },
  props: {
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
    value: {},
    url: String,
    realField: String,
    showField: String,
    multiple: Boolean,
    placeholder: String,
    disabled: Boolean,
    readonly: Boolean,
  },
  mounted() {
    //if(this.designer === false){
    this.getOption("");
    //}
  },
  methods: {
    visibleChange(event) {
      if (event === true) {
        this.getOption("");
      }
      this.$emit("visible-change", event);
    },
    getOption(data) {
      let searchDataStr = this.props.library.searchDataStr || "";
      let searchDataArray = searchDataStr.split(";");
      let searchData = {};
      for (let i in searchDataArray) {
        if (searchDataArray[i]) {
          let searchDataObj = searchDataArray[i].split("-");
          if (searchDataObj.length === 2) {
            let value = searchDataObj[1];
            value = formUtil.parsFieldName(value, this.formData, this.$route);
            searchData[searchDataObj[0]] = value;
          }
        }
      }

      this.loading = true;
      searchData.dynamicQuery = data;
      let url = this.url;
      url = formUtil.converUrl(url);
      getParameter(
        url,
        searchData,
        true,
        (res) => {
          this.options = [];
          if (res.code === 0) {
            let list;
            if (res.list.records) {
              list = res.list.records;
            } else {
              list = res.list;
            }
            let realField = "optCode";
            let showField = "optName";
            if (
              this.realField !== undefined &&
              this.realField !== null &&
              this.realField !== ""
            ) {
              realField = this.realField;
            }
            if (
              this.showField !== undefined &&
              this.showField !== null &&
              this.showField !== ""
            ) {
              showField = this.showField;
            }
            for (let i in list) {
              let option = {
                value: list[i][realField] + "",
                label: list[i][showField],
              };
              this.options.push(option);
            }
          } else {
            this.options = [{ value: "", label: "(空)" }];
            console.error(res.msg);
          }
          this.loading = false;
        },
        (error) => {
          this.options = [{ value: "", label: "(空)" }];
          this.loading = false;
        }
      );
    },
    focus() {
      this.$refs.mftccLibrarySelect.focus();
    },
    blur() {
      this.$refs.mftccLibrarySelect.blur();
    },
  },
};
</script>
