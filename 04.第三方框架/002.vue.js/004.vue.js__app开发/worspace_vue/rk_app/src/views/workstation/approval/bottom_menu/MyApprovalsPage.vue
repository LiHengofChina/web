<template>
    <div class="approval-page">
        <div class="tabs">
            <div class="tab" :class="{ active: activeTab === 'pending' }" @click="setActiveTab('pending')">待处理</div>
            <div class="tab" :class="{ active: activeTab === 'completed' }" @click="setActiveTab('completed')">已处理</div>
        </div>

        <div class="content">


            <!-- 未处理 -->
            <div v-if="activeTab === 'pending'">
                <div v-for="item in pendingItems" :key="item.id" class="card">
                    <div class="card-content">
                        <div class="card-header">{{ item.approve_title }} - {{ item.position }}</div>
                        <div class="card-body">
                            <p>客户: {{ item.customerName }}</p>
                            <p>审批人: {{ item.approver }}</p>
                        </div>
                        <div class="card-actions">

                            <button @click="approve(item.task_id, item.trace_no, item.biz_id,   
                                                    op_no, item.task_def_id, item.approve_title)">审批</button>
                            <button @click="transfer(item.id)">转办</button>

                        </div>
                    </div>
                </div>
            </div>

            <!-- 已处理 -->
            <div v-else-if="activeTab === 'completed'">
                <div v-for="item in completedItems" :key="item.id" class="card">
                    <div class="card-content">
                        <div class="card-header">{{ item.approve_title }} - {{ item.position }}</div>
                        <div class="card-body">
                            <p>客户: {{ item.customerName }}</p>
                            <p>审批人: {{ item.approver }}</p>
                        </div>
                        <div class="card-actions">

                            <button @click="query(item.task_id, item.trace_no, item.biz_id,   
                                                    op_no, item.task_def_id, item.approve_title)">详情</button>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import { mapState, mapMutations, mapActions } from 'vuex';



