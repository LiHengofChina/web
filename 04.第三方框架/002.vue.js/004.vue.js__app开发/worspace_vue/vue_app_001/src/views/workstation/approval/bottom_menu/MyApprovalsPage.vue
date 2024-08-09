<template>
    <div class="approval-page">

        <div class="tabs">
            <div class="tab" :class="{ active: activeTab === 'pending' }" @click="setActiveTab('pending')">待处理</div>
            <div class="tab" :class="{ active: activeTab === 'completed' }" @click="setActiveTab('completed')">已处理</div>
        </div>

        <div class="contentx">
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
    </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
    name: 'MyApprovalsPage',
    computed: {
        ...mapState('approval_my_approvals', ['activeTab']),
    },
    data() {
        return {
            pendingItems: [
                { id: 1, type: '待处理项目1', position: '职位1', customerName: '客户A', approver: '审批人1' },
                { id: 2, type: '待处理项目2', position: '职位2', customerName: '客户B', approver: '审批人2' },
                { id: 3, type: '待处理项目3', position: '职位3', customerName: '客户C', approver: '审批人3' },
                { id: 4, type: '待处理项目4', position: '职位4', customerName: '客户D', approver: '审批人4' },
                { id: 5, type: '待处理项目5', position: '职位5', customerName: '客户E', approver: '审批人5' }
            ],
            completedItems: [
                { id: 1, title: '已处理项目1', date: '2024-08-01' },
                { id: 2, title: '已处理项目2', date: '2024-08-02' }
            ]
        };
    },
    methods: {
        ...mapMutations('approval_my_approvals', ['setActiveTab']),
        approve(id) {
            console.log(`审批项目ID: ${id}`);
        },
        transfer(id) {
            console.log(`转办项目ID: ${id}`);
        },
        async fetchPendingItems() {
            console.log("-----------xxx");
        },
    },
    created() {
        this.fetchPendingItems();
    },
};
</script>

<style scoped>
.approval-page {

    /* background-color: #f0f0f0; 设置背景颜色 */
    padding-top: 0rem; 
}


.tabs {
    display: flex;
    height: 2.5rem;
    width: 100%;
    background-color: #f0f0f0;
    border-bottom: 1px solid #ddd;
    top: 2.5rem; /* 确保在 header 下面 */
    z-index: 1000; /* 保证在内容上层 */
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
    background-color: #d9d9d9; /* 激活时的背景颜色 */
}



.contentx {
    flex: 1;
    padding: 1rem;
    padding-top: 1rem; /* 确保内容不被 tabs 覆盖 */
    overflow-y: scroll; /* 允许上下滚动 */
    height: calc(100vh - 6rem); /* 设置高度，确保能够滚动 */
    scrollbar-width: none; /* 对 Firefox 有效 */
    -ms-overflow-style: none;  /* 对 Internet Explorer 和 Edge 有效 */
}

.contentx::-webkit-scrollbar {
    display: none; /* 对 Webkit 浏览器（如 Chrome 和 Safari）有效 */
}


.card {
    background-color: #fff;
    margin-bottom: 1rem;
    border-radius: 0.5rem;
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

</style>
