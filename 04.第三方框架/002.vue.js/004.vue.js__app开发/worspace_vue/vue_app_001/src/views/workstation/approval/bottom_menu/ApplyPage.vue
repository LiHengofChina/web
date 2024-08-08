<template>
  <div class="apply-page">
    <div class="scrollable-content">
      <!-- 长内容 -->
      <h1>发起申请</h1>
      <p>这是发起申请内容。</p>
    </div>
  </div>
</template>


<script>
export default {
  name: 'ApplyPage',
};
</script>

<style scoped>
.apply-page {
  height: 100%;
  overflow-y: auto; /* 子组件内的内容可以滚动 */
  padding: 1rem;
}

.scrollable-content {
  /* 这里放置长内容 */
}
</style>
