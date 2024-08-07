import { createStore } from 'vuex'

export default createStore({
  state: {
    user: null,
    token: '',
    refreshToken: '',
  },
  getters: {
      user: (state) => state.user,
      token: (state) => state.token,
      refreshToken: (state) => state.refreshToken
  },
  mutations: {
      changeLogin(state, payload) {
          state.user = payload.user;
          state.token = payload.token;
          state.refreshToken = payload.refreshToken;
      }
  },
  actions: {

  },
  modules: {

  }
  
})
