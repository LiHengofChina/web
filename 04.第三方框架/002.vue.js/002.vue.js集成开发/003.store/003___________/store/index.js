
import Vue from 'vue'

import Vuex from 'vuex'

import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

const module = {
	    state: {
	        user: {
	            name: 'rookie'
	        }
	    },
	    getters: {},
	    mutations: {
	        setUser(state, payload){
	            if(payload.hasOwnProperty('name')){
	                state.user.name = payload.name
	            }
	        }
	    },
	    plugins: [createPersistedState()]
}

const store = new Vuex.Store(module)
export default store

