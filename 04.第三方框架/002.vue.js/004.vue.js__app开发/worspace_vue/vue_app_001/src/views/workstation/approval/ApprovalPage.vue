<template>
    <div class="approval-page">
        <div class="header">
        <i class="fas fa-arrow-left back-icon" @click="goBack"></i>
        <h1 class="title">我审批的</h1>
        </div>
        <div class="tabs">
        <div class="tab" :class="{ active: activeTab === 'pending' }" @click="activeTab = 'pending'">待处理</div>
        <div class="tab" :class="{ active: activeTab === 'completed' }" @click="activeTab = 'completed'">已处理</div>
        <div class="tab" :class="{ active: activeTab === 'sent' }" @click="activeTab = 'sent'">抄送我</div>
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
        <div v-else-if="activeTab === 'sent'" class="list">
            <!-- 抄送我的内容列表 -->
            <div v-for="item in sentItems" :key="item.id" class="list-item">
            <div class="item-title">{{ item.title }}</div>
            <div class="item-date">{{ item.date }}</div>
            </div>
        </div>
        </div>
        <div class="footer">
        <div class="footer-item" @click="navigate('apply')">发起申请</div>
        <div class="footer-item active" @click="navigate('my-approval')">我审批的</div>
        <div class="footer-item" @click="navigate('submitted')">已提交</div>
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
        ],
        sentItems: [
            { id: 1, title: '抄送项1', date: '2024-08-05' },
            { id: 2, title: '抄送项2', date: '2024-08-06' },
            // 更多抄送项目
        ]
        };
    },
    methods: {
        goBack() {
        this.$router.go(-1); // 返回上一个页面
        },
        navigate(page) {
        this.$router.push({ name: page }); // 导航到指定页面
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
background-color: #007bff;
color: #fff;
padding: 0.5rem;
}

.back-icon {
cursor: pointer;
font-size: 1.5rem;
margin-right: 1rem;
}

.title {
font-size: 1.2rem;
}

.tabs {
display: flex;
background-color: #f8f9fa;
border-bottom: 1px solid #ddd;
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
padding: 1rem;
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

.footer {
display: flex;
justify-content: space-around;
border-top: 1px solid #ddd;
background-color: #f8f9fa;
padding: 0.5rem 0;
}

.footer-item {
flex: 1;
text-align: center;
cursor: pointer;
color: #007bff;
}

.footer-item.active {
font-weight: bold;
color: #0056b3;
}
</style>
