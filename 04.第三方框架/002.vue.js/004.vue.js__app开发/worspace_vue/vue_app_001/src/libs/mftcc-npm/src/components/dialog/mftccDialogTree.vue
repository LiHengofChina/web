<template>
  <el-dialog
    :visible.sync="visible"
    @close="$emit('update:show', false)"
    :show="show"
    :width="option.width || '1000px'"
    @open="opened"
    ref="dialog"
    append-to-body
    :close-on-click-modal="false"
    class="treeDialog"
  >
    <div
      slot="title"
      class="dialog-header"
      style="display: flex; justify-content: flex-end"
    >
      <label style="position: absolute; left: 20px">{{ option.title || title }}</label>
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
            <el-input v-model="addForm.id"></el-input>
          </el-form-item>
          <el-form-item label="显示值">
            <el-input
              v-model="
                addForm[option.defaultProps === undefined ? defaultProps.label : 'label']
              "
            ></el-input>
          </el-form-item>
        </el-form>
        <div style="text-align: right; margin: 0">
          <el-button size="mini" type="text" @click="addVisible = false">取消</el-button>
          <el-button type="primary" size="mini" @click="addItem">确定</el-button>
        </div>
        <el-button type="primary" slot="reference" style="margin: 0px 65px 0px 0px"
          >新增</el-button
        >
      </el-popover>
    </div>
    <div class="dialog-content">
      <el-tree
        :data="treeData"
        node-key="id"
        highlight-current
        check-strictly
        :default-checked-keys="option.value || []"
        :default-expanded-keys="expandedKeys"
        :current-node-key="
          option.value === undefined || option.value.length === 0 ? '' : option.value[0]
        "
        :show-checkbox="option.type === 'single' ? false : true"
        :props="option.defaultProps || defaultProps"
        :filter-node-method="filterNode"
        @check="handleCheck"
        ref="tree"
      >
      </el-tree>
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
      title: "树形筛选器",
      searchData: "",
      visible: this.show,
      defaultProps: {
        children: "children",
        label: "label",
      },
      expandedKeys: [],
      treeData: [],
      addVisible: false,
      addForm: {},
    };
  },
  props: ["show", "option"],
  watch: {
    show() {
      this.visible = this.show;
      if (this.visible) {
        this.searchData = "";
        if (
          this.option.initPath !== undefined &&
          this.option.initPath !== null &&
          this.option.initPath !== ""
        ) {
          get(this.option.initPath, null, true, (res) => {
            this.treeData = res.list;
          });
        } else {
          this.treeData = this.option.data;
        }
        this.expandedKeys = this.option.value || [];
      }
    },
    addVisible() {
      if (this.addVisible) {
        this.addForm = {};
      }
    },
    searchData(val) {
      this.$refs.tree.filter(val);
    },
  },
  created() {},
  methods: {
    addItem() {
      let node = this.$refs.tree.getCurrentNode();
      let pid = node.id;
      this.addForm.pid = pid;
      this.addForm.children = [];
      postJson(this.option.insertPath, this.addForm, true, (res) => {
        this.$refs.tree.append(this.addForm, pid);
        this.expandedKeys = [this.addForm.id];
        this.addVisible = false;
      });
    },
    submit() {
      let value = [];
      if (this.option.type === "single") {
        let cn = this.$refs.tree.getCurrentNode();
        let node = this.$refs.tree.getNode(cn.id);
        let parentNodes = [];
        this.getParentNodes(node, parentNodes);
        value = value.concat(parentNodes);
        value.push(node.data);
      } else {
        let nodes = this.$refs.tree.getCheckedNodes();
        let parentNodes = [];
        let nodeArr = [];
        for (let i in nodes) {
          let node = this.$refs.tree.getNode(nodes[i].id);
          if (i < nodes.length - 1) {
            let nextNode = this.$refs.tree.getNode(nodes[Number(i) + 1].id);
            if (node.level < nextNode.level) {
              parentNodes.push(nodes[i]);
            } else {
              nodeArr.push(nodes[i]);
            }
          } else {
            nodeArr.push(nodes[i]);
          }
        }
        for (let n in nodeArr) {
          let arr = [];
          arr = arr.concat(parentNodes);
          arr.push(nodeArr[n]);
          value.push(arr);
        }
      }
      this.$emit("callback", value);
      this.visible = false;
    },
    filterNode(value, data) {
      if (!value) return true;
      let dp = this.option.defaultProps || this.defaultProps;
      return data[dp.label].indexOf(value) !== -1;
    },
    getParentNodes(node, nodeArr) {
      if (node.parent && node.parent.key) {
        nodeArr.push(node.parent.data);
        this.getParentNodes(node.parent, nodeArr);
      }
    },
    handleCheck(currentObj, treeStatus) {
      // 用于：父子节点严格互不关联时，父节点勾选变化时通知子节点同步变化，实现单向关联。
      let selected = treeStatus.checkedKeys.indexOf(currentObj.id); // -1未选中
      // 选中
      if (selected !== -1) {
        // 子节点只要被选中父节点就被选中
        this.selectedParent(currentObj);
        // 统一处理子节点为相同的勾选状态
        this.uniteChildSame(currentObj, true);
      } else {
        // 未选中 处理子节点全部未选中
        let dp = this.option.defaultProps || this.defaultProps;
        if (currentObj[dp.children] && currentObj[dp.children].length !== 0) {
          this.uniteChildSame(currentObj, false);
        }
      }
    },
    // 统一处理子节点为相同的勾选状态
    uniteChildSame(treeList, isSelected) {
      this.$refs.tree.setChecked(treeList.id, isSelected);
      let dp = this.option.defaultProps || this.defaultProps;
      if (treeList[dp.children]) {
        for (let i = 0; i < treeList[dp.children].length; i++) {
          this.uniteChildSame(treeList[dp.children][i], isSelected);
        }
      }
    },
    // 统一处理父节点为选中
    selectedParent(currentObj) {
      let currentNode = this.$refs.tree.getNode(currentObj);
      if (currentNode.parent.key !== undefined) {
        this.$refs.tree.setChecked(currentNode.parent, true);
        this.selectedParent(currentNode.parent);
      }
    },
    opened() {
      this.$refs.dialog.$el.children[0].style.height = this.option.height || "600px";
    },
  },
};
</script>
<style>
.treeDialog .el-tree {
  height: 100%;
  overflow: auto;
}
.treeDialog .el-dialog {
  display: flex;
  flex-direction: column;
}
.treeDialog .el-dialog__body {
  flex-grow: 1;
  overflow: auto;
}
</style>
