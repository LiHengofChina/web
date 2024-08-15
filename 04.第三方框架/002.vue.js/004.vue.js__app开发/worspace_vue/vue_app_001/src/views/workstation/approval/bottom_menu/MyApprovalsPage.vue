<template>
    <div class="approval-page">

        <div class="tabs">
            <div class="tab" :class="{ active: activeTab === 'pending' }" @click="setActiveTab('pending')">待处理</div>
            <div class="tab" :class="{ active: activeTab === 'completed' }" @click="setActiveTab('completed')">已处理</div>
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
                            <button @click="viewDetails(item.id)">详情</button>
                            <button @click="transfer(item.id)">转办</button>
                            <button @click="viewHistory(item.id)">历史</button>
                            <button @click="viewDiagram(item.id)">示意图</button>
                            <button @click="approve(item.id)">审批</button>
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
        viewDetails(id) {
            console.log(`查看详情项目ID: ${id}`);
            // Add your logic to view details here
        },
        approve(id) {
            console.log(`审批项目ID: ${id}`);
            // Add your logic to approve here
        },
        viewHistory(id) {
            console.log(`查看历史项目ID: ${id}`);
            // Add your logic to view history here
        },
        viewDiagram(id) {
            console.log(`查看示意图项目ID: ${id}`);
            // Add your logic to view the complete approval diagram here
        },
        transfer(id) {
            console.log(`转办项目ID: ${id}`);
            // Add your logic to transfer here
        },
        async fetchPendingItems() {
            try {
                const { default: api } = await import(/* webpackChunkName: "workstation-approval-my-approvals-api" */ '@/api/workstation/approval/my-approvals');

                const token = this.$store.getters['auth/token'];
                const refreshToken = this.$store.getters['auth/refreshToken'];
                if (!token || !refreshToken) {
                    console.error('Token or Refresh Token is missing');
                    return;
                }

                await api.getSysTaskInfo(
                    {"dynamicQuery":"",
                    "bizMark":"lease_approve_flow",
                    "queryType":"task",
                    "opNo":"xuebeibei",
                    "pageNo":1,
                    "pageSize":10,
                    "sort":"[]",
                    "tableId":"flowable/taskList",
                    "initQuery":"{\"dynamicQuery\":\"\",\"bizMark\":\"lease_approve_flow\",\"queryType\":\"task\",\"opNo\":\"xuebeibei\"}"
                    },
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
        this.fetchPendingItems();
    },
    watch: {
        activeTab(newTab) {
            if (newTab === 'pending') {
                this.fetchPendingItems();
            }
        }
    },
};
</script>


<style scoped>
.approval-page {
    padding-top: 0rem; 
}

.tabs {
    display: flex;
    height: 2.5rem;
    width: 100%;
    background-color: #f0f0f0;
    border-bottom: 1px solid #ddd;
    top: 2.5rem;
    z-index: 1000;
}

.tab {
    flex: 1;
    text-align: center;
    padding: 0.5rem 0;
    cursor: pointer;
    color: #333;
    font-size: 1.2rem;
    font-weight: normal;
}

.tab.active {
    color: #2c3e50;
    border-bottom: 2px solid #2c3e50;
    font-weight: bold;
    background-color: #d9d9d9;
}

.content {
    flex: 1;
    padding: 1rem;
    padding-top: 1rem;
    overflow-y: scroll;
    height: calc(100vh - 6rem);
    scrollbar-width: none;
    -ms-overflow-style: none;
}

.content::-webkit-scrollbar {
    display: none;
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
    flex-wrap: wrap;
}

.card-actions button {
    flex: 1 0 45%;
    margin: 0.25rem;
    padding: 0.5rem 0;
    border: none;
    background-color: #2c3e50;
    color: #fff;
    border-radius: 0.25rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
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

