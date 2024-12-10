<template>

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
                    <DetailsSection :applyDetail="applyDetail" />
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
        <OpinionModal @onSendApproval="sendApproval">
            <template v-slot:extra-fields>
                <div v-if=" task_def_id === 'due_supplement_data' " class="extra-fields-container"> 
                    <div class="extra-fields-input-wrapper">
                        <label class="extra-fields-label">
                            <span class="extra-fields-required-marker">*</span>合同名称
                        </label>
                        <el-input  v-model="duePactName" placeholder="请输入"></el-input>                        
                    </div> 
                    <div class="extra-fields-input-wrapper">
                        <label class="extra-fields-label">
                            <span class="extra-fields-required-marker">*</span>合同编号
                        </label>
                        <el-input  v-model="approvalPactNo" placeholder="请输入"></el-input>                        
                    </div>
                </div>
                <!-- 风控经理 -->
                <div v-if=" task_def_id === 'UserTask_0kfbg2f' " class="extra-fields-container"> 
                    <div class="extra-fields-input-wrapper">
                        <label class="extra-fields-label">
                            <span class="extra-fields-required-marker">*</span>项目资料完善情况(复制■修改)
                        </label>
                        <el-input  v-model="improvementData" placeholder="请输入"></el-input>                        
                    </div> 
                    <div class="extra-fields-input-wrapper">
                        <label class="extra-fields-label">
                            <span class="extra-fields-required-marker">*</span>合同办理情况(复制■修改)
                        </label>
                        <el-input  v-model="contractHandingData" placeholder="请输入"></el-input>                        
                    </div>
                    <div class="extra-fields-input-wrapper">
                        <label class="extra-fields-label">
                            <span class="extra-fields-required-marker">*</span>担保措施办理情况(复制■修改)
                        </label>
                        <el-input  v-model="handingOfGuaranteeMeasuresData" placeholder="请输入"></el-input>                        
                    </div>
                    <div class="extra-fields-input-wrapper">
                        <label class="extra-fields-label">
                            <span class="extra-fields-required-marker">*</span>其他放款条件落实情况(复制■修改)
                        </label>
                        <el-input  v-model="implementationOfOtherLeandingConditData" placeholder="请输入"></el-input>                        
                    </div>
                </div>

            </template>
            
        </OpinionModal>


        <!-- 审批人选择弹窗 -->
        <UserSelectModal @approveByUser="approveByUser"  />

        <!-- 要件资料面板 -->
        <ImportantDocuments/>
                
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

//要件资料上传组件
import ImportantDocuments from "@/components/workstation/approval/common/file/ImportantDocuments.vue";

/*** 非公共组件 */
import DetailsSection from '@/views/workstation/approval/bottom_menu/my_approvals/pending/loan/putout_approval/DetailsSection.vue';

import '@/assets/styles/workstation/approval/common/approval-public.css';

import { nextTick } from 'vue';


