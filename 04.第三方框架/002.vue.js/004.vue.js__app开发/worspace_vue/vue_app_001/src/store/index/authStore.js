// src/store/index/authStore.js
const state = {
    user: null,
    token: '',
    refreshToken: '',
    isExemptionfromlogin: false, //免登陆标记
    publicKey: `-----BEGIN PUBLIC KEY-----
MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAExjUb1+aTNZRCEqZcDCw8wbwgKCOyXUaHk0ORGEhQCjKil1HdYPs4KzwIvDwpDffuXd10c668JOXi/XkXcr4vEQ==
-----END PUBLIC KEY-----`,
};

const getters = {
    user: (state) => state.user,
    token: (state) => state.token,
    refreshToken: (state) => state.refreshToken,
    isExemptionfromlogin: (state) => state.isExemptionfromlogin,
    publicKey: (state) => state.publicKey,
};

const mutations = {
    changeLogin(state, payload) {
        state.user = payload.user;
        state.token = payload.token;
        state.refreshToken = payload.refreshToken;
    },
    setExemptionfromlogin(state, status) {
        state.isExemptionfromlogin = status;
    }
};

const actions = {
    updateExemptionfromlogin({ commit }, status) {
        commit('setExemptionfromlogin', status);
    }
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
};

