<template>
  <div class="mftcc-definitidon-search">
    <el-row>
      <el-col :span="12">
        <div class="custom-search">
          <el-menu :default-active="filterMenuactiveIndex" mode="horizontal">
            <el-menu-item
              v-for="(menu, index) in filterMenu || []"
              :key="index"
              :index="index.toString()"
              @click="menuSearch(menu.query)"
              >{{ menu.label }}</el-menu-item
            >
          </el-menu>
          <el-button
            type="text"
            icon="el-icon-circle-plus-outline"
            class="definitidon-button"
            @click="searchShow = !searchShow"
            v-if="filterDic.show === true"
            >定义筛选</el-button
          >
        </div>
      </el-col>
      <el-col :span="8" class="search-col">
        <div class="dynamic-search">
          <el-input
            :placeholder="searchPlaceholder || '请输入查询条件'"
            suffix-icon="el-icon-search"
            v-model="searchData"
            class="dynamic-input"
            @input="search()"
          >
          </el-input>
          <el-button
            v-for="(filterButtonItem, index) in filterButton || []"
            :key="index"
            :icon="filterButtonItem.icon"
            @click="buttonEvent(filterButtonItem.event)"
            >{{ filterButtonItem.label }}</el-button
          >
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-collapse-transition>
        <div v-if="searchShow">
          <div class="dynamic-edit-filter">
            <span>已保存的历史检索</span>
            <el-tabs
              v-model="editableFilter"
              type="card"
              closable
              @tab-remove="removeFilter"
              @tab-click="clickFilter"
            >
              <el-tab-pane
                v-for="filter in filters"
                :key="filter.filterNo"
                :label="filter.filterName"
                :name="filter.filterNo"
              >
              </el-tab-pane>
            </el-tabs>
          </div>
          <el-form :model="definitidonForm" ref="definitidonForm" @submit.native.prevent>
            <el-form-item
              v-for="(definitidon, index) in definitidonForm.definitidon"
              :key="index"
            >
              <el-col :span="3">
                <template v-if="index == 0"> 请选择： </template>
                <template v-else>
                  <el-form-item :prop="'definitidon.' + index + '.andOr'">
                    <el-radio-group v-model="definitidon.andOr">
                      <el-radio-button label="0">并且</el-radio-button>
                      <el-radio-button label="1">或者</el-radio-button>
                    </el-radio-group>
                  </el-form-item>
                </template>
              </el-col>
              <el-col :span="5">
                <el-form-item
                  :prop="'definitidon.' + index + '.fieldName'"
                  :rules="[
                    { required: true, message: '字段不能为空！', trigger: 'change' },
                  ]"
                >
                  <el-select
                    v-model="definitidon.fieldName"
                    clearable
                    placeholder="请选择"
                    @change="fieldChange(index)"
                  >
                    <el-option
                      v-for="item in filterDic.filter"
                      :key="item.fieldName"
                      :label="item.label"
                      :value="item.fieldName"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <template v-if="getFilterDic(index).dicType !== ''">
                  <el-form-item
                    :prop="'definitidon.' + index + '.dicType'"
                    :rules="[
                      { required: true, message: '条件不能为空！', trigger: 'change' },
                    ]"
                  >
                    <el-select
                      v-model="definitidon.dicType"
                      clearable
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in dicType[getFilterDic(index).dicType]"
                        :key="item.optCode"
                        :label="item.optName"
                        :value="item.optCode"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </template>
              </el-col>
              <template v-if="getFilterDic(index).dicType === 'select'">
                <template
                  v-if="
                    definitidonForm.definitidon[index].dicType === '3' ||
                    definitidonForm.definitidon[index].dicType === '4'
                  "
                >
                  <el-col :span="4">
                    <el-form-item
                      :prop="'definitidon.' + index + '.value'"
                      :rules="[
                        { required: true, message: '值不能为空！', trigger: 'change' },
                      ]"
                    >
                      <el-select
                        v-model="definitidon.value"
                        clearable
                        placeholder="请选择"
                      >
                        <el-option
                          v-for="item in getFilterDic(index).dicItem"
                          :key="item.optCode"
                          :label="item.optName"
                          :value="item.optCode"
                        >
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col class="line" :span="1">-</el-col>
                  <el-col :span="4">
                    <el-form-item
                      :prop="'definitidon.' + index + '.secondValue'"
                      :rules="[
                        { required: true, message: '值不能为空！', trigger: 'change' },
                      ]"
                    >
                      <el-select
                        v-model="definitidon.secondValue"
                        clearable
                        placeholder="请选择"
                      >
                        <el-option
                          v-for="item in getFilterDic(index).dicItem"
                          :key="item.optCode"
                          :label="item.optName"
                          :value="item.optCode"
                        >
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </template>
                <template v-else-if="definitidonForm.definitidon[index].dicType !== ''">
                  <el-col :span="9">
                    <el-form-item
                      :prop="'definitidon.' + index + '.value'"
                      :rules="[
                        { required: true, message: '值不能为空！', trigger: 'change' },
                      ]"
                    >
                      <el-select
                        v-model="definitidon.value"
                        clearable
                        placeholder="请选择"
                      >
                        <el-option
                          v-for="item in getFilterDic(index).dicItem"
                          :key="item.optCode"
                          :label="item.optName"
                          :value="item.optCode"
                        >
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </template>
              </template>
              <template v-else-if="getFilterDic(index).dicType === 'number'">
                <template
                  v-if="
                    definitidonForm.definitidon[index].dicType === '3' ||
                    definitidonForm.definitidon[index].dicType === '4'
                  "
                >
                  <el-col :span="4">
                    <el-form-item
                      :prop="'definitidon.' + index + '.value'"
                      :rules="[
                        { required: true, message: '值不能为空！', trigger: 'blur' },
                      ]"
                    >
                      <el-input
                        type="number"
                        v-model.number="definitidon.value"
                        autocomplete="off"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col class="line" :span="1">-</el-col>
                  <el-col :span="4">
                    <el-form-item
                      :prop="'definitidon.' + index + '.secondValue'"
                      :rules="[
                        { required: true, message: '值不能为空！', trigger: 'blur' },
                      ]"
                    >
                      <el-input
                        type="number"
                        v-model.number="definitidon.secondValue"
                        autocomplete="off"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </template>
                <template v-else-if="definitidonForm.definitidon[index].dicType !== ''">
                  <el-col :span="9">
                    <el-form-item
                      :prop="'definitidon.' + index + '.value'"
                      :rules="[
                        { required: true, message: '值不能为空！', trigger: 'blur' },
                      ]"
                    >
                      <el-input
                        type="number"
                        v-model.number="definitidon.value"
                        autocomplete="off"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </template>
              </template>
              <template v-else-if="getFilterDic(index).dicType === 'text'">
                <template
                  v-if="
                    definitidonForm.definitidon[index].dicType === '3' ||
                    definitidonForm.definitidon[index].dicType === '4'
                  "
                >
                  <el-col :span="4">
                    <el-form-item
                      :prop="'definitidon.' + index + '.value'"
                      :rules="[
                        { required: true, message: '值不能为空！', trigger: 'blur' },
                      ]"
                    >
                      <el-input
                        type="text"
                        v-model="definitidon.value"
                        autocomplete="off"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col class="line" :span="1">-</el-col>
                  <el-col :span="4">
                    <el-form-item
                      :prop="'definitidon.' + index + '.secondValue'"
                      :rules="[
                        { required: true, message: '值不能为空！', trigger: 'blur' },
                      ]"
                    >
                      <el-input
                        type="text"
                        v-model="definitidon.secondValue"
                        autocomplete="off"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </template>
                <template v-else-if="definitidonForm.definitidon[index].dicType !== ''">
                  <el-col :span="9">
                    <el-form-item
                      :prop="'definitidon.' + index + '.value'"
                      :rules="[
                        { required: true, message: '值不能为空！', trigger: 'blur' },
                      ]"
                    >
                      <el-input
                        type="text"
                        v-model="definitidon.value"
                        autocomplete="off"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </template>
              </template>
              <template v-else-if="getFilterDic(index).dicType === 'date'">
                <template
                  v-if="
                    definitidonForm.definitidon[index].dicType === '3' ||
                    definitidonForm.definitidon[index].dicType === '4'
                  "
                >
                  <el-col :span="9">
                    <el-form-item
                      :prop="'definitidon.' + index + '.value'"
                      :rules="[
                        { required: true, message: '值不能为空！', trigger: 'change' },
                      ]"
                    >
                      <el-date-picker
                        v-model="definitidon.value"
                        type="daterange"
                        range-separator="至"
                        format="yyyy-MM-dd"
                        value-format="yyyyMMdd"
                        placeholder="请选择"
                      >
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
                </template>
                <template v-else-if="definitidonForm.definitidon[index].dicType !== ''">
                  <el-col :span="9">
                    <el-form-item
                      :prop="'definitidon.' + index + '.value'"
                      :rules="[
                        { required: true, message: '值不能为空！', trigger: 'change' },
                      ]"
                    >
                      <el-date-picker
                        v-model="definitidon.value"
                        format="yyyy-MM-dd"
                        value-format="yyyyMMdd"
                        type="date"
                        placeholder="请选择"
                      >
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
                </template>
              </template>
              <el-col :span="2">
                <el-button
                  icon="el-icon-circle-plus-outline"
                  circle
                  @click.prevent="addDefinitidon"
                  size="small"
                ></el-button>
                <template v-if="definitidonForm.definitidon.length !== 1">
                  <el-button
                    icon="el-icon-circle-close"
                    circle
                    @click.prevent="removeDefinitidon(index)"
                    size="small"
                  ></el-button>
                </template>
              </el-col>
            </el-form-item>
          </el-form>
          <div class="mftcc-definitidon-btn">
            <el-button type="primary" @click="search()">搜索</el-button>
            <el-button type="primary" @click="submitFilter">保存</el-button>
            <el-button type="primary" @click="resetDefinitidon">重置</el-button>
          </div>
        </div>
      </el-collapse-transition>
    </el-row>
  </div>
