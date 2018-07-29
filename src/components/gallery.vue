<template>
  <a-entity class="gallery">
      <!-- Floor -->
      <a-entity id="floor" class="boundry"
                :geometry="'primitive: plane; width:' + hallWidth + '; height: ' + hallDepth + ''"
                :material="'src:#floor; repeat: ' + hallWidth + ' ' + -hallDepth"
                rotation="-90 0 0"
                :position="'0 0 ' + -hallWidth/2">
      </a-entity>
      
      <!-- Wall left -->
      <a-entity id="wall-left" class="boundry"
                :geometry="'primitive: plane; width:' + hallDepth + '; height: ' + wallHeight"
                material="color: #cee1ff; side: double; transparent: true; opacity: 0.4;" 
                rotation="0 90 0"
                :position="-hallWidth/2 + ' ' + wallHeight/2 +' ' + -hallDepth/2">
      </a-entity>
      
      <!-- Wall right" -->
      <a-entity id="wall-right" class="boundry"
                :geometry="'primitive: plane; width:' + hallDepth + '; height: ' + wallHeight"
                material="color: #cee1ff; side: double; transparent: true; opacity: 0.4;"
                rotation="180 90 0"
                :position="hallWidth/2 + ' ' + wallHeight/2 +' ' + -hallDepth/2">
      </a-entity>
      
      <!-- Wall front" -->
      <a-entity id="wall-front" class="boundry"
                :geometry="'primitive: plane; width:' + hallWidth + '; height: ' + wallHeight"
                material="color: #cee1ff; side: double; transparent: true; opacity: 0.4;"
                rotation="0 0 0"
                :position="'0 ' + wallHeight/2 +' ' + -hallDepth">
      </a-entity>
      
      <!-- Wall back" -->
      <a-entity id="wall-back" class="boundry"
                :geometry="'primitive: plane; width:' + hallWidth + '; height: ' + wallHeight"
                material="color: #cee1ff; side: double; transparent: true; opacity: 0.4;"
                rotation="0 0 0"
                :position="'0 ' + wallHeight/2 + ' 0'">
      </a-entity>

      <!-- Carousel -->
      <gallery-carousel :LSObjs='LSObjs' :roomConfig='roomConfig' :hallWidth='hallWidth' :hallDepth='hallDepth' />
      
      <!-- portals -->
        <a-entity class="portals"
                    layout="type: line; margin: 2"
                    rotation="0 0 0"
                    :position="-sortedRooms.length + ' 1 -1'">

                <carouselLink v-for="room of sortedRooms"
                        :key="room"
                        :room="room"
                        rotation="0 0 0">
                </carouselLink>

        </a-entity>

      <!-- Earth -->
      <a-sphere id="Earth" class="boundry"
                :position="'0 1.5 ' + -hallWidth/2" 
                radius=".99" 
                material="src:#earth; roughness: 1; transparent: true; opacity: 0.9;">

          <a-animation attribute="rotation"
                 easing="linear" 
                 dur="150000"
                 fill="forwards"
                 to="0 360 0"
                 repeat="indefinite"></a-animation>
      </a-sphere>

    <a-entity id="Logo" :position="'0 2.6 ' + -hallWidth/2" 
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
    <a-mapbox-terrain latitude="34.023552" longitude="-118.286189" position="0 0 -10" zoom-level="11"></a-mapbox-terrain>
    <!-- World -->
    <a-mapbox-terrain latitude="34.023552" longitude="-118.286189" position="0 -4 0" zoom-level="11" scale="45 5 45"></a-mapbox-terrain>

  </a-entity>
</template>

<script>
import galleryCarousel from "./carousel/gallery-carousel.vue";
import carouselLink from "./carousel/components/carousel-link.vue";

import Vue from 'vue';

if (CONFIG.DEBUG) {console.log("from gallery.vue <script>")}
export default {
    data () {
        return {
            name: "LifeScope",
            description: "The Internet of You",
            wallHeight: 1.1,
            hallWidth: 20,
            hallDepth: 20,
        }
    },
    components: {
        galleryCarousel,
        carouselLink
    },

    props: ['LSObjs', 'rooms', 'roomConfig'],
    
    computed: {
        sortedRooms() {
            var sorted = this.rooms;
            sorted.sort(function (a, b) {
                return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
            });
            return sorted;
        }
    },
    
    // Lifecycle hooks
    // https://vuejs.org/v2/api/#Options-Lifecycle-Hooks
    beforeCreate () {
        if (CONFIG.DEBUG) {console.log("beforeCreate");};
    },
    created () {
        //  data observation, computed properties, methods, watch/event callbacks
        if (CONFIG.DEBUG) {console.log("created");};
        //debugger;
    },
    beforeMount () {
        if (CONFIG.DEBUG) {console.log("beforeMount");};
    },
    mounted () {
        // el is replaced by the newly created vm.$el
        if (CONFIG.DEBUG) {console.log("mounted");};
        if (CONFIG.DEBUG) {console.log("gallery.vue :" + this.LSObjs);};

        this.$nextTick(function () {
            // Code that will run only after the
            // entire view has been rendered
            if (CONFIG.DEBUG) {console.log("mounted nextTick");};
        })
    },
    beforeUpdate () {
        if (CONFIG.DEBUG) {console.log("beforeUpdate");};
    },
    updated () {
        if (CONFIG.DEBUG) {console.log("updated");};
    },
    beforeDestroy () {
        if (CONFIG.DEBUG) {console.log("beforeDestroy");};
    },
    destroyed () {
        if (CONFIG.DEBUG) {console.log("destroyed");};
    }
}
</script>
