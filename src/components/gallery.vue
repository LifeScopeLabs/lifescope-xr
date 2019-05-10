<template>
    <a-entity class="gallery">
        <!-- lights -->
        <a-entity light="type: ambient; color: #FFF; intensity: 0.8"></a-entity>
            <a-entity id="dirLight" light="type: directional; color: #FFF; intensity: 0.8" position="1 1 1"></a-entity>

        <!-- Floor -->
        <a-wooden-floor radius='6.1' :bump="bump" :normal="normal"></a-wooden-floor>

        <!-- Carousel -->
        <gallery-carousel />

        <!-- Commercial -->
        <commercial/>
      
        <!-- Earth -->
        <a-sphere id="Earth" class="boundry"
                    :position="'0 3.5 0' " 
                    radius=".99" 
                    material="src:#earth; roughness: 1; transparent: true; opacity: 0.9;">

            <a-animation attribute="rotation"
                    easing="linear" 
                    dur="150000"
                    fill="forwards"
                    to="0 360 0"
                    repeat="indefinite"></a-animation>
        </a-sphere>

        <!-- Logo  -->
        <a-entity id="Logo" :position="'0 4.6 0'"
                rotation="0 0 0">
            <a-gltf-model src="#logo" scale="0.075 0.075 0.075">
            </a-gltf-model>
            <a-animation attribute="rotation"
                    easing="linear" 
                    dur="42000"
                    fill="forwards"
                    to="0 -360 0"
                    repeat="indefinite"></a-animation>
        </a-entity>

        <!-- terrain -->
        <a-mapbox-terrain id="mapbox-floor" v-if="floorMapActive == true"
            :latitude="mapLatitude" :longitude="mapLongitude" position="0 0.1 0" zoom-level="9"
            rows="1" scale="4 1 4"></a-mapbox-terrain> 

        <a-mapbox-terrain v-if="floorMapActive == true"
            :latitude="mapLatitude" :longitude="mapLongitude" position="6.5 -4 0.5" zoom-level="6"
            rows="4" scale="32 1 32"></a-mapbox-terrain>
  </a-entity>
</template>

<script>
import { mapState } from 'vuex';

import galleryCarousel from "./carousel/gallery-carousel.vue";
import commercial from "./commercial/commercial.vue";

export default {

    components: {
        galleryCarousel,
        commercial
    },

    computed: mapState('xr/graphics',
    [
        'floorMapActive',
        'worldMapActive',
        'mapLatitude',
        'mapLongitude',
        'bump',
        'normal'
    ]),
}
</script>