</template>
<script>
import { del, get, postJson, putJson } from "../axios";
export default {
  props: ["filterDic", "parentVm", "filterMenu", "filterButton", "searchPlaceholder"],
  data() {
    return {
      defaultDefinitidon: {
        andOr: "0",
        fieldName: "",
        fieldType: "",
        dicType: "",
        value: "",
        secondValue: "",
      },
      definitidonForm: {
        definitidon: [
          {
            andOr: "0",
            fieldName: "",
            fieldType: "",
            dicType: "",
            value: "",
            secondValue: "",
          },
        ],
      },
      dicType: {
        select: [
          { optName: "是", optCode: "0" },
          { optName: "不是", optCode: "99" },
        ],
        number: [
          { optName: "等于", optCode: "0" },
          { optName: "大于", optCode: "1" },
          { optName: "小于", optCode: "2" },
          { optName: "在...之间", optCode: "3" },
          { optName: "不在...之间", optCode: "4" },
        ],
        text: [{ optName: "是", optCode: "0" }],
        date: [
          { optName: "等于", optCode: "0" },
          { optName: "大于", optCode: "1" },
          { optName: "小于", optCode: "2" },
          { optName: "在...之间", optCode: "3" },
          { optName: "不在...之间", optCode: "4" },
        ],
      },
      filters: [],
      editableFilter: "default",
      clickTabFilter: "default",
      searchShow: false,
      searchData: "",
      filterMenuactiveIndex: "",
    };
  },
  watch: {
    searchShow() {
      if (this.searchShow === true) {
        this.init();
      }
    },
    filterMenu: {
      handler(val, oldVal) {
        for (let i = 0; i < val.length; i++) {
          if (val[i].default === true) {
            this.filterMenuactiveIndex = i.toString();
          }
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    getSearchData(searchData) {
      searchData.dynamicQuery = this.searchData;
      if (this.searchShow === true) {
        searchData.customQuery = JSON.stringify(this.definitidonForm.definitidon);
      }
      return searchData;
    },
    buttonEvent(event) {
      if (event !== undefined && event !== null && event !== "") {
        let searchData = this.getSearchData({});
        this.parentVm._self[event](searchData);
      }
    },
    //组件初始化方法
    init() {
      get(
        "/"+$servers.sys+"/sys/sysUserSearchFilter/findByVue/" +
          this.parentVm.$options.name,
        null,
        true,
        (res) => {
          if (res.code === 0) {
            let filterList = res.list;
            this.filters = filterList;
            this.editableFilter = "default";
            this.clickTabFilter = "default";
            let definitidonObj = JSON.parse(JSON.stringify(this.defaultDefinitidon));
            this.filters.unshift({
              filterNo: "default",
              filterName: "新增",
              filterContent: JSON.stringify([definitidonObj]),
            });
            this.resetDefinitidon();
          } else {
            this.$alert(res.msg, this.$alertTitle, {
              type: res.msgType,
              dangerouslyUseHTMLString: true,
              callback: (action) => {
                this.searchShow = false;
              },
            });
          }
        },
        (error) => {
          this.searchShow = false;
        }
      );
    },
    //根据索引获取当前筛选配置
    getFilterDic(index) {
      let result = {
        dicItem: [],
        dicType: "",
      };
      for (let filterDic of this.filterDic.filter) {
        if (filterDic.fieldName === this.definitidonForm.definitidon[index].fieldName) {
          result = filterDic;
        }
      }
      return result;
    },
    //字段change事件
    fieldChange(index) {
      this.definitidonForm.definitidon[index].fieldType = this.getFilterDic(
        index
      ).dicType;
      this.definitidonForm.definitidon[index].dicType = "";
      this.definitidonForm.definitidon[index].value = "";
      this.definitidonForm.definitidon[index].secondValue = "";
    },
    //新增筛选
    submitFilter() {
      this.$refs.definitidonForm.validate((valid) => {
        if (valid) {
          let filterNo = this.clickTabFilter;
          let filterContent = JSON.stringify(this.definitidonForm.definitidon);
          let data = {
            vue: this.parentVm.$options.name,
            filterNo: filterNo,
            filterContent: filterContent,
          };
          if (filterNo !== "default") {
            this.$confirm("此操作将保存该筛选, 是否继续?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            }).then(() => {
              putJson(
                "/"+$servers.sys+"/sys/sysUserSearchFilter/update",
                data,
                true,
                (reponse) => {
                  if (reponse.code === 0) {
                    this.$message({
                      type: reponse.msgType,
                      dangerouslyUseHTMLString: true,
                      message: reponse.msg,
                    });
                    this.filters.forEach((currentValue, index, arr) => {
                      if (currentValue.filterNo == filterNo) {
                        currentValue.filterContent = filterContent;
                      }
                    });
                  } else {
                    this.$alert(reponse.msg, this.$alertTitle, {
                      type: reponse.msgType,
                      dangerouslyUseHTMLString: true,
                    });
                  }
                }
              );
            });
          } else {
            this.$prompt("请输入筛选名称", this.$alertTitle, {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              inputPattern: /\S/,
              inputErrorMessage: "筛选名称不能为空",
            })
              .then(({ value }) => {
                data.filterName = value;
                postJson(
                  "/"+$servers.sys+"/sys/sysUserSearchFilter/insert",
                  data,
                  true,
                  (res) => {
                    if (res.code === 0) {
                      this.$message({
                        type: res.msgType,
                        dangerouslyUseHTMLString: true,
                        message: res.msg,
                      });
                      this.filters.push(res.data);
                      this.editableFilter = res.data.filterNo;
                      this.clickTabFilter = res.data.filterNo;
                    } else {
                      this.$alert(res.msg, this.$alertTitle, {
                        type: res.msgType,
                        dangerouslyUseHTMLString: true,
                      });
                    }
                  }
                );
              })
              .catch(() => {});
          }
        } else {
          return false;
        }
      });
    },
    //删除已保存筛选
    removeFilter(filterNo) {
      if (filterNo !== "default") {
        this.$confirm("此操作将永久删除该筛选, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          del(
            "/"+$servers.sys+"/sys/sysUserSearchFilter/deleteById/" + filterNo,
            null,
            true,
            (reponse) => {
              if (reponse.code === 0) {
                this.$message({
                  type: reponse.msgType,
                  dangerouslyUseHTMLString: true,
                  message: reponse.msg,
                });
                if (this.clickTabFilter === filterNo) {
                  this.editableFilter = "default";
                  this.clickTabFilter = "default";
                  this.resetDefinitidon();
                }
                this.filters.forEach((currentValue, index, arr) => {
                  if (currentValue.filterNo == filterNo) {
                    this.filters.splice(index, 1);
                  }
                });
              } else {
                this.$alert(reponse.msg, this.$alertTitle, {
                  type: reponse.msgType,
                  dangerouslyUseHTMLString: true,
                });
              }
            }
          );
        });
      }
    },
    //点击已保存的筛选
    clickFilter(filter) {
      if (this.clickTabFilter !== filter.name) {
        this.filters.forEach((currentValue) => {
          if (currentValue.filterNo == filter.name) {
            this.definitidonForm.definitidon = JSON.parse(currentValue.filterContent);
          }
        });
        this.clickTabFilter = filter.name;
      }
    },
    //查询按钮回调
    search() {
      this.$refs.definitidonForm.validate((valid) => {
        if (valid) {
          let searchData = this.getSearchData({});
          this.$emit("search", searchData);
        } else {
          return false;
        }
      });
    },
    menuSearch(searchData) {
      this.$emit("search", searchData);
    },
    //移除筛选
    removeDefinitidon(index) {
      this.definitidonForm.definitidon.splice(index, 1);
    },
    //重置筛选
    resetDefinitidon() {
      let definitidonObj = JSON.parse(JSON.stringify(this.defaultDefinitidon));
      this.definitidonForm.definitidon = [definitidonObj];
    },
    //添加筛选条件
    addDefinitidon() {
      let definitidonObj = JSON.parse(JSON.stringify(this.defaultDefinitidon));
      this.definitidonForm.definitidon.push(definitidonObj);
    },
  },
};
</script>
<style>
.mftcc-definitidon-search .dynamic-search {
  width: 100%;
  margin: 0;
  height: 34px;
  margin-top: 8px;
}
.mftcc-definitidon-search .dynamic-search .dynamic-input {
  width: 230px;
  float: left;
}
.mftcc-definitidon-search .dynamic-search .dynamic-input input {
  border: 1px solid #4a7ec3;
  border-radius: 0px;
  height: 34px;
}
.mftcc-definitidon-search .dynamic-search button {
  color: #4a7ec3;
  border-color: #4a7ec3;
  border-radius: 2px;
  height: 100%;
  float: left;
  padding: 10px 20px;
  background: none;
}

