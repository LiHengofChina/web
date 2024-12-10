
// src/store/workstation/approval/common/approval-common-store.js

const state = {

    opinionPanelToggleShow: true,        //是否显示底部操作栏

    queryTaskType: null,                 //查询的任务类型    0-查询未审批    1-查询已审批

    commonLoading: false,           //是否显示正在加载中的效果
    commonActiveTab: 'details',     //默认激活的Tab

    commonApplyId: null,            // 申请id
    commonMainId: null,             // Main的id
    commonTaskId: null,             // 任务ID
    commonBizId: null,              // Biz ID
    commonCusId: null,              // Customer ID
    commonTraceNo: null,             // Trace Number
    commonDueId: null,              // 放贷的id
    commonPactId: null,             // 合同的id
    commonEntrance: 'apply',        // 文件的查看阶段

    noValidateApproveType: null,    //用于判断是否是 “需要校验的审批类型”
    needValidate: true, // 是否需要校验参数。同意——需要校验，退回——不需要校验


    showOpinionPanel: false,        // “是否显示” 评论面板 
    userSelectVisible: false,       // “是否显示”审批人面板 




    //====================== 选择审批人
    pageNo: 1,                      // 审批人列表分页 - 第几页
    pageSize: 10,                   // 审批人列表分页 - 每页多少条
    totalCount: 0,                  // 数据总条数，用于判断是否还有更多数据
    assignList: [],                 // 存储审批人列表
    activeUserList: [],             //选中的审批人

    assignListQueryParam: '',       //查询审批人的参数

    //====================== 审批意见
    approvalDescription: '',        //审批意见
    clickButtonApproveType: '',     // 当前点击的 “按钮的类型”
    clickButtonApproveIdea: '',     // 当前点击按钮的“idea”
    clickButtonId: '',              // 当前点击按钮的“id”

    //====================== 目标审批节点
    showTargetNodeSelect: false,    // 是否显示 "节点选择"
    targetNodeId: '',               // 选择的目标节点ID
    queryTagetNodeMethod: '',       // 查询“目标节点列表的方法”

    prdUniqueVal: '',                // 产品的唯一标识（产品编号）
    flowNo: '',                      // 流程号（流程编号）
    wkfNodeNo: '',                   // 流程中的节点标识 （节点编号） nodeNo
    appName: '',                 //服务名

    nextUserId: '',                  // 下一步的审批人

    node: {
        id: '',
        seqList: []
    },

    approveBtnList: [], // 审批"按钮列表"

    //====================== 要件资料数据
    showImportantDocumentsFlag: false, //是否显示 +号按钮
    showDocumentUploadPanel: false, // 是否显示 “要件资料” 上传面板
    fileListData: {}, // 要件配置面板数据数据
    refreshDocumentPage: false, // 刷新文档Tab标记



    //====================== 评委
    //====================== 评委
    evaluatorSelectVisible: false, // 是否显示评委选择弹窗
    queryJudgesType: '', //查询评委的类型：1-内部评委 2-外部评委




};

