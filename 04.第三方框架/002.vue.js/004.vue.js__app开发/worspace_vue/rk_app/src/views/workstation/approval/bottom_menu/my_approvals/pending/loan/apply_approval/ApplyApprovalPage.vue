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
                    <DetailsSection :applyDetail="applyDetail"  />
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

                <!-- 仅在 “风控经理上传评审会纪要” 时显示 -->
                <div v-if="clickButtonApproveType === '1' && task_def_id === 'UserTask_zdfkjll' " class="extra-fields-container">
                    <div class="extra-fields-input-wrapper">
                        <label class="extra-fields-label">
                            <span class="extra-fields-required-marker">*</span>内部评委人员
                        </label>
                        <el-input  v-model="localInteriorUserName" placeholder="请选择"   @click="fetchEvaluator(1)">
                        </el-input>
                    </div>

                    <div class="extra-fields-input-wrapper">
                        <label class="extra-fields-label">
                            <span class="extra-fields-required-marker">*</span>外部评委人员
                        </label>
                        <el-input  v-model="localExternalUserName" placeholder="请选择"   @click="fetchEvaluator(2)">
                        </el-input>
                    </div>

                </div>
            </template>
        </OpinionModal>

        <!-- 审批人选择弹窗 -->
        <UserSelectModal @approveByUser="approveByUser"     />

        <!-- 评委选择弹窗 -->
        <EvaluatorSelectModal @selectEvaluator="selectEvaluator"    />

        <!-- 要件资料面板 -->
        <ImportantDocuments />

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

//审批评审人员界面
import EvaluatorSelectModal from '@/components/workstation/approval/common/EvaluatorSelectModal.vue';


//意见面板
import OpinionModal from "@/components/workstation/approval/common/opinion_modal/OpinionModal.vue";

//要件资料上传组件
import ImportantDocuments from "@/components/workstation/approval/common/file/ImportantDocuments.vue";

/*** 非公共组件 */
import DetailsSection from '@/views/workstation/approval/bottom_menu/my_approvals/pending/loan/apply_approval/DetailsSection.vue';

import '@/assets/styles/workstation/approval/common/approval-public.css';

import { nextTick } from 'vue';

