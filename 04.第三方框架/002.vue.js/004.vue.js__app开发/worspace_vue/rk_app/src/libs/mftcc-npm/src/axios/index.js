/**
 * axios.js提供request请求封装
 * 包括 get、post、delete、put等方式
 */
import { aes, sha256 } from "../plugins/crypto";


import { Toast, Dialog, Loading } from 'vant';

import store from "../store";
import router from "../router";
import config from "@config/index";

let host = window.config.host.gateway_path;




const instance = axios.create({
  baseURL: host,
  timeout: 3000000 // 超时毫秒数
  // withCredentials: true               // 携带认证信息cookie
});


/****** request拦截器==>对请求参数做处理 ******/
instance.interceptors.request.use(
    config => {
        if (config.url === "/login") {
        //如果是登录和注册操作，则不需要携带header里面的token
        } else {


            // token
            // let token =  $$$store.getters.token;
            let token = $$$store.getters['auth/token'];
            if (!token) {
                let data = sessionStorage.getItem(window.config.session_storage_key || "mftcc_vuex");
                if (data) {
                token = JSON.parse(data)["token"];
                }
            }
            config.headers.token = token;

            // refreshToken
            // let refreshToken = $$$store.getters.refreshToken;
            let refreshToken = $$$store.getters['auth/refreshToken'];
            if (!refreshToken) {
                let data = sessionStorage.getItem(window.config.session_storage_key || "mftcc_vuex");
                if (data) {
                  refreshToken = JSON.parse(data)["refreshToken"];
                }
            }
            config.headers.refreshToken = refreshToken;

            config.headers.tenantId = store.getters.tenantId;

        }
        return config;
    },
    error => {
      //请求错误处理
      Promise.reject(error);
    }
);
//==================================================================== 免登陆 start
//==================================================================== 免登陆 start

import main_store from '@/store';
/**
 * 免登陆时加密所有的请求头数据
 */
instance.interceptors.request.use(
  async (config) => {

      const exemptionfromlogin = main_store.getters['auth/isExemptionfromlogin'];
      // // 如果是免登录请求
      if (exemptionfromlogin) {

          try {
              // 动态导入公钥加密模块
              const { encryptWithPublicKey } = await import(/* webpackChunkName: "cryptoutils-module" */ "@/utils/cryptoUtils");

              const urlSuffixes = [
                    'approve/apply/leaseApplyHis/submitApprove',  // 租赁-立项审批、租赁-尽调审批
                    'approve/pact/leasePactHis/submitApprove',    // 租赁-合同审批
                    'approve/due/leaseDueHis/submitApprove',      // 租赁-放款审批

                    'approve/apply/loanApplyHis/submitApprove',   // 委贷-业务审批
                    'approve/pact/loanPactHis/submitApprove',     // 委贷-合同审批
                    'approve/due/loanDueHis/submitApproveChild',  // 委贷-放款审批
                    'due/loanDuePayHis/submitApprove',            // 委贷-支付审批
                    'prepay/loanPrepRepayApply/submitApprove'     // 委贷-提前还款审批
              ];
              // 将请求中的数据进行加密
              if (urlSuffixes.some(suffix => config.url.endsWith(suffix))) {//只对 “审批提交” 加密
                if (config.data) {
                    const dataString = JSON.stringify(config.data); // 序列化数据
                    const encryptedData = await encryptWithPublicKey("X1dF_7A9bS" + dataString, window.config.certificate.pgpPublicKey);
                    config.data = {
                      encryptedData: btoa(encryptedData) // 换为 Base64 格式
                    };
                }
              }

              // 在请求的 URL 后面添加 ''
              config.headers['RKAppExemptionFromLogin'] = true;

              // 获取 URL 中的查询参数
              const urlParams = new URLSearchParams(window.location.search);
              const opNo = urlParams.get('opNo'); // 获取 'opNo' 参数
              if (opNo) {
                  // 将 opNo 添加到请求头中
                  config.headers['opNo'] = opNo;
              }
          } catch (encryptionError) {
              console.error("请求头加密失败: ", encryptionError);
          }
      }

      // 返回修改后的 config
      return config;
  },
  (error) => {
      return Promise.reject(error);
  }
);

//==================================================================== 免登陆 end
//==================================================================== 免登陆 end




let responseBlob = error => {
  return new Promise(function (resolve, reject) {
    if (error.response && error.response.config.responseType == "blob") {
      try {
        var reader = new FileReader();
        reader.readAsText(error.response.data, "utf-8");
        reader.onload = function () {
          error.response.data = JSON.parse(reader.result);
          resolve(error);
        };
      } catch (err) {
        resolve(error);
      }
    } else {
      resolve(error);
    }
  });
};

