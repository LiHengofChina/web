<template>
    <div class="page-layout">
        <div class="header">
            <i class="fas fa-chevron-left back-icon" @click="goBack"></i>
            <h1 class="title">历史</h1>
            <div class="spacer"></div>
        </div>

        <div class="content">
            <!-- 历史页面的具体内容 -->
            <p>这是历史页面。</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'HistoryPage',
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

.header {
    display: flex;
    align-items: center;
    justify-content: space-between; /* 确保返回按钮和spacer均匀分布在两边 */
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 2.5rem;
    background-color: #f0f0f0;
    border-bottom: 1px solid #ddd;
    font-size: 0.6rem;
    font-weight: bold;
    color: #333;
    z-index: 1000;
    padding: 0 1rem;
}

.back-icon {
    cursor: pointer;
    font-size: 1.2rem; /* 使用 rem 单位 */
    color: #333;
}

.title {
    flex: 1;
    text-align: center;
    font-size: 1.2rem;
    margin: 0;
}

.spacer {
    width: 2.8rem; /* 使用 rem 单位，与 back-icon 相同宽度 */
    height: 100%; /* 保持占位符的高度 */
}

.content {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding-top: 2.5rem; /* 确保不被 header 覆盖 */
    padding-bottom: 5rem; /* 确保不被 navbar 覆盖 */
    overflow-y: auto; /* 允许滚动 */
}
</style>
