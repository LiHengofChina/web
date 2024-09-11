<template>

    <div v-if="loading" class="loading-indicator" >
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
    </div>

    <div class="page-layout">

        <!-- Header Section  -->
        <div class="header">
            <i class="fas fa-chevron-left back-icon" @click="goBack"></i>
            <h1 class="title">{{ approve_title }}</h1>
            <div class="spacer"></div>
        </div>

        <!-- 标签部分 -->
        <div class="tabs">
            <div class="tab" :class="{ active: activeTab === 'details' }" @click="setActiveTab('details')">审批详情</div>
            <div class="tab" :class="{ active: activeTab === 'history' }" @click="setActiveTab('history')">审批历史</div>
            <div class="tab" :class="{ active: activeTab === 'document' }" @click="setActiveTab('document')">文档</div>
        </div>

        <!-- 可滚动的内容区域 -->
        <div class="content-area">

            <!-- 详情区域 -->
            <div v-if="activeTab === 'details'">
                <div class="details-form-title">合同信息</div>
                <div class="details-form">
                    <div class="details-form-row">
                        <div class="details-form-label">客户名称</div>
                        <div class="details-form-value">{{ applyDetail.cusName }}</div>
                    </div>
                    <div class="details-form-row">
                        <div class="details-form-label">产品名称</div>
                        <div class="details-form-value">{{ applyDetail.productName }}</div>
                    </div>
                    <div class="details-form-row">
                        <div class="details-form-label">项目名称</div>
                        <div class="details-form-value">{{ applyDetail.applyName }}</div>
                    </div>
                    <div class="details-form-row">
                        <div class="details-form-label">租赁本金</div>
                        <div class="details-form-value">{{ applyDetail.applyAmt }}</div>
                    </div>

                    <div class="details-form-row">
                        <div class="details-form-label">租赁期限</div>
                        <div class="details-form-value">
                            {{ applyDetail.term }}{{ applyDetail.termType === '1' ? '个月' : applyDetail.termType === '2' ? '天' : '' }}
                        </div>                        
                    </div>
                    <div class="details-form-row">
                        <div class="details-form-label">期限类型</div>
                        <div class="details-form-value">
                            {{ applyDetail.termType === '1' ? '月' : applyDetail.termType === '2' ? '天' : '未知' }}
                        </div>                        
                    </div>                    
                    <div class="details-form-row">
                        <div class="details-form-label">还款方式</div>
                        <div class="details-form-value">
                            {{ 
                                applyDetail.leaseRepayType === '0' ? '等额租金后付' : 
                                applyDetail.leaseRepayType === '1' ? '等额租金先付' : 
                                applyDetail.leaseRepayType === '2' ? '自定义还款计划' : 
                                applyDetail.leaseRepayType 
                            }}                            
                        </div>                           
                    </div>
                    <div class="details-form-row">
                        <div class="details-form-label">还款周期</div>
                        <div class="details-form-value">
                            {{ 
                                applyDetail.repayNumType === '1' ? '月' : 
                                applyDetail.repayNumType === '2' ? '3个月' : 
                                applyDetail.repayNumType === '3' ? '6个月' : 
                                applyDetail.repayNumType 
                            }}
                        </div>                        
                    </div>
                    <div class="details-form-row">
                        <div class="details-form-label">申报利率</div>
                        <div class="details-form-value">{{ applyDetail.rate }}%</div>
                    </div>
                    <div class="details-form-row">
                        <div class="details-form-label">利率类型</div>
                        <div class="details-form-value">
                            {{
                                applyDetail.rateType === '1' ? '年利率(%)' :
                                applyDetail.rateType === '2' ? '月利率(‰)' :
                                applyDetail.rateType === '3' ? '日利率(‱)' :
                                applyDetail.rateType === '4' ? '月利率(%)' :
                                '未知类型'
                            }}
                        </div>                                            
                    </div>
                    <div class="details-form-row">
                        <div class="details-form-label">逾期利率</div>
                        <div class="details-form-value">{{ applyDetail.overRate }}%</div>
                    </div>
                    <div class="details-form-row">
                        <div class="details-form-label">LPR利率</div>
                        <div class="details-form-value">{{ applyDetail.baseRate }}%</div>
                    </div>                    

                    <div class="details-form-row">
                        <div class="details-form-label">资金来源</div>
                        <div class="details-form-value">
                            {{
                                applyDetail.capitalSource === '01' ? '股东借款' :
                                applyDetail.capitalSource === '02' ? '自有资金' :
                                applyDetail.capitalSource === '03' ? '外部融资' :
                                applyDetail.capitalSource === '04' ? '其他' :
                                '未知来源'
                            }}
                        </div>                        
                    </div>
                    <div class="details-form-row">
                        <div class="details-form-label">业务类型</div>
                        <div class="details-form-value">
                            {{
                                applyDetail.leaseBusType === '1' ? '售后回租' :
                                applyDetail.leaseBusType === '2' ? '直租' :
                                applyDetail.leaseBusType === '3' ? '租赁资产交易' :
                                '未知类型'
                            }}
                        </div>                        
                    </div>                        
                    <div class="details-form-row">
                        <div class="details-form-label">起租日</div>
                        <div class="details-form-value">{{ formattedApplyBeginDate }}</div>
                    </div>
                    <div class="details-form-row">
                        <div class="details-form-label">担保方式</div>
                        <div class="details-form-value">
                            {{ 
                                applyDetail.vouType === '1' ? '信用' : 
                                applyDetail.vouType === '2' ? '保证' : 
                                applyDetail.vouType === '3' ? '抵押' : 
                                applyDetail.vouType === '4' ? '质押' : 
                                '未知方式' 
                            }}
                        </div>                        
                    </div>
                    <div class="details-form-row">
                        <div class="details-form-label">是否购买保险</div>
                        <div class="details-form-value">
                            {{ applyDetail.ifBuyInsurance === '1' ? '是' : applyDetail.ifBuyInsurance === '0' ? '否' : '未知状态' }}
                        </div>
                    </div>
                    <div class="details-form-row">
                        <div class="details-form-label">是否超限额</div>
                        <div class="details-form-value">
                            {{ applyDetail.overQuota === '1' ? '是' : applyDetail.overQuota === '2' ? '否' : '未知状态' }}
                        </div>
                    </div>
                    <div class="details-form-row">
                        <div class="details-form-label">irr</div>
                        <div class="details-form-value">{{ applyDetail.irrTax }}</div>
                    </div>
                    <div class="details-form-row">
                        <div class="details-form-label">xirr</div>
                        <div class="details-form-value">{{ applyDetail.xirrTax }}</div>
                    </div>

                    <div class="details-form-row">
                        <div class="details-form-label">项目来源</div>
                        <div class="details-form-value">{{ applyDetail.projectSource }}</div>
                    </div>
                    <div class="details-form-row">
                        <div class="details-form-label">项目说明</div>
                        <div class="details-form-value">{{ applyDetail.applyRemark }}</div>
                    </div>
                    <div class="details-form-row">
                        <div class="details-form-label">租赁标的物</div>
                        <div class="details-form-value">{{ applyDetail.subjectMatterOfLease }}</div>
                    </div>
                    <div class="details-form-row">
                        <div class="details-form-label">资金用途</div>
                        <div class="details-form-value">{{ applyDetail.useOfFunds }}</div>
                    </div>
                    <div class="details-form-row">
                        <div class="details-form-label">还款来源</div>
                        <div class="details-form-value">{{ applyDetail.repaymentSource }}</div>
                    </div>
                    <div class="details-form-row">
                        <div class="details-form-label">担保措施</div>
                        <div class="details-form-value">{{ applyDetail.guaranteeMeasures }}</div>
                    </div>

                </div>

                <div class="details-form-title">初步租赁方案</div>
                <div class="details-form">

                    <div class="details-form-row">
                        <div class="details-form-label">主营项目</div>
                        <div class="details-form-value">{{ applyDetail.mainProjects }}</div>
                    </div>
                    <div class="details-form-row">
                        <div class="details-form-label">行业归属</div>
                        <div class="details-form-value">{{ applyDetail.industryAffiliation }}</div>
                    </div>
                    <div class="details-form-row">
                        <div class="details-form-label">客户情况概述</div>
                        <div class="details-form-value">{{ applyDetail.customerSituation }}</div>
                    </div>
                    <div class="details-form-row">
                        <div class="details-form-label">备注</div>
                        <div class="details-form-value">{{ applyDetail.remark }}</div>
                    </div>
                    <div class="details-form-row">
                        <div class="details-form-label">业务A角</div>
                        <div class="details-form-value">{{ applyDetail.mngOpName }}</div>
                    </div>
                    <div class="details-form-row">
                        <div class="details-form-label">业务B角</div>
                        <div class="details-form-value">{{ applyDetail.busUserName }}</div>
                    </div>

                </div>

            </div>

            <!-- 审批历史 -->
            <div v-else-if="activeTab === 'history'">

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
            </div>

            <!-- 文档 -->
            <div v-else-if="activeTab === 'document'">

                <div v-for="(group, groupIndex) in documents.groupList" :key="groupIndex">

                    <!-- 一级标题 -->
                    <div class="details-form-title">{{ group.groupName }}</div>

                    <!-- 过滤并合并相同一级和二级标题下的文件 -->
                    <div class="document-list">
                        <div v-for="(fileGroup, index) in filterAndGroupFiles(group.groupNo)" :key="index">

                            <!-- 二级标题 
                            <div class="document-form-row">
                                <div class="document-form-label-two">{{ fileGroup.firstTypeName }}</div>
                            </div>
                            -->

                            <!-- 三级标题 -->
                            <div class="document-form-row">
                                <div class="document-form-label-three">{{ fileGroup.typeName }}</div>
                            </div>

                            <!-- 文件列表 -->
                            <div v-for="(subFile, subIndex) in fileGroup.fileList" :key="subIndex">
                                <div class="document-form-row">
                                    <div class="document-form-label-doc">{{ subFile.fileName }}</div>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>


                <!-- 浮动“上传”按钮 -->
                <div class="fab" @click="handleFabClick">
                    <i class="fas fa-plus"></i>
                </div>


            </div>

        </div>

        <!-- “意见” 操作栏 -->
        <div v-if="!loading > 0" class="opinion-panel-toggle">
            <div 
                v-for="(btn) in approveBtnList" 
                :key="btn.id" 
                class="opinion-button" 
                @click="openOpinionPanel(btn.approveType)">
                {{ btn.approveIdea }}
            </div>          
        </div>

        <!-- “同意”面板 -->
        <div v-if="showOpinionPanel " class="modal-overlay" @click="cancelApproval"></div>
        <transition name="slide-up">
            <div v-if="showOpinionPanel" class="modal-panel">
                <!-- 意见标题 -->
                <div class="modal-header">
                    <label for="approval-description" class="modal-title">
                        <span v-if="approveType !== '1'" class="required">*</span>
                        审批意见
                    </label>
                </div>

                <!-- 输入意见 -->
                <textarea id="approval-description" v-model="approvalDescription" class="opinion-textarea" rows="7" maxlength="500"></textarea>

                <!-- “取消”和“确定”按钮 -->
                <div class="modal-footer">
                    <div class="modal-spacer-div"></div>
                    <div class="modal-spacer-div"></div>
                    <button class="modal-cancel-button" @click="cancelApproval">取 消</button>
                    <button class="modal-confirm-button" @click="sendApproval">确 定</button>
                </div>

            </div>

        </transition>

        <!-- 审批人选择弹窗 -->
        <div v-if="userSelectVisible" class="modal-overlay" @click="closeUserSelect"></div>
        <transition name="slide-up">
            <div v-if="userSelectVisible" class="user-select-modal-panel" @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd">
                <!-- 弹窗头部 -->
                <div class="modal-header">
                    <div class="modal-title">
                        选择审批人
                    </div>
                </div>
    
                <!-- 审批人表格 -->
                <div class="modal-content">
                    <el-table 
                        :data="assignList" 
                        style="width: 100%" 
                        height="50vh"
                        @selection-change="handleSelectionChange">
                        <el-table-column type="selection"></el-table-column>
                        <el-table-column prop="opNo" label="编号"></el-table-column>
                        <el-table-column prop="opName" label="姓名"></el-table-column>
                        <el-table-column prop="brName" label="机构"></el-table-column>
                    </el-table>
                </div>
    
                <!-- 弹窗底部按钮 -->
                <div class="modal-footer">
                    <div class="modal-spacer-div"></div>
                    <div class="modal-spacer-div"></div>
                    <button class="modal-cancel-button" @click="closeUserSelect">取 消</button>
                    <button class="modal-confirm-button" @click="approveByUser">确 定</button>
                </div>
    
            </div>
        </transition>




    
    </div>
