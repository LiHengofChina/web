import {get, postJson, postForm, del, putJson, findByPage} from '../axios'
let productName = config.designer_server || "mftcc-sys-server";
let productType = productName.split("-")[1];
const api = {
  getFormData: (type, success) => {
    get(`${productName}/design/list/${productType}/${type}`, null, false, success);
  },
  find: (type, name, success) => {
    get(
      `${productName}/design/find/${productType}/${type}/${name}`,
      null,
      false,
      success
    );
  },
};

export default api;
