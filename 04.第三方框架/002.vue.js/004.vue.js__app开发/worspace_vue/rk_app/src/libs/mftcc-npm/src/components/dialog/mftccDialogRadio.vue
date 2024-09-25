<template>
  <el-dialog
    :visible.sync="visible"
    @close="$emit('update:show', false)"
    class="mftcc-radio-dialog"
    :width="option.width || '1000px'"
    @open="opened"
    ref="dialog"
    :close-on-click-modal="false"
    append-to-body
    :show="show"
  >
    <div
      slot="title"
      class="dialog-header"
      style="display: flex; justify-content: flex-end"
    >
      <label style="position: absolute; left: 20px">{{
        option.title || title
      }}</label>
      <el-input
        autocomplete="off"
        placeholder="请输入关键字"
        suffix-icon="el-icon-search"
        v-if="option.search === undefined ? true : option.search"
        v-model="searchData"
        style="width: 200px; margin: 0px 65px 0px 0px"
      ></el-input>
      <el-popover
        placement="bottom"
        width="160"
        v-model="addVisible"
        v-if="option.insert === undefined ? true : option.insert"
      >
        <el-form :model="addForm" label-width="80px" size="mini">
          <el-form-item label="真实值">
            <el-input v-model="addForm[option.realField || 'value']"></el-input>
          </el-form-item>
          <el-form-item label="显示值">
            <el-input v-model="addForm[option.showField || 'text']"></el-input>
          </el-form-item>
        </el-form>
        <div style="text-align: right; margin: 0">
          <el-button size="mini" type="text" @click="addVisible = false"
            >取消</el-button
          >
          <el-button type="primary" size="mini" @click="addItem"
            >确定</el-button
          >
        </div>
        <el-button
          type="primary"
          slot="reference"
          style="margin: 0px 65px 0px 0px"
          >新增
        </el-button>
      </el-popover>
    </div>
    <div class="dialog-content">
      <div class="data">
        <div v-if="option.group === true">
          <div v-for="(group, index) in filterData || []" :key="index">
            <el-divider content-position="left">{{ group.name }}</el-divider>
            <el-radio-group v-model="option.value[index]">
              <el-radio
                :border="border"
                v-for="(item, index) in group.data || []"
                :key="index"
                :label="item.value"
                >{{ item.text }}
              </el-radio>
            </el-radio-group>
          </div>
        </div>
        <div v-else>
          <el-radio-group v-model="option.value">
            <el-radio
              :border="border"
              v-for="(item, index) in filterData || []"
              :key="index"
              :label="item.value"
              >{{ item.text }}
            </el-radio>
          </el-radio-group>
        </div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submit">确 定</el-button>
      <el-button @click="visible = false">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { get, postJson } from "../../axios";

export default {
  data() {
    return {
      title: "单选筛选器",
      searchData: "",
      visible: this.show,
      addVisible: false,
      addForm: {}
    };
  },
  props: {
    show: {
      type: Boolean,
      default() {
        return false;
      }
    },
    option: {
      type: Object,
      default() {
        return {};
      }
    },
    border: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  watch: {
    show() {
      this.visible = this.show;
      if (this.visible) {
        this.searchData = "";
        let seaData = {};
        seaData["tableId"] = "sys/sysUserList";
        seaData["pageNo"] = 1;
        seaData["pageSize"] = -1;
        if (
          this.option.initPath !== undefined &&
          this.option.initPath !== null &&
          this.option.initPath !== ""
        ) {
          postJson(this.option.initPath, seaData, true, res => {
            if (res.code == 0) {
              let dataList = res.list;
              this.option.data = dataList.records;
            }
          });
        }
      }
    },
    addVisible() {
      if (this.addVisible) {
        this.addForm = {};
      }
    }
  },
  created() {},
  methods: {
    addItem() {
      if (this.option.group) {
        this.$message.error("分组暂不支持");
      } else {
        let _this = this;
        postJson(this.option.insertPath, this.addForm, true, res => {
          _this.option.data.push({
            value: _this.addForm[_this.option.realField || "value"],
            text: _this.addForm[_this.option.showField || "text"]
          });
          this.addVisible = false;
        });
      }
    },
    submit() {
      if (this.option.group) {
        let value = [];
        for (let i in this.option.data) {
          let dataArr = this.option.data[i].data;
          let valueStr = this.option.value[i];
          for (let d in dataArr) {
            if (dataArr[d][this.option.realField || "value"] === valueStr) {
              value.push(dataArr[d]);
            }
          }
        }
        this.$emit("callback", value);
      } else {
        let value = {};
        for (let d in this.option.data) {
          if (
            this.option.data[d][this.option.realField || "value"] ===
            this.option.value
          ) {
            value = this.option.data[d];
          }
        }
        this.$emit("callback", value);
      }
      this.visible = false;
    },
    opened() {
      this.$refs.dialog.$el.children[0].style.height =
        this.option.height || "600px";
    }
  },
  computed: {
    filterData() {
      if (this.option.group) {
        let data = [];
        for (let i in this.option.data) {
          let groupData = this.option.data[i].data;
          let groupName = this.option.data[i].name;
          let itemData = [];
          for (let d in groupData) {
            let value = groupData[d][this.option.realField || "value"];
            let text = groupData[d][this.option.showField || "text"];
            if (text.indexOf(this.searchData) != -1) {
              itemData.push({
                value: value,
                text: text
              });
            }
          }
          let item = {
            name: groupName,
            data: itemData
          };
          data.push(item);
        }
        return data;
      } else {
        let data = [];
        for (let i in this.option.data) {
          let value = this.option.data[i][this.option.realField || "value"];
          let text = this.option.data[i][this.option.showField || "text"];
          if (text.indexOf(this.searchData) != -1) {
            data.push({
              value: value,
              text: text
            });
          }
        }
        return data;
      }
    }
  }
};
</script>
<style>
.mftcc-radio-dialog .el-dialog {
  display: flex;
  flex-direction: column;
}

.mftcc-radio-dialog .el-dialog__body {
  flex-grow: 1;
  overflow: auto;
}
.mftcc-radio-dialog .el-radio-group {
  width: 100%;
}
.mftcc-radio-dialog .el-radio {
  width: calc(25% - 10px);
  margin: 5px !important;
}
.mftcc-radio-dialog .el-radio .el-radio__label {
  display: inline-grid;
  white-space: pre-line;
  word-wrap: break-word;
  overflow: hidden;
  line-height: 20px;
  width: calc(100% - 24px);
}
</style>
