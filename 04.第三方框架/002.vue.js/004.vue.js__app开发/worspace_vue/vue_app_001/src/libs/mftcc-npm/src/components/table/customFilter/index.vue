<template>
  <div style="margin: 0px 12px; background: #ffffff; padding: 8px 12px">
    <div class="filterHeader">
      <span>已保存的定义筛选：</span>
      <template v-for="(item, index) in originalFilterData">
        <div :key="item.id" class="filterItem original">
          <div class="filterItemSelected">
            <i class="el-icon-check"></i>
          </div>
          <el-button
            :class="{
              filterItemBtn: true,
              active: filterType == 'original' && filterIndex == index
            }"
            type="primary"
            @click="filterSelected(item, index, 'original')"
            >{{ item.label }}</el-button
          >
        </div>
      </template>
      <template v-for="(item, index) in customFilterData">
        <div :key="item.id" class="filterItem" v-if="item.label != ''">
          <div
            :class="{ filterItemSelected: true, selected: item.selected }"
            @click="changeSelected(index)"
          >
            <i v-show="item.selected" class="el-icon-check"></i>
          </div>
          <el-button
            :class="{
              filterItemBtn: true,
              active: filterType == 'custom' && filterIndex == index
            }"
            type="primary"
            @click="filterSelected(item, index, 'custom')"
            >{{ item.label }}</el-button
          >
        </div>
      </template>
      <!-- <el-popover
        placement="bottom"
        width="300"
        v-model="showPopover"
        trigger="click"
        @show="popoverFormShow"
      >
        <el-form
          :model="popoverForm"
          :rules="rules"
          ref="popoverForm"
          label-width="80px"
          size="mini"
        >
          <el-form-item label="筛选名称" prop="name">
            <el-input v-model="popoverForm.name"></el-input>
          </el-form-item>
        </el-form>
        <div style="text-align: right; margin: 0">
          <el-button size="mini" type="text" @click="showPopover = false">取消</el-button>
          <el-button type="primary" size="mini" @click="addFilter">确定</el-button>
        </div>
        <el-button
          slot="reference"
          type="text"
          icon="el-icon-plus"
          style="margin-left: 16px"
          >新增筛选条件</el-button
        >
      </el-popover> -->
      <el-button
        type="text"
        icon="el-icon-plus"
        style="margin-left: 16px"
        @click="addNewFilter"
        >新增筛选条件</el-button
      >
      <span class="lengthError" v-if="showLengthError"
        >只能展示5个常用条件！</span
      >
    </div>
    <div
      class="filterContent"
      v-if="filterType == 'custom' && customFilterData.length > 0"
    >
      <template v-for="(item, index) in customFilterData[filterIndex].filter">
        <el-row :gutter="20" :key="index" v-if="index % 2 == 0">
          <el-col :span="11"
            ><filter-item
              :index="index"
              :columns="columns"
              :filter="item"
              @setFilter="setFilter"
              @delFilterItem="delFilterItem"
              :pramDicItem="pramDicItem"
            ></filter-item>
          </el-col>
          <el-col :span="13"
            ><filter-item
              :index="index + 1"
              v-if="customFilterData[filterIndex].filter[index + 1]"
              :columns="columns"
              :filter="customFilterData[filterIndex].filter[index + 1]"
              @setFilter="setFilter"
              @delFilterItem="delFilterItem"
              :pramDicItem="pramDicItem"
            ></filter-item
          ></el-col>
        </el-row>
      </template>
      <el-button
        type="text"
        icon="el-icon-plus"
        style="margin-left: 16px"
        @click="addFilterContent"
        >新增</el-button
      >
    </div>
    <div v-else-if="filterType == 'original' && originalFilterData.length > 0">
      <el-row :gutter="20">
        <el-col :span="11"
          ><filter-item
            :columns="columns"
            :filter="originalFilterData[filterIndex]"
            :pramDicItem="pramDicItem"
            :disabled="true"
          ></filter-item
        ></el-col>
      </el-row>
    </div>
    <div class="filterFooter">
      <el-button type="primary" @click="searchFilter">搜索</el-button>
      <el-button type="primary" @click="saveFilterData">保存</el-button>
      <el-button @click="deleteFilterData">删除</el-button>
      <el-button @click="resetFilterData">重置</el-button>
    </div>
    <el-dialog
      append-to-body
      custom-class="filterNameDialog"
      title="定义检索名称"
      :visible.sync="showFilterNameDialog"
    >
      <el-form
        :model="filterNameForm"
        :rules="rules"
        ref="filterNameForm"
        label-width="80px"
      >
        <el-form-item label="筛选名称" prop="name">
          <el-input
            v-model="filterNameForm.name"
            maxlength="6"
            :show-word-limit="true"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showFilterNameDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveFilterData('new')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import filterItem from "./filterItem";