/****** respone拦截器==>对响应做处理 ******/
let errorCut = 0;
instance.interceptors.response.use(
  response => {
    const refreshToken = response.headers["refresh-token"];
    const token = response.headers["token"];
    if (token && refreshToken) {
      store.commit("set_token", token);
      store.commit("set_refreshToken", refreshToken);
    }
    //成功请求到数据
    return response;
  },
  async error => {
    //响应错误处理
    await responseBlob(error).then(error => {
      var errorMsg = error + "";
      var msgType = "error";
      var msgShow = true;
      if (errorCut > 0) {
        msgShow = false;
      }
      setTimeout(function () {
        errorCut = 0;
      }, 500);
      errorCut++;
      if (error.response) {
        switch (error.response.status) {
          case 401:
            checkStatus(
              error.response,
              function (config) {
                instance(config).then(
                  res =>
                    successback(
                      res,
                      config.success,
                      config.isShowLoad,
                      config.isFile
                    ),
                  error => errback(error, config.failed, config.isShowLoad)
                );
              },
              function (response) { }
            );
            msgShow = false;
            errorCut--;
            break;
          case 500:
            if (error.response.data && error.response.data.code === 600) {
              errorMsg = error.response.data.message || "业务异常";
              msgType = error.response.data.msgType || "error";
            } else {
              errorMsg = error.response.data.message || "服务异常";
            }
            break;
          case 502:
            errorMsg = error.response.data.message || "Bad Gateway";
            break;
          case 503:
            errorMsg = "服务注册失败 或 注册未完成";
            break;
          default:
            break;
        }
      } else if (errorMsg.indexOf("timeout") != -1) {
        errorMsg = "请求超时";
      } else if (errorMsg.indexOf("network error") != -1) {
        errorMsg = "网络异常";
      }
      if (error.response.config && error.response.config.libraryReq === true) {
        return Promise.reject(error.response);
      }
      if (msgShow == true) {
        Dialog.alert({
          title: '提示',  // 弹窗标题
          message: errorMsg,  // 弹窗消息内容
          confirmButtonText: '确定',  // 确认按钮文本
          messageAlign: 'left',  // 文本对齐方式
          className: msgType,  // 自定义类名，可根据类型设置样式
          allowHtml: true  // 允许消息内容包含 HTML
        }).then(() => {
          // 确认按钮点击后的逻辑
        });
      }
      return Promise.reject(error.response);
    });
  }
);

let isRefreshing = true;
function checkStatus(response, retryCallback, callback) {
  if (window.config.host.sso_sts) {
    //  sso.login();
  } else if (response.data.code === 1000) {

    if (document.getElementsByClassName("mftcc-err").length === 0) {
      Toast.fail({
        message: response.data.message,
        duration: 2000, // 自定义显示时间
        forbidClick: true, // 禁止点击背景
        className: 'mftcc-err', // 自定义类名
        closeOnClick: true, // 点击关闭
      });
    }
    if (
      window.overTimeCallBack &&
      typeof window.overTimeCallBack == "function"
    ) {
      window.overTimeCallBack();
    } else {
      router.push({ path: "/" });
      window.location.reload();
    }
    // }
    callback(response);
  } else if (response.data.code === 1001) {
    // 刷新token的函数,这需要添加一个开关，防止重复请求
    if (isRefreshing) {
      refreshTokenRequst(response.config.url, response.config.method);
    }
    isRefreshing = false;
    // 这个Promise函数很关键
    const retryOriginalRequest = new Promise(resolve => {
      addSubscriber(() => {
        resolve(retryCallback(response.config));
      });
    });
  } else {
    //其他情况默认跳转到登录页
    if (top.location != self.location) {
      window.parent.postMessage(
        { code: 401, message: response.data.message },
        "*"
      );
      return;
    }

    if (document.getElementsByClassName("mftcc-err").length === 0) {
        Toast.fail({
          message: response.data.message,
          duration: 2000, // 自定义显示时间
          forbidClick: true, // 禁止点击背景
          className: 'mftcc-err', // 自定义类名
          closeOnClick: true, // 点击关闭
        });
    }


    router.push({ path: "/" });
    window.location.reload();
    // }

    callback(response);
  }
}

