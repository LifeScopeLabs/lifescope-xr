<template>
  <div id="xrapp">
    <aframe-scene></aframe-scene>
    <!-- <hud v-if="sceneLoaded && !inVR"></hud> -->
    <loading-screen v-if="!sceneLoaded"/>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import aframeScene from './scene.vue';
import LoadingScreen from './LoadingScreen.vue';

import { AppTypeEnum } from '../src/store/modules/xr/index.js';
// import hud from './components/hud/hud.vue';

export default {

    props: {
      apptype: { default: 'xr' }
    },

    components: {
        aframeScene,
        LoadingScreen,
        // hud
    },

    computed: {
      ...mapState('xr',
      [
        'inVR',
        'sceneLoaded',
        'isMobile',
      ])
    },

    beforeMount () {
      var type = this.apptype == 'xr' ? 'XR' : 'APP';
      this.$store.commit('xr/SET_APPTYPE', type);
    }
}
</script>

<style src="./app.scss"></style>
