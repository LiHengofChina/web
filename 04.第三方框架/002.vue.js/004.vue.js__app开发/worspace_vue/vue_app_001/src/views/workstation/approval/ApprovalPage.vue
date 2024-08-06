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
        <div class="item-header" @click="toggleForm(item.id)">
            <div class="item-type" :class="item.type">{{ item.type }}</div>
            <div class="item-title">{{ item.title }}</div>
        </div>
        <div class="item-date">{{ item.date }}</div>
        <div v-if="activeForm === item.id" class="form-container">
            <!-- 表单内容，使用 item.id 作为唯一标识符 -->
            <form @submit.prevent="submitForm(item.id)">
            <div class="form-group">
                <label>审批意见：</label>
                <textarea v-model="item.opinion" rows="3"></textarea>
            </div>
            <button type="submit">提交</button>
            </form>
        </div>
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
    activeForm: null, // 当前展开的表单ID
    pendingItems: [
        { id: 1, title: '审批项目A', date: '2024-08-06', type: '类型1', opinion: '' },
        { id: 2, title: '审批项目B', date: '2024-08-07', type: '类型2', opinion: '' },
        // 更多待处理项目
    ],
    completedItems: [
        { id: 1, title: '已处理项目1', date: '2024-08-01' },
        { id: 2, title: '已处理项目2', date: '2024-08-02' },
        // 更多已处理项目
    ]
    };
},
methods: {
    goBack() {
    this.$router.go(-1); // 返回上一个页面
    },
    toggleForm(id) {
    this.activeForm = this.activeForm === id ? null : id;
    },
    submitForm(id) {
    // 提交表单逻辑
    const item = this.pendingItems.find(i => i.id === id);
    if (item) {
        console.log(`提交项目ID: ${id}, 意见: ${item.opinion}`);
        // 处理提交逻辑
    }
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
background-color: #f0f0f0;
border-bottom: 1px solid #ddd;
font-size: 0.6rem;
font-weight: bold;
color: #333;
z-index: 1000;
}

.back-icon {
cursor: pointer;
font-size: 1.2rem;
margin-left: 0.5rem;
margin-right: 1rem;
color: #333;
}

.title {
font-size: 1.2rem;
}

.tabs {
display: flex;
background-color: #f8f9fa;
border-bottom: 1px solid #ddd;
margin-top: 2.5rem;
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
padding: 3rem 1rem 1rem 1rem;
}

.list {
display: flex;
flex-direction: column;
}

.list-item {
padding: 0.5rem 0;
border-bottom: 1px solid #ddd;
}

.item-header {
display: flex;
align-items: center;
cursor: pointer;
}

.item-type {
font-size: 0.8rem;
color: #fff;
background-color: #007bff;
padding: 0.2rem 0.5rem;
border-radius: 0.2rem;
margin-right: 1rem;
}

.item-title {
font-size: 1rem;
color: #333;
}

.item-date {
font-size: 0.8rem;
color: #999;
}

.form-container {
padding: 1rem;
background-color: #f9f9f9;
}

.form-group {
margin-bottom: 1rem;
}

form label {
font-size: 0.9rem;
color: #333;
}

form textarea {
width: 100%;
padding: 0.5rem;
font-size: 0.9rem;
}

form button {
padding: 0.5rem 1rem;
color: #fff;
background-color: #007bff;
border: none;
border-radius: 0.2rem;
cursor: pointer;
}
</style>
