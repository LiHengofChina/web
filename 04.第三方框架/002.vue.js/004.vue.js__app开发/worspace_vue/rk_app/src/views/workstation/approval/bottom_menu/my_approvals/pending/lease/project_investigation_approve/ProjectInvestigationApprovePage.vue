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
                    <DetailsSection :applyDetail="applyDetail" :leaseApplyHis="leaseApplyHis" />
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

                <div v-if="clickButtonApproveType === '1' && task_def_id === 'bus_investigation_supplement_data' " class="extra-fields-container">
                <!-- 
                只有在“A岗         （task_def_id===bus_investigation_supplement_data）”
                同时点击“提交按钮时”  （clickButtonApproveType===1）
                才会有这部分额外的内容
                -->
                    <div class="extra-fields-input-wrapper">
                        <label class="extra-fields-label">
                            <span class="extra-fields-required-marker">*</span>租赁本金
                        </label>                    
                        <el-input v-model="applyAmt"
                            placeholder="请输入" 
                            @input="handleMoneyYuanInput">
                            <template #suffix>
                                <span class="extra-fields-suffix">（元）</span>
                            </template>
                        </el-input>
                    </div>

                    <div class="extra-fields-input-wrapper">
                        <label class="extra-fields-label">
                            实际用款单位
                        </label>     
                        <el-input v-model="realUseCorp" placeholder="请输入" >
                        </el-input>
                    </div>

                    <div class="extra-fields-input-wrapper">
                        <label class="extra-fields-label">
                            <span class="extra-fields-required-marker">*</span>计划用款时间
                        </label>                    
                        <el-date-picker
                            v-model="planUseDate"
                            type="date"
                            placeholder="请选择"
                            format="YYYY-MM-DD"
                            value-format="YYYY-MM-DD"
                            style="width: 100%;height: 100%;">
                        </el-date-picker>
                    </div>

                    <div class="extra-fields-input-wrapper">
                        <label class="extra-fields-label">
                            <span class="extra-fields-required-marker">*</span>客户情况
                        </label>
                        <el-input
                            v-model="cusSituation"
                            type="textarea"
                            :rows="3"
                            placeholder="请输入">
                        </el-input>                        
                    </div>
                </div>

                <div v-if="clickButtonApproveType === '1' && task_def_id === 'risk_investigation_supplement_data' " class="extra-fields-container">
                    <!-- 
                    只有在 "风控经理"岗 ，提交时，显示这部分
                    -->
                    <div class="extra-fields-input-wrapper">
                        <label class="extra-fields-label">
                            资产结论
                        </label>
                        <el-input
                            v-model="assetResearchConclusions"
                            type="textarea"
                            :rows="3"
                            placeholder="请输入">
                        </el-input>                        
                    </div>
                    <div class="extra-fields-input-wrapper">
                        <label class="extra-fields-label">
                            风控部门调查结论
                        </label>
                        <el-input
                            v-model="riskResearchConclusions"
                            type="textarea"
                            :rows="3"
                            placeholder="请输入">
                        </el-input>                        
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
import DetailsSection from '@/views/workstation/approval/bottom_menu/my_approvals/pending/lease/project_investigation_approve/DetailsSection.vue';

import '@/assets/styles/workstation/approval/common/approval-public.css';

import { nextTick } from 'vue';


