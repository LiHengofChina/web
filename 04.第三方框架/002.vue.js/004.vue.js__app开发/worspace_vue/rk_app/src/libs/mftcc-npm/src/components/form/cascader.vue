<template>
  <el-cascader
    :key="isResouceShow"
    v-model="compValue"
    :options="options"
    :ref="props.fieldName"
    clearable
    filterable
    :props="propsData"
    :placeholder="isEmpty(props.placeholder) ? '' : props.placeholder"
    :disabled="isEmpty(props.disabled) ? false : props.disabled"
    :readonly="isEmpty(props.readOnly) ? false : props.readOnly"
    :class="{ readonly: isEmpty(props.readOnly) ? false : props.readOnly }"
    v-on="event"
    :separator="isEmpty(props.separator) ? '/' : props.separator"
    :show-all-levels="props.showAll"
  >
  </el-cascader>
</template>
<script>
import formUtil from "../../utils/formUtil";
import { getParameter } from "../../axios";

export default {
  data() {
    let that = this;
    return {
      isEmpty: formUtil.isEmpty,
      options: [],
      isResouceShow: 0,
      lazyData: [],
      isShows: false,
      lazyTreeData: [],
    };
  },
  computed: {
    compValue: {
      get() {
        // ++this.isResouceShow;
        return this.value;
      },
      set(val) {
        this.$emit("returnBack", val);
      },
    },
    propsData() {
      return {
        multiple: this.props.multiple == true ? true : false,
        lazy: this.props.lazyLoad ? true : false,
        checkStrictly: this.props.checkArbitrarily ? true : false,
        lazyLoad: this.getLazyData,
      };
    },
  },
  watch: {
    // pramDicItem: {
    //   handler(val, oldVal) {
    //     if (this.props.lazyLoad === false) {
    //       this.getPramDicItem();
    //     }
    //   },
    //   deep: true,
    //   immediate: true,
    // },
    // "props.library": {
    //   handler(val, oldVal) {
    //     if (JSON.stringify(val) != JSON.stringify(oldVal) && this.designer) {
    //       this.getOption();
    //     }
    //   },
    //   deep: true,
    // },
    "props.lazyLoad": {
      handler(val, oldVal) {
        if (this.designer) {
          this.options = [];
          // ++this.isResouceShow;
        }
      },
    },
  },
  model: {
    prop: "value", //值可以随意命名
    event: "returnBack", //方法也可以随意命名
  },
  props: {
    designer: {
      type: Boolean,
      default() {
        return false;
      },
    },
    value: {},
    event: Object,
    pramDicItem: {
      type: Array,
      default() {
        return [];
      },
    },
    props: {
      type: Object,
      default() {
        return {};
      },
    },
    url: String,
    realField: String,
    showField: String,
  },
  created() {
    if (this.props.lazyLoad) {
      let that = this;
      let url = this.props.library.url;
      getParameter(url, null, true, function (res) {
        if (res.code === 0) {
          let dataList = res.list;
          that.lazyData = dataList;
          that.isShows = true;
        }
      });
    }
  },
  mounted() {
    this.getOption();
  },
  methods: {
    getLazyData(node, resolve) {
      if (this.props.lazyLoad) {
        const { level } = node;
        const realField = this.props.library.realField;
        const showField = this.props.library.showField;
        const primaryId = this.props.library.primaryId;
        const parentPrimaryId = this.props.library.parentPrimaryId;
        let that = this;
        if (level === 0) {
          let url = this.props.library.url;
          let searchData = this.getSearchData();
          getParameter(url, searchData, true, function (res) {
            if (res.code === 0) {
              let dataList = res.list;
              const notes = Array.from(dataList).map((item) => ({
                value: item[realField],
                label: item[showField],
                pid: item[primaryId],
              }));
              let datas = that.lazyData;
              for (let node in datas) {
                for (let index in notes) {
                  if (notes[index].pid == datas[node][parentPrimaryId]) {
                    notes[index].leaf = false;
                  }
                }
              }
              if (that.props.value && that.props.value.length > 0) {
                var str = JSON.stringify(that.resTreeData(datas));
                let lazyTreeData = str != "[]" ? JSON.parse(str) : "";
                that.options = lazyTreeData;
              } else {
                resolve(notes);
              }
            }
          });
        } else if (level > 0) {
          let url = this.props.library.url;
          let pid = node.data.value;
          let data = {
            [parentPrimaryId]: pid,
          };
          let that = this;
          getParameter(url, data, true, function (res) {
            if (res.code === 0) {
              let dataList = res.list;
              const notes = Array.from(dataList).map((item) => ({
                value: item[realField],
                label: item[showField],
                pid: item[primaryId],
                leaf: level >= 2,
              }));
              let datas = that.lazyData;
              for (let index in notes) {
                for (let node in datas) {
                  if (notes[index].pid == datas[node][parentPrimaryId]) {
                    notes[index].leaf = false;
                    if (index < notes.length - 1) {
                      index++;
                    }
                  } else {
                    notes[index].leaf = true;
                  }
                }
              }
              if (that.props.value && that.props.value.length > 0) {
                resolve();
              } else {
                resolve(notes);
              }
              // if (that.props.showTwo){
              //   const notes = Array.from(dataList).map((item) => ({
              //     value: item[realField],
              //     label: item[showField],
              //     pid: item[primaryId],
              //     leaf: level >= 1,
              //   }));
              //   resolve(notes);
              // }else {
              //
              // }
            }
          });
        }
      }
    },
    // getPramDicItem() {
    //   debugger;
    //   if (this.props.library.url == null) {
    //     if (this.pramDicItem && this.pramDicItem.length > 0) {
    //       var str = JSON.stringify(this.pramDicItem);
    //       str = str
    //         .replace(/optCode/g, "value")
    //         .replace(/optName/g, "label")
    //         .replace(/children/g, "children");
    //       this.options = JSON.parse(str);
    //     } else {
    //       var str = JSON.stringify(this.props.dicItem);
    //       str = str
    //         .replace(/optCode/g, "value")
    //         .replace(/optName/g, "label")
    //         .replace(/children/g, "children");
    //       this.options = JSON.parse(str);
    //     }
    //   }
    // },
    getOption(data) {
      if (this.props.lazyLoad) {
        return;
      }
      if (this.props.library.url) {
        this.options = [];
        ++this.isResouceShow;
        this.loading = true;
        let url = this.props.library.url;
        url = formUtil.converUrl(url);
        let searchData = this.getSearchData();
        getParameter(
          url,
          searchData,
          true,
          (reponse) => {
            if (reponse.code == 0) {
              if (
                this.props.library.realField != null &&
                this.props.library.showField != null
              ) {
                var str = JSON.stringify(this.resTreeData(reponse.list));
                this.options = str != "[]" ? JSON.parse(str) : "";
              } else {
                this.options = "";
              }
            } else {
              this.options = [{ value: "", label: "(空)" }];
              console.error(reponse.msg);
            }
            this.loading = false;
          },
          function (error) {
            this.options = [{ value: "", label: "(空)" }];
            this.loading = false;
          }
        );
      }
    },
    getSearchData() {
      let library = this.props.library;
      let searchData = library.searchData;
      if (searchData === undefined && this.designer === false) {
        let searchDatas = {};
        let searchDataStr = library.searchDataStr || "";
        let searchDataArray = searchDataStr.split(";");
        for (let i in searchDataArray) {
          if (!this.isEmpty(searchDataArray[i])) {
            let searchDataObj = searchDataArray[i].split("-");
            if (searchDataObj.length === 2) {
              let value = "";
              var reg = /^\${.*}$/;
              if (reg.test(searchDataObj[1]) !== true) {
                value = searchDataObj[1];
              }
              searchDatas[searchDataObj[0]] = value;
            }
          }
        }
        searchData = searchDatas;
      } else if (this.designer === true) {
        let searchDatas = {};
        let searchDataStr = library.searchDataStr || "";
        let searchDataArray = searchDataStr.split(";");
        for (let i in searchDataArray) {
          if (!this.isEmpty(searchDataArray[i])) {
            let searchDataObj = searchDataArray[i].split("-");
            if (searchDataObj.length === 2) {
              let value = "";
              var reg = /^\${.*}$/;
              if (reg.test(searchDataObj[1]) !== true) {
                value = searchDataObj[1];
              }
              searchDatas[searchDataObj[0]] = value;
            }
          }
        }
        searchData = searchDatas;
      }
      return searchData;
    },
    resTreeData(data) {
      let result = [];
      if (
        this.props.library.parentPrimaryId != null &&
        this.props.library.primaryId != null
      ) {
        for (let node of data) {
          if (
            !node[this.props.library.parentPrimaryId] ||
            node[this.props.library.parentPrimaryId] == "0"
          ) {
            var newNode = {};
            if (!this.props.lazyLoad) {
              newNode.value = node[this.props.library.realField] + "";
              newNode.label = node[this.props.library.showField] + "";
              newNode.children = this.getTreeChilds(
                node[this.props.library.primaryId],
                data
              );
              result.push(newNode);
            } else {
              newNode.value = node[this.props.library.realField] + "";
              newNode.label = node[this.props.library.showField] + "";
              newNode.children = this.getUpdateData(
                node[this.props.library.primaryId],
                data
              );
              result.push(newNode);
            }
          }
        }
      }
      return result;
    },
    getTreeChilds(id, data) {
      let childs = [];
      if (!id) {
        return childs;
      }
      for (let node of data) {
        if (node[this.props.library.parentPrimaryId] == id) {
          var newNode = {};
          newNode.value = node[this.props.library.realField] + "";
          newNode.label = node[this.props.library.showField] + "";
          newNode[this.props.library.primaryId] = node[this.props.library.primaryId] + "";
          newNode[this.props.library.parentPrimaryId] =
            node[this.props.library.parentPrimaryId] + "";
          childs.push(newNode);
        }
      }
      for (let child of childs) {
        let childs2 = this.getTreeChilds(child[this.props.library.primaryId], data); //递归获取子节点
        if (childs2.length > 0) {
          child.children = childs2;
        }
      }
      return childs;
    },
    //懒加载模板
    getUpdateData(id, data) {
      let childs = [];
      if (!id) {
        return childs;
      }
      for (let node of data) {
        if (node[this.props.library.parentPrimaryId] == id) {
          var newNode = {};
          newNode.value = node[this.props.library.realField] + "";
          newNode.label = node[this.props.library.showField] + "";
          newNode[this.props.library.primaryId] = node[this.props.library.primaryId] + "";
          newNode[this.props.library.parentPrimaryId] =
            node[this.props.library.parentPrimaryId] + "";
          childs.push(newNode);
        }
      }
      for (let child of childs) {
        let childs2 = this.getUpdateData(child[this.props.library.primaryId], data); //递归获取子节点
        if (childs2.length > 0) {
          child.leaf = false;
          child.children = childs2;
        } else {
          child.leaf = true;
        }
      }
      return childs;
    },
  },
};
</script>
