import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store';

// disable warn
//console.warn = function() {};

import 'three';
// must import aframe here to load components
import 'aframe';
import 'networked-aframe';
import 'aframe-input-mapping-component';
import 'aframe-teleport-controls';
import 'aframe-extras';
import 'aframe-sun-sky';
import 'aframe-forcegraph-component'
import 'nipplejs';
import './components/aframe/play-gaze.js';
import './components/aframe/dynamic-autoplay.js';
import './components/aframe/avatar-rig';
import './components/aframe/ionicon';
import './components/aframe/mapbox-terrain.js';
import './components/aframe/diorama.js';
import './components/aframe/woodenfloor.js';
import './components/hubs/virtual-gamepad-controls.js';
import './components/hubs/character-controller.js';
import './components/hubs/pitch-yaw-rotator.js';
import './components/hubs/look-on-mobile.js';
import './components/aframe/sun-sky-position.js';

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
Vue.config.ignoredElements = ['a-scene', 'a-assets', 'a-gltf-model', 'a-entity', 'a-sphere',
 'a-animation', 'a-sky', 'a-mapbox-terrain', 'a-wooden-floor', 'a-diorama-cyl',
 'a-sun-sky'];

//var app = new Vue(Vue.util.extend({ router }, App)).$mount('#app');
var app = new Vue({
    el: '#app',
    store,
    router: router,
    render: h => h(App)
  });
  