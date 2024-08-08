<template>

    <div class="approval-page">
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
    </div>
</template>

<script>
export default {
    name: 'MyApprovalsPage',
    data() {
        return {
        pendingItems: [],
        };
    },
    methods: {
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
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
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

</style>
