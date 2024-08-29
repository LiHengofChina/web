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

        <!-- Action Buttons Section -->
        <div class="actions">
            <button class="approve-btn">同意/拒绝</button>
            <button class="comment-btn">同意，没有问题。</button>
            <button class="submit-btn">提交</button>
            <button class="cancel-btn">取消</button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ApprovalPage1',
    data() {
        return {
            activeTab: 'details'
        };
    },
    methods: {
        goBack() {
            this.$router.go(-1);
        },
        setActiveTab(tab) {
            this.activeTab = tab;
        }
    }
};
</script>

<style scoped>
.page-layout {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
}

.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 2.5rem;
    background-color: #f0f0f0;
    border-bottom: 1px solid #ddd;
    z-index: 1000;
    padding: 0 1rem;
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
    background-color: #f0f0f0;
    border-bottom: 1px solid #ddd;
    top: 2.5rem;
    position: fixed;
    z-index: 1000;
    left: 0;
}

.tab {
    flex: 1;
    text-align: center;
    padding: 0.5rem 0;
    cursor: pointer;
    color: #333;
    font-size: 1rem;
    border-right: 1px solid #ddd;
}

.tab.active {
    background-color: #d9d9d9;
    font-weight: bold;
    color: #2c3e50;
}

.content {
    flex: 1;
    padding: 1rem;
    margin-top: 5rem;
    overflow-y: auto;
    height: calc(100vh - 9rem);
}

.actions {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 1rem;
    position: fixed;
    bottom: 0;
    width: 100%;
    background-color: #f0f0f0;
    border-top: 1px solid #ddd;
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
}

.actions button:hover {
    background-color: #1a252f;
}
</style>
