<template>

    <div class="file-viewer">
        <iframe :src="fileLink" frameborder="0" class="file-frame"></iframe>
    </div>

</template>

<script>
export default {
    name: 'FileViewerPage',
    data() {
        return {
            fileLink: ''
        };
    },
    mounted() {
        this.fileLink = this.$route.query.link;
    }
};
</script>

<style scoped>
.file-viewer {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
}

.file-frame {
    width: 100%;
    height: 100%;
    border: none;
}
</style>

