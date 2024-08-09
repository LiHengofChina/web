import mftccTable from "./components/table/plugins/mftccTable.vue";
import mftccTableOld from "./components/mftccTable.vue";
import mftccTooltip from "./components/mftccTooltip.vue";
import mftccForm from "./components/form/plugins/mftccForm.vue";
import mftccLayout from "./components/layout/plugins/mftccLayout.vue";
import contextmenu from "./components/contextmenu.vue";
import mftccDialogCheckbox from "./components/dialog/mftccDialogCheckbox.vue";
import mftccDialogRadio from "./components/dialog/mftccDialogRadio.vue";
import mftccDialogTable from "./components/dialog/mftccDialogTable.vue";
import mftccDialogTree from "./components/dialog/mftccDialogTree.vue";
import mftccDialogForm from "./components/dialog/mftccDialogForm.vue";
import mftccEditTable from "./components/mftccEditTable.vue";
import mftccLibrarySelect from "./components/mftccLibrarySelect.vue";
import mftccSearchForm from "./components/mftccSearchForm.vue";
import mftccSearch from "./components/mftccSearch.vue";
import mftccIdentify from "./components/mftccIdentify.vue";
import formItem from "./components/form/plugins/formItem.vue";
import layoutItem from "./components/layout/plugins/layoutItem.vue";
import mftccFlowableTable from "./components/bus/dialog/mftccFlowableTable.vue";
import mftccFormTable from "./components/bus/dialog/mftccFormTable.vue";
import mftccPltBrTree from "./components/bus/dialog/mftccPltBrTree.vue";
import mftccPltUserTable from "./components/bus/dialog/mftccPltUserTable.vue";
import mftccPltRoleTable from "./components/bus/dialog/mftccPltRoleTable.vue";
import mftccFlowableUserTable from "./components/bus/dialog/mftccFlowableUserTable.vue";

import router from "./router/index";
import store from "./store";
import { hasBtnPermission } from "./store/permission";
import * as axios from "./axios/index";

import uploadFile from "./utils/uploadFile";
import promise from "./utils/promise";
import bus from "./utils/bus.js";

import { flowableHandler } from "./utils/flowable.js";
import formUtil from "./utils/formUtil.js";

import htmlToPdf from "./utils/htmlToPdf.js";

import watermark from "./utils/watermark.js";
// import sso from "./axios/sso";

import "./style/transition.css";
import "./icon/iconfont.css";

const component = {
  install: function(Vue) {
    require("./utils/dialogUtil.js");
    require("./utils/mftccTableInfiniteScroll/index.js");

    RegExp.quote = function(str) {
      return str.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
    };
    String.prototype.replaceAll = function(s1, s2) {
      return this.replace(new RegExp(RegExp.quote(s1), "gm"), s2);
    };

    let componentsPath = require
      .context("./components/form", true, /\.vue$/)
      .keys();
    let components = {};
    componentsPath.forEach(item => {
      let component = require(`./components/form${item.slice(1)}`);
      let type = item.slice(2, item.length - 4);
      if (type.startsWith("layout")) {
        type = type.slice(7);
      } else if (type.startsWith("form")) {
        type = type.slice(5);
      }
      if (/.vue$/.test(item)) {
        //判断是否以vue结尾
        components[type] = component.default;
      }
    });

    componentsPath = require
      .context("./components/layout", true, /\.vue$/)
      .keys();
    componentsPath.forEach(item => {
      let component = require(`./components/layout${item.slice(1)}`);
      let type = item.slice(2, item.length - 4);
      if (/.vue$/.test(item)) {
        //判断是否以vue结尾
        components[type] = component.default;
      }
    });

    Vue.use(htmlToPdf);

    Vue.prototype.$Component = components;

    Vue.prototype.$uploadFile = uploadFile.uploadFileFunc;
    Vue.prototype.$downloadBlob = uploadFile.downloadBlobFunc;
    Vue.prototype.$downloadBlobForUrl = uploadFile.downloadBlobForUrlFunc;

    Vue.prototype.$watermark = watermark;

    Vue.component("mftccTooltip", mftccTooltip);
    Vue.component("mftccTable", mftccTable);
    Vue.component("mftccTableOld", mftccTableOld);
    Vue.component("mftccForm", mftccForm);
    Vue.component("mftccLayout", mftccLayout);
    Vue.component("mftccSearchForm", mftccSearchForm);
    Vue.component("mftccSearch", mftccSearch);
    Vue.component("contextmenu", contextmenu);
    Vue.component("mftccDialogCheckbox", mftccDialogCheckbox);
    Vue.component("mftccDialogRadio", mftccDialogRadio);
    Vue.component("mftccDialogTable", mftccDialogTable);
    Vue.component("mftccDialogTree", mftccDialogTree);
    Vue.component("mftccEditTable", mftccEditTable);
    Vue.component("mftccLibrarySelect", mftccLibrarySelect);
    Vue.component("mftccDialogForm", mftccDialogForm);
    Vue.component("formItem", formItem);
    Vue.component("layoutItem", layoutItem);
    Vue.component("mftccFlowableTable", mftccFlowableTable);

    Vue.component("mftccIdentify", mftccIdentify);

    Vue.component("mftccPltBrTree", mftccPltBrTree);
    Vue.component("mftccFormTable", mftccFormTable);
    Vue.component("mftccPltUserTable", mftccPltUserTable);
    Vue.component("mftccPltRoleTable", mftccPltRoleTable);
    Vue.component("mftccFlowableUserTable", mftccFlowableUserTable);
  }
};

export {
  component,
  router,
  store,
  axios,
  // sso,
  hasBtnPermission,
  promise,
  bus,
  flowableHandler,
  formUtil
};
