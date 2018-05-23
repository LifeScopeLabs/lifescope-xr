import Vue from 'vue';
import VueResource from 'vue-resource';

import App from './App.vue';

// must import aframe here to load components
import 'aframe';
import 'aframe-layout-component';
import 'networked-aframe';
//import 'easyrtc';

import 'three';

require("babel-core/register");
require("babel-polyfill");

// // CORS
// Vue.use(VueResource);
// // Vue.http.headers.common['Access-Control-Allow-Origin'] = '*';
// // Vue.http.headers.common['Access-Control-Request-Method'] = '*';
// Vue.http.interceptors.push((request, next) => {
//   request.headers.set('Access-Control-Allow-Origin', '*');
//   request.headers.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');//'*');
//   next();
// });

//var app = new Vue(Vue.util.extend({ router }, App)).$mount('#app');
var app = new Vue({
    el: '#app',
    render: h => h(App)
  });
  