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
        <OpinionModal @onSendApproval="sendApproval" >
        <template v-slot:extra-fields>
            <div v-if=" task_def_id === 'due_supplement_data' " class="extra-fields-container">
                <div class="extra-fields-input-wrapper">
                    <label class="extra-fields-label">
                        <span class="extra-fields-required-marker">*</span>手续费收取方式
                    </label>
                    <el-select v-model="feeCollectWay" placeholder="请输入">
                        <el-option value='0' label='手续费先付'></el-option>
                        <el-option value='1' label='手续费后付'></el-option>
                    </el-select>                        
                </div> 
                <div class="extra-fields-input-wrapper">
                    <label class="extra-fields-label">
                        <span class="extra-fields-required-marker">*</span>直租供货商
                    </label>
                    <el-input
                            v-model="applySupplier"
                            type="textarea"
                            :rows="3"
                            placeholder="请输入">
                    </el-input>                        
                </div> 
                <div class="extra-fields-input-wrapper">
                    <label class="extra-fields-label">
                        <span class="extra-fields-required-marker">*</span>资金来源备注
                    </label>
                    <el-input
                            v-model="capitalSourceRemark"
                            type="textarea"
                            :rows="3"
                            placeholder="请输入">
                    </el-input>                        
                </div> 
                                   
                
            </div>
        </template>
        </OpinionModal>

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
//意见面板
import OpinionModal from "@/components/workstation/approval/common/opinion_modal/OpinionModal.vue";
import DetailsSection from '@/views/workstation/approval/bottom_menu/my_approvals/pending/lease/putout_approval/DetailsSection.vue';
import '@/assets/styles/workstation/approval/common/approval-public.css';
import { nextTick } from 'vue';
export default {
    
    name: 'ContractApprovalPage',
    components: {
        LoadingIndicator,
        HistoryTimeline,        
        DocumentList,
        OpinionPanelToggle,
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

            //合同信息
            pactId:null,
            //放款信息使用
            dueId:null,
            //========= lease
            applyDetail: {},  // 详情数据
            feeInfoList: [],//费用数据
            submitData:{},
            test1:1,
            applySupplier:null,
            capitalSourceRemark:null,
            feeCollectWay:0
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
            'commonPactId',
            'commonDueId',
            'commonCusId',
            'commonTraceNo',
            'nextUserId',
            'commonEntrance',
            
            'clickButtonApproveType',      //当前点击的类型
            'targetNodeId',                 //审批的目标节点

        ])
    },
    methods:{
        
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
            'updateCommonPactId',
            'updateCommonDueId',
            'updateCommonEntrance',
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
            //根据详情查询出来的数据进行处理
            let data=this.applyDetail;             
            data.标题='';
            data.applySupplier=this.applySupplier;
            data.capitalSourceRemark=this.capitalSourceRemark;     
            data.feeCollectWay=this.feeCollectWay;     
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
            const submitUrl = `/${this.$config.servers.lease}/approve/due/leaseDueHis/submitApprove`;
            //提交前处理
            //（1）获取系统参数：哪些审批需要校验表单
            this.getParmDic({parmKeys:["PLT_NO_VALIDATE_APPROVE_TYPE"]})
            .then(res => {
                this.updateNoValidateApproveType(res.data.PLT_NO_VALIDATE_APPROVE_TYPE);
                //自定义补充的必填项
                if (!this.applySupplier  ) {
                    this.$alert('请输入直租供货商', '提示', {
                        confirmButtonText: '确 定',
                        type: 'warning',
                    });
                    return;
                }
                if (!this.capitalSourceRemark  ) {
                    this.$alert('请输入资金来源备注', '提示', {
                        confirmButtonText: '确 定',
                        type: 'warning',
                    });
                    return;
                }
                //（2）调用工作流接口，获取下一节点相关信息
                return this.needOperated();
            }).then(
                //放款审批不需要审批人
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
                            dueId:this.commonDueId,
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

        //====信息查询
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
                                    this.dueId=response.data.methodParam.dueId;
                                    this.updateCommonPactId(this.pactId);
                                    this.updateCommonDueId(this.dueId);
                                    this.updateCommonEntrance('pact');
                                    
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
        //放贷信息
        getDueApproverInit(dueId){
            return import('@/api/workstation/approval/lease/lease_api')
                .then(({ default: api }) => {
                    return new Promise((resolve, reject) => {
                        api.findDueApproveInit(
                            dueId,
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
                if ((!applyId)||(!this.pactId)||(!this.dueId)) {
                    throw new Error('No pactId found, skipping second API call');
                }
                this.getfeeList(applyId,this.pactId);
                return this.getDueApproverInit(this.dueId);

            }).then(response => {    
                console.log('当前节点审批类型------'+this.clickButtonApproveType);
                console.log('a岗角色判断条件------'+response.data.wkfNodeNo);

                if (response && response.code === 0 && response.data) {
                    this.applyDetail= response.data.leaseDue;     
                    this.applySupplier=this.applyDetail.applySupplier;
                    this.capitalSourceRemark=this.applyDetail.capitalSourceRemark;
                    this.feeCollectWay=this.applyDetail.feeCollectWay;
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

  
}
</script>
