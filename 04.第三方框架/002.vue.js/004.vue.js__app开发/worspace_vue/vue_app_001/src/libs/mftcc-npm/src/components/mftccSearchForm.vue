<template>
    <mftcc-form :formId="formId" :parentVm="parentVm" :initData="initData" search="search" ref="mftccFormRef"></mftcc-form>
</template>
<script>
import mftccForm from '../components/mftccForm'
  export default {
    props: ["formId","parentVm","initData"],
    data() {
      return {
      };
    },
    components: {
      mftccForm
    },
    mounted() {
      for (let key in this.$refs.mftccFormRef) {
        if (!(key in this) && typeof this.$refs.mftccFormRef[key] === 'function') {
          this[key] = this.$refs.mftccFormRef[key].bind(this.$refs.mftccFormRef)
        }
      }
    }
  }
</script>