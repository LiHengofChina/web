<template>
  <div class="mftcc-dailog">
    <el-input :ref="props.fieldName"
              type="text"
              v-model="compValueText"
              @click.native="showDialog"
              :placeholder="isEmpty(props.placeholder) ? '' : props.placeholder"
              :readonly="true">
    </el-input>
    <mftcc-plt-br-tree :show.sync="tableShow"
                       :option="tableOption"
                       @callback="callback"></mftcc-plt-br-tree>
  </div>
</template>
<script>
  import formUtil from "../../utils/formUtil";
  import mftccPltBrTree from "../bus/dialog/mftccPltBrTree";

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
      },
      parentVm: {
        type: Object,
        required: true
      }
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
    watch: {
      "props.option": {
        handler(val, oldVal) {
          this.tableOption = val;
        },
        immediate: true
      },
      "props.fieldDescValue": {
        handler(val, oldVal) {
          this.compValueText = val || "";
        },
        immediate: true
      },
      initCompValueText(val) {
        this.compValueText = val || "";
      }
    },
    components: {
      mftccPltBrTree
    },
    methods: {
      callback(val) {
        let text = "";
        let value = "";
        if (val) {
          if (this.tableOption.type === "radio") {
            let brObj = val[val.length - 1];
            text = brObj.brName;
            value = brObj.brNo;
          } else {
            for (let i = 0; i < val.length; i++) {
              text += val[i].brName;
              value += val[i].brNo;
              if (i < val.length - 1) {
                text += ",";
                value += ",";
              }
            }
          }
        }
        this.compValueText = text;
        this.compValue = value;
        this.$emit("returnBack", { key: "fieldDesc", value: this.compValueText });
        this.Fn(this.tableOption.selectedCallback, val);
      },
      showDialog() {
        if (this.compValue) {
          if (Array.isArray(this.compValue)) {
            this.tableOption.value = this.compValue;
          } else {
            this.tableOption.value = this.compValue.split(",");
          }
        }
        this.tableShow = true;
      },
      Fn(method, param) {
        if (formUtil.parentVmExist(this, method)) {
          this.parentVm._self[method](param);
        }
      }
    }
  };
</script>
