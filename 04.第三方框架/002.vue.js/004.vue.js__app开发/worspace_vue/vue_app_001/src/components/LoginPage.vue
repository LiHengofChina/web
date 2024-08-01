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
  max-width: 300px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-size: cover;
  background-position: center;
  color: #fff;
  margin-top: 200px; /* 距离顶部 200px */
}

input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
}

input::placeholder {
  color: #ccc; /* 浅色的提示文本颜色 */
}

button {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
