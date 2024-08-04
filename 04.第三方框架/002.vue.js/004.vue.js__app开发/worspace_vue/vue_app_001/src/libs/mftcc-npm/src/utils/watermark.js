const watermark = {
  init: function (text) {
    // const text = str || window.config.watermark;
    if (!window.config.show_watermark) {
      return;
    }
    if (!text) {
      return;
    }

    var canvas = document.createElement("canvas");
    canvas.width = 300;
    canvas.height = 200;
    canvas.style.display = "none";
    var shuiyin = canvas.getContext("2d");
    // 控制文字的旋转角度和上下位置
    shuiyin.rotate((-30 * Math.PI) / 180);
    shuiyin.translate(-50, 30);
    //文字颜色
    // shuiyin.fillStyle = "#f5f5f5";
    shuiyin.fillStyle = "#f0f0f0";
    // shuiyin.fillStyle = "#E5E5E5";
    //文字样式
    shuiyin.font = "700 16px Microsoft JhengHei ";
    shuiyin.fillText(text, 5, canvas.height / 2);
    // shuiyin.fillText(text2, canvas.width / 3, canvas.height / 2 + 20);
    /* 新建一个用于填充canvas水印的标签，之所以没有直接在body上添加，
           是因为z-index对个别内容影响，才考虑的不用body */
    var watermark = document.createElement("div");
    const styleStr = `
            position:fixed !important;
            top:0 !important;
            left:0 !important;
            margin:0 !important;
            transform: none !important;
            width:100vw !important;
            height:100vh !important;
            z-index:9999 !important;
            pointer-events:none !important;
            background-repeat:repeat !important;
            mix-blend-mode: multiply !important;
            display:block !important;
            visibility: visible !important;
            background:url('${canvas.toDataURL("image/png")}') !important;`;
    watermark.setAttribute("style", styleStr);
    watermark.classList.add("watermark");
    const wm = document.querySelector(".watermark");
    if (wm) {
      window.observer.disconnect();
      document.body.removeChild(wm);
    }
    document.body.appendChild(watermark);

    //此方法是防止用户通过控制台修改样式去除水印效果
    /* MutationObserver 是一个可以监听DOM结构变化的接口。 */
    window.observer = new MutationObserver(() => {
      const wmInstance = document.querySelector(".watermark");
      if (
        (wmInstance && wmInstance.getAttribute("style") !== styleStr) ||
        !wmInstance
      ) {
        //如果标签在，只修改了属性，重新赋值属性
        if (wmInstance) {
          // 避免一直触发
          // observer.disconnect();
          // console.log('水印属性修改了');
          wmInstance.setAttribute("style", styleStr);
        } else {
          /* 此处根据用户登录状态，判断是否终止监听，避免用户退出后登录页面仍然有水印 */
          // if (store.getters.token) {
          //标签被移除，重新添加标签
          // console.log('水印标签被移除了');
          document.body.appendChild(watermark);
          // } else {
          // observer.disconnect();
          // }
        }
      } else if (wmInstance && wmInstance.parentElement.nodeName != "BODY") {
        document.body.appendChild(wmInstance);
      }
    });
    window.observer.observe(document.body, {
      attributes: true,
      subtree: true,
      childList: true
    });
  },
  close: function () {
    /* 关闭页面的水印，即要移除水印标签 */
    let watermark = document.querySelector(".watermark");
    if (watermark) {
      window.observer.disconnect();
      document.body.removeChild(watermark);
    }
  }
};
export default watermark;
