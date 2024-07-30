<template>
    <div class="login-page">
        <h2>Login</h2>
        <form @submit.prevent="submitLogin">
        <div>
            <label for="username">Username:</label>
            <input type="text" id="username" v-model="username" />
        </div>
        <div>
            <label for="password">Password:</label>
            <input type="password" id="password" v-model="password" />
        </div>
        <button type="submit">Login</button>
        </form>
    </div>
</template>

<script>
export default {
    name: 'LoginPage', // 使用多词组件名称
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
.login-page {
    max-width: 300px;
    margin: auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
}
</style>
