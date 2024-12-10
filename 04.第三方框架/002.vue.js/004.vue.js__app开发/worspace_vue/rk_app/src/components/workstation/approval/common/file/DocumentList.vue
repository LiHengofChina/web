<template>

    <div v-for="(group, groupIndex) in documents.groupList" :key="groupIndex">

        <!-- 一级标题 -->
        <div class="document-form-title">{{ group.groupName }}</div>

        <!-- 过滤并合并相同一级和二级标题下的文件 -->
        <div class="document-list">
            <div v-for="(fileGroup, index) in filterAndGroupFiles(group.groupNo)" :key="index">

                <!-- 二级标题 
                <div class="document-form-row">
                    <div class="document-form-label-two">{{ fileGroup.firstTypeName }}</div>
                </div>
                -->

                <!-- 三级标题 -->
                <div class="document-form-row">
                    <div class="document-form-label-three">{{ fileGroup.typeName }}</div>
                </div>

                <!-- 文件列表 -->
                <div v-for="(subFile, subIndex) in fileGroup.fileList" :key="subIndex">
                    <div class="document-form-row">
                        <div class="document-form-label-doc" @click="handleFileClick(subFile)" >{{ subFile.fileName }}</div>
                    </div>
                </div>

            </div>
        </div>

    </div>

    <!-- “要件资料” 按钮 -->
    <div class="fab" v-if="showImportantDocumentsFlag" @click="handleFabClick">
        <i class="fas fa-plus"></i>
    </div>

</template>

<script>
import { mapGetters, mapActions } from 'vuex';


export default {
    name: 'DocumentList',
    components: {
    },       
    computed: {
        ...mapGetters('approval_common_store', [
            'commonLoading',
            'commonApplyId',
            'commonMainId',
            'commonCusId',
            'commonDueId',
            'commonPactId',
            'commonEntrance',

            'refreshDocumentPage',
            'showImportantDocumentsFlag',

        ]),
        uploadParm: {
            get() { 
                return {
                    busRelatedId:this.commonMainId,
                    cusRelatedId:this.commonCusId,
                    applyRelatedId:this.commonApplyId
                };
            }
        },    
    },    
    data() {
        return {
            documents: {},
        };
    },
    methods: {
        ...mapActions('approval_common_store', [
            'updateCommonLoading',

            'updateShowDocumentUploadPanel', //是否显示 “要件资料面板”

        ]),
        handleFabClick() {
            // （1）打开要件资料上传
            this.updateShowDocumentUploadPanel(true);
        },
        getFileParamList(apply_id, main_id ,due_id,pact_id){
            return import('@/api/workstation/approval/doc/doc_api')
                .then(({ default: api }) => {
                    return new Promise((resolve, reject) => {
                        api.getFileParamList(
                            {applyId: apply_id, mainId: main_id ,pactId:pact_id,dueId:due_id,entrance: this.commonEntrance},
                            this.$config,
                            response => {                                
                                if (response && response.code === 0 && response.data) {
                                    resolve(response);
                                } else {
                                    reject('Unexpected API response or empty task list');
                                }
                            },
                            error => {
                                reject('API Error: ' + error);
                            }
                        );
                    });
                })
                .catch(err => {
                    console.error('Failed to import API module: ', err);
                    throw err;  // Propagate the error
                });
        },
        relatedFileList(FileParamList){
            return import('@/api/workstation/approval/doc/doc_api')
                .then(({ default: api }) => {
                    return new Promise((resolve, reject) => {
                        api.relatedFileList(
                            FileParamList,
                            this.$config,
                            response => {
                                if (response && response.code === 0 && response.data) {
                                    resolve(response);
                                } else {
                                    reject('Unexpected API response or empty file list');
                                }
                            },
                            error => {
                                reject('API Error: ' + error);
                            }
                        );
                    });
                })
                .catch(err => {
                    console.error('Failed to import API module: ', err);
                    throw err;  // Propagate the error
                });
        },
        handleFileClick(subFile) {
            this.getOfficeFileObj(subFile.fileId)
            .then(response => {
                const linkValue = response.data.link;

                const filePath = subFile.filePath;
                const fileExtension = filePath.substring(filePath.lastIndexOf('.') + 1);

                this.$router.push({ path: '/file-viewer-page', query: { 
                    link: linkValue,
                    name: subFile.fileName,
                    extension: fileExtension
                } });
            })
            .catch(error => {
                console.error('Error in API chain:', error);
            });
        },
        getOfficeFileObj(fileId){
            return import('@/api/workstation/approval/doc/doc_api')
            
                .then(({ default: api }) => {
                    return new Promise((resolve, reject) => {
                        api.getOfficeFileObj(
                            fileId,
                            this.$config,
                            response => {
                                if (response && response.code === 0 && response.data) {
                                    resolve(response);
                                } else {
                                    reject('Unexpected API response');
                                }
                            },
                            error => {
                                reject('API Error: ' + error);
                            }
                        );
                    });
                })
                .catch(err => {
                    console.error('Failed to import API module: ', err);
                    throw err;
                });
        },        
        filterAndGroupFiles(groupNo) {
                return this.documents.fileList.filter(file => file.parentTypeNo === groupNo) // 匹配一级标题
                .map(file => {
                    return {
                        firstTypeName: file.firstTypeName, // 二级标题
                        typeName: file.typeName,           // 三级标题
                        fileList: file.fileList            // 文件列表
                    };
                });
        },

        load(){
            this.updateCommonLoading(true);


            // （1）调用文件参数列表接口
            this.getFileParamList(this.commonApplyId, this.commonMainId,this.commonDueId,this.commonPactId)
            .then(response => {
                    //（2）调用 相关文件列表接口
                    return this.relatedFileList(response.data);
            })
            .then(response => {
                    //（3）设置 文件列表
                    const fileLists = response.data;
                    if (fileLists) {


                        this.documents = fileLists;
                        //=================  
                        // 一级标题
                        // this.documents.groupList.forEach(group => {
                        //     console.log(`一级标题：${group.groupName}`);
                        //     this.documents.fileList.forEach(file => {
                        //         // 二级标题
                        //         if (file.parentTypeNo === group.groupNo) {
                        //             console.log(`  二级标题：${file.firstTypeName}`);
                        //             file.fileList.forEach(subFile => {
                        //                 // 三级标题
                        //                 console.log(`    三级标题：${subFile.typeName}`);
                        //                 //文件信息
                        //                 console.log(`      文件名：${subFile.fileName}`);
                        //             });
                        //         }
                        //     });
                        // });

                    } else {
                        console.warn('No files found in fileList');
                    }
                    this.updateCommonLoading(false);

                    
            })      
            .catch(error => {
                    this.updateCommonLoading(false);              
                    console.error('Error in API chain:', error);
            });
        },
    },
    mounted() {
        this.load();
    },
    watch: {
        refreshDocumentPage(){
            this.load();
        }
    }
};

