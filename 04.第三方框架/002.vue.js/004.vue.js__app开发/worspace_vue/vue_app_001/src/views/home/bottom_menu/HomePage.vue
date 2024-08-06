<template>
  <div class="home-page">
    <div class="scrollable-content">
      <!-- 长内容 -->
      <h1>首页</h1>
      <p>这是首页内容。</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePage'
}
</script>

<style scoped>
.home-page {
  height: 100%;
  overflow-y: auto; /* 子组件内的内容可以滚动 */
  padding: 1rem;
}

.scrollable-content {
  /* 这里放置长内容 */
}
</style>
