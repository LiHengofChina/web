<template>
<div>
<div class="details-form-title">合同信息</div>
<div class="details-form">
   <div class="details-form-row">
    <div class="details-form-label">合同编号</div>
        <div class="details-form-value">{{ applyDetail.pactNo }}</div>
    </div>

    <div class="details-form-row">
    <div class="details-form-label">合同审批编号</div>
        <div class="details-form-value">{{applyDetail.pactNoShow}}</div>
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
    <div class="details-form-label">承租人名称</div>
        <div class="details-form-value">{{applyDetail.cusName}}</div>
    </div>

    <div class="details-form-row">
    <div class="details-form-label">租赁本金</div>
        <div class="details-form-value">{{applyDetail.pactAmt}}</div>
    </div>

    <div class="details-form-row">
    <div class="details-form-label">转让价款</div>
        <div class="details-form-value">{{applyDetail.transferPriceAmt}}</div>
    </div>
    
    <div class="details-form-row">
    <div class="details-form-label">期限</div>
        <div class="details-form-value">{{applyDetail.termShow}}</div>
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
    <div class="details-form-label">LPR利率</div>
        <div class="details-form-value">{{applyDetail.baseRate}}</div>
    </div>
    
    <div class="details-form-row">
    <div class="details-form-label">租赁利率</div>
        <div class="details-form-value">{{applyDetail.rateShow}}</div>
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
    <div class="details-form-label">公章</div>
        <div class="details-form-value">{{applyDetail.officialSeal==='0'?'不用印':'用印'}}</div>
    </div>
    
    <div class="details-form-row">
    <div class="details-form-label">法人代表章</div>
        <div class="details-form-value">{{applyDetail.corporateSeal==='0'?'不用印':'用印'}}</div>
    </div>
    
    <div class="details-form-row">
    <div class="details-form-label">合同基本情况</div>
        <div class="details-form-value">{{applyDetail.basicInformation}}</div>
    </div>
    
    <div class="details-form-row">
    <div class="details-form-label">法律审查情况</div>
        <div class="details-form-value">{{applyDetail.pactAttribute==='1'?'使用标准合同范本':
            applyDetail.pactAttribute==='2'?'使用标准合同范本，但对范本内容做出实质性修改，已出具法律意见书':
            applyDetail.pactAttribute==='3'?'无标准合同范本，已出具法律意见书':
            '未知'}}</div>
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
    computed: {
        formattedApplyBeginDate() {
            console.log(this.applyDetail);
            if (!this.applyDetail.applyBeginDate) {
                return '未知日期'; // 处理未定义的日期
            }
            const date = new Date(this.applyDetail.applyBeginDate.replace('+08:00','z'));
            if (isNaN(date.getTime())) {
                return '无效日期'; // 处理无效的日期
            }
            return date.toISOString().split('T')[0]; // 格式化为 yyyy-mm-dd
        }
    },
    methods: {
        ...mapActions('approval_common_store', [
            'updateCommonLoading'
        ]),
        formatMoney: function (feeAmt) {
            console.log("函数处理")
            console.log(feeAmt);
            if(feeAmt != '' && feeAmt != null){
            return calcUtil.formatMoney(feeAmt, 2);
            }else{
            return  "0.00";
            }
        },

    },
    mounted() {
        this.updateCommonLoading(false);
    }
};
</script>
