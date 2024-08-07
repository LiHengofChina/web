<template>
<div class="approval-page">
    <div class="header">
        <i class="fas fa-chevron-left back-icon" @click="goBack"></i>
        <h1 class="title">审批</h1>
    </div>

    <div class="tabs">
    <div class="tab" :class="{ active: activeTab === 'pending' }" @click="activeTab = 'pending'">待处理</div>
    <div class="tab" :class="{ active: activeTab === 'completed' }" @click="activeTab = 'completed'">已处理</div>
    </div>

    <div class="content">
        <div v-if="activeTab === 'pending'">
            <div v-for="item in pendingItems" :key="item.id" class="card">
                <div class="card-content">
                    <div class="card-header">{{ item.type }} - {{ item.position }}</div>
                    <div class="card-body">
                        <p>客户: {{ item.customerName }}</p>
                        <p>审批人: {{ item.approver }}</p>
                    </div>
                    <div class="card-actions">
                        <button @click="approve(item.id)">审批</button>
                        <button @click="transfer(item.id)">转办</button>
                    </div>
                </div>
            </div>
        </div>

        <div v-else-if="activeTab === 'completed'">
            <div v-for="item in completedItems" :key="item.id" class="list-item">
            <div class="item-title">{{ item.title }}</div>
            <div class="item-date">{{ item.date }}</div>
            </div>
        </div>
    </div>

    <div class="navbar">
        <div 
            class="nav-item" 
            :class="{ active: selectedNav === 'apply' }" 
            @click="navigate('apply')"
        >
            <i class="fas fa-plus nav-icon"></i>
            <span>发起申请</span>
        </div>
        <div class="separator"></div>
        <div 
            class="nav-item" 
            :class="{ active: selectedNav === 'approvals' }" 
            @click="navigate('approvals')"
        >
            <i class="fas fa-user-check nav-icon"></i>
            <span>我审批的</span>
        </div>
        <div class="separator"></div>
        <div 
            class="nav-item" 
            :class="{ active: selectedNav === 'submitted' }" 
            @click="navigate('submitted')"
        >
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
            selectedNav: 'approvals',
            // pendingItems: [],
            pendingItems: [
                { id: 1, type: '租赁审批', position: '经理', customerName: '张三', approver: '张三', requestTime: '2024-08-06' },
                { id: 2, type: '租赁审批', position: '主管', customerName: '李四', approver: '李四', requestTime: '2024-08-07' }
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
            console.log(`审批项目ID: ${id}`);
        },
        transfer(id) {
            console.log(`转办项目ID: ${id}`);
        },
        navigate(page) {
            this.selectedNav = page;
            this.$router.push({ name: page });
        },
        async fetchPendingItems() {
            try {
                const { default: api } = await import(/* webpackChunkName: "workstation-approval-api" */ '@/api/workstation/approval');

                // 获取 token 和 refresh token
                const token = this.$store.getters.token;
                const refreshToken = this.$store.getters.refreshToken;
                if (!token || !refreshToken) {
                    console.error('Token or Refresh Token is missing');
                    return;
                }

                await api.getSysTaskInfo(
                    { Token: token, Refreshtoken: refreshToken },
                    this.$config,
                    (response) => {
                        if (response && response.code === 0 && response.list && Array.isArray(response.list.records)) {
                            this.pendingItems = response.list.records.map(record => ({
                                id: record.ID,
                                type: record.APPROVE_TITLE || '未知审批',
                                position: record.TASK_NAME || '未知岗位',
                                customerName: record.CUS_NAME || '未知客户',
                                approver: record.ASSIGNEE_NAME || '未知审批人',
                                requestTime: record.CREATE_TIME || '未知时间'
                            }));
                        } else {
                            console.error('Unexpected API response:', response);
                        }
                    },
                    (error) => {
                        console.error('API Error:', error);
                    }
                );
            } catch (error) {
                console.error('Failed to fetch pending items:', error);
            }
        },
    },
    created() {
        this.fetchPendingItems(); // 组件创建时获取待处理项目
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
padding: 0 1rem;
}

.back-icon {
cursor: pointer;
font-size: 1.2rem;
margin-right: 1rem;
color: #333;
}

.title {
flex: 1;
text-align: center;
font-size: 1.2rem;
}


.tabs {
display: flex;
width: 100%;
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

.content {
flex: 1;
overflow-y: auto;
padding: 1rem 1rem 1rem 1rem;
}


.card {
background-color: #fff;
margin-bottom: 1rem;
border-radius: 0.5rem;
/* 新的阴影效果 */

box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.2);

padding: 1rem;
}


.card-header {
font-weight: bold;
font-size: 1rem;
margin-bottom: 0.5rem;
}

.card-body {
margin-bottom: 1rem;
}

.card-actions {
display: flex;
justify-content: space-between;
}

.card-actions button {
flex: 1;
margin: 0 0.5rem;
padding: 0.5rem 0;
border: none;
background-color: #2c3e50;
color: #fff;
border-radius: 0.25rem;
cursor: pointer;
transition: background-color 0.3s ease;
}

.card-actions button:first-child {
margin-left: 0;
}

.card-actions button:last-child {
margin-right: 0;
}

.card-actions button:hover {
background-color: #1a252f;
}

.list-item {
padding: 1rem 0;
border-bottom: 1px solid #ddd;
display: flex;
justify-content: space-between;
}

.item-title {
font-weight: bold;
}

.item-date {
color: #888;
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

.nav-item.active {
color: #2c3e50; /* 激活时的颜色 */
font-weight: bold; /* 激活时加粗 */
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
