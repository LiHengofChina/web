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
                    <DetailsSection :loanPrepRepayApplyEntity="loanPrepRepayApplyEntity"  :fundsPaymentPlan="fundsPaymentPlan"/>
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
        <UserSelectModal @approveByUser="approveByUser"     />


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


//意见面板
import OpinionModal from "@/components/workstation/approval/common/opinion_modal/OpinionModal.vue";

//要件资料上传组件
import ImportantDocuments from "@/components/workstation/approval/common/file/ImportantDocuments.vue";

/*** 非公共组件 */
import DetailsSection from '@/views/workstation/approval/bottom_menu/my_approvals/pending/loan/loanAfter/DetailsSection.vue';

import '@/assets/styles/workstation/approval/common/approval-public.css';

import { nextTick } from 'vue';

export default {
    name: 'LoanAfterPage',
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

            //========= loan
            //========= loan
            loanPrepRepayApplyEntity: {},  // 


            //支付计划
            fundsPaymentPlan: [],



            dueId: null,
            pactId: null,
            payId: null,
            payFlowId: null,
            prepayId: null,
            
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
            'resetOpinion'
        ]),
        goBack() {
            this.$router.go(-1);
        },

        // //=============================================================================================== 提交发送：点击“确认” 之后
        // //=============================================================================================== 提交发送：点击“确认” 之后        
        getData(){
            let data =  {
                dueNo: this.loanPrepRepayApplyEntity.dueNo,
                cusName: this.loanPrepRepayApplyEntity.cusName,
                applyName: this.loanPrepRepayApplyEntity.applyName,
                applyNo: this.loanPrepRepayApplyEntity.applyNo,
                productName: this.loanPrepRepayApplyEntity.productName,
                pactNo: this.loanPrepRepayApplyEntity.pactNo,
                pactAmt: this.loanPrepRepayApplyEntity.pactAmt,
                rateType: this.loanPrepRepayApplyEntity.rateType,
                rateShow: this.loanPrepRepayApplyEntity.rateShow,
                dueBeginDate: this.loanPrepRepayApplyEntity.dueBeginDate,
                dueEndDate: this.loanPrepRepayApplyEntity.dueEndDate,
                dueAmt: this.loanPrepRepayApplyEntity.dueAmt,
                dueBal: this.loanPrepRepayApplyEntity.dueBal,
                prepayAmt: this.loanPrepRepayApplyEntity.prepayAmt,
                prepayDate: this.loanPrepRepayApplyEntity.prepayDate,
                intstAmt: this.loanPrepRepayApplyEntity.intstAmt,
                penaltyAmt: this.loanPrepRepayApplyEntity.penaltyAmt,
                deductAmt: this.loanPrepRepayApplyEntity.deductAmt,
                createUserName: this.loanPrepRepayApplyEntity.createUserName,
                applyRemark: this.loanPrepRepayApplyEntity.applyRemark,
                remark: this.loanPrepRepayApplyEntity.remark,
                dueId: this.loanPrepRepayApplyEntity.dueId,
                pactId: this.loanPrepRepayApplyEntity.pactId,
                applyId: this.loanPrepRepayApplyEntity.applyId,
                cusId: this.loanPrepRepayApplyEntity.cusId,
                mainId: this.loanPrepRepayApplyEntity.mainId,
                prepayId: this.loanPrepRepayApplyEntity.prepayId,
                cusNo: this.loanPrepRepayApplyEntity.cusNo
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
                            // data.mainId = this.commonMainId;
                            // data.nextUserId = this.nextUserId;
                            // data.seqList = this.$store.getters['approval_common_store/nodeSeqList'];

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
                        const submitUrl = `/${this.$config.servers.loan}/prepay/loanPrepRepayApply/submitApprove`;
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
                            const submitUrl = `/${this.$config.servers.loan}/prepay/loanPrepRepayApply/submitApprove`;
                            await this.$store.dispatch('approval_common_store/doCommit', {
                                targetNodeId: this.targetNodeId,
                                callBackFormValue: this.callBackFormValue,
                                submitUrl: submitUrl,
                                methodParam: {
                                    applyId: this.commonApplyId,
                                    cusId: this.commonCusId,
                                    dueId: this.dueId,
                                    pactId: this.pactId,
                                    payId: this.payId,
                                    payFlowId: this.payFlowId,
                                    prepayId: this.prepayId,
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
         * loan: 根据prepayId查询详情
        */
        findPrepRepayApproveInit(prepayId) {
            return import('@/api/workstation/approval/loan/loan_api')
                .then(({ default: api }) => {
                    return new Promise((resolve, reject) => {
                        api.findPrepRepayApproveInit(
                            {
                                prepayId: prepayId
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

                                    this.payId = response.data.methodParam.payId;
                                    this.dueId = response.data.methodParam.dueId;
                                    this.pactId = response.data.methodParam.pactId;
                                    this.payFlowId = response.data.methodParam.payFlowId;

                                    this.prepayId = response.data.methodParam.prepayId;

                                    resolve(this.prepayId);//委贷-支付审批，这里需要传prepayId

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
        fetchpayHisEntity(task_id, biz_id ) {

            //（1）显示正在加载中的效果
            this.updateCommonLoading(true);

            //（2）获取 “业务申请ID” 和 “审批按钮列表”
            this.getApprovalDetail(task_id, biz_id)
            .then(prepayId => {
                
                //（3）判断是否成功获取prepayId
                if (!prepayId) {
                    throw new Error('No prepayId found, skipping second API call');
                }
                //（4）调用详情
                return this.findPrepRepayApproveInit(prepayId);
            })
            .then(response => {
                //（5）设置详情数据
                if (response && response.code === 0 && response.data) {

                    this.loanPrepRepayApplyEntity = response.data.loanPrepRepayApplyEntity; 
                    
                    console.log("xxxx");

                    this.updatePrdUniqueVal(response.data.productNo + response.data.productVersionNo);
                    this.updateFlowNo(response.data.flowNo);
                    this.updateWkfNodeNo(response.data.wkfNodeNo);
                    
                    //初始化 “要件资料” 数据
                    this.$store.dispatch('approval_common_store/processFileData');
                } else {
                    console.error('Unexpected API response:', response);
                }


                //（6）查询支付计划
                return this.findRepayPlanList();

            })
            .then(response => {

                //支付谋划数据
                this.fundsPaymentPlan = response.list;

                //（7）隐藏正在加载中的效果
                this.updateCommonLoading(false);
            })
            .catch(error => {
                this.updateCommonLoading(false);
                console.error('Error in API chain:', error);
            });
        },
        /**
         * loan:  查询还款计划
        */
        findRepayPlanList() {
            return import('@/api/workstation/approval/loan/loan_api')
                .then(({ default: api }) => {
                    return new Promise((resolve, reject) => {
                        api.findRepayPlanList(
                            {
                                dueId: this.dueId,
                                pageNo: 1,
                                pageSize: -1,
                                dynamicQuery: "",
                                sort: "[]",
                                tableId: "loan/loanDueRepayPlanTable",
                                initQuery:"{\"dueId\":\"" + this.dueId + "\"}"
                            },
                            this.$config,
                            response => {
                                if (response && response.code === 0 && response.list) {
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

                this.fetchpayHisEntity(this.task_id, this.biz_id );
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
    },
    mounted() {
        this.load();        
    }
};
</script>