<template>
  <div id="app">
    <aframe-scene></aframe-scene>
    <hud></hud>
  </div>
</template>

<script>

import aframeScene from './scene.vue';
import hud from './hud.vue';

export default {
    components: {
        aframeScene,
        hud
    },
}
</script>