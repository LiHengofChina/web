const { gateway_path, sso_server, sso_sts, sso_client_id } = window.config.host;
import store from "../store";
import { postSSOJson, postJsonNoLoading } from "./index";
var gatewayPath = gateway_path.endsWith("/")
  ? gateway_path.substring(0, gateway_path.length - 1)
  : gateway_path;
var clientId = sso_client_id;
const ssoUtil = {
  log(msg) {
    console.log(msg);
  },
  login() {
    if (sso_sts) {
      let url = sso_server + this.createParams();
      location.href = url;
      return false;
    }
  },
  logout(productName) {
    if (sso_sts) {
      let url = this.getLogoutUrl(productName) + this.createParams();
      // location.href = url
      postSSOJson(url, null, true, res => {
        // console.log(res)
        if (res.data.code == 200) {
          store.commit("clearLogin");
          location.href = res.data.data;
        }
      });
      return false;
    }
  },
  /* interceptor(router) {
    if (sso_sts) {
      var that = this;
      router.beforeEach((to, from, next) => {
        //全局钩子函数
        that.getWebPath();
        if (to.path == "/login/callback") {
          that.code2token(to.query);
        } else {
          next();
        }
      });
    }
  },
  filter(to, from, next) {
    if (sso_sts) {
      if (to.path == "/login/callback") {
        that.code2token(to.query);
        return false;
      } else {
        return true;
      }
    }
  }, */
  code2token(query, productName, callback) {
    let url;
    if (productName) {
      url =
        gatewayPath + "/" + productName + "/sso/code2token?code=" + query.code;
    } else {
      url = gatewayPath + "/sso/code2token?code=" + query.code;
    }
    postSSOJson(url, null, true, res => {
      if (res.data.code == 200) {
        let data = res.data.data;
        store.commit("set_token", data.accessToken);
        if (data.tenantId) {
          store.commit("set_tenantId", data.tenantId);
        }
        if (typeof callback == "function") {
          callback(() => {
            store.commit("set_token", data.accessToken);
            location.href = query["original-url"];
          });
        } else {
          store.commit("set_token", data.accessToken);
          location.href = query["original-url"];
        }
      }
    });
  },
  code2token4biz(query, productName) {
    let url =
      gatewayPath + "/" + productName + "/oauth/accessToken?code=" + query.code;
    postSSOJson(url, null, true, res => {
      if (res.headers.token) {
        store.commit("set_token", res.headers.token);
        postSSOJson(
          gatewayPath + "/" + productName + "/oauth/initUserInfo",
          null,
          true,
          reponse => {
            if (reponse.headers.token) {
              let userInfoStr = decodeURIComponent(reponse.headers.token);
              let userInfo = JSON.parse(userInfoStr);
              let menuData = this.initMenuData(userInfo.sysMenuList);
              store.commit("changeLogin", {
                user: userInfo.sysUserInfo,
                buttonAuth: userInfo.buttonAuth,
                token: userInfo.token,
                buttons: userInfo.buttons,
                menu: menuData
              });
              // store.commit("set_token", res.headers.token);
              location.href = query["original-url"];
            }
          }
        );
      }
    });
  },
  createParams() {
    let ts = Date.parse(new Date())
      .toString()
      .substr(0, 10);
    let params = "?";
    params += "clientId=" + clientId;
    params += "&ts=" + ts;
    params += "&redirectUri=";
    let redirectUri = encodeURIComponent(
      this.getLoginBackUrl() + "?original-url=" + window.location.href
    );
    params += redirectUri;
    return params;
  },
  getLoginBackUrl() {
    return this.getWebPath() + "/" + window.$productName + "/login/callback";
  },
  getLogoutUrl(productName) {
    if (productName) {
      return gatewayPath + "/" + productName + "/sso/logout";
    } else {
      return gatewayPath + "/sso/logout";
    }
  },
  getWebPath() {
    var curWwwPath = window.document.location.href;
    var pathName = window.document.location.pathname;
    var pos = curWwwPath.lastIndexOf(pathName);
    var localhostPath = curWwwPath.substring(0, pos);
    return localhostPath;
  },
  initMenuData(menuData) {
    var result = [];
    for (let menu of menuData) {
      if (menu.upMenuId == null) {
        //判断是否为顶层节点
        var item = {
          id: menu.menuId.toString(),
          title: menu.menuName,
          icon: menu.menuIcon,
          url: menu.menuUrl,
          newTab: menu.newTab
        };
        let children = this.getchilds(menu.menuId.toString(), menuData, 1);
        if (children.length > 0) {
          item.children = children;
        }
        result.push(item);
      }
    }

    return result;
  },
  //获取子节点
  getchilds(menuId, array, i) {
    var childs = [];
    for (let arr of array) {
      if (arr !== undefined && arr.upMenuId == menuId) {
        var child = {
          id: arr.menuId.toString(),
          title: arr.menuName,
          url: arr.menuUrl,
          icon: arr.menuIcon,
          newTab: arr.newTab
        };
        i++;
        let children = this.getchilds(arr.menuId.toString(), array, i);
        if (children.length > 0) {
          child.children = children;
        }
        childs.push(child);
      }
    }
    return childs;
  }
};

export default ssoUtil;
