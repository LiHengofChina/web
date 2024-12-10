
// src/api/workstation/approval/doc/doc_api.js


const api = {
    /**
     * 获取office文件对象
     */
    getOfficeFileObj: async(fileId, config, success, error) => {
        const { get } = await import(/* webpackChunkName: "axios-module" */ "@/libs/mftcc-npm/src/axios/index");
        const url = `/${config.servers.doc}/file/docFileInf/getOfficeFileObj/` + fileId;
        get(
            url,
            null,
            true,
            success,
            error
        );
    },
    /***
     * POST 获取文件资料
     */
    relatedFileList: async( data, config, success, error) => {
        const {  postJson } = await import(/* webpackChunkName: "axios-module" */ "@/libs/mftcc-npm/src/axios/index");
        const url = `/${config.servers.doc}/file/docFileInf/relatedFileList`;

        if(`${window.$$$store.state.approval_common_store.appName}` === 'lease'){
            postJson(
                url,
                data,
                true,
                success,
                error
            );
        }else if(`${window.$$$store.state.approval_common_store.appName}` === 'loan'){
            postJson(
                url,
                data.getFileParameter,
                true,
                success,
                error
            );
        }        

    },
    /***
     * POST 文件参数列表
     */
    getFileParamList: async( data, config, success, error) => {
        const {  postJson } = await import(/* webpackChunkName: "axios-module" */ "@/libs/mftcc-npm/src/axios/index");
        let url = '';

        if(`${window.$$$store.state.approval_common_store.appName}` === 'lease'){

            url = `/${config.servers.lease}/main/leaseMain/getFileParamList`;

        }else if(`${window.$$$store.state.approval_common_store.appName}` === 'loan'){
            url = `/${config.servers.loan}/main/loanMain/getFileParamList`;

        }

        postJson(
			url,
            data,
            true,
            success,
            error
        );
    },
    fileAutoInitFun: async(data, config, success, error) => {
        const {  putJson } = await import(/* webpackChunkName: "axios-module" */ "@/libs/mftcc-npm/src/axios/index");
        const url  = `/${config.servers.doc}/file/docFileBizFiletypeConfig/fileAutoInitFun`;
        putJson(
            url,
            data,
            true,
            success,
            error
        );
    },
    //单个要件初始化
    findTypeAndList: async(data, config,success, error) => {
        const {  postJson } = await import(/* webpackChunkName: "axios-module" */ "@/libs/mftcc-npm/src/axios/index");
        const url  = `/${config.servers.doc}/file/docFileBizFiletypeConfig/findTypeAndList`;
        postJson(
            url,
            data,
            true,
            success,
            error
        );
    },

	uploadFileFun: async(data, config, success, error) => {
        const {  uploadFile } = await import(/* webpackChunkName: "axios-module" */ "@/libs/mftcc-npm/src/axios/index");
        const url  = `/${config.servers.doc}/file/docFileBizFiletypeConfig/upLoadFile`;
		uploadFile(
			url,
			data,
			true,
			success,
            error
		);
	},

};

export default api;