export default {
    name: 'LoanPutoutApprovalPage',
    components: {
        LoadingIndicator,
        HistoryTimeline,        
        DocumentList,
        OpinionPanelToggle,
        UserSelectModal,
        OpinionModal,
        DetailsSection,
        ImportantDocuments,
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
            //放款
            dueId: null,
            pactId: null,
            payId: null,
            payFlowId: null,
            applyDetail: {},  // 详情数据
            dueChildId:null,  //放款数据id
            //意见面板编辑数据
            duePactName:null,
            approvalPactNo:null,
            improvementData:'□已完善       □未完善         □不适用 ',
            contractHandingData:'□已完善       □未完善         □不适用 ',
            handingOfGuaranteeMeasuresData:'□已完善       □未完善         □不适用 ',
            implementationOfOtherLeandingConditData:'□已完善       □未完善         □不适用 '
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

            'targetNodeId',                 //审批的目标节点

            'clickButtonApproveType',      //当前点击的类型
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

        // 提交  处理数据  
        getData(){
            let data =this.applyDetail;
            data.标题="";
            data.payId="";
            data.id=null;
            data.duePactName=this.duePactName;
            data.approvalPactNo=this.approvalPactNo;
            data.improvementData=this.improvementData;
            data.contractHandingData=this.contractHandingData;
            data.handingOfGuaranteeMeasuresData=this.handingOfGuaranteeMeasuresData;
            data.implementationOfOtherLeandingConditData=this.implementationOfOtherLeandingConditData;
            console.log('数据处理');
            return data;
        },
        //回调
        callBackFormValue(callback, needValidate) {
                if (needValidate){
                    //调用文件校验接口
                    let reqData = {
                        prdUniqueVal: this.prdUniqueVal, 
                        flowNo: this.flowNo, 
                        nodeNo: this.wkfNodeNo, 
                        bizNo: this.commonApplyId,
                    };

                    this.$store.dispatch('approval_common_store/checkUpload', { data: reqData })
                    .then(val => {
                        if (val) {
                            //（1）表单数据检查 // TODO

                            //（2）项目经理提交时：需要有还款计划的数据 // TODO

                            //（3）自定义款计划，需要导入 "请先导入租金计划" // TODO

                            //（4）获取数据，表单数据
                            let data = this.getData();
                            data.seqList = this.$store.getters['approval_common_store/nodeSeqList'];
                            return callback(data);
                        }
                    })
                    .catch(error => {
                        console.error('Check upload failed:', error);
                    });
            }else {
                    //================= 表单数据
                    let data = this.getData();
                    return callback(data);    
            }
        },
        sendApproval(){
            //（1）获取系统参数：哪些审批需要校验表单
            this.getParmDic({parmKeys:["PLT_NO_VALIDATE_APPROVE_TYPE"]})
            .then(res => {
                this.updateNoValidateApproveType(res.data.PLT_NO_VALIDATE_APPROVE_TYPE);
                //自定义补充的必填项
                if (!this.duePactName  ) {
                    this.$alert('请输入合同名称', '提示', {
                        confirmButtonText: '确 定',
                        type: 'warning',
                    });
                    return;
                }
                if (!this.approvalPactNo  ) {
                    this.$alert('请输入合同编号', '提示', {
                        confirmButtonText: '确 定',
                        type: 'warning',
                    });
                    return;
                }
                //风控经理填写校验
                if('UserTask_0kfbg2f'===this.task_def_id){
                    if (!this.improvementData  ) {
                        this.$alert('请输入项目资料完善情况', '提示', {
                            confirmButtonText: '确 定',
                            type: 'warning',
                        });
                        return;
                    }
                    if (!this.contractHandingData  ) {
                        this.$alert('请输入合同办理情况', '提示', {
                            confirmButtonText: '确 定',
                            type: 'warning',
                        });
                        return;
                    }
                    if (!this.handingOfGuaranteeMeasuresData  ) {
                        this.$alert('请输入担保措施办理情况', '提示', {
                            confirmButtonText: '确 定',
                            type: 'warning',
                        });
                        return;
                    }
                    if (!this.implementationOfOtherLeandingConditData  ) {
                        this.$alert('请输入其他放款条件落实情况', '提示', {
                            confirmButtonText: '确 定',
                            type: 'warning',
                        });
                        return;
                    }


                }
                //（2）调用工作流接口，获取下一节点相关信息
                return this.needOperated();
            })
            .then(
                
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
                    const submitUrl = `/${this.$config.servers.loan}/approve/due/loanDueHis/submitApproveChild`;

                    await this.$store.dispatch('approval_common_store/doCommit', {
                        targetNodeId: this.targetNodeId,
                        callBackFormValue: this.callBackFormValue,
                        submitUrl: submitUrl,
                        methodParam: {
                            applyId: this.commonApplyId,
                            dueChildId: this.dueChildId,
                            cusId: this.commonCusId,
                            dueId:this.commonDueId,
                            mainId: this.commonMainId,
                            traceNo: this.commonTraceNo,
                            pactId: this.pactId,
                            selectFlag:1
                        }
                    });
                    console.log("--点击ok--");

                }).catch(() => {
                    this.$store.dispatch('approval_common_store/resetOpinion');
                    console.log("--点击取消--");
                }) 
            ).catch(error => {
                console.error('Error in API chain:', error);
            });

        },

        //=============================================================================================== 页面初始部分 start
        
        /**
         * flowable : 获取申请ID、按钮列表等等
         */
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
                                    this.dueChildId=response.data.methodParam.dueChildId;
                                    this.updateCommonCusId(cusId);
                                    this.updateCommonApplyId(applyId);
                                    this.updateCommonMainId(mainId);
                                    
                                    this.payId = response.data.methodParam.payId;
                                    this.dueId = response.data.methodParam.dueId;
                                    this.pactId = response.data.methodParam.pactId;
                                    this.payFlowId = response.data.methodParam.payFlowId;
                                    
                                    this.updateCommonPactId(this.pactId);
                                    this.updateCommonDueId(this.dueId);
                                    this.updateCommonEntrance('due');
                                    resolve(this.dueChildId);

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
        //放款信息查询
        findDueApproveInitChildHandle(dueChildId){
            return import('@/api/workstation/approval/loan/loan_api')
                .then(({ default: api }) => {
                    return new Promise((resolve, reject) => {
                        api.findDueApproveInitChild(
                            dueChildId,
                            this.$config,
                            response => {
                                if (response && response.code === 0 && response.data) {
                                    resolve(response);

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
        fetchApplyDetail(task_id, biz_id ) {
            //（1）显示正在加载中的效果
            this.updateCommonLoading(true);
            //（2）获取 “业务申请ID” 和 “审批按钮列表”
            this.getApprovalDetail(task_id, biz_id)
            .then(dueChildId => {
                //（3）判断是否成功获取applyId
                if (!dueChildId) {
                    throw new Error('No applyId found, skipping second API call');
                }
                //（4）调用详情
                return this.findDueApproveInitChildHandle(dueChildId);
            })
            .then(response => {
                //（5）设置详情数据
                if (response && response.code === 0 && response.data) {

                    this.applyDetail = response.data.loanDueHis;
                    // 初始“意见面板的数据”
                    this.updatePrdUniqueVal(response.data.productNo + response.data.productVersionNo);
                    this.updateFlowNo(response.data.flowNo);
                    this.updateWkfNodeNo(response.data.wkfNodeNo);
                    this.duePactName=this.applyDetail.duePactName;
                    this.approvalPactNo=this.applyDetail.approvalPactNo;  
                    //处理风控经理问题
                    
                    if('UserTask_0kfbg2f'===this.task_def_id){
                        console.log(this.applyDetail.improvementData);
                        var defaultStr='□已完善       □未完善         □不适用';
                        this.improvementData=this.applyDetail.improvementData?this.applyDetail.improvementData:defaultStr;
                        this.contractHandingData=this.applyDetail.contractHandingData?this.applyDetail.contractHandingData:defaultStr;
                        this.handingOfGuaranteeMeasuresData=this.applyDetail.handingOfGuaranteeMeasuresData?this.applyDetail.handingOfGuaranteeMeasuresData:defaultStr;
                        this.implementationOfOtherLeandingConditData=this.applyDetail.implementationOfOtherLeandingConditData?this.applyDetail.implementationOfOtherLeandingConditData:defaultStr;
                        console.log('风控经理---'+ this.improvementData);
                    }                  

                    if ( this.task_def_id != undefined && this.task_def_id != "" ){
                        this.updateWkfNodeNo(this.task_def_id);
                    }
                    this.getData();
                    console.log(this.task_def_id);
                    
                    //初始化 “要件资料” 数据
                    this.$store.dispatch('approval_common_store/processFileData');

                } else {
                    console.error('Unexpected API response:', response);
                }
                //（6）隐藏正在加载中的效果
                this.updateCommonLoading(false);
            })
            .catch(error => {
                this.updateCommonLoading(false);
                console.error('Error in API chain:', error);
            });
        },
        /**
         * 页面初始入口
         */
        async load(){
            this.updateCommonLoading(true);
            this.updateAppName('loan');
            await nextTick();
            try {
                //路由，处理通用数据
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
        },
    },
    watch: {
        commonActiveTab(newValue) {
            if (newValue === 'details') {
                this.load();
            }
        },
    },
    mounted() {
        this.load();        
    }
};
</script>