<template>
    <div v-if="!commonLoading && opinionPanelToggleShow" class="opinion-panel-toggle">
        <div 
            v-for="(btn) in approveBtnList" 
            :key="btn.id" 
            class="opinion-button" 
            @click="openOpinionPanel(btn)">
            {{ btn.approveIdea }}
        </div>          
    </div> 
</template>
<script>

import { mapActions ,mapState } from 'vuex';

export default {
    name: 'OpinionPanelToggle',
    computed: {
        ...mapState('approval_common_store', [
            'commonLoading',
            'opinionPanelToggleShow',
            'approveBtnList'
        ])
    },    
    methods: {
        ...mapActions('approval_common_store', [

            'updateShowOpinionPanel',        //更新 “是不显示意见面板”

            'updateApprovalDescription',     //更新 “审批意见”
            'updateClickButtonId',           //更新 “按钮的id”
            'updateClickButtonApproveIdea',  //更新 “按钮的idea”
            'updateClickButtonApproveType',  //更新 “按钮的Type”

            'updateShowTargetNodeSelect',    //更新 “是否显示目标节点选择”


            'updateQueryTagetNodeMethod',    //更新 查询“目标节点列表的方法”

        ]),        
        /**
         * 打开“意见面板”
        */
        openOpinionPanel(btn) {

            this.updateClickButtonApproveIdea(btn.approveIdea);
            this.updateClickButtonApproveType(btn.approveType);
            this.updateClickButtonId(btn.id);
            this.updateApprovalDescription('');// 清空意见输入框的值

            //查看时不显示面板
            if(btn.approveIdea === '完成任务'){
                return ;
            }

            this.updateShowOpinionPanel(true);

            //========== 根据条件，
            /**
                显示目标节点选择：
                2、
                4（退回补充资料）
                5（发回重审）
                50（退回主流程）
                55
            **/
            console.log("btn.approveType：" + btn.approveType);
            if (btn.approveType == 2 || btn.approveType == 5 || btn.approveType == 50 || btn.approveType == 55) {

                if(btn.approveType == 50){
                    this.updateQueryTagetNodeMethod("getFinishParentNodeList");
                }else{//默认
                    this.updateQueryTagetNodeMethod("getFinishNodeList");
                }

                this.updateShowTargetNodeSelect(true);
            }

        },
    }    
}
</script>

<style scoped>


/* “意见” 操作栏 ************************ */
.opinion-panel-toggle {
    display: flex;
    align-items: center;
    width: 100%;
    max-width: 100%; /* 确保不会超过可用空间 */
    margin: 0; /* 清除任何默认的外边距 */
    background-color: #f0f0f0;
    padding: 1rem;
    justify-content: space-around; /* 均匀分布 */
    box-sizing: border-box;
    height: 2.5rem;
    border-top: 1px solid #ddd; /* 可以添加一个上边框 */
    z-index: 1000;
    position: fixed; /* 使用固定定位 */
    bottom: 0; /* 确保它位于视口底部 */
    left: 0;
    right: 0;
    white-space: nowrap; /* 确保按钮在同一行 */
    overflow: hidden; /* 隐藏超出内容 */
    text-overflow: ellipsis; /* 如果内容超出显示省略号 */
}
.opinion-button {
    background-color: transparent; /* 移除按钮背景 */
    border: none; /* 移除按钮边框 */
    padding: 0.5rem 1rem;
    cursor: pointer;
    font-size: 1rem;
    text-align: center;
    flex: 1; /* 平分宽度 */
    margin: 0; /* 移除按钮之间的间距 */
    box-sizing: border-box;
    position: relative; /* 为了使用伪元素 */
    white-space: nowrap; /* 确保按钮在同一行 */
    overflow: hidden; /* 隐藏超出内容 */
    text-overflow: ellipsis; /* 如果内容超出显示省略号 */
    transition: color 0.3s ease, box-shadow 0.2s ease; /* 添加颜色和阴影变化的过渡效果 */
}
.opinion-button:active {
    color: #007BFF; /* 点击时变为指定颜色 */
    box-shadow: 0 4px 16px rgba(0, 174, 239, 0.8); /* 增加阴影的不透明度和模糊半径 */
}
.opinion-button:hover {
    white-space: normal;
    overflow: visible;
    text-overflow: unset;
}
/* 为除最后一个按钮外的所有按钮添加竖线 */
.opinion-button:not(:last-child)::after {
    content: '';
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 0.10rem;
    height: 70%; /* 调整竖线的高度 */
    background-color: #ddd; /* 竖线的颜色 */
}

</style>


