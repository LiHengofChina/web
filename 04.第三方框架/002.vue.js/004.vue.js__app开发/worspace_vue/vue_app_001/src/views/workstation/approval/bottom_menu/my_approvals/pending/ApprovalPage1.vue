<template>
    <div class="page-layout">
        <!-- Header Section -->
        <div class="header">
            <i class="fas fa-chevron-left back-icon" @click="goBack"></i>
            <h1 class="title">审批展示方案一</h1>
            <div class="spacer"></div>
        </div>

        <!-- Tabs Section -->
        <div class="tabs">
            <div class="tab" :class="{ active: activeTab === 'details' }" @click="setActiveTab('details')">详情</div>
            <div class="tab" :class="{ active: activeTab === 'history' }" @click="setActiveTab('history')">审批历史</div>
            <div class="tab" :class="{ active: activeTab === 'document' }" @click="setActiveTab('document')">资料</div>
        </div>

        <!-- Scrollable Content Area -->
        <div class="content">
            <div v-if="activeTab === 'details'">
                <p>详情内容...</p>
            </div>
            <div v-else-if="activeTab === 'history'">
                <div class="timeline">
                    <div v-for="(timeline, index) in timeLineData" :key="index" class="timeline-item">
                        <div class="timeline-header">
                            <div class="taskName">{{ getTaskName(timeline) }}</div>
                            <div class="taskTime">{{ timeline.CREATE_TIME }}</div>
                        </div>

                        

                        <div class="timeline-card">
                            <div class="timeline-body">
                                <div class="approve-type-duration">
                                    <div class="approveType">{{ timeline.APPROVE_TYPE }}</div>
                                    <div class="duration">耗时：{{ timeline.DURATION }}</div>
                                </div>
                            
                                <div class="approveIdea">{{ resApproveIdea(timeline.APPROVE_IDEA) }}</div>
                            
                                <div class="assignee-end-time">
                                    <span class="assignee">处理人：{{ timeline.ASSIGNEE_NAME }}</span>
                                    <span class="endTime"><i class="fas fa-clock"></i> {{ timeline.END_TIME }}</span>
                                </div>
                            </div>
                            
                        </div>
                        
                        


                    </div>
                </div>                
            </div>
            <div v-else-if="activeTab === 'document'">
                <p>文档内容...</p>
            </div>
        </div>

        <!-- Approval Description and Opinion Type fixed at bottom -->
        <div class="form-section">
            <label for="opinion-type"><span class="required">*</span> 意见类型</label>
            <div class="select-fake" @click="openModal">{{ opinionType || '请选择' }}</div>
            <label for="approval-description"><span class="required">*</span> 审批说明</label>
            <textarea id="approval-description" v-model="approvalDescription" rows="2" maxlength="500"></textarea>
        </div>

        <!-- Modal Overlay -->
        <div v-if="showModal" class="modal-overlay" @click="closeModal"></div>

        <!-- Modal Content -->
        <div v-if="showModal" class="modal-content">
            <div class="modal-item" v-for="option in opinionOptions" :key="option" @click="selectOption(option)">
                {{ option }}
            </div>
            <div class="modal-item cancel" @click="closeModal">取消</div>
        </div>

        <!-- Action Buttons Section -->
        <div class="actions">
            <button class="submit-btn" @click="submitApproval">提交</button>
            <button class="cancel-btn" @click="closeApproval">关闭</button>
        </div>
    </div>
</template>


