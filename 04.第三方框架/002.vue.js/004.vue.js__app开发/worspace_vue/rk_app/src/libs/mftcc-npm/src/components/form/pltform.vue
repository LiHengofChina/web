<template>
  <div class="mftcc-dailog">
    <el-input :ref="props.fieldName"
              type="text"
              v-model="compValueText"
              @click.native="showDialog"
              :placeholder="isEmpty(props.placeholder)?'':props.placeholder"
              :readonly="true">
    </el-input>
    <mftcc-form-table :show.sync="tableShow"
                      :option="tableOption"
                      @callback="callback"></mftcc-form-table>
  </div>
</template>
<script>
  import formUtil from "../../utils/formUtil";
  import mftccFormTable from "../bus/dialog/mftccFormTable";
  export default {
    data() {
      return {
        isEmpty: formUtil.isEmpty,
        tableShow: false,
        compValueText: "",
        tableOption: this.props.option
      };
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
    },
    computed: {
      compValue: {
        get() {
          return this.value
        },
        set(val) {
          this.$emit('returnBack', { key: "fieldName", value: val });
        }
      },
      formData() {
        return this.getFormData();
      },
      initCompValueText() {
        return this.formData[this.props.fieldDesc];
      }
    },
    watch: {
      "props.option": {
        handler(val, oldVal) {
          this.tableOption = val
        },
        immediate: true,
      },
      initCompValueText(val) {
        this.compValueText = val || "";
      }
    },
    components: {
      mftccFormTable
    },
    inject: ["getFormData"],
    methods: {
      callback(val) {
        let value = JSON.stringify(val)
        this.compValue = value;
        this.compValueText = val.name;
        this.$emit('returnBack', { key: "fieldDesc", value: this.compValueText });
      },
      showDialog() {
        this.tableShow = true;
      }
    }
  }
</script>