function refreshTokenRequst(url, method) {
  instance({
    url: url,
    method: method,
    headers: {
      token: store.getters.token,
      refreshToken: store.getters.refreshToken
    }
  }).then(
    response => {
      if (response.headers.hasOwnProperty("token")) {
        let token = response.headers["token"];
        store.commit("set_token", token);
        // if (top.location != self.location) {
        //   window.parent.postMessage({ code: 1000, token: token }, "*");
        //   return;
        // }
      }
      if (response.headers.hasOwnProperty("refresh-token")) {
        let refreshToken = response.headers["refresh-token"];
        store.commit("set_refreshToken", refreshToken);
        // if (top.location != self.location) {
        //   window.parent.postMessage(
        //     { code: 1001, refreshToken: refreshToken },
        //     "*"
        //   );
        //   return;
        // }
      }
      onAccessTokenFetched();
      isRefreshing = true;
    },
    error => {
      errback(error, null, null, true, true);
      subscribers = [];
      isRefreshing = true;
    }
  );
}

let subscribers = [];
function onAccessTokenFetched() {
  subscribers.forEach(callback => {
    callback();
  });
  subscribers = [];
}

function addSubscriber(callback) {
  subscribers.push(callback);
}

/**
 * 库中选择请求
 * @param url 请求url
 * @param params 参数
 * @param isCrypto false:无加密，true：参数加密， 默认 true
 */
const getParameter = (url, params, isCrypto, success, failed) =>
  instance(
    getConfig(
      url,
      "post",
      true,
      params,
      success,
      failed,
      isCrypto,
      false,
      false,
      null,
      true
    )
  ).then(
    res => successback(res, success, false),
    error => errback(error, failed, false)
  );
/**
 * get方式请求，url传参
 * @param url 请求url
 * @param params 参数
 * @param isCrypto false:无加密，true：参数加密， 默认 true
 */
const get = (url, params, isCrypto, success, failed) =>
  instance(getConfig(url, "get", true, params, success, failed, isCrypto)).then(
    res => successback(res, success),
    error => errback(error, failed)
  );
/**
 * get方式请求，url传参
 * @param url 请求url
 * @param params 参数
 * @param isCrypto false:无加密，true：参数加密， 默认 true
 */
const getNoLoading = (url, params, isCrypto, success, failed) =>
  instance(
    getConfig(url, "get", true, params, success, failed, isCrypto, false)
  ).then(
    res => successback(res, success),
    error => errback(error, failed)
  );

/**
 * post方式请求 json方式传参
 * @param url 请求url
 * @param params 参数
 * @param isCrypto false:无加密，true：参数加密， 默认 true
 */
const postJson = (url, params, isCrypto, success, failed) =>
  instance(getConfig(url, "post", true, params, success, failed, isCrypto)).then(
    res => successback(res, success),
    error => errback(error, failed)
  );
/**
 * post方式请求 ssojson方式传参,application/json
 * @param url 请求url
 * @param params 参数
 * @param isCrypto false:无加密，true：参数加密， 默认 true
 */
const postSSOJson = (url, params, isCrypto, success, failed) => {
  let ajaxconfig = getConfig(
    url,
    "post",
    true,
    params,
    success,
    failed,
    isCrypto
  );
  ajaxconfig.headers["Content-Type"] = "application/json";
  instance(ajaxconfig).then(
    res => success(res),
    error => errback(error, failed)
  );
};
/**
 * post方式请求 json方式传参
 * @param url 请求url
 * @param params 参数
 * @param isCrypto false:无加密，true：参数加密， 默认 true
 */
const postJsonNoLoading = (url, params, isCrypto, success, failed) =>
  instance(
    getConfig(url, "post", true, params, success, failed, isCrypto, false)
  ).then(
    res => successback(res, success),
    error => errback(error, failed)
  );

/**
 * post方式请求 表单传参
 * @param url 请求url
 * @param params 参数
 * @param isCrypto false:无加密，true：参数加密， 默认 true
 */
const postForm = (url, params, isCrypto, success, failed) =>
  instance(getConfig(url, "post", false, params, success, failed, isCrypto)).then(
    res => successback(res, success),
    error => errback(error, failed)
  );
/**
 * post方式请求 翻页查询传参
 * @param url 请求url
 * @param params 参数
 * @param isCrypto false:无加密，true：参数加密， 默认 true
 */
const findByPage = (url, params, isCrypto, success, failed) =>
  instance(getConfig(url, "post", true, params, success, failed, isCrypto)).then(
    res => successback(res, success),
    error => errback(error, failed)
  );
/**
 * post方式请求 翻页查询传参
 * @param url 请求url
 * @param params 参数
 * @param isCrypto false:无加密，true：参数加密， 默认 true
 */
const findByList = (url, params, isCrypto, success, failed) =>
  instance(getConfig(url, "post", true, params, success, failed, isCrypto)).then(
    res => successback(res, success),
    error => errback(error, failed)
  );
