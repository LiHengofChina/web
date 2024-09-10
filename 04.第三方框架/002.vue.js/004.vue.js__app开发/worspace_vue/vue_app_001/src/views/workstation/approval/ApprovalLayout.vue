<template>
    <div class="approval-layout">
        <div class="header">
            <i class="fas fa-chevron-left back-icon" @click="goBack"></i>
            <h1 class="title">{{ title }}</h1>
            <div class="spacer"></div>
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
    ...mapState('approval', ['currentTab', 'title' ]),

    },
    methods: {
        ...mapMutations('approval', ['setCurrentTab', 'setTitle' ]),
        goBack() {
            this.$root.navigate('workstation');
        },
        navigate(page) {
            this.setCurrentTab(page);
            this.updateTitle(page);

            this.$router.push({ name: page }).then(() => {
                console.log("Navigated to: " + page);
            }).catch(err => {
                console.error("Navigation error:", err);
            });

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
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.$store.commit('approval/setCurrentTab', 'my-approvals'); // 调用 approval 模块的 setCurrentTab
            vm.$store.commit('approval/setTitle', '我的审批'); // 调用 approval 模块的 setTitle
            vm.$store.commit('approval_my_approvals/setActiveTab', 'pending'); // 调用 approval_my_approvals 模块的 setActiveTab
        });
    }

};
</script>

<style scoped>
.approval-layout {
    display: flex;
    flex-direction: column;
    overflow: hidden;

    overflow-y: auto;    /* 允许垂直滚动 */    
    scrollbar-width: none;  /* 对于 Firefox：隐藏滚动条*/
    -ms-overflow-style: none;  /* 对于 IE 和 Edge：隐藏滚动条 */      
}
.approval-layout::-webkit-scrollbar {  /* 对于 Chrome、Safari 和 Opera ：隐藏滚动条*/
    display: none;
}


.header {
    display: flex;
    align-items: center;
    justify-content: space-between; /* 确保返回按钮和spacer均匀分布在两边 */
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
    font-size: 1.2rem; /* 使用 rem 单位 */
    color: #333;
}

.title {
    flex: 1;
    text-align: center;
    font-size: 1.2rem;
    margin: 0;
}

.spacer {
    width: 2.8rem; /* 使用 rem 单位，与 back-icon 相同宽度 */
    height: 100%; /* 保持占位符的高度 */
}



.content {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding-top: 2.5rem; /* 确保不被 header 覆盖 */
    padding-bottom: 5rem; /* 确保不被 navbar 覆盖 */

    overflow-y: auto;    /* 允许垂直滚动 */
    scrollbar-width: none;  /* 对于 Firefox：隐藏滚动条*/
    -ms-overflow-style: none;  /* 对于 IE 和 Edge：隐藏滚动条 */   
}
.content::-webkit-scrollbar {  /* 对于 Chrome、Safari 和 Opera ：隐藏滚动条*/
    display: none;
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
