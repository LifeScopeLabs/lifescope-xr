<template>
  <div id="app">
    <aframe-scene></aframe-scene>
    <hud v-if="sceneLoaded && !inVR"></hud>
    <loading-screen v-if="!sceneLoaded"/>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import axios from 'axios';

import aframeScene from './scene.vue';
import LoadingScreen from './LoadingScreen.vue';
import hud from './components/hud/hud.vue';

export default {
    components: {
        aframeScene,
        LoadingScreen,
        hud
    },

    computed: {
      ...mapState('xr',
      [
        'inVR',
        'sceneLoaded',
        'isMobile',
      ])
    }
}
</script>

<style src="./app.scss"></style>
