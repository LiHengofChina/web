<template>
  <div id="iframeBox" ref="iframeBox">
    <iframe ref="iframe" name="refresh_name" class="iframe-style" frameborder="no" border="0" />
  </div>
</template>

<script>
import { getToken, setToken } from "../utils/storeUtil";
export default {
  name: "mftccIframe",
  data() {
    return {
      loading: null,
      isLoaded:false,
      callback:null
    };
  },
  props: ["src","initParams"],
  created() {},
  mounted() {
    this.resetSrc();
    this.message();
  },
  methods: {
    resetSrc() {
      let iframeUrl;
      if(this.src){
        iframeUrl = this.src;
      }else{
        let path = this.$route.path;
        iframeUrl = this.$route.meta.iframeUrl;
        if(iframeUrl.startsWith("/")){
          iframeUrl = iframeUrl.substring(1);
        }
        var productName =iframeUrl.split("/")[0];
        var productType = productName.substring(productName.indexOf("-")+1,productName.lastIndexOf("-"));
        let env = process.env.NODE_ENV == 'development'?"DEV_":"PRO_";
        let realPath = window.serverConfig[env+productType.toUpperCase()+"_HOST"]||"";
        if(!realPath){
          realPath = this.$store.getters.serverConfig[env+productType.toUpperCase()+"_HOST"]||"";
        }
        iframeUrl = realPath + "/" + iframeUrl;
      }
      if(iframeUrl){
        this.iframeInit(iframeUrl);
      }
    },
    sendToken(newVal) {
        const iframe = this.$refs.iframe;
        //发送消息
        let data = JSON.stringify({
          token:getToken(),
          initParams:this.initParams
        });
        iframe.contentWindow.postMessage(data, "*");
        // if(!this.isLoaded){
        //     this.forceUpdataIframe(iframe, newVal)
        //     this.isLoaded = true;

        // }
      //关闭加载
      this.loading.close();
    },
    //iframe 初始化
    iframeInit(newVal) {
      //链接为空不显示加载状态和绑定ifram监听事件
      if (newVal == "") {
        return;
      }
      // debugger;
      if (this.loading) {
        this.loading.close();
      }
      this.loading = this.$loading({
        target: this.$refs.iframeBox.$el,
        lock: true,
        customClass: "global-loading",
        text: "页面加载中...",
        spinner: "el-icon-loading",
        background: "transparent"
      });
      let iframe = this.$refs.iframe;

    //   处理兼容行问题
      if (iframe.attachEvent) {
        iframe.attachEvent("onload", () => {
          this.sendToken(newVal);
        });
      } else {
        iframe.onload = () => {
          console.log("isOnLoad");
          this.sendToken(newVal);
        };
      }


      //利用异步延迟加载和链接随机传参来达到刷新iframe缓存的目的，不加此步骤iframe页面不更新
      this.forceUpdataIframe(iframe, newVal);

      // debugger;
    },
    //强制刷新iframe缓存
    forceUpdataIframe(iframe, newVal) {
        setTimeout(() => {
            let fresh_link = new Date().getTime() + Math.floor(Math.random() * 1000000); //获取当前时间戳
            String.prototype.splice = function(start, newStr) {
                return this.slice(0, start) + newStr + this.slice(start);
            };
            let strIndex = newVal.indexOf("/#/");
            let url;
            if(strIndex!=-1){
                url = newVal.splice(strIndex, "?time=" + fresh_link);
            }else{
                url = newVal + "?time=" + fresh_link;
            }
            let query = this.$route.query;
            for(let key in query){
              url += "&"+key+"="+query[key];
            }
            console.log("url", url);
            iframe.src = url;
        }, 100);
    },
    message(){
      window.removeEventListener('message',iframeHandler);
      window.addEventListener('message', iframeHandler);
      let _this = this;
      function iframeHandler(e) {
        if(typeof(_this.callback) === "function"){
          if(e.data.type == "setVariables"
          ||e.data.type == "doCommitBack"
          ||e.data.type == "appFormInitMethod"
          ||e.data.type == "appPageDataMethod"){
              _this.callback(e.data.data);
              _this.callback = null;
          }
        }
      }
    },
    //流程获取变量函数
    getVariables(variablesMethod,formData,callback){
      this.callback = callback;
      let data = {
        type: "getVariables",
        formData:formData,
        method: variablesMethod
      };
      this.$refs.iframe.contentWindow.postMessage(data, "*");
    },
    doCommit(method,params,callback){
      this.callback = callback;
      let data = {
        type: "doCommit",
        params: params,
        method: method
      };
      this.$refs.iframe.contentWindow.postMessage(data, "*");
    },
    appFormInitMethod(method,callback){
      this.callback = callback;
      let data = {
        type: "appFormInitMethod",
        method: method
      };
      this.$refs.iframe.contentWindow.postMessage(data, "*");
    },
    appPageDataMethod(method,callback){
      this.callback = callback;
      let data = {
        type: "appPageDataMethod",
        method: method
      };
      this.$refs.iframe.contentWindow.postMessage(data, "*");
    }
  }
};
</script>

<style scoped>
#iframeBox{
    width: 100%;
    height: 100%;
}
.iframe-style{
  width: 100%;
  height: calc(100% - 3px);
}
</style>