import api from "../../../api/sysCustomFilter";
export default {
  data() {
    return {
      originalFilterData: [],
      filterNameForm: {
        name: ""
      },
      rules: {
        name: [{ required: true, message: "请输入筛选名称", trigger: "blur" }]
      },
      resultData: {},
      filterIndex: -1,
      filterType: null,
      refreshFilterContent: true,
      showFilterNameDialog: false,
      showLengthError: false
    };
  },
  components: {
    filterItem
  },
  props: {
    queryTabs: {
      type: Array,
      default: []
    },
    columns: {
      type: Array,
      default: []
    },
    pramDicItem: {
      type: Object,
      default: {}
    },
    customFilterData: {
      type: Array,
      default: []
    }
  },
  created() {
    // this.customFilterData = JSON.parse(
    //   '[{"id":"custom_1621405012760","label":"111","selected":true,"filter":[{"andor":"and","conditions":"eq","value":"111","fieldName":"userId"},{"andor":"and","conditions":"eq","value":"222","fieldName":"opName"}]},{"id":"custom_1621405014493","label":"222","selected":false,"filter":[{"andor":"and","conditions":"ne","value":"FT","fieldName":"brNo"},{"andor":"or","conditions":"notLike","value":["001","ZC_BBGL","ZC_BMFZJL"],"fieldName":"roleNo"}]}]'
    // );
    this.originalFilterData = JSON.parse(JSON.stringify(this.queryTabs));
    if (this.originalFilterData.length > 0) {
      this.filterIndex = 0;
      this.filterType = "original";
      for (let item of this.originalFilterData) {
        item.conditions = "eq";
      }
    } else if (this.customFilterData.length > 0) {
      this.filterIndex = 0;
      this.filterType = "custom";
    }
  },
  methods: {
    searchFilter() {
      let filter = this.customFilterData[this.filterIndex].filter;
      if (!filter || filter.length == 0) {
        return;
      }
      this.$parent.customQuery = JSON.stringify(filter);
      this.$parent.setSelectValue();
      this.$parent.search();
    },
    delFilterItem(index) {
      this.customFilterData[this.filterIndex].filter.splice(index, 1);
      this.$set(
        this.customFilterData,
        this.filterIndex,
        this.customFilterData[this.filterIndex]
      );
    },
    setFilter(data, index) {
      this.customFilterData[this.filterIndex].filter[index] = data;
    },
    saveFilterData(type) {
      if (this.showFilterNameDialog) {
        this.$refs.filterNameForm.validate(valid => {
          if (valid) {
            this.customFilterData[
              this.filterIndex
            ].label = this.filterNameForm.name;
            this.save();
          } else {
            return false;
          }
        });
      } else if (type == "new") {
        this.save();
        this.isNew = false;
      } else if (this.isNew == true) {
        this.showFilterNameDialog = true;
      } else {
        this.save();
      }
    },
    save() {
      let data = {
        router: this.$route.path,
        opNo: this.$store.getters.user.opNo,
        customFilter: JSON.stringify(this.customFilterData)
      };
      api.save(data, res => {
        if (res.code == 0) {
          this.$set(
            this.customFilterData,
            this.filterIndex,
            this.customFilterData[this.filterIndex]
          );
          this.showFilterNameDialog = false;
          this.filterNameForm.name = "";
          this.$message.success(res.msg);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    resetFilterData() {
      this.customFilterData[this.filterIndex].filter = [];
      this.addFilterContent();
    },
    deleteFilterData() {
      this.customFilterData.splice(this.filterIndex, 1);
      if (this.filterIndex > 0) {
        this.filterIndex--;
      }
    },
    addFilterContent() {
      let filter = this.customFilterData[this.filterIndex].filter || [];
      filter.push({
        fieldName: "",
        conditions: "",
        value: "",
        andor: "and"
      });
      this.customFilterData[this.filterIndex].filter = filter;
      this.$set(
        this.customFilterData,
        this.filterIndex,
        this.customFilterData[this.filterIndex]
      );
    },
    filterSelected(item, index, type) {
      this.filterIndex = index;
      this.filterType = type;
    },
    changeSelected(index) {
      this.showLengthError = false;
      if (this.customFilterData[index].selected) {
        this.customFilterData[index].selected = false;
      } else {
        let customFilterDataSelected = this.customFilterData.filter(item => {
          if (item.selected) {
            return true;
          } else {
            return false;
          }
        });
        if (
          this.originalFilterData.length + customFilterDataSelected.length >=
          5
        ) {
          this.showLengthError = true;
          return;
        }
        this.customFilterData[index].selected = true;
      }
      this.$set(this.customFilterData, index, this.customFilterData[index]);
    },
    addNewFilter() {
      this.isNew = true;
      if (
        this.customFilterData.length > 0 &&
        !this.customFilterData[this.customFilterData.length - 1].label
      ) {
        this.$message.warning("请保存当前筛选条件后新增！");
        return;
      }
      // if (this.originalFilterData.length + this.customFilterData.length >= 5) {
      //   this.$message.warning("只能展示5个常用条件！");
      //   return false;
      // }
      let item = {
        id: "custom_" + new Date().getTime(),
        label: "",
        selected: false
      };
      this.customFilterData.push(item);
      this.filterType = "custom";
      this.filterIndex = this.customFilterData.length - 1;
      this.addFilterContent();
    }
    // addFilter() {
    //   this.$refs.popoverForm.validate((valid) => {
    //     if (valid) {
    //       if (this.originalFilterData.length + this.customFilterData.length >= 5) {
    //         this.$message.warning("只能展示5个常用条件！");
    //         return false;
    //       }
    //       let item = {
    //         id: "custom_" + new Date().getTime(),
    //         label: this.popoverForm.name,
    //         selected: true,
    //       };
    //       this.customFilterData.push(item);
    //       this.filterType = "custom";
    //       this.filterIndex = this.customFilterData.length - 1;
    //       this.addFilterContent();
    //       this.showPopover = false;
    //     } else {
    //       return false;
    //     }
    //   });
    // },
  }
};
</script>

<style>
.filterHeader {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
}
.filterHeader .filterItem {
  display: flex;
  align-items: center;
  margin: 0 12px;
}
.filterHeader .filterItemSelected {
  width: 23px;
  height: 24px;
  font-size: 16px;
  color: #409eff;
  border: 1px solid #409eff;
  border-radius: 4px 0px 0px 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  cursor: pointer;
}
.filterHeader .original .filterItemSelected {
  cursor: not-allowed;
  color: #ccc;
  border-color: #ccc;
}
.filterHeader .filterItemBtn.el-button {
  height: 24px;
  padding: 0 6px;
  min-width: auto;
  border-radius: 0px 4px 4px 0px;
  margin-left: 4px;
}
.filterHeader .filterItemBtn.el-button.active {
  background-color: #2c6bb7;
}
.filterFooter {
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #deecfa;
}
.filterContent {
  padding-left: 60px;
}
.filterContent .el-col {
  padding: 0 !important;
}
.filterNameDialog .el-dialog__body {
  height: 350px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.filterNameDialog .el-dialog__body .el-form {
  width: 70%;
}
.filterNameDialog .el-dialog__body .el-form .el-form-item__label {
  height: 40px;
  line-height: 40px;
}
.lengthError {
  color: #f6766a;
  line-height: 1;
  margin-left: 20px;
}
</style>