export default {
    name: 'ProjectInvestigationApprovePage',
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


            // ========= lease
            // ========= lease
            applyDetail: {},  // 详情数据

            leaseApplyHis: {},

            //========== A岗的字段
            applyAmt: '',
            realUseCorp: '',
            planUseDate: '',
            cusSituation: '',

            //========== 风控经理 节点需要的字段
            assetResearchConclusions: '',   //资产结论
            riskResearchConclusions: '',    //风控部门调查结论


            //========== 风控经理选评委 节点需要的字段
            reviewMeetingDate: '',
            interiorUserName: '',
            externalUserName: '',
            interiorUserNo: '',
            externalUserNo: '',
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

        ]),
        goBack() {
            this.$router.go(-1);
        },

        //=============================================================================================== 提交发送：点击“确认” 之后
        //=============================================================================================== 提交发送：点击“确认” 之后        
        getData(){
            let data = {
                applyNo: this.applyDetail.applyNo,
                applyName: this.applyDetail.applyName,
                cusName: this.applyDetail.cusName,
                productName: this.applyDetail.productName,
                term: this.applyDetail.term,
                termType: this.applyDetail.termType,
                leaseRepayType: this.applyDetail.leaseRepayType,
                repayNumType:this.applyDetail.repayNumType,
                applyBeginDate: this.applyDetail.applyBeginDate,

                applyAmt: this.applyAmt + "",        //租赁本金

                rate: this.applyDetail.rate,
                rateType: this.applyDetail.rateType,
                overRate: this.applyDetail.overRate,
                fieldNameRate: '%',
                baseRate: this.applyDetail.baseRate,
                ifBuyInsurance: this.applyDetail.ifBuyInsurance,

                realUseCorp: this.realUseCorp, //实际用款单位
                planUseDate: this.planUseDate, //计划用款时间
                cusSituation: this.cusSituation, //客户情况

                insuranceRemark: this.applyDetail.insuranceRemark,
                applyRemark: this.applyDetail.applyRemark,
                mngOpName: this.applyDetail.mngOpName,
                busUserName: this.applyDetail.busUserName,
                rateFloat: this.applyDetail.rateFloat || '',

                fincUse: this.applyDetail.fincUse,
                modelId: this.applyDetail.modelId,
                leaseSumAmt: this.applyDetail.leaseSumAmt || '',
                downPaymentsAmt: this.applyDetail.downPaymentsAmt,
                baseRateType: this.applyDetail.baseRateType,
                downPaymentsRate: this.applyDetail.downPaymentsRate,
                lprFloat: this.applyDetail.lprFloat,
                vouType: this.applyDetail.vouType,
                dataSource: this.applyDetail.dataSource,
                categoryId: this.applyDetail.categoryId,
                firstApprUserNo: this.applyDetail.firstApprUserNo,
                overFloat: this.applyDetail.overFloat,
                repayDateSet: this.applyDetail.repayDateSet,
                adjustInterest: this.applyDetail.adjustInterest,
                repayDate: this.applyDetail.repayDate,
                cmpdFloat: this.applyDetail.cmpdFloat,
                fincUseSm: this.applyDetail.fincUseSm,
                lprNumber: this.applyDetail.lprNumber,
                cmpdRate: this.applyDetail.cmpdRate,
                mngOpNo: this.applyDetail.mngOpNo,
                mngBrNo: this.applyDetail.mngBrNo,
                mngBrName: this.applyDetail.mngBrName,
                managerNo: this.applyDetail.managerNo,
                managerOrgNo: this.applyDetail.managerOrgNo,
                managerOrgName: this.applyDetail.managerOrgName,
                authCycle: this.applyDetail.authCycle,
                modelName: this.applyDetail.modelName,
                managerName: this.applyDetail.managerName,
                projectSource: this.applyDetail.projectSource,
                careaInfo: this.applyDetail.careaInfo,
                dayPenaltyRate: this.applyDetail.dayPenaltyRate,
                beginEndPay: this.applyDetail.beginEndPay,
                irrNoTax: this.applyDetail.irrNoTax,
                irrTax: this.applyDetail.irrTax,
                repayCycle: this.applyDetail.repayCycle,
                taxRate: this.applyDetail.taxRate,
                riskOpNo: this.applyDetail.riskOpNo,
                assistOpNo: this.applyDetail.assistOpNo,
                categoryName: this.applyDetail.categoryName,
                childCategoryName: this.applyDetail.childCategoryName,
                repayType: this.applyDetail.repayType,
                icType: this.applyDetail.icType,
                rateAdjustFlag: this.applyDetail.rateAdjustFlag,
                assistOpName: this.applyDetail.assistOpName,
                riskOpName: this.applyDetail.riskOpName,
                firstApprUser: this.applyDetail.firstApprUser,
                applyId: this.applyDetail.applyId,
                mainId: this.applyDetail.mainId,
                
                assetResearchConclusions: this.assetResearchConclusions,//资产结论
                riskResearchConclusions: this.riskResearchConclusions,//风控部门调查结论


                //  风控经理选评委 节点需要的字段————暂时不做
                // reviewMeetingDate: this.reviewMeetingDate,
                // interiorUserName: this.interiorUserName,
                // externalUserName: this.externalUserName,
                // interiorUserNo: this.interiorUserNo,
                // externalUserNo: this.interiorUserNo,

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


                            //（5）项目经理提交时有：费用 数据 //TODO
                            
                            // 新加的3个字段，在这里验证。


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
                        const submitUrl = `/${this.$config.servers.lease}/approve/apply/leaseApplyHis/submitApprove`;
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


                //====================== 首次审批，所有节点，以下值必填。
                if (!this.applyAmt  ) {
                    this.$alert('请输入租赁本金', '提示', {
                        confirmButtonText: '确 定',
                        type: 'warning',
                    });
                    return;
                }

                if (!this.planUseDate || this.planUseDate.trim() === '') {
                    this.$alert('请选择计划用款时间', '提示', {
                        confirmButtonText: '确 定',
                        type: 'warning',
                    });
                    return;
                }

                if (!this.cusSituation || this.cusSituation.trim() === '') {
                    this.$alert('请输入客户情况', '提示', {
                        confirmButtonText: '确 定',
                        type: 'warning',
                    });
                    return;
                }



                // （2）调用工作流接口，获取下一节点相关信息
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
                            const submitUrl = `/${this.$config.servers.lease}/approve/apply/leaseApplyHis/submitApprove`;
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
         * lease: 查询申请的业务数据
         */
        findApplyApproveInit(applyId) {
            return import('@/api/workstation/approval/lease/lease_api')
                .then(({ default: api }) => {
                    return new Promise((resolve, reject) => {
                        api.findApplyApproveInit(
                            {
                                applyId: applyId,
                                approveNodeNo: this.task_def_id
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

        /**
         * 初始化额外的字段
         */
        initializeExtraFields() {

            this.applyAmt = this.leaseApplyHis.applyAmt || '';
            this.realUseCorp = this.leaseApplyHis.realUseCorp || '';
            this.planUseDate = this.leaseApplyHis.planUseDate || '';
            this.cusSituation = this.leaseApplyHis.cusSituation || '';

            this.assetResearchConclusions = this.leaseApplyHis.assetResearchConclusions || '';
            this.riskResearchConclusions = this.leaseApplyHis.riskResearchConclusions || '';
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

                    this.applyDetail = response.data.leaseApply;
            
                    // 初始“意见面板的数据”
                    this.leaseApplyHis = response.data.leaseApplyHis || {};

                    this.updatePrdUniqueVal(response.data.productNo + response.data.productVersionNo);
                    this.updateFlowNo(response.data.flowNo);
                    this.updateWkfNodeNo(response.data.wkfNodeNo);

                    if ( this.task_def_id != undefined && this.task_def_id != "" ){
                        this.updateWkfNodeNo(this.task_def_id);
                    }
                    
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
        },

        handleMoneyYuanInput(value) {

            this.applyAmt = value.replace(/[^\d.]/g, '');

            // 仅保留数字和小数点，并去除开头多余的零
            let str = value.replace(/[^\d.]/g, '').replace(/^0+(?=\d)/, '');
            
            // 保证只有一个小数点
            const parts = str.split('.');
            if (parts.length > 2) {
                str = parts[0] + '.' + parts[1]; // 如果有多个小数点，仅保留第一个
            }

            // 限制小数点后最多两位
            if (parts[1] && parts[1].length > 2) {
                str = parts[0] + '.' + parts[1].substring(0, 2);
            }
            this.applyAmt = str;
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