<template>
<div class="approval-page">
    <div class="header">
        <i class="fas fa-arrow-left back-icon" @click="goBack"></i>
        <h1 class="title">审批</h1>
    </div>

    <div class="tabs">
        <div class="tab" :class="{ active: activeTab === 'pending' }" @click="activeTab = 'pending'">待处理</div>
        <div class="tab" :class="{ active: activeTab === 'completed' }" @click="activeTab = 'completed'">已处理</div>
    </div>

    <div class="content">
    <div v-if="activeTab === 'pending'" class="list">
        <!-- 待处理内容列表 -->
        <div v-for="item in pendingItems" :key="item.id" class="list-item">
        <div class="item-title">{{ item.title }}</div>
        <div class="item-date">{{ item.date }}</div>
        </div>
    </div>
    <div v-else-if="activeTab === 'completed'" class="list">
        <!-- 已处理内容列表 -->
        <div v-for="item in completedItems" :key="item.id" class="list-item">
        <div class="item-title">{{ item.title }}</div>
        <div class="item-date">{{ item.date }}</div>
        </div>
    </div>
    </div>
</div>
</template>

<script>
export default {
name: 'ApprovalPage',
data() {
    return {
    activeTab: 'pending', // 默认激活的标签
    pendingItems: [
        { id: 1, title: '待处理项1', date: '2024-08-06' },
        { id: 2, title: '待处理项2', date: '2024-08-07' },
        // 更多待处理项目
    ],
    completedItems: [
        { id: 1, title: '已处理项1', date: '2024-08-01' },
        { id: 2, title: '已处理项2', date: '2024-08-02' },
        // 更多已处理项目
    ]
    };
},
methods: {
    goBack() {
    this.$router.go(-1); // 返回上一个页面
    }
}
}
</script>

<style scoped>
.approval-page {
display: flex;
flex-direction: column;
height: 100vh;
overflow: hidden;
}

.header {
display: flex;
align-items: center;
position: fixed;
top: 0;
left: 0;
width: 100%;
height: 2.5rem;
background-color: #f0f0f0; /* 浅灰色背景 */
border-bottom: 1px solid #ddd;
font-size: 0.6rem; /* 调整字体大小 */
font-weight: bold;
color: #333;
z-index: 1000;
}

.back-icon {
cursor: pointer;
font-size: 1.2rem;
margin-left: 0.5rem;
margin-right: 1rem;
color: #333; /* 返回图标的颜色 */
}

.title {
font-size: 1.2rem; /* 调整标题的字体大小 */
}

.tabs {
display: flex;
background-color: #f8f9fa;
border-bottom: 1px solid #ddd;
margin-top: 2.5rem; /* 预留 header 高度 */
}

.tab {
flex: 1;
text-align: center;
padding: 0.5rem 0;
cursor: pointer;
color: #007bff;
}

.tab.active {
border-bottom: 2px solid #007bff;
font-weight: bold;
}

.content {
flex: 1;
overflow-y: auto;
padding: 3rem 1rem 1rem 1rem; /* 确保内容不被 header 和 tabs 覆盖 */
}

.list {
display: flex;
flex-direction: column;
}

.list-item {
padding: 0.5rem 0;
border-bottom: 1px solid #ddd;
}

.item-title {
font-size: 1rem;
color: #333;
}

.item-date {
font-size: 0.8rem;
color: #999;
}
</style>
