import Vue from 'vue';
import VueRouter from 'vue-router';
import store from './store';
import { VueHammer } from 'vue2-hammer';

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import './lib/three/three';
import BufferGeometryUtils from './lib/three/BufferGeometryUtils';
THREE.BufferGeometryUtils = BufferGeometryUtils;
// must import aframe here to load components
import 'aframe';
import 'networked-aframe';
import 'aframe-input-mapping-component';
import 'aframe-teleport-controls';
import 'aframe-extras';
import 'aframe-gui';
import 'aframe-super-keyboard';
import 'aframe-sun-sky';
import 'nipplejs';
import './components/aframe/arrow.js';
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
import './directives/scroll-directive.js';

// controls
import {mappings, inputActions} from './controls/input-mappings';
import { runInThisContext } from 'vm';

import App from './App.vue';
import TextureLoaderHelper from './util/TextureLoaderHelper';


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
 'a-animation', 'a-sky', 'a-light', 'a-asset-item',
 'a-mapbox-terrain',
 'a-sun-sky',
 'a-rail', 'a-diorama', 'a-wooden-floor', 'a-diorama-column', 'a-diorama-image',
 'a-arrow',
 'a-gui-flex-container', 'a-gui-label', 'a-gui-radio', 'a-gui-cursor', 'a-gui-toggle', 'a-gui-input',
 'a-gui-button'];

// mobile swipe controls
Vue.use(VueHammer);

//var app = new Vue(Vue.util.extend({ router }, App)).$mount('#app');
var app = new Vue({
    el: '#app',
    store,
    router: router,
    render: h => h(App)
  });
  