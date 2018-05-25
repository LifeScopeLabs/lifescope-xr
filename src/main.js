import Vue from 'vue';
import VueRouter from 'vue-router';

import App from './App.vue';

// must import aframe here to load components
import 'aframe';
import 'aframe-layout-component';
import 'networked-aframe';
import 'aframe-animation-component';
// import 'aframe-fit-texture-component';
// import 'aframe-src-fit-component';
// require("@mohrtw/aframe-src-fit-component");
import './components/util/src-fit-build';

import 'three';

require("babel-core/register");
require("babel-polyfill");


// router
Vue.use(VueRouter);
var router = new VueRouter({
  mode: 'history',
  routes: []
});

//var app = new Vue(Vue.util.extend({ router }, App)).$mount('#app');
var app = new Vue({
    el: '#app',
    router: router,
    render: h => h(App)
  });
  