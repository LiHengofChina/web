<template>
  <div class="submitted-page">
    <div class="scrollable-content">
      <!-- 长内容 -->
      <h1>已提交</h1>

      <div v-for="item in completedItems" :key="item.id" class="list-item">
        <div class="item-title">{{ item.title }}</div>
        <div class="item-date">{{ item.date }}</div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'SubmittedPage',
  data() {
    return {
      completedItems: [
        { id: 1, title: '已提交项目1', date: '2024-08-01' },
        { id: 2, title: '已提交项目2', date: '2024-08-02' },
      ],
    };
  },
};
</script>

<style scoped>
.submitted-page {
  height: 100%;
  overflow-y: auto; /* 子组件内的内容可以滚动 */
  padding: 1rem;
}

.scrollable-content {
  /* 这里放置长内容 */
}
</style>

