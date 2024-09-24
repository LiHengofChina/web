<template>
  <div
    ref="mftccTable"
    style="flex-grow: 1; position: relative"
    :class="option.query === 'query' ? 'mftcc-table-query' : 'mftcc-table'"
  >
    <div class="tableTools">
      <el-dropdown
        size="small"
        v-if="option.isDColumn"
        :hide-on-click="false"
        class="el-dropdown-DColumn"
        trigger="click"
      >
        <el-button
          icon="el-icon-setting"
          type="primary"
          class="mftcc-table-dropdown"
        >
        </el-button>
        <el-dropdown-menu slot="dropdown" style="text-align: center">
          <div style="text-align: left">
            <template v-for="(col, index) in option.columns">
              <el-dropdown-item :key="index" v-if="col.prop != ''">
                <el-checkbox
                  :checked="col.isShow"
                  v-model="col.isShow"
                  @change="checkChange(col)"
                  >{{ col.label }}</el-checkbox
                >
              </el-dropdown-item>
            </template>
          </div>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button
        v-if="option.isExport && $hasPerm(option.isExportPerm || true)"
        type="primary"
        class="exportBtn"
        icon="el-icon-download"
        @click="exportTable"
      ></el-button>
    </div>
    <div v-loading="option.loading">
      <el-table
        :data="option.tableData"
        :max-height="maxHeight"
        :height="height"
        highlight-current-row
        :ref="option.tableId"
        style="width: 100%"
        empty-text="暂无数据"
        :row-style="rowStyle"
        :row-class-name="rowClassName"
        :cell-style="cellStyle"
        :cell-class-name="cellClassName"
        @current-change="currentChange"
        @selection-change="$emit('selection-change', $event)"
      >
        <template
          v-if="
            option.isSelect != '' && option.isSelect ? option.isSelect : false
          "
        >
          <el-table-column type="selection" width="55"> </el-table-column>
        </template>
        <template v-for="(col, index) in option.columns">
          <el-table-column
            v-if="col.prop != '' ? col.isShow : true"
            :key="index"
            :prop="col.prop"
            :label="col.label"
            :show-overflow-tooltip="
              col['show-overflow-tooltip'] === true ? true : false
            "
            :min-width="col.width"
            :fixed="col.fixed || false"
            :align="col.align || 'left'"
            :width="col.prop == '' ? col.width : ''"
          >
            <template slot-scope="scope">
              <div v-if="col.prop == ''">
                <template v-for="(btn, key) in col.data">
                  <el-button
                    :key="key"
                    size="mini"
                    :disabled="buttonAuth(btn, scope.row)"
                    v-if="$hasPerm(btn.perm || true)"
                    @click="Fn(btn.type, scope.$index, scope.row)"
                    >{{ btn.label }}</el-button
                  >
                </template>
              </div>
              <div v-else-if="col.href != undefined">
                <div v-if="col.href.path != undefined">
                  <a
                    href="javascript:void(0)"
                    @click="router(col.href, scope.row)"
                    >{{ tableFormatter(scope.row[col.prop], col) }}</a
                  >
                </div>
                <div v-else-if="col.href.callbackType != undefined">
                  <a
                    href="javascript:void(0)"
                    @click="Fn(col.href.callbackType, scope.$index, scope.row)"
                    >{{ tableFormatter(scope.row[col.prop], col) }}</a
                  >
                </div>
                <div v-else>
                  <span>{{ tableFormatter(scope.row[col.prop], col) }}</span>
                </div>
              </div>
              <div v-else-if="col.fieldType === 'switch'">
                <el-switch
                  v-model="scope.row[col.prop]"
                  :active-value="
                    isEmpty(col.switchAttr) ||
                    isEmpty(col.switchAttr.activeValue)
                      ? 0
                      : col.switchAttr.activeValue
                  "
                  :inactive-value="
                    isEmpty(col.switchAttr) ||
                    isEmpty(col.switchAttr.inActiveValue)
                      ? 1
                      : col.switchAttr.inActiveValue
                  "
                  :disabled="
                    isEmpty(col.switchAttr) || isEmpty(col.switchAttr.disabled)
                      ? false
                      : col.switchAttr.disabled
                  "
                  :readonly="
                    isEmpty(col.switchAttr) || isEmpty(col.switchAttr.readOnly)
                      ? false
                      : col.switchAttr.readOnly
                  "
                  @change="
                    Fn(col.switchAttr.changeEvent, scope.$index, scope.row)
                  "
                ></el-switch>
              </div>
              <div v-else>
                <span>{{ tableFormatter(scope.row[col.prop], col) }}</span>
              </div>
            </template>
          </el-table-column>
        </template>
        <!-- <el-table-column
                label="操作"
                :min-width="option.buttons.width">
                <template slot-scope="scope">
                    <el-button v-for="(btn,index) in option.buttons.data"
                        :key="index"
                        size="mini"
                        v-if="$hasPerm(btn.perm||true)"
                        @click="Fn(btn.type, scope.$index, scope.row)">{{ btn.label }}</el-button>
                </template>
            </el-table-column> -->
      </el-table>
    </div>
    <el-pagination
      v-if="option.isPagination"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :current-page="pageNo"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageTotal"
    >
    </el-pagination>
  </div>
