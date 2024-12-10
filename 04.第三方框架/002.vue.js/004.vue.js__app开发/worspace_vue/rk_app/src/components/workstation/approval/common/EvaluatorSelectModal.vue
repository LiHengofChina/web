<template>
    <div v-if="evaluatorSelectVisible" class="modal-overlay" @click="closeEvaluatorSelect"></div>
    <transition name="slide-up">
        <div v-if="evaluatorSelectVisible" class="user-select-modal-panel" @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd">
            <!-- 弹窗头部 -->
            <div class="modal-header">
                <div class="modal-title">
                    选择评委
                </div>
            </div>

            <!-- 评委表格 -->
            <div class="modal-content">
                <el-table 
                    :data="evaluatorList" 
                    style="width: 100%" 
                    height="50vh"
                    @selection-change="handleSelectionChange">
                    <el-table-column type="selection"></el-table-column>

                    <el-table-column prop="opNo" label="编号" ></el-table-column>
                    <el-table-column prop="opName" label="姓名"></el-table-column>
                    <el-table-column prop="tel" label="联系电话"></el-table-column>

                </el-table>
            </div>

            <!-- 弹窗底部按钮 -->
            <div class="modal-footer">
                <div class="modal-spacer-div"></div>
                <div class="modal-spacer-div"></div>
                <button class="modal-cancel-button" @click="closeEvaluatorSelect">取 消</button>
                <button class="modal-confirm-button" @click="confirmSelection">确 定</button>
            </div>

        </div>
    </transition>
</template>

<script>

import { mapGetters, mapActions } from 'vuex';

export default {
    name: 'EvaluatorSelectModal',
    emits: ['selectEvaluator'], // 声明该组件会发出哪些事件

    data() {
        return {


            evaluatorList: [],                  // 评委列表数据

            pageNo: 1,                          // 分页-当前页数
            pageSize: 10,                       // 分页-每页条数
            totalCount: 0,                      // 总记录数，用于判断是否还有更多数据
            touchStartY: 0,                     // 触摸开始的Y坐标
            touchEndY: 0,                        // 触摸结束的Y坐标

            selectedEvaluatorList: [],          // 选中的评委列表
            selectedEvaluatorNameList: [],      // 选中的评委名列表

        };
    },
    computed: {

        ...mapGetters('approval_common_store', [
            'evaluatorSelectVisible',
            'queryJudgesType',
        ])
    },
    methods: {
        ...mapActions('approval_common_store', [
            'updateShowOpinionPanel',

            'updateCommonLoading',

            'updateEvaluatorSelectVisible',

        ]),
        handleSelectionChange(selectedRows) {

            //当前选中的评委的ID
            this.selectedEvaluatorList = selectedRows.map(row => row.opNo);
            this.selectedEvaluatorNameList = selectedRows.map(row => row.opName);

        },

        /***
         * 点击确认 
         */
        confirmSelection() {

            if(this.selectedEvaluatorList.length === 0){
                this.$alert('请选择评委人员', '提示', {
                            confirmButtonText: '确 定',
                            type: 'warning',
                        });                
                return;
            }

            // “发出事件” 并传递 “选中的评委数据”
            this.$emit('selectEvaluator',{
                queryJudgesType: this.queryJudgesType,
                selectedEvaluatorList: this.selectedEvaluatorList,
                selectedEvaluatorNameList: this.selectedEvaluatorNameList
            });

            //重置
            this.closeEvaluatorSelect();

        },

        /***
         * 加载更多的数据
         */
        loadMoreData() {
            // 检查是否还有更多数据需要加载
            if (this.evaluatorList.length < this.totalCount) {
                this.pageNo += 1;
                this.getNextEvaluatorList();
                console.log("加载更多数据");
            } else {
                console.log("没有更多数据了");
            }
        },
        async getNextEvaluatorList() {
            try {
                const response = await import('@/api/workstation/approval/config/config_api')
                .then(({ default: api }) => {
                    return new Promise((resolve, reject) => {
                        api.getNextEvaluatorList(
                                {
                                    type: this.queryJudgesType,
                                    pageNo: this.pageNo,
                                    pageSize: this.pageSize,
                                    dynamicQuery: "",
                                    tableId: "config/configCommitteeUserTablePop",
                                    initQuery: "{\"type\": "+ "\"" + this.queryJudgesType +  "\"" +  "}"
                                },
                                this.$config,
                                response => {
                                    if (response.code == 0) {
                                        // 拼接新数据
                                        this.evaluatorList = [...this.evaluatorList, ...response.list.records] || []

                                        //总记录条数
                                        this.totalCount = response.list.total;

                                        //不显示“评审意见”面板
                                        this.updateShowOpinionPanel(false);

                                        this.updateCommonLoading(false);

                                    } else {
                                        this.updateCommonLoading(false);
                                        this.$alert('查询部评委人员出错', '提示', {
                                            confirmButtonText: '确 定',
                                            type: 'error',
                                        });
                                        reject('API Error: ' + (response.msg || 'Unexpected API response'));
                                    }
                                },
                                error => {
                                    reject('API Error: ' + error);
                                }
                        );
                    });
                })
                .catch(err => {
                        console.error('Failed to import API module: ', err);
                        throw err;  // Propagate the error
                });

                return response;
            } catch (err) {
                console.error('Failed to import API module: ', err);
                throw err;
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

        closeEvaluatorSelect() {

            this.updateEvaluatorSelectVisible(false);

            this.updateShowOpinionPanel(true);

            this.selectedEvaluatorList = [];
            this.selectedEvaluatorNameList = [];

            this.evaluatorList = [];

            this.pageNo = 1;
            this.pageSize = 10;
            this.totalCount = 0;   
            this.touchStartY = 0;
            this.touchEndY = 0;

        }

    },


    watch: {
        evaluatorSelectVisible(newVal) {
            if (newVal) {
                this.updateCommonLoading(true);
                this.getNextEvaluatorList();
            }
        }
    },

}
</script>

<style scoped>
/* 保持样式不变 */
.modal-header {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin-bottom: 1rem;
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
    width: 100%;
}
.modal-spacer-div {
    flex: 1;
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
    margin-top: 0.5rem;
}
.modal-cancel-button {
    background-color: #f0f0f0;
    color: #333;
    margin-right: 0.5rem;
}
.modal-confirm-button {
    background-color: #268FFF;
    color: #fff;
}
</style>
