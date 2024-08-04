<template>
  <div>
    <el-card
      shadow="never"
      :class="{ 'mftcc-card': true, isAutoHeight: props.isAutoHeight === true }"
      :style="
        'height:' +
          props.height +
          'px;min-height:' +
          props.minHeight +
          'px;max-height:' +
          props.maxHeight +
          'px;'
      "
      ref="mftccCard"
    >
      <!--  <el-row> 
            <el-link :underline="false">{{ props.title }}</el-link>
        </el-row> -->
      <el-row
        v-if="props.preview === true || isPreview === true"
        style="overflow: hidden"
      >
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
    </el-card>
    <el-card
      v-if="props.isFixedTop && !isDesigner"
      shadow="never"
      :id="props.uuid"
      v-show="showScrollCard"
      :class="{
        'mftcc-card': true,
        isAutoHeight: props.isAutoHeight === true,
        scroll: true
      }"
      :style="
        'height:' +
          props.height +
          'px;min-height:' +
          props.minHeight +
          'px;max-height:' +
          props.maxHeight +
          'px;'
      "
      ref="scrollCard"
    >
      <!--  <el-row> 
            <el-link :underline="false">{{ props.title }}</el-link>
        </el-row> -->
      <el-row
        v-if="props.preview === true || isPreview === true"
        style="overflow: hidden"
      >
        <container :props="props" :isScroll="true" :paramData="paramData">
        </container>
      </el-row>
    </el-card>
  </div>
</template>
<script>
import formUtil from "../../utils/formUtil";
import container from "../layout/plugins/container";
export default {
  data() {
    return {
      initSearchData: {},
      showScrollCard: false
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
  inject: ["root"],
  components: {
    container
  },
  watch: {
    root: {
      deep: true,
      handler(dom) {
        if (this.props.isFixedTop) {
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
              if (beforeDom) {
                let height = beforeDom.offsetHeight;
                rootY += height;
              }
            }
          }
          //原始卡片dom
          let oldCard = this.$refs.mftccCard.$el;
          let oldTop = oldCard.offsetTop;
          let oldHeight = oldCard.offsetHeight;
          let oldWidth = oldCard.offsetWidth;
          //设置卡片父级高度，用于动画
          let layoutItemEl = this.$refs.mftccCard.$parent.$parent.$el;
          layoutItemEl.style.height = oldHeight + "px";
          //原始卡片根据屏幕的定位
          let clientRect = oldCard.getBoundingClientRect();
          let oldX = clientRect.x;
          let oldY = clientRect.y;
          //复制的卡片dom
          let scrollCard = this.$refs.scrollCard.$el;
          let scrollHeight = scrollCard.offsetHeight;

          //超过标题
          if (rootY >= oldY) {
            scrollCard.style.display = "block";
            scrollCard.style.position = "fixed";
            scrollCard.style.width = oldWidth + "px";
            scrollCard.style.zIndex = 100;
            scrollCard.style.left = oldX + "px";
            scrollCard.style.top = rootY + "px";
            scrollCard.style.boxSizing = "border-box";
            layoutItemEl.style.height = scrollHeight + "px";
          } else {
            scrollCard.style.display = "none";
            layoutItemEl.style.height = oldHeight + "px";
          }
        }
      }
    }
  },
  created() {
    this.initTableSearchData();
  },
  methods: {
    initTableSearchData() {
      this.initSearchData = {};
      let isd = this.props.initSearchData;
      for (let sd of isd) {
        let value;
        if (sd.value.startsWith("${") && sd.value.endsWith("}")) {
          value = sd.value.substring(2, sd.value.length - 1);
          if (typeof this.paramData[value] == "undefined") {
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
    }
  }
};
</script>
<style>
.isAutoHeight {
  height: unset !important;
  min-height: unset !important;
  max-height: unset !important;
}
</style>