</template>

<script>
import { findByPage, getParameter } from "../axios";
import formUtil from "../utils/formUtil";
export default {
  data() {
    return {
      option: {},
      searchData: {},
      maxHeight: null,
      height: null,
      pageNo: 1,
      pageSize: 10,
      pageTotal: 0,
      currentRow: null,

      isEmpty: formUtil.isEmpty,
      pramDicItem: {},
      exportHeader: [],
      exportField: []
    };
  },
  props: ["tableId", "initData", "initSearchData", "parentVm"],
  watch: {
    tableId: {
      handler(val, oldVal) {
        this.initTable(() => {
          this.$emit("callback");
        });
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.tableResize();
    });
  },
  methods: {
    rowStyle(obj) {
      let event = this.option["row-style"];
      if (Object.prototype.toString.call(event) === "[object Object]") {
        return event;
      } else if (event && formUtil.parentVmExist(this, event)) {
        return this.parentVm._self[event](obj);
      }
    },
    rowClassName(obj) {
      let event = this.option["row-class-style"];
      if (event && formUtil.parentVmExist(this, event)) {
        return this.parentVm._self[event](obj);
      } else {
        return event;
      }
    },
    cellStyle(obj) {
      let event = this.option["cell-style"];
      if (Object.prototype.toString.call(event) === "[object Object]") {
        return event;
      } else if (event && formUtil.parentVmExist(this, event)) {
        return this.parentVm._self[event](obj);
      }
    },
    cellClassName(obj) {
      let event = this.option["cell-class-style"];
      if (event && formUtil.parentVmExist(this, event)) {
        return this.parentVm._self[event](obj);
      } else {
        return event;
      }
    },
    buttonAuth(btn, row) {
      let buttonAuth = false;
      let auth = btn.auth || "";
      let authArray = auth.split(";");
      for (let i in authArray) {
        if (!this.isEmpty(authArray[i])) {
          let authObj = authArray[i].split("-");
          if (authObj.length === 2) {
            if (this.$store.getters.buttonAuth[authObj[0]] == authObj[1]) {
              buttonAuth = true;
            } else if (row[authObj[0]] == authObj[1]) {
              buttonAuth = true;
            }
          }
        }
      }
      return buttonAuth;
    },
    tableFormatter(cellValue, item) {
      let _this = this;
      let value = "";
      if (_this.isEmpty(cellValue)) {
        return cellValue;
      } else {
        value = cellValue;
      }
      let parmArray = _this.pramDicItem[item.prop];
      if (
        item.fieldType === "checkbox" ||
        item.fieldType === "multipleSelection"
      ) {
        let checkBoxValue = "";
        let checkArray = cellValue.split("|");
        for (let h in checkArray) {
          if (!_this.isEmpty(checkArray[h])) {
            for (let i in parmArray) {
              if (parmArray[i]["optCode"] === checkArray[h]) {
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
      } else if (item.fieldType === "text") {
        if (item.dataType === "money(yuan)") {
          value = formUtil.formatMoney(cellValue);
        } else if (item.dataType === "percentile") {
          value = formUtil.numMulti(cellValue, 100);
        } else if (item.dataType === "thousand") {
          value = formUtil.numMulti(cellValue, 1000);
        } else if (item.dataType === "tenThousand") {
          value = formUtil.numMulti(cellValue, 10000);
        }
      } else if (item.fieldType === "date") {
        try {
          let valueFormat = "yyyyMMdd";
          let format = "yyyy-MM-dd";
          if (!this.isEmpty(item.dateFormat)) {
            if (!this.isEmpty(item.dateFormat.valueFormat)) {
              valueFormat = item.dateFormat.valueFormat;
            }
            if (!this.isEmpty(item.dateFormat.format)) {
              format = item.dateFormat.format;
            }
          }
          value = formUtil.dateFormat(
            formUtil.formatDate(value, valueFormat),
            format
          );
        } catch (error) {
          console.error(item.fieldName + "日期数据解析错误");
        }
      } else if (item.fieldType === "datetime") {
        try {
          let valueFormat = "yyyyMMdd HH:mm:ss";
          let format = "yyyy-MM-dd HH:mm:ss";
          if (!this.isEmpty(item.dateFormat)) {
            if (!this.isEmpty(item.dateFormat.valueFormat)) {
              valueFormat = item.dateFormat.valueFormat;
            }
            if (!this.isEmpty(item.dateFormat.format)) {
              format = item.dateFormat.format;
            }
          }
          value = formUtil.dateFormat(
            formUtil.formatDate(value, valueFormat),
            format
          );
        } catch (error) {
          console.error(item.fieldName + "日期数据解析错误");
        }
      } else {
        for (let i in parmArray) {
          if (parmArray[i]["optCode"] === cellValue) {
            value = parmArray[i]["optName"];
          }
        }
      }
      if (
        !_this.isEmpty(item.formatter) &&
        formUtil.parentVmExist(this, item.formatter)
      ) {
        value = this.parentVm._self[item.formatter](value);
      } else if (!_this.isEmpty(item.desensitization)) {
        value = formUtil.desensitization(value, item.desensitization);
      }
      return value;
    },
    Fn(method, index, row) {
      // this[method](index, row);
      //this.$emit('callback', method, index, row);
      if (formUtil.parentVmExist(this, method)) {
        this.parentVm._self[method](index, row);
      }
    },
    router(href, row) {
      let path = href.path;
      let query = {};
      for (let queryKey of href.query) {
        query[queryKey] = row[queryKey];
      }
      this.$router.push({ path: path, query: query });
    },
    tableResize() {
      if (!this.option.height || this.option.height == "auto") {
        if (this.option.maxHeight) {
          this.maxHeight = this.option.maxHeight;
        } else {
          this.maxHeight = this.$refs.mftccTable.offsetHeight;
        }
        this.option.maxHeight = this.maxHeight;
        if (this.option.isPagination === true) {
          if ((this.maxHeight + "").endsWith("px")) {
            this.maxHeight =
              Number(this.maxHeight.substring(0, this.maxHeight.length - 2)) -
              40;
          } else {
            this.maxHeight = Number(this.maxHeight) - 40;
          }
        }
        if (this.maxHeight <= 0) {
          this.maxHeight = null;
        }
      } else {
        this.height = this.option.height;
      }
    },
    getTableData(pageNo, pageSize, callback) {
      var _this = this;
      this.searchData = this.searchData || {};
      this.searchData.pageNo = pageNo;
      this.searchData.pageSize = pageSize;
      _this.option.tableData = [];
      let url = this.option.url;
      url = formUtil.converUrl(url);
      findByPage(
        url,
        this.searchData,
        true,
        res => {
          if (res.code == 0) {
            let dataList = res.list;
            if (_this.option.isPagination === true || pageSize == -1) {
              _this.option.tableData = dataList.records;
              _this.pageNo = dataList.current; // 当前页数
              _this.pageSize = dataList.size; // 每页数量
              _this.pageTotal = dataList.total; // 页面总数
              let colList = res.colList;
              if (colList && colList.length > 0) {
                _this.option.columns = colList;
              }
            } else {
              _this.option.tableData = dataList;
            }
          }
          _this.option.loading = false;
          _this.$nextTick(() => {
            _this.tableResize();
          });
          if (typeof callback === "function") {
            _this.$nextTick(() => {
              callback();
            });
          }
        },
        error => {
          _this.option.loading = false;
          _this.$nextTick(() => {
            _this.tableResize();
          });
          if (typeof callback === "function") {
            _this.$nextTick(() => {
              callback();
            });
          }
        }
      );
    },
    refresh() {
      this.getTableData(this.pageNo, this.pageSize);
    },
    search(searchData) {
      this.pageNo = 1;
      this.pageSize = 10;
      this.pageTotal = 0;
      this.currentRow = null;
      this.searchData = this.initSearchData || {};
      if (!this.isEmpty(searchData)) {
        for (let i in searchData) {
          this.searchData[i] = searchData[i];
        }
      }
      this.getTableData(this.pageNo, this.pageSize);
    },
    // handleRowChange(val) {
    //     this.currentRow = val;
    // },
    handleSizeChange(val) {
      this.getTableData(1, val);
    },
    handleCurrentChange(val) {
      this.getTableData(val, this.pageSize);
    },
    checkChange(col) {
      console.log(col);
    },
    setSelectValue() {
      if (arguments.length === 0) {
        this.$refs[this.option.tableId].clearSelection();
      } else if (arguments.length === 1) {
        this.setSelectValue(this.option.selectKey, arguments[0]);
      } else if (arguments.length === 2) {
        let selectKey = arguments[0];
        let tableDatas = this.option.tableData;
        let value = arguments[1];
        if (!(arguments[1] instanceof Array)) {
          value = [arguments[1]];
        }
        for (let i in tableDatas) {
          if (
            tableDatas[i][selectKey] !== undefined &&
            value.indexOf(tableDatas[i][selectKey]) > -1
          ) {
            this.$refs[this.option.tableId].toggleRowSelection(tableDatas[i]);
          }
        }
      } else {
        let selectKey = arguments[0];
        let tableDatas = this.option.tableData;
        let value = arguments[1];
        if (!(arguments[1] instanceof Array)) {
          value = [arguments[1]];
        }
        for (let i in tableDatas) {
          if (
            tableDatas[i][selectKey] !== undefined &&
            value.indexOf(tableDatas[i][selectKey]) > -1
          ) {
            this.$refs[this.option.tableId].toggleRowSelection(
              tableDatas[i],
              arguments[2]
            );
          }
        }
      }
    },
    getSelectValue() {
      let parmKeyArray = this.$refs[this.option.tableId].store.states.selection;
      return parmKeyArray;
    },
    setCurrentValue() {
      if (arguments.length === 0) {
        this.$refs[this.option.tableId].setCurrentRow();
      } else if (arguments.length === 1) {
        this.setCurrentValue(this.option.selectKey, arguments[0]);
      } else {
        let selectKey = arguments[0];
        let tableDatas = this.option.tableData;
        for (let i in tableDatas) {
          if (
            tableDatas[i][selectKey] !== undefined &&
            tableDatas[i][selectKey] === arguments[1]
          ) {
            this.$refs[this.option.tableId].setCurrentRow(tableDatas[i]);
            break;
          }
        }
      }
    },
    getCurrentValue() {
      return this.currentRow;
    },
    currentChange(currentRow, oldCurrentRow) {
      this.currentRow = currentRow;
      this.$emit("current-change", currentRow, oldCurrentRow);
    },
    async initTable(callback) {
      let _this = this;
      _this.option = {};
      _this.searchData = _this.initSearchData || {};
      _this.maxHeight = null;
      _this.height = null;
      _this.pageNo = 1;
      _this.pageSize = 10;
      _this.pageTotal = 0;
      _this.currentRow = null;
      let tableData;
      try {
        if (this.tableId) {
          let jsonData = await axios.get(
            formUtil.getFormProfilePath() + "/table/" + this.tableId + ".json"
          );
          tableData = jsonData.data;
        }
      } catch (error) {
        _this.$message.error(
          "未找到 [ " + this.tableId + " ] 配置文件或配置文件格式错误"
        );
      }
      _this.option = JSON.parse(JSON.stringify(tableData));
      if (_this.initData !== undefined) {
        for (let i in _this.initData) {
          _this.option[i] = _this.initData[i];
        }
      }

      let formItem = _this.option.columns;
      let dicKeyArray = [];
      for (let i in formItem) {
        if (formItem[i].prop !== "") {
          //解析字典项
          let dicKey = formItem[i].dicKey;
          if (!_this.isEmpty(dicKey)) {
            let dicKeyObject = {};
            dicKeyObject.dicKey = dicKey;
            dicKeyObject.fieldName = formItem[i].prop;
            dicKeyArray.push(dicKeyObject);
          } else {
            _this.$set(
              _this.pramDicItem,
              formItem[i].prop,
              formItem[i].dicItem
            );
          }

          //获取库中选择字典
          if (
            (formItem[i].fieldType === "select" ||
              formItem[i].fieldType === "multipleSelection") &&
            formItem[i].dataType === "library"
          ) {
            getParameter(formItem[i].library.url, { query: "" }, true, function(
              reponse
            ) {
              if (reponse.code === 0) {
                let parmArray = [];
                let list = reponse.list;
                let realField = "optCode";
                let showField = "optName";
                if (!_this.isEmpty(formItem[i].library.realField)) {
                  realField = formItem[i].library.realField;
                }
                if (!_this.isEmpty(formItem[i].library.showField)) {
                  showField = formItem[i].library.showField;
                }
                for (let i in list) {
                  let option = {
                    optCode: list[i][realField],
                    optName: list[i][showField]
                  };
                  parmArray.push(option);
                }
                _this.$set(_this.pramDicItem, formItem[i].prop, parmArray);
              }
            });
          }
        }
      }

      //请求字典json文件
      let keyArray = [];
      for (let j in dicKeyArray) {
        keyArray.push(dicKeyArray[j].dicKey);
      }
      formUtil.getParmDic(keyArray, dicKeyData => {
        for (let k in dicKeyArray) {
          _this.$set(
            _this.pramDicItem,
            dicKeyArray[k].fieldName,
            dicKeyData[dicKeyArray[k].dicKey]
          );
        }
      });

      let url = _this.option.url;
      if (url !== undefined && url !== null && url !== "") {
        _this.getTableData(_this.pageNo, _this.pageSize, callback);
      } else {
        if (typeof callback === "function") {
          _this.$nextTick(() => {
            callback();
          });
        }
      }
      // _this.$nextTick(() => {
      //     _this.tableResize();
      // })
    },
    exportTable() {
      this.$confirm("确定要导出当前列表全部数据？", "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          this.getExpportData();
        })
        .catch(() => {});
    },
    getExpportData() {
      let loading = this.$loading({
        lock: true,
        text: "正在拼命导出......",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.searchData = this.searchData || {};
      this.searchData.pageNo = 1;
      this.searchData.pageSize = -1;

      findByPage(
        this.option.url,
        this.searchData,
        true,
        res => {
          if (res.code == 0 && res.list.records.length > 0) {
            require.ensure([], () => {
              /* eslint-disable */
              // 这里的径路要修改正确
              const {
                export_json_to_excel
              } = require("../plugins/Export2Excel.js");
              /* eslint-enable  */
              for (let c in this.option.columns) {
                if (this.option.columns[c].prop != "") {
                  this.exportField.push(this.option.columns[c].prop);
                  this.exportHeader.push(this.option.columns[c].label);
                }
              }
              let tableData = res.list.records;
              const data = this.formatJson(this.option.columns, tableData);
              export_json_to_excel(this.exportHeader, data, this.tableId);
              loading.close();
            });
          } else {
            this.$alert(res.msg, this.$alertTitle, {
              type: res.msgType,
              dangerouslyUseHTMLString: true
            });
            loading.close();
          }
        },
        error => {
          console.log(error);
          loading.close();
        }
      );
    },
    formatJson(columns, tableData) {
      let data = tableData.map(data => {
        return columns.map(col => {
          if (col.prop != "" && col.isShow) {
            let value = data[col.prop];
            if (
              col.dataType === "money(yuan)" ||
              col.dataType === "money(wan)" ||
              col.dataType === "percentile" ||
              col.dataType === "thousand" ||
              col.dataType === "tenThousand"
            ) {
              return value;
            } else {
              return this.tableFormatter(value, col);
            }
          } else {
            return null;
          }
        });
      });
      return data;
    }
  }
};
</script>
<style>
.mftcc-table .el-checkbox__label {
  font-size: 12px;
}
.mftcc-table .tableTools {
  position: absolute;
  z-index: 1;
  top: 8px;
  right: 8px;
}
.mftcc-table .exportBtn,
.mftcc-table .mftcc-table-dropdown {
  border: 1px solid rgb(64 158 255 / 45%);
  background: #fff;
  color: #409eff;
  border-radius: 2px;
  width: 68px;
  padding: 0;
}
.mftcc-table .el-pagination {
  margin-top: 5px;
}
.mftcc-table-query .el-table__body,
.mftcc-table .el-table__body {
  width: calc(100% - 4px) !important;
}
</style>
