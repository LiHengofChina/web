<template>
  <el-dialog :visible.sync="visible"
             @close="$emit('update:show', false)"
             :show="show"
             :width="option.width || '1000px'"
             @open="opened"
             ref="dialog"
             append-to-body
             :close-on-click-modal="false"
             class="treeDialog">
    <div slot="title"
         class="dialog-header"
         style="display: flex; justify-content: flex-end">
      <label style="position: absolute; left: 20px; top: 14px">{{
        option.title || title
      }}</label>
      <el-input autocomplete="off"
                placeholder="请输入关键字"
                suffix-icon="el-icon-search"
                v-if="option.search === undefined ? true : option.search"
                v-model="searchData"
                style="width: 200px; position: absolute; top: 7px; right: 65px"></el-input>
    </div>
    <div class="dialog-content">
      <el-tree :data="treeData"
               node-key="brNo"
               highlight-current
               check-strictly
               :default-checked-keys="option.value || []"
               :default-expanded-keys="expandedKeys"
               :current-node-key="
          option.value === undefined || option.value.length === 0
            ? ''
            : option.value[0]
        "
               :show-checkbox="option.type === 'radio' ? false : true"
               :props="option.defaultProps || defaultProps"
               :filter-node-method="filterNode"
               @check="handleCheck"
               ref="tree">
      </el-tree>
    </div>
    <div slot="footer"
         class="dialog-footer">
      <el-button type="primary"
                 @click="submit">确 定</el-button>
      <el-button @click="visible = false">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import api from "../../../api/plt";
  export default {
    data() {
      return {
        title: "选择组织架构",
        searchData: "",
        visible: this.show,
        defaultProps: {
          children: "children",
          label: "brName"
        },
        expandedKeys: [],
        treeData: [],
        brNoChildren: [],
        addVisible: false,
        addForm: {}
      };
    },
    props: {
      show: {
        type: Boolean
      },
      brNo: {
        type: String,
        default: function () {
          return "";
        }
      },
      option: {
        type: Object,
        default: function () {
          return {};
        }
      },
      checkOver: {
        type: Boolean,
        default: true
      }
    },
    watch: {
      show() {
        this.visible = this.show;
        if (this.visible) {
          this.searchData = "";
          let data = {
            // brNo: this.brNo,
            pageNo: 1,
            pageSize: -1
          };
          if (this.option.customUrl) {
            api.customAPI(this.option.customUrl, data, (res) => {
              if (res.code == 0) {
                this.brNoChildren = [];
                this.treeData = this.getTreeData(res.list.records);
              } else {
                this.$message.error(res.msg);
              }
            });
          } else if (this.option.isAllCorp) {
            api.brFindAllByPage(data, (res) => {
              if (res.code == 0) {
                this.brNoChildren = [];
                this.treeData = this.getTreeData(res.list.records);
              } else {
                this.$message.error(res.msg);
              }
            });
          } else {
            api.brFindByPage(data, (res) => {
              if (res.code == 0) {
                this.brNoChildren = res.brNoChildren || [];
                this.treeData = this.getTreeData(res.list.records);
              } else {
                this.$message.error(res.msg);
              }
            });
          }
          this.expandedKeys = this.option.value || [];
        } else {
          this.treeData = [];
        }
      },
      addVisible() {
        if (this.addVisible) {
          this.addForm = {};
        }
      },
      searchData(val) {
        this.$refs.tree.filter(val);
      }
    },
    created() { },
    methods: {
      getTreeData(data) {
        let cloneData = JSON.parse(JSON.stringify(data));
        let brNos = [];
        if (this.brNoChildren.length > 0) {
          for (let item of cloneData) {
            for (let brNo of this.brNoChildren) {
              if (brNo == item.brNo) {
                brNos.push(item);
              }
            }
          }
        } else {
          brNos = cloneData;
        }
        let fatherArr = brNos.filter((father) => {
          let branchArr = brNos.filter((child) => father.brId == child.parentBrId); //返回每一项的子级数组
          branchArr.length > 0 ? (father.children = branchArr) : "";
          return this.isParent(father, brNos); //返回第一层
        });

        // let fatherArr =  cloneData.filter(father=>{
        //     if(this.brNo==""){
        //         let branchArr = cloneData.filter(child=>father.brId == child.parentBrId);    //返回每一项的子级数组
        //         branchArr.length>0 ? father.children = branchArr : ''
        //         return father.parentBrId==0;      //返回第一层
        //     }else{
        //         if(this.brNoChildren.indexOf(father.brNo)!=-1){
        //             let branchArr = cloneData.filter(child=>father.brId == child.parentBrId);
        //             branchArr.length>0 ? father.children = branchArr : ''
        //             return true;
        //         }else{
        //             return false;
        //         }
        //     }
        // });
        return fatherArr;
      },
      isParent(item, list) {
        for (let father of list) {
          if (item.parentBrId == father.brId) {
            return false;
          }
        }
        return true;
      },
      submit() {
        let value = [];
        if (this.option.type === "radio") {
          let cn = this.$refs.tree.getCurrentNode();
          let node = this.$refs.tree.getNode(cn.brNo);
          let parentNodes = [];
          this.getParentNodes(node, parentNodes);
          value = value.concat(parentNodes);
          value.push(node.data);
        } else {
          let nodes = this.$refs.tree.getCheckedNodes();
          value = nodes;
          // let parentNodes = [];
          // let nodeArr = [];
          // for(let i in nodes){
          //     let node = this.$refs.tree.getNode(nodes[i].brNo);
          //     if(i<nodes.length-1){
          //         let nextNode = this.$refs.tree.getNode(nodes[Number(i)+1].brNo);
          //         if(node.level<nextNode.level){
          //             parentNodes.push(nodes[i]);
          //         }else{
          //             nodeArr.push(nodes[i]);
          //         }
          //     }else{
          //         nodeArr.push(nodes[i]);
          //     }
          // }
          // for(let n in nodeArr){
          //     let arr = []
          //     arr = arr.concat(parentNodes);
          //     arr.push(nodeArr[n]);
          //     value.push(arr);
          // }
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
        if (!this.checkOver) {
          return;
        }
        let selected = treeStatus.checkedKeys.indexOf(currentObj.brNo); // -1未选中
        // 选中
        if (selected !== -1) {
          // 子节点只要被选中父节点就被选中
          // this.selectedParent(currentObj)
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
        this.$refs.tree.setChecked(treeList.brNo, isSelected);
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
      }
    }
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
