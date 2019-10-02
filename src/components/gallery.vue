<template>
    <a-entity class="gallery">
        <!-- lights -->
        <a-entity light="type: ambient; color: #FFF; intensity: 0.8"></a-entity>
        <a-entity id="dirLight" light="type: directional; color: #FFF; intensity: 0.8;" position="-1 -1 0"></a-entity>
        <a-light type='point' color='#FFF' intensity='0.8' position="10 10 0" ></a-light>
        <!-- <a-light type='hemisphere' color='#FFF' groundColor='#00F' intensity='0.8' ></a-light> -->

        <!-- Floor -->
        <a-wooden-floor v-if="floorActive"
            class="boundry"
            :radius='floorRadius' :radialsegments='numberOfSegments'
            :bump="bump" :normal="normal" :quality="quality" :shading="textureShading"
            rotation="0 135 0"></a-wooden-floor>

        <!-- Carousel -->
        <gallery-carousel />
      
        <!-- Earth -->
        <a-sphere v-if="globeActive"
                id="Earth" class="boundry clickable"
                @click="toggleLayout"
                :position="'0 1.5 0' " 
                radius=".99" 
                material="src:#earth; roughness: 1; transparent: true; opacity: 0.9;"
                animation="property: rotation; easing: linear; to: 0 360; dur: 150000; loop: true;">
        </a-sphere>

        <!-- Logo  -->
        <a-entity v-if="globeActive"
                id="Logo" :position="'0 2.6 0'"
                rotation="0 0 0"
                animation="property: rotation; easing: linear; to: 0 -360; dur: 42000; loop: true;">
            <a-gltf-model 
                class="clickable"
                @click="toggleLayout"
                src="#logo"
                scale="0.075 0.075 0.075">
            </a-gltf-model>
        </a-entity>

    <!-- Demo Map -->
    <!-- Floor -->
    <a-mapbox-terrain v-if="floorMapActive == true"
        position="0 0.1 0" :scale="floorScale + ' 1 ' + floorScale"
        :latitude="mapLatitude" :longitude="mapLongitude"
        :zoom-level="floorZoom" :rows="floorRows"
        :highdpi="floorHighDPI"
        :heightmap="floorMapHeightmap"
        :heightmapheight="floorMapHeight"
        :type="mapboxType"></a-mapbox-terrain>
    <!-- World -->
    <a-mapbox-terrain v-if="worldMapActive == true"
        position="0 -4 0" :scale="worldScale + ' 1 ' + worldScale"
        :latitude="mapLatitude" :longitude="mapLongitude"
        :zoom-level="worldZoom" :rows="worldRows"
        :highdpi="worldHighDPI"
        :heightmap="worldMapHeightmap"
        :heightmapheight="worldMapHeight"></a-mapbox-terrain>

  </a-entity>
</template>

<script>
import { mapState } from 'vuex';

import galleryCarousel from "./carousel/gallery-carousel.vue";

import { SceneLayoutEnum } from '../store/modules/xr';
import { ShadingEnum } from "../store/modules/xr/modules/graphics";

export default {

    components: {
        galleryCarousel
    },

    computed: {
        textureShading() {
            switch (this.shading) {
                case ShadingEnum.DEFAULT:
                    return 'default';
                case ShadingEnum.CEL:
                    return 'cel';
                default:
                    return 'default';
            }
        },

        ...mapState('xr',
            [
                'sceneLayout',
            ]
        ),

        ...mapState('xr/graphics',
            [
                'bump',
                'normal',
                'quality',
                'shading',
            ]
        ),
        
        ...mapState('xr/map',
            [
                'globeActive',
                'floorMapActive',
                'worldMapActive',
                'mapLatitude',
                'mapLongitude',
                'mapboxType',

                'floorRows',
                'floorZoom',
                'floorHighDPI',
                'floorScale',
                'floorMapHeightmap',
                'floorMapHeight',

                'worldRows',
                'worldZoom',
                'worldHighDPI',
                'worldScale',
                'worldMapHeightmap',
                'worldMapHeight',

            ]
        ),

        ...mapState('xr/carousel',
            [
                'floorActive',
                'floorRadius',
                'numberOfSegments'
            ]
        ),
    },

    methods: {
        toggleLayout() {
            if (CONFIG.DEBUG) {console.log("toggleLayout");}
            var newVal = this.sceneLayout == SceneLayoutEnum.GRID ? 'GALLERY' : 'GRID';
            this.$store.commit('xr/SET_LAYOUT', newVal);
        },
    }
}
</script>
