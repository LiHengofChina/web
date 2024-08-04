<template>
  <div class="mftcc-dailog">
    <el-input :ref="props.fieldName"
              type="text"
              v-model="compValueText"
              @click.native="showDialog"
              :placeholder="isEmpty(props.placeholder)?'':props.placeholder"
              :readonly="true">
    </el-input>
    <mftcc-plt-role-table :show.sync="tableShow"
                          :parentVm="this"
                          :option="tableOption"
                          @callback="callback"></mftcc-plt-role-table>
  </div>
</template>
<script>
  import formUtil from "../../utils/formUtil";
  import mftccPltRoleTable from "../bus/dialog/mftccPltRoleTable";
  export default {
    data() {
      return {
        isEmpty: formUtil.isEmpty,
        tableShow: false,
        compValueText: "",
        tableOption: this.props.option
      };
    },
    components: {
      mftccPltRoleTable
    },
    computed: {
      formData() {
        return this.getFormData();
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
    inject: ["getFormData"],
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
      },
      parentVm: {
        type: Object,
        required: true
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
            key: "roleNo",
            value: value
          }
        ];
        this.tableShow = true;
      },
      callback(datas) {
        let value = "";
        let text = "";
        if (this.tableOption.type === "radio") {
          this.compValue = datas.roleNo;
          this.compValueText = datas.roleName;
        } else {
          for (let i = 0; i < datas.length; i++) {
            value += datas[i].roleNo;
            text += datas[i].roleName;
            if (i < datas.length - 1) {
              value += ",";
              text += ",";
            }
          }
          this.compValue = value;
          this.compValueText = text;
        }
        this.$emit("returnBack", { key: "fieldDesc", value: this.compValueText });
        this.Fn(this.tableOption.selectedCallback, datas);
      },
      Fn(method, param) {
        if (formUtil.parentVmExist(this, method)) {
          this.parentVm._self[method](param);
        }
      }
    }
  };
</script>