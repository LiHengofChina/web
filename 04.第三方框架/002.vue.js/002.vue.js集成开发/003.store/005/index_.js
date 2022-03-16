
//https://www.jianshu.com/p/eb23c72ab02a
import Vue from 'vue'

import Vuex from 'vuex'

Vue.use(Vuex)


export default new Vuex.Store({
	debug: true,
	
	state: {
	    		//这里放全局参数
		message: 'Hello!'
	},
	
	setMessageAction (newValue) {
		if (this.debug) console.log('setMessageAction triggered with', newValue)
		this.state.message = newValue
	},


	clearMessageAction () {
		if (this.debug) console.log('clearMessageAction triggered')
		this.state.message = ''
	},


	mutations: { //这里是set方法

	},
	getters: {   //这里是get方法

	},
	actions: {

	},
	modules: {   //这里是我自己理解的是为了给全局变量分组，所以需要写提前声明其他store文件，然后引入这里
	}
});
 