<script>
export default {
    name: 'ApprovalPage1',
    data() {
        return {
            activeTab: 'details',
            approvalDescription: '',
            opinionType: '',
            showModal: false, // 控制弹出层显示
            opinionOptions: ['同意', '返回补充资料', '否决'], // 可选的意见类型
            timeLineData: [], // 用于存储审批历史的数据
        };
    },
    methods: {
        goBack() {
            this.$router.go(-1);
        },
        setActiveTab(tab) {
            this.activeTab = tab;
            if (tab === 'history') {
                this.loadTimeLineData(); // 切换到审批历史标签时加载数据
            }
        },
        submitApproval() {
            // 提交逻辑
        },
        closeApproval() {
            // 取消逻辑
        },
        openModal() {
            this.showModal = true; // 显示弹出层
        },
        closeModal() {
            this.showModal = false; // 隐藏弹出层
        },
        selectOption(option) {
            this.opinionType = option; // 选择选项
            this.closeModal(); // 关闭弹出层
        },
        loadTimeLineData() {
            // 模拟获取审批历史数据的API调用
            this.timeLineData = [
                {
                    TASK_NAME: '市场运营部门负责人',
                    CREATE_TIME: '2024-08-28 16:44:05',
                    APPROVE_TYPE: '同意',
                    APPROVE_IDEA: '审批意见内容',
                    DURATION: '0天0小时0分46秒',
                    ASSIGNEE_NAME: '张三1',
                    dotcolor: '#1EC5B5',
                    END_TIME: "2024-08-28 16:44:52",
                },
                {
                    TASK_NAME: '市场运营部分管领导',
                    CREATE_TIME: '2024-08-28 16:48:30',
                    APPROVE_TYPE: '同意',
                    APPROVE_IDEA: '审批意见内容',
                    DURATION: '0天0小时3分38秒',
                    ASSIGNEE_NAME: '李四2',
                    dotcolor: '#1EC5B5',
                    END_TIME: "2024-08-28 16:44:52",
                },
                {
                    TASK_NAME: '市场运营部分管领导',
                    CREATE_TIME: '2024-08-28 16:48:30',
                    APPROVE_TYPE: '同意',
                    APPROVE_IDEA: '审批意见内容',
                    DURATION: '0天0小时3分38秒',
                    ASSIGNEE_NAME: '李四3',
                    dotcolor: '#1EC5B5',
                    END_TIME: "2024-08-28 16:44:52",
                },
                {
                    TASK_NAME: '市场运营部分管领导',
                    CREATE_TIME: '2024-08-28 16:48:30',
                    APPROVE_TYPE: '同意',
                    APPROVE_IDEA: '审批意见内容',
                    DURATION: '0天0小时3分38秒',
                    ASSIGNEE_NAME: '李四4',
                    dotcolor: '#1EC5B5',
                    END_TIME: "2024-08-28 16:44:52",
                },
                {
                    TASK_NAME: '市场运营部分管领导',
                    CREATE_TIME: '2024-08-28 16:48:30',
                    APPROVE_TYPE: '同意',
                    APPROVE_IDEA: '审批意见内容',
                    DURATION: '0天0小时3分38秒',
                    ASSIGNEE_NAME: '李四5',
                    dotcolor: '#1EC5B5',
                    END_TIME: "2024-08-28 16:44:52",
                },
                {
                    TASK_NAME: '市场运营部分管领导',
                    CREATE_TIME: '2024-08-28 16:48:30',
                    APPROVE_TYPE: '同意',
                    APPROVE_IDEA: '审批意见内容',
                    DURATION: '0天0小时3分38秒',
                    ASSIGNEE_NAME: '李四6',
                    dotcolor: '#1EC5B5',
                    END_TIME: "2024-08-28 16:44:52",
                },                                                                
            ];
        },
        getTaskName(timeline) {
            return timeline.TASK_NAME;
        },
        resApproveIdea(idea) {
            return idea || '无审批意见';
        },
    }
};
</script>

<style scoped>
.page-layout {
    display: flex;
    flex-direction: column;
    width: 100vw; /* 确保页面宽度填满视口 */
    max-width: 100%; /* 限制最大宽度，防止超出视口 */
    height: 100vh;
    overflow: hidden;
    box-sizing: border-box; /* 确保内边距和边框不会导致布局超出 */
}

