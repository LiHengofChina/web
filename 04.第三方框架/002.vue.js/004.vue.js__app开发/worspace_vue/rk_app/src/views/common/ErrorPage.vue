<template>
    <div class="error-page">
        <h1>提示</h1>
        <p>{{ message }}</p>
    </div>
</template>

<script>
export default {
    name: 'ErrorPage',
    data() {
        return {
            message: this.$route.query.message || '未知错误'
        };
    }
};
</script>
<style scoped>
    .error-page {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        text-align: center;
    }
    h1 {
        color: #f56c6c;
        margin-bottom: 20px;
    }
</style>
