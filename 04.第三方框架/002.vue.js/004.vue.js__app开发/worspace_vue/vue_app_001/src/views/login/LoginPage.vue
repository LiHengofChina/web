<template>
  <div class="full-page" :style="{ backgroundImage: fullPageBackground }">
    <div class="login-page" :style="{ backgroundImage: loginPageBackground }">
      <h2>欢迎登录</h2>
      <form @submit.prevent="submitLogin">
        <div>
          <input
            type="text"
            id="opNo"
            v-model="opNo"
            placeholder="请输入账号"
          />
        </div>
        <div>
          <input
            type="password"
            id="password"
            v-model="password"
            placeholder="请输入密码"
          />
        </div>
        <button type="submit">登录</button>
      </form>
    </div>
  </div>
</template>

<script>

export default {
  name: 'LoginPage',
  data() {
    return {
      opNo: '',
      password: '',
      fullPageBackground: '', // 用于存储懒加载的全页背景图片
      loginPageBackground: '' // 用于存储懒加载的登录区域背景图片
    };
  },
  mounted() {
    this.lazyLoadBackgrounds();
  },
  methods: {
    async submitLogin() {
      try {

          const { default: api } = await import(/* webpackChunkName: "login-api" */ '@/api/login/index');//立即：动态导入

          //调用登陆接口
          await api.login({ opNo: this.opNo, password: this.password },this.$config,
                      (response) => {
                        
                        if (response.code == '0') {

                          let data = response.data;
                          this.$store.commit('changeLogin', {
                            user: data.sysUserInfo,
                            token: data.token,
                          });

                          let user = this.$store.getters['user'];
                          console.log(user);


                          let index_router = this.$config.index_router;
                          this.$router.push({ path: index_router });


                          
                        }else if (response.code == '300'){
                          console.log("2");
                        }else {
                          console.log("3");
                        }

                      },
                      (error) => {
                        console.log(error);
                      }
          );

          
      } catch (error) {
          console.error('Login failed:', error);
      }
    },
    lazyLoadBackgrounds() {
  
      // 懒加载全页背景图片
      const fullPageImage = new Image();
      fullPageImage.src = require('@/assets/login_bg_jr.png');
      fullPageImage.onload = () => {
        this.fullPageBackground = `url(${fullPageImage.src})`;
      };

      // 懒加载登录页面背景图片
      const loginPageImage = new Image();
      loginPageImage.src = require('@/assets/login_jr.png');
      loginPageImage.onload = () => {
        this.loginPageBackground = `url(${loginPageImage.src})`;
      };
    }
  }
};
</script>

<style scoped>
.full-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: auto; /* 保持图片的原始大小 */
  background-position: auto; /* 可以根据需要调整显示位置 */
}

.login-page {
  max-width: 18rem; /* 设置最大宽度，确保在大屏幕上不显得太大 */
  margin: 8rem auto; /* 水平居中，顶部外边距为 8rem */
  padding: 2.25rem; /* 使用 rem 单位 */
  border: 0.1rem solid #ccc; /* 使用 rem 单位，确保不同分辨率下的一致性 */
  border-radius: 0.5rem; /* 使用 rem 单位 */
  background-color: rgba(255, 255, 255, 0.9); /* 使用半透明背景，提升可读性 */
  color: #333; /* 字体颜色改为较深的颜色，提升可读性 */
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1); /* 添加阴影，提升视觉层次 */
}




input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 0.8rem; /* 使用 rem 单位 */
  margin: 0.8rem 0; /* 使用 rem 单位 */
  border: 0.1rem solid #ccc; /* 使用 rem 单位 */
  border-radius: 0.5rem; /* 使用 rem 单位 */
  box-sizing: border-box;
  font-size: 1rem; /* 确保输入框文字大小一致 */
}

input::placeholder {
  color: #999; /* 调整 placeholder 的颜色，使其更明显 */
}

button {
  width: 100%;
  padding: 0.8rem; /* 使用 rem 单位 */
  margin-top: 1rem; /* 使用 rem 单位 */
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 0.5rem; /* 使用 rem 单位 */
  cursor: pointer;
  font-size: 1rem; /* 按钮文字大小 */
}

button:hover {
  background-color: #0056b3;
}
</style>

