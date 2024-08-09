
// src/store/workstation/approval.js
const state = {
    currentTab: 'my-approvals',
    title: '我的审批',
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
