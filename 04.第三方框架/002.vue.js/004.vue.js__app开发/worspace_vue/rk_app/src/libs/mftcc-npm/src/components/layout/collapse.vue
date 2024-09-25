<template>
  <div>
    <el-collapse
      v-model="activeNames"
      class="mftcc-collapse"
      @change="change"
      disabled
      ref="mftccCollapse"
      :id="props.uuid"
    >
      <el-collapse-item
        name="mftcc-collapse"
        :disabled="props.alwaysOpen"
        :class="{ isAutoHeight: props.isAutoHeight === true }"
        :style="
          'height:' + props.height + 'px;max-height:' + props.maxHeight + 'px;'
        "
      >
        <div slot="title" class="mftcc-collapse-title" ref="title">
          <div class="title">
            <i v-if="!props.icon" class="el-icon-star-on"></i>
            <span>{{ this.title == "" ? props.title : this.title }}</span>
          </div>
          <div class="btnLeftShow" style="margin-left: 10px">
            <template v-for="(btn, index) in props.optBtnLeft">
              <i
                :key="index"
                :class="btn.icon"
                v-if="btn.icon && layoutItemShow(btn)"
                v-on:click.stop="Fn(btn.callBackFunc, props.assemblyId)"
              >
              </i>
              <el-button
                :key="index"
                size="mini"
                type="text"
                v-if="!btn.icon && layoutItemShow(btn)"
                v-on:click.native.stop="Fn(btn.callBackFunc, props.assemblyId)"
                >{{ btn.key }}</el-button
              >
            </template>
          </div>
          <div class="btnRightShow">
            <template v-for="(btn, index) in props.optBtnRight">
              <i
                :key="index"
                :class="btn.icon"
                v-if="btn.icon && layoutItemShow(btn)"
                v-on:click.stop="Fn(btn.callBackFunc, props.assemblyId)"
              >
              </i>
              <el-button
                :key="index"
                size="mini"
                type="text"
                v-if="!btn.icon && layoutItemShow(btn)"
                v-on:click.native.stop="Fn(btn.callBackFunc, props.assemblyId)"
                >{{ btn.key }}</el-button
              >
            </template>
          </div>
        </div>
        <div
          slot="title"
          class="mftcc-collapse-title scroll"
          v-show="showScrollTitle"
          ref="scrollTitle"
        >
          <div class="title">
            <i v-if="!props.icon" class="el-icon-star-on"></i>
            <span>{{ this.title == "" ? props.title : this.title }}</span>
          </div>
          <div class="btnLeftShow" style="margin-left: 10px">
            <template v-for="(btn, index) in props.optBtnLeft">
              <i
                :key="index"
                :class="btn.icon"
                v-if="btn.icon && layoutItemShow(btn)"
                v-on:click.stop="Fn(btn.callBackFunc, props.assemblyId)"
              >
              </i>
              <el-button
                :key="index"
                size="mini"
                type="text"
                v-if="!btn.icon && layoutItemShow(btn)"
                v-on:click.native.stop="Fn(btn.callBackFunc, props.assemblyId)"
                >{{ btn.key }}</el-button
              >
            </template>
          </div>
          <div class="btnRightShow">
            <template v-for="(btn, index) in props.optBtnRight">
              <i
                :key="index"
                :class="btn.icon"
                v-if="btn.icon && layoutItemShow(btn)"
                v-on:click.stop="Fn(btn.callBackFunc, props.assemblyId)"
              >
              </i>
              <el-button
                :key="index"
                size="mini"
                type="text"
                v-if="!btn.icon && layoutItemShow(btn)"
                v-on:click.native.stop="Fn(btn.callBackFunc, props.assemblyId)"
                >{{ btn.key }}</el-button
              >
            </template>
          </div>
        </div>
        <div class="mftcc-collapse-info">
          <el-row v-if="props.preview === true || isPreview === true">
            <template v-if="props.importType == 'form'">
              <mftcc-form
                :formId="props.formId"
                :parentVm="parentVm"
                ref="form"
                @initCallBack="initFormCallBack"
              ></mftcc-form>
            </template>
            <template v-else-if="props.importType == 'table'">
              <mftcc-table
                :tableId="props.tableId"
                :initSearchData="initSearchData"
                :parentVm="parentVm"
                ref="table"
                @initCallBack="initTableCallBack"
              ></mftcc-table>
            </template>
            <template v-else-if="props.importType == 'bizComp'">
              <container
                :props="props"
                :paramData="paramData"
                :isDesigner="isDesigner"
              >
              </container>
            </template>
          </el-row>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
