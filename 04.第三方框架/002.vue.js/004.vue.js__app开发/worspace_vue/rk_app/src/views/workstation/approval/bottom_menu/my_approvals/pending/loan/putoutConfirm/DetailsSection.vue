<template>

    <div class="details-form-title">放款信息</div>

    <div class="details-form">
        <div class="details-form-row">
            <div class="details-form-label">合同编号</div>
            <div class="details-form-value">{{ payHisEntity.pactNo }}</div>
        </div>
        <div class="details-form-row">
            <div class="details-form-label">项目申请号</div>
            <div class="details-form-value">{{ payHisEntity.applyNo }}</div>
        </div>
        <div class="details-form-row">
            <div class="details-form-label">合同名称</div>
            <div class="details-form-value">{{ payHisEntity.payPactName }}</div>
        </div>
        <div class="details-form-row">
            <div class="details-form-label">客户名称</div>
            <div class="details-form-value">{{ payHisEntity.cusName }}</div>
        </div>
        <div class="details-form-row">
            <div class="details-form-label">产品名称</div>
            <div class="details-form-value">{{ payHisEntity.productName }}</div>
        </div>
        <div class="details-form-row">
            <div class="details-form-label">合同金额</div>
            <div class="details-form-value">{{ payHisEntity.pactAmt }}</div>
        </div>
        <div class="details-form-row">
            <div class="details-form-label">项目累计申请支付金额</div>
            <div class="details-form-value">{{ payHisEntity.dueChildAmtReally }}</div>
        </div>
        <div class="details-form-row">
            <div class="details-form-label">项目累计支付金额</div>
            <div class="details-form-value">{{ payHisEntity.dueChildAmtPayReally }}</div>
        </div>
        <div class="details-form-row">
            <div class="details-form-label">本次支付金额</div>
            <div class="details-form-value">{{ payHisEntity.payDueAmt }}</div>
        </div>
        <div class="details-form-row">
            <div class="details-form-label">还款方式</div>
            <div class="details-form-value">
                {{ 
                    loanDueEntity.repayTypeExpand === '1' ? '一次性' : 
                    loanDueEntity.repayTypeExpand === '2' ? '分期' : 
                    loanDueEntity.repayTypeExpand 
                }}
            </div>
        </div>
        <div class="details-form-row">
            <div class="details-form-label">本次计划付款日期</div>
            <div class="details-form-value">
                {{ 
                    formattedDueBeginDate
                }}
            </div>
        </div>
        <div class="details-form-row">
            <div class="details-form-label">合同期限</div>
            <div class="details-form-value">
                {{payHisEntity.term}}{{ payHisEntity.termType === '1' ? '个月' : payHisEntity.termType === '2' ? '天' : '未知' }}
            </div>
        </div>
        <div class="details-form-row">
            <div class="details-form-label">担保方式</div>
            <div class="details-form-value">
                {{ formattedVouType }}
            </div>
        </div>
        <div class="details-form-row">
            <div class="details-form-label">还款日</div>
            <div class="details-form-value">
                {{ 
                    payHisEntity.repayDateSet === '1' ? '贷款发放日' : 
                    payHisEntity.repayDateSet === '2' ? '月末' : 
                    payHisEntity.repayDateSet === '3' ? '固定还款日' : 
                    payHisEntity.repayDateSet 
                }}
            </div>
        </div>
        <div  v-if="payHisEntity.repayDateSet === 3" class="details-form-row">
            <div class="details-form-label">固定还款日</div>
            <div class="details-form-value">
                {{ 
                    payHisEntity.repayDate
                }}
            </div>
        </div>
        <div class="details-form-row">
            <div class="details-form-label">贷款用途</div>
            <div class="details-form-value">
                {{ 
                    payHisEntity.loanType === '1' ? '流动资金贷款' : 
                    payHisEntity.loanType === '2' ? '固定资产贷款' : 
                    payHisEntity.loanType 
                }}
            </div>
        </div>
        <div class="details-form-row">
            <div class="details-form-label">款项用途</div>
            <div class="details-form-value">
                {{ 
                    payHisEntity.purpose === '0' ? '其他资金支付' : 
                    payHisEntity.purpose === '1' ? '工程资金支付' : 
                    payHisEntity.purpose === '2' ? '投资资金支付' : 
                    payHisEntity.purpose === '3' ? '筹资资金支付' : 
                    payHisEntity.purpose === '4' ? '业务类采购资金支付' : 
                    payHisEntity.purpose === '5' ? '服务类采购资金支付' : 
                    payHisEntity.purpose === '6' ? '办公用品购置资金支付' : 
                    payHisEntity.purpose === '7' ? '公司内部银行资金调度' : 
                    payHisEntity.purpose 
                }}
            </div>
        </div>
        <div class="details-form-row">
            <div class="details-form-label">申请意见</div>
            <div class="details-form-value">
                {{ 
                    payHisEntity.applicationComments
                }}
            </div>
        </div>
    </div>

    <div class="details-form-title"> 账户信息</div>
    <div class="details-form">
        <div class="details-form-row">
            <div class="details-form-label">付款账号</div>
            <div class="details-form-value">
                {{ 
                    payHisEntity.platAccountNo
                }}
            </div>
        </div>
        <div class="details-form-row">
            <div class="details-form-label">付款账号开户行</div>
            <div class="details-form-value">
                {{ 
                    payHisEntity.platBankName
                }}
            </div>
        </div>
        <div class="details-form-row">
            <div class="details-form-label">付款账号名称</div>
            <div class="details-form-value">
                {{ 
                    payHisEntity.platAccountName
                }}
            </div>
        </div>
        <div class="details-form-row">
            <div class="details-form-label">客户账号</div>
            <div class="details-form-value">
                {{ 
                    payHisEntity.repayAccountNo
                }}
            </div>
        </div>
        <div class="details-form-row">
            <div class="details-form-label">客户账号开户行</div>
            <div class="details-form-value">
                {{ 
                    payHisEntity.repayBankName
                }}
            </div>
        </div>
        <div class="details-form-row">
            <div class="details-form-label">客户账号名称</div>
            <div class="details-form-value">
                {{ 
                    payHisEntity.repayAccountName
                }}
            </div>
        </div>

        <div v-if="fundsPaymentPlan.length > 0" class="details-form-list">
            <div class="details-form-list-title">
                <div class="details-form-list-cell">期数</div>
                <div class="details-form-list-cell">支付金额</div>
                <div class="details-form-list-cell">付款账号</div>
                <div class="details-form-list-cell">付款账号开户行</div>
            </div>
            
            <div v-for="(item, index) in fundsPaymentPlan" :key="index" class="details-form-list-row">
                <div class="details-form-list-cell">{{ item.termNum }}</div>
                <div class="details-form-list-cell">{{ item.prcpAmt }}</div>
                <div class="details-form-list-cell">{{ item.putoutAccountNo }}</div>
                <div class="details-form-list-cell">{{ item.putoutBankName }}</div>
            </div>
        </div>

    </div>

</template>

<script>

import '@/assets/styles/workstation/approval/details-section.css';

import { mapActions } from 'vuex';

export default {
    name: 'DetailsSection',
    props: {
        payHisEntity: {
            type: Object,
            required: true
        },
        loanDueEntity:{
            type: Object,
            required: true
        },
        fundsPaymentPlan:{
            type: Array,
            required: true
        }
    },
    computed: {
        formattedDueBeginDate() {
            if (!this.payHisEntity.dueBeginDate) {
                return '未知日期'; // 处理未定义的日期
            }
            const date = new Date(this.payHisEntity.dueBeginDate.replace('+08:00','z'));
            if (isNaN(date.getTime())) {
                return '无效日期'; // 处理无效的日期
            }
            return date.toISOString().split('T')[0]; // 格式化为 yyyy-mm-dd
        },
        formattedVouType() {
            if (!this.payHisEntity.vouType) return '无担保方式';
            const vouTypeMap = {
                '1': '信用',
                '2': '保证',
                '3': '抵押',
                '4': '质押'
            };
            return this.payHisEntity.vouType
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
<style scoped>

</style>