const getters = {

    opinionPanelToggleShow: (state) => state.opinionPanelToggleShow,

    queryTaskType: (state) => state.queryTaskType,

    commonLoading: (state) => state.commonLoading,
    commonActiveTab: (state) => state.commonActiveTab,

    commonApplyId: (state) => state.commonApplyId,
    commonMainId: (state) => state.commonMainId,
    commonTaskId: (state) => state.commonTaskId,
    commonBizId: (state) => state.commonBizId,
    commonCusId: (state) => state.commonCusId,
    commonTraceNo: (state) => state.commonTraceNo,
    commonDueId: (state) => state.commonDueId,
    commonPactId: (state) => state.commonPactId,
    commonEntrance: (state) =>state.commonEntrance,

    noValidateApproveType: (state) => state.noValidateApproveType,
    needValidate: (state) => state.needValidate,

    showOpinionPanel: (state) => state.showOpinionPanel,
    userSelectVisible: (state) => state.userSelectVisible,
    showDocumentUploadPanel: (state) => state.showDocumentUploadPanel,


    //======
    pageNo: (state) => state.pageNo,
    pageSize: (state) => state.pageSize,
    totalCount: (state) => state.totalCount,
    assignList: (state) => state.assignList,
    activeUserList: (state) => state.activeUserList,
    assignListQueryParam: (state) => state.assignListQueryParam,
    //======
    approvalDescription: (state) => state.approvalDescription,
    clickButtonApproveType: (state) => state.clickButtonApproveType,
    clickButtonApproveIdea: (state) => state.clickButtonApproveIdea,
    clickButtonId: (state) => state.clickButtonId,

    showTargetNodeSelect: (state) => state.showTargetNodeSelect,
    targetNodeId: (state) => state.targetNodeId,
    queryTagetNodeMethod: (state) => state.queryTagetNodeMethod,

    prdUniqueVal: (state) => state.prdUniqueVal,
    flowNo: (state) => state.flowNo,
    wkfNodeNo: (state) => state.wkfNodeNo,
    appName: (state) => state.appName,
    nextUserId: (state) => state.nextUserId,

    node: (state) => state.node,
    nodeId: (state) => state.node.id,
    nodeSeqList: (state) => state.node.seqList,

    approveBtnList: (state) => state.approveBtnList,

    fileListData: (state) => state.fileListData,

    refreshDocumentPage: (state) => state.refreshDocumentPage,

    showImportantDocumentsFlag: (state) => state.showImportantDocumentsFlag,

    evaluatorSelectVisible: (state) => state.evaluatorSelectVisible,
    queryJudgesType: (state) => state.queryJudgesType,


};