export default {
    name: 'MyApprovalsPage',
    computed: {
        ...mapState('approval_my_approvals', ['activeTab']),
    },
    data() {
        return {

            //未处理
            pendingItems: [],
            taskType:'lease_approve_flow',

            //已经处理
            completedItems: [],
            op_no: null,
        };
    },
    methods: {
        ...mapMutations('approval_my_approvals', ['setActiveTab']),
        ...mapMutations('approval_common_store', ['setCommonActiveTab']),
        ...mapActions('approval_common_store', [
            'updateQueryTaskType'
        ]),

        /**
         * 点击“审批”
         */
        approve(task_id, trace_no, biz_id, op_no, task_def_id, approve_title) {

            this.updateQueryTaskType(0);
            //======================================== 租赁
            if (approve_title === '立项审批') {
                this.setCommonActiveTab('details'); 
                this.$router.push({ name: 'workstation_approval_my-approvals_pending_lease_beforehand_approval', params: { task_id, trace_no, biz_id, op_no ,task_def_id, approve_title} });

            } else if (approve_title === '项目尽调') {
                this.setCommonActiveTab('details'); 
                this.$router.push({ name: 'workstation_approval_my-approvals_pending_lease_project_investigation_approve', params: { task_id, trace_no, biz_id, op_no ,task_def_id, approve_title} });

            } else if(approve_title === '合同申请审批'){
                this.setCommonActiveTab('details'); 
                this.$router.push({ name: 'workstation_approval_my-approvals_pending_lease_contract-approval-page', params: { task_id, trace_no, biz_id, op_no ,task_def_id, approve_title} });

            }else if (this.taskType==='lease_approve_flow'&&approve_title === '放款审批') {
                this.setCommonActiveTab('details'); 
                this.$router.push({ name: 'workstation_approval_my-approvals_pending_lease_putout_approval-page', params: { task_id, trace_no, biz_id, op_no ,task_def_id, approve_title} });


            //======================================== 委贷
            } else if (approve_title === '业务审批') {
                this.setCommonActiveTab('details'); 
                this.$router.push({ name: 'workstation_approval_my-approvals_pending_loan_apply_approval', params: { task_id, trace_no, biz_id, op_no ,task_def_id, approve_title} });

            } else if (approve_title === '合同审批') {
                this.setCommonActiveTab('details'); 
                this.$router.push({ name: 'workstation_approval_my-approvals_pending_loan_contract_sign_approval', params: { task_id, trace_no, biz_id, op_no ,task_def_id, approve_title} });

            } else if (approve_title === '项目支付审批') {

                this.setCommonActiveTab('details'); 
                this.$router.push({ name: 'workstation_approval_my-approvals_pending_loan_putoutConfirm', params: { task_id, trace_no, biz_id, op_no ,task_def_id, approve_title} });

            }else if (this.taskType==='loan_approve_flow'&&approve_title === '放款审批') {
                this.setCommonActiveTab('details'); 
                console.log('放款审批-------------------');
                this.$router.push({ name: 'workstation_approval_my-approvals_pending_loan_putoutAppoval', params: { task_id, trace_no, biz_id, op_no ,task_def_id, approve_title} });

            } else if (approve_title === '提前还款审批') {

                this.setCommonActiveTab('details'); 
                this.$router.push({ name: 'workstation_approval_my-approvals_pending_loan_loanAfter', params: { task_id, trace_no, biz_id, op_no ,task_def_id, approve_title} });

            }else {
                console.log(approve_title);
            }
        },


        /**
         * 点击“查询”
         */
        query(task_id, trace_no, biz_id, op_no, task_def_id, approve_title) {

            this.updateQueryTaskType(1);

            //======================================== 租赁
            if (approve_title === '立项审批') {
                this.setCommonActiveTab('details'); 
                this.$router.push({ name: 'workstation_approval_my-approvals_pending_lease_beforehand_approval', params: { task_id, trace_no, biz_id, op_no ,task_def_id, approve_title} });

            } else if (approve_title === '项目尽调') {
                this.setCommonActiveTab('details'); 
                this.$router.push({ name: 'workstation_approval_my-approvals_pending_lease_project_investigation_approve', params: { task_id, trace_no, biz_id, op_no ,task_def_id, approve_title} });

            } else if(approve_title === '合同申请审批'){
                this.setCommonActiveTab('details'); 
                this.$router.push({ name: 'workstation_approval_my-approvals_pending_lease_contract-approval-page', params: { task_id, trace_no, biz_id, op_no ,task_def_id, approve_title} });

            }else if (this.taskType==='lease_approve_flow'&&approve_title === '放款审批') {
                this.setCommonActiveTab('details'); 
                this.$router.push({ name: 'workstation_approval_my-approvals_pending_lease_putout_approval-page', params: { task_id, trace_no, biz_id, op_no ,task_def_id, approve_title} });


            //======================================== 委贷
            } else if (approve_title === '业务审批') {
                this.setCommonActiveTab('details'); 
                this.$router.push({ name: 'workstation_approval_my-approvals_pending_loan_apply_approval', params: { task_id, trace_no, biz_id, op_no ,task_def_id, approve_title} });

            } else if (approve_title === '合同审批') {
                this.setCommonActiveTab('details'); 
                this.$router.push({ name: 'workstation_approval_my-approvals_pending_loan_contract_sign_approval', params: { task_id, trace_no, biz_id, op_no ,task_def_id, approve_title} });

            } else if (approve_title === '项目支付审批') {

                this.setCommonActiveTab('details'); 
                this.$router.push({ name: 'workstation_approval_my-approvals_pending_loan_putoutConfirm', params: { task_id, trace_no, biz_id, op_no ,task_def_id, approve_title} });

            }else if (this.taskType==='loan_approve_flow'&&approve_title === '放款审批') {
                this.setCommonActiveTab('details'); 
                console.log('放款审批-------------------');
                this.$router.push({ name: 'workstation_approval_my-approvals_pending_loan_putoutAppoval', params: { task_id, trace_no, biz_id, op_no ,task_def_id, approve_title} });

            } else if (approve_title === '提前还款审批') {

                this.setCommonActiveTab('details'); 
                this.$router.push({ name: 'workstation_approval_my-approvals_pending_loan_loanAfter', params: { task_id, trace_no, biz_id, op_no ,task_def_id, approve_title} });
            }else {
                console.log(approve_title);
            }

        },
        
        transfer(id) {
            this.$router.push({ name: 'workstation_approval_my-approvals_pending_transfer', params: { id } });
        },
        getBizList(){
            console.log('当前标签页'+this.activeTab);
            return import('@/api/workstation/approval/flowable/flowable_api')
                .then(({ default: api }) => {
                    return new Promise((resolve, reject) => {
                        api.getBizList(
                            {
                                opNo:this.$store.getters['auth/user'].opNo,
                                type:this.activeTab === 'pending'?'unfinished':'finished'
                            },
                            this.$config,
                            response => {
                                if (response && response.code === 0 && response.countList) {
                                    //处理当前租赁还是审批
                                    this.taskType=response.countList.lease_approve_flow==='0'?'loan_approve_flow':'lease_approve_flow';
                                    resolve(this.taskType);
                                } else {
                                    reject('Unexpected API response or empty task list');
                                }
                            },
                            () => {
                                reject('Approved or other errors!');
                            }
                        );
                    });
                }).catch(() => {
                    console.error('Failed to fetch pending items:');
                });

        },

        /***
         * 查询：处理的审批
         */
        async fetchCompletedItems() {
            try {
                const { default: api } = await import('@/api/workstation/approval/flowable/flowable_api');
                this.op_no = this.$store.getters['auth/user'].opNo;
                this.getBizList().then(taskType=>{
                    api.getSysTaskInfo(
                    {"dynamicQuery":"",
                    "bizMark":taskType,
                    "queryType":"hisTask",
                    "opNo": this.op_no,
                    "pageNo":1,
                    "pageSize":10,
                    "sort":"[]",
                    "tableId":"flowable/taskList",
                    "initQuery":"{'dynamicQuery': '', 'bizMark': '"+taskType+"', 'queryType': 'hisTask','opNo': '" + this.op_no + "'}"
                    },
                    this.$config,
                    (response) => {
                        if (response && response.code === 0 && response.list && Array.isArray(response.list.records)) {
                            this.completedItems = response.list.records.map(record => ({
                                id: record.ID,
                                trace_no: record.TRACE_NO,
                                biz_id: record.BIZ_ID,
                                task_def_id: record.TASK_DEF_ID,
                                task_id: record.TASK_ID,
                                approve_title: record.APPROVE_TITLE || '未知审批',
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


                }).catch(error=>{
                    console.error('API Error:', error);
                });
                // loan_approve_flow  lease_approve_flow
            } catch (error) {
                console.error('Failed to fetch pending items:', error);
            }
        },

        /**
         * 查询：未处理的审批
         */
        async fetchPendingItems() {
            try {
                const { default: api } = await import('@/api/workstation/approval/flowable/flowable_api');
                this.op_no = this.$store.getters['auth/user'].opNo;
                this.getBizList().then(taskType=>{
                    api.getSysTaskInfo(
                    {"dynamicQuery":"",
                    "bizMark":taskType,
                    "queryType":"task",
                    "opNo": this.op_no,
                    "pageNo":1,
                    "pageSize":10,
                    "sort":"[]",
                    "tableId":"flowable/taskList",
                    "initQuery":"{'dynamicQuery': '', 'bizMark': '"+taskType+"', 'queryType': 'task','opNo': '" + this.op_no + "'}"
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
                                approve_title: record.APPROVE_TITLE || '未知审批',
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


                }).catch(error=>{
                    console.error('API Error:', error);
                });
                // loan_approve_flow  lease_approve_flow
            } catch (error) {
                console.error('Failed to fetch pending items:', error);
            }
        },
    },
    created() {
        this.fetchPendingItems();

        this.fetchCompletedItems();
    },
    watch: {
        activeTab(newTab) {
            if (newTab === 'pending') {
                this.fetchPendingItems();
            }else if(newTab === 'completed'){
                this.fetchCompletedItems();
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

