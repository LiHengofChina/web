import { setToken, getToken } from '../utils/storeUtil.js'

// import ElementUI from '../../node_modules/element-ui';
// // import '../../node_modules/element-ui/lib/theme-chalk/index.css';
// // 挂载全局对象
// window.ELEMENT = ElementUI;

const { Message } = ELEMENT;
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
          Message.error({
            showClose: true,
            message: e.data.message,
            type: 'error'
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