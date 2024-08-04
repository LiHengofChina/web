import handle from "../router/handle";
import config from "@config/index";

const routerPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error);
};

VueRouter.prototype.pushMain = function pushMain(location) {
  if (typeof location == "string") {
    singleSpaNavigate(location);
  } else if (typeof location == "object") {
    let path = location.path;
    if (location.query) {
      path += "?";
      for (let key in location.query) {
        path = path + key + "=" + location.query[key] + "&";
      }
      path = path.substring(0, path.length - 1);
    }
    singleSpaNavigate(path);
  } else {
    console.error("pushMain路由参数错误");
  }
};

Vue.use(VueRouter);

let base = "/" + config.productName + "/";

if (window.$show_base_path && window.$productName) {
  base = "/" + window.$productName + base;
}

const router = new VueRouter({
  base: base,
  mode: "history",
  routes: handle
});

router.beforeEach((to, from, next) => {
  const whiteList = window.config.router_white_list;
  if (whiteList.indexOf("/") > -1) {
    next();
  } else if (
    whiteList &&
    whiteList.length > 0 &&
    (whiteList.indexOf(to.path) > -1 ||
      whiteList.indexOf("/" + config.productName + to.path) > -1)
  ) {
    next();
  } else {
    let token = $store.getters.token;
    if (token === null || token === "") {
      next("/");
    } else {
      next();
    }
  }
});

Vue.mixin({
  beforeRouteLeave(to, from, next) {
    let flag = true;
    if (
      from.path.toLowerCase().endsWith("list") &&
      (to.path.toLowerCase().endsWith("detail") ||
        to.path.toLowerCase().endsWith("detail/") ||
        to.path.toLowerCase().endsWith("details") ||
        to.path.toLowerCase().endsWith("details/") ||
        to.path.toLowerCase().endsWith("update") ||
        to.path.toLowerCase().endsWith("update/"))
    ) {
      flag = false;
    }

    if (
      flag &&
      this.$vnode.parent &&
      this.$vnode.parent.componentInstance.cache
    ) {
      let key = this.$vnode.key; // 当前关闭的组件名
      let cache = this.$vnode.parent.componentInstance.cache; // 缓存的组件
      let keys = this.$vnode.parent.componentInstance.keys; // 缓存的组件名
      if (cache[key] != null) {
        delete cache[key];
        let index = keys.indexOf(key);
        if (index > -1) {
          keys.splice(index, 1);
        }
      }
    }
    next();
  }
});

export default router;
