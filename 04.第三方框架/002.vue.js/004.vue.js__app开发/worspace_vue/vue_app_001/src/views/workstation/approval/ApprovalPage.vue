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
        <div class="category" v-for="category in pendingCategories" :key="category.type">
        <div class="category-header" @click="toggleCategory(category.type)">
            {{ category.type }}
        </div>
        <div v-show="activeCategory === category.type" class="item-details">
            <div class="details-header">
            <span>审批岗位</span>
            <span>审批人</span>
            <span>申请时间</span>
            <span>操作</span>
            </div>
            <div v-for="item in category.items" :key="item.id" class="list-item">
            <div class="item-field">{{ item.position }}</div>
            <div class="item-field">{{ item.approver }}</div>
            <div class="item-field">{{ item.requestTime }}</div>
            <div class="item-field">
                <button @click="approve(item.id)">批准</button>
                <button @click="reject(item.id)">拒绝</button>
            </div>
            </div>
        </div>
        </div>
    </div>
    <div v-else-if="activeTab === 'completed'" class="list">
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
    activeTab: 'pending',
    activeCategory: null, // 当前展开的类别
    pendingCategories: [
        {
        type: '租赁审批',
            items: [
                { id: 1, position: '经理', approver: '张三', requestTime: '2024-08-06', operation: '操作1' },
                { id: 2, position: '主管', approver: '李四', requestTime: '2024-08-07', operation: '操作2' }
            ]
        },
        {
        type: '租赁展期主流程',
            items: [
                { id: 3, position: '总监', approver: '王五', requestTime: '2024-08-08', operation: '操作3' },
                { id: 4, position: '助理', approver: '赵六', requestTime: '2024-08-09', operation: '操作4' }
            ]
        }
    ],
    completedItems: [
        { id: 1, title: '已处理项目1', date: '2024-08-01' },
        { id: 2, title: '已处理项目2', date: '2024-08-02' }
    ]
    };
},
methods: {
    goBack() {
    this.$router.go(-1);
    },
    toggleCategory(type) {
    this.activeCategory = this.activeCategory === type ? null : type;
    },
    approve(id) {
    // 批准逻辑
    console.log(`批准项目ID: ${id}`);
    },
    reject(id) {
    // 拒绝逻辑
    console.log(`拒绝项目ID: ${id}`);
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


.category-title {
font-size: 1rem; /* 设置字体大小 */
font-weight: bold; /* 设置为粗体 */
color: #333; /* 设置字体颜色 */
text-align: left; /* 左对齐 */
margin-bottom: 0.5rem; /* 标题和列表间的距离 */
}

.category-header {
display: flex;
font-size: 1rem; /* 字段名的字体大小 */
font-weight: bold; /* 设置为粗体 */
color: #333; /* 设置字体颜色 */
padding: 0.5rem 0; /* 设置内边距 */
border-bottom: 1px solid #ddd; /* 设置底部边框 */
}

.category-header div {
flex: 1;
text-align: center;
}

.category-item {
display: flex;
align-items: center;
padding: 0.5rem 0;
border-bottom: 1px solid #ddd;
}

.category-item div {
flex: 1;
text-align: center;
}
  

.item-details {
background-color: #fff;
border-radius: 0.5rem;
padding: 0.5rem;
}

.details-header {
display: flex;
justify-content: space-between;
font-weight: bold;
margin-bottom: 0.5rem;
}

.list-item {
display: flex;
justify-content: space-between;
padding: 0.5rem 0;
border-bottom: 1px solid #ddd;
}

.item-field {
flex: 1;
text-align: center;
}

form button {
padding: 0.5rem 1rem;
color: #fff;
background-color: #007bff;
border: none;
border-radius: 0.2rem;
cursor: pointer;
margin-left: 0.5rem;
}
</style>
