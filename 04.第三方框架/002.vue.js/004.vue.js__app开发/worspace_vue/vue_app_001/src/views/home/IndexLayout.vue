<!-- src/components/Layout.vue -->
<template>
    <div class="index-layout">

        <div class="content">
            <router-view />

            <!--
            
            <p>
                欢迎使用本应用！这里是主页内容。
            </p>
            -->
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
    name: 'IndexLayout',
    props: {
        msg: String
    },
    methods: {
        navigate(page) {
        this.$router.push({ name: page });
        }
    }
}
</script>

<style scoped>
.index-layout {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
}

.content {
    flex: 1;
    padding: 2rem;
    overflow-y: auto;
}

.navbar {
    display: flex;
    justify-content: space-around;
    align-items: center;
    border-top: 0.1rem solid #ccc;
    background-color: #fff;
    padding: 1rem 0;
    position: fixed;
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
    font-size: 1.5rem;
}

.separator {
    width: 0.1rem;
    height: 1.5rem;
    background-color: #ccc;
}
</style>
