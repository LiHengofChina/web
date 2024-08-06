<template>
  <div class="workstation-page">
    <!-- <div class="header">
      <h1>工作台</h1>
    </div> -->
    <div class="cards">
      <div class="card">
        <h2>内部管理</h2>
        <div class="options">
          <div class="option" @click="navigate('approval')">
            <div class="option-icon">
              <i class="fas fa-stamp"></i> <!-- 图标，可以替换为需要的图标 -->
            </div>
            <div class="option-label">审批</div>
          </div>
          <div class="option" @click="navigate('announcement')">
            <div class="option-icon">
              <i class="fas fa-bullhorn"></i> <!-- 图标，可以替换为需要的图标 -->
            </div>
            <div class="option-label">公告</div>
          </div>
        </div>
      </div>
      <div class="card">
        <h2>效率工具</h2>
        <div class="options">
          <div class="option" @click="navigate('forms')">
            <div class="option-icon">
              <i class="fas fa-file-alt"></i> <!-- 图标，可以替换为需要的图标 -->
            </div>
            <div class="option-label">收集表</div>
          </div>
          <div class="option" @click="navigate('calendar')">
            <div class="option-icon">
              <i class="fas fa-calendar-alt"></i> <!-- 图标，可以替换为需要的图标 -->
            </div>
            <div class="option-label">日程</div>
          </div>
          <div class="option" @click="navigate('meetings')">
            <div class="option-icon">
              <i class="fas fa-video"></i> <!-- 图标，可以替换为需要的图标 -->
            </div>
            <div class="option-label">会议</div>
          </div>
        </div>
      </div>
      <!-- 更多卡片 -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'WorkstationPage',
  methods: {
    navigate(page) {
      // 导航到对应页面的逻辑
      this.$router.push({ name: page });
    }
  }
}
</script>

<style scoped>
.workstation-page {
  padding: 1rem;
  background-color: #f0f0f0; /* 设置背景颜色 */
}

.header {
  text-align: center;
  margin-bottom: 1rem;
}

.cards {
  display: flex;
  flex-direction: column;
  gap: 1rem; /* 卡片之间的间距 */
}

.card {
  background-color: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 1rem;
}

.card h2 {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  color: #333;
}

.options {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 三列布局 */
  gap: 1rem; /* 选项之间的间距 */
}

.option {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}

.option-icon {
  font-size: 2rem;
  color: #f39c12; /* 图标颜色 */
  margin-bottom: 0.5rem;
}

.option-label {
  font-size: 0.9rem;
  color: #333;
}
</style>
