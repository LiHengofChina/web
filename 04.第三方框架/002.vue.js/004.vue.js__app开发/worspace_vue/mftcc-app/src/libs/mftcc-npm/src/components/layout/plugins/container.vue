<template>
  <div :class="compClass">
    <transition name="fade-transform" mode="out-in">
      <component v-if="show && page !== null" :is="page" v-bind="pageParams">
      </component>
    </transition>
  </div>
</template>
<script>
export default {
  data() {
    return {
      show: true,
      page: null,
      pageParams: {},
      compClass: ""
    };
  },
  props: {
    props: {
      type: Object,
      default() {
        return {};
      }
    },
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
    isScroll: false
  },
  watch: {
    compPath(path) {
      this.createPage(path);
    }
  },
  created() {
    this.createPage();
    this.$bus.$on("refreshLayout", (uuid, path) => {
      if (this.props.uuid == uuid) {
        this.createPage(path);
        // this.refresh();
      }
    });
  },
  destroyed() {
    this.$bus.$off("refreshLayout");
  },
  methods: {
    createPage(path) {
      this.page = null;
      if (this.props.importType == "bizComp") {
        let bizCompPath = path || this.props.bizCompPath;
        if (
          this.isScroll &&
          this.props.isFixedChange &&
          this.props.fixedBizCompPath
        ) {
          bizCompPath = this.props.fixedBizCompPath;
        }
        if (!bizCompPath) {
          return;
        }
        bizCompPath = bizCompPath.replace(/\s+/g, "");
        if (/.vue$/.test(bizCompPath)) {
          bizCompPath = bizCompPath.substring(0, bizCompPath.length - 4);
        }
        if (bizCompPath.startsWith("/")) {
          bizCompPath = bizCompPath.substring(1);
        }
        let productName = bizCompPath.split("/")[0];
        let spaPath = bizCompPath.substring(productName.length);
        if (this.$singleSpa){
          this.$singleSpa.getProJect(
            productName,
            apps => {
              const app = apps[spaPath];
              if (app) {
                this.initParams(app);
                this.initPage(app);
                console.log(productName, spaPath);
                console.log("app:", app);
              } else {
                console.error(
                  "组件未找到，请检查【" + spaPath + "】是否存放在components包下"
                );
              }
              this.compClass = productName;
            },
            error => {
              console.log(error);
              this.initPageError(this.props.bizCompPath);
              return;
            },
            this.isDesigner
          );
        }else {
          let _page = require("/src/components"+spaPath).default;
          this.initParams(_page);
          this.initPage(_page);
          this.compClass = "mftcc-web";
        }
      }
    },
    initPageError(path) {
      this.page = null;
      this.$message.error("未找到 [ " + path + " ] , 组件注册失败");
      console.error(path + " 组件注册失败");
    },
    initPage(component) {
      for (let key in this.props.paramsObject) {
        let value = this.props.paramsObject[key];
        if (value.startsWith("${") && value.endsWith("}")) {
          value = value.substring(2, value.length - 1);
          if (this.paramData[value]) {
            value = this.paramData[value];
          } else {
            console.error("变量 " + value + " 不存在");
            value = "";
          }
        }
        this.pageParams[key] = value;
      }
      // this.$options.components[this.props.uuid] = component;
      // this.page = this.props.uuid;
      this.page = component;
    },
    initParams(component) {
      let params = [];
      let bizComponent = component;
      if (bizComponent.props) {
        if (Array.isArray(bizComponent.props)) {
          for (let i in bizComponent.props) {
            let name = bizComponent.props[i];
            params.push({
              name,
              value: ""
            });
          }
        } else {
          for (let name in bizComponent.props) {
            params.push({
              name,
              value: ""
            });
          }
        }
        if (
          this.isScroll &&
          this.props.isFixedChange &&
          this.props.fixedBizCompPath
        ) {
          this.props.fixedParams = params;
        } else {
          this.props.params = params;
        }
      }
    },
    refresh() {
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
      });
    }
  }
};
</script>
