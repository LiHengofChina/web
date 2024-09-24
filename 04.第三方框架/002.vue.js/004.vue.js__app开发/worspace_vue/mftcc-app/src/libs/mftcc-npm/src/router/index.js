import { createRouter, createWebHistory } from 'vue-router';
import handle from "../router/handle";
import config from "@config/index";

// 替代 Vue 2 中的 VueRouter.prototype.push
const routerPush = (router, location) => {
  return router.push(location).catch(error => error);
};

// 自定义的 pushMain 方法
const pushMain = (router, location) => {
  if (typeof location === "string") {
    // 需要实现 singleSpaNavigate 或者替代方案
    console.error("singleSpaNavigate is not defined");
  } else if (typeof location === "object") {
    let path = location.path;
    if (location.query) {
      path += "?";
      for (let key in location.query) {
        path += `${key}=${location.query[key]}&`;
      }
      path = path.slice(0, -1);
    }
    // 需要实现 singleSpaNavigate 或者替代方案
    console.error("singleSpaNavigate is not defined");
  } else {
    console.error("pushMain路由参数错误");
  }
};

const base = (window.$show_base_path && window.$productName)
  ? `/${window.$productName}/${config.productName}/`
  : `/${config.productName}/`;

const router = createRouter({
  history: createWebHistory(base),
  routes: handle
});

// // 路由守卫
// router.beforeEach((to, from, next) => {
//   const whiteList = window.config.router_white_list;
//   if (whiteList.indexOf("/") > -1) {
//     next();
//   } else if (
//     whiteList &&
//     whiteList.length > 0 &&
//     (whiteList.indexOf(to.path) > -1 ||
//       whiteList.indexOf("/" + config.productName + to.path) > -1)
//   ) {
//     next();
//   } else {
//     let token = window.$store.getters.token; // 假设 window.$store 是你的 Vuex store
//     if (!token) {
//       next("/");
//     } else {
//       next();
//     }
//   }
// });

// // 路由离开前清理缓存
// router.beforeEach((to, from, next) => {
//   if (
//     from.path.toLowerCase().endsWith("list") &&
//     (to.path.toLowerCase().endsWith("detail") ||
//       to.path.toLowerCase().endsWith("detail/") ||
//       to.path.toLowerCase().endsWith("details") ||
//       to.path.toLowerCase().endsWith("details/") ||
//       to.path.toLowerCase().endsWith("update") ||
//       to.path.toLowerCase().endsWith("update/"))
//   ) {
//     // 缓存清理逻辑
//     console.error("Cache cleaning logic needs implementation.");
//   }
//   next();
// });




// 暴露 push 和 pushMain 方法
window.routerPush = (location) => routerPush(router, location);
window.pushMain = (location) => pushMain(router, location);

export default router;
