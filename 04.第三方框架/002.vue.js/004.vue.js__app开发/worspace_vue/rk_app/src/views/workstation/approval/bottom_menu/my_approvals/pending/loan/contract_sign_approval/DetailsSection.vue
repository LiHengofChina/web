<template>

    <div class="details-form-title">放款信息</div>

    <div class="details-form">
        <div class="details-form-row">
            <div class="details-form-label">合同编号</div>
            <div class="details-form-value">{{ loanPactHis.pactNo }}</div>
        </div>
        <div class="details-form-row">
            <div class="details-form-label">项目申请号</div>
            <div class="details-form-value">{{ loanPactHis.applyNo }}</div>
        </div>
        <div class="details-form-row">
            <div class="details-form-label">合同名称</div>
            <div class="details-form-value">{{ loanPactHis.pactName }}</div>
        </div>
        <div class="details-form-row">
            <div class="details-form-label">合同类型</div>
            <div class="details-form-value">{{ loanPactHis.pactType }}</div>
        </div>
        <div class="details-form-row">
            <div class="details-form-label">客户名称</div>
            <div class="details-form-value">{{ loanPactHis.cusName }}</div>
        </div>
        <div class="details-form-row">
            <div class="details-form-label">产品名称</div>
            <div class="details-form-value">{{ loanPactHis.productName }}</div>
        </div>
        
        <div class="details-form-row">
            <div class="details-form-label">合同相对方姓名/名称</div>
            <div class="details-form-value">{{ loanPactHis.pactOtherName }}</div>
        </div>
        <div class="details-form-row">
            <div class="details-form-label">合同相对方地址</div>
            <div class="details-form-value">{{ loanPactHis.pactOtherAddress }}</div>
        </div>
        <div class="details-form-row">
            <div class="details-form-label">合同相对方主体性质</div>
            <div class="details-form-value">{{ loanPactHis.pactOtherType }}</div>
        </div>
        <div class="details-form-row">
            <div class="details-form-label">合同金额</div>
            <div class="details-form-value">{{ loanPactHis.pactAmt }}</div>
        </div>
        <div class="details-form-row">
            <div class="details-form-label">合同期限</div>
            <div class="details-form-value">
                {{loanPactHis.term}}{{ loanPactHis.termType === '1' ? '个月' : loanPactHis.termType === '2' ? '天' : '未知' }}
            </div>
        </div>
        <div class="details-form-row">
            <div class="details-form-label">合同开始日期</div>
            <div class="details-form-value">
                {{formattedPactBeginDate}}
            </div>
        </div>

        <div class="details-form-row">
            <div class="details-form-label">合同结束日期</div>
            <div class="details-form-value">
                {{formattedPactEndDateShow}}
            </div>
        </div>
        <div class="details-form-row">
            <div class="details-form-label">合同利率</div>
            <div class="details-form-value">
                {{loanPactHis.rateShow}}
            </div>
        </div>
        <div class="details-form-row">
            <div class="details-form-label">担保方式</div>
            <div class="details-form-value">
                {{ formattedVouType }}
            </div>
        </div>
        <div class="details-form-row">
            <div class="details-form-label">还款方式</div>
            <div class="details-form-value">
                {{ 
                    loanPactHis.repayTypeExpand === '1' ? '一次性' : 
                    loanPactHis.repayTypeExpand === '2' ? '分期' : 
                    loanPactHis.repayTypeExpand 
                }}     
            </div>
        </div>
        <div class="details-form-row">
            <div class="details-form-label">计息方式</div>
            <div class="details-form-value">
                {{ 
                    loanPactHis.icType === '1' ? '固定利率' : 
                    loanPactHis.icType === '2' ? '按月浮动' : 
                    loanPactHis.icType === '3' ? '按月对日浮动' : 
                    loanPactHis.icType === '4' ? '按季浮动' : 
                    loanPactHis.icType === '6' ? '按年' : 
                    loanPactHis.icType === '7' ? '按年对月对日' : 
                    loanPactHis.icType === '8' ? '立即调整' : 
                    loanPactHis.icType === '9' ? '固定利息' : 
                    loanPactHis.icType === 'A' ? '不适用' : 
                    loanPactHis.icType 
                }}
            </div>
        </div>
        <div class="details-form-row">
            <div class="details-form-label">结束日还本扣息</div>
            <div class="details-form-value">
                {{ 
                    loanPactHis.repayPlanMergeType === '1' ? '否' : 
                    loanPactHis.repayPlanMergeType === '2' ? '是' : 
                    loanPactHis.repayPlanMergeType 
                }} 
            </div>
        </div>
        <div class="details-form-row">
            <div class="details-form-label">还款日类型</div>
            <div class="details-form-value">
                {{ 
                    loanPactHis.repayDateSet === '1' ? '贷款发放日' : 
                    loanPactHis.repayDateSet === '2' ? '月末' : 
                    loanPactHis.repayDateSet === '3' ? '固定还款日' : 
                    loanPactHis.repayDateSet 
                }}
            </div>
        </div>
        <div class="details-form-row">
            <div class="details-form-label">结息日</div>
            <div class="details-form-value">
                {{ loanPactHis.settlementDate }}
            </div>
        </div>
        <div class="details-form-row">
            <div class="details-form-label">扣息日</div>
            <div class="details-form-value">
                {{ loanPactHis.repayDate }}
            </div>
        </div>
        <div class="details-form-row">
            <div class="details-form-label">委托放款银行</div>
            <div class="details-form-value">
                {{ loanPactHis.fundCorpName }}
            </div>
        </div>
        <div class="details-form-row">
            <div class="details-form-label">提前展期时间</div>
            <div class="details-form-value">
                {{ loanPactHis.extenDate }}
            </div>
        </div>
        <div class="details-form-row">
            <div class="details-form-label">手续费支付方式</div>
            <div class="details-form-value">
                {{ 
                    loanPactHis.chargeFeeType === '1' ? '一次性放款，一次性支付手续费' : 
                    loanPactHis.chargeFeeType === '2' ? '一次性放款，按年支付手续费' : 
                    loanPactHis.chargeFeeType === '3' ? '一次性放款，按季支付手续费' : 
                    loanPactHis.chargeFeeType === '4' ? '分笔放款，一次性支付手续费' : 
                    loanPactHis.chargeFeeType === '5' ? '分笔放款，按年支付手续费' : 
                    loanPactHis.chargeFeeType === '6' ? '其他' : 
                    loanPactHis.chargeFeeType === '7' ? '分笔放款，分笔支付手续费' : 
                    loanPactHis.chargeFeeType 
                }}

            </div>
        </div>
        <div class="details-form-row">
            <div class="details-form-label">手续费率</div>
            <div class="details-form-value">
                {{ loanPactHis.serviceFeeRateTxt }}
            </div>
        </div>
        <div class="details-form-row">
            <div class="details-form-label">法律审查情况</div>
            <div class="details-form-value">
                {{ loanPactHis.legalReviewData }}
            </div>
        </div>
        <div class="details-form-row">
            <div class="details-form-label">用印选择</div>
            <div class="details-form-value">
                {{ loanPactHis.useSealData }}
            </div>
        </div>
        <div class="details-form-row">
            <div class="details-form-label">合同签订说明</div>
            <div class="details-form-value">
                {{ loanPactHis.signingInstructions }}
            </div>
        </div>

        <!-- 只有当 loanPactHis.pactApprovalNo 有值时显示 -->
        <div v-if="loanPactHis.pactApprovalNo" class="details-form-row">
            <div class="details-form-label">合同审批表编号</div>
            <div class="details-form-value">{{ loanPactHis.pactApprovalNo }}</div>
        </div>

    </div>

    <div class="details-form-title"> 账户信息</div>

    <div class="details-form">

        <div class="details-form-row">
            <div class="details-form-label">收款账号</div>
            <div class="details-form-value">
                {{ 
                    loanPactHis.collectAccountNo
                }}
            </div>
        </div>

        <div class="details-form-row">
            <div class="details-form-label">收款账号开户行</div>
            <div class="details-form-value">
                {{ 
                    loanPactHis.collectBankName
                }}
            </div>
        </div>

        <div class="details-form-row">
            <div class="details-form-label">收款账号名称</div>
            <div class="details-form-value">
                {{ 
                    loanPactHis.collectAccountName
                }}
            </div>
        </div>

        <div class="details-form-row">
            <div class="details-form-label">备注</div>
            <div class="details-form-value">
                {{ 
                    loanPactHis.pactRemark
                }}
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
        loanPactHis: {
            type: Object,
            required: true
        },
        loanPact:{
            type: Object,
            required: true
        }
    },
    computed: {
        formattedPactBeginDate() {
            if (!this.loanPactHis.pactBeginDate) {
                return '未知日期'; // 处理未定义的日期
            }
            const date = new Date(this.loanPactHis.pactBeginDate.replace('+08:00','z'));
            if (isNaN(date.getTime())) {
                return '无效日期'; // 处理无效的日期
            }
            return date.toISOString().split('T')[0]; // 格式化为 yyyy-mm-dd
        },
        formattedPactEndDateShow() {
            if (!this.loanPactHis.pactEndDateShow) {
                return '未知日期'; // 处理未定义的日期
            }
            const date = new Date(this.loanPactHis.pactEndDateShow.replace('+08:00','z'));
            if (isNaN(date.getTime())) {
                return '无效日期'; // 处理无效的日期
            }
            return date.toISOString().split('T')[0]; // 格式化为 yyyy-mm-dd
        },
        formattedVouType() {
            if (!this.loanPactHis.vouType) return '无担保方式';
            const vouTypeMap = {
                '1': '信用',
                '2': '保证',
                '3': '抵押',
                '4': '质押'
            };
            return this.loanPactHis.vouType
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
