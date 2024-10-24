<template>

    <div class="public-page-layout">
        <!-- Header Section  -->
        <div class="public-header">
            <i  v-if="!isExemptionfromlogin" class="fas fa-chevron-left public-back-icon-left" @click="goBack"></i>
            <h1 class="public-title">{{ fileName }}.{{ fileExtension }}</h1>
            <i  v-if="!isExemptionfromlogin" class="fas fa-chevron-right public-back-icon-right" ></i>
        </div>

        <div class="file-viewer">
            <iframe :src="fileLink" frameborder="0" class="file-frame"></iframe>
        </div>
    </div>

</template>

<script>

import { mapMutations } from 'vuex';

import '@/assets/styles/public.css';

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

