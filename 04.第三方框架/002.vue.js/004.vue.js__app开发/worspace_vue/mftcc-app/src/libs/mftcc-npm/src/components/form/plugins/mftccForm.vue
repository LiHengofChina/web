<template>
  <!-- :class="
      search === 'search'
        ? 'mftcc-form-search'
        : option.isExpand === true
        ? option.query === 'query'
          ? 'mftcc-form-expand query'
          : 'mftcc-form-expand'
        : option.query === 'query'
        ? 'mftcc-form-query'
        : 'mftcc-form'
    " -->
  <el-form
    :title="$show_title == false ? '' : formId || initOption.formId"
    :label-position="option.labelPosition"
    :model="formData"
    :rules="rules"
    :ref="formId || initOption.formId"
    :disabled="isEmpty(option.formDisabled) ? false : option.formDisabled"
    label-width="150px"
    :class="formClass()"
    @submit.native.prevent
  >
    <el-table
      v-if="formFlag"
      :noScrollbar="true"
      :data="tableData"
      :show-header="false"
      :span-method="rowColMergeHandler"
      :row-style="rowStyleHandler"
      :border="this.option.query != 'query'"
      empty-text=" "
      :class="isEmpty(option.formDisabled) ? '' : 'is-disabled'"
    >
      <el-table-column
        v-for="(item, index) in tableCol"
        :key="item.index"
        :prop="item.index"
      >
        <template slot-scope="scope">
          <form-item
            :props="scope.row[index + '']"
            v-model="formData"
            @click.native="
              scope.row[index + ''] && clickFunc(scope.row[index + ''], $event)
            "
            :event="scope.row[index + ''] && events[scope.row[index + ''].fieldName]"
            :pramDicItem="
              scope.row[index + ''] && pramDicItem[scope.row[index + ''].fieldName]
            "
            :query="option.query"
            :parentVm="parentVm"
          ></form-item>
        </template>
      </el-table-column>
    </el-table>

    <form-item
      v-for="(item, index) in hiddenItem"
      :key="index"
      :props="item"
      v-model="formData"
      @click.native="clickFunc(item, $event)"
      :event="events[item.fieldName]"
      :pramDicItem="pramDicItem[item.fieldName]"
      :query="option.query"
      :parentVm="parentVm"
    ></form-item>
  </el-form>
