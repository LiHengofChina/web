
<template>
    <div v-if="userSelectVisible" class="modal-overlay" @click="closeUserSelect"></div>
    <transition name="slide-up">
        <div v-if="userSelectVisible" class="user-select-modal-panel" @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd">
            <!-- 弹窗头部 -->
            <div class="modal-header">
                <div class="modal-title">
                    选择审批人
                </div>
            </div>

            <!-- 审批人表格 -->
            <div class="modal-content">
                <el-table 
                    :data="assignList" 
                    style="width: 100%" 
                    height="50vh"
                    @selection-change="handleSelectionChange">
                    <el-table-column type="selection"></el-table-column>
                    <el-table-column prop="opNo" label="编号"></el-table-column>
                    <el-table-column prop="opName" label="姓名"></el-table-column>
                    <el-table-column prop="brName" label="机构"></el-table-column>
                </el-table>
            </div>

            <!-- 弹窗底部按钮 -->
            <div class="modal-footer">
                <div class="modal-spacer-div"></div>
                <div class="modal-spacer-div"></div>
                <button class="modal-cancel-button" @click="closeUserSelect">取 消</button>
                <button class="modal-confirm-button" @click="handleApproveByUser">确 定</button>
            </div>

        </div>
    </transition>
</template>

<script>

import { mapGetters, mapActions } from 'vuex';

export default {
    name: 'UserSelectModal',
    emits: ['approveByUser'], // 声明该组件会发出哪些事件
    computed: {
        ...mapGetters('approval_common_store', [
            'userSelectVisible',

            'pageNo',
            'totalCount',
            'assignList'

        ]),
    },
    methods: {
        ...mapActions('approval_common_store', [
            'updateShowOpinionPanel',

            'updatePageNo',

            'getNextUserList',

            'updateActiveUserList',

        ]),
        handleSelectionChange(selectedRows) {
            const selectedUserList = selectedRows.map(row => row.opNo);
            this.updateActiveUserList(selectedUserList);
        },

        handleApproveByUser() {
            this.$emit('approveByUser');
        },
        loadMoreData() {
            // 检查是否有更多数据需要加载
            if (this.assignList.length < this.totalCount) {
                this.updatePageNo(this.pageNo + 1);
                this.getNextUserList();
                console.log("滑动加载");
            } else {
                console.log("没有更多数据了");
            }
        },

        handleTouchStart(event) {
            this.touchStartY = event.touches[0].clientY;
        },
        handleTouchMove(event) {
            this.touchEndY = event.touches[0].clientY;
        },
        handleTouchEnd(event) {

            this.touchEndY = event.changedTouches[0].clientY;

            if (this.touchStartY - this.touchEndY > 50) {
                // 向上滑动 - 加载更多
                this.loadMoreData(); 
            } else if (this.touchEndY - this.touchStartY > 50) {
                // 向下滑动 - 
                console.log('向下滑动');
            }
            // 重置 touchStartY 和 touchEndY
            this.touchStartY = 0;
            this.touchEndY = 0;

        }, 
        closeUserSelect() {

            this.$store.dispatch('approval_common_store/resetUserSelect');

            this.updateShowOpinionPanel(true);



        },    
    }
}

</script>

<style scoped>



/** 弹窗头部 */
.modal-header {
    display: flex;
    justify-content: center; /* 水平居中对齐 */
    align-items: center; /* 垂直居中对齐 */
    width: 100%; /* 占满可用空间 */
    margin-bottom: 1rem;
    /*text-align: center;  使文字居中 */
}
.modal-title {
    display: block;
    position: relative;
    text-align: center; /* 确保文本在自身容器中居中 */
    font-size: 0.9rem; /* 根据需要调整字体大小 */
    font-weight: bold; /* 加粗字体 */
    color: #666666; /* 设置文本颜色 */
    width: 100%; /* 使其占满行宽以便可以使用flex */
    padding: 0.5rem 0;
}

/* 审批人选择弹窗样式 */
.user-select-modal-panel {
    position: fixed;
    bottom: 10%;
    left: 50%;
    transform: translate(-50%, 0);
    width: 90%;
    background-color: #fff;
    border: 1px solid rgba(0, 0, 0, 0.2);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    padding: 0;
    z-index: 1002;
    overflow: hidden;
}
/* 审批人选择 */
.modal-content {
    max-height: 50vh;    /* 设置内容部分的最大高度 */
    overflow-y: auto;    /* 允许垂直滚动 */
    scrollbar-width: none;  /* 对于 Firefox：隐藏滚动条*/
    -ms-overflow-style: none;  /* 对于 IE 和 Edge：隐藏滚动条 */    
}
.modal-content::-webkit-scrollbar {  /* 对于 Chrome、Safari 和 Opera ：隐藏滚动条*/
    display: none;
}

.el-table th, .el-table td {
    width: 25%; /* 控制每列宽度为表格总宽度的25%，假设有4列 */
    text-align: center; /* 可选：设置文字居中 */
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
    padding: 0;
    width: 100%; /* 确保按钮占据整行 */
}
.modal-spacer-div {
    flex: 1; /* 每个空白 div 占据 25% 的宽度 */
}
.modal-cancel-button, .modal-confirm-button {
    flex: 1;
    padding: 0.5rem 0rem;
    margin: 0 0.5rem;
    font-size: 0.9rem;
    cursor: pointer;
    border: none;
    border-radius: 0.25rem;
    width: 50%; 
    max-width: calc(50% - 1rem);
    margin-bottom: 1rem;
    margin-top: 0.5rem; /* 减少按钮上方的间距 */
}
.modal-cancel-button {
    background-color: #f0f0f0;
    color: #333;
    margin-right: 0.5rem; /* 给取消按钮一些右边距 */
}
.modal-confirm-button {
    background-color: #268FFF;
    color: #fff;
}


</style>

