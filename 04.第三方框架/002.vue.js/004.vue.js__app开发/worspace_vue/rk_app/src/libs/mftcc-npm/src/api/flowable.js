import { get, postJson, postForm, del, putJson, findByPage } from "../axios";

const api = {
  getBizList: success => {
    get($servers.flowable + "/appcenter/getBizList", null, true, success);
  },
  getColList: (bizMark, success) => {
    get(
      $servers.flowable + "/appcenter/getColList/" + bizMark,
      null,
      true,
      success
    );
  },
  getSysTaskInfo: (data, success) => {
    postJson(
      $servers.flowable + "/appcenter/getSysTaskInfo",
      data,
      true,
      success
    );
  },
  getTimeLine: (data, success) => {
    postJson($servers.flowable + "/bpmn/getTimeLine", data, true, success);
  },
  simulationByTraceNo: (data, success) => {
    postJson(
      $servers.flowable + "/bpmn/simulationByTraceNo",
      data,
      true,
      success
    );
  },
  getApprovalDetail: (data, success) => {
    postJson(
      $servers.flowable + "/appcenter/getApprovalDetail",
      data,
      true,
      success
    );
  },
  needOperated: (data, success) => {
    postForm($servers.flowable + "/flowable/needOperated", data, true, success);
  },
  doCommitDemo: (data, success) => {
    postForm($servers.flowable + "/flowable/doCommitDemo", data, true, success);
  },
  recallAndCancel: (data, success) => {
    postForm(
      $servers.flowable + "/flowable/recallAndCancel",
      data,
      true,
      success
    );
  },
  getFinishNodeList: (data, success) => {
    postJson(
      $servers.flowable + "/appcenter/getFinishNodeList",
      data,
      true,
      success
    );
  },
  getFinishParentNodeList: (data, success) => {
    postJson(
      $servers.flowable + "/appcenter/getFinishParentNodeList",
      data,
      true,
      success
    );
  },
  getNextAllNodeList: (data, success) => {
    postJson(
      $servers.flowable + "/appcenter/getNextAllNodeList",
      data,
      true,
      success
    );
  },
  getCountForToDoTask: (data, success) => {
    postJson(
      $servers.flowable + "/appcenter/getCountForToDoTask",
      data,
      true,
      success
    );
  },
  getCountListForToDoTask: (data, success) => {
    postJson(
      $servers.flowable + "/appcenter/getCountListForToDoTask",
      data,
      true,
      success
    );
  },
  getBrTree: (data, success, error) => {
    postJson($servers.flowable + "/br/listForTree", data, true, success, error);
  },
  getUserData: (data, success, error) => {
    postJson(
      $servers.flowable + "/user/listByBrNo",
      data,
      true,
      success,
      error
    );
  }
};

export default api;
