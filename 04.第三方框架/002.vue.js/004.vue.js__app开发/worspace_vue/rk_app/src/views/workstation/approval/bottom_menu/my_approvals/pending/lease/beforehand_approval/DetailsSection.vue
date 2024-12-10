<template>

    <div class="details-form-title">项目信息</div>
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
                {{ formattedVouType }}
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
</template>

<script>

import '@/assets/styles/workstation/approval/details-section.css';

import { mapActions } from 'vuex';

export default {
    name: 'DetailsSection',
    props: {
        applyDetail: {
            type: Object,
            required: true
        }
    },
    computed: {
        formattedApplyBeginDate() {
            if (!this.applyDetail.applyBeginDate) {
                return '未知日期'; // 处理未定义的日期
            }
            const date = new Date(this.applyDetail.applyBeginDate.replace('+08:00','z'));
            if (isNaN(date.getTime())) {
                return '无效日期'; // 处理无效的日期
            }
            return date.toISOString().split('T')[0]; // 格式化为 yyyy-mm-dd
        },
        formattedVouType() {
            if (!this.applyDetail.vouType) return '无担保方式';
            const vouTypeMap = {
                '1': '信用',
                '2': '保证',
                '3': '抵押',
                '4': '质押'
            };
            return this.applyDetail.vouType
                .split('|')
                .map(type => vouTypeMap[type] || type)
                .join(' | '); 
        }
    },
    methods: {
        ...mapActions('approval_common_store', [
            'updateCommonLoading'
        ]),
    },
    mounted() {
        this.updateCommonLoading(false);
    }
};
</script>