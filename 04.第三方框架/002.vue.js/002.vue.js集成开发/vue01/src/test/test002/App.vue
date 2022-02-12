<template>
  <div >
  	<img src="./assets/logo.png">
    <h1>{{ msg }}</h1>
  </div>
</template>
 
<script>
export default {
  name: 'hello',
  data () {
    return {
      msg: '你好，李恒！'
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
