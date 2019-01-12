import Vue from 'vue';
import VueRouter from 'vue-router';

//import 'config';
var CONFIG = {};
CONFIG.DEBUG = false;

// disable warn
//console.warn = function() {};

import 'three';
// must import aframe here to load components
import 'aframe';
import 'aframe-layout-component';
import 'networked-aframe';
import 'aframe-animation-component';
import 'aframe-src-fit-component';
import 'aframe-asset-on-demand-component';
import 'aframe-input-mapping-component';
import 'aframe-teleport-controls';
import 'aframe-extras';
import 'aframe-gui';
import 'aframe-html-shader';
import 'nipplejs';
import './components/aframe/play-gaze.js';
import './components/aframe/dynamic-autoplay.js';
import './components/aframe/avatar-rig';
import './components/aframe/ionicon';
import './components/aframe/mapbox-terrain.js';
import './components/hubs/virtual-gamepad-controls.js';
import './components/hubs/character-controller.js';
import './components/hubs/pitch-yaw-rotator.js';
import './components/hubs/look-on-mobile.js';

// controls
import {mappings, inputActions} from './controls/input-mappings';
import { runInThisContext } from 'vm';

import App from './App.vue';


//console.log(mappings);
//console.log(inputActions);
AFRAME.registerInputActions(inputActions, 'default');
AFRAME.registerInputMappings(mappings);


// router
Vue.use(VueRouter);
var router = new VueRouter({
  mode: 'history',
  routes: []
});

// ignore elements for Firefox
Vue.config.ignoredElements = ['a-scene', 'a-assets', 'a-gltf-model', 'a-entity', 'a-sphere', 'a-animation', 'a-sky', 'a-plane', 'a-mapbox-terrain', 'a-videosphere'];

//var app = new Vue(Vue.util.extend({ router }, App)).$mount('#app');
var app = new Vue({
    el: '#app',
    router: router,
    render: h => h(App)
  });
  