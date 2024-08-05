import { createStore } from 'vuex'

export default createStore({
  state: {
    user: null,
    token: '',
  },
  getters: {
      user: (state) => state.user
  },
  mutations: {
      changeLogin(state, payload) {
          state.user = payload.user;
          state.token = payload.token;
      }
  },
  actions: {

  },
  modules: {

  }
})
