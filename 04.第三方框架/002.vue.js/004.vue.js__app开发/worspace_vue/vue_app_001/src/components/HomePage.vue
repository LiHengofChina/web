<template>
    <div class="homepage">
        <div class="content">
            <!-- 主内容区域，可以根据需要自定义 -->
            <h1>{{ msg }}</h1>
            <p>
                欢迎使用本应用！这里是主页内容。
            </p>
        </div>

        <div class="navbar">

            <div class="nav-item" @click="navigate('home')">
                <i class="fas fa-home nav-icon"></i>
                <span>首页</span>
            </div>

            <div class="separator"></div>

            <div class="nav-item" @click="navigate('workstation')">
                <i class="fas fa-desktop nav-icon"></i>
                <span>工作站</span>
            </div>

            <div class="separator"></div>

            <div class="nav-item" @click="navigate('tasks')">
                <i class="fas fa-tasks nav-icon"></i>
                <span>待办</span>
            </div>

            <div class="separator"></div>

            <div class="nav-item" @click="navigate('profile')">
                <i class="fas fa-user nav-icon"></i>
                <span>我的</span>
            </div>

        </div>
    </div>
</template>

<script>
export default {
name: 'HomePage',
    props: {
        msg: String
    },
    methods: {
        navigate(page) {
            // 这里可以添加导航逻辑，例如使用 vue-router 切换页面
            console.log(`Navigate to ${page}`);
        }
    }
}
</script>

<style scoped>
    .homepage {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden; /* 避免滚动条影响布局 */
}

.content {
    flex: 1;
    padding: 20px;
    overflow-y: auto; /* 允许内容区域滚动 */
}

.navbar {
    display: flex;
    justify-content: space-around;
    align-items: center;
    border-top: 1px solid #ccc;
    background-color: #fff;
    padding: 10px 0;
    position: fixed; /* 固定位置 */
    bottom: 0;
    left: 0;
    width: 100%;
}

.nav-item {
    display: flex;
    align-items: center;
    flex-direction: column;
    flex: 1;
    text-align: center;
    cursor: pointer;
}

.nav-icon {
    font-size: 24px;
}

.separator {
    width: 1px;
    height: 24px;
    background-color: #ccc;
}
</style>
