import Vue from 'vue';
import Vuex from 'vuex';

import xrModule from './modules/xr';

Vue.use(Vuex);

const store = () => new Vuex.Store({
	modules: {
        xr: xrModule
    }
});

export default store;
