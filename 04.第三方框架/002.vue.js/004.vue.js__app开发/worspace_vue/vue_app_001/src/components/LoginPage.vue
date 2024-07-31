<template>
  <div class="full-page">
    <div class="login-page">
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
      password: ''
    };
  },
  methods: {
    submitLogin() {
      // 在这里处理登录逻辑，例如调用API验证用户凭证
      console.log('Login attempt:', this.username, this.password);
      // 假设登录成功，跳转到其他页面
      this.$router.push('/'); // 登录后重定向到首页或其他页面
    }
  }
};
</script>

<style scoped>
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

.full-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('@/assets/login_bg_jr.png') no-repeat;
  background-size: auto; /* 保持图片的原始大小 */
  background-position: auto; /* 可以根据需要调整显示位置 */
}

.login-page {
  max-width: 300px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-image: url('../assets/login_jr.png');
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
