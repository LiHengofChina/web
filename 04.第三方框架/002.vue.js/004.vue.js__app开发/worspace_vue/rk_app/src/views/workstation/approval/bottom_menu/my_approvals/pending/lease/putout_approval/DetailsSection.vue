<template>
<div>
    <div class="details-form-title">放贷信息</div>
    <div class="details-form">
        <div class="details-form-row">
        <div class="details-form-label">合同编号</div>
            <div class="details-form-value">{{ applyDetail.pactNo }}</div>
        </div>

        <div class="details-form-row">
        <div class="details-form-label">项目编号</div>
            <div class="details-form-value">{{applyDetail.applyNo}}</div>
        </div>

        <div class="details-form-row">
        <div class="details-form-label">项目名称</div>
            <div class="details-form-value">{{applyDetail.applyName}}</div>
        </div>
        
        <div class="details-form-row">
        <div class="details-form-label">客户名称</div>
            <div class="details-form-value">{{applyDetail.cusName}}</div>
        </div>

        <div class="details-form-row">
        <div class="details-form-label">业务类型</div>
            <div class="details-form-value">{{applyDetail.productName}}</div>
        </div>

        <div class="details-form-row">
        <div class="details-form-label">本合同金额（元）</div>
            <div class="details-form-value">{{applyDetail.pactAmt}}</div>
        </div>
        
        <div class="details-form-row">
        <div class="details-form-label">本次放款金额（元）</div>
            <div class="details-form-value">{{applyDetail.dueAmt}}</div>
        </div>
        
        <div class="details-form-row">
        <div class="details-form-label">还款方式</div>
            <div class="details-form-value">
                {{
                    applyDetail.leaseRepayType==='0'?'等额租金后付':
                    applyDetail.leaseRepayType==='1'?'等额租金先付':
                    applyDetail.leaseRepayType==='2'?'自定义还款计划':
                    applyDetail.leaseRepayType
                }}</div>
        </div>
        
        <div class="details-form-row">
        <div class="details-form-label">还款周期</div>
            <div class="details-form-value">{{ 
                        applyDetail.repayNumType === '1' ? '月' : 
                        applyDetail.repayNumType === '2' ? '3个月' : 
                        applyDetail.repayNumType === '3' ? '6个月' : 
                        applyDetail.repayNumType 
                    }}
                    </div>
        </div>

        <div class="details-form-row">
        <div class="details-form-label">资金来源</div>
            <div class="details-form-value">{{ 
                        applyDetail.capitalSource === '01' ? '股东借款' : 
                        applyDetail.capitalSource === '02' ? '自有资金' : 
                        applyDetail.capitalSource === '03' ? '外部融资' : 
                        '其他'
                    }}
                    </div>
        </div>

        
        <div class="details-form-row">
        <div class="details-form-label">起租日</div>
            <div class="details-form-value">{{ formattedDueDate(applyDetail.dueBeginDate) }}</div>
        </div>

        <div class="details-form-row">
        <div class="details-form-label">租赁到期日</div>
            <div class="details-form-value">{{ formattedDueDate(applyDetail.dueEndDateShow) }}</div>
        </div>

        <div class="details-form-row">
        <div class="details-form-label">申请日期</div>
            <div class="details-form-value">{{ formattedDueDate(applyDetail.putoutApplyDate) }}</div>
        </div>

        <div class="details-form-row">
        <div class="details-form-label">手续费收取方式</div>
            <div class="details-form-value">{{ 
                        applyDetail.feeCollectWay === '0' ? '手续费先付' : 
                        applyDetail.feeCollectWay === '1' ? '手续费后付' : 
                        '其他'
                    }}
                    </div>
        </div>

        <div class="details-form-row">
        <div class="details-form-label">直租供货商</div>
            <div class="details-form-value">{{applyDetail.applySupplier}}</div>
        </div>

        <div class="details-form-row">
        <div class="details-form-label">资金来源备注</div>
            <div class="details-form-value">{{applyDetail.capitalSourceRemark}}</div>
        </div>
        
    </div>

    <div class="details-form-title">账户信息</div>
    <div class="details-form">
        <div class="details-form-row">
        <div class="details-form-label">收款账号</div>
            <div class="details-form-value">{{applyDetail.putoutAccountNo}}</div>
        </div>
        
        <div class="details-form-row">
        <div class="details-form-label">收款账号开户行</div>
            <div class="details-form-value">{{applyDetail.putoutBankName}}</div>
        </div>
        
        <div class="details-form-row">
        <div class="details-form-label">收款账号名称</div>
            <div class="details-form-value">{{applyDetail.putoutAccountName}}</div>
        </div>
        
        <div class="details-form-row">
        <div class="details-form-label">备注</div>
            <div class="details-form-value">{{applyDetail.pactRemark}}</div>
        </div>
    </div>

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
        
    </div>

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
            const date = new Date(dueDate.replace('+08:00','z'));
            if (isNaN(date.getTime())) {
                return '无效日期'; // 处理无效的日期
            }
            return dueDate.split('T')[0]; // 格式化为 yyyy-mm-dd
        }

    },
    mounted() {
        this.updateCommonLoading(false);
    }
};
</script>
