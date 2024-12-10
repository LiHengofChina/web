<template>

    <div class="details-form-title">提前还款信息</div>

    <div class="details-form">
        <div class="details-form-row">
            <div class="details-form-label">借据号</div>
            <div class="details-form-value">{{ loanPrepRepayApplyEntity.dueNo }}</div>
        </div>
        <div class="details-form-row">
            <div class="details-form-label">客户名称</div>
            <div class="details-form-value">{{ loanPrepRepayApplyEntity.cusName }}</div>
        </div>

        <div class="details-form-row">
            <div class="details-form-label">项目名称</div>
            <div class="details-form-value">{{ loanPrepRepayApplyEntity.applyName }}</div>
        </div>
        <div class="details-form-row">
            <div class="details-form-label">项目申请号</div>
            <div class="details-form-value">{{ loanPrepRepayApplyEntity.applyNo }}</div>
        </div>
        <div class="details-form-row">
            <div class="details-form-label">产品名称</div>
            <div class="details-form-value">{{ loanPrepRepayApplyEntity.productName }}</div>
        </div>
        <div class="details-form-row">
            <div class="details-form-label">合同号</div>
            <div class="details-form-value">{{ loanPrepRepayApplyEntity.pactNo }}</div>
        </div>
        <div class="details-form-row">
            <div class="details-form-label">合同金额</div>
            <div class="details-form-value">{{ loanPrepRepayApplyEntity.pactAmt }}</div>
        </div>
        <div class="details-form-row">
            <div class="details-form-label">利率类型</div>
            <div class="details-form-value">
                {{
                    loanPrepRepayApplyEntity.rateType === '1' ? '年利率(%)' :
                    loanPrepRepayApplyEntity.rateType === '2' ? '月利率(‰)' :
                    loanPrepRepayApplyEntity.rateType === '3' ? '日利率(‱)' :
                    loanPrepRepayApplyEntity.rateType === '4' ? '月利率(%)' :
                    '未知类型'
                }}
            </div>                                            
        </div>
        <div class="details-form-row">
            <div class="details-form-label">合同利率</div>
            <div class="details-form-value">
                {{loanPrepRepayApplyEntity.rateShow}}
            </div>
        </div>
        <div class="details-form-row">
            <div class="details-form-label">付款日</div>
            <div class="details-form-value">
                {{ 
                    formattedDueBeginDate
                }}
            </div>
        </div>

        <div class="details-form-row">
            <div class="details-form-label">剩余本金</div>
            <div class="details-form-value">
                {{loanPrepRepayApplyEntity.dueBal}}
            </div>
        </div>
        <div class="details-form-row">
            <div class="details-form-label">提前还款金额</div>
            <div class="details-form-value">
                {{loanPrepRepayApplyEntity.prepayAmt}}
            </div>
        </div>
        
        <div class="details-form-row">
            <div class="details-form-label">提前还款日期</div>
            <div class="details-form-value">
                {{
                    formattedPrepayDate
                }}
            </div>
        </div>
        <div class="details-form-row">
            <div class="details-form-label">提前还款利息</div>
            <div class="details-form-value">
                {{
                    loanPrepRepayApplyEntity.intstAmt
                }}
            </div>
        </div>
        <div class="details-form-row">
            <div class="details-form-label">违约金</div>
            <div class="details-form-value">
                {{
                    loanPrepRepayApplyEntity.penaltyAmt
                }}
            </div>
        </div>
        <div class="details-form-row">
            <div class="details-form-label">优惠金额</div>
            <div class="details-form-value">
                {{
                    loanPrepRepayApplyEntity.deductAmt
                }}
            </div>
        </div>
        
        <div class="details-form-row">
            <div class="details-form-label">业务主办</div>
            <div class="details-form-value">
                {{
                    loanPrepRepayApplyEntity.createUserName
                }}
            </div>
        </div>
        <div class="details-form-row">
            <div class="details-form-label">申请说明</div>
            <div class="details-form-value">
                {{
                    loanPrepRepayApplyEntity.applyRemark
                }}
            </div>
        </div>
        <div class="details-form-row">
            <div class="details-form-label">备注</div>
            <div class="details-form-value">
                {{
                    loanPrepRepayApplyEntity.remark
                }}
            </div>
        </div>
        

    </div>


    <div class="scroll-container">

        <div class="details-form">
            <div v-if="fundsPaymentPlan.length > 0" class="details-form-list">
                <div class="details-form-list-title">
                    <div class="details-form-list-cell">期号</div>
                    <div class="details-form-list-cell">开始日期</div>
                    <div class="details-form-list-cell">结息日</div>
                    <div class="details-form-list-cell">扣息日</div>
                    <div class="details-form-list-cell">应还本金(元)</div>
                    <div class="details-form-list-cell">应还利息(元)</div>
                    <div class="details-form-list-cell">应还本息(元)</div>
                    <div class="details-form-list-cell">期末本金余额(元)</div>
                    <div class="details-form-list-cell">状态</div>
                </div>
                <div v-for="(item, index) in fundsPaymentPlan" :key="index" class="details-form-list-row">
                    <div class="details-form-list-cell">{{ item.termNum }}</div>

                    <div class="details-form-list-cell">{{ formatDate(item.planBegDt) }}        </div>
                    <div class="details-form-list-cell">{{ formatDate(item.expiryIntstDt)  }}   </div>
                    <div class="details-form-list-cell">{{ formatDate(item.planEndDt)  }}       </div>

                    <div class="details-form-list-cell">{{ item.prcpAmt }}</div>
                    <div class="details-form-list-cell">{{ item.normIntst }}</div>
                    <div class="details-form-list-cell">{{ item.prcpIntSum }}</div>
                    <div class="details-form-list-cell">{{ item.prcpBalAfter }}</div>
                    <div class="details-form-list-cell">
                        {{
                            item.outFlag === '0' ? '未还款' :
                            item.outFlag === '1' ? '已还款' :
                            item.outFlag === '2' ? '正常部分还款' :
                            item.outFlag === '3' ? '逾期欠款' :
                            item.outFlag === '4' ? '逾期部分还款' :
                            item.outFlag === '5' ? '提前还款部分还款' :
                            item.outFlag === '6' ? '逾期后本金和利息已经结清' :
                            '未知类型'
                        }}
                    </div>
                </div>
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
        loanPrepRepayApplyEntity: {
            type: Object,
            required: true
        },
        fundsPaymentPlan:{
            type: Array,
            required: true
        }
    },
    computed: {
        formattedPrepayDate() {
            if (!this.loanPrepRepayApplyEntity.prepayDate) {
                return '未知日期'; // 处理未定义的日期
            }
            const date = new Date(this.loanPrepRepayApplyEntity.prepayDate.replace('+08:00','z'));
            if (isNaN(date.getTime())) {
                return '无效日期'; // 处理无效的日期
            }
            return date.toISOString().split('T')[0]; // 格式化为 yyyy-mm-dd
        },

        formattedDueBeginDate() {
            if (!this.loanPrepRepayApplyEntity.dueBeginDate) {
                return '未知日期'; // 处理未定义的日期
            }
            const date = new Date(this.loanPrepRepayApplyEntity.dueBeginDate.replace('+08:00','z'));
            if (isNaN(date.getTime())) {
                return '无效日期'; // 处理无效的日期
            }
            return date.toISOString().split('T')[0]; // 格式化为 yyyy-mm-dd
        },
        formattedVouType() {
            if (!this.loanPrepRepayApplyEntity.vouType) return '无担保方式';
            const vouTypeMap = {
                '1': '信用',
                '2': '保证',
                '3': '抵押',
                '4': '质押'
            };
            return this.loanPrepRepayApplyEntity.vouType
                .split('|')
                .map(type => vouTypeMap[type] || type)
                .join(' | '); 
        }        
    },
    methods: {
        ...mapActions('approval_common_store', [
            'updateCommonLoading'
        ]),
        formatDate(dateStr) {
            if (!dateStr || dateStr.length !== 8) {
                return '未知日期'; // 处理未定义或格式不正确的日期
            }
            const year = dateStr.substring(0, 4);   // 提取年份
            const month = dateStr.substring(4, 6);  // 提取月份
            const day = dateStr.substring(6, 8);    // 提取日期
            return `${year}-${month}-${day}`;       // 拼接为 yyyy-mm-dd 格式
        },
    },
    mounted() {
        this.updateCommonLoading(false);
    }
};
</script>
<style scoped>

</style>
