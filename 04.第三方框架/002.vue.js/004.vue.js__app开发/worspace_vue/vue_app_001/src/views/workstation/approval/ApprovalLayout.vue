<template>
    <div class="approval-layout">
        <div class="header">
            <i class="fas fa-chevron-left back-icon" @click="goBack"></i>
            <h1 class="title">{{ title }}</h1>
        </div>

        <div class="content">
            <router-view />
        </div>

        <div class="navbar">
            <div
                class="nav-item"
                :class="{ active: currentTab === 'apply' }"
                @click="navigate('apply')"
                >
                <i class="fas fa-plus nav-icon"></i>
                <span>发起申请</span>
            </div>

            <div class="separator"></div>

            <div
                class="nav-item"
                :class="{ active: currentTab === 'my-approvals' }"
                @click="navigate('my-approvals')"
                >
                <i class="fas fa-user-check nav-icon"></i>
                <span>我的审批</span>
            </div>

            <div class="separator"></div>
            <div
                class="nav-item"
                :class="{ active: currentTab === 'submitted' }"
                @click="navigate('submitted')"
                >
                <i class="fas fa-file-alt nav-icon"></i>
                <span>已提交</span>
            </div>
        </div>

    </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
export default {
    name: 'ApprovalLayout',
    computed: {
    ...mapState('approval', ['currentTab', 'title', 'activeTab']),
    },
    methods: {
        ...mapMutations('approval', ['setCurrentTab', 'setTitle', 'setActiveTab']),
        goBack() {
            this.$root.navigate('workstation');
        },
        navigate(page) {
            this.setCurrentTab(page);
            this.updateTitle(page);
        },
        updateTitle(page) {
            let title;
            switch (page) {
            case 'apply':
                title = '发起申请';
                break;
            case 'my-approvals':
                title = '我的审批';
                break;
            case 'submitted':
                title = '已提交';
                break;
            default:
                title = '工作台-审批';
            }
            this.setTitle(title);
        }
    }
};
</script>

<style scoped>
.approval-layout {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
}



.header {
    display: flex;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 2.5rem;
    background-color: #f0f0f0;
    border-bottom: 1px solid #ddd;
    font-size: 0.6rem;
    font-weight: bold;
    color: #333;
    z-index: 1000;
    padding: 0 1rem;
}
.back-icon {
    cursor: pointer;
    font-size: 1.2rem;
    margin-right: 1rem;
    color: #333;
}
.title {
    flex: 1;
    text-align: center;
    font-size: 1.2rem;
}
    
.content {
    flex: 1;
    padding-top: 2.5rem; /* 确保内容不被固定的header覆盖 */
    padding-bottom: 4rem; /* 确保内容不被固定的navbar覆盖 */
    overflow: hidden; /* 防止内容区域外的滚动 */
}

.navbar {
    display: flex;
    justify-content: space-around;
    align-items: center;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 4rem;
    border-top: 1px solid #ccc;
    background-color: #fff;
    z-index: 1000;
}

.nav-item {
    display: flex;
    align-items: center;
    flex-direction: column;
    flex: 1;
    text-align: center;
    cursor: pointer;
    color: #888;
}

.nav-item.active {
    color: #122c5e;
    font-weight: bold; /* 激活时加粗 */
}

.nav-icon {
    font-size: 1.5rem;
}

.separator {
    width: 0.1rem;
    height: 1.5rem;
    background-color: #ccc;
}
</style>
