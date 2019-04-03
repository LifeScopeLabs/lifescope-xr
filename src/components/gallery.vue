<template>
    <a-entity class="gallery">
        <!-- lights -->
        <a-entity light="type: ambient; color: #FFF; intensity: 0.8"></a-entity>
            <a-entity id="dirLight" light="type: directional; color: #FFF; intensity: 0.8" position="1 1 1"></a-entity>

        <!-- Floor -->
        <a-wooden-floor radius='6.1'></a-wooden-floor>

        <!-- Carousel -->
        <gallery-carousel />
      
        <!-- Earth -->
        <a-sphere id="Earth" class="boundry"
                    :position="'0 1.5 0' " 
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
        <a-entity id="Logo" :position="'0 2.6 0'"
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

    <!-- Demo Map -->
    <!-- Floor -->
    <!-- <a-mapbox-terrain latitude="34.023552" longitude="-118.286189" position="0 0 -10" zoom-level="11"></a-mapbox-terrain> -->
    <!-- World -->
    <!-- <a-mapbox-terrain latitude="34.023552" longitude="-118.286189" position="0 -4 0" zoom-level="11" scale="45 5 45"></a-mapbox-terrain> -->

  </a-entity>
</template>

<script>
import galleryCarousel from "./carousel/gallery-carousel.vue";

export default {

    components: {
        galleryCarousel
    },
}
</script>
