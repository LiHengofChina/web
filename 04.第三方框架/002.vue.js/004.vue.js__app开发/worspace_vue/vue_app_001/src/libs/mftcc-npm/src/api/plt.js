import { get, postJson, postForm, del, putJson, findByPage } from "../axios";

const api = {
  brFindByPage: (data, success) => {
    postJson($servers.sys + "/sys/sysDept/findByPage", data, true, success);
  },
  brFindAllByPage: (data, success) => {
    postJson($servers.sys + "/sys/sysDept/findAllByPage", data, true, success);
  },
  customAPI: (url, data, success) => {
    postJson(url, data, true, success);
  },
};

export default api;