.mftcc-definitidon-search .custom-search {
  display: flex;
  margin-top: 4px;
}
.mftcc-definitidon-search .custom-search .definitidon-button {
  font-size: 12px;
  color: #4a7ec3;
  margin-left: 10px;
  margin-top: -3px;
}
.mftcc-definitidon-search .custom-search .definitidon-button i {
  font-size: 16px;
}
.mftcc-definitidon-search .custom-search .definitidon-button span {
  position: relative;
  top: -2px;
}

.mftcc-definitidon-search .custom-search .el-menu {
  border: none;
  background: none;
}

.mftcc-definitidon-search .el-menu .el-menu-item {
  height: 34px;
  line-height: 34px;
  border: none;
  font-size: 12px;
  color: #3d3d3d;
}
.mftcc-definitidon-search .el-menu .el-menu-item:hover {
  background: none;
}

.mftcc-definitidon-search .el-menu .el-menu-item.is-active {
  color: #4a7ec3;
  font-size: 14px;
  padding: 0 20px !important;
  border-bottom: 1px solid rgba(74, 126, 195, 1) !important;
}

.mftcc-definitidon-search .search-col {
  float: right;
  width: auto;
}

.mftcc-definitidon-search .el-form > .el-form-item > .el-form-item__content {
  margin: 0 auto;
  width: 840px;
}
.mftcc-definitidon-search .el-input {
  padding-right: 10px;
  box-sizing: border-box;
}
.mftcc-definitidon-search .el-col-3 {
  text-align: right;
  padding-right: 10px;
}
.mftcc-definitidon-search .el-col-2:last-child {
  padding-left: 10px;
}
.mftcc-definitidon-search .el-col-1.line {
  text-align: center;
  padding-right: 10px;
}
.mftcc-definitidon-search .el-input__inner,
.mftcc-definitidon-search .el-select {
  width: 100%;
}
.mftcc-definitidon-search .el-date-editor.el-input,
.mftcc-definitidon-search .el-date-editor.el-input__inner {
  width: calc(100% - 10px);
  border-radius: 0;
  height: 34px;
}