export default {
    name: 'BeforehandApprovalPage',
    components: {
        LoadingIndicator,
        HistoryTimeline,        
        DocumentList,
        OpinionPanelToggle,
        UserSelectModal,
        EvaluatorSelectModal,
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

            //========= loan
            //========= loan
            applyDetail: {},  // 详情数据

            localInteriorUserNo: '', //内部评委人员编号
            localInteriorUserName: '', //内部评委人员姓名

            localExternalUserNo: '',  //外部评委人员编号
            localExternalUserName: '',  //外部评委人员姓名

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

            'clickButtonApproveType',      //当前点击的按钮类型 
            'activeUserList',              //选中的审批人

            'targetNodeId',

            'prdUniqueVal',
            'flowNo',
            'wkfNodeNo',
            'commonMainId',
            'commonApplyId',
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

            'updateEvaluatorSelectVisible',
            'updateQueryJudgesType'

        ]),
        goBack() {
            this.$router.go(-1);
        },

        // //=============================================================================================== 提交发送：点击“确认” 之后
        // //=============================================================================================== 提交发送：点击“确认” 之后        
        getData(){
            let data =  {
                    cusName: this.applyDetail.cusName,
                    productName: this.applyDetail.productName,
                    occType: this.applyDetail.occType,
                    applyName: this.applyDetail.applyName,
                    "标题": "",

                    applyAmtOri: this.applyDetail.applyAmtOri,
                    termOri: this.applyDetail.termOri,
                    termType: this.applyDetail.termType,
                    icType: this.applyDetail.icType,
                    rateShowOri: this.applyDetail.rateShowOri,
                    rateType: this.applyDetail.rateType,
                    repayTypeExpand: this.applyDetail.repayTypeExpand,
                    repayDateSet: this.applyDetail.repayDateSet,
                    repayDate: this.applyDetail.repayDate,                    
                    overQuota: this.applyDetail.overQuota,
                    vouType: this.applyDetail.vouType,
                    repaySource: this.applyDetail.repaySource,
                    fincUseName: this.applyDetail.fincUseName,
                    fincUseSmDes: this.applyDetail.fincUseSmDes,
                    loanType: this.applyDetail.loanType,
                    fincUseDes: this.applyDetail.fincUseDes,

                    firstApprUserNo: this.applyDetail.firstApprUserNo, //业务B角色


                    mngOpName: this.applyDetail.mngOpName,
                    fieldName1: this.applyDetail.fieldName1,
                    fieldName2: this.applyDetail.fieldName2,

                    cusId: this.applyDetail.cusId,
                    productNo: this.applyDetail.productNo,
                    overFloat: this.applyDetail.overFloat,
                    cmpdFloat: this.applyDetail.cmpdFloat,
                    modelId: this.applyDetail.modelId,
                    applyAmt: this.applyDetail.applyAmt,
                    managerName: this.applyDetail.managerName,                    
                    modelName: this.applyDetail.modelName,
                    repayType: this.applyDetail.repayType,                    
                    productVersionNo: this.applyDetail.productVersionNo,
                    rate: this.applyDetail.rate,
                    mngOpNo: this.applyDetail.mngOpNo,
                    mngBrNo: this.applyDetail.mngBrNo,
                    term: this.applyDetail.term,
                    mngBrName: this.applyDetail.mngBrName,
                    managerNo: this.applyDetail.managerNo,
                    rateFloat: this.applyDetail.rateFloat,
                    cmpdRate: this.applyDetail.cmpdRate,
                    lprNumber: this.applyDetail.lprNumber,
                    baseRateType: this.applyDetail.baseRateType,
                    managerOrgNo: this.applyDetail.managerOrgNo,
                    managerOrgName: this.applyDetail.managerOrgName,
                    applyId: this.applyDetail.applyId,
                    authCycle: this.applyDetail.authCycle,
                    overRate: this.applyDetail.overRate,
                    lprFloat: this.applyDetail.lprFloat,
                    baseRate: this.applyDetail.baseRate,
                    approveNodeNo: this.applyDetail.approveNodeNo,

                    interiorUserName: this.applyDetail.interiorUserName || '',
                    externalUserName: this.applyDetail.externalUserName || '',                    
                    interiorUserNo: this.applyDetail.interiorUserNo || '',
                    externalUserNo: this.applyDetail.externalUserNo || '',

                    lawAddress: this.applyDetail.lawAddress || '',
                    applyNo: this.applyDetail.applyNo
            };


            return data;
        },

        /**
         * 提交时的回调函数
         */
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
                            data.applyId = this.commonApplyId;
                            data.mainId = this.commonMainId;
                            data.nextUserId = this.nextUserId;
                            data.seqList = this.$store.getters['approval_common_store/nodeSeqList'];

                            //（5）项目经理提交时有：费用 数据 //TODO

                            //（5） data.repayPlanEntityList  //数据
                            return callback(data);
                        }
                    })
                    .catch(error => {
                        console.error('Check upload failed:', error);
                    });
            }else {
                    //================= 表单数据
                    let data = this.getData();
                    data.applyId = this.commonApplyId;
                    data.mainId = this.commonMainId;
                    return callback(data);    
            }
        },

        /*** 
         * 查询内部或外部评委
         */
        fetchEvaluator(type) {

            this.updateShowOpinionPanel(false);

            //更新查询参数
            this.updateQueryJudgesType(type);

            //打开面板
            this.updateEvaluatorSelectVisible(true);

        },

        /**
         * 设置选中的值
         */
        selectEvaluator(param){

            if(param.queryJudgesType === 1){
                this.localInteriorUserNo = param.selectedEvaluatorList.join(',');
                this.localInteriorUserName = param.selectedEvaluatorNameList.join(',');

                this.applyDetail.interiorUserNo = this.localInteriorUserNo;
                this.applyDetail.interiorUserName = this.localInteriorUserName;

            }else if(param.queryJudgesType === 2){
                this.localExternalUserNo = param.selectedEvaluatorList.join(',');
                this.localExternalUserName = param.selectedEvaluatorNameList.join(',');

                this.applyDetail.externalUserNo = this.localExternalUserNo;
                this.applyDetail.externalUserName = this.localExternalUserName;

            }


        },
        /**
         * 初始化额外的字段
         */
        initializeExtraFields() {

            this.localInteriorUserNo = this.applyDetail.interiorUserNo || '';
            this.localInteriorUserName = this.applyDetail.interiorUserName || '';

            this.localExternalUserNo = this.applyDetail.externalUserNo || '';
            this.localExternalUserName = this.applyDetail.externalUserName || '';

        },

        //=============================================================================================== 提交
        //=============================================================================================== 提交
        /**
         * 需要审批人：提交 ,从  UserSelectModal 组件调用。
         */
        approveByUser() {

            if(this.activeUserList.length > 0){

                //确认并清空数据
                this.resetUserSelect();//确认框弹出之前：关闭"用户选择" 面板

                this.$confirm(
                    '此操作将提交该笔业务, 是否继续?',
                    '提示',
                    {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                    }
                ).then(async () => {
                        // 开启 Loading
                        this.updateCommonLoading(true);

                        //审批人
                        let opNo = this.activeUserList.join(",");

                        this.updateNextUserId(opNo);
                        this.resetActiveUserList();

                        // 执行提交操作
                        // “选人后” 提交
                        const submitUrl = `/${this.$config.servers.loan}/approve/apply/loanApplyHis/submitApprove`;
                        console.log("下一阶段审批人：" + opNo);
                        await this.$store.dispatch('approval_common_store/doCommit', {
                            targetNodeId: this.targetNodeId,
                            seqList: this.$store.getters['approval_common_store/nodeSeqList'],
                            nextUserId: opNo,
                            listStr: "",
                            callBackFormValue: this.callBackFormValue,
                            submitUrl: submitUrl,
                            methodParam: {
                                applyId: this.commonApplyId,
                                cusId: this.commonCusId,
                                mainId: this.commonMainId,
                                traceNo: this.commonTraceNo
                            }
                        });

                        console.log("--点击ok--");
                }).catch(() => {
                    this.$store.dispatch('approval_common_store/resetOpinion');
                    console.log("--点击取消--");
                });
            }else{
                this.$alert("请选择审批人员", "提示", {
                    type: "error",
                    confirmButtonText: '确 定',
                    dangerouslyUseHTMLString: true
                });
            }
        },
        /**
         * 提交的入口
         */
        sendApproval() {
            //（1）获取系统参数：哪些审批需要校验表单
            this.getParmDic({parmKeys:["PLT_NO_VALIDATE_APPROVE_TYPE"]})
            .then(res => {
                this.updateNoValidateApproveType(res.data.PLT_NO_VALIDATE_APPROVE_TYPE);


                //====================== 仅在 “风控经理上传评审会纪要” 时校验这两个参数
                if( this.clickButtonApproveType === '1' && this.task_def_id === 'UserTask_zdfkjll'){

                    //内部评委人员
                    if(!this.localInteriorUserNo){
                        this.$alert('请选择内部评委人员', '提示', {
                            confirmButtonText: '确 定',
                            type: 'warning',
                        });
                        throw new Error("Missing localInteriorUserNo"); // 抛出错误中断 Promise 链
                    }
                    //外部评委人员
                    if(!this.localExternalUserNo){
                        this.$alert('请选择外部评委人员', '提示', {
                            confirmButtonText: '确 定',
                            type: 'warning',
                        });
                        throw new Error("Missing localExternalUserNo"); // 抛出错误中断 Promise 链
                    }
                }

                //（2）调用工作流接口，获取下一节点相关信息
                return this.needOperated();
            })
            .then(res => {
                if (res.code == 0) {

                    //（3）判断是否需要审批人
                    //-------------------------------------需要指定人员
                    if (res.hasComplete === 0) {

                        this.$store.dispatch('approval_common_store/updateNode', {
                            id: res.result.targetFlowId,
                            seqList: res.result.seqList[0]
                        });

                        //========= 查询下一步的用户列表
                        if(res.result.assignList){
                            //更新查询参数
                            this.updateAssignListQueryParam(res.result.assignList);
                            this.getNextUserList();
                        }

                    }else{ //-------------------------------------不需要指定人员

                        this.updateShowOpinionPanel(false);//确认框弹出之前：关闭"评审内容" 面板
                        this.$confirm(
                            '此操作将提交该笔业务, 是否继续?',
                            '提示',
                            {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning',
                            }
                        ).then(async () => {
                            // 开启 Loading
                            this.updateCommonLoading(true);
                            // 执行提交操作
                            // "不选人" 提交
                            const submitUrl = `/${this.$config.servers.loan}/approve/apply/loanApplyHis/submitApprove`;
                            await this.$store.dispatch('approval_common_store/doCommit', {
                                targetNodeId: this.targetNodeId,
                                callBackFormValue: this.callBackFormValue,
                                submitUrl: submitUrl,
                                methodParam: {
                                    applyId: this.commonApplyId,
                                    cusId: this.commonCusId,
                                    mainId: this.commonMainId,
                                    traceNo: this.commonTraceNo
                                }
                            });
                            console.log("--点击ok--");
                        }).catch(() => {
                            this.$store.dispatch('approval_common_store/resetOpinion');
                            console.log("--点击取消--");
                        });
                    }
                } else {
                    this.$alert(res.msg, "提示", {
                        type: "error",
                        dangerouslyUseHTMLString: true
                    });
                }

            }).catch(error => {
                console.error('Error in API chain:', error);
            });
        },

        //=============================================================================================== 页面初始部分 start
        //=============================================================================================== 页面初始部分 start
        /**
         * loan: 查询申请的业务数据
         */
        findApplyApproveInit(applyId) {
            return import('@/api/workstation/approval/loan/loan_api')
                .then(({ default: api }) => {
                    return new Promise((resolve, reject) => {
                        api.findApplyApproveInit(
                            {
                                applyId: applyId
                            },
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

                                    this.updateCommonCusId(cusId);
                                    this.updateCommonApplyId(applyId);
                                    this.updateCommonMainId(mainId);


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
        fetchApplyDetail(task_id, biz_id ) {

            //（1）显示正在加载中的效果
            this.updateCommonLoading(true);

            //（2）获取 “业务申请ID” 和 “审批按钮列表”
            this.getApprovalDetail(task_id, biz_id)
            .then(applyId => {
                
                //（3）判断是否成功获取applyId
                if (!applyId) {
                    throw new Error('No applyId found, skipping second API call');
                }
                //（4）调用详情
                return this.findApplyApproveInit(applyId);
            })
            .then(response => {
                //（5）设置详情数据
                if (response && response.code === 0 && response.data) {

                    this.applyDetail = response.data.loanApplyHis;

                    this.updatePrdUniqueVal(response.data.productNo + response.data.productVersionNo);
                    this.updateFlowNo(response.data.flowNo);
                    this.updateWkfNodeNo(response.data.wkfNodeNo);

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
        },
        showOpinionPanel(newVal) {
            if (newVal) {
                this.initializeExtraFields();
            }
        },        
    },
    mounted() {
        this.load();        
    }
};
</script>