</template>
<script>
import { get, postJson, putJson, sync, getParameter } from "../../../axios";
import formUtil from "../../../utils/formUtil";
export default {
  props: ["formId", "parentVm", "initOption", "search"],
  data() {
    return {
      formFlag: false,
      option: {},
      formData: {},
      formDataReal: {},
      setFormData: {},
      events: {},
      pramDicItem: {},
      rules: {},
      isEmpty: formUtil.isEmpty,
      dateFormat: formUtil.dateFormat,
      hiddenItem: [],
      waitData: {},
      tableData: [],
      originalTableData: [],
      isLoad: false,
      isSetFormValue: false,
      initSetFormValue: {},
    };
  },
  provide() {
    return {
      getFormData: () => this.formData,
      formItem: this.option.formItem,
      getOption: () => this.option,
    };
  },
  watch: {
    formDataTemp: {
      handler(val, oldVal) {
        let fieldName = "";
        for (let k in val) {
          if (val[k] + "" != oldVal[k] + "") {
            fieldName = k;
            break;
          }
        }
        /* let formItems = this.getFormItems(this.option.formItem);
                                for (let j in formItems) {

                                  // //将更新后的数据赋值到table数据中
                                  // for (let i in this.tableData) {
                                  //   let row = this.tableData[i];
                                  //   for (let col in row) {
                                  //     let item = row[col];
                                  //     if (item.fieldName == formItems[j].fieldName) {
                                  //       item.option = formItems[j].option;
                                  //       item.library = formItems[j].library;
                                  //       this.tableData[i][col] = item;
                                  //     }
                                  //   }
                                  // }
                                } */
        //待表单初始化完成后 才可触发
        if (this.isLoad) {
          this.changeState(val, fieldName);
        }
      },
      deep: true,
      immediate: true,
    },
    formId: {
      handler(val, oldVal) {
        if (val) {
          this.resetFormData();
          this.initForm();
        }
      },
      deep: true,
      immediate: true,
    },
    initOption: {
      handler(val, oldVal) {
        if (val) {
          this.resetFormData();
          this.initForm();
        }
      },
      immediate: true,
    },
  },
  computed: {
    tableCol() {
      let tableCol = [];
      for (let i = 0; i < this.option.columns; i++) {
        let index = i + "";
        tableCol.push({ index: index });
      }
      return tableCol;
    },
    formDataTemp() {
      return JSON.parse(JSON.stringify(this.formData));
    },
  },
  methods: {
    initTableData() {
      let formItem = this.option.formItem.filter((item) => {
        if (item.isShow) {
          return true;
        } else if (item.state && item.state.length > 0) {
          for (let sts of item.state) {
            if (sts.isShow !== false) {
              return true;
            }
          }
        } else if (item.fieldType == "empty" || item.fieldType == "label") {
          return true;
        }
      });
      this.tableData = new Array();
      for (let item of formItem) {
        let rowIndex = item.rowIndex;
        let colIndex = item.colIndex;
        if (!this.tableData[rowIndex]) {
          this.tableData[rowIndex] = {};
        }
        if (item.useState) {
          let active = item.state.find((i) => {
            return item.useState === i.id;
          });
          item = Object.assign(item, active);
        }
        this.tableData[rowIndex][colIndex] = item;
      }
      this.originalTableData = this.tableData;
    },
    formClass() {
      let clsStr = "";
      if (this.search === "search") {
        clsStr += "mftcc-form-search";
      } else if (this.option.isExpand === true) {
        if (this.option.query === "query") {
          clsStr += "mftcc-form-expand query";
        } else {
          clsStr += "mftcc-form-expand";
        }
      } else if (this.option.query === "query") {
        clsStr += "mftcc-form-query";
      } else {
        clsStr += "mftcc-form";
      }
      return clsStr;
    },
    resetFormData() {
      this.formFlag = false;
      this.option = {};
      this.formData = {};
      this.setFormData = {};
      this.events = {};
      this.pramDicItem = {};
      this.rules = {};
      this.hiddenItem = [];
      this.state = {};
    },
    unique(arr1) {
      const res = new Map();
      return arr1.filter((a) => !res.has(a.optCode) && res.set(a.optCode, 1));
    },
    returnCol(
      col = {},
      { rowIndex, colIndex, rowspan, colspan, rm = true, belong } = {}
    ) {
      let self = this;
      col.fieldType = col.fieldType || "empty";

      if (rowspan != void 0) {
        col.rowspan = rowspan;
      } else if (col.rowspan == void 0) {
        col.rowspan = 1;
      }
      if (colspan != void 0) {
        col.colspan = colspan;
      } else if (col.colspan == void 0) {
        col.colspan = 1;
      }
      if (rowIndex != void 0) {
        col.rowIndex = rowIndex;
      }
      if (colIndex != void 0) {
        col.colIndex = colIndex;
      }
      if (belong) {
        col.belong = belong;
        rm = false;
      }
      rm && delete col.belong;
      return col;
    },
    doBeforeForm(form) {
      let len = form.columns;
      let items = form.formItem;
      let arr = [];
      for (let col of items) {
        if (col.hasOwnProperty("colspan") && col.hasOwnProperty("rowspan")) {
          arr.push(col);
          continue;
        }
        let type = col.fieldType;
        if (col.isShow === false) {
          col.rowspan = 1;
          col.colspan = 1;
          arr.push(col);
        } else if (type == "label") {
          col.rowspan = 1;
          col.colspan = len;
          arr.push(col);
          for (let index = 1; index < len; index++) {
            arr.push(this.returnCol({}, { colspan: 0, rowspan: 0 }));
          }
        } else {
          col.rowspan = 1;
          col.colspan = col.colspan || 1;
          arr.push(col);
          if (col.colspan && col.colspan > 1) {
            for (let index = 1; index < col.colspan; index++) {
              arr.push(this.returnCol({}, { colspan: 0, rowspan: 0 }));
            }
          }
        }
      }
      form.formItem = arr;
      return form;
    },
    rowColMergeHandler({ row, column, rowIndex, columnIndex }) {
      let col = row[columnIndex + ""];
      return col && [col.rowspan, col.colspan];
    },
    resetForm(callback) {
      this.$refs[this.formId || this.option.formId].resetFields();
      if (formUtil.isFunction(callback)) {
        callback();
      }
    },
    clickFunc(item, el) {
      let events = item.events;
      for (let i in events) {
        if (
          this.option.formDisabled !== true &&
          item.disabled !== true &&
          events[i].type === "click" &&
          formUtil.parentVmExist(this, events[i].callback)
        ) {
          this.parentVm._self[events[i].callback](el);
        }
      }
    },
    validateForm(callback) {
      this.$refs[this.formId || this.option.formId].validate((valid) => {
        if (!valid) {
          /* 获取校验失败项并定位到首个失败项 */
          this.$nextTick(() => {
            var isError = document.getElementsByClassName("is-error");
            isError[0].querySelector("input").focus();
          });
        }
        if (formUtil.isFunction(callback)) {
          callback(valid);
        }
      });
    },
    validateField(parm, callback) {
      this.$refs[this.formId || this.option.formId].validateField(parm, (valid) => {
        if (formUtil.isFunction(callback)) {
          callback(valid);
        }
      });
    },
    clearValidate() {
      this.$nextTick(() => {
        if (arguments.length === 0) {
          this.$refs[this.formId || this.option.formId].clearValidate();
        } else if (arguments.length >= 1) {
          this.$refs[this.formId || this.option.formId].clearValidate(arguments[0]);
        }
      });
    },
    getFormItems(formItem) {
      let formItems = [];
      for (let i in formItem) {
        if (formItem[i].fieldType === "group") {
          let groupItem = formItem[i].group;
          for (let j in groupItem) {
            formItems.push(groupItem[j]);
          }
        } else {
          formItems.push(formItem[i]);
        }
      }
      return formItems;
    },
    dateFormatType(formField, value, type) {
      try {
        if (this.isEmpty(value)) {
          return value;
        }
        let valueFormat = "";
        let format = "";
        if (type === "date" || type === "dateGroup") {
          valueFormat = "yyyyMMdd";
          format = "yyyy-MM-dd";
        } else if (type === "datetime" || type === "datetimeGroup") {
          valueFormat = "yyyyMMdd HH:mm:ss";
          format = "yyyy-MM-dd HH:mm:ss";
        } else {
          return value;
        }
        if (!this.isEmpty(formField.dateFormat)) {
          if (!this.isEmpty(formField.dateFormat.valueFormat)) {
            valueFormat = formField.dateFormat.valueFormat;
          }
          if (!this.isEmpty(formField.dateFormat.format)) {
            format = formField.dateFormat.format;
          }
        }
        value = formUtil.dateFormat(formUtil.formatDate(value, valueFormat), format);
        return value;
      } catch (error) {
        console.error(formField.fieldName + "日期数据解析错误");
        return value;
      }
    },
    async setFormValue(key, value) {
      if (key instanceof Object) {
        this.initSetFormValue = key;
        for (let i in key) {
          this.setFormValue(i, key[i]);
        }
        this.isSetFormValue = true;
      } else {
        let tmp = {
          key,
          value,
        };
        if (!this.setWaitData("setFormValue", tmp)) {
          return;
        }
        if (value == null || typeof value == "undefined") {
          if (this.formData[key] == null || typeof this.formData[key] == "undefined") {
            value = "";
          } else {
            value = this.formData[key];
          }
        }
        let formItem = this.option.formItem;
        let formItems = this.getFormItems(formItem);
        for (let i in formItems) {
          let formField = formItems[i];
          if (
            formField !== null &&
            (key === formField.fieldName ||
              key === formField.endFieldName ||
              key === formField.fieldDesc)
          ) {
            this.$set(this.formDataReal, key, value);
            if (
              formField.fieldType === "checkbox" ||
              formField.fieldType === "multipleSelection"
            ) {
              let checkValue = [];
              if (!this.isEmpty(value)) {
                //防止value不是string类型报错
                if (typeof value !== "string") {
                  value = value.toString();
                }
                let checkArray = value.split("|");
                for (let k in checkArray) {
                  if (!this.isEmpty(checkArray[k])) {
                    checkValue.push(checkArray[k]);
                  }
                }
              }
              value = checkValue;
            } else if (formField.fieldType === "cascader") {
              // if (this.option.query === "query") {
              //   let _this = formField;
              //   if (formField.library.url) {
              //     //从库中选择
              //     value = await this.getCascaderData(value, formField);
              //   } else {
              //     value = this.getCascaderDefaultData(value, formField);
              //   }
              // } else {
              value = value || "";
              let checkValue = [];
              if (formField.multiple) {
                //多选
                let checkArray = value.split("|");
                for (let k in checkArray) {
                  if (!this.isEmpty(checkArray[k])) {
                    checkValue.push(checkArray[k]);
                  }
                }
              } else {
                //单选
                let checkArray = value.split(",");
                for (let k in checkArray) {
                  if (!this.isEmpty(checkArray[k])) {
                    checkValue.push(checkArray[k]);
                  }
                }
              }
              value = checkValue;
              // }
            } else if (formField.fieldType === "text" && value) {
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
              if ((value + "").trim() == "") {
                value = "";
              }
            }
            if (this.option.query === "query") {
              let parmArray = this.pramDicItem[formField.fieldName];
              if (
                formField.fieldType === "checkbox" ||
                formField.fieldType === "multipleSelection"
              ) {
                if (formField.optionType === "1" && value) {
                  let checkBoxValue = "";
                  const selectItem = this.unique(formField.dicItem);
                  for (let h in value) {
                    if (!this.isEmpty(value[h])) {
                      for (let dic of selectItem) {
                        if (dic.optCode == value[h]) {
                          if (checkBoxValue === "") {
                            checkBoxValue = dic.optName;
                          } else {
                            checkBoxValue = checkBoxValue + "|" + dic.optName;
                          }
                        }
                      }
                    }
                  }
                  value = checkBoxValue;
                } else if (formField.optionType == "2" && value) {
                  let checkBoxValue = "";
                  for (let h in value) {
                    if (!this.isEmpty(value[h])) {
                      for (let i in parmArray) {
                        if (parmArray[i]["optCode"] === value[h]) {
                          if (checkBoxValue === "") {
                            checkBoxValue = parmArray[i]["optName"];
                          } else {
                            checkBoxValue = parmArray[i]["optName"] + "|" + checkBoxValue;
                          }
                        }
                      }
                    }
                  }
                  value = checkBoxValue;
                } else if (formField.optionType === "3" && value) {
                  let checkBoxValue = "";
                  let url = formField.library.url;
                  url = formUtil.converUrl(url);
                  let searchDataStr = formField.library.searchDataStr || "";
                  let searchDataArray = searchDataStr.split(";");
                  let searchData = {};
                  for (let i in searchDataArray) {
                    if (searchDataArray[i]) {
                      let searchDataObj = searchDataArray[i].split("-");
                      if (searchDataObj.length === 2) {
                        let value = searchDataObj[1];
                        value = formUtil.parsFieldName(
                          value,
                          this.initSetFormValue || this.formData,
                          this.$route
                        );
                        searchData[searchDataObj[0]] = value;
                      }
                    }
                  }
                  const reponse = await sync.getParameter(url, searchData, true);
                  let options = [];
                  if (reponse.code === 0) {
                    let list = reponse.list;
                    let realField = "optCode";
                    let showField = "optName";
                    if (
                      formField.library.realField !== undefined &&
                      formField.library.realField !== null &&
                      formField.library.realField !== ""
                    ) {
                      realField = formField.library.realField;
                    }
                    if (
                      formField.library.showField !== undefined &&
                      formField.library.showField !== null &&
                      formField.library.showField !== ""
                    ) {
                      showField = formField.library.showField;
                    }
                    for (let i in list) {
                      let option = {
                        value: list[i][realField] + "",
                        label: list[i][showField],
                      };
                      options.push(option);
                    }
                  } else {
                    console.error(reponse.msg);
                  }
                  for (let h in value) {
                    if (!this.isEmpty(value[h])) {
                      for (let i in options) {
                        if (options[i].value === value[h]) {
                          if (checkBoxValue === "") {
                            checkBoxValue = options[i].label;
                          } else {
                            checkBoxValue = options[i].label + "|" + checkBoxValue;
                          }
                        }
                      }
                    }
                  }
                  value = checkBoxValue;
                }
              } else if (formField.fieldType === "switch") {
                if (formField.switchValue.activeValue === value) {
                  value = formField.switchValue.activeText || "是";
                } else {
                  value = formField.switchValue.inActiveText || "否";
                }
              } else if (
                formField.fieldType === "date" ||
                formField.fieldType === "datetime" ||
                formField.fieldType === "dateGroup" ||
                formField.fieldType === "datetimeGroup" ||
                formField.fieldType === "timeGroup"
              ) {
                value = this.dateFormatType(formField, value, formField.fieldType);
              } else if (formField.fieldType === "select") {
                if (formField.optionType === "1" && value) {
                  // const selectItem = this.unique(formField.dicItem);
                  // for (let dic of selectItem) {
                  //   if (dic.optCode == value) {
                  //     value = dic.optName;
                  //     break;
                  //   }
                  // }
                } else if (formField.optionType == "2" && value) {
                  // let checkBoxValue = "";
                  // for (let i in parmArray) {
                  //   if (parmArray[i]["optCode"] === value) {
                  //     value = parmArray[i]["optName"];
                  //   }
                  // }
                } else if (formField.optionType === "3" && value) {
                  let checkBoxValue = "";
                  let url = formField.library.url;
                  url = formUtil.converUrl(url);
                  let searchDataStr = formField.library.searchDataStr || "";
                  let searchDataArray = searchDataStr.split(";");
                  let searchData = {};
                  for (let i in searchDataArray) {
                    if (searchDataArray[i]) {
                      let searchDataObj = searchDataArray[i].split("-");
                      if (searchDataObj.length === 2) {
                        let value = searchDataObj[1];
                        value = formUtil.parsFieldName(
                          value,
                          this.initSetFormValue,
                          this.$route
                        );
                        searchData[searchDataObj[0]] = value;
                      }
                    }
                  }
                  const reponse = await sync.getParameter(url, searchData, true);
                  let options = [];
                  if (reponse.code === 0) {
                    let list = reponse.list;
                    let realField = "optCode";
                    let showField = "optName";
                    if (
                      formField.library.realField !== undefined &&
                      formField.library.realField !== null &&
                      formField.library.realField !== ""
                    ) {
                      realField = formField.library.realField;
                    }
                    if (
                      formField.library.showField !== undefined &&
                      formField.library.showField !== null &&
                      formField.library.showField !== ""
                    ) {
                      showField = formField.library.showField;
                    }
                    for (let i in list) {
                      let option = {
                        value: list[i][realField],
                        label: list[i][showField],
                      };
                      options.push(option);
                    }
                  } else {
                    console.error(reponse.msg);
                  }
                  for (let i in options) {
                    if (options[i].value === value) {
                      value = options[i].label;
                    }
                  }
                }
              } else {
                for (let i in parmArray) {
                  if (parmArray[i]["optCode"] === value) {
                    value = parmArray[i]["optName"];
                  }
                }
              }
            }
            if (
              (this.option.query === "query" || this.option.formDisabled === true) &&
              !this.isEmpty(formField.formatter) &&
              formUtil.parentVmExist(this, formField.formatter)
            ) {
              value = this.parentVm._self[formField.formatter](value);
            }
            this.$set(this.formData, key, value);
            this.$set(this.setFormData, key, value);
          }
        }
      }
    },
    getFormValue() {
      let formItem = this.option.formItem;
      let data = JSON.parse(JSON.stringify(this.formData)); //深度copy
      if (arguments.length === 0) {
        for (let j in data) {
          let formItems = this.getFormItems(formItem);
          for (let i in formItems) {
            let formField = formItems[i];
            if (
              formField !== null &&
              (j === formField.fieldName || j === formField.endFieldName)
            ) {
              if (
                formField.fieldType === "checkbox" ||
                formField.fieldType === "multipleSelection"
              ) {
                if (this.option.query != "query") {
                  data[j] = (data[j] || []).join("|");
                }
              } else if (formField.fieldType === "text") {
                let formTextValue = data[j];
                if (formField.dataType === "money(yuan)") {
                  formTextValue = formUtil.delcommafy(formTextValue);
                } else if (formField.dataType === "money(wan)") {
                  formTextValue = formUtil.delcommafy(formTextValue);
                  formTextValue = formUtil.numMulti(formTextValue, 10000);
                } else if (formField.dataType === "money(baiwan)") {
                  formTextValue = formUtil.delcommafy(formTextValue);
                  formTextValue = formUtil.numMulti(formTextValue, 1000000);
                } else if (formField.dataType === "money(yi)") {
                  formTextValue = formUtil.delcommafy(formTextValue);
                  formTextValue = formUtil.numMulti(formTextValue, 100000000);
                } else if (formField.dataType === "percentile") {
                  formTextValue = formUtil.numDiv(formTextValue, 100);
                } else if (formField.dataType === "thousand") {
                  formTextValue = formUtil.numDiv(formTextValue, 1000);
                } else if (formField.dataType === "tenThousand") {
                  formTextValue = formUtil.numDiv(formTextValue, 10000);
                }
                data[j] = formTextValue;
              } else if (formField.fieldType === "cascader") {
                if (this.option.query != "query") {
                  if (formField.multiple) {
                    //多选
                    data[j] = data[formField.fieldName].join("|");
                  } else {
                    //单选
                    data[j] = data[formField.fieldName].join(",");
                  }
                }
              } else if (formField.isDialog === true && formField.fieldDesc != "") {
                if (formField.fieldDescValue) {
                  data[formField.fieldDesc] = formField.fieldDescValue;
                }
              }
            }
          }
        }
        return data;
      } else if (arguments.length >= 1) {
        let result = this.getFormValue();
        if (!this.isEmpty(result)) {
          result = result[arguments[0]];
        }
        return result;
      }
    },
    async getCascaderData(value, formField) {
      let url = formField.library.url;
      url = formUtil.converUrl(url);
      const reponse = await sync.getParameter(url, formField.library.searchData, true);
      if (reponse.code === 0) {
        if (formField.multiple) {
          //多选
          let checkAllArray = value.split("|");
          var res = "";
          for (let k in checkAllArray) {
            let checkArray = checkAllArray[k].split(",");
            if (k > 0) {
              res += "|";
            }
            //是否显示全部
            if (formField.showAll) {
              var separator = "/";
              if (formField.separator != null) {
                separator = formField.separator;
              }
              res += this.getCascaderAllValueForDB(
                checkArray,
                reponse.list,
                formField,
                separator
              );
            } else {
              res += this.getCascaderValueForDB(checkArray, reponse.list, formField);
            }
          }
          return res;
        } else {
          //单选
          let checkArray = value.split(",");
          //是否显示全部
          if (formField.showAll) {
            var separator = "/";
            if (formField.separator != null) {
              separator = formField.separator;
            }
            return this.getCascaderAllValueForDB(
              checkArray,
              reponse.list,
              formField,
              separator
            );
          } else {
            return this.getCascaderValueForDB(checkArray, reponse.list, formField);
          }
        }
      }
    },
    getCascaderDefaultData(value, formField) {
      if (formField.multiple) {
        //多选
        let checkAllArray = value.split("|");
        var res = "";
        for (let k in checkAllArray) {
          let checkArray = checkAllArray[k].split(",");
          if (k > 0) {
            res += "|";
          }
          //是否显示全部
          if (formField.showAll) {
            var separator = "/";
            if (formField.separator != null) {
              separator = formField.separator;
            }
            res += this.getCascaderAllValueByKey(
              formField.dicItem,
              checkArray[checkArray.length - 1],
              separator
            );
          } else {
            res += this.getCascaderValueByKey(
              formField.dicItem,
              checkArray[checkArray.length - 1]
            );
          }
        }
        return res;
      } else {
        //单选
        let checkArray = value.split(",");
        //是否显示全部
        if (formField.showAll) {
          var separator = "/";
          if (formField.separator != null) {
            separator = formField.separator;
          }
          return this.getCascaderAllValueByKey(
            formField.dicItem,
            checkArray[checkArray.length - 1],
            separator
          );
        } else {
          return this.getCascaderValueByKey(formField.dicItem, checkArray);
        }
      }
    },
    getCascaderValueForDB(checkArray, list, formField) {
      for (var i = 0; i < list.length; i++) {
        if (list[i][formField.library.realField] == checkArray[checkArray.length - 1]) {
          return list[i][formField.library.showField];
        }
      }
    },
    getCascaderAllValueForDB(checkArray, list, formField, separator) {
      var value = "";
      for (var j = 0; j < checkArray.length; j++) {
        for (var i = 0; i < list.length; i++) {
          if (list[i][formField.library.realField] == checkArray[j]) {
            if (value != "") {
              value = value + separator + list[i][formField.library.showField];
            } else {
              value = list[i][formField.library.showField];
            }
          }
        }
      }
      return value;
    },
    getCascaderValueByKey(data, field) {
      var value = "";
      for (let key in data) {
        if (data[key].optCode === field) {
          return data[key].optName;
        } else {
          if (data[key].children != null && data[key].children.length != 0) {
            value = this.getCascaderValueByKey(data[key].children, field);
            if (value != "" && value != null) {
              return value;
            }
          }
        }
      }
    },
    getCascaderAllValueByKey(data, field, separator) {
      var value = "";
      for (let key in data) {
        if (data[key].optCode === field) {
          return data[key].optName;
        } else {
          if (data[key].children != null && data[key].children.length != 0) {
            value = this.getCascaderAllValueByKey(data[key].children, field, separator);
            if (value != "" && value != null) {
              return data[key].optName + separator + value;
            }
          }
        }
      }
    },
    attr() {
      let formItem = this.option.formItem;
      if (arguments.length === 2) {
        let tmp = {
          key: arguments[0],
          value: arguments[1],
        };
        if (!this.setWaitData("attr", tmp)) {
          return;
        }
        let formField = null;
        for (let i in formItem) {
          if (formItem[i].fieldType === "group") {
            let groupItem = formItem[i].group;
            for (let j in groupItem) {
              if (arguments[0] === groupItem[j].fieldName) {
                formField = groupItem[j];
              }
            }
          } else {
            if (arguments[0] === formItem[i].fieldName) {
              formField = formItem[i];
            }
          }
        }
        let value = "";
        if (formField !== null) {
          if (arguments[1] === "dicItem") {
            value = this.pramDicItem[arguments[0]];
          } else if (arguments[1] === "events") {
            value = this.events[arguments[0]];
          } else if (arguments[1] === "rules") {
            value = this.rules[arguments[0]];
          } else {
            value = formField[arguments[1]];
          }
        }
        return value;
      } else if (arguments.length >= 3) {
        let tmp = {
          key: arguments[0] + "_" + arguments[1],
          value: arguments[2],
        };
        if (!this.setWaitData("attr", tmp)) {
          return;
        }
        let formField = null;
        for (let i in formItem) {
          if (formItem[i].fieldType === "group") {
            let groupItem = formItem[i].group;
            for (let j in groupItem) {
              if (arguments[0] === groupItem[j].fieldName) {
                formField = groupItem[j];
                formField["formItem"] = formItem[i];
              }
            }
          } else {
            if (arguments[0] === formItem[i].fieldName) {
              formField = formItem[i];
            }
          }
        }
        if (formField !== null) {
          let label = formField.label;
          if (arguments[1] === "dicItem") {
            this.$set(this.pramDicItem, arguments[0], arguments[2]);
          } else if (arguments[1] === "events") {
            //解析事件
            try {
              let eventsArray = arguments[2];
              let event = {};
              for (let evetIndex in eventsArray) {
                if (
                  !this.isEmpty(eventsArray[evetIndex].type) &&
                  eventsArray[evetIndex].type !== "click" &&
                  formUtil.parentVmExist(this, eventsArray[evetIndex].callback)
                ) {
                  event[eventsArray[evetIndex].type] = this.parentVm._self[
                    eventsArray[evetIndex].callback
                  ];
                }
              }
              this.$set(this.events, formField.fieldName, event);
            } catch (error) {
              console.error("事件解析错误：" + error);
              this.$set(this.events, formField.fieldName, {});
            }
          } else if (arguments[1] === "rules") {
            //解析规则
            try {
              //解析规则
              let formRules = arguments[2];
              let fieldNameRules = [];
              if (formField.fieldType === "text") {
                let type = formField.dataType;
                if (type === "int") {
                  let fieldNameRule = {};
                  fieldNameRule["validator"] = formUtil.validateInt;
                  fieldNameRule["trigger"] = "blur";
                  fieldNameRules.push(fieldNameRule);
                } else if (type == "long") {
                  let fieldNameRule = {};
                  fieldNameRule["validator"] = formUtil.validateLong;
                  fieldNameRule["trigger"] = "blur";
                  fieldNameRules.push(fieldNameRule);
                } else if (
                  type == "double(2)" ||
                  type == "double(4)" ||
                  type == "double(6)" ||
                  type == "money(fen)" ||
                  type == "money(jiao)" ||
                  type == "percentile" ||
                  type === "thousand" ||
                  type == "tenThousand"
                ) {
                  let fieldNameRule = {};
                  fieldNameRule["validator"] = formUtil.validateNumber;
                  fieldNameRule["trigger"] = "blur";
                  fieldNameRules.push(fieldNameRule);
                } else if (type == "float") {
                  let fieldNameRule = {};
                  fieldNameRule["validator"] = formUtil.validateFloat;
                  fieldNameRule["trigger"] = "blur";
                  fieldNameRules.push(fieldNameRule);
                } else if (type == "boolean") {
                  let fieldNameRule = {};
                  fieldNameRule["validator"] = formUtil.validateBoolean;
                  fieldNameRule["trigger"] = "blur";
                  fieldNameRules.push(fieldNameRule);
                } else if (
                  type === "money(yuan)" ||
                  type == "money(wan)" ||
                  type == "money(baiwan)" ||
                  type == "money(yi)"
                ) {
                  let fieldNameRule = {};
                  fieldNameRule["validator"] = formUtil.validateMoney;
                  fieldNameRule["trigger"] = "blur";
                  fieldNameRules.push(fieldNameRule);
                }
              }

              for (let k in formRules) {
                let fieldNameRule = {};
                let trigger = "blur";
                let message = "";
                let type = "";
                if (formRules[k].type === "required") {
                  if (!this.isEmpty(formField["formItem"])) {
                    formField["formItem"].required = true;
                  }
                  fieldNameRule["required"] = true;
                  trigger = "blur";
                  message = label + "不能为空";
                } else if (formRules[k].type === "validator") {
                  if (formUtil.parentVmExist(this, formRules[k].validator)) {
                    fieldNameRule["validator"] = this.parentVm._self[
                      formRules[k].validator
                    ];
                  }
                  trigger = "blur";
                } else if (formRules[k].type === "number") {
                  trigger = "blur";
                  var ruleExpr = formRules[k].ruleExpr;
                  fieldNameRule["validator"] = (rule, value, callback) => {
                    if (!value) {
                      callback();
                      return;
                    }
                    let item = null;
                    for (let i in this.option.formItem) {
                      if (this.option.formItem[i].fieldName == rule.field) {
                        item = this.option.formItem[i];
                      }
                    }
                    if (item.dataType == "money(yuan)") {
                      value = formUtil.delcommafy(value);
                    } else if (item.dataType == "money(wan)") {
                      value = formUtil.delcommafy(value);
                      value = formUtil.numMulti(value, 10000);
                    } else if (item.dataType == "money(baiwan)") {
                      value = formUtil.delcommafy(value);
                      value = formUtil.numMulti(value, 1000000);
                    } else if (item.dataType == "money(yi)") {
                      value = formUtil.delcommafy(value);
                      value = formUtil.numMulti(value, 100000000);
                    }
                    // console.log(ruleExpr);
                    let formData = this.getFormValue();
                    let expr = ruleExpr.replace(new RegExp("\\$\\{this\\}", "gm"), value);
                    for (let fieldName in formData) {
                      if (expr.indexOf(fieldName) == -1) {
                        continue;
                      }
                      let fieldValue = formData[fieldName];
                      if (fieldValue == "" || isNaN(fieldValue)) {
                        fieldValue = 0;
                      }
                      expr = expr.replace(
                        new RegExp("\\$\\{" + fieldName + "\\}", "gm"),
                        fieldValue
                      );
                    }
                    // console.log(expr);
                    let validFlag = eval(expr);
                    if (validFlag) {
                      callback();
                    } else {
                      callback(new Error(rule.message));
                    }
                  };
                } else if (formRules[k].type === "date") {
                  trigger = "blur";
                  // fieldNameRule["validator"] = formUtil.validateDate;
                  var ruleDateExpr = formRules[k].ruleExpr;
                  var resDate = (fieldName, value) => {
                    let formItem = this.option.formItem;
                    for (let i in formItem) {
                      let item = formItem[i];
                      if (
                        item.fieldName == fieldName &&
                        (item.fieldType == "date" ||
                          item.fieldType == "time" ||
                          item.fieldType == "datetime")
                      ) {
                        let format = item.dateFormat.format;
                        let valueFormat = item.dateFormat.valueFormat;
                        let date = formUtil.formatDate(value, valueFormat);
                        if (date && date instanceof Date && !isNaN(date.getTime())) {
                          return date.getTime();
                        } else {
                          return value;
                        }
                      }
                    }
                  };
                  fieldNameRule["validator"] = (rule, value, callback) => {
                    if (!value) {
                      callback();
                      return;
                    }
                    // console.log(ruleDateExpr);
                    let formData = this.getFormValue();
                    value = resDate(arguments[0], value);
                    let expr = ruleDateExpr.replace(
                      new RegExp("\\$\\{this\\}", "gm"),
                      value
                    );
                    for (let fieldName in formData) {
                      if (expr.indexOf(fieldName) == -1) {
                        continue;
                      }

                      let fieldValue = formData[fieldName];
                      fieldValue = resDate(fieldName, fieldValue);
                      expr = expr.replace(
                        new RegExp("\\$\\{" + fieldName + "\\}", "gm"),
                        fieldValue
                      );
                    }
                    try {
                      // console.log(expr);
                      let validFlag = eval(expr);
                      if (validFlag) {
                        callback();
                      } else {
                        callback(new Error(rule.message));
                      }
                    } catch (error) {}
                  };
                } else if (formRules[k].type === "email") {
                  trigger = "blur";
                  message = label + "格式不正确";
                  type = "email";
                } else if (formRules[k].type === "phone") {
                  trigger = "blur";
                  message = "请输入正确的手机号码";
                  fieldNameRule[
                    "pattern"
                    ] = /^((13[0-9])|(14[0-9])|(15([0-3]|[4-9]))|(16[0-9])|(17[0-9])|(18[0-9])|(19[0-9]))\d{8}$/;
                } else if (formRules[k].type === "mobile") {
                  trigger = "blur";
                  message = "请输入正确的电话";
                  fieldNameRule[
                    "pattern"
                  ] = /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/;
                } else if (formRules[k].type === "idNo") {
                  trigger = "blur";
                  fieldNameRule["validator"] = formUtil.validateIdNo;
                } else {
                  //continue
                }

                if (
                  formField.fieldType === "checkbox" ||
                  formField.fieldType === "multipleSelection"
                ) {
                  type = "array";
                }
                if (!this.isEmpty(formRules[k].min) && !this.isEmpty(formRules[k].max)) {
                  fieldNameRule["min"] = formRules[k].min;
                  fieldNameRule["max"] = formRules[k].max;
                  message =
                    label +
                    "长度必须大于等于" +
                    formRules[k].min +
                    "并且小于等于" +
                    formRules[k].max;
                } else if (!this.isEmpty(formRules[k].min)) {
                  fieldNameRule["min"] = formRules[k].min;
                  message = label + "长度必须大于等于" + formRules[k].min;
                } else if (!this.isEmpty(formRules[k].max)) {
                  fieldNameRule["max"] = formRules[k].max;
                  message = label + "长度必须小于等于" + formRules[k].max;
                }

                if (!this.isEmpty(formRules[k].message)) {
                  message = formRules[k].message;
                }
                fieldNameRule["message"] = message;

                if (!this.isEmpty(type)) {
                  fieldNameRule["type"] = type;
                }

                if (!this.isEmpty(formRules[k].trigger)) {
                  trigger = formRules[k].trigger;
                }
                fieldNameRule["trigger"] = trigger;

                fieldNameRules.push(fieldNameRule);
              }
              this.$set(this.rules, formField.fieldName, fieldNameRules);
            } catch (error) {
              console.error("规则解析错误：" + error);
              this.$set(this.rules, formField.fieldName, []);
            }
          } else {
            let td = this.tableData;
            label: for (let r in td) {
              let row = td[r];
              for (let c in row) {
                if (row[c].fieldName == formField.fieldName) {
                  row[c][arguments[1]] = arguments[2];
                  // if (arguments[1] == "isShow") {
                  //   row[c]["isOriginal"] = true;
                  // }
                  break label;
                }
              }
            }
          }
        }
      }
    },
    async initForm(callback) {
      if (this.formId) {
        try {
          let jsonData = await axios.get(
            formUtil.getFormProfilePath() + "/form/" + this.formId + ".json"
          );
          if (jsonData) {
            this.option = JSON.parse(JSON.stringify(this.doBeforeForm(jsonData.data)));
          } else {
            this.option = JSON.parse(
              JSON.stringify(this.doBeforeForm(this.$busDatas[this.formId]))
            );
          }
        } catch (error) {
          if (!this.initOption) {
            this.$message.error(
              "未找到 [ " + this.formId + " ] 配置文件或配置文件格式错误"
            );
          }
        }
      }
      if (this.initOption) {
        this.initOption = this.doBeforeForm(this.initOption);
        this.option = Object.assign(this.option, this.initOption);
      }

      this.initTableData();
      //处理隐藏域
      this.hiddenItem = this.option.formItem.filter((item) => {
        if (item.state && item.state.length > 0) {
          for (let sts of item.state) {
            if (sts.isShow !== false) {
              return false;
            }
          }
          item.isHiddenField = true;
          return true;
        } else if (item.isShow === false) {
          item.isHiddenField = true;
          return true;
        }
      });

      let formItem = this.option.formItem;
      let dicKeyArray = [];
      let formItems = this.getFormItems(formItem);
      for (let i in formItems) {
        let item = formItems[i];
        if (item.fieldType === "empty" || item.isHiddenField === true) {
          continue;
        }
        //处理状态
        let state = item.state;
        let use = item.useState;
        if (state && use) {
          for (let sts of state) {
            if (sts.id == use) {
              //将激活的状态和基础数据合并
              item = Object.assign(item, sts);
            } else {
              //解析字典项
              let dicKey = sts.dicKey;
              if (!this.isEmpty(dicKey) && sts.optionType !== "1") {
                // setFormValueFlag = true;
                let dicKeyObject = {};
                dicKeyObject.dicKey = dicKey;
                dicKeyObject.fieldName = item.fieldName;
                dicKeyObject.value = item.value;
                dicKeyArray.push(dicKeyObject);
              } else {
                this.$set(this.pramDicItem, sts.fieldName, sts.dicItem);
              }
            }
            //处理condition
            let condition = sts.condition;
            //处理条件，拿到具体的字段名称数组
            let key = Array.from(formUtil.doExpression(condition));
            //遍历字段名称，用于进行监听
            for (let name of key) {
              //都添加这个全局属性下
              if (this.state[name]) {
                this.state[name].push(Object.assign({}, item, sts));
              } else {
                this.state[name] = [Object.assign({}, item, sts)];
              }
            }
          }
        }

        if (
          Array.isArray(item.value) &&
          (item.fieldType === "checkbox" || item.fieldType === "multipleSelection")
        ) {
          item.value = item.value.join("|");
        }
        if (Array.isArray(item.value) && item.fieldType === "cascader") {
          if (item.multiple) {
            //多选
            item.value = item.value.join("|");
          } else {
            //单选
            item.value = item.value.join(",");
          }
        }
        //解析字典项
        let dicKey = item.dicKey;
        if (!this.isEmpty(dicKey) && item.optionType !== "1") {
          // setFormValueFlag = true;
          let dicKeyObject = {};
          dicKeyObject.dicKey = dicKey;
          dicKeyObject.fieldName = item.fieldName;
          dicKeyObject.value = item.value;
          dicKeyArray.push(dicKeyObject);
        } else {
          this.$set(this.pramDicItem, item.fieldName, item.dicItem);
        }

        //解析事件
        this.attr(item.fieldName, "events", item.events);
        //解析规则
        this.attr(item.fieldName, "rules", item.rules);
      }

      //请求字典json文件
      let keyArray = [];
      for (let j in dicKeyArray) {
        keyArray.push(dicKeyArray[j].dicKey);
      }
      keyArray = Array.from(new Set(keyArray));
      if (keyArray.length > 0) {
        this.dicKeyData = await formUtil.getParmDicSync(keyArray);
        for (let k in dicKeyArray) {
          this.$set(
            this.pramDicItem,
            dicKeyArray[k].fieldName,
            this.dicKeyData[dicKeyArray[k].dicKey]
          );
        }
      }

      /* 表单初始化赋值 */
      for (let i in formItems) {
        let item = formItems[i];
        if (item.fieldType === "empty") {
          continue;
        }
        if (
          item.fieldType === "dateGroup" ||
          item.fieldType === "datetimeGroup" ||
          item.fieldType === "timeGroup"
        ) {
          let value = ["", ""];
          if (Array.isArray(item.value)) {
            for (let d = 0; d < item.value.length; d++) {
              value[d] = item.value[d];
            }
          }
          if (!this.formData[item.fieldName]) {
            await this.setFormValue(item.fieldName, value[0]);
          }
          if (!this.formData[item.endFieldName]) {
            await this.setFormValue(item.endFieldName, value[1]);
          }
        } else {
          if (!this.formData[item.fieldName]) {
            await this.setFormValue(item.fieldName, item.value);
          }
        }
      }
      //表单初始化后将 页面中setFormValue的数据赋值
      await this.getWaitData();
      //初始化计算表单状态
      this.changeState();

      this.formFlag = true;
      //清空校验
      this.clearValidate();

      this.$nextTick(() => {
        //表单宽度适配, 单列 16栅格，双列 20 栅格
        try {
          let container = this.$refs[this.formId || this.option.formId].$parent.$parent
            .$parent;
          if (container && container.$el.className == "el-container") {
            let clsStr = container.$el.className;
            if (this.option.columns == 1) {
              clsStr += " mf-16";
            } else if (this.option.columns == 2) {
              clsStr += " mf-20";
            }
            container.$el.className = clsStr;
          }
        } catch (err) {}
        this.$emit("initCallBack", this.$refs[this.formId || this.option.formId]);
        if (typeof callback === "function") {
          callback(this.$refs[this.formId || this.option.formId]);
        }

        this.isLoad = true;
      });
    },
    changeState(val, key) {
      //表单数据
      let formData = val || this.formData;
      //拷贝原始表格数据
      let otd = this.clone(this.originalTableData);
      //判断如果操作的当前字段是会触发状态则只刷新table数据
      if (!this.isSetFormValue && key && !this.state[key]) {
        return;
      }
      this.isSetFormValue = false;
      //获取所有状态字段
      let fieldNames = Object.keys(this.state);
      for (let fieldName of fieldNames) {
        //获取状态数组
        let stateArr = this.state[fieldName];

        for (let item of stateArr) {
          //获取条件表达式
          let condition = item.condition;
          //获取条件的字段
          let keys = formUtil.doExpression(condition);
          //转换条件
          for (let name of keys.values()) {
            //字段真实值
            let value = formData[name];
            //判断是否综合视图页面
            if (this.option.query == "query") {
              //获取字段配置信息
              value = this.formDataReal[name];
            }
            //数字
            if (!isNaN(name)) {
              condition = condition.replaceAll("${" + name + "}", value);
            }
            //boolean
            else if (
              name === true ||
              name === false ||
              name === "true" ||
              name === "false"
            ) {
              condition = condition.replaceAll("${" + name + "}", value);
            }
            //string
            else {
              condition = condition.replaceAll("${" + name + "}", `'${value}'`);
            }
          }
          //判断条件是否触发
          if (eval(condition)) {
            //解析事件
            this.attr(item.fieldName, "events", item.events);
            //解析规则
            this.attr(item.fieldName, "rules", item.rules);
            //字典项替换
            if (item.dicKey) {
              this.$set(this.pramDicItem, item.fieldName, this.dicKeyData[item.dicKey]);
            }
            let formItem = this.option.formItem.find((field) => {
              if (item.fieldName == field.fieldName) {
                return true;
              } else {
                return false;
              }
            });
            //重新给表单赋值，因为状态切换后会改变表单字段的数据类型
            let value = this.formData[formItem.fieldName];
            if (formItem.fieldType === "text") {
              if (formItem.dataType === "money(yuan)") {
                value = formUtil.delcommafy(value);
              } else if (formItem.dataType === "money(wan)") {
                value = formUtil.delcommafy(value);
                value = formUtil.numMulti(value, 10000);
              } else if (formItem.dataType === "money(baiwan)") {
                value = formUtil.delcommafy(value);
                value = formUtil.numMulti(value, 1000000);
              } else if (formItem.dataType === "money(yi)") {
                value = formUtil.delcommafy(value);
                value = formUtil.numMulti(value, 100000000);
              } else if (formItem.dataType === "percentile") {
                value = formUtil.numDiv(value, 100);
              } else if (formItem.dataType === "thousand") {
                value = formUtil.numDiv(value, 1000);
              } else if (formItem.dataType === "tenThousand") {
                value = formUtil.numDiv(value, 10000);
              }
            }
            Object.assign(formItem, item);
            if (item.fieldType === "text") {
              if (item.dataType === "money(yuan)") {
                value = formUtil.formatMoney(value);
              } else if (item.dataType === "money(wan)") {
                value = formUtil.numDiv(value, 10000);
                value = formUtil.formatMoney(value);
              } else if (item.dataType === "money(baiwan)") {
                value = formUtil.numDiv(value, 1000000);
                value = formUtil.formatMoney(value);
              } else if (item.dataType === "money(yi)") {
                value = formUtil.numDiv(value, 100000000);
                value = formUtil.formatMoney(value);
              } else if (item.dataType === "percentile") {
                value = formUtil.numMulti(value, 100);
              } else if (item.dataType === "thousand") {
                value = formUtil.numMulti(value, 1000);
              } else if (item.dataType === "tenThousand") {
                value = formUtil.numMulti(value, 10000);
              }
            }
            this.$set(this.formData, item.fieldName, value);
            this.$set(this.setFormData, item.fieldName, value);
            //替换组件到表格数据中
            otd[item.rowIndex][item.colIndex] = item;
          }
        }
      }
      otd = this.calcTable(otd);
      this.$nextTick(() => {
        this.tableData = otd;
        this.clearValidate();
      });
    },
    //计算表格
    calcTable(otd) {
      let td = otd || this.clone(this.originalTableData);
      let len = td.length;
      let columns = this.option.columns;
      //对每一列从底部向上进行递归计算，判断需要上移不
      for (let index = 0; index < columns; index++) {
        let col = td[len - 1][index];
        this.deep(td, col, len - 1, index, len - 1);
      }
      return td;
    },
    //递归计算每一个单元格
    deep(td, col, rowIndex, colIndex, len) {
      if (!col) {
        return;
      }
      //如果涉及到跨列的 ，就修改计算的触发点，将最后一行的定位计算到跨列这里
      if ((col.belong || col.colspan > 1) && col.isShow !== false) {
        rowIndex >= 1 &&
          this.deep(td, td[rowIndex - 1][colIndex], rowIndex - 1, colIndex, rowIndex);
        return;
      }
      //如果当前格是隐藏的，就进行移动操作
      if (col && col.isShow === false) {
        //确保上一轮变化触发成功
        for (let c = 0; c < col.colspan; c++) {
          if (td[rowIndex][colIndex + c].fieldType == "empty") {
            td[rowIndex][colIndex + c].isShow = false;
          }
        }
        if (col.fieldType == "empty") {
          delete td[rowIndex][colIndex].isShow;
        }
        //移单元格向上
        this.modCol(td, col, rowIndex, colIndex, len);
      }
      rowIndex >= 1 &&
        this.deep(td, td[rowIndex - 1][colIndex], rowIndex - 1, colIndex, len);
    },
    modCol(td, col, rowIndex, colIndex, len) {
      //遍历当前向下的所有单元格往上一次
      for (let index = rowIndex; index <= len; index++) {
        //最后一行置空
        if (index == len) {
          td[index][colIndex] = this.returnCol(
            {},
            { rowIndex: index, colIndex: colIndex }
          );
          continue;
        }
        //变化
        td[index][colIndex] = td[index + 1][colIndex];
      }
    },
    rowStyleHandler(row) {
      let rowData = row.row;
      for (let cell in rowData) {
        let cellData = rowData[cell];
        if (cellData.fieldType != "empty") {
          return null;
        }
      }
      return { display: "none" };
    },
    setWaitData(state, data) {
      if (JSON.stringify(this.option) == "{}") {
        if ("setFormValue" == state) {
          let oldData = this.waitData[state] || {};
          oldData[data.key] = data.value;
          this.waitData[state] = oldData;
        } else if ("attr" == state) {
          let oldData = this.waitData[state] || {};
          oldData[data.key] = data.value;
          this.waitData[state] = oldData;
        }
        return false;
      } else {
        return true;
      }
    },
    async getWaitData() {
      for (let key in this.waitData) {
        if ("setFormValue" == key) {
          await this[key](this.waitData[key]);
        } else if ("attr" == key) {
          let data = this.waitData[key];
          for (let i in data) {
            if (i.indexOf("_") > -1) {
              let arr = i.split("_");
              this[key](arr[0], arr[1], data[i]);
            } else {
              this[key](i, data[i]);
            }
          }
        }
      }
      this.waitData = {};
    },
    clone(data) {
      return JSON.parse(JSON.stringify(data));
    },
  },
};
</script>
<style>
.mftcc-form {
  display: flex;
  flex-wrap: wrap;
  transform: translate(-50%, 0);
  left: 50%;
  position: relative;
}
.mftcc-form .el-form-item__content,
.mftcc-form-search .el-form-item__content {
  width: auto;
}
.mftcc-form .el-form-item,
.mftcc-form-search .el-form-item {
  padding-left: 20px;
  padding-right: 20px;
}
.mftcc-form .mftcc-form-group .el-form-item,
.mftcc-form-search .mftcc-form-group .el-form-item {
  padding: 0;
}
.mftcc-form .el-select,
.mftcc-form-search .el-select {
  width: 100%;
}
.mftcc-form .form-el-row,
.mftcc-form-search .form-el-row {
  width: 100%;
}
.mftcc-form .el-table td,
.mftcc-form-search .el-table td,
.mftcc-form-query .el-table td {
  border-bottom: none;
  padding: 0;
  /* height: 50px; */
}

