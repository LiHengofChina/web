<template>
  <el-tooltip placement="top">
    <div slot="content">
      <slot name="text"></slot>
    </div>
    <el-image
      class="form-question-image"
      :src="require('../assets/common/question.png')"
      fit="cover"
    >
    </el-image>
  </el-tooltip>
</template>
<script>
export default {
  data() {
    return {};
  },
};
</script>
