<template>

    <div class="page-layout">

        <!-- Header Section  -->
        <div class="header">
            <i class="fas fa-chevron-left back-icon" @click="goBack"></i>
            <h1 class="title">合同审批</h1>
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
                        <div class="details-form-value">{{ leaseApply.cusName }}</div>
                    </div>
                    <div class="details-form-row">
                        <div class="details-form-label">产品名称</div>
                        <div class="details-form-value">{{ leaseApply.productName }}</div>
                    </div>
                    <div class="details-form-row">
                        <div class="details-form-label">项目名称</div>
                        <div class="details-form-value">{{ leaseApply.applyName }}</div>
                    </div>
                    <div class="details-form-row">
                        <div class="details-form-label">租赁本金</div>
                        <div class="details-form-value">{{ leaseApply.applyAmt }}</div>
                    </div>

                    <div class="details-form-row">
                        <div class="details-form-label">租赁期限</div>
                        <div class="details-form-value">
                            {{ leaseApply.term }}{{ leaseApply.termType === '1' ? '个月' : leaseApply.termType === '2' ? '天' : '' }}
                        </div>                        
                    </div>
                    <div class="details-form-row">
                        <div class="details-form-label">期限类型</div>
                        <div class="details-form-value">
                            {{ leaseApply.termType === '1' ? '月' : leaseApply.termType === '2' ? '天' : '未知' }}
                        </div>                        
                    </div>                    
                    <div class="details-form-row">
                        <div class="details-form-label">还款方式</div>
                        <div class="details-form-value">
                            {{ 
                                leaseApply.leaseRepayType === '0' ? '等额租金后付' : 
                                leaseApply.leaseRepayType === '1' ? '等额租金先付' : 
                                leaseApply.leaseRepayType === '2' ? '自定义还款计划' : 
                                leaseApply.leaseRepayType 
                            }}                            
                        </div>                           
                    </div>
                    <div class="details-form-row">
                        <div class="details-form-label">还款周期</div>
                        <div class="details-form-value">
                            {{ 
                                leaseApply.repayNumType === '1' ? '月' : 
                                leaseApply.repayNumType === '2' ? '3个月' : 
                                leaseApply.repayNumType === '3' ? '6个月' : 
                                leaseApply.repayNumType 
                            }}
                        </div>                        
                    </div>
                    <div class="details-form-row">
                        <div class="details-form-label">申报利率</div>
                        <div class="details-form-value">{{ leaseApply.rate }}%</div>
                    </div>
                    <div class="details-form-row">
                        <div class="details-form-label">利率类型</div>
                        <div class="details-form-value">
                            {{
                                leaseApply.rateType === '1' ? '年利率(%)' :
                                leaseApply.rateType === '2' ? '月利率(‰)' :
                                leaseApply.rateType === '3' ? '日利率(‱)' :
                                leaseApply.rateType === '4' ? '月利率(%)' :
                                '未知类型'
                            }}
                        </div>                                            
                    </div>
                    <div class="details-form-row">
                        <div class="details-form-label">逾期利率</div>
                        <div class="details-form-value">{{ leaseApply.overRate }}%</div>
                    </div>
                    <div class="details-form-row">
                        <div class="details-form-label">LPR利率</div>
                        <div class="details-form-value">{{ leaseApply.baseRate }}%</div>
                    </div>                    

                    <div class="details-form-row">
                        <div class="details-form-label">资金来源</div>
                        <div class="details-form-value">
                            {{
                                leaseApply.capitalSource === '01' ? '股东借款' :
                                leaseApply.capitalSource === '02' ? '自有资金' :
                                leaseApply.capitalSource === '03' ? '外部融资' :
                                leaseApply.capitalSource === '04' ? '其他' :
                                '未知来源'
                            }}
                        </div>                        
                    </div>
                    <div class="details-form-row">
                        <div class="details-form-label">业务类型</div>
                        <div class="details-form-value">
                            {{
                                leaseApply.leaseBusType === '1' ? '售后回租' :
                                leaseApply.leaseBusType === '2' ? '直租' :
                                leaseApply.leaseBusType === '3' ? '租赁资产交易' :
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
                                leaseApply.vouType === '1' ? '信用' : 
                                leaseApply.vouType === '2' ? '保证' : 
                                leaseApply.vouType === '3' ? '抵押' : 
                                leaseApply.vouType === '4' ? '质押' : 
                                '未知方式' 
                            }}
                        </div>                        
                    </div>
                    <div class="details-form-row">
                        <div class="details-form-label">是否购买保险</div>
                        <div class="details-form-value">
                            {{ leaseApply.ifBuyInsurance === '1' ? '是' : leaseApply.ifBuyInsurance === '0' ? '否' : '未知状态' }}
                        </div>
                    </div>
                    <div class="details-form-row">
                        <div class="details-form-label">是否超限额</div>
                        <div class="details-form-value">
                            {{ leaseApply.overQuota === '1' ? '是' : leaseApply.overQuota === '2' ? '否' : '未知状态' }}
                        </div>
                    </div>
                    <div class="details-form-row">
                        <div class="details-form-label">irr</div>
                        <div class="details-form-value">{{ leaseApply.irrTax }}</div>
                    </div>
                    <div class="details-form-row">
                        <div class="details-form-label">xirr</div>
                        <div class="details-form-value">{{ leaseApply.xirrTax }}</div>
                    </div>

                    <div class="details-form-row">
                        <div class="details-form-label">项目来源</div>
                        <div class="details-form-value">{{ leaseApply.projectSource }}</div>
                    </div>
                    <div class="details-form-row">
                        <div class="details-form-label">项目说明</div>
                        <div class="details-form-value">{{ leaseApply.applyRemark }}</div>
                    </div>
                    <div class="details-form-row">
                        <div class="details-form-label">租赁标的物</div>
                        <div class="details-form-value">{{ leaseApply.subjectMatterOfLease }}</div>
                    </div>
                    <div class="details-form-row">
                        <div class="details-form-label">资金用途</div>
                        <div class="details-form-value">{{ leaseApply.useOfFunds }}</div>
                    </div>
                    <div class="details-form-row">
                        <div class="details-form-label">还款来源</div>
                        <div class="details-form-value">{{ leaseApply.repaymentSource }}</div>
                    </div>
                    <div class="details-form-row">
                        <div class="details-form-label">担保措施</div>
                        <div class="details-form-value">{{ leaseApply.guaranteeMeasures }}</div>
                    </div>

                </div>

                <div class="details-form-title">初步租赁方案</div>
                <div class="details-form">

                    <div class="details-form-row">
                        <div class="details-form-label">主营项目</div>
                        <div class="details-form-value">{{ leaseApply.mainProjects }}</div>
                    </div>
                    <div class="details-form-row">
                        <div class="details-form-label">行业归属</div>
                        <div class="details-form-value">{{ leaseApply.industryAffiliation }}</div>
                    </div>
                    <div class="details-form-row">
                        <div class="details-form-label">客户情况概述</div>
                        <div class="details-form-value">{{ leaseApply.customerSituation }}</div>
                    </div>
                    <div class="details-form-row">
                        <div class="details-form-label">备注</div>
                        <div class="details-form-value">{{ leaseApply.remark }}</div>
                    </div>
                    <div class="details-form-row">
                        <div class="details-form-label">业务A角</div>
                        <div class="details-form-value">{{ leaseApply.mngOpName }}</div>
                    </div>
                    <div class="details-form-row">
                        <div class="details-form-label">业务B角</div>
                        <div class="details-form-value">{{ leaseApply.busUserName }}</div>
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
                                    <span class="history-assignee">处理人：{{ timeline.ASSIGNEE_NAME }}</span>
                                    <span class="history-endTime"><i class="fas fa-clock"></i> {{ timeline.END_TIME }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>


            <!-- 文档 -->
            <div v-else-if="activeTab === 'document'">

                <div class="details-form-title">企业融资租赁申请书</div>
                <div class="document-list">
                    <div v-for="(document, index) in documents" :key="index">
                        <div class="document-form-row">
                            <div class="document-form-label">{{ document.name }}</div>                     
                        </div>
                    </div>
                </div>

            </div>

        </div>

        <!-- “意见” 操作栏 -->
        <div class="opinion-panel-toggle">
            <div class="opinion-agree" @click="togglePanel">同意</div>
            <div class="opinion-reject" @click="sendReject">否决</div>
            <div class="opinion-supplement" @click="sendSupplement">返回补充资料</div>            
        </div>


        <!-- “同意”面板 -->
        <transition name="slide-up">

            <div v-if="showPanel" class="opinion-panel-content">

                <div class="opinion-form-section">

                    <!-- 意见标题和发送按钮 -->
                    <div class="opinion-form-row">
                        <label for="approval-description" class="opinion-form-label">
                            <span class="required">*</span> 审批说明
                        </label>
                        
                        <i class="fas fa-chevron-down opinion-arrow-down-icon" @click="togglePanel"></i>

                        <i class="fas fa-paper-plane opinion-send-icon" @click="sendApproval"></i>
                    </div>

                    <!-- 输入意见 -->
                    <textarea id="approval-description" v-model="approvalDescription" rows="7" maxlength="500"></textarea>

                </div>
            </div>

        </transition>


    </div>
</template>




<script>


export default {
    name: 'ApprovalPage1',
    data() {
        return {
            activeTab: 'details',
            approvalDescription: '',
            opinionType: '',
            showModal: false,
            showPanel: false, // 控制面板显示状态
            timeLineData: [],
            opinionOptions: ['同意', '返回补充资料', '否决'], // 单选框选项
            selectedOpinion: '', // 选中的选项
            leaseApply: {
                "cusName": '金牛区星际航行软件开发工作室',
                "productName": '公用事业租赁通',
                "applyName": 'liheng-test-001',
                "applyAmt": 200.00,

                "termType": "1",
                "term": 11,
                "leaseRepayType": "0",
                "repayNumType": "1",

                "rate": 11.00,
                "rateType": "1",   

                "overRate": 1.00,
                "baseRate": 3.650000000,

                "capitalSource": "02",

                "leaseBusType": "1",
                "vouType": "4",

                "applyBeginDate": "2024-08-29T00:00:00.000+08:00",
                "ifBuyInsurance": "0",

                "overQuota": "2",

                "irrTax": 39.650000000,
                "xirrTax": 47.670000000,

                "projectSource": "liheng-test-001",
                "applyRemark": "liheng-test-001",
                "subjectMatterOfLease": "liheng-test-001",
                "useOfFunds": "liheng-test-001",
                "repaymentSource": "liheng-test-001",
                "guaranteeMeasures": "liheng-test-001",

                "mainProjects": "liheng-test-001",
                "industryAffiliation": "liheng-test-001",
                "customerSituation": "liheng-test-001",
                "remark": "/liheng-test-001",
                "mngOpName": "薛蓓蓓",	
                "busUserName": "岳鹏",        

                    
            },

            documents: [
                { name: '售后回租合同', date: '2024-09-01' },
                { name: '担保合同', date: '2024-08-28' },
                { name: '文件3', date: '2024-08-15' }
            ],

        };
    },


    methods: {
        goBack() {
            this.$router.go(-1);
        },
        setActiveTab(tab) {
            this.activeTab = tab;
            if (tab === 'history') {
                this.loadTimeLineData(); // 切换到审批历史标签时加载数据
            }
        },

        togglePanel() {
            this.showPanel = !this.showPanel; // 切换面板显示状态
            console.log("xxx");
        },
        sendSupplement() {
            // 处理否决请求的逻辑
            // alert('返回补充资料已发送');
            // 在这里添加实际的请求发送代码
        },
        sendReject() {
            // 处理否决请求的逻辑
            // alert('否决请求已发送');
            // 在这里添加实际的请求发送代码
        },
        sendApproval() {
            // 处理审批发送的逻辑
            // alert('审批请求已发送');
            // 在这里添加实际的请求发送代码
        },
        loadTimeLineData() {
            // 模拟获取审批历史数据的API调用
            this.timeLineData = [
                {
                    TASK_NAME: '市场运营部门负责人',
                    CREATE_TIME: '2024-08-28 16:44:05',
                    APPROVE_TYPE: '同意',
                    APPROVE_IDEA: '审批意见内容',
                    DURATION: '0天0小时0分46秒',
                    ASSIGNEE_NAME: '张三1',
                    dotcolor: '#1EC5B5',
                    END_TIME: "2024-08-28 16:44:52",
                },
                {
                    TASK_NAME: '市场运营部分管领导',
                    CREATE_TIME: '2024-08-28 16:48:30',
                    APPROVE_TYPE: '同意',
                    APPROVE_IDEA: '审批意见内容',
                    DURATION: '0天0小时3分38秒',
                    ASSIGNEE_NAME: '李四2',
                    dotcolor: '#1EC5B5',
                    END_TIME: "2024-08-28 16:44:52",
                },
                {
                    TASK_NAME: '市场运营部分管领导',
                    CREATE_TIME: '2024-08-28 16:48:30',
                    APPROVE_TYPE: '同意',
                    APPROVE_IDEA: '审批意见内容',
                    DURATION: '0天0小时3分38秒',
                    ASSIGNEE_NAME: '李四3',
                    dotcolor: '#1EC5B5',
                    END_TIME: "2024-08-28 16:44:52",
                },
                {
                    TASK_NAME: '市场运营部分管领导',
                    CREATE_TIME: '2024-08-28 16:48:30',
                    APPROVE_TYPE: '同意',
                    APPROVE_IDEA: '审批意见内容',
                    DURATION: '0天0小时3分38秒',
                    ASSIGNEE_NAME: '李四4',
                    dotcolor: '#1EC5B5',
                    END_TIME: "2024-08-28 16:44:52",
                },
                {
                    TASK_NAME: '市场运营部分管领导',
                    CREATE_TIME: '2024-08-28 16:48:30',
                    APPROVE_TYPE: '同意',
                    APPROVE_IDEA: '审批意见内容',
                    DURATION: '0天0小时3分38秒',
                    ASSIGNEE_NAME: '李四5',
                    dotcolor: '#1EC5B5',
                    END_TIME: "2024-08-28 16:44:52",
                },
                {
                    TASK_NAME: '市场运营部分管领导',
                    CREATE_TIME: '2024-08-28 16:48:30',
                    APPROVE_TYPE: '同意',
                    APPROVE_IDEA: '审批意见内容',
                    DURATION: '0天0小时3分38秒',
                    ASSIGNEE_NAME: '李四6',
                    dotcolor: '#1EC5B5',
                    END_TIME: "2024-08-28 16:44:52",
                },                                                                
            ];
        },
        getTaskName(timeline) {
            return timeline.TASK_NAME;
        },
        resApproveIdea(idea) {
            return idea || '无审批意见';
        },
    },
    computed: {
        formattedApplyBeginDate() {
            const date = new Date(this.leaseApply.applyBeginDate);
            return date.toISOString().split('T')[0]; // 格式化为 yyyy-mm-dd
        }
    },
};
</script>

<style lang="less" scoped>

.page-layout {
    display: flex;
    flex-direction: column;
    width: 100vw; /* 确保页面宽度填满视口 */
    max-width: 100%; /* 限制最大宽度，防止超出视口 */
    height: 100vh;
    overflow: hidden;
    box-sizing: border-box; /* 确保内边距和边框不会导致布局超出 */
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
    overflow-y: auto;
    overflow-x: hidden;
    box-sizing: border-box;
}


/* 详情 ************************ */
.details-form {
    width: 100%; /* 确保表单占据整行 */
    padding: 0; /* 移除内边距 */    
    background-color: #fff;
    box-sizing: border-box; /* 包含内边距和边框 */
}
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
    font-weight: bold;
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
.document-form-label {
    color: #00ADEF; /* 灰色 */
    font-size: 0.9rem;
    text-align: left; /* 左对齐 */
    flex: 1;  
    padding-left: 16%; 
    font-family: 'STZhongsong', '华文中宋', serif;
    box-sizing: border-box; /* 包含内边距和边框 */
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


.opinion-agree, .opinion-reject, .opinion-supplement {
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

.opinion-agree:active, .opinion-reject:active, .opinion-reject:active {
    color: #007BFF; /* 点击时变为指定颜色 */
    box-shadow: 0 4px 16px rgba(0, 174, 239, 0.8); /* 增加阴影的不透明度和模糊半径 */
}






.opinion-agree:not(:last-child)::after, .opinion-supplement:not(:last-child)::after {
    content: '';
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 0.10rem;
    height: 70%; /* 调整竖线的高度 */
    background-color: #ddd; /* 竖线的颜色 */
}




/* “同意” 面板 ************************ */
.opinion-panel-content {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #fff;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    padding: 1rem;
    z-index: 1002;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.2);
    transform: translateY(100%);
}
.opinion-form-section {
    padding: 1rem;
    background-color: #f9f9f9;
    border-top: 1px solid #ddd;
    position: fixed;
    bottom: 1rem; /* 与按钮区域的间距 */
    left: 0;
    right: 0;
    box-sizing: border-box;
}
.opinion-form-section label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: bold;
    text-align: left; /* 标签文本居左对齐 */
}
.opinion-form-section textarea, .opinion-form-section select {
    width: 100%; /* 确保宽度填满可用空间 */
    max-width: 100%; /* 确保不会超出父容器宽度 */
    padding: 0.5rem;
    margin-bottom: 1rem;
    border: 1px solid #ddd;
    border-radius: 0.25rem;
    transition: border-color 0.3s ease;
    box-sizing: border-box;
    appearance: none; /* 移除默认下拉箭头样式以便自定义 */
}

.opinion-form-section textarea:focus, .opinion-form-section select:focus {
    border-color: #007BFF;
    outline: none;
}
.required {
    font-weight: bold;
    color: red; 
    padding-top: 1rem;
    padding-right: 0rem;
    text-align: center; 
    justify-content: center;
}


/* 意见“面板”-顶部 ************************ */
.opinion-form-row {
    display: flex;
    justify-content: space-between; /* 均分子元素间的空间 */
    align-items: center; /* 垂直居中对齐 */
    width: 100%; /* 确保占满可用空间 */
    margin-bottom: 1rem;
}

.opinion-form-label {
    margin: 0; /* 去掉 margin */
    flex: 1; /* 调整 label 所占空间 */
    text-align: left;
    margin: 0; /* 去掉 margin */
}
.opinion-arrow-down-icon {
    margin: 0; /* 去掉 margin */
    font-size: 1.2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%; /* 占满父容器的宽度 */
    flex: 1; /* 调整图标所占空间 */
    text-align: center; /* 图标居中对齐 */
    cursor: pointer; /* 鼠标指针样式 */
}
.opinion-send-icon {
    margin: 0; /* 去掉 margin */
    flex: 1;
    width: 100%; /* 占满父容器的宽度 */
    font-size: 1.2rem;
    cursor: pointer;
    text-align: right;
    margin-right: 1rem;
}
.opinion-send-icon:hover {
    color: #007BFF; /* 当鼠标悬停在按钮上时改变颜色 */
    background-color: transparent; /* 确保没有背景色 */
    box-shadow: none; /* 确保没有阴影 */
    border: none; /* 移除任何边框 */
    outline: none; /* 移除点击后的轮廓 */
}

</style>
