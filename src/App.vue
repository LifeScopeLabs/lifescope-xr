<template>
  <div id="app">
    <aframe-scene></aframe-scene>
    <hud v-if="sceneLoaded && !isMobile && !isCommercial"></hud>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import axios from 'axios';

import aframeScene from './scene.vue';
import hud from './components/hud/hud.vue';

export default {
    components: {
        aframeScene,
        hud
    },

    computed: {
      sceneLoaded() { this.$store.state.xr.sceneLoaded },
      isMobile() { this.$store.state.xr.isMobile },
      isCommercial() { this.$store.state.xr.commercial.isCommercial }
    }
}
</script>