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
            <div class="tab" :class="{ active: activeTab === 'document' }" @click="setActiveTab('document')">文档</div>
            <div class="tab" :class="{ active: activeTab === 'history' }" @click="setActiveTab('history')">审批历史</div>
        </div>

        <!-- Scrollable Content Area -->
        <div class="content">
            <div v-if="activeTab === 'details'">
                <p>详情内容...</p>
            </div>
            <div v-else-if="activeTab === 'document'">
                <p>文档内容...</p>
            </div>
            <div v-else-if="activeTab === 'history'">
                <p>审批历史内容...</p>
            </div>
        </div>

        <!-- Approval Description and Opinion Type fixed at bottom -->
        <div class="form-section">
            <label for="approval-description">* 审批说明</label>
            <textarea id="approval-description" v-model="approvalDescription" rows="4" maxlength="500"></textarea>

            <label for="opinion-type">* 意见类型</label>
            <select id="opinion-type" v-model="opinionType">
                <option value="" disabled>请选择</option>
                <option value="同意">同意</option>
                <option value="返回补充资料">返回补充资料</option>
                <option value="否决">否决</option>
            </select>
        </div>

        <!-- Action Buttons Section -->
        <div class="actions">
            <button class="submit-btn" @click="submitApproval">提交</button>
            <button class="cancel-btn" @click="cancelApproval">取消</button>
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
            opinionType: ''
        };
    },
    methods: {
        goBack() {
            this.$router.go(-1);
        },
        setActiveTab(tab) {
            this.activeTab = tab;
        },
        submitApproval() {
            // 提交逻辑
        },
        cancelApproval() {
            // 取消逻辑
        }
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
}

.form-section {
    padding: 1rem;
    background-color: #f9f9f9;
    border-top: 1px solid #ddd;
    position: fixed;
    bottom: 3rem; /* 与按钮区域的间距 */
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

</style>
