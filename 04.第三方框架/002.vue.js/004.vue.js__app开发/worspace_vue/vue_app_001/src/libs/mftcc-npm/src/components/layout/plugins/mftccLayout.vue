<template>
  <div
    class="mftcc-details"
    ref="mftccDetails"
    :title="$show_title == false ? '' : layoutId || initOption.layoutId"
  >
    <el-scrollbar ref="layoutScrollbar">
      <div style="padding:10px">
        <el-row :gutter="option.colSpan">
          <template v-for="(col, index) in option.colData">
            <el-col :span="col.span" :key="index">
              <div class="layout-page-item">
                <template v-for="cell in col.cells">
                  <layout-item
                    v-if="layoutItemShow(cell)"
                    :style="'margin:0 0 ' + option.rowSpan + 'px 0'"
                    :key="cell.uuid"
                    :props="cell"
                    :isPreview="true"
                    :paramData="paramData"
                    :parentVm="parentVm"
                    :cells="col.cells"
                  ></layout-item>
                </template>
              </div>
            </el-col>
          </template>
        </el-row>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import formUtil from "../../../utils/formUtil";
export default {
  data() {
    return {
      option: {},
      isEmpty: formUtil.isEmpty,
      root: {
        scrollTop: 0
      }
    };
  },
  props: {
    layoutId: {
      type: String,
      required: ""
    },
    initOption: {
      type: Object
    },
    paramData: {
      type: Object,
      default: function() {
        return {};
      }
    },
    parentVm: {
      type: Object,
      required: true
    },
    notFull: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    layoutId: {
      handler(val, oldVal) {
        if (val) {
          this.initLayout(() => {
            this.$emit("callback");
          });
        }
      },
      deep: true,
      immediate: true
    },
    initOption: {
      handler(val, oldVal) {
        if (val) {
          this.initLayout();
        }
      },
      immediate: true
    },
    paramData(val) {}
  },
  created() {
    // this.$bus.$on("setScroll", num => {
    //   if (this.$refs.mftccDetails) {
    //     let scrollTop = this.$refs.layoutScrollbar.wrap.scrollTop - num;
    //     this.scrollTop(this.$refs.layoutScrollbar.wrap, scrollTop, 200);
    //     // this.$refs.mftccDetails.scrollTop = scrollTop;
    //   }
    // });
  },
  provide() {
    return {
      root: this.root
    };
  },
  mounted() {
    if (!this.notFull) {
      let microAppDom = document.getElementById("rootApp");
      if (microAppDom) {
        this.$refs.mftccDetails.style.height = microAppDom.style.minHeight;
      }
    }

    this.$refs.layoutScrollbar.wrap.addEventListener("scroll", e => {
      this.root.scrollTop = e.target.scrollTop;
      let clientRect = e.target.getBoundingClientRect();
      this.root.x = clientRect.x;
      this.root.y = clientRect.y;
    });
  },
  methods: {
    closeAll(assemblyId, cellsList) {
      if (cellsList) {
        for (let item of cellsList) {
          if (item.type == "container") {
            this.closeAll(null, item.content);
          } else if (item.type == "collapse") {
            if (assemblyId) {
              if (item.assemblyId == assemblyId) {
                item.isOpen = false;
              }
            } else {
              item.isOpen = false;
            }
          }
        }
      } else {
        let colData = this.option.colData;
        for (let col of colData) {
          let cells = col.cells;
          for (let item of cells) {
            if (item.type == "container") {
              this.closeAll(null, item.content);
            } else if (item.type == "collapse") {
              if (assemblyId) {
                if (item.assemblyId == assemblyId) {
                  item.isOpen = false;
                }
              } else {
                item.isOpen = false;
              }
            }
          }
        }
      }
    },
    close(assemblyId) {
      this.closeAll(assemblyId);
    },
    layoutItemShow(cell) {
      let btnFlag = this.$hasPerm(cell.perm || true);
      if (btnFlag && cell.showField) {
        if (this.paramData[cell.showField] === false) {
          btnFlag = false;
        }
      }
      return btnFlag;
    },
    async initLayout(callback) {
      this.option = {};
      try {
        if (this.layoutId) {
          let jsonData = await axios.get(
            formUtil.getFormProfilePath() + "/layout/" + this.layoutId + ".json"
          );
          if (jsonData) {
            this.option = JSON.parse(JSON.stringify(jsonData.data));
          }
        }
      } catch (error) {
        if (this.initOption === undefined) {
          this.$message.error(
            "未找到 [ " + this.layoutId + " ] 配置文件或配置文件格式错误"
          );
        }
      }
      if (this.initOption !== undefined) {
        this.option = Object.assign(this.option, this.initOption);
      }

      if (typeof callback === "function") {
        this.$nextTick(() => {
          callback();
        });
      }
    }
    // scrollTop(dom, number = 0, time) {
    //   if (!time) {
    //     dom.scrollTop = number;
    //     return number;
    //   }
    //   const spacingTime = 20; // 设置循环的间隔时间  值越小消耗性能越高
    //   let spacingInex = time / spacingTime; // 计算循环的次数
    //   let nowTop = dom.scrollTop; // 获取当前滚动条位置
    //   let everTop = (number - nowTop) / spacingInex; // 计算每次滑动的距离
    //   let scrollTimer = setInterval(() => {
    //     if (spacingInex > 0) {
    //       spacingInex--;
    //       this.scrollTop(dom, (nowTop += everTop));
    //     } else {
    //       clearInterval(scrollTimer); // 清除计时器
    //     }
    //   }, spacingTime);
    // }
  }
};
</script>
<style></style>