const mutations = {

    setOpinionPanelToggleShow(state, opinionPanelToggleShow) {
        state.opinionPanelToggleShow = opinionPanelToggleShow;
    },
    
    setQueryTaskType(state, queryTaskType) {
        state.queryTaskType = queryTaskType;
    },

    setCommonLoading(state, commonLoading) {
        state.commonLoading = commonLoading;
    },
    setCommonActiveTab(state, commonActiveTab) {
        state.commonActiveTab = commonActiveTab;
    },

    setCommonApplyId(state, commonApplyId) {
        state.commonApplyId = commonApplyId;
    },
    setCommonMainId(state, commonMainId) {
        state.commonMainId = commonMainId;
    },
    setCommonTaskId(state, commonTaskId) {
        state.commonTaskId = commonTaskId;
    },
    setCommonBizId(state, commonBizId) {
        state.commonBizId = commonBizId;
    },
    setCommonCusId(state, commonCusId) {
        state.commonCusId = commonCusId;
    },
    setCommonTraceNo(state, commonTraceNo) {
        state.commonTraceNo = commonTraceNo;
    },
    setCommonDueId(state, commonDueId) {
        state.commonDueId = commonDueId;
    },
    setCommonPactId(state, commonPactId) {
        state.commonPactId = commonPactId;
    },
    setCommonEntrance(state, commonEntrance) {
        state.commonEntrance = commonEntrance;
    },
    setNoValidateApproveType(state, noValidateApproveType) {
        state.noValidateApproveType = noValidateApproveType;
    },
    setNeedValidate(state, needValidate) {
        state.needValidate = needValidate;
    },

    setShowOpinionPanel(state, showOpinionPanel) {
        state.showOpinionPanel = showOpinionPanel;
    },
    setUserSelectVisible(state, userSelectVisible) {
        state.userSelectVisible = userSelectVisible;
    },
    setShowDocumentUploadPanel(state, showDocumentUploadPanel) {
        state.showDocumentUploadPanel = showDocumentUploadPanel;
    },    
    setPageNo(state, pageNo) {
        state.pageNo = pageNo;
    },
    setPageSize(state, pageSize) {
        state.pageSize = pageSize;
    },
    setTotalCount(state, totalCount) {
        state.totalCount = totalCount;
    },
    setAssignList(state, assignList) {
        state.assignList = assignList;
    },
    setActiveUserList(state, activeUserList) {
        state.activeUserList = activeUserList;
    },
    setAssignListQueryParam(state, assignListQueryParam) {
        state.assignListQueryParam = assignListQueryParam;
    },
    setApprovalDescription(state, approvalDescription) {
        state.approvalDescription = approvalDescription;
    },
    setClickButtonApproveType(state, type) {
        state.clickButtonApproveType = type;
    },
    setClickButtonApproveIdea(state, idea) {
        state.clickButtonApproveIdea = idea;
    },
    setClickButtonId(state, id) {
        state.clickButtonId = id;
    },

    setShowTargetNodeSelect(state, showTargetNodeSelect) {
        state.showTargetNodeSelect = showTargetNodeSelect;
    },

    setTargetNodeId(state, targetNodeId) {
        state.targetNodeId = targetNodeId;
    },
    setQueryTagetNodeMethod(state, queryTagetNodeMethod) {
        state.queryTagetNodeMethod = queryTagetNodeMethod;
    },


    setPrdUniqueVal(state, prdUniqueVal) {
        state.prdUniqueVal = prdUniqueVal;
    },
    setFlowNo(state, flowNo) {
        state.flowNo = flowNo;
    },
    setWkfNodeNo(state, wkfNodeNo) {
        state.wkfNodeNo = wkfNodeNo;
    },
    setAppName(state, appName) {
        state.appName = appName;
    },
    setNextUserId(state, nextUserId) {
        state.nextUserId = nextUserId;
    },

    setNodeId(state, nodeId) {
        state.node.id = nodeId;
    },
    setNodeSeqList(state, seqList) {
        state.node.seqList = seqList;
    },
    setNode(state, node) {
        state.node = node; // 用于一次性更新整个 node 对象
    },
    setApproveBtnList(state, approveBtnList) {
        state.approveBtnList = approveBtnList;
    },

    setFileListData(state, payload) {
        state.fileListData = payload;
    },

    setRefreshDocumentPage(state, payload){
        state.refreshDocumentPage = payload;
    },
    setShowImportantDocumentsFlag(state,payload){
        state.showImportantDocumentsFlag = payload;
    },

    setEvaluatorSelectVisible(state,payload){
        state.evaluatorSelectVisible = payload;
    },
    setQueryJudgesType(state,payload){
        state.queryJudgesType = payload;
    },
};

