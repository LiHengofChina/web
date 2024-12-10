<template>
    <div v-if="showOpinionPanel " class="modal-overlay" @click="cancelApproval"></div>
    <transition name="slide-up">
        <div v-if="showOpinionPanel" class="modal-panel">
            


            <!-- 意见标题 -->
            <div class="modal-header">
                <label for="approval-description" class="modal-title">
                    <span v-if="clickButtonApproveType !== '1'" class="required">*</span>
                    审批意见
                </label>
            </div>
            
            <!-- 输入意见 -->
            <textarea id="approval-description" v-model="localApprovalDescription" class="opinion-textarea" rows="7" maxlength="500"></textarea>

            <!-- 目标节点选择（仅在需要时显示） -->
            <TargetNodeSelect  v-if="showTargetNodeSelect" />
            

            <!-- 每种审批的额外字段 -->
            <slot name="extra-fields"></slot>

            <!-- “取消”和“确定”按钮 -->
            <div class="modal-footer">
                <div class="modal-spacer-div"></div>
                <div class="modal-spacer-div"></div>
                <button class="modal-cancel-button" @click="cancelApproval">取 消</button>
                <button class="modal-confirm-button" @click="sendApproval">确 定</button>
            </div>

        </div>
    </transition>
</template>


<script>
import { mapGetters, mapActions } from "vuex";


//目标节点
import TargetNodeSelect from "@/components/workstation/approval/common/opinion_modal/TargetNodeSelect.vue";

export default {
    name: "OpinionModal",
    components: {
        TargetNodeSelect
    },  
    emits: ['onSendApproval'], // 声明该组件会发出哪些事件
    computed: {
        ...mapGetters('approval_common_store', [
            'showOpinionPanel', 
            'approvalDescription', 
            'clickButtonApproveType',
            
            'showTargetNodeSelect',
            'targetNodeId',
        ]),
        localApprovalDescription: {
            get() {
                return this.approvalDescription;
            },
            set(value) {
                this.updateApprovalDescription(value);
            }
        }
    },
    methods: {
        ...mapActions('approval_common_store', [
            'updateShowOpinionPanel', 
            'updateApprovalDescription',
            'resetOpinion'
        ]),

        /**
         * 关闭“意见面板”
         */
        cancelApproval() {

            //重置数据
            this.$store.dispatch('approval_common_store/resetOpinion');

            this.updateShowOpinionPanel(false); // 关闭面板
            this.updateApprovalDescription(''); // 清除审批意见内容

        },   
        sendApproval() {

            if (this.clickButtonApproveType !== '1' && this.approvalDescription.trim() === '') {
                this.$alert('请填写审批说明','提示',{
                    confirmButtonText: '确 定',
                    type: 'warning',
                });
                return;
            }

            if(this.showTargetNodeSelect && this.targetNodeId.trim() === ''){
                this.$alert('请选择目标节点','提示',{
                    confirmButtonText: '确 定',
                    type: 'warning',
                });
                return;
            }

            this.$emit('onSendApproval'); // 触发父组件的提交事件
        },
    },
};
</script>


<style scoped>



/* 弹窗面板 ************************ */
.modal-panel {
    border-top: 1px solid #ddd;
    position: fixed;
    box-sizing: border-box;
    bottom: 7%;
    left: 50%;
    transform: translate(-50%, 0); /* 水平居中 */
    width: 90%;
    background-color: #fff;

    border: 1px solid rgba(0, 0, 0, 0.2); /* 添加边框，颜色和阴影一样 */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* 阴影保持不变 */

    border-radius: 10px;
    padding: 0rem;
    z-index: 1002;
    overflow-y: hidden;
    overflow-x: hidden; /* 禁止水平滚动 */
    overflow: visible; /* 允许内容溢出 */
    
}
.modal-panel::after {
    content: '';
    position: absolute;
    bottom: -0.5rem; /* 使箭头更靠近面板 */
    left: 50%;
    transform: translateX(-50%);
    width: 4rem; /* 调整箭头的宽度 */
    height: 1rem; /* 调整箭头的高度 */
    background-color: #fff;  /** background-color: #007BFF; */
    clip-path: polygon(50% 100%, 0% 0%, 100% 0%);
    /*border: 1px solid rgba(0, 0, 0, 0.2);  添加边框，颜色和阴影一样 */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    z-index: 1001;
}
/** 弹窗头部 */
.modal-header {
    display: flex;
    justify-content: center; /* 水平居中对齐 */
    align-items: center; /* 垂直居中对齐 */
    width: 100%; /* 占满可用空间 */
    margin-bottom: 1rem;
    /*text-align: center;  使文字居中 */
}
.required {
    color: red;
    font-weight: bold;
    font-size: 0.9rem;
    padding: 0.5rem 0;
    margin-right: 0.2rem;
    position: relative;
    top: 2px; /* 细微调整符号的位置 */    
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
.modal-title::after {
    content: '';
    display: block;
    width: 100%; /* 下划线的宽度 */
    height: 1px; /* 下划线的高度 */
    background-color: #ddd; /* 下划线的颜色 */
    position: absolute;
    bottom: 0; /* 紧贴底部 */
    left: 0; /* 左侧对齐 */
}
/* 意见填写面板-底部 */
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

/* 审批内容面板——中的文本输入 */
.opinion-textarea {
    width: 90%;
    max-width: 90%;
    height: 100px;
    padding: 0.5rem;
    margin-bottom: 0.5rem; /* 调整此处的间距以减少文本框下方的距离 */
    border: 1px solid #ddd;
    border-radius: 0.25rem;
    transition: border-color 0.3s ease;
    box-sizing: border-box;
    appearance: none;
}
.opinion-textarea:focus {
    border-color: #007BFF;
    outline: none;
}
</style>

