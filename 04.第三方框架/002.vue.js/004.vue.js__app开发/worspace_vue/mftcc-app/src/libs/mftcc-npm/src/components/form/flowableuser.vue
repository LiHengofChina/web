<template>
  <div class="mftcc-dailog">
    <el-input :ref="props.fieldName"
              type="text"
              v-model="compValueText"
              @click.native="showDialog"
              :placeholder="isEmpty(props.placeholder) ? '' : props.placeholder"
              :readonly="true">
    </el-input>
    <mftcc-flowable-user-table :show.sync="tableShow"
                               :parentVm="this"
                               :roleNo="tableOption.roleNo"
                               :option="tableOption"
                               @callback="callback"></mftcc-flowable-user-table>
  </div>
</template>
<script>
  import formUtil from "../../utils/formUtil";
  import mftccFlowableUserTable from "../bus/dialog/mftccFlowableUserTable";
  export default {
    data() {
      return {
        isEmpty: formUtil.isEmpty,
        tableShow: false,
        compValueText: "",
        tableOption: this.props.option
      };
    },
    inject: ["getFormData"],
    components: {
      mftccFlowableUserTable
    },
    computed: {
      formData() {
        return this.getFormData()
      },
      compValue: {
        get() {
          return this.value;
        },
        set(val) {
          this.$emit("returnBack", { key: "fieldName", value: val });
        }
      },
      initCompValueText() {
        return this.formData[this.props.fieldDesc];
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
    },
    watch: {
      "props.option": {
        handler(val, oldVal) {
          this.tableOption = val;
        },
        immediate: true
      },
      initCompValueText(val) {
        this.compValueText = val || "";
      }
    },
    methods: {
      showDialog() {
        let value = this.compValue || "";
        if (this.tableOption.type === "radio") {
          // value = value;
        } else {
          value = value.split(",");
        }
        this.tableOption.value = [
          {
            key: "opNo",
            value: value
          }
        ];

        let roleNo = this.tableOption.roleNo || "";
        roleNo = formUtil.parsFieldName(roleNo, this.formData, this.$route);
        this.tableOption.roleNo = roleNo;

        let params = this.tableOption.params;
        if (params) {
          let initSearchData = {};
          let paramArr = params.split(";");
          for (let i in paramArr) {
            let queryArr = paramArr[i].split("-");
            let key = queryArr[0];
            let value = queryArr[1];
            value = formUtil.parsFieldName(value, this.formData, this.$route);
            initSearchData[key] = value;
          }
          this.tableOption.initSearchData = initSearchData;
        }

        this.tableShow = true;
      },
      callback(datas) {
        let value = "";
        let text = "";
        if (this.tableOption.type === "radio") {
          this.compValue = datas.opNo;
          this.compValueText = datas.opName;
        } else {
          for (let i = 0; i < datas.length; i++) {
            value += datas[i].opNo;
            text += datas[i].opName;
            if (i < datas.length - 1) {
              value += ",";
              text += ",";
            }
          }
          this.compValue = value;
          this.compValueText = text;
        }
        this.$emit("returnBack", { key: "fieldDesc", value: this.compValueText });
      }
    }
  };
</script>
