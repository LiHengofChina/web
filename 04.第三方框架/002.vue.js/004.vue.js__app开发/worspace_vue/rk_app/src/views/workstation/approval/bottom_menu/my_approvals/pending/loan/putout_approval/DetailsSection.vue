<template>
<div>
    <div class="details-form-title">放贷信息</div>
    <div class="details-form">
        <div class="details-form-row">
        <div class="details-form-label">合同编号</div>
            <div class="details-form-value">{{ applyDetail.pactNo }}</div>
        </div>

        <div class="details-form-row">
        <div class="details-form-label">项目申请号</div>
            <div class="details-form-value">{{applyDetail.applyNo}}</div>
        </div>
        
        <div class="details-form-row">
        <div class="details-form-label">客户名称</div>
            <div class="details-form-value">{{applyDetail.cusName}}</div>
        </div>

        <div class="details-form-row">
        <div class="details-form-label">产品名称</div>
            <div class="details-form-value">{{applyDetail.productName}}</div>
        </div>

        <div class="details-form-row">
        <div class="details-form-label">合同名称</div>
            <div class="details-form-value">{{applyDetail.duePactName}}</div>
        </div>

        <div class="details-form-row">
        <div class="details-form-label">合同编号</div>
            <div class="details-form-value">{{applyDetail.approvalPactNo}}</div>
        </div>
        
        <div class="details-form-row">
        <div class="details-form-label">合同金额(元)</div>
            <div class="details-form-value">{{applyDetail.pactAmt}}</div>
        </div>

        <div class="details-form-row">
        <div class="details-form-label">本次付款金额</div>
            <div class="details-form-value">{{applyDetail.dueAmt}}</div>
        </div>

        
        <div class="details-form-row">
        <div class="details-form-label">还款方式</div>
            <div class="details-form-value">
                {{
                    applyDetail.repayTypeExpand==='1'?'一次性':
                    applyDetail.repayTypeExpand==='2'?'分期':
                    '其他'
                    
                }}</div>
        </div>


        <div class="details-form-row">
        <div class="details-form-label">还款日</div>
            <div class="details-form-value">{{ 
                        applyDetail.repayDateSet === '1' ? '贷款发放日' : 
                        applyDetail.repayDateSet === '2' ? '月末' : 
                        applyDetail.repayDateSet === '3' ? '固定还款日' : 
                        '其他'
                    }}
                    </div>
        </div>

        <div class="details-form-row" v-show="applyDetail.repayDateSet === '3'">
        <div class="details-form-label">固定还款日</div>
            <div class="details-form-value">{{applyDetail.repayDate}}</div>
        </div>

        <!-- 业务B角
        担保方式        
         -->
        <div class="details-form-row">
        <div class="details-form-label">业务B角</div>
            <div class="details-form-value">{{applyDetail.firstApprUser}}</div>
        </div>
         
        <div class="details-form-row">
        <div class="details-form-label">担保方式</div>
            <div class="details-form-value">{{ prouctVueType(applyDetail.vouType) }}</div>
        </div>


        <div class="details-form-row">
        <div class="details-form-label">计划付款日期</div>
            <div class="details-form-value">{{applyDetail.planPayDate}}</div>
        </div>



        <div class="details-form-row">
        <div class="details-form-label">委托放款银行</div>
            <div class="details-form-value">{{ applyDetail.fundCorpName }}</div>
        </div>


        <div class="details-form-row">
        <div class="details-form-label">放款申请说明</div>
            <div class="details-form-value">{{applyDetail.remark}}</div>
        </div>

        
    </div>

    <div class="details-form-title">账户信息</div>
    <div class="details-form">
        <div class="details-form-row">
        <div class="details-form-label">收款账号</div>
            <div class="details-form-value">{{applyDetail.platAccountNo}}</div>
        </div>
        
        <div class="details-form-row">
        <div class="details-form-label">收款账号开户行</div>
            <div class="details-form-value">{{applyDetail.platBankName}}</div>
        </div>
        
        <div class="details-form-row">
        <div class="details-form-label">收款账号名称</div>
            <div class="details-form-value">{{applyDetail.platAccountName}}</div>
        </div>
        
    </div>
<!-- 
    <div class="details-form-title">费用信息</div>

    <div class="details-form" v-for="(feeInfo, index) in feeInfoList" :key="feeInfo.feeId">
        <div  class="details-form-row" v-if="index!==0">
        </div>

        <div  class="details-form-row">
        <div class="details-form-label">费用项名称</div>
            <div class="details-form-value">{{feeInfo.itemName}}</div>
        </div>

        <div class="details-form-row">
        <div class="details-form-label">费用收取时间</div>
            <div class="details-form-value">{{
                feeInfo.feeCollectTime==="1"?"放款时收取":
                feeInfo.feeCollectTime==="2"?"还款时收取":
                feeInfo.feeCollectTime==="3"?"单独收取":
                ""
                }}</div>
        </div>

        
        <div class="details-form-row">
        <div class="details-form-label">收取方式</div>
            <div class="details-form-value">{{
                feeInfo.feeCollectType==='1'?"按实际放款金额比例收取":
                feeInfo.feeCollectType==='3'?"按年收取":
                feeInfo.feeCollectType==='5'?"按月收取":
                feeInfo.feeCollectType==='6'?"按天收取":
                feeInfo.feeCollectType==='8'?"还款最后一期收取":
                feeInfo.feeCollectType==='9'?"还款计划规则":
                ""}}</div>
        </div>

            <div class="details-form-row">
        <div class="details-form-label">费用值（元）</div>
            <div class="details-form-value">{{ formatMoney(feeInfo.feeAmt)}}</div>
        </div>

        <div class="details-form-row" v-if="feeInfo.takeType==='1'">
        <div class="details-form-label">费率值</div>
            <div class="details-form-value">{{feeInfo.rateScaleShow}}</div>
        </div>
        
    </div> -->

</div>
</template>

<script>
import '@/assets/styles/workstation/approval/details-section.css';
import calcUtil from '@/utils/calcUtil';

import { mapActions } from 'vuex';

export default {
    name: 'DetailsSection',
    props: {
        applyDetail: {
            type: Object,
            required: true
        },
        feeInfoList:{type:Array,required: true}
    },
    methods: {
        ...mapActions('approval_common_store', [
            'updateCommonLoading'
        ]),
        formatMoney: function (feeAmt) {
            if(feeAmt != '' && feeAmt != null){
            return calcUtil.formatMoney(feeAmt, 2);
            }else{
            return  "0.00";
            }
        },
        formattedDueDate(dueDate) {
            //时间格式处理
            if (!dueDate) {
                return '未知日期'; // 处理未定义的日期
            }
            const date = new Date(dueDate);
            if (isNaN(date.getTime())) {
                return '无效日期'; // 处理无效的日期
            }
            return dueDate.split('T')[0]; // 格式化为 yyyy-mm-dd
        },
        prouctVueType(vouType){
            //担保方式处理
            if (!vouType) return '无担保方式';
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
    mounted() {
        this.updateCommonLoading(false);
    }
};
</script>
