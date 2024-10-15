
// src/store/workstation/approval/pending/project-initiation-approval-page.js

const state = {
    activeTabProjectInitiation: 'details',
};

const getters = {
    activeTabProjectInitiation: (state) => state.activeTabProjectInitiation,
};

const mutations = {
    setActiveTabProjectInitiation(state, activeTabProjectInitiation) {
        state.activeTabProjectInitiation = activeTabProjectInitiation;
    },
};

const actions = {
    updateActiveTab({ commit }, { activeTabProjectInitiation }) {
        commit('setActiveTabProjectInitiation', activeTabProjectInitiation);
    },
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
};
