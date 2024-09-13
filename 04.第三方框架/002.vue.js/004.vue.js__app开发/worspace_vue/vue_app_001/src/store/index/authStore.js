// src/store/index/authStore.js
const state = {
    user: null,
    token: '',
    refreshToken: '',
};

const getters = {
    user: (state) => state.user,
    token: (state) => state.token,
    refreshToken: (state) => state.refreshToken
};

const mutations = {
    changeLogin(state, payload) {
        state.user = payload.user;
        state.token = payload.token;
        state.refreshToken = payload.refreshToken;
    }
};

const actions = {

};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
};
