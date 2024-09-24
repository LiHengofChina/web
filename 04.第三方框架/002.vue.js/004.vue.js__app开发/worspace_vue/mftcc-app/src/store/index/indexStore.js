// src/store/index/index.js
const state = {
    currentTab: 'home',
    title: '首页',
};

const getters = {
    currentTab: (state) => state.currentTab,
    title: (state) => state.title,
};

const mutations = {
    setCurrentTab(state, tab) {
        state.currentTab = tab;
    },
    setTitle(state, title) {
        state.title = title;
    },
};

const actions = {
    updateTitleAndTab({ commit }, { currentTab, title }) {
        commit('setCurrentTab', currentTab);
        commit('setTitle', title);
    },
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
};
