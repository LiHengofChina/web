import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [
    // createPersistedState({
    //   key: this.$config.session_storage_key || "mftcc_vuex",
    //   storage: window.sessionStorage
    // })
  ],
  state: {
    // 存储token
    user: {},
    buttonAuth: {},
    refreshToken: "",
    token: "",
    buttons: [],
    menu: [],
    routes: [],
    breadList: [],
    keepAlive: "",
    identify: {},

    components: [],
    editField: null,
    editType: "",
    editFieldType: "",
    editConfigData: null,
    tenantId: null
  },
  getters: {
    user: state => state.user,
    buttonAuth: state => state.buttonAuth,
    refreshToken: state => state.refreshToken,
    token: state => state.token,
    buttons: state => state.buttons,
    menu: state => state.menu,
    routes: state => state.routes,
    breadList: state => state.breadList,
    keepAlive: state => state.keepAlive,
    identify: state => state.identify,

    components: state => state.components,
    editField: state => state.editField,
    editType: state => state.editType,
    editFieldType: state => state.editFieldType,
    editConfigData: state => state.editConfigData,
    tenantId: state => state.tenantId
  },

  mutations: {
    changeLogin(state, user) {
      sessionStorage.clear();
      state.user = user.user;
      state.buttonAuth = user.buttonAuth;
      state.buttons = user.buttons;
      state.refreshToken = user.refreshToken;
      state.token = user.token;
      state.menu = user.menu;
      state.routes = user.routes;
      state.tenantId = user.tenantId;
      //重置
      state.breadList = [];
      state.keepAlive = "";
    },
    clearLogin(state) {
      sessionStorage.clear();
      state.user = null;
      state.refreshToken = null;
      state.token = null;
      state.tenantId = null;
    },
    set_breadList(state, item) {
      state.breadList = item;
    },
    set_keepAlive(state, item) {
      state.keepAlive = item;
    },
    set_token(state, item) {
      state.token = item;
    },
    set_tenantId(state, item) {
      state.tenantId = item;
    },
    set_refreshToken(state, item) {
      state.refreshToken = item;
    },
    set_identifyCode(state, item) {
      state.identify = {
        identifyCode: item.identifyCode,
        endTime: new Date().getTime() + item.time
      };
    },

    /* iframe相关 */
    set_initParams(state, initParams) {
      Vue.prototype.$initParams = initParams;
    },

    /* 设计器相关 */
    set_editField(state, editField) {
      state.editField = editField;
    },
    clear_editField(state) {
      state.editField = null;
      state.editFieldType = null;
      state.editConfigData = null;
    },
    set_editFieldType(state, editFieldType) {
      state.editFieldType = editFieldType;
    },
    set_components(state, components) {
      state.components = components;
    },
    set_editType(state, editType) {
      state.editType = editType;
    },
    set_editConfigData(state, editConfigData) {
      state.editConfigData = editConfigData;
    }
  }
});
