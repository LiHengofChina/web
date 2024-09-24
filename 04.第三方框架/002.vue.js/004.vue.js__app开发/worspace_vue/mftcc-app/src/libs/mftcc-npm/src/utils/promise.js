import { setToken, getToken } from '../utils/storeUtil.js'

import { Toast  } from 'vant';

import store from '../store';
import router from '../router/index';

const promise = function () {
  return new Promise(async (resolve, reject) => {
    if (top.location != self.location) {
      // if (!getToken()) {
      window.removeEventListener('message', handler)
      window.addEventListener('message', handler)
      // } else {
      //   resolve(true);
      // }
      function handler (e) {
        if ((typeof e.data) === 'string') {
          setToken(JSON.parse(e.data));
          resolve(true)
        }
        //  resolve(true) //说明 本地联调的时候开启 发布的时候要去掉
      }
    } else {
      window.removeEventListener('message', handler);
      window.addEventListener('message', handler);
      function handler (e) {
        if (e.data.code == 401) {

          
          Toast.fail({
            message: e.data.message,  // 显示的错误消息
            duration: 2000,  // 显示时间（2秒），可根据需要调整
            closeOnClick: true,  // 点击时关闭消息
          });

          router.push({ path: "/" });
        } else if (e.data.code == 1000) {
          store.commit('set_token', e.data.token);
        } else if (e.data.code == 1001) {
          store.commit('set_refreshToken', e.data.refreshToken);
        }
      }
      resolve(true);
    }
  })
}

export default promise