/**
 * delete方式请求 url传参
 * @param url 请求url
 * @param params 参数
 * @param isCrypto false:无加密，true：参数加密， 默认 true
 */
const del = (url, params, isCrypto, success, failed) =>
  instance(getConfig(url, "delete", true, params, success, failed, isCrypto)).then(
    res => successback(res, success),
    error => errback(error, failed)
  );
/**
 * put方式请求 json传参
 * @param url 请求url
 * @param params 参数
 * @param isCrypto false:无加密，true：参数加密， 默认 true
 */
const putJson = (url, params, isCrypto, success, failed) =>
  instance(getConfig(url, "put", true, params, success, failed, isCrypto)).then(
    res => successback(res, success),
    error => errback(error, failed)
  );
/**
 * put方式请求 表单传参
 * @param url 请求url
 * @param params 参数
 * @param isCrypto false:无加密，true：参数加密， 默认 true
 */
const putForm = (url, params, isCrypto, success, failed) =>
  instance(getConfig(url, "put", false, params, success, failed, isCrypto)).then(
    res => successback(res, success),
    error => errback(error, failed)
  );

const downloadFile = (url, params, isCrypto, success, failed) =>
  instance(
    getConfig(url, "post", true, params, success, failed, isCrypto, true, true)
  ).then(
    res => successback(res, success, true, true),
    error => errback(error, failed)
  );

const uploadFile = (url, params, isCrypto, success, failed, onProgress) =>
  instance(
    getConfig(
      url,
      "post",
      true,
      params,
      success,
      failed,
      false,
      true,
      false,
      onProgress
    )
  ).then(
    res => successback(res, success),
    error => errback(error, failed)
  );

const downloadBlob = async (url, params, isCrypto, success, failed) => {
  let config = getConfig(
    url,
    "post",
    true,
    params,
    success,
    failed,
    isCrypto,
    false,
    false
  );
  config.responseType = "blob";
  await instance(config).then(
    res => {
      successback(res, success, false, false);
    },
    error => errback(error, failed, false)
  );
};

/**
 * 同步
 */
const sync = {
  async postJsonSync(url, params, isCrypto, success, failed) {
    const res = await instance(
      getConfig(url, "post", true, params, success, failed, isCrypto)
    );
    return res.data;
  },
  async getParameter(url, params, isCrypto, success, failed) {
    const res = await instance(
      getConfig(
        url,
        "post",
        true,
        params,
        success,
        failed,
        isCrypto,
        false,
        false,
        null,
        true
      )
    );
    return res.data;
  }
};

// 参数转换
const param2String = data => {
  console.log("data", data);
  if (typeof data === "string") {
    return data;
  }
  let ret = "";
  for (let it in data) {
    let val = data[it];
    if (
      typeof val === "object" && //
      (!(val instanceof Array) ||
        (val.length > 0 && typeof val[0] === "object"))
    ) {
      val = JSON.stringify(val);
    }
    ret += it + "=" + encodeURIComponent(val) + "&";
  }
  if (ret.length > 0) {
    ret = ret.substring(0, ret.length - 1);
  }
  return ret;
};

// 错误回调函数
const errback = (res, failed, isShowLoad = true) => {
  if (isShowLoad === true) {
    tryHideFullScreenLoading();
  }
  if (
    config.productName == "mftcc-plt-dev" ||
    config.productName == "mftcc-bus-web"
  ) {
    return;
  }
  if (/* res.status != '401' &&  */ typeof failed == "function") {
    failed(res.data);
  }
};
// 成功回调函数
const successback = (res, success, isShowLoad = true, isFile = false) => {
  if (isFile === true) {
    let blob = new Blob([res.data], {
      type: "application/octet-stream"
    });
    let fileName = Date.parse(new Date()) + ".json";
    if (res.headers.hasOwnProperty("file-name")) {
      fileName = res.headers["file-name"];
    }
    if (res.headers.hasOwnProperty("file-name*")) {
      fileName = decodeURIComponent(res.headers["file-name*"]);
    }
    if (window.navigator.msSaveOrOpenBlob) {
      navigator.msSaveBlob(blob, fileName);
    } else {
      var link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
      //释放内存
      window.URL.revokeObjectURL(link.href);
    }
  }
  if (isShowLoad === true) {
    tryHideFullScreenLoading();
  }
  if (res.status === 200 && typeof success == "function") {
    success(res.data);
  }
};

/**
 * @param url 请求url
 * @param method get,post,put,delete
 * @param isjson 是否json提交参数
 * @param params 参数
 * @param isCrypto false:无加密，true：参数加密， 默认 true
 */
