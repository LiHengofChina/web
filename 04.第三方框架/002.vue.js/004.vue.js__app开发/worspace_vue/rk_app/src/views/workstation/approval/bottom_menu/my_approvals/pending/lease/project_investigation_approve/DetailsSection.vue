<template>

    <div class="details-form-title">项目信息</div>
    <div class="details-form">
    


        <div class="details-form-row">
            <div class="details-form-label">项目编号</div>
            <div class="details-form-value">{{ applyDetail.applyNo }}</div>
        </div>
        <div class="details-form-row">
            <div class="details-form-label">项目名称</div>
            <div class="details-form-value">{{ applyDetail.applyName }}</div>
        </div>
        <div class="details-form-row">
            <div class="details-form-label">承租人</div>
            <div class="details-form-value">{{ applyDetail.cusName }}</div>
        </div>
        <div class="details-form-row">
            <div class="details-form-label">产品名称</div>
            <div class="details-form-value">{{ applyDetail.productName }}</div>
        </div>
        <div class="details-form-row">
            <div class="details-form-label">期限</div>
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
            <div class="details-form-label">预计起租日</div>
            <div class="details-form-value">{{ formattedApplyBeginDate }}</div>
        </div>
        <div class="details-form-row">
            <div class="details-form-label">租赁本金</div>
            <div class="details-form-value">{{ applyDetail.applyAmt }}</div>
        </div>
        <div class="details-form-row">
            <div class="details-form-label">租赁利率</div>
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
            <div class="details-form-label">年利率</div>
            <div class="details-form-value">{{ applyDetail.fieldNameRate}}%</div>
        </div>

        <div class="details-form-row">
            <div class="details-form-label">LPR利率</div>
            <div class="details-form-value">{{ applyDetail.baseRate }}%</div>
        </div>

        <div class="details-form-row">
            <div class="details-form-label">是否购买保险</div>
            <div class="details-form-value">
                {{ applyDetail.ifBuyInsurance === '1' ? '是' : applyDetail.ifBuyInsurance === '0' ? '否' : '未知状态' }}
            </div>
        </div>


        <!-- 实际用款单位，只有当 leaseApplyHis.realUseCorp 有值时显示 -->
        <div v-if="leaseApplyHis.realUseCorp" class="details-form-row">
            <div class="details-form-label">实际用款单位</div>
            <div class="details-form-value">{{ leaseApplyHis.realUseCorp }}</div>
        </div>

        <!-- 计划用款时间，只有当 leaseApplyHis.planUseDate 有值时显示 -->
        <div v-if="leaseApplyHis.planUseDate" class="details-form-row">
            <div class="details-form-label">计划用款时间</div>
            <div class="details-form-value">{{ formattedPlanUseDate }}</div>
        </div>

        <!-- 客户情况，只有当 leaseApplyHis.cusSituation 有值时显示 -->
        <div v-if="leaseApplyHis.cusSituation" class="details-form-row">
            <div class="details-form-label">客户情况</div>
            <div class="details-form-value">{{ leaseApplyHis.cusSituation }}</div>
        </div>
        

        <div class="details-form-row">
            <div class="details-form-label">项目说明</div>
            <div class="details-form-value">{{ applyDetail.applyRemark }}</div>
        </div>
        <div class="details-form-row">
            <div class="details-form-label">业务A角</div>
            <div class="details-form-value">{{ applyDetail.mngOpName }}</div>
        </div>
        <div class="details-form-row">
            <div class="details-form-label">业务B角</div>
            <div class="details-form-value">{{ applyDetail.busUserName }}</div>
        </div>

        <!-- 资产结论，只有当 leaseApplyHis.assetResearchConclusions 有值时显示 -->
        <div v-if="leaseApplyHis.assetResearchConclusions" class="details-form-row">
            <div class="details-form-label">资产结论</div>
            <div class="details-form-value">{{ leaseApplyHis.assetResearchConclusions }}</div>
        </div>
        <!-- 风控部门调查结论，只有当 leaseApplyHis.riskResearchConclusions 有值时显示 -->
        <div v-if="leaseApplyHis.riskResearchConclusions" class="details-form-row">
            <div class="details-form-label">风控部门调查结论</div>
            <div class="details-form-value">{{ leaseApplyHis.riskResearchConclusions }}</div>
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
        },
        leaseApplyHis: {
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
        formattedPlanUseDate() {
            if (!this.leaseApplyHis.planUseDate) {
                return '未知日期';
            }
            const date = new Date(this.leaseApplyHis.planUseDate.replace('+08:00','z'));
            if (isNaN(date.getTime())) {
                return '无效日期';
            }
            return date.toISOString().split('T')[0]; // 格式化为 yyyy-mm-dd
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