</template>




<script>


export default {
    name: 'ProjectInitiationApprovalPage',
    data() {
        return {
            activeTab: 'details',
            approvalDescription: '',
            documents: {},    // 文件数据
            timeLineData: [], // 审批历史数据
            applyDetail: {},  // 立项详情数据
            loading: true,

            trace_no: null,
            biz_id: null, 
            op_no: null,
            task_def_id: null,
            apply_id: null,
            main_id: null,
            approve_title: null,//标题

            approveBtnList: [],//审批按钮
            approveType: '', // 当前点击的 “按钮的类型”

            task_id: null,


            showOpinionPanel: false,  // 评论面板
            userSelectVisible: false,  // 审批人面板
            

            assignListQueryParam: '',
            assignList: [],            // 存储审批人列表
            pageNo: 1,//审批人列表分页——第几页
            pageSize: 10,//审批人列表分页——每页多少条
            totalCount: 0,// 数据总条数，用于判断是否还有更多数据

            activeUserList: [],//选择的用户
            node: {//审批节点信息
                id: '',
                seqList: []
            }
        };
    },
    methods: {
        goBack() {
            this.$router.go(-1);
        },
        setActiveTab(tab) {
            this.activeTab = tab;
        },
        handleFabClick() {
            // 处理按钮点击事件的逻辑
            console.log("xxxx");
            // 你可以在这里执行任何你想要的操作，例如打开一个表单或弹出一个模态框
        },
        openOpinionPanel(type) {            
            this.approveType = type; // 设置选中的操作类型
            this.approvalDescription = ''; // 清空意见输入框的值
            this.showOpinionPanel = true;
        },
        cancelApproval() {
            // 关闭面板
            this.showOpinionPanel = false;
            // 清除输入内容
            this.approvalDescription = '';
        },

        //=================================================================== "选择人员列表，滑动分页"——开始
        handleSelectionChange(selectedRows) {
            // selectedRows 是当前选中的所有行
            this.activeUserList = selectedRows.map(row => row.opNo);
        },
        handleTouchStart(event) {
            this.touchStartY = event.touches[0].clientY;
        },
        handleTouchMove(event) {
            this.touchEndY = event.touches[0].clientY;
        },
        handleTouchEnd() {
            if (this.touchStartY - this.touchEndY > 50) {
                // 向上滑动 - 加载更多
                this.loadMoreData();
            } else if (this.touchEndY - this.touchStartY > 50) {
                // 向下滑动 - 
                console.log('向下滑动');
            }
        },
        loadMoreData() {
            // 检查是否有更多数据需要加载
            if (this.assignList.length < this.totalCount) {
                this.pageNo++;
                this.getNextUserList();
                console.log("滑动加载");
            } else {
                console.log("没有更多数据了");
            }
        },
        getNextUserList(){
            return import('@/api/workstation/approval/my-approvals')
            .then(({ default: api }) => {
                return new Promise((resolve, reject) => {
                    api.getNextUserList(
                            {
                                pageNo: this.pageNo,
                                pageSize: this.pageSize,
                                assignList: this.assignListQueryParam
                            },
                            this.$config,
                            response => {
                                if (response.code == 0) {
                                    

                                    //数据拼接
                                    this.assignList = [...this.assignList, ...response.list.records] || []; // 拼接新数据
                                    this.totalCount = response.list.total;  // 保存总记录数

                                    //面板显示
                                    this.userSelectVisible = true;
                                    this.showOpinionPanel = false;

                                } else {
                                    this.$alert(response.msg, "提示", {
                                        type: "error",
                                        confirmButtonText: '确定',
                                        dangerouslyUseHTMLString: true
                                    });
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
        //=================================================================== "选择人员列表，滑动分页"——结束
        doCommit(targetNodeId, seqList, nextUserId, listStr) {
            
            console.log("--------xx");
            // this.$confirm(
            //     '此操作将提交该笔业务，是否继续？',
            //     '提示',
            //     {
            //         confirmButtonText: '确定',
            //         cancelButtonText: '取消',
            //         type: 'warning',
            //     }
            // ).then(() => {

            //     console.log("--点击ok--");

            // }).catch(() => {
            //     console.log("--点击取消--");                
            // });

            this.userSelectVisible = false;
            this.showOpinionPanel = false;
        },
        sendApproval() {

            if (this.approveType !== '1' && this.approvalDescription.trim() === '') {
                this.$alert('请填写审批说明',
                    '提示',
                    {
                            confirmButtonText: '确定',
                            type: 'warning',
                    }                    
                );
                return;
            }

            //（1）调用needOperated接口
            this.needOperated(this.task_id, this.approveType)
            .then(res => {

                //（2）判断是否需要设置处理人
                if (res.hasComplete === 0) {//需要指定人员
                    //存储node信息
                    this.node = {
                        id: res.result.targetFlowId,
                        seqList: res.result.seqList[0]
                    };
                    //========= 查询下一步的用户列表
                    if(res.result.assignList){
                        this.assignListQueryParam = res.result.assignList;
                        this.getNextUserList();
                    }

                }else{//不需要指定人员
                    this.doCommit();//“回退”提交
                }

            }).catch(error => {
                console.error('Error in API chain:', error);
            });
        },
        closeUserSelect() {

            this.assignList = []; //取消或关闭窗口时，清空它
            this.pageNo = 1;
            this.totalCount = 0;
            
            this.userSelectVisible = false;
            this.showOpinionPanel = true;
        },
        approveByUser() {

            if(this.activeUserList.length > 0){

                let opNo = this.activeUserList.join(",");
                this.doCommit(this.node.id, this.node.seqList, opNo, ""); //“同意”提交

                this.assignList = []; //取消或关闭窗口时，清空它
                this.pageNo = 1;
                this.totalCount = 0;

            }else{
                this.$alert("请选择审批人员", "提示", {
                    type: "error",
                    confirmButtonText: '确定',
                    dangerouslyUseHTMLString: true
                });
            }
        },
        needOperated(task_id ,approveType){
            return import('@/api/workstation/approval/my-approvals')
                .then(({ default: api }) => {
                    return new Promise((resolve, reject) => {
                        api.needOperated(
                            {
                                taskId: task_id,
                                approveType: approveType,
                                targetNodeId: '',
                                variables: JSON.stringify({})
                            },
                            this.$config,
                            response => {
                                const parsedResponse = typeof response === 'string' ? JSON.parse(response) : response;
                                if (parsedResponse && parsedResponse.code === 0) {
                                    resolve(parsedResponse);
                                } else {
                                    reject('Unexpected API response or empty file list');
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
        getTaskName(timeline) {
            return timeline.TASK_NAME;
        },
        resApproveIdea(idea) {
            return idea || '无审批意见';
        },
        fetchApplyDetail(task_id, trace_no, biz_id, op_no, task_def_id) {
            this.loading = true;
            //（1）获取token
            const token = this.$store.getters['auth/token'];
            const refreshToken = this.$store.getters['auth/refreshToken'];
            if (!token || !refreshToken) {
                console.error('Token or Refresh Token is missing');
                return;
            }
            //（2）获取申请ID
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
                } else {
                    console.error('Unexpected API response:', response);
                }
                //（6）设置 loading 为 false
                this.loading = false;

                //（7）调用审批历史接口
                return this.getTimeLine(trace_no, biz_id, op_no, task_def_id);
            })
            .then(response => {
                //（8）设置审批历史的数据
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
                } else {
                    console.error('Unexpected API response in third call:', response);
                }
                //（9）调用 文件参数列表 接口
                return this.getFileParamList(this.apply_id, this.main_id);
            })
            .then(response => {
                //（10）调用 相关文件列表接口
                return this.relatedFileList(response.data);
            })
            .then(response => {
                //（11）设置 文件列表
                const fileLists = response.data;
                if (fileLists) {

                    this.documents = fileLists;
                    //=================  
                    // 一级标题
                    // this.documents.groupList.forEach(group => {
                    //     console.log(`一级标题：${group.groupName}`);
                    //     this.documents.fileList.forEach(file => {
                    //         // 二级标题
                    //         if (file.parentTypeNo === group.groupNo) {
                    //             console.log(`  二级标题：${file.firstTypeName}`);
                    //             file.fileList.forEach(subFile => {
                    //                 // 三级标题
                    //                 console.log(`    三级标题：${subFile.typeName}`);
                    //                 //文件信息
                    //                 console.log(`      文件名：${subFile.fileName}`);
                    //             });
                    //         }
                    //     });
                    // });

                } else {
                    console.warn('No files found in fileList');
                }
            })
            .catch(error => {
                console.error('Error in API chain:', error);
            });
        },
        filterAndGroupFiles(groupNo) {
                return this.documents.fileList.filter(file => file.parentTypeNo === groupNo) // 匹配一级标题
                .map(file => {
                    return {
                        firstTypeName: file.firstTypeName, // 二级标题
                        typeName: file.typeName,           // 三级标题
                        fileList: file.fileList            // 文件列表
                    };
                });
        },
        relatedFileList(FileParamList){
            return import('@/api/workstation/approval/my-approvals')
                .then(({ default: api }) => {
                    return new Promise((resolve, reject) => {
                        api.relatedFileList(
                            FileParamList,
                            this.$config,
                            response => {
                                if (response && response.code === 0 && response.data) {
                                    resolve(response);
                                } else {
                                    reject('Unexpected API response or empty file list');
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
        getFileParamList(apply_id, main_id ){
            return import('@/api/workstation/approval/my-approvals')
                .then(({ default: api }) => {
                    return new Promise((resolve, reject) => {
                        api.getFileParamList(
                            {applyId: apply_id, mainId: main_id ,entrance: "apply"},
                            this.$config,
                            response => {                                
                                if (response && response.code === 0 && response.data) {
                                    resolve(response);
                                } else {
                                    reject('Unexpected API response or empty task list');
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
        getApprovalDetail(task_id, biz_id) {
            return import('@/api/workstation/approval/my-approvals')
                .then(({ default: api }) => {
                    return new Promise((resolve, reject) => {
                        api.getApprovalDetail(
                            {taskId: task_id, taskType: 0, bizMark: biz_id },
                            this.$config,
                            response => {
                                if (response && response.code === 0 && response.data && response.data.approveBtnList.length > 0) {

                                    this.approveBtnList = response.data.approveBtnList;

                                    const applyId = response.data.methodParam.applyId;
                                    const mainId = response.data.methodParam.mainId;
                                    this.apply_id = applyId;
                                    this.main_id = mainId;
                                    resolve(applyId);

                                } else {
                                    reject('Unexpected API response or empty task list');
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
        findApplyApproveInit(applyId) {
            return import('@/api/workstation/approval/my-approvals')
                .then(({ default: api }) => {
                    return new Promise((resolve, reject) => {
                        api.findApplyApproveInit(
                            {applyId: applyId},
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
        getTimeLine(trace_no, biz_id, op_no, task_def_id) {
            return import('@/api/workstation/approval/my-approvals')
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
    },
    computed: {
        formattedApplyBeginDate() {
            if (!this.applyDetail.applyBeginDate) {
                return '未知日期'; // 处理未定义的日期
            }
            const date = new Date(this.applyDetail.applyBeginDate);
            if (isNaN(date.getTime())) {
                return '无效日期'; // 处理无效的日期
            }
            return date.toISOString().split('T')[0]; // 格式化为 yyyy-mm-dd
        }
    },
    mounted() {
        this.task_id = this.$route.params.task_id;  
        this.trace_no = this.$route.params.trace_no;
        this.biz_id = this.$route.params.biz_id;
        this.op_no = this.$route.params.op_no;
        this.task_def_id = this.$route.params.task_def_id;
        this.approve_title = this.$route.params.approve_title;
        this.fetchApplyDetail(this.task_id, this.trace_no, this.biz_id, this.op_no, this.task_def_id);
    }
};
</script>

<style lang="less" scoped>

html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;  /*禁止上下、左右滚动 */
    scrollbar-width: none;  /* 对于 Firefox：隐藏滚动条*/
    -ms-overflow-style: none;  /* 对于 IE 和 Edge：隐藏滚动条 */    
}
html::-webkit-scrollbar,body::-webkit-scrollbar {  /* 对于 Chrome、Safari 和 Opera ：隐藏滚动条*/
    display: none;
}

.page-layout {
    display: flex;
    flex-direction: column;
    width: 100vw; /* 确保页面宽度填满视口 */
    max-width: 100%; /* 限制最大宽度，防止超出视口 */
    height: 100vh;
    overflow: hidden;
    box-sizing: border-box; /* 确保内边距和边框不会导致布局超出 */
    scrollbar-width: none;  /* 对于 Firefox：隐藏滚动条*/
    -ms-overflow-style: none;  /* 对于 IE 和 Edge：隐藏滚动条 */  
}
.page-layout::-webkit-scrollbar {  /* 对于 Chrome、Safari 和 Opera ：隐藏滚动条*/
    display: none;
}



/* 加载中 ************************ */

.loading-indicator {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh; /* 让加载提示占据全屏 */
    font-size: 1.5rem; /* 调整字体大小 */
    color: #555; /* 设置文字颜色 */
}
.loading-indicator {
    display: flex;
    justify-content: center;
    align-items: center;
}

.dot {
    width: 1rem;
    height: 1rem;
    margin: 0 5px;
    background-color: #ddd;
    border-radius: 50%;
    animation: bounce 0.6s infinite alternate;
}

.dot:nth-child(2) {
    animation-delay: 0.2s;
}

.dot:nth-child(3) {
    animation-delay: 0.4s;
}

@keyframes bounce {
    to {
        transform: translateY(-15px);
    }
}


/* 标题部分 ************************ */
.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 2.5rem;
    background-color: #00ADEF;
    border-bottom: 1px solid #ddd;
    z-index: 1000;
    padding: 0 1rem;
    box-sizing: border-box;
}

.back-icon {
    cursor: pointer;
    font-size: 1.2rem;
    color: #FFFFFF;
}

.title {
    height: 1.5rem;    
    flex: 1;
    text-align: center;
    font-size: 1.2rem;
    color: #FFFFFF;
    margin: 0;
}

.spacer {
    width: 2.8rem;
}

/* Tab 顶部切换卡 ************************ */
.tabs {
    display: flex;
    height: 2.5rem;
    width: 100%;
    max-width: 100%;
    background-color: #FFFFFF;  /**#f0f0f0 */
    border-bottom: 1px solid #ddd;
    top: 2.5rem;
    position: fixed;
    z-index: 1000;
    left: 0;
    right: 0;
    box-sizing: border-box;
}

.tab {
    flex: 1;
    text-align: center;
    padding: 0.5rem 0;
    cursor: pointer;
    color: #808080;
    font-size: 1rem;
    /**  border-right: 1px solid #ddd; */
    box-sizing: border-box;
}

.tab.active {
    /** background-color: #d9d9d9; */
    /** font-weight: bold; */
    color: #007BFF;
    /** border-bottom: 0.1rem solid #007BFF;*/
    position: relative; 
}

.tab.active::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: -2px; /* 根据需要调整位置 */
    transform: translateX(-50%);
    width: 80%; /* 调整下划线的宽度 */
    height: 0.15rem; /* 下划线的高度 */
    background-color: #007BFF; /* 下划线的颜色 */
}

/* 内容区域 ************************ */
.content-area {
    width: 100%; /* 确保表单占据整行 */
    max-width: 100%;
    position: fixed;
    height: calc(100vh - 7.5rem);
    left: 0;
    right: 0;
    flex: 1;
    padding: 0;
    margin-top: 3.8rem;
    padding-bottom: 3.8rem; /* 为底部留出空间，防止内容被覆盖 */
    box-sizing: border-box;
    overflow: hidden;
    overflow-y: auto;  /* 允许垂直滚动 */
    scrollbar-width: none;  /* 对于 Firefox：隐藏滚动条*/
    -ms-overflow-style: none;  /* 对于 IE 和 Edge：隐藏滚动条 */       
}
.content-area::-webkit-scrollbar {  /* 对于 Chrome、Safari 和 Opera ：隐藏滚动条*/
    display: none;
}


/* 详情 ************************ */
.details-form {
    width: 100%; /* 确保表单占据整行 */
    padding: 0; /* 移除内边距 */    
    background-color: #fff;
    box-sizing: border-box; /* 包含内边距和边框 */
}

/** 标题 和 一级标题*/
.details-form-title { 
    width: 100%;
    font-size: 1rem;
    font-weight: bold;
    padding: 0.5rem 0; /* 添加一些内边距 */
    margin-top: 0.3rem;
    padding-left: 0.7rem;
    border-bottom: 1px solid #ddd; /* 添加下边框与其他内容区分 */
    color: #666666; /* 字体颜色 */
    background-color: #f0f0f0;  /**#f0f0f0 */    
    text-align: left; /* 左对齐 */
    font-family: 'STZhongsong', '华文中宋', serif;
    box-sizing: border-box;
}

.details-form-row {

    display: flex;
    width: 100%; /* 确保每一行占据整行 */
    border-bottom: 1px solid #ddd;
    padding: 0.5rem 0;
    box-sizing: border-box; /* 包含内边距和边框 */
    justify-content: space-between;
    align-items: center;

}
.details-form-label {
    color: #666666; /* 灰色 */
    font-size: 0.9rem;
    text-align: right; /* 右对齐 */
    flex: 3; /* 调整为3:7的比例 */
    /*margin-right: 1%;  为值留出一些间距 */
    font-family: 'STZhongsong', '华文中宋', serif;
    box-sizing: border-box; /* 包含内边距和边框 */
}

.details-form-label::after {
    font-size: 0.9rem; 
    content: "：";
    color: #666666;
    margin-left: 0.1rem;
}
.details-form-value {
    color: #666666;
    font-size: 0.9rem;
    text-align: left; /* 左对齐 */
    flex: 7; /* 调整为3:7的比例 */
    font-family: 'STZhongsong', '华文中宋', serif;
    box-sizing: border-box; /* 包含内边距和边框 */
}

/* 审批历史 ************************ */

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
    bottom: 11.625rem;          /* 在最后一个圆圈的底部结束 7.5 + 0.625 */
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



/* 文档样式 ************************ */
.document-list {
    margin-top: 0rem; /* 保持顶部间距 */
    padding: 0rem;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
.document-form-row {

    display: flex;
    width: 100%; /* 确保每一行占据整行 */
    border-bottom: 1px solid #ddd;
    padding: 0.5rem 0;
    box-sizing: border-box; /* 包含内边距和边框 */
    justify-content: space-between;
    align-items: center;

}

/** 二级标题*/
.document-form-label-two {
    font-size: 1rem;
    font-weight: bold;
    color: darkblue; /* 二级标题颜色 */
}
/** 三级标题*/
.document-form-label-three{
    color: #ff9800; /* 三级标题颜色 */
    font-size: 0.9rem;    
    text-align: left; /* 左对齐 */
    flex: 1;  
    padding-left: 1.7rem;
    font-family: 'STZhongsong', '华文中宋', serif;
    box-sizing: border-box; /* 包含内边距和边框 */
}


.document-form-label-doc {
    color: #00ADEF;
    font-size: 0.9rem;
    text-align: left; /* 左对齐 */
    flex: 1;  
    padding-left: 3.7rem;
    font-family: 'STZhongsong', '华文中宋', serif;
    box-sizing: border-box; /* 包含内边距和边框 */
}
/* 浮动（上传）按钮 */
.fab {
    position: fixed;
    bottom: 4rem;       /* 距离页面底部的距离 */
    right: 2rem;        /* 距离页面右侧的距离 */
    width: 3.5rem;      /* 按钮的宽度 */
    height: 3.5rem;     /* 按钮的高度 */
    background-color: #587AFF; /* 按钮的背景颜色 */
    /*  background: linear-gradient(to bottom right, #4A90E2, #0066CC); */
    color: #ffffff; /* 图标的颜色 */
    border-radius: 50%; /* 圆形按钮 */
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2); /* 按钮的阴影效果 */
    cursor: pointer;
    z-index: 1001; /* 确保按钮在其他元素之上 */
}
.fab i {
    font-size: 1.4rem; /* 图标的大小 */
}


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


/* 遮罩层 ************************ */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(112, 138, 140, 0.5); /* 半透明的灰蓝色 */
    z-index: 1001; /* 确保遮罩在所有内容之上 */
}

/* 弹窗面板 ************************ */
.modal-panel {
    border-top: 1px solid #ddd;
    position: fixed;
    box-sizing: border-box;
    bottom: 20%;
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

/* 审批人选择弹窗样式 */
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


</style>
