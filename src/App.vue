<template>
  <div id="app">
    <aframe-scene></aframe-scene>
    <hud v-if="sceneLoaded && !isMobile"></hud>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import axios from 'axios';

import aframeScene from './scene.vue';
import hud from './hud.vue';

export default {
    components: {
        aframeScene,
        hud
    },

    computed: mapState([
        'sceneLoaded',
        'isMobile',
    ]),

}
</script>