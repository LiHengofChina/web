<template>
  <div class="full-page" :style="{ backgroundImage: fullPageBackground }">
    <div class="login-page" :style="{ backgroundImage: loginPageBackground }">
      <h2>欢迎登录</h2>
      <form @submit.prevent="submitLogin">
        <div>
          <input
            type="text"
            id="username"
            v-model="username"
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
        <van-button type="primary" block native-type="submit">登录</van-button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginPage',
  data() {
    return {
      username: '',
      password: '',
      fullPageBackground: '', // 用于存储懒加载的全页背景图片
      loginPageBackground: '' // 用于存储懒加载的登录区域背景图片
    };
  },
  mounted() {
    this.lazyLoadBackgrounds();
  },
  methods: {
    submitLogin() {
      // 在这里处理登录逻辑，例如调用API验证用户凭证
      console.log('Login attempt:', this.username, this.password);
      // 假设登录成功，跳转到其他页面
      this.$router.push('/'); // 登录后重定向到首页或其他页面
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
  margin: 12rem auto; /* 水平居中，顶部外边距为 12rem */
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

</style>
