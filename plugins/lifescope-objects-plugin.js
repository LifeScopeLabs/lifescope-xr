import Vue from 'vue'
import lifescopeObjects from '../components/lifescope-objects.vue';

const LifescopeObjectsPlugin = {

    install(Vue, options) {
        Vue.component('lifescope-objects', lifescopeObjects)
    }
  };
  
  Vue.use(LifescopeObjectsPlugin)

  export default LifescopeObjectsPlugin;