const actions = {

    updateOpinionPanelToggleShow({ commit }, opinionPanelToggleShow) {
        commit('setOpinionPanelToggleShow', opinionPanelToggleShow);
    },

    updateQueryTaskType({ commit }, queryTaskType) {
        commit('setQueryTaskType', queryTaskType);
    },
    
    updateCommonLoading({ commit }, commonLoading) {
        commit('setCommonLoading', commonLoading);
    },
    updateCommonActiveTab({ commit }, { commonActiveTab }) {
        commit('setCommonActiveTab', commonActiveTab);
    },

    updateCommonApplyId({ commit }, commonApplyId) {
        commit('setCommonApplyId', commonApplyId);
    },
    updateCommonMainId({ commit }, commonMainId) {
        commit('setCommonMainId', commonMainId);
    },
    updateCommonTaskId({ commit }, commonTaskId) {
        commit('setCommonTaskId', commonTaskId);
    },
    updateCommonBizId({ commit }, commonBizId) {
        commit('setCommonBizId', commonBizId);
    },
    updateCommonCusId({ commit }, commonCusId) {
        commit('setCommonCusId', commonCusId);
    },
    updateCommonTraceNo({ commit }, commonTraceNo) {
        commit('setCommonTraceNo', commonTraceNo);
    },
    updateCommonDueId({ commit }, commonDueId) {
        commit('setCommonDueId', commonDueId);
    },
    updateCommonPactId({ commit }, commonPactId) {
        commit('setCommonPactId', commonPactId);
    },
    updateCommonEntrance({ commit }, commonEntrance) {
        commit('setCommonEntrance', commonEntrance);
    },
    updateNoValidateApproveType({ commit }, noValidateApproveType) {
        commit('setNoValidateApproveType', noValidateApproveType);
    },
    updateNeedValidate({ commit }, needValidate) {
        commit('setNeedValidate', needValidate);
    },

    updateShowOpinionPanel({ commit }, showOpinionPanel) {
        commit('setShowOpinionPanel', showOpinionPanel);
    },
    updateUserSelectVisible({ commit }, userSelectVisible) {
        commit('setUserSelectVisible', userSelectVisible);
    }, 
    updateShowDocumentUploadPanel({ commit }, showDocumentUploadPanel) {
        commit('setShowDocumentUploadPanel', showDocumentUploadPanel);
    },
    
    updatePageNo({ commit }, pageNo) {
        commit('setPageNo', pageNo);
    },
    updatePageSize({ commit }, pageSize) {
        commit('setPageSize', pageSize);
    },
    updateTotalCount({ commit }, totalCount) {
        commit('setTotalCount', totalCount);
    },
    updateAssignList({ commit }, assignList) {
        commit('setAssignList', assignList);
    },
    updateAssignListQueryParam({ commit }, assignListQueryParam) {
        commit('setAssignListQueryParam', assignListQueryParam);
    },
    updateActiveUserList({ commit }, activeUserList) {
        commit('setActiveUserList', activeUserList);
    },
    updateApprovalDescription({ commit }, payload) {
        commit('setApprovalDescription', payload);
    },
    updateClickButtonApproveType({ commit }, type) {
        commit('setClickButtonApproveType', type);
    },
    updateClickButtonApproveIdea({ commit }, idea) {
        commit('setClickButtonApproveIdea', idea);
    },
    updateClickButtonId({ commit }, id) {
        commit('setClickButtonId', id);
    },
    updateShowTargetNodeSelect({ commit }, showTargetNodeSelect) {
        commit('setShowTargetNodeSelect', showTargetNodeSelect);
    },

    updateTargetNodeId({ commit }, targetNodeId) {
        commit('setTargetNodeId', targetNodeId);
    },
    updateQueryTagetNodeMethod({ commit }, queryTagetNodeMethod) {
        commit('setQueryTagetNodeMethod', queryTagetNodeMethod);
    },
    

    updatePrdUniqueVal({ commit }, prdUniqueVal) {
        commit('setPrdUniqueVal', prdUniqueVal);
    },
    updateFlowNo({ commit }, flowNo) {
        commit('setFlowNo', flowNo);
    },
    updateWkfNodeNo({ commit }, wkfNodeNo) {
        commit('setWkfNodeNo', wkfNodeNo);
    },
    updateAppName({ commit }, appName) {
        commit('setAppName', appName);
    },
    
    updateNextUserId({ commit }, nextUserId) {
        commit('setNextUserId', nextUserId);
    },

    updateNodeId({ commit }, nodeId) {
        commit('setNodeId', nodeId);
    },
    updateNodeSeqList({ commit }, seqList) {
        commit('setNodeSeqList', seqList);
    },
    updateNode({ commit }, node) {
        commit('setNode', node);
    },

    updateApproveBtnList({ commit }, approveBtnList) {
        commit('setApproveBtnList', approveBtnList);
    },

    updateFileListData({ commit }, fileListData) {
        commit('setFileListData', fileListData);
    },
    updateRefreshDocumentPage({ commit }, refreshDocumentPage) {
        commit('setRefreshDocumentPage', refreshDocumentPage);
    },
    
    updateShowImportantDocumentsFlag({ commit }, showImportantDocumentsFlag) {
        commit('setShowImportantDocumentsFlag', showImportantDocumentsFlag);
    },

    updateEvaluatorSelectVisible({ commit }, evaluatorSelectVisible) {
        commit('setEvaluatorSelectVisible', evaluatorSelectVisible);
    },

    updateQueryJudgesType({ commit }, queryJudgesType) {
        commit('setQueryJudgesType', queryJudgesType);
    },

    async getNextUserList({ commit, state }) {
        try {
            const response = await import('@/api/workstation/approval/flowable/flowable_api')
            .then(({ default: api }) => {
                return new Promise((resolve, reject) => {
                    api.getNextUserList(
                            {
                                pageNo: state.pageNo,
                                pageSize: state.pageSize,
                                assignList: state.assignListQueryParam
                            },
                            window.config,
                            response => {
                                if (response.code == 0) {
                            
                                    // 拼接新数据
                                    const updatedAssignList = [...state.assignList, ...response.list.records] || [];
                                    commit('setAssignList', updatedAssignList);
                                    commit('setTotalCount', response.list.total); // 保存总记录数

                                    //面板显示
                                    commit('setUserSelectVisible', true);
                                    commit('setShowOpinionPanel', false);

                                } else {
                                    commit('setCommonLoading', false);
                                    window.$alert(response.msg, "提示", {
                                        type: "error",
                                        confirmButtonText: '确 定',
                                        dangerouslyUseHTMLString: true
                                    });
                                    reject('API Error: ' + (response.msg || 'Unexpected API response'));
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

            return response;
        } catch (err) {
            console.error('Failed to import API module: ', err);
            throw err;
        }
    },

    async getParmDic({commit},{ parmKeys }) {
        if (!parmKeys || parmKeys.length === 0) {
            console.error('Error: parmKeys is missing or empty');
            throw new Error('parmKeys is required and cannot be empty');
        }        
        try {
            const response = await import('@/api/workstation/approval/sys/sys_api')
            .then(({ default: api }) => {
                return new Promise((resolve, reject) => {
                    api.getParmDic(
                            {parmKeys} ,
                            window.config,
                            response => {
                                if (response.code == 0) {
                                    resolve(response);
                                } else {
                                    commit('setCommonLoading', false);
                                    window.$alert(response.msg, "提示", {
                                        type: "error",
                                        confirmButtonText: '确 定',
                                        dangerouslyUseHTMLString: true
                                    }); 
                                    
                                    reject('API Error: ' + (response.msg || 'Unexpected API response'));

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
            return response;
        } catch (error) {
            console.error('Error in API chain:', error);
            throw error;
        }
    },


    async needOperated({ state }) {
        try {
            const response = await import('@/api/workstation/approval/flowable/flowable_api')
                .then(({ default: api }) => {
                    return new Promise((resolve, reject) => {
                        api.needOperated(
                            {
                                taskId: state.commonTaskId, 
                                approveType: state.clickButtonApproveType,  
                                targetNodeId: state.targetNodeId,
                                variables: JSON.stringify({})
                            },
                            window.config,
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
            return response;
        } catch (err) {
            console.error('Failed to import API module: ', err);
            throw err;
        }
    },

    //===================================================== 要件资料
    //===================================================== 要件资料
    async processFileData( { commit, dispatch }  ) {

        dispatch('GetFileData')
        .then(() => {            
            return dispatch('GetFileDataInfo');
        })
        .then(res => { 
            if (res.code == '0') {
                if (res.list.length == 0) {
                    commit('setFileListData', {} );
                    commit('setShowImportantDocumentsFlag', false );
                } else {
                    commit('setFileListData', res ); // “上传面板”中的数据
                    commit('setShowImportantDocumentsFlag', true ); //是否显示 “上传按钮”
                }
            }
            commit('setCommonLoading', false );//关闭加载中效果
        })
        .catch(error => {
            commit('setCommonLoading', false );//关闭加载中效果       
                console.error('Error in API chain:', error);
        });

    },

    async GetFileDataInfo ( {state} ){
        let data = {};
        data.prdUniqueVal = state.prdUniqueVal;
        data.flowNo = state.flowNo;
        data.bizNo = state.commonApplyId;
        data.nodeNo = state.wkfNodeNo;

        return import('@/api/workstation/approval/doc/doc_api')
        .then(({ default: api }) => {
            return new Promise((resolve, reject) => {
                api.findTypeAndList(
                    data, 
                    window.config,
                    res => {
                        resolve(res);
                    }, error => {
                    reject('API Error: ' + error);
                });
            });
        })
        .catch(err => {
            console.error('Failed to import API module: ', err);
            throw err; // 传播错误
        });
    },
    async GetFileData({state}) {

        let data = {};
        data.prdUniqueVal = state.prdUniqueVal;
        data.flowNo = state.flowNo;
        data.bizNo = state.commonApplyId;
        data.nodeNo = state.wkfNodeNo;
        return import('@/api/workstation/approval/doc/doc_api')
        .then(({ default: api }) => {
            return new Promise((resolve, reject) => {
                api.fileAutoInitFun(
                    data, 
                    window.config,
                    res => {
                        if (res.code === 0 && res.data.flag === "1") {
                            resolve();
                        }
                    }, error => {
                        reject('API Error: ' + error);
                    });
                });
        })
        .catch(err => {
            console.error('Failed to import API module: ', err);
            throw err; // 传播错误
        });
    },
    /**
     * 验证文件上传接口
     */
    async checkUpload({ commit , state } , { data }) {

        let importPromise = ``;
        if(state.appName === 'lease'){
            importPromise = import(`@/api/workstation/approval/lease/lease_api`);
        }else if(state.appName === 'loan'){
            importPromise = import(`@/api/workstation/approval/loan/loan_api`);
        }

        return importPromise
        .then(({ default: api }) => {
            return new Promise((resolve, reject) => {
                if(data.ifSkip == '1'){
                    resolve(true);
                }else{
                    api.checkFileUpload(
                        data,
                        window.config,
                        response => {
                            if (response.code == 0) {
                                    resolve(true);                               
                            } else {
                                commit('setCommonLoading', false);
                                window.$alert(response.msg, "提示", {
                                    type: response.msgType,
                                    confirmButtonText: '确 定',
                                    dangerouslyUseHTMLString: true,
                                    callback: action =>{
                                        resolve(false);
                                        console.log(action);
                                    }
                                });
                            }
                        },
                        error => {
                            reject('API Error: ' + error);
                        }
                    );
                }

            });
        })
        .catch(err => {
            console.error('Failed to import API module: ', err);
            throw err;  // Propagate the error
        });
    },
    async submitApprove( context , { params, submitUrl , callback }) {
        return import('@/api/workstation/approval/lease/lease_api')
            .then(({ default: api }) => {
                return new Promise((resolve, reject) => {
                    let data = { params: params };
                    api.submitApprove(
                        data,
                        submitUrl,
                        window.config,
                        response => {
                            if (response.code === 0) {
                                response.msg = response.data.msg;
                                if (callback) {
                                    callback(response);
                                }
                            } else {
                                window.$alert(response.msg, "提示", {
                                    type: "error",
                                    confirmButtonText: '确 定',
                                    dangerouslyUseHTMLString: true
                                });
                                reject('API Error: ' + response.msg); // 失败时调用 reject
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
                throw err;
            });

    },
    async doCommit4Iframe({ dispatch, commit, rootGetters }, { data , submitUrl}) {
        console.log('测试属性traceNo缺失问题');

        console.log(data);
        dispatch('submitApprove', {
            params: JSON.stringify(data),
            submitUrl: submitUrl,
            callback: res => {
                //关闭加载中的效果
                commit('setCommonLoading', false);

                commit('setOpinionPanelToggleShow', false);
                //"底部操作栏"在“提交响应后”的瞬间不显示，防止用户点击 ，其它时候要显示，但要配合 commonLoading决定是否显示

                if (res.code == 0) {
                        window.$message({
                            message: res.msg,
                            type: 'success',
                            customClass: 'custom-el-message-class',
                            duration: 2000,
                            onClose: () => {

                                if (!rootGetters['auth/isExemptionfromlogin']) {
                                    window.history.back();// 代替 t h i s.$router.go(-1)
                                } else {
                                    window.$$$router.push({ name: 'SuccessfulPage' });           
                                    // // 关闭窗口 //TODO，需要wsp协作的sdk支持
                                    // if (window.ksoxz_sdk && typeof window.ksoxz_sdk.closeApp === 'function') {
                                    //     window.ksoxz_sdk.closeApp();
                                    // } else {
                                    //     window.location.href = '/'; //代替 t h i s.$router.push('/');
                                    // }
                                }

                                commit('setOpinionPanelToggleShow', true);
                            }
                        });
    
                } else {
                    window.$alert(res.msg, "提示", {
                        type: "error",
                        confirmButtonText: '确 定',
                        dangerouslyUseHTMLString: true
                    }); 
                }
            }
        });

    },

    async doCommit({ dispatch, state, commit }, { targetNodeId = "", seqList = [], nextUserId = null, listStr = "", callBackFormValue , submitUrl, methodParam } = {}) {
        try {
            //========================（1）把按钮上面的 "approveType" 类型，转换成工作流里面的 "flowType" 类型。
            //========================（1）把按钮上面的 "approveType" 类型，转换成工作流里面的 "flowType" 类型。
            let flowType = "";
            if (state.clickButtonApproveType === '1' && nextUserId != null) {
                flowType = '11';// "同意"
            } else {
                flowType = state.clickButtonApproveType;// "退回"  "否决"
            }

            //=========================（2）数据准备
            //=========================（2）数据准备
            if (state.clickButtonApproveType === '7' || state.clickButtonApproveType === '8') {
                
                //TODO，暂时没有碰到过这个按钮类型，公共组件暂时不处理
                alert("TODO");

            }
            //=========================（2）数据准备
            //=========================（2）数据准备
            let data = {
                taskId: state.commonTaskId,
                flowType: flowType,
                approvalContents: state.approvalDescription,
                approveBtnId: state.clickButtonId,
                approveBtnName: state.clickButtonApproveIdea,
                targetNodeId: targetNodeId ? targetNodeId : "", 
                listStr: listStr ? listStr : "",
                nextUserId: nextUserId,
                seqList: seqList,
                bizMark: state.commonBizId,
                variables: {},
                methodParam: methodParam
            };
            //=========================（3）判断是否需要校验表单
            //=========================（3）判断是否需要校验表单
            if (state.noValidateApproveType.length > 0) {

                const needValidation = !state.noValidateApproveType.some(type => type.optCode === state.clickButtonApproveType);
                commit('setNeedValidate', needValidation);

            }
            //=========================（4）表单校验以及最终提交
            //=========================（4）表单校验以及最终提交
            await  callBackFormValue(
                (res) => {
                    data.appPageData = res;
                    dispatch('doCommit4Iframe', { data , submitUrl});
                },
                state.needValidate                
            );


        } catch (err) {
            console.error('Failed to import API module: ', err);
            throw err;
        }

    },
    /**
     * 重置“审批人数据”
     */
    resetUserSelect({ commit }) {
        commit('setUserSelectVisible', false);
        commit('setAssignList', []);
        commit('setPageNo', 1);
        commit('setTotalCount', 0);
    },
    resetActiveUserList({ commit }) {
        commit('setActiveUserList', []);
    },

    /**
     * 重置 “意见面板” 数据
     */
    resetOpinion({ commit }) {
        commit('setApprovalDescription', '');
        commit('setClickButtonApproveType', '');
        commit('setClickButtonApproveIdea', '');
        commit('setClickButtonId', '');


        //重置目标节点选择和值
        commit('setShowTargetNodeSelect', false);
        commit('setTargetNodeId', '');

    },

};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
};