.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 2.5rem;
    background-color: #f0f0f0;
    border-bottom: 1px solid #ddd;
    z-index: 1000;
    padding: 0 1rem;
    box-sizing: border-box;
}

.back-icon {
    cursor: pointer;
    font-size: 1.2rem;
    color: #333;
}

.title {
    flex: 1;
    text-align: center;
    font-size: 1.2rem;
    margin: 0;
}

.spacer {
    width: 2.8rem;
}

.tabs {
    display: flex;
    height: 2.5rem;
    width: 100%;
    max-width: 100%;
    background-color: #f0f0f0;
    border-bottom: 1px solid #ddd;
    top: 2.5rem;
    position: fixed;
    z-index: 1000;
    left: 0;
    right: 0;
    box-sizing: border-box;
}

.tab {
    flex: 1;
    text-align: center;
    padding: 0.5rem 0;
    cursor: pointer;
    color: #333;
    font-size: 1rem;
    border-right: 1px solid #ddd;
    box-sizing: border-box;
}

.tab.active {
    background-color: #d9d9d9;
    font-weight: bold;
    color: #2c3e50;
    border-bottom: 2px solid #2c3e50;
}


.content {
    flex: 1;
    padding: 1rem;
    margin-top: 5rem;
    overflow-y: auto;
    overflow-x: hidden;
    height: calc(100vh - 11rem); /* 调整内容区域的高度以适应固定表单和按钮 */
    box-sizing: border-box;
    padding-bottom: 15rem; /* 为底部留出空间，防止内容被覆盖 */
}





.form-section {
    padding: 1rem;
    background-color: #f9f9f9;
    border-top: 1px solid #ddd;
    position: fixed;
    bottom: 2.5rem; /* 与按钮区域的间距 */
    left: 0;
    right: 0;
    box-sizing: border-box;
}

.form-section label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: bold;
    text-align: left; /* 标签文本居左对齐 */
}

.form-section textarea,
.form-section select {
    width: 100%; /* 确保宽度填满可用空间 */
    max-width: 100%; /* 确保不会超出父容器宽度 */
    padding: 0.5rem;
    margin-bottom: 1rem;
    border: 1px solid #ddd;
    border-radius: 0.25rem;
    transition: border-color 0.3s ease;
    box-sizing: border-box;
    appearance: none; /* 移除默认下拉箭头样式以便自定义 */
}

.form-section textarea:focus,
.form-section select:focus {
    border-color: #007BFF;
    outline: none;
}

.actions {
    display: flex;
    justify-content: space-around;
    padding: 0.5rem;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    background-color: #f0f0f0;
    border-top: 1px solid #ddd;
    box-sizing: border-box;
}

.actions button {
    flex: 1;
    margin: 0 0.5rem;
    padding: 0.5rem;
    background-color: #2c3e50;
    color: #fff;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
    box-sizing: border-box;
}

.actions button:hover {
    background-color: #1a252f;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5); /* 半透明黑色背景 */
    z-index: 1001; /* 保证遮罩层在内容之上 */
}

.modal-content {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #fff;
    border-top-left-radius: 10px; /* 圆角 */
    border-top-right-radius: 10px;
    padding: 1rem;
    z-index: 1002; /* 保证内容在遮罩层之上 */
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.2); /* 阴影效果 */
    transition: transform 0.3s ease; /* 添加过渡效果 */
}

.modal-item {
    padding: 0.75rem 0;
    text-align: center;
    cursor: pointer;
    border-bottom: 1px solid #ddd; /* 每个选项之间的分隔线 */
}

.modal-item.cancel {
    /* color: red; 取消按钮的特殊颜色 */
    font-weight: bold;
}

