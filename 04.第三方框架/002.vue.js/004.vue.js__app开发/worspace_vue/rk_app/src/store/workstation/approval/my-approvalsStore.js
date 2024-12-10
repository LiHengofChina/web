

const state = {
    activeTab: 'pending',
};

const getters = {
    activeTab: (state) => state.activeTab,
};

const mutations = {
    setActiveTab(state, activeTab) {
        state.activeTab = activeTab;
    },
};

const actions = {
    updateActiveTab({ commit }, { activeTab }) {
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
