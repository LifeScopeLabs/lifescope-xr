import Vue from 'vue'
import Vuex from 'vuex'
import lifescopeObjects from 'lifescope-objects';

Vue.use(Vuex);

debugger

const store = () => new Vuex.Store({
    state: {
      LSObjs: lifescopeObjects
    }
  });

export default store;