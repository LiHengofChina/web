<template>
  <el-dialog
    :visible.sync="visible"
    @close="$emit('update:show', false)"
    :show="show"
    class="mftcc-table-dialog"
    :width="doption.width"
    ref="dialog"
    @open="opened"
    append-to-body
    :fullscreen="doption.fullscreen"
    :center="doption.center"
    :close-on-click-modal="false"
    :title="doption.title"
  >
    <div slot="title" class="dialog-header">
      <label>{{ title }}</label>
    </div>
    <div>
      <el-row class="tool-row">
        <el-col :span="6" class="stype">
          <el-radio-group v-model="stype" size="small">
            <el-radio-button label="form">表单</el-radio-button>
            <el-radio-button label="table">列表</el-radio-button>
            <el-radio-button label="layout">布局</el-radio-button>
          </el-radio-group>
        </el-col>
        <el-col :span="8" class="note">*展示最新十条数据</el-col>
        <el-col :span="10" class="right">
          <div v-if="option.search" class="mftcc-form-tools">
            <div class="mftcc-form-tools-item"></div>
            <div class="mftcc-form-tools-item">
              <div class="dynamicQuery">
                <div class="el-input el-input--suffix">
                  <input
                    type="text"
                    autocomplete="off"
                    v-model="condition"
                    :placeholder="placeholder"
                    class="el-input__inner"
                  />
                  <span class="el-input__suffix">
                    <span class="el-input__suffix-inner">
                      <i @click="find()" class="el-input__icon el-icon-search"></i>
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-table
        :data="tableData"
        highlight-current-row
        @current-change="handleCurrentChange"
        @row-click="getDetails"
        max-height="400"
        header-row-class-name="table-row"
        cell-class-name="table-col"
      >
        <el-table-column
          property="id"
          align="center"
          min-width="180"
          :label="id"
        ></el-table-column>
        <el-table-column
          property="name"
          align="center"
          min-width="180"
          :label="name"
        ></el-table-column>
        <el-table-column
          property="type"
          align="center"
          min-width="100"
          label="服务标识"
        ></el-table-column>
        <el-table-column
          property="time"
          align="center"
          min-width="170"
          label="最后修改时间"
        ></el-table-column>
      </el-table>
    </div>
    <div slot="footer" class="dialog-footer" v-if="doption.footer">
      <el-button type="primary" @click="submit"
        >{{ doption.confirmButtonText }}
      </el-button>
      <el-button @click="visible = false">{{ doption.cancelButtonText }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
import api from "../../../api/sysForm";

export default {
  data() {
    return {
      title: "表单信息",
      id: "表单编号",
      name: "表单名称",
      placeholder: "按表单编号搜索",
      visible: this.show,
      condition: "",
      tableShow: false,
      tableData: [],
      currentRow: null,
      selectData: {},
      searchCondi: "",
      loading: false,
      stype: "form",
      _tableData: [],
    };
  },
  props: {
    show: {
      type: Boolean,
      default() {
        return false;
      },
    },
    parentVm: {
      type: Object,
      default() {
        return null;
      },
    },
    option: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  computed: {
    doption() {
      return Object.assign(
        {
          search: true,
          width: "1000px",
          fullscreen: false,
          center: false,
          footer: true,
          title: "选择表单",
          isPagination: true,
          confirmButtonText: "确 定",
          cancelButtonText: "取 消",
        },
        this.option
      );
    },
  },
  watch: {
    show() {
      let _this = this;
      this.visible = this.show;
      if (this.visible === true) {
        _this.show && _this.getTableData(_this.stype);
      }
    },
    stype(val) {
      if (val == "form") {
        this.title = "表单信息";
        this.id = "表单编号";
        this.name = "表单名称";
        this.placeholder = "按表单编号搜索";
      } else if (val == "table") {
        this.title = "列表信息";
        this.id = "列表编号";
        this.name = "列表名称";
        this.placeholder = "按列表编号搜索";
      } else if (val == "layout") {
        this.title = "布局信息";
        this.id = "布局编号";
        this.name = "布局名称";
        this.placeholder = "按布局编号搜索";
      }
      this.getTableData(this.stype);
    },
  },
  methods: {
    getTableData(type) {
      var _this = this;
      this.tableData = [];
      api.getFormData(
        type,
        (res) => {
          if (res.code == 0) {
            _this.tableData = res.data;
            _this._tableData = res.data;
            _this.loading = false;
          }
        },
        (error) => {
          this.loading = false;
        }
      );
    },
    find() {
      let _this = this;
      let condition = _this.condition;
      if (!condition) {
        _this.tableData = _this._tableData;
        return;
      }
      api.find(_this.stype, condition, (r) => {
        if (r.code == 0) {
          _this.tableData = r.data;
        }
      });
    },
    submit() {
      this.$emit("callback", this.selectData);
      this.visible = false;
    },
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    getDetails(row) {
      this.selectData = row;
    },
    opened() {
      this.$refs.dialog.$el.children[0].style.height = this.option.height || "600px";
    },
  },
};
</script>
<style>
.el-table__body tr.current-row > td {
  background-color: #dff2ff !important;
}
</style>