.select-fake {
    width: 100%; /* 填满可用宽度 */
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 0.25rem;
    text-align: left; /* 文本左对齐 */
    position: relative;
    cursor: pointer;
    box-sizing: border-box;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.select-fake::after {
    content: '▼'; /* 向下箭头 */
    font-size: 0.8rem;
    color: #333;
    position: absolute;
    right: 1rem; /* 确保箭头在右侧 */
}

.required {
    color: red; /* 使 * 号变成红色 */
    margin-right: 0.25rem; /* 为 * 号和文本之间添加一些间距 */
}


/* Timeline container */
.timeline {
    position: relative;
    margin-left: 0rem; /* 给时间轴留出空间 */
    padding-left: 0rem; /* 给时间轴留出空间 */
}



/* Timeline item */
.timeline-item {
    position: relative;
    padding-left: 1.5rem;
    margin-bottom: 2rem;
}


.timeline::before {
    content: '';
    position: absolute;
    top: 0.625rem; /* 从第一个圆圈的顶部开始 */
    bottom: 11.625rem; /* 在最后一个圆圈的底部结束 11 + 0.625 */
    left: 0rem; /* 竖线的位置 */
    width: 2px;
    background-color: #ddd; /* 灰色竖线颜色 */
}




/* Timeline dot */
.timeline-item::before {
    content: '';
    position: absolute;
    left: -0.26rem; /* 这个值可能需要微调来匹配你的布局 */
    top: 0.5rem; /* 通过调整这个值来确保圆圈与taskName文字垂直对齐 */
    width: 0.625rem;
    height: 0.625rem;
    background-color: #ddd; /* 圆点颜色 */
    border-radius: 50%;
}



/* Timeline header styles */
.timeline-header {
    padding-left: 0.5rem; /* 使标题与圆圈对齐 */    
    display: flex;
    flex-direction: column;
    align-items: flex-start; /* 左对齐 */
    justify-content: space-between;
    font-weight: bold;
    color: #333;
    margin-bottom: 5px;
    padding-bottom: 5px;
    padding-left: 0px;
}


/* New styles for the timeline card */
.timeline-card {
    border: 1px solid #ddd;
    padding: 15px;
    margin-bottom: 15px;
    border-radius: 8px;
    background-color: #fff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.taskName {
    font-weight: bold;
    color: #909399;
    font-size: 1rem;
    margin-bottom: 4px;
}

.taskTime {
    color: #909399;
    font-size: 0.8rem;
    font-weight: normal;
}





.timeline-body {
    padding-left: 10px;
    font-size: 14px;
    color: #666;
    display: flex;
    flex-direction: column; /* 改为列方向 */
    align-items: center; /* 中心对齐 */
}
.assignee-end-time {
    display: flex;
    justify-content: flex-end; /* 右对齐 */
    width: 100%; /* 占满容器宽度 */
    margin-top: 10px; /* 添加适当的间距 */
    flex-direction: column; /* 垂直排列 */
    align-items: flex-end; /* 向右对齐 */
}


.approveType {
    font-weight: bold;
    color: #1EC5B5; /* 审批类型颜色 */
}




.approveIdea {
    color: #ff9800; /* 审批意见颜色 */
    margin-bottom: 5px;
    text-align: center; /* 居中对齐 */
    border-bottom: 1px solid #ddd; /* 添加下方的横线 */
    padding-bottom: 5px; /* 添加一些内边距，以便横线和文字之间有间距 */
    margin-top: 1.5rem; /* 添加上边距以增加空行 */
    width: 100%; /* 占满容器宽度 */
}



.duration {
    font-size: 0.9em;
    color: #909399;
    text-align: right; /* 右对齐 */
}

.approve-type-duration {
    display: flex;
    justify-content: space-between; /* 左右对齐 */
    width: 100%; /* 占满容器宽度 */
    margin-bottom: 5px;
}

.end-time-assignee {
    display: flex;
    justify-content: space-between; /* 左右对齐 */
    margin-top: 10px; /* 添加适当的间距 */
}

 

.endTime, .assignee {
    color: #909399;
    font-size: 0.8rem;
}


</style>
