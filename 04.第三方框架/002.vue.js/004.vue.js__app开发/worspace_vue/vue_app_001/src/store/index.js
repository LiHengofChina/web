

// src/store/index.js
import { createStore } from 'vuex';
import auth from './index/auth.js';
// import index from './index/index.js';

export default createStore({
  modules: {
    auth,
    // index,
  },
});
