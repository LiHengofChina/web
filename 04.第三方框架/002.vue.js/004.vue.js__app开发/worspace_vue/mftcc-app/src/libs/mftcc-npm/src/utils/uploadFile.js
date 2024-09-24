import { uploadFile, downloadBlob } from '../axios'

const uploadFileFunc = function (content) {
  const formData = new FormData();
  if (content.data) {
    Object.keys(content.data).forEach(key => {
      formData.append(key, content.data[key]);
    });
  }
  formData.append(content.filename, content.file, content.file.name);
  uploadFile(content.action, formData, true, res => {
    if (res.code != 0) {
      content.onError(res)
    } else {
      content.onSuccess(res)
    }
  }, error => {
    content.onError(error);
  }, onProgress => {
    let percent = (onProgress.loaded / onProgress.total * 100) | 0
    //调用onProgress方法来显示进度条，需要传递个对象 percent为进度值
    content.onProgress({ percent: percent })
  });
}

const dataURLtoBlob = function (dataurl) {
  var arr = dataurl.split(',');
  //注意base64的最后面中括号和引号是不转译的   
  var _arr = arr[1].substring(0, arr[1].length - 2);
  var mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(_arr),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], {
    type: mime
  });
}

const downloadBlobFunc = function (fileList) {
  (async () => {
    for (let i in fileList) {
      if (fileList[i].url && fileList[i].url.indexOf("@") === 0) {
        try {
          // let file = require(`@/${fileList[i].url.substr(2)}`)
          fileList[i].url = window.URL.createObjectURL(dataURLtoBlob(file))
        } catch (error) {
          console.error(fileList[i].url + "不存在")
        }
      } else if (fileList[i].url && fileList[i].url.indexOf("#") === 0) {
        try {
          // let file = require(`#/${fileList[i].url.substr(2)}`)
          fileList[i].url = window.URL.createObjectURL(dataURLtoBlob(file))
        } catch (error) {
          console.error(fileList[i].url + "不存在")
        }
      } else if (fileList[i].url && fileList[i].url.indexOf('blob:') !== 0) {
        await downloadBlob(fileList[i].url, fileList[i].data || {}, true, res => {
          if (res != null) {
            let blob = new Blob([res], { type: "application/octet-stream" })
            fileList[i].url = window.URL.createObjectURL(blob)
          }
        });
      }
    }
  })()
  return fileList
}

const downloadBlobForUrlFunc = function (url, data, callback) {
  if (url && url.indexOf("@") === 0) {
    try {
      // let file = require(`@/${url.substr(2)}`)
      callback(window.URL.createObjectURL(dataURLtoBlob(file)))
    } catch (error) {
      console.error(url + "不存在")
      callback(url)
    }
  } else if (url && url.indexOf("#") === 0) {
    try {
      // let file = require(`#/${url.substr(2)}`)
      callback(window.URL.createObjectURL(dataURLtoBlob(file)))
    } catch (error) {
      console.error(url + "不存在")
      callback(url)
    }
  } else if (url && url.indexOf('blob:') !== 0) {
    downloadBlob(url, data || {}, true, res => {
      let blob = new Blob([res], { type: "application/octet-stream" })
      callback(window.URL.createObjectURL(blob))
    });
  }
}

export default {
  uploadFileFunc: uploadFileFunc,
  downloadBlobFunc: downloadBlobFunc,
  downloadBlobForUrlFunc: downloadBlobForUrlFunc
};