.mftcc-form .el-table--border::after,
.mftcc-form .el-table::before,
.mftcc-form-search .el-table--border::after,
.mftcc-form-search .el-table::before,
.mftcc-form-query .el-table--border::after,
.mftcc-form-query .el-table::before,
.mftcc-form-expand .el-table--border::after,
.mftcc-form-expand .el-table::before {
  content: none;
}
.mftcc-form .el-input.is-disabled.mftcc-input.success .el-input__inner,
.mftcc-form .el-input.mftcc-input.success .el-input__inner,
.mftcc-form .mftcc-input.success .el-input.is-disabled .el-input__inner,
.mftcc-form .mftcc-input.success .el-input .el-input__inner,
.mftcc-form-query .el-form-item__content span.success {
  color: #67c23a;
}
.mftcc-form .el-input.is-disabled.mftcc-input.warning .el-input__inner,
.mftcc-form .el-input.mftcc-input.warning .el-input__inner,
.mftcc-form .mftcc-input.warning .el-input.is-disabled .el-input__inner,
.mftcc-form .mftcc-input.warning .el-input .el-input__inner,
.mftcc-form-query .el-form-item__content span.warning {
  color: #e6a23c;
}
.mftcc-form .el-input.is-disabled.mftcc-input.danger .el-input__inner,
.mftcc-form .el-input.mftcc-input.danger .el-input__inner,
.mftcc-form .mftcc-input.danger .el-input.is-disabled .el-input__inner,
.mftcc-form .mftcc-input.danger .el-input .el-input__inner,
.mftcc-form-query .el-form-item__content span.danger {
  color: #f56c6c;
}
</style>