const getConfig = (
  url,
  method,
  isjson,
  params,
  success,
  failed,
  isCrypto = true,
  isShowLoad = true,
  isFile = false,
  onProgress = null,
  libraryReq = false
) => {


  if (isShowLoad === true) {
    showFullScreenLoading();
  }
  params = params || {};


  let isSign = window.config.data_verify_sign || false;
  /* 数据是否验签 */
  let paramsObj = Object.assign({}, params);
  let signMsg = null;

  if (isSign === true && JSON.stringify(params) != "{}") {

    console.log("#######");

    /* 将所有参数进行ASCII码升序排序
    将排序后的参数键值对用&拼接起来（例 key1=value1&key2=value2）
    */
    var keysArr = Object.keys(paramsObj).sort();
    params = {};
    let paramStr = "";

    for (var i in keysArr) {
        let key = keysArr[i];

        let value = paramsObj[key];
        if (
        (paramsObj[key] == "" ||
        paramsObj[key] == undefined ||
        paramsObj[key] == null) &&
        paramsObj[key] !== 0 &&
        paramsObj[key] !== "0"
        ) {
          value = "";
        }
        paramStr += key + "=" + value + "&";
        console.log("===>" + paramStr);

        params[key] = value;
    }





    //通讯秘钥
    let md5Key = "d551cae65e43b9cda21e9f00502f4d94";
    /* 将通讯秘钥以“&key=通讯密钥”进行拼接 */
    paramStr += "md5Key=" + md5Key;
    /* 进行MD5加密 生成签名 */
    signMsg = sha256(paramStr).toUpperCase();

  }


  /* 数据是否加密 */
  if (
    isCrypto === true &&
    method in { post: true, put: true } &&
    window.config.data_crypto === true
  ) {
    params = { encrypt: aes.en(JSON.stringify(params)) };
    if (signMsg) {
      params.signMsg = signMsg;
    }
  } else {
    isCrypto = false;
  }
  let config_ = {
    url,
    method,
    success: success,
    failed: failed,
    isShowLoad: isShowLoad,
    isFile: isFile,
    // params, data,
    headers: {
      isCrypto,
      isSign
    },
    libraryReq: libraryReq
  };
  if (onProgress != null && typeof onProgress === "function") {
    config_.headers["Content-Type"] = "multipart/form-data";
    config_.onUploadProgress = onProgress;
  }
  // 表单提交参数

  if (!isjson) {

      config_.headers["Content-Type"] = "application/x-www-form-urlencoded";
      config_.responseType = "text";
      config_.transformRequest = [
          function (data) {
            return param2String(data);
          }
      ];
  }
  if (isFile === true) {
      config_.responseType = "blob";
  }
  // 设置参数
  if (method in { get: true, delete: true }) {
      if (typeof params === "object") {
          config_.params = params;
      }
  } else if (method in { post: true, put: true }) {
          config_.data = params;
  }
  config_.headers["x-requested-with"] = "XMLHttpRequest";


  return config_;
};




let loading; // 定义 loading 变量

function startLoading() {
    // 使用 Vant 的 Toast.loading 方法
    // loading = Toast.loading({
    //     message: '拼命加载中',
    //     forbidClick: true,  // 禁止点击背景区域
    //     duration: 0,  // 持续显示，直到手动关闭
    //     overlay: true,  // 显示遮罩层
    // });
}

function endLoading() {
      // 使用 Vant 的 Toast.clear 方法关闭 loading
      // loading.clear();
}



//那么 showFullScreenLoading() tryHideFullScreenLoading() 要干的事儿就是将同一时刻的请求合并。
//声明一个变量 needLoadingRequestCount，每次调用showFullScreenLoading方法 needLoadingRequestCount + 1。
//调用tryHideFullScreenLoading()方法，needLoadingRequestCount - 1。needLoadingRequestCount为 0 时，结束 loading。
let needLoadingRequestCount = 0;
export function showFullScreenLoading() {
  if (needLoadingRequestCount === 0) {
    startLoading();
  }
  needLoadingRequestCount++;
}

export function tryHideFullScreenLoading() {
    if (needLoadingRequestCount <= 0) {
        return;
    }
    needLoadingRequestCount--;
    if (needLoadingRequestCount === 0) {
        endLoading();
    }
}

// 统一方法输出口
export {
      instance,
      get,
      getNoLoading,
      postJson,
      postJsonNoLoading,
      postForm,
      del,
      putJson,
      putForm,
      findByPage,
      downloadFile,
      getParameter,
      findByList,
      uploadFile,
      downloadBlob,
      sync,
      postSSOJson
};

