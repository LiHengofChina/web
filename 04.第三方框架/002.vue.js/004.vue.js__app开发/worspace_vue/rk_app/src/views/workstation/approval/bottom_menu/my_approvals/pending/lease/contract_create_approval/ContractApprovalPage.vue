<template>
<div>
    <!-- Loading Indicator -->
    <LoadingIndicator :loading="commonLoading" />
    <div class="public-page-layout">
        <!-- Header Section  -->
        <div class="public-header">
            <i  v-if="!isExemptionfromlogin" class="fas fa-chevron-left public-back-icon-left" @click="goBack"></i>
            <h1 class="public-title">{{ approve_title }}</h1>
            <i  v-if="!isExemptionfromlogin" class="fas fa-chevron-right public-back-icon-right" ></i>
        </div>

        <!-- 标签部分 -->
        <div class="tabs">
            <div class="tab" :class="{ active: commonActiveTab === 'details' }" @click="setCommonActiveTab('details')">审批详情</div>
            <div class="tab" :class="{ active: commonActiveTab === 'history' }" @click="setCommonActiveTab('history')">审批历史</div>
            <div class="tab" :class="{ active: commonActiveTab === 'document' }" @click="setCommonActiveTab('document')">文档</div>
        </div>

        
        <!-- 可滚动的内容区域 -->
        <div class="content-area">
            <!-- 详情区域 -->
            <div v-if="commonActiveTab === 'details'">
                    <DetailsSection :applyDetail="applyDetail" :feeInfoList="feeInfoList"  />
            </div>
            <!-- 审批历史 -->
            <div v-else-if="commonActiveTab === 'history'">
                    <HistoryTimeline :traceNo="trace_no" :bizId="biz_id" :opNo="op_no" :taskDefId="task_def_id" />
            </div>
            <!-- 文档 -->
            <div v-else-if="commonActiveTab === 'document'">
                    <DocumentList />
            </div>

        </div>

        <!-- “意见” 操作栏 -->
        <OpinionPanelToggle/>

        <!-- “意见” 面板 -->
        <OpinionModal @onSendApproval="sendApproval" />

        <!-- 审批人选择弹窗 -->
        <UserSelectModal @approveByUser="approveByUser"  />

    </div>

</div>
</template>

<script>

import { mapGetters,  mapMutations, mapActions} from 'vuex';

/*** 公共组件 */

//加载中效果
import LoadingIndicator from '@/components/workstation/approval/common/LoadingIndicator.vue';
//审批历史
import HistoryTimeline from '@/components/workstation/approval/common/HistoryTimeline.vue';
//文档列表
import DocumentList from '@/components/workstation/approval/common/file/DocumentList.vue';
//意见操作栏
import OpinionPanelToggle from '@/components/workstation/approval/common/opinion_modal/OpinionPanelToggle.vue';
//审批人选择界面
import UserSelectModal from '@/components/workstation/approval/common/UserSelectModal.vue';
//意见面板
import OpinionModal from "@/components/workstation/approval/common/opinion_modal/OpinionModal.vue";

import DetailsSection from '@/views/workstation/approval/bottom_menu/my_approvals/pending/lease/contract_create_approval/DetailsSection.vue';

import '@/assets/styles/workstation/approval/common/approval-public.css';

import { nextTick } from 'vue';