import formUtil from "../../utils/formUtil";
import container from "../layout/plugins/container";
export default {
  data() {
    return {
      activeNames: [],
      isRefreshPage: true,
      showHelper: null,
      title: "",
      showScrollTitle: false,
      initSearchData: {}
    };
  },
  props: {
    props: {
      type: Object,
      default() {
        return {};
      }
    },
    parentVm: {
      type: Object,
      required: true
    },
    isPreview: Boolean,
    paramData: {
      type: Object,
      default: function() {
        return {};
      }
    },
    isDesigner: {
      type: Boolean,
      default: false
    },
    cells: {
      type: Object,
      default: []
    }
  },
  components: {
    container
  },
  inject: ["root"],
  created() {
    if (this.props.isOpen === true || this.props.alwaysOpen === true) {
      this.changeOpen(true);
    } else {
      this.changeOpen(false);
    }
    this.initTableSearchData();
  },
  mounted() {
    // debugger;
    // dom.addEventListener("scroll", function () {
    //   const scrollDistance = dom.scrollHeight - dom.scrollTop - dom.clientHeight;
    //   //如果表格高度小于或=0 继续请求数据
    //   if (scrollDistance <= 0) {
    //     //当前页数小于总页数继续请求
    //     if (that.pageNo < that.total) {
    //       that.pageNo++;
    //       // that.pageSize = that.pageSize + 10;
    //       that.loadData();
    //     }
    //   }
    // });
  },
  computed: {
    editField() {
      if (this.$store.getters.editField) {
        return this.$store.getters.editField.prop;
      }
      return null;
    }
  },
  watch: {
    root: {
      deep: true,
      handler(dom) {
        if(this.props.isFixed === false){
          return;
        }
        //布局滚动条高度
        let scrollTop = dom.scrollTop;
        let rootX = dom.x;
        let rootY = dom.y;
        //计算之前是否有固定的card
        for (let cell of this.cells) {
          if (cell.uuid == this.props.uuid) {
            break;
          }
          if (cell.isFixedTop) {
            let beforeDom = document.getElementById(cell.uuid);
            let height = beforeDom.offsetHeight;
            rootY += height;
          }
        }
        //原始标题dom
        let oldTitle = this.$refs.mftccCollapse.$children[0].$el.children[0];
        let oldTop = oldTitle.offsetTop;
        let oldHeight = oldTitle.offsetHeight;
        let oldWidth = oldTitle.offsetWidth;
        //原始标题根据屏幕的定位
        let clientRect = oldTitle.getBoundingClientRect();
        let oldX = clientRect.x;
        let oldY = clientRect.y;
        //当前折叠面板dom
        let collapseDiv = this.$refs.mftccCollapse.$children[0].$el;
        let collapseHeight = collapseDiv.offsetHeight;

        let scrollTitleDiv = this.$refs.scrollTitle;
        //超过标题
        if (rootY >= oldY) {
          scrollTitleDiv.style.display = "flex";
          scrollTitleDiv.style.position = "fixed";
          scrollTitleDiv.style.width = oldWidth + "px";
          scrollTitleDiv.style.height = oldHeight + "px";
          scrollTitleDiv.style.zIndex = 99;
          scrollTitleDiv.style.left = oldX + "px";
          scrollTitleDiv.style.top = rootY + "px";
          scrollTitleDiv.style.boxSizing = "border-box";
        } else {
          scrollTitleDiv.style.display = "none";
        }
        //标题超过当前折叠面板底部并超过时，固定位置
        if (rootY >= oldY + collapseHeight - oldHeight) {
          scrollTitleDiv.style.position = "absolute";
          scrollTitleDiv.style.left = 0;
          scrollTitleDiv.style.top = collapseHeight - oldHeight + "px";
        }

        //折叠面板箭头位置跟随
        let arrow = scrollTitleDiv.parentElement.children[2];
        if (rootY >= oldY) {
          arrow.style.position = "fixed";
          arrow.style.left = oldX + oldWidth - 27 + "px";
          arrow.style.top = rootY + oldHeight / 2 - 7 + "px";
          arrow.style.right = "auto";
        } else {
          arrow.style.position = "absolute";
          arrow.style.left = "auto";
          arrow.style.top = "auto";
          arrow.style.right = "5px";
        }
        if (rootY >= oldY + collapseHeight - oldHeight) {
          arrow.style.position = "absolute";
          arrow.style.left = "auto";
          arrow.style.top = collapseHeight - oldHeight / 2 - 7 + "px";
          arrow.style.right = "5px";
        }
      }
    },
    "props.title": {
      handler(val, oldVal) {
        var patt = "\\$\\{(.*?)\\}";
        if (val.search(patt) != -1) {
          this.title = this.paramData[val.substring(2, val.length - 1)];
        } else {
          this.title = val;
        }
      }
    },
    "props.isOpen": {
      handler(val, oldVal) {
        this.changeOpen(val);
      }
    },
    "props.alwaysOpen": {
      handler(val, oldVal) {
        this.changeOpen(val);
      }
    }
  },
  methods: {
    layoutItemShow(btn) {
      let btnFlag = this.isDesigner || this.$hasPerm(btn.jurisdiction || true);
      if (btnFlag && btn.showField) {
        if (this.paramData[btn.showField] === false) {
          btnFlag = false;
        }
      }
      return btnFlag;
    },
    fixedTitle() {},
    cancelFixedTitle() {},
    getTitle() {
      var patt = "\\$\\{(.*?)\\}";
      var logTitle = this.props.title;
      if (this.paramData && logTitle && logTitle.search(patt) != -1) {
        this.title =
          this.paramData[logTitle.substring(2, logTitle.length - 1)] ||
          logTitle;
      } else {
        this.title = this.props.title;
      }
    },
    initTableSearchData() {
      if (typeof this.props.optBtnLeft == "undefined") {
        this.$set(this.props, "optBtnLeft", []);
      }
      if (typeof this.props.optBtnRight == "undefined") {
        this.$set(this.props, "optBtnRight", []);
      }
      if (typeof this.props.btnRight == "undefined") {
        this.$set(this.props, "btnRight", false);
      }
      if (typeof this.props.btnLeft == "undefined") {
        this.$set(this.props, "btnLeft", false);
      }
      this.initSearchData = {};
      let isd = this.props.initSearchData;
      for (let sd of isd) {
        let value;
        if (sd.value.startsWith("${") && sd.value.endsWith("}")) {
          value = sd.value.substring(2, sd.value.length - 1);
          if (this.paramData[value]) {
            value = this.paramData[value];
          } else {
            console.error("变量 " + value + " 不存在");
            value = "";
          }
        } else {
          value = sd.value;
        }
        this.initSearchData[sd.key] = value;
      }
    },
    initLeft() {
      this.btnDataRight = {};
      console.log(this.props);
      let isdd = this.props.btnDataRight;
      for (let sd of isdd) {
        let value;
        if (sd.value.startsWith("${") && sd.value.endsWith("}")) {
          value = sd.value.substring(2, sd.value.length - 1);
          if (this.paramData[value]) {
            value = this.paramData[value];
          } else {
            console.error("变量 " + value + " 不存在");
            value = "";
          }
        } else {
          value = sd.value;
        }
        this.btnDataRight[sd.key] = value;
      }
    },
    initRight() {
      this.btnDataLeft = {};
      let isd = this.props.btnDataLeft;
      for (let sd of isd) {
        let value;
        if (sd.value.startsWith("${") && sd.value.endsWith("}")) {
          value = sd.value.substring(2, sd.value.length - 1);
          if (this.paramData[value]) {
            value = this.paramData[value];
          } else {
            console.error("变量 " + value + " 不存在");
            value = "";
          }
        } else {
          value = sd.value;
        }
        this.btnDataLeft[sd.key] = value;
      }
    },
    change() {
      // if (this.activeNames.length == 0) {
      //   //当前浮动标题
      //   let scrollTitleDiv = this.$refs.scrollTitle;
      //   let clientRectNew = scrollTitleDiv.getBoundingClientRect();
      //   let newY = clientRectNew.y;
      //   if (scrollTitleDiv.style.display != "none") {
      //     //原始标题dom
      //     let oldTitle = this.$refs.mftccCollapse.$children[0].$el.children[0];
      //     let clientRect = oldTitle.getBoundingClientRect();
      //     let oldY = clientRect.y;
      //     let scrollNum = newY - oldY;
      //     this.$bus.$emit("setScroll", scrollNum);
      //   }
      // }
    },
    changeOpen(val) {
      if (val == true) {
        this.activeNames = ["mftcc-collapse"];
      } else {
        this.activeNames = [];
      }
    },
    initFormCallBack() {
      this.$nextTick(() => {
        if (
          this.props.formInitMethod &&
          formUtil.parentVmExist(this.parentVm, this.props.formInitMethod)
        ) {
          this.parentVm._self[this.props.formInitMethod](this.$refs.form);
        }
      });
    },
    initTableCallBack() {
      this.$nextTick(() => {
        if (
          this.props.tableInitMethod &&
          formUtil.parentVmExist(this.parentVm, this.props.tableInitMethod)
        ) {
          this.parentVm._self[this.props.tableInitMethod](this.$refs.table);
        }
      });
    },
    editFormM() {
      this.$nextTick(() => {
        if (formUtil.parentVmExist(this.parentVm, "editFormM")) {
          this.parentVm._self["editFormM"](this.$refs.form);
        }
      });
    },
    Fn(method, param) {
      if (formUtil.parentVmExist(this, method)) {
        this.parentVm._self[method](param);
      }
    }
  }
};
</script>
<style>
.mftcc-collapse > .el-collapse-item {
  display: flex;
  flex-direction: column;
}
.mftcc-collapse > .el-collapse-item > .el-collapse-item__wrap {
  flex-grow: 1;
}
.isAutoHeight {
  height: unset !important;
  min-height: unset !important;
  max-height: unset !important;
}
.buttonRightStyle {
  margin-right: 20px;
}
.flowHidden {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.btnRightShow {
  margin-right: 40px;
  color: #409eff;
}
.btnRightShow button,
.btnRightShow i,
.btnLeftShow button,
.btnLeftShow i {
  margin-left: 10px;
}
.btnLeftShow {
  margin: auto;
  color: #409eff;
}
.btnLeftShow i,
.btnRightShow i {
  font-size: 16px;
}
.btnRightShow .el-button--text,
.btnLeftShow .el-button--text {
  font-size: 14px;
}

.mftcc-details .mftcc-collapse-title > div {
  display: flex;
  align-items: center;
}
</style>
