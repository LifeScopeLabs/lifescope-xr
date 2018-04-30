import Vue from 'vue'
import globe from '../components/globe.vue';

const GeoJsonPlugin = {

    install(Vue, options) {
        Vue.component('globe', globe)
    }
  };
  
  Vue.use(GeoJsonPlugin)

  export default GeoJsonPlugin;