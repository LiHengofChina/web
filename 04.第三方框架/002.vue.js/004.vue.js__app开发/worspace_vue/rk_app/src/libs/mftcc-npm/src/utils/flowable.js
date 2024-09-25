

import {  Dialog } from 'vant';


function flowableHandler (that) {
  window.removeEventListener('message', variablesHandler);
  window.addEventListener('message', variablesHandler);
  function variablesHandler (e) {
    if (e.data.type == "getVariables") {
      if (typeof (that[e.data.method]) == "function") {
        that[e.data.method](e.data.formData, res => {
          let data = {
            type: "setVariables",
            data: res
          };
          window.parent.postMessage(data, "*");
        });
      } else {
        MessageBox.alert("获取流程变量函数发生错误", "提示", {
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    }
  }

  window.removeEventListener('message', commitHandler);
  window.addEventListener('message', commitHandler);
  function commitHandler (e) {
    if (e.data.type == "doCommit") {
      if (typeof (that[e.data.method]) == "function") {
        that[e.data.method](e.data.params, res => {
          let data = {
            type: "doCommitBack",
            data: res
          };
          window.parent.postMessage(data, "*");
        });
      } else {

        Dialog.alert({
              title: '提示',  // 弹窗标题
              message: '流程提交函数发生错误',  // 弹窗消息内容
              confirmButtonText: '确定',  // 确认按钮文本
              className: 'error-dialog',  // 自定义类名，用于根据错误类型设置样式
              allowHtml: true  // 允许消息内容包含 HTML，类似于 dangerouslyUseHTMLString
        }).then(() => {
              // 用户点击确认后的逻辑处理
        });

      }
    }
  }

  window.removeEventListener('message', initFormHandler);
  window.addEventListener('message', initFormHandler);
  function initFormHandler (e) {
    if (e.data.type == "appFormInitMethod") {
      if (typeof (that[e.data.method]) == "function") {
        that[e.data.method](res => {
          let data = {
            type: "appFormInitMethod",
            data: res
          };
          window.parent.postMessage(data, "*");
        });
      } else {
        MessageBox.alert("审批详情函数发生错误", "提示", {
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    }
  }

  window.removeEventListener('message', appPageDataHandler);
  window.addEventListener('message', appPageDataHandler);
  function appPageDataHandler (e) {
    if (e.data.type == "appPageDataMethod") {
      if (typeof (that[e.data.method]) == "function") {
        that[e.data.method](res => {
          let data = {
            type: "appPageDataMethod",
            data: res
          };
          window.parent.postMessage(data, "*");
        });
      } else {
        MessageBox.alert("审批弹层页面数据回调函数发生错误", "提示", {
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    }
  }
}

export {
  flowableHandler
}