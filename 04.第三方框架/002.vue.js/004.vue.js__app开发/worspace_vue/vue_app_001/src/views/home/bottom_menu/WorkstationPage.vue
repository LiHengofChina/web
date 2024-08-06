<template>
  <div class="workstation-page">


    <div class="cards">
      <div class="card">
        <div class="card-title">待办</div>
        <div class="options">
          <div class="option" @click="navigate('approval')">
            <div class="option-icon">
              <i class="fas fa-stamp"></i>
            </div>
            <div class="option-label">审批</div>
          </div>
          <div class="option" @click="navigate('announcement')">
            <div class="option-icon">
              <i class="fas fa-bullhorn"></i>
            </div>
            <div class="option-label">公告</div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-title">其它</div>
        <div class="options">
          <div class="option" @click="navigate('forms')">
            <div class="option-icon">
              <i class="fas fa-file-alt"></i>
            </div>
            <div class="option-label">文档</div>
          </div>
          <div class="option" @click="navigate('calendar')">
            <div class="option-icon">
              <i class="fas fa-calendar-alt"></i>
            </div>
            <div class="option-label">日程</div>
          </div>
          <div class="option" @click="navigate('meetings')">
            <div class="option-icon">
              <i class="fas fa-video"></i>
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
        console.log(page);
        switch(page) {
          case 'approval':
            this.$router.push({ path: '/approval' });
            break;
          // case 'announcement':
          //   this.$router.push({ path: '/announcement' });
          //   break;
          // case 'forms':
          //   this.$router.push({ path: '/forms' });
          //   break;
          // case 'calendar':
          //   this.$router.push({ path: '/calendar' });
          //   break;
          // case 'meetings':
          //   this.$router.push({ path: '/meetings' });
          //   break;
          default:
            console.warn('Unknown navigation target:', page);
        }
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

.card-title {
  margin-bottom: 1rem;
  font-size: 0.9rem; /* 缩小字符 */
  color: #bbb; /* 更浅的灰色字符 */
  text-align: left; /* 左对齐 */
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
