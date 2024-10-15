<template>

    <!-- Header Section  -->
    <div class="header">
        <i  class="fas fa-chevron-left back-icon" @click="goBack"></i>
        <h1 class="title">{{ fileName }}.{{ fileExtension }}</h1>
        <div class="spacer"></div>
    </div>

    <div class="file-viewer">
        <iframe :src="fileLink" frameborder="0" class="file-frame"></iframe>
    </div>

</template>

<script>

import { mapMutations } from 'vuex';


export default {
    name: 'FileViewerPage',
    data() {
        return {
            fileLink: '',
            fileName: '',
            fileExtension: '',
        };
    },
    mounted() {
        this.fileLink = this.$route.query.link;
        this.fileName = this.$route.query.name;
        this.fileExtension = this.$route.query.extension;
    },
    methods: {
        ...mapMutations('approval_project_initiation_approval_page', ['setActiveTabProjectInitiation']),
        goBack() {
            this.$router.go(-1);
            this.setActiveTabProjectInitiation('document'); 
        },
    }
};
</script>

<style scoped>

/* 标题部分 ************************ */
.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 2.5rem;
    background-color: #00ADEF;
    border-bottom: 1px solid #ddd;
    z-index: 1000;
    padding: 0 1rem;
    box-sizing: border-box;
}

.back-icon {
    cursor: pointer;
    font-size: 1.2rem;
    color: #FFFFFF;
}

.title {
    height: 1.5rem;    
    flex: 1;
    text-align: center;
    font-size: 1.2rem;
    color: #FFFFFF;
    margin: 0;
}

.spacer {
    width: 2.8rem;
}

/* 文件预览部分 ************************ */

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

