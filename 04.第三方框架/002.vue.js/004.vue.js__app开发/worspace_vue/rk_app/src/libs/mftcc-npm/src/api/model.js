import { get, postJson, postForm, del, putJson, findByPage } from '../axios'

const api = {
  getTreeData: (data, success, error) => {
    get($servers.flowable + "/manager/model/getModelHistListById", data, true, success, error);
  },
  findByPage: (data, success, error) => {
    findByPage($servers.flowable + "/manager/model/modelList", data, true, success, error);
  },
  getRuleTreeData: (data, success, error) => {
    postForm($servers.rule + "/modelTree/find4ListForForm.action", data, true, success, error);
  },
};

export default api;