.mftcc-definitidon-search .el-date-editor.el-input__inner.el-date-editor--daterange {
  border: 1px solid rgba(153, 153, 153, 1);
}
.mftcc-definitidon-search
  .el-date-editor.el-input__inner.el-date-editor--daterange
  .el-range__icon,
.mftcc-definitidon-search
  .el-date-editor.el-input__inner.el-date-editor--daterange
  .el-range__close-icon,
.mftcc-definitidon-search
  .el-date-editor.el-input__inner.el-date-editor--daterange
  .el-range-separator {
  line-height: 26px;
}
.mftcc-definitidon-search .el-button.is-circle {
  padding: 0;
  border: none;
}
.mftcc-definitidon-search .el-button--small {
  font-size: 16px;
}
.mftcc-definitidon-search .el-input__suffix {
  right: 10px;
  top: -2px;
}
.mftcc-definitidon-search .el-input .el-input__inner {
  height: 34px;
  padding-right: 20px;
  border: 1px solid rgba(153, 153, 153, 1);
  border-radius: 0;
}
.mftcc-definitidon-search .el-radio-button__inner {
  padding: 10px 6px;
}
.mftcc-definitidon-search .el-radio-button__orig-radio:checked + .el-radio-button__inner {
  background-color: rgba(68, 148, 249, 1);
  border-color: rgba(68, 148, 249, 1);
}
.mftcc-list .mftcc-search-form {
  position: relative;
}
.mftcc-definitidon-search .el-form {
  padding-bottom: 0px;
  overflow: hidden;
  padding-top: 10px;
  padding-left: 20px;
  padding-right: 20px;
}
.mftcc-definitidon-search .dynamic-edit-filter {
  padding: 0 20px;
}
.mftcc-definitidon-search .mftcc-definitidon-btn {
  position: relative;
  text-align: center;
  padding: 6px 0;
  background: #edf2fa;
  border: 1px solid rgba(225, 226, 227, 1);
  margin-bottom: 0;
  float: none;
}
.mftcc-definitidon-search .el-button--primary {
  padding: 10px 36px;
}
.mftcc-definitidon-search .el-button--primary:first-child {
  background: #4494f9;
  border-color: #4494f9;
}
.mftcc-definitidon-search .el-button--primary:last-child {
  background: #fff;
  border-color: #d2d4d6;
  color: #333;
}
.mftcc-definitidon-search .el-tabs--top.el-tabs--card > .el-tabs__header .el-tabs__item {
  border-radius: 14px;
  height: 28px;
  line-height: 28px;
  background: #edf2fa;
  margin-left: 10px;
  border: 1px solid #e1e2e3;
}
.mftcc-definitidon-search .el-tabs--card > .el-tabs__header .el-tabs__nav {
  border: none;
}
.mftcc-definitidon-search .el-tabs.el-tabs--card.el-tabs--top {
  display: inline-block;
  position: relative;
  top: 20px;
  margin-bottom: 20px;
}
.mftcc-definitidon-search .el-tabs--card > .el-tabs__header {
  border: none;
}
.mftcc-definitidon-search
  .el-tabs--card
  > .el-tabs__header
  .el-tabs__item.is-active.is-closable {
  background: #e3f2fd;
  color: #333;
}
.mftcc-definitidon-search .el-row:last-child {
  border: 1px solid #e1e2e3;
  background: #fafafa;
}
.mftcc-definitidon-search .el-row:first-child {
  height: 50px;
}
@media screen and (min-width: 1200px) {
  .mftcc-definitidon-search .el-form > .el-form-item {
    float: left;
  }
}
</style>
