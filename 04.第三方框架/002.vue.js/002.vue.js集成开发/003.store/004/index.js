


//https://www.jianshu.com/p/2b502ab62dba

import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)



var state = {
	    count: 1
};

var actions = {
	    add({ commit }) {
	        commit("add");
	    }
};

var mutations = {
	    add(state, arg) {
	        state.count++;
	    }
};

var getters = {
	    countplus(state) {
	        return state.count + "的包装属性";
	    }
};

var store = new Vuex.Store({
    state, actions, mutations, getters
});


export default store