</script>

<style scoped>

/* 文档样式 ************************ */
/** 标题 和 一级标题*/
.document-form-title { 
    width: 100%;
    font-size: 1rem;
    font-weight: bold;
    padding: 0.5rem 0; /* 添加一些内边距 */
    margin-top: 0.3rem;
    padding-left: 0.7rem;
    border-bottom: 1px solid #ddd; /* 添加下边框与其他内容区分 */
    color: #666666; /* 字体颜色 */
    background-color: #f0f0f0;  /**#f0f0f0 */    
    text-align: left; /* 左对齐 */
    font-family: 'STZhongsong', '华文中宋', serif;
    box-sizing: border-box;
}


.document-list {
    margin-top: 0rem; /* 保持顶部间距 */
    padding: 0rem;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
.document-form-row {

    display: flex;
    width: 100%; /* 确保每一行占据整行 */
    border-bottom: 1px solid #ddd;
    padding: 0.5rem 0;
    box-sizing: border-box; /* 包含内边距和边框 */
    justify-content: space-between;
    align-items: center;

}

/** 二级标题*/
.document-form-label-two {
    font-size: 1rem;
    font-weight: bold;
    color: darkblue; /* 二级标题颜色 */
}
/** 三级标题*/
.document-form-label-three{
    color: #ff9800; /* 三级标题颜色 */
    font-size: 0.9rem;    
    text-align: left; /* 左对齐 */
    flex: 1;  
    padding-left: 1.7rem;
    font-family: 'STZhongsong', '华文中宋', serif;
    box-sizing: border-box; /* 包含内边距和边框 */
}

.document-form-label-doc {
    color: #00ADEF;
    font-size: 0.9rem;
    text-align: left; /* 左对齐 */
    flex: 1;  
    padding-left: 3.7rem;
    font-family: 'STZhongsong', '华文中宋', serif;
    box-sizing: border-box; /* 包含内边距和边框 */
    cursor: pointer;
}
/* 浮动（上传）按钮 */
.fab {
    position: fixed;
    bottom: 4rem;       /* 距离页面底部的距离 */
    right: 2rem;        /* 距离页面右侧的距离 */
    width: 3.5rem;      /* 按钮的宽度 */
    height: 3.5rem;     /* 按钮的高度 */
    background-color: #587AFF; /* 按钮的背景颜色 */
    /*  background: linear-gradient(to bottom right, #4A90E2, #0066CC); */
    color: #ffffff; /* 图标的颜色 */
    border-radius: 50%; /* 圆形按钮 */
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2); /* 按钮的阴影效果 */
    cursor: pointer;
    z-index: 1001; /* 确保按钮在其他元素之上 */
}
.fab i {
    font-size: 1.4rem; /* 图标的大小 */
}


</style>