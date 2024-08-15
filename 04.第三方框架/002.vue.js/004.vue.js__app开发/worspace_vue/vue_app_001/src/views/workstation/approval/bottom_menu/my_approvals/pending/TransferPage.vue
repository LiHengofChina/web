<template>
    <div class="page-layout">
        <div class="header">
            <i class="fas fa-chevron-left back-icon" @click="goBack"></i>
            <h1 class="title">转办</h1>
            <div class="spacer"></div>
        </div>

        <div class="content">
            <!-- 转办页面的具体内容 -->
            <p>这是转办页面。</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'TransferPage',
    methods: {
        goBack() {
            this.$router.go(-1);
        }
    }
};
</script>

<style scoped>
/* 与 ApprovalLayout 类似的样式 */
.page-layout {
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

/* 其他样式与 ApprovalLayout 相同 */
</style>
