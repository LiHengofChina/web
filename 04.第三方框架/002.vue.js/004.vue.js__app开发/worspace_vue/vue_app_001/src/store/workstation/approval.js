
// src/store/workstation/approval/approval.js
const state = {
    currentTab: 'my-approvals',
    title: '我的审批',
    activeTab: 'pending',
};

const getters = {
    currentTab: (state) => state.currentTab,
    title: (state) => state.title,
    activeTab: (state) => state.activeTab,
};

const mutations = {
    setCurrentTab(state, tab) {
        state.currentTab = tab;
    },
    setTitle(state, title) {
        state.title = title;
    },
    setActiveTab(state, activeTab) {
        state.activeTab = activeTab;
    },
};

const actions = {
    updateTitleAndTab({ commit }, { currentTab, title, activeTab }) {
        commit('setCurrentTab', currentTab);
        commit('setTitle', title);
        commit('setActiveTab', activeTab);
    },
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
};
