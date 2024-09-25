<template>
    <el-alert
    :title="props.label"
    type="success"
    effect="dark"
    class="title_label"
    :closable="false" style="margin-bottom: 22px;"
    :class="designer===true?'mftcc-alert':''">
    </el-alert>
</template>
<script>
export default {
     data() {
        return {
            title:"标题",
        }
    },
    props: {
        props: {
            type: Object,
            default() {
                return {};
            }
        },
        designer: {
            type: Boolean,
            default() {
                return false;
            }
        }
  }
}
</script>
<style>
.title_label{
    margin: 0 !important;
    border-radius: 0;
    background-color: #EDF2FA !important;
    color: rgba(20,20,20,1) !important;
    font-weight: 400;
}
.title_label .el-alert__title{
    font-size: 16px;
}
</style>