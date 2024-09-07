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

                            <button @click="approve(item.task_id, item.task_type, item.trace_no, item.biz_id,   
                                                    item.lease_approve_type, op_no, item.task_def_id)">审批</button>
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
            pendingItems: [],
            completedItems: [
                { id: 1, title: '已处理项目1', date: '2024-08-01' },
                { id: 2, title: '已处理项目2', date: '2024-08-02' }
            ],
            op_no: null,
        };
    },
    methods: {
        ...mapMutations('approval_my_approvals', ['setActiveTab']),
        approve(task_id, task_type, trace_no, biz_id, lease_approve_type, op_no, task_def_id) {

            // 根据 lease_approve_type 的值来判断要跳转的路由
            if (lease_approve_type === '立项审批') {
                this.$router.push({ name: 'workstation_approval_my-approvals_pending_project-initiation-approval', params: { task_id, task_type, trace_no, biz_id, op_no ,task_def_id} });
            } else if (lease_approve_type === '项目变更审批') {
                console.log("项目变更审批TODO");
            } else if (lease_approve_type === '项目尽调') {
                console.log("项目尽调TODO");
            } else {
                console.log("TODO");
            }
        },
        transfer(id) {
            this.$router.push({ name: 'workstation_approval_my-approvals_pending_transfer', params: { id } });
        },
        async fetchPendingItems() {
            try {
                const { default: api } = await import('@/api/workstation/approval/my-approvals');

                const token = this.$store.getters['auth/token'];
                const refreshToken = this.$store.getters['auth/refreshToken'];
                if (!token || !refreshToken) {
                    console.error('Token or Refresh Token is missing');
                    return;
                }

                this.op_no = "silinjie";

                await api.getSysTaskInfo(
                    {"dynamicQuery":"",
                    "bizMark":"lease_approve_flow",
                    "queryType":"task",
                    "opNo": this.op_no,
                    "pageNo":1,
                    "pageSize":10,
                    "sort":"[]",
                    "tableId":"flowable/taskList",
                    "initQuery":"{\"dynamicQuery\":\"\",\"bizMark\":\"lease_approve_flow\",\"queryType\":\"task\",\"opNo\":\"silinjie\"}"
                    },
                    this.$config,
                    (response) => {
                        if (response && response.code === 0 && response.list && Array.isArray(response.list.records)) {
                            this.pendingItems = response.list.records.map(record => ({
                                id: record.ID,
                                trace_no: record.TRACE_NO,
                                biz_id: record.BIZ_ID,
                                task_def_id: record.TASK_DEF_ID,
                                task_id: record.TASK_ID,
                                task_type: record.TASK_TYPE,
                                lease_approve_type : record.LEASE_APPROVE_TYPE,
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
    width: 100%;  /* 确保页面容器占据整个宽度 */
    box-sizing: border-box; /* 确保内边距不会影响宽度 */
}

.tabs {
    position: fixed;
    display: flex;
    height: 2.5rem;
    width: 100%;
    max-width: 100vw; /* 设置与 card 相同的最大宽度 */
    background-color: #f0f0f0;
    border-bottom: 1px solid #ddd;
    top: 2.5rem;
    z-index: 1000;
    left: 0; /* 确保 tabs 从页面的最左侧开始 */
    margin: 0 auto; /* 居中 */
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
    width: 100%;
    box-sizing: border-box; /* 确保内边距不会影响宽度 */
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
    width: 100%;
    max-width: 100vw; /* 设置与 tabs 相同的最大宽度 */
    box-sizing: border-box; /* 确保内边距不会影响宽度 */
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
    width: 100%;
    box-sizing: border-box; /* 确保内边距不会影响宽度 */
}

.item-title {
    font-weight: bold;
}

.item-date {
    color: #888;
}

</style>

