const { MessageBox } = ELEMENT;
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
        MessageBox.alert("流程提交函数发生错误", "提示", {
          type: "error",
          dangerouslyUseHTMLString: true,
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