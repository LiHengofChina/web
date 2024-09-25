<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', 'Helvetica', 'Arial', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 1rem;
  overflow: hidden;
  scrollbar-width: none;  /* 对于 Firefox：隐藏滚动条*/
  -ms-overflow-style: none;  /* 对于 IE 和 Edge：隐藏滚动条 */     
}
#app::-webkit-scrollbar {  /* 对于 Chrome、Safari 和 Opera ：隐藏滚动条*/
  display: none;
}

</style>

