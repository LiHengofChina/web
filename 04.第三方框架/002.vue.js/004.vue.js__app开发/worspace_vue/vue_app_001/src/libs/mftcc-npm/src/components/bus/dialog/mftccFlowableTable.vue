<template>
  <el-dialog :visible.sync="visible"
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
             :title="doption.title">
    <div v-if="option.search"
         class="mftcc-form-tools">
      <el-radio-group v-model="stype"
                      size="small">
        <el-radio-button label="service">业务模型</el-radio-button>
        <el-radio-button label="flow">审批模型</el-radio-button>
      </el-radio-group>
      <div class="mftcc-form-tools-item"></div>
      <div class="mftcc-form-tools-item">
        <div class="dynamicQuery">
          <div class="el-input el-input--suffix">
            <input type="text"
                   v-model="searchCondi"
                   autocomplete="off"
                   placeholder="请输入查询条件"
                   class="el-input__inner">
            <span class="el-input__suffix">
              <span class="el-input__suffix-inner">
                <i @click="getTableData(pageNo,pageSize)"
                   class="el-input__icon el-icon-search"></i>
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div style="flex-grow: 1;position: relative;"
         class="mftcc-table">
      <div v-loading="loading">
        <el-table :data="tableData"
                  ref="modelTable"
                  highlight-current-row
                  @current-change="handleCurrentChange"
                  @row-click="getDetails"
                  style="width: 100%;height:100%"
                  row-key="id"
                  max-height="370"
                  lazy
                  :load="load"
                  :tree-props="{children: 'children', hasChildren: 'ifDevelop'}">
          <template v-for="(col,index) in columns">
            <!--:fixed="col.fixed || false"-->
            <el-table-column v-if="col.prop != '' ? col.isShow : true"
                             :key="index"
                             :prop="col.prop"
                             :label="col.label"
                             show-overflow-tooltip
                             :min-width="col.width"
                             :width="col.prop == '' ? col.width : ''">
            </el-table-column>
          </template>
        </el-table>
        <el-pagination v-if="doption.isPagination"
                       background
                       @size-change="handleSizeChange"
                       @current-change="handleCurrent"
                       :page-sizes="[10, 20, 50, 100]"
                       :page-size="pageSize"
                       :current-page="pageNo"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="pageTotal">
        </el-pagination>
      </div>
    </div>
    <div slot="footer"
         class="dialog-footer"
         v-if="doption.footer">
      <el-button type="primary"
                 @click="submit">{{
        doption.confirmButtonText
        }}
      </el-button>
      <el-button @click="visible = false">{{ doption.cancelButtonText }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
import api from '../../../api/model'

export default {
  data () {
    return {
      initData: {},
      visible: this.show,
      initSearchData: "",
      tableShow: false,
      tableData: [],
      pageNo: 1,
      pageSize: 10,
      pageTotal: 0,
      currentRow: null,
      selectData: {},
      searchCondi: '',
      loading: false,
      stype: "service",
      columns: [
        {
          prop: "id",
          label: "模型编号",
          width: "100px",
          isShow: true
        }, {
          prop: "name",
          label: "模型名称",
          width: "150px",
          isShow: true
        }, {
          prop: "key",
          label: "流程标识",
          width: "150px",
          isShow: true
        }, {
          prop: "version",
          label: "版本号",
          width: "150px",
          isShow: true
        }, {
          prop: "createTime",
          label: "创建时间",
          width: "150px",
          isShow: true
        }, {
          prop: "lastUpdateTime",
          label: "最后修改时间",
          width: "150px",
          isShow: true
        },
      ],
    };
  },
  props: {
    show: {
      type: Boolean,
      default () {
        return false;
      },
    },
    parentVm: {
      type: Object,
      default () {
        return null;
      },
    },
    option: {
      type: Object,
      default () {
        return {};
      },
    },
  },
  computed: {
    doption () {
      return Object.assign(
        {
          search: true,
          width: "1000px",
          height: "600px",
          fullscreen: false,
          center: false,
          footer: true,
          title: "选择流程",
          isPagination: true,
          confirmButtonText: "确 定",
          cancelButtonText: "取 消",
        },
        this.option
      );
    },
  },
  watch: {
    show () {
      let _this = this;
      this.visible = this.show;
      if (this.visible === true) {
        this.getTableData(this.pageNo, this.pageSize);
      }
    },
    stype (val) {
      this.getTableData(this.pageNo, this.pageSize);
    }
  },
  methods: {
    currentChange (pageNo) {
      this.pageNo = pageNo;
    },
    load (tree, treeNode, resolve) {
      api.getTreeData(tree, res => {
        if (res.code == 0) {
          let dataList = res.list;
          resolve(dataList)
        } else {
          this.$alert(res.msg, this.$alertTitle, {
            type: "error",
            dangerouslyUseHTMLString: true,
          });
        }
      });
    },
    getTableData (pageNo, pageSize) {
      var _this = this;
      this.searchData = this.searchData || {};
      this.searchData.pageNo = pageNo;
      this.searchData.pageSize = pageSize;
      this.searchData.name = this.searchCondi;
      if (this.stype == "service") {
        this.searchData.type = 1;
      } else {
        this.searchData.type = 0;
      }

      this.tableData = []
      api.findByPage(this.searchData, (res) => {
        if (res.code == 0) {
          let dataList = res.list;
          _this.tableData = dataList.records;
          console.log(this.tableData)
          _this.pageNo = dataList.current; // 当前页数
          _this.pageSize = dataList.size; // 每页数量
          _this.pageTotal = dataList.total;// 页面总数
          _this.loading = false
        }
      }, error => {
        this.loading = false
      });
    },
    submit () {
      this.$emit("callback", this.selectData);
      this.visible = false;
    },
    handleSizeChange (val) {
      this.getTableData(1, val);
    },
    handleCurrent (val) {
      this.getTableData(val, this.pageSize);
    },
    handleCurrentChange (val) {
      this.currentRow = val;
    },
    getDetails (row) {
      this.selectData = row
    },
    opened () {
      this.$refs.dialog.$el.children[0].style.height = this.option.height || '600px';
    }
  },
};
</script>
<style>
.el-table__body tr.current-row > td {
  background-color: #dff2ff !important;
}
</style>
