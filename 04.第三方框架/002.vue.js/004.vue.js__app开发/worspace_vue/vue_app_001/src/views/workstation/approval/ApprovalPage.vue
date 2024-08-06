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

    <div v-if="activeTab === 'pending'" class="sub-tabs">
    <div class="sub-tab" :class="{ active: activeSubTab === 'leaseApproval' }" @click="activeSubTab = 'leaseApproval'">租赁审批</div>
    <div class="sub-tab" :class="{ active: activeSubTab === 'leaseExtension' }" @click="activeSubTab = 'leaseExtension'">租赁展期主流程</div>
    </div>

    <div class="content">
    <div v-if="activeTab === 'pending'" class="list">
        <div v-if="activeSubTab === 'leaseApproval'" class="category">
        <div class="details-header">
            <span>审批类型</span>
            <span>审批岗位</span>
            <span>客户名称</span>
            <span>审批人</span>
            <span>操作</span>
        </div>
        <div v-for="item in leaseApprovalItems" :key="item.id" class="list-item">
            <div class="item-field">{{ item.type }}</div>
            <div class="item-field">{{ item.position }}</div>
            <div class="item-field">{{ item.customerName }}</div>
            <div class="item-field">{{ item.approver }}</div>
            <div class="item-field">
            <button @click="approve(item.id)">批准</button>
            <button @click="reject(item.id)">拒绝</button>
            </div>
        </div>
        </div>
        <div v-if="activeSubTab === 'leaseExtension'" class="category">
        <div class="details-header">
            <span>审批类型</span>
            <span>审批岗位</span>
            <span>客户名称</span>
            <span>审批人</span>
            <span>操作</span>
        </div>
        <div v-for="item in leaseExtensionItems" :key="item.id" class="list-item">
            <div class="item-field">{{ item.type }}</div>
            <div class="item-field">{{ item.position }}</div>
            <div class="item-field">{{ item.customerName }}</div>
            <div class="item-field">{{ item.approver }}</div>
            <div class="item-field">
            <button @click="approve(item.id)">批准</button>
            <button @click="reject(item.id)">拒绝</button>
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

    <div class="navbar">
    <div class="nav-item" @click="navigate('apply')">
        <i class="fas fa-plus nav-icon"></i>
        <span>发起申请</span>
    </div>
    <div class="separator"></div>
    <div class="nav-item" @click="navigate('approvals')">
        <i class="fas fa-user-check nav-icon"></i>
        <span>我审批的</span>
    </div>
    <div class="separator"></div>
    <div class="nav-item" @click="navigate('submitted')">
        <i class="fas fa-file-alt nav-icon"></i>
        <span>已提交</span>
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
    activeSubTab: 'leaseApproval',
    leaseApprovalItems: [
        { id: 1, type: '租赁审批', position: '经理', customerName: '张三', approver: '张三', requestTime: '2024-08-06' },
        { id: 2, type: '租赁审批', position: '主管', customerName: '李四', approver: '李四', requestTime: '2024-08-07' }
    ],
    leaseExtensionItems: [
        { id: 3, type: '租赁展期', position: '总监', customerName: '王五', approver: '王五', requestTime: '2024-08-08' },
        { id: 4, type: '租赁展期', position: '助理', customerName: '赵六', approver: '赵六', requestTime: '2024-08-09' }
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
    approve(id) {
    console.log(`批准项目ID: ${id}`);
    },
    reject(id) {
    console.log(`拒绝项目ID: ${id}`);
    },
    navigate(page) {
    this.$router.push({ name: page });
    }
}
};
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
background-color: #f0f0f0;
border-bottom: 1px solid #ddd;
margin-top: 2.5rem;
}

.tab {
flex: 1;
text-align: center;
padding: 0.5rem 0;
cursor: pointer;
color: #333; /* 默认黑色 */
font-size: 1.2rem;
font-weight: normal; /* 默认字体不加粗 */
}

.tab.active {
color: #2c3e50; /* 激活时的颜色 */
border-bottom: 2px solid #2c3e50; /* 激活时的边框颜色 */
font-weight: bold; /* 激活时加粗 */
}

.sub-tabs {
display: flex;
background-color: #fafafa;
border-bottom: 1px solid #ddd;
padding-left: 1rem;
}

.sub-tab {
flex: 1;
text-align: center;
padding: 0.5rem 0;
cursor: pointer;
color: #333; /* 默认黑色 */
font-size: 1rem;
font-weight: normal; /* 默认字体不加粗 */
}

.sub-tab.active {
color: #2c3e50; /* 激活时的颜色 */
border-bottom: 2px solid #2c3e50; /* 激活时的边框颜色 */
font-weight: bold; /* 激活时加粗 */
}


.content {
flex: 1;
overflow-y: auto;
padding: 3rem 1rem 1rem 1rem;
}

.details-header {
display: flex;
justify-content: space-between;
font-weight: normal;
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

.navbar {
display: flex;
justify-content: space-around;
align-items: center;
position: fixed;
bottom: 0;
left: 0;
width: 100%;
height: 4rem;
border-top: 1px solid #ccc;
background-color: #fff;
z-index: 1000;
}

.nav-item {
display: flex;
align-items: center;
flex-direction: column;
flex: 1;
text-align: center;
cursor: pointer;
color: #888;
}

.nav-icon {
font-size: 1.5rem;
}

.separator {
width: 0.1rem;
height: 1.5rem;
background-color: #ccc;
}
</style>
