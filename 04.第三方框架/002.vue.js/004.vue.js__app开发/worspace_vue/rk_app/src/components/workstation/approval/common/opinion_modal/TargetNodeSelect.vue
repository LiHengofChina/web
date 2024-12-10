<template>
    <div v-if="showTargetNodeSelect" class="node-select">
        <!-- 保持与输入框一致的宽度 -->
        <el-select v-model="localSelectedNode" 
                placeholder="请选择节点" >
                <template #prefix>
                    <span class="required">*</span>
                </template>
                <el-option
                    v-for="node in targetNodes"
                    :key="node.id"
                    :label="node.name"
                    :value="node.id">
                </el-option>

        </el-select>
    </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
    name: 'TargetNodeSelect',
    computed: {
        ...mapGetters('approval_common_store', [
            'showTargetNodeSelect', // 是否显示目标节点选择
            'commonTaskId',
        ]),
    },        
    data() {
        return {
            localSelectedNode: '',  // 本地的选择值，保存选中的节点ID
            targetNodes: []
        };
    },
    methods: {
        ...mapActions('approval_common_store', [
            'updateTargetNodeId',
        ]),
        getFinishNodeList() {
            return import('@/api/workstation/approval/flowable/flowable_api')
                .then(({ default: api }) => {
                    return new Promise((resolve, reject) => {
                        api.getFinishNodeList(
                            {taskId: this.commonTaskId},
                            this.$config,
                            response => {
                                if (response && response.code === 0 && response.data) {
                                    resolve(response);
                                } else {
                                    reject('Unexpected API response');
                                }
                            },
                            error => {
                                reject('API Error: ' + error);
                            }
                        );
                    });
                })
                .catch(err => {
                    console.error('Failed to import API module: ', err);
                    throw err;
                });
        },        
        load(){
            this.getFinishNodeList()
            .then(response => {
                this.targetNodes = response.data.NodeList;
            }) .catch(error => {
                console.error('Error in API chain:', error);
            });

        }
    },
    mounted() {
        this.load();
    },    
    watch: {
        localSelectedNode(newValue) {
            this.updateTargetNodeId(newValue);
        }
    }
};
</script>

<style scoped>

.required {
    color: red;
    font-weight: bold;
    font-size: 0.9rem;
    margin-right: 0.2rem;
    position: relative;
    top: 2px; /* 细微调整符号的位置 */    
}

/* 确保选择框宽度与输入框对齐 */
.node-select {
    position: relative;
    width: 90%; /* 与输入框一致 */
    max-width: 90%;
    margin: 0 auto;
    padding: 0.2rem 0;
}


/* 其他样式保持一致 */
.node-select .el-input {
    width: 100%;
    border-radius: 0.25rem;
    box-sizing: border-box;
}



</style>
