<template>
    <div v-if="showDocumentUploadPanel" class="modal-overlay" @click="cancelUpload"></div>
    <transition name="slide-up">
        <div v-if="showDocumentUploadPanel" class="modal-panel">
            
            <!-- 标题 -->
            <div class="modal-header">
                <label class="modal-title">要件资料</label>
            </div>

            <!-- 文件上传区域 -->
            <div class="file-upload-section">
                <div v-for="(typeObj, typeIndex) in typeClass" :key="typeIndex" class="file-type-section">
                    
                    <!-- 大标题，如 -->
                    <div class="file-type-header">
                        <img src="/rk_app/images/doc/imgs/file/type_class.png" class="type-class-icon" alt="Folder Icon" />
                        <span class="coll-title">{{ typeObj.pName }}</span>
                    </div>
                    
                    <div class="file-items-wrapper">
                        <div class="file-item" v-for="(fileItem, index) in typeObj.fileAry" :key="index">
                            <div class="file-container" @click="goFileDetail(fileItem)">
                                <img v-if="fileItem.fileImgUrl" :src="fileItem.fileImgUrl" class="file-icon"/>
                                <div v-else class="file-placeholder">
                                    <img src="/rk_app/images/doc/imgs/file/other.png" class="file-icon"/>
                                </div>
                            </div>
                            <div class="file-type">{{ fileItem.typeName }}</div>
                            <input type="file" ref="fileInput" @change="handleFileChange($event, fileItem)" style="display: none;" />
                            <el-button size="mini" type="primary" @click="triggerFileInput(index)">上传</el-button>
                        </div>
                    </div>
                </div>
            </div>


            <!-- 取消和上传按钮 -->
            <div class="modal-footer">
                <div class="modal-spacer-div"></div>
                <div class="modal-spacer-div"></div>                
                <div class="modal-spacer-div"></div>
                <button class="modal-cancel-button" @click="cancelUpload">关 闭</button>
            </div>

        </div>
    </transition>
</template>

<script>

import { mapGetters, mapActions } from 'vuex';

