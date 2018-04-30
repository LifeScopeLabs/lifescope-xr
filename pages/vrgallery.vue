<template>
  <section class="bcontainer">
    <log-aframe-component/>
    <open-link-aframe-component/>
    <a-scene mylog="AFRAME component log: a-scene">

      <!-- Load assets -->
      <a-assets>
        <img id="floor" src="/floor.jpg">
        <img id="sky" src="/nightsky.jpg">
        <img id="earth" src="/earth/Albedo.jpg">
        <img id="clouds" src="/earth/Clouds.png">
        <img id="eye" src="/iris.jpg">
      </a-assets>

      <!-- Geojson -->
      <a-assets id="geo-assets">
        <a-asset-item id="geojson-simple" src="geodata/simple.geojson" />
      </a-assets>
 
      <!-- Load assets with imageLoader -->
      <!-- https://www.pexels.com/search/travel/ -->
      <imageLoader v-for="wimage in wallimages"
                   :key="wimage.id"
                   :image="wimage" />

      <!-- Camera -->
      <a-camera>
        <a-entity cursor="rayOrigin: mouse"></a-entity>
        <!-- Or <a-cursor></a-cursor> -->
      </a-camera>

      <!-- Create scene -->
      <!-- Floor -->
      <a-entity id="floor"
                geometry="primitive: plane; width: 8; height: 400"
                material="src:#floor; repeat: 4 200"
                rotation="-90 0 0"
                position="0 0 -4">
      </a-entity>
      


      <!-- Wall left -->
      <a-entity id="wall-left"
                geometry="primitive: plane; width: 400; height: 4"
                material="color: #fff4cc; repeat: 4 200"
                rotation="0 90 0"
                position="-4 2 4">
      </a-entity>
      
      <!-- Wall right -->
      <a-entity id="wall-right"
                geometry="primitive: plane; width: 400; height: 4"
                material="color: #fff4cc; repeat: 4 200"
                rotation="180 90 0"
                position="4 2 4">
      </a-entity>
      
      <!-- Wall back -->
      <a-entity id="wall-back"
                geometry="primitive: plane; width: 8; height: 4"
                material="color: #fff4cc; repeat: 4 200"
                rotation="0 180 0"
                position="0 2 8">
      </a-entity>



      <!-- put stuff on back wall -->
      <a-entity id="back-wall-stuff"
                position="0 1 7.9"
                rotation="180 0 180">
                <carouselContentObject 
                        :imageC="singleTestImage"
                        :textValueC="'Hello from Carousel!'"
                        :cursor-listener-openlink="singleTestImage.url">
                </carouselContentObject> 
      </a-entity>
      

      <!-- Carousel left -->
      <a-entity id="carousel-left"
                      layout="type: line; margin: 4"
                      rotation="0 90 0"
                      position="-3.8 1 0">
              <carouselContentObject v-for="wimage of wallimages.slice(0, wallimages.length/2)"
                        :key="wimage.id"
                        :imageC="wimage"
                        :textValueC="wimage.embed_thumbnail"
                        rotation="0 0 0"
                        :cursor-listener-openlink="wimage.url">
              </carouselContentObject>
      </a-entity>

      <!-- Carousel right -->
      <!-- TODO : flip text -->
      <a-entity id="carousel-right"
                layout="type: line; margin: 4"
                rotation="0 90 0"
                position="3.8 1 0">
              <carouselContentObject v-for="wimage of wallimages.slice(wallimages.length/2, wallimages.length)"
                        :key="wimage.id"
                        :imageC="wimage"
                        :textValueC="wimage.embed_thumbnail"
                        rotation="0 0 0"
                        :cursor-listener-openlink="wimage.url">
              </carouselContentObject>
      </a-entity>
      
      
      <!-- Globe -->
      <a-entity id="globe-container"
                position="0 2 -10">
                    
      </a-entity>
      <globe/>
      
      <!-- Earth -->
      <a-sphere id="Earth" position="0 1 -4" radius="1" material="src:#earth; metalness: ; roughness: 1;">
          <a-animation attribute="rotation"
                 easing="linear" 
                 dur="150000"
                 fill="forwards"
                 to="0 360 0"
                 repeat="indefinite"></a-animation>
      </a-sphere>
      
      <!-- Sky -->
      <a-sky id="Sky" src="#sky" rotation="90 0 90">
      </a-sky>
      
    </a-scene>
  </section>
</template>





<script>
import fetch from 'isomorphic-fetch'

import imageLoader from "../components/imageLoader.vue"
import carouselContentObject from "../components/carousel-content-object.vue"

import logAframeComponent from "../components/logAframeComponent.vue"
import openLinkAframeComponent from "../components/openLinkAframeComponent"

console.log("from index.vue <script>");

export default {

  data () {
    return {
      name: "Lifescope",
      description: "The Internet of You",
    }
  },
  asyncData () {
    return fetch("http://localhost:3000/test/content.json")
    .then(function(res) {
      //console.log(res)
      return res.json();
      })
    .then(function(loadedJson) {
      //console.log(loadedJson);
      //console.log(loadedJson[0])
      return { wallimages: loadedJson,
              singleTestImage: loadedJson[0] }
    });
  },

  components: {
    logAframeComponent,
    imageLoader,
    carouselContentObject,
    openLinkAframeComponent
  },
  

  // Lifecycle hooks
  // https://vuejs.org/v2/api/#Options-Lifecycle-Hooks
  beforeCreate () {
    console.log("beforeCreate")
  },
  created () {
    //  data observation, computed properties, methods, watch/event callbacks
    console.log("created")
  },
  beforeMount () {
    console.log("beforeMount")
  },
  mounted () {
    // el is replaced by the newly created vm.$el
    console.log("mounted")

    // Create Aframe components
    //this.createLogAFRAMEcomponent()
    //this.createOpenLinkOnClickListenerAframeComponent()

  
    this.$nextTick(function () {
      // Code that will run only after the
      // entire view has been rendered
      console.log("mounted nextTick")
    })
  },
  beforeUpdate () {
    console.log("beforeUpdate")
  },
  updated () {
    console.log("updated")
  },
  beforeDestroy () {
    console.log("beforeDestroy")
  },
  destroyed () {
    console.log("destroyed")
  }
}
</script>