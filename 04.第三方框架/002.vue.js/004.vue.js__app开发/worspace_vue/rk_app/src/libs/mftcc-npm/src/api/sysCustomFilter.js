import { get, postJson, postForm, del, putJson, findByPage } from '../axios'
const api = {
  save: (data, success, error) => {
    let projectName;
    if (window.$servers && window.$servers.sys) {
      projectName = $servers.sys;
    } else {
      projectName = "/mftcc-sys-server";
    }
    postJson(projectName + "/customFilter/sysCustomFilter/save", data, true, success, error);
  },
  findByRouterOpNo: (data, success, error) => {
    let projectName;
    if (window.$servers && window.$servers.sys) {
      projectName = $servers.sys;
    } else {
      projectName = "/mftcc-sys-server";
    }
    postJson(projectName + "/customFilter/sysCustomFilter/findByRouterOpNo", data, true, success, error);
  },
};

export default api;