export default {
    name: 'ContractApprovalPage',
    components: {
        LoadingIndicator,
        HistoryTimeline,        
        DocumentList,
        OpinionPanelToggle,
        UserSelectModal,
        OpinionModal,
        DetailsSection,
    },  
    data() {
        return {
            //========= 来自路由的参数
            //========= 来自路由的参数
            task_id: null,
            trace_no: null,
            biz_id: null, 
            op_no: null,
            task_def_id: null,
            approve_title: null, 

            //合同信息查询使用
            pactId:null,
            //========= lease
            applyDetail: {},  // 详情数据
            feeInfoList: [],//费用数据
            submitData:{},
            test1:1

        };
    },
    computed: {
        ...mapGetters('auth', ['isExemptionfromlogin']),
        ...mapGetters('approval_common_store', [
            'queryTaskType',
            'commonLoading',
            'commonActiveTab',
            'userSelectVisible',
            'showOpinionPanel',
            'activeUserList',              //选中的审批人
            'prdUniqueVal',
            'flowNo',
            'wkfNodeNo',
            'commonMainId',
            'commonApplyId',
            'commonCusId',
            'commonTraceNo',
            'nextUserId',
            
            'targetNodeId',                 //审批的目标节点

        ])
    },
    methods: {
        ...mapMutations('approval_common_store', [
            'setCommonActiveTab'
        ]),
        ...mapActions('approval_common_store', [
            'updateCommonTaskId',
            'updateCommonBizId',
            'updateCommonTraceNo',
            'updateCommonCusId',
            'updateCommonApplyId',
            'updateCommonMainId',
            'updateNoValidateApproveType',
            'updateCommonLoading',
            'updateShowOpinionPanel',
            'getNextUserList',
            'updateAssignListQueryParam',  //审批人 “查询条件”
            'getParmDic',
            'needOperated',
            'updatePrdUniqueVal',
            'updateFlowNo',
            'updateWkfNodeNo',
            'updateAppName',
            'updateNextUserId',
            'updateApproveBtnList',
            'resetUserSelect',
            'resetActiveUserList',
            'resetOpinion',
        ]),
        goBack() {
            this.$router.go(-1);
        },
        //处理数据
        getDataHandle(){
            let data=this.applyDetail;
            data.fieldNameRate='%';
            data.标题='';
            return data;
        },
        //回调函数处理主要是文件校验并处理数据
        callBackFormValue(callback, needValidate) {
            //================= 表单数据，合同数据比
            let data = this.getDataHandle();
            data.applyId = this.commonApplyId;
            data.mainId = this.commonMainId;
            if(!needValidate){
                return callback(data);
            }
            //文件
            let reqData = {
                prdUniqueVal: this.prdUniqueVal, 
                flowNo: this.flowNo, 
                nodeNo: this.wkfNodeNo, 
                bizNo: this.commonApplyId,
            };
            this.$store.dispatch('approval_common_store/checkUpload', { data: reqData }).then(val=>{
                if(!val){
                    return callback(data);
                }
                //（1）表单数据检查 // TODO
                //（2）自定义款计划，需要导入 "请先导入租金计划" // TODO
                //(3)A角色修改数据
                return callback(data);

            })
            .catch(error => {
                console.error('Check upload failed:', error);
            });
        },
        //提交
        sendApproval() {
            //先处理
            const submitUrl = `/${this.$config.servers.lease}/approve/pact/leasePactHis/submitApprove`;
            //提交前处理
            //（1）获取系统参数：哪些审批需要校验表单
            this.getParmDic({parmKeys:["PLT_NO_VALIDATE_APPROVE_TYPE"]})
            .then(res => {
                this.updateNoValidateApproveType(res.data.PLT_NO_VALIDATE_APPROVE_TYPE);
                //（2）调用工作流接口，获取下一节点相关信息
                return this.needOperated();
            }).then(
                //合同审批不需要审批人
                this.$confirm(
                    '此操作将提交该笔业务, 是否继续?',
                    '提示',{
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                    }
                ).then(async () => {
                    this.updateCommonLoading(true);

                    await this.$store.dispatch('approval_common_store/doCommit', {
                        targetNodeId: this.targetNodeId,
                        callBackFormValue: this.callBackFormValue,
                        submitUrl: submitUrl,
                        methodParam: {
                            applyId: this.commonApplyId,
                            cusId: this.commonCusId,
                            mainId: this.commonMainId,
                            traceNo: this.commonTraceNo,
                            pactId: this.pactId
                        }
                    });
                    console.log("--点击ok--");

                }).catch(() => {
                    this.$store.dispatch('approval_common_store/resetOpinion');
                    console.log("--点击取消--");
                }),

            ).catch(error => {
                console.error('Error in API chain:', error);
            });



        },
        //初始数据查询，先查询当前任务下信息
        getApprovalDetail(task_id, biz_id) {
            return import('@/api/workstation/approval/flowable/flowable_api')
                .then(({ default: api }) => {
                    return new Promise((resolve, reject) => {
                        api.getApprovalDetail(
                            {taskId: task_id, taskType: this.queryTaskType, bizMark: biz_id },
                            this.$config,
                            response => {
                                if (response && response.code === 0 && response.data && response.data.approveBtnList.length > 0) {
                                    this.updateApproveBtnList(response.data.approveBtnList);
                                    const applyId = response.data.methodParam.applyId;
                                    const mainId = response.data.methodParam.mainId;
                                    const cusId = response.data.methodParam.cusId;
                                    this.updateCommonCusId(cusId);
                                    this.updateCommonApplyId(applyId);
                                    this.updateCommonMainId(mainId);

                                    this.pactId=response.data.methodParam.pactId;
                                    resolve(applyId);

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
                    this.updateCommonLoading(false);
                    this.$router.push({
                        name: 'ErrorPage',
                        query: { message: '已处理！' } 
                    });
                });

        },
        //合同信息查询
        findPactApproveInitDetail(pactId) {
            return import('@/api/workstation/approval/lease/lease_api')
                .then(({ default: api }) => {
                    return new Promise((resolve, reject) => {
                        api.findPactApproveInit(
                            pactId,
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
        //费用信息查询
        getfeeList(applyId,pactId){
            return import('@/api/workstation/approval/lease/lease_api')
                .then(({ default: api }) => {
                    return new Promise((resolve, reject) => {
                        api.getfeeList(
                            {applyId: applyId, pactId: pactId },
                            this.$config,
                            response => {
                                if (response && response.code === 0 && response.data) {
                                    this.feeInfoList=response.data.feeInfoList;
                                    this.feeSum=response.data.feeSum;
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
        //方法组合，
        fetchApplyDetail(task_id, biz_id ) {
            this.updateCommonLoading(true);
            this.getApprovalDetail(task_id, biz_id)
            .then(applyId=>{
                if (!this.pactId) {
                    throw new Error('No pactId found, skipping second API call');
                }
                this.getfeeList(applyId,this.pactId);
                return this.findPactApproveInitDetail(this.pactId);

            }).then(response => {    
                if (response && response.code === 0 && response.data) {
                    this.applyDetail= response.data.leasePact;                

                    this.updatePrdUniqueVal(response.data.productNo + response.data.productVersionNo);
                    this.updateFlowNo(response.data.flowNo);
                    this.updateWkfNodeNo(response.data.wkfNodeNo);
                } else {
                    console.error('Unexpected API response:', response);
                }
                this.updateCommonLoading(false);
            })
            .catch(error => {
                this.updateCommonLoading(false);
                console.error('Error in API chain:', error);
            });
            //
        },


        /**
         * 页面初始入口
         */
        async load(){
            this.updateCommonLoading(true);
            this.updateAppName('lease');
            await nextTick();
            try {

                //路由
                this.task_id = this.$route.params.task_id;
                this.updateCommonTaskId(this.$route.params.task_id);

                this.trace_no = this.$route.params.trace_no;
                this.updateCommonTraceNo(this.$route.params.trace_no);
                
                this.biz_id = this.$route.params.biz_id;
                this.updateCommonBizId(this.$route.params.biz_id);

                this.op_no = this.$route.params.op_no;
                this.task_def_id = this.$route.params.task_def_id;
                this.approve_title = this.$route.params.approve_title;

                this.fetchApplyDetail(this.task_id, this.biz_id );

                
            } catch (error) {
                console.error('Error:', error);
            }
        }

    },
    watch: {
        commonActiveTab(newValue) {
            if (newValue === 'details') {
                this.load();
            }
        }
    },
    mounted() {
        this.load();        
    }
};
</script>