<template>
    <div class="error-page">
        <h1>提示</h1>
        <p>{{ message }}</p>
    </div>
</template>

<script>
export default {
    name: 'SuccessfulPage',
    data() {
        return {
            message: '操作成功'
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
        color: #67c23a;
        margin-bottom: 20px;
    }
</style>