export default {
    name: "ImportantDocuments",
    computed: {
        ...mapGetters('approval_common_store', [

            'showDocumentUploadPanel',
            'fileListData',
            'appName',


            'prdUniqueVal',
            'flowNo',
            'commonApplyId',
            'wkfNodeNo',

            'refreshDocumentPage',

        ]),
    },    
    data() {
        return {

            typeClassShowFlag: false, 
            fileData: {},//初始化要件参数
            typeClass: [], //要件类型列表
            typeClassActiveName:[],//需要展开的要件类型

        };
    },
    methods: {
        ...mapActions('approval_common_store', [
            'updateCommonLoading',
            'updateShowDocumentUploadPanel',

            'updateRefreshDocumentPage',

        ]),


        /*
         * 点击 "上传按钮" 触发 
         */
        triggerFileInput(index) {

            // 触发文件选择框
            this.$refs.fileInput[index].click();
        },
        /**
         *  点击文件之后 
         */
        handleFileChange(event, fileItem) {
            const file = event.target.files[0];
            if (file) {
                const params = { file };  // 用于模拟的 `params` 对象
                this.uploadFile(fileItem)(params);
            }
        },
        uploadFile(fileItem) {
            return async (params) => {
                const file = params.file;
                const formData = new FormData();
                
                formData.append('file', file);
                formData.append('appName', this.appName);
                

                //================= 这里只给四个必填参数：app端 //TODO
                let uploadParm =  {
                    "prdUniqueVal": this.prdUniqueVal,
                    "flowNo": this.flowNo,
                    "bizNo": this.commonApplyId,
                    "nodeNo": this.wkfNodeNo,
                    "appName": this.appName,

                    "applyRelatedId": this.commonApplyId,

                    "cusRelatedId": this.commonCusId,
                    "busRelatedId": this.commonMainId,
                    "addFloderFlag": false,
                    "isEditFlag": "1",
                    "isMultiple": true,

                };
                formData.append('uploadParm', JSON.stringify(uploadParm || {}));
                formData.append('folderId', fileItem.scId);


                this.updateCommonLoading(true);

                await new Promise(resolve => setTimeout(resolve, 500));


                // 调用上传 API
                this.uploadFileFun(formData).then((res) => {
                    if (res.code === 0 && res.data.code === '0000') {

                        
                        this.updateCommonLoading(false);
                        // 其他成功处理逻辑
                    } else {
                        this.updateCommonLoading(false);
                        this.$alert(res.data.msg, '上传错误', { type: 'error' });
                    }
                });

            };
        },
        uploadFileFun(formData){
            return import('@/api/workstation/approval/doc/doc_api')
            
                .then(({ default: api }) => {
                    return new Promise((resolve, reject) => {
                        api.uploadFileFun(
                            formData,
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

        goFileDetail(fileItem) {
            // 查看文件详情逻辑
            console.log('Viewing file detail for', fileItem.typeName);
        },

        cancelUpload() {
            this.updateShowDocumentUploadPanel(false); //          

            //让文档tab刷新
            if(this.refreshDocumentPage){
                this.updateRefreshDocumentPage(false);
            }else{
                this.updateRefreshDocumentPage(true);
            }

        },



        /**
         * 初始化要件数据
         */ 
        fileDateInit(fileList) {
            let file = {};

            file.fileList = fileList.list;
            file.fileList.forEach(item => {

                item.fileTooltip = '这是提示信息'//提示信息

                if (item.ifUpload == "1") {//是否必填
                    item.require = true
                } else {
                    item.require = false
                }

                item.fileList.forEach(itemS => {//处理路径
                    if (itemS.filePath) {
                        let type = itemS.filePath.substring(itemS.filePath.indexOf(".") + 1);
                        type = type.toLowerCase();

                        if (type == "docx" || type == "doc") {//如果是word文档格式
                            itemS.fileImgUrl = "/rk_app/images/doc/imgs/file/word.png";
                        } else if (type == "mp4") {//如果是视频格式
                            itemS.fileImgUrl = "/rk_app/images/doc/imgs/file/video.png";
                            itemS.url = window.config.host.gateway_path + '/' + this.$config.servers.doc + '/file/docFileInf/getFileStream/' + itemS.fileId
                        } else if (type == "pdf") {//如果是pdf文档
                            itemS.fileImgUrl = "/rk_app/images/doc/imgs/file/pdf.png";
                        } else if (type === 'txt') {//如果是text文本
                            itemS.fileImgUrl = "/rk_app/images/doc/imgs/file/txt.png";
                        } else if (type === 'xlsx' || type === 'xls' || type === 'csv') {//如果是excel表格
                            itemS.fileImgUrl = "/rk_app/images/doc/imgs/file/exl.png";
                        } else if (type === 'zip' ||
                                    type === 'jar' ||
                                    type === 'rar' ||
                                    type === '7z' ||
                                    type === 'cab') 
                        {//如果是压缩包
                            itemS.fileImgUrl = "/rk_app/images/doc/imgs/file/rar.png";
                        } else if (type == 'jpeg' || type == 'png' || type == 'jpg') {
                            //如果是图片
                            itemS.fileImgUrl = window.config.host.gateway_path + '/' + this.$config.servers.doc + '/file/docFileInf/getFileStream/' + itemS.fileId
                            itemS.url = window.config.host.gateway_path + '/' + this.$config.servers.doc + '/file/docFileInf/getFileStream/' + itemS.fileId
                        }else if(type == 'ppt' || type == 'pptx'){
                            itemS.fileImgUrl = "/rk_app/images/doc/imgs/file/ppt.png";
                        }


                    }
                });
            });
            this.fileData = file;
            this.packageTypeCassList(); 

        },
        /**
        * 封装一级类型
        */
        packageTypeCassList(){
            let fileList = this.fileListData.list;

            if( fileList != null && fileList.length > 0){

                let tmpMap = {};
                let tmpJson = {};

                //挑出一级类别
                for(let i=0; i < fileList.length; i++){
                    let pNo = fileList[i]["parentTypeNo"];
                    let pName = fileList[i]["parentTypeName"];
                    tmpMap[pNo] = pName;
                    tmpJson[pNo] = new Array();
                }

                //封装列表
                for(let i=0;i<fileList.length;i++){
                    let pNo = fileList[i]["parentTypeNo"];
                    tmpJson[pNo].push(fileList[i]);
                }

                // 封装数组
                for(let typeNo in tmpMap){
                    let tmpTypeJson = {
                        pNo: typeNo,
                        pName: tmpMap[typeNo],
                        fileAry: tmpJson[typeNo]
                    }
                    this.typeClass.push(tmpTypeJson);//要件类型列表
                    this.typeClassActiveName.push(typeNo);
                }
                this.typeClassShowFlag = true;
            }
        },
    },
    watch: {
        showDocumentUploadPanel(newValue){
            if(newValue){

                this.typeClassShowFlag = false;
                this.fileData =  {};
                this.typeClass = [];
                this.typeClassActiveName = [];


                this.fileDateInit(this.fileListData);
            }
        }
    }
};
</script>

<style scoped>
/* 要件资料 ************************ */
.modal-panel {
    border-top: 1px solid #ddd;
    position: fixed;
    box-sizing: border-box;
    bottom: 19%;
    left: 50%;
    transform: translate(-50%, 0); /* 水平居中 */
    width: 90%;
    background-color: #fff;

    border: 1px solid rgba(0, 0, 0, 0.2); /* 添加边框，颜色和阴影一样 */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* 阴影保持不变 */

    border-radius: 10px;
    padding: 0rem;
    z-index: 1002;
    overflow-y: hidden;
    overflow-x: hidden; /* 禁止水平滚动 */
    overflow: visible; /* 允许内容溢出 */
    max-height: 60vh; /* 设置最大高度为视口的80% */
    display: flex;
    flex-direction: column;
}
/** 弹窗头部 */
.modal-header {
    display: flex;
    justify-content: center; /* 水平居中对齐 */
    align-items: center; /* 垂直居中对齐 */
    width: 100%; /* 占满可用空间 */
    margin-bottom: 1rem;
    /*text-align: center;  使文字居中 */
    position: sticky;
    top: 0;
    z-index: 1;
}
.required {
    color: red;
    font-weight: bold;
    font-size: 0.9rem;
    padding: 0.5rem 0;
    margin-right: 0.2rem;
    position: relative;
    top: 2px; /* 细微调整符号的位置 */    
}
.modal-title {
    display: block;
    position: relative;
    text-align: center; /* 确保文本在自身容器中居中 */
    font-size: 0.9rem; /* 根据需要调整字体大小 */
    font-weight: bold; /* 加粗字体 */
    color: #666666; /* 设置文本颜色 */
    width: 100%; /* 使其占满行宽以便可以使用flex */
    padding: 0.5rem 0;
}
.modal-title::after {
    content: '';
    display: block;
    width: 100%; /* 下划线的宽度 */
    height: 1px; /* 下划线的高度 */
    background-color: #ddd; /* 下划线的颜色 */
    position: absolute;
    bottom: 0; /* 紧贴底部 */
    left: 0; /* 左侧对齐 */
}


.file-upload-section {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: flex-start;
    padding: 1rem 0.5rem;
    gap: 1rem;
    overflow-y: auto;
    -ms-overflow-style: none; /* 隐藏滚动条 - IE 和 Edge */
    scrollbar-width: none; /* 隐藏滚动条 - Firefox */
}
.file-upload-section::-webkit-scrollbar {
    display: none; /* 隐藏滚动条 - Chrome 和 Safari */
}

.file-type-section {
    display: flex;
    flex-direction: column;
    width: 100%; /* 占满整行 */
    margin-bottom: 1rem; /* 添加底部间距 */
}
.file-type-header {
    font-weight: bold;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding-left: 0.5rem; /* 可根据需要调整左侧间距 */
}
.type-class-icon {
    width: 24px; /* Adjust as needed */
    height: 24px; /* Adjust as needed */
    margin-right: 8px; /* Add some space between the icon and text */
    vertical-align: middle; /* Aligns the icon with the text */
}

.coll-title {
    font-weight: bold;
    font-size: 1rem;
    color: #333; /* Adjust the color as needed */
    vertical-align: middle;
}
.file-items-wrapper {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
}
.file-item {
    width: calc(25% - 0.75rem);
    text-align: center;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 0.5rem;
}


/* 要件资料面板-上传资料部分 */
.file-container {
    width: 100%;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #f9f9f9;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.5rem;
}


.file-icon {
    width: 50px;
    height: 50px;
}

.file-type {
    font-size: 0.85rem;
    color: #666;
    margin-top: -0.5rem;
    text-align: center;
    width: 100%;
    flex-shrink: 0;
}

.el-button {
    width: 70%;
    margin-top: auto; /* 保证按钮始终在底部 */
}

/* 要件资料面板-底部 */
.modal-footer {
    display: flex;
    justify-content: flex-end;
    padding: 0;
    width: 100%; /* 确保按钮占据整行 */
    position: sticky;
    bottom: 0;

    z-index: 1;
}
.modal-spacer-div {
    flex: 1; /* 每个空白 div 占据 25% 的宽度 */
}
.modal-cancel-button {
    flex: 1;
    padding: 0.5rem 0rem;
    margin: 0 0.5rem;
    font-size: 0.9rem;
    cursor: pointer;
    border: none;
    border-radius: 0.25rem;
    width: 50%; 
    max-width: calc(50% - 1rem);
    margin-bottom: 1rem;
    margin-top: 0.5rem; /* 减少按钮上方的间距 */
}
.modal-cancel-button {
    background-color: #268FFF;
    color: #fff;
}


</style>
