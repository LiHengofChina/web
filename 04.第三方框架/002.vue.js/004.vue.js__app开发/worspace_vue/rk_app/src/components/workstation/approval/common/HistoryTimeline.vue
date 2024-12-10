<template>


    <div class="history-timeline">
        <div v-for="(timeline, index) in timeLineData" :key="index" class="history-timeline-item">
            <div class="history-timeline-header">
                <div class="history-taskName">{{ getTaskName(timeline) }}</div>
                <div class="history-taskTime">{{ timeline.CREATE_TIME }}</div>
            </div>
            <div class="history-timeline-card">
                <div class="history-timeline-body">
                    <div class="history-approve-type-duration">
                        <div class="history-approveType">{{ timeline.APPROVE_TYPE }}</div>
                        <div class="history-duration">耗时：{{ timeline.DURATION }}</div>
                    </div>
                    <div class="history-approveIdea">{{ resApproveIdea(timeline.APPROVE_IDEA) }}</div>
                    <div class="history-assignee-end-time">
                        <span class="history-assignee">处理人：<strong style="color: black;">{{ timeline.ASSIGNEE_NAME }}</strong></span>
                        <span class="history-endTime"><i class="fas fa-clock"></i> {{ timeline.END_TIME }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters ,mapActions } from 'vuex';
export default {
    name: 'HistoryTimeline',
    computed: {
        ...mapGetters('approval_common_store', [
            'commonLoading'
        ]),
    },    
    props: {
        traceNo: {
            type: String,
            required: true
        },
        bizId: {
            type: String,
            required: true
        },
        opNo: {
            type: String,
            required: true
        },
        taskDefId: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            timeLineData: []
        };
    },
    methods: {
        ...mapActions('approval_common_store', [
            'updateCommonLoading'
        ]),
        resApproveIdea(idea) {
            return idea || '同意';
        },        
        getTaskName(timeline) {
            return timeline.TASK_NAME;
        },
        getTimeLine(trace_no, biz_id, op_no, task_def_id) {
            return import('@/api/workstation/approval/flowable/flowable_api')
                .then(({ default: api }) => {
                    return new Promise((resolve, reject) => {
                        api.getTimeLine(
                            {traceNo: trace_no, bizMark: biz_id, taskDefId: task_def_id, isShowSign: "", opNo: op_no },
                            this.$config,
                            response => {
                                if (response && response.code === 0 && response.data) {
                                    resolve(response);
                                } else {
                                    reject('Unexpected API response');
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
        },
        load(){

            this.updateCommonLoading(true);

            //（1）获取审批历史数据
            this.getTimeLine(this.traceNo, this.bizId, this.opNo, this.taskDefId)
            .then(response => {
                //（2）设置审批历史数据
                if (response && response.code === 0 && response.data) {
                    this.timeLineData = response.data.hisTask.map(task => {
                        return {
                            TASK_NAME: task.TASK_NAME,
                            CREATE_TIME: task.CREATE_TIME,
                            APPROVE_TYPE: task.APPROVE_TYPE,
                            APPROVE_IDEA: task.APPROVE_IDEA,
                            DURATION: task.DURATION,
                            ASSIGNEE_NAME: task.ASSIGNEE_NAME,
                            dotcolor: '#1EC5B5',
                            END_TIME: task.END_TIME || '无结束时间'
                        };
                    });

                    this.updateCommonLoading(false);
                } else {
                    console.error('Unexpected API response in third call:', response);
                }
            })             
            .catch(error => {
                this.updateCommonLoading(false);           
                console.error('Error in API chain:', error);
            });

        }
    },
    mounted() {
        this.load();
    }
};
</script>
<style scoped>

/** 整体的 */
.history-timeline {
    position: relative;
    margin-top: 0.7rem;
    padding-left: 0.7rem;
    padding-right: 1.4rem;
}
/** 左边的竖线 */
.history-timeline::before {
    content: '';
    position: absolute;
    top: 0.625rem;              /* 从第一个圆圈的顶部开始 */
    bottom: 11.9rem;          /* 在最后一个圆圈的底部结束 */
    left: 0.7rem;               /* 竖线的位置 */
    width: 2px;
    background-color: #ddd; /* 灰色竖线颜色 */
}
/** 每个阶段 */
.history-timeline-item {
    position: relative;
    padding-left: 1.5rem;
}
/** 左边的圆点 */
.history-timeline-item::before {
    content: '';
    position: absolute;
    left: -0.26rem;
    top: 0.5rem; /* 通过调整这个值来确保圆圈与taskName文字垂直对齐 */
    width: 0.625rem;
    height: 0.625rem;
    background-color: #ddd; /* 圆点颜色 */
    border-radius: 50%;
}
/** 显示的卡片的内部 */
.history-timeline-header {
    padding-left: 0.7rem; /* 使标题与圆圈对齐 */    
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
.history-timeline-card {
    border: 1px solid #ddd;
    padding: 15px;
    margin-bottom: 15px;
    border-radius: 8px;
    background-color: #fff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
.history-taskName {
    font-weight: bold;
    color: #909399;
    font-size: 1rem;
    margin-bottom: 4px;
}
.history-taskTime {
    color: #909399;
    font-size: 0.8rem;
    font-weight: normal;
}
.history-timeline-body {
    padding-left: 10px;
    font-size: 14px;
    color: #666;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.history-assignee-end-time {
    display: flex;
    justify-content: flex-end; /* 右对齐 */
    width: 100%; /* 占满容器宽度 */
    margin-top: 10px; /* 添加适当的间距 */
    flex-direction: column; /* 垂直排列 */
    align-items: flex-end; /* 向右对齐 */
}
.history-approveType {
    color: #1EC5B5; /* 审批类型颜色 */
}
.history-approveIdea {
    color: #ff9800; /* 审批意见颜色 */
    margin-bottom: 5px;
    text-align: center; /* 居中对齐 */
    border-bottom: 1px solid #ddd; /* 添加下方的横线 */
    padding-bottom: 5px; /* 添加一些内边距，以便横线和文字之间有间距 */
    margin-top: 1.5rem; /* 添加上边距以增加空行 */
    width: 100%; /* 占满容器宽度 */
}
.history-duration {
    font-size: 0.9em;
    color: #909399;
    text-align: right; /* 右对齐 */
}
.history-approve-type-duration {
    display: flex;
    justify-content: space-between; /* 左右对齐 */
    width: 100%; /* 占满容器宽度 */
    margin-bottom: 5px;
}
.history-endTime, .history-assignee {
    color: #909399;
    font-size: 0.8rem;
    margin-top: 0.3rem;
}
</style>