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
          <span>工作台</span>
        </div>

        <div class="separator"></div>

        <div
          class="nav-item"
          :class="{ active: currentTab === 'messages' }"
          @click="navigate('messages')"
        >
          <i class="fas fa-envelope nav-icon"></i>
          <span>消息</span>
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
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'IndexLayout',
  computed: {
    ...mapState('index', ['currentTab', 'title']),
  },
  methods: {
    ...mapMutations('index', ['setCurrentTab', 'setTitle']),
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
        case 'home':
          title = '首页';
          break;
        case 'workstation':
          title = '工作台';
          break;
        case 'messages':
          title = '消息';
          break;
        case 'profile':
          title = '我的';
          break;
        default:
          title = '主页';
      }
      this.setTitle(title);
    }
  },
  mounted() {
    this.$root.navigate = this.navigate;
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
  display: flex;
  flex-direction: column;
  padding-top: 2.5rem; /* 确保不被 header 覆盖 */
  padding-bottom: 5rem; /* 确保不被 navbar 覆盖 */
  overflow-y: auto; /* 允许滚动 */
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
