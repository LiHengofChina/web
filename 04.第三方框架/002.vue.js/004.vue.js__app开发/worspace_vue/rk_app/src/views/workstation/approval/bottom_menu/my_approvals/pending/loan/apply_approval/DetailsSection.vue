<template>

    <div class="details-form-title">基础信息</div>
    <div class="details-form">
        <div class="details-form-row">
            <div class="details-form-label">客户名称</div>
            <div class="details-form-value">{{ applyDetail.cusName }}</div>
        </div>
        <div class="details-form-row">
            <div class="details-form-label">产品</div>
            <div class="details-form-value">{{ applyDetail.productName }}</div>
        </div>
        <div class="details-form-row">
            <div class="details-form-label">发生类型</div>
            <div class="details-form-value">
                {{ applyDetail.occType === '1' ? '新增业务' : applyDetail.occType === '2' ? '续作业务' : '' }}
            </div>                        
        </div>
        <div class="details-form-row">
            <div class="details-form-label">项目名称</div>
            <div class="details-form-value">{{ applyDetail.applyName }}</div>
        </div>

        <!-- 只有当 applyDetail.interiorUserName 有值时显示 -->
        <div v-if="applyDetail.interiorUserName" class="details-form-row">
            <div class="details-form-label">内部评委人员</div>
            <div class="details-form-value">{{ applyDetail.interiorUserName }}</div>
        </div>
        <!--  只有当 applyDetail.externalUserName 有值时显示 -->
        <div v-if="applyDetail.externalUserName" class="details-form-row">
            <div class="details-form-label">外部评委人员</div>
            <div class="details-form-value">{{ applyDetail.externalUserName }}</div>
        </div>
        
    </div>

    <div class="details-form-title">申请信息</div>
    <div class="details-form">

        <div class="details-form-row">
            <div class="details-form-label">贷款金额</div>
            <div class="details-form-value">{{ applyDetail.applyAmt }}元</div>
        </div>
        <div class="details-form-row">
            <div class="details-form-label">贷款期限</div>
            <div class="details-form-value">
                {{ applyDetail.termShow }}
            </div>                        
        </div>
        <div class="details-form-row">
            <div class="details-form-label">期限类型</div>
            <div class="details-form-value">
                {{ applyDetail.termType === '1' ? '月' : applyDetail.termType === '2' ? '天' : '未知' }}
            </div>                        
        </div>    
        <div class="details-form-row">
            <div class="details-form-label">计息方式</div>
            <div class="details-form-value">
                {{ 
                    applyDetail.icType === '1' ? '固定利率' : 
                    applyDetail.icType === '2' ? '按月浮动' : 
                    applyDetail.icType === '3' ? '按月对日浮动' : 
                    applyDetail.icType === '4' ? '按季浮动' : 
                    applyDetail.icType === '6' ? '按年' : 
                    applyDetail.icType === '7' ? '按年对月对日' : 
                    applyDetail.icType === '8' ? '立即调整' : 
                    applyDetail.icType === '9' ? '固定利息' : 
                    applyDetail.icType === 'A' ? '不适用' : 
                    applyDetail.icType 
                }}
            </div>
        </div>
        <div class="details-form-row">
            <div class="details-form-label">贷款利率</div>
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
            <div class="details-form-label">还款方式</div>
            <div class="details-form-value">
                {{ 
                    applyDetail.repayTypeExpand === '1' ? '一次性' : 
                    applyDetail.repayTypeExpand === '2' ? '分期' : 
                    applyDetail.repayTypeExpand 
                }}                            
            </div>                           
        </div>
        <div class="details-form-row">
            <div class="details-form-label">是否超出区域额度限额</div>
            <div class="details-form-value">
                {{ 
                    applyDetail.overQuota === '1' ? '是' : 
                    applyDetail.overQuota === '2' ? '否' : 
                    applyDetail.overQuota 
                }}                            
            </div>                           
        </div>

    </div>
    <div class="details-form-title">担保与用途</div>
        <div class="details-form">

            <div class="details-form-row">
                <div class="details-form-label">担保方式</div>
                <div class="details-form-value">
                    {{ formattedVouType }}
                </div>                        
            </div>
            <div class="details-form-row">
                <div class="details-form-label">还款来源</div>
                <div class="details-form-value">
                    {{ 
                        applyDetail.repaySource
                    }}
                </div>                        
            </div>
            <div class="details-form-row">
                <div class="details-form-label">贷款投向</div>
                <div class="details-form-value">
                    {{ 
                        applyDetail.fincUseName
                    }}
                </div>
            </div>
            <div class="details-form-row">
                <div class="details-form-label">明细投向</div>
                <div class="details-form-value">
                    {{ 
                        applyDetail.fincUseSmDes
                    }}
                </div>
            </div>
            <div class="details-form-row">
                <div class="details-form-label">贷款用途</div>
                <div class="details-form-value">
                    {{ 
                        applyDetail.loanType === '1' ? '流动资金贷款' : 
                        applyDetail.loanType === '2' ? '固定资产贷款' : 
                        applyDetail.loanType 
                    }}
                </div>
            </div>
            <div class="details-form-row">
                <div class="details-form-label">贷款用途说明</div>
                <div class="details-form-value">
                    {{ 
                        applyDetail.fincUseDes
                    }}
                </div>
            </div>
            <div class="details-form-row">
                <div class="details-form-label">业务B角</div>
                <div class="details-form-value">
                    {{ 
                        applyDetail.firstApprUser
                    }}
                </div>
            </div>
            <div class="details-form-row">
                <div class="details-form-label">业务主办A角 </div>
                <div class="details-form-value">
                    {{ 
                        applyDetail.mngOpName
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
        applyDetail: {
            type: Object,
            required: true
        }
    },
    computed: {
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