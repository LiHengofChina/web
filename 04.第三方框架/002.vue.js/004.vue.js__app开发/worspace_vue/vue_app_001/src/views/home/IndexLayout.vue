<template>
  <div class="index-layout">
    <div class="header">
      <h1>{{ title }}</h1>
    </div>
    <div class="content">
      <router-view />
    </div>
    <div class="navbar">
      <div
        class="nav-item"
        :class="{ active: currentTab === 'home' }"
        @click="navigate('home')"
      >
        <i class="fas fa-home nav-icon"></i>
        <span>首页</span>
      </div>
      <div class="separator"></div>
      <div
        class="nav-item"
        :class="{ active: currentTab === 'workstation' }"
        @click="navigate('workstation')"
      >
        <i class="fas fa-desktop nav-icon"></i>
        <span>工作站</span>
      </div>
      <div class="separator"></div>
      <div
        class="nav-item"
        :class="{ active: currentTab === 'tasks' }"
        @click="navigate('tasks')"
      >
        <i class="fas fa-tasks nav-icon"></i>
        <span>待办</span>
      </div>
      <div class="separator"></div>
      <div
        class="nav-item"
        :class="{ active: currentTab === 'profile' }"
        @click="navigate('profile')"
      >
        <i class="fas fa-user nav-icon"></i>
        <span>我的</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IndexLayout',
  data() {
    return {
      currentTab: 'home', // 默认选中的标签
      title: '首页' // 默认标题
    };
  },
  methods: {
    navigate(page) {
      this.currentTab = page;
      this.$router.push({ name: page });
      this.updateTitle(page);
    },
    updateTitle(page) {
      switch (page) {
        case 'home':
          this.title = '首页';
          break;
        case 'workstation':
          this.title = '工作站';
          break;
        case 'tasks':
          this.title = '待办';
          break;
        case 'profile':
          this.title = '我的';
          break;
        default:
          this.title = '应用';
      }
    }
  },
  created() {
    this.updateTitle(this.currentTab);
  }
}
</script>

<style scoped>
.index-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden; /* 防止全局滚动 */
}

.header {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 2.5rem;
  background-color: #f0f0f0; /* 浅灰色背景 */
  border-bottom: 1px solid #ddd;
  font-size: 0.6rem; /* 调整字体大小 */
  font-weight: bold;
  color: #333;
  z-index: 1000;
}

.content {
  flex: 1;
  overflow-y: auto;
  padding-top: 2.5rem; /* 确保内容不被固定的header覆盖 */
  padding-bottom: 4rem; /* 确保内容不被固定的navbar覆盖 */
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
