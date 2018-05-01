<template>
  <section class="bcontainer">

    <log-aframe-component/>
    <open-link-aframe-component/>

    <a-scene mylog="AFRAME component mylog: a-scene">

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
      <imageLoader v-for="wimage in content"
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
      


      <!-- Carousel -->
      <carousel :content="content"/>
      
      <!-- Globe -->
      <globe position="0 1.6 -10" :latLongValues="llv"/>
      
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
                        :image="singleTestContent"
                        :textValue="'Hello from Carousel!'"
                        :cursor-listener-openlink="singleTestContent.url">
                </carouselContentObject> 
      </a-entity>
      
      
    </a-scene>
  </section>
</template>





<script>
import fetch from 'isomorphic-fetch'

import carousel from '../components/carousel.vue'

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
      llv: [[0,1], [300,-20], [0, -20], [-300, 5], [-450, 100], [-450, 100], [0,1]]
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
      return { content: loadedJson,
              singleTestContent: loadedJson[0] }
    });
  },

  components: {
    carousel,
    logAframeComponent,
    imageLoader,
    carouselContentObject,
    openLinkAframeComponent
  },
  
  methods: {
      contentToGeoPoints: function(content) {
        console.log("contentToGeoPoints")
        // returns an array of points (lat/long pairs)
        // extracted from content objects
        var points = [];

        for (var c of content) {
          points.push(c.homepoint)
        }

        return points
      }
  },

  // Lifecycle hooks
  // https://vuejs.org/v2/api/#Options-Lifecycle-Hooks
  beforeCreate () {
    console.log("beforeCreate")
  },
  created () {
    //  data observation, computed properties, methods, watch/event callbacks
    console.log("created")
    this.llv = this.contentToGeoPoints(this.content)
  },
  beforeMount () {
    console.log("beforeMount")
  },
  mounted () {
    // el is replaced by the newly created vm.$el
    console.log("mounted")

  
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